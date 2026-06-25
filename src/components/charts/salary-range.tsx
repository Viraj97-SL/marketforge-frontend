"use client";
import {
  ComposedChart, Bar, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { fmtK } from "@/lib/utils";

interface SalaryRangeProps {
  p25: number | null;
  p50: number | null;
  p75: number | null;
  height?: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="bg-white border border-b1 rounded-xl px-4 py-3 shadow-card-md">
      <p className="text-t1 font-semibold text-sm">{d?.label}</p>
      <p className="text-accent text-xs mt-0.5 font-medium">{fmtK(d?.value)}</p>
    </div>
  );
};

const BAR_COLORS = ["#93C5FD", "#4F46E5", "#7C3AED"];

export function SalaryRange({ p25, p50, p75, height = 220 }: SalaryRangeProps) {
  if (!p25 && !p50 && !p75) {
    return (
      <div className="flex items-center justify-center h-32 text-t2 text-sm">
        No salary data yet
      </div>
    );
  }

  const data = [
    { label: "25th percentile", value: p25 },
    { label: "Median (50th)",   value: p50 },
    { label: "75th percentile", value: p75 },
  ];

  return (
    <div>
      {/* Visual range bar */}
      <div className="mb-6 px-2">
        <div className="flex items-center justify-between text-xs text-t2 mb-2">
          <span className="font-medium">{fmtK(p25)}</span>
          <span className="text-accent font-bold text-sm">{fmtK(p50)}</span>
          <span className="font-medium">{fmtK(p75)}</span>
        </div>
        <div className="relative h-3 rounded-full bg-s2 overflow-hidden">
          {p25 != null && p75 != null && (
            <div
              className="absolute top-0 h-full rounded-full"
              style={{
                left:       `${((p25 - 20000) / 120000) * 100}%`,
                right:      `${100 - ((p75 - 20000) / 120000) * 100}%`,
                background: "linear-gradient(90deg, #93C5FD, #4F46E5, #7C3AED)",
              }}
            />
          )}
          {p50 != null && (
            <div
              className="absolute top-0 w-0.5 h-full bg-white shadow-sm"
              style={{ left: `${((p50 - 20000) / 120000) * 100}%` }}
            />
          )}
        </div>
        <div className="flex items-center justify-between text-xs text-t3 mt-1.5">
          <span>Lower quartile</span>
          <span>Median</span>
          <span>Upper quartile</span>
        </div>
      </div>

      {/* Bar chart */}
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={data} margin={{ left: 10, right: 10, top: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "#94A3B8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => fmtK(v)}
            tick={{ fill: "#94A3B8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            domain={[Math.max(0, (p25 ?? 40000) - 15000), (p75 ?? 100000) + 15000]}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(79,70,229,0.04)" }} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={56}>
            {data.map((_, i) => (
              <Cell key={i} fill={BAR_COLORS[i]} fillOpacity={0.9} />
            ))}
          </Bar>
          {p50 != null && (
            <ReferenceLine y={p50} stroke="#4F46E5" strokeDasharray="4 2" strokeWidth={1.5} />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
