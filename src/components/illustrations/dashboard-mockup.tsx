interface MockBar {
  label: string;
  value: number;
  color: string;
}

const MOCK_SKILLS: MockBar[] = [
  { label: "Python",     value: 92, color: "#4F46E5" },
  { label: "PyTorch",    value: 74, color: "#6366F1" },
  { label: "LangChain",  value: 68, color: "#818CF8" },
  { label: "SQL",        value: 61, color: "#A5B4FC" },
  { label: "Docker",     value: 55, color: "#C7D2FE" },
  { label: "Kubernetes", value: 47, color: "#DDD6FE" },
];

const MOCK_STATS = [
  { label: "AI Jobs",      value: "4,820", sub: "this week",     accent: "#4F46E5" },
  { label: "Median Salary",value: "£82k",  sub: "all AI roles",  accent: "#2563EB" },
  { label: "Visa Rate",    value: "34%",   sub: "sponsor roles",  accent: "#7C3AED" },
];

interface DashboardMockupProps {
  className?: string;
}

export function DashboardMockup({ className = "" }: DashboardMockupProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Browser chrome */}
      <div className="rounded-2xl border border-b2 shadow-card-lg overflow-hidden bg-white">

        {/* Title bar */}
        <div className="flex items-center gap-3 px-4 py-3 bg-s2 border-b border-b1">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-err/60" />
            <div className="w-3 h-3 rounded-full bg-warn/60" />
            <div className="w-3 h-3 rounded-full bg-ok/60" />
          </div>
          <div className="flex-1 bg-white rounded-md px-3 py-1 text-[10px] text-t3 font-mono border border-b1 flex items-center gap-1.5">
            <span className="text-ok">●</span>
            marketforge.digital/market
          </div>
          <div className="w-5 h-5 rounded bg-b1 flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <circle cx="5" cy="5" r="3.5" stroke="#94A3B8" strokeWidth="1" />
              <path d="M3 5h4M5 3v4" stroke="#94A3B8" strokeWidth="1" />
            </svg>
          </div>
        </div>

        {/* Dashboard body */}
        <div className="p-5 bg-bg">

          {/* Top stat row */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {MOCK_STATS.map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-b1 p-3 shadow-card">
                <p className="text-[9px] text-t3 mb-1">{s.label}</p>
                <p className="text-xl font-black" style={{ color: s.accent }}>{s.value}</p>
                <p className="text-[8px] text-t3 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Skills bar chart */}
          <div className="bg-white rounded-xl border border-b1 p-4 mb-4 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold text-t1">Top Skills This Week</p>
              <span className="text-[8px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-semibold border border-accent/20">Live</span>
            </div>
            <div className="space-y-2">
              {MOCK_SKILLS.map((bar) => (
                <div key={bar.label} className="flex items-center gap-2">
                  <span className="text-[9px] text-t2 w-16 shrink-0 font-medium">{bar.label}</span>
                  <div className="flex-1 h-2 rounded-full bg-s2 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${bar.value}%`, background: bar.color }}
                    />
                  </div>
                  <span className="text-[8px] text-t3 font-mono w-5 text-right">{bar.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom row: salary card + cities mini */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl border border-b1 p-3 shadow-card">
              <p className="text-[9px] font-bold text-t1 mb-2">Salary Distribution</p>
              {/* Mini salary arc */}
              <div className="flex items-end gap-1 h-10">
                {[22, 35, 55, 80, 100, 85, 60, 38, 20].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm"
                    style={{
                      height: `${h}%`,
                      background: i === 4 ? "#4F46E5" : i > 2 && i < 7 ? "#A5B4FC" : "#E0E7FF",
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[7px] text-t3">£40k</span>
                <span className="text-[7px] font-bold text-accent">£82k</span>
                <span className="text-[7px] text-t3">£180k+</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-b1 p-3 shadow-card">
              <p className="text-[9px] font-bold text-t1 mb-2">Top Cities</p>
              <div className="space-y-1.5">
                {[
                  { city: "London",     pct: 100 },
                  { city: "Manchester", pct: 13  },
                  { city: "Cambridge",  pct: 11  },
                  { city: "Edinburgh",  pct: 8   },
                ].map((c) => (
                  <div key={c.city} className="flex items-center gap-1.5">
                    <span className="text-[8px] text-t2 w-14">{c.city}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-s2 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-accent to-blue" style={{ width: `${c.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <div className="absolute -bottom-3 -right-3 flex items-center gap-1.5 bg-white border border-b1 rounded-xl px-3 py-2 shadow-card-md">
        <span className="w-2 h-2 rounded-full bg-ok animate-pulse" />
        <span className="text-[10px] font-semibold text-t1">Live · Updated now</span>
      </div>
    </div>
  );
}
