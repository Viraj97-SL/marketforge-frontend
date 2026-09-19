"use client";

import Marquee from "react-fast-marquee";
import {
  siGoogle, siNvidia, siAnthropic, siMeta, siHuggingface, siPalantir,
  siRollsroyce, siBt, siHsbc, siDatabricks, siGithub, siArm,
  siPytorch, siTensorflow, siApple, siIntel, siAmd, siSage,
  siSky, siSiemens, siSnowflake, siDocker, siKubernetes, siDatadog,
} from "simple-icons";

type SiIcon = { path: string; hex: string; title: string };

interface Brand {
  name: string;
  icon: SiIcon;
}

const ROW1: Brand[] = [
  { name: "Google DeepMind", icon: siGoogle },
  { name: "NVIDIA",          icon: siNvidia },
  { name: "Anthropic",       icon: siAnthropic },
  { name: "Meta AI",         icon: siMeta },
  { name: "Hugging Face",    icon: siHuggingface },
  { name: "ARM",             icon: siArm },
  { name: "PyTorch",         icon: siPytorch },
  { name: "TensorFlow",      icon: siTensorflow },
  { name: "Apple",           icon: siApple },
  { name: "Intel",           icon: siIntel },
  { name: "AMD",             icon: siAmd },
  { name: "Docker",          icon: siDocker },
];

const ROW2: Brand[] = [
  { name: "Palantir",     icon: siPalantir },
  { name: "Rolls-Royce",  icon: siRollsroyce },
  { name: "BT Group",     icon: siBt },
  { name: "HSBC Tech",    icon: siHsbc },
  { name: "Databricks",   icon: siDatabricks },
  { name: "GitHub",       icon: siGithub },
  { name: "Sage",         icon: siSage },
  { name: "Sky Tech",     icon: siSky },
  { name: "Siemens",      icon: siSiemens },
  { name: "Snowflake",    icon: siSnowflake },
  { name: "Kubernetes",   icon: siKubernetes },
  { name: "Datadog",      icon: siDatadog },
];

function BrandPill({ name, icon }: Brand) {
  return (
    <div
      className="group mx-4 flex items-center gap-2 select-none shrink-0 grayscale opacity-50
                 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
    >
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4 shrink-0"
        style={{ fill: `#${icon.hex}` }}
        aria-label={icon.title}
      >
        <path d={icon.path} />
      </svg>
      <span className="text-[12px] text-t2 font-semibold whitespace-nowrap group-hover:text-t1 transition-colors">{name}</span>
    </div>
  );
}

export function LogoMarquee() {
  return (
    <section className="py-10 overflow-hidden border-y border-b1 bg-s2 relative">
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-s2 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-s2 to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-5">
        <p className="text-[11px] font-semibold text-t3 uppercase tracking-widest text-center">
          Tracking roles at top UK AI employers
        </p>
      </div>

      <div className="space-y-3">
        <Marquee speed={35} gradient={false} pauseOnHover>
          {ROW1.map((b) => <BrandPill key={b.name} {...b} />)}
        </Marquee>
        <Marquee speed={28} gradient={false} direction="right" pauseOnHover>
          {ROW2.map((b) => <BrandPill key={b.name} {...b} />)}
        </Marquee>
      </div>
    </section>
  );
}
