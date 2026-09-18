"use client";

interface SkillCount { skill: string; count: number; }
interface SkillPair { skill_a: string; skill_b: string; co_count: number; pmi_score: number; }

interface PlacedNode { id: string; label: string; x: number; y: number; r: number; count: number; tier: 0 | 1 | 2 | 3; }
interface PlacedEdge { id: string; a: PlacedNode; b: PlacedNode; w: number; coCount: number; }

const TIER_STYLE = [
  { fill: "#4F46E5", stroke: "#818CF8", glow: 8 }, // core (centre)
  { fill: "#2563EB", stroke: "#60A5FA", glow: 6 }, // ring 1
  { fill: "#7C3AED", stroke: "#A78BFA", glow: 4 }, // ring 2
  { fill: "#059669", stroke: "#34D399", glow: 3 }, // ring 3 (outer)
] as const;

const TIER_LABEL = ["Core", "Primary", "Secondary", "Adjacent"] as const;

// Ring layout: [ring size, radius, y-squash] — index 0 is the core node itself.
const RINGS: { size: number; radius: number; squash: number }[] = [
  { size: 6, radius: 128, squash: 0.74 },
  { size: 8, radius: 205, squash: 0.78 },
  { size: 6, radius: 268, squash: 0.86 },
];

/**
 * Real skill-demand network: node size = live job count for that skill
 * (from /api/v1/market/skills), edges = real co-occurrence counts (from
 * /api/v1/market/skill-cooccurrence, backed by market.skill_cooccurrence).
 * No hardcoded numbers — renders an honest empty state when live data is
 * unavailable instead of a fabricated graph.
 */
