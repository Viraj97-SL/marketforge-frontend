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
import type {
  HiringVelocityItem, CityCount, VacancyTrendData,
  SalaryBenchmarkData,
  GraduateOutcomesData, EntryLevelSkillShiftData,
  EntryLevelUniversalSkillsData, EntryLevelCompanyMixData, SalaryData,
  SnapshotHistoryData,
} from "@/lib/api";
import Link from "next/link";
import { fmt, fmtK, pct } from "@/lib/utils";
import { MarketTrend } from "@/components/charts/market-trend";
import { TrendLine } from "@/components/charts/trend-line";
import { StatCard } from "@/components/cards/stat-card";
import { PageHero } from "@/components/layout/page-hero";
import { UKMap } from "@/components/illustrations/uk-map";
import { MarketStory } from "@/components/market-story/market-story";
import {
  BarChart3, TrendingUp, TrendingDown, DollarSign,
  Globe, Activity, Clock, Sparkles, MapPin, ArrowRight, LineChart,
} from "lucide-react";

export const revalidate = 300;

const CITY_FLAGS: Record<string, string> = {
  London: "🏙️", Manchester: "🌃", Cambridge: "🎓", Edinburgh: "🏰",
  Bristol: "🌉", Oxford: "📚", Birmingham: "🏢", Leeds: "🌆",
  Glasgow: "🏛️", Liverpool: "⚓", Sheffield: "⚒️", Nottingham: "🏹",
};

const VELOCITY_COLORS = [
  "text-accent", "text-blue", "text-prp", "text-ok", "text-t2", "text-err",
];

