import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fmt(n: number | null | undefined, prefix = "", suffix = "") {
  if (n == null) return "—";
  return `${prefix}${n.toLocaleString("en-GB")}${suffix}`;
}

export function fmtK(n: number | null | undefined, prefix = "£") {
  if (n == null) return "—";
  return `${prefix}${(n / 1000).toFixed(0)}k`;
}

export function pct(n: number | null | undefined) {
  if (n == null) return "—";
  return `${(n * 100).toFixed(0)}%`;
}
