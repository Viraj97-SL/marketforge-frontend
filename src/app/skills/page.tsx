import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI & ML Skills Demand UK",
  description:
    "Which skills are UK AI employers hiring for right now? All-time rankings by job count, weekly velocity, and role category.",
  alternates: { canonical: "https://marketforge.digital/skills" },
  openGraph: {
    title: "UK AI Skills Demand Rankings | MarketForge AI",
    description:
      "UK AI/ML skills demand ranked across our full pipeline history: job postings, role category breakdowns, and week-over-week trends.",
    url: "https://marketforge.digital/skills",
  },
};

import { api } from "@/lib/api";
import type { SkillsData, RolesData, SkillCooccurrenceData, EntryLevelSkillShiftData, EntryLevelUniversalSkillsData } from "@/lib/api";
import { ROLE_CONFIGS } from "@/lib/roles";
import { SkillBar } from "@/components/charts/skill-bar";
import { PageHero } from "@/components/layout/page-hero";
import { SkillNetwork } from "@/components/illustrations/skill-network";
import { RankedTable } from "@/components/ui/ranked-table";
import { ChapterOpener } from "@/components/ui/chapter-opener";
import { TrendingUp, TrendingDown, Briefcase, Network, GraduationCap, Layers } from "lucide-react";

const ROLE_LABELS: Record<string, string> = Object.fromEntries(
  ROLE_CONFIGS.map((r) => [r.apiSlug, r.label])
);
function roleLabel(rc: string): string {
  return ROLE_LABELS[rc] ?? rc.split("_").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}

