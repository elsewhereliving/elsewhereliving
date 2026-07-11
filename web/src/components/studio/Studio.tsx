import { useCallback, useEffect, useMemo, useState } from "react";
import { listingPrice, rentalPrice } from "../../lib/price";
import Dashboard from "./Dashboard";
import Editor from "./Editor";
import { connect as fsConnect, restore as fsRestore, fsSupported } from "./fsRepo";
import { StoreCtx, ToastCtx, type Rec, type Store, type Toast } from "./store";

interface StudioData {
  listings: Rec[];
  rentals: Rec[];
  markets: string[];
  homeCount: number;
}

const slugify = (s: string) =>
  (s || "").toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70) || "listing-" + Date.now();

// Recompute the USD display fields from the source price (so the dashboard +
// preview match what the live site will build). Mirrors lib/content.ts.
function withPrice(c: string, rec: Rec): Rec {
  return c === "rentals" ? { ...rec, ...rentalPrice(rec) } : { ...rec, ...listingPrice(rec) };
}

function blank(c: string): Rec {
  if (c === "rentals")
    return { id: "", image: "", gallery: [], focals: {}, location: "", place: "", mapQuery: "", title: "", view: [], beds: 0, bedsLabel: "", baths: 0, guests: 0, guestsLabel: "", occupancy: "", size: "", nightlyOriginalNum: null, nightlyCurrency: "", nightly: "", nightlyNum: 0, note: "", sleeps: "", video: "", blurb: "", detail: "", features: [], created: Date.now() };
  return { id: "", image: "", gallery: [], focals: {}, location: "", place: "", mapQuery: "", market: "Koh Samui", title: "", type: "Villa", view: [], status: "Move-In Ready", beds: 0, bedsLabel: "", baths: 0, interior: "—", plot: null, year: null, priceOriginalNum: null, priceCurrency: "", priceFrom: false, price: "", priceNum: 0, ownership: "Freehold", yield: "", added: 0, video: "", blurb: "", detail: "", features: [], created: Date.now() };
}

type Route = { view: "dashboard" } | { view: "editor"; collection: string; id: string | null };

