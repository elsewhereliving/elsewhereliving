import { useEffect, useMemo, useState } from "react";
import type { HubUnit } from "../../lib/invest";

// Off-Plan Investment Hub — purpose → budget → ranked shortlist → email or
// WhatsApp. The shortlist is fully visible before any form. Like every enquiry
// on the site, "Email me this shortlist" composes a pre-drafted email the
// visitor sends from their own mail app (no backend), with WhatsApp offered
// as loudly in case no mail app opens.

interface Props {
  units: HubUnit[];
  countries: string[];
  email: string;
  whatsapp: string;
}

type Purpose = "invest" | "mix";
type Strategy = "yield" | "growth" | "guaranteed" | "soonest";
type Completion = "any" | "2026" | "2027" | "2028";

const MIN = 80_000;
const MAX = 300_000;
const STEP = 5_000;
// Up to 10% over budget still fits (flagged "Stretch"), matching the hub's
// own 10% allowance for exchange-rate drift (INVEST_TOLERANCE).
const STRETCH = 0.1;
const MARKETS = ["Phuket", "Koh Samui", "Bangkok", "Bali"];
const BEDS = [0, 1, 2, 3];
const STRATEGIES: { k: Strategy; l: string; n: string }[] = [
  { k: "yield", l: "Highest yield", n: "Ranked by projected or guaranteed return" },
  { k: "growth", l: "Capital growth", n: "Freehold first, then earliest completion" },
  { k: "guaranteed", l: "Guaranteed income", n: "Only projects with a guaranteed return, highest first" },
  { k: "soonest", l: "Soonest completion", n: "Earliest handover first — projects without a date go last" },
];

const money = (v: number) => "$" + Math.round(v).toLocaleString("en-US");
const compact = (v: number) => (v >= 1000 ? "$" + Math.round(v / 100) / 10 + "K" : money(v)).replace(".0K", "K");
const bedName = (n: number) => (n === 0 ? "Studio" : `${n} bed`);
const roundUp = (v: number) => Math.ceil(v / STEP) * STEP;

interface Filters {
  budget: number;
  purpose: Purpose;
  markets: string[];
  beds: number[];
  freeholdOnly: boolean;
  completion: Completion;
  strategy: Strategy;
}

const passesCompletion = (u: HubUnit, c: Completion) =>
  c === "any" ? true : u.completionYear == null ? false : c === "2028" ? u.completionYear >= 2028 : u.completionYear <= Number(c);

function passes(u: HubUnit, f: Filters, skip: Partial<Record<keyof Filters, true>> = {}) {
  if (!skip.purpose && f.purpose === "mix" && f.markets.length && !f.markets.includes(u.market)) return false;
  if (!skip.beds && f.beds.length && !f.beds.some((b) => b >= u.bedsMin && b <= u.bedsMax)) return false;
  if (!skip.freeholdOnly && f.freeholdOnly && !u.freehold) return false;
  if (!skip.completion && !passesCompletion(u, f.completion)) return false;
  // "Guaranteed income" is a filter as well as a ranking: only projects that offer one.
  if (f.strategy === "guaranteed" && !u.roi?.guaranteed) return false;
  return true;
}

const inBudget = (u: HubUnit, budget: number) => u.priceNum <= budget * (1 + STRETCH);
const perK = (u: HubUnit) => (u.sizeMin ? u.sizeMin / (u.priceNum / 1000) : 0);
// Net beats gross at the same number; a guarantee counts as net.
const roiScore = (u: HubUnit) => {
  if (!u.roi) return -1;
  const p = u.roi.projected ? u.roi.projected.rate + (u.roi.projected.kind === "net" ? 0.01 : 0) : -1;
  const g = u.roi.guaranteed ? u.roi.guaranteed.rate + 0.01 : -1;
  return Math.max(p, g);
};
const guarRate = (u: HubUnit) => u.roi?.guaranteed?.rate ?? -1;

const soon = (a: HubUnit, b: HubUnit) => (a.completionKey ?? 9999) - (b.completionKey ?? 9999);

