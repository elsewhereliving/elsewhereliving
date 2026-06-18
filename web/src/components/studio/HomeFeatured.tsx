import { Fragment, useState } from "react";
import type { CSSProperties } from "react";
import { optImg } from "../../lib/img";
import { Icon } from "./icons";
import { useStudio, useToast, type Rec } from "./Studio";

const ml: CSSProperties = { fontFamily: "var(--font-sans)", fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--slate)", fontWeight: 500 };
const dot: CSSProperties = { width: 3, height: 3, borderRadius: "50%", background: "currentColor", display: "block" };
const toRow = (x: Rec) => ({ id: x.id, title: x.title, image: x.image, imageFocal: x.imageFocal, location: x.location, market: x.market, type: x.type, price: x.price || "—" });

export default function HomeFeatured() {
  const crm = useStudio();
  const toast = useToast();
  const C = "listings";
  const [count, setCount] = useState(crm.getHomeCount());
  const [rows, setRows] = useState(() => crm.featuredList(C).map(toRow));
  const [q, setQ] = useState("");
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  const chosen = rows.map((r) => r.id);
  const pool = crm.list(C).filter((x) => {
    if (chosen.indexOf(x.id) >= 0) return false;
    if (!q) return true;
    return (x.title + " " + x.location + " " + (x.market || "")).toLowerCase().indexOf(q.toLowerCase()) >= 0;
  });

  const add = (x: Rec) => { setRows((r) => r.concat([toRow(x)])); setDirty(true); };
  const remove = (id: string) => { setRows((r) => r.filter((x) => x.id !== id)); setDirty(true); };
  const move = (fromId: string, toId: string) => {
    if (fromId === toId) return;
    setRows((r) => { const a = r.slice(); const fi = a.findIndex((x) => x.id === fromId); const ti = a.findIndex((x) => x.id === toId); if (fi < 0 || ti < 0) return r; const [x] = a.splice(fi, 1); a.splice(ti, 0, x); return a; });
    setDirty(true);
  };
  const save = () => { crm.setFeaturedOrder(C, rows.map((x) => x.id)); crm.setHomeCount(count); setDirty(false); toast("Home page updated (this session)"); };

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 22, justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
        <div style={{ maxWidth: 560 }}>
          <p style={{ margin: "0 0 10px", fontFamily: "var(--font-sans)", fontSize: 13, lineHeight: 1.6, color: "var(--slate)" }}>
            This is the row of properties in the <strong style={{ color: "var(--navy)", fontWeight: 600 }}>"The collection"</strong> section near the top of the public homepage. Set how many show, and drag to put them in the order visitors see.
          </p>
          <p style={{ margin: 0, fontFamily: "var(--font-sans)", fontSize: 12, lineHeight: 1.55, color: "var(--stone)" }}>
            Add any sale listing on the right → it then appears here and on the homepage. Remove one with × — the listing itself is never deleted.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={ml}>How many to show</span>
          <div style={{ display: "flex", gap: 6 }}>
            {[3, 6, 9].map((n) => {
              const on = count === n;
              return <button key={n} type="button" className="ew-pillctl" onClick={() => { setCount(n); setDirty(true); }}
                style={{ width: 46, height: 40, cursor: "pointer", border: "1px solid " + (on ? "var(--navy)" : "var(--border-on-light)"), background: on ? "var(--navy)" : "var(--white)", color: on ? "var(--white)" : "var(--charcoal)", fontFamily: "var(--font-serif)", fontSize: 17 }}>{n}</button>;
            })}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-on-light)", borderBottom: "1px solid var(--border-on-light)", padding: "12px 0", margin: "18px 0 26px" }}>
        <span style={{ ...ml, color: "var(--charcoal)" }}>{rows.length} selected · {Math.min(count, rows.length)} visible on the homepage</span>
        <button type="button" className="ew-pillctl" onClick={save} disabled={!dirty}
          style={{ padding: "11px 24px", cursor: dirty ? "pointer" : "default", border: "1px solid var(--navy)", background: dirty ? "var(--navy)" : "transparent", color: dirty ? "var(--white)" : "var(--stone)", fontFamily: "var(--font-sans)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase" }}>{dirty ? "Save home page" : "Saved"}</button>
      </div>

      <div className="ew-home-grid" style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 40, alignItems: "start" }}>
        <div>
          <span style={{ ...ml, display: "block", marginBottom: 14 }}>[ Featured on the homepage ]</span>
          {rows.length ? rows.map((r, i) => {
            const live = i < count;
            return (
              <Fragment key={r.id}>
                {i === count && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0 14px" }}>
                    <span style={{ flex: 1, height: 1, background: "var(--border-on-light)" }} />
                    <span style={ml}>Queued · not shown</span>
                    <span style={{ flex: 1, height: 1, background: "var(--border-on-light)" }} />
                  </div>
                )}
                <div draggable onDragStart={() => setDragId(r.id)} onDragEnd={() => { setDragId(null); setOverId(null); }}
                  onDragOver={(e) => { e.preventDefault(); setOverId(r.id); if (dragId) move(dragId, r.id); }}
                  style={{ display: "flex", alignItems: "center", gap: 13, padding: 10, marginBottom: 8, background: "var(--white)", border: "1px solid " + (overId === r.id && dragId !== r.id ? "var(--navy)" : "var(--border-subtle)"), opacity: dragId === r.id ? 0.4 : live ? 1 : 0.62, cursor: "grab" }}>
                  <span style={{ display: "flex", flexDirection: "column", gap: 3, color: "var(--stone)", flex: "0 0 auto", padding: "0 2px" }}>
                    {[0, 1, 2].map((d) => <span key={d} style={{ display: "flex", gap: 3 }}><i style={dot} /><i style={dot} /></span>)}
                  </span>
                  <span style={{ width: 26, textAlign: "center", fontFamily: "var(--font-serif)", fontSize: 19, color: live ? "var(--navy)" : "var(--slate)", flex: "0 0 auto" }}>{i + 1}</span>
                  <div style={{ width: 62, height: 46, flex: "0 0 auto", overflow: "hidden", background: "var(--paper-2)", border: "1px solid var(--border-subtle)" }}>
                    {r.image && <img src={optImg(r.image, "small")} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: r.imageFocal || "center" }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: 15.5, color: "var(--navy)", lineHeight: 1.15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.title || "Untitled"}</div>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--slate)", marginTop: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.location} · {r.price}</div>
                  </div>
                  <button type="button" title="Remove from home" onClick={() => remove(r.id)} style={{ flex: "0 0 auto", width: 30, height: 30, border: "1px solid var(--border-on-light)", background: "var(--white)", cursor: "pointer", color: "var(--navy)", fontSize: 16, lineHeight: 1 }}>×</button>
                </div>
              </Fragment>
            );
          }) : (
            <div style={{ border: "1px dashed var(--stone)", padding: "44px 20px", textAlign: "center", fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 18, color: "var(--slate)" }}>Nothing chosen yet — add listings from the right.</div>
          )}
        </div>

        <div>
          <span style={{ ...ml, display: "block", marginBottom: 14 }}>[ Add more listings ]</span>
          <div className="ew-searchbar" style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid var(--border-on-light)", background: "var(--white)", padding: "0 16px", marginBottom: 12 }}>
            <Icon name="view" size={15} color="var(--slate)" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search listings to add…" style={{ flex: 1, border: "none", background: "transparent", outline: "none", padding: "11px 0", fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--charcoal)" }} />
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
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: 9.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--slate)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{x.market || x.location} · {x.type}</div>
                </div>
                <button type="button" className="ew-pillctl" onClick={() => add(x)} style={{ flex: "0 0 auto", display: "inline-flex", alignItems: "center", gap: 5, padding: "8px 14px", border: "1px solid var(--navy)", background: "transparent", color: "var(--navy)", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>+ Add</button>
              </div>
            )) : (
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--slate)", textAlign: "center", padding: "30px 0" }}>{q ? "No matches." : "Every listing is already featured."}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
