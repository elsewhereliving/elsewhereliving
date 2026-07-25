// Free-text search shared by the property and rental browsers.
//
// Each browser builds a per-item "haystack" string from the fields a visitor
// would actually type — place/area, type, view tags, features, the pitch — then
// asks matchesTerms whether every query term appears in it (AND match).

/** Split a raw query into lowercased, whitespace-separated terms. */
export function searchTerms(q: string): string[] {
  return q.trim().toLowerCase().split(/\s+/).filter(Boolean);
}

/**
 * Does `haystack` satisfy every term? A term matches if it appears in the text
 * as typed OR in a space-stripped copy of it. That second pass is what makes
 * "seaview" find the "Sea View" tag and "bangtao" find "Bang Tao" — spacing and
 * compounding no longer change the results, which is the behaviour visitors
 * expect (previously "seaview" and "sea view" returned different counts).
 */
export function matchesTerms(haystack: string, terms: string[]): boolean {
  if (!terms.length) return true;
  const hay = haystack.toLowerCase();
  const compact = hay.replace(/\s+/g, "");
  return terms.every((t) => hay.includes(t) || compact.includes(t));
}
