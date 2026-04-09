"use client";

import { useRouter, usePathname } from "next/navigation";

// ── Role definitions — value MUST match market.jobs.role_category in DB ───────
const ROLES = [
  { label: "All Roles",      value: "all" },
  { label: "ML Engineer",    value: "ml_engineer" },
  { label: "Data Scientist", value: "data_scientist" },
  { label: "AI Engineer",    value: "ai_engineer" },
  { label: "MLOps",          value: "mlops_engineer" },
  { label: "NLP",            value: "nlp_engineer" },
  { label: "CV Engineer",    value: "computer_vision_engineer" },
  { label: "Research",       value: "research_scientist" },
  { label: "Data Eng",       value: "data_engineer" },
];

interface Props {
  activeRole: string;
  workModel:  string;
  visaOnly:   boolean;
}

export function JobFilters({ activeRole, workModel, visaOnly }: Props) {
  const router   = useRouter();
  const pathname = usePathname();

  function push(next: { role: string; work_model: string; visa_only: boolean }) {
    const sp = new URLSearchParams();
    if (next.role !== "all")  sp.set("role",       next.role);
    if (next.work_model)      sp.set("work_model",  next.work_model);
    if (next.visa_only)       sp.set("visa_only",   "true");
    sp.set("page", "1");   // always reset to page 1 on filter change
    router.push(`${pathname}?${sp.toString()}`);
  }

  return (
    <div className="mb-8 animate-fade-up animate-delay-100 space-y-3">
      {/* Role chips */}
      <div className="flex flex-wrap gap-2">
        {ROLES.map(({ label, value }) => {
          const active = activeRole === value;
          return (
            <button
              key={value}
              onClick={() => push({ role: value, work_model: workModel, visa_only: visaOnly })}
              className={`
                px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200
                ${active
                  ? "bg-accent/12 text-accent border-accent/35 shadow-[0_0_12px_rgba(0,198,167,0.18)]"
                  : "bg-transparent text-t2 border-b1 hover:border-b2 hover:text-t1 hover:bg-s2"
                }
              `}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Secondary filters */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => push({ role: activeRole, work_model: workModel, visa_only: !visaOnly })}
          className={`
            flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200
            ${visaOnly
              ? "bg-prp/10 text-prp border-prp/30 shadow-[0_0_10px_rgba(139,92,246,0.15)]"
              : "border-b1 text-t2 hover:border-b2 hover:text-t1 hover:bg-s2"
            }
          `}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${visaOnly ? "bg-prp" : "bg-t3"}`} />
          Visa Sponsorship
        </button>

        <button
          onClick={() =>
            push({ role: activeRole, work_model: workModel === "remote" ? "" : "remote", visa_only: visaOnly })
          }
          className={`
            flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200
            ${workModel === "remote"
              ? "bg-ok/10 text-ok border-ok/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]"
              : "border-b1 text-t2 hover:border-b2 hover:text-t1 hover:bg-s2"
            }
          `}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${workModel === "remote" ? "bg-ok" : "bg-t3"}`} />
          Remote Only
        </button>

        <button
          onClick={() =>
            push({ role: activeRole, work_model: workModel === "hybrid" ? "" : "hybrid", visa_only: visaOnly })
          }
          className={`
            flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200
            ${workModel === "hybrid"
              ? "bg-blue/10 text-blue border-blue/30 shadow-[0_0_10px_rgba(59,130,246,0.15)]"
              : "border-b1 text-t2 hover:border-b2 hover:text-t1 hover:bg-s2"
            }
          `}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${workModel === "hybrid" ? "bg-blue" : "bg-t3"}`} />
          Hybrid
        </button>
      </div>
    </div>
  );
}
