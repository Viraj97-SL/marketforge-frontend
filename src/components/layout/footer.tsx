import Link from "next/link";
import { Zap, Github, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-b1 bg-s1 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-blue flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-sm text-t1">MarketForge AI</span>
            </div>
            <p className="text-t2 text-sm leading-relaxed max-w-sm">
              Autonomous AI agents tracking UK AI/ML job market trends in real-time.
              9 departments, live data, zero manual curation.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg border border-b1 text-t2 hover:text-accent hover:border-accent/30 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg border border-b1 text-t2 hover:text-accent hover:border-accent/30 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-semibold text-t2 uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2">
              {[
                { href: "/market", label: "Market Overview" },
                { href: "/skills", label: "Skill Intelligence" },
                { href: "/salary", label: "Salary Benchmarks" },
                { href: "/jobs", label: "Job Board" },
                { href: "/research", label: "Research Signals" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-t2 hover:text-accent transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* API */}
          <div>
            <h4 className="text-xs font-semibold text-t2 uppercase tracking-wider mb-3">Developers</h4>
            <ul className="space-y-2">
              {[
                { href: "/career", label: "Career Advisor" },
                { href: "https://marketforge-backend.railway.app/docs", label: "API Docs" },
                { href: "https://marketforge-backend.railway.app/api/v1/health", label: "System Health" },
              ].map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-t2 hover:text-accent transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-b1 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-t2">
            © 2026 MarketForge AI · Built by{" "}
            <span className="text-accent font-medium">Viraj Bulugahapitiya</span>
          </p>
          <p className="text-xs text-t3">
            Data updated twice weekly · UK AI/ML market · All salaries GBP
          </p>
        </div>
      </div>
    </footer>
  );
}
