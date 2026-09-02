"use client";
import { motion } from "framer-motion";
import { User } from "lucide-react";

interface PictogramVisualProps {
  qualifiersCount: number | null;
  academicYear: string | null;
  highlightPct: number | null;
  highlightLabel: string;
}

/**
 * Isotype / pictogram: N icons out of 100 lit amber to represent a
 * percentage — the "human stakes" visual for the graduate pipeline act.
 * Deliberately not a bar or line chart.
 */
export function PictogramVisual({ qualifiersCount, academicYear, highlightPct, highlightLabel }: PictogramVisualProps) {
  if (qualifiersCount === null && highlightPct === null) {
    return <p className="text-sm" style={{ color: "var(--story-text-dim)" }}>No graduate outcomes data yet.</p>;
  }

  const litCount = highlightPct !== null ? Math.round(highlightPct) : 0;
  const cells = Array.from({ length: 100 }, (_, i) => i < litCount);

  return (
    <div className="w-full max-w-md">
      {qualifiersCount !== null && (
        <div className="mb-6">
          <p className="text-4xl font-semibold" style={{ color: "var(--story-text)" }}>
            {qualifiersCount.toLocaleString()}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--story-text-dim)" }}>
            Computing-subject qualifiers, England, academic year {academicYear}
          </p>
        </div>
      )}

      {highlightPct !== null && (
        <>
          <div className="grid grid-cols-10 gap-1.5">
            {cells.map((lit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.006, 0.6) }}
              >
                <User
                  className="w-full h-auto"
                  strokeWidth={1.5}
                  style={{ color: lit ? "var(--story-accent)" : "var(--story-line)" }}
                />
              </motion.div>
            ))}
          </div>
          <p className="text-xs mt-4 max-w-xs" style={{ color: "var(--story-text-dim)" }}>
            <strong style={{ color: "var(--story-accent)" }}>{litCount} in every 100</strong> {highlightLabel}
          </p>
        </>
      )}
    </div>
  );
}
