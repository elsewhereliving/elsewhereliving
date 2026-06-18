import { useCallback, useEffect, useState } from "react";

// Shared "saved properties" store, backed by localStorage and kept in sync
// across islands on the same page via a custom event. Ported from the
// original app.js (same storage key, so existing visitors keep their saves).
const SAVED_KEY = "ew_saved_v1";
const EVENT = "ew:saved-changed";

function read(): string[] {
  if (typeof localStorage === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY) || "[]") || [];
  } catch {
    return [];
  }
}

export function useSaved(): [string[], (id: string) => void] {
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    setSaved(read());
    const sync = () => setSaved(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = useCallback((id: string) => {
    const next = read().includes(id) ? read().filter((x) => x !== id) : [...read(), id];
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(next));
    } catch {
      /* ignore quota / private mode */
    }
    setSaved(next);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return [saved, toggle];
}
