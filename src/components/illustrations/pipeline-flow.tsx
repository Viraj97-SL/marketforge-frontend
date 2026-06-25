import {
  Download, Zap, FlaskConical, BarChart2, Database, LayoutDashboard,
} from "lucide-react";
import { type LucideIcon } from "lucide-react";

interface Step {
  n: string; label: string; sub: string;
  Icon: LucideIcon;
  accent: string; bg: string; border: string; ring: string;
}

const STEPS: Step[] = [
  {
    n: "01", label: "Scrape",       sub: "Adzuna · Reed · Boards",
    Icon: Download,
    accent: "text-blue",   bg: "bg-blue/8",   border: "border-blue/20",   ring: "ring-blue/20",
  },
  {
    n: "02", label: "Deduplicate",  sub: "MinHash + exact title hash",
    Icon: Zap,
    accent: "text-accent", bg: "bg-accent/8", border: "border-accent/20", ring: "ring-accent/20",
  },
  {
    n: "03", label: "Extract",      sub: "flashtext → BM25 → SBERT",
    Icon: FlaskConical,
    accent: "text-prp",    bg: "bg-prp/8",    border: "border-prp/20",    ring: "ring-prp/20",
  },
  {
    n: "04", label: "Analyse",      sub: "Salary NLP · skills ranking",
    Icon: BarChart2,
    accent: "text-ok",     bg: "bg-ok/8",     border: "border-ok/20",     ring: "ring-ok/20",
  },
  {
    n: "05", label: "Snapshot",     sub: "Weekly DB write · ISR cache",
    Icon: Database,
    accent: "text-warn",   bg: "bg-warn/8",   border: "border-warn/20",   ring: "ring-warn/20",
  },
  {
    n: "06", label: "Dashboard",    sub: "Vercel edge · live data",
    Icon: LayoutDashboard,
    accent: "text-accent", bg: "bg-accent/8", border: "border-accent/20", ring: "ring-accent/20",
  },
];

function Arrow({ horizontal }: { horizontal: boolean }) {
  return horizontal ? (
    <div className="hidden sm:flex items-center shrink-0 px-1">
      <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
        <path d="M0 6 H20 M16 2 L22 6 L16 10" stroke="#CBD5E1" strokeWidth="1.5"
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
                  <s.Icon className={`w-5 h-5 ${s.accent}`} strokeWidth={1.8} />
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
      <div className="flex items-center min-w-[640px] py-3 px-1 gap-0">
        {STEPS.map((s, i) => (
          <div key={s.n} className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-center flex-1 group">
              {/* Step card */}
              <div className={`
                w-full max-w-[100px] mx-auto
                rounded-2xl border ${s.border} ${s.bg}
                p-3 flex flex-col items-center text-center
                transition-all duration-200 hover:shadow-md hover:scale-105
              `}>
                <div className={`w-9 h-9 rounded-xl bg-white/70 border ${s.border} flex items-center justify-center mb-2 shadow-sm`}>
                  <s.Icon className={`w-5 h-5 ${s.accent}`} strokeWidth={1.8} />
                </div>
                <span className={`text-[8px] font-mono font-bold ${s.accent} mb-0.5 opacity-70`}>{s.n}</span>
                <span className={`text-[10px] font-bold ${s.accent} leading-tight`}>{s.label}</span>
                <span className="text-[8px] text-t3 leading-tight mt-0.5">{s.sub}</span>
              </div>
            </div>
            {i < STEPS.length - 1 && <Arrow horizontal />}
          </div>
        ))}
      </div>
    </div>
  );
}
