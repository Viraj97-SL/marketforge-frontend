"use client";

type Category = "lang" | "llm" | "mlops" | "cloud";

interface Node {
  id: string; label: string; x: number; y: number; r: number; cat: Category; jobs: number;
}
interface Edge { a: string; b: string; w: number; }

/* Category colour palette */
const CAT: Record<Category, { fill: string; stroke: string; text: string; glow: string; bg: string; label: string }> = {
  lang:  { fill: "#4F46E5", stroke: "#818CF8", text: "#ffffff", glow: "rgba(79,70,229,0.5)",   bg: "#EEF2FF", label: "Languages & Frameworks" },
  llm:   { fill: "#2563EB", stroke: "#60A5FA", text: "#ffffff", glow: "rgba(37,99,235,0.45)",  bg: "#EFF6FF", label: "LLMs & Agents"           },
  mlops: { fill: "#7C3AED", stroke: "#A78BFA", text: "#ffffff", glow: "rgba(124,58,237,0.45)", bg: "#F5F3FF", label: "MLOps & Infra"            },
  cloud: { fill: "#059669", stroke: "#34D399", text: "#ffffff", glow: "rgba(5,150,105,0.4)",   bg: "#ECFDF5", label: "Cloud & Data"             },
};

const NODES: Node[] = [
  /* ── Core (centre) ── */
  { id: "python",      label: "Python",        x: 390, y: 240, r: 38, cat: "lang",  jobs: 4100 },

  /* ── Languages ── */
  { id: "pytorch",     label: "PyTorch",       x: 240, y: 130, r: 26, cat: "lang",  jobs: 2800 },
  { id: "tensorflow",  label: "TensorFlow",    x: 180, y: 240, r: 21, cat: "lang",  jobs: 1800 },
  { id: "sql",         label: "SQL",           x: 240, y: 360, r: 20, cat: "lang",  jobs: 2200 },
  { id: "spark",       label: "Spark",         x: 140, y: 310, r: 16, cat: "lang",  jobs: 920  },

  /* ── LLMs ── */
  { id: "langchain",   label: "LangChain",     x: 520, y: 130, r: 24, cat: "llm",   jobs: 1900 },
  { id: "openai",      label: "OpenAI API",    x: 620, y: 200, r: 20, cat: "llm",   jobs: 1600 },
  { id: "huggingface", label: "HuggingFace",   x: 600, y: 310, r: 20, cat: "llm",   jobs: 1400 },
  { id: "rag",         label: "RAG",           x: 500, y: 355, r: 17, cat: "llm",   jobs: 1100 },
  { id: "llamaindex",  label: "LlamaIndex",    x: 660, y: 130, r: 15, cat: "llm",   jobs: 720  },

  /* ── MLOps ── */
  { id: "mlflow",      label: "MLflow",        x: 310, y: 80,  r: 21, cat: "mlops", jobs: 1500 },
  { id: "kubernetes",  label: "Kubernetes",    x: 440, y: 65,  r: 19, cat: "mlops", jobs: 1300 },
  { id: "docker",      label: "Docker",        x: 195, y: 160, r: 17, cat: "mlops", jobs: 1200 },
  { id: "airflow",     label: "Airflow",       x: 320, y: 400, r: 16, cat: "mlops", jobs: 850  },

  /* ── Cloud ── */
  { id: "aws",         label: "AWS SageMaker", x: 560, y: 400, r: 19, cat: "cloud", jobs: 1600 },
  { id: "gcp",         label: "GCP Vertex",    x: 660, y: 340, r: 17, cat: "cloud", jobs: 1100 },
  { id: "databricks",  label: "Databricks",    x: 450, y: 430, r: 16, cat: "cloud", jobs: 980  },
];

const EDGES: Edge[] = [
  /* Python to everyone */
  { a: "python", b: "pytorch",     w: 3 },
  { a: "python", b: "tensorflow",  w: 2.5 },
  { a: "python", b: "sql",         w: 2.5 },
  { a: "python", b: "langchain",   w: 2.5 },
  { a: "python", b: "mlflow",      w: 2 },
  { a: "python", b: "kubernetes",  w: 1.5 },
  { a: "python", b: "huggingface", w: 2 },
  { a: "python", b: "airflow",     w: 1.5 },
  /* LLM cluster */
  { a: "langchain",   b: "openai",      w: 2.5 },
  { a: "langchain",   b: "llamaindex",  w: 2   },
  { a: "langchain",   b: "rag",         w: 2   },
  { a: "huggingface", b: "rag",         w: 1.5 },
  { a: "openai",      b: "rag",         w: 1.5 },
  /* MLOps */
  { a: "mlflow",     b: "kubernetes", w: 2   },
  { a: "docker",     b: "kubernetes", w: 2   },
  { a: "docker",     b: "pytorch",    w: 1.5 },
  { a: "pytorch",    b: "mlflow",     w: 1.5 },
  /* Cloud */
  { a: "aws",        b: "databricks", w: 1.5 },
  { a: "aws",        b: "huggingface",w: 1.5 },
  { a: "gcp",        b: "aws",        w: 1.5 },
  { a: "databricks", b: "spark",      w: 1.5 },
  { a: "databricks", b: "airflow",    w: 1.2 },
  /* cross cluster */
  { a: "spark",      b: "sql",        w: 1.2 },
  { a: "tensorflow", b: "docker",     w: 1   },
];

