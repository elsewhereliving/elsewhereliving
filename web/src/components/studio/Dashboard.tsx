import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { rentDest } from "../../lib/format";
import { optImg } from "../../lib/img";
import { Icon } from "./icons";
import HomeFeatured from "./HomeFeatured";
import FeaturedRentals from "./FeaturedRentals";
import { useStudio, useToast, type Rec } from "./store";

// Saving writes a JSON file into web/src/content/, which Vite/Astro HMR picks up
// and reloads — remounting this client:only island back to its defaults (For
// sale, scrolled to the top). So the browsing position (tab, filters, sort,
// scroll) is stashed in sessionStorage and restored on mount, surviving both an
// HMR remount and a full reload. sessionStorage clears when the tab closes.
const VIEW_KEY = "ew-studio-view";
type ViewState = {
  collection?: string; q?: string; fMarket?: string; fType?: string;
  fStatus?: string; fDest?: string; sort?: string; scrollY?: number;
};
function readView(): ViewState {
  try { return JSON.parse(sessionStorage.getItem(VIEW_KEY) || "{}"); } catch { return {}; }
}
function patchView(patch: ViewState) {
  try { sessionStorage.setItem(VIEW_KEY, JSON.stringify({ ...readView(), ...patch })); } catch {}
}

const meta = (extra?: CSSProperties): CSSProperties => ({
  fontFamily: "var(--font-sans)", fontSize: 10.5, letterSpacing: "0.2em",
  textTransform: "uppercase", color: "var(--slate)", fontWeight: 500, ...extra,
});
const num = (x: Rec, isRental: boolean) => (isRental ? x.nightlyNum : x.priceNum) || 0;

