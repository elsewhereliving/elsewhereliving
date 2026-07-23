// Generates optimized WebP variants of the local photos so pages load fast.
// Output: web/public/_img/<original path>-<width>.webp  (480 = cards/thumbs,
// 1366 = main gallery frame). Idempotent — skips variants already generated.
// Run via `npm run images` (also runs automatically before build).
//
// Work is spread across all CPU cores: a cold run (e.g. Cloudflare Pages, where
// public/_img is gitignored and every build starts empty) has to generate
// thousands of variants, and doing them one-at-a-time overran Cloudflare's build
// time limit. Each variant is an independent Sharp call, so we run a pool of
// them concurrently — one libvips thread per call so the pool, not libvips,
// saturates the cores.
import sharp from "sharp";
import { readdir, mkdir, stat, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import os from "node:os";
import path from "node:path";

sharp.concurrency(1); // one thread per call; we parallelize across calls below

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

// 1. Collect every variant that still needs generating (skip existing = cached).
const tasks = [];
let skipped = 0;
for (const sub of SOURCES) {
  for await (const file of walk(path.join(PUBLIC, sub))) {
    const rel = path.relative(PUBLIC, file).replace(EXT, "");
    for (const w of WIDTHS) {
      const out = path.join(OUT, `${rel}-${w}.webp`);
      if (existsSync(out)) { skipped++; continue; }
      tasks.push({ kind: "webp", src: file, out, width: w });
    }
  }
}

// Social-share (og:image) variants — cover photos only. WhatsApp silently
// drops link-preview images over ~600 KB and several covers are multi-MB
// originals, so each listing/rental cover gets a ~1200px JPEG (webp isn't
// reliably rendered by every scraper) at /_img/<path>-og.jpg.
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
let ogSkipped = 0;
for (const cover of covers) {
  const src = path.join(PUBLIC, "." + cover);
  const out = path.join(OUT, cover.replace(/^\//, "").replace(EXT, "") + "-og.jpg");
  if (existsSync(out)) { ogSkipped++; continue; }
  if (!existsSync(src)) continue;
  tasks.push({ kind: "og", src, out });
}

// 2. Pre-create the output directories once (cheaper than per-task mkdir).
for (const d of new Set(tasks.map((t) => path.dirname(t.out)))) {
  await mkdir(d, { recursive: true });
}

// 3. Run the tasks through a pool sized to the available cores.
const CONCURRENCY = Math.max(2, os.availableParallelism?.() ?? os.cpus().length);
let made = 0, ogMade = 0, failed = 0, next = 0;
async function worker() {
  for (let t = tasks[next++]; t; t = tasks[next++]) {
    try {
      if (t.kind === "webp") {
        await sharp(t.src).resize({ width: t.width, withoutEnlargement: true }).webp({ quality: 72 }).toFile(t.out);
        made++;
      } else {
        await sharp(t.src).resize({ width: 1200, withoutEnlargement: true }).flatten({ background: "#ffffff" }).jpeg({ quality: 72 }).toFile(t.out);
        ogMade++;
      }
    } catch (err) {
      failed++;
      console.warn("skip", path.relative(OUT, t.out), String(err.message || err));
    }
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

console.log(`images: ${made} generated, ${skipped} cached, ${failed} failed (concurrency ${CONCURRENCY})`);
console.log(`og images: ${ogMade} generated, ${ogSkipped} cached`);
