"use client";

interface SkillCount { skill: string; count: number; }
interface PlacedNode { id: string; label: string; x: number; y: number; r: number; count: number; cluster: number; }
interface PlacedEdge { id: string; a: PlacedNode; b: PlacedNode; w: number; opacity: number; coCount: number; }

// 4-slot cluster palette, CVD-checked — a 5th slot fails colour-vision
// separation, so cap at four clusters and fold any tail into the last one.
const CLUSTER_COLOR = ["#4F46E5", "#C2410C", "#0891B2", "#BE185D"] as const;
const CLUSTER_COUNT = CLUSTER_COLOR.length;

// Shape glyph per cluster — identity is never colour alone.
type Shape = "circle" | "square" | "diamond" | "triangle";
const CLUSTER_SHAPE: Shape[] = ["circle", "square", "diamond", "triangle"];

function NodeShape({ shape, x, y, r, fill, stroke }: { shape: Shape; x: number; y: number; r: number; fill: string; stroke: string }) {
  const common = { fill, stroke, strokeWidth: 1 };
  switch (shape) {
    case "square": {
      const s = r * 1.7;
      return <rect x={x - s / 2} y={y - s / 2} width={s} height={s} rx={s * 0.18} {...common} />;
    }
    case "diamond": {
      const s = r * 1.25;
      return <polygon points={`${x},${y - s} ${x + s},${y} ${x},${y + s} ${x - s},${y}`} {...common} />;
    }
    case "triangle": {
      const s = r * 1.35;
      return <polygon points={`${x},${y - s} ${x + s * 0.95},${y + s * 0.75} ${x - s * 0.95},${y + s * 0.75}`} {...common} />;
    }
    case "circle":
    default:
      return <circle cx={x} cy={y} r={r} {...common} />;
  }
}

function legendGlyph(shape: Shape, color: string) {
  switch (shape) {
    case "square": return <rect x="0" y="0" width="9" height="9" rx="2" fill={color} />;
    case "diamond": return <polygon points="4.5,0 9,4.5 4.5,9 0,4.5" fill={color} />;
    case "triangle": return <polygon points="4.5,0 9,8 0,8" fill={color} />;
    case "circle":
    default: return <circle cx="4.5" cy="4.5" r="4.5" fill={color} />;
  }
}

/**
 * Real skill-demand network, backed by the same skill-matrix payload as the
 * matrix view (same 24 skills, same co-occurrence counts, same leaf order) —
 * clusters are the leaf order cut into 4 contiguous groups, not a hand-
 * assigned "demand tier". Edge width AND opacity both encode co-occurrence
 * count. No hardcoded numbers — renders an honest empty state when live
 * data is unavailable instead of a fabricated graph.
 */
