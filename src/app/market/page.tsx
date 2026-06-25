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
import type { HiringVelocityItem, CityCount } from "@/lib/api";
import { fmt, fmtK, pct } from "@/lib/utils";
import { SkillBar } from "@/components/charts/skill-bar";
import { SalaryRange } from "@/components/charts/salary-range";
import { StatCard } from "@/components/cards/stat-card";
import { PageHero } from "@/components/layout/page-hero";
import {
  BarChart3, TrendingUp, TrendingDown, DollarSign,
  Globe, Activity, Clock, Sparkles, MapPin,
} from "lucide-react";

export const revalidate = 300;

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

const FALLBACK_VELOCITY: HiringVelocityItem[] = [
  { role: "AI / LLM Engineer",  growth_pct: 62,  direction: "up",   role_category: "ai_engineer"    },
  { role: "MLOps / Platform",   growth_pct: 44,  direction: "up",   role_category: "mlops_engineer" },
  { role: "AI Safety Engineer", growth_pct: 38,  direction: "up",   role_category: "ai_safety"      },
  { role: "ML Engineer",        growth_pct: 18,  direction: "up",   role_category: "ml_engineer"    },
  { role: "Data Scientist",     growth_pct: 6,   direction: "up",   role_category: "data_scientist" },
  { role: "Data Analyst",       growth_pct: -4,  direction: "down", role_category: "data_analyst"   },
];

const CITY_FLAGS: Record<string, string> = {
  London: "🏙️", Manchester: "🌃", Cambridge: "🎓", Edinburgh: "🏰",
  Bristol: "🌉", Oxford: "📚", Birmingham: "🏢", Leeds: "🌆",
  Glasgow: "🏛️", Liverpool: "⚓", Sheffield: "⚒️", Nottingham: "🏹",
};

const VELOCITY_COLORS = [
  "text-accent", "text-blue", "text-prp", "text-ok", "text-t2", "text-err",
];

