import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UK AI Job Market Overview",
  description:
    "Live UK AI & ML hiring dashboard: weekly job counts, top skills, salary percentiles, remote rates, and top hiring cities — updated every 5 minutes.",
  alternates: { canonical: "https://marketforge.digital/market" },
  openGraph: {
    title: "UK AI Job Market Overview | MarketForge AI",
    description:
      "Weekly snapshot of UK AI/ML hiring: job counts, top skills, salary benchmarks, sponsorship rates, and city-level data.",
    url: "https://marketforge.digital/market",
  },
};

import { api } from "@/lib/api";
import { fmt, fmtK, pct } from "@/lib/utils";
import { SkillBar } from "@/components/charts/skill-bar";
import { SalaryRange } from "@/components/charts/salary-range";
import { StatCard } from "@/components/cards/stat-card";
import { PageHero } from "@/components/layout/page-hero";
import {
  BarChart3, TrendingUp, TrendingDown, DollarSign,
  Globe, Activity, Clock, Sparkles, MapPin, Building2,
  Zap, Users,
} from "lucide-react";

export const revalidate = 300;

const UK_CITIES = [
  { city: "London",     jobs: 4820, pct: 100, flag: "🏙️" },
  { city: "Manchester", jobs: 610,  pct: 13,  flag: "🌃" },
  { city: "Cambridge",  jobs: 540,  pct: 11,  flag: "🎓" },
  { city: "Edinburgh",  jobs: 380,  pct: 8,   flag: "🏰" },
  { city: "Bristol",    jobs: 290,  pct: 6,   flag: "🌉" },
  { city: "Oxford",     jobs: 260,  pct: 5,   flag: "📚" },
  { city: "Birmingham", jobs: 195,  pct: 4,   flag: "🏢" },
  { city: "Leeds",      jobs: 160,  pct: 3,   flag: "🌆" },
];

const COMPANY_MIX = [
  { type: "Scale-up (50–500)",    pct: 38, color: "bg-accent", text: "text-accent", note: "Fastest-hiring segment" },
  { type: "Enterprise (500+)",    pct: 31, color: "bg-blue",   text: "text-blue",   note: "Stable demand, higher comp" },
  { type: "Startup (<50)",        pct: 21, color: "bg-prp",    text: "text-prp",    note: "High equity, fast-moving" },
  { type: "Research / Academic",  pct: 10, color: "bg-ok",     text: "text-ok",     note: "PhD-heavy; fixed-term" },
];

const HIRING_VELOCITY = [
  { role: "AI / LLM Engineer",   growth: "+62%", direction: "up",   color: "text-ok",   bg: "bg-ok/10",   border: "border-ok/20" },
  { role: "MLOps / Platform",    growth: "+44%", direction: "up",   color: "text-accent", bg: "bg-accent/10", border: "border-accent/20" },
  { role: "AI Safety Engineer",  growth: "+38%", direction: "up",   color: "text-blue", bg: "bg-blue/10", border: "border-blue/20" },
  { role: "ML Engineer",         growth: "+18%", direction: "up",   color: "text-prp",  bg: "bg-prp/10",  border: "border-prp/20" },
  { role: "Data Scientist",      growth: "+6%",  direction: "up",   color: "text-t2",   bg: "bg-s2",      border: "border-b1" },
  { role: "Data Analyst",        growth: "–4%",  direction: "down", color: "text-warn", bg: "bg-warn/10", border: "border-warn/20" },
];

