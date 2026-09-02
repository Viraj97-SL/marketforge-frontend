"use client";
import { motion } from "framer-motion";

interface RankedBarItem {
  label: string;
  value: number;
}

interface RankedBarListProps {
  items: RankedBarItem[];
  unit?: string;
}

/**
 * Flat ranked bars for the editorial story panel — the "grey-out" technique:
 * the #1 item carries the full amber accent, everything else recedes to a
 * dim grey track so the reader's eye lands on the story's actual point.
 */
export function RankedBarList({ items, unit = "" }: RankedBarListProps) {
  const max = items[0]?.value || 1;
  return (
    <div className="w-full max-w-md space-y-3">
      {items.slice(0, 8).map((item, i) => {
        const pct = Math.max(6, Math.round((item.value / max) * 100));
        const isTop = i === 0;
        return (
          <div key={item.label}>
            <div className="flex items-baseline justify-between mb-1.5">
              <span
                className="text-xs font-medium"
                style={{ color: isTop ? "var(--story-text)" : "var(--story-text-dim)" }}
              >
                {item.label}
              </span>
              <span
                className="text-xs font-mono"
                style={{ color: isTop ? "var(--story-accent)" : "var(--story-text-mute)" }}
              >
                {item.value.toLocaleString()}{unit}
              </span>
            </div>
            <div className="h-[3px] w-full" style={{ background: "var(--story-line)" }}>
              <motion.div
                className="h-full"
                style={{ background: isTop ? "var(--story-accent)" : "var(--story-text-mute)" }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
