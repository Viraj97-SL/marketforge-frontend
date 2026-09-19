import { MaskIcon } from "@/components/ui/mask-icon";

interface Step {
  n: string; label: string; sub: string;
  iconSrc: string;
  accent: string; bg: string; border: string; ring: string; hex: string;
}

const STEPS: Step[] = [
  {
    n: "01", label: "Scrape",       sub: "Adzuna · Reed · Boards",
    iconSrc: "/images/icons/step-scrape.png",
    accent: "text-blue",   bg: "bg-blue/8",   border: "border-blue/20",   ring: "ring-blue/20",   hex: "#2563EB",
  },
  {
    n: "02", label: "Deduplicate",  sub: "MinHash + exact title hash",
    iconSrc: "/images/icons/step-dedupe.png",
    accent: "text-accent", bg: "bg-accent/8", border: "border-accent/20", ring: "ring-accent/20", hex: "#4F46E5",
  },
  {
    n: "03", label: "Extract",      sub: "flashtext → BM25 → SBERT",
    iconSrc: "/images/icons/step-extract.png",
    accent: "text-prp",    bg: "bg-prp/8",    border: "border-prp/20",    ring: "ring-prp/20",    hex: "#7C3AED",
  },
  {
    n: "04", label: "Analyse",      sub: "Salary NLP · skills ranking",
    iconSrc: "/images/icons/step-analyse.png",
    accent: "text-ok",     bg: "bg-ok/8",     border: "border-ok/20",     ring: "ring-ok/20",     hex: "#059669",
  },
  {
    n: "05", label: "Snapshot",     sub: "Weekly DB write · ISR cache",
    iconSrc: "/images/icons/step-snapshot.png",
    accent: "text-warn",   bg: "bg-warn/8",   border: "border-warn/20",   ring: "ring-warn/20",   hex: "#D97706",
  },
  {
    n: "06", label: "Dashboard",    sub: "Vercel edge · live data",
    iconSrc: "/images/icons/step-dashboard.png",
    accent: "text-accent", bg: "bg-accent/8", border: "border-accent/20", ring: "ring-accent/20", hex: "#4F46E5",
  },
];

function Arrow({ horizontal, fromHex, toHex }: { horizontal: boolean; fromHex: string; toHex: string }) {
  const gradId = `pf-arrow-${fromHex.slice(1)}-${toHex.slice(1)}`;
  return horizontal ? (
    <div className="hidden sm:flex items-center shrink-0 px-1">
      <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="24" y2="0">
            <stop offset="0%" stopColor={fromHex} stopOpacity="0.5" />
            <stop offset="100%" stopColor={toHex} stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <path d="M0 6 H20 M16 2 L22 6 L16 10" stroke={`url(#${gradId})`} strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  ) : (
    <div className="flex justify-center my-1">
      <svg width="12" height="24" viewBox="0 0 12 24" fill="none">
        <path d="M6 0 V20 M2 16 L6 22 L10 16" stroke="#CBD5E1" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function PipelineFlow({
  variant = "horizontal",
  className = "",
}: {
  variant?: "horizontal" | "vertical";
  className?: string;
}) {
  if (variant === "vertical") {
    return (
      <div className={`flex flex-col ${className}`}>
        {STEPS.map((s, i) => (
          <div key={s.n}>
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center shrink-0`}>
                  <MaskIcon src={s.iconSrc} size={18} className={s.accent} />
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-px h-6 bg-gradient-to-b from-b1 to-transparent mt-1" />
                )}
              </div>
              <div className="pb-4">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[9px] font-mono font-bold ${s.accent} opacity-70`}>{s.n}</span>
                  <span className="text-xs font-bold text-t1">{s.label}</span>
                </div>
                <p className="text-[11px] text-t2">{s.sub}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <div className="flex items-center min-w-[760px] py-4 px-1 gap-0">
        {STEPS.map((s, i) => (
          <div key={s.n} className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-center flex-1 group">
              {/* Step card */}
              <div
                className={`
                  relative w-full max-w-[128px] mx-auto
                  rounded-2xl border ${s.border} bg-gradient-to-b ${s.bg} to-transparent
                  p-4 flex flex-col items-center text-center
                  transition-all duration-300 hover:-translate-y-1
                  shadow-[0_1px_2px_rgba(15,23,42,0.04)]
                  hover:shadow-[0_0_0_1px_var(--step-glow,transparent),0_16px_32px_-12px_var(--step-glow,transparent)]
                `}
                style={{ "--step-glow": `${s.hex}55` } as React.CSSProperties}
              >
                <div className="relative mb-2.5">
                  <div
                    className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border"
                    style={{ borderColor: `${s.hex}30`, boxShadow: `0 4px 14px -4px ${s.hex}45` }}
                  >
                    <MaskIcon src={s.iconSrc} size={22} className={s.accent} />
                  </div>
                  <span
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-white text-[9px] font-bold font-mono flex items-center justify-center shadow-sm"
                    style={{ background: s.hex }}
                  >
                    {i + 1}
                  </span>
                </div>
                <span className={`text-[11px] font-bold ${s.accent} leading-tight`}>{s.label}</span>
                <span className="text-[8px] text-t3 leading-tight mt-1">{s.sub}</span>
              </div>
            </div>
            {i < STEPS.length - 1 && <Arrow horizontal fromHex={s.hex} toHex={STEPS[i + 1].hex} />}
          </div>
        ))}
      </div>
    </div>
  );
}
