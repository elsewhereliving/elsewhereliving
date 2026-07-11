// The Studio's AI bridge. The studio is fully client-side (no backend), so we
// call the Anthropic API straight from the browser — the owner's API key lives
// only in this browser's localStorage, exactly like the repo-folder grant.
// The model reads dropped photos + pasted notes and fills the form through a
// forced-schema tool call, so no fragile JSON parsing is needed.
import { VIEW_TAGS } from "../../lib/format";
import type { Rec } from "./store";

export const AI_MODEL = "claude-sonnet-5";
const KEY_LS = "ew-studio-ai-key";

export const getAiKey = (): string => {
  try { return localStorage.getItem(KEY_LS) || ""; } catch { return ""; }
};
export const setAiKey = (k: string) => {
  try { k ? localStorage.setItem(KEY_LS, k) : localStorage.removeItem(KEY_LS); } catch {}
};

// ---- what the model may fill ------------------------------------------------
export const FEATURE_ICONS = ["sparkles", "bed", "bath", "pool", "view", "waves", "plot", "tree", "mountain", "sun", "key", "home", "building", "car", "shield", "gym", "music", "sofa", "utensils", "terrace", "users"];
// The site's fixed view vocabulary — imported so the studio can never drift
// from the build-time validator in lib/content.ts.
const VIEWS = [...VIEW_TAGS];
const CURRENCIES = ["USD", "THB", "EUR", "IDR", "AED", "GBP", "SGD", "AUD", "CHF"];

const S = (description: string) => ({ type: "string", description });
const N = (description: string) => ({ type: "number", description });

function toolFor(isRental: boolean, markets: string[]) {
  const common: Record<string, any> = {
    collectionWarning: S(isRental
      ? "Set ONLY if the material clearly describes a property FOR SALE (asking price, freehold/leasehold, chanote title, off-plan payment plan) rather than a holiday rental. One sentence to the owner saying what you noticed. Otherwise omit."
      : "Set ONLY if the material clearly describes a HOLIDAY RENTAL (nightly/weekly rates, guest capacity, included staff or breakfast, check-in terms) rather than a property for sale. One sentence to the owner saying what you noticed. Otherwise omit."),
    internalName: S("The property's REAL name if known (villa/project name). Studio-internal — never shown on the site."),
    title: S("Original, descriptive display title in the house style, e.g. 'Chaweng Noi Four-Level Sea-View Villa'. Do not copy a source headline."),
    location: S("Format: 'Area · Island/City · Country', e.g. 'Bang Tao · Phuket · Thailand'."),
    place: S("Fuller address line for the map label, e.g. 'Cherngtalay, Thalang District, Phuket 83110'."),
    mapQuery: S("'lat,lng' with 6 decimals, ONLY if coordinates were given or the exact named place is unambiguous. Never guess."),
    view: { type: "array", items: { type: "string", enum: VIEWS }, description: "Only views clearly evidenced by photos or notes." },
    beds: { type: "integer", description: "Bedroom count." },
    bedsLabel: S("Optional label when a plain count misleads, e.g. '3 – Penthouse'."),
    baths: S("Bathroom count as text, e.g. '4' or '3+'."),
    blurb: S("The short pitch: ONE sentence, ~35–55 words, restrained and specific. Original copy — never source wording."),
    detail: S("Full description: 2–4 paragraphs separated by \\n\\n. Original copy in the restrained house voice."),
    features: {
      type: "array",
      description: "6–12 short highlights. Labels concrete and specific (e.g. 'Horizon-edge infinity pool'), 40 chars max.",
      items: {
        type: "object",
        properties: { l: S("Feature label"), i: { type: "string", enum: FEATURE_ICONS, description: "Icon key" } },
        required: ["l", "i"],
      },
    },
  };
  const sale: Record<string, any> = {
    market: { type: "string", enum: markets.length ? markets : ["Koh Samui", "Phuket", "Bangkok", "Bali", "Dubai"] },
    type: { type: "string", enum: ["Villa", "Condominium", "Land"] },
    status: { type: "string", enum: ["Move-In Ready", "Off-Plan"] },
    interior: S("Interior size, strictly number/range + unit: '450 m²', '425–680 m²', '≈700 m²'. NO words (built/indoor/total…) — a second area goes in features or detail. Use '—' for land."),
    plot: S("Plot / land size, strictly number/range + unit: '1,600 m²', '403+ m²', '1 rai'. NO words (min/from/…)."),
    year: { type: "integer", description: "Completion year — built or expected." },
    ownership: { type: "string", enum: ["Freehold", "Leasehold", "Freehold or Leasehold"] },
    priceOriginalNum: N("Asking price as a plain number in its NATIVE currency, e.g. 45000000. Never convert — USD is computed at build time."),
    priceCurrency: { type: "string", enum: CURRENCIES, description: "Native currency of priceOriginalNum." },
    priceFrom: { type: "boolean", description: "true when it's a 'from' price (multiple units)." },
  };
  const rental: Record<string, any> = {
    sleeps: S("e.g. 'up to 12 guests · 6 bedrooms'."),
    guests: { type: "integer", description: "Max guests." },
    occupancy: S("e.g. 'up to 12 guests'."),
    size: S("Villa size, e.g. '1,200 m²'."),
    nightlyOriginalNum: N("Nightly rate as a plain number in its native currency."),
    nightlyCurrency: { type: "string", enum: CURRENCIES, description: "Native currency of nightlyOriginalNum." },
    note: S("Rate note, e.g. 'Fully staffed · private chef available'."),
  };
  return {
    name: "update_listing",
    description: "Fill or update fields on the listing form. Include ONLY fields you have evidence for (photos or the owner's notes) or were asked to change — omitted fields stay untouched.",
    input_schema: { type: "object", properties: { ...common, ...(isRental ? rental : sale) } },
  };
}

