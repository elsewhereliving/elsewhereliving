// Elsewhere Living — small formatting helpers, ported 1:1 from the original
// data.js so listing/rental display logic stays identical.

// View tags shown in priority order — most desirable first.
const VIEW_RANK = ["Beachfront", "Waterfront", "Sea View", "Mountain View", "City View", "Beachside", "Garden / Pool View"];
const viewRank = (v: string): number => {
  const i = VIEW_RANK.indexOf(v);
  return i === -1 ? VIEW_RANK.length : i;
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