export function SkillNetwork({
  topSkills,
  pairs,
  height = 420,
  className = "",
  maxNodes = 20,
}: {
  topSkills: SkillCount[];
  pairs: SkillPair[];
  height?: number;
  className?: string;
  maxNodes?: number;
}) {
  const W = 760, H = height;
  const scale = H / 480;
  const nodes = topSkills.slice(0, maxNodes);

  if (nodes.length === 0) {
    return (
      <div className={`w-full flex items-center justify-center text-xs text-t3 ${className}`} style={{ height }}>
        Not enough live skill data yet
      </div>
    );
  }

  const cx = W / 2, cy = 240;
  const maxCount = nodes[0].count;
  const minCount = nodes[nodes.length - 1].count;
  const radiusFor = (count: number) => {
    if (maxCount === minCount) return 22;
    const t = (count - minCount) / (maxCount - minCount);
    return 14 + t * 24;
  };

  const placed: PlacedNode[] = [];
  nodes.forEach((n, i) => {
    if (i === 0) {
      placed.push({ id: n.skill, label: n.skill, x: cx, y: cy, r: radiusFor(n.count) + 12, count: n.count, tier: 0 });
      return;
    }
    let idx = i - 1;
    let ringNo = 0;
    while (ringNo < RINGS.length && idx >= RINGS[ringNo].size) {
      idx -= RINGS[ringNo].size;
      ringNo++;
    }
    const ring = RINGS[Math.min(ringNo, RINGS.length - 1)];
    const ringSize = ringNo < RINGS.length ? ring.size : ring.size;
    const angle = (idx / Math.max(1, ringSize)) * Math.PI * 2 - Math.PI / 2;
    placed.push({
      id: n.skill, label: n.skill,
      x: cx + Math.cos(angle) * ring.radius,
      y: cy + Math.sin(angle) * ring.radius * ring.squash,
      r: radiusFor(n.count), count: n.count, tier: (Math.min(ringNo, RINGS.length - 1) + 1) as 1 | 2 | 3,
    });
  });

  const nodeIds = new Set(placed.map((n) => n.id));
  const byId = new Map(placed.map((n) => [n.id, n]));
  const relevantPairs = pairs.filter((p) => nodeIds.has(p.skill_a) && nodeIds.has(p.skill_b));
  const maxCo = relevantPairs.reduce((m, p) => Math.max(m, p.co_count), 1);
  const edges: PlacedEdge[] = relevantPairs.map((p) => ({
    id: `${p.skill_a}-${p.skill_b}`,
    a: byId.get(p.skill_a)!, b: byId.get(p.skill_b)!,
    w: 0.6 + (p.co_count / maxCo) * 3.2,
    coCount: p.co_count,
  }));

  const tiersPresent = Array.from(new Set(placed.map((n) => n.tier))).sort();

  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <svg
        viewBox={`0 0 ${W} 480`}
        style={{ minWidth: `${W * scale}px`, height: `${H}px` }}
        className="block mx-auto"
      >
        <defs>
          {TIER_STYLE.map((c, i) => (
            <radialGradient key={i} id={`nf-tier-${i}`} cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor={c.stroke} />
              <stop offset="100%" stopColor={c.fill} />
            </radialGradient>
          ))}
          {TIER_STYLE.map((c, i) => (
            <filter key={i} id={`snGlow-${i}`} x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation={c.glow} result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          ))}
          <radialGradient id="snBg" cx="55%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#EEF2FF" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#F8FAFC" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="snEdge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#818CF8" stopOpacity="0.05" />
            <stop offset="50%" stopColor="#818CF8" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#818CF8" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width={W} height="480" fill="url(#snBg)" rx="12" />

        {/* Ambient dot-grid texture for depth */}
        {[60, 140, 220, 300, 380, 440].map((y) =>
          [40, 140, 240, 340, 440, 540, 640, 720].map((x) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="1.4" fill="#C7D2FE" opacity="0.3" />
          ))
        )}

        {/* Concentric ring guides — visualise the tier structure itself */}
        {RINGS.map((r, i) => (
          <ellipse key={i} cx={cx} cy={cy} rx={r.radius} ry={r.radius * r.squash} fill="none" stroke="#C7D2FE" strokeWidth="0.6" strokeDasharray="2 4" opacity="0.4" />
        ))}

        {/* Edges — real co-occurrence pairs, curved for an organic network feel */}
        {edges.map((e) => {
          const mx = (e.a.x + e.b.x) / 2, my = (e.a.y + e.b.y) / 2;
          const dx = e.b.x - e.a.x, dy = e.b.y - e.a.y;
          const bend = 0.12;
          const cxp = mx - dy * bend, cyp = my + dx * bend;
          return (
            <path
              key={e.id}
              d={`M${e.a.x},${e.a.y} Q${cxp},${cyp} ${e.b.x},${e.b.y}`}
              fill="none"
              stroke="url(#snEdge)"
              strokeWidth={e.w}
            >
              <title>{e.a.label} + {e.b.label}: co-listed {e.coCount.toLocaleString()}×</title>
            </path>
          );
        })}

        {/* Nodes — real job counts */}
        {placed.map((n) => {
          const c = TIER_STYLE[n.tier];
          return (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r={n.r + 14} fill={c.fill} opacity="0.06" />
              <circle cx={n.x} cy={n.y} r={n.r + 3} fill="none" stroke={c.stroke} strokeWidth="0.8" opacity="0.35" />
              <circle cx={n.x} cy={n.y} r={n.r} fill={`url(#nf-tier-${n.tier})`} filter={`url(#snGlow-${n.tier})`} />
              <circle cx={n.x - n.r * 0.22} cy={n.y - n.r * 0.22} r={n.r * 0.4} fill="white" opacity="0.22" />
              {n.tier === 0 && (
                <circle cx={n.x} cy={n.y} r={n.r + 9} fill="none" stroke={c.stroke} strokeWidth="1.2" strokeDasharray="5 3" opacity="0.4" style={{ animation: "snPulse 3s ease-in-out infinite" }} />
              )}
              <text
                x={n.x} y={n.y + (n.tier === 0 ? 4.5 : 3.5)}
                textAnchor="middle"
                fontSize={n.tier === 0 ? "12.5" : n.r > 18 ? "9.5" : "8"}
                fontWeight={n.tier === 0 ? "900" : "700"}
                fill="#ffffff"
                fontFamily="ui-sans-serif,system-ui,sans-serif"
                style={{ pointerEvents: "none" }}
              >
                {n.label}
              </text>
              {n.r >= 19 && (
                <text
                  x={n.x} y={n.y + (n.tier === 0 ? 17 : 15)}
                  textAnchor="middle"
                  fontSize={n.tier === 0 ? "8.5" : "7.5"}
                  fill="#ffffff" opacity="0.75"
                  fontFamily="ui-sans-serif,system-ui,sans-serif"
                  style={{ pointerEvents: "none" }}
                >
                  {n.count.toLocaleString()} jobs
                </text>
              )}
              <title>{n.label}: {n.count.toLocaleString()} live postings</title>
            </g>
          );
        })}

        <g transform="translate(10,10)">
          <rect x="0" y="0" width="150" height={16 + tiersPresent.length * 14 + 30} rx="10" fill="white" opacity="0.92" stroke="#E0E7FF" strokeWidth="1" />
          <text x="10" y="14" fontSize="7" fontWeight="800" fill="#94A3B8" fontFamily="ui-sans-serif,system-ui,sans-serif" letterSpacing="0.5">
            DEMAND TIER
          </text>
          {tiersPresent.map((t, i) => (
            <g key={t} transform={`translate(10,${24 + i * 14})`}>
              <circle cx="4" cy="0" r="4" fill={TIER_STYLE[t].fill} />
              <text x="14" y="3" fontSize="8" fontWeight="700" fill="#334155" fontFamily="ui-sans-serif,system-ui,sans-serif">{TIER_LABEL[t]}</text>
            </g>
          ))}
          <text x="10" y={24 + tiersPresent.length * 14 + 8} fontSize="7" fill="#64748B" fontFamily="ui-sans-serif,system-ui,sans-serif">Size = live job count</text>
          <text x="10" y={24 + tiersPresent.length * 14 + 19} fontSize="7" fill="#64748B" fontFamily="ui-sans-serif,system-ui,sans-serif">Line = times co-listed</text>
        </g>

        <style>{`
          @keyframes snPulse {
            0%,100% { opacity: 0.4; }
            50%      { opacity: 0.1; }
          }
        `}</style>
      </svg>
    </div>
  );
}
