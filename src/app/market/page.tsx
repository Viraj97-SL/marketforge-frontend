import { api } from "@/lib/api";
import { fmt, fmtK, pct } from "@/lib/utils";
import { SkillBar } from "@/components/charts/skill-bar";
import { SalaryRange } from "@/components/charts/salary-range";
import { StatCard } from "@/components/cards/stat-card";
import {
  BarChart3, TrendingUp, TrendingDown, DollarSign,
  Globe, Activity, Clock,
} from "lucide-react";

export const revalidate = 300;

export default async function MarketPage() {
  let snapshot = null;
  let skills   = null;
  let trending = null;

  try { snapshot = await api.snapshot(); }   catch {}
  try { skills   = await api.skills(); }     catch {}
  try { trending = await api.trending(7); }  catch {}

  const topSkillsList = Object.entries(skills?.top_skills ?? {})
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="pt-14 max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-10 animate-fade-up">
        <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-2">Live Intelligence</p>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-t1 mb-3">
          UK AI Job Market Overview
        </h1>
        <p className="text-t2 max-w-xl">
          Real-time aggregate view of the UK AI/ML hiring landscape. Data refreshed twice weekly
          from Adzuna, Reed, and specialist boards.
        </p>
        {snapshot?.week_start && (
          <p className="text-xs text-t3 mt-2">
            <Clock className="w-3 h-3 inline mr-1" />
            Week of {snapshot.week_start}
          </p>
        )}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
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
          delay={100}
        />
        <StatCard
          label="Sponsorship Rate"
          value={pct(snapshot?.sponsorship_rate)}
          sub="of AI roles"
          icon={Globe}
          accent="purple"
          delay={200}
        />
        <StatCard
          label="Salary Range"
          value={`${fmtK(snapshot?.salary_p25)} – ${fmtK(snapshot?.salary_p75)}`}
          sub="P25 – P75"
          icon={BarChart3}
          accent="green"
          delay={300}
        />
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Top skills — spans 2 cols */}
        <div className="lg:col-span-2 rounded-2xl border border-b1 bg-s1 p-6 animate-fade-up animate-delay-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-bold text-t1">Top In-Demand Skills</h2>
              <p className="text-xs text-t2 mt-0.5">By job posting frequency this week</p>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent font-medium">
              {topSkillsList.length} skills tracked
            </span>
          </div>
          {topSkillsList.length > 0 ? (
            <SkillBar data={topSkillsList} height={380} />
          ) : (
            <div className="flex items-center justify-center h-64 text-t2 text-sm">
              No skill data available yet
            </div>
          )}
        </div>

        {/* Trending panel */}
        <div className="flex flex-col gap-4">
          {/* Rising skills */}
          <div className="rounded-2xl border border-b1 bg-s1 p-6 flex-1 animate-fade-up animate-delay-300">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-ok" />
              <h2 className="text-sm font-bold text-t1">Rising Skills</h2>
            </div>
            <div className="space-y-2">
              {(trending?.rising ?? []).slice(0, 8).map((s, i) => (
                <div key={s} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-t3 font-mono w-4">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-xs text-t1 font-medium">{s}</span>
                  </div>
                  <span className="text-[10px] text-ok font-semibold">↑ rising</span>
                </div>
              ))}
              {(!trending?.rising?.length) && (
                <p className="text-xs text-t2">No trend data yet</p>
              )}
            </div>
          </div>

          {/* Declining skills */}
          <div className="rounded-2xl border border-b1 bg-s1 p-6 flex-1 animate-fade-up animate-delay-400">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="w-4 h-4 text-err" />
              <h2 className="text-sm font-bold text-t1">Declining Skills</h2>
            </div>
            <div className="space-y-2">
              {(trending?.declining ?? []).slice(0, 6).map((s, i) => (
                <div key={s} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-t3 font-mono w-4">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-xs text-t1 font-medium">{s}</span>
                  </div>
                  <span className="text-[10px] text-err font-semibold">↓ cooling</span>
                </div>
              ))}
              {(!trending?.declining?.length) && (
                <p className="text-xs text-t2">No trend data yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Salary detail */}
      <div className="rounded-2xl border border-b1 bg-s1 p-6 animate-fade-up animate-delay-500">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-bold text-t1">Salary Distribution</h2>
            <p className="text-xs text-t2 mt-0.5">All UK AI/ML roles · Gross annual · GBP</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-accent">{fmtK(snapshot?.salary_p50)}</p>
            <p className="text-xs text-t2">median salary</p>
          </div>
        </div>
        <SalaryRange
          p25={snapshot?.salary_p25 ?? null}
          p50={snapshot?.salary_p50 ?? null}
          p75={snapshot?.salary_p75 ?? null}
          height={200}
        />
        {snapshot?.salary_p50 && (
          <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-b1">
            {[
              { label: "Lower quartile", value: fmtK(snapshot.salary_p25), sub: "25th percentile", color: "text-blue" },
              { label: "Median", value: fmtK(snapshot.salary_p50), sub: "50th percentile", color: "text-accent" },
              { label: "Upper quartile", value: fmtK(snapshot.salary_p75), sub: "75th percentile", color: "text-prp" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
                <p className="text-xs text-t1 font-medium mt-0.5">{item.label}</p>
                <p className="text-[10px] text-t2">{item.sub}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
