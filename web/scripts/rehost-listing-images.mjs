// One-off: download every REMOTE (http) photo referenced by the for-sale
// listings into the site's own assets, and rewrite the listing JSON to point at
// the local copies. Rentals are left untouched. Re-runnable: already-downloaded
// files and already-local paths are skipped. Failures keep the original remote
// URL (so nothing breaks) and are reported at the end.
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const WEB = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REPO = path.resolve(WEB, "..");
const LISTINGS_DIR = path.join(WEB, "src/content/listings");
const ASSETS = path.join(REPO, "assets/listings");
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";
const CONCURRENCY = 8;
const pad = (n) => String(n).padStart(3, "0");

function headersFor(url) {
  const host = new URL(url).hostname;
  const h = { "User-Agent": UA, Accept: "image/avif,image/webp,image/*,*/*" };
  // exactdn hot-link protection only allows the parent portal's referer.
  if (/exactdn/.test(host)) h.Referer = "https://thailand-property.com/";
  return h;
}

// Download, then re-encode to a sensibly-sized JPEG (max 2200px) so giant
// originals don't bloat the repo. The build's optimizer makes the WebP variants.
async function download(url, destNoExt) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const ctrl = new AbortController();
      const to = setTimeout(() => ctrl.abort(), 45000);
      const res = await fetch(url, { headers: headersFor(url), redirect: "follow", signal: ctrl.signal });
      clearTimeout(to);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const raw = Buffer.from(await res.arrayBuffer());
      if (raw.length < 1024) throw new Error("too small (" + raw.length + "b)");
      const out = await sharp(raw).rotate().resize({ width: 2200, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
      const dest = destNoExt + ".jpg";
      await mkdir(path.dirname(dest), { recursive: true });
      await writeFile(dest, out);
      return dest;
    } catch (err) {
      if (attempt === 1) throw err;
      await new Promise((r) => setTimeout(r, 800));
    }
  }
}

// Build the work list: every (listing, field, remote url) to fetch.
const files = (await readdir(LISTINGS_DIR)).filter((f) => f.endsWith(".json"));
const listings = new Map();
for (const f of files) {
  const id = f.replace(/\.json$/, "");
  const data = JSON.parse(await readFile(path.join(LISTINGS_DIR, f), "utf8"));
  listings.set(id, data);
}

const jobs = [];
const urlToLocal = new Map(); // dedupe identical urls across a listing
let failures = [];

for (const [id, data] of listings) {
  const dir = path.join(ASSETS, id);
  let counter = 1;
  const remap = (url) => {
    if (typeof url !== "string" || !/^https?:/i.test(url)) return url; // already local
    if (urlToLocal.has(id + "|" + url)) return urlToLocal.get(id + "|" + url);
    const destNoExt = path.join(dir, "ext-" + pad(counter++));
    const job = { id, url, destNoExt };
    jobs.push(job);
    const placeholder = { __job: job };
    urlToLocal.set(id + "|" + url, placeholder);
    return placeholder;
  };
  // process gallery first so ordering is stable, then image
  if (Array.isArray(data.gallery)) data.gallery = data.gallery.map(remap);
  if (data.image) data.image = remap(data.image);
}

console.log(`To download: ${jobs.length} images across ${listings.size} listings.`);

let done = 0;
async function worker(slice) {
  for (const job of slice) {
    try {
      // skip if already downloaded for this slot
      const jpg = job.destNoExt + ".jpg";
      const dest = existsSync(jpg) ? jpg : await download(job.url, job.destNoExt);
      job.localPath = "/" + path.relative(REPO, dest).split(path.sep).join("/"); // /assets/listings/<id>/ext-NNN.ext
    } catch (err) {
      failures.push({ id: job.id, url: job.url, error: String(err.message || err) });
      job.localPath = job.url; // keep remote on failure
    }
    if (++done % 50 === 0) console.log(`  ${done}/${jobs.length}…`);
  }
}
const slices = Array.from({ length: CONCURRENCY }, (_, i) => jobs.filter((_, j) => j % CONCURRENCY === i));
await Promise.all(slices.map(worker));

// Resolve placeholders → local paths and write the JSON back.
const resolve = (v) => (v && typeof v === "object" && v.__job ? v.__job.localPath : v);
let written = 0;
for (const [id, data] of listings) {
  if (Array.isArray(data.gallery)) data.gallery = data.gallery.map(resolve);
  if (data.image) data.image = resolve(data.image);
  await writeFile(path.join(LISTINGS_DIR, id + ".json"), JSON.stringify(data, null, 2) + "\n");
  written++;
}

console.log(`\nDone. ${jobs.length - failures.length} downloaded, ${failures.length} failed, ${written} listing files updated.`);
if (failures.length) {
  console.log("Failures (kept remote):");
  for (const f of failures.slice(0, 40)) console.log("  " + f.id + "  " + f.url + "  — " + f.error);
  if (failures.length > 40) console.log(`  …and ${failures.length - 40} more`);
}
