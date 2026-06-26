import type { ReactNode } from "react";

interface PageHeroProps {
  badge?: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  /** Place image at public/images/illustrations/<name>.webp */
  imageSrc?: string;
  children?: ReactNode;
}

export function PageHero({ badge, title, titleAccent, subtitle, imageSrc, children }: PageHeroProps) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden mb-10 animate-fade-up"
      style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #0F172A 100%)" }}
    >
      {/* Full-bleed photo background */}
      {imageSrc && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.22]"
          style={{ backgroundImage: `url('${imageSrc}')` }}
          aria-hidden="true"
        />
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

      {/* Content */}
      <div className="relative z-10 px-8 py-12 sm:px-12 sm:py-14">
        {badge && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <p className="text-[11px] font-bold text-accent uppercase tracking-widest">{badge}</p>
          </div>
        )}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3 leading-tight">
          {title}
          {titleAccent && <span className="text-accent"> {titleAccent}</span>}
        </h1>
        {subtitle && (
          <p className="text-slate-400 max-w-xl leading-relaxed text-sm mt-2">{subtitle}</p>
        )}
        {children && <div className="mt-5">{children}</div>}
      </div>
    </div>
  );
}
