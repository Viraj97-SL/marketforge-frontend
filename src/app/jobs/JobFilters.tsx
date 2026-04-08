"use client";

import { useRouter, usePathname } from "next/navigation";

const ROLES = [
  { label: "All Roles",      value: "all" },
  { label: "ML Engineer",    value: "ML Engineer" },
  { label: "Data Scientist", value: "Data Scientist" },
  { label: "AI Researcher",  value: "AI Researcher" },
  { label: "MLOps",          value: "MLOps" },
  { label: "NLP",            value: "NLP" },
  { label: "CV Engineer",    value: "CV Engineer" },
];

interface Props {
  activeRole: string;
  workModel: string;
  visaOnly: boolean;
}

export function JobFilters({ activeRole, workModel, visaOnly }: Props) {
  const router   = useRouter();
  const pathname = usePathname();

  function push(next: { role: string; work_model: string; visa_only: boolean }) {
    const sp = new URLSearchParams();
    if (next.role !== "all")  sp.set("role", next.role);
    if (next.work_model)      sp.set("work_model", next.work_model);
    if (next.visa_only)       sp.set("visa_only", "true");
    sp.set("page", "1");
    router.push(`${pathname}?${sp.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-8 animate-fade-up animate-delay-100">
      {ROLES.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => push({ role: value, work_model: workModel, visa_only: visaOnly })}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            activeRole === value
              ? "bg-accent/10 text-accent border-accent/30"
              : "bg-transparent text-t2 border-b1 hover:border-b2 hover:text-t1"
          }`}
        >
          {label}
        </button>
      ))}

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => push({ role: activeRole, work_model: workModel, visa_only: !visaOnly })}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            visaOnly
              ? "bg-prp/10 text-prp border-prp/30"
              : "border-b1 text-t2 hover:border-b2 hover:text-t1"
          }`}
        >
          Visa Sponsor Only
        </button>
        <button
          onClick={() =>
            push({
              role: activeRole,
              work_model: workModel === "remote" ? "" : "remote",
              visa_only: visaOnly,
            })
          }
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            workModel === "remote"
              ? "bg-ok/10 text-ok border-ok/30"
              : "border-b1 text-t2 hover:border-b2 hover:text-t1"
          }`}
        >
          Remote Only
        </button>
      </div>
    </div>
  );
}
