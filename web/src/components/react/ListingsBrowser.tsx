import { useEffect, useMemo, useState } from "react";
import type { Listing } from "../../lib/types";
import { viewList, viewText } from "../../lib/format";
import SaveButton from "./SaveButton";
import RangeSlider from "./RangeSlider";

// Faithful port of js/listings.js ListingsScreen — the filter/sort bar plus the
// property grid. Receives the full listings array and the filter facets, reads
// the initial filter from ?dest=/?type= (and the rest) on the URL, and reflects
// every change back to the URL via history.replaceState so the view is
// shareable and Back returns here.

const ALL = "All";

// Compact USD label for the price slider, e.g. $750k, $2.5M.
function fmtUSD(n: number): string {
  if (n >= 1_000_000) return "$" + (n / 1_000_000).toFixed(n % 1_000_000 ? 1 : 0).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return "$" + Math.round(n / 1_000) + "k";
  return "$" + n;
}
const PRICE_STEP = 50_000;
const floorTo = (n: number, s: number) => Math.floor(n / s) * s;
const ceilTo = (n: number, s: number) => Math.ceil(n / s) * s;

interface Props {
  items: Listing[];
  markets: string[];
  types: string[];
  statuses: string[];
  views: string[];
}

// --- icons (inline, from js/icons.js EW_ICONS) ----------------------------
const ICON_PATHS: Record<string, string> = {
  bed: '<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>',
  bath: '<path d="M2 12h20"/><path d="M4 12V6a2 2 0 0 1 4 0"/><path d="M4 12v3a5 5 0 0 0 5 5h6a5 5 0 0 0 5-5v-3"/><path d="M8 20l-1 2"/><path d="M16 20l1 2"/>',
  interior:
    '<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',
  plot: '<path d="M4 8V4h4"/><path d="M20 8V4h-4"/><path d="M4 16v4h4"/><path d="M20 16v4h-4"/><path d="M9 12h6"/><path d="M12 9v6"/>',
  view: '<path d="M2 12s3.2-7 10-7 10 7 10 7-3.2 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
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
  size = 19,
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
  const hasOrig = !!original;
  if (!hasOrig) {
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

// --- PropertyCard (js/brand.js PropertyCard) — whole card is an <a> --------
function PropertyCard({ item }: { item: Listing }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={`/property/${item.id}/`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        background: "var(--white)",
        border: "1px solid var(--border-subtle)",
        overflow: "hidden",
        cursor: "pointer",
        textDecoration: "none",
        color: "inherit",
        transition:
          "box-shadow var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)",
        boxShadow: hover ? "0 26px 60px -38px rgba(15,22,40,0.55)" : "0 0 0 rgba(0,0,0,0)",
        transform: hover ? "translateY(-3px)" : "none",
      }}
    >
      <div
        className="ew-grain"
        style={{ position: "relative", aspectRatio: "3 / 2", overflow: "hidden" }}
      >
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          decoding="async"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: (item as any).imageFocal || "center",
            transition: "transform 1.4s var(--ease-out)",
            transform: hover ? "scale(1.07)" : "scale(1)",
          }}
        />
        {item.status ? (
          <div style={{ position: "absolute", top: 14, left: 14, zIndex: 2 }}>
            <BadgeLight>{item.status}</BadgeLight>
          </div>
        ) : null}
        <div style={{ position: "absolute", top: 12, right: 12, zIndex: 2 }}>
          <SaveButton id={item.id} />
        </div>
      </div>
      <div style={{ padding: "20px 22px 22px", display: "flex", flexDirection: "column", flex: 1 }}>
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
            fontSize: 26,
            lineHeight: 1.12,
            color: "var(--navy)",
            letterSpacing: "-0.01em",
          }}
        >
          {item.title}
        </h3>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px 16px",
            marginTop: 16,
            paddingTop: 16,
            borderTop: "1px solid var(--border-subtle)",
            fontFamily: "var(--font-sans)",
            fontWeight: 300,
            fontSize: 12.5,
            letterSpacing: "0.03em",
            color: "var(--text-body)",
          }}
        >
          {item.type === "Land" ? (
            <>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Icon name="plot" size={15} color="var(--slate)" stroke={1.4} /> {item.plot}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Icon name="view" size={15} color="var(--slate)" stroke={1.4} /> {viewText(item.view)}
              </span>
            </>
          ) : (
            <>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Icon name="bed" size={15} color="var(--slate)" stroke={1.4} /> {item.bedsLabel || item.beds}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Icon name="bath" size={15} color="var(--slate)" stroke={1.4} /> {item.baths}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Icon name="interior" size={15} color="var(--slate)" stroke={1.4} /> {item.interior}
              </span>
            </>
          )}
        </div>
        <div
          style={{
            marginTop: 16,
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <PriceTag
            value={item.price}
            original={item.priceOriginal}
            currency={item.priceCurrency}
            size={19}
          />
          {item.yield ? (
            <div
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 10.5,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--slate)",
              }}
            >
              {item.type === "Land" ? item.yield : item.yield + " yield"}
            </div>
          ) : null}
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

