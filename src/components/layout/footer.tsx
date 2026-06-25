import Link from "next/link";
import { Github, Linkedin, ExternalLink } from "lucide-react";

const PLATFORM_LINKS = [
  { href: "/market",   label: "Market Overview"   },
  { href: "/skills",   label: "Skill Demand"       },
  { href: "/salary",   label: "Salary Benchmarks"  },
  { href: "/jobs",     label: "Job Board"          },
  { href: "/research", label: "Research Signals"   },
];

const DEV_LINKS = [
  { href: "/career", label: "Career Advisor", external: false },
  { href: "https://marketforge-backend.railway.app/docs", label: "API Docs", external: true },
  { href: "https://marketforge-backend.railway.app/api/v1/health", label: "System Health", external: true },
];

export function Footer() {
  return (
    <footer className="border-t border-b1 bg-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-sm">
                <span className="text-white font-black text-sm">M</span>
              </div>
              <span className="font-bold text-base text-t1">
                MarketForge<span className="text-accent">.</span><span className="text-t3">ai</span>
              </span>
            </div>
            <p className="text-t2 text-sm leading-relaxed max-w-sm mb-4">
              Autonomous AI agents tracking UK AI/ML job market trends in real-time.
              9 departments, live data, zero manual curation.
            </p>
            <p className="text-xs text-t3 mb-5">
              Data updated twice weekly · UK AI/ML market · All salaries in GBP
            </p>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/Viraj97-SL"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-b1 text-t2 hover:text-accent hover:border-accent/40 transition-all"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-b1 text-t2 hover:text-blue hover:border-blue/40 transition-all"
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
                  <Link href={l.href} className="text-sm text-t2 hover:text-accent transition-colors">
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
                    className="text-sm text-t2 hover:text-accent transition-colors flex items-center gap-1.5"
                  >
                    {l.label}
                    {l.external && <ExternalLink className="w-3 h-3 opacity-50" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-b1 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-t3">
            © 2026{" "}
            <span className="text-accent font-medium">MarketForge.digital</span>
          </p>
          <div className="flex items-center gap-3 text-xs text-t3">
            <span>UK AI/ML market intelligence</span>
            <span>·</span>
            <span>Powered by autonomous agents</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
