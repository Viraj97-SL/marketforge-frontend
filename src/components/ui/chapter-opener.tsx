import Image from "next/image";
import type { ReactNode } from "react";

interface ChapterOpenerProps {
  /** Local path under public/, e.g. "/images/chapter-builders.avif". */
  image: string;
  heading: ReactNode;
  /** A single sentence. */
  sentence: string;
  className?: string;
}

/**
 * Same dark photographic treatment as EditorialBand, but a fixed 2:1 band
 * carrying only a heading and one sentence — used between data sections to
 * open a "chapter" rather than as a full section (see EditorialBand for
 * that). Photography never sits behind a chart, table, or ranking.
 */
export function ChapterOpener({ image, heading, sentence, className = "" }: ChapterOpenerProps) {
  return (
    <section
      className={`relative w-full overflow-hidden aspect-[2/1] ${className}`}
      style={{ background: "var(--ink)" }}
    >
      <div
        className="absolute inset-0"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)",
        }}
      >
        <Image src={image} alt="" fill sizes="100vw" className="object-cover" style={{ opacity: 0.5 }} />
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to right, var(--ink) 0%, color-mix(in oklch, var(--ink) 60%, transparent) 42%, transparent 70%)",
        }}
      />

      <div className="relative z-10 h-full flex items-center">
        <div className="w-full sm:w-[45%] px-6 sm:px-10">
          <h3
            className="font-newsreader font-normal leading-[1.1] mb-3"
            style={{ fontSize: "clamp(2rem, 5vw, 3.75rem)", color: "var(--ink-text)" }}
          >
            {heading}
          </h3>
          <p className="text-base leading-relaxed max-w-md" style={{ color: "var(--ink-dim)" }}>
            {sentence}
          </p>
        </div>
      </div>
    </section>
  );
}
