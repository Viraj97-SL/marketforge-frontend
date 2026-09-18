// Canonical AI/ML role-category slugs used across /skills, /salary, and /jobs.
// Shared so every page fetching per-role live data uses the same api_slug set
// as the backend's role_category taxonomy (marketforge.nlp.taxonomy.classify_role
// _ROLE_PATTERNS — apiSlug must match a real role_category value in market.jobs,
// or the query silently returns "not enough data" regardless of actual volume).
export const ROLE_CONFIGS = [
  { key: "ai_engineer",       label: "AI Engineer",               apiSlug: "ai_engineer"       },
  { key: "ml_engineer",       label: "ML Engineer",               apiSlug: "ml_engineer"        },
  { key: "data_scientist",    label: "Data Scientist",            apiSlug: "data_scientist"     },
  { key: "data_engineer",     label: "Data Engineer",             apiSlug: "data_engineer"      },
  { key: "ai_product_manager",label: "AI Product Manager",        apiSlug: "ai_product_manager" },
  { key: "mlops_engineer",    label: "MLOps / Platform Engineer", apiSlug: "mlops_engineer"     },
  { key: "research_scientist",label: "AI Research Scientist",     apiSlug: "research_scientist" },
  { key: "nlp_engineer",      label: "NLP Engineer",              apiSlug: "nlp_engineer"       },
  { key: "computer_vision_engineer", label: "Computer Vision Engineer", apiSlug: "computer_vision_engineer" },
] as const;
