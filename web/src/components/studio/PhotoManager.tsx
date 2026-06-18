import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Icon } from "./icons";
import { useToast } from "./Studio";

// In the studio, image srcs are already absolute (/assets/…), remote (https) or
// data: URLs, so no path rewriting is needed for display.
const show = (s: string) => s;

// ---- best-effort page scrape (client-side) --------------------------------
const PROXIES = [
  (u: string) => "https://api.allorigins.win/raw?url=" + encodeURIComponent(u),
  (u: string) => "https://corsproxy.io/?url=" + encodeURIComponent(u),
];
function imagesFromText(text: string): string[] {
  const re = /https?:\/\/[^\s)\]"'<>]+?\.(?:jpe?g|png|webp)(?:\?[^\s)\]"'<>]*)?/gi;
  const found: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const u = m[0];
    if (/sprite|logo|icon|favicon|avatar|placeholder|blank|pixel|1x1|\.svg/i.test(u)) continue;
    found.push(u);
  }
  const seen: Record<string, 1> = {}, out: string[] = [];
  found.forEach((u) => { const k = u.split("?")[0]; if (!seen[k]) { seen[k] = 1; out.push(u); } });
  return out.slice(0, 60);
}
async function scrapeImages(pageUrl: string): Promise<string[]> {
  // Jina Reader first (CORS-friendly, returns clean text carrying photo URLs)
  try {
    const r = await fetch("https://r.jina.ai/" + pageUrl);
    if (r.ok) { const imgs = imagesFromText(await r.text()); if (imgs.length) return imgs; }
  } catch {}
  for (const p of PROXIES) {
    try {
      const r = await fetch(p(pageUrl));
      if (!r.ok) continue;
      const html = await r.text();
      const imgs = imagesFromText(html);
      if (imgs.length) return imgs;
    } catch {}
  }
  throw new Error("blocked");
}

const tileBtn: CSSProperties = { width: 26, height: 26, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.92)", border: "none", cursor: "pointer", padding: 0 };
const ta: CSSProperties = { width: "100%", boxSizing: "border-box", background: "var(--paper)", border: "1px solid var(--border-subtle)", padding: "11px 13px", fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--charcoal)", resize: "vertical", outline: "none", borderRadius: 0, lineHeight: 1.5 };

