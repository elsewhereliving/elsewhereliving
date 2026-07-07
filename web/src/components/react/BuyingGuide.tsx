import { useEffect, useState, type ReactNode } from "react";
import Button from "./Button";

/* Buying Guide — ownership & legal by country. A phrase wrapped in
   ==double equals== inside any body string gets the butter highlighter. */
function ewHL(text: string): ReactNode {
  const parts = String(text).split("==");
  if (parts.length === 1) return text;
  return parts.map((p, i) => (i % 2 ? <mark key={i} className="ew-hl">{p}</mark> : p));
}

function Label({ children }: { children: ReactNode }) {
  return <span className="ew-label" style={{ letterSpacing: "0.04em" }}>[ {children} ]</span>;
}

type Own = { tag: string; t: string; b: string };
type Step = { t: string; b: string };
type Fee = { t: string; r: string; n: string };
type Hold = { t: string; b: string };
type Guide = { id: string; name: string; places: string; blurb: string; own: Own[]; process: Step[]; buy: Fee[]; sell: Fee[]; financing: string; holding: Hold[]; know: Step[] };

const LEGAL_GUIDES: Guide[] = [
  {
    id: "thailand",
    name: "Thailand",
    places: "Koh Samui · Phuket · Bangkok",
    blurb: "Thailand welcomes foreign buyers — but land and buildings follow different rules. Most of our clients own their condo outright, or hold a villa through a long registered lease.",
    own: [
      { tag: "Freehold", t: "Condominiums — yours outright", b: "Foreigners can own a condominium in their own name, with full freehold title, as long as foreign ownership in the building stays ==within the 49% quota==. Purchase funds must be transferred into Thailand in foreign currency and documented with a Foreign Exchange Transaction (FET) form — your bank issues it, and it's what lets you register in the foreign quota and repatriate the money when you sell. We check the remaining quota before you view." },
      { tag: "Leasehold", t: "Villas & land — a 30-year registered lease", b: "Land cannot be owned freehold by foreigners, so villas are typically structured as freehold ownership of the building itself plus a 30-year lease on the land, registered at the Land Office. ==Thirty years is the legal maximum per term; renewal options (30+30, sometimes +30 again) are contractual promises from the lessor, not registered rights== — so who your lessor is, and how the renewal is drafted and priced, matters enormously. We negotiate this line by line." },
      { tag: "Company route", t: "Thai company structures", b: "Holding land through a Thai limited company is widely proposed in the market. ==Using nominee Thai shareholders purely to hold property is illegal==; the structure is only safe when the company is a genuine, active business with real Thai partners. We advise on it case by case — usually for commercial or rental operations — and never as a default." },
    ],
    process: [
      { t: "Reserve", b: "A short reservation agreement and a modest deposit take the property off the market while diligence runs. Fully refundable if the title doesn't check out." },
      { t: "Due diligence", b: "An independent lawyer verifies the title deed — ==Chanote (Nor Sor 4 Jor) is the gold standard==; lesser titles need real caution — plus encumbrances, access, building permits, and for off-plan, the developer's licences, EIA approval and track record. Typically one to two weeks." },
      { t: "Sale & purchase agreement", b: "Contracts signed and a deposit of 10–30% paid. Off-plan purchases follow a staged payment schedule tied to construction milestones — we push for payments to trail progress, never lead it." },
      { t: "Transfer the funds", b: "You remit the purchase price from abroad in foreign currency. Your Thai bank documents each transfer with an ==FET form — keep every one==; they are your proof for quota registration and for taking the money out again later." },
      { t: "Transfer day", b: "Buyer and seller (or their lawyers with power of attorney) meet at the Land Office. The balance is paid, taxes and fees are settled at the counter, and the freehold title or lease is registered the same day. You leave with the deed." },
      { t: "After the keys", b: "Utilities transferred, condo juristic person notified, house registration book (Tabien Baan) updated, and — if you're renting the home out — management and tax registration set up. We stay involved for all of it." },
    ],
    buy: [
      { t: "Transfer fee", r: "2%", n: "Of the Land Office appraised value — customarily split 50/50 between buyer and seller, but it's negotiable" },
      { t: "Lease registration fee", r: "1.1%", n: "Of the total lease value over the term — paid instead of the transfer fee on leasehold deals" },
      { t: "Stamp duty", r: "0.5%", n: "Waived whenever Specific Business Tax applies instead" },
      { t: "Specific Business Tax", r: "3.3%", n: "Applies if the seller has owned for less than 5 years — by custom a seller cost" },
      { t: "Withholding tax", r: "1% or progressive", n: "1% of appraised value for company sellers; a sliding income-tax scale for individuals — a seller cost, but verify it's priced in" },
      { t: "Legal fees", r: "~1%", n: "Independent lawyer for due diligence, contracts and Land Office representation — never optional in our deals" },
    ],
    sell: [
      { t: "Withholding tax", r: "1% or progressive", n: "Calculated on the appraised value and years of ownership — your effective rate falls the longer you've held" },
      { t: "Business tax or stamp", r: "3.3% / 0.5%", n: "Specific Business Tax if you sell within 5 years; stamp duty after that" },
      { t: "Transfer fee share", r: "1%", n: "Your customary half of the 2% transfer fee" },
      { t: "Agent commission", r: "5%", n: "Standard for resale in the islands; less in Bangkok" },
      { t: "Repatriation", r: "0", n: "With your FET forms on file, sale proceeds can be converted and sent home freely — no exit tax" },
    ],
    financing: "Thai banks rarely lend to non-resident foreigners, so ==most purchases are cash==. Real options that do exist: a handful of international banks lend against Bangkok and resort condos from Singapore (typically 50–60% LTV, to qualifying nationalities); developers offer staged or post-handover payment plans on off-plan projects; and some buyers borrow against assets at home, where rates are usually better. We'll tell you honestly what's realistic for your passport and profile before you start viewing.",
    holding: [
      { t: "Land & building tax", b: "Modest — roughly 0.02–0.3% of appraised value per year depending on use, and often near zero for an owner-occupied home. Billed annually by the local municipality." },
      { t: "Common area fees", b: "Condos and managed estates charge a monthly fee per square metre (typically ฿35–120/m² in our markets) covering security, pools and grounds. A sinking fund contribution is paid once at purchase on new buildings." },
      { t: "Rental income", b: "Taxable in Thailand — progressive rates up to 35% for residents after generous deductions, or ==15% withholding for non-residents==. Double-tax treaties usually prevent paying twice. A good accountant routinely brings the effective rate well down; we'll introduce you." },
    ],
    know: [
      { t: "Chanote or walk away", b: "==Chanote (Nor Sor 4 Jor) is the only GPS-surveyed, full title deed.== Nor Sor 3 Gor can be acceptable; anything less we simply don't list." },
      { t: "Renewals are a promise, not a right", b: "A 30+30+30 lease is only as good as the counterparty and the drafting. We weight the lessor's identity — individual, estate or developer — heavily in our vetting, and structure security (mortgage registration over the land, building ownership in your name) around it." },
      { t: "Check the quota before you fall in love", b: "In popular Samui and Phuket condos the 49% foreign quota can be full — Thai-quota units can only be bought leasehold or via company. We confirm quota in writing before a viewing trip." },
      { t: "Succession", b: "A foreign heir can inherit a foreign-quota condo (they must qualify under the same rules) — but leases end at death unless succession clauses are drafted in. We include them as standard, and recommend a Thai will for any Thai assets." },
    ],
  },
  {
    id: "indonesia",
    name: "Indonesia",
    places: "Bali · Lombok",
    blurb: "Freehold land in Indonesia is reserved for Indonesian citizens — but well-drafted leasehold is how nearly every foreign-owned villa in Bali works, and it's a mature, well-understood market.",
    own: [
      { tag: "Leasehold", t: "The standard for foreign buyers", b: "A lease (hak sewa) of typically 25–30 years, notarised and attached to the land certificate, with extension terms negotiated and priced up front — ==often reaching 50–80 years in total==. The two clauses that decide everything: how the extension price is fixed (a formula agreed now beats “market rate” at renewal), and whether you can sublet and sell the remaining term freely. This is where we and our legal partners earn our keep." },
      { tag: "Right to use", t: "Hak pakai — for residents", b: "Foreigners holding an Indonesian residence permit (KITAS/KITAP) can hold a registered right-to-use title over one home in their own name — ==an initial 30 years, extendable to 80== in stages, recorded on the certificate itself. The strongest personal title available to a foreigner, if you plan to live in Indonesia." },
      { tag: "Company route", t: "PT PMA — for rental businesses", b: "A foreign-owned Indonesian company can hold building rights (HGB, 30 years extendable to 80) and operate villas commercially with full licences. It carries genuine costs — minimum investment plans, monthly tax reporting, corporate compliance — so it's ==right for a real rental portfolio, not a single holiday home==." },
      { tag: "Never", t: "The nominee trap", b: "==Putting freehold in an Indonesian citizen's name “on your behalf” is void under the Agrarian Law== — courts consistently side with the nominee, and buyers have lost everything. However common it once was, we will not structure a deal this way. Ever." },
    ],
    process: [
      { t: "Offer & booking", b: "A letter of intent and a small booking fee — held by the notary, refundable if diligence fails — freeze the price and take the villa off the market." },
      { t: "Due diligence", b: "The notary and an independent lawyer verify the land certificate (SHM or HGB), that the seller is the registered owner, that zoning (RTRW/RDTR) actually permits residential or tourism use — ==never buy in a green zone== — and that the building permit (PBG, formerly IMB) and habitation certificate (SLF) match what's built. Two to three weeks, and non-negotiable." },
      { t: "Drafting", b: "The lease or sale deed is drafted bilingually by a licensed notary (PPAT): term, extension formula, sublet and transfer rights, what happens if the land is sold, force majeure, dispute resolution. We negotiate alongside your lawyer." },
      { t: "Signing & payment", b: "Both parties sign before the notary; funds move through the notary's escrow or directly against signing. Leases are notarised; freehold-style transfers are executed as an AJB deed and taxes are paid at the same time." },
      { t: "Registration & handover", b: "The notary reports the lease or registers the transfer with the land office, and you take handover against a snagging checklist — furniture inventory, utilities, staff contracts if any." },
      { t: "Renting it out", b: "Short-term rental legally requires a pondok wisata (or hotel) licence attached to the property and a local tax number. We only list compliant villas, and we'll set the licence transfer up as part of closing." },
    ],
    buy: [
      { t: "Buyer transfer tax (BPHTB)", r: "5%", n: "On the value above a small local threshold — applies to title transfers (AJB), not to leases" },
      { t: "Seller income tax (PPh)", r: "2.5%", n: "On the sale value — a seller cost on title transfers; confirm it's settled at the notary" },
      { t: "Lease tax", r: "10%", n: "Income tax on the lease value, owed by the lessor — reputable deals price it in transparently rather than springing it on you" },
      { t: "VAT on new builds", r: "11%", n: "When buying a new unit directly from a developer" },
      { t: "Notary & legal", r: "~1–2.5%", n: "Notary (PPAT) fee — customarily shared — plus independent legal due diligence" },
    ],
    sell: [
      { t: "Leasehold resale", r: "—", n: "You sell the remaining term; value tracks years left plus the strength of the extension clause. Lessor consent requirements are set by your contract — another reason we negotiate free transferability going in" },
      { t: "Seller income tax (PPh)", r: "2.5%", n: "On title transfers; lease assignments are taxed as income on the gain" },
      { t: "Agent commission", r: "5%", n: "The Bali standard" },
    ],
    financing: "Local mortgages are ==effectively unavailable to non-residents==, and Indonesian rates would make them unattractive anyway. Purchases are cash, staged developer payments on off-plan, or structured through the lease itself — a shorter initial term with pre-agreed extension pricing lowers the entry cost by 20–30%. Some clients finance against home-country assets. We'll model all of it in a simple side-by-side before you commit.",
    holding: [
      { t: "Land & building tax (PBB)", b: "A small annual tax — typically around 0.1–0.3% of the government-assessed value, which sits well below market value. On leasehold it's usually the lessor's obligation; check your contract." },
      { t: "Rental income", b: "Taxed in Indonesia: a ==10% final tax on gross rent== for tax residents, 20% withholding for non-residents (treaties may reduce it). Add roughly 10% local hotel tax collected from guests on licensed rentals. Professional management typically runs 15–20% of revenue." },
      { t: "Community & banjar", b: "Villas contribute to the local banjar (village council) — modest monthly amounts for security and ceremonies. It's part of how Bali works, and worth doing graciously." },
    ],
    know: [
      { t: "Zoning decides everything", b: "Bali's spatial plan (RTRW/RDTR) is enforced increasingly strictly. Tourism zone = you can rent legally; residential zone = living only; ==green zone = you cannot build==, rebuild, or often even renew. We map every listing's zoning before it reaches you." },
      { t: "The extension formula is the deal", b: "Two villas at the same price are not the same purchase if one renews at a fixed formula and the other at “then-market rate.” ==Insist on a formula== — we do." },
      { t: "Check what's actually built", b: "Buildings that exceed their permit (extra floors, extra bedrooms) can't get the habitation certificate that a legal rental needs. The survey has to match the paperwork." },
      { t: "Land is measured in are", b: "1 are = 100 m². Prices are quoted per are per year for leasehold land — we'll translate everything into totals and per-m² so nothing hides in the units." },
    ],
  },
  {
    id: "uae",
    name: "UAE",
    places: "Dubai · Abu Dhabi",
    blurb: "The most straightforward of our three markets: foreigners buy full freehold title in designated zones, the registry is digital and fast, and there is no annual property tax.",
    own: [
      { tag: "Freehold", t: "Full title, in your name", b: "In Dubai's designated freehold areas — which cover most of the modern city, from Palm Jumeirah to Downtown to Dubai Hills — and Abu Dhabi's investment zones (Saadiyat, Yas, Al Reem and others), foreigners ==own property outright with a government-issued title deed== from the land department. ==No residency required, 100% foreign ownership==, and title can be held jointly or through approved holding structures for estate planning." },
      { tag: "Leasehold", t: "Long leases in select districts", b: "Some older districts offer leasehold of 10–99 years instead of freehold. These are the exception in the areas where we work — we'll flag it clearly whenever a listing is leasehold, along with exactly what the term means for resale value." },
      { tag: "Off-plan", t: "Buying from the developer", b: "Off-plan purchases are registered with the land department from day one (Oqood in Dubai) and your payments go into a ==RERA-regulated escrow account== tied to construction progress — the developer can't touch the money until milestones are certified. Developer track record still matters; we maintain a short list of those we trust." },
    ],
    process: [
      { t: "Offer & agreement", b: "On a resale: agree terms and sign the MOU (Form F in Dubai) with a 10% deposit cheque held by the broker. On off-plan: reserve with the developer and sign the SPA." },
      { t: "Financing, if any", b: "Mortgage pre-approval takes days. The bank values the property and issues a final offer letter — build the mortgage contingency into the MOU so your deposit is protected." },
      { t: "Developer NOC", b: "The seller obtains a no-objection certificate from the building's developer confirming service charges are fully paid. A few days and a small fee." },
      { t: "Transfer day", b: "All parties meet at a registration trustee office. Payment passes as a manager's cheque, the 4% DLD fee is paid, and the new digital title deed is issued in your name — usually within the hour. The whole purchase, offer to deed, ==commonly takes 2–6 weeks==." },
      { t: "Handover & setup", b: "DEWA utilities registered, community access sorted, and — if you're letting it — the tenancy registered in Ejari and management appointed. We handle the checklist." },
    ],
    buy: [
      { t: "DLD transfer fee", r: "4%", n: "Dubai Land Department, paid at transfer — customarily by the buyer. Abu Dhabi charges 2%" },
      { t: "Registration trustee", r: "AED 4,000", n: "Approximate fixed fee at the trustee office (AED 2,000 below AED 500k)" },
      { t: "Agent commission", r: "2%", n: "No buyer fee on off-plan bought direct with the developer through an agent" },
      { t: "Mortgage fees", r: "0.25% + ~1%", n: "0.25% of the loan to register the mortgage, plus typical bank arrangement fees and valuation — only when financing" },
      { t: "Oqood (off-plan)", r: "4%", n: "The same DLD fee, paid on registration of an off-plan sale" },
    ],
    sell: [
      { t: "Capital gains tax", r: "0", n: "None — no exit tax, no personal income tax on the gain" },
      { t: "Agent commission", r: "2%", n: "The standard seller-side fee" },
      { t: "Developer NOC", r: "AED 500–5,000", n: "Charged by the developer to confirm your service charges are clear" },
      { t: "Early mortgage settlement", r: "1%", n: "Capped at AED 10,000, if you clear a mortgage at sale" },
    ],
    financing: "Mortgages are genuinely available here, including to non-residents — typically ==50–75% loan-to-value for non-residents== and up to 80% for UAE residents, from local and international banks, on terms up to 25 years. Rates track global markets. Pre-approval takes days, not months, and interest-only and offset products exist for investors. For off-plan, developer post-handover payment plans (2–5 years) are common and often interest-free — sometimes the better deal than a bank.",
    holding: [
      { t: "Annual property tax", b: "None. There is also ==no capital gains tax and no personal income tax on rental income==. (Only corporate structures above the small-business threshold touch the 9% corporate tax.)" },
      { t: "Service charges", b: "The number that actually moves your yield: buildings and communities charge an annual fee per square foot — anywhere from AED 3 to AED 30+ depending on amenities. We disclose the exact figure and history on every listing." },
      { t: "Housing fee", b: "Occupants in Dubai pay a municipality fee of 5% of annual rental value through the DEWA bill — relevant if you live in the home, or to your tenant if they do." },
    ],
    know: [
      { t: "The Golden Visa", b: "Property worth AED 2M+ (about USD 545k) qualifies you for a ==10-year renewable residence visa==, including your family — mortgaged and off-plan property can qualify under conditions. For many of our buyers this is half the reason to buy; we run the application alongside the purchase." },
      { t: "Escrow is real protection", b: "Off-plan money sits in a RERA-controlled escrow released against certified construction — a regime built after 2008 precisely so buyers don't fund a developer's other projects. Still: developer track record first, render second." },
      { t: "Write a will", b: "For non-Muslim owners, ==a DIFC or Abu Dhabi will keeps succession under your home country's rules== rather than local defaults. An hour of paperwork; we'll point you to the registry." },
      { t: "Yields are transparent", b: "Ejari registers every tenancy, so real rental comps are public. When we quote a yield, it's from registered contracts — not a brochure." },
    ],
  },
];

function LegalSectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 style={{ margin: 0, fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: "clamp(1.6rem, 2.8vw, 2.2rem)", lineHeight: 1.1, letterSpacing: "-0.01em", color: "var(--navy)" }}>{children}</h3>
  );
}

function LegalFeeTable({ rows }: { rows: Fee[] }) {
  return (
    <div style={{ marginTop: 32, borderTop: "1px solid var(--border-on-light)" }}>
      {rows.map((row) => (
        <div key={row.t} data-grid="fee" style={{
          display: "grid", gridTemplateColumns: "minmax(180px, 1.1fr) minmax(110px, 0.5fr) 2fr",
          gap: "6px 32px", alignItems: "baseline", padding: "18px 0",
          borderBottom: "1px solid var(--border-on-light)",
        }}>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--charcoal)" }}>{row.t}</span>
          <span style={{ fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: "clamp(1.15rem, 1.8vw, 1.4rem)", color: "var(--navy)", whiteSpace: "nowrap" }}>{row.r}</span>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 300, fontSize: 14, lineHeight: 1.6, color: "var(--text-body)" }}>{row.n}</span>
        </div>
      ))}
    </div>
  );
}

export default function BuyingGuide() {
  const initial = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("c") : null;
  const [country, setCountry] = useState(LEGAL_GUIDES.some((g) => g.id === initial) ? (initial as string) : "thailand");

  useEffect(() => {
    const url = new URL(window.location.href);
    if (country === "thailand") url.searchParams.delete("c");
    else url.searchParams.set("c", country);
    window.history.replaceState({}, "", url);
  }, [country]);

  const g = LEGAL_GUIDES.find((x) => x.id === country)!;

  return (
    <div className="ew-legal">
      <section style={{ background: "var(--paper)", padding: "0 clamp(20px, 4vw, 56px) clamp(72px, 10vw, 120px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* Country switcher */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 40px", padding: "clamp(28px, 4vw, 44px) 0", borderBottom: "1px solid var(--border-on-light)" }}>
            {LEGAL_GUIDES.map((c) => {
              const active = c.id === country;
              return (
                <button key={c.id} onClick={() => setCountry(c.id)} style={{
                  cursor: "pointer", background: "transparent", border: "none", padding: "6px 0",
                  fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: "clamp(1.5rem, 2.8vw, 2.1rem)",
                  letterSpacing: "-0.01em", color: "var(--navy)", whiteSpace: "nowrap",
                  opacity: active ? 1 : 0.38, transition: "opacity var(--dur-base) var(--ease-out)",
                  borderBottom: "1px solid " + (active ? "var(--navy)" : "transparent"),
                }}>
                  ( {c.name} )
                </button>
              );
            })}
          </div>

          <div key={g.id} className="reveal is-in">
            {/* Intro */}
            <div style={{ padding: "clamp(36px, 5vw, 56px) 0 0" }}>
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 11.5, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--slate)", marginBottom: 14 }}>{g.places}</div>
              <p style={{ margin: 0, maxWidth: 680, fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: "clamp(1.25rem, 2.2vw, 1.6rem)", lineHeight: 1.45, color: "var(--charcoal)" }}>{g.blurb}</p>
            </div>

            {/* How you own */}
            <div style={{ marginTop: "clamp(48px, 6vw, 72px)" }}>
              <div style={{ color: "var(--slate)", marginBottom: 16 }}><Label>How you own</Label></div>
              <LegalSectionTitle>Freehold, leasehold — and what they mean here.</LegalSectionTitle>
              <div data-grid={g.own.length === 4 ? "2" : "3"} style={{ display: "grid", gridTemplateColumns: "repeat(" + (g.own.length === 4 ? 2 : Math.min(g.own.length, 3)) + ", 1fr)", gap: "clamp(28px, 4vw, 48px)", marginTop: 36 }}>
                {g.own.map((o) => (
                  <div key={o.t} style={{ borderTop: "1px solid var(--border-on-light)", paddingTop: 22 }}>
                    <div style={{ fontFamily: "var(--font-sans)", fontSize: 10.5, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--navy-60)", marginBottom: 12 }}>{o.tag}</div>
                    <h4 style={{ margin: 0, fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: "clamp(1.25rem, 2vw, 1.5rem)", lineHeight: 1.2, letterSpacing: "-0.01em", color: "var(--navy)" }}>{o.t}</h4>
                    <p style={{ margin: "12px 0 0", fontFamily: "var(--font-sans)", fontWeight: 300, fontSize: 14.5, lineHeight: 1.72, color: "var(--text-body)" }}>{ewHL(o.b)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* The buying process */}
            <div style={{ marginTop: "clamp(48px, 6vw, 72px)" }}>
              <div style={{ color: "var(--slate)", marginBottom: 16 }}><Label>The buying process</Label></div>
              <LegalSectionTitle>From offer to keys, step by step.</LegalSectionTitle>
              <div style={{ marginTop: 32, borderTop: "1px solid var(--border-on-light)" }}>
                {g.process.map((s, i) => (
                  <div key={s.t} data-grid="step" style={{
                    display: "grid", gridTemplateColumns: "64px minmax(180px, 0.7fr) 2fr",
                    gap: "8px 32px", padding: "22px 0", borderBottom: "1px solid var(--border-on-light)", alignItems: "baseline",
                  }}>
                    <span style={{ fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: "clamp(1.3rem, 2vw, 1.7rem)", color: "var(--navy-60)" }}>0{i + 1}</span>
                    <span style={{ fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: "clamp(1.2rem, 1.9vw, 1.45rem)", lineHeight: 1.2, letterSpacing: "-0.01em", color: "var(--navy)" }}>{s.t}</span>
                    <p style={{ margin: 0, fontFamily: "var(--font-sans)", fontWeight: 300, fontSize: 14.5, lineHeight: 1.7, color: "var(--text-body)" }}>{ewHL(s.b)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Costs when you buy */}
            <div style={{ marginTop: "clamp(48px, 6vw, 72px)" }}>
              <div style={{ color: "var(--slate)", marginBottom: 16 }}><Label>Costs when you buy</Label></div>
              <LegalSectionTitle>What a purchase costs, beyond the price.</LegalSectionTitle>
              <LegalFeeTable rows={g.buy} />
            </div>

            {/* Costs when you sell */}
            <div style={{ marginTop: "clamp(48px, 6vw, 72px)" }}>
              <div style={{ color: "var(--slate)", marginBottom: 16 }}><Label>Costs when you sell</Label></div>
              <LegalSectionTitle>And when it's time to exit.</LegalSectionTitle>
              <LegalFeeTable rows={g.sell} />
              <p style={{ margin: "18px 0 0", fontFamily: "var(--font-sans)", fontWeight: 300, fontSize: 13, lineHeight: 1.6, color: "var(--slate)" }}>
                All rates on this page are a guide and depend on the property, the seller and how the deal is structured. Before you sign anything, we put exact figures on paper for the specific home.
              </p>
            </div>

            {/* Financing + holding */}
            <div data-grid="split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(36px, 5vw, 72px)", marginTop: "clamp(48px, 6vw, 72px)" }}>
              <div>
                <div style={{ color: "var(--slate)", marginBottom: 16 }}><Label>Financing</Label></div>
                <LegalSectionTitle>Mortgages, honestly.</LegalSectionTitle>
                <p style={{ margin: "20px 0 0", fontFamily: "var(--font-sans)", fontWeight: 300, fontSize: 15, lineHeight: 1.75, color: "var(--text-body)" }}>{ewHL(g.financing)}</p>
              </div>
              <div>
                <div style={{ color: "var(--slate)", marginBottom: 16 }}><Label>While you own</Label></div>
                <LegalSectionTitle>Holding &amp; rental taxes.</LegalSectionTitle>
                <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 18 }}>
                  {g.holding.map((h) => (
                    <div key={h.t} style={{ borderTop: "1px solid var(--border-on-light)", paddingTop: 16 }}>
                      <div style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: 12.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--charcoal)", marginBottom: 6 }}>{h.t}</div>
                      <p style={{ margin: 0, fontFamily: "var(--font-sans)", fontWeight: 300, fontSize: 14, lineHeight: 1.68, color: "var(--text-body)" }}>{ewHL(h.b)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Good to know */}
            <div style={{ marginTop: "clamp(48px, 6vw, 72px)" }}>
              <div style={{ color: "var(--slate)", marginBottom: 16 }}><Label>Good to know</Label></div>
              <LegalSectionTitle>The things we'd tell a friend.</LegalSectionTitle>
              <div data-grid="2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(28px, 4vw, 48px)", marginTop: 36 }}>
                {g.know.map((k) => (
                  <div key={k.t} style={{ borderTop: "1px solid var(--border-on-light)", paddingTop: 20 }}>
                    <h4 style={{ margin: 0, fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: "clamp(1.2rem, 1.9vw, 1.45rem)", lineHeight: 1.2, letterSpacing: "-0.01em", color: "var(--navy)" }}>{k.t}</h4>
                    <p style={{ margin: "12px 0 0", fontFamily: "var(--font-sans)", fontWeight: 300, fontSize: 14.5, lineHeight: 1.7, color: "var(--text-body)" }}>{ewHL(k.b)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Disclaimer + CTA */}
          <div style={{ marginTop: "clamp(56px, 7vw, 88px)", background: "var(--navy)", color: "var(--white)", padding: "clamp(36px, 5vw, 56px)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "24px 40px" }}>
            <div style={{ maxWidth: 560 }}>
              <h3 style={{ margin: 0, fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: "clamp(1.5rem, 2.6vw, 2rem)", lineHeight: 1.15, letterSpacing: "-0.01em" }}>Every purchase gets its own legal answer.</h3>
              <p style={{ margin: "14px 0 0", fontFamily: "var(--font-sans)", fontWeight: 300, fontSize: 14.5, lineHeight: 1.7, color: "var(--text-on-dark-mut)" }}>
                This guide is orientation, not legal advice. For every deal we work alongside independent, English-speaking lawyers in-country — and we'll introduce you before any money moves.
              </p>
            </div>
            <Button as="a" href="/contact/" variant="accent" size="lg" shape="pill">Ask us anything</Button>
          </div>

        </div>
      </section>
    </div>
  );
}
