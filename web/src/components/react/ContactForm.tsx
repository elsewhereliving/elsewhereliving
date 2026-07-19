import { useState } from "react";

// Contact-page enquiry form (light, faithful to js/pages.js ContactScreen).
// On submit it composes a pre-filled email and opens the visitor's mail client —
// no backend, no stored form (spam-resistant).

interface Props {
  email: string;
  whatsapp: string;
}

const INTENTS = [
  { id: "buy", l: "Buy a property" },
  { id: "rent", l: "Rent a vacation home" },
  { id: "custom", l: "Build a custom home" },
];
const INTENT_LABEL: Record<string, string> = {
  buy: "Buy a property",
  rent: "Rent a vacation home",
  custom: "Build a custom home",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-sans)",
  fontSize: 10.5,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "var(--slate)",
  marginBottom: 8,
};
const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "transparent",
  border: "none",
  borderBottom: "1px solid var(--border-on-light)",
  borderRadius: 0,
  padding: "11px 0",
  fontFamily: "var(--font-sans)",
  fontWeight: 300,
  fontSize: 15,
  color: "var(--charcoal)",
  outline: "none",
};

function Field({ label, name, type = "text", placeholder, required, textarea }: {
  label: string; name: string; type?: string; placeholder?: string; required?: boolean; textarea?: boolean;
}) {
  return (
    <label style={{ display: "block" }}>
      <span style={labelStyle}>{label}</span>
      {textarea ? (
        <textarea style={{ ...inputStyle, resize: "vertical" }} name={name} rows={3} placeholder={placeholder} />
      ) : (
        <input style={inputStyle} type={type} name={name} placeholder={placeholder} required={required} />
      )}
    </label>
  );
}

export default function ContactForm({ email, whatsapp }: Props) {
  // Deliberately no backend (owner's decision): submit composes the message
  // and opens the visitor's mail app so the enquiry arrives as a direct email
  // from the client's own address. Visitors without a mail app get the same
  // message as a prefilled WhatsApp link. Don't convert this to a form
  // service/webhook — the "One last step" state must never claim receipt.
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");
  const [intents, setIntents] = useState<string[]>([]);
  const waDigits = (whatsapp || "").replace(/[^0-9]/g, "");
  const toggleIntent = (id: string) =>
    setIntents((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const g = (k: string) => (fd.get(k) || "").toString().trim();
    const want = intents.map((i) => INTENT_LABEL[i]).filter(Boolean).join(", ");
    const who = [g("first_name"), g("last_name")].filter(Boolean).join(" ") || "Website visitor";
    const subject = "New enquiry — " + who + (want ? " · " + want : "");
    const lines = [
      "Name: " + who,
      "Email: " + g("email"),
      g("whatsapp") ? "WhatsApp: " + g("whatsapp") : null,
      want ? "Looking to: " + want : null,
      g("destination") ? "Where: " + g("destination") : null,
      g("budget") ? "Budget: " + g("budget") : null,
      "",
      g("message") || "",
    ].filter((l) => l !== null) as string[];
    const body = lines.join("\n");
    setMessage(body);
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  if (sent) {
    return (
      <div style={{ padding: "8px 4px" }}>
        <div style={{ color: "var(--butter)", fontSize: 26, marginBottom: 12 }}>✶</div>
        <h3 style={{ margin: 0, fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: 26, color: "var(--navy)" }}>One last step.</h3>
        <p style={{ margin: "14px 0 0", fontFamily: "var(--font-sans)", fontWeight: 300, fontSize: 15, lineHeight: 1.7, color: "var(--text-body)" }}>
          We've opened your enquiry as a pre-filled email to{" "}
          <a href={`mailto:${email}`} style={{ color: "var(--navy)", textDecoration: "underline", textUnderlineOffset: 3 }}>{email}</a>
          {" "}— just hit send. If no mail app opened, send it on WhatsApp instead:
        </p>
        <a
          href={`https://wa.me/${waDigits}?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ew-btn"
          style={{
            marginTop: 20, display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-sans)", fontWeight: 400, textTransform: "uppercase", textDecoration: "none",
            lineHeight: 1, borderRadius: "var(--radius-xs)", padding: "1.05em 2em", fontSize: 12.5, letterSpacing: "0.14em",
            background: "var(--navy)", color: "var(--white)", border: "1.25px solid var(--navy)", cursor: "pointer",
          }}
        >
          Send via WhatsApp
        </a>
        <div>
          <button type="button" onClick={() => setSent(false)} className="ew-textlink" style={{ marginTop: 22, background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--slate)" }}>
            ← Back to the form
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {/* Intent checks */}
      <div>
        <span style={{ ...labelStyle, marginBottom: 12 }}>I'm looking to</span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {INTENTS.map((o) => {
            const active = intents.includes(o.id);
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => toggleIntent(o.id)}
                aria-pressed={active}
                style={{
                  flex: "1 1 0", minWidth: 150, display: "flex", alignItems: "center", gap: 11, cursor: "pointer",
                  background: active ? "var(--mist)" : "transparent",
                  border: "1px solid " + (active ? "var(--navy)" : "var(--border-on-light)"),
                  borderRadius: "var(--radius-xs)", padding: "13px 14px", textAlign: "left",
                  transition: "background var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out)",
                }}
              >
                <span style={{ width: 19, height: 19, flexShrink: 0, borderRadius: 2, display: "inline-flex", alignItems: "center", justifyContent: "center", background: active ? "var(--navy)" : "transparent", border: "1.5px solid " + (active ? "var(--navy)" : "var(--slate)") }}>
                  {active && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--white)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  )}
                </span>
                <span style={{ fontFamily: "var(--font-sans)", fontWeight: 300, fontSize: 14, color: "var(--charcoal)" }}>{o.l}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
        <Field label="First name" name="first_name" placeholder="First" required />
        <Field label="Last name" name="last_name" placeholder="Last" required />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
        <Field label="Email" name="email" type="email" placeholder="you@email.com" required />
        <Field label="WhatsApp (optional)" name="whatsapp" type="tel" placeholder="+66 …" />
      </div>
      <Field label="Where are you dreaming of?" name="destination" placeholder="Koh Samui, Bali, not sure yet…" />
      <Field label="Budget" name="budget" placeholder="e.g. $500k–$1M, or flexible" />
      <Field label="Tell us a little more" name="message" textarea placeholder="What does your elsewhere look like?" />

      <button
        type="submit"
        className="ew-btn"
        style={{
          width: "100%", marginTop: 4, display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-sans)", fontWeight: 400, textTransform: "uppercase", cursor: "pointer",
          lineHeight: 1, borderRadius: "var(--radius-xs)", padding: "1.05em 2em", fontSize: 12.5, letterSpacing: "0.14em",
          background: "var(--navy)", color: "var(--white)", border: "1.25px solid var(--navy)",
        }}
      >
        Send enquiry
      </button>
    </form>
  );
}