// Value for money: better view, then more m² per $1,000, then earlier handover.
function valueCmp(a: HubUnit, b: HubUnit) {
  if (a.viewRank !== b.viewRank) return a.viewRank - b.viewRank;
  const d = perK(b) - perK(a);
  if (Math.abs(d) > 0.02) return d;
  return soon(a, b);
}

function rank(list: HubUnit[], s: Strategy) {
  const byRoi = (a: HubUnit, b: HubUnit) => {
    const ra = roiScore(a), rb = roiScore(b);
    // Close on return (within a point, or neither published) → value decides.
    if ((ra < 0 && rb < 0) || (ra >= 0 && rb >= 0 && Math.abs(ra - rb) <= 1)) return valueCmp(a, b);
    return rb - ra;
  };
  const cmp =
    s === "yield" ? byRoi
    : s === "growth" ? (a: HubUnit, b: HubUnit) =>
        Number(b.freehold) - Number(a.freehold) || soon(a, b) || valueCmp(a, b)
    : s === "soonest" ? (a: HubUnit, b: HubUnit) => soon(a, b) || byRoi(a, b)
    : (a: HubUnit, b: HubUnit) =>
        guarRate(b) - guarRate(a) || byRoi(a, b);
  return [...list].sort(cmp);
}

const VIEW_WORD = (u: HubUnit) => {
  const v = u.views[0] || "";
  return v === "Garden / Pool View" ? "garden view" : v.toLowerCase();
};

// One distinct reason per card, chosen from what actually sets it apart
// within this shortlist.
function reasons(list: HubUnit[]): Record<string, string> {
  const out: Record<string, string> = {};
  const used = new Set<string>();
  const take = (u: HubUnit | undefined, key: string, text: string) => {
    if (!u || out[u.id] || used.has(key)) return;
    out[u.id] = text;
    used.add(key);
  };
  const cheapest = [...list].sort((a, b) => a.priceNum - b.priceNum)[0];
  const roomiest = [...list].sort((a, b) => perK(b) - perK(a))[0];
  const bestView = [...list].sort((a, b) => a.viewRank - b.viewRank)[0];
  const bestRoi = [...list].filter((u) => u.roi?.projected).sort((a, b) => b.roi!.projected!.rate - a.roi!.projected!.rate)[0];
  const soonest = [...list].filter((u) => u.completionKey).sort(soon)[0];

  for (const u of list.filter((x) => x.highlight)) take(u, "h-" + u.id, u.highlight!);
  for (const u of list.filter((x) => x.roi?.guaranteed)) {
    const g = u.roi!.guaranteed!, p = u.roi!.projected;
    take(u, "g-" + u.id, g.years
      ? `${g.rate}% guaranteed for the first ${g.years} years — income you can model today.`
      : `${g.rate}% guaranteed ${g.note || ""}${p ? ` — or ${p.text.split(" · ")[0]} projected` : ""}.`.replace(/\s+\./, ".").replace(/\s+—/, " —"));
  }
  if (bestRoi) take(bestRoi, "roi", `Highest projected return in your shortlist — ${bestRoi.roi!.projected!.text.split(" · ")[0]}.`);
  if (bestView && bestView.viewRank <= 2 && bestView.kind === "villa") {
    const rival = list.find((o) => o.market !== bestView.market && o.viewRank > bestView.viewRank && Math.abs(o.priceNum - bestView.priceNum) / bestView.priceNum < 0.2);
    take(bestView, "view", rival
      ? `${bestView.beachfront ? "A beachfront address" : VIEW_WORD(bestView)[0].toUpperCase() + VIEW_WORD(bestView).slice(1)} in ${bestView.market} for about the price of a ${VIEW_WORD(rival)} in ${rival.market}.`
      : `${bestView.beachfront ? "A beachfront address" : VIEW_WORD(bestView)[0].toUpperCase() + VIEW_WORD(bestView).slice(1)} in ${bestView.market} from ${compact(bestView.priceNum)}.`);
  }
  for (const u of list.filter((x) => x.beachfront && x.kind === "condo"))
    take(u, "bf-" + u.id, `A beachfront address in ${u.market} from ${compact(u.priceNum)}.`);
  if (cheapest) take(cheapest, "cheap", cheapest.freehold ? "Freehold available, at the lowest entry in your shortlist." : `Lowest entry in your shortlist — ${compact(cheapest.priceNum)}.`);
  if (roomiest?.sizeMin) take(roomiest, "space", `Most space per dollar: a ${roomiest.bedsText === "Studio" ? "studio" : roomiest.bedsText + "-bed"} ${roomiest.kind} from ${roomiest.sizeMin} m².`);
  if (soonest) take(soonest, "soon", `Earliest handover in your shortlist — ${soonest.completion}.`);
  for (const u of list) {
    if (u.freehold) take(u, "fh-" + u.id, `Freehold available in ${u.area}, ${u.market}.`);
    take(u, "f-" + u.id, `${u.kind === "villa" ? "A villa" : "A condo"} in ${u.area}, ${u.market}.`);
  }
  return out;
}

