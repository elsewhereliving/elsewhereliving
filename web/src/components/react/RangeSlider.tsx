import { useId } from "react";

// Dual-handle range slider built from two overlaid native range inputs (so it
// stays accessible + keyboard-friendly). Thumb/track styling lives in
// global.css (.ew-range*). Values are clamped so lo <= hi.
//
// scale="log" maps the track logarithmically. Prices span a huge range (a
// ~$170k condo up to a multi-million villa), so on a linear track the everyday
// range is crushed against the far left — to filter "up to $1M" you'd barely
// move the handle. A log track spreads the range by magnitude, so $1M sits
// roughly a third in and the whole span stays usable.
interface Props {
  label: string;
  min: number;
  max: number;
  step: number;
  lo: number;
  hi: number;
  onChange: (lo: number, hi: number) => void;
  format: (v: number) => string;
  scale?: "linear" | "log";
}

const STEPS = 1000; // resolution of the underlying range inputs in log mode

// Round to a clean increment appropriate to the magnitude (tidy readout).
function niceStep(v: number): number {
  if (v < 2_000) return 50;
  if (v < 10_000) return 100;
  if (v < 100_000) return 1_000;
  if (v < 500_000) return 10_000;
  if (v < 2_000_000) return 50_000;
  return 100_000;
}

export default function RangeSlider({ label, min, max, step, lo, hi, onChange, format, scale = "linear" }: Props) {
  const id = useId();
  const LOG = scale === "log" && min > 0 && max > min;
  const lnMin = Math.log(min);
  const lnMax = Math.log(max);

  // value <-> slider-position (position is 0..STEPS in log mode).
  const toPos = (v: number) => {
    if (!LOG) return v;
    const c = Math.min(max, Math.max(min, v));
    return Math.round((STEPS * (Math.log(c) - lnMin)) / (lnMax - lnMin));
  };
  const toVal = (p: number) => {
    if (!LOG) return p;
    if (p <= 0) return min;
    if (p >= STEPS) return max;
    const v = Math.exp(lnMin + (p / STEPS) * (lnMax - lnMin));
    const s = niceStep(v);
    return Math.min(max, Math.max(min, Math.round(v / s) * s));
  };

  const inMin = LOG ? 0 : min;
  const inMax = LOG ? STEPS : max;
  const inStep = LOG ? 1 : step;
  const loPos = toPos(lo);
  const hiPos = toPos(hi);
  const denom = LOG ? STEPS : Math.max(1, max - min);
  const loPct = (LOG ? loPos : lo - min) / denom * 100;
  const hiPct = (LOG ? hiPos : hi - min) / denom * 100;
  // Raise the lo input when both thumbs are in the upper half so it stays grabbable.
  const loOnTop = loPct > 50;

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
          min={inMin}
          max={inMax}
          step={inStep}
          value={loPos}
          style={{ zIndex: loOnTop ? 5 : 3 }}
          onChange={(e) => onChange(Math.min(toVal(Number(e.target.value)), hi), hi)}
          id={`${id}-lo`}
        />
        <input
          type="range"
          aria-label={`${label} maximum`}
          min={inMin}
          max={inMax}
          step={inStep}
          value={hiPos}
          style={{ zIndex: 4 }}
          onChange={(e) => onChange(lo, Math.max(toVal(Number(e.target.value)), lo))}
          id={`${id}-hi`}
        />
      </div>
    </div>
  );
}
