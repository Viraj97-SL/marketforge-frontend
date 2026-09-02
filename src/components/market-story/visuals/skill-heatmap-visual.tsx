"use client";

interface SkillSpan {
  skill: string;
  role_span: number;
  total: number;
}

interface MatrixCell {
  skill: string;
  role_category: string;
  count: number;
}

const ROLE_LABELS: Record<string, string> = {
  ml_engineer: "ML Eng", ai_engineer: "AI Eng", mlops_engineer: "MLOps",
  nlp_engineer: "NLP", data_scientist: "Data Sci", data_engineer: "Data Eng",
  cv_engineer: "CV", computer_vision_engineer: "CV", ai_researcher: "Research",
  research_scientist: "Research", data_analyst: "Analyst", ai_safety: "AI Safety",
};

/**
 * Matrix / heatmap: rows = the skills that show up across the most distinct
 * role categories, columns = role categories, cell opacity = how often that
 * skill appears for that role. Different visual grammar from every other
 * chart on the page — reveals the market-wide skill floor at a glance.
 */
export function SkillHeatmapVisual({ skills, matrix }: { skills: SkillSpan[]; matrix: MatrixCell[] }) {
  if (!skills.length) {
    return <p className="text-sm" style={{ color: "var(--story-text-dim)" }}>Not enough data across roles yet.</p>;
  }

  const roleCategories = Array.from(new Set(matrix.map((m) => m.role_category))).sort();
  const maxCount = Math.max(...matrix.map((m) => m.count), 1);
  const lookup = new Map(matrix.map((m) => [`${m.skill}::${m.role_category}`, m.count]));

  return (
    <div className="w-full max-w-md">
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `90px repeat(${roleCategories.length}, minmax(0,1fr))` }}
      >
        <div />
        {roleCategories.map((rc) => (
          <div key={rc} className="text-[9px] text-center pb-1" style={{ color: "var(--story-text-mute)" }}>
            {ROLE_LABELS[rc] ?? rc.replace(/_/g, " ")}
          </div>
        ))}
        {skills.slice(0, 6).map((s) => (
          <div key={s.skill} className="contents">
            <div className="text-xs pr-2 flex items-center" style={{ color: "var(--story-text)" }}>{s.skill}</div>
            {roleCategories.map((rc) => {
              const count = lookup.get(`${s.skill}::${rc}`) ?? 0;
              const opacity = count > 0 ? Math.max(0.15, count / maxCount) : 0;
              return (
                <div
                  key={rc}
                  className="aspect-square"
                  style={{ background: `rgba(232,163,61,${opacity})`, border: "1px solid var(--story-line)" }}
                  title={`${s.skill} × ${rc}: ${count}`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <p className="text-[10px] mt-4" style={{ color: "var(--story-text-mute)" }}>
        Darker = appears more often for that role category.
      </p>
    </div>
  );
}
