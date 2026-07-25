import { useState } from "react";

// Free-text search field shared by the property and rental browsers. Renders a
// pill input with a leading magnifier and its own styled clear (×) button. The
// browser's native type=search clear affordance is suppressed in global.css so
// only this one shows.
export default function SearchBox({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [focus, setFocus] = useState(false);
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 10, flex: "1 1 100%" }}>
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 10.5,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--slate)",
        }}
      >
        Search
      </span>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 16px",
          borderRadius: "var(--radius-pill)",
          border: "1px solid " + (focus ? "var(--navy)" : "var(--border-subtle)"),
          background: "var(--white)",
          transition: "border-color var(--dur-base) var(--ease-out)",
        }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--slate)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }} aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          placeholder={placeholder}
          aria-label="Search"
          style={{
            flex: 1,
            minWidth: 0,
            border: "none",
            outline: "none",
            background: "transparent",
            fontFamily: "var(--font-sans)",
            fontWeight: 300,
            fontSize: 14.5,
            letterSpacing: "0.01em",
            color: "var(--charcoal)",
          }}
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear search"
            style={{
              flexShrink: 0,
              display: "inline-flex",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--slate)",
              padding: 2,
              lineHeight: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        ) : null}
      </div>
    </label>
  );
}
