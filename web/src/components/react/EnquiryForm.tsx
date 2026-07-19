import { useState } from "react";

// Property/rental enquiry form (light, faithful to js/property.js InquiryForm).
// On submit it composes a pre-filled email and opens the visitor's mail client —
// no backend, no stored form (spam-resistant). A WhatsApp link is offered too.

interface Props {
  title: string;       // property/rental title (goes into the subject/message)
  email: string;       // contact email
  whatsapp: string;    // display number, e.g. "+66 92 999 3852"
  kind?: "property" | "rental";
}

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

export default function EnquiryForm({ title, email, whatsapp, kind = "property" }: Props) {
  // The form has no backend: submitting composes the message and opens the
  // visitor's mail app. Not everyone has one wired up, so after submit we keep
  // the composed message around and offer WhatsApp (always works) as loudly
  // as the email draft — and never claim the enquiry was "received".
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");
  const waDigits = (whatsapp || "").replace(/[^0-9]/g, "");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const g = (k: string) => (fd.get(k) || "").toString().trim();
    const who = g("name") || "Website visitor";
    const verb = kind === "rental" ? "Rental enquiry" : "Enquiry";
    const subject = `${verb} — ${title}`;
    const lines = [
      `Name: ${who}`,
      `Email: ${g("email")}`,
      "",
      `Re: ${title}`,
      "",
      g("message") || "I'd love to know more about this property.",
    ];
    const body = lines.join("\n");
    setMessage(body);
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  if (sent) {
    return (
      <div style={{ textAlign: "center", padding: "12px 4px" }}>
        <div style={{ color: "var(--butter)", fontSize: 26, marginBottom: 12 }}>✶</div>
        <h3 style={{ margin: 0, fontFamily: "var(--font-serif)", fontWeight: 300, fontSize: 24, color: "var(--navy)" }}>One last step.</h3>
        <p style={{ margin: "12px 0 0", fontFamily: "var(--font-sans)", fontWeight: 300, fontSize: 14.5, lineHeight: 1.6, color: "var(--text-body)" }}>
          We've opened your enquiry as an email draft — just hit send. If no mail app opened, send it on WhatsApp instead:
        </p>
        <a
          href={`https://wa.me/${waDigits}?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ew-btn"
          style={{
            width: "100%", marginTop: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box",
            fontFamily: "var(--font-sans)", fontWeight: 400, textTransform: "uppercase", textDecoration: "none",
            lineHeight: 1, borderRadius: "var(--radius-xs)", padding: "1.05em 2em", fontSize: 12.5, letterSpacing: "0.14em",
            background: "var(--navy)", color: "var(--white)", border: "1.25px solid var(--navy)",
          }}
        >
          Send via WhatsApp
        </a>
        <p style={{ margin: "14px 0 0", fontFamily: "var(--font-sans)", fontWeight: 300, fontSize: 13, lineHeight: 1.6, color: "var(--slate)" }}>
          or email us directly at{" "}
          <a href={`mailto:${email}`} style={{ color: "var(--navy)", textDecoration: "underline", textUnderlineOffset: 3 }}>{email}</a>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <label style={{ display: "block" }}>
        <span style={labelStyle}>Full name</span>
        <input style={inputStyle} name="name" placeholder="Your name" required />
      </label>
      <label style={{ display: "block" }}>
        <span style={labelStyle}>Email</span>
        <input style={inputStyle} type="email" name="email" placeholder="you@email.com" required />
      </label>
      <label style={{ display: "block" }}>
        <span style={labelStyle}>Message</span>
        <textarea style={{ ...inputStyle, resize: "vertical" }} name="message" rows={3} placeholder={`I'd love to know more about ${title}…`} />
      </label>
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
        Request details
      </button>
      <a
        href={`https://wa.me/${waDigits}?text=${encodeURIComponent(`Hello Elsewhere Living, I'd love to know more about ${title}.`)}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontFamily: "var(--font-sans)", fontSize: 11, letterSpacing: "0.04em", color: "var(--slate)", textAlign: "center", textDecoration: "none" }}
      >
        or WhatsApp us at {whatsapp}
      </a>
    </form>
  );
}
