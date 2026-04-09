import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  accent?: "teal" | "blue" | "purple" | "green" | "amber";
  delay?: number;
}

const ACCENTS = {
  teal:   {
    text: "text-accent", bg: "bg-accent/10", border: "border-accent/20",
    glow: "group-hover:shadow-[0_0_24px_rgba(0,198,167,0.15)]",
    blob: "bg-accent/15",
  },
  blue:   {
    text: "text-blue",   bg: "bg-blue/10",   border: "border-blue/20",
    glow: "group-hover:shadow-[0_0_24px_rgba(59,130,246,0.15)]",
    blob: "bg-blue/15",
  },
  purple: {
    text: "text-prp",    bg: "bg-prp/10",    border: "border-prp/20",
    glow: "group-hover:shadow-[0_0_24px_rgba(139,92,246,0.15)]",
    blob: "bg-prp/15",
  },
  green:  {
    text: "text-ok",     bg: "bg-ok/10",     border: "border-ok/20",
    glow: "group-hover:shadow-[0_0_24px_rgba(16,185,129,0.15)]",
    blob: "bg-ok/15",
  },
  amber:  {
    text: "text-warn",   bg: "bg-warn/10",   border: "border-warn/20",
    glow: "group-hover:shadow-[0_0_24px_rgba(245,158,11,0.15)]",
    blob: "bg-warn/15",
  },
};

export function StatCard({
  label, value, sub, icon: Icon, trend, trendValue,
  accent = "teal", delay = 0,
}: StatCardProps) {
  const col = ACCENTS[accent];

  return (
    <div
      className={cn(
        "group relative rounded-2xl border bg-gradient-to-br from-s1 to-s2",
        "overflow-hidden p-5 animate-fade-up transition-all duration-300",
        col.border,
        col.glow
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Ambient blob */}
      <div className={cn("absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-40 transition-opacity group-hover:opacity-70", col.blob)} />

      {/* Glow line at top */}
      <div className={cn("absolute top-0 left-0 right-0 h-px", col.bg)} style={{ background: `linear-gradient(90deg, transparent, currentColor, transparent)` }} />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-t2 uppercase tracking-wider mb-3">{label}</p>
          <p className={cn("text-2xl font-black tracking-tight", col.text)}>{value}</p>
          {sub && <p className="text-xs text-t2 mt-1.5">{sub}</p>}
          {trend && trendValue && (
            <div className={cn(
              "inline-flex items-center gap-1 mt-3 text-xs font-semibold px-2 py-0.5 rounded-full",
              trend === "up"   ? "bg-ok/10 text-ok" :
              trend === "down" ? "bg-err/10 text-err" :
                                 "bg-t3/10 text-t3"
            )}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
            </div>
          )}
        </div>
        {Icon && (
          <div className={cn("shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", col.bg)}>
            <Icon className={cn("w-5 h-5", col.text)} />
          </div>
        )}
      </div>
    </div>
  );
}
