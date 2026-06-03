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
import { PageHero } from "@/components/layout/page-hero";
import { BarChart3, TrendingUp, TrendingDown, Layers, Sparkles, Star } from "lucide-react";

export const revalidate = 300;

const SKILL_DOMAINS = [
  {
    name: "Programming Languages",
    color: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/20",
    skills: ["Python", "Rust", "Go", "TypeScript", "Scala", "Julia"],
  },
  {
    name: "ML / AI Frameworks",
    color: "text-blue",
    bg: "bg-blue/10",
    border: "border-blue/20",
    skills: ["PyTorch", "TensorFlow", "JAX", "Hugging Face", "LangChain", "LlamaIndex"],
  },
  {
    name: "Cloud & Infrastructure",
    color: "text-prp",
    bg: "bg-prp/10",
    border: "border-prp/20",
    skills: ["AWS", "GCP", "Azure", "Kubernetes", "Docker", "Terraform"],
  },
  {
    name: "Data Engineering",
    color: "text-warn",
    bg: "bg-warn/10",
    border: "border-warn/20",
    skills: ["SQL", "Spark", "dbt", "Airflow", "Kafka", "Snowflake"],
  },
  {
    name: "LLM & Agentic AI",
    color: "text-ok",
    bg: "bg-ok/10",
    border: "border-ok/20",
    skills: ["RAG", "Fine-tuning", "Vector DBs", "Agents", "Embeddings", "Prompt Eng."],
  },
  {
    name: "MLOps & Observability",
    color: "text-err",
    bg: "bg-err/10",
    border: "border-err/20",
    skills: ["MLflow", "Weights & Biases", "BentoML", "Seldon", "Prometheus", "Grafana"],
  },
];

const ROLE_SKILL_MATRIX = {
  roles: ["ML Engineer", "Data Scientist", "AI Engineer", "AI Researcher", "MLOps Engineer"],
  skills: ["Python", "PyTorch", "AWS", "SQL", "Docker", "LLMs", "Statistics", "Kubernetes"],
  matrix: [
    // ML Engineer
    [3, 3, 2, 2, 3, 2, 1, 3],
    // Data Scientist
    [3, 2, 1, 3, 1, 2, 3, 0],
    // AI Engineer
    [3, 2, 2, 1, 2, 3, 1, 2],
    // AI Researcher
    [3, 3, 1, 1, 1, 3, 3, 0],
    // MLOps Engineer
    [3, 1, 3, 2, 3, 1, 0, 3],
  ],
};

// 3 = essential, 2 = important, 1 = useful, 0 = rarely needed
function MatrixCell({ value }: { value: number }) {
  if (value === 3) return <span className="text-accent text-base">●</span>;
  if (value === 2) return <span className="text-blue text-base opacity-70">●</span>;
  if (value === 1) return <span className="text-t3 text-sm">◐</span>;
  return <span className="text-b2 text-sm">○</span>;
}

