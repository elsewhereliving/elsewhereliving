// Elsewhere Living — content layer.
//
// Listings and rentals are stored as one JSON file per property under
// src/content/. Those files are what the /admin editor creates and edits, and
// what these functions read. Pages only ever call these helpers, never touch
// files directly.

import type { Listing, Rental, SiteContent } from "./types";
import siteLocal from "../data/site.json";
import homeLocal from "../data/home.json";
import { listingPrice, rentalPrice } from "./price";
import { VIEW_TAGS } from "./format";

// Eagerly import every per-property file at build time.
const listingFiles = import.meta.glob<{ default: Listing }>("../content/listings/*.json", { eager: true });
const rentalFiles = import.meta.glob<{ default: Rental }>("../content/rentals/*.json", { eager: true });

// The id (and therefore the URL) is the file name, so the /admin editor can
// create a new property just by naming it — no separate id field to manage.
function collect<T extends { id?: string }>(files: Record<string, { default: T }>, kind: string): T[] {
  return Object.entries(files).map(([path, m]) => {
    const id = path.split("/").pop()!.replace(/\.json$/, "");
    validateCreated(kind, id, (m.default as Record<string, unknown>).created);
    validateView(kind, id, (m.default as Record<string, unknown>).view);
    validateSize(kind, id, "interior", (m.default as Record<string, unknown>).interior);
    validateSize(kind, id, "plot", (m.default as Record<string, unknown>).plot);
    validateUnits(kind, id, m.default as Record<string, unknown>);
    return { ...m.default, id };
  });
}

// `view` may only use tags from the fixed brand vocabulary (VIEW_TAGS). Inventing
// a new one — "Garden View", "Ocean View" — used to silently create a one-off
// filter chip that matched a single property, so an unknown tag fails the build
// here with the list of what's allowed.
function validateView(kind: string, id: string, view: unknown): void {
  const tags = Array.isArray(view) ? view : view ? [view] : [];
  for (const t of tags) {
    if (!(VIEW_TAGS as readonly string[]).includes(t as string)) {
      throw new Error(
        `${kind} "${id}": unknown view tag ${JSON.stringify(t)}. ` +
          `Use only: ${VIEW_TAGS.join(", ")}. To add a new tag, extend VIEW_TAGS in lib/format.ts.`
      );
    }
  }
}

// `interior` and `plot` render verbatim in the spec row on property cards, which
// already labels them with icons — any wording ("425–680 m² built", "280 m²
// indoor · 400 m² total", "1,250 m² min") reads as clutter there. Strictly a
// number or range plus the unit; extra areas belong in `features` or `detail`.
const SIZE_RE = /^≈?\d[\d,.]*(\s?[–—-]\s?≈?\d[\d,.]*)?\+?\s?(m²|rai)$/;
function validateSize(kind: string, id: string, field: string, value: unknown): void {
  if (typeof value !== "string" || value === "" || value === "—") return;
  if (!SIZE_RE.test(value)) {
    throw new Error(
      `${kind} "${id}": "${field}" is not a bare size (${JSON.stringify(value)}). ` +
        `Numbers + unit only — "450 m²", "425–680 m²", "≈700 m²", "403+ m²", "1 rai", or "—". ` +
        `No words (built/indoor/total/min/from…): the card supplies the labelling; extra areas go in features or detail.`
    );
  }
}

// Areas are written "m²" everywhere on the site — titles, blurbs, details,
// feature labels. "sqm" / "sq.m." variants used to slip in from source listings
// pasted into imports, so any string field containing one fails the build.
function validateUnits(kind: string, id: string, rec: Record<string, unknown>): void {
  const check = (field: string, value: unknown) => {
    if (typeof value !== "string") return;
    const hit = value.match(/\bsq\.?\s?m\b\.?|\bsqm\b/i);
    if (hit) {
      throw new Error(
        `${kind} "${id}": "${field}" contains ${JSON.stringify(hit[0])} (…${JSON.stringify(
          value.slice(Math.max(0, hit.index! - 20), hit.index! + 20)
        )}…). Always write areas as "m²", never "sqm"/"sq.m.".`
      );
    }
  };
  for (const [field, value] of Object.entries(rec)) {
    check(field, value);
    if (field === "features" && Array.isArray(value)) {
      value.forEach((f, i) => check(`features[${i}].l`, (f as Record<string, unknown>)?.l));
    }
  }
}

