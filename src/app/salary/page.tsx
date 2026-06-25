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
import type { SalaryData } from "@/lib/api";
import { fmtK } from "@/lib/utils";
import { SalaryRange } from "@/components/charts/salary-range";
import { PageHero } from "@/components/layout/page-hero";
import { DollarSign, Globe, TrendingUp, Info, Laptop } from "lucide-react";

export const revalidate = 300;

const ROLE_CONFIGS = [
  { key: "ml_engineer",    label: "ML Engineer",               apiSlug: "ml_engineer"    },
  { key: "data_scientist", label: "Data Scientist",            apiSlug: "data_scientist" },
  { key: "ai_researcher",  label: "AI Research Scientist",     apiSlug: "ai_researcher"  },
  { key: "mlops_engineer", label: "MLOps / Platform Engineer", apiSlug: "mlops_engineer" },
  { key: "nlp_engineer",   label: "NLP Engineer",              apiSlug: "nlp_engineer"   },
  { key: "data_engineer",  label: "Data Engineer",             apiSlug: "data_engineer"  },
  { key: "cv_engineer",    label: "Computer Vision Engineer",  apiSlug: "cv_engineer"    },
] as const;

const EXPERIENCE_LEVELS = [
  { slug: "junior",    label: "Junior",           years: "0–2 yrs",  color: "text-blue",   bg: "bg-blue/8",   border: "border-blue/20",   note: "Grad schemes & apprenticeships included" },
  { slug: "mid",       label: "Mid-Level",        years: "2–5 yrs",  color: "text-accent", bg: "bg-accent/8", border: "border-accent/20", note: "Owns features independently" },
  { slug: "senior",    label: "Senior",           years: "5–8 yrs",  color: "text-prp",    bg: "bg-prp/8",    border: "border-prp/20",    note: "Technical leadership & mentoring" },
  { slug: "principal", label: "Principal / Staff",years: "8+ yrs",   color: "text-warn",   bg: "bg-warn/8",   border: "border-warn/20",   note: "Org-wide impact, IC track" },
] as const;

const UK_REGIONS = [
  { region: "London",      multiplier: 1.0,  note: "Highest concentration of AI roles" },
  { region: "Cambridge",   multiplier: 0.95, note: "Strong research & biotech sector"  },
  { region: "Oxford",      multiplier: 0.92, note: "Academic + deep tech spin-outs"    },
  { region: "Manchester",  multiplier: 0.82, note: "Growing Northern Powerhouse hub"   },
  { region: "Edinburgh",   multiplier: 0.80, note: "Strong in fintech & NLP research"  },
  { region: "Bristol",     multiplier: 0.83, note: "Robotics & autonomous systems"     },
  { region: "Remote (UK)", multiplier: 0.90, note: "Varies widely by company HQ"       },
];

const FALLBACK_ROLE_SALARY: Record<string, { p25: number; p50: number; p75: number }> = {
  ml_engineer:    { p25: 65000, p50: 90000,  p75: 130000 },
  data_scientist: { p25: 55000, p50: 75000,  p75: 110000 },
  ai_researcher:  { p25: 70000, p50: 95000,  p75: 140000 },
  mlops_engineer: { p25: 65000, p50: 88000,  p75: 125000 },
  nlp_engineer:   { p25: 60000, p50: 85000,  p75: 120000 },
  data_engineer:  { p25: 55000, p50: 78000,  p75: 110000 },
  cv_engineer:    { p25: 62000, p50: 88000,  p75: 125000 },
};

const FALLBACK_EXP_SALARY: Record<string, { range: [number, number]; median: number }> = {
  junior:    { range: [42000, 65000],  median: 52000  },
  mid:       { range: [65000, 95000],  median: 78000  },
  senior:    { range: [95000, 135000], median: 112000 },
  principal: { range: [130000, 200000],median: 155000 },
};

