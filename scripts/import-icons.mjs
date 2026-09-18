// Import the custom feature/pipeline icon PNGs from their drop location,
// resize to a consistent small size, keep as PNG (alpha-masked icons, used
// via CSS mask-image + currentColor so they inherit each card's accent
// colour — see src/components/ui/mask-icon.tsx).
import sharp from "sharp";
import path from "path";
import { mkdirSync } from "fs";

const SRC_DIR = path.resolve(process.cwd(), "..", "marketforge-ai", "src", "marketforge", "images");
const OUT_DIR = path.join(process.cwd(), "public", "images", "icons");
mkdirSync(OUT_DIR, { recursive: true });

const MAP = {
  "ai-powered-scraping.png": "feature-scraping.png",
  "skill-demand-intelligence.png": "feature-skills.png",
  "salary-benchmarks.png": "feature-salary.png",
  "visa-sponsorship-tracker.png": "feature-visa.png",
  "career-gap-analysis.png": "feature-career.png",
  "research-signals.png": "feature-research.png",
  "step-1-scrape.png": "step-scrape.png",
  "step-2-deduplicate.png": "step-dedupe.png",
  "step-3-extract.png": "step-extract.png",
  "step-4-analyse.png": "step-analyse.png",
  "step-5-snapshot.png": "step-snapshot.png",
  "step-6-dashboard.png": "step-dashboard.png",
};

for (const [srcName, outName] of Object.entries(MAP)) {
  const src = path.join(SRC_DIR, srcName);
  const out = path.join(OUT_DIR, outName);
  await sharp(src).resize(128, 128).png({ compressionLevel: 9 }).toFile(out);
  console.log(`${srcName} -> icons/${outName}`);
}
