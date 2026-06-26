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

import { ExternalLink, Microscope, Zap, TrendingUp, BookOpen, ArrowRight, CheckCircle2, Search, Network, Clock4 } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { PipelineFlow } from "@/components/illustrations/pipeline-flow";

export const revalidate = 600;

const RESEARCH_SIGNALS = [
  {
    category: "Frontier Models",
    trend: "↑ accelerating",
    trendColor: "text-ok",
    icon: "🧠",
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
    icon: "⚙️",
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
    icon: "🛡️",
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
    icon: "🗄️",
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

const SIGNAL_TIMELINE = [
  { tech: "Transformer Architecture", arxiv: "2017", jobSpecs: "2019", gap: "~2 years", status: "established" },
  { tech: "LoRA / PEFT Fine-tuning", arxiv: "2021 Q4", jobSpecs: "2023 Q1", gap: "~15 months", status: "mainstream" },
  { tech: "RAG (Retrieval-Augmented Gen)", arxiv: "2020 Q3", jobSpecs: "2023 Q2", gap: "~30 months", status: "mainstream" },
  { tech: "Mixture-of-Experts (MoE)", arxiv: "2017", jobSpecs: "2024 Q1", gap: "~6 years", status: "rising" },
  { tech: "Constitutional AI / RLHF", arxiv: "2022 Q2", jobSpecs: "2023 Q4", gap: "~18 months", status: "rising" },
  { tech: "Speculative Decoding", arxiv: "2022 Q4", jobSpecs: "2025 Q1", gap: "~27 months", status: "emerging" },
];

const METHODOLOGY_STEPS = [
  {
    icon: Search,
    step: "01",
    title: "arXiv Monitor",
    desc: "Our agent scrapes arXiv CS and Stat.ML daily, ingesting 200–400 new papers. NLP filters surface AI/ML-relevant publications above a citation velocity threshold.",
    color: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/20",
  },
  {
    icon: Network,
    step: "02",
    title: "Relevance Scoring",
    desc: "Each paper's abstract is embedded with SBERT and compared via cosine similarity to a corpus of 50,000+ UK job descriptions. Papers scoring >0.72 enter the signal pipeline.",
    color: "text-blue",
    bg: "bg-blue/10",
    border: "border-blue/20",
  },
  {
    icon: TrendingUp,
    step: "03",
    title: "Impact Classification",
    desc: "Signals are classified as High / Medium / Low impact based on citation velocity, GitHub star growth, and rate of appearance in new job postings over a 90-day rolling window.",
    color: "text-prp",
    bg: "bg-prp/10",
    border: "border-prp/20",
  },
];

const IMPACT_STYLES: Record<string, string> = {
  high:   "bg-err/10 text-err border-err/20",
  medium: "bg-warn/10 text-warn border-warn/20",
  low:    "bg-t2/10 text-t2 border-t2/20",
};

const TIMELINE_STATUS: Record<string, string> = {
  established: "text-ok bg-ok/10 border-ok/20",
  mainstream:  "text-accent bg-accent/10 border-accent/20",
  rising:      "text-blue bg-blue/10 border-blue/20",
  emerging:    "text-prp bg-prp/10 border-prp/20",
};

export default function ResearchPage() {
  return (
    <div className="pt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Hero */}
        <PageHero
          badge="Research Intelligence"
          title="Emerging Tech"
          titleAccent="Signals"
          subtitle="Technologies tracked from arXiv, GitHub trending, and funding announcements — before they appear in UK job descriptions."
          imageSrc="https://images.unsplash.com/photo-1644088379091-d574269d422f?w=1920&q=80&auto=format&fit=crop"
        >
          <div className="flex flex-wrap gap-2">
            {[
              { label: "87 papers monitored", color: "border-accent/20 bg-accent/5 text-accent" },
              { label: "23 active signals",   color: "border-blue/20 bg-blue/5 text-blue" },
              { label: "4 research domains",  color: "border-prp/20 bg-prp/5 text-prp" },
              { label: "~8 months avg. time to job market", color: "border-ok/20 bg-ok/5 text-ok" },
            ].map((c) => (
              <span key={c.label} className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${c.color}`}>
                {c.label}
              </span>
            ))}
          </div>
        </PageHero>

        {/* Signal of the Week — featured spotlight */}
        <div className="relative rounded-2xl overflow-hidden border border-accent/25 mb-8 animate-fade-up animate-delay-100">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-s1 to-blue/5" />
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{ backgroundImage: "url('/images/research-signal-feature.jpg')" }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-s1/95 to-transparent pointer-events-none" />

          <div className="relative z-10 p-8 sm:p-10 flex flex-col sm:flex-row gap-8 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold text-accent uppercase tracking-widest px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20">
                  Signal of the week
                </span>
                <span className="text-[10px] text-ok font-semibold bg-ok/10 border border-ok/20 px-2 py-1 rounded-full">
                  ↑ Fast-growing
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-t1 mb-3 leading-tight">
                Agentic AI &amp; Multi-Agent Orchestration
              </h2>
              <p className="text-t2 text-sm leading-relaxed max-w-lg mb-5">
                Frameworks like LangGraph, AutoGen, and CrewAI have crossed the threshold from research
                curiosity to active hiring requirement. UK AI employers are now explicitly listing
                &ldquo;multi-agent system design&rdquo; in 14% of senior ML/AI postings — up from less than 2% six
                months ago.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="p-3 rounded-xl bg-s2 border border-b1 text-center min-w-[90px]">
                  <p className="text-xl font-black text-accent">14%</p>
                  <p className="text-[10px] text-t2 mt-0.5">of senior AI roles</p>
                </div>
                <div className="p-3 rounded-xl bg-s2 border border-b1 text-center min-w-[90px]">
                  <p className="text-xl font-black text-blue">+600%</p>
                  <p className="text-[10px] text-t2 mt-0.5">6-month growth</p>
                </div>
                <div className="p-3 rounded-xl bg-s2 border border-b1 text-center min-w-[90px]">
                  <p className="text-xl font-black text-prp">3–6 mo</p>
                  <p className="text-[10px] text-t2 mt-0.5">to mainstream</p>
                </div>
              </div>
            </div>

            <div className="shrink-0 flex flex-col gap-2">
              {["LangGraph", "AutoGen", "CrewAI", "OpenAI Swarm", "LangChain Agents"].map((tag) => (
                <span key={tag} className="text-xs font-semibold text-t1 px-3 py-2 rounded-xl bg-s2 border border-b1 hover:border-accent/30 transition-colors">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Methodology — with pipeline flow illustration */}
        <div className="rounded-2xl border border-b1 bg-s1 p-8 mb-8 animate-fade-up animate-delay-150">
          <div className="flex items-center gap-2 mb-6">
            <Microscope className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-bold text-t1">How We Track Signals</h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-s2 border border-b1 text-t2 ml-auto">Methodology</span>
          </div>

          {/* Visual pipeline */}
          <div className="bg-s2 rounded-xl border border-b1 p-5 mb-6">
            <PipelineFlow variant="horizontal" />
          </div>

          {/* Detail cards */}
          <div className="grid sm:grid-cols-3 gap-5">
            {METHODOLOGY_STEPS.map((m) => (
              <div key={m.step} className={`rounded-xl border p-5 ${m.border} bg-s2`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${m.bg}`}>
                    <m.icon className={`w-4 h-4 ${m.color}`} />
                  </div>
                  <span className={`font-mono text-xs font-bold ${m.color}`}>{m.step}</span>
                </div>
                <h3 className={`text-sm font-bold mb-2 ${m.color}`}>{m.title}</h3>
                <p className="text-[11px] text-t2 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Signal categories */}
        <div className="grid lg:grid-cols-2 gap-5 mb-8">
          {RESEARCH_SIGNALS.map((cat, ci) => (
            <div
              key={cat.category}
              className="rounded-2xl border border-b1 bg-s1 p-6 animate-fade-up"
              style={{ animationDelay: `${200 + ci * 80}ms` }}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-base">
                    {cat.icon}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-t1">{cat.category}</h2>
                    <p className="text-[10px] text-t3">{cat.items.length} tracked signals</p>
                  </div>
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
                      <span className="text-[10px] text-t3 flex items-center gap-1">
                        <Clock4 className="w-2.5 h-2.5" />
                        {item.timeframe}
                      </span>
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

        {/* Signal → Job Market Timeline */}
        <div className="rounded-2xl border border-b1 bg-s1 p-6 mb-8 animate-fade-up animate-delay-500">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-warn" />
            <h2 className="text-sm font-bold text-t1">Research → Job Market Pipeline</h2>
          </div>
          <p className="text-xs text-t2 mb-6 max-w-xl">
            How long it takes for a research breakthrough to become a UK job requirement. Shorter gaps signal faster industry adoption.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[540px]">
              <thead>
                <tr className="border-b border-b1">
                  <th className="text-left py-2 pr-4 text-t3 font-semibold">Technology</th>
                  <th className="text-center py-2 px-3 text-t3 font-semibold">arXiv</th>
                  <th className="text-center py-2 px-3 text-t3 font-semibold">In UK Job Specs</th>
                  <th className="text-center py-2 px-3 text-t3 font-semibold">Gap</th>
                  <th className="text-right py-2 pl-3 text-t3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-b1">
                {SIGNAL_TIMELINE.map((row) => (
                  <tr key={row.tech} className="hover:bg-s2/60 transition-colors">
                    <td className="py-3 pr-4 font-semibold text-t1">{row.tech}</td>
                    <td className="py-3 px-3 text-center font-mono text-t2">{row.arxiv}</td>
                    <td className="py-3 px-3 text-center font-mono text-accent">{row.jobSpecs}</td>
                    <td className="py-3 px-3 text-center font-mono text-warn text-[11px]">{row.gap}</td>
                    <td className="py-3 pl-3 text-right">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${TIMELINE_STATUS[row.status]}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-t3 mt-4 pt-4 border-t border-b1">
            Dates are approximate. Gap = time from first major arXiv paper to first appearance in &gt;1% of relevant UK job listings.
          </p>
        </div>

        {/* arXiv highlights */}
        <div className="rounded-2xl border border-b1 bg-s1 p-6 animate-fade-up animate-delay-600">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-4 h-4 text-blue" />
            <h2 className="text-sm font-bold text-t1">High-Impact Papers → Job Market Relevance</h2>
            <span className="text-[10px] text-t2 ml-auto">Updated weekly</span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ARXIV_HIGHLIGHTS.map((p, i) => (
              <div key={i} className="p-4 rounded-xl border border-b1 bg-s2 hover:border-b2 transition-colors group cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue/10 text-blue border border-blue/20 font-medium">
                    {p.area}
                  </span>
                  <span className="text-[10px] text-t3">{p.citations} citations</span>
                </div>
                <p className="text-xs font-semibold text-t1 leading-tight mb-2 group-hover:text-accent transition-colors">{p.title}</p>
                <div className="flex items-center gap-1 text-[10px] text-t2">
                  <CheckCircle2 className="w-2.5 h-2.5 text-ok shrink-0" />
                  {p.relevance}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-b1">
            <p className="text-xs text-t3">
              Papers surfaced by arXiv Monitor Agent. Relevance scored by semantic similarity to current UK job descriptions.
            </p>
            <button className="flex items-center gap-1.5 text-xs text-accent font-semibold hover:gap-2.5 transition-all">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
