# MarketForge Frontend

**Next.js 14 Dashboard for UK AI/ML Market Intelligence**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/deploy-Vercel-black)](https://vercel.com)
![Recharts](https://img.shields.io/badge/Recharts-2.12-green)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-pink)

> Live at **[marketforge.digital](https://marketforge.digital)**

---

## What Is This?

The MarketForge frontend is a dark-mode analytics dashboard that visualises live UK AI/ML job market intelligence. It is a pure consumer of the [`marketforge-backend`](https://github.com/Viraj97-SL/marketforge-backend) REST API — no server-side data processing, no database access.

The UI is built for **technical depth over aesthetics**: every data point on screen comes from real job postings scraped twice weekly by 9 autonomous AI agents.

---

## Three-Repo Architecture

| Repo | Role | Deployed on |
|---|---|---|
| [`marketforge-ai`](https://github.com/Viraj97-SL/marketforge-ai) | Core package: 9 agents, LangGraph graphs, ML/NLP pipelines | Installed as git package |
| [`marketforge-backend`](https://github.com/Viraj97-SL/marketforge-backend) | FastAPI REST API + APScheduler worker | Railway |
| **`marketforge-frontend`** ← you are here | Next.js 14 dashboard | Vercel |

---

## Pages

| Route | Title | What it shows |
|---|---|---|
| `/` | Home | Live hero metrics (job count, top skill, median salary), feature overview, tech stack marquee, contact form |
| `/market` | Market Overview | Weekly snapshot: job count, skill demand bar chart, salary percentiles (p25/p50/p75), sponsorship rate, top skills radar |
| `/skills` | Skills Intelligence | Full skill demand index, role-category breakdown, trending skills (rising / declining week-on-week) |
| `/salary` | Salary Benchmarks | Salary p25/p50/p75 by role category and experience level; London vs national comparison |
| `/jobs` | Live Jobs | Paginated job listings with filter by role, work model (remote/hybrid/on-site), and visa sponsorship |
| `/career` | AI Career Advisor | Two-tab tool: **Skills Analysis** (manual skills input → SBERT + Gemini gap analysis) and **CV Upload & ATS** (PDF/DOCX → deterministic ATS score + ML-ranked gap plan) |
| `/research` | Research Signals | Emerging tech signals from arXiv and tech blogs; predicted skills 4–8 weeks before job market peak |

---

## CV Analyser — Frontend Detail

The CV tab provides a complete upload → results flow with no page reload:

```
File dropzone (PDF / DOCX, max 5 MB, drag-and-drop)
    ↓
Target role selector  (AI Engineer · ML Engineer · Data Scientist · …)
    ↓
GDPR consent checkbox (required — 403 if unchecked)
    ↓
POST /api/v1/career/cv-analyse  (multipart/form-data, 90s AbortController timeout)
    ↓
Results panel:
  ├── ATS Score gauge (SVG arc, animated)
  ├── Grade badge  A+ / A / B / C / D
  ├── 5-dimension ATS breakdown radar (Recharts RadarChart)
  ├── Keyword match % + Market match %
  ├── PII scrubbed notice  (email, postcode, etc.)
  ├── Skills found (green pills)
  ├── Skills missing (red pills)
  ├── CV issues to fix (amber list)
  └── Gap plan timeline
        ├── 0–3 months  (quick-win certifications)
        ├── 3–12 months (portfolio projects)
        └── 12+ months  (deep specialisation)
```

Error states handled:
- `CONSENT_REQUIRED` — user must tick GDPR checkbox
- `FILE_REJECTED` — file failed security scan (magic bytes, JS detection)
- `RATE_LIMITED` — 3 analyses/hour per IP exceeded
- `TIMEOUT` — server warm-up (90s threshold); user prompted to retry
- `NETWORK_ERROR` — connection issue
- `SERVER_ERROR` — 5xx with retry prompt

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 14.2 | App Router, SSR/SSG, metadata API, sitemap, robots |
| **TypeScript** | 5.4 | Full type safety across all components and API layer |
| **Tailwind CSS** | 3.4 | Utility-first styling with custom design tokens |
| **Recharts** | 2.12 | RadarChart (ATS breakdown), BarChart (skill demand), line charts |
| **Framer Motion** | 11 | Page transitions, staggered animations |
| **Lucide React** | 0.378 | Icon system |
| **SWR** | 2.2.5 | Data fetching with stale-while-revalidate |
| **Radix UI** | — | Accessible Tabs, Select, Dialog, Tooltip, Slider primitives |
| **react-fast-marquee** | 1.6.5 | Tech stack logo scroll on home page |
| **react-intersection-observer** | 9.10 | Scroll-triggered animations |
| **@vercel/analytics** | 2.0 | Page view + event tracking |
| **clsx + tailwind-merge** | — | Conditional class composition |

---

## Design System

The UI uses a custom dark-mode token set defined in `globals.css`:

```css
/* Core palette */
--bg:     #060E17    /* deepest background */
--s1:     #0A1628    /* card surface */
--s2:     #0F1E35    /* elevated surface */
--b1:     #1C2A3A    /* subtle border */
--t1:     #E2EAF4    /* primary text */
--t2:     #64748B    /* secondary text */
--t3:     #334155    /* muted text */
--accent: #00C6A7    /* teal — primary action */
--blue:   #3B82F6    /* blue — secondary */
--ok:     #22C55E    /* green — success */
--warn:   #F59E0B    /* amber — warning */
--err:    #EF4444    /* red — error */
```

Animation utilities in `globals.css`:
- `animate-fade-up` — staggered card entrance
- `animate-float` — hero data tile levitation
- `animate-orbit-cw` / `animate-orbit-ccw` — hero orbital rings
- `animate-pulse-slow` — ambient glow blobs
- `animate-delay-*` — stagger timing classes

---

## API Integration

All data fetching lives in `src/lib/api.ts`. The module exports a single `api` object:

```typescript
const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const api = {
  health:       () => get<HealthData>("/api/v1/health"),
  snapshot:     (week?) => get<SnapshotData>("/api/v1/market/snapshot"),
  skills:       (role?) => get<SkillsData>("/api/v1/market/skills"),
  salary:       (role?, level?, location?) => get<SalaryData>("/api/v1/market/salary"),
  trending:     (days?) => get<TrendingData>("/api/v1/market/trending"),
  jobs:         (opts?) => get<JobsResponse>("/api/v1/jobs"),
  analyseCareer: async (profile) => ...,  // POST with 10 req/min rate limit
  analyseCV:    async (file, role, consent) => ...,  // POST multipart, 3/hour, 90s timeout
};
```

Market data endpoints use Next.js `{ next: { revalidate: 300 } }` for 5-minute ISR caching at the CDN edge.

---

## SEO & Metadata

Pages use Next.js App Router's `Metadata` API with full Open Graph and Twitter card support:

- `metadataBase`: `https://marketforge.digital`
- Dynamic `sitemap.ts` listing all routes with priorities and change frequencies
- `robots.ts` — allows all crawlers
- Keywords targeting: "AI jobs UK", "ML salary benchmark", "data science hiring", "visa sponsorship UK tech", etc.
- `locale: en_GB` on OG metadata

---

## Security Headers

Configured in `vercel.json` for all routes:

```json
"X-Content-Type-Options": "nosniff"
"X-Frame-Options": "DENY"
"X-XSS-Protection": "1; mode=block"
```

---

## Project Structure

```
marketforge-frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Home — hero, live metrics, feature overview, contact
│   │   ├── layout.tsx         # Root layout — Nav, Footer, Analytics, global metadata
│   │   ├── globals.css        # Design tokens, animations, base styles
│   │   ├── market/            # Market overview — snapshot, skill demand, salary
│   │   ├── skills/            # Skills intelligence — demand index, trending
│   │   ├── salary/            # Salary benchmarks — role × level × location
│   │   ├── jobs/              # Live job listings — paginated, filterable
│   │   ├── career/            # CV analyser + skills gap advisor (two-tab)
│   │   ├── research/          # Research signals — arXiv, emerging skills
│   │   ├── sitemap.ts         # Dynamic XML sitemap
│   │   └── robots.ts          # robots.txt
│   ├── components/
│   │   ├── layout/
│   │   │   ├── nav.tsx        # Top navigation bar
│   │   │   └── footer.tsx     # Footer
│   │   ├── home/
│   │   │   ├── logo-marquee.tsx   # Scrolling tech stack logos
│   │   │   └── contact-form.tsx   # Contact / feedback form
│   │   ├── charts/            # Recharts wrappers (bar, radar, line)
│   │   ├── cards/             # Reusable data cards
│   │   ├── ui/                # Primitive UI components (button, badge, etc.)
│   │   └── market/            # Market-specific layout components
│   └── lib/
│       ├── api.ts             # API client — all endpoints + TypeScript interfaces
│       └── utils.ts           # Number formatters (fmtK, pct, fmt)
├── public/
│   └── images/                # Hero background, OG image
├── vercel.json                # Build config + security headers
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## Local Development

### Prerequisites

- Node.js 20+
- npm or pnpm
- `marketforge-backend` running locally at `http://localhost:8000` (or set `NEXT_PUBLIC_API_URL`)

### Install and run

```bash
git clone https://github.com/Viraj97-SL/marketforge-frontend.git
cd marketforge-frontend
npm install
npm run dev
# → http://localhost:3000
```

### Environment variables

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
# In production (Vercel), set to: https://your-railway-backend.up.railway.app
```

### Build and check

```bash
npm run build    # production build + type check
npm run lint     # ESLint
```

---

## Vercel Deployment

The frontend deploys automatically to Vercel on every push to `main`. No manual steps required after initial setup.

**Required Vercel environment variable:**

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://your-railway-service.up.railway.app` |

The `vercel.json` sets the build command, output directory, and security response headers.

---

## Performance Notes

- Market data endpoints use `revalidate: 300` (5-minute ISR) — dashboard data is always fresh without SSR on every request
- The CV analyser uses a client-side `AbortController` with a 90-second timeout to handle Railway cold-start latency gracefully
- Hero page fetches `health` and `snapshot` at server render time — no loading spinners on first paint for the key metrics
- Framer Motion animations are scoped to entrance only — no continuous re-renders

---

## Author

**Viraj Bulugahapitiya** · AI Engineer · MSc Data Science, University of Hertfordshire (2026)

[marketforge.digital](https://marketforge.digital) · [GitHub](https://github.com/Viraj97-SL)
