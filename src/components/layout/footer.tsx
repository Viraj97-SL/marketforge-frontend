import Link from "next/link";
import { Zap, Github, Linkedin, ExternalLink } from "lucide-react";

const PLATFORM_LINKS = [
  { href: "/market",   label: "Market Overview" },
  { href: "/skills",   label: "Skill Intelligence" },
  { href: "/salary",   label: "Salary Benchmarks" },
  { href: "/jobs",     label: "Job Board" },
  { href: "/research", label: "Research Signals" },
];

const DEV_LINKS = [
  { href: "/career",   label: "Career Advisor", external: false },
  { href: "https://marketforge-backend.railway.app/docs", label: "API Docs", external: true },
  { href: "https://marketforge-backend.railway.app/api/v1/health", label: "System Health", external: true },
];

export function Footer() {
  return (
    <footer className="border-t border-b1 bg-s1 mt-24 relative overflow-hidden">
      {/* Subtle glow at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent to-blue flex items-center justify-center shadow-[0_0_14px_rgba(0,198,167,0.4)]">
                <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-black text-base text-t1">
                MarketForge<span className="text-accent">.</span><span className="text-t2">ai</span>
              </span>
            </div>
            <p className="text-t2 text-sm leading-relaxed max-w-sm mb-5">
              Autonomous AI agents tracking UK AI/ML job market trends in real-time.
              9 departments, live data, zero manual curation.
            </p>

            {/* Live status */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-ok/20 bg-ok/5 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-ok animate-pulse" />
              <span className="text-[11px] font-semibold text-ok">Pipeline active · Updated twice weekly</span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="https://github.com/Viraj97-SL"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-b1 text-t2 hover:text-accent hover:border-accent/30 hover:bg-accent/5 transition-all"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-b1 text-t2 hover:text-blue hover:border-blue/30 hover:bg-blue/5 transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-[11px] font-bold text-t3 uppercase tracking-widest mb-4">Platform</h4>
            <ul className="space-y-2.5">
              {PLATFORM_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-t2 hover:text-accent transition-colors flex items-center gap-1 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-b2 group-hover:bg-accent transition-colors" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Developers */}
          <div>
            <h4 className="text-[11px] font-bold text-t3 uppercase tracking-widest mb-4">Developers</h4>
            <ul className="space-y-2.5">
              {DEV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target={l.external ? "_blank" : undefined}
                    rel={l.external ? "noopener noreferrer" : undefined}
                    className="text-sm text-t2 hover:text-accent transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-b2 group-hover:bg-accent transition-colors" />
                    {l.label}
                    {l.external && <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-b1 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-t2">
            © 2026 MarketForge AI · Built by{" "}
            <span className="text-accent font-semibold">Viraj Bulugahapitiya</span>
          </p>
          <div className="flex items-center gap-4 text-xs text-t3">
            <span>Data updated twice weekly</span>
            <span className="w-1 h-1 rounded-full bg-t3" />
            <span>UK AI/ML market</span>
            <span className="w-1 h-1 rounded-full bg-t3" />
            <span>All salaries GBP</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
