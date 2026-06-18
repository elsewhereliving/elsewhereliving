// Declares the per-property file folders so Astro doesn't auto-generate them
// (which prints a deprecation warning). The site reads these files via
// src/lib/content.ts; no schema validation is needed here.
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const listings = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/listings" }),
});
const rentals = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/rentals" }),
});

export const collections = { listings, rentals };
