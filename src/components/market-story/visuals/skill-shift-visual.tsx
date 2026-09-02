"use client";
import { motion } from "framer-motion";

interface SkillShift {
  skill: string;
  overall_rank: number;
  junior_rank: number;
  rank_delta: number;
}

/**
 * Slope / dumbbell chart: connects each skill's overall market rank to its
 * rank among entry-level-only postings. A line sloping toward the right
 * (amber) means the skill punches above its overall weight at entry level.
 * Deliberately not a bar chart.
 */
export function SkillShiftVisual({ shifts }: { shifts: SkillShift[] }) {
  if (!shifts.length) {
    return <p className="text-sm" style={{ color: "var(--story-text-dim)" }}>Not enough entry-level postings yet.</p>;
  }

  const top = shifts.slice(0, 6);
  const allRanks = top.flatMap((s) => [s.overall_rank, s.junior_rank]);
  const maxRank = Math.max(...allRanks, 1);
  const minRank = Math.min(...allRanks, 1);
  const H = 260;
  const rowH = H / top.length;
  const colLeft = 60;
  const colRight = 240;

  const y = (rank: number) => {
    const t = (rank - minRank) / Math.max(maxRank - minRank, 1);
    return 10 + t * (H - 20);
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex justify-between text-[10px] uppercase tracking-wider mb-2" style={{ color: "var(--story-text-mute)" }}>
        <span style={{ marginLeft: colLeft - 20 }}>Overall rank</span>
        <span style={{ marginRight: 300 - colRight - 20 }}>Entry-level rank</span>
      </div>
      <svg viewBox={`0 0 300 ${H}`} width="100%" height={H}>
        {top.map((s, i) => {
          const y1 = y(s.overall_rank);
          const y2 = y(s.junior_rank);
          const up = s.rank_delta > 0;
          const color = up ? "var(--story-accent)" : "var(--story-text-mute)";
          return (
            <g key={s.skill}>
              <motion.line
                x1={colLeft} y1={y1} x2={colRight} y2={y2}
                stroke={color} strokeWidth={1.5}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              />
              <circle cx={colLeft} cy={y1} r={3} fill={color} />
              <circle cx={colRight} cy={y2} r={3} fill={color} />
              <text x={colRight + 10} y={y2 + 3} fontSize="10" fill="var(--story-text)">
                {s.skill}
              </text>
              <text x={colLeft - 10} y={y1 + 3} fontSize="9" textAnchor="end" fill="var(--story-text-mute)">
                #{s.overall_rank}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
