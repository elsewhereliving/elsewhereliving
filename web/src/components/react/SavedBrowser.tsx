import { useState } from "react";
import type { Listing, Rental } from "../../lib/types";
import { viewList, viewText } from "../../lib/format";
import { useSaved } from "./useSaved";
import SaveButton from "./SaveButton";

// Faithful port of js/pages.js SavedScreen body. Receives the full catalogue of
// listings + rentals and the contact details; filters to whatever ids are saved
// in localStorage ("ew_saved_v1", via useSaved). Renders listing cards like
// js/brand.js PropertyCard and rental cards like js/pages.js RentalCard.

interface Contact {
  email: string;
  whatsapp: string;
}

interface Props {
  listings: Listing[];
  rentals: Rental[];
  contact: Contact;
}

// --- icons (inline, from js/icons.js EW_ICONS) ----------------------------
const ICON_PATHS: Record<string, string> = {
  bed: '<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>',
  bath:
    '<path d="M2 12h20"/><path d="M4 12V6a2 2 0 0 1 4 0"/><path d="M4 12v3a5 5 0 0 0 5 5h6a5 5 0 0 0 5-5v-3"/><path d="M8 20l-1 2"/><path d="M16 20l1 2"/>',
  users:
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  interior:
    '<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',
  plot: '<path d="M4 8V4h4"/><path d="M20 8V4h-4"/><path d="M4 16v4h4"/><path d="M20 16v4h-4"/><path d="M9 12h6"/><path d="M12 9v6"/>',
  view: '<path d="M2 12s3.2-7 10-7 10 7 10 7-3.2 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  whatsapp: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
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

// --- HeartIcon (js/brand.js HeartIcon) ------------------------------------
function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      style={{ display: "block" }}
      aria-hidden="true"
    >
      <path
        d="M12 20.5S3.5 14.6 3.5 8.9A4.4 4.4 0 0 1 12 6.6a4.4 4.4 0 0 1 8.5 2.3c0 5.7-8.5 11.6-8.5 11.6Z"
        strokeLinejoin="round"
      />
    </svg>
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
      style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 7, cursor: "help" }}
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
        </span>
      ) : null}
    </span>
  );
}

// --- SaveButton overlay heart (js/brand.js SaveButton) --------------------
function SaveHeart({ id }: { id: string }) {
  const [saved, toggle] = useSaved();
  const active = saved.includes(id);
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(id);
      }}
      aria-label={active ? "Remove from saved" : "Save property"}
      title={active ? "Saved" : "Save"}
      style={{
        width: 40,
        height: 40,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "var(--radius-pill)",
        cursor: "pointer",
        lineHeight: 0,
        background: active ? "var(--butter)" : "rgba(255,255,255,0.9)",
        color: active ? "var(--navy)" : "var(--charcoal)",
        border: active ? "1px solid var(--butter)" : "1px solid var(--border-subtle)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        transition: "all var(--dur-base) var(--ease-out)",
      }}
    >
      <HeartIcon filled={active} />
    </button>
  );
}

// --- PropertyCard (js/brand.js PropertyCard) — whole card is an <a> --------
function PropertyCard({ item }: { item: Listing }) {
  const [hover, setHover] = useState(false);
  const isLand = item.type === "Land";
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
            transform: hover ? "scale(1.07)" : "scale(1)",
          }}
        />
        {item.status ? (
          <div style={{ position: "absolute", top: 14, left: 14, zIndex: 2 }}>
            <BadgeLight>{item.status}</BadgeLight>
          </div>
        ) : null}
        <div style={{ position: "absolute", top: 12, right: 12, zIndex: 2 }}>
          <SaveHeart id={item.id} />
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
          {isLand ? (
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
        <div style={{ marginTop: 16, display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
          <PriceTag value={item.price} original={item.priceOriginal} currency={item.priceCurrency} size={19} />
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
              {isLand ? item.yield : item.yield + " yield"}
            </div>
          ) : null}
        </div>
      </div>
    </a>
  );
}

