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
  teal:   { text: "text-accent", icon: "bg-accent/10 text-accent" },
  blue:   { text: "text-blue",   icon: "bg-blue/10 text-blue"     },
  purple: { text: "text-prp",    icon: "bg-prp/10 text-prp"       },
  green:  { text: "text-ok",     icon: "bg-ok/10 text-ok"         },
  amber:  { text: "text-warn",   icon: "bg-warn/10 text-warn"     },
};

export function StatCard({
  label, value, sub, icon: Icon, trend, trendValue,
  accent = "teal", delay = 0,
}: StatCardProps) {
  const col = ACCENTS[accent];

  return (
    <div
      className="bg-s1 rounded-2xl border border-b1 p-5 shadow-card card-hover animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-t3 uppercase tracking-wider mb-3">{label}</p>
          <p className={cn("text-2xl font-black tracking-tight", col.text)}>{value}</p>
          {sub && <p className="text-xs text-t3 mt-1.5">{sub}</p>}
          {trend && trendValue && (
            <div
              className={cn(
                "inline-flex items-center gap-1 mt-3 text-xs font-semibold px-2 py-0.5 rounded-full",
                trend === "up"   ? "bg-ok/10 text-ok"   :
                trend === "down" ? "bg-err/10 text-err" :
                                   "bg-s2 text-t3"
              )}
            >
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
            </div>
          )}
        </div>
        {Icon && (
          <div className={cn("shrink-0 w-11 h-11 rounded-xl flex items-center justify-center", col.icon)}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
