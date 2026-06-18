---
name: import-listing
description: Import a property-for-sale (or rental) from a competitor listing URL such as JamesEdition — download its photos into the repo, extract the property details, and write an ORIGINAL title, short pitch and full description (never copying the source text or naming the property/agency). Use when the user pastes a listing URL and asks to add it as a property.
---

# Import a listing from a competitor URL

Goal: given a listing URL (e.g. JamesEdition), produce a new property file in
`web/src/content/listings/<id>.json` (or `web/src/content/rentals/<id>.json`)
with rehosted photos and **original** copy.

## 0. Setup
- Work in `web/`. Node lives at `~/.local/node-v22.12.0-darwin-arm64/bin` — run
  `export PATH="$HOME/.local/node-v22.12.0-darwin-arm64/bin:$PATH"` first.
- Pick a slug `<id>` that is descriptive and **omits any property/brand name**,
  e.g. `choeng-mon-hillside-5bed-seaview-villa`. The filename is the URL.

## 1. Open the page (bypasses Cloudflare)
JamesEdition (and similar) sit behind Cloudflare bot protection — `curl` and
WebFetch get a "Just a moment…" 403. Use the user's real Chrome via the
Claude-in-Chrome MCP:
- `list_connected_browsers` → confirm a browser is connected.
- `navigate` to the URL. If it redirects to a search page, navigate again.
- `get_page_text` for the headline, price, beds/baths, sizes, location,
  property type, year, and the "About the Property" description + features.

## 2. Collect ALL photo URLs
Open the full gallery so every photo loads, then read them from the DOM with
`javascript_tool`. JamesEdition photos are
`https://img.jamesedition.com/listing_images/<YYYY/MM/DD/HH/MM/SS/uuid>/je/2200xxs.jpg`
(2200 = highest res). Two gotchas:
- Returning URLs **with query strings** trips the MCP's data filter — strip to
  `origin+pathname`, or return just the `listing_images/<date/uuid>` folder ids.
- Scanning the whole page picks up "Similar Properties" photos too. Open this
  listing's **own gallery** ("Show all photos"), scroll it to load all images
  (`window.scrollTo` in a loop), then dedupe by folder id — you should get the
  exact count shown (e.g. "All Photos (12)").

Save the highest-res URLs (one per line) to a temp file, e.g. `/tmp/urls.txt`.

## 3. Download + optimize the photos (one command)
```
node scripts/import-photos.mjs <id> /tmp/urls.txt
```
This downloads each URL, resizes to ≤2200px, re-encodes optimized JPEG, writes
`assets/listings/<id>/01.jpg…`, and prints the `image` + `gallery` JSON. Photo
#1 is the cover — reorder the URLs first if a different shot is the best cover.

## 4. Write the listing file with ORIGINAL copy
Create `web/src/content/listings/<id>.json` matching the existing schema (copy a
neighbour like `taling-ngam-9rai-dual-view-seaview-land.json`). Key rules:
- **Rewrite** the `title`, `blurb` (short pitch), and `detail` (multi-paragraph,
  `\n\n` between paragraphs) in Elsewhere Living's restrained voice. Do **not**
  copy the source wording and **do not** mention the property's original name or
  the listing agency. Paragraphs in `detail` separated by blank lines.
- Price: set `priceOriginalNum` (number in its native currency) + `priceCurrency`
  (e.g. "USD"/"THB"). USD is computed automatically — never hardcode `price`.
- `market` must be one of: Koh Samui, Phuket, Bangkok, Bali, Dubai.
- `view`: subset of Sea View / Beachfront / Waterfront / City View / Mountain
  View / Garden / Pool View. `type`: Villa | Condominium | Land.
- `features`: array of `{ "l": label, "i": icon }`. Valid icons: sparkles, bed,
  bath, pool, view, waves, plot, tree, mountain, sun, key, home, building, car,
  shield, gym, music, sofa, utensils, terrace, users.
- `mapQuery`: "lat,lng" if known (shows a map); omit to hide it. JamesEdition
  hides exact coords — leave blank unless the user provides them.
- `added`: a sort weight (higher = nearer the top); ~75 for a fresh listing.
- Flag any judgement calls (status vs. year, assumed currency) to the user.

## 5. Build, preview, hand off
```
npm run build
```
Stage `dist/` into `/tmp/ewdist` and screenshot the new
`/property/<id>/` page to verify cover, gallery, price, specs and copy. Then
tell the user it's ready and to push via GitHub Desktop (Cloudflare auto-builds).
Do not commit/push unless asked — the owner reviews on localhost first.
