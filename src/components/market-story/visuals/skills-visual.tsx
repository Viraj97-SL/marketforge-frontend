"use client";
import { RankedBarList } from "./ranked-bar-list";

export function SkillsVisual({ topSkills }: { topSkills: { skill: string; count: number }[] }) {
  if (!topSkills.length) {
    return <p className="text-sm" style={{ color: "var(--story-text-dim)" }}>No skill data yet.</p>;
  }
  return <RankedBarList items={topSkills.map((s) => ({ label: s.skill, value: s.count }))} unit=" postings" />;
}
