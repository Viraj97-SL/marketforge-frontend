import { cn } from "@/lib/utils";

interface TrendBadgeProps {
  direction: "up" | "down" | "neutral";
  value?: string;
  className?: string;
}

export function TrendBadge({ direction, value, className }: TrendBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full",
        direction === "up"      ? "bg-ok/10 text-ok" :
        direction === "down"    ? "bg-err/10 text-err" :
                                  "bg-t2/10 text-t2",
        className
      )}
    >
      {direction === "up" ? "↑" : direction === "down" ? "↓" : "→"}
      {value && ` ${value}`}
    </span>
  );
}
