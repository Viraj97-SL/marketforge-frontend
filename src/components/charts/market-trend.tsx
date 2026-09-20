"use client";
import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { SnapshotHistoryWeek } from "@/lib/api";

interface MarketTrendProps {
  weeks: SnapshotHistoryWeek[];
  height?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const jobCount = payload.find((p: any) => p.dataKey === "job_count")?.value;
  const salary   = payload.find((p: any) => p.dataKey === "salary_p50")?.value;
  return (
    <div className="bg-white border border-b1 rounded-xl px-4 py-3 shadow-card-md">
      <p className="text-t2 text-xs mb-1">{label}</p>
      {jobCount != null && <p className="text-t1 font-semibold text-sm">{jobCount.toLocaleString()} postings</p>}
      {salary != null && <p className="text-accent text-xs mt-0.5 font-medium">£{salary.toLocaleString()} median</p>}
    </div>
  );
};

/** Real historical time series from market.weekly_snapshots — not a snapshot-in-time chart. */
export function MarketTrend({ weeks, height = 220 }: MarketTrendProps) {
  const data = weeks.map((w) => ({
    label: w.week_start.slice(5),
    job_count: w.job_count,
    salary_p50: w.salary_p50,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ left: 0, right: 8, top: 4, bottom: 4 }}>
        <defs>
          <linearGradient id="marketTrendJobs" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#4F46E5" stopOpacity={0.22} />
            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E4E4F0" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis yAxisId="jobs"   tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} width={36} />
        <YAxis yAxisId="salary" orientation="right" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} width={48}
               tickFormatter={(v) => `£${Math.round(v / 1000)}k`} />
        <Tooltip content={<CustomTooltip />} />
        <Area yAxisId="jobs" type="monotone" dataKey="job_count" stroke="#4F46E5" strokeWidth={2}
              fill="url(#marketTrendJobs)" dot={false} activeDot={{ r: 4, fill: "#4F46E5", strokeWidth: 0 }} />
        <Line yAxisId="salary" type="monotone" dataKey="salary_p50" stroke="#7C3AED" strokeWidth={2}
              dot={false} activeDot={{ r: 4, fill: "#7C3AED", strokeWidth: 0 }} strokeDasharray="4 3" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
