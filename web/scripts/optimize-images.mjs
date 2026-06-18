// Generates optimized WebP variants of the local photos so pages load fast.
// Output: web/public/_img/<original path>-<width>.webp  (480 = cards/thumbs,
// 1366 = main gallery frame). Idempotent — skips variants already generated.
// Run via `npm run images` (also runs automatically before build).
import sharp from "sharp";
import { readdir, mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(ROOT, "public");
const OUT = path.join(PUBLIC, "_img");
const SOURCES = ["assets/listings", "assets/imagery"];
const WIDTHS = [480, 1366];
const EXT = /\.(jpe?g|png)$/i;

async function* walk(dir) {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    // follow symlinks (public/assets is a symlink into the repo)
    const s = await stat(full).catch(() => null);
    if (s?.isDirectory()) yield* walk(full);
    else if (s?.isFile() && EXT.test(e.name)) yield full;
  }
}

let made = 0, skipped = 0, failed = 0;
for (const sub of SOURCES) {
  for await (const file of walk(path.join(PUBLIC, sub))) {
    const rel = path.relative(PUBLIC, file).replace(EXT, "");
    for (const w of WIDTHS) {
      const out = path.join(OUT, `${rel}-${w}.webp`);
      if (existsSync(out)) { skipped++; continue; }
      await mkdir(path.dirname(out), { recursive: true });
      try {
        await sharp(file).resize({ width: w, withoutEnlargement: true }).webp({ quality: 72 }).toFile(out);
        made++;
      } catch (err) {
        failed++;
        console.warn("skip", rel, String(err.message || err));
      }
    }
  }
}
console.log(`images: ${made} generated, ${skipped} cached, ${failed} failed`);
