// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

// Concurrent Claude/dev sessions run `astro dev` on different ports against
// this same checkout. If they share one Vite cache, a dep re-optimize in one
// server 404s the other's chunk URLs and every island silently fails to
// hydrate. Key the cache by port so each dev server gets its own.
const portFlag = process.argv.indexOf("--port");
const devPort = portFlag > -1 ? process.argv[portFlag + 1] : "default";

// Elsewhere Living — Astro configuration.
//
// Output is fully static: every page (including all property/[id] and
// rentals/[id] detail pages) is prerendered at build time for speed and SEO.
// React is used only for the interactive "islands" (nav, gallery, filters,
// save, contact form). Listings are edited through /admin and the site
// rebuilds automatically on the host (Netlify). The contact form uses Netlify
// Forms — no server code to manage.
export default defineConfig({
  site: "https://elsewhere.living",
  integrations: [react(), sitemap()],
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
