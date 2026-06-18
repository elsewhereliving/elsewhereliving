// Rank "related" properties by how close they are (geographic distance from the
// mapQuery coordinates) and how similar in price — i.e. nearby + similar money.
import type { Listing, Rental } from "./types";
import { rentDest } from "./format";

function coords(q?: string): [number, number] | null {
  if (!q) return null;
  const parts = q.split(",").map((s) => parseFloat(s.trim()));
  if (parts.length === 2 && parts.every(Number.isFinite)) return [parts[0], parts[1]];
  return null;
}

function haversineKm(a: [number, number], b: [number, number]): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Weight distance a little more than price ("closeby and similar price").
const W_DIST = 0.6;
const W_PRICE = 0.4;

function rank<T extends { id: string; mapQuery?: string }>(
  target: T,
  candidates: T[],
  priceOf: (x: T) => number,
  n: number
): T[] {
  const tc = coords(target.mapQuery);
  const tp = priceOf(target) || 0;
  const scored = candidates.map((c) => {
    const cc = coords(c.mapQuery);
    const distKm = tc && cc ? haversineKm(tc, cc) : null;
    return { c, distKm, priceDiff: Math.abs((priceOf(c) || 0) - tp) };
  });
  const maxDist = Math.max(1, ...scored.map((s) => s.distKm ?? 0));
  const maxPrice = Math.max(1, ...scored.map((s) => s.priceDiff));
  return scored
    .map((s) => ({
      c: s.c,
      // unknown distance counts as "far" (1) so coordinated, nearby homes win
      score: W_DIST * (s.distKm == null ? 1 : s.distKm / maxDist) + W_PRICE * (s.priceDiff / maxPrice),
    }))
    .sort((a, b) => a.score - b.score)
    .map((s) => s.c)
    .slice(0, n);
}

export function relatedListings(target: Listing, all: Listing[], n = 3): Listing[] {
  const others = all.filter((x) => x.id !== target.id);
  if (coords(target.mapQuery)) return rank(target, others, (x) => x.priceNum, n);
  // No coordinates on this one: rank within the same market, fall back to all.
  const sameMarket = others.filter((x) => x.market === target.market);
  return rank(target, sameMarket.length >= n ? sameMarket : others, (x) => x.priceNum, n);
}

export function relatedRentals(target: Rental, all: Rental[], n = 3): Rental[] {
  const others = all.filter((x) => x.id !== target.id);
  if (coords(target.mapQuery)) return rank(target, others, (x) => x.nightlyNum, n);
  const dest = rentDest(target.location);
  const sameDest = others.filter((x) => rentDest(x.location) === dest);
  return rank(target, sameDest.length >= n ? sameDest : others, (x) => x.nightlyNum, n);
}
