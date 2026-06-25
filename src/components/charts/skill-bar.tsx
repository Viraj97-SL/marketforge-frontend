"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";

interface SkillBarProps {
  data: { skill: string; count: number }[];
  height?: number;
}

// Indigo-to-blue gradient family — professional, single-hue
const COLORS = [
  "#4F46E5", "#5551E7", "#5B5CE9", "#6166EB", "#6771ED",
  "#6D7BEF", "#4338CA", "#3B32BC", "#342BAE", "#2D24A0",
  "#6366F1", "#818CF8", "#A5B4FC", "#C7D2FE", "#E0E7FF",
];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-b1 rounded-xl px-4 py-3 shadow-card-md">
      <p className="text-t1 font-semibold text-sm">{payload[0].payload.skill}</p>
      <p className="text-accent text-xs mt-0.5 font-medium">{payload[0].value.toLocaleString()} postings</p>
    </div>
  );
};

export function SkillBar({ data, height = 360 }: SkillBarProps) {
  const sorted = [...data].sort((a, b) => b.count - a.count).slice(0, 15);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={sorted} layout="vertical" margin={{ left: 0, right: 20, top: 4, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
        <XAxis
          type="number"
          tick={{ fill: "#94A3B8", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="skill"
          width={110}
          tick={{ fill: "#475569", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(79,70,229,0.04)" }} />
        <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={18}>
          {sorted.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={1 - i * 0.03} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
