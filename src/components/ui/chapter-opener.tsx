import Image from "next/image";
import type { ReactNode } from "react";

interface ChapterOpenerProps {
  /** Local path under public/, e.g. "/images/chapter-builders.avif". Omit to render on the page background alone (no fabricated placeholder photo). */
  image?: string;
  heading: ReactNode;
  /** A single sentence. */
  sentence: string;
  /** 0.18-0.34. Lower it per-image if a specific photo goes muddy at the default. */
  imageOpacity?: number;
  className?: string;
}

/**
 * Full-bleed band: MUST be rendered as a sibling of the page's max-w-7xl
 * container, never a child of it — nesting it inside gives it the
 * container's width and defeats the whole point. The image sits at low
 * opacity, desaturated, on the page's own background colour (not a dark
 * block) and is mask-faded top/bottom so it dissolves into the surrounding
 * sections instead of creating a hard light/dark edge. No radius, border,
 * shadow, or margin — those are what made this read as a "card" instead of
 * a continuous part of the page. Photography never sits behind a chart,
 * table, or ranking.
 */
export function ChapterOpener({ image, heading, sentence, imageOpacity = 0.26, className = "" }: ChapterOpenerProps) {
  return (
    <section
      className={`relative w-full isolate band-pad ${className}`}
      style={{ background: "var(--bg)" }}
    >
      {image && (
        <div
          className="absolute inset-0 -z-10"
          style={{
            maskImage: "linear-gradient(to bottom, transparent 0%, #000 18%, #000 82%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 18%, #000 82%, transparent 100%)",
          }}
        >
          <Image
            src={image} alt="" fill sizes="100vw"
            className="object-cover"
            style={{ opacity: imageOpacity, filter: "saturate(0.45) contrast(1.04)" }}
          />
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-xl">
          <h3
            className="font-newsreader font-normal leading-[1.1] mb-3 text-t1"
            style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)" }}
          >
            {heading}
          </h3>
          <p className="text-base leading-relaxed text-t2">
            {sentence}
          </p>
        </div>
      </div>
    </section>
  );
}
