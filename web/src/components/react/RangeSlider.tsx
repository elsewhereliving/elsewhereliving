import { useId } from "react";

// Dual-handle range slider built from two overlaid native range inputs (so it
// stays accessible + keyboard-friendly). Thumb/track styling lives in
// global.css (.ew-range*). Values are clamped so lo <= hi.
interface Props {
  label: string;
  min: number;
  max: number;
  step: number;
  lo: number;
  hi: number;
  onChange: (lo: number, hi: number) => void;
  format: (v: number) => string;
}

export default function RangeSlider({ label, min, max, step, lo, hi, onChange, format }: Props) {
  const id = useId();
  const span = Math.max(1, max - min);
  const loPct = ((lo - min) / span) * 100;
  const hiPct = ((hi - min) / span) * 100;
  // Raise the lo input when both thumbs are in the upper half so it stays grabbable.
  const loOnTop = lo > (min + max) / 2;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 300 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 10.5, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--slate)" }}>{label}</span>
        <span style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: 15, color: "var(--navy)" }}>
          {format(lo)} – {format(hi)}{hi >= max ? "+" : ""}
        </span>
      </div>
      <div className="ew-range">
        <div className="ew-range__track" />
        <div className="ew-range__fill" style={{ left: `${loPct}%`, right: `${100 - hiPct}%` }} />
        <input
          type="range"
          aria-label={`${label} minimum`}
          min={min}
          max={max}
          step={step}
          value={lo}
          style={{ zIndex: loOnTop ? 5 : 3 }}
          onChange={(e) => onChange(Math.min(Number(e.target.value), hi), hi)}
          id={`${id}-lo`}
        />
        <input
          type="range"
          aria-label={`${label} maximum`}
          min={min}
          max={max}
          step={step}
          value={hi}
          style={{ zIndex: 4 }}
          onChange={(e) => onChange(lo, Math.max(Number(e.target.value), lo))}
          id={`${id}-hi`}
        />
      </div>
    </div>
  );
}
