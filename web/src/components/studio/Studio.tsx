import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { rentDest } from "../../lib/format";
import Dashboard from "./Dashboard";

// A listing or rental record — loosely typed in the Studio so we can carry the
// CRM-only fields (imageFocal, focals, featuredRank, video) alongside the
// public schema without churning lib/types yet.
export type Rec = Record<string, any> & { id: string };

interface StudioData {
  listings: Rec[];
  rentals: Rec[];
  markets: string[];
}

// ---- store context ---------------------------------------------------------
interface Store {
  listings: Rec[];
  rentals: Rec[];
  markets: string[];
  list: (c: string) => Rec[];
  counts: () => { listings: number; rentals: number };
  toggleFeatured: (c: string, id: string) => void;
  featuredList: (c: string) => Rec[];
}
const StoreCtx = createContext<Store | null>(null);
export function useStudio() {
  const s = useContext(StoreCtx);
  if (!s) throw new Error("useStudio outside provider");
  return s;
}

// ---- toast -----------------------------------------------------------------
type Toast = (msg: string, tone?: "default" | "danger") => void;
const ToastCtx = createContext<Toast>(() => {});
export function useToast() {
  return useContext(ToastCtx);
}

export default function Studio({ listings: l0, rentals: r0, markets }: StudioData) {
  const [listings, setListings] = useState<Rec[]>(l0);
  const [rentals, setRentals] = useState<Rec[]>(r0);
  const [toasts, setToasts] = useState<{ id: string; msg: string; tone: string }[]>([]);

  const push = useCallback<Toast>((msg, tone = "default") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => t.concat([{ id, msg, tone }]));
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const maxRank = (arr: Rec[]) =>
    arr.reduce((m, x) => (x.featured && typeof x.featuredRank === "number" ? Math.max(m, x.featuredRank) : m), 0);

  const store: Store = useMemo(() => {
    const list = (c: string) => (c === "rentals" ? rentals : listings);
    return {
      listings,
      rentals,
      markets,
      list,
      counts: () => ({ listings: listings.length, rentals: rentals.length }),
      toggleFeatured: (c, id) => {
        const set = c === "rentals" ? setRentals : setListings;
        set((arr) =>
          arr.map((x) => {
            if (x.id !== id) return x;
            return x.featured
              ? { ...x, featured: false, featuredRank: null }
              : { ...x, featured: true, featuredRank: maxRank(arr) + 1 };
          })
        );
      },
      featuredList: (c) =>
        list(c)
          .filter((x) => x.featured)
          .sort((a, b) => (a.featuredRank ?? a.featuredOrder ?? 9999) - (b.featuredRank ?? b.featuredOrder ?? 9999)),
    };
  }, [listings, rentals, markets]);

  const notReady = (what: string) => push(`${what} arrives in the next build phase`);

  return (
    <StoreCtx.Provider value={store}>
      <ToastCtx.Provider value={push}>
        <div className="ew-studio">
          <Dashboard
            onEdit={() => notReady("The editor")}
            onNew={() => notReady("Add / edit")}
            onImport={() => notReady("Import-from-link")}
            onLogout={() => push("Sign-out lands with auth in Phase 5")}
          />
        </div>
        <ToastHost toasts={toasts} />
      </ToastCtx.Provider>
    </StoreCtx.Provider>
  );
}

function ToastHost({ toasts }: { toasts: { id: string; msg: string; tone: string }[] }) {
  return (
    <div
      style={{
        position: "fixed", top: 22, left: 0, right: 0, zIndex: 1000,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8, pointerEvents: "none",
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            pointerEvents: "auto",
            background: t.tone === "danger" ? "var(--navy)" : "var(--white)",
            color: t.tone === "danger" ? "var(--white)" : "var(--charcoal)",
            border: "1px solid " + (t.tone === "danger" ? "var(--navy)" : "var(--border-on-light)"),
            padding: "12px 20px", fontFamily: "var(--font-sans)", fontSize: 12.5,
            letterSpacing: "0.06em", textTransform: "uppercase",
            boxShadow: "0 14px 40px -18px rgba(15,22,40,0.5)",
          }}
        >
          {t.msg}
        </div>
      ))}
    </div>
  );
}

export { rentDest };
