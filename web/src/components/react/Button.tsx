// Faithful port of the design-system Button (window.DesignSystem_abef38).
import type { CSSProperties, ReactNode } from "react";

type Variant = "solid" | "ink" | "outline" | "outline-light" | "accent";
type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, CSSProperties> = {
  sm: { padding: "0.75em 1.5em", fontSize: "11px", letterSpacing: "0.12em" },
  md: { padding: "1.05em 2em", fontSize: "12.5px", letterSpacing: "0.14em" },
  lg: { padding: "1.25em 2.6em", fontSize: "13.5px", letterSpacing: "0.16em" },
};
const VARIANTS: Record<Variant, CSSProperties> = {
  solid: { background: "var(--navy)", color: "var(--white)", border: "1.25px solid var(--navy)" },
  ink: { background: "var(--ink-black)", color: "var(--white)", border: "1.25px solid var(--ink-black)" },
  outline: { background: "transparent", color: "var(--charcoal)", border: "1.25px solid currentColor" },
  "outline-light": { background: "transparent", color: "var(--white)", border: "1.25px solid var(--border-on-dark)" },
  accent: { background: "var(--butter)", color: "var(--navy)", border: "1.25px solid var(--butter)" },
};

export default function Button({
  children,
  variant = "solid",
  size = "md",
  shape = "default",
  as = "button",
  className = "",
  style = {},
  ...rest
}: {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  shape?: "default" | "pill";
  as?: "button" | "a";
  className?: string;
  style?: CSSProperties;
  [k: string]: unknown;
}) {
  const base: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.6em",
    fontFamily: "var(--font-sans)",
    fontWeight: 400,
    textTransform: "uppercase",
    textDecoration: "none",
    cursor: "pointer",
    whiteSpace: "nowrap",
    lineHeight: 1,
    borderRadius: shape === "pill" ? "var(--radius-pill)" : "var(--radius-xs)",
    transition: "background var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out), opacity var(--dur-base) var(--ease-out)",
    ...SIZES[size],
    ...VARIANTS[variant],
    ...style,
  };
  const Tag = as as "button";
  return (
    <Tag className={`ew-btn ${className}`} data-variant={variant} style={base} {...rest}>
      {children}
    </Tag>
  );
}
