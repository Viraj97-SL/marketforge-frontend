"use client";
import { useMemo, useState } from "react";

interface SkillCount { skill: string; count: number; }

interface SkillMatrixProps {
  skills: SkillCount[];
  matrix: number[][];
  leafOrder: number[];
  className?: string;
}

// Validated sequential ramp — indigo, monotonic light to dark. Do not
// substitute; checked for contrast against both label colours below.
const RAMP = ["#F4F3FE", "#E2DEFC", "#C9C2F8", "#ABA1F2", "#8B7FEA", "#6C5EE0", "#4F46E5", "#3A2FB5"] as const;
const LABEL_DARK = "#16162B";   // steps 1-5 (bin 0-4)
const LABEL_LIGHT = "#FFFFFF";  // steps 6-8 (bin 5-7)
const DIAGONAL_FILL = "#E4E4F0"; // var(--b1) — neutral, never the darkest value
const T2 = "#4B5167";
const T3 = "#8E93AB";

const CELL = 24; // px, square cells
const GAP = 2;
const LABEL_COL = 128; // px, sticky row-label column
const HEADER_ROW = 96; // px, rotated column-label header height

function binIndex(value: number, maxValue: number): number {
  if (value <= 0 || maxValue <= 0) return 0;
  const t = Math.sqrt(value) / Math.sqrt(maxValue);
  return Math.min(7, Math.floor(t * 8));
}

function fmt(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : n.toLocaleString();
}

