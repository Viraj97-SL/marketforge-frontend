"use client";

interface SkillNode {
  id: string;
  label: string;
  x: number;
  y: number;
  r: number;
  tier: "core" | "primary" | "secondary";
}

interface Edge {
  from: string;
  to: string;
}

const NODES: SkillNode[] = [
  { id: "python",    label: "Python",      x: 300, y: 200, r: 36, tier: "core"      },
  { id: "pytorch",   label: "PyTorch",     x: 170, y: 130, r: 26, tier: "primary"   },
  { id: "tf",        label: "TensorFlow",  x: 420, y: 120, r: 24, tier: "primary"   },
  { id: "sql",       label: "SQL",         x: 460, y: 240, r: 22, tier: "primary"   },
  { id: "langchain", label: "LangChain",   x: 150, y: 270, r: 24, tier: "primary"   },
  { id: "docker",    label: "Docker",      x: 330, y: 340, r: 22, tier: "primary"   },
  { id: "k8s",       label: "Kubernetes",  x: 180, y: 370, r: 20, tier: "primary"   },
  { id: "mlflow",    label: "MLflow",      x:  90, y: 190, r: 16, tier: "secondary" },
  { id: "hf",        label: "HuggingFace", x: 390, y: 330, r: 16, tier: "secondary" },
  { id: "spark",     label: "Spark",       x: 460, y: 355, r: 15, tier: "secondary" },
  { id: "rag",       label: "RAG",         x:  80, y: 310, r: 14, tier: "secondary" },
  { id: "sagemaker", label: "SageMaker",   x: 430, y: 180, r: 14, tier: "secondary" },
  { id: "airflow",   label: "Airflow",     x: 260, y: 390, r: 14, tier: "secondary" },
  { id: "jax",       label: "JAX",         x: 100, y: 100, r: 13, tier: "secondary" },
  { id: "pydantic",  label: "Pydantic",    x: 370, y:  70, r: 12, tier: "secondary" },
  { id: "fastapi",   label: "FastAPI",     x: 230, y:  70, r: 12, tier: "secondary" },
];

const EDGES: Edge[] = [
  { from: "python",    to: "pytorch"   },
  { from: "python",    to: "tf"        },
  { from: "python",    to: "sql"       },
  { from: "python",    to: "langchain" },
  { from: "python",    to: "docker"    },
  { from: "python",    to: "mlflow"    },
  { from: "python",    to: "fastapi"   },
  { from: "pytorch",   to: "jax"       },
  { from: "pytorch",   to: "hf"        },
  { from: "langchain", to: "rag"       },
  { from: "langchain", to: "hf"        },
  { from: "docker",    to: "k8s"       },
  { from: "docker",    to: "airflow"   },
  { from: "k8s",       to: "spark"     },
  { from: "tf",        to: "sagemaker" },
  { from: "tf",        to: "pydantic"  },
  { from: "sql",       to: "spark"     },
];

const TIER_STYLES = {
  core:      { fill: "#4F46E5", stroke: "#4338CA", textFill: "white",   fontSize: 11, fontWeight: "800" },
  primary:   { fill: "#EEF2FF", stroke: "#818CF8", textFill: "#3730A3", fontSize: 9,  fontWeight: "700" },
  secondary: { fill: "#F8FAFC", stroke: "#CBD5E1", textFill: "#64748B", fontSize: 8,  fontWeight: "600" },
};

export function SkillNetwork({ className = "", height = 420 }: { className?: string; height?: number }) {
  const nodeMap = Object.fromEntries(NODES.map((n) => [n.id, n]));

  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 50 540 370" style={{ height }} className="w-full" aria-label="UK AI skill dependency network">
        <defs>
          <radialGradient id="netBg" cx="50%" cy="50%" r="60%">
            <stop offset="0%"   stopColor="#EEF2FF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#F8FAFC" stopOpacity="0"   />
          </radialGradient>
          <filter id="nodeGlow">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <marker id="arr" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
            <path d="M0,0 L5,2.5 L0,5 Z" fill="#C7D2FE" />
          </marker>
        </defs>

        <ellipse cx="270" cy="230" rx="240" ry="200" fill="url(#netBg)" />

        {EDGES.map((e) => {
          const a = nodeMap[e.from], b = nodeMap[e.to];
          if (!a || !b) return null;
          const dx = b.x - a.x, dy = b.y - a.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          return (
            <line key={`${e.from}-${e.to}`}
              x1={a.x + (dx / len) * a.r} y1={a.y + (dy / len) * a.r}
              x2={b.x - (dx / len) * (b.r + 4)} y2={b.y - (dy / len) * (b.r + 4)}
              stroke="#C7D2FE" strokeWidth="1.2" markerEnd="url(#arr)"
            />
          );
        })}

        {NODES.map((n) => {
          const s = TIER_STYLES[n.tier];
          return (
            <g key={n.id} filter={n.tier === "core" ? "url(#nodeGlow)" : undefined}>
              {n.tier === "core" && (
                <circle cx={n.x} cy={n.y} r={n.r + 8} fill="none" stroke="#818CF8" strokeWidth="1" strokeOpacity="0.3" />
              )}
              <circle cx={n.x} cy={n.y} r={n.r} fill={s.fill} stroke={s.stroke} strokeWidth={n.tier === "core" ? 2.5 : 1.5} />
              <text x={n.x} y={n.y + (n.r > 20 ? 4 : 3)} textAnchor="middle"
                fontSize={s.fontSize} fontWeight={s.fontWeight}
                fontFamily="system-ui,-apple-system,sans-serif" fill={s.textFill}>
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