// --- RentalCard (js/pages.js RentalCard) — whole card is an <a> -----------
function RentalCard({ item }: { item: Rental }) {
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
        <div style={{ position: "absolute", top: 14, left: 14, zIndex: 2, display: "flex", flexWrap: "wrap", gap: 6 }}>
          {views.map((v) => (
            <BadgeLight key={v}>{v}</BadgeLight>
          ))}
        </div>
        <div style={{ position: "absolute", top: 12, right: 12, zIndex: 2 }}>
          <SaveHeart id={item.id} />
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
            gap: 18,
            marginTop: 20,
            paddingTop: 18,
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          <span style={{ display: "flex", flexDirection: "column", flex: "none" }}>
            {!(item as any).nightlyFixed && (
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
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--slate)", letterSpacing: "0.04em" }}>
                {" "}
                / night
              </span>
            </span>
          </span>
          <span
            style={{
              flex: "0 1 auto",
              minWidth: 0,
              maxWidth: "50%",
              textAlign: "right",
              lineHeight: 1.4,
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

// --- Label (js/brand.js Label) — renders "[ … ]" via the .ew-label class ---
function Label({ children }: { children: React.ReactNode }) {
  return <span className="ew-label">[ {children} ]</span>;
}

export default function SavedBrowser({ listings, rentals, contact }: Props) {
  const [saved] = useSaved();

  const savedListings = listings.filter((l) => saved.includes(l.id));
  const savedRentals = rentals.filter((r) => saved.includes(r.id));
  const count = savedListings.length + savedRentals.length;

  // Build a ready-to-send shortlist message from the saved properties.
  const allItems = [
    ...savedListings.map((it) => ({ title: it.title, location: it.location, price: it.price })),
    ...savedRentals.map((it) => ({ title: it.title, location: it.location, price: `${it.nightly} / night` })),
  ];
  const lines = allItems.map((it, i) => `${i + 1}. ${it.title} — ${it.location} · ${it.price}`);
  const message =
    "Hello Elsewhere Living,\n\nI've shortlisted " +
    count +
    " " +
    (count === 1 ? "property" : "properties") +
    " on your site that I'd love to view:\n\n" +
    lines.join("\n") +
    "\n\nPlease get in touch to arrange viewings — in person or by private video tour.\n\nName:\nPreferred contact time:";
  const waDigits = (contact.whatsapp || "").replace(/[^0-9]/g, "");
  const waHref = "https://wa.me/" + waDigits + "?text=" + encodeURIComponent(message);
  const mailHref =
    "mailto:" +
    contact.email +
    "?subject=" +
    encodeURIComponent("Property shortlist — " + count + " saved") +
    "&body=" +
    encodeURIComponent(message);

  if (!count) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px", maxWidth: 520, margin: "0 auto" }}>
        <div style={{ color: "var(--stone)", marginBottom: 22, display: "flex", justifyContent: "center" }}>
          <HeartIcon filled={false} />
        </div>
        <h2
          style={{
            margin: 0,
            fontFamily: "var(--font-serif)",
            fontWeight: 300,
            fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
            color: "var(--navy)",
          }}
        >
          Nothing saved yet.
        </h2>
        <p
          style={{
            margin: "14px 0 28px",
            fontFamily: "var(--font-sans)",
            fontWeight: 300,
            fontSize: 15.5,
            lineHeight: 1.7,
            color: "var(--text-body)",
          }}
        >
          Tap the heart on any property to build your shortlist. It'll be waiting here when you come back.
        </p>
        <a
          href="/properties/"
          className="ew-btn"
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
            padding: "1.05em 2em",
            fontSize: 12.5,
            letterSpacing: "0.14em",
            background: "var(--navy)",
            color: "var(--white)",
            border: "1.25px solid var(--navy)",
          }}
        >
          Browse the collection
        </a>
      </div>
    );
  }

  return (
    <>
      <div
        data-grid="split"
        style={{
          background: "var(--white)",
          border: "1px solid var(--border-subtle)",
          padding: "clamp(24px, 3.4vw, 38px)",
          marginBottom: 36,
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "clamp(20px, 3vw, 44px)",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ color: "var(--slate)", marginBottom: 12 }}>
            <Label>
              {count} {count === 1 ? "home" : "homes"} shortlisted
            </Label>
          </div>
          <h2
            style={{
              margin: 0,
              fontFamily: "var(--font-serif)",
              fontWeight: 300,
              fontSize: "clamp(1.5rem, 2.6vw, 2.1rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
              color: "var(--navy)",
            }}
          >
            Send your shortlist to our advisors.
          </h2>
          <p
            style={{
              margin: "12px 0 0",
              maxWidth: 540,
              fontFamily: "var(--font-sans)",
              fontWeight: 300,
              fontSize: 15,
              lineHeight: 1.7,
              color: "var(--text-body)",
            }}
          >
            We'll open a message pre-filled with these {count === 1 ? "property" : "properties"} so you don't have to
            retype a thing — just add your name and hit send. We typically reply within one business day.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 210 }}>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="ew-btn"
            style={{
              width: "100%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 9,
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              textTransform: "uppercase",
              textDecoration: "none",
              cursor: "pointer",
              whiteSpace: "nowrap",
              lineHeight: 1,
              borderRadius: "var(--radius-pill)",
              padding: "1.05em 2em",
              fontSize: 12.5,
              letterSpacing: "0.14em",
              background: "var(--navy)",
              color: "var(--white)",
              border: "1.25px solid var(--navy)",
            }}
          >
            <Icon name="whatsapp" size={16} color="currentColor" stroke={1.6} /> Send via WhatsApp
          </a>
          <a
            href={mailHref}
            className="ew-btn"
            style={{
              width: "100%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 9,
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              textTransform: "uppercase",
              textDecoration: "none",
              cursor: "pointer",
              whiteSpace: "nowrap",
              lineHeight: 1,
              borderRadius: "var(--radius-pill)",
              padding: "1.05em 2em",
              fontSize: 12.5,
              letterSpacing: "0.14em",
              background: "transparent",
              color: "var(--charcoal)",
              border: "1.25px solid currentColor",
            }}
          >
            <Icon name="mail" size={16} color="currentColor" stroke={1.5} /> Send via email
          </a>
          <a
            href="/contact/"
            className="ew-textlink"
            style={{
              cursor: "pointer",
              textAlign: "center",
              fontFamily: "var(--font-sans)",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--slate)",
              paddingTop: 2,
              textDecoration: "none",
            }}
          >
            Or use the enquiry form
          </a>
        </div>
      </div>

      <div data-grid="3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 26 }}>
        {savedListings.map((it) => (
          <PropertyCard key={it.id} item={it} />
        ))}
        {savedRentals.map((it) => (
          <RentalCard key={it.id} item={it} />
        ))}
      </div>
    </>
  );
}
