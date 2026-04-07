import { api } from "@/lib/api";
import { SkillBar } from "@/components/charts/skill-bar";
import { TrendBadge } from "@/components/ui/trend-badge";
import { BarChart3, TrendingUp, TrendingDown, Layers } from "lucide-react";

export const revalidate = 300;

const ROLE_CATEGORIES = ["all","ml_engineer","data_scientist","ai_researcher","nlp_engineer","mlops_engineer"];

export default async function SkillsPage() {
  let skills = null;
  let trending = null;

  try { skills = await api.skills("all"); }    catch {}
  try { trending = await api.trending(7); }    catch {}

  const topSkillsList = Object.entries(skills?.top_skills ?? {})
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count);

  const maxCount = topSkillsList[0]?.count ?? 1;

  return (
    <div className="pt-14 max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-10 animate-fade-up">
        <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-2">Skill Intelligence</p>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-t1 mb-3">
          UK AI Skill Demand
        </h1>
        <p className="text-t2 max-w-xl">
          Ranked by job posting frequency this week. Skills extracted from raw job descriptions
          using a 3-gate NLP pipeline (flashtext → BM25 → SBERT semantic matching).
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main chart */}
        <div className="lg:col-span-2 rounded-2xl border border-b1 bg-s1 p-6 animate-fade-up animate-delay-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-bold text-t1">Top 15 Most-Demanded Skills</h2>
              <p className="text-xs text-t2 mt-0.5">By job posting count — all UK AI/ML roles</p>
            </div>
            <BarChart3 className="w-5 h-5 text-t3" />
          </div>
          {topSkillsList.length > 0 ? (
            <SkillBar data={topSkillsList} height={420} />
          ) : (
            <div className="flex items-center justify-center h-64 text-t2 text-sm">
              Skill data will appear after first pipeline run
            </div>
          )}
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          {/* Rising */}
          <div className="rounded-2xl border border-b1 bg-s1 p-5 animate-fade-up animate-delay-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-ok/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-ok" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-t1">Rising Skills</h3>
                <p className="text-[10px] text-t2">Gaining demand week-over-week</p>
              </div>
            </div>
            <div className="space-y-2">
              {(trending?.rising ?? []).slice(0, 10).map((s, i) => (
                <div key={s} className="flex items-center justify-between p-2 rounded-lg hover:bg-s2 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-t3 w-5">{String(i+1).padStart(2,"0")}</span>
                    <span className="text-xs text-t1 font-medium">{s}</span>
                  </div>
                  <TrendBadge direction="up" />
                </div>
              ))}
              {!trending?.rising?.length && <p className="text-xs text-t2 py-2">No rising data yet</p>}
            </div>
          </div>

          {/* Declining */}
          <div className="rounded-2xl border border-b1 bg-s1 p-5 animate-fade-up animate-delay-300">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-err/10 flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-err" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-t1">Cooling Skills</h3>
                <p className="text-[10px] text-t2">Losing demand week-over-week</p>
              </div>
            </div>
            <div className="space-y-2">
              {(trending?.declining ?? []).slice(0, 8).map((s, i) => (
                <div key={s} className="flex items-center justify-between p-2 rounded-lg hover:bg-s2 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-t3 w-5">{String(i+1).padStart(2,"0")}</span>
                    <span className="text-xs text-t1 font-medium">{s}</span>
                  </div>
                  <TrendBadge direction="down" />
                </div>
              ))}
              {!trending?.declining?.length && <p className="text-xs text-t2 py-2">No declining data yet</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Full skill table */}
      {topSkillsList.length > 0 && (
        <div className="mt-6 rounded-2xl border border-b1 bg-s1 p-6 animate-fade-up animate-delay-400">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-bold text-t1">Full Skill Rankings</h2>
              <p className="text-xs text-t2 mt-0.5">All {topSkillsList.length} skills extracted this week</p>
            </div>
            <Layers className="w-5 h-5 text-t3" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {topSkillsList.slice(0, 30).map((s, i) => (
              <div key={s.skill} className="flex items-center gap-3 p-3 rounded-xl border border-b1 hover:border-b2 transition-colors">
                <span className="font-mono text-xs text-t3 w-6 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-t1 truncate">{s.skill}</span>
                    <span className="text-xs text-accent font-bold ml-2 shrink-0">{s.count}</span>
                  </div>
                  <div className="h-1 rounded-full bg-b1 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-accent to-blue"
                      style={{ width: `${(s.count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
