import Link from "next/link";
import { ExternalLink, MapPin, Building2, DollarSign, Clock, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
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

  return (
    <div className="pt-14 max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-2">Live Job Board</p>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-t1 mb-3">
          UK AI / ML Jobs
        </h1>
        <p className="text-t2 max-w-xl">
          Deduplicated and enriched job listings from Adzuna, Reed, and specialist boards.
          Salaries extracted and normalised. Visa sponsorship verified from job description NLP.
        </p>
        {hasJobs && (
          <p className="text-xs text-t3 mt-2">
            {total.toLocaleString()} jobs indexed
            {pages > 1 && ` · page ${page} of ${pages}`}
          </p>
        )}
      </div>

      {/* Filter bar — client component */}
      <JobFilters activeRole={role} workModel={workModel} visaOnly={visaOnly} />

      {/* No jobs state */}
      {!hasJobs && (
        <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-up">
          <AlertCircle className="w-12 h-12 text-t3 mb-4" />
          <h2 className="text-lg font-bold text-t1 mb-2">No jobs found</h2>
          <p className="text-t2 text-sm max-w-sm">
            Try adjusting your filters, or the ingestion pipeline hasn&apos;t run yet.
          </p>
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
                  className="group relative rounded-2xl border border-b1 bg-gradient-to-br from-s1 to-s2
                             p-5 flex flex-col animate-fade-up
                             hover:-translate-y-1 hover:border-accent/30
                             hover:shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(0,198,167,0.12)]
                             transition-all duration-200"
                  style={{ animationDelay: `${i * 35}ms` }}
                >
                  {/* Source + badges row */}
                  <div className="flex items-center justify-between mb-3.5">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                      style={{ background: `${sc}18`, color: sc, border: `1px solid ${sc}28` }}
                    >
                      {job.source}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {job.offers_sponsorship && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-prp/10 text-prp border border-prp/25">
                          VISA ✓
                        </span>
                      )}
                      {job.is_startup && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-warn/10 text-warn border border-warn/25">
                          STARTUP
                        </span>
                      )}
                      {wm && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${wm.className}`}>
                          {wm.label}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Company avatar + title */}
                  <div className="flex gap-3 mb-3">
                    <div
                      className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center
                                 font-black text-sm font-mono border"
                      style={{
                        background:  `linear-gradient(135deg, ${sc}20, ${sc}35)`,
                        borderColor: `${sc}35`,
                        color:       sc,
                      }}
                    >
                      {ini}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-t1 leading-snug mb-0.5
                                     group-hover:text-accent transition-colors line-clamp-2">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-2 text-[11px] text-t2">
                        <span className="font-semibold truncate">{job.company}</span>
                        {job.location && (
                          <>
                            <span className="text-t3">·</span>
                            <span className="flex items-center gap-0.5">
                              <MapPin className="w-2.5 h-2.5" />
                              {job.location}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Salary */}
                  {(job.salary_min || job.salary_max) && (
                    <div className="flex items-center gap-1.5 mb-3">
                      <DollarSign className="w-3.5 h-3.5 text-ok flex-shrink-0" />
                      <span className="text-sm font-bold text-ok">
                        {job.salary_min && job.salary_max
                          ? `${fmtK(job.salary_min)} – ${fmtK(job.salary_max)}`
                          : fmtK(job.salary_min ?? job.salary_max ?? 0)}
                      </span>
                    </div>
                  )}

                  {/* Skills */}
                  {job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4 flex-1">
                      {job.skills.slice(0, 5).map((s) => (
                        <span key={s}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-s3 border border-b1
                                         text-t2 font-medium transition-colors
                                         group-hover:border-b2">
                          {s}
                        </span>
                      ))}
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
                        className="flex items-center gap-1 text-[11px] font-semibold
                                   text-accent hover:text-blue transition-colors
                                   hover:underline underline-offset-2"
                      >
                        Apply <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[11px] text-t3">No link</span>
                    )}
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
  );
}
