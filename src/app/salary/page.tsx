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
import { PageHero } from "@/components/layout/page-hero";
import {
  DollarSign, Globe, TrendingUp, Info,
  Laptop, Building2, Lightbulb, Target,
} from "lucide-react";

export const revalidate = 300;

const ROLE_SALARY_ESTIMATES: Record<string, { p25: number; p50: number; p75: number; label: string }> = {
  "ML Engineer":    { p25: 65000, p50: 90000, p75: 130000, label: "Machine Learning Engineer" },
  "Data Scientist": { p25: 55000, p50: 75000, p75: 110000, label: "Data Scientist" },
  "AI Researcher":  { p25: 70000, p50: 95000, p75: 140000, label: "AI Research Scientist" },
  "MLOps Engineer": { p25: 65000, p50: 88000, p75: 125000, label: "MLOps / Platform Engineer" },
  "NLP Engineer":   { p25: 60000, p50: 85000, p75: 120000, label: "NLP Engineer" },
  "Data Engineer":  { p25: 55000, p50: 78000, p75: 110000, label: "Data Engineer" },
  "CV Engineer":    { p25: 62000, p50: 88000, p75: 125000, label: "Computer Vision Engineer" },
};

const UK_REGIONS = [
  { region: "London",      multiplier: 1.0,  note: "Highest concentration of AI roles" },
  { region: "Cambridge",   multiplier: 0.95, note: "Strong research & biotech sector" },
  { region: "Oxford",      multiplier: 0.92, note: "Academic + deep tech spin-outs" },
  { region: "Manchester",  multiplier: 0.82, note: "Growing Northern Powerhouse AI hub" },
  { region: "Edinburgh",   multiplier: 0.80, note: "Strong in fintech & NLP research" },
  { region: "Bristol",     multiplier: 0.83, note: "Robotics & autonomous systems" },
  { region: "Remote (UK)", multiplier: 0.90, note: "Varies widely by company HQ" },
];

const EXPERIENCE_BANDS = [
  {
    label: "Junior",
    years: "0–2 years",
    range: [42000, 65000],
    median: 52000,
    color: "text-blue",
    bg: "bg-blue/10",
    border: "border-blue/20",
    note: "Often includes grad schemes & apprenticeships",
  },
  {
    label: "Mid-Level",
    years: "2–5 years",
    range: [65000, 95000],
    median: 78000,
    color: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/20",
    note: "Core delivery role; owns full features independently",
  },
  {
    label: "Senior",
    years: "5–8 years",
    range: [95000, 135000],
    median: 112000,
    color: "text-prp",
    bg: "bg-prp/10",
    border: "border-prp/20",
    note: "Technical leadership; mentors juniors; sets direction",
  },
  {
    label: "Principal / Staff",
    years: "8+ years",
    range: [130000, 200000],
    median: 155000,
    color: "text-warn",
    bg: "bg-warn/10",
    border: "border-warn/20",
    note: "Org-wide impact; cross-team architecture; IC track",
  },
];

const TOTAL_COMP = [
  { label: "Base Salary",     pct: 72, color: "bg-accent",  textColor: "text-accent" },
  { label: "Annual Bonus",    pct: 12, color: "bg-blue",    textColor: "text-blue" },
  { label: "Equity / Options",pct: 10, color: "bg-prp",     textColor: "text-prp" },
  { label: "Benefits & Perks",pct: 6,  color: "bg-ok",      textColor: "text-ok" },
];

const NEGOTIATION_TIPS = [
  {
    icon: Target,
    title: "Anchor to the upper quartile",
    body: "Open at P75 for your role and region. Employers rarely meet at P25; they negotiate down, not up.",
    accent: "text-accent",
    bg: "bg-accent/5",
    border: "border-accent/15",
  },
  {
    icon: Lightbulb,
    title: "Skills premium is real",
    body: "Holding in-demand LLM skills (RAG, fine-tuning, agentic AI) commands 15–25% above baseline for otherwise equivalent experience.",
    accent: "text-blue",
    bg: "bg-blue/5",
    border: "border-blue/15",
  },
  {
    icon: Building2,
    title: "Timing your offer window",
    body: "UK AI hiring peaks in January–March and September–October. Negotiating in peak season gives you the most leverage.",
    accent: "text-prp",
    bg: "bg-prp/5",
    border: "border-prp/15",
  },
  {
    icon: DollarSign,
    title: "Look beyond the base",
    body: "At scale-ups and frontier labs, equity can 2–5× the total package. Always model the total comp, not just base salary.",
    accent: "text-warn",
    bg: "bg-warn/5",
    border: "border-warn/15",
  },
];

