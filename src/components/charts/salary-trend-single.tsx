"use client";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import type { SnapshotHistoryWeek } from "@/lib/api";

interface SalaryTrendSingleProps {
  weeks: SnapshotHistoryWeek[];
  height?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const salary = payload[0]?.value;
  return (
    <div className="bg-white border border-b1 rounded-xl px-4 py-3 shadow-card-md">
      <p className="text-t2 text-xs mb-1">{label}</p>
      {salary != null && <p className="text-accent font-semibold text-sm">£{salary.toLocaleString()} median</p>}
    </div>
  );
};

/** One series — median salary only, solid line, zero-based-not-required axis (it's a price series, not a count). */
export function SalaryTrendSingle({ weeks, height = 220 }: SalaryTrendSingleProps) {
  const data = weeks.map((w) => ({ label: w.week_start.slice(5), salary_p50: w.salary_p50 }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ left: 0, right: 8, top: 4, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E4E4F0" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fill: "#94A3B8", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={48}
          tickFormatter={(v) => `£${Math.round(v / 1000)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="salary_p50"
          stroke="#4F46E5"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: "#4F46E5", strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
