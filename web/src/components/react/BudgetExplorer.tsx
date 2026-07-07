import { useState } from "react";
import Button from "./Button";

const CH_THB_PER_USD = 35;
const CH_BUILD_RATE = [45000, 60000];
const CH_FEE_PCT = 0.025;
const CH_MGMT_PCT = 0.05;

type Tier = { upTo: number; beds: string; bm: [number, number]; land: string; view: string; where: string };
const CH_TIERS: Record<string, { min: number; max: number; step: number; start: number; tiers: Tier[] }> = {
  "Koh Samui": {
    min: 1000000, max: 5000000, step: 50000, start: 1000000,
    tiers: [
      { upTo: 1800000, beds: "3–4", bm: [350, 400], land: "600–1,200 m²", view: "Sea view, infinity pool — the full picture", where: "Maenam, Lamai & Taling Ngam hillsides" },
      { upTo: 3000000, beds: "5", bm: [500, 600], land: "1,200–2,000 m²", view: "Elevated, panoramic sea view", where: "Bo Phut hills & Chaweng Noi ridge" },
      { upTo: Infinity, beds: "5–7", bm: [700, 900], land: "2,000–4,000 m²", view: "Estate scale — ridge-top or near-beach", where: "The island's finest addresses" },
    ],
  },
  "Phuket": {
    min: 2000000, max: 6000000, step: 50000, start: 2500000,
    tiers: [
      { upTo: 3000000, beds: "3–4", bm: [550, 650], land: "600–1,200 m²", view: "West-coast hillside, clear sea view", where: "Rawai & Chalong hills" },
      { upTo: 4500000, beds: "5", bm: [650, 750], land: "1,200–2,000 m²", view: "Panoramic Andaman outlook", where: "Kamala & Surin hillsides" },
      { upTo: Infinity, beds: "5–7", bm: [800, 1000], land: "2,000–4,000 m²", view: "Estate scale — headland or near-beach", where: "Cape Panwa to Surin" },
    ],
  },
};
const money = (v: number) => "$" + Math.round(v).toLocaleString("en-US");
const compact = (v: number) => (v >= 1e6 ? "$" + (Math.round(v / 1e4) / 100).toFixed(2).replace(/\.?0+$/, "") + "M" : "$" + Math.round(v / 1e3) + "k");
const built = (t: Tier) => t.bm[0] + "–" + t.bm[1] + " m²";

