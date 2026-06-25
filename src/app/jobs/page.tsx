import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live UK AI & ML Job Board",
  description:
    "Browse live UK AI, ML, and data science job listings — filter by role, location, salary, and visa sponsorship. Updated hourly.",
  alternates: { canonical: "https://marketforge.digital/jobs" },
  openGraph: {
    title: "Live UK AI & ML Job Board | MarketForge AI",
    description:
      "Hundreds of live UK AI/ML job listings. Filter by role, salary, location, and visa sponsorship. Find your next AI career move.",
    url: "https://marketforge.digital/jobs",
  },
};

import Link from "next/link";
import {
  ExternalLink, MapPin, DollarSign, Clock, AlertCircle,
  ChevronLeft, ChevronRight, Briefcase, Globe, Building2,
  TrendingUp, BadgeCheck, Zap,
} from "lucide-react";
import { fmtK } from "@/lib/utils";
import { JobFilters } from "./JobFilters";

export const revalidate = 60;

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface Job {
  job_id: string;
  title: string;
  company: string;
  location: string | null;
  salary_min: number | null;
  salary_max: number | null;
  work_model: string | null;
  experience_level: string | null;
  role_category: string | null;
  source: string;
  offers_sponsorship: boolean | null;
  posted_date: string | null;
  scraped_at: string | null;
  url: string | null;
  is_startup: boolean;
  company_stage: string | null;
  skills: string[];
}

interface JobsResponse {
  jobs: Job[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

async function getJobs(
  role?: string,
  work_model?: string,
  visa_only = false,
  page = 1,
): Promise<JobsResponse | null> {
  try {
    const params = new URLSearchParams({ page: String(page), page_size: "30" });
    if (role && role !== "all") params.set("role_category", role);
    if (work_model)             params.set("work_model", work_model);
    if (visa_only)              params.set("visa_only", "true");

    const res = await fetch(`${API_BASE}/api/v1/jobs?${params}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

const WORK_MODEL_STYLES: Record<string, { label: string; className: string }> = {
  remote: { label: "Remote",  className: "bg-ok/10 text-ok border-ok/20" },
  hybrid: { label: "Hybrid",  className: "bg-blue/10 text-blue border-blue/20" },
  onsite: { label: "On-site", className: "bg-warn/10 text-warn border-warn/20" },
};

const SOURCE_COLORS: Record<string, string> = {
  adzuna:     "#00C6A7",
  reed:       "#3B82F6",
  specialist: "#8B5CF6",
  linkedin:   "#0A66C2",
  test:       "#64748B",
};

function srcColor(source: string) {
  return SOURCE_COLORS[source.toLowerCase()] ?? "#64748B";
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const diffMs = Date.now() - d.getTime();
  const diffH  = Math.floor(diffMs / 3_600_000);
  if (diffH < 1)  return "Just now";
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return "Yesterday";
  return `${diffD}d ago`;
}

function buildHref(params: { role: string; work_model: string; visa_only: boolean; page: number }) {
  const sp = new URLSearchParams();
  if (params.role !== "all")  sp.set("role", params.role);
  if (params.work_model)      sp.set("work_model", params.work_model);
  if (params.visa_only)       sp.set("visa_only", "true");
  sp.set("page", String(params.page));
  return `/jobs?${sp.toString()}`;
}

function Pagination({
  page, pages, role, workModel, visaOnly,
}: {
  page: number; pages: number; role: string; workModel: string; visaOnly: boolean;
}) {
  if (pages <= 1) return null;

  const href = (p: number) => buildHref({ role, work_model: workModel, visa_only: visaOnly, page: p });

  // Show up to 5 page numbers around current page
  const start = Math.max(1, page - 2);
  const end   = Math.min(pages, page + 2);
  const nums  = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <nav className="flex items-center justify-center gap-1 mt-10 animate-fade-up" aria-label="Pagination">
      {page > 1 ? (
        <Link
          href={href(page - 1)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border border-b1 text-t2 hover:border-b2 hover:text-t1 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Prev
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border border-b1 text-t3 cursor-not-allowed opacity-40">
          <ChevronLeft className="w-3.5 h-3.5" /> Prev
        </span>
      )}

      {start > 1 && (
        <>
          <Link href={href(1)} className="w-8 h-8 flex items-center justify-center rounded-full text-xs font-medium border border-b1 text-t2 hover:border-b2 hover:text-t1 transition-colors">1</Link>
          {start > 2 && <span className="text-t3 text-xs px-1">…</span>}
        </>
      )}

      {nums.map((n) => (
        <Link
          key={n}
          href={href(n)}
          className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-medium border transition-colors ${
            n === page
              ? "bg-accent/10 text-accent border-accent/30"
              : "border-b1 text-t2 hover:border-b2 hover:text-t1"
          }`}
        >
          {n}
        </Link>
      ))}

