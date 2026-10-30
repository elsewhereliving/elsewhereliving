// Off-Plan Investment Hub (/invest/) — turns live listings into the flat
// "unit" records the shortlist engine ranks. Nothing here holds its own copy of
// a price: every unit is a public listing with status Off-Plan whose computed
// USD price is at or under INVEST_LIMIT, so editing a listing updates the hub.

import type { Listing } from "./types";
import { statusList, viewList, locality, bedsMax, VIEW_TAGS } from "./format";
import { optImg } from "./img";

export const INVEST_MAX = 300_000;
// Prices are stored in THB/IDR and converted at today's rate, so a project
// priced right at the cap drifts above or below it with the exchange rate.
// Anything up to 10% over still belongs in the hub.
export const INVEST_TOLERANCE = 0.1;
export const INVEST_LIMIT = INVEST_MAX * (1 + INVEST_TOLERANCE);
// The hub never shows unit types above 3 bedrooms (bigger units in the same
// project are priced above the cap).
const BEDS_CAP = 3;

export type Tenure = "Freehold" | "Leasehold";

/** A developer projection — never shown as a bare number. */
export interface RoiProjection {
  /** Low end of the stated rate, used for ranking. */
  rate: number;
  kind: "net" | "gross" | null;
  /** "11–13% net · developer projection" */
  text: string;
}

/** A guaranteed return — its term or condition always travels with it. */
export interface RoiGuarantee {
  rate: number;
  /** Years it covers, e.g. 5 ("first 5 years"). */
  years: number | null;
  /** Condition, e.g. "with the developer's management programme". */
  note: string | null;
  /** "10% guaranteed · first 5 years" */
  text: string;
}

/** A project can offer a projection, a guarantee, or both (opt-in programme). */
export interface Roi {
  projected: RoiProjection | null;
  guaranteed: RoiGuarantee | null;
  /** Best headline rate across both, for the yield ranking. */
  rate: number;
}

export interface HubUnit {
  id: string;
  href: string;
  title: string;
  image: string;
  imageFocal?: string;
  market: string;
  area: string;
  country: string;
  kind: "condo" | "villa";
  /** Tenures the project offers, from the listing's ownership field — a
   *  project sold as "Freehold or Leasehold" carries both. */
  tenure: Tenure[];
  /** Freehold is one of the options. */
  freehold: boolean;
  priceNum: number;
  price: string;
  priceOriginal?: string;
  /** 0 = studio. */
  bedsMin: number;
  bedsMax: number;
  bedsText: string;
  interior?: string;
  /** Smallest unit size in m², for m²-per-dollar. */
  sizeMin: number | null;
  /** The unit views on offer (what the View row and tiebreak use). */
  views: string[];
  /** On the beach — a project trait shown with the location, not a unit view. */
  beachfront: boolean;
  /** Index of the best view in VIEW_TAGS — lower is better. */
  viewRank: number;
  completion: string | null;
  completionYear: number | null;
  /** Sortable handover date: "Q2 2027" → 2027.25 (end of quarter); a bare
   *  year counts as its year end, so a stated quarter sorts ahead of it. */
  completionKey: number | null;
  roi: Roi | null;
  /** The listing's `highlight` — its "why it fits" line, used ahead of the
   *  generated ones. Shown on the property page too. */
  highlight?: string;
}


const num = (s: string) => Number(s.replace(/,/g, ""));

