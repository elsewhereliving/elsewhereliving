import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// Crossfading hero frame + thumbnail strip. For speed it loads photos ON DEMAND:
// only the active image (and its immediate neighbours, for instant navigation)
// are fetched up front — not all 14–49 of them. Thumbnails are small optimized
// WebPs and lazy-load as the strip scrolls.

function Chevron({ dir }: { dir: "left" | "right" }) {
  const d = dir === "left" ? "m15 6-6 6 6 6" : "m9 6 6 6-6 6";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--white)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }} aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

interface Props {
  images: string[];        // large/optimized sources for the main frame
  thumbs?: string[];       // small optimized sources for the strip (defaults to images)
  title: string;
}

export default function Gallery({ images, thumbs, title }: Props) {
  const list = images && images.length ? images : [];
  const thumbList = thumbs && thumbs.length === list.length ? thumbs : list;
  const many = list.length > 1;
  const stripRef = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(0);
  // Which main images have been requested (active + neighbours, growing as you browse).
  const [loaded, setLoaded] = useState<Set<number>>(() => {
    const s = new Set<number>([0]);
    if (list.length > 1) s.add(1);
    return s;
  });

  const reveal = (i: number) =>
    setLoaded((prev) => {
      const next = new Set(prev);
      next.add(i);
      next.add((i + 1) % list.length);
      next.add((i - 1 + list.length) % list.length);
      return next;
    });

  const goto = (i: number) => { setActive(i); reveal(i); };
  const go = (dir: number) => goto((active + dir + list.length) % list.length);

  // Fullscreen lightbox: shows the whole photo (object-fit: contain) so nothing
  // gets cropped — useful for portrait shots with text/detail near the edges.
  const [zoom, setZoom] = useState(false);

  // Keep the active thumbnail centered in the strip.
  useEffect(() => {
    const strip = stripRef.current;
    const thumb = strip?.children[active] as HTMLElement | undefined;
    if (!strip || !thumb) return;
    strip.scrollTo({ left: Math.max(0, thumb.offsetLeft - strip.clientWidth / 2 + thumb.clientWidth / 2), behavior: "smooth" });
  }, [active]);

  // While the lightbox is open: lock page scroll and wire up keyboard nav.
  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoom(false);
      else if (e.key === "ArrowRight" && many) go(1);
      else if (e.key === "ArrowLeft" && many) go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [zoom, many, active]);

  if (!list.length) return null;

  const arrowBase: React.CSSProperties = {
    position: "absolute", top: "50%", transform: "translateY(-50%)", zIndex: 3,
    width: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
    border: "1px solid rgba(255,255,255,0.55)", background: "rgba(15,22,40,0.34)",
    backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)", color: "var(--white)",
    transition: "background var(--dur-base) var(--ease-out)",
  };

  return (
    <div style={{ minWidth: 0 }}>
      <div
        className="ew-grain"
        onClick={() => setZoom(true)}
        style={{ position: "relative", aspectRatio: "16 / 10", overflow: "hidden", background: "var(--navy)", cursor: "zoom-in" }}
      >
        {list.map((src, i) =>
          loaded.has(i) ? (
            <img
              key={i}
              src={src}
              alt={title + " — view " + (i + 1)}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={i === 0 ? "high" : "low"}
              style={{
                position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
                opacity: i === active ? 1 : 0, transition: "opacity var(--dur-slow) var(--ease-out)",
              }}
            />
          ) : null
        )}
        <div
          aria-hidden="true"
          style={{ position: "absolute", top: 14, left: 14, zIndex: 3, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15,22,40,0.4)", backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)", pointerEvents: "none" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--white)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        </div>
        {many && (
          <>
            <button onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Previous photo" className="ew-gallery-arrow" style={{ ...arrowBase, left: 14 }}>
              <Chevron dir="left" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Next photo" className="ew-gallery-arrow" style={{ ...arrowBase, right: 14 }}>
              <Chevron dir="right" />
            </button>
            <div style={{ position: "absolute", bottom: 14, right: 14, zIndex: 3, padding: "6px 12px", background: "rgba(15,22,40,0.5)", backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)", fontFamily: "var(--font-sans)", fontSize: 11, letterSpacing: "0.14em", color: "var(--white)" }}>
              {active + 1} / {list.length}
            </div>
          </>
        )}
      </div>
      {many && (
        <div ref={stripRef} className="ew-gallery-strip" style={{ display: "flex", gap: 10, marginTop: 10, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "thin" }}>
          {thumbList.map((src, i) => (
            <button
              key={i}
              onClick={() => goto(i)}
              aria-label={"View photo " + (i + 1)}
              style={{ flex: "0 0 auto", width: 96, padding: 0, border: "1px solid " + (i === active ? "var(--navy)" : "var(--border-subtle)"), cursor: "pointer", aspectRatio: "4 / 3", overflow: "hidden", background: "none", opacity: i === active ? 1 : 0.55, transition: "opacity var(--dur-base) var(--ease-out)" }}
            >
              <img src={src} alt="" loading="lazy" decoding="async" width={96} height={72} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </button>
          ))}
        </div>
      )}

      {zoom && typeof document !== "undefined" && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title + " — photo viewer"}
          onClick={() => setZoom(false)}
          style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(8,12,24,0.94)", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <img
            src={list[active]}
            alt={title + " — view " + (active + 1)}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "94vw", maxHeight: "90vh", width: "auto", height: "auto", objectFit: "contain", cursor: "default" }}
          />

          <button
            onClick={(e) => { e.stopPropagation(); setZoom(false); }}
            aria-label="Close photo viewer"
            style={{ position: "fixed", top: 20, right: 20, zIndex: 3, width: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "1px solid rgba(255,255,255,0.55)", background: "rgba(15,22,40,0.34)", backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)", color: "var(--white)" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--white)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          {many && (
            <>
              <button onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Previous photo" className="ew-gallery-arrow" style={{ ...arrowBase, left: 20 }}>
                <Chevron dir="left" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Next photo" className="ew-gallery-arrow" style={{ ...arrowBase, right: 20 }}>
                <Chevron dir="right" />
              </button>
              <div style={{ position: "fixed", bottom: 22, left: "50%", transform: "translateX(-50%)", zIndex: 3, padding: "6px 14px", background: "rgba(15,22,40,0.5)", backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)", fontFamily: "var(--font-sans)", fontSize: 12, letterSpacing: "0.14em", color: "var(--white)" }}>
                {active + 1} / {list.length}
              </div>
            </>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}
