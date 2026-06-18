import { useSaved } from "./useSaved";

// Faithful port of js/brand.js SaveButton — 40×40 round heart toggle.
function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" style={{ display: "block" }} aria-hidden="true">
      <path d="M12 20.5S3.5 14.6 3.5 8.9A4.4 4.4 0 0 1 12 6.6a4.4 4.4 0 0 1 8.5 2.3c0 5.7-8.5 11.6-8.5 11.6Z" strokeLinejoin="round" />
    </svg>
  );
}

export default function SaveButton({ id, tone = "light" }: { id: string; tone?: "light" | "dark" }) {
  const [saved, toggle] = useSaved();
  const active = saved.includes(id);
  const onDark = tone === "dark";
  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(id); }}
      aria-label={active ? "Remove from saved" : "Save property"}
      title={active ? "Saved" : "Save"}
      style={{
        width: 40, height: 40, display: "inline-flex", alignItems: "center", justifyContent: "center",
        borderRadius: "var(--radius-pill)", cursor: "pointer", lineHeight: 0,
        background: active ? "var(--butter)" : onDark ? "rgba(20,22,28,0.42)" : "rgba(255,255,255,0.9)",
        color: active ? "var(--navy)" : onDark ? "var(--white)" : "var(--charcoal)",
        border: active ? "1px solid var(--butter)" : "1px solid " + (onDark ? "var(--border-on-dark)" : "var(--border-subtle)"),
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        transition: "all var(--dur-base) var(--ease-out)",
      }}
    >
      <HeartIcon filled={active} />
    </button>
  );
}