export default function PhotoManager({ gallery, onChange, focals, onFocals }: { gallery: string[]; onChange: (g: string[]) => void; focals: Record<string, string>; onFocals: (f: Record<string, string>) => void }) {
  const toast = useToast();
  const [tab, setTab] = useState<"upload" | "url" | "scrape">("upload");
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [dragIdx, setDragIdx] = useState(-1);
  const [overIdx, setOverIdx] = useState(-1);
  const [focusSrc, setFocusSrc] = useState<string | null>(null);
  const fmap = focals || {};

  function addImages(urls: string[]) {
    const add = urls.filter((u) => gallery.indexOf(u) < 0);
    if (!add.length) return;
    onChange(gallery.concat(add));
    toast(add.length + " photo" + (add.length > 1 ? "s" : "") + " added");
  }
  function handleFiles(files: FileList) {
    const arr = Array.from(files).filter((f) => /^image\//.test(f.type));
    if (!arr.length) return;
    let pending = arr.length; const results: string[] = [];
    arr.forEach((f, i) => {
      const reader = new FileReader();
      reader.onload = () => { results[i] = reader.result as string; if (--pending === 0) addImages(results.filter(Boolean)); };
      reader.readAsDataURL(f);
    });
  }
  function setCover(i: number) { if (i === 0) return; const n = gallery.slice(); const [x] = n.splice(i, 1); n.unshift(x); onChange(n); toast("Cover photo set"); }
  function removeAt(i: number) { const n = gallery.slice(); n.splice(i, 1); onChange(n); }
  function onDrop(i: number) {
    if (dragIdx < 0 || dragIdx === i) { setDragIdx(-1); setOverIdx(-1); return; }
    const n = gallery.slice(); const [x] = n.splice(dragIdx, 1); n.splice(i, 0, x); onChange(n); setDragIdx(-1); setOverIdx(-1);
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
        <span style={mlabel}>[ Photos ]</span>
        <span style={{ ...mlabel, color: "var(--charcoal)" }}>{gallery.length} {gallery.length === 1 ? "image" : "images"}</span>
      </div>

      <div style={{ display: "flex", borderBottom: "1px solid var(--border-subtle)", marginBottom: 16 }}>
        {([["upload", "Upload"], ["url", "Paste URLs"], ["scrape", "From a page"]] as const).map((t) => {
          const active = tab === t[0];
          return (
            <button key={t[0]} type="button" onClick={() => setTab(t[0] as any)}
              style={{ background: "transparent", border: "none", cursor: "pointer", padding: "8px 16px 11px", fontFamily: "var(--font-sans)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: active ? "var(--navy)" : "var(--slate)", borderBottom: "2px solid " + (active ? "var(--navy)" : "transparent"), marginBottom: -1, fontWeight: active ? 600 : 400 }}>{t[1]}</button>
          );
        })}
      </div>

      {tab === "upload" && (
        <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }} onClick={() => fileRef.current?.click()}
          style={{ border: "1.5px dashed " + (dragOver ? "var(--navy)" : "var(--stone)"), background: "var(--paper)", padding: "34px 20px", textAlign: "center", cursor: "pointer", transition: "all .2s var(--ease-out)" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}><Icon name="sparkles" size={22} color="var(--navy)" /></div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 18, color: "var(--navy)", marginBottom: 4 }}>Drop photos here</div>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--slate)" }}>or click to choose multiple files from your laptop</div>
          <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={(e) => { if (e.target.files) handleFiles(e.target.files); e.target.value = ""; }} />
        </div>
      )}
      {tab === "url" && <UrlPaste onAdd={addImages} />}
      {tab === "scrape" && <ScrapePanel onAdd={addImages} />}

      {gallery.length ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(132px, 1fr))", gap: 10, marginTop: 18, alignItems: "start" }}>
          {gallery.map((src, i) => {
            const isCover = i === 0;
            return (
              <div key={src + i} draggable onDragStart={() => setDragIdx(i)} onDragEnd={() => { setDragIdx(-1); setOverIdx(-1); }}
                onDragOver={(e) => { e.preventDefault(); setOverIdx(i); }} onDrop={() => onDrop(i)} className="ew-photo-tile"
                style={{ position: "relative", overflow: "hidden", cursor: "grab", lineHeight: 0, border: isCover ? "2px solid var(--navy)" : "1px solid var(--border-subtle)", outline: overIdx === i && dragIdx !== i ? "2px solid var(--butter)" : "none", opacity: dragIdx === i ? 0.4 : 1, background: "var(--paper-2)" }}>
                <img src={show(src)} alt="" loading="lazy" style={{ width: "100%", height: "auto", display: "block", pointerEvents: "none" }} />
                {isCover && <span style={{ position: "absolute", top: 6, left: 6, background: "var(--navy)", color: "var(--white)", fontFamily: "var(--font-sans)", fontSize: 8.5, letterSpacing: "0.16em", textTransform: "uppercase", padding: "3px 7px" }}>Cover</span>}
                <div className="ew-photo-actions" style={{ position: "absolute", top: 6, right: 6, display: "flex", gap: 5 }}>
                  <button type="button" title="Set focus point (how it crops on cards)" onClick={() => setFocusSrc(src)} style={tileBtn}><Icon name="interior" size={13} color="var(--navy)" /></button>
                  {!isCover && <button type="button" title="Set as cover" onClick={() => setCover(i)} style={tileBtn}><Icon name="sparkles" size={13} color="var(--navy)" /></button>}
                  <button type="button" title="Remove" onClick={() => removeAt(i)} style={tileBtn}><span style={{ fontSize: 15, lineHeight: 1, color: "var(--navy)" }}>×</span></button>
                </div>
                <span style={{ position: "absolute", bottom: 6, right: 7, color: "var(--white)", fontFamily: "var(--font-sans)", fontSize: 10, textShadow: "0 1px 4px rgba(0,0,0,.6)" }}>{i + 1}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--slate)", marginTop: 16, textAlign: "center" }}>No photos yet — the first one you add becomes the cover.</p>
      )}

      {focusSrc && <FocusModal src={focusSrc} value={fmap[focusSrc]} onSave={(v) => onFocals({ ...fmap, [focusSrc]: v })} onClose={() => setFocusSrc(null)} />}
    </div>
  );
}

