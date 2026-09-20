"use client";
import { useState } from "react";
import { SkillMatrix } from "./skill-matrix";
import { SkillNetwork } from "./skill-network";

interface SkillCount { skill: string; count: number; }

interface SkillEcosystemCardProps {
  skills: SkillCount[];
  matrix: number[][];
  leafOrder: number[];
}

/**
 * "UK AI Skill Ecosystem" card body. Matrix is the default view — it shows
 * every pair at once with no overplotting and scales cleanly to 24 skills.
 * Network stays as a second tab for people who want to explore the graph;
 * nothing is removed, it's just no longer the default.
 */
export function SkillEcosystemCard({ skills, matrix, leafOrder }: SkillEcosystemCardProps) {
  const [view, setView] = useState<"matrix" | "network">("matrix");

  return (
    <div>
      <div className="flex items-center gap-1 p-1 rounded-lg bg-s2 border border-b1 w-fit mb-5">
        {(["matrix", "network"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              view === v ? "bg-s1 text-t1 shadow-card" : "text-t3 hover:text-t2"
            }`}
          >
            {v === "matrix" ? "Matrix" : "Network"}
          </button>
        ))}
      </div>

      {view === "matrix" ? (
        <SkillMatrix skills={skills} matrix={matrix} leafOrder={leafOrder} />
      ) : (
        <SkillNetwork skills={skills} matrix={matrix} leafOrder={leafOrder} height={420} />
      )}
    </div>
  );
}