// The listing's `yield` field is free text, one claim per "·"-separated
// segment: "10% ROI guaranteed · first 5 years", "11–13% net projected · or 8%
// guaranteed with the developer's management programme". A segment with a % is
// a projection or (if it says "guarant") a guarantee; a segment without one
// qualifies the claim before it ("first 5 years").
const PCT = /~?\d+(?:\.\d+)?(?:\s*[–-]\s*\d+(?:\.\d+)?)?%/;
function parseRoi(y: string | undefined): Roi | null {
  if (!y) return null;
  let projected: RoiProjection | null = null;
  let guaranteed: RoiGuarantee | null = null;
  let last: "p" | "g" | null = null;
  for (const seg of y.split(/\s*·\s*/)) {
    const low = seg.toLowerCase();
    const m = seg.match(PCT);
    const yrs = low.match(/(\d+)\s*(?:years?|yrs?)/);
    if (m && low.includes("guarant")) {
      const rest = seg.slice(seg.indexOf(m[0]) + m[0].length).replace(/^\s*(?:roi|return)?\s*guaranteed\s*/i, "").trim();
      guaranteed = { rate: parseFloat(m[0].replace("~", "")), years: yrs ? Number(yrs[1]) : null, note: rest && !yrs ? rest : null, text: "" };
      last = "g";
    } else if (m && !projected) {
      const kind = /\bnet\b/.test(low) ? "net" : /\bgross\b/.test(low) ? "gross" : null;
      projected = { rate: parseFloat(m[0].replace("~", "")), kind, text: `${m[0]}${kind ? ` ${kind}` : ""} · developer projection` };
      last = "p";
    } else if (!m && last === "g" && guaranteed) {
      if (yrs) guaranteed.years = Number(yrs[1]);
      else guaranteed.note = seg.trim();
    }
  }
  if (guaranteed) {
    const g = guaranteed;
    g.text = `${g.rate}% guaranteed${g.years ? ` · first ${g.years} years` : g.note ? ` · ${g.note.replace(/^(with|when|if|by)\s+(joining\s+)?/i, "via ")}` : ""}`;
  }
  if (!projected && !guaranteed) return null;
  return { projected, guaranteed, rate: Math.max(projected?.rate ?? 0, guaranteed?.rate ?? 0) };
}

function parseBeds(l: Listing): { min: number; max: number; text: string } {
  const label = String(l.bedsLabel || l.beds || "").replace(/\s*bed(room)?s?\b/i, "").trim();
  const studio = /studio/i.test(label);
  const nums = label.match(/\d+/g)?.map(Number) ?? [];
  const min = studio ? 0 : nums.length ? nums[0] : Number(l.beds) || 0;
  // "2+1" is a 2-bed with a den, not a 3-bed.
  const max = Math.min(BEDS_CAP, /^\d+\+\d/.test(label) ? min : bedsMax(l));
  const name = (n: number) => (n === 0 ? "Studio" : String(n));
  const text = max > min ? `${name(min)}–${max}` : name(min);
  return { min, max: Math.max(min, max), text };
}

export function toHubUnit(l: Listing): HubUnit {
  const country = (l.location || "").split(" · ").pop() || "";
  const kind = l.type === "Villa" ? "villa" : "condo";
  const tenure = (["Freehold", "Leasehold"] as Tenure[]).filter((t) => (l.ownership || "").includes(t));
  const beds = parseBeds(l);
  const size = (l.interior || "").match(/\d[\d,.]*/);
  const views = viewList(l.view);
  const beachfront = views.some((t) => t === "Beachfront" || t === "Waterfront" || t === "Beachside");
  // A condo's "from" price buys its entry unit, not its best view — rank it on
  // the weakest view it lists (tag "Garden / Pool View" on the listing when the
  // cheaper units face the gardens).
  const rankView = kind === "condo" ? views[views.length - 1] : views[0];
  const best = rankView ? VIEW_TAGS.indexOf(rankView as (typeof VIEW_TAGS)[number]) : VIEW_TAGS.length;
  const completion = l.year ? String(l.year) : null;
  const cy = completion?.match(/20\d\d/);
  return {
    id: l.id,
    href: `/property/${l.id}/`,
    title: l.title,
    image: optImg(l.image, "main"),
    imageFocal: l.imageFocal,
    market: l.market,
    area: locality(l.location),
    country,
    kind,
    tenure,
    freehold: tenure.includes("Freehold"),
    priceNum: l.priceNum,
    price: l.price,
    priceOriginal: l.priceOriginal,
    bedsMin: beds.min,
    bedsMax: beds.max,
    bedsText: beds.text,
    interior: l.interior || undefined,
    sizeMin: size ? num(size[0]) : null,
    views,
    beachfront,
    viewRank: best === -1 ? VIEW_TAGS.length : best,
    completion,
    completionYear: cy ? Number(cy[0]) : null,
    completionKey: cy ? Number(cy[0]) + (completion!.match(/Q([1-4])/i) ? Number(completion!.match(/Q([1-4])/i)![1]) / 4 : 1) : null,
    roi: parseRoi(l.yield),
    highlight: l.highlight || undefined,
  };
}

/** Every public off-plan listing priced at or under the hub's cap. */
export function getHubUnits(listings: Listing[]): HubUnit[] {
  return listings
    .filter((l) => statusList(l.status).includes("Off-Plan") && l.priceNum > 0 && l.priceNum <= INVEST_LIMIT)
    .map(toHubUnit)
    .sort((a, b) => a.priceNum - b.priceNum);
}
