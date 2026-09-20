import type { ReactNode } from "react";
import Image from "next/image";

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
 * hero and the ChapterOpener/EditorialBand bands). Fixed height, not
 * content-driven, so every inner route reads consistently against the
 * homepage's full-viewport hero.
 */
export function PageHero({ badge, title, titleAccent, subtitle, imageSrc, children }: PageHeroProps) {
  return (
    <section
      className="relative w-full h-[44vh] min-h-[340px] flex items-center animate-fade-up"
      style={{ background: "linear-gradient(135deg, #141329 0%, #1E293B 60%, #141329 100%)" }}
    >
      {/* Full-bleed photo background */}
      {imageSrc && (
        <div className="absolute inset-0 opacity-[0.22]" aria-hidden="true">
          <Image src={imageSrc} alt="" fill sizes="100vw" className="object-cover" />
        </div>
      )}

      {/* Text-protection gradient: opaque left, transparent right */}
      {imageSrc && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-900/30 pointer-events-none" />
      )}

      {/* Subtle dot texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Bottom dissolve into the page background */}
      <div className="absolute inset-x-0 bottom-0 h-[22vh] bg-gradient-to-t from-bg to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6">
        {badge && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <p className="text-[11px] font-bold text-accent uppercase tracking-widest">{badge}</p>
          </div>
        )}
        <h1 className="font-newsreader font-normal tracking-tight text-white mb-3 leading-[1.1]" style={{ fontSize: "clamp(1.875rem, 4.5vw, 3.25rem)" }}>
          {title}
          {titleAccent && <span className="text-accent"> {titleAccent}</span>}
        </h1>
        {subtitle && (
          <p className="text-slate-400 max-w-xl leading-relaxed text-sm mt-2">{subtitle}</p>
        )}
        {children && <div className="mt-5">{children}</div>}
      </div>
    </section>
  );
}
