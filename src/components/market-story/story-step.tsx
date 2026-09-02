"use client";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useStory } from "./story-context";

interface StoryStepProps {
  index: number;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}

/**
 * One narrative beat. Activates the shared StickyVisual state when it
 * crosses the vertical centre of the viewport — the standard "scrollama"
 * step-activation pattern, done with IntersectionObserver instead of a
 * dedicated library since react-intersection-observer already covers it.
 */
export function StoryStep({ index, eyebrow, title, children }: StoryStepProps) {
  const { setActiveStep } = useStory();
  const { ref, inView } = useInView({
    rootMargin: "-45% 0px -45% 0px",
    threshold: 0,
  });

  useEffect(() => {
    if (inView) setActiveStep(index);
  }, [inView, index, setActiveStep]);

  return (
    <div ref={ref} className="min-h-[70vh] flex flex-col justify-center py-16 px-6 lg:px-12">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--story-accent)" }}>
        {eyebrow}
      </p>
      <h3 className="text-2xl lg:text-3xl font-semibold mt-3 mb-5 max-w-xl leading-tight">
        {title}
      </h3>
      <div className="text-sm lg:text-[15px] leading-relaxed max-w-lg" style={{ color: "var(--story-text-dim)" }}>
        {children}
      </div>
    </div>
  );
}
