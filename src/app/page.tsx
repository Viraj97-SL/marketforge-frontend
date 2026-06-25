import Link from "next/link";
import { api } from "@/lib/api";
import { fmt, fmtK } from "@/lib/utils";
import {
  ArrowRight, Brain, TrendingUp, Shield,
  Database, BarChart3, Globe,
  ChevronRight, Activity, DollarSign,
  Sparkles, Target, BookOpen, Code2,
  Mail, MapPin, Clock, LineChart,
  Users, Briefcase, GraduationCap,
} from "lucide-react";
import { LogoMarquee }      from "@/components/home/logo-marquee";
import { ContactForm }      from "@/components/home/contact-form";
import { DashboardMockup } from "@/components/illustrations/dashboard-mockup";
import { PipelineFlow }    from "@/components/illustrations/pipeline-flow";

// ─── Hero right-side stats grid ───────────────────────────────────────────────
function HeroStats({ jobsTotal, statusOk, freshness }: {
  jobsTotal: number; statusOk: boolean; freshness?: number;
}) {
  const stats = [
    { label: "UK AI Jobs Tracked", value: jobsTotal > 0 ? fmt(jobsTotal) : "4,200+", accent: "text-indigo-300" },
    { label: "Median AI Salary",   value: "£82k",  accent: "text-blue-300"   },
    { label: "Skills Monitored",   value: "500+",  accent: "text-violet-300" },
    { label: "Visa Sponsor Rate",  value: "34%",   accent: "text-emerald-300"},
  ];
  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5">
          <p className="text-xs text-slate-400 mb-2">{s.label}</p>
          <p className={`text-3xl font-black ${s.accent}`}>{s.value}</p>
        </div>
      ))}
      <div className="col-span-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${statusOk ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
        <span className="text-xs text-slate-400">
          {statusOk
            ? `Pipeline active · data ${freshness != null ? `${Math.round(freshness)}h` : ""} fresh`
            : "Pipeline running…"}
        </span>
      </div>
    </div>
  );
}

