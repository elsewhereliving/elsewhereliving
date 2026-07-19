import { useCallback, useEffect, useMemo, useState } from "react";

import { listingPrice, rentalPrice, formatNative } from "../../lib/price";
import { VIEW_TAGS } from "../../lib/format";
import { optImg } from "../../lib/img";
import { Icon, ICON_KEYS } from "./icons";
import { TextField, NumberField, TextArea, SelectField, ChipMulti, FormSection } from "./fields";
import PhotoManager from "./PhotoManager";
import AiDraft from "./AiDraft";
import { saveRecord, deleteRecord } from "./fsRepo";
import { useStudio, useToast, type Rec } from "./store";

const VIEW_OPTIONS = [...VIEW_TAGS];
const CURRENCIES = ["USD", "THB", "EUR", "IDR", "AED", "GBP", "SGD", "AUD", "CHF"];

function youTubeId(u: string): string {
  const m = (u || "").match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([\w-]{11})/);
  return m ? m[1] : "";
}

export default function Editor({ collection, id, onClose, onSaved }: { collection: string; id: string | null; onClose: () => void; onSaved: (id: string) => void }) {
  const crm = useStudio();
  const toast = useToast();
  const existing = id ? crm.get(collection, id) : null;
  // The saved URL slug, so we can tell an edited URL from an unchanged one.
  const originalId = existing ? existing.id : null;
  // While the record is unsaved, the collection can be flipped in place — so a
  // rental pasted under the For-sale tab (or vice versa) never ships wrong.
  const [col, setCol] = useState(collection);
  const isRental = col === "rentals";

  const [rec, setRec] = useState<Rec>(() => (existing ? JSON.parse(JSON.stringify(existing)) : crm.blank(collection)));
  const [dirty, setDirty] = useState(false);
  // AI drafting chat — open by default when starting a fresh listing.
  const [aiOpen, setAiOpen] = useState(!existing);
  const [aiSeed, setAiSeed] = useState("");

  const set = useCallback((patch: Partial<Rec>) => { setRec((r) => ({ ...r, ...patch })); setDirty(true); }, []);
  const setGallery = useCallback((g: string[]) => { setRec((r) => ({ ...r, gallery: g, image: g[0] || "" })); setDirty(true); }, []);
  const addPhotos = useCallback((urls: string[]) => {
    setRec((r) => { const g = (r.gallery || []).concat(urls.filter((u) => (r.gallery || []).indexOf(u) < 0)); return { ...r, gallery: g, image: g[0] || "" }; });
    setDirty(true);
  }, []);
  const openAi = (seed = "") => { setAiSeed(seed ? seed + " " : ""); setAiOpen(true); };

  // Flip an unsaved draft between For sale and Rental: keep everything the two
  // schemas share (photos, story, facts) and reset the money/collection fields.
  const SHARED = ["id", "image", "gallery", "focals", "location", "place", "mapQuery", "title", "view", "beds", "bedsLabel", "baths", "video", "blurb", "detail", "features", "internalName", "created"];
  function switchCollection(c2: string) {
    if (existing || c2 === col) return;
    setCol(c2);
    setRec((r) => {
      const out: Rec = { ...crm.blank(c2) };
      for (const k of SHARED) if (r[k] !== undefined) out[k] = r[k];
      return out;
    });
    setDirty(true);
    toast(c2 === "rentals" ? "Switched to rental — set the nightly rate" : "Switched to for-sale — set the asking price");
  }

  const previewItem = useMemo<Rec>(() => {
    const cover = (rec.gallery && rec.gallery[0]) || rec.image || "";
    const priced = isRental ? rentalPrice(rec) : listingPrice(rec);
    return { ...rec, ...priced, image: cover, imageFocal: (rec.focals && rec.focals[cover]) || "" };
  }, [rec, isRental]);

  // Photo folders under assets/listings referenced by a record's images.
  const foldersOf = (r: Rec): Set<string> => {
    const s = new Set<string>();
    for (const u of [r.image, ...(r.gallery || [])]) {
      const m = /^\/assets\/listings\/([^/]+)\//.exec(u || "");
      if (m) s.add(m[1]);
    }
    return s;
  };

  async function del() {
    if (!existing) return;
    if (!window.confirm("Delete this listing? This can't be undone.")) return;
    if (crm.fsConnected) {
      // Related properties share photo folders — only remove folders that no
      // other listing or rental still references.
      const others = [...crm.listings, ...crm.rentals].filter((r) => r.id !== existing.id);
      const orphaned = [...foldersOf(existing)].filter((f) => !others.some((o) => foldersOf(o).has(f)));
      try { await deleteRecord(collection, existing.id, orphaned); }
      catch (e: any) { toast(e?.message || "Couldn't delete from the repo — nothing was removed", "danger"); return; }
    }
    crm.remove(collection, existing.id);
    toast(crm.fsConnected ? "Deleted — review in GitHub Desktop & push" : "Listing deleted", "danger");
    onClose();
  }

  async function save(close: boolean) {
    if (!(rec.title || "").trim()) { toast("Add a title first", "danger"); return; }
    let out: Rec = { ...rec };
    out.image = (out.gallery && out.gallery[0]) || out.image || "";
    out.imageFocal = (out.focals && out.focals[out.image]) || "";
    // The id is the page's URL slug. Sanitise whatever's in the URL field; if
    // it's blank, derive one from the title (rentals keep the repo's "r-…"
    // convention, which also keeps their photo folder from colliding with a sale's).
    out.id = crm.slugify(out.id || "");
    if (!out.id) {
      const base = crm.slugify(out.title);
      out.id = crm.uniqueId(col, isRental && !base.startsWith("r-") ? "r-" + base : base);
    }
    // No two pages in a collection may share a URL.
    if (crm.list(col).some((x) => x.id === out.id && x.id !== originalId)) {
      toast("That URL is already taken by another " + (isRental ? "rental" : "listing"), "danger");
      return;
    }
    const renamed = !!originalId && out.id !== originalId;
    if (crm.fsConnected) {
      try {
        out = await saveRecord(col, out, originalId || undefined);
        toast(renamed ? "URL changed & saved — old links will now 404" : "Saved to your repo — review in GitHub Desktop & push");
      }
      catch (e: any) { toast(e?.message || "Couldn't write to disk", "danger"); return; }
    } else {
      toast(renamed ? "URL changed this session — connect your repo folder to write it to disk" : "Saved this session — connect your repo folder to write it to disk");
    }
    const savedId = renamed ? crm.rename(col, originalId as string, out) : crm.upsert(col, out);
    setDirty(false);
    if (close) onSaved(savedId);
    else setRec({ ...out, id: savedId });
  }

  function requestClose() {
    if (dirty && !window.confirm("Discard your changes and leave? Nothing will be saved.")) return;
    onClose();
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--paper)", overflowY: "auto", zIndex: 5 }}>
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: "var(--white)", borderBottom: "1px solid var(--border-on-light)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 28px", height: 66, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <button type="button" onClick={requestClose} style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "none", border: "none", cursor: "pointer", color: "var(--charcoal)" }}>
            <Icon name="chevronLeft" size={17} /><span style={{ fontFamily: "var(--font-sans)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase" }}>{dirty ? "Discard" : "Studio"}</span>
          </button>
          <div style={{ flex: 1, textAlign: "center", overflow: "hidden" }}>
            {existing ? (
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--slate)", fontWeight: 500 }}>{isRental ? "Rental" : "For sale"}{dirty ? " · Unsaved" : ""}</span>
            ) : (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                {([["listings", "For sale"], ["rentals", "Rental"]] as const).map(([c, label]) => {
                  const active = col === c;
                  return (
                    <button key={c} type="button" onClick={() => switchCollection(c)} title={active ? undefined : "Switch this draft to " + label.toLowerCase()}
                      style={{ background: "none", border: "none", cursor: active ? "default" : "pointer", padding: "2px 0", fontFamily: "var(--font-sans)", fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: active ? 600 : 500, color: active ? "var(--navy)" : "var(--stone)", borderBottom: "2px solid " + (active ? "var(--navy)" : "transparent") }}>
                      {label}
                    </button>
                  );
                })}
                <span style={{ fontFamily: "var(--font-sans)", fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--slate)", fontWeight: 500 }}>· New{dirty ? " · Unsaved" : ""}</span>
              </span>
            )}
            <div style={{ fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: 17, color: "var(--navy)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{rec.title || "Untitled property"}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              type="button"
              onClick={() => { if (crm.fsSupported) crm.connectRepo(); }}
              title={crm.fsConnected ? "Repo folder connected — Save writes to disk" : crm.fsSupported ? "Not connected — Save is session-only. Click to connect your repo folder." : "Open this page in Chrome or Edge to connect a folder"}
              style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "none", border: "1px solid var(--border-on-light)", borderRadius: 999, padding: "7px 13px", cursor: crm.fsSupported && !crm.fsConnected ? "pointer" : "default", fontFamily: "var(--font-sans)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--slate)", whiteSpace: "nowrap" }}
            >
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: crm.fsConnected ? "#3a8a4a" : "var(--stone)", flex: "0 0 auto" }} />
              {crm.fsConnected ? "Repo connected" : crm.fsSupported ? "Connect repo" : "Chrome only"}
            </button>
            <button type="button" onClick={() => (aiOpen ? setAiOpen(false) : openAi())} title="Draft this listing with AI — drop photos, paste notes"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 18px", cursor: "pointer", background: aiOpen ? "var(--navy)" : "transparent", color: aiOpen ? "var(--white)" : "var(--navy)", border: "1px solid var(--navy)", fontFamily: "var(--font-sans)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase" }}>
              <Icon name="sparkles" size={13} color={aiOpen ? "var(--white)" : "var(--navy)"} /> AI draft
            </button>
            {dirty && <BarBtn onClick={requestClose} variant="ghost" label="Cancel" />}
            <BarBtn onClick={() => save(false)} variant="ghost" label="Save" />
            <BarBtn onClick={() => save(true)} variant="solid" label="Save & close" />
          </div>
        </div>
      </div>

      <div className="ew-editor-grid" style={{ maxWidth: 1240, margin: "0 auto", padding: "34px 28px 90px", display: "grid", gridTemplateColumns: "1fr 340px", gap: 44, alignItems: "start" }}>
        <div>
          <div style={{ background: "var(--white)", border: "1px solid var(--border-subtle)", padding: 24, marginBottom: 38 }}>
            <PhotoManager gallery={rec.gallery || []} onChange={setGallery} focals={rec.focals || {}} onFocals={(f) => set({ focals: f })} />
          </div>

          <FormSection eyebrow="Essentials">
            <TextField label="Villa name (internal)" value={rec.internalName} onChange={(v) => set({ internalName: v })} hint="Studio only — never shown on the website" placeholder="e.g. Baan Kilee" />
            <TextField label="Title" value={rec.title} onChange={(v) => set({ title: v })} placeholder="A distinctive name — by character, not the real project name" />
            <SlugField
              value={rec.id}
              original={originalId}
              base={isRental ? "/rentals/" : "/property/"}
              placeholder={crm.slugify(rec.title)}
              slugify={crm.slugify}
              onChange={(v) => set({ id: v })}
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
              <TextField label="Location line" value={rec.location} onChange={(v) => set({ location: v })} placeholder="Bang Tao · Phuket · Thailand" />
              {!isRental ? <SelectField label="Market" value={rec.market || crm.markets[0]} onChange={(v) => set({ market: v })} options={crm.markets} /> : <TextField label="Sleeps" value={rec.sleeps} onChange={(v) => set({ sleeps: v })} placeholder="up to 12 guests · 6 bedrooms" />}
            </div>
            <TextField label="Full place / address" value={rec.place} onChange={(v) => set({ place: v })} hint="for the map label" placeholder="Cherngtalay, Thalang District, Phuket 83110" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
              <TextField label="Map coordinates" value={rec.mapQuery} onChange={(v) => set({ mapQuery: v })} mono hint="lat,lng" placeholder="7.989700,98.282000" />
              <ChipMulti label="View" value={rec.view} onChange={(v) => set({ view: v })} options={VIEW_OPTIONS} />
            </div>
            {!isRental && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
                <SelectField label="Type" value={rec.type} onChange={(v) => set({ type: v })} options={["Villa", "Condominium", "Land"]} />
                <SelectField label="Status" value={rec.status} onChange={(v) => set({ status: v })} options={rec.type === "Land" ? ["", "Move-In Ready", "Off-Plan"] : ["Move-In Ready", "Off-Plan"]} hint="Land listings can leave status empty" />
              </div>
            )}
            <VideoField value={rec.video} onChange={(v) => set({ video: v })} />
          </FormSection>

          <FormSection eyebrow="The facts" cols="1fr 1fr 1fr">
            <NumberField label="Bedrooms" value={rec.beds} onChange={(v) => set({ beds: v })} />
            <TextField label="Beds label" value={rec.bedsLabel} onChange={(v) => set({ bedsLabel: v })} hint="optional" placeholder="3 – Penthouse" />
            <TextField label="Bathrooms" value={rec.baths} onChange={(v) => set({ baths: v })} placeholder="3+" />
            {isRental ? (
              <>
                <NumberField label="Guests" value={rec.guests} onChange={(v) => set({ guests: v, guestsLabel: String(v) })} />
                <TextField label="Occupancy" value={rec.occupancy} onChange={(v) => set({ occupancy: v })} placeholder="up to 12 guests" />
                <TextField label="Size" value={rec.size} onChange={(v) => set({ size: v })} placeholder="1,200 m²" />
              </>
            ) : (
              <>
                <TextField label="Property size" value={rec.interior} onChange={(v) => set({ interior: v })} hint="number + m² only" placeholder="450 m² or —" />
                <TextField label="Plot / land" value={rec.plot || ""} onChange={(v) => set({ plot: v || null })} hint="number + m² / rai only" placeholder="1,600 m²" />
                <TextField label="Completion" value={rec.year || ""} onChange={(v) => set({ year: v || null })} placeholder="2025" />
                <SelectField label="Ownership" value={rec.ownership || "Freehold"} onChange={(v) => set({ ownership: v })} options={["Freehold", "Leasehold", "Freehold or Leasehold"]} />
              </>
            )}
          </FormSection>

          <FormSection eyebrow="Pricing">
            <PriceEditor isRental={isRental} rec={rec} set={set} />
            {isRental && <TextField label="Rate note" value={rec.note} onChange={(v) => set({ note: v })} placeholder="Fully staffed · private chef available" />}
            {!isRental && <TextField label="Yield / ROI" value={rec.yield} onChange={(v) => set({ yield: v })} hint="optional — shows beside the price on the card; use · to split lines" placeholder="10% ROI guaranteed · first 5 years" />}
          </FormSection>

          <FormSection eyebrow="The story">
            <TextArea label="Blurb — the short pitch" value={rec.blurb} onChange={(v) => set({ blurb: v })} rows={4}
              action={<AiBtn label="Draft blurb" onClick={() => openAi("Draft (or redraft) the blurb from the photos and the info on the form.")} />} />
            <TextArea label="Detail — the full description" value={rec.detail} onChange={(v) => set({ detail: v })} rows={9}
              action={<AiBtn label="Draft detail" onClick={() => openAi("Draft (or redraft) the full detail description from the photos and the info on the form.")} />} />
          </FormSection>

          <FeaturesEditor features={rec.features || []} onChange={(f) => set({ features: f })} />
        </div>

        <aside style={{ position: "sticky", top: 90 }}>
          <span style={{ display: "block", marginBottom: 12, fontFamily: "var(--font-sans)", fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--slate)", fontWeight: 500 }}>[ Live preview ]</span>
          <PreviewCard item={previewItem} isRental={isRental} />
          <Checklist rec={previewItem} isRental={isRental} />
          {existing && (
            <button type="button" onClick={del}
              style={{ marginTop: 18, width: "100%", padding: "11px", background: "transparent", border: "1px solid var(--border-on-light)", color: "var(--navy)", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 10.5, letterSpacing: "0.16em", textTransform: "uppercase" }}>Delete listing</button>
          )}
        </aside>
      </div>

      {aiOpen && (
        <AiDraft
          collection={col}
          rec={rec}
          markets={crm.markets}
          seed={aiSeed}
          onApply={set}
          onAddPhotos={addPhotos}
          onSwitchCollection={existing ? undefined : () => switchCollection(isRental ? "listings" : "rentals")}
          onClose={() => setAiOpen(false)}
        />
      )}
    </div>
  );
}