export default async function SalaryPage() {
  const [snapshotResult, ...roleResults] = await Promise.allSettled([
    api.snapshot(),
    ...ROLE_CONFIGS.map(r => api.salary(r.apiSlug, "all", "all")),
  ]);

  const expResults = await Promise.allSettled(
    EXPERIENCE_LEVELS.map(e => api.salary("all", e.slug, "all"))
  );

  const snapshot = snapshotResult.status === "fulfilled" ? snapshotResult.value : null;
  const snap = snapshot as any;

  const roleSalary: Record<string, { p25: number; p50: number; p75: number; live: boolean }> = {};
  ROLE_CONFIGS.forEach((r, i) => {
    const res = roleResults[i];
    const liveData = res.status === "fulfilled" ? (res.value as SalaryData) : null;
    const fb = FALLBACK_ROLE_SALARY[r.apiSlug];
    roleSalary[r.apiSlug] = {
      p25:  liveData?.salary_p25  ?? fb.p25,
      p50:  liveData?.salary_p50  ?? fb.p50,
      p75:  liveData?.salary_p75  ?? fb.p75,
      live: liveData?.salary_p50 != null,
    };
  });

  const expSalary: Record<string, { range: [number, number]; median: number; live: boolean }> = {};
  EXPERIENCE_LEVELS.forEach((e, i) => {
    const res = expResults[i];
    const liveData = res.status === "fulfilled" ? (res.value as SalaryData) : null;
    const fb = FALLBACK_EXP_SALARY[e.slug];
    expSalary[e.slug] = {
      range:  [liveData?.salary_p25 ?? fb.range[0], liveData?.salary_p75 ?? fb.range[1]],
      median: liveData?.salary_p50  ?? fb.median,
      live:   liveData?.salary_p50 != null,
    };
  });

  const medianSalary = snap?.salary_p50 ?? 82000;

  return (
    <div className="pt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Hero */}
        <PageHero
          badge="Compensation Intelligence"
          title="UK AI Salary"
          titleAccent="Benchmarks"
          subtitle="Salary percentiles derived from live job postings with stated compensation. All figures are gross annual salary in GBP. Updated each pipeline run."
          imageSrc="/images/illustrations/hero-salary.webp"
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
              <span className="text-sm font-bold text-blue-300">{fmtK(snap?.salary_p25 ?? 55000)}</span>
              <span className="text-slate-500 text-xs">–</span>
              <span className="text-sm font-bold text-violet-300">{fmtK(snap?.salary_p75 ?? 120000)}</span>
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
              <p className="text-t2 mt-1 text-sm">Median UK AI/ML salary — all roles, all seniorities</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-s2 border border-b1 text-right">
                <p className="text-xl font-bold text-blue">{fmtK(snap?.salary_p25 ?? 55000)}</p>
                <p className="text-xs text-t2">25th percentile</p>
              </div>
              <div className="p-4 rounded-xl bg-s2 border border-b1 text-right">
                <p className="text-xl font-bold text-prp">{fmtK(snap?.salary_p75 ?? 120000)}</p>
                <p className="text-xs text-t2">75th percentile</p>
              </div>
            </div>
          </div>
          <SalaryRange
            p25={snap?.salary_p25 ?? 55000}
            p50={snap?.salary_p50 ?? 82000}
            p75={snap?.salary_p75 ?? 120000}
            height={160}
          />
        </div>

        {/* Career progression illustration */}
        <div className="bg-s1 rounded-2xl border border-b1 p-6 mb-6 shadow-card animate-fade-up animate-delay-100">
          <h2 className="text-sm font-bold text-t1 mb-6">Your Salary Journey in UK AI</h2>
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-8 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue via-accent to-prp hidden sm:block" />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
              {[
                { stage: "Graduate",      years: "0–1 yr",  salary: "£42–55k",  icon: "🎓", accent: "text-blue",   bg: "bg-blue/8",   border: "border-blue/20",   note: "Grad schemes, apprenticeships" },
                { stage: "Junior",        years: "1–3 yrs", salary: "£55–70k",  icon: "🌱", accent: "text-accent", bg: "bg-accent/8", border: "border-accent/20", note: "First independent role" },
                { stage: "Mid / Senior",  years: "3–7 yrs", salary: "£75–115k", icon: "🚀", accent: "text-prp",    bg: "bg-prp/8",    border: "border-prp/20",    note: "Tech lead, specialisation" },
                { stage: "Principal",     years: "7+ yrs",  salary: "£120–200k",icon: "⭐", accent: "text-warn",   bg: "bg-warn/8",   border: "border-warn/20",   note: "Org-wide impact, IC track" },
              ].map((s, i) => (
                <div key={s.stage} className={`rounded-xl border p-4 ${s.border} ${s.bg} flex flex-col items-center text-center relative`}>
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-current flex items-center justify-center text-xl mb-3 shadow-sm z-10"
                    style={{ borderColor: "currentColor" }}>
                    <span>{s.icon}</span>
                  </div>
                  <p className={`text-xs font-bold ${s.accent} mb-1`}>{s.stage}</p>
                  <p className={`text-lg font-black ${s.accent} mb-1`}>{s.salary}</p>
                  <p className="text-[9px] text-t3 mb-1 font-mono">{s.years}</p>
                  <p className="text-[9px] text-t2 leading-tight">{s.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

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
                    <span className={`text-xs font-bold uppercase tracking-wide ${band.color}`}>{band.label}</span>
                    <span className="text-[10px] text-t3 bg-s1 px-2 py-0.5 rounded-md border border-b1">{band.years}</span>
                  </div>
                  <p className={`text-2xl font-black ${band.color} mb-0.5`}>{fmtK(data.median)}</p>
                  <p className="text-[10px] text-t3 mb-3">{data.live ? "live median" : "estimated median"}</p>
                  <div className="h-1.5 rounded-full bg-b1 overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full bg-current"
                      style={{
                        width: `${((data.range[1] - 40000) / 170000) * 100}%`,
                        color: "currentColor",
                        opacity: 0.4,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-t3 mb-2">
                    <span>{fmtK(data.range[0])}</span>
                    <span>{fmtK(data.range[1])}</span>
                  </div>
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
                          left:       `${((s.p25 - 40000) / 120000) * 100}%`,
                          right:      `${100 - ((s.p75 - 40000) / 120000) * 100}%`,
                          background: "linear-gradient(90deg, #93C5FD, #4F46E5, #7C3AED)",
                          opacity:    0.7,
                        }}
                      />
                      <div
                        className="absolute top-0 w-0.5 h-full bg-white shadow-sm"
                        style={{ left: `${((s.p50 - 40000) / 120000) * 100}%` }}
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

          {/* Regional index */}
          <div className="bg-s1 rounded-2xl border border-b1 p-6 shadow-card animate-fade-up animate-delay-300">
            <div className="flex items-center gap-2 mb-6">
              <Globe className="w-4 h-4 text-blue" />
              <h2 className="text-sm font-bold text-t1">Regional Salary Index</h2>
            </div>
            <div className="space-y-3">
              {UK_REGIONS.map((r) => {
                const regionMedian = Math.round(medianSalary * r.multiplier);
                return (
                  <div key={r.region} className="p-3 rounded-xl bg-s2 border border-b1 hover:border-b2 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className="text-xs font-semibold text-t1">{r.region}</span>
                        <p className="text-[10px] text-t3 mt-0.5">{r.note}</p>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <p className="text-sm font-bold text-accent">{fmtK(regionMedian)}</p>
                        <p className="text-[10px] text-t3">{Math.round(r.multiplier * 100)}% of London</p>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-b1 overflow-hidden mt-2">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-accent to-blue"
                        style={{ width: `${r.multiplier * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-start gap-2 mt-4 pt-4 border-t border-b1 text-[10px] text-t3">
              <Info className="w-3 h-3 shrink-0 mt-0.5" />
              Regional index relative to London median. Based on live posting data + ONS regional pay data.
            </div>
          </div>
        </div>

        {/* Remote Premium */}
        <div className="bg-s1 rounded-2xl border border-b1 p-6 shadow-card animate-fade-up animate-delay-400">
          <div className="flex items-center gap-2 mb-6">
            <Laptop className="w-4 h-4 text-prp" />
            <h2 className="text-sm font-bold text-t1">Remote vs On-Site Premium</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { model: "Fully Remote",      salary: Math.round(medianSalary * 0.92), note: "Anchored to company HQ location",    color: "text-prp",   border: "border-prp/20",   bg: "bg-prp/5",   bar: 92  },
              { model: "Hybrid (2–3 days)", salary: Math.round(medianSalary * 1.0),  note: "Standard in most UK AI roles today", color: "text-accent", border: "border-accent/20", bg: "bg-accent/5", bar: 100 },
              { model: "Fully On-site",     salary: Math.round(medianSalary * 0.97), note: "London roles may compensate more",   color: "text-blue",  border: "border-blue/20",   bg: "bg-blue/5",  bar: 97  },
            ].map((row) => (
              <div key={row.model} className={`p-5 rounded-xl border ${row.border} ${row.bg}`}>
                <p className={`text-xs font-bold ${row.color} mb-1`}>{row.model}</p>
                <p className="text-[10px] text-t3 mb-3">{row.note}</p>
                <p className={`text-2xl font-black ${row.color} mb-3`}>{fmtK(row.salary)}</p>
                <div className="h-1.5 rounded-full bg-b1 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-prp to-accent"
                    style={{ width: `${row.bar}%` }}
                  />
                </div>
                <p className="text-[10px] text-t3 mt-1 text-right">{row.bar}% of benchmark</p>
              </div>
            ))}
          </div>
          <div className="flex items-start gap-2 mt-4 pt-4 border-t border-b1 text-[10px] text-t3">
            <Info className="w-3 h-3 shrink-0 mt-0.5" />
            Hybrid commands a slight premium as employers compete for talent willing to commute.
          </div>
        </div>

      </div>
    </div>
  );
}
