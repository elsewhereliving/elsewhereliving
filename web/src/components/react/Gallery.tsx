import { useEffect, useRef, useState } from "react";

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

  // Keep the active thumbnail centered in the strip.
  useEffect(() => {
    const strip = stripRef.current;
    const thumb = strip?.children[active] as HTMLElement | undefined;
    if (!strip || !thumb) return;
    strip.scrollTo({ left: Math.max(0, thumb.offsetLeft - strip.clientWidth / 2 + thumb.clientWidth / 2), behavior: "smooth" });
  }, [active]);

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
      <div className="ew-grain" style={{ position: "relative", aspectRatio: "16 / 10", overflow: "hidden", background: "var(--navy)" }}>
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
        {many && (
          <>
            <button onClick={() => go(-1)} aria-label="Previous photo" className="ew-gallery-arrow" style={{ ...arrowBase, left: 14 }}>
              <Chevron dir="left" />
            </button>
            <button onClick={() => go(1)} aria-label="Next photo" className="ew-gallery-arrow" style={{ ...arrowBase, right: 14 }}>
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
    </div>
  );
}
