// Elsewhere Living — small formatting helpers, ported 1:1 from the original
// data.js so listing/rental display logic stays identical.

/** A `view` field may be a single tag or an array. Normalise to an array. */
export function viewList(v: string | string[] | undefined | null): string[] {
  return Array.isArray(v) ? v : v ? [v] : [];
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
