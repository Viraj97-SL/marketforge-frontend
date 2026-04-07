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
        bg: "#060A10",
        s1: "#0B0F18",
        s2: "#0F1520",
        s3: "#141C28",
        b1: "#1C2A3A",
        b2: "#243347",
        t1: "#E2E8F2",
        t2: "#64748B",
        t3: "#334155",
        accent: "#00C6A7",
        blue: "#3B82F6",
        ok: "#10B981",
        warn: "#F59E0B",
        err: "#EF4444",
        prp: "#8B5CF6",
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
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "counter": "counter 2s ease-out forwards",
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(0,198,167,0.1)" },
          "100%": { boxShadow: "0 0 40px rgba(0,198,167,0.25)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
