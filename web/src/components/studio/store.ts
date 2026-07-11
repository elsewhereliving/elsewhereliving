// The Studio's shared store + toast contexts. Kept in their own module (no
// component exports) so React Fast Refresh can hot-swap Studio.tsx cleanly —
// mixing hook and component exports in one file forced full-graph
// invalidations that could leave the provider and consumers on two different
// module instances ("useStudio outside provider" on a blank screen).
import { createContext, useContext } from "react";

export type Rec = Record<string, any> & { id: string };

export interface Store {
  listings: Rec[];
  rentals: Rec[];
  markets: string[];
  list: (c: string) => Rec[];
  get: (c: string, id: string) => Rec | null;
  counts: () => { listings: number; rentals: number };
  blank: (c: string) => Rec;
  slugify: (s: string) => string;
  uniqueId: (c: string, base: string) => string;
  upsert: (c: string, rec: Rec) => string;
  remove: (c: string, id: string) => void;
  toggleFeatured: (c: string, id: string) => void;
  featuredList: (c: string) => Rec[];
  setFeaturedOrder: (c: string, ids: string[]) => void;
  getHomeCount: () => number;
  setHomeCount: (n: number) => void;
  fsSupported: boolean;
  fsConnected: boolean;
  connectRepo: () => Promise<void>;
}

export const StoreCtx = createContext<Store | null>(null);
export function useStudio() {
  const s = useContext(StoreCtx);
  if (!s) throw new Error("useStudio outside provider");
  return s;
}

export type Toast = (msg: string, tone?: "default" | "danger") => void;
export const ToastCtx = createContext<Toast>(() => {});
export function useToast() {
  return useContext(ToastCtx);
}
