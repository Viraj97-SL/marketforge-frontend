"use client";
import { motion } from "framer-motion";

interface SalaryGapPoint {
  label: string;
  value: number;
  isOurs: boolean;
}

interface SalaryGapVisualProps {
  juniorP25: number | null;
  asheMedian: number | null;
  asheSocTitle: string | null;
}

// Hand-cited, not live-fetched — see market-story.tsx / plan for why.
const PROSPECTS_MEDIAN = 30000;
const ISE_MEDIAN = 36335;

/**
 * Single-axis gap/dot-plot: every figure plotted on one shared number line
 * instead of parallel bars, with the distance between "what we actually
 * pay at entry level" and "what's expected" called out explicitly.
 */
export function SalaryGapVisual({ juniorP25, asheMedian, asheSocTitle }: SalaryGapVisualProps) {
  const points: SalaryGapPoint[] = [
    ...(juniorP25 ? [{ label: "Our entry-level P25 (actual)", value: juniorP25, isOurs: true }] : []),
    { label: "Prospects median (surveyed)", value: PROSPECTS_MEDIAN, isOurs: false },
    { label: "ISE survey median (surveyed)", value: ISE_MEDIAN, isOurs: false },
    ...(asheMedian ? [{ label: `ONS ASHE — ${asheSocTitle ?? "occupation"} median`, value: asheMedian, isOurs: false }] : []),
  ].sort((a, b) => a.value - b.value);

  if (points.length < 2) {
    return <p className="text-sm" style={{ color: "var(--story-text-dim)" }}>Not enough salary data yet.</p>;
  }

  const min = points[0].value;
  const max = points[points.length - 1].value;
  const W = 320;
  const pad = 20;
  const x = (v: number) => pad + ((v - min) / Math.max(max - min, 1)) * (W - pad * 2);
  const gap = max - min;

  return (
    <div className="w-full max-w-md">
      <svg viewBox={`0 0 ${W} 140`} width="100%" height={140}>
        <line x1={pad} y1={70} x2={W - pad} y2={70} stroke="var(--story-line)" strokeWidth={1} />
        {points.map((p, i) => {
          const cx = x(p.value);
          const above = i % 2 === 0;
          return (
            <g key={p.label}>
              <motion.circle
                cx={cx} cy={70} r={5}
                fill={p.isOurs ? "var(--story-accent)" : "var(--story-text-mute)"}
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              />
              <text
                x={cx} y={above ? 50 : 100}
                textAnchor="middle" fontSize="9"
                fill={p.isOurs ? "var(--story-accent)" : "var(--story-text-dim)"}
              >
                £{p.value.toLocaleString()}
              </text>
              <text
                x={cx} y={above ? 38 : 112}
                textAnchor="middle" fontSize="7.5"
                fill="var(--story-text-mute)"
              >
                {p.label.length > 22 ? p.label.slice(0, 22) + "…" : p.label}
              </text>
            </g>
          );
        })}
      </svg>
      {juniorP25 && gap > 0 && (
        <p className="text-xs mt-2" style={{ color: "var(--story-text-dim)" }}>
          Gap between the actual entry point and the highest cited expectation:{" "}
          <strong style={{ color: "var(--story-accent)" }}>£{gap.toLocaleString()}</strong>
        </p>
      )}
    </div>
  );
}
