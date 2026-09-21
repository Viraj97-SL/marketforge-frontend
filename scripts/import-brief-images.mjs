// One-off: import + rename + optimize the Stage 3-5 brief photos from their
// drop location (marketforge-ai/src/marketforge/images, generic Gemini_*
// filenames) into public/images with their semantic names, same pipeline
// as scripts/optimize-images.mjs (max width 1920, AVIF q50).
import sharp from "sharp";
import path from "path";

const SRC_DIR = path.resolve(process.cwd(), "..", "marketforge-ai", "src", "marketforge", "images");
const OUT_DIR = path.join(process.cwd(), "public", "images");
const MAX_WIDTH = 1920;
const QUALITY = 50;

const MAP = {
  "Gemini_Generated_Image_q82c0rq82c0rq82c.jpg": "hero.avif",
  "Gemini_Generated_Image_xq8tk3xq8tk3xq8t.jpg": "chapter-builders.avif",
  "Gemini_Generated_Image_t76ejpt76ejpt76e.jpg": "chapter-entry.avif",
  "Gemini_Generated_Image_5qsqj15qsqj15qsq.jpg": "chapter-concentration.avif",
  "Gemini_Generated_Image_qy6kusqy6kusqy6k.jpg": "home-provenance.avif",
  "Gemini_Generated_Image_2qet1r2qet1r2qet.jpg": "home-capabilities.avif",
  "Gemini_Generated_Image_3e88713e88713e88.jpg": "home-pipeline.avif",
  "Gemini_Generated_Image_m9zd26m9zd26m9zd.jpg": "home-closing.avif",
  "Gemini_Generated_Image_8ch1kn8ch1kn8ch1.jpg": "persona-seekers.avif",
  "Gemini_Generated_Image_ch1ht7ch1ht7ch1h.jpg": "persona-hiring.avif",
  "Gemini_Generated_Image_2oytqg2oytqg2oyt.jpg": "persona-research.avif",
  // Gemini_Generated_Image_7uxhw57uxhw57uxh.jpg is a duplicate/alt take of
  // the card-catalogue (chapter-concentration) shot -- not imported.
  // chapter-emerging.avif (construction site) has no source photo yet.

  // Skills page upgrade, Stage 3 bands:
  "Gemini_Generated_Image_42w83j42w83j42w8.jpg": "skills-taxonomy.avif", // specimen-drawer cabinet, tiny sorted compartments
  "Gemini_Generated_Image_kxcfqokxcfqokxcf.jpg": "skills-week.avif",     // pigeonhole wall, mostly empty, a few papers placed
  "Gemini_Generated_Image_7makf87makf87mak.jpg": "skills-close.avif",   // pegboard tool wall, every tool traced to its silhouette
  // Gemini_Generated_Image_eurrw4eurrw4eurr.jpg (workbench) is a spare/alt
  // take -- not imported, doesn't match any of the three brief bands.

  // Salary page upgrade, Stage 8 bands:
  "Gemini_Generated_Image_r4pm7mr4pm7mr4pm.jpg": "salary-stated.avif",  // open ledger, handwritten figures
  "Gemini_Generated_Image_h131zxh131zxh131.jpg": "salary-regions.avif", // aerial UK terraced housing, not London
  "Gemini_Generated_Image_a2ulvva2ulvva2ul.jpg": "salary-close.avif",   // brass balance scale, coins weighed
  // Gemini_Generated_Image_yros67yros67yros.jpg (factory time-clock) is a
  // spare/alt take -- not imported, doesn't match any of the three bands.
};

for (const [srcName, outName] of Object.entries(MAP)) {
  const src = path.join(SRC_DIR, srcName);
  const out = path.join(OUT_DIR, outName);
  const img = sharp(src);
  const meta = await img.metadata();
  const resizeOpts = meta.width && meta.width > MAX_WIDTH ? { width: MAX_WIDTH } : {};
  await img.resize(resizeOpts).avif({ quality: QUALITY }).toFile(out);
  console.log(`${srcName} -> ${outName}`);
}
