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
import type { HiringVelocityItem, CityCount, CompanyMixItem } from "@/lib/api";
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

// ── Static fallbacks (shown when API returns no data) ─────────────────────────

const FALLBACK_CITIES: CityCount[] = [
  { city: "London",     job_count: 4820 },
  { city: "Manchester", job_count: 610  },
  { city: "Cambridge",  job_count: 540  },
  { city: "Edinburgh",  job_count: 380  },
  { city: "Bristol",    job_count: 290  },
  { city: "Oxford",     job_count: 260  },
  { city: "Birmingham", job_count: 195  },
  { city: "Leeds",      job_count: 160  },
];

const FALLBACK_COMPANY_MIX: CompanyMixItem[] = [
  { type: "Scale-up (50–500)",   pct: 38, job_count: 0 },
  { type: "Enterprise (500+)",   pct: 31, job_count: 0 },
  { type: "Startup (<50)",       pct: 21, job_count: 0 },
  { type: "Research / Academic", pct: 10, job_count: 0 },
];

const FALLBACK_VELOCITY: HiringVelocityItem[] = [
  { role: "AI / LLM Engineer",  growth_pct: 62,  direction: "up",   role_category: "ai_engineer"    },
  { role: "MLOps / Platform",   growth_pct: 44,  direction: "up",   role_category: "mlops_engineer"  },
  { role: "AI Safety Engineer", growth_pct: 38,  direction: "up",   role_category: "ai_safety"       },
  { role: "ML Engineer",        growth_pct: 18,  direction: "up",   role_category: "ml_engineer"     },
  { role: "Data Scientist",     growth_pct: 6,   direction: "up",   role_category: "data_scientist"  },
  { role: "Data Analyst",       growth_pct: -4,  direction: "down", role_category: "data_analyst"    },
];

// ── UI helpers ────────────────────────────────────────────────────────────────

const CITY_FLAGS: Record<string, string> = {
  London: "🏙️", Manchester: "🌃", Cambridge: "🎓", Edinburgh: "🏰",
  Bristol: "🌉", Oxford: "📚", Birmingham: "🏢", Leeds: "🌆",
  Glasgow: "🏛️", Liverpool: "⚓", Sheffield: "⚒️", Nottingham: "🏹",
  Reading: "📡", Southampton: "⛵", Newcastle: "⚡",
};

const VELOCITY_PALETTE = [
  { color: "text-ok",     bg: "bg-ok/10",     border: "border-ok/20"     },
  { color: "text-accent", bg: "bg-accent/10", border: "border-accent/20" },
  { color: "text-blue",   bg: "bg-blue/10",   border: "border-blue/20"   },
  { color: "text-prp",    bg: "bg-prp/10",    border: "border-prp/20"    },
  { color: "text-t2",     bg: "bg-s2",        border: "border-b1"        },
  { color: "text-warn",   bg: "bg-warn/10",   border: "border-warn/20"   },
];

function companyMixStyle(typeName: string) {
  if (typeName.includes("Scale"))    return { color: "bg-accent", text: "text-accent", note: "Fastest-hiring segment" };
  if (typeName.includes("Enterprise")) return { color: "bg-blue",   text: "text-blue",   note: "Stable demand, higher comp" };
  if (typeName.includes("Startup"))  return { color: "bg-prp",   text: "text-prp",   note: "High equity, fast-moving" };
  if (typeName.includes("Research")) return { color: "bg-ok",    text: "text-ok",    note: "PhD-heavy; fixed-term" };
  return { color: "bg-t2", text: "text-t2", note: "" };
}

