// Canonical AI/ML role-category slugs used across /skills, /salary, and /jobs.
// Shared so every page fetching per-role live data uses the same api_slug set
// as the backend's role_category taxonomy (marketforge.nlp.taxonomy.classify_role).
export const ROLE_CONFIGS = [
  { key: "ml_engineer",    label: "ML Engineer",               apiSlug: "ml_engineer"    },
  { key: "data_scientist", label: "Data Scientist",            apiSlug: "data_scientist" },
  { key: "ai_researcher",  label: "AI Research Scientist",     apiSlug: "ai_researcher"  },
  { key: "mlops_engineer", label: "MLOps / Platform Engineer", apiSlug: "mlops_engineer" },
  { key: "nlp_engineer",   label: "NLP Engineer",              apiSlug: "nlp_engineer"   },
  { key: "data_engineer",  label: "Data Engineer",             apiSlug: "data_engineer"  },
  { key: "cv_engineer",    label: "Computer Vision Engineer",  apiSlug: "cv_engineer"    },
] as const;
