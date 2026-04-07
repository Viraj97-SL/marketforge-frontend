import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "MarketForge AI — UK AI Job Market Intelligence",
  description:
    "Real-time intelligence on UK AI/ML hiring trends, salary benchmarks, skill demand, and visa sponsorship rates. Powered by autonomous AI agents.",
  keywords: ["AI jobs UK", "ML salary benchmark", "data science hiring", "visa sponsorship UK tech"],
  openGraph: {
    title: "MarketForge AI",
    description: "UK AI Job Market Intelligence Platform",
    type: "website",
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
      </body>
    </html>
  );
}
