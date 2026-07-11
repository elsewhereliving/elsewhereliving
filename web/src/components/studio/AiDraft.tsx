// The AI drafting chat — a drawer in the Editor. Drop photos + paste raw notes
// (an agent's WhatsApp message, brochure text); the model fills the form live
// and the conversation continues turn by turn ("price is 45M THB", "shorter
// blurb"). Photos dropped here are resized in-browser and land in the gallery.
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Icon } from "./icons";
import { useToast, type Rec } from "./store";
import { getAiKey, setAiKey, sendChat, formSnapshot, normalizePatch, AI_MODEL } from "./ai";
import { resizeToDataUrl, GALLERY_EDGE, AI_EDGE } from "./resize";

const FIELD_LABELS: Record<string, string> = {
  internalName: "Internal name", title: "Title", location: "Location", place: "Place", mapQuery: "Map", market: "Market",
  type: "Type", status: "Status", view: "View", beds: "Bedrooms", bedsLabel: "Beds label", baths: "Bathrooms",
  interior: "Property size", plot: "Plot", year: "Completion", ownership: "Ownership", priceOriginalNum: "Price", priceCurrency: "Currency",
  priceFrom: "From price", sleeps: "Sleeps", guests: "Guests", occupancy: "Occupancy", size: "Size",
  nightlyOriginalNum: "Nightly rate", nightlyCurrency: "Currency", note: "Rate note", blurb: "Blurb", detail: "Detail", features: "Features",
};

interface Bubble { role: "user" | "assistant" | "error"; text: string; photos?: string[]; filled?: string[] }

