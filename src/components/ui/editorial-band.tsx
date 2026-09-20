import Image from "next/image";
import type { ReactNode } from "react";

interface EditorialBandProps {
  /** Local path under public/, e.g. "/images/home-provenance.avif". */
  image: string;
  label?: string;
  heading: ReactNode;
  /** Keep to ~60 words or fewer. */
  body?: string;
  /** 0.30-0.50. Tune per-image if a specific photo goes muddy or the heading loses contrast. */
  imageOpacity?: number;
  className?: string;
}

/**
 * Full-bleed band — MUST be rendered as a sibling of the page's max-w-7xl
 * container, never nested inside it (see ChapterOpener for the same rule).
 * Same duotone-dissolve treatment as ChapterOpener (see .duo in
 * globals.css), just full-height content instead of a single sentence.
 * No radius, border, shadow, or margin. Photography never sits behind a
 * chart, table, or ranking.
 */
export function EditorialBand({ image, label, heading, body, imageOpacity = 0.4, className = "" }: EditorialBandProps) {
  return (
    <section
      className={`relative w-full band-pad ${className}`}
      style={{ background: "var(--bg)" }}
    >
      <div className="duo" aria-hidden="true" style={{ opacity: imageOpacity }}>
        <Image src={image} alt="" fill sizes="100vw" quality={55} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-xl">
          {label && (
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4 text-t3">
              {label}
            </p>
          )}
          <h2
            className="font-newsreader font-normal leading-[1.1] mb-5 text-t1"
            style={{ fontSize: "clamp(2rem, 5vw, 3.75rem)" }}
          >
            {heading}
          </h2>
          {body && (
            <p className="text-base leading-relaxed text-t2">
              {body}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
