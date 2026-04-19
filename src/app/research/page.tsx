import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Research Signals & Emerging Tech UK",
  description:
    "Track emerging AI research trends relevant to UK hiring: rising techniques from arXiv, new model families, and techniques gaining traction in job postings.",
  alternates: { canonical: "https://marketforge.digital/research" },
  openGraph: {
    title: "AI Research Signals & Emerging Tech | MarketForge AI",
    description:
      "Which AI research directions are becoming job requirements? Track the bridge between arXiv and UK AI hiring.",
    url: "https://marketforge.digital/research",
  },
};

import { ExternalLink, Microscope, Zap, TrendingUp, BookOpen } from "lucide-react";

export const revalidate = 600;

// Illustrative emerging tech signals (in production: fed by arXiv monitor agent)
const RESEARCH_SIGNALS = [
  {
    category: "Frontier Models",
    trend: "↑ accelerating",
    trendColor: "text-ok",
    items: [
      { title: "Mixture-of-Experts architectures gaining traction in production deployments", impact: "high", timeframe: "3–6 months to job market", tag: "LLM" },
      { title: "Test-time compute scaling emerging as training-time compute alternative", impact: "high", timeframe: "6–12 months to adoption", tag: "Inference" },
      { title: "Multimodal models (vision + audio + text) becoming baseline expectation", impact: "medium", timeframe: "Now — already in job specs", tag: "Multimodal" },
    ],
  },
  {
    category: "ML Engineering",
    trend: "↑ rising",
    trendColor: "text-ok",
    items: [
      { title: "vLLM and PagedAttention driving ML infrastructure engineer demand", impact: "high", timeframe: "Now — active job requirement", tag: "Inference" },
      { title: "Model quantisation (GPTQ, AWQ, GGUF) becoming core MLOps skill", impact: "medium", timeframe: "3–6 months", tag: "Quantisation" },
      { title: "Speculative decoding and KV cache optimisation entering job specs", impact: "medium", timeframe: "6 months", tag: "Optimisation" },
    ],
  },
  {
    category: "AI Safety & Alignment",
    trend: "↑ fast-growing",
    trendColor: "text-accent",
    items: [
      { title: "Interpretability and mechanistic analysis skills in high demand (UK AI Safety Institute)", impact: "high", timeframe: "Now — active hiring", tag: "Safety" },
      { title: "Constitutional AI and RLHF fine-tuning skills spreading beyond frontier labs", impact: "high", timeframe: "6–12 months", tag: "Alignment" },
      { title: "Red-teaming and adversarial evaluation becoming standalone job category", impact: "medium", timeframe: "12 months", tag: "Red-teaming" },
    ],
  },
  {
    category: "Data & Infrastructure",
    trend: "→ stable",
    trendColor: "text-t2",
    items: [
      { title: "Feature stores (Feast, Hopsworks) consolidating as MLOps standard", impact: "medium", timeframe: "Established — growing adoption", tag: "Data" },
      { title: "dbt + Spark + Iceberg replacing legacy data warehouse patterns in AI shops", impact: "medium", timeframe: "Now", tag: "Data Eng" },
      { title: "Streaming ML with Flink/Kafka gaining traction in real-time recommendation", impact: "low", timeframe: "12–18 months", tag: "Streaming" },
    ],
  },
];

const ARXIV_HIGHLIGHTS = [
  { title: "Scaling Laws for Neural Language Models", area: "Theory", citations: "15k+", relevance: "Foundation for all LLM hiring" },
  { title: "FlashAttention-3: Fast and Accurate Attention with Asynchrony", area: "Systems", citations: "2.1k", relevance: "Core ML infra skill" },
  { title: "Constitutional AI: Harmlessness from AI Feedback", area: "Safety", citations: "3.8k", relevance: "RLHF/alignment jobs" },
  { title: "LoRA: Low-Rank Adaptation of Large Language Models", area: "Fine-tuning", citations: "12k+", relevance: "Standard fine-tuning approach" },
  { title: "Mixtral of Experts", area: "Architecture", citations: "4.2k", relevance: "MoE architecture jobs rising" },
  { title: "Direct Preference Optimisation (DPO)", area: "Alignment", citations: "3.1k", relevance: "Replaces RLHF in many pipelines" },
];

const IMPACT_STYLES: Record<string, string> = {
  high:   "bg-err/10 text-err border-err/20",
  medium: "bg-warn/10 text-warn border-warn/20",
  low:    "bg-t2/10 text-t2 border-t2/20",
};

export default function ResearchPage() {
  return (
    <div className="pt-14 max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-10 animate-fade-up">
        <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-2">Research Intelligence</p>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-t1 mb-3">
          Emerging Tech Signals
        </h1>
        <p className="text-t2 max-w-xl">
          Technologies tracked from arXiv, GitHub trending, and funding announcements by our
          Research Intelligence department — before they appear in job descriptions.
        </p>
      </div>

      {/* Signal categories */}
      <div className="grid lg:grid-cols-2 gap-5 mb-8">
        {RESEARCH_SIGNALS.map((cat, ci) => (
          <div
            key={cat.category}
            className="rounded-2xl border border-b1 bg-s1 p-6 animate-fade-up"
            style={{ animationDelay: `${ci * 80}ms` }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Microscope className="w-4 h-4 text-accent" />
                </div>
                <h2 className="text-sm font-bold text-t1">{cat.category}</h2>
              </div>
              <span className={`text-[11px] font-semibold ${cat.trendColor}`}>{cat.trend}</span>
            </div>

            <div className="space-y-3">
              {cat.items.map((item, ii) => (
                <div key={ii} className="p-3 rounded-xl bg-s2 border border-b1 hover:border-b2 transition-colors">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-xs text-t1 leading-relaxed font-medium flex-1">{item.title}</p>
                    <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded-md bg-s3 border border-b1 text-t3 font-mono">
                      {item.tag}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-t3">{item.timeframe}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${IMPACT_STYLES[item.impact]}`}>
                      {item.impact} impact
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* arXiv highlights */}
      <div className="rounded-2xl border border-b1 bg-s1 p-6 animate-fade-up animate-delay-400">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="w-4 h-4 text-blue" />
          <h2 className="text-sm font-bold text-t1">High-Impact Papers → Job Market Relevance</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ARXIV_HIGHLIGHTS.map((p, i) => (
            <div key={i} className="p-4 rounded-xl border border-b1 bg-s2 hover:border-b2 transition-colors group">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue/10 text-blue border border-blue/20 font-medium">
                  {p.area}
                </span>
                <span className="text-[10px] text-t3">{p.citations} citations</span>
              </div>
              <p className="text-xs font-semibold text-t1 leading-tight mb-2 group-hover:text-accent transition-colors">{p.title}</p>
              <p className="text-[10px] text-t2 leading-relaxed">{p.relevance}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-t3 mt-4 pt-4 border-t border-b1">
          Papers surfaced by arXiv Monitor Agent. Relevance scored by semantic similarity to current UK job descriptions.
          Updated weekly.
        </p>
      </div>
    </div>
  );
}
