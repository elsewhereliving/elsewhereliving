import { useEffect, useState } from "react";
import type { Testimonial } from "../../lib/types";

// Faithful port of js/home.js TestimonialBand — stars, rotating serif quote,
// dots. Lives on the paper section; navy type.
export default function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || items.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % items.length), 7000);
    return () => clearInterval(id);
  }, [paused, items.length]);

  if (!items.length) return null;
  const t = items[idx];
  const many = items.length > 1;
  const go = (d: number) => setIdx((i) => (i + d + items.length) % items.length);

  const arrowStyle: React.CSSProperties = {
    flex: "0 0 auto",
    width: 44,
    height: 44,
    borderRadius: 999,
    border: "1px solid var(--border-subtle)",
    background: "transparent",
    color: "var(--navy)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out)",
  };
  const Chevron = ({ dir }: { dir: "left" | "right" }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d={dir === "left" ? "m15 6-6 6 6 6" : "m9 6 6 6-6 6"} />
    </svg>
  );

  return (
    <div
      className="reveal"
      style={{ maxWidth: 920, margin: "0 auto", textAlign: "center" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div style={{ color: "var(--slate)", marginBottom: 22 }}>
        <span className="ew-label">[ Testimonial ]</span>
      </div>
      <div style={{ color: "var(--butter)", letterSpacing: "0.3em", fontSize: 18, marginBottom: 28, filter: "drop-shadow(0 1px 0 rgba(0,0,0,0.12))" }}>★★★★★</div>

      <div style={{ display: "flex", alignItems: "center", gap: "clamp(12px, 3vw, 32px)", justifyContent: "center" }}>
        {many && (
          <button className="ew-testi-arrow" style={arrowStyle} aria-label="Previous testimonial" onClick={() => go(-1)}>
            <Chevron dir="left" />
          </button>
        )}
        <div key={idx} className="ew-testi-fade" style={{ flex: "1 1 auto", minWidth: 0 }}>
          <blockquote style={{ margin: 0, fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: "clamp(1.5rem, 3vw, 2.4rem)", lineHeight: 1.32, letterSpacing: "-0.01em", color: "var(--navy)", textWrap: "balance" } as React.CSSProperties}>
            “{t.quote}”
          </blockquote>
          <div style={{ marginTop: 32, fontFamily: "var(--font-sans)", fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--slate)" }}>
            {t.name} — {t.place}
          </div>
        </div>
        {many && (
          <button className="ew-testi-arrow" style={arrowStyle} aria-label="Next testimonial" onClick={() => go(1)}>
            <Chevron dir="right" />
          </button>
        )}
      </div>

      {many && (
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 38 }}>
          {items.map((it, i) => (
            <button key={i} className="ew-testi-dot" aria-current={i === idx} aria-label={`Show testimonial from ${it.name}`} onClick={() => setIdx(i)} />
          ))}
        </div>
      )}
    </div>
  );
}