      {end < pages && (
        <>
          {end < pages - 1 && <span className="text-t3 text-xs px-1">…</span>}
          <Link href={href(pages)} className="w-8 h-8 flex items-center justify-center rounded-full text-xs font-medium border border-b1 text-t2 hover:border-b2 hover:text-t1 transition-colors">{pages}</Link>
        </>
      )}

      {page < pages ? (
        <Link
          href={href(page + 1)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border border-b1 text-t2 hover:border-b2 hover:text-t1 transition-colors"
        >
          Next <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border border-b1 text-t3 cursor-not-allowed opacity-40">
          Next <ChevronRight className="w-3.5 h-3.5" />
        </span>
      )}
    </nav>
  );
}

interface PageProps {
  searchParams: { role?: string; work_model?: string; visa_only?: string; page?: string };
}

export default async function JobsPage({ searchParams }: PageProps) {
  const role      = searchParams.role       ?? "all";
  const workModel = searchParams.work_model ?? "";
  const visaOnly  = searchParams.visa_only  === "true";
  const page      = Math.max(1, Number(searchParams.page ?? "1"));

  const data   = await getJobs(role, workModel, visaOnly, page);
  const jobs   = data?.jobs  ?? [];
  const total  = data?.total ?? 0;
  const pages  = data?.pages ?? 1;
  const hasJobs = jobs.length > 0;

  /* Quick derived stats */
  const remoteCount  = jobs.filter(j => j.work_model === "remote").length;
  const visaCount    = jobs.filter(j => j.offers_sponsorship).length;
  const withSalary   = jobs.filter(j => j.salary_min || j.salary_max).length;

  return (
    <div className="pt-14">
      {/* Dark hero banner */}
      <div className="relative"
        style={{ background: "linear-gradient(135deg,#0F172A 0%,#1E1B4B 60%,#0F172A 100%)" }}>
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="flex items-start justify-between gap-8 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/10 text-xs font-semibold text-accent mb-4">
                <span className="w-2 h-2 rounded-full bg-ok animate-pulse" />
                Live · Updated twice weekly
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-3">
                UK AI / ML Job Board
              </h1>
              <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
                Deduplicated listings from Adzuna, Reed, and specialist boards.
                Salaries normalised. Visa sponsorship NLP-verified.
              </p>
            </div>
            {/* Live stats chips */}
            <div className="flex flex-wrap gap-3 self-end pb-1">
              {[
                { Icon: Briefcase,  label: "Roles indexed",     value: hasJobs ? total.toLocaleString() : "—",          accent: "text-indigo-300", bg: "bg-indigo-500/15", border: "border-indigo-500/25" },
                { Icon: Globe,      label: "Remote this page",  value: hasJobs ? `${remoteCount} / ${jobs.length}` : "—", accent: "text-emerald-300", bg: "bg-emerald-500/15", border: "border-emerald-500/25" },
                { Icon: BadgeCheck, label: "Visa sponsor",      value: hasJobs ? `${visaCount} listed` : "—",             accent: "text-violet-300",  bg: "bg-violet-500/15", border: "border-violet-500/25" },
                { Icon: DollarSign, label: "With salary",       value: hasJobs ? `${withSalary} / ${jobs.length}` : "—",  accent: "text-blue-300",   bg: "bg-blue-500/15", border: "border-blue-500/25" },
              ].map(({ Icon, label, value, accent, bg, border }) => (
                <div key={label} className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border ${border} ${bg}`}>
                  <Icon className={`w-4 h-4 ${accent}`} strokeWidth={1.8} />
                  <div>
                    <p className={`text-sm font-black ${accent} leading-none`}>{value}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="h-6 bg-gradient-to-b from-transparent to-bg" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Filter bar — client component */}
        <JobFilters activeRole={role} workModel={workModel} visaOnly={visaOnly} />

      {/* No jobs state */}
      {!hasJobs && (
        <div className="flex flex-col items-center justify-center py-28 text-center animate-fade-up">
          {/* SVG illustration */}
          <svg width="120" height="100" viewBox="0 0 120 100" className="mb-6 opacity-30">
            <rect x="10" y="20" width="100" height="70" rx="10" fill="#C7D2FE" />
            <rect x="20" y="32" width="40" height="6"  rx="3" fill="#818CF8" />
            <rect x="20" y="44" width="60" height="4"  rx="2" fill="#A5B4FC" />
            <rect x="20" y="54" width="50" height="4"  rx="2" fill="#A5B4FC" />
            <circle cx="88" cy="50" r="16" fill="#E0E7FF" stroke="#818CF8" strokeWidth="1.5" />
            <path d="M82 50 L88 44 L94 50" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <line x1="88" y1="44" x2="88" y2="57" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <h2 className="text-lg font-bold text-t1 mb-2">No jobs found</h2>
          <p className="text-t2 text-sm max-w-sm mb-6">
            Try adjusting your filters, or the ingestion pipeline hasn&apos;t run yet.
          </p>
          <div className="flex items-center gap-2 text-xs text-t3 px-4 py-2 rounded-full bg-s2 border border-b1">
            <Zap className="w-3.5 h-3.5 text-accent" />
            Pipeline runs twice weekly — check back soon
          </div>
        </div>
      )}

      {/* Job grid */}
      {hasJobs && (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job, i) => {
              const wm  = WORK_MODEL_STYLES[job.work_model ?? ""];
              const sc  = srcColor(job.source);
              const ini = (job.company?.[0] ?? "?").toUpperCase();

              return (
                <div
                  key={job.job_id}
                  className="group relative rounded-2xl border border-b1 bg-s1
                             flex flex-col animate-fade-up card-hover shadow-card
                             overflow-hidden transition-all duration-200"
                  style={{ animationDelay: `${i * 35}ms` }}
                >
                  {/* Coloured header strip */}
                  <div
                    className="flex items-center justify-between px-4 py-3"
                    style={{ background: `linear-gradient(135deg, ${sc}14, ${sc}22)`, borderBottom: `1px solid ${sc}22` }}
                  >
                    {/* Company avatar */}
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center font-black text-sm font-mono border shadow-sm"
                        style={{ background: `linear-gradient(135deg,${sc}28,${sc}42)`, borderColor: `${sc}40`, color: sc }}
                      >
                        {ini}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-t1 truncate max-w-[130px]">{job.company}</p>
                        {job.location && (
                          <p className="flex items-center gap-0.5 text-[10px] text-t3">
                            <MapPin className="w-2.5 h-2.5" />{job.location}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Source badge */}
                    <span
                      className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md shrink-0"
                      style={{ background: `${sc}20`, color: sc, border: `1px solid ${sc}30` }}
                    >
                      {job.source}
                    </span>
                  </div>

                  {/* Card body */}
                  <div className="p-4 flex flex-col flex-1">
                    {/* Title */}
                    <h3 className="text-sm font-bold text-t1 leading-snug mb-3
                                   group-hover:text-accent transition-colors line-clamp-2">
                      {job.title}
                    </h3>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {job.offers_sponsorship && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-prp/10 text-prp border border-prp/20">
                          <BadgeCheck className="w-3 h-3" />VISA
                        </span>
                      )}
                      {job.is_startup && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-warn/10 text-warn border border-warn/20">
                          <Zap className="w-3 h-3" />STARTUP
                        </span>
                      )}
                      {wm && (
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${wm.className}`}>
                          {wm.label}
                        </span>
                      )}
                    </div>

                    {/* Salary */}
                    {(job.salary_min || job.salary_max) && (
                      <div className="flex items-center gap-1.5 mb-3 px-3 py-1.5 rounded-lg bg-ok/8 border border-ok/15 w-fit">
                        <DollarSign className="w-3.5 h-3.5 text-ok flex-shrink-0" />
                        <span className="text-sm font-black text-ok">
                          {job.salary_min && job.salary_max
                            ? `${fmtK(job.salary_min)} – ${fmtK(job.salary_max)}`
                            : fmtK(job.salary_min ?? job.salary_max ?? 0)}
                        </span>
                      </div>
                    )}

                    {/* Skills */}
                    {job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 flex-1 mb-3">
                        {job.skills.slice(0, 5).map((s) => (
                          <span key={s}
                                className="text-[9px] px-2 py-0.5 rounded-md bg-accent/6 border border-accent/15
                                           text-accent font-semibold group-hover:bg-accent/10 transition-colors">
                            {s}
                          </span>
                        ))}
                        {job.skills.length > 5 && (
                          <span className="text-[9px] px-2 py-0.5 rounded-md bg-s2 border border-b1 text-t3">
                            +{job.skills.length - 5}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-b1 mt-auto">
                      <div className="flex items-center gap-1 text-[10px] text-t3">
                        <Clock className="w-3 h-3" />
                        <span>{timeAgo(job.scraped_at)}</span>
                      </div>
                      {job.url && job.url !== "#" ? (
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[11px] font-bold
                                     px-3 py-1.5 rounded-lg bg-accent/8 text-accent border border-accent/20
                                     hover:bg-accent hover:text-white transition-all duration-150"
                        >
                          Apply <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-t3">No link</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <Pagination
            page={page}
            pages={pages}
            role={role}
            workModel={workModel}
            visaOnly={visaOnly}
          />
        </>
      )}
      </div>
    </div>
  );
}