function Chip({ on, onClick, children, role = "checkbox" }: { on: boolean; onClick: () => void; children: React.ReactNode; role?: "radio" | "checkbox" }) {
  return (
    <button type="button" role={role} aria-checked={on} className="ew-iv-chip" onClick={onClick}>
      {children}
    </button>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div className="ew-iv-step">
      <div className="ew-iv-step__head">
        <span className="ew-iv-step__n">{n}</span>
        <span className="ew-iv-step__t">{title}</span>
      </div>
      {children}
    </div>
  );
}

function UnitCard({ u, why, budget, lead, strategy }: { u: HubUnit; why: string; budget: number; lead?: boolean; strategy: Strategy }) {
  const left = budget - u.priceNum;
  const rows: [string, React.ReactNode][] = [
    ["Bedrooms", u.bedsText],
    ["Size", u.interior ? `${u.sizeMin && u.interior.includes("–") ? "from " + u.sizeMin + " m²" : u.interior}` : "—"],
    ["View", u.views.length ? u.views.join(" · ") : "—"],
    ["Est. return", u.roi
      ? <>{u.roi.projected && <span style={{ display: "block" }}>{u.roi.projected.text}</span>}{u.roi.guaranteed && <span style={{ display: "block" }}>{u.roi.projected && u.roi.guaranteed.note ? "or " : ""}{u.roi.guaranteed.text}</span>}</>
      : <span className="ew-iv-muted">On request</span>],
    ["Completion", u.completion || <span className="ew-iv-muted">To be confirmed</span>],
  ];
  if (left < 0) rows.push(["Stretch", `${Math.round((-left / budget) * 100)}% over budget`]);
  return (
    <article className={"ew-iv-card" + (lead ? " ew-iv-card--lead" : "")}>
      <a href={u.href} className="ew-iv-card__media ew-grain" aria-label={u.title}>
        <img src={u.image} alt="" loading="lazy" decoding="async" style={{ objectPosition: u.imageFocal || "center" }} />
        {lead && <span className="ew-iv-card__flag">Best match · {STRATEGIES.find((s) => s.k === strategy)!.l}</span>}
      </a>
      <div className="ew-iv-card__body">
        <div className="ew-iv-card__loc">{u.area} · {u.market} · {u.country}</div>
        <h3 className="ew-iv-card__title"><a href={u.href}>{u.title}</a></h3>
        <div className="ew-iv-card__price">
          <span title={u.priceOriginal}>From {money(u.priceNum)}</span>
          <span className="ew-iv-badges">
            {u.tenure.map((t) => (
              <a key={t} href="#ownership" className={`ew-iv-badge ew-iv-badge--${t.toLowerCase()}`} title="What can a foreigner own? See the ownership guide">{t}</a>
            ))}
          </span>
        </div>
        <p className="ew-iv-card__why">{why}</p>
        <dl className="ew-iv-card__rows">
          {rows.map(([k, v]) => (
            <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
          ))}
        </dl>
        <a href={u.href} className="ew-iv-card__more">View full listing →</a>
      </div>
    </article>
  );
}

const fieldLabel: React.CSSProperties = { display: "block", fontFamily: "var(--font-sans)", fontSize: 10.5, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--slate)", marginBottom: 8 };

