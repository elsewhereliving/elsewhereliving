# Elsewhere Living — Design System

> *Find Your Elsewhere.* A luxury real-estate & lifestyle brand helping people discover, own, and experience extraordinary places beyond home.

This project is the living design system for **Elsewhere Living** (elsewhere.living). It packages the brand's typography, color, photographic language, reusable React primitives, and a website UI kit so any agent can produce on-brand interfaces and assets.

---

## Brand context

Elsewhere Living is a boutique luxury real-estate and lifestyle company. It specializes in exceptional properties and curated lifestyle opportunities across the world's most sought-after destinations — **primary market Koh Samui**, with a growing presence in **Phuket, Bangkok, Dubai and Bali**, and luxury vacation rentals across Koh Samui, Phuket, Bali and Lombok.

The brand sells villas, condominiums, land, boutique resorts, bespoke custom homes, and investment advisory — but its real promise is *lifestyle*: a place that inspires and restores you, a life that feels truly *elsewhere*.

**Personality:** sophisticated · knowledgeable · international · aspirational · refined · trustworthy · welcoming.

**Brand pillars:** Lifestyle First · Quality Over Quantity · Numbers That Work · Local Expertise · Trust & Relationships · Freedom Through Ownership.

**Taglines in rotation:** *Find Your Elsewhere · Live Beyond Home · Luxury Living Beyond Borders · Your Place in the World · Discover Life Elsewhere · Your next chapter begins elsewhere.*

**Real contact details** (use in mocks): elsewhere.living@gmail.com · WhatsApp +6692 999 3852 · elsewhere.living

### Source materials provided
- `uploads/` — brand sheets (Color, Typography, Color Application), the elseWHERE logo (white + black), a YouTube banner, and a set of finished social posts (`Main 1`–`Main9`). **Note:** the Main* images are finished posts with brand text baked in; clean, text-free crops live in `assets/imagery/c-*.jpg`.
- Font sources: `Resist-Sans-Font.zip`, `giuconda.zip`, and the Riccione `*_FontYukle.zip` family. Extracted weights are installed in `assets/fonts/`.
- No codebase or Figma file was provided — the system is built from the brand sheets, logo, social posts, and written brand brief.

---

## Content fundamentals — how Elsewhere writes

- **Voice:** quietly confident, editorial, unhurried. Reads like a travel magazine, never like a hard-sell listing agent. Aspirational but grounded ("We'll never advise you to buy a deal that doesn't perform.").
- **Person:** speaks as **"we"** about the company and addresses the reader as **"you"** / **"our clients."** Warm and personal, not corporate.
- **Casing:** two registers used together —
  - *Serif headlines* in sentence/title case: "Most people buy property. We believe in buying possibilities."
  - *Sans subheads, labels and the pill* in **ALL CAPS** with wide tracking.
- **Bracketed eyebrows** prefix almost every section: `[ WHO WE SERVE ]`, `[ WHY WORK WITH US ]`, `[ CORE PILLAR 2 ]`, `[ TESTIMONIAL ]`, `[ EMAIL ]`.
- **Parenthetical place tags** for destinations in serif: `( Samui )` `( Phuket )` `( Bangkok )` `( Bali )`.
- **Punctuation:** em-dashes for asides; periods even on short fragments. Testimonials sign off with `-- ERIK`.
- **No emoji. No exclamation hype.** The restraint is the luxury signal. Numbers (ROI, appreciation) appear sparingly and only to reassure, never to shout.
- **Sample lines:** "Your next chapter begins elsewhere." · "Most people buy property. We believe in buying possibilities." · "Our clients are global citizens who understand that true wealth isn't just financial."

---

## Visual foundations