export function SkillNetwork({
  skills,
  matrix,
  leafOrder,
  height = 420,
  className = "",
}: {
  skills: SkillCount[];
  matrix: number[][];
  leafOrder: number[];
  height?: number;
  className?: string;
}) {
  const W = 760, H = height;
  const scale = H / 480;

  if (skills.length === 0) {
    return (
      <div className={`w-full flex items-center justify-center text-xs text-t3 ${className}`} style={{ height }}>
        Not enough live skill data yet
      </div>
    );
  }

  const order = leafOrder.length === skills.length ? leafOrder : skills.map((_, i) => i);
  const n = order.length;
  const perCluster = Math.ceil(n / CLUSTER_COUNT);
  const clusterOfLeafPos = (pos: number) => Math.min(CLUSTER_COUNT - 1, Math.floor(pos / perCluster));

  const maxCount = Math.max(...skills.map((s) => s.count));
  const minCount = Math.min(...skills.map((s) => s.count));
  const radiusFor = (count: number) => {
    if (maxCount === minCount) return 20;
    const t = (count - minCount) / (maxCount - minCount);
    return 13 + t * 22;
  };

  const cx = W / 2, cy = 240;
  const clusterRadius = 175;
  const clusterAngles = [-Math.PI / 4, (3 * Math.PI) / 4, Math.PI / 4, (5 * Math.PI) / 4]; // NE, SW, SE, NW-ish spread

  // Place nodes: group by cluster (from leaf-order position), arrange each
  // cluster's members on a small sub-ring around that cluster's centre.
  const byLeafPos = order.map((origIdx, pos) => ({ origIdx, pos, skill: skills[origIdx] }));
  const clusters: typeof byLeafPos[] = Array.from({ length: CLUSTER_COUNT }, () => []);
  byLeafPos.forEach((item) => clusters[clusterOfLeafPos(item.pos)].push(item));

  const placed: PlacedNode[] = [];
  clusters.forEach((members, ci) => {
    if (members.length === 0) return;
    const angle = clusterAngles[ci];
    const ccx = cx + Math.cos(angle) * clusterRadius * 0.62;
    const ccy = cy + Math.sin(angle) * clusterRadius * 0.5;
    const subRadius = 32 + members.length * 9;
    members.forEach((m, i) => {
      const a = (i / Math.max(1, members.length)) * Math.PI * 2 - Math.PI / 2;
      const r = radiusFor(m.skill.count);
      placed.push({
        id: m.skill.skill, label: m.skill.skill,
        x: members.length === 1 ? ccx : ccx + Math.cos(a) * subRadius,
        y: members.length === 1 ? ccy : ccy + Math.sin(a) * subRadius * 0.82,
        r, count: m.skill.count, cluster: ci,
      });
    });
  });

  const byId = new Map(placed.map((p) => [p.id, p]));
  let maxCo = 1;
  const rawEdges: { a: PlacedNode; b: PlacedNode; coCount: number }[] = [];
  for (let a = 0; a < n; a++) {
    for (let b = a + 1; b < n; b++) {
      const v = matrix[order[a]]?.[order[b]] ?? 0;
      if (v <= 0) continue;
      if (v > maxCo) maxCo = v;
      const na = byId.get(skills[order[a]].skill), nb = byId.get(skills[order[b]].skill);
      if (na && nb) rawEdges.push({ a: na, b: nb, coCount: v });
    }
  }
  const edges: PlacedEdge[] = rawEdges.map((e, i) => {
    const t = e.coCount / maxCo;
    return { id: `e${i}`, a: e.a, b: e.b, w: 0.5 + t * 3.5, opacity: 0.06 + t * 0.7, coCount: e.coCount };
  });

  const clustersPresent = clusters.map((m, ci) => ({ ci, top: m.slice().sort((x, y) => y.skill.count - x.skill.count)[0] })).filter((c) => c.top);

  return (
    <div className={`w-full ${className}`}>
      {/* Legend — above the plot, colour + shape, never colour alone */}
      <div className="flex flex-wrap items-center gap-4 mb-3">
        {clustersPresent.map(({ ci, top }) => (
          <div key={ci} className="flex items-center gap-1.5">
            <svg width="9" height="9" viewBox="0 0 9 9">{legendGlyph(CLUSTER_SHAPE[ci], CLUSTER_COLOR[ci])}</svg>
            <span className="text-[10px] text-t2">Cluster: {top.skill.skill} &amp; related</span>
          </div>
        ))}
        <span className="text-[10px] text-t3 ml-auto">Size = job count · line = co-listing frequency</span>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} 480`}
          style={{ minWidth: `${W * scale}px`, height: `${H}px` }}
          className="block mx-auto"
        >
          <defs>
            <radialGradient id="snBg" cx="55%" cy="50%" r="65%">
              <stop offset="0%" stopColor="#EEF2FF" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#F7F7FC" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect x="0" y="0" width={W} height="480" fill="url(#snBg)" rx="12" />

          {/* Edges — width AND opacity both encode co-occurrence count */}
          {edges.map((e) => {
            const mx = (e.a.x + e.b.x) / 2, my = (e.a.y + e.b.y) / 2;
            const dx = e.b.x - e.a.x, dy = e.b.y - e.a.y;
            const bend = 0.1;
            const cxp = mx - dy * bend, cyp = my + dx * bend;
            const sameCluster = e.a.cluster === e.b.cluster;
            return (
              <path
                key={e.id}
                d={`M${e.a.x},${e.a.y} Q${cxp},${cyp} ${e.b.x},${e.b.y}`}
                fill="none"
                stroke={sameCluster ? CLUSTER_COLOR[e.a.cluster] : "#94A3B8"}
                strokeWidth={e.w}
                opacity={e.opacity}
              >
                <title>{e.a.label} + {e.b.label}: co-listed {e.coCount.toLocaleString()}×</title>
              </path>
            );
          })}

          {/* Nodes — no glow/blur filters; shape + colour encode cluster */}
          {placed.map((nd) => {
            const color = CLUSTER_COLOR[nd.cluster];
            const shape = CLUSTER_SHAPE[nd.cluster];
            const showLabelAlways = nd.r >= 16;
            return (
              <g key={nd.id} className="sn-node-group">
                <NodeShape shape={shape} x={nd.x} y={nd.y} r={nd.r} fill={color} stroke="#FFFFFF" />
                <text
                  x={nd.x} y={nd.y + 4}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="700"
                  fill="#ffffff"
                  fontFamily="ui-sans-serif,system-ui,sans-serif"
                  className={showLabelAlways ? "" : "sn-hover-label"}
                  style={{ pointerEvents: "none", opacity: showLabelAlways ? 1 : 0 }}
                >
                  {nd.label}
                </text>
                <title>{nd.label}: {nd.count.toLocaleString()} live postings</title>
              </g>
            );
          })}
        </svg>
      </div>

      <style>{`
        .sn-node-group:hover .sn-hover-label { opacity: 1 !important; }
      `}</style>
    </div>
  );
}