export default function InvestHub({ units, countries, email, whatsapp }: Props) {
  const [purpose, setPurpose] = useState<Purpose>("invest");
  const [budget, setBudget] = useState(300_000);
  const [typed, setTyped] = useState("300,000");
  const [markets, setMarkets] = useState<string[]>([]);
  const [beds, setBeds] = useState<number[]>([]);
  const [freeholdOnly, setFreeholdOnly] = useState(false);
  const [completion, setCompletion] = useState<Completion>("any");
  const [strategy, setStrategy] = useState<Strategy>("yield");
  const [more, setMore] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [form, setForm] = useState(false);
  // "" = not sent; otherwise the email the shortlist will go to.
  const [sent, setSent] = useState("");
  const [sending, setSending] = useState(false);
  // Set when saving fails: the lead as text, so it can go by WhatsApp instead.
  const [failed, setFailed] = useState("");
  const [source, setSource] = useState("");

  // Lead source from the link's UTM (IG, TikTok, YouTube…), so replies show
  // which content brings investors.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setSource([p.get("utm_source"), p.get("utm_campaign")].filter(Boolean).join(" / "));
  }, []);

  const setB = (v: number) => {
    const c = Math.min(MAX, Math.max(MIN, v));
    setBudget(c);
    setTyped(c.toLocaleString("en-US"));
    setShowAll(false);
  };
  const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const f: Filters = { budget, purpose, markets, beds, freeholdOnly, completion, strategy };
  const ranked = useMemo(() => rank(units.filter((u) => passes(u, f) && inBudget(u, budget)), strategy), [units, budget, purpose, markets, beds, freeholdOnly, completion, strategy]);

  // Zero matches → the nearest three and the one change that brings them in.
  const fallback = useMemo(() => {
    if (ranked.length) return null;
    const over = units.filter((u) => passes(u, f)).sort((a, b) => a.priceNum - b.priceNum);
    if (over.length) {
      return { hint: `Nothing matches at ${money(budget)} yet — raise your budget to ${money(roundUp(over[0].priceNum))} to bring these in.`, list: over.slice(0, 3), action: () => setB(roundUp(over[0].priceNum)), cta: `Raise to ${compact(roundUp(over[0].priceNum))}` };
    }
    const relax: { k: keyof Filters; hint: string; cta: string; run: () => void }[] = [];
    if (purpose === "mix" && markets.length) {
      const add = MARKETS.find((m) => !markets.includes(m) && units.some((u) => u.market === m && passes(u, { ...f, markets: [m] }) && inBudget(u, budget)));
      if (add) relax.push({ k: "purpose", hint: `Add ${add} to see what fits.`, cta: `Add ${add}`, run: () => setMarkets([...markets, add]) });
    }
    relax.push(
      { k: "completion", hint: "Widen the completion date to see what fits.", cta: "Any completion", run: () => setCompletion("any") },
      { k: "freeholdOnly", hint: "Allow leasehold — most villas for foreign buyers are leasehold.", cta: "Allow leasehold", run: () => setFreeholdOnly(false) },
      { k: "beds", hint: "Open up the bedroom count to see what fits.", cta: "Any bedrooms", run: () => setBeds([]) },
    );
    for (const r of relax) {
      const list = rank(units.filter((u) => passes(u, f, { [r.k]: true }) && inBudget(u, budget)), strategy);
      if (list.length) return { hint: r.hint, list: list.slice(0, 3), action: r.run, cta: r.cta };
    }
    return null;
  }, [ranked, units, budget, purpose, markets, beds, freeholdOnly, completion, strategy]);

  const shown = ranked.length ? ranked.slice(0, showAll ? ranked.length : 3) : fallback?.list ?? [];
  const why = useMemo(() => reasons(shown), [shown]);
  const stretch = useMemo(
    () => units.filter((u) => passes(u, f) && !inBudget(u, budget)).sort((a, b) => a.priceNum - b.priceNum).slice(0, 2),
    [units, budget, purpose, markets, beds, freeholdOnly, completion, strategy],
  );

  const waDigits = whatsapp.replace(/[^0-9]/g, "");
  const purposeText = purpose === "invest" ? "pure investment" : `mix use${markets.length ? ` — ${markets.join(", ")}` : ""}`;
  // One property per numbered line, so the list reads cleanly in WhatsApp.
  const waText =
    `Hi Elsewhere, I'm looking to invest about US${money(budget)} (${purposeText}).` +
    (shown.length ? `\n\nI liked:\n${shown.map((u, i) => `${i + 1}. ${u.title} — ${u.area}, ${u.market} · from ${money(u.priceNum)}`).join("\n")}` : "") +
    "\n\nCan we talk?" + (source ? `\n\n(found you via ${source})` : "");

  function summary() {
    const stratLabel = STRATEGIES.find((s) => s.k === strategy)!.l;
    return [
      `Budget: ${money(budget)}`,
      `Purpose: ${purposeText}`,
      `Strategy: ${stratLabel}`,
      `Bedrooms: ${beds.length ? beds.map(bedName).join(", ") : "Any"}`,
      `Ownership: ${freeholdOnly ? "Freehold only" : "Leasehold OK"}`,
      `Completion: ${completion === "any" ? "Any" : completion === "2028" ? "2028+" : "By end " + completion}`,
      "",
      "My shortlist:",
      ...shown.map((u, i) => `${i + 1}. ${u.title} — ${u.area}, ${u.market} — from ${money(u.priceNum)}\n   ${location.origin}${u.href}`),
    ];
  }

  // Saves the lead to the investor-leads Google Sheet (functions/api/
  // invest-lead.ts) with every filter answer and the shortlist shown. The
  // visitor stays on the page; if saving fails, the same details can go by
  // WhatsApp so the lead is never lost.
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const g = (k: string) => (fd.get(k) || "").toString().trim();
    const lead = {
      name: g("name"),
      email: g("email"),
      whatsapp: g("whatsapp"),
      country: g("country"),
      consent: fd.get("consent") === "on",
      company: g("company"),
      budget,
      purpose: purposeText,
      strategy: STRATEGIES.find((s) => s.k === strategy)!.l,
      bedrooms: beds.length ? beds.map(bedName).join(", ") : "Any",
      ownership: freeholdOnly ? "Freehold only" : "Leasehold OK",
      completion: completion === "any" ? "Any" : completion === "2028" ? "2028+" : "By end " + completion,
      shortlist: shown.map((u, i) => `${i + 1}. ${u.title} — ${u.area}, ${u.market} · from ${money(u.priceNum)} · ${location.origin}${u.href}`),
      source,
      page: location.pathname + location.search,
    };
    setSending(true);
    setFailed("");
    try {
      const res = await fetch("/api/invest-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || !out.ok) throw new Error(out.error || "Request failed");
      setSent(lead.email);
    } catch {
      setFailed(
        [
          "Hi Elsewhere, please send me this shortlist with prices, payment plans and expected returns.",
          "",
          ...summary(),
          "",
          `Name: ${lead.name}`,
          `Country of residence: ${lead.country}`,
          `Email: ${lead.email}`,
          lead.whatsapp ? `WhatsApp: ${lead.whatsapp}` : null,
        ].filter((l) => l !== null).join("\n"),
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="ew-iv">
      <div className="ew-iv-panel">
        <Step n="01" title="Why are you buying?">
          <div className="ew-iv-chips" role="radiogroup" aria-label="Purpose">
            <Chip role="radio" on={purpose === "invest"} onClick={() => setPurpose("invest")}>Pure investment</Chip>
            <Chip role="radio" on={purpose === "mix"} onClick={() => setPurpose("mix")}>Investment + my own stays</Chip>
          </div>
          <p className="ew-iv-note">
            {purpose === "invest"
              ? "We compare every market for you — Phuket, Koh Samui, Bangkok and Bali — so the best return wins, wherever it is."
              : "Pick where you'd like to stay. We rank what fits inside those markets."}
          </p>
          {purpose === "mix" && (
            <div className="ew-iv-chips" style={{ marginTop: 14 }} aria-label="Markets">
              {MARKETS.map((m) => (
                <Chip key={m} on={markets.includes(m)} onClick={() => setMarkets(toggle(markets, m))}>{m}</Chip>
              ))}
            </div>
          )}
        </Step>

        <Step n="02" title="Your budget">
          <div className="ew-iv-budget">
            <label className="ew-iv-budget__val">
              <span aria-hidden="true">US$</span>
              <input
                inputMode="numeric"
                aria-label="Budget in US dollars"
                value={typed}
                onChange={(e) => setTyped(e.target.value.replace(/[^0-9,]/g, ""))}
                onBlur={() => setB(Number(typed.replace(/,/g, "")) || budget)}
                onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
              />
            </label>
            <input type="range" className="ew-ch-range" aria-label="Budget" min={MIN} max={MAX} step={STEP} value={budget} onChange={(e) => setB(Number(e.target.value))} />
            <div className="ew-iv-scale"><span>$80K</span><span>$300K</span></div>
          </div>
        </Step>

        <Step n="03" title="Your strategy">
          <div className="ew-iv-chips" role="radiogroup" aria-label="Strategy">
            {STRATEGIES.map((s) => (
              <Chip key={s.k} role="radio" on={strategy === s.k} onClick={() => setStrategy(s.k)}>{s.l}</Chip>
            ))}
          </div>
          <p className="ew-iv-note">{STRATEGIES.find((s) => s.k === strategy)!.n}.</p>
          <button type="button" className="ew-iv-link" aria-expanded={more} onClick={() => setMore(!more)}>
            {more ? "Fewer filters" : "More filters — bedrooms, ownership, completion"}
          </button>
          {more && (
            <div className="ew-iv-more">
              <div>
                <span style={fieldLabel}>Bedrooms</span>
                <div className="ew-iv-chips">
                  {BEDS.map((b) => <Chip key={b} on={beds.includes(b)} onClick={() => setBeds(toggle(beds, b))}>{b === 0 ? "Studio" : b}</Chip>)}
                </div>
              </div>
              <div>
                <span style={fieldLabel}>Ownership</span>
                <div className="ew-iv-chips" role="radiogroup">
                  <Chip role="radio" on={!freeholdOnly} onClick={() => setFreeholdOnly(false)}>Leasehold OK</Chip>
                  <Chip role="radio" on={freeholdOnly} onClick={() => setFreeholdOnly(true)}>Freehold only</Chip>
                </div>
              </div>
              <div>
                <span style={fieldLabel}>Completion</span>
                <div className="ew-iv-chips" role="radiogroup">
                  {([["any", "Any"], ["2026", "By end 2026"], ["2027", "By end 2027"], ["2028", "2028+"]] as [Completion, string][]).map(([k, l]) => (
                    <Chip key={k} role="radio" on={completion === k} onClick={() => setCompletion(k)}>{l}</Chip>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Step>
      </div>

      <div className="ew-iv-results" aria-live="polite">
        <div className="ew-iv-results__head">
          <h3>
            {ranked.length
              ? `${ranked.length} ${ranked.length === 1 ? "project fits" : "projects fit"} ${money(budget)}`
              : "Nothing fits these filters yet"}
          </h3>
          {ranked.length > 0 && <span>{purpose === "invest" ? "Across every market" : markets.length ? markets.join(" · ") : "Any market"} · ranked for {STRATEGIES.find((s) => s.k === strategy)!.l.toLowerCase()}</span>}
        </div>

        {fallback && (
          <div className="ew-iv-relax">
            <p>{fallback.hint}</p>
            <button type="button" className="ew-iv-chip" aria-checked="false" onClick={fallback.action}>{fallback.cta}</button>
          </div>
        )}

        <div className="ew-iv-grid">
          {shown.map((u, i) => (
            <UnitCard key={u.id} u={u} why={why[u.id]} budget={budget} lead={i === 0 && ranked.length > 0} strategy={strategy} />
          ))}
        </div>

        {ranked.length > 3 && (
          <button type="button" className="ew-iv-link" style={{ marginTop: 22 }} onClick={() => setShowAll(!showAll)}>
            {showAll ? "Show top 3" : `See all ${ranked.length} projects`}
          </button>
        )}

        {stretch.length > 0 && ranked.length > 0 && (
          <div className="ew-iv-stretch">
            <span style={fieldLabel}>Stretch your budget</span>
            <ul>
              {stretch.map((u) => (
                <li key={u.id}>
                  <a href={u.href}>{u.title}</a>
                  <span> — {u.area}, {u.market}, {u.country} · from {money(u.priceNum)}{u.roi?.guaranteed ? ` · ${u.roi.guaranteed.rate}% guaranteed` : u.roi?.projected ? ` · ${u.roi.projected.text.split(" · ")[0]} projected` : ""}</span>
                  <button type="button" className="ew-iv-link" onClick={() => setB(roundUp(u.priceNum))}>Use {compact(roundUp(u.priceNum))}</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {shown.length > 0 && (
          <div className="ew-iv-cta">
            {!form && !sent && (
              <>
                <button type="button" className="ew-btn ew-cta-navy ew-iv-btn" onClick={() => setForm(true)}>Email me this shortlist</button>
                <a className="ew-btn ew-iv-btn ew-iv-btn--ghost" href={`https://wa.me/${waDigits}?text=${encodeURIComponent(waText)}`} target="_blank" rel="noopener noreferrer">WhatsApp us now</a>
              </>
            )}
            {form && !sent && (
              <form className="ew-iv-form" onSubmit={onSubmit}>
                <div className="ew-iv-form__grid">
                  <label><span style={fieldLabel}>Full name</span><input name="name" autoComplete="name" placeholder="Your name" required /></label>
                  <label>
                    <span style={fieldLabel}>Country of residence</span>
                    <select name="country" required defaultValue="">
                      <option value="" disabled>Choose…</option>
                      {countries.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </label>
                  <label><span style={fieldLabel}>Email</span><input name="email" type="email" autoComplete="email" placeholder="you@email.com" required /></label>
                  <label><span style={fieldLabel}>WhatsApp (optional)</span><input name="whatsapp" type="tel" autoComplete="tel" placeholder="+33 6 12 34 56 78" /></label>
                </div>
                {/* Honeypot: hidden from people, filled in by bots. */}
                <label aria-hidden="true" style={{ position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" }}>Company<input name="company" type="text" tabIndex={-1} autoComplete="off" /></label>
                <label className="ew-iv-consent">
                  <input type="checkbox" name="consent" required />
                  <span>I agree to Elsewhere Living contacting me about these properties. See our <a href="/privacy/">privacy policy</a>.</span>
                </label>
                {failed && (
                  <p role="alert" className="ew-iv-error">
                    Sorry — that didn't go through.{" "}
                    <a href={`https://wa.me/${waDigits}?text=${encodeURIComponent(failed)}`} target="_blank" rel="noopener noreferrer">Send it on WhatsApp instead</a>, email <a href={`mailto:${email}`}>{email}</a>, or try again in a moment.
                  </p>
                )}
                <div className="ew-iv-cta" style={{ marginTop: 6 }}>
                  <button type="submit" className="ew-btn ew-cta-navy ew-iv-btn" disabled={sending}>{sending ? "Sending…" : "Email me this shortlist"}</button>
                  <button type="button" className="ew-iv-link" onClick={() => setForm(false)}>Cancel</button>
                </div>
              </form>
            )}
            {sent && (
              <div className="ew-iv-sent" role="status">
                <p className="ew-iv-sent__t">Thank you — your shortlist is with us.</p>
                <p>We'll email it to {sent} with prices, payment plans and floor plans for each project. Want to talk sooner?</p>
                <div className="ew-iv-cta">
                  <a className="ew-btn ew-iv-btn ew-iv-btn--ghost" href={`https://wa.me/${waDigits}?text=${encodeURIComponent(waText)}`} target="_blank" rel="noopener noreferrer">WhatsApp us now</a>
                </div>
              </div>
            )}
          </div>
        )}

        <p className="ew-iv-fine">
          Prices are each project's lowest current unit, converted to US$ at today's rate. Returns are the developer's own projections or guarantees, not ours — we'll walk you through the numbers behind every one. Transfer fees, taxes and furniture come on top.
        </p>
      </div>
    </div>
  );
}