function systemFor(isRental: boolean, markets: string[]) {
  return `You are the drafting assistant inside Elsewhere Living's Listings Studio — a boutique property site for Southeast Asia & beyond (markets: ${markets.join(", ") || "Koh Samui, Phuket, Bangkok, Bali, Dubai"}). The owner is creating a ${isRental ? "holiday rental" : "for-sale"} listing by chatting with you: dropping photos or PDF brochures and pasting raw material (agents' WhatsApp messages, bullet specs).

Your job each turn:
0. Sanity-check the form type first: this form is for a ${isRental ? "HOLIDAY RENTAL" : "property FOR SALE"}. If the material clearly describes the other kind (${isRental ? "asking price, freehold/leasehold, title deeds, payment plans" : "nightly or weekly rates, guest capacity, included breakfast/staff, check-in terms"}), set collectionWarning, leave every money field empty, and still fill the shared facts (title, location, beds, views, copy).
1. Extract every hard fact from the notes and any attached PDF brochure; study the photos for what they genuinely show (pool, sea view, interiors, style, setting). Note: images inside a PDF do NOT reach the photo gallery — if the owner sent only a brochure, gently remind them to drop the photos themselves as image files.
2. Call update_listing with everything you can support. Never invent numbers — no guessed prices, sizes, years or coordinates. Omit what you don't know.
3. Write ORIGINAL copy in the house voice: restrained, precise, quietly confident. No hype ("stunning", "luxurious", "dream", "paradise"), no exclamation marks, no copied source wording, never name the source agency. Always write areas as "m²" — never "sqm" or "sq.m.", even when the source notes use them. The real property/brand name goes in internalName only — keep it out of title, blurb and detail unless the owner asks.
4. In your text reply, be brief and warm: say what you filled, flag judgement calls (assumed currency, status vs. year), and ask for the few facts still missing (price, beds, exact area). One short paragraph, no lists unless asked.

The current form values arrive with each message — the owner's own edits are authoritative; don't overwrite a hand-edited field unless asked to. When the owner asks for a revision ("shorter blurb", "mention the chef"), call update_listing again with just the changed fields.`;
}

// ---- the call ---------------------------------------------------------------
export interface AiResult { text: string; patch: Record<string, any> | null; assistantContent: any[] }

export async function sendChat(opts: {
  isRental: boolean;
  markets: string[];
  messages: any[]; // raw Anthropic message array (we keep it in component state)
}): Promise<AiResult> {
  const key = getAiKey();
  if (!key) throw new Error("no-key");
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: AI_MODEL,
      max_tokens: 6000,
      system: systemFor(opts.isRental, opts.markets),
      tools: [toolFor(opts.isRental, opts.markets)],
      messages: opts.messages,
    }),
  });
  if (!r.ok) {
    let msg = "The AI request failed (" + r.status + ")";
    try { msg = (await r.json())?.error?.message || msg; } catch {}
    if (r.status === 401) throw new Error("bad-key:" + msg);
    throw new Error(msg);
  }
  const data = await r.json();
  const content: any[] = data.content || [];
  const text = content.filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
  let patch: Record<string, any> | null = null;
  for (const b of content) {
    if (b.type === "tool_use" && b.name === "update_listing") patch = { ...(patch || {}), ...(b.input || {}) };
  }
  return { text, patch, assistantContent: content };
}

// Compact snapshot of the form for the model — everything it may edit, plus
// photo count, minus the heavyweight stuff (gallery data URLs, focals).
export function formSnapshot(rec: Rec, isRental: boolean): string {
  const keys = isRental
    ? ["internalName", "title", "location", "place", "mapQuery", "view", "beds", "bedsLabel", "baths", "sleeps", "guests", "occupancy", "size", "nightlyOriginalNum", "nightlyCurrency", "note", "blurb", "detail", "features"]
    : ["internalName", "title", "location", "place", "mapQuery", "market", "type", "status", "view", "beds", "bedsLabel", "baths", "interior", "plot", "year", "ownership", "priceOriginalNum", "priceCurrency", "priceFrom", "blurb", "detail", "features"];
  const out: Record<string, any> = {};
  for (const k of keys) {
    const v = rec[k];
    if (v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && !v.length)) out[k] = v;
  }
  out.photosInGallery = (rec.gallery || []).length;
  return JSON.stringify(out);
}

// Coerce a model patch into exactly what the form expects.
export function normalizePatch(raw: Record<string, any>, isRental: boolean): Partial<Rec> {
  const allowed = new Set(isRental
    ? ["internalName", "title", "location", "place", "mapQuery", "view", "beds", "bedsLabel", "baths", "sleeps", "guests", "occupancy", "size", "nightlyOriginalNum", "nightlyCurrency", "note", "blurb", "detail", "features"]
    : ["internalName", "title", "location", "place", "mapQuery", "market", "type", "status", "view", "beds", "bedsLabel", "baths", "interior", "plot", "year", "ownership", "priceOriginalNum", "priceCurrency", "priceFrom", "blurb", "detail", "features"]);
  const p: Partial<Rec> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (!allowed.has(k) || v == null) continue;
    if (k === "view") p.view = Array.isArray(v) ? v : [String(v)];
    else if (k === "features" && Array.isArray(v)) p.features = v.filter((f) => f && f.l).map((f) => ({ l: String(f.l), i: FEATURE_ICONS.includes(f.i) ? f.i : "check" }));
    else if (k === "baths" || k === "year") p[k] = String(v).trim() ? (k === "year" ? Number(v) || null : String(v)) : null;
    else p[k] = v;
  }
  if (p.guests != null) p.guestsLabel = String(p.guests);
  return p;
}