export default async function SkillsPage() {
  let skills          = null;
  let weeklySkills     = null;
  let trending        = null;
  let rolesRaw         = null;
  let cooccurrenceRaw  = null;
  let skillShiftRaw    = null;
  let universalSkillsRaw = null;

  const [, , , , , , , ...roleResults] = await Promise.allSettled([
    api.skills()                    .then(d => { skills             = d; }),
    api.weeklySkills()              .then(d => { weeklySkills       = d; }),
    api.trending(7)                 .then(d => { trending           = d; }),
    api.roles()                     .then(d => { rolesRaw           = d; }),
    api.skillCooccurrence(40)       .then(d => { cooccurrenceRaw    = d; }),
    api.entryLevelSkillShift()      .then(d => { skillShiftRaw      = d; }),
    api.entryLevelUniversalSkills() .then(d => { universalSkillsRaw = d; }),
    ...ROLE_CONFIGS.map(r => api.skills(r.apiSlug)),
  ]);

  const topSkillsList = Object.entries((skills as any)?.top_skills ?? {})
    .map(([skill, count]) => ({ skill, count: count as number }))
    .sort((a, b) => b.count - a.count);

  const weeklyTopSkillsList = Object.entries((weeklySkills as any)?.top_skills ?? {})
    .map(([skill, count]) => ({ skill, count: count as number }))
    .sort((a, b) => b.count - a.count);
  const weekStart = (weeklySkills as any)?.week_start ?? null;

  const risingSkills    = (trending as any)?.rising    ?? [];
  const decliningSkills = (trending as any)?.declining ?? [];
  const hasLiveSkills   = topSkillsList.length > 0;

  const roles = rolesRaw as RolesData | null;
  const roleRows = (roles?.roles ?? []).map((r) => ({ key: r.role_category, label: roleLabel(r.role_category), count: r.job_count }));
  const roleJobCount: Record<string, number> = Object.fromEntries((roles?.roles ?? []).map((r) => [r.role_category, r.job_count]));

  const cooccurrence = cooccurrenceRaw as SkillCooccurrenceData | null;
  const pairs = cooccurrence?.pairs ?? [];
  const topPairSentence = pairs[0]
    ? `${pairs[0].skill_a} + ${pairs[0].skill_b} co-occur ${pairs[0].co_count.toLocaleString()} times all-time — the next pair falls off fast.`
    : "A small number of skill pairs dominate every posting.";

  const skillShift = skillShiftRaw as EntryLevelSkillShiftData | null;
  const universalSkills = universalSkillsRaw as EntryLevelUniversalSkillsData | null;

  // Live top skill per role — no hardcoded per-role skill list. A role with
  // no snapshot yet shows an honest "not enough live data" state instead.
  const topSkillPerRole = ROLE_CONFIGS.map((r, i) => {
    const res = roleResults[i];
    const d = res.status === "fulfilled" ? (res.value as SkillsData) : null;
    const ranked = Object.entries(d?.top_skills ?? {}).sort((a, b) => (b[1] as number) - (a[1] as number));
    const top = ranked[0]?.[0] ?? null;
    const secondary = ranked.slice(1, 4).map(([s]) => s).join(", ");
    return { role: r.label, skill: top, secondary, live: top != null, n: roleJobCount[r.apiSlug] ?? 0 };
  });

  return (
    <div className="pt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">

        {/* Hero */}
        <PageHero
          badge="Skill Intelligence"
          title="UK AI Skills"
          titleAccent="Demand"
          subtitle="Which skills are UK AI employers actually hiring for right now? Ranked across our full pipeline history, derived from live NLP analysis of job descriptions."
          imageSrc="/images/page-skills-hero.avif"
        >
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/20 font-semibold">
              {hasLiveSkills ? `${topSkillsList.length} skills live` : "Skills tracked live"}
            </span>
            <span className="text-slate-600">·</span>
            <span>3-gate NLP extraction</span>
            <span className="text-slate-600">·</span>
            <span>flashtext → BM25 → SBERT</span>
          </div>
        </PageHero>

        {/* Skill network illustration — real job counts + real co-occurrence */}
        <div className="bg-s1 rounded-2xl border border-b1 p-6 mb-6 shadow-card animate-fade-up animate-delay-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-t1">UK AI Skill Ecosystem</h2>
              <p className="text-xs text-t2 mt-0.5">How in-demand skills connect and co-occur in job postings — node size = live job count, lines = real co-listing frequency</p>
            </div>
          </div>
          <SkillNetwork height={320} topSkills={topSkillsList} pairs={pairs} />
        </div>

        {/* Top Roles by Job Demand */}
        <div className="bg-s1 rounded-2xl border border-b1 p-6 mb-6 shadow-card animate-fade-up animate-delay-75">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-blue/10 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-blue" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-t1">Top Roles by Job Demand</h2>
              <p className="text-[10px] text-t2">Ranked by postings across our full pipeline history · search to jump to a role</p>
            </div>
          </div>
          {roleRows.length > 0 ? (
            <RankedTable rows={roleRows} countLabel="job postings" searchPlaceholder="Search roles by name…" />
          ) : (
            <p className="text-xs text-t3 py-8 text-center">Not enough live role data yet</p>
          )}
        </div>

        {/* Top Skills by Job Demand */}
        {hasLiveSkills && (
          <div className="bg-s1 rounded-2xl border border-b1 p-6 mb-6 shadow-card animate-fade-up animate-delay-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm font-bold text-t1">Top Skills by Job Demand</h2>
                <p className="text-xs text-t2 mt-0.5">Ranked across our full pipeline history · search to jump to a skill</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-accent/8 text-accent font-semibold border border-accent/20">
                {topSkillsList.length} skills tracked
              </span>
            </div>

            {/* Bar chart (top 15) */}
            <SkillBar data={topSkillsList.slice(0, 15)} height={340} />

            {/* Full searchable, paginated ranking */}
            <div className="mt-8 border-t border-b1 pt-6">
              <h3 className="text-xs font-bold text-t1 mb-4">Full Ranking</h3>
              <RankedTable
                rows={topSkillsList.map((s) => ({ key: s.skill, label: s.skill, count: s.count }))}
                countLabel="job postings"
                searchPlaceholder="Search skills by name…"
              />
            </div>
          </div>
        )}

        {/* Top Skills by Job Demand — this week's snapshot (distinct from the all-time ranking above) */}
        <div className="bg-s1 rounded-2xl border border-b1 p-6 mb-6 shadow-card animate-fade-up animate-delay-150">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-bold text-t1">Top Skills by Job Demand — This Week</h2>
              <p className="text-xs text-t2 mt-0.5">
                Live · ranked by job posting frequency this week{weekStart ? ` · snapshot from ${weekStart}` : ""}
              </p>
            </div>
            {weeklyTopSkillsList.length > 0 && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-blue/8 text-blue font-semibold border border-blue/20">
                {weeklyTopSkillsList.length} skills this week
              </span>
            )}
          </div>
          {weeklyTopSkillsList.length > 0 ? (
            <SkillBar data={weeklyTopSkillsList.slice(0, 15)} height={340} />
          ) : (
            <p className="text-xs text-t3 py-10 text-center">Not enough postings this week yet — check back after the next pipeline run.</p>
          )}
        </div>

        {/* Trending */}
        <div className="grid sm:grid-cols-2 gap-5 mb-6">
          <div className="bg-s1 rounded-2xl border border-b1 p-6 shadow-card animate-fade-up animate-delay-200">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-ok/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-ok" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-t1">Rising Skills</h2>
                <p className="text-[10px] text-t2">Growing in demand week-over-week</p>
              </div>
            </div>
            <div className="space-y-1">
              {risingSkills.slice(0, 12).map((s: string, i: number) => (
                <div key={s} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-s2 transition-colors">
                  <span className="text-[10px] text-t3 font-mono w-5">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-xs text-t1 font-medium">{s}</span>
                  <span className="ml-auto text-[10px] bg-ok/10 text-ok px-1.5 py-0.5 rounded font-bold">↑</span>
                </div>
              ))}
              {risingSkills.length === 0 && (
                <p className="text-xs text-t2 py-8 text-center">Trend data available after 2 pipeline runs</p>
              )}
            </div>
          </div>

          <div className="bg-s1 rounded-2xl border border-b1 p-6 shadow-card animate-fade-up animate-delay-250">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-warn/10 flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-warn" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-t1">Cooling Skills</h2>
                <p className="text-[10px] text-t2">Losing frequency in job postings</p>
              </div>
            </div>
            <div className="space-y-1">
              {decliningSkills.slice(0, 12).map((s: string, i: number) => (
                <div key={s} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-s2 transition-colors">
                  <span className="text-[10px] text-t3 font-mono w-5">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-xs text-t1 font-medium">{s}</span>
                  <span className="ml-auto text-[10px] bg-warn/10 text-warn px-1.5 py-0.5 rounded font-bold">↓</span>
                </div>
              ))}
              {decliningSkills.length === 0 && (
                <p className="text-xs text-t2 py-8 text-center">Trend data available after 2 pipeline runs</p>
              )}
            </div>
          </div>
        </div>

      </div>

      <ChapterOpener
        image="/images/chapter-concentration.avif"
        heading="A handful of skills carry almost everything."
        sentence={topPairSentence}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">

        {/* Skills that pair together — real co-occurrence, drives the network above */}
        <div className="bg-s1 rounded-2xl border border-b1 p-6 mb-6 shadow-card animate-fade-up animate-delay-300">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 rounded-xl bg-prp/10 flex items-center justify-center">
              <Network className="w-4 h-4 text-prp" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-t1">Skills That Pair Together</h2>
              <p className="text-[10px] text-t2">Skill pairs most often required in the same posting, all-time</p>
            </div>
          </div>
          {pairs.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-1.5">
              {pairs.slice(0, 16).map((p, i) => (
                <div key={`${p.skill_a}-${p.skill_b}`} className="flex items-center gap-2.5 py-1.5">
                  <span className="text-[10px] text-t3 font-mono w-5">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-xs text-t1 font-medium flex-1">{p.skill_a} <span className="text-t3">+</span> {p.skill_b}</span>
                  <span className="text-[10px] font-mono text-prp font-bold">{p.co_count.toLocaleString()}×</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-t3 py-8 text-center">Not enough live co-occurrence data yet</p>
          )}
        </div>

        {/* Entry-level insights */}
        <div className="grid sm:grid-cols-2 gap-5 mb-6">
          <div className="bg-s1 rounded-2xl border border-b1 p-6 shadow-card animate-fade-up animate-delay-350">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-accent" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-t1">Skills That Punch Above Their Weight at Entry Level</h2>
                <p className="text-[10px] text-t2">
                  Overall market rank vs. rank among junior-only postings, last 90 days
                  {skillShift && skillShift.sample_size_junior > 0 && (
                    <span className={skillShift.sample_size_junior < 50 ? "text-warn font-semibold" : ""}>
                      {" "}· n={skillShift.sample_size_junior.toLocaleString()} junior postings{skillShift.sample_size_junior < 50 ? " (small sample)" : ""}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {(() => {
                const shifts = (skillShift?.shifts ?? []).slice(0, 8);
                if (shifts.length === 0) {
                  return <p className="text-xs text-t3 py-8 text-center">Not enough junior-level postings yet</p>;
                }
                const scaleMax = Math.max(...shifts.map((s) => s.overall_rank), 40);
                const xFor = (rank: number) => 4 + (Math.min(rank, scaleMax) / scaleMax) * 92; // % across track, best rank (1) near left
                return shifts.map((s) => (
                  <div key={s.skill}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-t1 font-semibold">{s.skill}</span>
                      <span className="text-[10px] font-mono text-ok font-bold bg-ok/10 px-1.5 py-0.5 rounded">
                        ▲ {s.rank_delta} ranks at entry level
                      </span>
                    </div>
                    <div className="relative h-5">
                      <div className="absolute top-1/2 -translate-y-1/2 left-1 right-1 h-px bg-b1" />
                      {/* line connecting overall → junior position */}
                      <div
                        className="absolute top-1/2 -translate-y-1/2 h-0.5 bg-accent/40 rounded-full"
                        style={{ left: `${Math.min(xFor(s.overall_rank), xFor(s.junior_rank))}%`, width: `${Math.abs(xFor(s.overall_rank) - xFor(s.junior_rank))}%` }}
                      />
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-s3 border-2 border-t3"
                        style={{ left: `${xFor(s.overall_rank)}%` }}
                        title={`#${s.overall_rank} overall`}
                      />
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent shadow-sm"
                        style={{ left: `${xFor(s.junior_rank)}%` }}
                        title={`#${s.junior_rank} junior`}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-t3">
                      <span>#{s.overall_rank} overall rank</span>
                      <span className="text-accent font-semibold">#{s.junior_rank} junior rank</span>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>

          <div className="bg-s1 rounded-2xl border border-b1 p-6 shadow-card animate-fade-up animate-delay-400">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-blue/10 flex items-center justify-center">
                <Layers className="w-4 h-4 text-blue" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-t1">Skills Spanning the Most Roles</h2>
                <p className="text-[10px] text-t2">Present across the widest range of role categories, not just raw frequency</p>
              </div>
            </div>
            <div className="space-y-2.5">
              {(() => {
                const spanSkills = (universalSkills?.skills ?? []).slice(0, 8);
                if (spanSkills.length === 0) {
                  return <p className="text-xs text-t3 py-8 text-center">Not enough live data yet</p>;
                }
                const maxSpan = spanSkills[0].role_span || 1;
                return spanSkills.map((s) => (
                  <div key={s.skill}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-t1 font-semibold">{s.skill}</span>
                      <span className="text-[10px] text-t3">
                        <span className="text-blue font-bold font-mono">{s.role_span}</span> of {maxSpan} roles · {s.total.toLocaleString()} jobs
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-s2 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue to-accent"
                        style={{ width: `${Math.round((s.role_span / maxSpan) * 100)}%` }}
                      />
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>

        {/* Top skill per role — live per role_category, not a fixed list */}
        <div className="bg-s1 rounded-2xl border border-b1 p-6 shadow-card animate-fade-up animate-delay-500">
          <h2 className="text-sm font-bold text-t1 mb-1">Top Skill Per Role</h2>
          <p className="text-xs text-t2 mb-6">Most commonly required skills by job function · all-time</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {topSkillPerRole.map((r, i) => {
              const palette = ["text-accent bg-accent/8 border-accent/15", "text-blue bg-blue/8 border-blue/15", "text-prp bg-prp/8 border-prp/15", "text-warn bg-warn/8 border-warn/15", "text-ok bg-ok/8 border-ok/15", "text-err bg-err/8 border-err/15", "text-accent bg-accent/8 border-accent/15"];
              const [accent, bg, border] = palette[i % palette.length].split(" ");
              return (
                <div key={r.role} className={`p-4 rounded-xl border ${border} ${bg}`}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] text-t3">{r.role}</p>
                    {r.n > 0 && (
                      <p className="text-[9px] text-t3 font-mono">
                        {r.n.toLocaleString()} posting{r.n === 1 ? "" : "s"}{r.n < 50 ? " · small sample" : ""}
                      </p>
                    )}
                  </div>
                  {r.live ? (
                    <>
                      <p className={`text-lg font-black ${accent}`}>{r.skill}</p>
                      {r.secondary && <p className="text-[10px] text-t2 mt-1">{r.secondary}</p>}
                    </>
                  ) : (
                    <p className="text-xs text-t3 py-1">Not enough live postings yet</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
