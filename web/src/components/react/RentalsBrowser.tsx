import { useEffect, useMemo, useState } from "react";
import type { Rental } from "../../lib/types";
import { viewList } from "../../lib/format";
import SaveButton from "./SaveButton";
import RangeSlider from "./RangeSlider";

// Faithful port of js/pages.js RentalsScreen — the filter/sort bar plus the
// rental grid. Receives the full rentals array (each carrying a precomputed
// `dest` key = rentDest(location)), reads the initial filter from the URL
// query, and reflects every change back to the URL via history.replaceState so
// the view is shareable and Back returns here.

const ALL = "All";

// Nightly-rate label for the slider, e.g. $2,500.
const fmtNightly = (n: number) => "$" + Math.round(n).toLocaleString();
const NIGHTLY_STEP = 100;
const floorTo = (n: number, s: number) => Math.floor(n / s) * s;
const ceilTo = (n: number, s: number) => Math.ceil(n / s) * s;

export interface RentalItem extends Rental {
  /** rentDest(location) — precomputed server-side. */
  dest: string;
}

interface Props {
  items: RentalItem[];
  /** Distinct destinations, in source order. */
  destinations: string[];
}

// --- icons (inline, from js/icons.js EW_ICONS) ----------------------------
const ICON_PATHS: Record<string, string> = {
  bed: '<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>',
  users:
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  interior:
    '<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
};

function Icon({
  name,
  size = 18,
  stroke = 1.5,
  color = "currentColor",
}: {
  name: keyof typeof ICON_PATHS;
  size?: number;
  stroke?: number;
  color?: string;
}) {
  const inner = ICON_PATHS[name] || "";
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="' +
    size +
    '" height="' +
    size +
    '" viewBox="0 0 24 24" fill="none" stroke="' +
    color +
    '" stroke-width="' +
    stroke +
    '" stroke-linecap="round" stroke-linejoin="round" style="display:block">' +
    inner +
    "</svg>";
  return (
    <span
      style={{ display: "inline-flex", flexShrink: 0, lineHeight: 0, color }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

// --- Badge (js/brand.js Badge, tone="light") ------------------------------
function BadgeLight({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4em",
        fontFamily: "var(--font-sans)",
        fontWeight: 400,
        fontSize: 10.5,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        padding: "0.45em 0.85em",
        borderRadius: "var(--radius-xs)",
        lineHeight: 1,
        background: "var(--white)",
        color: "var(--charcoal)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      {children}
    </span>
  );
}

// --- PriceTag (js/brand.js PriceTag) --------------------------------------
function PriceTag({
  value,
  original,
  currency,
  size = 22,
  color = "var(--charcoal)",
  align = "left",
}: {
  value: string;
  original?: string;
  currency?: string;
  size?: number;
  color?: string;
  align?: "left" | "right";
}) {
  const [show, setShow] = useState(false);
  if (!original) {
    return (
      <span style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: size, color }}>
        {value}
      </span>
    );
  }
  const tipPos: React.CSSProperties = align === "right" ? { right: 0 } : { left: 0 };
  return (
    <span
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        cursor: "help",
      }}
      tabIndex={0}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      <span
        style={{
          fontFamily: "var(--font-serif)",
          fontWeight: 400,
          fontSize: size,
          color,
          borderBottom: "1px dotted var(--stone)",
          paddingBottom: 1,
        }}
      >
        {value}
      </span>
      <Icon name="info" size={Math.round(size * 0.72)} color="var(--slate)" stroke={1.5} />
      {show ? (
        <span
          role="tooltip"
          style={{
            position: "absolute",
            bottom: "calc(100% + 9px)",
            ...tipPos,
            zIndex: 50,
            whiteSpace: "nowrap",
            background: "var(--navy)",
            color: "var(--white)",
            fontFamily: "var(--font-sans)",
            fontWeight: 300,
            fontSize: 11.5,
            letterSpacing: "0.04em",
            lineHeight: 1.4,
            padding: "9px 13px",
            boxShadow: "0 14px 34px -14px rgba(15,22,40,0.6)",
            pointerEvents: "none",
          }}
        >
          Shown in USD — originally {original}
          {currency ? " (" + currency + ")" : ""}
          <span
            style={{
              position: "absolute",
              top: "100%",
              ...tipPos,
              marginLeft: align === "right" ? 0 : 16,
              marginRight: align === "right" ? 16 : 0,
              width: 0,
              height: 0,
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              borderTop: "6px solid var(--navy)",
            }}
          />
        </span>
      ) : null}
    </span>
  );
}