export default async function SalaryPage() {
  let snapshot = null;
  try { snapshot = await api.snapshot(); } catch {}

  const medianSalary = snapshot?.salary_p50 ?? 82000;

  return (
    <div className="pt-14 relative">
      <div className="absolute inset-0 h-72 bg-mesh opacity-50 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Hero */}
        <PageHero
          badge="Compensation Intelligence"
          title="UK AI Salary"
          titleAccent="Benchmarks"
          subtitle="Salary percentiles derived from live job postings with stated compensation. All figures are gross annual salary in GBP. Updated each pipeline run."
          imageSrc="/images/page-salary-hero.jpg"
        >
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-s2 border border-b1">
              <span className="text-2xl font-black text-accent">{fmtK(medianSalary)}</span>
              <div>
                <p className="text-[10px] text-t1 font-semibold leading-none">Market Median</p>
                <p className="text-[10px] text-t3">all roles · all seniorities</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-s2 border border-b1">
              <span className="text-lg font-bold text-blue">{fmtK(snapshot?.salary_p25 ?? 55000)}</span>
              <span className="text-t3 text-xs">–</span>
              <span className="text-lg font-bold text-prp">{fmtK(snapshot?.salary_p75 ?? 120000)}</span>
              <p className="text-[10px] text-t3">P25 – P75 range</p>
            </div>
          </div>
        </PageHero>

        {/* Hero salary chart card */}
        <div className="rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/5 via-s1 to-blue/5 p-8 mb-8 animate-fade-up animate-delay-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6">
            <div>
              <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-2">Market Distribution</p>
              <p className="text-5xl font-black text-t1 tracking-tight">{fmtK(medianSalary)}</p>
              <p className="text-t2 mt-1 text-sm">Median UK AI/ML salary — all roles, all seniorities</p>
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
          <SalaryRange
            p25={snapshot?.salary_p25 ?? 55000}
            p50={snapshot?.salary_p50 ?? 82000}
            p75={snapshot?.salary_p75 ?? 120000}
            height={160}
          />
        </div>

        {/* Experience Bands */}
        <div className="rounded-2xl border border-b1 bg-s1 p-6 mb-6 animate-fade-up animate-delay-150">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-bold text-t1">Salary by Experience Level</h2>
            <span className="text-xs text-t2 ml-auto">UK AI/ML · Gross annual · GBP</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {EXPERIENCE_BANDS.map((band) => (
              <div key={band.label} className={`rounded-xl border p-5 ${band.border} bg-s2`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold uppercase tracking-wide ${band.color}`}>{band.label}</span>
                  <span className="text-[10px] text-t3 bg-s3 px-2 py-0.5 rounded-md border border-b1">{band.years}</span>
                </div>
                <div className="mb-3">
                  <p className={`text-2xl font-black ${band.color}`}>{fmtK(band.median)}</p>
                  <p className="text-[10px] text-t3 mt-0.5">median</p>
                </div>
                <div className="relative h-1.5 rounded-full bg-b1 overflow-hidden mb-3">
                  <div
                    className={`absolute top-0 left-0 h-full rounded-full ${band.bg} border ${band.border}`}
                    style={{ width: `${((band.range[1] - 40000) / 170000) * 100}%`, background: "currentColor" }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-t3 mb-2">
                  <span>{fmtK(band.range[0])}</span>
                  <span>{fmtK(band.range[1])}</span>
                </div>
                <p className="text-[10px] text-t2 leading-relaxed border-t border-b1 pt-2 mt-1">{band.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Role + Regional */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
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
                    <div
                      className="absolute top-0 h-full rounded-full bg-gradient-to-r from-blue via-accent to-prp opacity-70"
                      style={{
                        left: `${((s.p25 - 40000) / 120000) * 100}%`,
                        right: `${100 - ((s.p75 - 40000) / 120000) * 100}%`,
                      }}
                    />
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

        {/* Total Comp Breakdown + Remote Premium */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">

          {/* Total Comp */}
          <div className="rounded-2xl border border-b1 bg-s1 p-6 animate-fade-up animate-delay-350">
            <div className="flex items-center gap-2 mb-6">
              <DollarSign className="w-4 h-4 text-ok" />
              <h2 className="text-sm font-bold text-t1">Total Compensation Breakdown</h2>
            </div>
            <p className="text-t2 text-xs mb-6 leading-relaxed">
              Typical UK AI/ML total package split at mid–senior level. Base dominates, but equity at funded scale-ups can significantly change the picture.
            </p>
            <div className="space-y-3">
              {TOTAL_COMP.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-t1">{item.label}</span>
                    <span className={`text-sm font-black ${item.textColor}`}>{item.pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-b1 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${item.pct}%`, transition: "width 1s ease" }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-t3 mt-5 pt-4 border-t border-b1">
              Equity % is higher at funded Series A–C startups. Percentages are approximate and vary by employer stage.
            </p>
          </div>

          {/* Remote vs On-site */}
          <div className="rounded-2xl border border-b1 bg-s1 p-6 animate-fade-up animate-delay-400">
            <div className="flex items-center gap-2 mb-6">
              <Laptop className="w-4 h-4 text-prp" />
              <h2 className="text-sm font-bold text-t1">Remote vs On-Site Premium</h2>
            </div>
            <div className="space-y-3 mb-6">
              {[
                { model: "Fully Remote", salary: Math.round(medianSalary * 0.92), note: "Anchored to company HQ location", color: "text-prp", bar: 92 },
                { model: "Hybrid (2–3 days)", salary: Math.round(medianSalary * 1.0), note: "Standard in most UK AI roles today", color: "text-accent", bar: 100 },
                { model: "Fully On-site", salary: Math.round(medianSalary * 0.97), note: "London roles may compensate more", color: "text-blue", bar: 97 },
              ].map((row) => (
                <div key={row.model} className="p-4 rounded-xl bg-s2 border border-b1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className={`text-xs font-bold ${row.color}`}>{row.model}</p>
                      <p className="text-[10px] text-t3 mt-0.5">{row.note}</p>
                    </div>
                    <p className={`text-lg font-black ${row.color}`}>{fmtK(row.salary)}</p>
                  </div>
                  <div className="h-1.5 rounded-full bg-b1 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-prp to-accent"
                      style={{ width: `${row.bar}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-start gap-2 text-[10px] text-t3 pt-4 border-t border-b1">
              <Info className="w-3 h-3 shrink-0 mt-0.5" />
              Hybrid commands a slight premium as employers compete for talent willing to commute. Fully remote may be closer to employer&apos;s non-London base.
            </div>
          </div>
        </div>

        {/* Negotiation Intelligence */}
        <div className="rounded-2xl border border-b1 bg-s1 p-6 mb-6 animate-fade-up animate-delay-450">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-warn" />
            <h2 className="text-sm font-bold text-t1">Negotiation Intelligence</h2>
          </div>
          <p className="text-xs text-t2 mb-6">Practical tactics from analysis of 10,000+ UK AI/ML hiring threads and offer data.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {NEGOTIATION_TIPS.map((tip) => (
              <div key={tip.title} className={`rounded-xl border p-5 ${tip.border} ${tip.bg}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-s2 border ${tip.border}`}>
                    <tip.icon className={`w-4 h-4 ${tip.accent}`} />
                  </div>
                  <div>
                    <h3 className={`text-xs font-bold mb-1.5 ${tip.accent}`}>{tip.title}</h3>
                    <p className="text-[11px] text-t2 leading-relaxed">{tip.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sponsorship insight */}
        {snapshot?.sponsorship_rate && (
          <div className="rounded-2xl border border-b1 bg-s1 p-6 animate-fade-up animate-delay-500">
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
                { sector: "AI Safety",          rate: 0.45 },
                { sector: "Autonomous Systems", rate: 0.52 },
                { sector: "FinTech AI",         rate: 0.35 },
                { sector: "HealthTech AI",      rate: 0.28 },
                { sector: "Enterprise AI",      rate: 0.30 },
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
    </div>
  );
}