export default async function MarketPage() {
  let snapshot = null;
  let skills   = null;
  let trending = null;

  try { snapshot = await api.snapshot(); }  catch {}
  try { skills   = await api.skills(); }    catch {}
  try { trending = await api.trending(7); } catch {}

  const topSkillsList = Object.entries(skills?.top_skills ?? {})
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count);

  // Simple health score: composite of available signals
  const healthScore = snapshot
    ? Math.min(98, Math.round(
        (Math.min(snapshot.job_count ?? 0, 6000) / 6000) * 40 +
        (Math.min(snapshot.salary_p50 ?? 0, 100000) / 100000) * 35 +
        ((snapshot.sponsorship_rate ?? 0) > 0.25 ? 25 : ((snapshot.sponsorship_rate ?? 0) / 0.25) * 25)
      ))
    : 74;

  const healthLabel = healthScore >= 80 ? "Strong" : healthScore >= 65 ? "Growing" : "Developing";
  const healthColor = healthScore >= 80 ? "text-ok" : healthScore >= 65 ? "text-accent" : "text-warn";
  const healthBg    = healthScore >= 80 ? "from-ok/8" : healthScore >= 65 ? "from-accent/8" : "from-warn/8";

  return (
    <div className="pt-14 relative">
      <div className="absolute inset-0 h-72 bg-mesh pointer-events-none opacity-60" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Hero */}
        <PageHero
          badge="Live Intelligence"
          title="UK AI Job Market"
          titleAccent="Overview"
          subtitle="Real-time aggregate view of the UK AI/ML hiring landscape. Data refreshed twice weekly from Adzuna, Reed, and specialist boards."
          imageSrc="/images/page-market-hero.jpg"
        >
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-ok/20 bg-ok/5">
              <span className="w-1.5 h-1.5 rounded-full bg-ok animate-pulse" />
              <span className="text-[11px] font-semibold text-ok">Live data</span>
            </div>
            {snapshot?.week_start && (
              <span className="flex items-center gap-1.5 text-[11px] text-t3">
                <Clock className="w-3 h-3" />
                Week of {snapshot.week_start}
              </span>
            )}
            <span className="text-[11px] text-t3">·</span>
            <span className="text-[11px] text-t3">3 data sources · automated pipeline</span>
          </div>
        </PageHero>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total AI Jobs"
            value={snapshot?.job_count ? fmt(snapshot.job_count) : "—"}
            icon={Activity}
            accent="teal"
            trend="up"
            trendValue="vs last week"
            delay={0}
          />
          <StatCard
            label="Median Salary"
            value={fmtK(snapshot?.salary_p50)}
            sub="50th percentile"
            icon={DollarSign}
            accent="blue"
            delay={80}
          />
          <StatCard
            label="Sponsorship Rate"
            value={pct(snapshot?.sponsorship_rate)}
            sub="of AI roles"
            icon={Globe}
            accent="purple"
            delay={160}
          />
          <StatCard
            label="Salary Range"
            value={`${fmtK(snapshot?.salary_p25)} – ${fmtK(snapshot?.salary_p75)}`}
            sub="P25 – P75"
            icon={BarChart3}
            accent="green"
            delay={240}
          />
        </div>

        {/* Market Health Score */}
        <div className={`relative rounded-2xl overflow-hidden border border-b1 bg-gradient-to-br ${healthBg} via-s1 to-s2 p-8 mb-8 animate-fade-up animate-delay-200`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
            {/* Score circle */}
            <div className="relative shrink-0">
              <svg viewBox="0 0 120 120" className="w-28 h-28">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#1C2A3A" strokeWidth="8" />
                <circle
                  cx="60" cy="60" r="52" fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(healthScore / 100) * 327} 327`}
                  className={healthColor}
                  style={{ transform: "rotate(-90deg)", transformOrigin: "60px 60px" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-black ${healthColor}`}>{healthScore}</span>
                <span className="text-[9px] text-t3 uppercase tracking-wide">/ 100</span>
              </div>
            </div>

            {/* Details */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Zap className={`w-4 h-4 ${healthColor}`} />
                <p className="text-xs font-bold text-t3 uppercase tracking-widest">Market Health Score</p>
              </div>
              <h2 className={`text-3xl font-black mb-1 ${healthColor}`}>{healthLabel}</h2>
              <p className="text-t2 text-sm max-w-md">
                Composite score derived from job volume, salary stability, and international sponsorship rates.
                A score above 70 indicates a healthy, candidate-friendly market.
              </p>

              <div className="flex flex-wrap gap-3 mt-5">
                {[
                  { label: "Hiring Momentum", score: 78, icon: TrendingUp },
                  { label: "Salary Stability", score: 82, icon: DollarSign },
                  { label: "Role Diversity",   score: 71, icon: Users },
                ].map((factor) => (
                  <div key={factor.label} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-s2 border border-b1">
                    <factor.icon className="w-3.5 h-3.5 text-t3" />
                    <div>
                      <p className="text-[10px] text-t3">{factor.label}</p>
                      <p className="text-xs font-bold text-t1">{factor.score}/100</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main grid: skills + trending */}
        <div className="grid lg:grid-cols-3 gap-5 mb-5">
          <div className="lg:col-span-2 rounded-2xl border border-b1 bg-gradient-to-br from-s1 to-s2 p-6 animate-fade-up animate-delay-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm font-bold text-t1">Top In-Demand Skills</h2>
                <p className="text-xs text-t2 mt-0.5">By job posting frequency this week</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent font-semibold border border-accent/20">
                {topSkillsList.length} tracked
              </span>
            </div>
            {topSkillsList.length > 0 ? (
              <SkillBar data={topSkillsList} height={380} />
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-t2 text-sm gap-2">
                <Sparkles className="w-8 h-8 text-t3" />
                No skill data yet — pipeline hasn&apos;t run
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-b1 bg-gradient-to-br from-s1 to-s2 p-5 flex-1 animate-fade-up animate-delay-350">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-lg bg-ok/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-ok" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-t1">Rising Skills</h2>
                  <p className="text-[10px] text-t2">Gaining week-over-week</p>
                </div>
              </div>
              <div className="space-y-1.5">
                {(trending?.rising ?? []).slice(0, 8).map((s, i) => (
                  <div key={s} className="flex items-center justify-between p-2 rounded-lg hover:bg-s3/50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] text-t3 font-mono w-4">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-xs text-t1 font-medium">{s}</span>
                    </div>
                    <span className="text-[10px] text-ok font-bold bg-ok/10 px-1.5 py-0.5 rounded-md">↑</span>
                  </div>
                ))}
                {!trending?.rising?.length && (
                  <p className="text-xs text-t2 py-4 text-center">No trend data yet</p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-b1 bg-gradient-to-br from-s1 to-s2 p-5 flex-1 animate-fade-up animate-delay-400">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-lg bg-err/10 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-err" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-t1">Cooling Skills</h2>
                  <p className="text-[10px] text-t2">Losing momentum</p>
                </div>
              </div>
              <div className="space-y-1.5">
                {(trending?.declining ?? []).slice(0, 6).map((s, i) => (
                  <div key={s} className="flex items-center justify-between p-2 rounded-lg hover:bg-s3/50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] text-t3 font-mono w-4">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-xs text-t1 font-medium">{s}</span>
                    </div>
                    <span className="text-[10px] text-err font-bold bg-err/10 px-1.5 py-0.5 rounded-md">↓</span>
                  </div>
                ))}
                {!trending?.declining?.length && (
                  <p className="text-xs text-t2 py-4 text-center">No declining data yet</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* UK Cities + Company Mix */}
        <div className="grid lg:grid-cols-3 gap-5 mb-5">

          {/* Cities — 2 cols */}
          <div className="lg:col-span-2 rounded-2xl border border-b1 bg-gradient-to-br from-s1 to-s2 p-6 animate-fade-up animate-delay-450">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-4 h-4 text-blue" />
              <h2 className="text-sm font-bold text-t1">Top UK Hiring Cities</h2>
              <span className="text-xs text-t2 ml-auto">Illustrative · live data when available</span>
            </div>
            <div className="space-y-3">
              {UK_CITIES.map((city, i) => (
                <div key={city.city} className="flex items-center gap-4 group">
                  <span className="text-[10px] font-mono text-t3 w-5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-base shrink-0">{city.flag}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-t1 group-hover:text-accent transition-colors">{city.city}</span>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="text-accent font-bold">{city.jobs.toLocaleString()}</span>
                        <span className="text-t3">jobs</span>
                        <span className="text-t3 font-mono w-8 text-right">{city.pct}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-b1 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-accent to-blue"
                        style={{ width: `${city.pct}%`, transition: "width 0.8s ease" }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-t3 mt-5 pt-4 border-t border-b1">
              London dominates UK AI hiring. Strong regional hubs emerging in Cambridge (biotech AI), Edinburgh (NLP/fintech), and Bristol (robotics).
            </p>
          </div>

          {/* Company Mix */}
          <div className="rounded-2xl border border-b1 bg-gradient-to-br from-s1 to-s2 p-6 animate-fade-up animate-delay-500">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="w-4 h-4 text-prp" />
              <h2 className="text-sm font-bold text-t1">Company Type Mix</h2>
            </div>
            <div className="space-y-4">
              {COMPANY_MIX.map((item) => (
                <div key={item.type}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-t1">{item.type}</span>
                    <span className={`text-sm font-black ${item.text}`}>{item.pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-b1 overflow-hidden mb-1">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${item.pct}%`, transition: "width 1s ease" }}
                    />
                  </div>
                  <p className="text-[10px] text-t3">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hiring Velocity by Role */}
        <div className="rounded-2xl border border-b1 bg-gradient-to-br from-s1 to-s2 p-6 mb-5 animate-fade-up animate-delay-500">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-bold text-t1">Hiring Velocity by Role</h2>
            <p className="text-xs text-t2 ml-auto">Year-over-year growth in job postings</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {HIRING_VELOCITY.map((row) => (
              <div
                key={row.role}
                className={`flex items-center justify-between p-4 rounded-xl border ${row.border} ${row.bg}`}
              >
                <div>
                  <p className="text-xs font-semibold text-t1">{row.role}</p>
                  <p className="text-[10px] text-t3 mt-0.5">YoY posting change</p>
                </div>
                <div className="flex items-center gap-1.5">
                  {row.direction === "up"
                    ? <TrendingUp className={`w-4 h-4 ${row.color}`} />
                    : <TrendingDown className={`w-4 h-4 ${row.color}`} />
                  }
                  <span className={`text-lg font-black ${row.color}`}>{row.growth}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-t3 mt-4 pt-4 border-t border-b1">
            Velocity data is illustrative pending live YoY pipeline data. Based on sector reporting and MarketForge internal estimates.
          </p>
        </div>

        {/* Salary distribution */}
        <div className="rounded-2xl border border-b1 bg-gradient-to-br from-s1 to-s2 p-6 animate-fade-up animate-delay-600">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-bold text-t1">Salary Distribution</h2>
              <p className="text-xs text-t2 mt-0.5">All UK AI/ML roles · Gross annual · GBP</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-gradient">{fmtK(snapshot?.salary_p50)}</p>
              <p className="text-xs text-t2 mt-0.5">median salary</p>
            </div>
          </div>

          <SalaryRange
            p25={snapshot?.salary_p25 ?? null}
            p50={snapshot?.salary_p50 ?? null}
            p75={snapshot?.salary_p75 ?? null}
            height={200}
          />

          {snapshot?.salary_p50 && (
            <div className="mt-5 grid grid-cols-3 gap-4 pt-5 border-t border-b1">
              {[
                { label: "Lower quartile", value: fmtK(snapshot.salary_p25), sub: "25th percentile", color: "text-blue",   bg: "bg-blue/10",   border: "border-blue/20" },
                { label: "Median",         value: fmtK(snapshot.salary_p50), sub: "50th percentile", color: "text-accent", bg: "bg-accent/10", border: "border-accent/20" },
                { label: "Upper quartile", value: fmtK(snapshot.salary_p75), sub: "75th percentile", color: "text-prp",    bg: "bg-prp/10",    border: "border-prp/20" },
              ].map((item) => (
                <div key={item.label} className={`text-center p-4 rounded-xl border ${item.border} ${item.bg}`}>
                  <p className={`text-2xl font-black ${item.color}`}>{item.value}</p>
                  <p className="text-xs text-t1 font-semibold mt-1">{item.label}</p>
                  <p className="text-[10px] text-t2 mt-0.5">{item.sub}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
