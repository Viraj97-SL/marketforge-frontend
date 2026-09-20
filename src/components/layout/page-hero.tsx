import type { ReactNode } from "react";
import { HeroImage } from "./hero-image";
import { HeroReveal, HeroRevealItem } from "./hero-reveal";

interface PageHeroProps {
  badge?: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  /** Local path under public/, or a whitelisted remote URL. Rendered via next/image (fill). */
  imageSrc?: string;
  children?: ReactNode;
}

/**
 * Full-bleed page hero — MUST be rendered as a sibling of the page's
 * max-w-7xl container, never nested inside it (same rule as the homepage
 * hero and the ChapterOpener/EditorialBand bands). No bottom fade — the
 * hero ends on a crisp edge; only the homepage hero fades, into the logo
 * marquee below it.
 */
export function PageHero({ badge, title, titleAccent, subtitle, imageSrc, children }: PageHeroProps) {
  return (
    <section
      className="relative w-full min-h-[clamp(400px,52vh,560px)] flex items-center"
      style={{ background: "linear-gradient(135deg, #141329 0%, #1E293B 60%, #141329 100%)" }}
    >
      {/* Full-bleed photo background — 0.50 opacity, scroll-linked scale/pan */}
      {imageSrc && <HeroImage src={imageSrc} opacity={0.5} />}

      {/* Text-protection scrim: opaque left, transparent right */}
      {imageSrc && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, var(--hero) 0%, color-mix(in oklab, var(--hero) 82%, transparent) 38%, color-mix(in oklab, var(--hero) 35%, transparent) 62%, transparent 82%)",
          }}
        />
      )}

      {/* Subtle dot texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Content */}
      <HeroReveal className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6">
        {badge && (
          <HeroRevealItem>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <p className="text-xs font-bold text-accent uppercase tracking-[0.18em]">{badge}</p>
            </div>
          </HeroRevealItem>
        )}
        <HeroRevealItem>
          <h1
            className="font-newsreader font-normal text-white mb-3"
            style={{ fontSize: "clamp(2.75rem, 5.5vw, 4.5rem)", lineHeight: 1.04, letterSpacing: "-0.02em" }}
          >
            {title}
            {titleAccent && <span className="hero-accent text-accent"> {titleAccent}</span>}
          </h1>
        </HeroRevealItem>
        {subtitle && (
          <HeroRevealItem>
            <p className="text-slate-400 mt-2" style={{ fontSize: "1.1875rem", lineHeight: 1.6, maxWidth: "46ch" }}>
              {subtitle}
            </p>
          </HeroRevealItem>
        )}
        {children && <HeroRevealItem className="mt-5">{children}</HeroRevealItem>}
      </HeroReveal>
    </section>
  );
}
