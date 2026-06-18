// Elsewhere Living — shared content types.
// These mirror the fields in the migrated data (src/data/*.json) and the
// shape the WordPress mappers (wordpress.ts) normalise to.

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
  status: "Move-In Ready" | "Off-Plan" | string;
  beds: number;
  bedsLabel?: string;
  baths: number | string;
  interior?: string;
  plot?: string | null;
  year?: number | null;
  priceNum: number;
  price: string;
  priceOriginal?: string;
  priceCurrency?: string;
  added?: number;
  ownership?: string;
  yield?: string;
  video?: string;
  /** Show on the homepage "featured" row (set in /admin). */
  featured?: boolean;
  /** Order within the homepage featured row — lower shows first. */
  featuredOrder?: number;
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
  nightlyNum: number;
  nightly: string;
  note?: string;
  sleeps?: string;
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
