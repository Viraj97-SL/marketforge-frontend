"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";

interface SkillBarProps {
  data: { skill: string; count: number }[];
  height?: number;
}

const COLORS = [
  "#00C6A7", "#3B82F6", "#8B5CF6", "#F472B6", "#FB923C",
  "#34D399", "#60A5FA", "#A78BFA", "#F9A8D4", "#FCD34D",
];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-s3 border border-b2 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-t1 font-semibold text-sm">{payload[0].payload.skill}</p>
      <p className="text-accent text-xs mt-0.5">{payload[0].value.toLocaleString()} postings</p>
    </div>
  );
};

export function SkillBar({ data, height = 360 }: SkillBarProps) {
  const sorted = [...data].sort((a, b) => b.count - a.count).slice(0, 15);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={sorted} layout="vertical" margin={{ left: 0, right: 20, top: 4, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1C2A3A" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fill: "#64748B", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="skill"
          width={110}
          tick={{ fill: "#64748B", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
        <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={20}>
          {sorted.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
