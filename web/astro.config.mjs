// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

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
    resolve: {
      // Let Vite follow the symlinked public/assets without complaint.
      preserveSymlinks: false,
    },
  },
});
