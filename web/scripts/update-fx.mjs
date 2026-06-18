// Fetch current foreign-exchange rates (USD base) and cache them to
// src/data/fx-rates.json. Runs at the start of every build (see package.json
// "build"), so each published deploy converts prices at the latest rate.
//
// Resilient by design — the build must never fail because a rate API is down:
//   1. try the live endpoints in order;
//   2. if all fail, keep the previously-cached file;
//   3. if there's no cache either, write a sensible hard-coded baseline.
//
// Free reference-rate APIs update roughly once a day, which is plenty for
// property prices. No API key required.

import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "../src/data/fx-rates.json");

const ENDPOINTS = [
  "https://open.er-api.com/v6/latest/USD",
  "https://api.exchangerate-api.com/v4/latest/USD",
];

// Used only if a live fetch fails AND there is no cached file yet.
const BASELINE = {
  USD: 1, THB: 36.5, EUR: 0.92, GBP: 0.79, IDR: 16300, AUD: 1.52, SGD: 1.35,
  CHF: 0.89, CNY: 7.2, JPY: 157, HKD: 7.8, AED: 3.67, INR: 83.4, CAD: 1.37,
  NZD: 1.65, MYR: 4.7, RUB: 88, SAR: 3.75, ZAR: 18.3, SEK: 10.5,
};

function loadCache() {
  if (existsSync(OUT)) {
    try { return JSON.parse(readFileSync(OUT, "utf8")); } catch { /* corrupt — ignore */ }
  }
  return null;
}

async function fetchRates() {
  for (const url of ENDPOINTS) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(12000) });
      if (!res.ok) continue;
      const j = await res.json();
      const rates = j.rates || j.conversion_rates;
      if (rates && rates.USD) {
        return {
          base: "USD",
          date: j.time_last_update_utc || j.date || new Date().toISOString(),
          source: url,
          rates,
        };
      }
    } catch {
      // try the next endpoint
    }
  }
  return null;
}

const fresh = await fetchRates();
if (fresh) {
  writeFileSync(OUT, JSON.stringify(fresh, null, 2) + "\n");
  console.log(`fx: updated ${Object.keys(fresh.rates).length} rates (USD base, as of ${fresh.date})`);
} else {
  const cached = loadCache();
  if (cached) {
    console.warn(`fx: live fetch failed — keeping cached rates from ${cached.date}`);
  } else {
    writeFileSync(
      OUT,
      JSON.stringify({ base: "USD", date: "baseline", source: "hardcoded", rates: BASELINE }, null, 2) + "\n"
    );
    console.warn("fx: live fetch failed and no cache — wrote hard-coded baseline rates");
  }
}
