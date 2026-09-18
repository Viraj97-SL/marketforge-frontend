import type { Metadata } from "next";
import { Inter, JetBrains_Mono, IBM_Plex_Sans, Newsreader } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { Analytics } from "@vercel/analytics/next";

// Self-hosted via next/font (no Google Fonts runtime request, no CLS from a
// late-swapping @import). Newsreader is for the editorial band headings
// (Stage 3) — loaded now so it's cached before that lands.
const inter = Inter({ subsets: ["latin"], weight: ["300","400","500","600","700","800","900"], variable: "--font-inter", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400","500","600"], variable: "--font-jetbrains-mono", display: "swap" });
const ibmPlexSans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400","500","600","700"], variable: "--font-ibm-plex-sans", display: "swap" });
const newsreader = Newsreader({ subsets: ["latin"], weight: ["400","500"], style: ["normal","italic"], variable: "--font-newsreader", display: "swap" });

const BASE_URL = "https://marketforge.digital";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "MarketForge AI — UK AI Job Market Intelligence",
    template: "%s | MarketForge AI",
  },
  description:
    "Real-time intelligence on UK AI/ML hiring trends, salary benchmarks, skill demand, and visa sponsorship rates. Powered by 9 autonomous AI agents.",
  keywords: [
    "AI jobs UK", "ML salary benchmark", "data science hiring", "visa sponsorship UK tech",
    "artificial intelligence jobs", "machine learning careers UK", "AI job market 2026",
    "UK tech salary", "skill demand AI", "deep learning jobs", "AI recruitment UK",
    "machine learning salary UK", "data science jobs London", "NLP jobs UK",
  ],
  authors: [{ name: "MarketForge.digital", url: BASE_URL }],
  creator: "MarketForge.digital",
  publisher: "MarketForge.digital",
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "MarketForge AI — UK AI Job Market Intelligence",
    description:
      "9 autonomous AI agents tracking UK AI/ML hiring trends, salary benchmarks, skill demand, and visa sponsorship — live, 24/7.",
    url: BASE_URL,
    siteName: "MarketForge AI",
    type: "website",
    locale: "en_GB",
    images: [
      {
        url: "/images/hero-bg-base.webp",
        width: 1200,
        height: 630,
        alt: "MarketForge AI — UK AI Job Market Intelligence Dashboard",
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
    site: "@marketforge_ai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "MarketForge AI",
  url: BASE_URL,
  description:
    "Real-time UK AI/ML job market intelligence powered by 9 autonomous AI agents.",
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${BASE_URL}/jobs?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${jetbrainsMono.variable} ${ibmPlexSans.variable} ${newsreader.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-bg text-t1 font-sans antialiased">
        <Nav />
        <main className="relative">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
