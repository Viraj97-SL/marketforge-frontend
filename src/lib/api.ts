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

export interface RoleCount { role_category: string; job_count: number; }

export interface RolesData {
  roles: RoleCount[];
  days: number | null;
}

export interface SkillPair { skill_a: string; skill_b: string; co_count: number; pmi_score: number; }

export interface SkillCooccurrenceData {
  pairs: SkillPair[];
}

export interface SkillMatrixData {
  skills: SkillCount[];
  matrix: number[][];
  leaf_order: number[];
}

export interface SkillCount { skill: string; count: number; }

export interface SkillHistoryData {
  weeks: string[];
  series: Record<string, number[]>;
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

export interface CVATSBreakdown {
  keyword_match: number;
  structure: number;
  readability: number;
  completeness: number;
  format_safety: number;
}

export interface CVGapPlan {
  short_term: string[];
  mid_term: string[];
  long_term: string[];
}

export interface CVAnalysisReport {
  session_token: string;
  ats_score: number;
  ats_grade: string;
  ats_breakdown: CVATSBreakdown;
  ats_issues: string[];
  skills_found: string[];
  skills_missing: string[];
  keyword_match_pct: number;
  market_match_pct: number;
  gap_plan: CVGapPlan;
  narrative_summary: string;
  pii_scrubbed: string[];
  data_retained: false;
}

export interface JobListing {
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

export interface JobsResponse {
  jobs: JobListing[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface HiringVelocityItem {
  role: string;
  role_category: string;
  growth_pct: number;
  direction: "up" | "down" | "neutral";
}

export interface HiringVelocityData {
  velocity: HiringVelocityItem[];
}

export interface CityCount {
  city: string;
  job_count: number;
}

export interface CitiesData {
  cities: CityCount[];
  week_start: string;
}

export interface CompanyMixItem {
  type: string;
  pct: number;
  job_count: number;
}

export interface CompanyMixData {
  mix: CompanyMixItem[];
}

export interface SponsorshipSector {
  sector: string;
  sponsorship_rate: number;
}

export interface SponsorshipBySectorData {
  sectors: SponsorshipSector[];
}

export interface VacancyTrendPoint {
  month: string;
  vacancies_index: number;
}

export interface VacancyTrendData {
  source: string;
  series_label: string;
  methodology: string;
  trend: VacancyTrendPoint[];
}

export interface SponsorVerificationData {
  source: string;
  methodology: string;
  sample_size: number;
  verified_pct: number | null;
}

export interface SalaryBenchmarkRow {
  role_category: string;
  soc_code: string;
  soc_title: string;
  year: number;
  salary_p25: number | null;
  salary_p50: number | null;
  salary_p75: number | null;
}

export interface SalaryBenchmarkData {
  source: string;
  methodology: string;
  benchmarks: SalaryBenchmarkRow[];
}

export interface GraduateOutcomesData {
  source: string;
  methodology: string;
  employment: {
    year: number;
    employment_rate: number;
    hs_employment_rate: number;
    unemployment_rate: number;
    inactivity_rate: number;
  } | null;
  computing_qualifiers: {
    academic_year: string;
    qualifiers_count: number;
  } | null;
}

export interface SkillShift {
  skill: string;
  overall_rank: number;
  junior_rank: number;
  rank_delta: number;
}

export interface EntryLevelSkillShiftData {
  methodology: string;
  shifts: SkillShift[];
  sample_size_junior: number;
}

export interface UniversalSkill {
  skill: string;
  role_span: number;
  total: number;
}

export interface UniversalSkillMatrixCell {
  skill: string;
  role_category: string;
  count: number;
}

export interface EntryLevelUniversalSkillsData {
  methodology: string;
  skills: UniversalSkill[];
  matrix: UniversalSkillMatrixCell[];
}

export interface EntryLevelCompanyMixData {
  sample_size: number;
  mix: CompanyMixItem[];
}

export interface SnapshotHistoryWeek {
  week_start: string;
  job_count: number;
  salary_p50: number | null;
  sponsorship_rate: number;
}

export interface SnapshotHistoryData {
  role_category: string;
  weeks: SnapshotHistoryWeek[];
}

async function get<T>(path: string): Promise<T> {
  // no-store, not next.revalidate: Vercel's fetch Data Cache persists across
  // deployments, so a time-based revalidate window can keep serving a
  // pre-deploy response (wrong shape, stale counts) until something happens
  // to trigger a background refresh. The backend already has its own 6h
  // Redis cache, so every request here going to origin is cheap and always
  // reflects the currently-deployed backend, not a leftover cached shape.
  const res = await fetch(`${API}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API ${path} → ${res.status}`);
  return res.json();
}

export const api = {
  health: () => get<HealthData>("/api/v1/health"),
  snapshot: (week?: string) =>
    get<SnapshotData>(`/api/v1/market/snapshot${week ? `?week=${week}` : ""}`),
  snapshotHistory: (weeks = 26) =>
    get<SnapshotHistoryData>(`/api/v1/market/snapshot-history?weeks=${weeks}`),
  skills: (role = "all", days?: number) =>
    get<SkillsData>(`/api/v1/market/skills?role_category=${role}${days ? `&days=${days}` : ""}`),
  weeklySkills: (role = "all") => get<SkillsData>(`/api/v1/market/skills?role_category=${role}&week=latest`),
  roles: (days?: number) => get<RolesData>(`/api/v1/market/roles${days ? `?days=${days}` : ""}`),
  skillCooccurrence: (limit = 40) => get<SkillCooccurrenceData>(`/api/v1/market/skill-cooccurrence?limit=${limit}`),
  skillMatrix: () => get<SkillMatrixData>("/api/v1/market/skill-matrix"),
  skillHistory: (skills: string[], weeks = 8) =>
    get<SkillHistoryData>(`/api/v1/market/skill-history?skills=${encodeURIComponent(skills.join(","))}&weeks=${weeks}`),
  salary: (role = "all", level = "all", location = "all", workModel = "all") =>
    get<SalaryData>(`/api/v1/market/salary?role_category=${role}&experience_level=${level}&location=${location}&work_model=${workModel}`),
  trending: (days = 7) => get<TrendingData>(`/api/v1/market/trending?days=${days}`),
  hiringVelocity: () => get<HiringVelocityData>("/api/v1/market/hiring-velocity"),
  cities: () => get<CitiesData>("/api/v1/market/cities"),
  companyMix: () => get<CompanyMixData>("/api/v1/market/company-mix"),
  sponsorshipBySector: () => get<SponsorshipBySectorData>("/api/v1/market/sponsorship-by-sector"),
  vacancyTrend: () => get<VacancyTrendData>("/api/v1/market/external/vacancy-trend"),
  sponsorVerification: () => get<SponsorVerificationData>("/api/v1/market/external/sponsor-verification"),
  salaryBenchmark: () => get<SalaryBenchmarkData>("/api/v1/market/external/salary-benchmark"),
  graduateOutcomes: () => get<GraduateOutcomesData>("/api/v1/market/external/graduate-outcomes"),
  entryLevelSkillShift: () => get<EntryLevelSkillShiftData>("/api/v1/market/entry-level/skill-shift"),
  entryLevelUniversalSkills: () => get<EntryLevelUniversalSkillsData>("/api/v1/market/entry-level/universal-skills"),
  entryLevelCompanyMix: () => get<EntryLevelCompanyMixData>("/api/v1/market/entry-level/company-mix"),
  jobs: (opts: { role?: string; work_model?: string; visa_only?: boolean; page?: number; page_size?: number } = {}) => {
    const p = new URLSearchParams({ page: String(opts.page ?? 1), page_size: String(opts.page_size ?? 20) });
    if (opts.role && opts.role !== "all") p.set("role_category", opts.role);
    if (opts.work_model) p.set("work_model", opts.work_model);
    if (opts.visa_only) p.set("visa_only", "true");
    return get<JobsResponse>(`/api/v1/jobs?${p}`);
  },
  analyseCareer: async (profile: CareerProfile): Promise<CareerReport> => {
    const res = await fetch(`${API}/api/v1/career/analyse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error(`Career API → ${res.status}`);
    return res.json();
  },
  analyseCV: async (file: File, targetRole: string, consent: boolean): Promise<CVAnalysisReport> => {
    const form = new FormData();
    form.append("cv_file", file);
    const params = new URLSearchParams({ target_role: targetRole, consent: String(consent) });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 90_000);
    let res: Response;
    try {
      res = await fetch(`${API}/api/v1/career/cv-analyse?${params}`, {
        method: "POST",
        body: form,
        signal: controller.signal,
      });
    } catch (err: any) {
      clearTimeout(timeout);
      if (err?.name === "AbortError") throw new Error("TIMEOUT");
      throw new Error("NETWORK_ERROR");
    }
    clearTimeout(timeout);
    if (res.status === 403) throw new Error("CONSENT_REQUIRED");
    if (res.status === 422) {
      const body = await res.json().catch(() => ({}));
      throw new Error(`FILE_REJECTED: ${body?.detail ?? "file validation failed"}`);
    }
    if (res.status === 429) throw new Error("RATE_LIMITED");
    if (res.status >= 500) throw new Error(`SERVER_ERROR: ${res.status}`);
    if (!res.ok) throw new Error(`CV API → ${res.status}`);
    return res.json();
  },
};
