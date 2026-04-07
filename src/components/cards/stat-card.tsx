"use client";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon?: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  accent?: "teal" | "blue" | "purple" | "green" | "amber";
  animate?: boolean;
  delay?: number;
}

const ACCENTS = {
  teal:   { text: "text-accent",  bg: "bg-accent/10",  border: "border-accent/20" },
  blue:   { text: "text-blue",    bg: "bg-blue/10",    border: "border-blue/20" },
  purple: { text: "text-prp",     bg: "bg-prp/10",     border: "border-prp/20" },
  green:  { text: "text-ok",      bg: "bg-ok/10",      border: "border-ok/20" },
  amber:  { text: "text-warn",    bg: "bg-warn/10",    border: "border-warn/20" },
};

export function StatCard({
  label, value, sub, icon: Icon, trend, trendValue,
  accent = "teal", animate = true, delay = 0,
}: StatCardProps) {
  const col = ACCENTS[accent];
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "relative rounded-xl border border-b1 bg-s1 p-5 overflow-hidden transition-all duration-500",
        animate && (visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"),
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Subtle glow top-right */}
      <div className={cn("absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-30", col.bg)} />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-t2 uppercase tracking-wider mb-2">{label}</p>
          <p className={cn("text-2xl font-bold tracking-tight", col.text)}>{value}</p>
          {sub && <p className="text-xs text-t2 mt-1">{sub}</p>}
          {trend && trendValue && (
            <div className={cn(
              "inline-flex items-center gap-1 mt-2 text-xs font-medium px-2 py-0.5 rounded-full",
              trend === "up"   ? "bg-ok/10 text-ok" :
              trend === "down" ? "bg-err/10 text-err" :
                                 "bg-t2/10 text-t2"
            )}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
            </div>
          )}
        </div>
        {Icon && (
          <div className={cn("shrink-0 w-10 h-10 rounded-lg flex items-center justify-center", col.bg)}>
            <Icon className={cn("w-5 h-5", col.text)} />
          </div>
        )}
      </div>
    </div>
  );
}