export function SkillMatrix({ skills, matrix, leafOrder, className = "" }: SkillMatrixProps) {
  const [hover, setHover] = useState<{ row: number; col: number } | null>(null);
  const [showTable, setShowTable] = useState(false);

  const order = leafOrder.length === skills.length ? leafOrder : skills.map((_, i) => i);
  const ordered = order.map((i) => skills[i]);

  const { maxOffDiag, topPairs } = useMemo(() => {
    let max = 1;
    const flat: { i: number; j: number; v: number }[] = [];
    for (let a = 0; a < order.length; a++) {
      for (let b = a + 1; b < order.length; b++) {
        const v = matrix[order[a]]?.[order[b]] ?? 0;
        if (v > max) max = v;
        flat.push({ i: a, j: b, v });
      }
    }
    const top = flat.filter((p) => p.v > 0).sort((a, b) => b.v - a.v).slice(0, 5);
    return { maxOffDiag: max, topPairs: top };
  }, [matrix, order]);

  const topPairKeys = new Set<string>();
  topPairs.forEach((p) => { topPairKeys.add(`${p.i}-${p.j}`); topPairKeys.add(`${p.j}-${p.i}`); });

  if (skills.length === 0) {
    return <p className="text-xs text-t3 py-10 text-center">Not enough live co-occurrence data yet</p>;
  }

  const n = ordered.length;
  const gridWidth = LABEL_COL + n * (CELL + GAP);

  return (
    <div className={className}>
      {/* Scale legend — above the grid, left-aligned */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="text-[10px] text-t3 mr-1">{fmt(0)}</span>
        {RAMP.map((c, i) => (
          <span key={i} className="w-5 h-3 rounded-sm" style={{ background: c }} />
        ))}
        <span className="text-[10px] text-t3 ml-1">{fmt(maxOffDiag)} co-listings</span>
      </div>

      <div className="overflow-x-auto pb-2">
        <div style={{ width: gridWidth, paddingTop: HEADER_ROW }} className="relative">
          {/* Rotated column labels */}
          <div className="absolute top-0 flex" style={{ left: LABEL_COL, height: HEADER_ROW }}>
            {ordered.map((s, c) => (
              <div
                key={s.skill}
                style={{ width: CELL, marginRight: GAP }}
                className="relative"
              >
                <span
                  className="absolute bottom-0 left-1/2 whitespace-nowrap origin-bottom-left"
                  style={{ fontSize: 11, color: T2, transform: "rotate(-45deg)" }}
                >
                  {s.skill}
                </span>
              </div>
            ))}
          </div>

          {/* Rows */}
          {ordered.map((rowSkill, r) => {
            const rowIdxOrig = order[r];
            return (
              <div key={rowSkill.skill} className="flex" style={{ marginBottom: GAP }}>
                <div
                  className="sticky left-0 bg-s1 flex items-center pr-2 shrink-0 truncate"
                  style={{ width: LABEL_COL, height: CELL, fontSize: 11, color: T2 }}
                  title={rowSkill.skill}
                >
                  {rowSkill.skill}
                </div>
                {ordered.map((colSkill, c) => {
                  const colIdxOrig = order[c];
                  const isDiag = r === c;
                  const value = isDiag ? rowSkill.count : (matrix[rowIdxOrig]?.[colIdxOrig] ?? 0);
                  const bin = isDiag ? -1 : binIndex(value, maxOffDiag);
                  const fill = isDiag ? DIAGONAL_FILL : RAMP[bin];
                  const isTopPair = !isDiag && topPairKeys.has(`${r}-${c}`);
                  const isHoveredCell = hover && (hover.row === r || hover.col === c);
                  const textColor = bin >= 5 ? LABEL_LIGHT : LABEL_DARK;
                  return (
                    <div
                      key={colSkill.skill}
                      role="gridcell"
                      onMouseEnter={() => setHover({ row: r, col: c })}
                      onMouseLeave={() => setHover(null)}
                      className="relative flex items-center justify-center shrink-0 transition-opacity"
                      style={{
                        width: CELL, height: CELL, marginRight: GAP, background: fill,
                        opacity: hover && !isHoveredCell ? 0.35 : 1,
                        outline: hover && hover.row === r && hover.col === c ? `1.5px solid ${T2}` : undefined,
                      }}
                    >
                      {isTopPair && (
                        <span style={{ fontSize: 8, fontWeight: 700, color: isDiag ? LABEL_DARK : textColor }}>
                          {fmt(value)}
                        </span>
                      )}
                      {hover && hover.row === r && hover.col === c && (
                        <div
                          className="absolute z-20 px-2 py-1 rounded-lg bg-t1 text-white text-[10px] whitespace-nowrap shadow-card-md pointer-events-none"
                          style={{ bottom: CELL + 6, left: "50%", transform: "translateX(-50%)" }}
                        >
                          {isDiag
                            ? `${rowSkill.skill} / ${value.toLocaleString()} postings`
                            : `${rowSkill.skill} + ${colSkill.skill} / ${value.toLocaleString()} postings co-listed`}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* View as table */}
      <details className="mt-4" open={showTable} onToggle={(e) => setShowTable((e.target as HTMLDetailsElement).open)}>
        <summary className="text-xs font-semibold text-accent cursor-pointer select-none">View as table</summary>
        <div className="overflow-x-auto mt-3">
          <table className="text-[10px] border-collapse">
            <thead>
              <tr>
                <th className="p-1 text-left" style={{ color: T3 }}></th>
                {ordered.map((s) => (
                  <th key={s.skill} className="p-1 text-left font-semibold whitespace-nowrap" style={{ color: T2 }}>{s.skill}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ordered.map((rowSkill, r) => {
                const rowIdxOrig = order[r];
                return (
                  <tr key={rowSkill.skill}>
                    <th scope="row" className="p-1 text-left font-semibold whitespace-nowrap" style={{ color: T2 }}>{rowSkill.skill}</th>
                    {ordered.map((colSkill, c) => {
                      const colIdxOrig = order[c];
                      const value = r === c ? rowSkill.count : (matrix[rowIdxOrig]?.[colIdxOrig] ?? 0);
                      return (
                        <td key={colSkill.skill} className="p-1 text-right font-mono border-b border-b1" style={{ color: T2 }}>
                          {value.toLocaleString()}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
