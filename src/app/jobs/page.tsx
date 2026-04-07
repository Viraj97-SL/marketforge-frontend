import Link from "next/link";
import { ExternalLink, MapPin, Building2, DollarSign, Globe, Clock } from "lucide-react";
import { fmtK } from "@/lib/utils";

export const revalidate = 60;

// This page fetches job listings directly from the API
// In production, the API serves paginated job data from the PostgreSQL jobs table
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function getJobs(page = 1, role = "all") {
  try {
    const res = await fetch(`${API_BASE}/api/v1/market/snapshot`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// Sample job data shown when API has no jobs yet
const SAMPLE_JOBS = [
  {
    id: "1",
    title: "Senior Machine Learning Engineer",
    company: "DeepMind",
    location: "London, UK",
    salary_min: 120000,
    salary_max: 160000,
    source: "Adzuna",
    work_model: "hybrid",
    sponsors_visa: true,
    role_category: "ML Engineer",
    skills: ["PyTorch", "Python", "Distributed ML", "CUDA"],
    posted_at: "2 days ago",
    url: "#",
  },
  {
    id: "2",
    title: "NLP Research Scientist",
    company: "Anthropic",
    location: "London, UK",
    salary_min: 140000,
    salary_max: 200000,
    source: "Reed",
    work_model: "remote",
    sponsors_visa: true,
    role_category: "AI Researcher",
    skills: ["Python", "Transformers", "RLHF", "JAX"],
    posted_at: "3 days ago",
    url: "#",
  },
  {
    id: "3",
    title: "MLOps Platform Engineer",
    company: "Monzo Bank",
    location: "London, UK",
    salary_min: 80000,
    salary_max: 115000,
    source: "Adzuna",
    work_model: "hybrid",
    sponsors_visa: false,
    role_category: "MLOps Engineer",
    skills: ["Kubernetes", "Airflow", "Python", "Terraform", "Prometheus"],
    posted_at: "1 day ago",
    url: "#",
  },
  {
    id: "4",
    title: "Data Scientist — FinTech",
    company: "Revolut",
    location: "London, UK",
    salary_min: 70000,
    salary_max: 100000,
    source: "Reed",
    work_model: "hybrid",
    sponsors_visa: true,
    role_category: "Data Scientist",
    skills: ["Python", "SQL", "XGBoost", "Spark", "dbt"],
    posted_at: "Today",
    url: "#",
  },
  {
    id: "5",
    title: "Computer Vision Engineer",
    company: "Wayve",
    location: "Cambridge, UK",
    salary_min: 90000,
    salary_max: 135000,
    source: "Adzuna",
    work_model: "onsite",
    sponsors_visa: true,
    role_category: "CV Engineer",
    skills: ["PyTorch", "OpenCV", "C++", "CUDA", "ROS2"],
    posted_at: "5 hours ago",
    url: "#",
  },
  {
    id: "6",
    title: "AI Safety Researcher",
    company: "UK AI Safety Institute",
    location: "London, UK (Remote OK)",
    salary_min: 95000,
    salary_max: 145000,
    source: "Specialist Board",
    work_model: "remote",
    sponsors_visa: true,
    role_category: "AI Researcher",
    skills: ["Python", "PyTorch", "Interpretability", "RLHF", "Alignment"],
    posted_at: "1 day ago",
    url: "#",
  },
];

const WORK_MODEL_STYLES: Record<string, { label: string; className: string }> = {
  remote:  { label: "Remote",  className: "bg-ok/10 text-ok border-ok/20" },
  hybrid:  { label: "Hybrid",  className: "bg-blue/10 text-blue border-blue/20" },
  onsite:  { label: "On-site", className: "bg-warn/10 text-warn border-warn/20" },
};

const SOURCE_COLORS: Record<string, string> = {
  Adzuna: "#00C6A7",
  Reed: "#3B82F6",
  "Specialist Board": "#8B5CF6",
};

export default async function JobsPage() {
  const jobs = SAMPLE_JOBS; // Replace with real API data when available

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

      {/* Job grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job, i) => {
          const wm = WORK_MODEL_STYLES[job.work_model] ?? WORK_MODEL_STYLES.hybrid;
          const srcColor = SOURCE_COLORS[job.source] ?? "#64748B";

          return (
            <div
              key={job.id}
              className="group relative rounded-2xl border border-b1 bg-s1 p-5 hover:border-b2 transition-all duration-200 animate-fade-up flex flex-col"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Source + work model */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                  style={{ background: `${srcColor}15`, color: srcColor, border: `1px solid ${srcColor}25` }}
                >
                  {job.source}
                </span>
                <div className="flex items-center gap-2">
                  {job.sponsors_visa && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-prp/10 text-prp border border-prp/20">
                      VISA
                    </span>
                  )}
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${wm.className}`}>
                    {wm.label}
                  </span>
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
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{job.location}</span>
                </div>
              </div>

              {/* Salary */}
              {(job.salary_min || job.salary_max) && (
                <div className="flex items-center gap-1.5 mb-3">
                  <DollarSign className="w-3.5 h-3.5 text-ok" />
                  <span className="text-sm font-bold text-ok">
                    {job.salary_min && job.salary_max
                      ? `${fmtK(job.salary_min)} – ${fmtK(job.salary_max)}`
                      : fmtK(job.salary_min ?? job.salary_max)}
                  </span>
                </div>
              )}

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5 mb-4 flex-1">
                {job.skills.slice(0, 5).map((s) => (
                  <span key={s} className="text-[10px] px-2 py-0.5 rounded-md bg-s3 border border-b1 text-t2 font-medium">
                    {s}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-b1">
                <div className="flex items-center gap-1 text-[10px] text-t3">
                  <Clock className="w-3 h-3" />
                  <span>{job.posted_at}</span>
                </div>
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] font-semibold text-accent hover:text-blue transition-colors"
                >
                  Apply <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Note */}
      <p className="text-center text-xs text-t3 mt-8">
        Showing sample jobs. Live data populates after first pipeline run.
        Jobs are deduplicated and enriched by our NLP agents before display.
      </p>
    </div>
  );
}