export default function BudgetExplorer() {
  const [island, setIsland] = useState("Koh Samui");
  const cfg = CH_TIERS[island];
  const [budget, setBudget] = useState(cfg.start);
  const pick = (name: string) => { setIsland(name); setBudget(CH_TIERS[name].start); };

  const tierIdx = cfg.tiers.findIndex((t) => budget <= t.upTo);
  const tier = cfg.tiers[tierIdx === -1 ? cfg.tiers.length - 1 : tierIdx];

  const buildLo = Math.round(tier.bm[0] * CH_BUILD_RATE[0] / CH_THB_PER_USD / 5000) * 5000;
  const buildHi = Math.round(tier.bm[1] * CH_BUILD_RATE[1] / CH_THB_PER_USD / 5000) * 5000;
  const fees = Math.round(budget * CH_FEE_PCT / 1000) * 1000;
  const mgmt = Math.round(budget * CH_MGMT_PCT / 1000) * 1000;
  const landLo = Math.max(0, budget - buildHi - fees - mgmt);
  const landHi = Math.max(0, budget - buildLo - fees - mgmt);
  const buildMid = Math.min((buildLo + buildHi) / 2, budget * 0.8);
  const landMid = Math.max(0, budget - buildMid - fees - mgmt);
  const split = [
    { l: "Land", w: landMid, c: "var(--navy)" },
    { l: "Construction & interiors", w: buildMid, c: "rgba(21,38,68,0.55)" },
    { l: "Our fee", w: mgmt, c: "var(--mist)" },
    { l: "Legal & tax", w: fees, c: "var(--butter)" },
  ];
  const rows = [
    { l: "Land — the balance", c: "var(--navy)", v: compact(landLo) + "–" + compact(landHi), n: "Plots vary hugely — the same money buys smaller near the beach or larger on the hill" },
    { l: "Construction & interiors", c: "rgba(21,38,68,0.55)", v: compact(buildLo) + "–" + compact(buildHi), n: built(tier) + " built, depending on the site and the finish" },
    { l: "Our fee — project management", c: "var(--mist)", v: "5%", n: "Every stage handled for you — land, design, permits, build, interiors, handover" },
    { l: "Legal & tax — included", c: "var(--butter)", v: "~2–3%", n: "Independent lawyer, due diligence, transfer or lease registration — priced in from day one" },
  ];

  const discuss = () => {
    window.dispatchEvent(new CustomEvent("ew-ch-prefill", { detail: { island, budget: money(budget) } }));
  };

  return (
    <div className="reveal" style={{ maxWidth: 880, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 44 }}>
        {Object.keys(CH_TIERS).map((name) => (
          <button key={name} className="ew-ch-island" aria-pressed={island === name} onClick={() => pick(name)}>{name}</button>
        ))}
      </div>

      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--slate)", marginBottom: 10 }}>Total budget — all-in</div>
        <div style={{ fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: "clamp(2.4rem, 5vw, 3.6rem)", letterSpacing: "-0.02em", lineHeight: 1 }}>{money(budget)}</div>
      </div>
      <div style={{ margin: "26px 0 6px" }}>
        <input type="range" className="ew-ch-range" aria-label="Total budget" min={cfg.min} max={cfg.max} step={cfg.step} value={budget} onChange={(e) => setBudget(Number(e.target.value))} />
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-sans)", fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--slate)" }}>
          <span>{compact(cfg.min)}</span><span>{compact(cfg.max)}</span>
        </div>
      </div>

      <div key={island + "-" + tierIdx} className="ew-ch-fade" style={{ marginTop: 40, background: "var(--white)", border: "1px solid var(--border-subtle)", padding: "clamp(26px, 4vw, 44px)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "22px 32px", textAlign: "center" }}>
          {[{ k: "Bedrooms", v: tier.beds }, { k: "Built area", v: built(tier) }, { k: "Land", v: tier.land }].map((f) => (
            <div key={f.k}>
              <div style={{ fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: "clamp(1.7rem, 3vw, 2.4rem)", letterSpacing: "-0.01em", color: "var(--navy)" }}>{f.v}</div>
              <div style={{ marginTop: 8, fontFamily: "var(--font-sans)", fontSize: 10.5, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--slate)" }}>{f.k}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 26, paddingTop: 24, borderTop: "1px solid var(--border-subtle)", textAlign: "center" }}>
          <p style={{ margin: 0, fontFamily: "var(--font-serif)", fontWeight: 300, fontStyle: "italic", fontSize: "clamp(1.1rem, 2vw, 1.35rem)", color: "var(--navy)" }}>{tier.view}</p>
          <p style={{ margin: "8px 0 0", fontFamily: "var(--font-sans)", fontWeight: 300, fontSize: 13, letterSpacing: "0.04em", color: "var(--slate)" }}>{tier.where}</p>
        </div>
        <div style={{ marginTop: 30 }}>
          <div style={{ display: "flex", height: 10, overflow: "hidden" }}>
            {split.map((sgm) => (<div key={sgm.l} className="ew-ch-seg" style={{ width: (sgm.w / budget * 100) + "%", background: sgm.c }} />))}
          </div>
          <div style={{ marginTop: 18, display: "flex", flexDirection: "column" }}>
            {rows.map((r) => (
              <div key={r.l} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "4px 24px", alignItems: "baseline", padding: "13px 0", borderTop: "1px solid var(--border-subtle)" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: "var(--font-sans)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--charcoal)" }}>
                  <span aria-hidden="true" style={{ width: 10, height: 10, background: r.c, flexShrink: 0 }} />{r.l}
                </span>
                <span style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: 18, color: "var(--navy)", textAlign: "right" }}>{r.v}</span>
                <span style={{ gridColumn: "1 / -1", fontFamily: "var(--font-sans)", fontWeight: 300, fontSize: 12.5, lineHeight: 1.6, color: "var(--slate)" }}>{r.n}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 30, textAlign: "center" }}>
        <Button variant="solid" size="md" shape="pill" onClick={discuss}>Plan my build at this budget</Button>
        <p style={{ margin: "16px 0 0", fontFamily: "var(--font-sans)", fontWeight: 300, fontSize: 12.5, color: "var(--slate)" }}>
          Indicative only — two plots at the same price can differ enormously in size, aspect and distance to the sand. USD figures at ฿35/$; your exact plot and build get modelled before anything begins.
        </p>
      </div>
    </div>
  );
}
