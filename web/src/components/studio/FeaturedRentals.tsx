import { useState } from "react";
import type { CSSProperties } from "react";
import { optImg } from "../../lib/img";
import { Icon } from "./icons";
import { saveRecord } from "./fsRepo";
import { useStudio, useToast, type Rec } from "./store";

// Featured-rentals manager — same logic as HomeFeatured but for the rentals
// collection. Rentals don't go on the homepage, so there's no "how many to
// show" count: every chosen rental is featured and sorts to the top of the
// public Rentals page (under the default "Featured" sort), in the order set here.

const ml: CSSProperties = { fontFamily: "var(--font-sans)", fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--slate)", fontWeight: 500 };
const dot: CSSProperties = { width: 3, height: 3, borderRadius: "50%", background: "currentColor", display: "block" };
const toRow = (x: Rec) => ({ id: x.id, title: x.title, image: x.image, imageFocal: x.imageFocal, location: x.location, price: x.nightly || x.price || "—" });

export default function FeaturedRentals() {
  const crm = useStudio();
  const toast = useToast();
  const C = "rentals";
  const [rows, setRows] = useState(() => crm.featuredList(C).map(toRow));
  const [q, setQ] = useState("");
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  const chosen = rows.map((r) => r.id);
  const pool = crm.list(C).filter((x) => {
    if (chosen.indexOf(x.id) >= 0) return false;
    if (!q) return true;
    return (x.title + " " + x.location).toLowerCase().indexOf(q.toLowerCase()) >= 0;
  });

  const add = (x: Rec) => { setRows((r) => r.concat([toRow(x)])); setDirty(true); };
  const remove = (id: string) => { setRows((r) => r.filter((x) => x.id !== id)); setDirty(true); };
  const move = (fromId: string, toId: string) => {
    if (fromId === toId) return;
    setRows((r) => { const a = r.slice(); const fi = a.findIndex((x) => x.id === fromId); const ti = a.findIndex((x) => x.id === toId); if (fi < 0 || ti < 0) return r; const [x] = a.splice(fi, 1); a.splice(ti, 0, x); return a; });
    setDirty(true);
  };
  const save = async () => {
    const ids = rows.map((x) => x.id);
    crm.setFeaturedOrder(C, ids); setDirty(false);
    if (crm.fsConnected) {
      const rank: Record<string, number> = {}; ids.forEach((id, i) => (rank[id] = i + 1));
      // Write the chosen set AND demote every currently-featured rental that
      // isn't chosen, so no stale featuredRank straggles behind. One failed
      // write doesn't abort the rest.
      const toWrite = crm.list(C).filter((l) => l.featured || ids.indexOf(l.id) >= 0);
      const failed: string[] = [];
      for (const l of toWrite) {
        const isChosen = ids.indexOf(l.id) >= 0;
        try { await saveRecord(C, { ...l, featured: isChosen, featuredRank: isChosen ? rank[l.id] : null }); }
        catch { failed.push(l.id); }
      }
      toast(failed.length ? `Saved, but ${failed.length} file(s) failed — check & retry` : "Featured rentals saved to your repo — review & push", failed.length ? "danger" : "default");
    } else toast("Featured rentals updated this session — connect your repo folder to write it");
  };

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 22, justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
        <div style={{ maxWidth: 560 }}>
          <p style={{ margin: "0 0 10px", fontFamily: "var(--font-sans)", fontSize: 13, lineHeight: 1.6, color: "var(--slate)" }}>
            These rentals are pinned to the <strong style={{ color: "var(--navy)", fontWeight: 600 }}>top of the public Rentals page</strong> (under the default "Featured" sort). Drag to set the order visitors see.
          </p>
          <p style={{ margin: 0, fontFamily: "var(--font-sans)", fontSize: 12, lineHeight: 1.55, color: "var(--stone)" }}>
            Add any rental on the right → it then appears here and is featured. Remove one with × — the rental itself is never deleted.
          </p>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-on-light)", borderBottom: "1px solid var(--border-on-light)", padding: "12px 0", margin: "18px 0 26px" }}>
        <span style={{ ...ml, color: "var(--charcoal)" }}>{rows.length} featured rental{rows.length === 1 ? "" : "s"}</span>
        <button type="button" className="ew-pillctl" onClick={save} disabled={!dirty}
          style={{ padding: "11px 24px", cursor: dirty ? "pointer" : "default", border: "1px solid var(--navy)", background: dirty ? "var(--navy)" : "transparent", color: dirty ? "var(--white)" : "var(--stone)", fontFamily: "var(--font-sans)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase" }}>{dirty ? "Save featured" : "Saved"}</button>
      </div>

      <div className="ew-home-grid" style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 40, alignItems: "start" }}>
        <div>
          <span style={{ ...ml, display: "block", marginBottom: 14 }}>[ Featured on the rentals page ]</span>
          {rows.length ? rows.map((r, i) => (
            <div key={r.id} draggable onDragStart={() => setDragId(r.id)} onDragEnd={() => { setDragId(null); setOverId(null); }}
              onDragOver={(e) => { e.preventDefault(); setOverId(r.id); if (dragId) move(dragId, r.id); }}
              style={{ display: "flex", alignItems: "center", gap: 13, padding: 10, marginBottom: 8, background: "var(--white)", border: "1px solid " + (overId === r.id && dragId !== r.id ? "var(--navy)" : "var(--border-subtle)"), opacity: dragId === r.id ? 0.4 : 1, cursor: "grab" }}>
              <span style={{ display: "flex", flexDirection: "column", gap: 3, color: "var(--stone)", flex: "0 0 auto", padding: "0 2px" }}>
                {[0, 1, 2].map((d) => <span key={d} style={{ display: "flex", gap: 3 }}><i style={dot} /><i style={dot} /></span>)}
              </span>
              <span style={{ width: 26, textAlign: "center", fontFamily: "var(--font-serif)", fontSize: 19, color: "var(--navy)", flex: "0 0 auto" }}>{i + 1}</span>
              <div style={{ width: 62, height: 46, flex: "0 0 auto", overflow: "hidden", background: "var(--paper-2)", border: "1px solid var(--border-subtle)" }}>
                {r.image && <img src={optImg(r.image, "small")} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: r.imageFocal || "center" }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: 15.5, color: "var(--navy)", lineHeight: 1.15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.title || "Untitled"}</div>
                <div style={{ fontFamily: "var(--font-sans)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--slate)", marginTop: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.location} · {r.price}</div>
              </div>
              <button type="button" title="Remove from featured" onClick={() => remove(r.id)} style={{ flex: "0 0 auto", width: 30, height: 30, border: "1px solid var(--border-on-light)", background: "var(--white)", cursor: "pointer", color: "var(--navy)", fontSize: 16, lineHeight: 1 }}>×</button>
            </div>
          )) : (
            <div style={{ border: "1px dashed var(--stone)", padding: "44px 20px", textAlign: "center", fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 18, color: "var(--slate)" }}>Nothing chosen yet — add rentals from the right.</div>
          )}
        </div>

        <div>
          <span style={{ ...ml, display: "block", marginBottom: 14 }}>[ Add more rentals ]</span>
          <div className="ew-searchbar" style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid var(--border-on-light)", background: "var(--white)", padding: "0 16px", marginBottom: 12 }}>
            <Icon name="view" size={15} color="var(--slate)" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search rentals to add…" style={{ flex: 1, border: "none", background: "transparent", outline: "none", padding: "11px 0", fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--charcoal)" }} />
            {q && <button type="button" onClick={() => setQ("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--slate)", fontSize: 16 }}>×</button>}
          </div>
          <div style={{ maxHeight: 560, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, paddingRight: 2 }}>
            {pool.length ? pool.map((x) => (
              <div key={x.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 9, background: "var(--white)", border: "1px solid var(--border-subtle)" }}>
                <div style={{ width: 54, height: 40, flex: "0 0 auto", overflow: "hidden", background: "var(--paper-2)", border: "1px solid var(--border-subtle)" }}>
                  {x.image && <img src={optImg(x.image, "small")} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: x.imageFocal || "center" }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: 14.5, color: "var(--navy)", lineHeight: 1.15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{x.title || "Untitled"}</div>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: 9.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--slate)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{x.location}</div>
                </div>
                <button type="button" className="ew-pillctl" onClick={() => add(x)} style={{ flex: "0 0 auto", display: "inline-flex", alignItems: "center", gap: 5, padding: "8px 14px", border: "1px solid var(--navy)", background: "transparent", color: "var(--navy)", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>+ Add</button>
              </div>
            )) : (
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--slate)", textAlign: "center", padding: "30px 0" }}>{q ? "No matches." : "Every rental is already featured."}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
