"use client";
import { useReducedMotion } from "framer-motion";
import { ChapterOpener } from "@/components/ui/chapter-opener";
import { StoryProvider } from "@/components/market-story/story-context";
import { StoryStep } from "@/components/market-story/story-step";
import { StickyVisual } from "@/components/market-story/sticky-visual";
import { SkillShiftVisual } from "@/components/market-story/visuals/skill-shift-visual";
import { SkillHeatmapVisual } from "@/components/market-story/visuals/skill-heatmap-visual";
import { SkillBar } from "@/components/charts/skill-bar";
import type { RolesData, EntryLevelSkillShiftData, SkillCooccurrenceData, EntryLevelUniversalSkillsData } from "@/lib/api";

interface NarrativeSectionProps {
  roles: RolesData | null;
  skillShift: EntryLevelSkillShiftData | null;
  cooccurrence: SkillCooccurrenceData | null;
  universalSkills: EntryLevelUniversalSkillsData | null;
}

const ROLE_LABEL: Record<string, string> = { ai_engineer: "AI Engineer", research_scientist: "AI Research Scientist" };

/**
 * Four-chapter homepage narrative. Every figure quoted in the copy is
 * interpolated from the same props MarketStory-style components already
 * consume — nothing here is typed in as a literal; if the underlying data
 * changes, the sentence changes with it. Reuses the existing scrollytelling
 * engine (StoryProvider/StoryStep/StickyVisual) and chart components
 * (SkillShiftVisual, SkillHeatmapVisual, SkillBar) rather than building new
 * ones — one independent single-step "story" per chapter, each preceded by
 * a ChapterOpener band.
 */
