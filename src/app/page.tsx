import Link from "next/link";
import { api } from "@/lib/api";
import { fmt, fmtK } from "@/lib/utils";
import {
  ArrowRight, Brain, TrendingUp, Shield,
  Database, BarChart3, Globe,
  ChevronRight, Activity, DollarSign,
  Sparkles, Target, BookOpen, Code2,
  Mail, MapPin, Clock, LineChart,
} from "lucide-react";
import { LogoMarquee } from "@/components/home/logo-marquee";
import { ContactForm } from "@/components/home/contact-form";

// ─── Hero right-side stats grid ───────────────────────────────────────────────
function HeroStats({
  jobsTotal, statusOk, freshness,
}: {
  jobsTotal: number; statusOk: boolean; freshness?: number;
}) {
  const stats = [
    { label: "UK AI Jobs Tracked", value: jobsTotal > 0 ? fmt(jobsTotal) : "4,200+", accent: "text-indigo-300" },
    { label: "Median AI Salary",   value: "£82k",  accent: "text-blue-300"    },
    { label: "Skills Monitored",   value: "500+",  accent: "text-violet-300"  },
    { label: "Visa Sponsor Rate",  value: "34%",   accent: "text-emerald-300" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5"
        >
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

// ─── Feature cards ────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Brain,
    title: "AI-Powered Scraping",
    body: "9 autonomous agents collect from Adzuna, Reed, and specialist boards. Dedup + NLP validation baked in.",
    href: "/market",
    accent: "text-accent", bg: "bg-accent/8",
  },
  {
    icon: BarChart3,
    title: "Skill Demand Intelligence",
    body: "Real-time ranking of 500+ tech skills by job count, co-occurrence, and week-over-week velocity.",
    href: "/skills",
    accent: "text-blue", bg: "bg-blue/8",
  },
  {
    icon: DollarSign,
    title: "Salary Benchmarks",
    body: "P25/P50/P75 percentiles by role, experience level, and UK region — updated every pipeline run.",
    href: "/salary",
    accent: "text-prp", bg: "bg-prp/8",
  },
  {
    icon: Globe,
    title: "Visa Sponsorship Tracker",
    body: "Which companies sponsor Skilled Worker visas for AI/ML roles — verified via NLP on job descriptions.",
    href: "/jobs",
    accent: "text-ok", bg: "bg-ok/8",
  },
  {
    icon: Target,
    title: "Career Gap Analysis",
    body: "Upload your CV. Get a personalised market-match score, skill gap report, and 90-day action plan.",
    href: "/career",
    accent: "text-warn", bg: "bg-warn/8",
  },
  {
    icon: BookOpen,
    title: "Research Signals",
    body: "Emerging tech tracked from arXiv, funding announcements, and GitHub trending — before it hits job boards.",
    href: "/research",
    accent: "text-blue", bg: "bg-blue/8",
  },
];

// ─── How it works steps ───────────────────────────────────────────────────────
const HOW_IT_WORKS = [
  {
    n: "01", icon: Database,
    title: "Collect",
    body: "Adzuna + Reed APIs, specialist job boards, arXiv, and funding news. Automated twice weekly.",
    accent: "text-accent", bg: "bg-accent/10",
  },
  {
    n: "02", icon: Code2,
    title: "Analyse",
    body: "3-gate skill extraction (flashtext → BM25 → SBERT), salary normalisation, NLP quality scoring.",
    accent: "text-blue", bg: "bg-blue/10",
  },
  {
    n: "03", icon: LineChart,
    title: "Insight",
    body: "Weekly snapshots: skill demand curves, salary percentiles, sponsorship rates, geo distribution.",
    accent: "text-prp", bg: "bg-prp/10",
  },
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

      {/* ── Hero (dark) ───────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[88vh] flex items-center"
        style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #0F172A 100%)" }}
      >
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Bottom fade to body background */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 w-full grid lg:grid-cols-2 gap-16 items-center">
          {/* Left copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-xs font-semibold text-accent mb-8 animate-fade-up">
              <span className="live-dot" />
              Live data · Updated twice weekly
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6 text-white animate-fade-up animate-delay-100">
              UK AI Job Market
              <br />
              <span className="text-gradient">Intelligence</span>
            </h1>

            <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-xl animate-fade-up animate-delay-200">
              9 autonomous AI agents track hiring trends, skill demand, salary benchmarks,
              and visa sponsorship across the UK AI/ML market — 24/7, zero manual curation.
            </p>

            <div className="flex flex-wrap gap-3 animate-fade-up animate-delay-300">
              <Link
                href="/market"
                className="group flex items-center gap-2 px-7 py-3.5 rounded-xl
                           bg-accent text-white font-semibold text-sm
                           hover:bg-indigo-700 transition-colors duration-200 shadow-lg"
              >
                Explore Market Data
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/career"
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl
                           border border-white/20 text-slate-300 font-semibold text-sm
                           hover:border-white/40 hover:text-white hover:bg-white/5
                           transition-all duration-200"
              >
                Analyse My Profile
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right — stats grid */}
          <div className="animate-fade-in animate-delay-200 hidden lg:block">
            <HeroStats jobsTotal={jobsTotal} statusOk={statusOk} freshness={freshness} />
          </div>
        </div>
      </section>

      {/* ── Logo Cloud Marquee ─────────────────────────────────────────────── */}
      <LogoMarquee />

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
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
              className="group bg-s1 rounded-2xl border border-b1 p-6 card-hover shadow-card animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <ChevronRight className="w-4 h-4 text-t3 float-right group-hover:text-accent transition-colors" />
              <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center mb-5`}>
                <f.icon className={`w-5 h-5 ${f.accent}`} />
              </div>
              <h3 className="text-sm font-bold text-t1 mb-2 group-hover:text-accent transition-colors">
                {f.title}
              </h3>
              <p className="text-xs text-t2 leading-relaxed pr-5">{f.body}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section className="bg-s2 border-y border-b1 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="section-label mb-3">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-t1">
              From job boards to actionable insight
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((s, i) => (
              <div
                key={s.n}
                className="bg-s1 rounded-2xl border border-b1 p-7 shadow-card animate-fade-up"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                    <s.icon className={`w-5 h-5 ${s.accent}`} />
                  </div>
                  <span className={`font-mono text-xs font-bold ${s.accent}`}>{s.n}</span>
                </div>
                <h3 className="text-base font-bold text-t1 mb-2">{s.title}</h3>
                <p className="text-xs text-t2 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social proof / data quality ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-12">
          <p className="section-label mb-3">Data quality</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-t1">
            Built for accuracy, not approximation
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            {
              icon: Activity,
              stat: "Twice Weekly",
              label: "Pipeline cadence",
              body: "Full scrape + analysis cycle runs automatically via APScheduler — no manual triggers, ever.",
              accent: "text-accent", bg: "bg-accent/10",
            },
            {
              icon: Shield,
              stat: "3-Gate NLP",
              label: "Skill extraction",
              body: "flashtext exact → BM25 fuzzy → SBERT semantic. Dramatically reduces false positives.",
              accent: "text-blue", bg: "bg-blue/10",
            },
            {
              icon: TrendingUp,
              stat: "Deduped",
              label: "Cross-source matching",
              body: "Jobs matched across Adzuna, Reed, and specialist boards by title + company + location fingerprint.",
              accent: "text-prp", bg: "bg-prp/10",
            },
          ].map((item, i) => (
            <div
              key={item.label}
              className="bg-s1 p-6 rounded-2xl border border-b1 shadow-card animate-fade-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
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

      {/* ── Get in touch ────────────────────────────────────────────────────── */}
      <section className="bg-s2 border-y border-b1 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left — copy */}
            <div>
              <p className="section-label mb-3">Contact us</p>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-t1 mb-5 leading-tight">
                Let&apos;s talk about
                <br />
                <span className="text-gradient">UK AI market data</span>
              </h2>
              <p className="text-t2 leading-relaxed mb-8 max-w-md text-sm">
                Whether you&apos;re a hiring manager, researcher, or developer — get in touch to learn
                how MarketForge can power your decisions with live AI job market intelligence.
              </p>

              <div className="space-y-4">
                {[
                  { icon: Mail,  label: "Email us",      value: "hello@marketforge.digital", accent: "text-accent", bg: "bg-accent/10" },
                  { icon: MapPin, label: "Based in",     value: "United Kingdom",             accent: "text-blue",   bg: "bg-blue/10"   },
                  { icon: Clock, label: "Response time", value: "Within 24 hours",            accent: "text-ok",     bg: "bg-ok/10"     },
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

            {/* Right — form */}
            <div className="bg-s1 rounded-2xl border border-b1 p-7 sm:p-9 shadow-card-md">
              <h3 className="text-base font-bold text-t1 mb-1">Send us a message</h3>
              <p className="text-xs text-t2 mb-6">We read every message and respond personally.</p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA band ────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div
          className="relative rounded-3xl overflow-hidden p-12 sm:p-20 text-center"
          style={{ background: "linear-gradient(135deg, #4F46E5 0%, #2563EB 100%)" }}
        >
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,1) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 border border-white/30 text-xs font-semibold text-white mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Free · No sign-up required
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-5 leading-tight">
              Know exactly where you stand
              <br />
              in the UK AI market
            </h2>
            <p className="text-indigo-100 mb-10 max-w-lg mx-auto leading-relaxed text-sm">
              Upload your CV or paste your skills. Get a personalised market-match score,
              skill gap report, and a concrete 90-day action plan — powered by live job data.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/career"
                className="group inline-flex items-center gap-2 px-10 py-4 rounded-xl
                           bg-white text-accent font-bold text-sm
                           hover:bg-indigo-50 transition-colors duration-200 shadow-lg"
              >
                Analyse My Career Profile
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/30
                           text-white font-semibold text-sm hover:bg-white/10 transition-colors duration-200"
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
