// Import + optimize listing photos for a new property.
//
// Usage:
//   node scripts/import-photos.mjs <listing-id> <urls-file>
//   printf '%s\n' "$url1" "$url2" | node scripts/import-photos.mjs <listing-id> -
//
// <urls-file>: one image URL per line, highest-res variant. Downloads each,
// resizes to ≤2200px, re-encodes as optimized JPEG, and writes them as
// 01.jpg, 02.jpg … into assets/listings/<listing-id>/. Prints the ready-to-paste
// "image" + "gallery" JSON for the listing file. Photo #1 becomes the cover.

import { mkdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";

const __dir = dirname(fileURLToPath(import.meta.url));
const REPO = join(__dir, "../.."); // web/scripts -> repo root

const [, , id, urlsArg] = process.argv;
if (!id || !urlsArg) {
  console.error("usage: node scripts/import-photos.mjs <listing-id> <urls-file|->");
  process.exit(1);
}

const raw = urlsArg === "-" ? readFileSync(0, "utf8") : readFileSync(urlsArg, "utf8");
const urls = raw.split(/\r?\n/).map((s) => s.trim()).filter((s) => /^https?:\/\//.test(s));
if (!urls.length) {
  console.error("no image URLs found in input");
  process.exit(1);
}

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";

const dest = join(REPO, "assets/listings", id);
mkdirSync(dest, { recursive: true });

const gallery = [];
for (let i = 0; i < urls.length; i++) {
  const n = String(i + 1).padStart(2, "0");
  // Many CDNs gate on a same-site Referer — derive www.<rootdomain>.
  const host = new URL(urls[i]).hostname.split(".").slice(-2).join(".");
  try {
    const res = await fetch(urls[i], { headers: { "User-Agent": UA, Referer: `https://www.${host}/` } });
    if (!res.ok) {
      console.error(`  ${n}: HTTP ${res.status} — skipped`);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf).rotate().resize({ width: 2200, withoutEnlargement: true })
      .jpeg({ quality: 86, mozjpeg: true }).toFile(join(dest, `${n}.jpg`));
    gallery.push(`/assets/listings/${id}/${n}.jpg`);
    console.log(`  ${n}: ok (${Math.round(buf.length / 1024)}KB)`);
  } catch (e) {
    console.error(`  ${n}: ${e.message} — skipped`);
  }
}

console.log(`\nSaved ${gallery.length} photo(s) to assets/listings/${id}/`);
console.log("\nPaste into the listing's JSON:");
console.log(JSON.stringify({ image: gallery[0], gallery }, null, 2));
