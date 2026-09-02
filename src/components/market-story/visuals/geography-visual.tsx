"use client";
import { RankedBarList } from "./ranked-bar-list";
import type { CityCount } from "@/lib/api";

export function GeographyVisual({ cityList }: { cityList: CityCount[] }) {
  if (!cityList.length) {
    return <p className="text-sm" style={{ color: "var(--story-text-dim)" }}>No city data yet.</p>;
  }
  return <RankedBarList items={cityList.map((c) => ({ label: c.city, value: c.job_count }))} unit=" jobs" />;
}
