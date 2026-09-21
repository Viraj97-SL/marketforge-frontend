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
import type { SalaryData, SnapshotHistoryData, SalaryBenchmarkData, SalaryHistogramData } from "@/lib/api";
import { fmtK } from "@/lib/utils";
import { ROLE_CONFIGS } from "@/lib/roles";
import { SalaryRange } from "@/components/charts/salary-range";
import { SalaryHistogram } from "@/components/charts/salary-histogram";
import { SalaryTrendSingle } from "@/components/charts/salary-trend-single";
import { SalaryDumbbell } from "@/components/charts/salary-dumbbell";
import { PageHero } from "@/components/layout/page-hero";
import { EditorialBand } from "@/components/ui/editorial-band";
import { DollarSign, Globe, TrendingUp, Info, Laptop, GraduationCap, Code2, Layers, Star, LineChart, Landmark } from "lucide-react";

export const revalidate = 300;

// Real threshold (marketforge.utils.stats.MIN_SALARY_SAMPLE_SIZE) — every
// "not enough data" gate on this page uses the same n<10 rule the backend
// actually applies, not a rounder-looking number.
const MIN_SAMPLE_SIZE = 10;

// Anomalous first week of weekly_snapshots history: the pipeline's initial
// backfill (588 postings that run vs. 50-220/week every week since), not one
// week's postings. Not comparable to the other weeks, so it's excluded from
// the trend rather than plotted as if it were a normal data point.
const BACKFILL_WEEK_START = "2026-04-06";

// Ordinal ramp, Junior -> Principal — validated (monotonic lightness, step
// gap, light-end contrast, single-hue). Do not substitute other values.
const EXPERIENCE_LEVELS = [
  { slug: "junior",    label: "Junior",            years: "0–2 yrs", Icon: GraduationCap, hex: "#ABA1F2", note: "Grad schemes & apprenticeships included" },
  { slug: "mid",       label: "Mid-Level",         years: "2–5 yrs", Icon: Code2,         hex: "#8B7FEA", note: "Owns features independently" },
  { slug: "senior",    label: "Senior",            years: "5–8 yrs", Icon: Layers,        hex: "#5B4EDC", note: "Technical leadership & mentoring" },
  { slug: "principal", label: "Principal / Staff", years: "8+ yrs",  Icon: Star,          hex: "#3A2FB5", note: "Org-wide impact, IC track" },
] as const;

// Real UK AI hiring hubs — queried live against market.jobs.location, not a
// hardcoded multiplier table. A region only renders a comparison bar if it
// clears MIN_SAMPLE_SIZE live GBP-denominated postings this run.
const UK_REGIONS = [
  { region: "London",      apiSlug: "London"     },
  { region: "Cambridge",   apiSlug: "Cambridge"  },
  { region: "Oxford",      apiSlug: "Oxford"     },
  { region: "Manchester",  apiSlug: "Manchester" },
  { region: "Edinburgh",   apiSlug: "Edinburgh"  },
  { region: "Bristol",     apiSlug: "Bristol"    },
] as const;

const WORK_MODELS = [
  { model: "remote", label: "Fully Remote",   note: "Anchored to company HQ location"    },
  { model: "hybrid", label: "Hybrid",         note: "Standard in most UK AI roles today" },
  { model: "onsite", label: "Fully On-site",  note: "London roles may compensate more"   },
] as const;

function belowThresholdLine(labels: string[]): string | null {
  if (labels.length === 0) return null;
  return `Below reporting threshold (n<${MIN_SAMPLE_SIZE}): ${labels.join(", ")}`;
}

