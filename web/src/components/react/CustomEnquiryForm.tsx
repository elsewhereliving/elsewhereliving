import { useEffect, useState } from "react";
import Button from "./Button";

// Development Partner enquiry form — original white card, updated copy.
// Composes a pre-filled email (site convention: no backend, spam-resistant).
const fieldWrap: React.CSSProperties = { display: "block" };
const labelStyle: React.CSSProperties = { display: "block", fontFamily: "var(--font-sans)", fontSize: 10.5, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--slate)", marginBottom: 8 };
const controlStyle: React.CSSProperties = { width: "100%", boxSizing: "border-box", background: "transparent", border: "none", borderBottom: "1px solid var(--border-on-light)", borderRadius: 0, padding: "11px 0", fontFamily: "var(--font-sans)", fontWeight: 300, fontSize: 15, color: "var(--charcoal)", outline: "none" };

function Field({ label, name, type = "text", placeholder, required, value, onChange, textarea }: any) {
  return (
    <label style={fieldWrap}>
      <span style={labelStyle}>{label}</span>
      {textarea
        ? <textarea name={name} placeholder={placeholder} rows={3} style={{ ...controlStyle, resize: "vertical" }} />
        : <input name={name} type={type} placeholder={placeholder} required={required} value={value} onChange={onChange} style={controlStyle} />}
    </label>
  );
}

export default function CustomEnquiryForm({ email = "" }: { email?: string; whatsapp?: string }) {
  const [sent, setSent] = useState(false);
  const [island, setIsland] = useState("");
  const [budget, setBudget] = useState("");

  useEffect(() => {
    const on = (e: Event) => {
      const d = (e as CustomEvent).detail || {};
      setIsland(d.island || "");
      setBudget(d.budget || "");
      const el = document.getElementById("custom-enquiry");
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 40, behavior: "smooth" });
    };
    window.addEventListener("ew-ch-prefill", on as EventListener);
    return () => window.removeEventListener("ew-ch-prefill", on as EventListener);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const g = (k: string) => (fd.get(k) || "").toString().trim();
    const who = g("name") || "Website visitor";
    const lines = [
      "Name: " + who,
      "Email: " + g("email"),
      g("island") ? "Where: " + g("island") : null,
      g("budget") ? "Budget: " + g("budget") : null,
      "",
      g("message") || "",
    ].filter((l) => l !== null);
    window.location.href = "mailto:" + email + "?subject=" + encodeURIComponent("Development project enquiry — " + who) + "&body=" + encodeURIComponent(lines.join("\n"));
    setSent(true);
  };

  if (sent) {
    return (
      <div style={{ background: "var(--white)", padding: "clamp(30px, 4vw, 48px)", textAlign: "center" }}>
        <p style={{ margin: 0, fontFamily: "var(--font-serif)", fontWeight: 300, fontStyle: "italic", fontSize: "clamp(1.4rem, 2.4vw, 1.8rem)", color: "var(--navy)" }}>Thank you.</p>
        <p style={{ margin: "14px 0 0", fontFamily: "var(--font-sans)", fontWeight: 300, fontSize: 14.5, lineHeight: 1.7, color: "var(--text-body)" }}>
          Your email should have opened — send it, and your enquiry is on its way to the Elsewhere team. We'll come back honestly — usually within a day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: "var(--white)", padding: "clamp(30px, 4vw, 48px)", display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ color: "var(--slate)" }}><span className="ew-label" style={{ letterSpacing: "0.04em" }}>[ Start the conversation ]</span></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }} className="ew-ch-form-split">
        <Field label="Full name" name="name" placeholder="Your name" required />
        <Field label="Email" name="email" type="email" placeholder="you@email.com" required />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }} className="ew-ch-form-split">
        <Field label="Where" name="island" placeholder="Koh Samui, Phuket…" value={island} onChange={(e: any) => setIsland(e.target.value)} />
        <Field label="Budget" name="budget" placeholder="$1M – $5M" value={budget} onChange={(e: any) => setBudget(e.target.value)} />
      </div>
      <Field label="The project you see" name="message" textarea placeholder="A villa to sell, an estate to hold, the home you've been imagining…" />
      <Button variant="accent" size="md" shape="pill" type="submit" style={{ width: "100%", marginTop: 4 }}>Send enquiry</Button>
      <span style={{ fontFamily: "var(--font-sans)", fontWeight: 300, fontSize: 11.5, letterSpacing: "0.04em", color: "var(--slate)", textAlign: "center" }}>
        No obligation — a conversation, not a contract.
      </span>
    </form>
  );
}