// Edit the page's URL slug (the record's id). Sanitises to lowercase-hyphen on
// blur, shows the resulting URL live, and warns when an existing page's URL is
// being changed (old links break; photos keep their current location).
function SlugField({ value, original, base, placeholder, slugify, onChange }: {
  value: string; original: string | null; base: string; placeholder: string;
  slugify: (s: string) => string; onChange: (v: string) => void;
}) {
  const [text, setText] = useState(value || "");
  const [f, setF] = useState(false);
  // Resync the field to the record's id — but only while it's not being edited,
  // so live keystrokes (which may include a trailing "-") aren't clobbered by
  // the sanitised id we push up on every change. On blur, this tidies the display.
  useEffect(() => { if (!f) setText(value || ""); }, [value, f]);
  const clean = slugify(text);
  const shown = clean || slugify(placeholder || "");
  const changed = !!original && !!clean && clean !== original;
  // Keep the record's id current on every keystroke (like every other field),
  // sanitised, while the visible input keeps the raw text for natural typing.
  const onType = (v: string) => { setText(v); onChange(slugify(v)); };
  return (
    <div>
      <span style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 7, gap: 10 }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--slate)" }}>Page URL</span>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 10, letterSpacing: "0.04em", color: "var(--stone)" }}>lowercase-with-hyphens</span>
      </span>
      <div style={{ display: "flex", alignItems: "baseline", borderBottom: "1px solid " + (f ? "var(--navy)" : "var(--border-subtle)") }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--stone)", whiteSpace: "nowrap", paddingBottom: 8 }}>{base}</span>
        <input value={text} placeholder={slugify(placeholder || "") || "set-from-title-on-save"}
          onFocus={() => setF(true)} onBlur={() => setF(false)}
          onChange={(e) => onType(e.target.value)}
          style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", outline: "none", borderRadius: 0, color: "var(--charcoal)", fontFamily: "var(--font-sans)", fontSize: 14, padding: "5px 0 8px" }} />
      </div>
      <div style={{ marginTop: 7, fontFamily: "var(--font-sans)", fontSize: 11.5, lineHeight: 1.5, color: "var(--slate)" }}>
        {shown ? <>Lives at <span style={{ color: "var(--navy)" }}>{base}{shown}</span></> : "Set from the title when you first save."}
        {changed && (
          <span style={{ display: "block", marginTop: 3, color: "var(--stone)" }}>
            Was {base}{original} — changing it 404s any old links. Photos keep their current location.
          </span>
        )}
      </div>
    </div>
  );
}

