"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface MixItem {
  type: string;
  pct: number;
  job_count: number;
}

const GREYS = ["var(--story-text-mute)", "#3A3A3D", "#4A4A4D", "#2A2A2D"];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background: "var(--story-bg-alt)", border: "1px solid var(--story-line)", padding: "8px 12px" }}>
      <p className="text-xs" style={{ color: "var(--story-text)" }}>{d.type}</p>
      <p className="text-xs" style={{ color: "var(--story-accent)" }}>{d.pct}% · {d.job_count} postings</p>
    </div>
  );
};

/**
 * Donut chart: who's actually hiring at entry level, by company type.
 * A different chart family entirely from the pictogram / slope / heatmap
 * that precede it.
 */
export function EntryHiringVisual({ mix, sampleSize }: { mix: MixItem[]; sampleSize: number }) {
  if (!sampleSize) {
    return <p className="text-sm" style={{ color: "var(--story-text-dim)" }}>No entry-level postings yet.</p>;
  }
  const sorted = [...mix].sort((a, b) => b.pct - a.pct).filter((m) => m.job_count > 0);
  const top = sorted[0];

  return (
    <div className="w-full max-w-md flex items-center gap-6">
      <div style={{ width: 160, height: 160 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={sorted}
              dataKey="pct"
              nameKey="type"
              innerRadius={48}
              outerRadius={78}
              paddingAngle={2}
              stroke="var(--story-bg)"
              strokeWidth={2}
            >
              {sorted.map((entry, i) => (
                <Cell key={entry.type} fill={i === 0 ? "var(--story-accent)" : GREYS[i % GREYS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div>
        {top && (
          <p className="text-2xl font-semibold mb-3" style={{ color: "var(--story-accent)" }}>
            {top.pct}% <span className="text-sm font-normal" style={{ color: "var(--story-text-dim)" }}>{top.type}</span>
          </p>
        )}
        <div className="space-y-1.5">
          {sorted.map((m, i) => (
            <div key={m.type} className="flex items-center gap-2 text-[11px]" style={{ color: "var(--story-text-dim)" }}>
              <span className="w-2 h-2 inline-block" style={{ background: i === 0 ? "var(--story-accent)" : GREYS[i % GREYS.length] }} />
              {m.type} · {m.pct}%
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
