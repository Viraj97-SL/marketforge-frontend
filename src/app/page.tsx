import Link from "next/link";
import { api } from "@/lib/api";
import { fmt, fmtK, pct } from "@/lib/utils";
import {
  ArrowRight, Brain, TrendingUp, MapPin, Shield,
  Cpu, Database, BarChart3, Zap, Globe, Star,
  ChevronRight, Activity, Users, DollarSign,
} from "lucide-react";

// ── Hero section ──────────────────────────────────────────────────────────────
function HeroBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/5 text-xs font-medium text-accent mb-6 animate-fade-up">
      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
      Live data · Updated twice weekly
    </div>
  );
}

function HeroIllustration() {
  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center">
      {/* Central orb */}
      <div className="relative w-40 h-40">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/20 to-blue/20 blur-2xl animate-pulse-slow" />
        <div className="absolute inset-4 rounded-full border border-accent/30 bg-gradient-to-br from-s2 to-s3 flex items-center justify-center">
          <Zap className="w-12 h-12 text-accent" strokeWidth={1.5} />
        </div>
        {/* Orbit ring */}
        <div className="absolute inset-0 rounded-full border border-accent/15 animate-spin" style={{ animationDuration: "20s" }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent shadow-lg shadow-accent/50" />
        </div>
        <div className="absolute -inset-8 rounded-full border border-blue/10 animate-spin" style={{ animationDuration: "30s", animationDirection: "reverse" }}>
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-blue shadow-lg shadow-blue/50" />
        </div>
      </div>

      {/* Floating data cards */}
      {[
        { label: "Avg Salary", value: "£82k", icon: DollarSign, pos: "top-4 left-4", accent: "text-accent" },
        { label: "AI Jobs Live", value: "4,200+", icon: Activity, pos: "top-4 right-4", accent: "text-blue" },
        { label: "Sponsorship", value: "34%", icon: Globe, pos: "bottom-4 left-4", accent: "text-prp" },
        { label: "Top Skill", value: "Python", icon: Star, pos: "bottom-4 right-4", accent: "text-ok" },
      ].map((card) => (
        <div
          key={card.label}
          className={`absolute ${card.pos} bg-s1 border border-b1 rounded-xl px-4 py-3 shadow-xl backdrop-blur-sm`}
        >
          <div className="flex items-center gap-2">
            <card.icon className={`w-4 h-4 ${card.accent}`} />
            <div>
              <p className="text-[10px] text-t2 font-medium">{card.label}</p>
              <p className={`text-sm font-bold ${card.accent}`}>{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Feature grid ──────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Brain,
    title: "AI-Powered Scraping",
    body: "9 autonomous agents collect data from Adzuna, Reed, specialist boards, and funding news sources continuously.",
    href: "/market",
    accent: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: BarChart3,
    title: "Skill Demand Intelligence",
    body: "Real-time ranking of 500+ tech skills by job count, co-occurrence patterns, and week-over-week velocity.",
    href: "/skills",
    accent: "text-blue",
    bg: "bg-blue/10",
  },
  {
    icon: DollarSign,
    title: "Salary Benchmarks",
    body: "P25/P50/P75 salary percentiles broken down by role category, experience level, and UK region.",
    href: "/salary",
    accent: "text-prp",
    bg: "bg-prp/10",
  },
  {
    icon: Globe,
    title: "Sponsorship Tracker",
    body: "Which companies sponsor Skilled Worker visas for AI/ML roles — updated every pipeline run.",
    href: "/market",
    accent: "text-ok",
    bg: "bg-ok/10",
  },
  {
    icon: Cpu,
    title: "Career Gap Analysis",
    body: "Upload your skill profile. Get a personalised market-match score, gap report, and 90-day action plan.",
    href: "/career",
    accent: "text-warn",
    bg: "bg-warn/10",
  },
  {
    icon: TrendingUp,
    title: "Research Signals",
    body: "Emerging tech tracked from arXiv, funding announcements, and GitHub trending — before it hits job boards.",
    href: "/research",
    accent: "text-blue",
    bg: "bg-blue/10",
  },
];

// ── Architecture section ──────────────────────────────────────────────────────
const ARCH_STEPS = [
  { n: "01", title: "Data Collection", body: "Adzuna + Reed APIs, specialist job boards, arXiv, funding news. Dedup + validation." },
  { n: "02", title: "NLP Pipeline", body: "3-gate skill extraction (flashtext → BM25 → SBERT), PII scrubbing, quality scoring." },
  { n: "03", title: "Market Analysis", body: "Weekly snapshots: skill demand curves, salary percentiles, sponsorship rates, geo distribution." },
  { n: "04", title: "ML Engineering", body: "LightGBM salary prediction, hiring velocity forecasting, skill co-occurrence graphs." },
  { n: "05", title: "QA + Security", body: "LLM output validation, data integrity checks, input sanitisation, model drift detection." },
  { n: "06", title: "Dashboard + API", body: "FastAPI REST endpoints + Next.js frontend — all data served from Redis cache." },
];

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function HomePage() {
  let health = null;
  try { health = await api.health(); } catch {}

  const jobsTotal  = health?.jobs_total ?? 0;
  const freshness  = health?.data_freshness_h;
  const statusOk   = health?.status === "healthy";

  return (
    <div className="pt-14">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <HeroBadge />

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] mb-6 animate-fade-up animate-delay-100">
            UK AI Job Market
            <br />
            <span className="text-gradient">Intelligence</span>
            <br />
            Platform
          </h1>

          <p className="text-t2 text-lg leading-relaxed mb-8 max-w-lg animate-fade-up animate-delay-200">
            9 autonomous AI agents track hiring trends, skill demand, salary benchmarks,
            and visa sponsorship across the UK AI/ML market — in real time, 24/7.
          </p>

          <div className="flex flex-wrap gap-3 animate-fade-up animate-delay-300">
            <Link
              href="/market"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent to-blue text-bg font-bold text-sm hover:opacity-90 transition-opacity"
            >
              Explore Market Data
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/career"
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-b2 text-t1 font-semibold text-sm hover:border-accent/40 hover:text-accent transition-all"
            >
              Analyse My Profile
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Live stats */}
          <div className="flex flex-wrap items-center gap-6 mt-10 animate-fade-up animate-delay-400">
            <div>
              <p className="text-2xl font-bold text-t1">{jobsTotal > 0 ? fmt(jobsTotal) : "4,200+"}</p>
              <p className="text-xs text-t2">UK AI jobs tracked</p>
            </div>
            <div className="w-px h-10 bg-b1" />
            <div>
              <p className="text-2xl font-bold text-accent">9</p>
              <p className="text-xs text-t2">AI agent departments</p>
            </div>
            <div className="w-px h-10 bg-b1" />
            <div>
              <p className="text-2xl font-bold text-t1">£82k</p>
              <p className="text-xs text-t2">Median AI salary (UK)</p>
            </div>
            <div className="w-px h-10 bg-b1" />
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${statusOk ? "bg-ok animate-pulse" : "bg-warn"}`} />
              <p className="text-xs text-t2">
                {statusOk ? `Data ${freshness != null ? `${freshness.toFixed(0)}h` : ""} fresh` : "Refreshing data"}
              </p>
            </div>
          </div>
        </div>

        <div className="animate-fade-in animate-delay-300">
          <HeroIllustration />
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-3">Platform capabilities</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-t1 mb-4">
            Everything you need to navigate<br />
            <span className="text-gradient">the UK AI job market</span>
          </h2>
          <p className="text-t2 max-w-xl mx-auto">
            From raw job postings to actionable career intelligence — all derived from live data,
            zero manual curation.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <Link
              key={f.title}
              href={f.href}
              className={`group relative p-6 rounded-2xl border border-b1 bg-s1 hover:border-b2 transition-all duration-300 hover:-translate-y-0.5 animate-fade-up`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                <f.icon className={`w-5 h-5 ${f.accent}`} />
              </div>
              <h3 className="text-sm font-bold text-t1 mb-2 group-hover:text-accent transition-colors">
                {f.title}
              </h3>
              <p className="text-xs text-t2 leading-relaxed">{f.body}</p>
              <ChevronRight className="w-4 h-4 text-t3 absolute bottom-5 right-5 group-hover:text-accent transition-colors" />
            </Link>
          ))}
        </div>
      </section>

      {/* ── Architecture ─────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="rounded-2xl border border-b1 bg-s1 p-8 sm:p-12">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-blue uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-3xl font-black tracking-tight text-t1 mb-3">
              Autonomous 9-Department Pipeline
            </h2>
            <p className="text-t2 max-w-lg mx-auto text-sm">
              Each department is a DeepAgent hierarchy with Plan → Execute → Reflect → Output lifecycle.
              All state persisted in PostgreSQL.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ARCH_STEPS.map((s, i) => (
              <div key={s.n} className="relative p-5 rounded-xl border border-b1 bg-s2 hover:border-b2 transition-colors animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-start gap-4">
                  <span className="font-mono text-xs font-bold text-accent/50 mt-0.5 shrink-0">{s.n}</span>
                  <div>
                    <h4 className="text-sm font-bold text-t1 mb-1">{s.title}</h4>
                    <p className="text-xs text-t2 leading-relaxed">{s.body}</p>
                  </div>
                </div>
                {i < ARCH_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                    <ChevronRight className="w-4 h-4 text-b2" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Tech stack pills */}
          <div className="mt-10 pt-8 border-t border-b1">
            <p className="text-xs font-semibold text-t3 uppercase tracking-wider mb-4 text-center">Tech stack</p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                "Python 3.11","LangGraph","Gemini Flash/Pro","FastAPI","PostgreSQL",
                "Redis","ChromaDB","LightGBM","spaCy","SBERT","APScheduler",
                "Next.js 14","Tailwind CSS","Railway","Vercel",
              ].map((t) => (
                <span key={t} className="px-3 py-1 rounded-full bg-s3 border border-b1 text-xs text-t2 font-medium">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="relative rounded-2xl overflow-hidden border border-accent/20 bg-gradient-to-br from-accent/5 via-s1 to-blue/5 p-10 sm:p-16 text-center">
          <div className="absolute inset-0 bg-hero-glow opacity-50" />
          <div className="relative">
            <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-4">Free to use</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-t1 mb-4">
              Know exactly where you stand<br />in the UK AI market
            </h2>
            <p className="text-t2 mb-8 max-w-lg mx-auto">
              Enter your skills and target role. Get a personalised market-match score,
              skill gap report, and concrete 90-day action plan — powered by live data.
            </p>
            <Link
              href="/career"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-accent to-blue text-bg font-bold hover:opacity-90 transition-opacity text-sm"
            >
              Analyse My Career Profile
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