export default async function SkillsPage() {
  let skills   = null;
  let trending = null;

  try { skills   = await api.skills("all"); } catch {}
  try { trending = await api.trending(7); }   catch {}

  const topSkillsList = Object.entries(skills?.top_skills ?? {})
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count);

  const maxCount = topSkillsList[0]?.count ?? 1;
  const topSkill = topSkillsList[0];

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

        {/* Hero */}
        <PageHero
          badge="Skill Intelligence"
          title="UK AI"
          titleAccent="Skill Demand"
          subtitle="Ranked by job posting frequency, extracted using a 3-gate NLP pipeline: flashtext exact match → BM25 fuzzy → SBERT semantic. Updated twice weekly."
          imageSrc="/images/page-skills-hero.jpg"
        >
          <div className="flex flex-wrap gap-2">
            <span className="text-[11px] font-semibold px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-accent">
              {topSkillsList.length > 0 ? `${topSkillsList.length} skills tracked` : "Skills tracked live"}
            </span>
            <span className="text-[11px] font-semibold px-3 py-1 rounded-full border border-ok/20 bg-ok/5 text-ok">
              {(trending?.rising ?? []).length} rising this week
            </span>
            <span className="text-[11px] font-semibold px-3 py-1 rounded-full border border-b1 bg-s2 text-t2">
              6 skill domains mapped
            </span>
          </div>
        </PageHero>

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

        {/* Skill #1 Spotlight */}
        {topSkill && (
          <div className="relative rounded-2xl overflow-hidden border border-accent/25 mb-8 animate-fade-up animate-delay-150">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-s1 to-blue/5" />
            <div className="absolute inset-0 bg-gradient-to-r from-s1/90 to-transparent pointer-events-none" />
            <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-6">
              <div className="flex items-start gap-5 flex-1">
                <div className="shrink-0 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center mb-2">
                    <Star className="w-7 h-7 text-accent" />
                  </div>
                  <span className="text-[10px] font-bold text-accent uppercase tracking-wide">#1 Skill</span>
                </div>
                <div>
                  <h2 className="text-3xl sm:text-4xl font-black text-t1 mb-2">{topSkill.skill}</h2>
                  <p className="text-t2 text-sm max-w-md">
                    Appears in <span className="text-accent font-bold">{topSkill.count}</span> UK AI/ML job postings this week —
                    the most demanded technical skill across all role categories. Expected in every data,
                    ML, and AI engineering role.
                  </p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <div className="px-3 py-1.5 rounded-lg bg-s2 border border-b1 text-xs text-t2">
                      <span className="text-t1 font-semibold">Found in:</span> ML Engineer · Data Scientist · AI Engineer
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-s2 border border-b1 text-xs text-t2">
                      <span className="text-t1 font-semibold">Pairs with:</span> PyTorch · AWS · Docker · SQL
                    </div>
                  </div>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-5xl font-black text-gradient">{Math.round((topSkill.count / maxCount) * 100)}%</p>
                <p className="text-xs text-t2 mt-1">of AI job listings</p>
              </div>
            </div>
          </div>
        )}

        {/* Main chart + trend panels */}
        <div className="grid lg:grid-cols-3 gap-5">

          <div className="lg:col-span-2 rounded-2xl border border-b1 bg-gradient-to-br from-s1 to-s2 p-6 animate-fade-up animate-delay-200">
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

          <div className="space-y-4">
            <div className="rounded-2xl border border-b1 bg-gradient-to-br from-s1 to-s2 p-5 animate-fade-up animate-delay-300">
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

            <div className="rounded-2xl border border-b1 bg-gradient-to-br from-s1 to-s2 p-5 animate-fade-up animate-delay-400">
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

        {/* Skills by Domain */}
        <div className="mt-8 rounded-2xl border border-b1 bg-gradient-to-br from-s1 to-s2 p-6 animate-fade-up animate-delay-400">
          <div className="flex items-center gap-2 mb-6">
            <Layers className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-bold text-t1">Skills by Domain</h2>
            <p className="text-xs text-t2 ml-auto">6 domains · illustrative groupings</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SKILL_DOMAINS.map((domain) => (
              <div key={domain.name} className={`rounded-xl border p-4 ${domain.border} bg-s2`}>
                <h3 className={`text-xs font-bold mb-3 ${domain.color}`}>{domain.name}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {domain.skills.map((skill) => (
                    <span
                      key={skill}
                      className={`text-[10px] px-2 py-0.5 rounded-md border font-medium text-t1 ${domain.border} ${domain.bg}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-t3 mt-4 pt-4 border-t border-b1">
            Domain groupings are illustrative. Live data from the chart above reflects actual extracted skill frequencies.
          </p>
        </div>

        {/* Role-Skill Matrix */}
        <div className="mt-5 rounded-2xl border border-b1 bg-gradient-to-br from-s1 to-s2 p-6 animate-fade-up animate-delay-500">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-bold text-t1">Role × Skill Demand Matrix</h2>
              <p className="text-xs text-t2 mt-0.5">How frequently each skill appears in each role's job postings</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[580px]">
              <thead>
                <tr className="border-b border-b1">
                  <th className="text-left py-2 pr-4 text-t3 font-semibold min-w-[130px]">Role</th>
                  {ROLE_SKILL_MATRIX.skills.map((s) => (
                    <th key={s} className="py-2 px-2 text-center text-t3 font-semibold whitespace-nowrap">{s}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-b1">
                {ROLE_SKILL_MATRIX.roles.map((role, ri) => (
                  <tr key={role} className="hover:bg-s3/40 transition-colors">
                    <td className="py-3 pr-4 font-semibold text-t1">{role}</td>
                    {ROLE_SKILL_MATRIX.matrix[ri].map((val, si) => (
                      <td key={si} className="py-3 px-2 text-center">
                        <MatrixCell value={val} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-b1 text-[10px] text-t2">
            <span className="flex items-center gap-1.5"><span className="text-accent">●</span> Essential</span>
            <span className="flex items-center gap-1.5"><span className="text-blue opacity-70">●</span> Important</span>
            <span className="flex items-center gap-1.5"><span className="text-t3">◐</span> Useful</span>
            <span className="flex items-center gap-1.5"><span className="text-b2">○</span> Rarely needed</span>
            <span className="text-t3 ml-auto">Derived from job posting analysis · illustrative</span>
          </div>
        </div>

        {/* Full rankings table */}
        {topSkillsList.length > 0 && (
          <div className="mt-5 rounded-2xl border border-b1 bg-gradient-to-br from-s1 to-s2 p-6 animate-fade-up animate-delay-600">
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
                  className="group flex items-center gap-3 p-3 rounded-xl border border-b1 hover:border-b2 hover:bg-s3/40 transition-all duration-200"
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

            <div className="mt-6 pt-4 border-t border-b1 flex flex-wrap gap-4 text-xs text-t2">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1.5 rounded-full bg-gradient-to-r from-accent to-blue" />
                Top 5 — Core skills
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1.5 rounded-full bg-gradient-to-r from-blue to-prp" />
                Ranks 6–15 — Strong demand
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
