import Link from "next/link";
import { api } from "@/lib/api";
import { fmt, fmtK } from "@/lib/utils";
import {
  ArrowRight, Brain, TrendingUp, Shield,
  Cpu, Database, BarChart3, Zap, Globe, Star,
  ChevronRight, Activity, Users, DollarSign,
  Sparkles, Target, LineChart, BookOpen, Code2,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Hero floating data tile
// ─────────────────────────────────────────────────────────────────────────────
function DataTile({
  label, value, sub, accent, delay = "0s", animClass = "animate-float",
}: {
  label: string; value: string; sub?: string;
  accent: string; delay?: string; animClass?: string;
}) {
  return (
    <div
      className={`${animClass} relative rounded-2xl border border-b1 bg-s1/90 backdrop-blur-xl px-5 py-4
                  shadow-[0_8px_32px_rgba(0,0,0,0.5)] hover:border-b2 transition-colors`}
      style={{ animationDelay: delay }}
    >
      <p className="text-[10px] text-t2 font-medium uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-xl font-black ${accent}`}>{value}</p>
      {sub && <p className="text-[10px] text-t3 mt-0.5">{sub}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hero illustration — floating orb + orbit rings + data tiles
// ─────────────────────────────────────────────────────────────────────────────
function HeroVisual() {
  return (
    <div className="relative w-full min-h-[480px] flex items-center justify-center select-none">
      {/* Ambient glow blobs */}
      <div className="absolute w-72 h-72 rounded-full bg-accent/10 blur-[80px] animate-pulse-slow" />
      <div className="absolute w-56 h-56 rounded-full bg-blue/8 blur-[60px] translate-x-16 translate-y-10 animate-pulse-slow" style={{ animationDelay: "1.2s" }} />

      {/* Orbit ring 1 */}
      <div className="absolute w-64 h-64 rounded-full border border-accent/15 animate-orbit-cw">
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-accent shadow-[0_0_12px_rgba(0,198,167,0.8)]" />
      </div>
      {/* Orbit ring 2 */}
      <div className="absolute w-96 h-96 rounded-full border border-blue/10 animate-orbit-ccw">
        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-blue shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
      </div>
      {/* Orbit ring 3 */}
      <div className="absolute w-48 h-48 rounded-full border border-prp/10 animate-orbit-cw" style={{ animationDuration: "14s" }}>
        <div className="absolute top-0 right-4 w-2.5 h-2.5 rounded-full bg-prp shadow-[0_0_8px_rgba(139,92,246,0.7)]" />
      </div>

      {/* Central icon */}
      <div className="relative z-10 w-24 h-24 rounded-2xl bg-gradient-to-br from-accent/25 to-blue/25
                      border border-accent/30 flex items-center justify-center
                      shadow-[0_0_60px_rgba(0,198,167,0.25),inset_0_0_30px_rgba(0,198,167,0.05)]
                      animate-glow-pulse">
        <Zap className="w-10 h-10 text-accent" strokeWidth={1.5} />
      </div>

      {/* Floating data tiles */}
      <div className="absolute top-6 left-0">
        <DataTile label="UK AI Jobs Live" value="4,200+" accent="text-accent" animClass="animate-float" delay="0s" />
      </div>
      <div className="absolute top-10 right-0">
        <DataTile label="Avg ML Salary" value="£82k" sub="UK median" accent="text-blue" animClass="animate-float-alt" delay="0.5s" />
      </div>
      <div className="absolute bottom-16 left-4">
        <DataTile label="Visa Sponsors" value="34%" sub="of AI roles" accent="text-prp" animClass="animate-float" delay="1.2s" />
      </div>
      <div className="absolute bottom-8 right-4">
        <DataTile label="Top Skill" value="Python" sub="#1 this week" accent="text-ok" animClass="animate-float-alt" delay="0.8s" />
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 -left-4 hidden xl:block">
        <DataTile label="Remote Roles" value="58%" accent="text-warn" animClass="animate-float-slow" delay="1.5s" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Feature cards
// ─────────────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Brain,
    title: "AI-Powered Scraping",
    body: "9 autonomous agents collect from Adzuna, Reed, specialist boards, and funding news. Dedup + validation baked in.",
    href: "/market",
    accent: "text-accent",
    bg: "bg-accent/10",
    border: "hover:border-accent/30",
    glow: "group-hover:shadow-[0_0_24px_rgba(0,198,167,0.12)]",
  },
  {
    icon: BarChart3,
    title: "Skill Demand Intelligence",
    body: "Real-time ranking of 500+ tech skills by job count, co-occurrence patterns, and week-over-week velocity.",
    href: "/skills",
    accent: "text-blue",
    bg: "bg-blue/10",
    border: "hover:border-blue/30",
    glow: "group-hover:shadow-[0_0_24px_rgba(59,130,246,0.12)]",
  },
  {
    icon: DollarSign,
    title: "Salary Benchmarks",
    body: "P25/P50/P75 percentiles by role, experience level, and UK region — updated every pipeline run.",
    href: "/salary",
    accent: "text-prp",
    bg: "bg-prp/10",
    border: "hover:border-prp/30",
    glow: "group-hover:shadow-[0_0_24px_rgba(139,92,246,0.12)]",
  },
  {
    icon: Globe,
    title: "Visa Sponsorship Tracker",
    body: "Which companies sponsor Skilled Worker visas for AI/ML roles — verified via NLP on job descriptions.",
    href: "/jobs",
    accent: "text-ok",
    bg: "bg-ok/10",
    border: "hover:border-ok/30",
    glow: "group-hover:shadow-[0_0_24px_rgba(16,185,129,0.12)]",
  },
  {
    icon: Target,
    title: "Career Gap Analysis",
    body: "Upload your CV. Get a personalised market-match score, skill gap report, and 90-day action plan.",
    href: "/career",
    accent: "text-warn",
    bg: "bg-warn/10",
    border: "hover:border-warn/30",
    glow: "group-hover:shadow-[0_0_24px_rgba(245,158,11,0.12)]",
  },
  {
    icon: BookOpen,
    title: "Research Signals",
    body: "Emerging tech tracked from arXiv, funding announcements, and GitHub trending — before it hits job boards.",
    href: "/research",
    accent: "text-blue",
    bg: "bg-blue/10",
    border: "hover:border-blue/30",
    glow: "group-hover:shadow-[0_0_24px_rgba(59,130,246,0.12)]",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Pipeline steps
// ─────────────────────────────────────────────────────────────────────────────
const PIPELINE_STEPS = [
  {
    n: "01", icon: Database,
    title: "Data Collection",
    body: "Adzuna + Reed APIs, specialist job boards, arXiv, funding news. Dedup + validation.",
    accent: "text-accent", bg: "bg-accent/10",
  },
  {
    n: "02", icon: Code2,
    title: "NLP Pipeline",
    body: "3-gate skill extraction (flashtext → BM25 → SBERT), PII scrubbing, quality scoring.",
    accent: "text-blue", bg: "bg-blue/10",
  },
  {
    n: "03", icon: LineChart,
    title: "Market Analysis",
    body: "Weekly snapshots: skill demand curves, salary percentiles, sponsorship rates, geo distribution.",
    accent: "text-prp", bg: "bg-prp/10",
  },
  {
    n: "04", icon: Brain,
    title: "ML Engineering",
    body: "LightGBM salary prediction, hiring velocity forecasting, skill co-occurrence graphs.",
    accent: "text-ok", bg: "bg-ok/10",
  },
  {
    n: "05", icon: Shield,
    title: "QA + Security",
    body: "LLM output validation, data integrity checks, input sanitisation, model drift detection.",
    accent: "text-warn", bg: "bg-warn/10",
  },
  {
    n: "06", icon: Sparkles,
    title: "Dashboard + API",
    body: "FastAPI REST endpoints + Next.js frontend — all data served from Redis cache.",
    accent: "text-blue", bg: "bg-blue/10",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Agent departments
// ─────────────────────────────────────────────────────────────────────────────
const DEPARTMENTS = [
  { name: "Market Analysis",  color: "bg-accent/15 text-accent border-accent/25" },
  { name: "Skill Intelligence", color: "bg-blue/15 text-blue border-blue/25" },
  { name: "Salary Benchmarks", color: "bg-prp/15 text-prp border-prp/25" },
  { name: "Job Scraping",     color: "bg-ok/15 text-ok border-ok/25" },
  { name: "CV Analysis",      color: "bg-warn/15 text-warn border-warn/25" },
  { name: "Research Signals", color: "bg-blue/15 text-blue border-blue/25" },
  { name: "Security & QA",    color: "bg-err/15 text-err border-err/25" },
  { name: "Reporting",        color: "bg-t2/15 text-t2 border-t2/25" },
  { name: "Orchestration",    color: "bg-accent/15 text-accent border-accent/25" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export default async function HomePage() {
  let health = null;
  try { health = await api.health(); } catch {}

  const jobsTotal = health?.jobs_total ?? 0;
  const freshness = health?.data_freshness_h;
  const statusOk  = health?.status === "healthy";

  return (
    <div className="pt-14 overflow-x-hidden">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Background mesh */}
        <div className="absolute inset-0 bg-mesh pointer-events-none" />
        <div className="absolute inset-0 dot-grid opacity-60 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 w-full grid lg:grid-cols-2 gap-16 items-center">
          {/* Left copy */}
          <div>
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/5 text-xs font-semibold text-accent mb-8 animate-fade-up">
              <span className="live-dot" />
              Live data · Updated twice weekly
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6 animate-fade-up animate-delay-100">
              UK AI Job Market
              <br />
              <span className="text-gradient">Intelligence</span>
            </h1>

            <p className="text-t2 text-lg leading-relaxed mb-10 max-w-xl animate-fade-up animate-delay-200">
              9 autonomous AI agents track hiring trends, skill demand, salary benchmarks,
              and visa sponsorship across the UK AI/ML market — 24/7, zero manual curation.
            </p>

            <div className="flex flex-wrap gap-3 mb-12 animate-fade-up animate-delay-300">
              <Link
                href="/market"
                className="group flex items-center gap-2 px-7 py-3.5 rounded-xl
                           bg-gradient-to-r from-accent to-blue text-bg font-bold text-sm
                           hover:opacity-90 hover:shadow-[0_0_32px_rgba(0,198,167,0.35)]
                           transition-all duration-300"
              >
                Explore Market Data
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/career"
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl
                           border border-b2 text-t1 font-semibold text-sm
                           hover:border-accent/40 hover:text-accent hover:bg-accent/5
                           transition-all duration-300"
              >
                Analyse My Profile
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Live metrics bar */}
            <div className="flex flex-wrap items-center gap-6 animate-fade-up animate-delay-400">
              {[
                { value: jobsTotal > 0 ? fmt(jobsTotal) : "4,200+", label: "UK AI jobs tracked", color: "text-t1" },
                { value: "9",    label: "Agent departments",    color: "text-accent" },
                { value: "£82k", label: "Median AI salary",     color: "text-t1" },
                { value: "500+", label: "Skills monitored",     color: "text-blue" },
              ].map((m, i) => (
                <div key={m.label} className="flex items-center gap-4">
                  {i > 0 && <div className="w-px h-10 bg-b1" />}
                  <div>
                    <p className={`text-2xl font-black ${m.color} animate-count`}
                       style={{ animationDelay: `${400 + i * 80}ms` }}>
                      {m.value}
                    </p>
                    <p className="text-xs text-t2">{m.label}</p>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-4">
                <div className="w-px h-10 bg-b1" />
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${statusOk ? "bg-ok animate-pulse" : "bg-warn"}`} />
                  <p className="text-xs text-t2">
                    {statusOk
                      ? `Data ${freshness != null ? `${freshness.toFixed(0)}h` : ""} fresh`
                      : "Refreshing…"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — hero visual */}
          <div className="animate-fade-in animate-delay-200 hidden lg:block">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* ── Quick nav tiles ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { href: "/market",   icon: BarChart3,   label: "Market",       accent: "text-accent", bg: "bg-accent/8" },
            { href: "/skills",   icon: Brain,       label: "Skills",       accent: "text-blue",   bg: "bg-blue/8" },
            { href: "/salary",   icon: DollarSign,  label: "Salary",       accent: "text-prp",    bg: "bg-prp/8" },
            { href: "/jobs",     icon: Activity,    label: "Job Board",    accent: "text-ok",     bg: "bg-ok/8" },
            { href: "/career",   icon: Target,      label: "Career AI",    accent: "text-warn",   bg: "bg-warn/8" },
            { href: "/research", icon: BookOpen,    label: "Research",     accent: "text-blue",   bg: "bg-blue/8" },
          ].map(({ href, icon: Icon, label, accent, bg }, i) => (
            <Link
              key={href}
              href={href}
              className={`group flex flex-col items-center gap-2 p-4 rounded-2xl border border-b1 ${bg}
                          hover:border-b2 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200
                          animate-fade-up`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg} group-hover:scale-110 transition-transform`}>
                <Icon className={`w-5 h-5 ${accent}`} />
              </div>
              <span className={`text-xs font-semibold ${accent}`}>{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-xs font-bold text-accent uppercase tracking-widest mb-3">Platform capabilities</p>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-t1 mb-5">
            Everything you need to navigate<br />
            <span className="text-gradient">the UK AI job market</span>
          </h2>
          <p className="text-t2 max-w-xl mx-auto leading-relaxed">
            From raw job postings to actionable career intelligence — all derived from live data,
            zero manual curation, zero guesswork.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <Link
              key={f.title}
              href={f.href}
              className={`group relative p-6 rounded-2xl border border-b1 bg-gradient-to-br from-s1 to-s2
                          ${f.border} ${f.glow} card-hover transition-all duration-300 animate-fade-up`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Corner chevron */}
              <ChevronRight className="w-4 h-4 text-t3 absolute top-5 right-5 group-hover:text-accent transition-colors" />

              <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center mb-5`}>
                <f.icon className={`w-5 h-5 ${f.accent}`} />
              </div>
              <h3 className="text-sm font-bold text-t1 mb-2 group-hover:text-accent transition-colors">
                {f.title}
              </h3>
              <p className="text-xs text-t2 leading-relaxed pr-6">{f.body}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Agent departments ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="rounded-3xl border border-b1 bg-gradient-to-br from-s1 to-s2 p-8 sm:p-12 relative overflow-hidden">
          {/* Background detail */}
          <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-accent/5 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-blue/5 blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-10">
              <div>
                <p className="text-xs font-bold text-blue uppercase tracking-widest mb-2">Architecture</p>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-t1">
                  9-Department Autonomous Pipeline
                </h2>
              </div>
              <p className="text-t2 text-sm max-w-sm sm:ml-auto">
                Each department: DeepAgent hierarchy with Plan → Execute → Reflect → Output.
                All state in PostgreSQL.
              </p>
            </div>

            {/* Department pills */}
            <div className="flex flex-wrap gap-2 mb-10">
              {DEPARTMENTS.map((d, i) => (
                <span
                  key={d.name}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${d.color} animate-fade-up`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {d.name}
                </span>
              ))}
            </div>

            {/* Pipeline steps */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {PIPELINE_STEPS.map((s, i) => (
                <div
                  key={s.n}
                  className="flex items-start gap-4 p-5 rounded-2xl border border-b1 bg-bg/60 hover:border-b2 transition-colors animate-fade-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className={`shrink-0 w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
                    <s.icon className={`w-4 h-4 ${s.accent}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] text-t3">{s.n}</span>
                      <h4 className="text-xs font-bold text-t1">{s.title}</h4>
                    </div>
                    <p className="text-[11px] text-t2 leading-relaxed">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tech stack */}
            <div className="mt-10 pt-8 border-t border-b1">
              <p className="text-xs font-semibold text-t3 uppercase tracking-wider mb-4 text-center">
                Tech stack
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  "Python 3.11", "LangGraph", "Gemini Flash/Pro", "FastAPI", "PostgreSQL",
                  "Redis", "ChromaDB", "LightGBM", "spaCy", "SBERT", "APScheduler",
                  "Next.js 15", "Tailwind CSS", "Railway", "Vercel",
                ].map((t) => (
                  <span key={t} className="px-3 py-1 rounded-full bg-s3 border border-b1 text-xs text-t2 font-medium hover:border-b2 hover:text-t1 transition-colors">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Social proof / data quality ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              icon: Activity,
              stat: "Twice Weekly",
              label: "Pipeline cadence",
              body: "Full scrape + analysis cycle runs automatically via APScheduler — no manual triggers.",
              accent: "text-accent", bg: "bg-accent/10",
            },
            {
              icon: Shield,
              stat: "3-Gate NLP",
              label: "Skill extraction",
              body: "flashtext exact match → BM25 fuzzy → SBERT semantic — dramatically reduces false positives.",
              accent: "text-blue", bg: "bg-blue/10",
            },
            {
              icon: Users,
              stat: "Deduped",
              label: "Cross-source matching",
              body: "Jobs matched across Adzuna, Reed, and specialist boards by title + company + location fingerprint.",
              accent: "text-prp", bg: "bg-prp/10",
            },
          ].map((item, i) => (
            <div
              key={item.label}
              className="p-6 rounded-2xl border border-b1 bg-gradient-to-br from-s1 to-s2 animate-fade-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-4`}>
                <item.icon className={`w-5 h-5 ${item.accent}`} />
              </div>
              <p className={`text-2xl font-black ${item.accent} mb-0.5`}>{item.stat}</p>
              <p className="text-xs font-semibold text-t1 mb-2">{item.label}</p>
              <p className="text-xs text-t2 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="relative rounded-3xl overflow-hidden border border-accent/25 p-12 sm:p-20 text-center">
          {/* Background layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-s1 to-blue/8" />
          <div className="absolute inset-0 dot-grid opacity-40" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-accent/10 blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/5
                            text-xs font-semibold text-accent mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Free · No sign-up required
            </div>

            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-t1 mb-5 leading-tight">
              Know exactly where you stand<br />
              <span className="text-gradient">in the UK AI market</span>
            </h2>
            <p className="text-t2 mb-10 max-w-lg mx-auto leading-relaxed">
              Upload your CV or paste your skills. Get a personalised market-match score,
              skill gap report, and a concrete 90-day action plan — powered by live job data.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/career"
                className="group inline-flex items-center gap-2 px-10 py-4 rounded-xl
                           bg-gradient-to-r from-accent to-blue text-bg font-bold text-sm
                           hover:opacity-90 hover:shadow-[0_0_40px_rgba(0,198,167,0.4)]
                           transition-all duration-300"
              >
                Analyse My Career Profile
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-b2
                           text-t1 font-semibold text-sm hover:border-accent/40 hover:text-accent
                           transition-all duration-300"
              >
                Browse Job Board
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
