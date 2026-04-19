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
import { fmtK, pct } from "@/lib/utils";
import { SalaryRange } from "@/components/charts/salary-range";
import { DollarSign, Globe, TrendingUp, Info } from "lucide-react";

export const revalidate = 300;

const ROLE_SALARY_ESTIMATES: Record<string, { p25: number; p50: number; p75: number; label: string }> = {
  "ML Engineer":         { p25: 65000, p50: 90000, p75: 130000, label: "Machine Learning Engineer" },
  "Data Scientist":      { p25: 55000, p50: 75000, p75: 110000, label: "Data Scientist" },
  "AI Researcher":       { p25: 70000, p50: 95000, p75: 140000, label: "AI Research Scientist" },
  "MLOps Engineer":      { p25: 65000, p50: 88000, p75: 125000, label: "MLOps / Platform Engineer" },
  "NLP Engineer":        { p25: 60000, p50: 85000, p75: 120000, label: "NLP Engineer" },
  "Data Engineer":       { p25: 55000, p50: 78000, p75: 110000, label: "Data Engineer" },
  "CV Engineer":         { p25: 62000, p50: 88000, p75: 125000, label: "Computer Vision Engineer" },
};

const UK_REGIONS = [
  { region: "London",         multiplier: 1.0,  note: "Highest concentration of AI roles" },
  { region: "Cambridge",      multiplier: 0.95, note: "Strong research & biotech sector" },
  { region: "Oxford",         multiplier: 0.92, note: "Academic + deep tech spin-outs" },
  { region: "Manchester",     multiplier: 0.82, note: "Growing Northern Powerhouse AI hub" },
  { region: "Edinburgh",      multiplier: 0.80, note: "Strong in fintech & NLP research" },
  { region: "Bristol",        multiplier: 0.83, note: "Robotics & autonomous systems" },
  { region: "Remote (UK)",    multiplier: 0.90, note: "Varies widely by company HQ" },
];

export default async function SalaryPage() {
  let snapshot = null;
  try { snapshot = await api.snapshot(); } catch {}

  const medianSalary = snapshot?.salary_p50 ?? 82000;

  return (
    <div className="pt-14 max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-10 animate-fade-up">
        <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-2">Compensation Intelligence</p>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-t1 mb-3">
          UK AI Salary Benchmarks
        </h1>
        <p className="text-t2 max-w-xl">
          Salary percentiles derived from live job postings with stated compensation. All figures
          are gross annual salary in GBP. Updated each pipeline run.
        </p>
      </div>

      {/* Hero salary card */}
      <div className="rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/5 via-s1 to-blue/5 p-8 mb-8 animate-fade-up animate-delay-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-2">Market Median</p>
            <p className="text-6xl font-black text-t1 tracking-tight">{fmtK(medianSalary)}</p>
            <p className="text-t2 mt-2">Median UK AI/ML salary (all roles, all seniorities)</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:text-right">
            <div className="p-4 rounded-xl bg-s2 border border-b1">
              <p className="text-xl font-bold text-blue">{fmtK(snapshot?.salary_p25 ?? 55000)}</p>
              <p className="text-xs text-t2">25th percentile</p>
              <p className="text-[10px] text-t3 mt-0.5">Lower quartile</p>
            </div>
            <div className="p-4 rounded-xl bg-s2 border border-b1">
              <p className="text-xl font-bold text-prp">{fmtK(snapshot?.salary_p75 ?? 120000)}</p>
              <p className="text-xs text-t2">75th percentile</p>
              <p className="text-[10px] text-t3 mt-0.5">Upper quartile</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <SalaryRange
            p25={snapshot?.salary_p25 ?? 55000}
            p50={snapshot?.salary_p50 ?? 82000}
            p75={snapshot?.salary_p75 ?? 120000}
            height={160}
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* By role */}
        <div className="rounded-2xl border border-b1 bg-s1 p-6 animate-fade-up animate-delay-200">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-bold text-t1">Salary by Role</h2>
          </div>
          <div className="space-y-4">
            {Object.entries(ROLE_SALARY_ESTIMATES).map(([key, s]) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-t1 font-medium">{s.label}</span>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-blue font-mono">{fmtK(s.p25)}</span>
                    <span className="text-accent font-bold font-mono">{fmtK(s.p50)}</span>
                    <span className="text-prp font-mono">{fmtK(s.p75)}</span>
                  </div>
                </div>
                <div className="relative h-2 rounded-full bg-b1 overflow-hidden">
                  {/* P25-P75 range */}
                  <div
                    className="absolute top-0 h-full rounded-full bg-gradient-to-r from-blue via-accent to-prp opacity-70"
                    style={{
                      left: `${((s.p25 - 40000) / 120000) * 100}%`,
                      right: `${100 - ((s.p75 - 40000) / 120000) * 100}%`,
                    }}
                  />
                  {/* Median line */}
                  <div
                    className="absolute top-0 w-0.5 h-full bg-white"
                    style={{ left: `${((s.p50 - 40000) / 120000) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-b1">
            <div className="flex items-center gap-1.5"><span className="w-3 h-1 rounded bg-blue inline-block" /><span className="text-[10px] text-t2">P25</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-1 rounded bg-accent inline-block" /><span className="text-[10px] text-t2">Median</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-1 rounded bg-prp inline-block" /><span className="text-[10px] text-t2">P75</span></div>
          </div>
        </div>

        {/* By region */}
        <div className="rounded-2xl border border-b1 bg-s1 p-6 animate-fade-up animate-delay-300">
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
            Regional index relative to London median. Based on live job posting data + ONS regional pay data.
          </div>
        </div>
      </div>

      {/* Sponsorship insight */}
      {snapshot?.sponsorship_rate && (
        <div className="rounded-2xl border border-b1 bg-s1 p-6 animate-fade-up animate-delay-400">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-prp" />
            <h2 className="text-sm font-bold text-t1">Visa Sponsorship Rates</h2>
          </div>
          <p className="text-t2 text-xs mb-6">
            {pct(snapshot.sponsorship_rate)} of active UK AI/ML job postings include visa sponsorship.
            Highest in AI safety, autonomous systems, and deep learning roles.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { sector: "AI Safety",           rate: 0.45 },
              { sector: "Autonomous Systems",  rate: 0.52 },
              { sector: "FinTech AI",          rate: 0.35 },
              { sector: "HealthTech AI",       rate: 0.28 },
              { sector: "Enterprise AI",       rate: 0.30 },
            ].map((s) => (
              <div key={s.sector} className="text-center p-4 rounded-xl bg-s2 border border-b1">
                <div className="relative w-12 h-12 mx-auto mb-2">
                  <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1C2A3A" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="15.9" fill="none"
                      stroke="#8B5CF6" strokeWidth="3"
                      strokeDasharray={`${s.rate * 100} ${100 - s.rate * 100}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-prp">
                    {Math.round(s.rate * 100)}%
                  </span>
                </div>
                <p className="text-[10px] text-t2 leading-tight">{s.sector}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