function nodeById(id: string) { return NODES.find(n => n.id === id)!; }

export function SkillNetwork({
  height = 420,
  className = "",
}: {
  height?: number;
  className?: string;
}) {
  const W = 760, H = height;
  const scale = H / 480;

  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <svg
        viewBox={`0 0 ${W} 480`}
        style={{ minWidth: `${W * scale}px`, height: `${H}px` }}
        className="block mx-auto"
      >
        <defs>
          {/* Per-category radial fills */}
          {(Object.keys(CAT) as Category[]).map((cat) => (
            <radialGradient key={cat} id={`nf-${cat}`} cx="35%" cy="30%" r="70%">
              <stop offset="0%"   stopColor={CAT[cat].stroke} />
              <stop offset="100%" stopColor={CAT[cat].fill}   />
            </radialGradient>
          ))}

          {/* Glow filters */}
          <filter id="snGlowCore" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="8" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="snGlowMed" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="snGlowSm" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>

          {/* Arrow markers per category */}
          {(Object.keys(CAT) as Category[]).map((cat) => (
            <marker
              key={`arr-${cat}`}
              id={`arr-${cat}`}
              markerWidth="6" markerHeight="6"
              refX="5" refY="3" orient="auto"
            >
              <path d="M0,0 L6,3 L0,6 Z" fill={CAT[cat].stroke} opacity="0.6" />
            </marker>
          ))}

          {/* Background gradient */}
          <radialGradient id="snBg" cx="55%" cy="50%" r="60%">
            <stop offset="0%"   stopColor="#EEF2FF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#F8FAFC" stopOpacity="0"   />
          </radialGradient>
        </defs>

        {/* Background */}
        <rect x="0" y="0" width={W} height="480" fill="url(#snBg)" rx="12" />

        {/* Subtle hexagon grid */}
        {[80,160,240,320,400].map(y =>
          [80,200,320,440,560,680].map(x => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="2"
              fill="#C7D2FE" opacity="0.25" />
          ))
        )}

        {/* Edges */}
        {EDGES.map((e, i) => {
          const na = nodeById(e.a), nb = nodeById(e.b);
          if (!na || !nb) return null;
          const dx = nb.x - na.x, dy = nb.y - na.y;
          const len = Math.sqrt(dx*dx + dy*dy);
          const ux = dx/len, uy = dy/len;
          const x1 = na.x + ux * na.r, y1 = na.y + uy * na.r;
          const x2 = nb.x - ux * (nb.r + 6), y2 = nb.y - uy * (nb.r + 6);
          const mx = (x1+x2)/2 + (dy > 0 ? -20 : 20) * 0.2;
          const my = (y1+y2)/2 + (dx > 0 ? 20 : -20) * 0.2;
          const c = CAT[na.cat];
          return (
            <path
              key={i}
              d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`}
              fill="none"
              stroke={c.stroke}
              strokeWidth={e.w}
              strokeOpacity={0.28}
              markerEnd={`url(#arr-${na.cat})`}
            />
          );
        })}

        {/* Nodes */}
        {NODES.map((n) => {
          const c = CAT[n.cat];
          const isCore = n.id === "python";
          const filter = isCore ? "url(#snGlowCore)" : n.r >= 20 ? "url(#snGlowMed)" : "url(#snGlowSm)";
          return (
            <g key={n.id}>
              {/* Ambient halo */}
              <circle cx={n.x} cy={n.y} r={n.r + 16}
                fill={c.fill} opacity="0.06" />

              {/* Outer ring */}
              <circle cx={n.x} cy={n.y} r={n.r + 3}
                fill="none" stroke={c.stroke} strokeWidth="0.8" opacity="0.35" />

              {/* Shadow */}
              <circle cx={n.x + 1.5} cy={n.y + 2.5} r={n.r}
                fill={c.fill} opacity="0.15" />

              {/* Main fill */}
              <circle cx={n.x} cy={n.y} r={n.r}
                fill={`url(#nf-${n.cat})`}
                filter={filter}
              />

              {/* Highlight arc (top-left) */}
              <circle
                cx={n.x - n.r * 0.22}
                cy={n.y - n.r * 0.22}
                r={n.r * 0.42}
                fill="white" opacity="0.22"
              />
              <circle
                cx={n.x - n.r * 0.08}
                cy={n.y - n.r * 0.08}
                r={n.r * 0.18}
                fill="white" opacity="0.55"
              />

              {/* Pulse ring for Python core */}
              {isCore && (
                <circle cx={n.x} cy={n.y} r={n.r + 10}
                  fill="none" stroke={c.stroke} strokeWidth="1.5"
                  strokeDasharray="6 3" opacity="0.4"
                  style={{ animation: "snPulse 3s ease-in-out infinite" }}
                />
              )}

              {/* Label */}
              <text
                x={n.x} y={n.y + (isCore ? 4.5 : n.r > 18 ? 4 : 3.5)}
                textAnchor="middle"
                fontSize={isCore ? "12.5" : n.r > 18 ? "10" : n.r > 14 ? "9" : "8"}
                fontWeight={isCore ? "900" : "700"}
                fill={c.text}
                fontFamily="ui-sans-serif,system-ui,sans-serif"
                style={{ pointerEvents: "none" }}
              >
                {n.label}
              </text>

              {/* Job count (larger nodes only) */}
              {n.r >= 19 && (
                <text
                  x={n.x} y={n.y + (isCore ? 17 : 15)}
                  textAnchor="middle"
                  fontSize={isCore ? "8.5" : "7.5"}
                  fill={c.text}
                  fontFamily="ui-sans-serif,system-ui,sans-serif"
                  opacity="0.7"
                  style={{ pointerEvents: "none" }}
                >
                  {(n.jobs / 1000).toFixed(1)}k jobs
                </text>
              )}
            </g>
          );
        })}

        {/* Category legend */}
        <g transform="translate(10,10)">
          <rect x="0" y="0" width="184" height="76" rx="10"
            fill="white" opacity="0.92" stroke="#E0E7FF" strokeWidth="1" />
          {(Object.keys(CAT) as Category[]).map((cat, i) => {
            const c = CAT[cat];
            return (
              <g key={cat} transform={`translate(10,${10 + i * 16})`}>
                <circle cx="6" cy="5.5" r="5" fill={c.fill} />
                <circle cx="4" cy="3.5" r="2" fill="white" opacity="0.45" />
                <text x="16" y="9" fontSize="8" fontWeight="700" fill="#1E1B4B"
                  fontFamily="ui-sans-serif,system-ui,sans-serif">{c.label}</text>
              </g>
            );
          })}
        </g>

        {/* Node size legend */}
        <g transform="translate(580,10)">
          <rect x="0" y="0" width="172" height="52" rx="10"
            fill="white" opacity="0.92" stroke="#E0E7FF" strokeWidth="1" />
          <text x="10" y="16" fontSize="7.5" fontWeight="700" fill="#64748B"
            fontFamily="ui-sans-serif,system-ui,sans-serif">NODE SIZE = JOB FREQUENCY</text>
          <circle cx="22" cy="36" r="13" fill="#4F46E5" opacity="0.9"/>
          <text x="22" y="36.5" textAnchor="middle" fontSize="6.5" fill="white" fontWeight="700"
            fontFamily="ui-sans-serif,system-ui,sans-serif">4k+</text>
          <circle cx="56" cy="36" r="9" fill="#4F46E5" opacity="0.75"/>
          <text x="56" y="36.5" textAnchor="middle" fontSize="6" fill="white" fontWeight="600"
            fontFamily="ui-sans-serif,system-ui,sans-serif">2k</text>
          <circle cx="84" cy="36" r="6" fill="#4F46E5" opacity="0.6"/>
          <text x="84" y="36.5" textAnchor="middle" fontSize="5.5" fill="white" fontWeight="600"
            fontFamily="ui-sans-serif,system-ui,sans-serif">1k</text>
          <circle cx="106" cy="36" r="4" fill="#4F46E5" opacity="0.5"/>
          <text x="130" y="40" fontSize="7" fill="#94A3B8"
            fontFamily="ui-sans-serif,system-ui,sans-serif">= roles/wk</text>
        </g>

        <style>{`
          @keyframes snPulse {
            0%,100% { opacity: 0.4; r: 48; }
            50%      { opacity: 0.15; r: 56; }
          }
        `}</style>
      </svg>
    </div>
  );
}
