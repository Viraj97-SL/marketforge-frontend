interface Step {
  n: string;
  label: string;
  sub: string;
  icon: string;
  accent: string;
  bg: string;
  border: string;
}

const STEPS: Step[] = [
  { n: "01", label: "Scrape",     sub: "Adzuna · Reed · Specialist boards",       icon: "⬇", accent: "#4F46E5", bg: "#EEF2FF", border: "#818CF8" },
  { n: "02", label: "Deduplicate",sub: "Title + company + location fingerprint",   icon: "⚡", accent: "#2563EB", bg: "#EFF6FF", border: "#93C5FD" },
  { n: "03", label: "Extract",    sub: "flashtext → BM25 → SBERT skill pipeline",  icon: "🔬", accent: "#7C3AED", bg: "#F5F3FF", border: "#A78BFA" },
  { n: "04", label: "Analyse",    sub: "Salary normalise · NLP scoring · Geo",     icon: "📊", accent: "#059669", bg: "#ECFDF5", border: "#6EE7B7" },
  { n: "05", label: "Snapshot",   sub: "Weekly aggregate saved to DB",             icon: "💾", accent: "#D97706", bg: "#FFFBEB", border: "#FCD34D" },
  { n: "06", label: "Dashboard",  sub: "You see this page",                        icon: "✨", accent: "#4F46E5", bg: "#EEF2FF", border: "#818CF8" },
];

interface PipelineFlowProps {
  className?: string;
  variant?: "horizontal" | "vertical";
}

export function PipelineFlow({ className = "", variant = "horizontal" }: PipelineFlowProps) {
  if (variant === "vertical") {
    return (
      <div className={`flex flex-col gap-0 ${className}`}>
        {STEPS.map((s, i) => (
          <div key={s.n} className="flex items-stretch gap-0">
            {/* Connector column */}
            <div className="flex flex-col items-center w-10 shrink-0">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-base border-2 shadow-sm"
                style={{ background: s.bg, borderColor: s.border }}
              >
                {s.icon}
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 w-px my-1" style={{ background: `${s.border}60` }} />
              )}
            </div>
            {/* Content */}
            <div className={`pl-4 ${i < STEPS.length - 1 ? "pb-5" : ""}`}>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-mono font-bold" style={{ color: s.accent }}>{s.n}</span>
                <span className="text-sm font-bold text-t1">{s.label}</span>
              </div>
              <p className="text-[11px] text-t2">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <div className="flex items-center gap-0 min-w-[680px] py-4">
        {STEPS.map((s, i) => (
          <div key={s.n} className="flex items-center flex-1">
            {/* Step card */}
            <div className="flex-1 flex flex-col items-center gap-2 px-2">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl border-2 shadow-sm"
                style={{ background: s.bg, borderColor: s.border }}
              >
                {s.icon}
              </div>
              <div className="text-center">
                <p className="text-[9px] font-mono font-bold mb-0.5" style={{ color: s.accent }}>{s.n}</p>
                <p className="text-[11px] font-bold text-t1 leading-tight">{s.label}</p>
                <p className="text-[9px] text-t2 mt-0.5 leading-tight max-w-[90px] mx-auto">{s.sub}</p>
              </div>
            </div>
            {/* Arrow */}
            {i < STEPS.length - 1 && (
              <div className="flex items-center shrink-0 px-1">
                <svg width="28" height="14" viewBox="0 0 28 14" fill="none">
                  <line x1="0" y1="7" x2="22" y2="7" stroke="#C7D2FE" strokeWidth="1.5" />
                  <path d="M18 3 L26 7 L18 11" stroke="#818CF8" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
