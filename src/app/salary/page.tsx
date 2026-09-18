import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI & ML Salary Guide UK 2026",
  description:
    "UK AI/ML salary benchmarks by role: median, P25–P75 ranges, and remote vs on-site comparisons. Real data from live job postings.",
  alternates: { canonical: "https://marketforge.digital/salary" },
  openGraph: {
    title: "AI & ML Salary Guide UK 2026 | MarketForge AI",
    description:
      "Data-driven UK AI/ML salary guide — P25, median, P75 ranges for ML Engineers, Data Scientists, AI Researchers, and more.",
    url: "https://marketforge.digital/salary",
  },
};

import { api } from "@/lib/api";
import type { SalaryData, SnapshotHistoryData, SalaryBenchmarkData } from "@/lib/api";
import { fmtK } from "@/lib/utils";
import { ROLE_CONFIGS } from "@/lib/roles";
import { SalaryRange } from "@/components/charts/salary-range";
import { MarketTrend } from "@/components/charts/market-trend";
import { PageHero } from "@/components/layout/page-hero";
import { DollarSign, Globe, TrendingUp, Info, Laptop, GraduationCap, Code2, Layers, Star, LineChart, Landmark } from "lucide-react";

export const revalidate = 300;

const EXPERIENCE_LEVELS = [
  { slug: "junior",    label: "Junior",           years: "0–2 yrs", Icon: GraduationCap, color: "text-blue",   bg: "bg-blue/8",   border: "border-blue/20",   note: "Grad schemes & apprenticeships included" },
  { slug: "mid",       label: "Mid-Level",        years: "2–5 yrs", Icon: Code2,         color: "text-accent", bg: "bg-accent/8", border: "border-accent/20", note: "Owns features independently" },
  { slug: "senior",    label: "Senior",           years: "5–8 yrs", Icon: Layers,        color: "text-prp",    bg: "bg-prp/8",    border: "border-prp/20",    note: "Technical leadership & mentoring" },
  { slug: "principal", label: "Principal / Staff",years: "8+ yrs",  Icon: Star,          color: "text-warn",   bg: "bg-warn/8",   border: "border-warn/20",   note: "Org-wide impact, IC track" },
] as const;

// Real UK AI hiring hubs — queried live against market.jobs.location, not a
// hardcoded multiplier table. A region only renders if it clears
// MIN_SALARY_SAMPLE_SIZE live GBP-denominated postings this run.
const UK_REGIONS = [
  { region: "London",      apiSlug: "London"     },
  { region: "Cambridge",   apiSlug: "Cambridge"  },
  { region: "Oxford",      apiSlug: "Oxford"     },
  { region: "Manchester",  apiSlug: "Manchester" },
  { region: "Edinburgh",   apiSlug: "Edinburgh"  },
  { region: "Bristol",     apiSlug: "Bristol"    },
] as const;

const WORK_MODELS = [
  { model: "remote", label: "Fully Remote",      note: "Anchored to company HQ location",    color: "text-prp",   border: "border-prp/20",   bg: "bg-prp/5"   },
  { model: "hybrid", label: "Hybrid",             note: "Standard in most UK AI roles today", color: "text-accent", border: "border-accent/20", bg: "bg-accent/5" },
  { model: "onsite", label: "Fully On-site",      note: "London roles may compensate more",   color: "text-blue",  border: "border-blue/20",   bg: "bg-blue/5"  },
] as const;

