import { useState } from "react";
import Button from "./Button";

// Development Partner budget explorer — indicative all-in picture per market.
// Fee and consultation price are single-source constants (see also the page copy).
export const DP_FEE_PCT = 0.10;

const MARKETS: Record<string, { min: number; label: string }> = {
  "Koh Samui": { min: 1000000, label: "$1M" },
  "Phuket": { min: 2000000, label: "$2M" },
};
const MAX = 5000000;
const STEP = 50000;

const money = (v: number) => "$" + Math.round(v).toLocaleString("en-US");
const compact = (v: number) =>
  v >= 1e6 ? "$" + Math.round((v / 1e6) * 100) / 100 + "M" : "$" + Math.round(v / 1e3) + "k";

const label: React.CSSProperties = { fontFamily: "var(--font-sans)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--charcoal)", fontWeight: 400 };
const note: React.CSSProperties = { gridColumn: "1 / -1", fontFamily: "var(--font-sans)", fontWeight: 300, fontSize: 12.5, lineHeight: 1.6, color: "var(--slate)" };
const value: React.CSSProperties = { fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: 15.5, color: "var(--navy)", textAlign: "right", whiteSpace: "nowrap" };

export default function BudgetExplorer() {
  const [island, setIsland] = useState("Koh Samui");
  const [budget, setBudget] = useState(MARKETS["Koh Samui"].min);
  const cfg = MARKETS[island];
  const pick = (name: string) => {
    setIsland(name);
    setBudget((b) => Math.max(b, MARKETS[name].min));
  };

  // Indicative formulas (B = all-in budget in USD) — see design handoff.
  const B = Math.max(budget, cfg.min);
  const M = B / 1e6;
  const buildLo = 0.45 * B;
  const buildHi = 0.685 * B;
  const fee = DP_FEE_PCT * B;
  const landLo = Math.max(0.05 * B, B - buildHi - fee - 0.03 * B);
  const landHi = Math.max(landLo + 0.05 * B, B - buildLo - fee - 0.02 * B);
  const beds = M < 1.5 ? "3–4" : M < 2.5 ? "4–5" : M < 3.5 ? "5–6" : "6–8";
  const builtLo = Math.round((350 + (M - 1) * 140) / 10) * 10;
  const builtRange = builtLo + "–" + (builtLo + 50) + " m²";
  const plotLo = Math.round((600 + (M - 1) * 350) / 50) * 50;
  const plotHi = Math.round((1200 + (M - 1) * 500) / 50) * 50;
  const plotRange = plotLo.toLocaleString("en-US") + "–" + plotHi.toLocaleString("en-US") + " m²";

  const rows = [
    { l: "Land — the balance", v: compact(landLo) + "–" + compact(landHi), n: "Plots vary hugely — the same money buys smaller near the beach or larger on the hill." },
    { l: "Construction & interiors", v: compact(buildLo) + "–" + compact(buildHi), n: builtRange + " built, depending on the site and the finish." },
    { l: "Development partner fee — estimated", v: Math.round(DP_FEE_PCT * 100) + "% — " + compact(fee), n: "We oversee the whole project. Actual fee confirmed and adjusted to the project's details." },
    { l: "Legal & tax — included", v: "~2–3%", n: "Independent lawyer, due diligence, transfer or lease registration — priced in from day one." },
  ];

  const discuss = () => {
    window.dispatchEvent(new CustomEvent("ew-ch-prefill", { detail: { island, budget: money(B) } }));
  };

  return (
    <div className="reveal">
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        {Object.keys(MARKETS).map((name) => (
          <button key={name} className="ew-ch-island" aria-pressed={island === name} onClick={() => pick(name)}>{name}</button>
        ))}
      </div>

      <div style={{ margin: "40px auto 0", maxWidth: 760, background: "var(--white)", padding: "clamp(26px, 4vw, 38px)", boxShadow: "0 24px 60px rgba(21,38,68,0.14)" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--slate)" }}>Total budget — all-in</span>
            <span style={{ fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: "clamp(2rem, 4.4vw, 2.65rem)", lineHeight: 1, color: "var(--navy)" }}>{money(B)}</span>
          </div>
          <span style={{ fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: 18, color: "var(--slate)" }}>Sea view, infinity pool — the full picture</span>
        </div>

        <div style={{ marginTop: 24 }}>
          <input type="range" className="ew-ch-range" aria-label="Total budget" min={cfg.min} max={MAX} step={STEP} value={B} onChange={(e) => setBudget(Number(e.target.value))} />
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-sans)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--slate)" }}>
            <span>{cfg.label}</span><span>$5M</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 26 }}>
          {[{ k: "Bedrooms", v: beds }, { k: "Built area", v: builtRange }, { k: "Land", v: plotRange }].map((f) => (
            <div key={f.k} style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: "clamp(1.15rem, 2.2vw, 1.6rem)", color: "var(--charcoal)", whiteSpace: "nowrap" }}>{f.v}</span>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 10.5, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--slate)" }}>{f.k}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 26, display: "flex", flexDirection: "column" }}>
          {rows.map((r) => (
            <div key={r.l} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "4px 32px", alignItems: "baseline", padding: "12px 0", borderTop: "1px solid var(--border-subtle)" }}>
              <span style={label}>{r.l}</span>
              <span style={value}>{r.v}</span>
              <span style={note}>{r.n}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap", marginTop: 26 }}>
          <Button variant="solid" size="sm" shape="pill" className="ew-cta-navy" onClick={discuss}>Plan my build at this budget</Button>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 300, fontSize: 12, lineHeight: 1.6, color: "var(--slate)", maxWidth: "52ch" }}>
            Indicative only — USD figures at ฿35/$. Two plots at the same price can differ enormously; your exact plot and build get modelled before anything begins.
          </span>
        </div>
      </div>
    </div>
  );
}
