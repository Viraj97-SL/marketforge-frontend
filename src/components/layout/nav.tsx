"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import {
  Menu, X,
  LayoutDashboard, BarChart2, Layers, Banknote,
  Briefcase, Sparkles, FlaskConical,
} from "lucide-react";

const links = [
  { href: "/",         label: "Overview",  Icon: LayoutDashboard },
  { href: "/market",   label: "Market",    Icon: BarChart2 },
  { href: "/skills",   label: "Skills",    Icon: Layers },
  { href: "/salary",   label: "Salary",    Icon: Banknote },
  { href: "/jobs",     label: "Job Board", Icon: Briefcase },
  { href: "/career",   label: "Career AI", Icon: Sparkles },
  { href: "/research", label: "Research",  Icon: FlaskConical },
];

export function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/98 backdrop-blur-sm border-b border-b1 shadow-sm"
          : "bg-white border-b border-b1"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center shadow-sm">
            <span className="text-white font-black text-xs tracking-tight">M</span>
          </div>
          <span className="font-bold text-sm text-t1 tracking-tight">
            MarketForge<span className="text-accent">.</span><span className="text-t3">ai</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {links.map((l) => {
            const active = l.href === "/" ? path === "/" : path.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150",
                  active
                    ? "text-accent bg-accent/8 font-semibold"
                    : "text-t2 hover:text-t1 hover:bg-s2"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-ok/25 bg-ok/5">
            <span className="w-1.5 h-1.5 rounded-full bg-ok animate-pulse" />
            <span className="text-[10px] font-semibold text-ok">Live</span>
          </div>
          <Link
            href="/career"
            className="px-4 py-1.5 rounded-lg bg-accent text-white text-xs font-semibold
                       hover:bg-indigo-700 transition-colors duration-150 shadow-sm"
          >
            Analyse Profile
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-md text-t2 hover:text-t1 hover:bg-s2 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-b1 bg-white px-4 py-4 flex flex-col gap-1 animate-fade-up shadow-card-md">
          {links.map((l) => {
            const active = l.href === "/" ? path === "/" : path.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  active ? "text-accent bg-accent/8 font-semibold" : "text-t2 hover:text-t1 hover:bg-s2"
                )}
              >
                <l.Icon className={cn("w-4 h-4 shrink-0", active ? "text-accent" : "text-t3")} />
                {l.label}
              </Link>
            );
          })}
          <div className="mt-3 pt-3 border-t border-b1">
            <Link
              href="/career"
              onClick={() => setOpen(false)}
              className="block w-full text-center px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold"
            >
              Analyse My Profile
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
