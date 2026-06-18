// Elsewhere Living — content layer.
//
// Listings and rentals are stored as one JSON file per property under
// src/content/. Those files are what the /admin editor creates and edits, and
// what these functions read. Pages only ever call these helpers, never touch
// files directly.

import type { Listing, Rental, SiteContent } from "./types";
import siteLocal from "../data/site.json";

// Eagerly import every per-property file at build time.
const listingFiles = import.meta.glob<{ default: Listing }>("../content/listings/*.json", { eager: true });
const rentalFiles = import.meta.glob<{ default: Rental }>("../content/rentals/*.json", { eager: true });

// The id (and therefore the URL) is the file name, so the /admin editor can
// create a new property just by naming it — no separate id field to manage.
function collect<T extends { id?: string }>(files: Record<string, { default: T }>): T[] {
  return Object.entries(files).map(([path, m]) => {
    const id = path.split("/").pop()!.replace(/\.json$/, "");
    return { ...m.default, id };
  });
}

const LISTINGS: Listing[] = collect<Listing>(listingFiles);
const RENTALS: Rental[] = collect<Rental>(rentalFiles);

export async function getListings(): Promise<Listing[]> {
  return LISTINGS;
}

export async function getRentals(): Promise<Rental[]> {
  return RENTALS;
}

export async function getListing(id: string): Promise<Listing | undefined> {
  return LISTINGS.find((l) => l.id === id);
}

export async function getRental(id: string): Promise<Rental | undefined> {
  return RENTALS.find((r) => r.id === id);
}

/** Site-wide editorial content (markets, pillars, testimonials, contact…). */
export function getSiteContent(): SiteContent {
  return siteLocal as SiteContent;
}

/**
 * Homepage featured listings. Properties flagged `featured` in /admin are shown
 * first, ordered by `featuredOrder` (lower = earlier). If nothing is flagged, we
 * fall back to the most recently added listings so the row is never empty.
 */
export async function getFeaturedListings(n = 3): Promise<Listing[]> {
  const flagged = LISTINGS.filter((l) => l.featured).sort(
    (a, b) => (a.featuredOrder ?? 999) - (b.featuredOrder ?? 999)
  );
  if (flagged.length > 0) return flagged;
  return [...LISTINGS].sort((a, b) => (b.added ?? 0) - (a.added ?? 0)).slice(0, n);
}

/** Distinct markets present in the listing set, in MARKETS order. */
export async function getListingMarkets(): Promise<string[]> {
  const present = new Set(LISTINGS.map((l) => l.market));
  const ordered = getSiteContent().markets.map((m) => m.name).filter((m) => present.has(m));
  present.forEach((m) => { if (!ordered.includes(m)) ordered.push(m); });
  return ordered;
}
