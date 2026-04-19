import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Career Gap Analyser",
  description:
    "Upload your CV and discover your skill gaps vs live UK AI/ML job requirements. Get a personalised career roadmap powered by AI agents.",
  alternates: { canonical: "https://marketforge.digital/career" },
  openGraph: {
    title: "AI Career Gap Analyser | MarketForge AI",
    description:
      "Paste your CV and instantly see how your skills compare to UK AI/ML job market demand. Personalised gap analysis and upskilling recommendations.",
    url: "https://marketforge.digital/career",
  },
};

export default function CareerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
