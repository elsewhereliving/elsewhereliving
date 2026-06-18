import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Icon } from "./icons";

const labelRow = (label: string, hint?: string) => (
  <span style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 7, gap: 10 }}>
    <span style={{ fontFamily: "var(--font-sans)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--slate)" }}>{label}</span>
    {hint && <span style={{ fontFamily: "var(--font-sans)", fontSize: 10, letterSpacing: "0.04em", color: "var(--stone)", textTransform: "none" }}>{hint}</span>}
  </span>
);

const baseInput: CSSProperties = {
  width: "100%", boxSizing: "border-box", background: "transparent", border: "none",
  borderBottom: "1px solid var(--border-subtle)", color: "var(--charcoal)",
  fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: 17, padding: "5px 0 8px",
  outline: "none", borderRadius: 0,
};

export function TextField({ label, value, onChange, placeholder, hint, mono }: { label: string; value: any; onChange: (v: string) => void; placeholder?: string; hint?: string; mono?: boolean }) {
  const [f, setF] = useState(false);
  return (
    <label style={{ display: "block" }}>
      {labelRow(label, hint)}
      <input value={value == null ? "" : value} placeholder={placeholder} onFocus={() => setF(true)} onBlur={() => setF(false)}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...baseInput, ...(mono ? { fontFamily: "var(--font-sans)", fontSize: 14 } : {}), borderBottomColor: f ? "var(--navy)" : "var(--border-subtle)" }} />
    </label>
  );
}

export function NumberField({ label, value, onChange, placeholder, hint }: { label: string; value: any; onChange: (v: number | "") => void; placeholder?: string; hint?: string }) {
  const [f, setF] = useState(false);
  return (
    <label style={{ display: "block" }}>
      {labelRow(label, hint)}
      <input type="number" value={value == null || value === "" ? "" : value} placeholder={placeholder} onFocus={() => setF(true)} onBlur={() => setF(false)}
        onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
        style={{ ...baseInput, fontFamily: "var(--font-sans)", fontSize: 15, borderBottomColor: f ? "var(--navy)" : "var(--border-subtle)" }} />
    </label>
  );
}

export function TextArea({ label, value, onChange, placeholder, rows, action }: { label: string; value: any; onChange: (v: string) => void; placeholder?: string; rows?: number; action?: ReactNode }) {
  const [f, setF] = useState(false);
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--slate)" }}>{label}</span>
        {action || null}
      </span>
      <textarea value={value == null ? "" : value} placeholder={placeholder} rows={rows || 4} onFocus={() => setF(true)} onBlur={() => setF(false)}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", boxSizing: "border-box", background: "var(--paper)", border: "1px solid " + (f ? "var(--navy)" : "var(--border-subtle)"), color: "var(--charcoal)", fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: 15.5, lineHeight: 1.6, padding: "12px 14px", outline: "none", borderRadius: 0, resize: "vertical", transition: "border-color .2s var(--ease-out)" }} />
    </label>
  );
}

export function SelectField({ label, value, onChange, options, hint }: { label: string; value: any; onChange: (v: string) => void; options: string[]; hint?: string }) {
  return (
    <label style={{ display: "block" }}>
      {labelRow(label, hint)}
      <div style={{ position: "relative" }}>
        <select value={value} onChange={(e) => onChange(e.target.value)}
          style={{ ...baseInput, fontFamily: "var(--font-sans)", fontSize: 14, appearance: "none", WebkitAppearance: "none", paddingRight: 24, cursor: "pointer" }}>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <span style={{ position: "absolute", right: 0, top: 6, pointerEvents: "none" }}><Icon name="chevronRight" size={14} color="var(--slate)" style={{ transform: "rotate(90deg)" }} /></span>
      </div>
    </label>
  );
}

export function ChipMulti({ label, value, onChange, options }: { label: string; value: string[]; onChange: (v: string[]) => void; options: string[] }) {
  const sel = value || [];
  const toggle = (o: string) => onChange(sel.indexOf(o) >= 0 ? sel.filter((x) => x !== o) : sel.concat([o]));
  return (
    <div>
      {labelRow(label)}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {options.map((o) => {
          const on = sel.indexOf(o) >= 0;
          return (
            <button key={o} type="button" onClick={() => toggle(o)}
              style={{ padding: "7px 13px", cursor: "pointer", background: on ? "var(--navy)" : "transparent", color: on ? "var(--white)" : "var(--slate)", border: "1px solid " + (on ? "var(--navy)" : "var(--border-on-light)"), fontFamily: "var(--font-sans)", fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase", transition: "all .2s var(--ease-out)" }}>{o}</button>
          );
        })}
      </div>
    </div>
  );
}

export function FormSection({ eyebrow, title, children, cols }: { eyebrow: string; title?: string; children: ReactNode; cols?: string }) {
  return (
    <section style={{ marginBottom: 38 }}>
      <div style={{ borderTop: "1px solid var(--border-on-light)", paddingTop: 14, marginBottom: 22 }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--slate)", fontWeight: 500 }}>[ {eyebrow} ]</span>
        {title && <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: 22, color: "var(--navy)", margin: "5px 0 0" }}>{title}</h2>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: cols || "1fr", gap: "22px 28px" }}>{children}</div>
    </section>
  );
}
