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

// Social-share (og:image) variants — cover photos only. WhatsApp silently
// drops link-preview images over ~600 KB and several covers are multi-MB
// originals, so each listing/rental cover gets a ~1200px JPEG (webp isn't
// reliably rendered by every scraper) at /_img/<path>-og.jpg.
const { readFile } = await import("node:fs/promises");
const covers = new Set(["/assets/imagery/og-image.jpg"]);
for (const coll of ["listings", "rentals"]) {
  const dir = path.join(ROOT, "src", "content", coll);
  for (const name of (await readdir(dir).catch(() => [])).filter((n) => n.endsWith(".json"))) {
    try {
      const { image } = JSON.parse(await readFile(path.join(dir, name), "utf8"));
      if (typeof image === "string" && image.startsWith("/assets/")) covers.add(image);
    } catch { /* unreadable record — the build proper will report it */ }
  }
}
let ogMade = 0, ogSkipped = 0;
for (const cover of covers) {
  const src = path.join(PUBLIC, "." + cover);
  const out = path.join(OUT, cover.replace(/^\//, "").replace(EXT, "") + "-og.jpg");
  if (existsSync(out)) { ogSkipped++; continue; }
  if (!existsSync(src)) continue;
  await mkdir(path.dirname(out), { recursive: true });
  try {
    await sharp(src).resize({ width: 1200, withoutEnlargement: true }).flatten({ background: "#ffffff" }).jpeg({ quality: 72 }).toFile(out);
    ogMade++;
  } catch (err) {
    console.warn("og skip", cover, String(err.message || err));
  }
}
console.log(`og images: ${ogMade} generated, ${ogSkipped} cached`);