// --- Compact sort dropdown + "more filters" toggle -----------------------
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

// --- Button (js/brand.js Button, variant="outline" md pill) ---------------
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

export default function ListingsBrowser({ items, markets, types, statuses, views }: Props) {
  const marketOpts = [ALL, ...markets];
  const typeOpts = [ALL, ...types];
  const statusOpts = [ALL, ...statuses];
  const viewOpts = [ALL, ...views];

  const [market, setMarket] = useState(ALL);
  const [type, setType] = useState(ALL);
  const [status, setStatus] = useState(ALL);
  const [view, setView] = useState(ALL);
  const [minBeds, setMinBeds] = useState(0);
  const [sort, setSort] = useState("featured");

  // The price slider scales to the SELECTED market, so its range always
  // reflects what's actually available there (ignoring "price on request").
  const priceValues = useMemo(
    () =>
      items
        .filter((l) => market === ALL || l.market === market)
        .map((l) => l.priceNum)
        .filter((n) => n && n > 0)
        .sort((a, b) => a - b),
    [items, market]
  );
  const [priceMin, priceMax] = useMemo(() => {
    if (!priceValues.length) return [0, 0];
    return [floorTo(priceValues[0], PRICE_STEP), ceilTo(priceValues[priceValues.length - 1], PRICE_STEP)];
  }, [priceValues]);

  const [priceLo, setPriceLo] = useState(priceMin);
  const [priceHi, setPriceHi] = useState(priceMax);
  const priceActive = priceLo > priceMin || priceHi < priceMax;

  // Lowest/highest price for a market — used to (re)scale the slider.
  const boundsFor = (m: string): [number, number] => {
    const pool = items.filter((l) => m === ALL || l.market === m).map((l) => l.priceNum).filter((n) => n && n > 0);
    return pool.length ? [floorTo(Math.min(...pool), PRICE_STEP), ceilTo(Math.max(...pool), PRICE_STEP)] : [0, 0];
  };
  // Switching market resets the price range to that market's own min/max.
  const changeMarket = (m: string) => {
    setMarket(m);
    const [lo, hi] = boundsFor(m);
    setPriceLo(lo);
    setPriceHi(hi);
  };

  // hydrate filters from the URL on mount
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const m = q.get("dest");
    if (m) setMarket(m);
    if (q.get("type")) setType(q.get("type")!);
    if (q.get("status")) setStatus(q.get("status")!);
    if (q.get("view")) setView(q.get("view")!);
    if (q.get("beds")) setMinBeds(Number(q.get("beds")));
    const [bMin, bMax] = boundsFor(m || ALL);
    setPriceLo(q.get("pmin") ? Math.max(bMin, Number(q.get("pmin"))) : bMin);
    setPriceHi(q.get("pmax") ? Math.min(bMax, Number(q.get("pmax"))) : bMax);
    if (q.get("sort")) setSort(q.get("sort")!);
  }, []);

  // reflect active filters to the URL (no history spam)
  useEffect(() => {
    const q = new URLSearchParams();
    if (market !== ALL) q.set("dest", market);
    if (type !== ALL) q.set("type", type);
    if (status !== ALL) q.set("status", status);
    if (view !== ALL) q.set("view", view);
    if (minBeds > 0) q.set("beds", String(minBeds));
    if (priceLo > priceMin) q.set("pmin", String(priceLo));
    if (priceHi < priceMax) q.set("pmax", String(priceHi));
    if (sort !== "featured") q.set("sort", sort);
    const qs = q.toString();
    const next = window.location.pathname + (qs ? `?${qs}` : "");
    window.history.replaceState(window.history.state, "", next);
  }, [market, type, status, view, minBeds, priceLo, priceHi, sort]);

  const result = useMemo(() => {
    let out = items.filter(
      (l) =>
        (market === ALL || l.market === market) &&
        (type === ALL || l.type === type) &&
        (status === ALL || l.status === status) &&
        (view === ALL || viewList(l.view).includes(view)) &&
        l.beds >= minBeds &&
        (!priceActive || (l.priceNum > 0 && l.priceNum >= priceLo && l.priceNum <= priceHi))
    );
    // "Price on request" sorts as most expensive
    const salePrice = (x: Listing) => (x.priceNum && x.priceNum > 0 ? x.priceNum : Infinity);
    if (sort === "low") out = [...out].sort((a, b) => salePrice(a) - salePrice(b));
    if (sort === "high") out = [...out].sort((a, b) => salePrice(b) - salePrice(a));
    if (sort === "newest") {
      const recency = (x: Listing) => (x as any).created ?? (x as any).added ?? 0;
      out = [...out].sort((a, b) => recency(b) - recency(a));
    }
    return out;
  }, [items, market, type, status, view, minBeds, priceLo, priceHi, priceActive, sort]);

  const reset = () => {
    setMarket(ALL);
    setType(ALL);
    setStatus(ALL);
    setView(ALL);
    setMinBeds(0);
    setPriceLo(priceMin);
    setPriceHi(priceMax);
    setSort("featured");
  };

  const activeFilters =
    Number(market !== ALL) +
    Number(type !== ALL) +
    Number(status !== ALL) +
    Number(view !== ALL) +
    Number(minBeds > 0) +
    Number(priceActive);

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
            value={market}
            onChange={(v) => changeMarket(String(v))}
            options={marketOpts.map((m) => ({ label: m, value: m }))}
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

        {/* Secondary row — Type, Bedrooms, Price */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "22px 40px", alignItems: "flex-start", paddingTop: 20, borderTop: "1px solid var(--border-subtle)" }}>
          <Segmented
            label="Type"
            value={type}
            onChange={(v) => setType(String(v))}
            options={typeOpts.map((t) => ({ label: t, value: t }))}
          />
          <Segmented
            label="Bedrooms"
            value={minBeds}
            onChange={(v) => setMinBeds(Number(v))}
            options={[
              { label: "Any", value: 0 },
              { label: "1+", value: 1 },
              { label: "2+", value: 2 },
              { label: "3+", value: 3 },
              { label: "4+", value: 4 },
              { label: "5+", value: 5 },
            ]}
          />
          {priceMax > priceMin && (
            <RangeSlider
              label="Price"
              min={priceMin}
              max={priceMax}
              step={PRICE_STEP}
              lo={priceLo}
              hi={priceHi}
              onChange={(lo, hi) => { setPriceLo(lo); setPriceHi(hi); }}
              format={fmtUSD}
              scale="log"
            />
          )}
        </div>

        {/* Status + View */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "22px 40px", alignItems: "flex-start", paddingTop: 20, borderTop: "1px solid var(--border-subtle)" }}>
          <Segmented
            label="Status"
            value={status}
            onChange={(v) => setStatus(String(v))}
            options={statusOpts.map((s) => ({ label: s, value: s }))}
          />
          <Segmented
            label="View"
            value={view}
            onChange={(v) => setView(String(v))}
            options={viewOpts.map((v) => ({ label: v, value: v }))}
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
          {result.length} {result.length === 1 ? "residence" : "residences"}
          {market !== ALL ? " in " + market : ""}
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
        <div
          data-grid="3"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 26 }}
        >
          {result.map((it) => (
            <PropertyCard key={it.id} item={it} />
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
            Loosen a filter, or let us source it for you off-market.
          </p>
          <OutlineButton onClick={reset}>Clear filters</OutlineButton>
        </div>
      )}
    </>
  );
}
