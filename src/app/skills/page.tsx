import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI & ML Skills Demand UK",
  description:
    "Which skills are UK employers hiring for? Ranked demand for Python, LLMs, MLOps, cloud, and more — broken down by AI/ML role category.",
  alternates: { canonical: "https://marketforge.digital/skills" },
  openGraph: {
    title: "AI & ML Skills Demand UK | MarketForge AI",
    description:
      "Ranked skill demand across UK AI/ML roles — Python, PyTorch, Kubernetes, LLMs, and rising technologies tracked in real time.",
    url: "https://marketforge.digital/skills",
  },
};

import { api } from "@/lib/api";
import { SkillBar } from "@/components/charts/skill-bar";
import { TrendBadge } from "@/components/ui/trend-badge";
import { BarChart3, TrendingUp, TrendingDown, Layers, Sparkles } from "lucide-react";

export const revalidate = 300;

export default async function SkillsPage() {
  let skills   = null;
  let trending = null;

  try { skills   = await api.skills("all"); } catch {}
  try { trending = await api.trending(7); }   catch {}

  const topSkillsList = Object.entries(skills?.top_skills ?? {})
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count);

  const maxCount = topSkillsList[0]?.count ?? 1;

  // Assign a tier colour based on rank
  const TIER_COLORS = [
    "from-accent to-blue",
    "from-blue to-prp",
    "from-prp to-err",
  ];
  const tierColor = (i: number) =>
    i < 5 ? TIER_COLORS[0] : i < 15 ? TIER_COLORS[1] : TIER_COLORS[2];

  return (
    <div className="pt-14 relative">
      <div className="absolute inset-0 h-48 bg-mesh pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="mb-10 animate-fade-up">
          <p className="text-xs font-bold text-accent uppercase tracking-widest mb-2">Skill Intelligence</p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-t1 mb-3">
            UK AI <span className="text-gradient">Skill Demand</span>
          </h1>
          <p className="text-t2 max-w-xl leading-relaxed">
            Ranked by job posting frequency this week. Extracted from raw descriptions using a
            3-gate NLP pipeline: flashtext exact match → BM25 fuzzy → SBERT semantic.
          </p>
        </div>

        {/* Summary pills */}
        {topSkillsList.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 animate-fade-up animate-delay-100">
            {topSkillsList.slice(0, 6).map((s, i) => (
              <span
                key={s.skill}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-b1 bg-s2 text-xs font-semibold text-t1 animate-fade-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${tierColor(i)}`} />
                #{i + 1} {s.skill}
                <span className="text-t3 font-mono">{s.count}</span>
              </span>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-5">

          {/* Main chart */}
          <div className="lg:col-span-2 rounded-2xl border border-b1 bg-gradient-to-br from-s1 to-s2 p-6 animate-fade-up animate-delay-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm font-bold text-t1">Top 15 Most-Demanded Skills</h2>
                <p className="text-xs text-t2 mt-0.5">By job posting count — all UK AI/ML roles</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent font-semibold border border-accent/20">
                  {topSkillsList.length} skills
                </span>
                <BarChart3 className="w-4 h-4 text-t3" />
              </div>
            </div>
            {topSkillsList.length > 0 ? (
              <SkillBar data={topSkillsList} height={420} />
            ) : (
              <div className="flex flex-col items-center justify-center h-64 gap-3 text-t2">
                <Sparkles className="w-10 h-10 text-t3" />
                <p className="text-sm">Skill data appears after first pipeline run</p>
              </div>
            )}
          </div>

          {/* Trend panels */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-b1 bg-gradient-to-br from-s1 to-s2 p-5 animate-fade-up animate-delay-200">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-ok/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-ok" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-t1">Rising Skills</h3>
                  <p className="text-[10px] text-t2">Gaining demand W/W</p>
                </div>
              </div>
              <div className="space-y-1">
                {(trending?.rising ?? []).slice(0, 10).map((s, i) => (
                  <div key={s} className="flex items-center justify-between p-2 rounded-lg hover:bg-s3/60 transition-colors group">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[10px] text-t3 w-5">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-xs text-t1 font-medium group-hover:text-ok transition-colors">{s}</span>
                    </div>
                    <TrendBadge direction="up" />
                  </div>
                ))}
                {!trending?.rising?.length && <p className="text-xs text-t2 py-4 text-center">No rising data yet</p>}
              </div>
            </div>

            <div className="rounded-2xl border border-b1 bg-gradient-to-br from-s1 to-s2 p-5 animate-fade-up animate-delay-300">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-err/10 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-err" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-t1">Cooling Skills</h3>
                  <p className="text-[10px] text-t2">Losing demand W/W</p>
                </div>
              </div>
              <div className="space-y-1">
                {(trending?.declining ?? []).slice(0, 8).map((s, i) => (
                  <div key={s} className="flex items-center justify-between p-2 rounded-lg hover:bg-s3/60 transition-colors group">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[10px] text-t3 w-5">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-xs text-t1 font-medium group-hover:text-err transition-colors">{s}</span>
                    </div>
                    <TrendBadge direction="down" />
                  </div>
                ))}
                {!trending?.declining?.length && <p className="text-xs text-t2 py-4 text-center">No declining data yet</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Full rankings table */}
        {topSkillsList.length > 0 && (
          <div className="mt-5 rounded-2xl border border-b1 bg-gradient-to-br from-s1 to-s2 p-6 animate-fade-up animate-delay-400">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm font-bold text-t1">Full Skill Rankings</h2>
                <p className="text-xs text-t2 mt-0.5">All {topSkillsList.length} skills extracted this week</p>
              </div>
              <Layers className="w-4 h-4 text-t3" />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {topSkillsList.slice(0, 30).map((s, i) => (
                <div
                  key={s.skill}
                  className="group flex items-center gap-3 p-3 rounded-xl border border-b1
                             hover:border-b2 hover:bg-s3/40 transition-all duration-200"
                >
                  <span className={`font-mono text-xs w-6 shrink-0 font-bold ${
                    i < 5 ? "text-accent" : i < 15 ? "text-blue" : "text-t3"
                  }`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-t1 truncate group-hover:text-accent transition-colors">
                        {s.skill}
                      </span>
                      <span className="text-xs text-accent font-bold ml-2 shrink-0">{s.count}</span>
                    </div>
                    <div className="h-1 rounded-full bg-b1 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${tierColor(i)}`}
                        style={{ width: `${(s.count / maxCount) * 100}%`, transition: "width 1s ease" }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tier legend */}
            <div className="mt-6 pt-4 border-t border-b1 flex flex-wrap gap-4 text-xs text-t2">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1.5 rounded-full bg-gradient-to-r from-accent to-blue" />
                Top 5 — Core skills
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1.5 rounded-full bg-gradient-to-r from-blue to-prp" />
                Ranks 6-15 — Strong demand
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1.5 rounded-full bg-gradient-to-r from-prp to-err" />
                Ranks 16+ — Emerging / niche
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
