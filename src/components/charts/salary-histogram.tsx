"use client";
import { useState } from "react";
import { fmtK } from "@/lib/utils";
import type { SalaryHistogramBin } from "@/lib/api";

interface SalaryHistogramProps {
  bins: SalaryHistogramBin[];
  p25: number | null;
  p50: number | null;
  p75: number | null;
  n: number;
  height?: number;
}

const T2 = "#4B5167";
const REF_LINES: { key: "p25" | "p50" | "p75"; label: string }[] = [
  { key: "p25", label: "P25" },
  { key: "p50", label: "Median" },
  { key: "p75", label: "P75" },
];

function binLabel(bin: SalaryHistogramBin): string {
  return bin.max == null ? `${fmtK(bin.min)}+` : `${fmtK(bin.min)} to ${fmtK(bin.max)}`;
}

/**
 * True zero-baseline histogram of the underlying stated-salary
 * distribution — one bar colour (count is encoded by length, not hue),
 * with hairline reference lines for P25/median/P75.
 */
export function SalaryHistogram({ bins, p25, p50, p75, n, height = 220 }: SalaryHistogramProps) {
  const [hover, setHover] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);

  if (bins.length === 0 || n === 0) {
    return (
      <div className="flex items-center justify-center text-t2 text-sm border-t border-b1 py-6" style={{ height }}>
        No salary distribution available right now.
      </div>
    );
  }

  const maxCount = Math.max(...bins.map((b) => b.count), 1);
  const domainMin = bins[0].min;
  const domainMax = bins[bins.length - 1].max ?? bins[bins.length - 1].min + 2500;
  const range = domainMax - domainMin || 1;
  const xPct = (v: number) => ((v - domainMin) / range) * 100;

  return (
    <div>
      <div className="relative" style={{ height }}>
        {/* Reference lines */}
        {REF_LINES.map(({ key, label }) => {
          const v = key === "p25" ? p25 : key === "p50" ? p50 : p75;
          if (v == null) return null;
          const isMedian = key === "p50";
          return (
            <div key={key} className="absolute top-0 bottom-6 pointer-events-none" style={{ left: `${xPct(v)}%` }}>
              <div className="w-px h-full" style={{ background: isMedian ? "var(--accent)" : T2 }} />
              <span
                className="absolute -top-0.5 left-1 whitespace-nowrap text-[10px] font-semibold"
                style={{ color: isMedian ? "var(--accent)" : T2 }}
              >
                {label} {fmtK(v)}
              </span>
            </div>
          );
        })}

        {/* Bars, true zero baseline */}
        <div className="absolute inset-x-0 bottom-6 top-6 flex items-end" style={{ gap: 2 }}>
          {bins.map((bin, i) => (
            <div
              key={i}
              className="relative flex-1 min-w-[1px]"
              style={{ height: "100%" }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              <div
                className="absolute bottom-0 left-0 right-0 rounded-t"
                style={{
                  height: `${Math.max(1, (bin.count / maxCount) * 100)}%`,
                  background: "var(--accent)",
                  opacity: 0.85,
                }}
              />
              {hover === i && (
                <div
                  className="absolute z-20 bottom-full mb-1.5 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-t1 text-white text-[10px] whitespace-nowrap shadow-card-md pointer-events-none"
                  style={{ background: "#16162B" }}
                >
                  {binLabel(bin)} · {bin.count.toLocaleString()} posting{bin.count === 1 ? "" : "s"}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Axis labels */}
        <div className="absolute inset-x-0 bottom-0 h-5 flex justify-between text-[10px]" style={{ color: T2 }}>
          <span>{fmtK(domainMin)}</span>
          <span>{fmtK(domainMax)}+</span>
        </div>
      </div>

      <p className="text-[11px] text-t3 mt-2">n={n.toLocaleString()} postings with stated compensation · 2.5k bins</p>

      <details className="mt-3" open={showTable} onToggle={(e) => setShowTable((e.target as HTMLDetailsElement).open)}>
        <summary className="text-xs font-semibold text-accent cursor-pointer select-none">View as table</summary>
        <div className="overflow-x-auto mt-3 max-h-64 overflow-y-auto">
          <table className="text-[11px] w-full border-collapse">
            <thead>
              <tr className="text-left">
                <th className="py-1 pr-4" style={{ color: T2 }}>Range</th>
                <th className="py-1" style={{ color: T2 }}>Postings</th>
              </tr>
            </thead>
            <tbody>
              {bins.map((bin, i) => (
                <tr key={i} className="border-t border-b1">
                  <td className="py-1 pr-4" style={{ color: T2 }}>{binLabel(bin)}</td>
                  <td className="py-1 font-mono" style={{ color: T2 }}>{bin.count.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
