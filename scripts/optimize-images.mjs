// One-off asset pipeline pass (Stage 2): resize source photos to max width
// 1920 and re-encode as AVIF q50. Run again whenever new source photos land
// in public/images. Originals are left untouched; .avif siblings are added.
import sharp from "sharp";
import { readdirSync, statSync } from "fs";
import path from "path";

const DIR = path.join(process.cwd(), "public", "images");
const MAX_WIDTH = 1920;
const QUALITY = 50;

const targets = readdirSync(DIR).filter((f) => /\.(jpe?g|png)$/i.test(f));

for (const file of targets) {
  const src = path.join(DIR, file);
  const outName = file.replace(/\.(jpe?g|png)$/i, ".avif");
  const out = path.join(DIR, outName);
  const before = statSync(src).size;

  const img = sharp(src);
  const meta = await img.metadata();
  const resizeOpts = meta.width && meta.width > MAX_WIDTH ? { width: MAX_WIDTH } : {};

  await img.resize(resizeOpts).avif({ quality: QUALITY }).toFile(out);
  const after = statSync(out).size;
  console.log(`${file}  ${(before / 1024).toFixed(0)}KB -> ${outName}  ${(after / 1024).toFixed(0)}KB`);
}