export default async function MarketPage() {
  let snapshot     = null;
  let skills       = null;
  let trending     = null;
  let velocityRaw  = null;
  let citiesRaw    = null;
  let vacancyTrendRaw = null;
  let salaryBenchRaw  = null;
  let graduateOutcomesRaw = null;
  let skillShiftRaw       = null;
  let universalSkillsRaw  = null;
  let entryCompanyMixRaw  = null;
  let juniorSalaryRaw     = null;
  let snapshotHistoryRaw  = null;

  await Promise.allSettled([
    api.snapshot()          .then(d => { snapshot        = d; }),
    api.skills()            .then(d => { skills          = d; }),
    api.trending(7)         .then(d => { trending        = d; }),
    api.hiringVelocity()    .then(d => { velocityRaw     = d; }),
    api.cities()            .then(d => { citiesRaw       = d; }),
    api.vacancyTrend()      .then(d => { vacancyTrendRaw = d; }),
    api.salaryBenchmark()   .then(d => { salaryBenchRaw  = d; }),
    api.graduateOutcomes()  .then(d => { graduateOutcomesRaw = d; }),
    api.entryLevelSkillShift()      .then(d => { skillShiftRaw      = d; }),
    api.entryLevelUniversalSkills() .then(d => { universalSkillsRaw = d; }),
    api.entryLevelCompanyMix()      .then(d => { entryCompanyMixRaw = d; }),
    api.salary("all", "junior", "all") .then(d => { juniorSalaryRaw = d; }),
    api.snapshotHistory(26) .then(d => { snapshotHistoryRaw = d; }),
  ]);

  const topSkillsList = Object.entries((skills as any)?.top_skills ?? {})
    .map(([skill, count]) => ({ skill, count: count as number }))
    .sort((a, b) => b.count - a.count);

  const velocityItems: HiringVelocityItem[] = (velocityRaw as any)?.velocity?.length
    ? (velocityRaw as any).velocity.slice(0, 6)
    : [];
  const isLiveVelocity = velocityItems.length > 0 && velocityItems.some((v) => v.direction !== "neutral");

  const vacancyTrend = vacancyTrendRaw as VacancyTrendData | null;
  const vacancyTrendPoints = (vacancyTrend?.trend ?? []).slice(-12).map((p) => ({
    label: p.month.slice(2),
    value: p.vacancies_index,
  }));

  const cityList: CityCount[] = (citiesRaw as any)?.cities ?? [];
  const cityMax = cityList[0]?.job_count ?? 1;
  const isLiveCities = cityList.length > 0;

  const snap = snapshot as any;

  const salaryBenchmark = salaryBenchRaw as SalaryBenchmarkData | null;
  const asheBenchmark = salaryBenchmark?.benchmarks?.[0] ?? null;

  const graduateOutcomes = graduateOutcomesRaw as GraduateOutcomesData | null;
  const skillShift = skillShiftRaw as EntryLevelSkillShiftData | null;
  const universalSkills = universalSkillsRaw as EntryLevelUniversalSkillsData | null;
  const entryCompanyMix = entryCompanyMixRaw as EntryLevelCompanyMixData | null;
  const juniorSalary = juniorSalaryRaw as SalaryData | null;
  const snapshotHistory = snapshotHistoryRaw as SnapshotHistoryData | null;

  return (
    <div className="pt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Hero */}
        <PageHero
          badge="Live Intelligence"
          title="UK AI Job Market"
          titleAccent="Overview"
          subtitle="Real-time aggregate view of the UK AI/ML hiring landscape. Data refreshed twice weekly from Adzuna, Reed, and specialist boards."
          imageSrc="https://images.unsplash.com/photo-1506501139174-099022df5260?w=1920&q=80&auto=format&fit=crop"
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

        {/* Graduate-reality narrative */}
        <MarketStory
          graduateOutcomes={graduateOutcomes}
          skillShift={skillShift}
          universalSkills={universalSkills}
          entryCompanyMix={entryCompanyMix}
          juniorSalaryP25={juniorSalary?.salary_p25 ?? null}
          asheBenchmark={asheBenchmark}
        />

        {/* Full breakdown */}
        <div className="flex items-center gap-3 mb-6 mt-10">
          <div className="h-px flex-1 bg-b1" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-t3">Full breakdown</span>
          <div className="h-px flex-1 bg-b1" />
        </div>

        {/* Market Over Time — real weekly_snapshots history, not a snapshot-in-time chart */}
        <div className="bg-s1 rounded-2xl border border-b1 p-6 mb-5 shadow-card animate-fade-up animate-delay-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <LineChart className="w-4 h-4 text-accent" />
              <div>
                <h2 className="text-sm font-bold text-t1">Market Over Time</h2>
                <p className="text-xs text-t2 mt-0.5">Weekly posting volume & median salary — last {snapshotHistory?.weeks.length ?? 0} weeks</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[10px] text-t2">
              <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded bg-accent inline-block" />Postings</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded bg-prp inline-block" style={{ borderBottom: "2px dashed" }} />Median salary</span>
            </div>
          </div>
          {snapshotHistory && snapshotHistory.weeks.length > 1 ? (
            <MarketTrend weeks={snapshotHistory.weeks} height={240} />
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-t2 text-sm gap-2">
              <Sparkles className="w-8 h-8 text-t3" />
              Trend builds up as more weekly snapshots accumulate
            </div>
          )}
        </div>

        {/* Skills teaser — full ranking, rising/cooling live on /skills */}
        <div className="bg-s1 rounded-2xl border border-b1 p-6 mb-5 shadow-card animate-fade-up animate-delay-350">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-t1">Top Skills This Week</h2>
            <Link href="/skills" className="text-xs text-accent font-semibold flex items-center gap-1 hover:gap-1.5 transition-all">
              Full skills breakdown <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {topSkillsList.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {topSkillsList.slice(0, 5).map((s, i) => (
                <div key={s.skill} className="p-3 rounded-xl bg-s2 border border-b1">
                  <p className="text-[10px] text-t3 font-mono mb-1">{String(i + 1).padStart(2, "0")}</p>
                  <p className="text-xs font-semibold text-t1">{s.skill}</p>
                  <p className="text-[10px] text-t2 mt-0.5">{s.count.toLocaleString()} postings</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-t2 py-4 text-center">No skill data yet — pipeline hasn&apos;t run</p>
          )}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-b1 text-[10px] text-t2">
            <span>{((trending as any)?.rising ?? []).length} rising</span>
            <span>·</span>
            <span>{((trending as any)?.declining ?? []).length} cooling</span>
            <span>· see /skills for the full rising &amp; cooling lists</span>
          </div>
        </div>

        {/* UK Cities — map + list */}
        <div className="bg-s1 rounded-2xl border border-b1 p-6 mb-5 shadow-card animate-fade-up animate-delay-400">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-4 h-4 text-blue" />
            <h2 className="text-sm font-bold text-t1">Top UK Hiring Cities</h2>
            <span className="text-xs text-t3 ml-auto">{isLiveCities ? "Live data this week" : ""}</span>
          </div>

          {isLiveCities ? (
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* UK map illustration */}
              <UKMap className="h-80 lg:h-96" showLabels animated cities={cityList} />

              {/* City bar list */}
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
                {cityList[0] && (
                  <p className="text-[10px] text-t3 mt-4 pt-4 border-t border-b1">
                    {cityList[0].city} leads UK AI/ML hiring this run with {cityList[0].job_count.toLocaleString()} postings
                    {cityList[1] ? ` — ${Math.round((cityList[1].job_count / cityList[0].job_count) * 100)}% of that in ${cityList[1].city} next.` : "."}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-xs text-t3 py-10 text-center">Not enough live city data yet — check back after the next pipeline run.</p>
          )}
        </div>

        {/* Hiring Velocity */}
        <div className="bg-s1 rounded-2xl border border-b1 p-6 mb-5 shadow-card animate-fade-up animate-delay-500">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-bold text-t1">Hiring Velocity by Role</h2>
            <p className="text-xs text-t2 ml-auto">
              {isLiveVelocity ? "Week-over-week change" : vacancyTrend ? "ONS national trend" : ""}
            </p>
          </div>

          {isLiveVelocity ? (
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
                      <p className="text-[10px] text-t3 mt-0.5">WoW change</p>
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
          ) : vacancyTrendPoints.length > 0 ? (
            <>
              <TrendLine data={vacancyTrendPoints} height={220} />
              <p className="text-[10px] text-t3 mt-4 pt-4 border-t border-b1">
                {vacancyTrend?.series_label} · {vacancyTrend?.source}. {vacancyTrend?.methodology}
                {" "}Our own per-role week-over-week figures will appear here once the sample has enough
                weekly history to compare.
              </p>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-t2 text-sm gap-2">
              <Sparkles className="w-8 h-8 text-t3" />
              No velocity data yet — pipeline hasn&apos;t run
            </div>
          )}
        </div>

        {/* Salary teaser — full role/experience/region breakdown lives on /salary */}
        <div className="bg-s1 rounded-2xl border border-b1 p-6 shadow-card animate-fade-up animate-delay-600">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-bold text-t1">Salary at a Glance</h2>
              <p className="text-xs text-t2 mt-0.5">All UK AI/ML roles · Gross annual · GBP</p>
            </div>
            <Link href="/salary" className="text-xs text-accent font-semibold flex items-center gap-1 hover:gap-1.5 transition-all shrink-0">
              By role, experience &amp; region <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Lower quartile", value: fmtK(snap?.salary_p25), sub: "25th percentile", color: "text-blue",   bg: "bg-blue/8",   border: "border-blue/15" },
              { label: "Median",         value: fmtK(snap?.salary_p50), sub: "50th percentile", color: "text-accent", bg: "bg-accent/8", border: "border-accent/15" },
              { label: "Upper quartile", value: fmtK(snap?.salary_p75), sub: "75th percentile", color: "text-prp",    bg: "bg-prp/8",    border: "border-prp/15" },
            ].map((item) => (
              <div key={item.label} className={`text-center p-4 rounded-xl border ${item.border} ${item.bg}`}>
                <p className={`text-2xl font-black ${item.color}`}>{item.value}</p>
                <p className="text-xs text-t1 font-semibold mt-1">{item.label}</p>
                <p className="text-[10px] text-t2 mt-0.5">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
