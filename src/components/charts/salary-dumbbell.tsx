import { fmtK } from "@/lib/utils";

interface DumbbellRow {
  key: string;
  label: string;
  p25: number;
  p50: number;
  p75: number;
}

interface SalaryDumbbellProps {
  rows: DumbbellRow[];
}

const T1 = "#16162B";
const B1 = "#E4E4F0";

/**
 * Dumbbell chart, one per role, on a shared x-axis so roles are directly
 * comparable — replaces the old gradient-fill bars where the legend's
 * three colour dots mapped to nothing visible.
 */
export function SalaryDumbbell({ rows }: SalaryDumbbellProps) {
  if (rows.length === 0) return null;

  const min = Math.min(...rows.map((r) => r.p25));
  const max = Math.max(...rows.map((r) => r.p75));
  const pad = (max - min) * 0.08 || 5000;
  const domainMin = Math.max(0, min - pad);
  const domainMax = max + pad;
  const range = domainMax - domainMin || 1;
  const xPct = (v: number) => ((v - domainMin) / range) * 100;

  return (
    <div>
      <div className="space-y-4">
        {rows.map((r) => (
          <div key={r.key}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-t1 font-medium">{r.label}</span>
              <span className="text-[10px] text-t3 font-mono">{fmtK(r.p25)} – {fmtK(r.p75)}</span>
            </div>
            <div className="relative h-4">
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-0.5" style={{ background: B1 }} />
              <div
                className="absolute top-1/2 -translate-y-1/2 h-1.5 rounded-full"
                style={{
                  left: `${xPct(r.p25)}%`,
                  width: `${Math.max(0, xPct(r.p75) - xPct(r.p25))}%`,
                  background: "var(--accent)",
                  opacity: 0.25,
                }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                style={{ left: `${xPct(r.p25)}%`, transform: "translate(-50%,-50%)", background: "var(--accent)" }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                style={{ left: `${xPct(r.p75)}%`, transform: "translate(-50%,-50%)", background: "var(--accent)" }}
              />
              <div
                className="absolute top-1/2 w-[3px] h-4"
                style={{ left: `${xPct(r.p50)}%`, transform: "translate(-50%,-50%)", background: T1 }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Shared axis */}
      <div className="flex justify-between text-[10px] text-t3 mt-3 pt-2 border-t border-b1">
        <span>{fmtK(domainMin)}</span>
        <span>{fmtK(domainMax)}</span>
      </div>

      {/* Legend — shape, not colour */}
      <div className="flex items-center gap-5 mt-4 pt-4 border-t border-b1">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "var(--accent)" }} />
          <span className="text-[10px] text-t2">P25</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-[3px] h-3 shrink-0" style={{ background: T1 }} />
          <span className="text-[10px] text-t2">Median</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "var(--accent)" }} />
          <span className="text-[10px] text-t2">P75</span>
        </div>
      </div>
    </div>
  );
}
