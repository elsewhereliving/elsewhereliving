// Thin Lucide-style icon set for the Studio (1.5px stroke), matching the site.
import type { CSSProperties } from "react";

const P: Record<string, string> = {
  chevronRight: '<path d="M9 18l6-6-6-6"/>',
  arrowRight: '<path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>',
  external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  view: '<path d="M2 12s3.2-7 10-7 10 7 10 7-3.2 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  sparkles: '<path d="M12 2l2.2 7 6.8 2.2-6.8 2.2L12 22l-2.2-6.8L3 12.2 9.8 10 12 2z"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  key: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>',
  plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
  star: '<path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7L12 2z"/>',
  interior: '<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',
};

export function Icon({
  name,
  size = 16,
  color = "currentColor",
  stroke = 1.5,
  fill = "none",
  style,
}: {
  name: keyof typeof P | string;
  size?: number;
  color?: string;
  stroke?: number;
  fill?: string;
  style?: CSSProperties;
}) {
  const inner = P[name] || "";
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" ` +
    `fill="${fill}" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" style="display:block">${inner}</svg>`;
  return (
    <span
      style={{ display: "inline-flex", flexShrink: 0, lineHeight: 0, color, ...style }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
