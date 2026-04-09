import { api } from "@/lib/api";
import { fmt, fmtK, pct } from "@/lib/utils";
import { SkillBar } from "@/components/charts/skill-bar";
import { SalaryRange } from "@/components/charts/salary-range";
import { StatCard } from "@/components/cards/stat-card";
import {
  BarChart3, TrendingUp, TrendingDown, DollarSign,
  Globe, Activity, Clock, Sparkles,
} from "lucide-react";

export const revalidate = 300;

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

  return (
    <div className="pt-14 relative">
      {/* Background */}
      <div className="absolute inset-0 h-64 bg-mesh pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="mb-10 animate-fade-up">
          <div className="flex items-center gap-2 mb-3">
            <p className="text-xs font-bold text-accent uppercase tracking-widest">Live Intelligence</p>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-ok/20 bg-ok/5">
              <span className="w-1.5 h-1.5 rounded-full bg-ok animate-pulse" />
              <span className="text-[10px] font-semibold text-ok">Live</span>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-t1 mb-3">
            UK AI Job Market <span className="text-gradient">Overview</span>
          </h1>
          <p className="text-t2 max-w-xl leading-relaxed">
            Real-time aggregate view of the UK AI/ML hiring landscape. Data refreshed twice weekly
            from Adzuna, Reed, and specialist boards.
          </p>
          {snapshot?.week_start && (
            <p className="text-xs text-t3 mt-3 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
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

        {/* Main grid */}
        <div className="grid lg:grid-cols-3 gap-5 mb-5">

          {/* Top skills — 2 cols */}
          <div className="lg:col-span-2 rounded-2xl border border-b1 bg-gradient-to-br from-s1 to-s2 p-6 animate-fade-up animate-delay-200">
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

          {/* Trending panel */}
          <div className="flex flex-col gap-4">
            {/* Rising */}
            <div className="rounded-2xl border border-b1 bg-gradient-to-br from-s1 to-s2 p-5 flex-1 animate-fade-up animate-delay-300">
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

            {/* Declining */}
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

        {/* Salary detail */}
        <div className="rounded-2xl border border-b1 bg-gradient-to-br from-s1 to-s2 p-6 animate-fade-up animate-delay-500">
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
