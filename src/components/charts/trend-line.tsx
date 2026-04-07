"use client";
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart,
} from "recharts";

interface TrendLineProps {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
  gradient?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-s3 border border-b2 rounded-xl px-4 py-3 shadow-xl">
      <p className="text-t2 text-xs mb-1">{label}</p>
      <p className="text-t1 font-semibold text-sm">{payload[0].value.toLocaleString()}</p>
    </div>
  );
};

export function TrendLine({ data, color = "#00C6A7", height = 200, gradient = true }: TrendLineProps) {
  const gradId = `trendGrad_${color.replace("#", "")}`;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ left: 0, right: 8, top: 4, bottom: 4 }}>
        {/* Native SVG defs — valid inside recharts charts */}
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={color} stopOpacity={0.25} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1C2A3A" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: "#64748B", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#64748B", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={gradient ? `url(#${gradId})` : "transparent"}
          dot={false}
          activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
