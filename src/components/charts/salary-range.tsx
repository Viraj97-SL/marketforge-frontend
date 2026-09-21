import { fmtK } from "@/lib/utils";

interface SalaryRangeProps {
  p25: number | null;
  p50: number | null;
  p75: number | null;
}

/** Horizontal quartile track — a compact summary; the histogram beneath it carries the detail. */
export function SalaryRange({ p25, p50, p75 }: SalaryRangeProps) {
  if (!p25 && !p50 && !p75) {
    return (
      <div className="flex items-center justify-center h-32 text-t2 text-sm">
        No salary data yet
      </div>
    );
  }

  return (
    <div className="px-2">
      <div className="flex items-center justify-between text-xs text-t2 mb-2">
        <span className="font-medium">{fmtK(p25)}</span>
        <span className="text-accent font-bold text-sm">{fmtK(p50)}</span>
        <span className="font-medium">{fmtK(p75)}</span>
      </div>
      <div className="relative h-3 rounded-full bg-s2 overflow-hidden">
        {p25 != null && p75 != null && (
          <div
            className="absolute top-0 h-full rounded-full"
            style={{
              left:       `${((p25 - 20000) / 120000) * 100}%`,
              right:      `${100 - ((p75 - 20000) / 120000) * 100}%`,
              background: "linear-gradient(90deg, #93C5FD, #4F46E5, #7C3AED)",
            }}
          />
        )}
        {p50 != null && (
          <div
            className="absolute top-0 w-0.5 h-full bg-white shadow-sm"
            style={{ left: `${((p50 - 20000) / 120000) * 100}%` }}
          />
        )}
      </div>
      <div className="flex items-center justify-between text-xs text-t3 mt-1.5">
        <span>Lower quartile</span>
        <span>Median</span>
        <span>Upper quartile</span>
      </div>
    </div>
  );
}
