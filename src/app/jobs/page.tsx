import Link from "next/link";
import { ExternalLink, MapPin, Building2, DollarSign, Clock, AlertCircle } from "lucide-react";
import { fmtK } from "@/lib/utils";

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
    if (work_model) params.set("work_model", work_model);
    if (visa_only) params.set("visa_only", "true");

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
  adzuna:          "#00C6A7",
  reed:            "#3B82F6",
  specialist:      "#8B5CF6",
  linkedin:        "#0A66C2",
  test:            "#64748B",
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
  return `${diffD} days ago`;
}

export default async function JobsPage() {
  const data = await getJobs();
  const jobs = data?.jobs ?? [];
  const total = data?.total ?? 0;
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
          </p>
        )}
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 mb-8 animate-fade-up animate-delay-100">
        {["All Roles", "ML Engineer", "Data Scientist", "AI Researcher", "MLOps", "NLP", "CV Engineer"].map((f, i) => (
          <button
            key={f}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              i === 0
                ? "bg-accent/10 text-accent border-accent/30"
                : "bg-transparent text-t2 border-b1 hover:border-b2 hover:text-t1"
            }`}
          >
            {f}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-full text-xs font-medium border border-b1 text-t2 hover:border-b2 hover:text-t1 transition-colors">
            Visa Sponsor Only
          </button>
          <button className="px-3 py-1.5 rounded-full text-xs font-medium border border-b1 text-t2 hover:border-b2 hover:text-t1 transition-colors">
            Remote Only
          </button>
        </div>
      </div>

      {/* No jobs state */}
      {!hasJobs && (
        <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-up">
          <AlertCircle className="w-12 h-12 text-t3 mb-4" />
          <h2 className="text-lg font-bold text-t1 mb-2">No jobs indexed yet</h2>
          <p className="text-t2 text-sm max-w-sm">
            The ingestion pipeline hasn&apos;t run yet, or the API is unreachable.
            Jobs will appear here automatically after the next pipeline run.
          </p>
        </div>
      )}

      {/* Job grid */}
      {hasJobs && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job, i) => {
            const wm = WORK_MODEL_STYLES[job.work_model ?? ""] ?? WORK_MODEL_STYLES.hybrid;
            const sc = srcColor(job.source);

            return (
              <div
                key={job.job_id}
                className="group relative rounded-2xl border border-b1 bg-s1 p-5 hover:border-b2 transition-all duration-200 animate-fade-up flex flex-col"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {/* Source + work model */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                    style={{ background: `${sc}15`, color: sc, border: `1px solid ${sc}25` }}
                  >
                    {job.source}
                  </span>
                  <div className="flex items-center gap-2">
                    {job.offers_sponsorship && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-prp/10 text-prp border border-prp/20">
                        VISA
                      </span>
                    )}
                    {job.work_model && WORK_MODEL_STYLES[job.work_model] && (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${wm.className}`}>
                        {wm.label}
                      </span>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-t1 leading-tight mb-1 group-hover:text-accent transition-colors">
                  {job.title}
                </h3>

                {/* Company + location */}
                <div className="flex items-center gap-3 text-xs text-t2 mb-3">
                  <div className="flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    <span className="font-medium">{job.company}</span>
                  </div>
                  {job.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{job.location}</span>
                    </div>
                  )}
                </div>

                {/* Salary */}
                {(job.salary_min || job.salary_max) && (
                  <div className="flex items-center gap-1.5 mb-3">
                    <DollarSign className="w-3.5 h-3.5 text-ok" />
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
                      <span key={s} className="text-[10px] px-2 py-0.5 rounded-md bg-s3 border border-b1 text-t2 font-medium">
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
                      className="flex items-center gap-1 text-[11px] font-semibold text-accent hover:text-blue transition-colors"
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
      )}
    </div>
  );
}
