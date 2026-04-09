"use client";

import Marquee from "react-fast-marquee";

const BRANDS_ROW1 = [
  { name: "Google DeepMind",    tag: "DEEPMIND",    color: "text-blue" },
  { name: "Microsoft Azure AI", tag: "AZURE AI",    color: "text-accent" },
  { name: "Amazon AWS",         tag: "AWS",          color: "text-warn" },
  { name: "NVIDIA",             tag: "NVIDIA",       color: "text-ok" },
  { name: "OpenAI",             tag: "OPENAI",       color: "text-accent" },
  { name: "Anthropic",          tag: "ANTHROPIC",    color: "text-prp" },
  { name: "Meta AI",            tag: "META AI",      color: "text-blue" },
  { name: "Hugging Face",       tag: "HUG FACE",     color: "text-warn" },
  { name: "ARM",                tag: "ARM",          color: "text-ok" },
  { name: "Palantir",           tag: "PALANTIR",     color: "text-err" },
  { name: "Cohere",             tag: "COHERE",       color: "text-accent" },
  { name: "IBM Watson",         tag: "IBM",          color: "text-blue" },
];

const BRANDS_ROW2 = [
  { name: "Rolls-Royce",        tag: "ROLLS-ROYCE",  color: "text-t2" },
  { name: "BT Group",           tag: "BT",           color: "text-prp" },
  { name: "Sage",               tag: "SAGE",         color: "text-ok" },
  { name: "Ocado",              tag: "OCADO",        color: "text-warn" },
  { name: "Reed",               tag: "REED",         color: "text-err" },
  { name: "Adzuna",             tag: "ADZUNA",       color: "text-accent" },
  { name: "Scale AI",           tag: "SCALE AI",     color: "text-blue" },
  { name: "Stability AI",       tag: "STABILITY",    color: "text-prp" },
  { name: "HSBC Tech",          tag: "HSBC",         color: "text-ok" },
  { name: "Sky Tech",           tag: "SKY",          color: "text-accent" },
  { name: "Lloyds Banking",     tag: "LLOYDS",       color: "text-blue" },
  { name: "Improbable",         tag: "IMPROBABLE",   color: "text-warn" },
];

function BrandPill({ name, tag, color }: { name: string; tag: string; color: string }) {
  return (
    <div className="mx-4 flex items-center gap-2 px-5 py-2.5 rounded-full border border-b1 bg-s1/80 backdrop-blur-sm
                    hover:border-b2 hover:bg-s2 transition-all duration-200 select-none group shrink-0">
      <span className={`text-[10px] font-black tracking-widest ${color} font-mono`}>{tag}</span>
      <span className="text-[11px] text-t3 font-medium hidden sm:inline">{name}</span>
    </div>
  );
}

export function LogoMarquee() {
  return (
    <section className="py-10 overflow-hidden border-y border-b1 bg-s1/40 relative">
      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-5">
        <p className="text-[11px] font-bold text-t3 uppercase tracking-widest text-center">
          Trusted data sources & industry partners
        </p>
      </div>

      <div className="space-y-3">
        <Marquee speed={35} gradient={false} pauseOnHover>
          {BRANDS_ROW1.map((b) => (
            <BrandPill key={b.name} {...b} />
          ))}
        </Marquee>
        <Marquee speed={28} gradient={false} direction="right" pauseOnHover>
          {BRANDS_ROW2.map((b) => (
            <BrandPill key={b.name} {...b} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