// ─── Feature list ─────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: Brain,    title: "AI-Powered Scraping",        body: "9 autonomous agents collect from Adzuna, Reed, and specialist boards. Dedup + NLP validation baked in.", href: "/market",   accent: "text-accent", bg: "bg-accent/8", visual: "📡" },
  { icon: BarChart3,title: "Skill Demand Intelligence",  body: "Real-time ranking of 500+ tech skills by job count, co-occurrence, and week-over-week velocity.",          href: "/skills",   accent: "text-blue",   bg: "bg-blue/8",   visual: "🧠" },
  { icon: DollarSign,title:"Salary Benchmarks",          body: "P25/P50/P75 percentiles by role, experience level, and UK region — updated every pipeline run.",           href: "/salary",   accent: "text-prp",    bg: "bg-prp/8",    visual: "💷" },
  { icon: Globe,    title: "Visa Sponsorship Tracker",   body: "Which companies sponsor Skilled Worker visas for AI/ML roles — verified via NLP on job descriptions.",      href: "/jobs",     accent: "text-ok",     bg: "bg-ok/8",     visual: "🌍" },
  { icon: Target,   title: "Career Gap Analysis",        body: "Upload your CV. Get a personalised market-match score, skill gap report, and 90-day action plan.",          href: "/career",   accent: "text-warn",   bg: "bg-warn/8",   visual: "🎯" },
  { icon: BookOpen, title: "Research Signals",           body: "Emerging tech tracked from arXiv, funding announcements, and GitHub trending — before it hits job boards.", href: "/research", accent: "text-blue",   bg: "bg-blue/8",   visual: "🔬" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function HomePage() {
  let health = null;
  try { health = await api.health(); } catch {}

  const jobsTotal = health?.jobs_total ?? 0;
  const freshness = health?.data_freshness_h ?? undefined;
  const statusOk  = health?.status === "healthy";

  return (
    <div className="pt-14 overflow-x-hidden">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[88vh] flex items-center"
        style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #0F172A 100%)" }}
      >
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 w-full grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-xs font-semibold text-accent mb-8 animate-fade-up">
              <span className="live-dot" />
              Live data · Updated twice weekly
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6 text-white animate-fade-up animate-delay-100">
              UK AI Job Market<br />
              <span className="text-gradient">Intelligence</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-xl animate-fade-up animate-delay-200">
              9 autonomous AI agents track hiring trends, skill demand, salary benchmarks,
              and visa sponsorship across the UK AI/ML market — 24/7, zero manual curation.
            </p>
            <div className="flex flex-wrap gap-3 animate-fade-up animate-delay-300">
              <Link href="/market" className="group flex items-center gap-2 px-7 py-3.5 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-indigo-700 transition-colors duration-200 shadow-lg">
                Explore Market Data <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link href="/career" className="flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/20 text-slate-300 font-semibold text-sm hover:border-white/40 hover:text-white hover:bg-white/5 transition-all duration-200">
                Analyse My Profile <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="animate-fade-in animate-delay-200 hidden lg:block">
            <HeroStats jobsTotal={jobsTotal} statusOk={statusOk} freshness={freshness} />
          </div>
        </div>
      </section>

      {/* ── Logo Cloud ────────────────────────────────────────────────────── */}
      <LogoMarquee />

      {/* ── Dashboard preview ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left copy */}
          <div>
            <p className="section-label mb-3">Live dashboard</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-t1 mb-5 leading-tight">
              See exactly what&apos;s moving
              <br />
              <span className="text-gradient">in UK AI hiring</span>
            </h2>
            <p className="text-t2 leading-relaxed mb-8 max-w-md text-sm">
              Every metric on the dashboard is derived from real job postings — not surveys, not estimates.
              Skills ranked by actual job count. Salaries extracted from posted compensation ranges.
              Sponsorship rates verified from NLP on job descriptions.
            </p>
            <div className="space-y-3 mb-8">
              {[
                { icon: "📊", label: "Weekly snapshots, not stale annual reports"   },
                { icon: "🤖", label: "9 AI agents, zero manual data entry"          },
                { icon: "🔍", label: "3-gate NLP skill extraction — high precision" },
                { icon: "🇬🇧", label: "UK-specific — not US salary data relabelled"  },
              ].map((pt) => (
                <div key={pt.label} className="flex items-center gap-3">
                  <span className="text-lg shrink-0">{pt.icon}</span>
                  <span className="text-sm text-t1 font-medium">{pt.label}</span>
                </div>
              ))}
            </div>
            <Link href="/market" className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-indigo-700 transition-colors shadow-sm">
              Open Market Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Right — mockup */}
          <div className="animate-fade-up animate-delay-200">
            <DashboardMockup />
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section className="bg-s2 border-y border-b1 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="section-label mb-3">Platform capabilities</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-t1 mb-5">
              Everything you need to navigate
              <br />
              <span className="text-gradient">the UK AI job market</span>
            </h2>
            <p className="text-t2 max-w-lg mx-auto leading-relaxed text-sm">
              From raw job postings to actionable career intelligence — all derived from live data,
              zero manual curation, zero guesswork.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <Link
                key={f.title}
                href={f.href}
                className="group bg-s1 rounded-2xl border border-b1 p-6 card-hover shadow-card animate-fade-up flex flex-col"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Visual top strip */}
                <div className={`w-full h-20 rounded-xl ${f.bg} flex items-center justify-center mb-5 relative overflow-hidden`}>
                  <span className="text-4xl opacity-40 absolute right-3 bottom-1 select-none">{f.visual}</span>
                  <div className={`w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center shadow-sm z-10`}>
                    <f.icon className={`w-5 h-5 ${f.accent}`} />
                  </div>
                </div>
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-bold text-t1 mb-2 group-hover:text-accent transition-colors flex-1">
                    {f.title}
                  </h3>
                  <ChevronRight className="w-4 h-4 text-t3 group-hover:text-accent transition-colors shrink-0 mt-0.5" />
                </div>
                <p className="text-xs text-t2 leading-relaxed">{f.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works — with pipeline illustration ──────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <p className="section-label mb-3">How it works</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-t1 mb-4">
            From job boards to actionable insight
          </h2>
          <p className="text-t2 text-sm max-w-md mx-auto">
            A fully automated 6-step pipeline runs twice weekly with zero human intervention.
          </p>
        </div>

        {/* Pipeline flow illustration */}
        <div className="bg-s1 rounded-2xl border border-b1 p-6 sm:p-8 shadow-card mb-10 animate-fade-up animate-delay-100">
          <PipelineFlow variant="horizontal" />
        </div>

        {/* 3 quality pillars */}
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { icon: Activity,  stat: "Twice Weekly", label: "Pipeline cadence",       body: "Full scrape + analysis cycle runs automatically via APScheduler — no manual triggers, ever.",                              accent: "text-accent", bg: "bg-accent/10" },
            { icon: Shield,    stat: "3-Gate NLP",   label: "Skill extraction",       body: "flashtext exact → BM25 fuzzy → SBERT semantic. Dramatically reduces false positives.",                                      accent: "text-blue",   bg: "bg-blue/10"   },
            { icon: TrendingUp,stat: "Deduped",      label: "Cross-source matching",  body: "Jobs matched across Adzuna, Reed, and specialist boards by title + company + location fingerprint.",                         accent: "text-prp",    bg: "bg-prp/10"    },
          ].map((item, i) => (
            <div key={item.label} className="bg-s1 p-6 rounded-2xl border border-b1 shadow-card animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center mb-4`}>
                <item.icon className={`w-5 h-5 ${item.accent}`} />
              </div>
              <p className={`text-2xl font-black ${item.accent} mb-0.5`}>{item.stat}</p>
              <p className="text-xs font-bold text-t1 mb-2">{item.label}</p>
              <p className="text-xs text-t2 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Who it's for ──────────────────────────────────────────────────── */}
      <section className="bg-s2 border-y border-b1 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="section-label mb-3">Built for</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-t1">
              Everyone navigating UK AI careers
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                icon: GraduationCap,
                persona: "Job Seekers",
                emoji: "🎓",
                accent: "text-accent", bg: "bg-accent/8", border: "border-accent/15",
                points: [
                  "Know which skills to learn next",
                  "Benchmark your salary expectations",
                  "Find companies that sponsor visas",
                  "Get a personalised 90-day plan",
                ],
                cta: "Analyse My Profile", href: "/career",
              },
              {
                icon: Briefcase,
                persona: "Hiring Managers",
                emoji: "💼",
                accent: "text-blue", bg: "bg-blue/8", border: "border-blue/15",
                points: [
                  "See competitive salary ranges",
                  "Understand which skills are scarce",
                  "Track hiring velocity vs competitors",
                  "Benchmark your JD requirements",
                ],
                cta: "View Market Data", href: "/market",
              },
              {
                icon: Users,
                persona: "Researchers & Analysts",
                emoji: "📊",
                accent: "text-prp", bg: "bg-prp/8", border: "border-prp/15",
                points: [
                  "Track research → job market pipeline",
                  "See when arXiv papers hit job specs",
                  "Monitor skill demand over time",
                  "API access for custom analysis",
                ],
                cta: "Research Signals", href: "/research",
              },
            ].map((p) => (
              <div key={p.persona} className={`bg-s1 rounded-2xl border ${p.border} p-6 shadow-card animate-fade-up flex flex-col`}>
                {/* Header with emoji illustration */}
                <div className={`w-full h-24 rounded-xl ${p.bg} flex items-center justify-center mb-5 relative overflow-hidden`}>
                  <span className="text-5xl opacity-25 absolute right-2 bottom-0 select-none">{p.emoji}</span>
                  <div className={`w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center shadow-sm z-10`}>
                    <p.icon className={`w-6 h-6 ${p.accent}`} />
                  </div>
                </div>
                <h3 className={`text-base font-bold mb-4 ${p.accent}`}>{p.persona}</h3>
                <ul className="space-y-2 mb-6 flex-1">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2 text-xs text-t1">
                      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${p.accent.replace("text-", "bg-")}`} />
                      {pt}
                    </li>
                  ))}
                </ul>
                <Link href={p.href} className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border ${p.border} ${p.bg} ${p.accent} text-xs font-semibold hover:opacity-80 transition-opacity`}>
                  {p.cta} <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ───────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="section-label mb-3">Contact us</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-t1 mb-5 leading-tight">
              Let&apos;s talk about<br />
              <span className="text-gradient">UK AI market data</span>
            </h2>
            <p className="text-t2 leading-relaxed mb-8 max-w-md text-sm">
              Whether you&apos;re a hiring manager, researcher, or developer — get in touch to learn
              how MarketForge can power your decisions with live AI job market intelligence.
            </p>
            <div className="space-y-4">
              {[
                { icon: Mail,   label: "Email us",      value: "hello@marketforge.digital", accent: "text-accent", bg: "bg-accent/10" },
                { icon: MapPin, label: "Based in",       value: "United Kingdom",             accent: "text-blue",   bg: "bg-blue/10"   },
                { icon: Clock,  label: "Response time",  value: "Within 24 hours",            accent: "text-ok",     bg: "bg-ok/10"     },
              ].map(({ icon: Icon, label, value, accent, bg }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 ${accent}`} />
                  </div>
                  <div>
                    <p className="text-[11px] text-t3 font-medium uppercase tracking-wide">{label}</p>
                    <p className="text-sm text-t1 font-semibold">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-s1 rounded-2xl border border-b1 p-7 sm:p-9 shadow-card-md">
            <h3 className="text-base font-bold text-t1 mb-1">Send us a message</h3>
            <p className="text-xs text-t2 mb-6">We read every message and respond personally.</p>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* ── CTA band ──────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-20">
        <div className="relative rounded-3xl overflow-hidden p-12 sm:p-20 text-center"
          style={{ background: "linear-gradient(135deg, #4F46E5 0%, #2563EB 100%)" }}>
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 border border-white/30 text-xs font-semibold text-white mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Free · No sign-up required
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-5 leading-tight">
              Know exactly where you stand<br />in the UK AI market
            </h2>
            <p className="text-indigo-100 mb-10 max-w-lg mx-auto leading-relaxed text-sm">
              Upload your CV or paste your skills. Get a personalised market-match score,
              skill gap report, and a concrete 90-day action plan — powered by live job data.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/career" className="group inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-white text-accent font-bold text-sm hover:bg-indigo-50 transition-colors duration-200 shadow-lg">
                Analyse My Career Profile <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link href="/jobs" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors duration-200">
                Browse Job Board <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