export default function Dashboard({
  onEdit, onNew, onImport, onLogout,
}: {
  onEdit: (c: string, id: string) => void;
  onNew: (c: string) => void;
  onImport: (c: string) => void;
  onLogout: () => void;
}) {
  const crm = useStudio();
  const toast = useToast();
  const saved = useRef(readView()).current;
  const [collection, setCollection] = useState<"listings" | "rentals" | "home" | "featrentals">((saved.collection as any) ?? "listings");
  const isFeaturedView = collection === "home" || collection === "featrentals";
  const [q, setQ] = useState(saved.q ?? "");
  const [fMarket, setFMarket] = useState(saved.fMarket ?? "All");
  const [fType, setFType] = useState(saved.fType ?? "All");
  const [fStatus, setFStatus] = useState(saved.fStatus ?? "All");
  const [fDest, setFDest] = useState(saved.fDest ?? "All");
  const [sort, setSort] = useState(saved.sort ?? "newest");
  const [menu, setMenu] = useState(false);

  const isRental = collection === "rentals";
  const all = crm.list(collection === "home" ? "listings" : collection);
  const counts = crm.counts();

  // Reset the per-collection filters when the tab is switched — but not on the
  // first render, so a tab restored from sessionStorage keeps its filters.
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    setFMarket("All"); setFType("All"); setFStatus("All"); setFDest("All");
  }, [collection]);

  // Stash the browsing position on every change so a save-triggered reload lands
  // back where the user was.
  useEffect(() => {
    patchView({ collection, q, fMarket, fType, fStatus, fDest, sort });
  }, [collection, q, fMarket, fType, fStatus, fDest, sort]);

  // Save the scroll position (coalesced to one write per frame) and restore it
  // once on mount, after layout settles.
  useEffect(() => {
    let tick = false;
    const onScroll = () => {
      if (tick) return;
      tick = true;
      requestAnimationFrame(() => { tick = false; patchView({ scrollY: window.scrollY }); });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    const y = saved.scrollY;
    if (typeof y !== "number" || y <= 0) return;
    // Jump straight to the saved offset (behavior:"instant" — the page sets
    // scroll-behavior:smooth globally, so a plain scrollTo would animate). Retry
    // on a timer until it lands: the card grid isn't laid out on the first tick,
    // so an early attempt falls short. A timer (not rAF) so it still runs if the
    // save/reload happened while this tab was in the background.
    let tries = 0;
    let timer = 0;
    const restore = () => {
      if (window.innerHeight > 0 && document.documentElement.scrollHeight > y) {
        window.scrollTo({ top: y, left: 0, behavior: "instant" as ScrollBehavior });
        if (Math.abs(window.scrollY - y) <= 2) return;
      }
      if (tries++ < 40) timer = window.setTimeout(restore, 50);
    };
    restore();
    return () => window.clearTimeout(timer);
  }, [saved]);

  const markets = useMemo(() => ["All", ...crm.markets], [crm.markets]);
  const dests = useMemo(
    () => ["All", ...Array.from(new Set(all.map((r) => rentDest(r.location)).filter(Boolean)))],
    [all]
  );

  const view = useMemo(() => {
    const idx: Record<string, number> = {};
    all.forEach((x, i) => (idx[x.id] = i));
    // `created` only — the legacy `added` weight (1–95) is not a timestamp.
    const newOf = (it: Rec) => it.created || 1e12 - idx[it.id];
    const filtered = all.filter((it) => {
      const hay = (it.title + " " + it.location + " " + (it.place || "") + " " + (it.internalName || "")).toLowerCase();
      if (q && hay.indexOf(q.toLowerCase()) < 0) return false;
      if (!isRental) {
        if (fMarket !== "All" && it.market !== fMarket) return false;
        if (fType !== "All" && it.type !== fType) return false;
        if (fStatus !== "All" && it.status !== fStatus) return false;
      } else if (fDest !== "All" && rentDest(it.location) !== fDest) return false;
      return true;
    });
    const v = filtered.slice();
    if (sort === "priceLow") v.sort((a, b) => (num(a, isRental) || Infinity) - (num(b, isRental) || Infinity));
    else if (sort === "priceHigh") v.sort((a, b) => num(b, isRental) - num(a, isRental));
    else if (sort === "newest") v.sort((a, b) => newOf(b) - newOf(a));
    else v.sort((a, b) => {
      const af = a.featured ? 1 : 0, bf = b.featured ? 1 : 0;
      if (af !== bf) return bf - af;
      if (af && bf) return ((a.featuredRank ?? a.featuredOrder ?? 9999) - (b.featuredRank ?? b.featuredOrder ?? 9999)) || a.id.localeCompare(b.id);
      return newOf(b) - newOf(a);
    });
    return v;
  }, [all, q, fMarket, fType, fStatus, fDest, sort, isRental]);

  const activeFilters = (q ? 1 : 0) + [fMarket, fType, fStatus, fDest].filter((x) => x !== "All").length;
  const clearAll = () => { setQ(""); setFMarket("All"); setFType("All"); setFStatus("All"); setFDest("All"); };

  return (
    <div style={{ minHeight: "100vh", background: "var(--paper)" }}>
      <header style={{ position: "sticky", top: 0, zIndex: 20, background: "var(--white)", borderBottom: "1px solid var(--border-on-light)" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 30px", height: 70, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <img src="/assets/logos/elsewhere-black.png" alt="Elsewhere Living" style={{ height: 26, width: "auto", display: "block" }} />
            <span style={{ width: 1, height: 24, background: "var(--border-subtle)" }} />
            <span style={meta({ color: "var(--charcoal)" })}>The Listings Studio</span>
          </div>
          <div style={{ position: "relative" }}>
            <button type="button" className="ew-pillctl" onClick={() => setMenu(!menu)}
              style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "1px solid var(--border-on-light)", padding: "8px 16px", cursor: "pointer" }}>
              <span title={crm.fsConnected ? "Repo connected — Save writes to disk" : "Not connected — Save is session-only"} style={{ width: 7, height: 7, borderRadius: "50%", background: crm.fsConnected ? "#3a8a4a" : "var(--stone)", flex: "0 0 auto" }} />
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--charcoal)", lineHeight: 1 }}>Elsewhere Living</span>
              <Icon name="chevronRight" size={13} color="var(--slate)" style={{ transform: "rotate(90deg)" }} />
            </button>
            {menu && (
              <div style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", background: "var(--white)", border: "1px solid var(--border-on-light)", minWidth: 260, boxShadow: "0 20px 50px -24px rgba(15,22,40,0.5)", zIndex: 30 }}>
                {crm.fsSupported ? (
                  <MenuItem icon="home" label={crm.fsConnected ? "Repo folder connected" : "Connect repo folder"} sub={crm.fsConnected ? "Save writes to your local repo" : "Pick your repo clone so Save can write files"} onClick={() => { crm.connectRepo(); setMenu(false); }} />
                ) : (
                  <MenuItem icon="info" label="Open in Chrome to save" sub="Saving needs Chrome/Edge folder access" onClick={() => setMenu(false)} />
                )}
                <div style={{ borderTop: "1px solid var(--border-subtle)" }} />
                <MenuItem icon="key" label="Sign out" onClick={onLogout} />
              </div>
            )}
          </div>
        </div>
      </header>

      {!crm.fsConnected && (
        <div style={{ background: "var(--butter)", borderBottom: "1px solid var(--border-on-light)" }}>
          <div style={{ maxWidth: 1320, margin: "0 auto", padding: "11px 30px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 9, fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--navy)" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--navy)", flex: "0 0 auto" }} />
              {crm.fsSupported
                ? "Connect your repo folder before you start editing — otherwise your changes won't be saved."
                : "Open this page in Chrome or Edge to connect your repo folder and save changes."}
            </span>
            {crm.fsSupported && (
              <button type="button" className="ew-pillctl" onClick={() => crm.connectRepo()}
                style={{ flex: "0 0 auto", padding: "8px 18px", background: "var(--navy)", color: "var(--white)", border: "1px solid var(--navy)", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                Connect repo folder
              </button>
            )}
          </div>
        </div>
      )}

      <main style={{ maxWidth: 1320, margin: "0 auto", padding: "38px 30px 90px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 20, marginBottom: 26 }}>
          <div>
            <span style={meta()}>[ {isFeaturedView ? "Featured" : "Portfolio"} ]</span>
            <h1 style={{ fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: "clamp(32px, 5vw, 46px)", color: "var(--navy)", margin: "6px 0 0", letterSpacing: "-0.015em" }}>
              {collection === "home" ? "What visitors see first." : collection === "featrentals" ? "Featured rentals, front and centre." : "Every elsewhere, in one place."}
            </h1>
          </div>
          {!isFeaturedView && (
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <button type="button" className="ew-pillctl" onClick={() => onImport(collection)}
                style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "14px 24px", cursor: "pointer", background: "transparent", color: "var(--navy)", border: "1px solid var(--navy)", fontFamily: "var(--font-sans)", fontSize: 11.5, letterSpacing: "0.16em", textTransform: "uppercase" }}>
                <Icon name="external" size={14} color="var(--navy)" /> Import from link
              </button>
              <AddBtn onClick={() => onNew(collection)} label={isRental ? "Add rental" : "Add property"} />
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 26, borderBottom: "1px solid var(--border-on-light)", marginBottom: 22 }}>
          {([["listings", "For sale", counts.listings], ["rentals", "Rentals", counts.rentals], ["home", "Featured sales", ""], ["featrentals", "Featured rentals", ""]] as const).map((t) => {
            const active = collection === t[0];
            return (
              <button key={t[0]} type="button" onClick={() => setCollection(t[0] as any)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: "0 0 14px", marginBottom: -1, borderBottom: "2px solid " + (active ? "var(--navy)" : "transparent"), display: "flex", alignItems: "baseline", gap: 9 }}>
                <span style={{ fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: 22, color: active ? "var(--navy)" : "var(--slate)" }}>{t[1]}</span>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: active ? "var(--charcoal)" : "var(--stone)" }}>{t[2]}</span>
              </button>
            );
          })}
        </div>

        {collection === "featrentals" ? (
          <FeaturedRentals />
        ) : collection === "home" ? (
          <HomeFeatured />
        ) : (
          <>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", marginBottom: 14 }}>
              <div className="ew-searchbar" style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid var(--border-on-light)", background: "var(--white)", padding: "0 16px", flex: "1 1 280px", maxWidth: 420 }}>
                <Icon name="view" size={16} color="var(--slate)" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title, location…"
                  style={{ flex: 1, border: "none", background: "transparent", outline: "none", padding: "12px 0", fontFamily: "var(--font-sans)", fontSize: 13.5, color: "var(--charcoal)" }} />
                {q && <button type="button" onClick={() => setQ("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate)", fontSize: 17 }}>×</button>}
              </div>
              {!isRental ? (
                <>
                  <FilterSelect label="Market" value={fMarket} onChange={setFMarket} options={markets} />
                  <FilterSelect label="Type" value={fType} onChange={setFType} options={["All", "Villa", "Condominium", "Land"]} />
                  <FilterSelect label="Status" value={fStatus} onChange={setFStatus} options={["All", "Move-In Ready", "Off-Plan"]} />
                </>
              ) : (
                <FilterSelect label="Destination" value={fDest} onChange={setFDest} options={dests} />
              )}
              {activeFilters > 0 && (
                <button type="button" onClick={clearAll} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--navy)", textDecoration: "underline" }}>Clear</button>
              )}
              <div style={{ flex: 1 }} />
              <SortSelect value={sort} onChange={setSort} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
              <span style={meta()}>{view.length} {view.length === 1 ? "result" : "results"}{activeFilters ? " · filtered" : ""}</span>
            </div>

            {view.length ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(296px, 1fr))", gap: 26 }}>
                {view.map((it) => (
                  <AdminCard key={it.id} item={it} isRental={isRental}
                    onEdit={() => onEdit(collection, it.id)}
                    onFeature={() => { crm.toggleFeatured(collection, it.id); toast(it.featured ? "Removed from featured" : "Marked as featured"); }} />
                ))}
              </div>
            ) : (
              <div style={{ border: "1px dashed var(--stone)", padding: "70px 20px", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 22, color: "var(--slate)", marginBottom: 14 }}>Nothing here yet.</div>
                <AddBtn onClick={() => onNew(collection)} label={isRental ? "Add a rental" : "Add a property"} />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function AdminCard({ item, isRental, onEdit, onFeature }: { item: Rec; isRental: boolean; onEdit: () => void; onFeature: () => void }) {
  const [h, setH] = useState(false);
  const photos = (item.gallery || []).length || (item.image ? 1 : 0);
  const badges = (isRental ? [rentDest(item.location)] : [item.type, item.status]).filter(Boolean);
  return (
    <article onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onClick={onEdit}
      style={{ background: "var(--white)", border: "1px solid var(--border-subtle)", overflow: "hidden", cursor: "pointer", display: "flex", flexDirection: "column", transition: "box-shadow .4s var(--ease-out), transform .4s var(--ease-out)", boxShadow: h ? "0 26px 60px -38px rgba(15,22,40,0.55)" : "none", transform: h ? "translateY(-3px)" : "none" }}>
      <div className="ew-grain" style={{ position: "relative", aspectRatio: "4 / 3", overflow: "hidden", background: "var(--paper-2)" }}>
        {item.image && (
          <img src={optImg(item.image, "small")} alt="" loading="lazy"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: item.imageFocal || "center", transition: "transform 1.4s var(--ease-out)", transform: h ? "scale(1.06)" : "none" }} />
        )}
        <div style={{ position: "absolute", top: 12, left: 12, right: 12, maxWidth: "calc(100% - 52px)", display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", zIndex: 1 }}>
          {badges.map((b) => (
            <span key={b} style={{ background: "rgba(255,255,255,0.92)", color: "var(--navy)", fontFamily: "var(--font-sans)", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", padding: "5px 9px" }}>{b}</span>
          ))}
        </div>
        <span style={{ position: "absolute", bottom: 12, right: 12, display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(15,22,40,0.62)", color: "var(--white)", fontFamily: "var(--font-sans)", fontSize: 10, letterSpacing: "0.06em", padding: "4px 9px" }}>
          <Icon name="sparkles" size={11} color="var(--white)" fill="var(--white)" />{photos}
        </span>
        <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 6, zIndex: 2 }} onClick={(e) => e.stopPropagation()}>
          <button type="button" title={item.featured ? "Featured — tap to remove" : "Mark as featured"} aria-label="Toggle featured" onClick={onFeature}
            style={{ width: 32, height: 32, display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0, border: "1px solid " + (item.featured ? "var(--butter)" : "var(--border-on-light)"), background: item.featured ? "var(--butter)" : "var(--white)", color: "var(--navy)", fontSize: 15, lineHeight: 1, opacity: item.featured || h ? 1 : 0, transition: "opacity .25s var(--ease-out)" }}>
            {item.featured ? "★" : "☆"}
          </button>
        </div>
      </div>
      <div style={{ padding: "16px 18px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--slate)" }}>{item.location}</div>
        <h3 style={{ margin: "7px 0 0", fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: 20, lineHeight: 1.16, color: "var(--navy)", letterSpacing: "-0.01em" }}>{item.title || "Untitled"}</h3>
        {item.internalName && <div style={{ marginTop: 4, fontFamily: "var(--font-sans)", fontSize: 11.5, color: "var(--slate)", fontStyle: "italic" }}>{item.internalName}</div>}
        <div style={{ marginTop: "auto", paddingTop: 14, display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: 16, color: "var(--charcoal)" }}>{isRental ? (item.nightly ? item.nightly + " / night" : "On request") : (item.price || "—")}</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-sans)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: h ? "var(--navy)" : "var(--slate)", transition: "color .25s" }}>
            Edit <Icon name="arrowRight" size={13} color={h ? "var(--navy)" : "var(--slate)"} />
          </span>
        </div>
      </div>
    </article>
  );
}

function SortSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const opts: [string, string][] = [["featured", "Featured"], ["newest", "Newest"], ["priceLow", "Price: low to high"], ["priceHigh", "Price: high to low"]];
  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
      <span style={{ fontFamily: "var(--font-sans)", fontSize: 9.5, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--slate)", marginRight: 8 }}>Sort</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="ew-pillctl"
        style={{ appearance: "none", WebkitAppearance: "none", cursor: "pointer", background: "var(--white)", color: "var(--charcoal)", border: "1px solid var(--border-on-light)", padding: "13px 36px 13px 18px", fontFamily: "var(--font-sans)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {opts.map((o) => <option key={o[0]} value={o[0]} style={{ color: "#000" }}>{o[1]}</option>)}
      </select>
      <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%) rotate(90deg)", pointerEvents: "none" }}><Icon name="chevronRight" size={13} color="var(--slate)" /></span>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  const active = value !== "All";
  return (
    <div style={{ position: "relative" }}>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="ew-pillctl"
        style={{ appearance: "none", WebkitAppearance: "none", cursor: "pointer", background: active ? "var(--navy)" : "var(--white)", color: active ? "var(--white)" : "var(--charcoal)", border: "1px solid " + (active ? "var(--navy)" : "var(--border-on-light)"), padding: "13px 36px 13px 18px", fontFamily: "var(--font-sans)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {options.map((o) => <option key={o} value={o} style={{ color: "#000" }}>{o === "All" ? label + ": All" : o}</option>)}
      </select>
      <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%) rotate(90deg)", pointerEvents: "none" }}><Icon name="chevronRight" size={13} color={active ? "var(--white)" : "var(--slate)"} /></span>
    </div>
  );
}

function MenuItem({ icon, label, sub, onClick }: { icon: string; label: string; sub?: string; onClick: () => void }) {
  const [h, setH] = useState(false);
  return (
    <button type="button" onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ width: "100%", textAlign: "left", display: "flex", gap: 12, alignItems: "center", background: h ? "var(--paper)" : "var(--white)", border: "none", cursor: "pointer", padding: "13px 16px" }}>
      <Icon name={icon} size={16} color="var(--navy)" />
      <span>
        <span style={{ display: "block", fontFamily: "var(--font-sans)", fontSize: 12.5, letterSpacing: "0.04em", color: "var(--charcoal)" }}>{label}</span>
        {sub && <span style={{ display: "block", fontFamily: "var(--font-sans)", fontSize: 10.5, color: "var(--slate)", marginTop: 1 }}>{sub}</span>}
      </span>
    </button>
  );
}

function AddBtn({ onClick, label }: { onClick: () => void; label: string }) {
  const [h, setH] = useState(false);
  return (
    <button type="button" className="ew-pillctl" onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 26px", cursor: "pointer", background: h ? "var(--navy-80)" : "var(--navy)", color: "var(--white)", border: "none", fontFamily: "var(--font-sans)", fontSize: 11.5, letterSpacing: "0.18em", textTransform: "uppercase", transition: "background .25s var(--ease-out)" }}>
      <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> {label}
    </button>
  );
}