function PriceEditor({ isRental, rec, set }: { isRental: boolean; rec: Rec; set: (p: Partial<Rec>) => void }) {
  const amtKey = isRental ? "nightlyOriginalNum" : "priceOriginalNum";
  const curKey = isRental ? "nightlyCurrency" : "priceCurrency";
  const cur = (rec[curKey] || "").toUpperCase();
  const amt = rec[amtKey];
  const onRequest = !cur;
  const computed = isRental ? rentalPrice(rec) : listingPrice(rec);
  const display = isRental ? computed.nightly : computed.price;
  const native = cur && cur !== "USD" && amt ? formatNative(amt, cur) : "";

  const setOnRequest = (v: boolean) =>
    v ? set({ [amtKey]: null, [curKey]: "" } as Partial<Rec>) : set({ [curKey]: "USD" } as Partial<Rec>);

  return (
    <div>
      <label style={{ display: "inline-flex", alignItems: "center", gap: 9, marginBottom: onRequest ? 0 : 18, cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--charcoal)" }}>
        <input type="checkbox" checked={onRequest} onChange={(e) => setOnRequest(e.target.checked)} /> Price on request (hide the number)
      </label>
      {!onRequest && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 28, alignItems: "end" }}>
            <SelectField label="Currency" value={cur || "USD"} onChange={(v) => set({ [curKey]: v } as Partial<Rec>)} options={CURRENCIES} />
            <NumberField label={isRental ? "Nightly amount (native)" : "Price amount (native)"} value={rec[amtKey] ?? ""} onChange={(v) => set({ [amtKey]: v === "" ? null : v } as Partial<Rec>)} hint="just the number, e.g. 45000000" />
          </div>
          {!isRental && (
            <label style={{ display: "inline-flex", alignItems: "center", gap: 9, marginTop: 16, cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--charcoal)" }}>
              <input type="checkbox" checked={!!rec.priceFrom} onChange={(e) => set({ priceFrom: e.target.checked })} /> Show as a “From” price
            </label>
          )}
        </>
      )}
      <div style={{ marginTop: 16, fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--slate)" }}>
        Shown on the site: <strong style={{ fontFamily: "var(--font-serif)", fontSize: 17, color: "var(--navy)" }}>{display || "Price on request"}</strong>
        {native && <span style={{ marginLeft: 8 }}>· originally {native} ({cur})</span>}
        {!onRequest && <div style={{ marginTop: 4, color: "var(--stone)" }}>USD is computed from the native amount at the site's build-time rate, so this preview matches the live site.</div>}
      </div>
    </div>
  );
}

function PreviewCard({ item, isRental }: { item: Rec; isRental: boolean }) {
  if (!item.image) {
    return <div style={{ aspectRatio: "3 / 2", background: "var(--paper-2)", border: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--slate)", fontFamily: "var(--font-sans)", fontSize: 12 }}>Add a photo to preview</div>;
  }
  const badges = (isRental ? (Array.isArray(item.view) ? item.view : []) : [item.type, item.status]).filter(Boolean);
  return (
    <div style={{ background: "var(--white)", border: "1px solid var(--border-subtle)", overflow: "hidden" }}>
      <div className="ew-grain" style={{ position: "relative", aspectRatio: "3 / 2", overflow: "hidden", background: "var(--paper-2)" }}>
        <img src={optImg(item.image, "small")} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: item.imageFocal || "center" }} />
      </div>
      <div style={{ padding: "14px 16px 16px" }}>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 9.5, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--slate)" }}>{item.location || "—"}</div>
        <h3 style={{ margin: "6px 0 0", fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: 18, lineHeight: 1.18, color: "var(--navy)" }}>{item.title || "Untitled"}</h3>
        <div style={{ marginTop: 12, display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: 16, color: "var(--charcoal)", flexShrink: 0 }}>
            {isRental ? (item.nightly ? item.nightly + " / night" : "On request") : (item.price || "—")}
          </span>
          {!isRental && item.yield ? (
            // Mirrors the live card (ListingsBrowser): verbatim for Land or
            // self-describing text, otherwise " yield" is appended; " · " splits lines.
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 10, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--slate)", textAlign: "right", lineHeight: 1.5 }}>
              {(item.type === "Land" || /yield|roi|guarant|return|p\.a/i.test(item.yield) ? item.yield : item.yield + " yield")
                .split(" · ")
                .map((part: string, i: number) => (
                  <span key={i} style={{ display: "block", whiteSpace: "nowrap" }}>{part}</span>
                ))}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Checklist({ rec, isRental }: { rec: Rec; isRental: boolean }) {
  const items: [string, boolean][] = [
    ["Cover photo", (rec.gallery || []).length > 0],
    ["Title", !!(rec.title || "").trim()],
    ["Location", !!(rec.location || "").trim()],
    [isRental ? "Nightly rate" : "Price", isRental ? !!rec.nightly : !!rec.price],
    ["Blurb", !!(rec.blurb || "").trim()],
    ["Features", (rec.features || []).length >= 3],
  ];
  const done = items.filter((x) => x[1]).length;
  return (
    <div style={{ marginTop: 22, borderTop: "1px solid var(--border-subtle)", paddingTop: 16 }}>
      <span style={{ display: "block", marginBottom: 12, fontFamily: "var(--font-sans)", fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--slate)", fontWeight: 500 }}>Completeness · {done}/{items.length}</span>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {items.map((it) => (
          <div key={it[0]} style={{ display: "flex", alignItems: "center", gap: 9, fontFamily: "var(--font-sans)", fontSize: 12, color: it[1] ? "var(--charcoal)" : "var(--slate)" }}>
            <span style={{ width: 15, height: 15, border: "1px solid " + (it[1] ? "var(--navy)" : "var(--stone)"), background: it[1] ? "var(--navy)" : "transparent", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{it[1] && <Icon name="check" size={10} color="var(--white)" />}</span>
            {it[0]}
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturesEditor({ features, onChange }: { features: { l: string; i: string }[]; onChange: (f: { l: string; i: string }[]) => void }) {
  const update = (i: number, patch: Partial<{ l: string; i: string }>) => { const n = features.slice(); n[i] = { ...n[i], ...patch }; onChange(n); };
  const add = () => onChange(features.concat([{ l: "", i: "check" }]));
  const remove = (i: number) => { const n = features.slice(); n.splice(i, 1); onChange(n); };
  const move = (i: number, d: number) => { const j = i + d; if (j < 0 || j >= features.length) return; const n = features.slice(); const x = n.splice(i, 1)[0]; n.splice(j, 0, x); onChange(n); };
  return (
    <section style={{ marginBottom: 20 }}>
      <div style={{ borderTop: "1px solid var(--border-on-light)", paddingTop: 14, marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--slate)", fontWeight: 500 }}>[ Features ]</span>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--charcoal)", fontWeight: 500 }}>{features.length}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {features.map((f, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "46px 1fr auto", gap: 10, alignItems: "center" }}>
            <div style={{ position: "relative", border: "1px solid var(--border-subtle)", height: 42, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--paper)" }}>
              <Icon name={f.i || "check"} size={18} color="var(--navy)" />
              <select value={f.i || "check"} onChange={(e) => update(i, { i: e.target.value })} title="Icon" style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%" }}>
                {ICON_KEYS.map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <input value={f.l} onChange={(e) => update(i, { l: e.target.value })} placeholder="Horizon-edge infinity pool"
              style={{ width: "100%", boxSizing: "border-box", border: "1px solid var(--border-subtle)", background: "var(--white)", padding: "11px 12px", fontFamily: "var(--font-sans)", fontSize: 13.5, color: "var(--charcoal)", outline: "none", borderRadius: 0 }} />
            <div style={{ display: "flex", gap: 4 }}>
              <MiniBtn onClick={() => move(i, -1)} label="↑" />
              <MiniBtn onClick={() => move(i, 1)} label="↓" />
              <MiniBtn onClick={() => remove(i)} label="×" />
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={add} style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "1px dashed var(--stone)", padding: "10px 16px", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--navy)" }}>+ Add feature</button>
    </section>
  );
}

function MiniBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return <button type="button" onClick={onClick} style={{ width: 32, height: 32, border: "1px solid var(--border-subtle)", background: "var(--white)", cursor: "pointer", color: "var(--slate)", fontSize: 14, lineHeight: 1, fontFamily: "var(--font-sans)" }}>{label}</button>;
}

function BarBtn({ onClick, label, variant }: { onClick: () => void; label: string; variant: "solid" | "ghost" }) {
  const [h, setH] = useState(false);
  const solid = variant === "solid";
  return (
    <button type="button" onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ padding: "11px 22px", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", background: solid ? (h ? "var(--navy-80)" : "var(--navy)") : (h ? "var(--paper)" : "transparent"), color: solid ? "var(--white)" : "var(--navy)", border: "1px solid var(--navy)", transition: "background .25s var(--ease-out)" }}>{label}</button>
  );
}

function AiBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--navy)" }}>
      <Icon name="sparkles" size={13} color="var(--navy)" />{label}
    </button>
  );
}

function VideoField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const vid = youTubeId(value || "");
  const dirty = (value || "").trim().length > 0;
  return (
    <div>
      <TextField label="Video tour — YouTube link" value={value} onChange={onChange} hint="optional" placeholder="https://youtu.be/…  or  https://www.youtube.com/watch?v=…" />
      <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 14 }}>
        {vid ? (
          <>
            <div style={{ position: "relative", width: 132, flex: "0 0 auto", aspectRatio: "16 / 9", overflow: "hidden", border: "1px solid var(--border-subtle)", background: "var(--paper-2)" }}>
              <img src={"https://img.youtube.com/vi/" + vid + "/hqdefault.jpg"} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 11.5, letterSpacing: "0.04em", color: "var(--navy)" }}>Video linked — it'll appear on the listing page.</span>
          </>
        ) : dirty ? (
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 11.5, color: "var(--slate)" }}>That doesn't look like a YouTube link yet — paste the full watch or share URL.</span>
        ) : null}
      </div>
    </div>
  );
}
