// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { readdirSync, readFileSync } from "node:fs";

// Concurrent Claude/dev sessions run `astro dev` on different ports against
// this same checkout. If they share one Vite cache, a dep re-optimize in one
// server 404s the other's chunk URLs and every island silently fails to
// hydrate. Key the cache by port so each dev server gets its own.
const portFlag = process.argv.indexOf("--port");
const devPort = portFlag > -1 ? process.argv[portFlag + 1] : "default";

// /property/<id>/ paths of every listing flagged `offMarket` (read straight from
// the content files — the config runs before Astro's content layer exists).
const listingsDir = new URL("./src/content/listings/", import.meta.url);
const offMarketPaths = readdirSync(listingsDir)
  .filter((f) => f.endsWith(".json"))
  .filter((f) => JSON.parse(readFileSync(new URL(f, listingsDir), "utf8")).offMarket)
  .map((f) => `/property/${f.replace(/\.json$/, "")}/`);

// Elsewhere Living — Astro configuration.
//
// Output is fully static: every page (including all property/[id] and
// rentals/[id] detail pages) is prerendered at build time for speed and SEO.
// React is used only for the interactive "islands" (nav, gallery, filters,
// save, contact form). Listings are edited through /admin and the site
// rebuilds automatically on the host (Cloudflare Pages). The contact form is
// mailto/WhatsApp only — no server code to manage.
export default defineConfig({
  site: "https://elsewhere.living",
  integrations: [
    react(),
    sitemap({
      // Off-market listings are reachable only by their direct link — keep
      // them out of the sitemap so search engines never learn the URL.
      filter: (page) => !offMarketPaths.some((p) => page.includes(p)),
    }),
  ],
  output: "static",
  build: {
    format: "directory", // /property/<id>/  → /property/<id>/index.html
  },
  image: {
    // Listing imagery is large and already optimized; serve as-is and allow
    // the remote rental galleries (samujana.com et al.).
    remotePatterns: [{ protocol: "https" }],
  },
  vite: {
    cacheDir: `node_modules/.vite-${devPort}`,
    resolve: {
      // Let Vite follow the symlinked public/assets without complaint.
      preserveSymlinks: false,
    },
  },
});