// --- RentalCard (js/pages.js RentalCard) — whole card is an <a> ------------
function RentalCard({ item }: { item: RentalItem }) {
  const [hover, setHover] = useState(false);
  const views = viewList(item.view);
  const original = (item as Rental & { nightlyOriginal?: string }).nightlyOriginal;
  const currency = (item as Rental & { nightlyCurrency?: string }).nightlyCurrency;
  return (
    <a
      href={`/rentals/${item.id}/`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "var(--white)",
        border: "1px solid var(--border-subtle)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        textDecoration: "none",
        color: "inherit",
        boxShadow: hover ? "0 26px 60px -38px rgba(15,22,40,0.5)" : "none",
        transform: hover ? "translateY(-3px)" : "none",
        transition:
          "box-shadow var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)",
      }}
    >
      <div className="ew-grain" style={{ position: "relative", aspectRatio: "3 / 2", overflow: "hidden" }}>
        <img
          src={item.image}
          alt={item.title}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: (item as any).imageFocal || "center",
            transition: "transform 1.4s var(--ease-out)",
            transform: hover ? "scale(1.06)" : "scale(1)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            zIndex: 2,
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
          }}
        >
          {views.map((v) => (
            <BadgeLight key={v}>{v}</BadgeLight>
          ))}
        </div>
        <div style={{ position: "absolute", top: 12, right: 12, zIndex: 2 }}>
          <SaveButton id={item.id} />
        </div>
      </div>
      <div style={{ padding: "22px 24px 26px" }}>
        <div
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 10.5,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--slate)",
          }}
        >
          {item.location}
        </div>
        <h3
          style={{
            margin: "8px 0 0",
            fontFamily: "var(--font-serif)",
            fontWeight: 300,
            fontSize: 27,
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
            color: "var(--navy)",
          }}
        >
          {item.title}
        </h3>
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 12,
            fontFamily: "var(--font-sans)",
            fontWeight: 300,
            fontSize: 12.5,
            letterSpacing: "0.03em",
            color: "var(--text-body)",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Icon name="bed" size={15} color="var(--slate)" stroke={1.4} /> {item.bedsLabel || item.beds}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Icon name="users" size={15} color="var(--slate)" stroke={1.4} /> {item.guestsLabel || item.guests} guests
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Icon name="interior" size={15} color="var(--slate)" stroke={1.4} /> {item.size}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginTop: 20,
            paddingTop: 18,
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          <span style={{ display: "flex", flexDirection: "column" }}>
            {!item.nightlyFixed && (
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 9.5,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--slate)",
                }}
              >
                From
              </span>
            )}
            <span style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: 22, color: "var(--charcoal)" }}>
              <PriceTag value={item.nightly} original={original} currency={currency} size={22} />
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 12,
                  color: "var(--slate)",
                  letterSpacing: "0.04em",
                }}
              >
                {" "}
                / night
              </span>
            </span>
          </span>
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--slate)",
            }}
          >
            {item.note}
          </span>
        </div>
      </div>
    </a>
  );
}