export default function Studio({ listings: l0, rentals: r0, markets, homeCount: hc0 }: StudioData) {
  const [listings, setListings] = useState<Rec[]>(l0);
  const [rentals, setRentals] = useState<Rec[]>(r0);
  const [homeCount, setHomeCountState] = useState<number>(hc0 || 3);
  const [connected, setConnected] = useState(false);
  const [route, setRoute] = useState<Route>({ view: "dashboard" });

  const connectRepo = useCallback(async () => {
    try { const name = await fsConnect(); setConnected(true); push(`Connected to ${name} — Save now writes to your repo`); }
    catch (e: any) { if (e?.name !== "AbortError") push(e?.message || "Couldn't connect to that folder", "danger"); }
  }, []);
  const [toasts, setToasts] = useState<{ id: string; msg: string; tone: string }[]>([]);

  const push = useCallback<Toast>((msg, tone = "default") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => t.concat([{ id, msg, tone }]));
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  // Reconnect the repo folder remembered from a previous visit, silently if
  // the browser still holds the permission grant (no prompt allowed here).
  useEffect(() => {
    fsRestore().then((name) => {
      if (name) { setConnected(true); push(`Reconnected to ${name} — Save writes to your repo`); }
    });
  }, [push]);

  const maxRank = (arr: Rec[]) => arr.reduce((m, x) => (x.featured && typeof x.featuredRank === "number" ? Math.max(m, x.featuredRank) : m), 0);

  const store: Store = useMemo(() => {
    const list = (c: string) => (c === "rentals" ? rentals : listings);
    const setArr = (c: string, fn: (a: Rec[]) => Rec[]) => (c === "rentals" ? setRentals(fn) : setListings(fn));
    const get = (c: string, id: string) => list(c).find((x) => x.id === id) || null;
    const uniqueId = (c: string, base: string) => {
      const arr = list(c);
      let id = base, n = 2;
      while (arr.some((x) => x.id === id)) { id = base + "-" + n; n++; }
      return id;
    };
    return {
      listings, rentals, markets, list, get, blank, slugify, uniqueId,
      counts: () => ({ listings: listings.length, rentals: rentals.length }),
      upsert: (c, rec) => {
        if (!rec.id) rec.id = uniqueId(c, slugify(rec.title));
        const computed = withPrice(c, rec);
        setArr(c, (arr) => {
          const i = arr.findIndex((x) => x.id === rec.id);
          if (i >= 0) { const n = arr.slice(); n[i] = computed; return n; }
          if (c !== "rentals" && computed.added == null) computed.added = arr.reduce((mx, x) => Math.max(mx, x.added || 0), 0) + 1;
          if (computed.created == null) computed.created = Date.now();
          return [computed, ...arr];
        });
        return rec.id;
      },
      remove: (c, id) => setArr(c, (arr) => arr.filter((x) => x.id !== id)),
      toggleFeatured: (c, id) =>
        setArr(c, (arr) => arr.map((x) => (x.id !== id ? x : x.featured ? { ...x, featured: false, featuredRank: null } : { ...x, featured: true, featuredRank: maxRank(arr) + 1 }))),
      featuredList: (c) => list(c).filter((x) => x.featured).sort((a, b) => (a.featuredRank ?? a.featuredOrder ?? 9999) - (b.featuredRank ?? b.featuredOrder ?? 9999)),
      setFeaturedOrder: (c, ids) => {
        const rank: Record<string, number> = {};
        ids.forEach((id, i) => (rank[id] = i + 1));
        setArr(c, (arr) => arr.map((x) => (ids.indexOf(x.id) >= 0 ? { ...x, featured: true, featuredRank: rank[x.id] } : x.featured ? { ...x, featured: false, featuredRank: null } : x)));
      },
      getHomeCount: () => homeCount,
      setHomeCount: (n) => setHomeCountState(n),
      fsSupported: fsSupported(),
      fsConnected: connected,
      connectRepo,
    };
  }, [listings, rentals, markets, homeCount, connected, connectRepo]);

  // While the editor is open, lock the page behind it so it can't scroll and we
  // don't show a second scrollbar. This does NOT change the dashboard's scroll
  // position, so when the editor closes the list is exactly where it was left —
  // same scroll, same tab, same filters (the Dashboard is never unmounted).
  const editing = route.view === "editor";
  useEffect(() => {
    if (!editing) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [editing]);

  return (
    <StoreCtx.Provider value={store}>
      <ToastCtx.Provider value={push}>
        <div className="ew-studio">
          <Dashboard
            onEdit={(c, id) => setRoute({ view: "editor", collection: c, id })}
            onNew={(c) => setRoute({ view: "editor", collection: c, id: null })}
            onImport={() => push("Import-from-link arrives in a later phase")}
            onLogout={() => push("Sign-out lands with auth in Phase 5")}
          />
          {route.view === "editor" && (
            <div className="ew-editor-overlay" style={{ position: "fixed", inset: 0, zIndex: 60, overflowY: "auto", background: "var(--paper)" }}>
              <Editor
                collection={route.collection}
                id={route.id}
                onClose={() => setRoute({ view: "dashboard" })}
                onSaved={() => setRoute({ view: "dashboard" })}
              />
            </div>
          )}
        </div>
        <ToastHost toasts={toasts} />
      </ToastCtx.Provider>
    </StoreCtx.Provider>
  );
}

function ToastHost({ toasts }: { toasts: { id: string; msg: string; tone: string }[] }) {
  return (
    <div style={{ position: "fixed", top: 22, left: 0, right: 0, zIndex: 1000, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, pointerEvents: "none" }}>
      {toasts.map((t) => (
        <div key={t.id} style={{ pointerEvents: "auto", background: t.tone === "danger" ? "var(--navy)" : "var(--white)", color: t.tone === "danger" ? "var(--white)" : "var(--charcoal)", border: "1px solid " + (t.tone === "danger" ? "var(--navy)" : "var(--border-on-light)"), padding: "12px 20px", fontFamily: "var(--font-sans)", fontSize: 12.5, letterSpacing: "0.06em", textTransform: "uppercase", boxShadow: "0 14px 40px -18px rgba(15,22,40,0.5)" }}>{t.msg}</div>
      ))}
    </div>
  );
}