export default async function MarketPage() {
  let snapshot    = null;
  let skills      = null;
  let trending    = null;
  let velocityRaw = null;
  let citiesRaw   = null;

  await Promise.allSettled([
    api.snapshot()       .then(d => { snapshot    = d; }),
    api.skills()         .then(d => { skills      = d; }),
    api.trending(7)      .then(d => { trending    = d; }),
    api.hiringVelocity() .then(d => { velocityRaw = d; }),
    api.cities()         .then(d => { citiesRaw   = d; }),
  ]);

  const topSkillsList = Object.entries((skills as any)?.top_skills ?? {})
    .map(([skill, count]) => ({ skill, count: count as number }))
    .sort((a, b) => b.count - a.count);

  const velocityItems: HiringVelocityItem[] =
    (velocityRaw as any)?.velocity?.length ? (velocityRaw as any).velocity.slice(0, 6) : FALLBACK_VELOCITY;
  const isLiveVelocity = (velocityRaw as any)?.velocity?.length > 0;

  const cityList: CityCount[] =
    (citiesRaw as any)?.cities?.length ? (citiesRaw as any).cities : FALLBACK_CITIES;
  const cityMax = cityList[0]?.job_count ?? 1;
  const isLiveCities = (citiesRaw as any)?.cities?.length > 0;

  const snap = snapshot as any;

  return (
    <div className="pt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Hero */}
        <PageHero
          badge="Live Intelligence"
          title="UK AI Job Market"
          titleAccent="Overview"
          subtitle="Real-time aggregate view of the UK AI/ML hiring landscape. Data refreshed twice weekly from Adzuna, Reed, and specialist boards."
          imageSrc="/images/illustrations/hero-market.webp"
        >
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-400/30 bg-emerald-400/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-semibold text-emerald-300">Live data</span>
            </div>
            {snap?.week_start && (
              <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <Clock className="w-3 h-3" />
                Week of {snap.week_start}
              </span>
            )}
            <span className="text-[11px] text-slate-500">· 3 data sources · automated pipeline</span>
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

        {/* Skills chart + Trending sidebar */}
        <div className="grid lg:grid-cols-3 gap-5 mb-5">
          <div className="lg:col-span-2 bg-s1 rounded-2xl border border-b1 p-6 shadow-card animate-fade-up animate-delay-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm font-bold text-t1">Top In-Demand Skills</h2>
                <p className="text-xs text-t2 mt-0.5">By job posting frequency this week</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-accent/8 text-accent font-semibold border border-accent/20">
                {topSkillsList.length > 0 ? `${topSkillsList.length} tracked` : "Live"}
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
            {/* Rising skills */}
            <div className="bg-s1 rounded-2xl border border-b1 p-5 flex-1 shadow-card animate-fade-up animate-delay-350">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-lg bg-ok/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-ok" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-t1">Rising Skills</h2>
                  <p className="text-[10px] text-t2">Gaining week-over-week</p>
                </div>
              </div>
              <div className="space-y-1">
                {((trending as any)?.rising ?? []).slice(0, 8).map((s: string, i: number) => (
                  <div key={s} className="flex items-center justify-between p-2 rounded-lg hover:bg-s2 transition-colors">
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

            {/* Cooling skills */}
            <div className="bg-s1 rounded-2xl border border-b1 p-5 flex-1 shadow-card animate-fade-up animate-delay-400">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-lg bg-err/10 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-err" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-t1">Cooling Skills</h2>
                  <p className="text-[10px] text-t2">Losing momentum</p>
                </div>
              </div>
              <div className="space-y-1">
                {((trending as any)?.declining ?? []).slice(0, 6).map((s: string, i: number) => (
                  <div key={s} className="flex items-center justify-between p-2 rounded-lg hover:bg-s2 transition-colors">
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

        {/* UK Cities */}
        <div className="bg-s1 rounded-2xl border border-b1 p-6 mb-5 shadow-card animate-fade-up animate-delay-400">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-4 h-4 text-blue" />
            <h2 className="text-sm font-bold text-t1">Top UK Hiring Cities</h2>
            <span className="text-xs text-t3 ml-auto">
              {isLiveCities ? "Live data this week" : "Illustrative · live data when available"}
            </span>
          </div>
          <div className="space-y-3">
            {cityList.map((city, i) => {
              const barPct = Math.round((city.job_count / cityMax) * 100);
              return (
                <div key={city.city} className="flex items-center gap-4">
                  <span className="text-[10px] font-mono text-t3 w-5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-base shrink-0">{CITY_FLAGS[city.city] ?? "📍"}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-t1">{city.city}</span>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="text-accent font-bold">{city.job_count.toLocaleString()}</span>
                        <span className="text-t3">jobs</span>
                        <span className="text-t3 font-mono w-8 text-right">{barPct}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-s2 overflow-hidden">
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
            London dominates UK AI hiring. Strong hubs in Cambridge (biotech AI), Edinburgh (NLP/fintech), Bristol (robotics).
          </p>
        </div>

        {/* Hiring Velocity */}
        <div className="bg-s1 rounded-2xl border border-b1 p-6 mb-5 shadow-card animate-fade-up animate-delay-500">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-bold text-t1">Hiring Velocity by Role</h2>
            <p className="text-xs text-t2 ml-auto">
              {isLiveVelocity ? "Week-over-week change" : "Year-over-year growth"}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {velocityItems.map((row, i) => {
              const colorClass = VELOCITY_COLORS[Math.min(i, VELOCITY_COLORS.length - 1)];
              const isDown = row.direction === "down";
              const displayGrowth = row.growth_pct === 0
                ? "—"
                : `${row.growth_pct > 0 ? "+" : ""}${row.growth_pct}%`;
              return (
                <div
                  key={row.role}
                  className="flex items-center justify-between p-4 rounded-xl bg-s2 border border-b1"
                >
                  <div>
                    <p className="text-xs font-semibold text-t1">{row.role}</p>
                    <p className="text-[10px] text-t3 mt-0.5">
                      {isLiveVelocity ? "WoW change" : "YoY change"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isDown
                      ? <TrendingDown className={`w-4 h-4 ${colorClass}`} />
                      : <TrendingUp className={`w-4 h-4 ${colorClass}`} />
                    }
                    <span className={`text-lg font-black ${colorClass}`}>{displayGrowth}</span>
                  </div>
                </div>
              );
            })}
          </div>
          {!isLiveVelocity && (
            <p className="text-[10px] text-t3 mt-4 pt-4 border-t border-b1">
              Illustrative pending live YoY data. Based on sector reporting and MarketForge internal estimates.
            </p>
          )}
        </div>

        {/* Salary distribution */}
        <div className="bg-s1 rounded-2xl border border-b1 p-6 shadow-card animate-fade-up animate-delay-600">
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
                { label: "Lower quartile", value: fmtK(snap.salary_p25), sub: "25th percentile", color: "text-blue",   bg: "bg-blue/8",   border: "border-blue/15" },
                { label: "Median",         value: fmtK(snap.salary_p50), sub: "50th percentile", color: "text-accent", bg: "bg-accent/8", border: "border-accent/15" },
                { label: "Upper quartile", value: fmtK(snap.salary_p75), sub: "75th percentile", color: "text-prp",    bg: "bg-prp/8",    border: "border-prp/15" },
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
