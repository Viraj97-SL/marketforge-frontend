import Image from "next/image";
import type { ReactNode } from "react";

interface ChapterOpenerProps {
  /** Local path under public/, e.g. "/images/chapter-builders.avif". Omit to render on --ink alone (no fabricated placeholder photo). */
  image?: string;
  heading: ReactNode;
  /** A single sentence. */
  sentence: string;
  className?: string;
}

/**
 * Dark, 2:1 photographic band used to lead into a section. Contained to the
 * same max-w-7xl/rounded-2xl/shadow-card language every other card on the
 * site uses (not full-bleed) so it reads as part of the page flow instead of
 * an inserted block — callers place it inside their normal content wrapper.
 * Photography never sits behind a chart, table, or ranking.
 */
export function ChapterOpener({ image, heading, sentence, className = "" }: ChapterOpenerProps) {
  return (
    <section
      className={`relative w-full overflow-hidden rounded-2xl shadow-card aspect-[21/9] sm:aspect-[2/1] ${className}`}
      style={{ background: "var(--ink)" }}
    >
      {image && (
        <Image src={image} alt="" fill sizes="(max-width: 1280px) 100vw, 1280px" className="object-cover" style={{ opacity: 0.55 }} />
      )}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to right, var(--ink) 0%, color-mix(in oklch, var(--ink) 65%, transparent) 45%, color-mix(in oklch, var(--ink) 15%, transparent) 80%, transparent 100%)",
        }}
      />

      <div className="relative z-10 h-full flex items-center">
        <div className="w-full sm:w-[55%] px-6 sm:px-10">
          <h3
            className="font-newsreader font-normal leading-[1.1] mb-2 sm:mb-3"
            style={{ fontSize: "clamp(1.375rem, 3.4vw, 2.75rem)", color: "var(--ink-text)" }}
          >
            {heading}
          </h3>
          <p className="hidden sm:block text-sm sm:text-base leading-relaxed max-w-md" style={{ color: "var(--ink-dim)" }}>
            {sentence}
          </p>
        </div>
      </div>
    </section>
  );
}
