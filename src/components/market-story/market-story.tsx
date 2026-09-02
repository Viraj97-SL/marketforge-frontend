"use client";
import { useReducedMotion } from "framer-motion";
import { StoryProvider } from "./story-context";
import { StoryStep } from "./story-step";
import { StickyVisual } from "./sticky-visual";
import { SkillsVisual } from "./visuals/skills-visual";
import { GeographyVisual } from "./visuals/geography-visual";
import { VelocityVisual } from "./visuals/velocity-visual";
import { SalaryVisual } from "./visuals/salary-visual";
import type {
  CityCount, HiringVelocityItem, SalaryBenchmarkRow, SponsorVerificationData,
} from "@/lib/api";

interface MarketStoryProps {
  topSkills: { skill: string; count: number }[];
  cityList: CityCount[];
  vacancyTrendPoints: { label: string; value: number }[];
  isLiveVelocity: boolean;
  velocityItems: HiringVelocityItem[];
  velocitySource: string | null;
  velocityMethodology: string | null;
  salaryP50: number | null;
  asheBenchmark: SalaryBenchmarkRow | null;
  sponsorVerification: SponsorVerificationData | null;
}

/**
 * Whole-page scrollytelling narrative: skills → geography → hiring
 * velocity → salary & sponsorship. Each StoryStep activates the matching
 * scene in the shared sticky visual as it crosses the viewport centre.
 *
 * Respects prefers-reduced-motion: instead of the sticky cross-fading
 * panel, every scene renders inline beneath its own step — a plain
 * stacked layout with no scroll-linked motion.
 */
export function MarketStory(props: MarketStoryProps) {
  const prefersReducedMotion = useReducedMotion();

  const steps = [
    {
      eyebrow: "01 · Skills",
      title: "The skills employers are actually asking for",
      body: (
        <>
          Ranked by how often each skill appears across this week&apos;s postings.
          {props.topSkills[0] && (
            <> <strong style={{ color: "var(--story-text)" }}>{props.topSkills[0].skill}</strong> leads
            the field — the single most-requested capability in the UK AI/ML market right now.</>
          )}
        </>
      ),
      scene: <SkillsVisual topSkills={props.topSkills} />,
      caption: "Source: MarketForge scraped postings, current week.",
    },
    {
      eyebrow: "02 · Geography",
      title: "Where the roles actually are",
      body: (
        <>
          London still dominates UK AI hiring, but the story underneath is regional
          specialisation: Cambridge for biotech AI, Edinburgh for NLP/fintech,
          Bristol for robotics.
        </>
      ),
      scene: <GeographyVisual cityList={props.cityList} />,
      caption: "Source: MarketForge scraped postings, current week.",
    },
    {
      eyebrow: "03 · Velocity",
      title: props.isLiveVelocity ? "Which roles are accelerating" : "The wider hiring trend",
      body: props.isLiveVelocity ? (
        <>Week-over-week change by role category, from our own sample.</>
      ) : (
        <>
          Our own week-over-week sample is still building enough history to compare.
          In the meantime, this is the real national trend for the closest official
          proxy sector — not a guess.
        </>
      ),
      scene: (
        <VelocityVisual
          vacancyTrendPoints={props.vacancyTrendPoints}
          isLiveVelocity={props.isLiveVelocity}
          velocityItems={props.velocityItems}
        />
      ),
      caption: props.isLiveVelocity
        ? "Source: MarketForge weekly snapshots."
        : (props.velocitySource ?? "Source: ONS."),
    },
    {
      eyebrow: "04 · Salary & Sponsorship",
      title: "What it pays, and who can actually sponsor you",
      body: (
        <>
          Our scraped median sits alongside the closest official ONS benchmark, and
          the sponsorship figure below is checked against the real GOV.UK register —
          not just what a job ad claims.
        </>
      ),
      scene: (
        <SalaryVisual
          salaryP50={props.salaryP50}
          asheBenchmark={props.asheBenchmark}
          sponsorVerification={props.sponsorVerification}
        />
      ),
      caption: "Sources: MarketForge sample, ONS ASHE, GOV.UK Register of Licensed Sponsors.",
    },
  ];

  if (prefersReducedMotion) {
    return (
      <div className="story-editorial my-10">
        {steps.map((s, i) => (
          <div key={i} className="px-6 lg:px-12 py-14" style={{ borderBottom: i < steps.length - 1 ? "1px solid var(--story-line)" : undefined }}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--story-accent)" }}>{s.eyebrow}</p>
            <h3 className="text-2xl font-semibold mt-3 mb-4 max-w-xl">{s.title}</h3>
            <p className="text-sm leading-relaxed max-w-lg mb-8" style={{ color: "var(--story-text-dim)" }}>{s.body}</p>
            {s.scene}
          </div>
        ))}
      </div>
    );
  }

  return (
    <StoryProvider>
      <div className="story-editorial my-10 grid lg:grid-cols-2">
        <div>
          {steps.map((s, i) => (
            <StoryStep key={i} index={i} eyebrow={s.eyebrow} title={s.title}>
              {s.body}
            </StoryStep>
          ))}
        </div>
        <StickyVisual scenes={steps.map((s) => s.scene)} captions={steps.map((s) => s.caption)} />
      </div>
    </StoryProvider>
  );
}
