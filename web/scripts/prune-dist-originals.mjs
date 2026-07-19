// Removes original listing photos from the build output that nothing needs at
// runtime, keeping the deployment under Cloudflare Pages' 20,000-file limit.
//
// Pages serve the optimized WebP variants (see scripts/optimize-images.mjs) —
// cards, the gallery and its full-screen zoom all go through optImg(), and the
// `og:image` / `twitter:image` social-preview tags point at the generated
// ~1200px `-og.jpg` cover variants (WhatsApp drops previews over ~600 KB).
// Normally nothing references an original anymore; the keep-set below exists
// for whatever still does.
//
// Rather than re-deriving which photo that is from the content JSON (which can
// drift from what was actually built), the keep-set is read back out of the
// generated HTML: whatever the pages really reference is what ships.
//
// Runs after `astro build` (see package.json "build"). It only ever touches
// dist/ — the source photos under /assets are never modified.
//
// Safety invariant: an original is deleted ONLY if it is unreferenced AND both
// of its WebP variants exist in the output. If a conversion failed, the
// original stays, so this cannot turn a working image into a broken one.
import { readdir, stat, unlink, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const IMG = path.join(DIST, "_img");
const LISTING_ASSETS = path.join(DIST, "assets", "listings");
const WIDTHS = [480, 1366];
const LIMIT = 20000;

if (!existsSync(DIST)) {
  console.error("prune: no dist/ — run astro build first");
  process.exit(1);
}

async function* walk(dir) {
  let entries;
  try { entries = await readdir(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    const s = await stat(full).catch(() => null);
    if (s?.isDirectory()) yield* walk(full);
    else if (s?.isFile()) yield full;
  }
}

// Every /assets/ image the built pages actually point at.
//
// `onerror` fallbacks are stripped first: those name the original purely as a
// backstop for a missing WebP, so counting them would keep every photo and
// defeat the pruning. Hydration data in <astro-island props="…"> is likewise
// not a reference — it is HTML-escaped (&quot;), so it never matches here, and
// the client maps those paths through optImg() to the WebPs anyway.
async function referencedPaths() {
  const refs = new Set();
  const add = (p) => { if (p.startsWith("/assets/")) refs.add(decodeURI(p.split("?")[0])); };

  for await (const file of walk(DIST)) {
    if (!file.endsWith(".html")) continue;
    const html = (await readFile(file, "utf8")).replace(/\sonerror="[^"]*"/gi, "");

    for (const m of html.matchAll(/<meta[^>]+content="https:\/\/elsewhere\.living(\/[^"]+)"/gi)) add(m[1]);
    for (const m of html.matchAll(/<(?:img|source)[^>]+?\ssrc="([^"]+)"/gi)) add(m[1]);
    for (const m of html.matchAll(/\ssrcset="([^"]+)"/gi)) {
      for (const c of m[1].split(",")) add(c.trim().split(/\s+/)[0] ?? "");
    }
    for (const m of html.matchAll(/url\((['"]?)([^)'"]+)\1\)/gi)) add(m[2]);
  }
  return refs;
}

const referenced = await referencedPaths();
let removed = 0, keptReferenced = 0, keptUnoptimized = 0, bytes = 0;

for await (const file of walk(LISTING_ASSETS)) {
  if (!/\.jpe?g$/i.test(file)) continue; // only JPGs are fully covered by the WebP pipeline

  const webPath = "/" + path.relative(DIST, file).split(path.sep).join("/");
  if (referenced.has(webPath)) { keptReferenced++; continue; }

  const base = webPath.replace(/\.(jpe?g)$/i, "");
  const hasAllVariants = WIDTHS.every((w) =>
    existsSync(path.join(IMG, ...`${base}-${w}.webp`.split("/").filter(Boolean)))
  );
  if (!hasAllVariants) { keptUnoptimized++; continue; }

  const s = await stat(file).catch(() => null);
  await unlink(file);
  removed++;
  bytes += s?.size ?? 0;
}

let total = 0;
for await (const _ of walk(DIST)) total++;

console.log(
  `prune: removed ${removed} unreferenced originals (${(bytes / 1024 ** 3).toFixed(2)} GB), ` +
  `kept ${keptReferenced} referenced` +
  (keptUnoptimized ? `, kept ${keptUnoptimized} lacking WebP variants` : "")
);
console.log(`prune: ${total} files in dist (Cloudflare Pages limit ${LIMIT})`);

if (total > LIMIT) {
  console.error("prune: FAIL — still over the file limit; the deploy would be rejected");
  process.exit(1);
}
