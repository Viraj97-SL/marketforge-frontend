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
        // Light body palette
        bg:     "#F8FAFC",   // slate-50 — page background
        s1:     "#FFFFFF",   // white — card surfaces
        s2:     "#F1F5F9",   // slate-100 — secondary surface
        s3:     "#E8EEF5",   // slate-150 — hover surface
        b1:     "#E2E8F0",   // slate-200 — primary border
        b2:     "#CBD5E1",   // slate-300 — secondary border
        t1:     "#0F172A",   // slate-900 — primary text
        t2:     "#475569",   // slate-600 — secondary text
        t3:     "#94A3B8",   // slate-400 — muted text
        // Brand accent — Indigo
        accent: "#4F46E5",   // indigo-600
        blue:   "#2563EB",   // blue-600
        ok:     "#059669",   // emerald-600
        warn:   "#D97706",   // amber-600
        err:    "#DC2626",   // red-600
        prp:    "#7C3AED",   // violet-600
        // Dark hero token (page hero sections)
        hero:   "#0F172A",   // slate-900
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "hero-glow": "linear-gradient(135deg, rgba(79,70,229,0.02) 0%, transparent 50%)",
      },
      boxShadow: {
        card:      "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "card-md": "0 4px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)",
        "card-lg": "0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.04)",
      },
      animation: {
        "fade-up":    "fadeUp 0.6s cubic-bezier(.16,1,.3,1) both",
        "fade-in":    "fadeIn 0.4s ease-out both",
        "fade-left":  "fadeLeft 0.5s cubic-bezier(.16,1,.3,1) both",
        "fade-right": "fadeRight 0.5s cubic-bezier(.16,1,.3,1) both",
        "scale-in":   "scaleIn 0.4s cubic-bezier(.16,1,.3,1) both",
        "slide-up":   "slideUp 0.7s cubic-bezier(.16,1,.3,1) both",
        "float":      "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4,0,0.6,1) infinite",
        "shimmer":    "shimmer 1.5s infinite",
        "count":      "countUp 0.5s cubic-bezier(.16,1,.3,1) both",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeLeft: {
          "0%":   { opacity: "0", transform: "translateX(-16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        fadeRight: {
          "0%":   { opacity: "0", transform: "translateX(16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%":   { opacity: "0", transform: "scale(0.94)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(32px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        countUp: {
          "0%":   { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
