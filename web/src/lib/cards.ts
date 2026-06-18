// Build the uniform CardData shape from a Listing or Rental, so the Astro card
// and the React card render identically everywhere.
import type { Listing, Rental } from "./types";
import type { CardData } from "../components/react/PropertyCardR";
import { viewText, rentDest, locality } from "./format";

export function listingToCard(l: Listing): CardData {
  const isLand = l.type === "Land";
  const facts = isLand
    ? [l.plot || "Land", viewText(l.view)].filter(Boolean) as string[]
    : ([`${l.beds} Beds`, `${l.baths} Baths`, viewText(l.view) || l.type].filter(Boolean) as string[]);
  return {
    id: l.id,
    href: `/property/${l.id}/`,
    image: l.image,
    title: l.title,
    location: `${locality(l.location)} · ( ${l.market} )`,
    price: l.price,
    badge: l.status,
    facts: facts.slice(0, 3),
    saveId: l.id,
  };
}

export function rentalToCard(r: Rental): CardData {
  const facts = [`${r.beds} Beds`, r.occupancy || (r.guests ? `${r.guests} Guests` : ""), viewText(r.view)]
    .filter(Boolean)
    .slice(0, 3) as string[];
  return {
    id: r.id,
    href: `/rentals/${r.id}/`,
    image: r.image,
    title: r.title,
    location: `${locality(r.location)} · ( ${rentDest(r.location)} )`,
    price: `${r.nightly} / night`,
    facts,
    saveId: r.id,
  };
}