// --- Segmented (js/listings.js Segmented) ---------------------------------
interface Opt {
  label: string;
  value: string | number;
}
function Segmented({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Opt[];
  value: string | number;
  onChange: (v: string | number) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 10.5,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--slate)",
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {options.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={String(opt.value)}
              onClick={() => onChange(opt.value)}
              style={{
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
                fontSize: 11.5,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "9px 14px",
                borderRadius: "var(--radius-pill)",
                border: "1px solid " + (active ? "var(--navy)" : "var(--border-subtle)"),
                background: active ? "var(--navy)" : "transparent",
                color: active ? "var(--white)" : "var(--charcoal)",
                transition: "all var(--dur-base) var(--ease-out)",
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// --- Button (js/brand.js Button, variant="outline" md pill) ---------------
const moreBtnStyle: React.CSSProperties = {
  alignSelf: "flex-start",
  background: "transparent",
  border: "none",
  padding: 0,
  cursor: "pointer",
  fontFamily: "var(--font-sans)",
  fontSize: 11.5,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "var(--navy)",
};

function SortSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: Opt[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <span style={{ fontFamily: "var(--font-sans)", fontSize: 10.5, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--slate)" }}>Sort</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 12,
          letterSpacing: "0.06em",
          color: "var(--navy)",
          background: "transparent",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-pill)",
          padding: "10px 34px 10px 16px",
          cursor: "pointer",
          appearance: "none",
          WebkitAppearance: "none",
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B6E72' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m6 9 6 6 6-6'/></svg>\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 14px center",
        }}
      >
        {options.map((o) => (
          <option key={String(o.value)} value={String(o.value)}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function OutlineButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      className="ew-btn ew-btn--hover"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.6em",
        fontFamily: "var(--font-sans)",
        fontWeight: 400,
        textTransform: "uppercase",
        textDecoration: "none",
        cursor: "pointer",
        whiteSpace: "nowrap",
        lineHeight: 1,
        borderRadius: "var(--radius-pill)",
        transition:
          "background var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out), opacity var(--dur-base) var(--ease-out)",
        padding: "1.05em 2em",
        fontSize: 12.5,
        letterSpacing: "0.14em",
        background: "transparent",
        color: "var(--charcoal)",
        border: "1.25px solid currentColor",
      }}
    >
      {children}
    </button>
  );
}

const VIEWS = ["All", "Sea View", "Beachfront", "Waterfront", "Mountain View", "Garden / Pool View"];

export default function RentalsBrowser({ items, destinations }: Props) {
  const destOpts = [ALL, ...destinations];

  const [dest, setDest] = useState(ALL);
  const [view, setView] = useState(ALL);
  const [minBeds, setMinBeds] = useState(0);
  const [sort, setSort] = useState("featured");

  // The price slider scales to the SELECTED destination, so its range always
  // reflects what's actually available there (ignoring "on request").
  const priceValues = useMemo(
    () =>
      items
        .filter((r) => dest === ALL || r.dest === dest)
        .map((r) => r.nightlyNum)
        .filter((n) => n && n > 0)
        .sort((a, b) => a - b),
    [items, dest]
  );
  const [priceMin, priceMax] = useMemo(() => {
    if (!priceValues.length) return [0, 0];
    return [floorTo(priceValues[0], NIGHTLY_STEP), ceilTo(priceValues[priceValues.length - 1], NIGHTLY_STEP)];
  }, [priceValues]);

  const [priceLo, setPriceLo] = useState(priceMin);
  const [priceHi, setPriceHi] = useState(priceMax);
  const priceActive = priceLo > priceMin || priceHi < priceMax;

  // Lowest/highest nightly rate for a destination — used to (re)scale the slider.
  const boundsFor = (d: string): [number, number] => {
    const pool = items.filter((r) => d === ALL || r.dest === d).map((r) => r.nightlyNum).filter((n) => n && n > 0);
    return pool.length ? [floorTo(Math.min(...pool), NIGHTLY_STEP), ceilTo(Math.max(...pool), NIGHTLY_STEP)] : [0, 0];
  };
  // Switching destination resets the price range to that area's own min/max,
  // so a stale filter from a pricier area can't hide everything.
  const changeDest = (d: string) => {
    setDest(d);
    const [lo, hi] = boundsFor(d);
    setPriceLo(lo);
    setPriceHi(hi);
  };

  // hydrate filters on mount. URL params (browser back/forward) win; on a clean
  // URL (e.g. an "All rentals" link) fall back to the last view saved this
  // session so filters, sort and scroll position are remembered, not reset.
  useEffect(() => {
    let q = new URLSearchParams(window.location.search);
    let fromSession = false;
    if (![...q.keys()].length) {
      const saved = sessionStorage.getItem("ew:rentals");
      if (saved) { q = new URLSearchParams(saved); fromSession = true; }
    }
    const d = q.get("dest");
    if (d) setDest(d);
    if (q.get("view")) setView(q.get("view")!);
    if (q.get("beds")) setMinBeds(Number(q.get("beds")));
    // scale price to the (possibly URL-set) destination, clamping any pmin/pmax
    const [bMin, bMax] = boundsFor(d || ALL);
    setPriceLo(q.get("pmin") ? Math.max(bMin, Number(q.get("pmin"))) : bMin);
    setPriceHi(q.get("pmax") ? Math.min(bMax, Number(q.get("pmax"))) : bMax);
    if (q.get("sort")) setSort(q.get("sort")!);
    if (fromSession) {
      const y = sessionStorage.getItem("ew:rentals:y");
      if (y) requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo(0, Number(y))));
    }
  }, []);

  // remember scroll position when leaving (e.g. clicking into a rental)
  useEffect(() => {
    const save = () => sessionStorage.setItem("ew:rentals:y", String(window.scrollY));
    window.addEventListener("pagehide", save);
    return () => window.removeEventListener("pagehide", save);
  }, []);

  // reflect active filters to the URL (no history spam)
  useEffect(() => {
    const q = new URLSearchParams();
    if (dest !== ALL) q.set("dest", dest);
    if (view !== ALL) q.set("view", view);
    if (minBeds > 0) q.set("beds", String(minBeds));
    if (priceLo > priceMin) q.set("pmin", String(priceLo));
    if (priceHi < priceMax) q.set("pmax", String(priceHi));
    if (sort !== "featured") q.set("sort", sort);
    const qs = q.toString();
    const next = window.location.pathname + (qs ? `?${qs}` : "");
    window.history.replaceState(window.history.state, "", next);
    sessionStorage.setItem("ew:rentals", qs);
  }, [dest, view, minBeds, priceLo, priceHi, sort]);

  const result = useMemo(() => {
    let out = items.filter(
      (r) =>
        (dest === ALL || r.dest === dest) &&
        (view === ALL || viewList(r.view).includes(view)) &&
        (r.beds || 0) >= minBeds &&
        (!priceActive || (r.nightlyNum > 0 && r.nightlyNum >= priceLo && r.nightlyNum <= priceHi))
    );
    // "on request" sorts as most expensive
    const rentPrice = (x: RentalItem) => (x.nightlyNum && x.nightlyNum > 0 ? x.nightlyNum : Infinity);
    if (sort === "low") out = [...out].sort((a, b) => rentPrice(a) - rentPrice(b));
    if (sort === "high") out = [...out].sort((a, b) => rentPrice(b) - rentPrice(a));
    if (sort === "newest") {
      const recency = (x: RentalItem) => (x as any).created ?? (x as any).added ?? 0;
      out = [...out].sort((a, b) => recency(b) - recency(a));
    }
    if (sort === "featured") {
      // Featured rentals first (in the order set in the Studio), then the rest
      // by newest. Tie-break on id so duplicate ranks can't scramble the order.
      const rank = (x: RentalItem) => ((x as any).featured ? ((x as any).featuredRank ?? (x as any).featuredOrder ?? 9999) : Infinity);
      const recency = (x: RentalItem) => (x as any).created ?? (x as any).added ?? 0;
      out = [...out].sort((a, b) => rank(a) - rank(b) || recency(b) - recency(a) || a.id.localeCompare(b.id));
    }
    return out;
  }, [items, dest, view, minBeds, priceLo, priceHi, priceActive, sort]);

  const reset = () => {
    setDest(ALL);
    setView(ALL);
    setMinBeds(0);
    setPriceLo(priceMin);
    setPriceHi(priceMax);
    setSort("featured");
  };

  const activeFilters =
    Number(dest !== ALL) + Number(view !== ALL) + Number(minBeds > 0) + Number(priceActive);

  return (
    <>
      <div
        style={{
          background: "var(--white)",
          border: "1px solid var(--border-subtle)",
          padding: "clamp(20px, 2.6vw, 30px)",
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}
      >
        {/* Primary row — Destination + Sort */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "22px 40px", alignItems: "flex-end", justifyContent: "space-between" }}>
          <Segmented
            label="Destination"
            value={dest}
            onChange={(v) => changeDest(String(v))}
            options={destOpts.map((d) => ({ label: d, value: d }))}
          />
          <SortSelect
            value={sort}
            onChange={setSort}
            options={[
              { label: "Featured", value: "featured" },
              { label: "Price · low to high", value: "low" },
              { label: "Price · high to low", value: "high" },
              { label: "Newest", value: "newest" },
            ]}
          />
        </div>

        {/* Secondary row — Bedrooms + Price */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "22px 40px", alignItems: "flex-start", paddingTop: 20, borderTop: "1px solid var(--border-subtle)" }}>
          <Segmented
            label="Bedrooms"
            value={minBeds}
            onChange={(v) => setMinBeds(Number(v))}
            options={[
              { label: "Any", value: 0 },
              { label: "2+", value: 2 },
              { label: "3+", value: 3 },
              { label: "4+", value: 4 },
              { label: "5+", value: 5 },
              { label: "6+", value: 6 },
              { label: "7+", value: 7 },
              { label: "8+", value: 8 },
              { label: "9+", value: 9 },
              { label: "10+", value: 10 },
            ]}
          />
          {priceMax > priceMin && (
            <RangeSlider
              label="Price / night"
              min={priceMin}
              max={priceMax}
              step={NIGHTLY_STEP}
              lo={priceLo}
              hi={priceHi}
              onChange={(lo, hi) => { setPriceLo(lo); setPriceHi(hi); }}
              format={fmtNightly}
              scale="log"
            />
          )}
        </div>

        {/* View */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "22px 40px", alignItems: "flex-start", paddingTop: 20, borderTop: "1px solid var(--border-subtle)" }}>
          <Segmented
            label="View"
            value={view}
            onChange={(v) => setView(String(v))}
            options={VIEWS.map((v) => ({ label: v, value: v }))}
          />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          alignItems: "center",
          justifyContent: "space-between",
          margin: "28px 2px 26px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 12,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--slate)",
          }}
        >
          {result.length} {result.length === 1 ? "villa" : "villas"}
          {dest !== ALL ? " in " + dest : ""}
        </span>
        {activeFilters > 0 ? (
          <button
            onClick={reset}
            style={{
              cursor: "pointer",
              background: "transparent",
              border: "none",
              fontFamily: "var(--font-sans)",
              fontSize: 12,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--navy)",
              textDecoration: "underline",
              textUnderlineOffset: 4,
            }}
          >
            Clear filters
          </button>
        ) : null}
      </div>

      {result.length ? (
        <div data-grid="3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 26 }}>
          {result.map((r) => (
            <RentalCard key={r.id} item={r} />
          ))}
        </div>
      ) : (
        <div
          style={{
            padding: "80px 20px",
            textAlign: "center",
            border: "1px solid var(--border-subtle)",
            background: "var(--white)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-serif)",
              fontWeight: 300,
              fontSize: 26,
              color: "var(--navy)",
            }}
          >
            Nothing matches just yet.
          </p>
          <p
            style={{
              margin: "12px 0 24px",
              fontFamily: "var(--font-sans)",
              fontWeight: 300,
              fontSize: 15,
              color: "var(--text-body)",
            }}
          >
            Loosen a filter, or tell us your dates and we'll source it.
          </p>
          <OutlineButton onClick={reset}>Clear filters</OutlineButton>
        </div>
      )}
    </>
  );
}
