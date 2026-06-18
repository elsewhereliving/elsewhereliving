// Elsewhere Living — headless WordPress (WPGraphQL) data source.
//
// This module talks to a WordPress install exposing WPGraphQL. It expects two
// custom post types — `listing` and `rental` — each with an ACF field group
// whose fields match the names below. See web/README.md → "WordPress schema"
// for the exact CPT/ACF definitions to create in wp-admin.
//
// Nothing here runs unless WORDPRESS_API_URL is set; content.ts decides.

import type { Listing, Rental, Feature } from "./types";

const ENDPOINT = import.meta.env.WORDPRESS_API_URL as string | undefined;
const TOKEN = import.meta.env.WORDPRESS_AUTH_TOKEN as string | undefined;

export function isWordPressConfigured(): boolean {
  return Boolean(ENDPOINT);
}

async function gql<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  if (!ENDPOINT) throw new Error("WORDPRESS_API_URL is not set");
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`WPGraphQL ${res.status}: ${await res.text()}`);
  const json = (await res.json()) as { data?: T; errors?: Array<{ message: string }> };
  if (json.errors?.length) throw new Error(`WPGraphQL: ${json.errors.map((e) => e.message).join("; ")}`);
  if (!json.data) throw new Error("WPGraphQL: empty response");
  return json.data;
}

/** Split a newline/comma list of "Label|icon" pairs from a textarea ACF field. */
function parseFeatures(raw: string | null | undefined): Feature[] {
  if (!raw) return [];
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [l, i = "sparkles"] = line.split("|").map((s) => s.trim());
      return { l, i };
    });
}

function parseList(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw.split(/\r?\n|,/).map((s) => s.trim()).filter(Boolean);
}

// --- Field fragments. `acf` field names must match the ACF group in WP. ---
const LISTING_FIELDS = `
  id: slug
  title
  listingFields {
    image { node { sourceUrl } }
    gallery { nodes { sourceUrl } }
    location place mapQuery market type view status
    beds bedsLabel baths interior plot year
    priceNum price priceOriginal priceCurrency added ownership
    blurb detail features
  }
`;

const RENTAL_FIELDS = `
  id: slug
  title
  rentalFields {
    image { node { sourceUrl } }
    gallery { nodes { sourceUrl } }
    location place mapQuery view
    beds bedsLabel baths guests guestsLabel occupancy size
    nightlyNum nightly note sleeps
    blurb detail features
  }
`;

type WpImage = { node?: { sourceUrl?: string } } | null;
type WpGallery = { nodes?: Array<{ sourceUrl?: string }> } | null;

function mapListing(n: any): Listing {
  const f = n.listingFields ?? {};
  return {
    id: n.id,
    title: n.title,
    image: (f.image as WpImage)?.node?.sourceUrl ?? "",
    gallery: ((f.gallery as WpGallery)?.nodes ?? []).map((g) => g.sourceUrl!).filter(Boolean),
    location: f.location ?? "",
    place: f.place ?? undefined,
    mapQuery: f.mapQuery ?? undefined,
    market: f.market ?? "",
    type: f.type ?? "Villa",
    view: parseList(f.view),
    status: f.status ?? "Move-In Ready",
    beds: Number(f.beds ?? 0),
    bedsLabel: f.bedsLabel ?? undefined,
    baths: f.baths ?? 0,
    interior: f.interior ?? undefined,
    plot: f.plot ?? null,
    year: f.year ?? null,
    priceNum: Number(f.priceNum ?? 0),
    price: f.price ?? "",
    priceOriginal: f.priceOriginal ?? undefined,
    priceCurrency: f.priceCurrency ?? undefined,
    added: f.added ?? undefined,
    ownership: f.ownership ?? undefined,
    blurb: f.blurb ?? "",
    detail: f.detail ?? "",
    features: parseFeatures(f.features),
  };
}

function mapRental(n: any): Rental {
  const f = n.rentalFields ?? {};
  return {
    id: n.id,
    title: n.title,
    image: (f.image as WpImage)?.node?.sourceUrl ?? "",
    gallery: ((f.gallery as WpGallery)?.nodes ?? []).map((g) => g.sourceUrl!).filter(Boolean),
    location: f.location ?? "",
    place: f.place ?? undefined,
    mapQuery: f.mapQuery ?? undefined,
    view: parseList(f.view),
    beds: Number(f.beds ?? 0),
    bedsLabel: f.bedsLabel ?? undefined,
    baths: f.baths ?? 0,
    guests: f.guests ?? undefined,
    guestsLabel: f.guestsLabel ?? undefined,
    occupancy: f.occupancy ?? undefined,
    size: f.size ?? undefined,
    nightlyNum: Number(f.nightlyNum ?? 0),
    nightly: f.nightly ?? "",
    note: f.note ?? undefined,
    sleeps: f.sleeps ?? undefined,
    blurb: f.blurb ?? "",
    detail: f.detail ?? "",
    features: parseFeatures(f.features),
  };
}

export async function fetchListings(): Promise<Listing[]> {
  const data = await gql<{ listings: { nodes: any[] } }>(`
    query Listings { listings(first: 200) { nodes { ${LISTING_FIELDS} } } }
  `);
  return data.listings.nodes.map(mapListing);
}

export async function fetchRentals(): Promise<Rental[]> {
  const data = await gql<{ rentals: { nodes: any[] } }>(`
    query Rentals { rentals(first: 200) { nodes { ${RENTAL_FIELDS} } } }
  `);
  return data.rentals.nodes.map(mapRental);
}
