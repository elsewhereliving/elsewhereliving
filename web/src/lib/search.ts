// Free-text search shared by the property and rental browsers.
//
// Each browser builds a per-item "haystack" string from the fields a visitor
// would actually type — place/area, type, view tags, features, the pitch — then
// asks matchesTerms whether every query term appears in it (AND match).

/** Split a raw query into lowercased, whitespace-separated terms. */
export function searchTerms(q: string): string[] {
  return q.trim().toLowerCase().split(/\s+/).filter(Boolean);
}

// Some phrases a visitor types are really a request for a specific view tag, not
// loose free text. "sea view" / "ocean view" are the worst offenders: the word
// "view" appears in every view tag (incl. "Garden / Pool View") and "sea"/"ocean"
// turn up in plenty of blurbs, so plain term matching surfaces garden villas.
// These phrases are lifted out of the text and matched against the exact `view`
// tag instead. Longer phrases are listed first so "sea views" wins over "sea".
const VIEW_SYNONYMS: { tag: string; phrases: string[] }[] = [
  {
    tag: "Sea View",
    phrases: ["sea views", "seaviews", "ocean views", "oceanviews", "sea view", "seaview", "ocean view", "oceanview"],
  },
];

/**
 * Parse a raw query into exact view-tag requirements plus leftover free-text
 * terms. Any recognised view phrase (e.g. "sea view", "ocean view") is removed
 * from the text and returned as a required tag, so it matches only properties
 * actually tagged with that view — while the rest of the query ("phuket", a
 * villa name, a feature) still runs through the normal free-text matcher. So
 * "phuket sea view" becomes: tag "Sea View" AND free-text "phuket".
 */
export function parseQuery(q: string): { tags: string[]; terms: string[] } {
  let s = " " + q.trim().toLowerCase().replace(/\s+/g, " ") + " ";
  const tags: string[] = [];
  for (const { tag, phrases } of VIEW_SYNONYMS) {
    for (const p of phrases) {
      if (s.includes(" " + p + " ")) {
        if (!tags.includes(tag)) tags.push(tag);
        s = s.split(" " + p + " ").join(" ");
      }
    }
  }
  return { tags, terms: s.trim().split(/\s+/).filter(Boolean) };
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