export default async function SalaryPage() {
  const [overallResult, historyResult, benchmarkResult, histogramResult, ...roleResults] = await Promise.allSettled([
    // All-time, same source as every panel below (role/experience/region/work-model) —
    // this used to be api.snapshot() (the latest week's snapshot row), which could
    // show a different median here than the "Salary by Role" panel a few pixels down.
    api.salary("all", "all", "all"),
    api.snapshotHistory(26),
    api.salaryBenchmark(),
    api.salaryHistogram(),
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
  const historyWeeksAll = (snapshotHistory?.weeks ?? []).filter((w) => w.salary_p50 != null);
  const hasBackfillWeek = historyWeeksAll.some((w) => w.week_start === BACKFILL_WEEK_START);
  const historyWeeks = historyWeeksAll.filter((w) => w.week_start !== BACKFILL_WEEK_START);

  const salaryBenchmark = benchmarkResult.status === "fulfilled" ? (benchmarkResult.value as SalaryBenchmarkData) : null;
  const asheBenchmark = salaryBenchmark?.benchmarks?.[0] ?? null;

  const histogram = histogramResult.status === "fulfilled" ? (histogramResult.value as SalaryHistogramData) : null;

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

  const liveExperience = EXPERIENCE_LEVELS.filter((b) => expSalary[b.slug].live);
  const quietExperience = belowThresholdLine(EXPERIENCE_LEVELS.filter((b) => !expSalary[b.slug].live).map((b) => b.label));

  const liveRoles = ROLE_CONFIGS.filter((r) => roleSalary[r.apiSlug].live);
  const quietRoles = belowThresholdLine(ROLE_CONFIGS.filter((r) => !roleSalary[r.apiSlug].live).map((r) => r.label));
  const dumbbellRows = liveRoles.map((r) => {
    const s = roleSalary[r.apiSlug];
    return { key: r.key, label: r.label, p25: s.p25 as number, p50: s.p50 as number, p75: s.p75 as number };
  });

  const londonMedian = regionSalary["London"]?.p50 ?? null;
  const liveRegions = UK_REGIONS.filter((r) => regionSalary[r.apiSlug].live);
  const quietRegions = belowThresholdLine(UK_REGIONS.filter((r) => !regionSalary[r.apiSlug].live).map((r) => r.region));
  const regionMax = Math.max(...liveRegions.map((r) => regionSalary[r.apiSlug].p50 ?? 0), 1);

  const liveWorkModels = WORK_MODELS.filter((w) => workModelSalary[w.model].live);
  const quietWorkModels = belowThresholdLine(WORK_MODELS.filter((w) => !workModelSalary[w.model].live).map((w) => w.label));

  const deltaPct = medianSalary != null && asheBenchmark?.salary_p50
    ? Math.round(((medianSalary - asheBenchmark.salary_p50) / asheBenchmark.salary_p50) * 100)
    : null;

  return (
    <div className="pt-14">
      {/* Hero */}
      <PageHero
        badge="Compensation Intelligence"
        title="UK AI Salary"
        titleAccent="Benchmarks"
        subtitle="Salary percentiles derived from live job postings with stated compensation. All figures are gross annual salary in GBP. Updated each pipeline run."
        imageSrc="/images/page-salary-hero.avif"
      >
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/15 border border-white/20">
            <span className="text-xl font-black" style={{ color: "var(--hero-ink)" }}>{fmtK(medianSalary)}</span>
            <div>
              <p className="text-[10px] font-semibold leading-none" style={{ color: "var(--hero-ink)" }}>Market Median</p>
              <p className="text-[10px]" style={{ color: "var(--hero-ink)", opacity: 0.7 }}>all roles · all seniorities</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/15 border border-white/20">
            <span className="text-sm font-bold" style={{ color: "var(--hero-ink)" }}>{fmtK(snap?.salary_p25 ?? null)}</span>
            <span className="text-xs" style={{ color: "var(--hero-ink)", opacity: 0.7 }}>–</span>
            <span className="text-sm font-bold" style={{ color: "var(--hero-ink)" }}>{fmtK(snap?.salary_p75 ?? null)}</span>
            <p className="text-[10px]" style={{ color: "var(--hero-ink)", opacity: 0.7 }}>P25 – P75</p>
          </div>
        </div>
      </PageHero>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">

        {/* ONS national comparison — moved directly below the hero; the delta is the headline */}
        {asheBenchmark && (
          <div className="bg-s1 rounded-2xl border border-b1 p-8 mb-8 shadow-card animate-fade-up animate-delay-100">
            <div className="flex items-center gap-2 mb-1">
              <Landmark className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-bold text-t1">How This Compares to the UK National Average</h2>
            </div>
            <p className="text-xs text-t2 mb-6">
              {asheBenchmark.soc_title} (SOC {asheBenchmark.soc_code}) · {salaryBenchmark?.source} · {asheBenchmark.year}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-end gap-6">
              <div>
                <p className={`text-6xl font-black tracking-tight ${deltaPct != null && deltaPct >= 0 ? "text-accent" : "text-t1"}`}>
                  {deltaPct != null ? `${deltaPct >= 0 ? "+" : ""}${deltaPct}%` : "—"}
                </p>
                <p className="text-t2 text-sm mt-1">vs the ONS national median for SOC {asheBenchmark.soc_code}</p>
              </div>
              <div className="flex gap-4 sm:ml-auto">
                <div className="p-4 rounded-xl bg-s2 border border-b1">
                  <p className="text-[10px] text-t3 mb-1">Live median (this platform)</p>
                  <p className="text-xl font-bold text-t1">{fmtK(medianSalary)}</p>
                </div>
                <div className="p-4 rounded-xl bg-s2 border border-b1">
                  <p className="text-[10px] text-t3 mb-1">ONS ASHE national median</p>
                  <p className="text-xl font-bold text-t2">{fmtK(asheBenchmark.salary_p50)}</p>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2 mt-4 pt-4 border-t border-b1 text-[10px] text-t3">
              <Info className="w-3 h-3 shrink-0 mt-0.5" />
              {salaryBenchmark?.methodology}
            </div>
          </div>
        )}

      </div>

      <EditorialBand
        image="/images/salary-stated.avif"
        imageOpacity={0.36}
        heading="Only the postings that name a number."
        body="798 of the roles tracked state compensation. The rest are excluded rather than estimated."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Market Distribution — quartile track + true histogram */}
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
            <SalaryRange p25={snap.salary_p25} p50={snap.salary_p50} p75={snap.salary_p75} />
          ) : (
            <p className="text-xs text-t3 py-6 text-center border-t border-b1">
              Live salary distribution unavailable right now — check back after the next pipeline run.
            </p>
          )}
          <div className="mt-8 border-t border-b1 pt-6">
            {histogram && histogram.n > 0 ? (
              <SalaryHistogram bins={histogram.bins} p25={histogram.p25} p50={histogram.p50} p75={histogram.p75} n={histogram.n} height={220} />
            ) : (
              <p className="text-xs text-t3 py-6 text-center">Not enough live postings yet to chart a distribution.</p>
            )}
          </div>
        </div>

        {/* Salary trend over time — one series, real weekly_snapshots history */}
        <div className="bg-s1 rounded-2xl border border-b1 p-6 mb-6 shadow-card animate-fade-up animate-delay-100">
          <div className="flex items-center gap-2 mb-1">
            <LineChart className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-bold text-t1">Median salary, last {historyWeeks.length || 0} weeks</h2>
          </div>
          <p className="text-xs text-t2 mb-6">Weekly median salary from postings with stated compensation that week</p>
          {historyWeeks.length > 1 ? (
            <SalaryTrendSingle weeks={historyWeeks} height={220} />
          ) : (
            <p className="text-xs text-t3 py-10 text-center">Not enough weekly history yet to chart a trend.</p>
          )}
          {hasBackfillWeek && (
            <p className="text-[10px] text-t3 mt-3 pt-3 border-t border-b1">
              The week of {BACKFILL_WEEK_START} is excluded: it reflects the pipeline&apos;s initial backfill (588 postings ingested
              that run), not one week&apos;s postings, so it isn&apos;t comparable to the weeks shown here.
            </p>
          )}
        </div>

        {/* Experience Bands — only bands with live data render as cards */}
        <div className="bg-s1 rounded-2xl border border-b1 p-6 mb-6 shadow-card animate-fade-up animate-delay-150">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-bold text-t1">Salary by Experience Level</h2>
            <span className="text-xs text-t2 ml-auto">UK AI/ML · Gross annual · GBP</span>
          </div>
          {liveExperience.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {liveExperience.map((band) => {
                const data = expSalary[band.slug];
                return (
                  <div
                    key={band.label}
                    className="rounded-xl border p-5"
                    style={{ borderColor: `${band.hex}33`, background: `${band.hex}0D` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-white/60 flex items-center justify-center">
                          <band.Icon className="w-4 h-4" style={{ color: band.hex }} strokeWidth={1.8} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wide" style={{ color: band.hex }}>{band.label}</span>
                      </div>
                      <span className="text-[10px] text-t3 bg-s1 px-2 py-0.5 rounded-md border border-b1">{band.years}</span>
                    </div>
                    <p className="text-2xl font-black mb-0.5" style={{ color: band.hex }}>{fmtK(data.p50)}</p>
                    <p className="text-[10px] text-t3 mb-3">live median · n={data.n}</p>
                    <div className="h-1.5 rounded-full bg-b1 overflow-hidden mb-2">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${(((data.p75 ?? 0) - 40000) / 170000) * 100}%`, background: band.hex, opacity: 0.4 }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-t3 mb-2">
                      <span>{fmtK(data.p25)}</span>
                      <span>{fmtK(data.p75)}</span>
                    </div>
                    <p className="text-[10px] text-t2 leading-relaxed border-t border-b1 pt-2">{band.note}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-t3 py-6 text-center">Not enough live postings yet by experience level.</p>
          )}
          {quietExperience && <p className="text-[13px] text-t3 mt-4">{quietExperience}</p>}
        </div>

        {/* Salary by Role — dumbbell chart, shared axis */}
        <div className="bg-s1 rounded-2xl border border-b1 p-6 mb-6 shadow-card animate-fade-up animate-delay-200">
          <div className="flex items-center gap-2 mb-6">
            <DollarSign className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-bold text-t1">Salary by Role</h2>
          </div>
          {dumbbellRows.length > 0 ? (
            <SalaryDumbbell rows={dumbbellRows} />
          ) : (
            <p className="text-xs text-t3 py-6 text-center">Not enough live postings yet by role.</p>
          )}
          {quietRoles && <p className="text-[13px] text-t3 mt-4 pt-4 border-t border-b1">{quietRoles}</p>}
        </div>

      </div>

      <EditorialBand
        image="/images/salary-regions.avif"
        imageOpacity={0.40}
        heading="London is not the market."
        body="Manchester at £73k and Bristol at £68k are computed from this run's postings, not from a fixed index."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Regional index — absolute median on a shared axis; London is the reference, not a bar */}
        <div className="bg-s1 rounded-2xl border border-b1 p-6 mb-6 shadow-card animate-fade-up animate-delay-300">
          <div className="flex items-center gap-2 mb-6">
            <Globe className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-bold text-t1">Regional Salary Index</h2>
          </div>
          {liveRegions.length > 0 ? (
            <div className="space-y-3">
              {liveRegions.map((r) => {
                const d = regionSalary[r.apiSlug];
                const isLondon = r.region === "London";
                const pctOfLondon = !isLondon && d.live && londonMedian ? Math.round(((d.p50 as number) / londonMedian) * 100) : null;
                return (
                  <div key={r.region} className="p-3 rounded-xl bg-s2 border border-b1 hover:border-b2 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-t1">{r.region}{isLondon && <span className="text-t3 font-normal"> · reference</span>}</span>
                      <div className="text-right shrink-0 ml-4">
                        <p className="text-sm font-bold text-accent">{fmtK(d.p50)}</p>
                        <p className="text-[10px] text-t3">{pctOfLondon != null ? `${pctOfLondon}% of London · ` : ""}n={d.n}</p>
                      </div>
                    </div>
                    {!isLondon && (
                      <div className="h-1.5 rounded-full bg-b1 overflow-hidden mt-2">
                        <div
                          className="h-full rounded-full bg-accent"
                          style={{ width: `${Math.min(100, ((d.p50 ?? 0) / regionMax) * 100)}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-t3 py-6 text-center">Not enough live postings yet by region.</p>
          )}
          {quietRegions && <p className="text-[13px] text-t3 mt-4">{quietRegions}</p>}
          <div className="flex items-start gap-2 mt-4 pt-4 border-t border-b1 text-[10px] text-t3">
            <Info className="w-3 h-3 shrink-0 mt-0.5" />
            Live median salary per city, computed from GBP-denominated postings mentioning that city this run — not a fixed index.
          </div>
        </div>

        {/* Remote Premium — one surface colour; the numbers differentiate the cards */}
        <div className="bg-s1 rounded-2xl border border-b1 p-6 shadow-card animate-fade-up animate-delay-400">
          <div className="flex items-center gap-2 mb-6">
            <Laptop className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-bold text-t1">Remote vs On-Site Premium</h2>
          </div>
          {liveWorkModels.length > 0 ? (
            <div className="grid sm:grid-cols-3 gap-4">
              {liveWorkModels.map((row) => {
                const d = workModelSalary[row.model];
                return (
                  <div key={row.model} className="p-5 rounded-xl border border-b1 bg-s2">
                    <p className="text-xs font-bold text-t1 mb-1">{row.label}</p>
                    <p className="text-[10px] text-t3 mb-3">{row.note}</p>
                    <p className="text-2xl font-black text-accent mb-3">{fmtK(d.p50)}</p>
                    <p className="text-[10px] text-t3">live median · n={d.n}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-t3 py-6 text-center">Not enough live postings yet by work model.</p>
          )}
          {quietWorkModels && <p className="text-[13px] text-t3 mt-4">{quietWorkModels}</p>}
          <div className="flex items-start gap-2 mt-4 pt-4 border-t border-b1 text-[10px] text-t3">
            <Info className="w-3 h-3 shrink-0 mt-0.5" />
            Live median salary per work model, computed from this run&apos;s GBP-denominated postings.
          </div>
        </div>

      </div>

      <EditorialBand
        image="/images/salary-close.avif"
        imageOpacity={0.42}
        heading="No panel. No model. No extrapolation."
        body="Every figure on this page traces to a posted salary range."
      />
    </div>
  );
}
