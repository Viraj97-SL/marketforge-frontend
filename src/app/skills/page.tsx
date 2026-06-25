import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI & ML Skills Demand UK",
  description:
    "Which skills are UK AI employers hiring for right now? Live rankings by job count, weekly velocity, and role category.",
  alternates: { canonical: "https://marketforge.digital/skills" },
  openGraph: {
    title: "UK AI Skills Demand Rankings | MarketForge AI",
    description:
      "Real-time UK AI/ML skills demand: Python, PyTorch, LangChain, MLflow — ranked by job postings, role category breakdowns, and week-over-week trends.",
    url: "https://marketforge.digital/skills",
  },
};

import { api } from "@/lib/api";
import { SkillBar } from "@/components/charts/skill-bar";
import { PageHero } from "@/components/layout/page-hero";
import { SkillNetwork } from "@/components/illustrations/skill-network";
import { TrendingUp, TrendingDown } from "lucide-react";

export default async function SkillsPage() {
  let skills   = null;
  let trending = null;

  await Promise.allSettled([
    api.skills()   .then(d => { skills   = d; }),
    api.trending(7).then(d => { trending = d; }),
  ]);

  const topSkillsList = Object.entries((skills as any)?.top_skills ?? {})
    .map(([skill, count]) => ({ skill, count: count as number }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 30);

  const risingSkills    = (trending as any)?.rising    ?? [];
  const decliningSkills = (trending as any)?.declining ?? [];
  const hasLiveSkills   = topSkillsList.length > 0;

  return (
    <div className="pt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Hero */}
        <PageHero
          badge="Skill Intelligence"
          title="UK AI Skills"
          titleAccent="Demand"
          subtitle="Which skills are UK AI employers actually hiring for right now? Ranked by job posting frequency, derived from live NLP analysis of job descriptions."
          imageSrc="/images/illustrations/hero-skills.webp"
        >
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/20 font-semibold">
              {hasLiveSkills ? `${topSkillsList.length} skills live` : "500+ skills tracked"}
            </span>
            <span className="text-slate-600">·</span>
            <span>3-gate NLP extraction</span>
            <span className="text-slate-600">·</span>
            <span>flashtext → BM25 → SBERT</span>
          </div>
        </PageHero>

        {/* Skill network illustration */}
        <div className="bg-s1 rounded-2xl border border-b1 p-6 mb-6 shadow-card animate-fade-up animate-delay-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-t1">UK AI Skill Ecosystem</h2>
              <p className="text-xs text-t2 mt-0.5">How in-demand skills connect and co-occur in job postings</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-t3">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-accent inline-block" />Core</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-indigo-200 inline-block" />Primary</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-s3 border border-b1 inline-block" />Secondary</span>
            </div>
          </div>
          <SkillNetwork height={320} />
        </div>

        {/* Live top-30 ranked list + bar chart */}
        {hasLiveSkills && (
          <div className="bg-s1 rounded-2xl border border-b1 p-6 mb-6 shadow-card animate-fade-up animate-delay-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm font-bold text-t1">Top 30 Most In-Demand Skills</h2>
                <p className="text-xs text-t2 mt-0.5">Live · ranked by job posting frequency this week</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-accent/8 text-accent font-semibold border border-accent/20">
                {topSkillsList.length} skills tracked
              </span>
            </div>

            {/* Bar chart (top 15) */}
            <SkillBar data={topSkillsList.slice(0, 15)} height={340} />

            {/* Ranked full list (all 30) */}
            <div className="mt-8 border-t border-b1 pt-6">
              <h3 className="text-xs font-bold text-t1 mb-4">Full Top 30 Ranking</h3>
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-1.5">
                {topSkillsList.map((s, i) => {
                  const pct = Math.round((s.count / topSkillsList[0].count) * 100);
                  const tier = i < 5 ? "accent" : i < 15 ? "blue" : "prp";
                  const tierColor = tier === "accent" ? "text-accent" : tier === "blue" ? "text-blue" : "text-prp";
                  const tierBg   = tier === "accent" ? "from-accent to-blue" : tier === "blue" ? "from-blue to-prp" : "from-prp to-err";
                  return (
                    <div key={s.skill} className="flex items-center gap-3 py-1.5 group">
                      {/* Rank badge */}
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-black
                        ${i < 3 ? `bg-gradient-to-br ${tierBg} text-white` : "bg-s2 text-t3"}`}>
                        {i + 1}
                      </div>
                      {/* Skill name */}
                      <span className={`text-xs font-semibold flex-1 ${i < 5 ? "text-t1" : "text-t1"} group-hover:${tierColor} transition-colors`}>
                        {s.skill}
                      </span>
                      {/* Bar */}
                      <div className="w-20 h-1.5 rounded-full bg-s2 overflow-hidden shrink-0">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${tierBg}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      {/* Count */}
                      <span className={`text-[10px] font-mono w-10 text-right shrink-0 ${tierColor} font-bold`}>
                        {s.count.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Trending */}
        <div className="grid sm:grid-cols-2 gap-5 mb-6">
          <div className="bg-s1 rounded-2xl border border-b1 p-6 shadow-card animate-fade-up animate-delay-200">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-ok/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-ok" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-t1">Rising Skills</h2>
                <p className="text-[10px] text-t2">Growing in demand week-over-week</p>
              </div>
            </div>
            <div className="space-y-1">
              {risingSkills.slice(0, 12).map((s: string, i: number) => (
                <div key={s} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-s2 transition-colors">
                  <span className="text-[10px] text-t3 font-mono w-5">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-xs text-t1 font-medium">{s}</span>
                  <span className="ml-auto text-[10px] bg-ok/10 text-ok px-1.5 py-0.5 rounded font-bold">↑</span>
                </div>
              ))}
              {risingSkills.length === 0 && (
                <p className="text-xs text-t2 py-8 text-center">Trend data available after 2 pipeline runs</p>
              )}
            </div>
          </div>

          <div className="bg-s1 rounded-2xl border border-b1 p-6 shadow-card animate-fade-up animate-delay-250">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-warn/10 flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-warn" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-t1">Cooling Skills</h2>
                <p className="text-[10px] text-t2">Losing frequency in job postings</p>
              </div>
            </div>
            <div className="space-y-1">
              {decliningSkills.slice(0, 12).map((s: string, i: number) => (
                <div key={s} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-s2 transition-colors">
                  <span className="text-[10px] text-t3 font-mono w-5">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-xs text-t1 font-medium">{s}</span>
                  <span className="ml-auto text-[10px] bg-warn/10 text-warn px-1.5 py-0.5 rounded font-bold">↓</span>
                </div>
              ))}
              {decliningSkills.length === 0 && (
                <p className="text-xs text-t2 py-8 text-center">Trend data available after 2 pipeline runs</p>
              )}
            </div>
          </div>
        </div>

        {/* Top skill per role */}
        <div className="bg-s1 rounded-2xl border border-b1 p-6 shadow-card animate-fade-up animate-delay-300">
          <h2 className="text-sm font-bold text-t1 mb-1">Top Skill Per Role</h2>
          <p className="text-xs text-t2 mb-6">Most commonly required skills by job function</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { role: "ML Engineer",     skill: "PyTorch",    secondary: "Python, Docker",      accent: "text-accent", bg: "bg-accent/8",  border: "border-accent/15" },
              { role: "Data Scientist",  skill: "Python",     secondary: "Pandas, SQL, Seaborn",accent: "text-blue",   bg: "bg-blue/8",    border: "border-blue/15"   },
              { role: "MLOps Engineer",  skill: "Kubernetes", secondary: "Docker, Airflow",     accent: "text-prp",    bg: "bg-prp/8",     border: "border-prp/15"    },
              { role: "NLP / LLM Eng",  skill: "LangChain",  secondary: "HuggingFace, FAISS",  accent: "text-warn",   bg: "bg-warn/8",    border: "border-warn/15"   },
              { role: "Data Engineer",   skill: "Spark",      secondary: "SQL, Databricks",     accent: "text-ok",     bg: "bg-ok/8",      border: "border-ok/15"     },
              { role: "AI Researcher",   skill: "PyTorch",    secondary: "JAX, CUDA, arXiv",    accent: "text-err",    bg: "bg-err/8",     border: "border-err/15"    },
            ].map((r) => (
              <div key={r.role} className={`p-4 rounded-xl border ${r.border} ${r.bg}`}>
                <p className="text-[10px] text-t3 mb-1">{r.role}</p>
                <p className={`text-lg font-black ${r.accent}`}>{r.skill}</p>
                <p className="text-[10px] text-t2 mt-1">{r.secondary}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