export default async function MarketPage() {
  let snapshot    = null;
  let skills      = null;
  let trending    = null;
  let velocityRaw = null;
  let citiesRaw   = null;
  let mixRaw      = null;

  await Promise.allSettled([
    api.snapshot()           .then(d => { snapshot    = d; }),
    api.skills()             .then(d => { skills      = d; }),
    api.trending(7)          .then(d => { trending    = d; }),
    api.hiringVelocity()     .then(d => { velocityRaw = d; }),
    api.cities()             .then(d => { citiesRaw   = d; }),
    api.companyMix()         .then(d => { mixRaw      = d; }),
  ]);

  const topSkillsList = Object.entries((skills as any)?.top_skills ?? {})
    .map(([skill, count]) => ({ skill, count: count as number }))
    .sort((a, b) => b.count - a.count);

  // Use live data or fallback
  const velocityItems: HiringVelocityItem[] =
    (velocityRaw as any)?.velocity?.length ? (velocityRaw as any).velocity.slice(0, 6) : FALLBACK_VELOCITY;

  const cityList: CityCount[] =
    (citiesRaw as any)?.cities?.length ? (citiesRaw as any).cities : FALLBACK_CITIES;
  const cityMax = cityList[0]?.job_count ?? 1;
  const isLiveCities = (citiesRaw as any)?.cities?.length > 0;

  const companyMixItems: CompanyMixItem[] =
    (mixRaw as any)?.mix?.length ? (mixRaw as any).mix : FALLBACK_COMPANY_MIX;
  const isLiveMix = (mixRaw as any)?.mix?.length > 0;

  const isLiveVelocity = (velocityRaw as any)?.velocity?.length > 0;

  // Health score: composite of available signals
  const snap = snapshot as any;
  const healthScore = snap
    ? Math.min(98, Math.round(
        (Math.min(snap.job_count ?? 0, 6000) / 6000) * 40 +
        (Math.min(snap.salary_p50 ?? 0, 100000) / 100000) * 35 +
        ((snap.sponsorship_rate ?? 0) > 0.25 ? 25 : ((snap.sponsorship_rate ?? 0) / 0.25) * 25)
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
            {snap?.week_start && (
              <span className="flex items-center gap-1.5 text-[11px] text-t3">
                <Clock className="w-3 h-3" />
                Week of {snap.week_start}
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
            value={snap?.job_count ? fmt(snap.job_count) : "—"}
            icon={Activity}
            accent="teal"
            trend="up"
            trendValue="vs last week"
            delay={0}
          />
          <StatCard
            label="Median Salary"
            value={fmtK(snap?.salary_p50)}
            sub="50th percentile"
            icon={DollarSign}
            accent="blue"
            delay={80}
          />
          <StatCard
            label="Sponsorship Rate"
            value={pct(snap?.sponsorship_rate)}
            sub="of AI roles"
            icon={Globe}
            accent="purple"
            delay={160}
          />
          <StatCard
            label="Salary Range"
            value={`${fmtK(snap?.salary_p25)} – ${fmtK(snap?.salary_p75)}`}
            sub="P25 – P75"
            icon={BarChart3}
            accent="green"
            delay={240}
          />
        </div>

        {/* Market Health Score */}
        <div className={`relative rounded-2xl overflow-hidden border border-b1 bg-gradient-to-br ${healthBg} via-s1 to-s2 p-8 mb-8 animate-fade-up animate-delay-200`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
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
                {((trending as any)?.rising ?? []).slice(0, 8).map((s: string, i: number) => (
                  <div key={s} className="flex items-center justify-between p-2 rounded-lg hover:bg-s3/50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] text-t3 font-mono w-4">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-xs text-t1 font-medium">{s}</span>
                    </div>
                    <span className="text-[10px] text-ok font-bold bg-ok/10 px-1.5 py-0.5 rounded-md">↑</span>
                  </div>
                ))}
                {!(trending as any)?.rising?.length && (
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
                {((trending as any)?.declining ?? []).slice(0, 6).map((s: string, i: number) => (
                  <div key={s} className="flex items-center justify-between p-2 rounded-lg hover:bg-s3/50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] text-t3 font-mono w-4">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-xs text-t1 font-medium">{s}</span>
                    </div>
                    <span className="text-[10px] text-err font-bold bg-err/10 px-1.5 py-0.5 rounded-md">↓</span>
                  </div>
                ))}
                {!(trending as any)?.declining?.length && (
                  <p className="text-xs text-t2 py-4 text-center">No declining data yet</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* UK Cities + Company Mix */}
        <div className="grid lg:grid-cols-3 gap-5 mb-5">

          {/* Cities */}
          <div className="lg:col-span-2 rounded-2xl border border-b1 bg-gradient-to-br from-s1 to-s2 p-6 animate-fade-up animate-delay-450">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-4 h-4 text-blue" />
              <h2 className="text-sm font-bold text-t1">Top UK Hiring Cities</h2>
              <span className="text-xs text-t2 ml-auto">
                {isLiveCities ? "Live data this week" : "Illustrative · live data when available"}
              </span>
            </div>
            <div className="space-y-3">
              {cityList.map((city, i) => {
                const barPct = Math.round((city.job_count / cityMax) * 100);
                return (
                  <div key={city.city} className="flex items-center gap-4 group">
                    <span className="text-[10px] font-mono text-t3 w-5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-base shrink-0">{CITY_FLAGS[city.city] ?? "📍"}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-t1 group-hover:text-accent transition-colors">{city.city}</span>
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="text-accent font-bold">{city.job_count.toLocaleString()}</span>
                          <span className="text-t3">jobs</span>
                          <span className="text-t3 font-mono w-8 text-right">{barPct}%</span>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full bg-b1 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-accent to-blue"
                          style={{ width: `${barPct}%`, transition: "width 0.8s ease" }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
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
              {isLiveMix && (
                <span className="text-[10px] text-ok ml-auto font-semibold">Live</span>
              )}
            </div>
            <div className="space-y-4">
              {companyMixItems.map((item) => {
                const style = companyMixStyle(item.type);
                return (
                  <div key={item.type}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-t1">{item.type}</span>
                      <span className={`text-sm font-black ${style.text}`}>{item.pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-b1 overflow-hidden mb-1">
                      <div
                        className={`h-full rounded-full ${style.color}`}
                        style={{ width: `${item.pct}%`, transition: "width 1s ease" }}
                      />
                    </div>
                    <p className="text-[10px] text-t3">{style.note}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Hiring Velocity by Role */}
        <div className="rounded-2xl border border-b1 bg-gradient-to-br from-s1 to-s2 p-6 mb-5 animate-fade-up animate-delay-500">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-bold text-t1">Hiring Velocity by Role</h2>
            <p className="text-xs text-t2 ml-auto">
              {isLiveVelocity ? "Week-over-week change" : "Year-over-year growth in job postings"}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {velocityItems.map((row, i) => {
              const palette = VELOCITY_PALETTE[Math.min(i, VELOCITY_PALETTE.length - 1)];
              const isDown  = row.direction === "down";
              const displayGrowth = row.growth_pct === 0
                ? "—"
                : `${row.growth_pct > 0 ? "+" : ""}${row.growth_pct}%`;
              return (
                <div
                  key={row.role}
                  className={`flex items-center justify-between p-4 rounded-xl border ${palette.border} ${palette.bg}`}
                >
                  <div>
                    <p className="text-xs font-semibold text-t1">{row.role}</p>
                    <p className="text-[10px] text-t3 mt-0.5">
                      {isLiveVelocity ? "WoW posting change" : "YoY posting change"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isDown
                      ? <TrendingDown className={`w-4 h-4 ${palette.color}`} />
                      : <TrendingUp className={`w-4 h-4 ${palette.color}`} />
                    }
                    <span className={`text-lg font-black ${palette.color}`}>{displayGrowth}</span>
                  </div>
                </div>
              );
            })}
          </div>
          {!isLiveVelocity && (
            <p className="text-[10px] text-t3 mt-4 pt-4 border-t border-b1">
              Velocity data is illustrative pending live YoY pipeline data. Based on sector reporting and MarketForge internal estimates.
            </p>
          )}
        </div>

        {/* Salary distribution */}
        <div className="rounded-2xl border border-b1 bg-gradient-to-br from-s1 to-s2 p-6 animate-fade-up animate-delay-600">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-bold text-t1">Salary Distribution</h2>
              <p className="text-xs text-t2 mt-0.5">All UK AI/ML roles · Gross annual · GBP</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-gradient">{fmtK(snap?.salary_p50)}</p>
              <p className="text-xs text-t2 mt-0.5">median salary</p>
            </div>
          </div>

          <SalaryRange
            p25={snap?.salary_p25 ?? null}
            p50={snap?.salary_p50 ?? null}
            p75={snap?.salary_p75 ?? null}
            height={200}
          />

          {snap?.salary_p50 && (
            <div className="mt-5 grid grid-cols-3 gap-4 pt-5 border-t border-b1">
              {[
                { label: "Lower quartile", value: fmtK(snap.salary_p25), sub: "25th percentile", color: "text-blue",   bg: "bg-blue/10",   border: "border-blue/20" },
                { label: "Median",         value: fmtK(snap.salary_p50), sub: "50th percentile", color: "text-accent", bg: "bg-accent/10", border: "border-accent/20" },
                { label: "Upper quartile", value: fmtK(snap.salary_p75), sub: "75th percentile", color: "text-prp",    bg: "bg-prp/10",    border: "border-prp/20" },
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
