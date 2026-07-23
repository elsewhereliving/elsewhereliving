// Elsewhere Living — small formatting helpers, ported 1:1 from the original
// data.js so listing/rental display logic stays identical.

// The ONLY view tags a property may use, in priority order — most desirable
// first. This array is the single source of truth for two things:
//   1. The allowed vocabulary. content.ts validates every listing/rental `view`
//      against it at build time, so a typo or a new coinage like "Garden View"
//      fails the build instead of leaking a one-off tag onto the site.
//   2. The hierarchy. viewList sorts by this order, so a property that is both
//      "Beachfront" and "Sea View" shows "Beachfront" first, and the card badges
//      (capped at 2) keep the strongest views.
// To add a tag, add it here in its correct rank position — nowhere else.
export const VIEW_TAGS = [
  "Beachfront",
  "Waterfront",
  "Sea View",
  "Lake View",
  "Mountain View",
  "City View",
  "Beachside",
  "Garden / Pool View",
] as const;

// The ONLY values a listing's `ownership` field may hold. It renders verbatim in
// the spec row on property cards, so — like `view` — it is a fixed vocabulary,
// not free text: content.ts validates every listing against it at build time, so
// a one-off phrasing ("30-Year Leasehold", "Freehold · Chanote title",
// "Leasehold, Superficies or Thai Company") fails the build instead of cluttering
// the card. Any nuance (lease term, title type, holding structure) belongs in the
// listing's `detail`, never here. An empty string is allowed and hides the row.
// To add a value, add it here — nowhere else.
export const OWNERSHIP_OPTIONS = ["Freehold", "Leasehold", "Freehold or Leasehold"] as const;

const viewRank = (v: string): number => {
  const i = VIEW_TAGS.indexOf(v as (typeof VIEW_TAGS)[number]);
  return i === -1 ? VIEW_TAGS.length : i;
};

/** A `view` field may be a single tag or an array. Normalise to a rank-sorted array. */
export function viewList(v: string | string[] | undefined | null): string[] {
  const arr = Array.isArray(v) ? v : v ? [v] : [];
  return [...arr].sort((a, b) => viewRank(a) - viewRank(b));
}

/** The view tags to show on a property card — top-ranked, capped (default 2). */
export function viewBadges(v: string | string[] | undefined | null, max = 2): string[] {
  return viewList(v).slice(0, max);
}

/** Join view tags with the brand's middot separator. */
export function viewText(v: string | string[] | undefined | null): string {
  return viewList(v).join(" · ");
}

// `status` is usually a single value ("Move-In Ready" / "Off-Plan"), but a
// mixed-availability development can hold both — some units ready, others still
// off-plan. Normalise either shape to a list so cards, the property page and the
// status filter can all show/match every status a property carries.
export function statusList(s: string | string[] | undefined | null): string[] {
  const arr = Array.isArray(s) ? s : s ? [s] : [];
  return arr.filter(Boolean);
}

/**
 * Rental destination key. For "Sub-area · Region · Country" use the Region;
 * otherwise the first segment.
 */
export function rentDest(loc: string | undefined): string {
  const p = (loc || "").split(" · ").filter(Boolean);
  return p.length >= 3 ? p[p.length - 2] : p[0] || "";
}

/** First segment of a "A · B · C" location string — the locality. */
export function locality(loc: string | undefined): string {
  return (loc || "").split(" · ").filter(Boolean)[0] || "";
}