export default async function SalaryPage() {
  const [overallResult, historyResult, benchmarkResult, ...roleResults] = await Promise.allSettled([
    // All-time, same source as every panel below (role/experience/region/work-model) —
    // this used to be api.snapshot() (the latest week's snapshot row), which could
    // show a different median here than the "Salary by Role" panel a few pixels down.
    api.salary("all", "all", "all"),
    api.snapshotHistory(26),
    api.salaryBenchmark(),
    ...ROLE_CONFIGS.map(r => api.salary(r.apiSlug, "all", "all")),
  ]);

  const [expResults, regionResults, workModelResults] = await Promise.all([
    Promise.allSettled(EXPERIENCE_LEVELS.map(e => api.salary("all", e.slug, "all"))),
    Promise.allSettled(UK_REGIONS.map(r => api.salary("all", "all", r.apiSlug))),
    Promise.allSettled(WORK_MODELS.map(w => api.salary("all", "all", "all", w.model))),
  ]);

  const snap = overallResult.status === "fulfilled" ? (overallResult.value as SalaryData) : null;
  const overallN = snap?.salary_sample_size ?? 0;

  const snapshotHistory = historyResult.status === "fulfilled" ? (historyResult.value as SnapshotHistoryData) : null;
  const historyWeeks = (snapshotHistory?.weeks ?? []).filter((w) => w.salary_p50 != null);

  const salaryBenchmark = benchmarkResult.status === "fulfilled" ? (benchmarkResult.value as SalaryBenchmarkData) : null;
  const asheBenchmark = salaryBenchmark?.benchmarks?.[0] ?? null;

  // No fallback numbers here — a role/band/region/work-model with no live
  // sample this run renders an honest "not enough live data yet" state
  // instead of a plausible-looking fabricated figure.
  type LiveSalary = { p25: number | null; p50: number | null; p75: number | null; n: number; live: boolean };
  const toLive = (res: PromiseSettledResult<SalaryData>): LiveSalary => {
    const d = res.status === "fulfilled" ? res.value : null;
    return {
      p25: d?.salary_p25 ?? null,
      p50: d?.salary_p50 ?? null,
      p75: d?.salary_p75 ?? null,
      n: d?.salary_sample_size ?? 0,
      live: d?.salary_p50 != null,
    };
  };

  const roleSalary: Record<string, LiveSalary> = {};
  ROLE_CONFIGS.forEach((r, i) => { roleSalary[r.apiSlug] = toLive(roleResults[i]); });

  const expSalary: Record<string, LiveSalary> = {};
  EXPERIENCE_LEVELS.forEach((e, i) => { expSalary[e.slug] = toLive(expResults[i]); });

  const regionSalary: Record<string, LiveSalary> = {};
  UK_REGIONS.forEach((r, i) => { regionSalary[r.apiSlug] = toLive(regionResults[i]); });

  const workModelSalary: Record<string, LiveSalary> = {};
  WORK_MODELS.forEach((w, i) => { workModelSalary[w.model] = toLive(workModelResults[i]); });

  const medianSalary = snap?.salary_p50 ?? null;

  return (
    <div className="pt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Hero */}
        <PageHero
          badge="Compensation Intelligence"
          title="UK AI Salary"
          titleAccent="Benchmarks"
          subtitle="Salary percentiles derived from live job postings with stated compensation. All figures are gross annual salary in GBP. Updated each pipeline run."
          imageSrc="/images/page-salary-hero.avif"
        >
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20">
              <span className="text-xl font-black text-white">{fmtK(medianSalary)}</span>
              <div>
                <p className="text-[10px] text-slate-300 font-semibold leading-none">Market Median</p>
                <p className="text-[10px] text-slate-500">all roles · all seniorities</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20">
              <span className="text-sm font-bold text-blue-300">{fmtK(snap?.salary_p25 ?? null)}</span>
              <span className="text-slate-500 text-xs">–</span>
              <span className="text-sm font-bold text-violet-300">{fmtK(snap?.salary_p75 ?? null)}</span>
              <p className="text-[10px] text-slate-500">P25 – P75</p>
            </div>
          </div>
        </PageHero>

        {/* Hero salary chart */}
        <div className="bg-s1 rounded-2xl border border-b1 p-8 mb-8 shadow-card animate-fade-up animate-delay-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6">
            <div>
              <p className="section-label mb-2">Market Distribution</p>
              <p className="text-5xl font-black text-t1 tracking-tight">{fmtK(medianSalary)}</p>
              <p className="text-t2 mt-1 text-sm">
                Median UK AI/ML salary — all roles, all seniorities
                {overallN > 0 && <span className="text-t3"> · n={overallN.toLocaleString()}</span>}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-s2 border border-b1 text-right">
                <p className="text-xl font-bold text-blue">{fmtK(snap?.salary_p25 ?? null)}</p>
                <p className="text-xs text-t2">25th percentile</p>
              </div>
              <div className="p-4 rounded-xl bg-s2 border border-b1 text-right">
                <p className="text-xl font-bold text-prp">{fmtK(snap?.salary_p75 ?? null)}</p>
                <p className="text-xs text-t2">75th percentile</p>
              </div>
            </div>
          </div>
          {snap?.salary_p50 != null ? (
            <SalaryRange
              p25={snap.salary_p25}
              p50={snap.salary_p50}
              p75={snap.salary_p75}
              height={160}
            />
          ) : (
            <p className="text-xs text-t3 py-6 text-center border-t border-b1">
              Live salary distribution unavailable right now — check back after the next pipeline run.
            </p>
          )}
        </div>

        {/* Salary trend over time — real weekly_snapshots history, not a single-week figure */}
        <div className="bg-s1 rounded-2xl border border-b1 p-6 mb-6 shadow-card animate-fade-up animate-delay-100">
          <div className="flex items-center gap-2 mb-1">
            <LineChart className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-bold text-t1">Median Salary Over Time</h2>
          </div>
          <p className="text-xs text-t2 mb-6">Weekly posting volume &amp; median salary · last {historyWeeks.length || 0} weeks with live salary data</p>
          {historyWeeks.length > 1 ? (
            <MarketTrend weeks={historyWeeks} height={220} />
          ) : (
            <p className="text-xs text-t3 py-10 text-center">Not enough weekly history yet to chart a trend.</p>
          )}
        </div>

        {/* ONS national comparison — real government benchmark, not a live-postings figure */}
        {asheBenchmark && (
          <div className="bg-s1 rounded-2xl border border-b1 p-6 mb-6 shadow-card animate-fade-up animate-delay-150">
            <div className="flex items-center gap-2 mb-1">
              <Landmark className="w-4 h-4 text-blue" />
              <h2 className="text-sm font-bold text-t1">How This Compares to the UK National Average</h2>
            </div>
            <p className="text-xs text-t2 mb-6">
              {asheBenchmark.soc_title} (SOC {asheBenchmark.soc_code}) · {salaryBenchmark?.source} · {asheBenchmark.year}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-s2 border border-b1">
                <p className="text-[10px] text-t3 mb-1">Live median (this platform)</p>
                <p className="text-2xl font-black text-accent">{fmtK(medianSalary)}</p>
              </div>
              <div className="p-4 rounded-xl bg-s2 border border-b1">
                <p className="text-[10px] text-t3 mb-1">ONS ASHE national median</p>
                <p className="text-2xl font-black text-blue">{fmtK(asheBenchmark.salary_p50)}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 mt-4 pt-4 border-t border-b1 text-[10px] text-t3">
              <Info className="w-3 h-3 shrink-0 mt-0.5" />
              {salaryBenchmark?.methodology}
            </div>
          </div>
        )}

        {/* Experience Bands */}
        <div className="bg-s1 rounded-2xl border border-b1 p-6 mb-6 shadow-card animate-fade-up animate-delay-150">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-bold text-t1">Salary by Experience Level</h2>
            <span className="text-xs text-t2 ml-auto">UK AI/ML · Gross annual · GBP</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {EXPERIENCE_LEVELS.map((band) => {
              const data = expSalary[band.slug];
              return (
                <div key={band.label} className={`rounded-xl border p-5 ${band.border} ${band.bg}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg bg-white/60 flex items-center justify-center`}>
                        <band.Icon className={`w-4 h-4 ${band.color}`} strokeWidth={1.8} />
                      </div>
                      <span className={`text-xs font-bold uppercase tracking-wide ${band.color}`}>{band.label}</span>
                    </div>
                    <span className="text-[10px] text-t3 bg-s1 px-2 py-0.5 rounded-md border border-b1">{band.years}</span>
                  </div>
                  {data.live ? (
                    <>
                      <p className={`text-2xl font-black ${band.color} mb-0.5`}>{fmtK(data.p50)}</p>
                      <p className="text-[10px] text-t3 mb-3">live median · n={data.n}</p>
                      <div className="h-1.5 rounded-full bg-b1 overflow-hidden mb-2">
                        <div
                          className="h-full rounded-full bg-current"
                          style={{ width: `${(((data.p75 ?? 0) - 40000) / 170000) * 100}%`, color: "currentColor", opacity: 0.4 }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-t3 mb-2">
                        <span>{fmtK(data.p25)}</span>
                        <span>{fmtK(data.p75)}</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-t3 py-3">Not enough live postings yet for this band</p>
                  )}
                  <p className="text-[10px] text-t2 leading-relaxed border-t border-b1 pt-2">{band.note}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Role + Regional */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Salary by role */}
          <div className="bg-s1 rounded-2xl border border-b1 p-6 shadow-card animate-fade-up animate-delay-200">
            <div className="flex items-center gap-2 mb-6">
              <DollarSign className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-bold text-t1">Salary by Role</h2>
            </div>
            <div className="space-y-4">
              {ROLE_CONFIGS.map((r) => {
                const s = roleSalary[r.apiSlug];
                if (!s.live) {
                  return (
                    <div key={r.key} className="flex items-center justify-between">
                      <span className="text-xs text-t1 font-medium">{r.label}</span>
                      <span className="text-[10px] text-t3">Not enough live postings yet</span>
                    </div>
                  );
                }
                return (
                  <div key={r.key}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-t1 font-medium">{r.label}</span>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-blue font-mono">{fmtK(s.p25)}</span>
                        <span className="text-accent font-bold font-mono">{fmtK(s.p50)}</span>
                        <span className="text-prp font-mono">{fmtK(s.p75)}</span>
                      </div>
                    </div>
                    <div className="relative h-2 rounded-full bg-s2 overflow-hidden">
                      <div
                        className="absolute top-0 h-full rounded-full"
                        style={{
                          left:       `${(((s.p25 ?? 0) - 40000) / 120000) * 100}%`,
                          right:      `${100 - (((s.p75 ?? 0) - 40000) / 120000) * 100}%`,
                          background: "linear-gradient(90deg, #93C5FD, #4F46E5, #7C3AED)",
                          opacity:    0.7,
                        }}
                      />
                      <div
                        className="absolute top-0 w-0.5 h-full bg-white shadow-sm"
                        style={{ left: `${(((s.p50 ?? 0) - 40000) / 120000) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-5 pt-4 border-t border-b1">
              <div className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded bg-blue inline-block" /><span className="text-[10px] text-t2">P25</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded bg-accent inline-block" /><span className="text-[10px] text-t2">Median</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded bg-prp inline-block" /><span className="text-[10px] text-t2">P75</span></div>
            </div>
          </div>

          {/* Regional index — live, queried per-city against market.jobs.location */}
          <div className="bg-s1 rounded-2xl border border-b1 p-6 shadow-card animate-fade-up animate-delay-300">
            <div className="flex items-center gap-2 mb-6">
              <Globe className="w-4 h-4 text-blue" />
              <h2 className="text-sm font-bold text-t1">Regional Salary Index</h2>
            </div>
            <div className="space-y-3">
              {UK_REGIONS.map((r) => {
                const d = regionSalary[r.apiSlug];
                const londonMedian = regionSalary["London"]?.p50;
                const pctOfLondon = d.live && londonMedian ? Math.round(((d.p50 as number) / londonMedian) * 100) : null;
                return (
                  <div key={r.region} className="p-3 rounded-xl bg-s2 border border-b1 hover:border-b2 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-t1">{r.region}</span>
                      {d.live ? (
                        <div className="text-right shrink-0 ml-4">
                          <p className="text-sm font-bold text-accent">{fmtK(d.p50)}</p>
                          <p className="text-[10px] text-t3">{pctOfLondon != null ? `${pctOfLondon}% of London · ` : ""}n={d.n}</p>
                        </div>
                      ) : (
                        <span className="text-[10px] text-t3">Not enough live postings yet</span>
                      )}
                    </div>
                    {d.live && (
                      <div className="h-1.5 rounded-full bg-b1 overflow-hidden mt-2">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-accent to-blue"
                          style={{ width: `${Math.min(100, pctOfLondon ?? 100)}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex items-start gap-2 mt-4 pt-4 border-t border-b1 text-[10px] text-t3">
              <Info className="w-3 h-3 shrink-0 mt-0.5" />
              Live median salary per city, computed from GBP-denominated postings mentioning that city this run — not a fixed index.
            </div>
          </div>
        </div>

        {/* Remote Premium — live, queried per work_model */}
        <div className="bg-s1 rounded-2xl border border-b1 p-6 shadow-card animate-fade-up animate-delay-400">
          <div className="flex items-center gap-2 mb-6">
            <Laptop className="w-4 h-4 text-prp" />
            <h2 className="text-sm font-bold text-t1">Remote vs On-Site Premium</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {WORK_MODELS.map((row) => {
              const d = workModelSalary[row.model];
              return (
                <div key={row.model} className={`p-5 rounded-xl border ${row.border} ${row.bg}`}>
                  <p className={`text-xs font-bold ${row.color} mb-1`}>{row.label}</p>
                  <p className="text-[10px] text-t3 mb-3">{row.note}</p>
                  {d.live ? (
                    <>
                      <p className={`text-2xl font-black ${row.color} mb-3`}>{fmtK(d.p50)}</p>
                      <p className="text-[10px] text-t3">live median · n={d.n}</p>
                    </>
                  ) : (
                    <p className="text-xs text-t3 py-3">Not enough live postings yet</p>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex items-start gap-2 mt-4 pt-4 border-t border-b1 text-[10px] text-t3">
            <Info className="w-3 h-3 shrink-0 mt-0.5" />
            Live median salary per work model, computed from this run&apos;s GBP-denominated postings.
          </div>
        </div>

      </div>
    </div>
  );
}
