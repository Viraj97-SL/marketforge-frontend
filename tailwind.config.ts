import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:     "#060A10",
        s1:     "#0B0F18",
        s2:     "#0F1520",
        s3:     "#141C28",
        b1:     "#1C2A3A",
        b2:     "#243347",
        t1:     "#E2E8F2",
        t2:     "#64748B",
        t3:     "#334155",
        accent: "#00C6A7",
        blue:   "#3B82F6",
        ok:     "#10B981",
        warn:   "#F59E0B",
        err:    "#EF4444",
        prp:    "#8B5CF6",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(ellipse 80% 50% at -5% -10%, rgba(0,198,167,0.08) 0%, transparent 55%), radial-gradient(ellipse 60% 40% at 105% 5%, rgba(59,130,246,0.06) 0%, transparent 50%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(11,15,24,0.9) 0%, rgba(15,21,32,0.7) 100%)",
        "mesh-gradient":
          "radial-gradient(ellipse 90% 55% at -8% -15%, rgba(0,198,167,.08) 0%, transparent 60%), radial-gradient(ellipse 70% 45% at 108% 4%, rgba(59,130,246,.07) 0%, transparent 55%), radial-gradient(ellipse 50% 35% at 50% 105%, rgba(139,92,246,.05) 0%, transparent 55%)",
      },
      animation: {
        "fade-up":      "fadeUp 0.6s cubic-bezier(.16,1,.3,1) both",
        "fade-in":      "fadeIn 0.4s ease-out both",
        "fade-left":    "fadeLeft 0.5s cubic-bezier(.16,1,.3,1) both",
        "fade-right":   "fadeRight 0.5s cubic-bezier(.16,1,.3,1) both",
        "scale-in":     "scaleIn 0.4s cubic-bezier(.16,1,.3,1) both",
        "slide-up":     "slideUp 0.7s cubic-bezier(.16,1,.3,1) both",
        "float":        "float 7s ease-in-out infinite",
        "float-alt":    "floatAlt 9s ease-in-out infinite",
        "float-slow":   "floatSlow 5s ease-in-out infinite",
        "orbit-cw":     "orbitCW 20s linear infinite",
        "orbit-ccw":    "orbitCCW 28s linear infinite",
        "pulse-glow":   "pulseGlow 2.2s ease-in-out infinite",
        "glow-pulse":   "glowPulse 2.5s ease-in-out infinite",
        "border-flow":  "borderFlow 3s ease-in-out infinite",
        "grad-shift":   "gradientShift 6s ease infinite",
        "shimmer":      "shimmer 1.5s infinite",
        "count":        "countUp 0.5s cubic-bezier(.16,1,.3,1) both",
        "counter":      "counter 2s ease-out forwards",
        "pulse-slow":   "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        "glow":         "glow 2s ease-in-out infinite alternate",
        "spin-slow":    "spin 20s linear infinite",
        "spin-reverse": "spinReverse 28s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeLeft: {
          "0%":   { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        fadeRight: {
          "0%":   { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%":   { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%":      { transform: "translateY(-14px) rotate(0.8deg)" },
          "66%":      { transform: "translateY(-6px) rotate(-0.8deg)" },
        },
        floatAlt: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "40%":      { transform: "translateY(-18px) rotate(-1.5deg)" },
          "70%":      { transform: "translateY(-5px) rotate(1deg)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-10px)" },
        },
        orbitCW: {
          "0%":   { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        orbitCCW: {
          "0%":   { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(-360deg)" },
        },
        spinReverse: {
          "0%":   { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(-360deg)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.6" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0,198,167,.12)" },
          "50%":      { boxShadow: "0 0 40px rgba(0,198,167,.30)" },
        },
        borderFlow: {
          "0%, 100%": { borderColor: "rgba(0,198,167,.18)" },
          "50%":      { borderColor: "rgba(0,198,167,.48)" },
        },
        gradientShift: {
          "0%":   { backgroundPosition: "0% 50%" },
          "50%":  { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        countUp: {
          "0%":   { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        counter: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        glow: {
          "0%":   { boxShadow: "0 0 20px rgba(0,198,167,0.1)" },
          "100%": { boxShadow: "0 0 40px rgba(0,198,167,0.25)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
