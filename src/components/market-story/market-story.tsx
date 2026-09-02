"use client";
import { useReducedMotion } from "framer-motion";
import { StoryProvider } from "./story-context";
import { StoryStep } from "./story-step";
import { StickyVisual } from "./sticky-visual";
import { PictogramVisual } from "./visuals/pictogram-visual";
import { SkillShiftVisual } from "./visuals/skill-shift-visual";
import { SkillHeatmapVisual } from "./visuals/skill-heatmap-visual";
import { EntryHiringVisual } from "./visuals/entry-hiring-visual";
import { SalaryGapVisual } from "./visuals/salary-gap-visual";
import type {
  GraduateOutcomesData, EntryLevelSkillShiftData, EntryLevelUniversalSkillsData,
  EntryLevelCompanyMixData, SalaryBenchmarkRow,
} from "@/lib/api";

interface MarketStoryProps {
  graduateOutcomes: GraduateOutcomesData | null;
  skillShift: EntryLevelSkillShiftData | null;
  universalSkills: EntryLevelUniversalSkillsData | null;
  entryCompanyMix: EntryLevelCompanyMixData | null;
  juniorSalaryP25: number | null;
  asheBenchmark: SalaryBenchmarkRow | null;
}

/**
 * The graduate-reality narrative: how many people enter the UK AI/ML
 * pipeline, what the entry-level door actually requires (measurably
 * different from the overall market), which skills form the universal
 * floor regardless of role, who actually does the entry-level hiring,
 * and what it pays versus the broad occupation benchmark and cited
 * graduate-salary-expectation surveys.
 *
 * Five acts, five different chart families (pictogram, slope chart,
 * heatmap, donut, single-axis gap plot) — no two acts share a chart type,
 * and none of them re-renders data already shown elsewhere on the page.
 */
export function MarketStory(props: MarketStoryProps) {
  const prefersReducedMotion = useReducedMotion();
  const emp = props.graduateOutcomes?.employment;
  const qual = props.graduateOutcomes?.computing_qualifiers;
  const topShift = props.skillShift?.shifts?.[0];

  const steps = [
    {
      eyebrow: "01 · The Pipeline",
      title: "How many people are actually entering this market",
      body: (
        <>
          {qual
            ? <>England produced <strong style={{ color: "var(--story-text)" }}>{qual.qualifiers_count.toLocaleString()}</strong> Computing
              graduates in {qual.academic_year}. Here&apos;s roughly what happens to graduates once they leave.</>
            : <>Here&apos;s the graduate pipeline behind this market.</>}
          {emp && <> Only about <strong style={{ color: "var(--story-accent)" }}>{Math.round(emp.hs_employment_rate)}%</strong> of
          graduates land in high-skilled employment — the rest are in lower-skilled work, further study, or not working.</>}
        </>
      ),
      scene: (
        <PictogramVisual
          qualifiersCount={qual?.qualifiers_count ?? null}
          academicYear={qual?.academic_year ?? null}
          highlightPct={emp ? 100 - emp.hs_employment_rate : null}
          highlightLabel="of all UK graduates are NOT in high-skilled employment 15 months on"
        />
      ),
      caption: props.graduateOutcomes?.methodology ?? "Source: DfE Explore Education Statistics.",
    },
    {
      eyebrow: "02 · Entry-Level Reality",
      title: "What actually gets you hired at entry level",
      body: (
        <>
          Skill demand ranked across the whole market doesn&apos;t match what actually gets a junior
          candidate hired.
          {topShift && (
            <> <strong style={{ color: "var(--story-text)" }}>{topShift.skill}</strong> ranks
            #{topShift.overall_rank} overall but #{topShift.junior_rank} among entry-level postings —
            it matters far more at the door than the aggregate numbers suggest.</>
          )}
        </>
      ),
      scene: <SkillShiftVisual shifts={props.skillShift?.shifts ?? []} />,
      caption: props.skillShift?.methodology ?? "Source: MarketForge scraped postings, last 90 days.",
    },
    {
      eyebrow: "03 · The Skill Floor",
      title: "The handful of skills nobody escapes",
      body: (
        <>
          Regardless of which AI/ML specialisation a role sits in, a small set of skills shows up
          almost everywhere — the real floor every candidate needs, independent of career track.
        </>
      ),
      scene: (
        <SkillHeatmapVisual
          skills={props.universalSkills?.skills ?? []}
          matrix={props.universalSkills?.matrix ?? []}
        />
      ),
      caption: props.universalSkills?.methodology ?? "Source: MarketForge scraped postings, last 90 days.",
    },
    {
      eyebrow: "04 · Who Opens The Door",
      title: "Who's actually doing the entry-level hiring",
      body: (
        <>
          Big-name enterprise employers dominate headlines, but the entry-level door is often opened
          by a different kind of company entirely.
        </>
      ),
      scene: (
        <EntryHiringVisual
          mix={props.entryCompanyMix?.mix ?? []}
          sampleSize={props.entryCompanyMix?.sample_size ?? 0}
        />
      ),
      caption: `Source: MarketForge scraped postings, experience_level=junior (n=${props.entryCompanyMix?.sample_size ?? 0}).`,
    },
    {
      eyebrow: "05 · The Pay Reality",
      title: "What it actually pays versus what's expected",
      body: (
        <>
          Broad graduate salary surveys set an expectation. The real entry point in this specific
          market — and the closest official occupation benchmark — often tell a different story.
        </>
      ),
      scene: (
        <SalaryGapVisual
          juniorP25={props.juniorSalaryP25}
          asheMedian={props.asheBenchmark?.salary_p50 ?? null}
          asheSocTitle={props.asheBenchmark?.soc_title ?? null}
        />
      ),
      caption: "Sources: MarketForge sample (experience_level=junior), ONS ASHE, Prospects/ISE graduate salary surveys (hand-cited, not live-fetched).",
    },
  ];

  // Brand-bridge bar: the site's own indigo accent fading into the story's
  // amber, so the transition into editorial mode reads as this site's own
  // section rather than a different product pasted in.
  const bridgeBar = (
    <div className="h-1" style={{ background: "linear-gradient(90deg, #4F46E5 0%, #E8A33D 100%)" }} />
  );

  if (prefersReducedMotion) {
    return (
      <div className="story-editorial my-10 rounded-2xl shadow-card overflow-hidden">
        {bridgeBar}
        <div className="story-editorial-inner">
          {steps.map((s, i) => (
            <div key={i} className="px-6 lg:px-12 py-14" style={{ borderBottom: i < steps.length - 1 ? "1px solid var(--story-line)" : undefined }}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--story-accent)" }}>{s.eyebrow}</p>
              <h3 className="text-2xl font-semibold mt-3 mb-4 max-w-xl">{s.title}</h3>
              <p className="text-sm leading-relaxed max-w-lg mb-8" style={{ color: "var(--story-text-dim)" }}>{s.body}</p>
              {s.scene}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <StoryProvider>
      <div className="story-editorial my-10 rounded-2xl shadow-card overflow-hidden">
        {bridgeBar}
        <div className="story-editorial-inner grid lg:grid-cols-2">
          <div>
            {steps.map((s, i) => (
              <StoryStep key={i} index={i} eyebrow={s.eyebrow} title={s.title}>
                {s.body}
              </StoryStep>
            ))}
          </div>
          <StickyVisual scenes={steps.map((s) => s.scene)} captions={steps.map((s) => s.caption)} />
        </div>
      </div>
    </StoryProvider>
  );
}
