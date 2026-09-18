"use client";

interface SkillCount { skill: string; count: number; }
interface SkillPair { skill_a: string; skill_b: string; co_count: number; pmi_score: number; }

interface PlacedNode { id: string; label: string; x: number; y: number; r: number; count: number; tier: 0 | 1 | 2; }
interface PlacedEdge { x1: number; y1: number; x2: number; y2: number; w: number; }

const TIER_STYLE = [
  { fill: "#4F46E5", stroke: "#818CF8" }, // top skill (centre)
  { fill: "#2563EB", stroke: "#60A5FA" }, // ring 1
  { fill: "#7C3AED", stroke: "#A78BFA" }, // ring 2
] as const;

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
  maxNodes = 13,
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
    if (maxCount === minCount) return 24;
    const t = (count - minCount) / (maxCount - minCount);
    return 16 + t * 24;
  };

  const ringOf = (i: number) => (i === 0 ? 0 : i <= 6 ? 1 : 2);
  const placed: PlacedNode[] = nodes.map((n, i) => {
    const tier = ringOf(i) as 0 | 1 | 2;
    if (i === 0) return { id: n.skill, label: n.skill, x: cx, y: cy, r: radiusFor(n.count) + 12, count: n.count, tier };
    const ringSize = tier === 1 ? Math.min(6, nodes.length - 1) : nodes.length - 7;
    const ringIndex = tier === 1 ? i - 1 : i - 7;
    const ringRadius = tier === 1 ? 150 : 235;
    const angle = (ringIndex / Math.max(1, ringSize)) * Math.PI * 2 - Math.PI / 2;
    return {
      id: n.skill, label: n.skill,
      x: cx + Math.cos(angle) * ringRadius,
      y: cy + Math.sin(angle) * ringRadius * 0.72,
      r: radiusFor(n.count), count: n.count, tier,
    };
  });

  const nodeIds = new Set(placed.map((n) => n.id));
  const byId = new Map(placed.map((n) => [n.id, n]));
  const relevantPairs = pairs.filter((p) => nodeIds.has(p.skill_a) && nodeIds.has(p.skill_b));
  const maxCo = relevantPairs.reduce((m, p) => Math.max(m, p.co_count), 1);
  const edges: PlacedEdge[] = relevantPairs.map((p) => {
    const a = byId.get(p.skill_a)!, b = byId.get(p.skill_b)!;
    return { x1: a.x, y1: a.y, x2: b.x, y2: b.y, w: 0.6 + (p.co_count / maxCo) * 3 };
  });

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
          <filter id="snGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="snBg" cx="55%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#EEF2FF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#F8FAFC" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width={W} height="480" fill="url(#snBg)" rx="12" />

        {/* Edges — real co-occurrence pairs */}
        {edges.map((e, i) => (
          <line
            key={i}
            x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
            stroke="#818CF8" strokeWidth={e.w} strokeOpacity={0.3}
          />
        ))}

        {/* Nodes — real job counts */}
        {placed.map((n) => {
          const c = TIER_STYLE[n.tier];
          return (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r={n.r + 14} fill={c.fill} opacity="0.06" />
              <circle cx={n.x} cy={n.y} r={n.r + 3} fill="none" stroke={c.stroke} strokeWidth="0.8" opacity="0.35" />
              <circle cx={n.x} cy={n.y} r={n.r} fill={`url(#nf-tier-${n.tier})`} filter="url(#snGlow)" />
              <circle cx={n.x - n.r * 0.22} cy={n.y - n.r * 0.22} r={n.r * 0.4} fill="white" opacity="0.22" />
              <text
                x={n.x} y={n.y + (n.tier === 0 ? 4.5 : 3.5)}
                textAnchor="middle"
                fontSize={n.tier === 0 ? "12.5" : n.r > 18 ? "9.5" : "8.5"}
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
            </g>
          );
        })}

        <g transform="translate(10,10)">
          <rect x="0" y="0" width="190" height="40" rx="10" fill="white" opacity="0.92" stroke="#E0E7FF" strokeWidth="1" />
          <text x="10" y="16" fontSize="7.5" fontWeight="700" fill="#64748B" fontFamily="ui-sans-serif,system-ui,sans-serif">
            NODE SIZE = LIVE JOB COUNT
          </text>
          <text x="10" y="30" fontSize="7.5" fontWeight="700" fill="#64748B" fontFamily="ui-sans-serif,system-ui,sans-serif">
            LINE WEIGHT = TIMES CO-LISTED
          </text>
        </g>
      </svg>
    </div>
  );
}
