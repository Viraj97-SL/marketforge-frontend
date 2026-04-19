"use client";

import Marquee from "react-fast-marquee";
import {
  siGoogle, siNvidia, siAnthropic, siMeta, siHuggingface, siArm,
  siPalantir, siPytorch, siTensorflow, siApple, siIntel, siAmd,
  siRollsroyce, siBt, siSage, siHsbc, siSky, siSiemens,
  siDatabricks, siSnowflake, siDocker, siKubernetes, siGithub, siDatadog,
} from "simple-icons";

type SiIcon = { path: string; hex: string; title: string };

interface Brand {
  name: string;
  icon: SiIcon;
}

const ROW1: Brand[] = [
  { name: "Google DeepMind",  icon: siGoogle },
  { name: "NVIDIA",           icon: siNvidia },
  { name: "Anthropic",        icon: siAnthropic },
  { name: "Meta AI",          icon: siMeta },
  { name: "Hugging Face",     icon: siHuggingface },
  { name: "ARM",              icon: siArm },
  { name: "Palantir",         icon: siPalantir },
  { name: "PyTorch",          icon: siPytorch },
  { name: "TensorFlow",       icon: siTensorflow },
  { name: "Apple",            icon: siApple },
  { name: "Intel",            icon: siIntel },
  { name: "AMD",              icon: siAmd },
];

const ROW2: Brand[] = [
  { name: "Rolls-Royce",  icon: siRollsroyce },
  { name: "BT Group",     icon: siBt },
  { name: "Sage",         icon: siSage },
  { name: "HSBC Tech",    icon: siHsbc },
  { name: "Sky Tech",     icon: siSky },
  { name: "Siemens",      icon: siSiemens },
  { name: "Databricks",   icon: siDatabricks },
  { name: "Snowflake",    icon: siSnowflake },
  { name: "Docker",       icon: siDocker },
  { name: "Kubernetes",   icon: siKubernetes },
  { name: "GitHub",       icon: siGithub },
  { name: "Datadog",      icon: siDatadog },
];

function BrandPill({ name, icon }: Brand) {
  const hex = icon.hex;
  return (
    <div
      className="mx-3 flex items-center gap-2.5 px-4 py-2 rounded-full border border-b1 bg-s1/80 backdrop-blur-sm
                 hover:border-b2 hover:bg-s2 transition-all duration-200 select-none shrink-0"
    >
      <span
        className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
        style={{ backgroundColor: `#${hex}18` }}
      >
        <svg
          role="img"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3.5 h-3.5"
          style={{ fill: `#${hex}` }}
          aria-label={icon.title}
        >
          <path d={icon.path} />
        </svg>
      </span>
      <span className="text-[11px] text-t2 font-semibold whitespace-nowrap">{name}</span>
    </div>
  );
}

export function LogoMarquee() {
  return (
    <section className="py-10 overflow-hidden border-y border-b1 bg-s1/40 relative">
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-5">
        <p className="text-[11px] font-bold text-t3 uppercase tracking-widest text-center">
          Trusted data sources &amp; industry partners
        </p>
      </div>

      <div className="space-y-3">
        <Marquee speed={35} gradient={false} pauseOnHover>
          {ROW1.map((b) => (
            <BrandPill key={b.name} {...b} />
          ))}
        </Marquee>
        <Marquee speed={28} gradient={false} direction="right" pauseOnHover>
          {ROW2.map((b) => (
            <BrandPill key={b.name} {...b} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