const sans = (extra?: CSSProperties): CSSProperties => ({ fontFamily: "var(--font-sans)", ...extra });
const mlabel: CSSProperties = sans({ fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--slate)", fontWeight: 500 });

export default function AiDraft({ collection, rec, markets, seed, onApply, onAddPhotos, onClose }: {
  collection: string;
  rec: Rec;
  markets: string[];
  seed?: string; // prefilled composer text (from the per-field "Draft…" buttons)
  onApply: (patch: Partial<Rec>) => void;
  onAddPhotos: (urls: string[]) => void;
  onClose: () => void;
}) {
  const toast = useToast();
  const isRental = collection === "rentals";
  const [hasKey, setHasKey] = useState(!!getAiKey());
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [history, setHistory] = useState<any[]>([]); // raw Anthropic messages
  const [pendingToolIds, setPendingToolIds] = useState<string[]>([]);
  const [input, setInput] = useState(seed || "");
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recRef = useRef(rec);
  recRef.current = rec;

  useEffect(() => { if (seed) setInput(seed); }, [seed]);
  useEffect(() => { scrollRef.current?.scrollTo({ top: 1e6, behavior: "smooth" }); }, [bubbles, busy]);

  function pickFiles(list: FileList | File[]) {
    const imgs = Array.from(list).filter((f) => /^image\//.test(f.type));
    if (imgs.length) setFiles((p) => p.concat(imgs));
  }

  async function send() {
    const notes = input.trim();
    if (busy || (!notes && !files.length)) return;
    setBusy(true);
    setInput("");
    const myFiles = files;
    setFiles([]);
    try {
      // Resize each dropped photo twice: full quality for the gallery, small for the model.
      const thumbs: string[] = [];
      const content: any[] = pendingToolIds.map((id) => ({ type: "tool_result", tool_use_id: id, content: "Applied to the form." }));
      setPendingToolIds([]);
      if (myFiles.length) {
        const galleryUrls: string[] = [];
        for (const f of myFiles) {
          galleryUrls.push(await resizeToDataUrl(f, GALLERY_EDGE));
          const small = await resizeToDataUrl(f, AI_EDGE, 0.8);
          thumbs.push(small);
          content.push({ type: "image", source: { type: "base64", media_type: "image/jpeg", data: small.split(",")[1] } });
        }
        onAddPhotos(galleryUrls);
      }
      content.push({ type: "text", text: (notes || "(photos only — extract what you can)") + "\n\n[Current form values]\n" + formSnapshot(recRef.current, isRental) });
      setBubbles((b) => b.concat([{ role: "user", text: notes, photos: thumbs }]));
      const messages = history.concat([{ role: "user", content }]);
      const res = await sendChat({ isRental, markets, messages });
      setHistory(messages.concat([{ role: "assistant", content: res.assistantContent }]));
      setPendingToolIds(res.assistantContent.filter((b: any) => b.type === "tool_use").map((b: any) => b.id));
      let filled: string[] = [];
      if (res.patch) {
        const patch = normalizePatch(res.patch, isRental);
        filled = Object.keys(patch).filter((k) => FIELD_LABELS[k]).map((k) => FIELD_LABELS[k]);
        if (filled.length) { onApply(patch); toast("AI filled " + filled.length + " field" + (filled.length > 1 ? "s" : "")); }
      }
      setBubbles((b) => b.concat([{ role: "assistant", text: res.text || (filled.length ? "Done — updated the form." : "Nothing to change yet."), filled }]));
    } catch (e: any) {
      const m = String(e?.message || e);
      if (m === "no-key" || m.startsWith("bad-key:")) {
        setHasKey(false);
        if (m.startsWith("bad-key:")) setAiKey("");
        setBubbles((b) => b.concat([{ role: "error", text: "That API key didn't work — paste a valid Anthropic key below." }]));
      } else {
        setBubbles((b) => b.concat([{ role: "error", text: m }]));
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ position: "fixed", top: 67, right: 0, bottom: 0, width: "min(430px, 100vw)", zIndex: 9, background: "var(--white)", borderLeft: "1px solid var(--border-on-light)", boxShadow: "-28px 0 70px -40px rgba(15,22,40,0.45)", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "space-between", flex: "0 0 auto" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
          <Icon name="sparkles" size={15} color="var(--navy)" />
          <span style={{ ...mlabel, color: "var(--charcoal)" }}>Draft with AI</span>
        </span>
        <button type="button" onClick={onClose} aria-label="Close" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "var(--slate)", lineHeight: 1 }}>×</button>
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
        {!bubbles.length && (
          <div style={{ border: "1px dashed var(--stone)", padding: "22px 18px", background: "var(--paper)" }}>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 17, color: "var(--navy)", marginBottom: 8 }}>Chat this listing into shape.</div>
            <p style={sans({ fontSize: 12.5, color: "var(--slate)", lineHeight: 1.6, margin: 0 })}>
              Drop the photos and paste whatever you have — the agent's WhatsApp message, brochure text, a few bullet specs.
              I'll add the photos to the gallery (resized), read them, and fill the title, story, facts and price on the form.
              Then keep chatting: “price is 45M THB”, “make the blurb shorter”, “it also has a gym”.
            </p>
          </div>
        )}
        {bubbles.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "stretch", maxWidth: m.role === "user" ? "88%" : "100%" }}>
            {m.role === "user" ? (
              <div style={{ background: "var(--navy)", color: "var(--white)", padding: "11px 14px" }}>
                {!!m.photos?.length && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: m.text ? 8 : 0 }}>
                    {m.photos.map((p, j) => <img key={j} src={p} alt="" style={{ width: 64, height: 48, objectFit: "cover", display: "block" }} />)}
                  </div>
                )}
                {m.text && <div style={sans({ fontSize: 13, lineHeight: 1.55, whiteSpace: "pre-wrap" })}>{m.text}</div>}
              </div>
            ) : (
              <div style={{ background: m.role === "error" ? "var(--butter)" : "var(--paper)", border: "1px solid var(--border-subtle)", padding: "12px 14px" }}>
                <div style={sans({ fontSize: 13, lineHeight: 1.6, color: "var(--charcoal)", whiteSpace: "pre-wrap" })}>{m.text}</div>
                {!!m.filled?.length && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 10 }}>
                    {m.filled.map((f) => (
                      <span key={f} style={sans({ fontSize: 9.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--navy)", border: "1px solid var(--border-on-light)", background: "var(--white)", padding: "3px 8px", display: "inline-flex", alignItems: "center", gap: 5 })}>
                        <Icon name="check" size={9} color="var(--navy)" />{f}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {busy && (
          <div style={sans({ fontSize: 12, color: "var(--slate)", display: "inline-flex", alignItems: "center", gap: 8 })}>
            <span className="ew-ai-pulse" style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--navy)", display: "inline-block" }} />
            Reading &amp; drafting…
          </div>
        )}
      </div>

      {!hasKey ? (
        <KeyGate onSaved={() => setHasKey(true)} />
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); pickFiles(e.dataTransfer.files); }}
          style={{ flex: "0 0 auto", borderTop: "1.5px " + (dragOver ? "dashed var(--navy)" : "solid var(--border-subtle)"), background: dragOver ? "var(--paper)" : "var(--white)", padding: "14px 18px 16px" }}
        >
          {!!files.length && (
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 10 }}>
              {files.map((f, i) => (
                <span key={i} style={{ position: "relative", display: "inline-block", lineHeight: 0 }}>
                  <img src={URL.createObjectURL(f)} alt="" style={{ width: 58, height: 44, objectFit: "cover", border: "1px solid var(--border-subtle)" }} onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)} />
                  <button type="button" onClick={() => setFiles((p) => p.filter((_, j) => j !== i))} aria-label="Remove photo"
                    style={{ position: "absolute", top: -6, right: -6, width: 17, height: 17, borderRadius: "50%", border: "none", background: "var(--navy)", color: "var(--white)", fontSize: 11, lineHeight: 1, cursor: "pointer", padding: 0 }}>×</button>
                </span>
              ))}
            </div>
          )}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={"Drop photos here + paste the raw info…\ne.g. “4br pool villa in Bang Tao, 620 m² on a 900 m² plot, 45M THB, completed 2023”"}
            rows={3}
            style={{ width: "100%", boxSizing: "border-box", background: "var(--paper)", border: "1px solid var(--border-subtle)", padding: "11px 13px", fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--charcoal)", resize: "none", outline: "none", borderRadius: 0, lineHeight: 1.55 }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
            <button type="button" onClick={() => fileRef.current?.click()}
              style={sans({ display: "inline-flex", alignItems: "center", gap: 7, background: "none", border: "1px solid var(--border-on-light)", padding: "8px 14px", cursor: "pointer", fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--navy)" })}>
              + Photos
            </button>
            <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={(e) => { if (e.target.files) pickFiles(e.target.files); e.target.value = ""; }} />
            <button type="button" onClick={send} disabled={busy || (!input.trim() && !files.length)}
              style={sans({ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", cursor: busy ? "default" : "pointer", background: "var(--navy)", color: "var(--white)", border: "none", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", opacity: busy || (!input.trim() && !files.length) ? 0.55 : 1 })}>
              {busy ? "Working…" : "Send"} <Icon name="arrowRight" size={13} color="var(--white)" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function KeyGate({ onSaved }: { onSaved: () => void }) {
  const [val, setVal] = useState("");
  return (
    <div style={{ flex: "0 0 auto", borderTop: "1px solid var(--border-subtle)", padding: "16px 18px 18px", background: "var(--paper)" }}>
      <span style={{ ...mlabel, display: "block", marginBottom: 8 }}>[ One-time setup ]</span>
      <p style={sans({ fontSize: 12, color: "var(--slate)", lineHeight: 1.55, margin: "0 0 10px" })}>
        Paste your Anthropic API key (from console.anthropic.com). It's stored only in this browser — the studio has no
        server — and used to call {AI_MODEL} directly.
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <input type="password" value={val} onChange={(e) => setVal(e.target.value)} placeholder="sk-ant-…" autoComplete="off"
          style={{ flex: 1, boxSizing: "border-box", background: "var(--white)", border: "1px solid var(--border-subtle)", padding: "10px 12px", fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--charcoal)", outline: "none", borderRadius: 0 }} />
        <button type="button" disabled={!val.trim().startsWith("sk-ant-")} onClick={() => { setAiKey(val.trim()); onSaved(); }}
          style={sans({ padding: "10px 18px", cursor: "pointer", background: "var(--navy)", color: "var(--white)", border: "none", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", opacity: val.trim().startsWith("sk-ant-") ? 1 : 0.5 })}>
          Save
        </button>
      </div>
    </div>
  );
}