export function NarrativeSection({ roles, skillShift, cooccurrence, universalSkills }: NarrativeSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  const roleCount: Record<string, number> = Object.fromEntries((roles?.roles ?? []).map((r) => [r.role_category, r.job_count]));
  const aiEngineer = roleCount["ai_engineer"] ?? 0;
  const researcher = roleCount["research_scientist"] ?? 0;

  const shifts = skillShift?.shifts ?? [];
  const topShift = shifts[0];

  const pairs = (cooccurrence?.pairs ?? []).slice(0, 6);
  const topPair = pairs[0];
  const secondPair = pairs[1];

  const spanSkills = universalSkills?.skills ?? [];
  // The "spreading, not loudest" signal: broad reach (top of the role_span-
  // sorted list from the API) but modest raw volume -- Python/SQL lead on
  // both breadth AND volume, which isn't an interesting story on its own.
  const spreading = spanSkills.find((s) => s.total < 100) ?? spanSkills[2] ?? spanSkills[0];

  const chapters = [
    {
      image: "/images/chapter-builders.avif",
      heading: "The market is hiring builders, not researchers.",
      sentence: aiEngineer > 0 && researcher > 0
        ? `AI Engineer leads with ${aiEngineer.toLocaleString()} postings; AI Research Scientist trails at ${researcher.toLocaleString()}.`
        : "Ranked by live postings across our full pipeline history.",
      eyebrow: "01 · Demand Shape",
      title: "Applied roles dwarf research roles",
      body: aiEngineer > 0 && researcher > 0 ? (
        <>Across our full pipeline history, <strong>AI Engineer</strong> postings outnumber <strong>AI Research Scientist</strong> postings
        by roughly <strong>{Math.round(aiEngineer / Math.max(researcher, 1))}×</strong> — the UK AI/ML market is overwhelmingly hiring people
        to build and ship, not to publish.</>
      ) : <>Not enough live role data yet.</>,
      scene: <SkillBar data={[{ skill: "AI Engineer", count: aiEngineer }, { skill: "AI Research Scientist", count: researcher }]} height={200} />,
      caption: "Source: live role_category counts, market.jobs, full pipeline history.",
    },
    {
      image: "/images/chapter-entry.avif",
      heading: "Entry level is a different market.",
      sentence: topShift
        ? `${topShift.skill} ranks #${topShift.overall_rank} overall but #${topShift.junior_rank} among junior postings.`
        : "Skill demand at entry level doesn't match the overall market ranking.",
      eyebrow: "02 · Entry-Level Reality",
      title: "What actually gets you hired at entry level",
      body: topShift ? (
        <>Skill demand ranked across the whole market doesn&apos;t match what actually gets a junior candidate hired.
        <strong> {topShift.skill}</strong> ranks #{topShift.overall_rank} overall but #{topShift.junior_rank} among entry-level
        postings{shifts[1] && <> — <strong>{shifts[1].skill}</strong> shows the same pattern, #{shifts[1].overall_rank} → #{shifts[1].junior_rank}</>}.</>
      ) : <>Not enough junior-level postings yet.</>,
      scene: <SkillShiftVisual shifts={shifts} />,
      caption: skillShift?.methodology ?? "Source: MarketForge scraped postings, last 90 days.",
    },
    {
      image: "/images/chapter-concentration.avif",
      heading: "Two skills carry almost everything.",
      sentence: topPair && secondPair
        ? `${topPair.skill_a} + ${topPair.skill_b} co-occur ${topPair.co_count.toLocaleString()} times. The next pair manages ${secondPair.co_count.toLocaleString()}.`
        : "A small number of skill pairs dominate every posting.",
      eyebrow: "03 · Concentration",
      title: "The co-occurrence cliff",
      body: topPair && secondPair ? (
        <><strong>{topPair.skill_a} + {topPair.skill_b}</strong> co-occur in the same postings <strong>{topPair.co_count.toLocaleString()}</strong> times
        all-time — the next most common pair, <strong>{secondPair.skill_a} + {secondPair.skill_b}</strong>, manages barely
        <strong> {secondPair.co_count.toLocaleString()}</strong>. It falls off a cliff after the top pair.</>
      ) : <>Not enough live co-occurrence data yet.</>,
      scene: <SkillBar data={pairs.map((p) => ({ skill: `${p.skill_a} + ${p.skill_b}`, count: p.co_count }))} height={220} />,
      caption: "Source: market.skill_cooccurrence, all-time totals, top 6 pairs.",
    },
    {
      // No photo for this chapter -- the construction-site image described
      // in the brief wasn't among the uploaded photos. Renders on the --ink
      // token alone rather than substituting an unrelated or fabricated image.
      image: undefined,
      heading: "Watch what is spreading, not what is loudest.",
      sentence: spreading
        ? `${spreading.skill}: ${spreading.total.toLocaleString()} postings, but present in ${spreading.role_span} of ${Math.max(...spanSkills.map(s => s.role_span), spreading.role_span)} role categories.`
        : "Breadth across roles matters more than raw volume.",
      eyebrow: "04 · The Quiet Signal",
      title: "Breadth beats volume",
      body: spreading ? (
        <><strong>{spreading.skill}</strong> only has <strong>{spreading.total.toLocaleString()}</strong> postings — modest next to Python
        or SQL — but it already shows up across <strong>{spreading.role_span}</strong> distinct role categories. That kind of spread across
        roles, not raw posting count, is what an emerging skill looks like before it gets loud.</>
      ) : <>Not enough live data across roles yet.</>,
      scene: <SkillHeatmapVisual skills={spanSkills} matrix={universalSkills?.matrix ?? []} />,
      caption: universalSkills?.methodology ?? "Source: MarketForge scraped postings, last 90 days.",
    },
  ];

  return (
    <div className="my-4">
      {chapters.map((c, i) => (
        <div key={i}>
          <ChapterOpener image={c.image} heading={c.heading} sentence={c.sentence} />
          {prefersReducedMotion ? (
            <div className="story-editorial">
              <div className="story-editorial-inner px-6 lg:px-12 py-14">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--story-accent)" }}>{c.eyebrow}</p>
                <h3 className="text-2xl font-semibold mt-3 mb-4 max-w-xl">{c.title}</h3>
                <p className="text-sm leading-relaxed max-w-lg mb-8" style={{ color: "var(--story-text-dim)" }}>{c.body}</p>
                {c.scene}
              </div>
            </div>
          ) : (
            <StoryProvider>
              <div className="story-editorial">
                <div className="story-editorial-inner grid lg:grid-cols-2">
                  <StoryStep index={0} eyebrow={c.eyebrow} title={c.title} scene={c.scene} caption={c.caption}>
                    {c.body}
                  </StoryStep>
                  <StickyVisual scenes={[c.scene]} captions={[c.caption]} />
                </div>
              </div>
            </StoryProvider>
          )}
        </div>
      ))}
    </div>
  );
}
