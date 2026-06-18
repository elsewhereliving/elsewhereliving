# Elsewhere Living — Website

The Elsewhere Living site, rebuilt so the owner can **manage listings through a
simple login** — no code, no developer for day-to-day changes.

**Owner:** to add/edit listings, see **[HOW-TO-EDIT-LISTINGS.md](./HOW-TO-EDIT-LISTINGS.md)**.

---

## How it works (the short version)

- The site is built with **Astro** (fast, static pages) + a little **React** for
  the interactive bits (gallery, filters, save, contact form).
- Listings live as **one small file per property** in `src/content/`. Those
  files are edited through the **/admin** editor (Decap CMS) — a friendly
  form-based login on the site itself.
- Hosting is **Cloudflare Pages**. When a listing is saved in /admin it commits
  to GitHub, and Cloudflare rebuilds + publishes automatically (~couple of min).
  The `/admin` login uses **GitHub** (handled by `functions/auth.ts` +
  `functions/callback.ts`). See **DEPLOY.md**.
- The contact form opens the visitor's **email / WhatsApp** pre-filled — no
  backend, no stored submissions, nothing to maintain.

No WordPress, no databases, no separate services.

**Photos** are optimized for speed: `scripts/optimize-images.mjs` (sharp) generates
small + medium **WebP** variants into `public/_img/` (gitignored, rebuilt by
`npm run build`; run `npm run images` to refresh manually). Cards and gallery
thumbnails use the small variant; the gallery loads photos on demand rather than
all at once. Remote photos (some rentals) pass through untouched.

---

## Running it locally (for a developer)

Node 18+ required. (This machine had none; a local Node 22 lives at
`~/.local/node-v22.12.0-darwin-arm64` — add its `bin` to `PATH`.)

```bash
cd web
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/
```

> `web/public/assets` and `web/public/_ds` are symlinks to the repo's `/assets`
> (imagery) and `/_ds` (the design-system tokens + fonts). The build follows
> them. Keep them if you move `web/`.

---

## Structure

```
web/
├─ public/
│  ├─ admin/                 The /admin editor (Decap CMS) + its config.yml
│  ├─ assets → ../../assets  (symlink: photos, logos)
│  └─ _ds → ../../_ds        (symlink: design tokens + fonts)
└─ src/
   ├─ content/
   │  ├─ listings/<slug>.json   one file per property  ← edited via /admin
   │  └─ rentals/<slug>.json    one file per rental     ← edited via /admin
   ├─ data/site.json            markets, pillars, testimonials, contact text
   ├─ lib/                      content.ts (reads the files), cards, format, types
   ├─ layouts/Base.astro        head/SEO, fonts, nav, footer
   ├─ components/               Astro + React (react/) components
   └─ pages/                    home, properties, property/[id], rentals,
                                rentals/[id], custom-homes, about, contact,
                                saved, privacy, 404
```

A property's **file name is its URL** (`baan-sang.json` → `/property/baan-sang/`),
so creating a listing in /admin just means naming it.

---

## Deploying to Cloudflare Pages

Full click-by-click (first-timer friendly) is in **[DEPLOY.md](./DEPLOY.md)**. In short:

1. Push this repo to GitHub.
2. Cloudflare → **Workers & Pages → Create → Pages → Connect to Git** → pick the repo.
3. Build settings: **Root directory** `web`, **Build command** `npm run build`,
   **Output** `dist`.
4. Add a custom domain (`elsewhere.living`).
5. Turn on `/admin` editing: create a GitHub OAuth app (callback
   `https://elsewhere.living/callback`) and set `GITHUB_CLIENT_ID` /
   `GITHUB_CLIENT_SECRET` as Cloudflare environment variables.

Every listing change in /admin commits to GitHub and triggers a Cloudflare rebuild.