- **Logotype:** the wordmark "**else**WHERE" is set in **The Silver Editorial** — *else* in the italic cut joined to *WHERE* in the roman cut at ~0.72× the size (in the brand file: else Italic 128 / −5% tracking, WHERE Regular 90 / 0% tracking, both line-height 40). Always one color, never outlined. **Prefer the official logo art** in `assets/logos/` (`elsewhere-black.png`, `elsewhere-white.png`) for pixel accuracy; the CSS `.ew-wordmark` is a live fallback that approximates it. Sits top-center on posts; left-aligned in nav.
- **Type:**
  - **The Silver Editorial** — the **wordmark / logotype** face (italic for *else*, roman for *WHERE*). *Font files to be supplied by the client; until installed, `--font-logo` falls back to Riccione. Use the PNG logo art in `assets/logos/` for anything that must be exact.*
  - **Riccione Serial / Riccione** — the editorial display serif. Light & ExtraLight for big airy headlines; italic for emphasis. Negative tracking on large sizes.
  - **Resist Sans Text** — the workhorse grotesque sans. Light for body; Regular/Medium for UI; always uppercase + wide tracking (0.08–0.22em) for labels, subheads and the pill.
  - **Giuconda** — accent/secondary sans, available for numerics and fine UI if needed.
- **Color:** ink black & charcoal, warm light-gray **paper**, deep **midnight navy** (#152644), and two signature accents — soft **butter yellow** (#F7F2A0) and dusty **sea-mist blue** (#A2C1C4). Backgrounds use at most one accent at a time. Yellow is the single warm "pop."
- **Photography:** moody, cinematic, **film-grained**. Two temperature families — warm tropical interiors/jungle (amber, candlelit) and cool ocean/water/sand (slate, desaturated). Always full-bleed. Type sits centered over a soft top-to-bottom darkening scrim. Apply the `.ew-grain` overlay for the signature noise.
- **Layout:** generous whitespace, centered compositions, logo top-center, a pill (`elsewhere.living`) anchored near the bottom. Editorial margins; content rarely fills edge-to-edge with text.
- **Shape language:** essentially **square** — near-zero radii on cards and buttons. The one deliberate exception is the **fully-rounded pill** capsule. Thin **hairline rules** (1px) divide sections far more often than boxes or shadows.
- **Borders over shadows:** the brand prefers a crisp 1px line to elevation. Shadows, when used, are whisper-soft (see the Elevation card). Photo cards may lift with a soft long shadow.
- **Motion:** slow, editorial. Long fades (≈600ms) on `--ease-out`; gentle, never bouncy. Hover = subtle fill/opacity shift, not movement. Press = slight opacity, no shrink. Respect `prefers-reduced-motion`.
- **Transparency & blur:** scrims over photography (`--scrim-grad`); outlined pills sit directly on imagery. Glassy blur is used sparingly if at all.

---

## Iconography

The brand is **near icon-free** — its visual interest comes from photography, the wordmark, and typographic marks (brackets `[ ]`, parentheses `( )`, the quotation marks on testimonials, simple `☆` stars for ratings). There is no proprietary icon font and none was supplied.

When UI genuinely needs icons (nav chevrons, search, close, social, property facts like beds/baths/land), use **[Lucide](https://lucide.dev)** via CDN — its thin, geometric stroke matches Resist Sans. Keep strokes light (1.5px), monochrome, and never decorative. **Substitution flag:** Lucide is a substitute; the brand shipped no icon set, so if an official set exists it should replace Lucide. Emoji are never used.

---

## Index / manifest

**Root**
- `styles.css` — the single entry point consumers link (import manifest only).
- `readme.md` — this guide.
- `SKILL.md` — Agent-Skills wrapper for downloadable use.

**`tokens/`** — `fonts.css` (@font-face), `colors.css`, `typography.css`, `spacing.css`, `base.css` (resets + brand utility classes: `.ew-wordmark`, `.ew-label`, `.ew-pill`, `.ew-place`, `.ew-grain`, `.ew-scrim`).

**`assets/`** — `logos/` (elsewhere white + black), `fonts/` (Riccione, Resist Sans Text, Giuconda), `imagery/` (original social posts + clean `c-*.jpg` crops for hero use).

**`components/`** — React primitives (namespace `window.DesignSystem_abef38`):
- `core/` — **Button**, **Wordmark**, **Label**, **Badge**
- `property/` — **PropertyCard**
- `forms/` — **Field**

**`guidelines/cards/`** — foundation specimen cards (Type, Colors, Spacing, Brand) rendered in the Design System tab.

**`ui_kits/website/`** — the Elsewhere Living marketing website UI kit (homepage + listings + property detail), `index.html` interactive.
