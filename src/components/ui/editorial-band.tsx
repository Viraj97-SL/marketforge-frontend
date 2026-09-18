import Image from "next/image";
import type { ReactNode } from "react";

interface EditorialBandProps {
  /** Local path under public/, e.g. "/images/home-provenance.avif". */
  image: string;
  label?: string;
  heading: ReactNode;
  /** Keep to ~60 words or fewer. */
  body?: string;
  className?: string;
}

/**
 * Dark, full-bleed, photographic section band. Photography here is always
 * decorative background for prose — never placed behind a chart, table, or
 * ranking (those stay on the existing light card system untouched).
 */
export function EditorialBand({ image, label, heading, body, className = "" }: EditorialBandProps) {
  return (
    <section
      className={`relative w-full overflow-hidden ${className}`}
      style={{ background: "var(--ink)", minHeight: "60vh" }}
    >
      {/* Photo — dissolves into the page top/bottom via mask, sits at 50% opacity */}
      <div
        className="absolute inset-0"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)",
        }}
      >
        <Image src={image} alt="" fill sizes="100vw" className="object-cover" style={{ opacity: 0.5 }} />
      </div>

      {/* Scrim: opaque left, transparent right, protects the text column */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(to right, var(--ink) 0%, color-mix(in oklch, var(--ink) 60%, transparent) 42%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex items-center" style={{ minHeight: "60vh" }}>
        <div className="w-full sm:w-[45%] px-6 sm:px-10 py-16">
          {label && (
            <p
              className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4"
              style={{ color: "var(--ink-dim)" }}
            >
              {label}
            </p>
          )}
          <h2
            className="font-newsreader font-normal leading-[1.1] mb-5"
            style={{ fontSize: "clamp(2rem, 5vw, 3.75rem)", color: "var(--ink-text)" }}
          >
            {heading}
          </h2>
          {body && (
            <p className="text-base leading-relaxed max-w-md" style={{ color: "var(--ink-dim)" }}>
              {body}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
