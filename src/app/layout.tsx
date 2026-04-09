import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "MarketForge AI — UK AI Job Market Intelligence",
  description:
    "Real-time intelligence on UK AI/ML hiring trends, salary benchmarks, skill demand, and visa sponsorship rates. Powered by 9 autonomous AI agents.",
  keywords: [
    "AI jobs UK", "ML salary benchmark", "data science hiring", "visa sponsorship UK tech",
    "artificial intelligence jobs", "machine learning careers UK", "AI job market 2026",
    "UK tech salary", "skill demand AI", "deep learning jobs",
  ],
  authors: [{ name: "MarketForge.digital" }],
  creator: "MarketForge.digital",
  publisher: "MarketForge.digital",
  metadataBase: new URL("https://marketforge.digital"),
  openGraph: {
    title: "MarketForge AI — UK AI Job Market Intelligence",
    description:
      "9 autonomous AI agents tracking UK AI/ML hiring trends, salary benchmarks, skill demand, and visa sponsorship — live, 24/7.",
    url: "https://marketforge.digital",
    siteName: "MarketForge AI",
    type: "website",
    locale: "en_GB",
    images: [
      {
        url: "/images/hero-bg-base.webp",
        width: 1200,
        height: 630,
        alt: "MarketForge AI — UK AI Job Market Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MarketForge AI — UK AI Job Market Intelligence",
    description:
      "Real-time UK AI/ML job market intelligence — hiring trends, salaries, visa sponsorship, and skill demand. Powered by autonomous AI agents.",
    images: ["/images/hero-bg-base.webp"],
    creator: "@marketforge_ai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-bg text-t1 font-sans antialiased">
        <div className="fixed inset-0 bg-hero-glow pointer-events-none" aria-hidden />
        <Nav />
        <main className="relative">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
