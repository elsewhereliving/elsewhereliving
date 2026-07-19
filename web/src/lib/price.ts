// Elsewhere Living — price conversion.
//
// Properties store their *real* price in their *native* currency
// (priceOriginalNum + priceCurrency). The USD figures shown on the site are
// computed here at build time from the latest exchange rates, which are
// refreshed by scripts/update-fx.mjs at the start of every build.
//
// Rates are USD-based (how many units of X per 1 USD), so converting X → USD
// is `amount / rate[X]`.

import fx from "../data/fx-rates.json";

const RATES: Record<string, number> = (fx as { rates: Record<string, number> }).rates || {};

/** ISO date (or label) of the rate set currently baked in — handy for footers. */
export const fxDate: string = (fx as { date?: string }).date || "";

/** Convert an amount in `currency` to USD using the latest rate. */
export function toUsd(amount: number, currency: string): number {
  const code = (currency || "USD").toUpperCase();
  if (code === "USD") return amount;
  const rate = RATES[code];
  // If we somehow don't have the rate, fail safe by treating it as USD rather
  // than rendering NaN.
  return rate && rate > 0 ? amount / rate : amount;
}

// Symbols for the currencies we actually use; everything else falls back to
// "CODE 1,234".
const SYMBOLS: Record<string, string> = {
  USD: "$", EUR: "€", GBP: "£", THB: "฿", IDR: "Rp ", AUD: "A$", SGD: "S$",
  HKD: "HK$", CNY: "¥", JPY: "¥", AED: "AED ", INR: "₹", CHF: "CHF ",
};

function group(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

// Converted prices are FX approximations — showing "$3,569,470" implies a
// precision the number doesn't have (and the exact native price is already in
// the tooltip). Round to a sensible step for the magnitude.
function roundConverted(n: number): number {
  const step = n >= 1_000_000 ? 10_000 : n >= 100_000 ? 1_000 : n >= 10_000 ? 100 : 10;
  return Math.round(n / step) * step;
}

/** Format a USD amount, e.g. 2577845 → "$2,577,845". */
export function formatUsd(n: number, opts: { from?: boolean } = {}): string {
  return `${opts.from ? "From " : ""}$${group(n)}`;
}

/** Format an amount in its native currency, e.g. (45000000,"THB") → "฿45,000,000". */
export function formatNative(amount: number, currency: string): string {
  const code = (currency || "USD").toUpperCase();
  const sym = SYMBOLS[code];
  return sym ? `${sym}${group(amount)}` : `${code} ${group(amount)}`;
}

export interface ListingPriceFields {
  priceNum: number;
  price: string;
  priceOriginal?: string;
}

/** Compute a listing's display price fields from its source price. */
// NOTE: we deliberately do NOT return `priceCurrency` here. That is a *source*
// field (the currency the owner entered), and overlaying a computed value with
// the same name — e.g. `{ ...listing, ...listingPrice(listing) }` — would clobber
// it (USD prices would lose their currency on the next /admin save). The native
// tooltip reads `priceOriginal`; the source `priceCurrency` passes through as-is.
export function listingPrice(src: {
  priceOriginalNum?: number | null;
  priceCurrency?: string;
  priceFrom?: boolean;
}): ListingPriceFields {
  const amt = src.priceOriginalNum;
  const cur = (src.priceCurrency || "").toUpperCase();
  if (!cur || amt == null || amt <= 0) {
    return { priceNum: 0, price: "Price on request", priceOriginal: undefined };
  }
  const usd = cur === "USD" ? Math.round(amt) : roundConverted(toUsd(amt, cur));
  return {
    priceNum: usd,
    price: formatUsd(usd, { from: src.priceFrom }),
    // Tooltip only matters when the native price isn't already USD.
    priceOriginal: cur === "USD" ? undefined : formatNative(amt, cur),
  };
}

export interface RentalPriceFields {
  nightlyNum: number;
  nightly: string;
  nightlyOriginal?: string;
}

/** Compute a rental's display nightly fields from its source price. */
// See the note on listingPrice: `nightlyCurrency` is a source field and must not
// be overlaid with a computed value, or USD rentals lose it on the next save.
export function rentalPrice(src: {
  nightlyOriginalNum?: number | null;
  nightlyCurrency?: string;
}): RentalPriceFields {
  const amt = src.nightlyOriginalNum;
  const cur = (src.nightlyCurrency || "").toUpperCase();
  if (!cur || amt == null || amt <= 0) {
    return { nightlyNum: 0, nightly: "Price on request", nightlyOriginal: undefined };
  }
  const usd = cur === "USD" ? Math.round(amt) : roundConverted(toUsd(amt, cur));
  return {
    nightlyNum: usd,
    nightly: formatUsd(usd),
    nightlyOriginal: cur === "USD" ? undefined : formatNative(amt, cur),
  };
}