// `created` (epoch milliseconds) is the sole recency key for the "Newest" sort.
// A missing value silently sank new properties to the bottom, and hand-picked
// future values pushed everything added later below them — so both fail the
// build here with instructions instead.
function validateCreated(kind: string, id: string, created: unknown): void {
  const fix = `Set "created" to the current epoch milliseconds (node -e 'console.log(Date.now())').`;
  if (typeof created !== "number" || created < 1_000_000_000_000) {
    throw new Error(`${kind} "${id}": missing or invalid "created" (${JSON.stringify(created)}). ${fix}`);
  }
  if (created > Date.now() + 48 * 3600 * 1000) {
    throw new Error(
      `${kind} "${id}": "created" is in the future (${new Date(created).toISOString()}). ` +
        `Never invent or round timestamps. ${fix}`
    );
  }
}

// Each property stores its price in its native currency; the USD figures shown
// on the site are computed here from the latest exchange rates (refreshed at
// the start of every build). All display/sort/filter code reads these computed
// fields, so nothing downstream needs to know about currencies.
// `internalName` is a Studio-only label (the real villa name). It must never
// reach a public page — not even serialized into a React island's props — so
// the public getters strip it. The Studio uses the *Admin getters, which keep it.
const stripInternal = <T extends Record<string, any>>(r: T): T => {
  const { internalName, ...rest } = r;
  return rest as T;
};
const LISTINGS_RAW: Listing[] = collect<Listing>(listingFiles, "Listing").map((l) => ({ ...l, ...listingPrice(l) }));
const RENTALS_RAW: Rental[] = collect<Rental>(rentalFiles, "Rental").map((r) => ({ ...r, ...rentalPrice(r) }));
const LISTINGS: Listing[] = LISTINGS_RAW.map(stripInternal);
const RENTALS: Rental[] = RENTALS_RAW.map(stripInternal);

export async function getListings(): Promise<Listing[]> {
  return LISTINGS;
}

export async function getRentals(): Promise<Rental[]> {
  return RENTALS;
}

// Studio-only: full records including `internalName`.
export async function getListingsAdmin(): Promise<Listing[]> {
  return LISTINGS_RAW;
}

export async function getRentalsAdmin(): Promise<Rental[]> {
  return RENTALS_RAW;
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
  const rank = (l: Listing) => (l as any).featuredRank ?? l.featuredOrder ?? 999;
  // Tie-break on id so a stray duplicate rank can never randomise the order.
  const flagged = LISTINGS.filter((l) => l.featured).sort((a, b) => rank(a) - rank(b) || a.id.localeCompare(b.id));
  if (flagged.length > 0) return flagged.slice(0, n);
  return [...LISTINGS].sort((a, b) => (b.created ?? 0) - (a.created ?? 0)).slice(0, n);
}

/** How many featured listings the homepage "collection" shows (set in /admin). */
export function getHomeFeaturedCount(): number {
  return (homeLocal as { count?: number }).count || 3;
}

/** Distinct markets present in the listing set, in MARKETS order. */
export async function getListingMarkets(): Promise<string[]> {
  const present = new Set(LISTINGS.map((l) => l.market));
  const ordered = getSiteContent().markets.map((m) => m.name).filter((m) => present.has(m));
  present.forEach((m) => { if (!ordered.includes(m)) ordered.push(m); });
  return ordered;
}
