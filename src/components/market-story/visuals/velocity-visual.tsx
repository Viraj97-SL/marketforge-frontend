"use client";
import { TrendLine } from "@/components/charts/trend-line";
import type { HiringVelocityItem } from "@/lib/api";

interface VelocityVisualProps {
  vacancyTrendPoints: { label: string; value: number }[];
  isLiveVelocity: boolean;
  velocityItems: HiringVelocityItem[];
}

export function VelocityVisual({ vacancyTrendPoints, isLiveVelocity, velocityItems }: VelocityVisualProps) {
  if (isLiveVelocity) {
    return (
      <div className="w-full max-w-md space-y-2">
        {velocityItems.slice(0, 6).map((row) => (
          <div key={row.role} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid var(--story-line)" }}>
            <span className="text-xs" style={{ color: "var(--story-text-dim)" }}>{row.role}</span>
            <span
              className="text-sm font-mono font-semibold"
              style={{ color: row.direction === "down" ? "var(--story-text-mute)" : "var(--story-accent)" }}
            >
              {row.growth_pct > 0 ? "+" : ""}{row.growth_pct}%
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (!vacancyTrendPoints.length) {
    return <p className="text-sm" style={{ color: "var(--story-text-dim)" }}>No vacancy trend data yet.</p>;
  }

  return (
    <div className="w-full max-w-md">
      <TrendLine data={vacancyTrendPoints} color="#E8A33D" height={220} gradient />
    </div>
  );
}
