import { useEffect, useState } from "react";
import { useSaved } from "./useSaved";
import Button from "./Button";

// Faithful port of js/chrome.js Nav. Transparent (white) over the home hero
// until scrolled; solid paper elsewhere. Includes the slide-in mobile menu.
const NAV_LINKS: Array<{ key: string; href: string; label: string }> = [
  { key: "home", href: "/", label: "Home" },
  { key: "properties", href: "/properties/", label: "Properties" },
  { key: "custom", href: "/custom-homes/", label: "Custom Homes" },
  { key: "rentals", href: "/rentals/", label: "Vacation Rentals" },
  { key: "about", href: "/about/", label: "About" },
  { key: "contact", href: "/contact/", label: "Contact" },
];

function Wordmark({ size, color }: { size: number; color: string }) {
  return (
    <span className="ew-wordmark" style={{ fontSize: size, color }}>
      <span className="ew-else">else</span>
      <span className="ew-where">where</span>
    </span>
  );
}
function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

export default function Nav({ current = "home", transparent = false }: { current?: string; transparent?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [saved] = useSaved();
  const savedCount = saved.length;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = !transparent || scrolled;
  const fg = solid ? "var(--charcoal)" : "var(--white)";

  return (
    <>
      <header
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
          transition: "background var(--dur-slow) var(--ease-out), border-color var(--dur-slow) var(--ease-out)",
          background: solid ? "rgba(239,239,239,0.86)" : "transparent",
          backdropFilter: solid ? "blur(14px)" : "none",
          WebkitBackdropFilter: solid ? "blur(14px)" : "none",
          borderBottom: "1px solid " + (solid ? "var(--border-subtle)" : "transparent"),
        }}
      >
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 56px)", height: 74, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/" style={{ cursor: "pointer", color: fg, transition: "color var(--dur-slow) var(--ease-out)" }} aria-label="Elsewhere Living — home">
            <Wordmark size={27} color={fg} />
          </a>
          <nav style={{ display: "flex", alignItems: "center", gap: "clamp(20px, 2.6vw, 40px)" }} className="ew-nav-desktop">
            {NAV_LINKS.map((l) => {
              const active = l.key === current;
              return (
                <a key={l.key} href={l.href} style={{ cursor: "pointer", position: "relative", color: fg, fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: 11.5, letterSpacing: "0.16em", textTransform: "uppercase", paddingBottom: 4, opacity: active ? 1 : 0.82, transition: "opacity var(--dur-base) var(--ease-out), color var(--dur-slow) var(--ease-out)" }}>
                  {l.label}
                  <span style={{ position: "absolute", left: 0, bottom: 0, height: 1, width: "100%", background: solid ? "var(--charcoal)" : "var(--white)", transform: active ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left", transition: "transform var(--dur-base) var(--ease-out)" }} />
                </a>
              );
            })}
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <a href="/saved/" title="Saved properties" className="ew-nav-saved" style={{ cursor: "pointer", color: fg, display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--font-sans)", fontSize: 11.5, letterSpacing: "0.14em", textTransform: "uppercase", transition: "color var(--dur-slow) var(--ease-out)" }}>
              <HeartIcon filled={savedCount > 0} />
              <span style={{ minWidth: 18, textAlign: "center", color: current === "saved" ? (solid ? "var(--navy)" : "var(--white)") : "inherit" }}>{savedCount}</span>
            </a>
            <Button as="a" href="/contact/" variant={solid ? "solid" : "outline-light"} size="sm" shape="pill" className="ew-nav-cta">Enquire</Button>
            <button onClick={() => setMenuOpen(true)} aria-label="Open menu" className="ew-nav-burger" style={{ display: "none", background: "transparent", border: "none", cursor: "pointer", color: fg, padding: 6 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile slide-in menu */}
      <div style={{ position: "fixed", inset: 0, zIndex: 300, pointerEvents: menuOpen ? "auto" : "none" }}>
        <div onClick={() => setMenuOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(10,12,16,0.5)", opacity: menuOpen ? 1 : 0, transition: "opacity var(--dur-base) var(--ease-out)" }} />
        <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "min(82vw, 360px)", background: "var(--navy)", padding: "30px 30px 40px", transform: menuOpen ? "translateX(0)" : "translateX(100%)", transition: "transform var(--dur-slow) var(--ease-out)", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 44 }}>
            <Wordmark size={24} color="var(--white)" />
            <button onClick={() => setMenuOpen(false)} aria-label="Close menu" style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--white)", padding: 6 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M5 5l14 14M19 5L5 19" /></svg>
            </button>
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {NAV_LINKS.concat([{ key: "saved", href: "/saved/", label: `Saved (${savedCount})` }]).map((l) => (
              <a key={l.key} href={l.href} style={{ cursor: "pointer", color: "var(--white)", padding: "14px 0", borderBottom: "1px solid var(--border-on-dark)", fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: 26, letterSpacing: "-0.01em", opacity: l.key === current ? 1 : 0.7 }}>
                {l.label}
              </a>
            ))}
          </nav>
          <div style={{ marginTop: "auto" }}>
            <Button as="a" href="/contact/" variant="accent" size="md" shape="pill" style={{ width: "100%" }}>Start your enquiry</Button>
          </div>
        </div>
      </div>
    </>
  );
}