const mlabel: CSSProperties = { fontFamily: "var(--font-sans)", fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--slate)", fontWeight: 500 };

function UrlPaste({ onAdd }: { onAdd: (u: string[]) => void }) {
  const [val, setVal] = useState("");
  const commit = () => { const urls = val.split(/[\s,]+/).map((s) => s.trim()).filter((s) => /^https?:\/\//.test(s)); if (urls.length) { onAdd(urls); setVal(""); } };
  return (
    <div>
      <textarea value={val} onChange={(e) => setVal(e.target.value)} placeholder={"Paste image URLs — one per line\nhttps://…/photo-01.jpg"} rows={4} style={ta} />
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}><SmallBtn onClick={commit} label="Add URLs" icon="arrowRight" /></div>
    </div>
  );
}

function ScrapePanel({ onAdd }: { onAdd: (u: string[]) => void }) {
  const toast = useToast();
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [found, setFound] = useState<string[] | null>(null);
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const [err, setErr] = useState("");
  function go() {
    if (!/^https?:\/\//.test(url.trim())) { setErr("Enter a full https:// link"); return; }
    setBusy(true); setErr(""); setFound(null); setPicked({});
    scrapeImages(url.trim()).then((urls) => { setFound(urls); const all: Record<string, boolean> = {}; urls.forEach((u) => (all[u] = true)); setPicked(all); })
      .catch(() => setErr("Couldn't read that page automatically. Open it, copy the image links, and use “Paste URLs”."))
      .finally(() => setBusy(false));
  }
  function addPicked() { const urls = (found || []).filter((u) => picked[u]); if (urls.length) { onAdd(urls); setFound(null); setUrl(""); } else toast("Select at least one photo"); }
  const pickedCount = Object.keys(picked).filter((k) => picked[k]).length;
  return (
    <div>
      <div style={{ display: "flex", gap: 8 }}>
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.example.com/listing/the-villa" style={{ ...ta, flex: 1 }} />
        <SmallBtn onClick={go} label={busy ? "Reading…" : "Fetch"} icon="external" disabled={busy} />
      </div>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--slate)", margin: "8px 2px 0", lineHeight: 1.5 }}>Paste a listing page from another site — we'll pull its photos so you can pick the keepers.</p>
      {err && <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--navy)", marginTop: 10, lineHeight: 1.5 }}>{err}</p>}
      {found && (
        <div style={{ marginTop: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ ...mlabel, color: "var(--charcoal)" }}>{found.length} found · {pickedCount} selected</span>
            <div style={{ display: "flex", gap: 8 }}>
              <TextBtn onClick={() => { const all: Record<string, boolean> = {}; found.forEach((u) => (all[u] = true)); setPicked(all); }}>All</TextBtn>
              <TextBtn onClick={() => setPicked({})}>None</TextBtn>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))", gap: 8, maxHeight: 280, overflowY: "auto", padding: 2 }}>
            {found.map((u) => {
              const on = !!picked[u];
              return (
                <button key={u} type="button" onClick={() => setPicked({ ...picked, [u]: !on })}
                  style={{ position: "relative", aspectRatio: "1", overflow: "hidden", border: on ? "2px solid var(--navy)" : "1px solid var(--border-subtle)", padding: 0, cursor: "pointer", background: "var(--paper-2)", opacity: on ? 1 : 0.55 }}>
                  <img src={u} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={(e) => { (e.currentTarget.parentNode as HTMLElement).style.display = "none"; }} />
                  {on && <span style={{ position: "absolute", top: 4, right: 4, width: 18, height: 18, background: "var(--navy)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Icon name="check" size={11} color="var(--white)" /></span>}
                </button>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}><SmallBtn onClick={addPicked} label={"Add " + pickedCount + " photo" + (pickedCount === 1 ? "" : "s")} icon="arrowRight" /></div>
        </div>
      )}
    </div>
  );
}

function SmallBtn({ onClick, label, icon, disabled }: { onClick: () => void; label: string; icon?: string; disabled?: boolean }) {
  const [h, setH] = useState(false);
  return (
    <button type="button" onClick={onClick} disabled={disabled} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", cursor: disabled ? "default" : "pointer", background: h && !disabled ? "var(--navy-80)" : "var(--navy)", color: "var(--white)", border: "none", fontFamily: "var(--font-sans)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", opacity: disabled ? 0.6 : 1, transition: "background .25s var(--ease-out)", whiteSpace: "nowrap" }}>{label}{icon && <Icon name={icon} size={13} color="var(--white)" />}</button>
  );
}
function TextBtn({ onClick, children }: { onClick: () => void; children: any }) {
  return <button type="button" onClick={onClick} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--navy)", textDecoration: "underline", padding: 2 }}>{children}</button>;
}

function parseFocal(v?: string) { const m = (v || "").match(/(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%/); return m ? { x: Math.round(+m[1]), y: Math.round(+m[2]) } : { x: 50, y: 50 }; }

function FocusModal({ src, value, onSave, onClose }: { src: string; value?: string; onSave: (v: string) => void; onClose: () => void }) {
  const [pt, setPt] = useState(parseFocal(value));
  const [drag, setDrag] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const pos = pt.x + "% " + pt.y + "%";
  function fromEvent(e: React.PointerEvent) {
    const r = boxRef.current!.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setPt({ x: Math.max(0, Math.min(100, Math.round(x))), y: Math.max(0, Math.min(100, Math.round(y))) });
  }
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1100, background: "rgba(12,14,20,0.72)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--white)", border: "1px solid var(--border-on-light)", width: "min(880px, 96vw)", maxHeight: "92vh", overflow: "auto", padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
          <span style={mlabel}>[ Focus point ]</span>
          <button type="button" onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "var(--slate)", lineHeight: 1 }}>×</button>
        </div>
        <p style={{ margin: "0 0 16px", fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--slate)", lineHeight: 1.5 }}>Click or drag to mark the part of the photo that must stay in frame. The site keeps this point centred when it crops to cards, hero and thumbnails.</p>
        <div className="ew-focus-grid" style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 22, alignItems: "start" }}>
          <div ref={boxRef} onPointerDown={(e) => { setDrag(true); e.currentTarget.setPointerCapture(e.pointerId); fromEvent(e); }} onPointerMove={(e) => { if (drag) fromEvent(e); }} onPointerUp={() => setDrag(false)}
            style={{ position: "relative", lineHeight: 0, cursor: "crosshair", userSelect: "none", touchAction: "none", background: "var(--paper-2)", maxHeight: "58vh", overflow: "hidden", display: "inline-block" }}>
            <img src={show(src)} alt="" draggable={false} style={{ width: "100%", maxHeight: "58vh", objectFit: "contain", display: "block", pointerEvents: "none" }} />
            <span style={{ position: "absolute", left: pt.x + "%", top: pt.y + "%", width: 34, height: 34, marginLeft: -17, marginTop: -17, borderRadius: "50%", border: "2px solid var(--white)", boxShadow: "0 0 0 2px var(--navy), 0 2px 10px rgba(0,0,0,0.5)", background: "rgba(21,38,68,0.18)", pointerEvents: "none" }} />
          </div>
          <div>
            <span style={{ ...mlabel, display: "block", marginBottom: 8 }}>How it crops</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {([["Card", "4 / 3"], ["Hero", "16 / 10"], ["Thumb", "1 / 1"]] as const).map((p) => (
                <div key={p[0]}>
                  <div style={{ fontFamily: "var(--font-sans)", fontSize: 9.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--slate)", marginBottom: 4 }}>{p[0]}</div>
                  <div style={{ position: "relative", aspectRatio: p[1], overflow: "hidden", border: "1px solid var(--border-subtle)", background: "var(--paper-2)" }}>
                    <img src={show(src)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, display: "block" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20, borderTop: "1px solid var(--border-subtle)", paddingTop: 16 }}>
          <TextBtn onClick={() => setPt({ x: 50, y: 50 })}>Reset to centre</TextBtn>
          <SmallBtn onClick={() => { onSave(pos); onClose(); }} label="Save focus" icon="check" />
        </div>
      </div>
    </div>
  );
}
