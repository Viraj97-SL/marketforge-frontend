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
        // Duotone body palette
        bg:     "#F7F7FC",   // page background
        s1:     "#FFFFFF",   // white — card surfaces
        s2:     "#F0F0F8",   // secondary surface
        s3:     "#E9E9F4",   // hover surface
        b1:     "#E4E4F0",   // primary border
        b2:     "#CFCFE2",   // secondary border
        t1:     "#16162B",   // primary text
        t2:     "#4B5167",   // secondary text
        t3:     "#8E93AB",   // muted text
        // Brand accent — Indigo
        accent: "#4F46E5",   // indigo-600
        blue:   "#2563EB",   // blue-600
        ok:     "#059669",   // emerald-600
        warn:   "#D97706",   // amber-600
        err:    "#DC2626",   // red-600
        prp:    "#7C3AED",   // violet-600
        // Dark hero token (page hero sections)
        hero:   "#141329",
        // Duotone image treatment
        duoDark:  "#2A2472",   // image shadows
        duoLight: "#F5EFDC",   // image highlights, warm cream
        paper:    "#F7F7FC",   // alias of bg, for the band mask
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
        newsreader: ["var(--font-newsreader)", "Georgia", "serif"],
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
