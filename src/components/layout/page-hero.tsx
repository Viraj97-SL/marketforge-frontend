import type { ReactNode } from "react";

interface PageHeroProps {
  badge?: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  /** Drop a photo at public/images/<name>.jpg — if absent, gradient-only looks great too */
  imageSrc?: string;
  children?: ReactNode;
}

export function PageHero({ badge, title, titleAccent, subtitle, imageSrc, children }: PageHeroProps) {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-b1 mb-10 animate-fade-up">
      {/* Layered background */}
      <div className="absolute inset-0 bg-gradient-to-br from-s1 via-s2 to-bg" />
      <div className="absolute inset-0 bg-mesh opacity-40 pointer-events-none" />

      {/* Optional photo layer — safe: CSS background silently skips a missing file */}
      {imageSrc && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${imageSrc}')`, opacity: 0.14 }}
          aria-hidden="true"
        />
      )}

      {/* Legibility overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-bg/92 via-bg/65 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-2/5 bg-gradient-to-l from-accent/6 to-transparent pointer-events-none" />

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 px-8 py-10 sm:px-12 sm:py-12">
        {badge && (
          <p className="text-xs font-bold text-accent uppercase tracking-widest mb-2">{badge}</p>
        )}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-t1 mb-3">
          {title}
          {titleAccent && <span className="text-gradient"> {titleAccent}</span>}
        </h1>
        {subtitle && (
          <p className="text-t2 max-w-xl leading-relaxed text-sm mt-1">{subtitle}</p>
        )}
        {children && <div className="mt-5">{children}</div>}
      </div>
    </div>
  );
}
