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
import { TrendingUp, TrendingDown, Code2, Database, Brain, Cpu, Layers } from "lucide-react";

export const revalidate = 300;

const SKILL_CATEGORIES = [
  {
    label: "Languages & Frameworks",
    skills: [
      { name: "Python",      rank: 1, note: "Ubiquitous"           },
      { name: "PyTorch",     rank: 2, note: "Deep learning #1"     },
      { name: "TensorFlow",  rank: 3, note: "Enterprise staple"    },
      { name: "SQL",         rank: 4, note: "Every role"           },
      { name: "R",           rank: 5, note: "Data Science / Stats" },
      { name: "Scala",       rank: 6, note: "Big data pipelines"   },
    ],
    accent: "text-accent", bg: "bg-accent/8",
  },
  {
    label: "LLMs & Agents",
    skills: [
      { name: "LangChain",    rank: 1, note: "Agent orchestration"  },
      { name: "LlamaIndex",   rank: 2, note: "RAG pipelines"        },
      { name: "OpenAI API",   rank: 3, note: "GPT-4 / Assistants"  },
      { name: "RAG",          rank: 4, note: "Retrieval-augmented"  },
      { name: "Hugging Face", rank: 5, note: "Model hub + PEFT"     },
      { name: "Anthropic",    rank: 6, note: "Claude API usage"     },
    ],
    accent: "text-blue", bg: "bg-blue/8",
  },
  {
    label: "MLOps & Infra",
    skills: [
      { name: "MLflow",     rank: 1, note: "Experiment tracking"    },
      { name: "Kubernetes", rank: 2, note: "Model serving"          },
      { name: "Docker",     rank: 3, note: "Containerisation"       },
      { name: "Airflow",    rank: 4, note: "Pipeline orchestration" },
      { name: "Kubeflow",   rank: 5, note: "ML platform"            },
      { name: "DVC",        rank: 6, note: "Data versioning"        },
    ],
    accent: "text-prp", bg: "bg-prp/8",
  },
  {
    label: "Cloud Platforms",
    skills: [
      { name: "AWS SageMaker", rank: 1, note: "ML platform leader" },
      { name: "GCP Vertex AI", rank: 2, note: "Google Cloud ML"    },
      { name: "Azure ML",      rank: 3, note: "Enterprise AI"      },
      { name: "Databricks",    rank: 4, note: "Lakehouse + ML"     },
      { name: "Snowflake",     rank: 5, note: "Data cloud"         },
      { name: "AWS Lambda",    rank: 6, note: "Serverless inference"},
    ],
    accent: "text-ok", bg: "bg-ok/8",
  },
];

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
    .slice(0, 20);

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

        {/* Live top-20 bar chart */}
        {hasLiveSkills && (
          <div className="bg-s1 rounded-2xl border border-b1 p-6 mb-6 shadow-card animate-fade-up animate-delay-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm font-bold text-t1">Top 20 Most In-Demand Skills</h2>
                <p className="text-xs text-t2 mt-0.5">Live · ranked by job posting frequency</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-accent/8 text-accent font-semibold border border-accent/20">
                {topSkillsList.length} skills
              </span>
            </div>
            <SkillBar data={topSkillsList} height={420} />
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

        {/* Skill categories */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-5">
            <h2 className="text-base font-bold text-t1">Skills by Category</h2>
            <span className="text-xs text-t3">Curated reference · not live ranked</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {SKILL_CATEGORIES.map((cat) => (
              <div key={cat.label} className="bg-s1 rounded-2xl border border-b1 p-5 shadow-card animate-fade-up">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${cat.bg} mb-4`}>
                  <span className={`text-xs font-bold ${cat.accent}`}>{cat.label}</span>
                </div>
                <div className="space-y-2">
                  {cat.skills.map((s) => (
                    <div key={s.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className={`text-[10px] font-bold font-mono ${cat.accent} w-5`}>{s.rank}</span>
                        <span className="text-xs text-t1 font-medium">{s.name}</span>
                      </div>
                      <span className="text-[10px] text-t3 text-right">{s.note}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
