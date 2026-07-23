// Elsewhere Living — shared content types.
// These mirror the per-property JSON files under src/content/.

export interface Feature {
  /** Label, e.g. "Horizon-edge infinity pool" */
  l: string;
  /** Icon key, e.g. "pool" (see components/react/icons) */
  i: string;
}

export interface Listing {
  id: string;
  image: string;
  gallery: string[];
  location: string;
  place?: string;
  mapQuery?: string;
  market: string;
  title: string;
  type: "Villa" | "Condominium" | "Land" | string;
  view: string | string[];
  status: "Move-In Ready" | "Off-Plan" | string | string[];
  beds: number;
  bedsLabel?: string;
  baths: number | string;
  interior?: string;
  plot?: string | null;
  year?: number | null;
  // --- Source price (what the owner enters) -------------------------------
  /** The real price in its native currency, e.g. 45000000 for ฿45,000,000. */
  priceOriginalNum?: number | null;
  /** ISO currency code of priceOriginalNum: "THB" | "USD" | "EUR" | … */
  priceCurrency?: string;
  /** Show the USD price as "From $X" (a starting price). */
  priceFrom?: boolean;
  // --- Computed at build from live FX rates (see lib/price.ts) ------------
  /** USD amount, derived from priceOriginalNum at the latest rate. */
  priceNum: number;
  /** Formatted USD display, e.g. "$2,577,845" or "Price on request". */
  price: string;
  /** Formatted native price for the hover tooltip (omitted when USD). */
  priceOriginal?: string;
  /** Legacy hand-set sort weight — no longer used for sorting; see `created`. */
  added?: number;
  /** Epoch ms the property was added — the recency key for the "Newest" sort. */
  created?: number;
  ownership?: string;
  yield?: string;
  video?: string;
  /** Show on the homepage "featured" row (set in /admin). */
  featured?: boolean;
  /** Order within the homepage featured row — lower shows first. */
  featuredOrder?: number;
  /** Studio: 1-based featured order (preferred over featuredOrder). */
  featuredRank?: number | null;
  /** Studio: cover crop focus, e.g. "50% 30%" (object-position). */
  imageFocal?: string;
  /** Studio: per-image focal map keyed by URL. */
  focals?: Record<string, string>;
  blurb: string;
  detail: string;
  features: Feature[];
}

export interface Rental {
  id: string;
  image: string;
  gallery: string[];
  location: string;
  place?: string;
  mapQuery?: string;
  title: string;
  view: string | string[];
  beds: number;
  bedsLabel?: string;
  baths: number | string;
  guests?: number;
  guestsLabel?: string;
  occupancy?: string;
  size?: string;
  // --- Source price (what the owner enters) -------------------------------
  /** The real nightly rate in its native currency, e.g. 18000000 for IDR. */
  nightlyOriginalNum?: number | null;
  /** ISO currency code of nightlyOriginalNum: "USD" | "IDR" | "THB" | … */
  nightlyCurrency?: string;
  /** When true, shown as a fixed nightly price (no "From" prefix/eyebrow). */
  nightlyFixed?: boolean;
  // --- Computed at build from live FX rates (see lib/price.ts) ------------
  /** USD nightly amount, derived from nightlyOriginalNum at the latest rate. */
  nightlyNum: number;
  /** Formatted USD display, e.g. "$1,215" or "Price on request". */
  nightly: string;
  /** Formatted native price for the hover tooltip (omitted when USD). */
  nightlyOriginal?: string;
  note?: string;
  sleeps?: string;
  /** Epoch ms the property was added — the recency key for the "Newest" sort. */
  created?: number;
  video?: string;
  featured?: boolean;
  featuredRank?: number | null;
  imageFocal?: string;
  focals?: Record<string, string>;
  blurb: string;
  detail: string;
  features: Feature[];
}

export interface Market { name: string; country: string; note: string; }
export interface CustomStep { n: string; t: string; b: string; }
export interface CustomLocation { market: string; from: string; note: string; image: string; }
export interface Pillar { n: string; title: string; body: string; }
export interface Persona { i: string; k: string; b: string; }
export interface Differentiator { i: string; t: string; b: string; }
export interface Testimonial { quote: string; name: string; place: string; }
export interface Contact { email: string; whatsapp: string; whatsappRaw: string; site: string; }

export interface SiteContent {
  markets: Market[];
  customSteps: CustomStep[];
  customLocations: CustomLocation[];
  pillars: Pillar[];
  personas: Persona[];
  differentiators: Differentiator[];
  testimonials: Testimonial[];
  contact: Contact;
}
