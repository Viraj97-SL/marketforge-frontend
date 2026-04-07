const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface HealthData {
  status: string;
  last_ingestion: string | null;
  data_freshness_h: number | null;
  jobs_total: number;
  version: string;
}

export interface SkillsData {
  top_skills: Record<string, number>;
  rising_skills: string[];
  declining_skills: string[];
  week_start: string;
}

export interface SalaryData {
  salary_p25: number | null;
  salary_p50: number | null;
  salary_p75: number | null;
  salary_sample_size: number;
  week_start: string;
}

export interface SnapshotData {
  week_start: string;
  role_category: string;
  job_count: number;
  top_skills: Record<string, number>;
  salary_p25: number | null;
  salary_p50: number | null;
  salary_p75: number | null;
  sponsorship_rate: number;
  computed_at: string;
}

export interface TrendingData {
  rising: string[];
  declining: string[];
  top_now: string[];
  week: string;
}

export interface CareerProfile {
  skills: string[];
  target_role: string;
  experience_level: string;
  location: string;
  visa_sponsorship: boolean;
  free_text?: string;
}

export interface CareerReport {
  market_match_pct: number;
  match_distribution: { strong: number; moderate: number; weak: number };
  top_skill_gaps: { skill: string; market_demand: number; priority: string }[];
  sector_fit: { sector: string; fit_score: number; sponsorship_rate: number }[];
  salary_expectation: { p25: number | null; p50: number | null; p75: number | null; currency: string };
  action_plan_90d: string[];
  narrative_summary: string;
  security_warnings: string[];
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`API ${path} → ${res.status}`);
  return res.json();
}

export const api = {
  health: () => get<HealthData>("/api/v1/health"),
  snapshot: (week?: string) =>
    get<SnapshotData>(`/api/v1/market/snapshot${week ? `?week=${week}` : ""}`),
  skills: (role = "all") => get<SkillsData>(`/api/v1/market/skills?role_category=${role}`),
  salary: (role = "all", level = "mid", location = "London") =>
    get<SalaryData>(`/api/v1/market/salary?role_category=${role}&experience_level=${level}&location=${location}`),
  trending: (days = 7) => get<TrendingData>(`/api/v1/market/trending?days=${days}`),
  analyseCareer: async (profile: CareerProfile): Promise<CareerReport> => {
    const res = await fetch(`${API}/api/v1/career/analyse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error(`Career API → ${res.status}`);
    return res.json();
  },
};
