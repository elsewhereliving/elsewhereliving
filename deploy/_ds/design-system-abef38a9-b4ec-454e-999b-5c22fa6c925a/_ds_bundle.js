/* @ds-bundle: {"format":3,"namespace":"DesignSystem_abef38","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Label","sourcePath":"components/core/Label.jsx"},{"name":"Wordmark","sourcePath":"components/core/Wordmark.jsx"},{"name":"Field","sourcePath":"components/forms/Field.jsx"},{"name":"PropertyCard","sourcePath":"components/property/PropertyCard.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"a11c1668cb2e","components/core/Button.jsx":"6bc733bba5e2","components/core/Label.jsx":"192adc8d41cf","components/core/Wordmark.jsx":"d0337b472720","components/forms/Field.jsx":"07df6bd464b3","components/property/PropertyCard.jsx":"f063ac617937","ui_kits/website/HomeScreen.jsx":"fcfbab03d389","ui_kits/website/brand.jsx":"8e7a1d398ebc","ui_kits/website/chrome.jsx":"22904f11d252","ui_kits/website/data.js":"a400f8e7afa1","ui_kits/website/screens.jsx":"ee9a50777a46"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.DesignSystem_abef38 = window.DesignSystem_abef38 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Elsewhere Living — Badge
 * A small status marker for listings: "For Sale", "New", "Rental".
 * Quiet by default (hairline outline); `tone` sets the accent.
 */
function Badge({
  children,
  tone = "outline",
  className = "",
  style = {},
  ...rest
}) {
  const tones = {
    outline: {
      background: "transparent",
      color: "var(--charcoal)",
      border: "1px solid var(--border-subtle)"
    },
    navy: {
      background: "var(--navy)",
      color: "var(--white)",
      border: "1px solid var(--navy)"
    },
    accent: {
      background: "var(--butter)",
      color: "var(--navy)",
      border: "1px solid var(--butter)"
    },
    mist: {
      background: "var(--mist)",
      color: "var(--navy)",
      border: "1px solid var(--mist)"
    },
    light: {
      background: "var(--white)",
      color: "var(--charcoal)",
      border: "1px solid var(--border-subtle)"
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `ew-badge ${className}`,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.4em",
      fontFamily: "var(--font-sans)",
      fontWeight: 400,
      fontSize: "10.5px",
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      padding: "0.45em 0.85em",
      borderRadius: "var(--radius-xs)",
      lineHeight: 1,
      ...tones[tone],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Elsewhere Living — Button
 * The brand's calls to action: wide-tracked uppercase sans, mostly outlined,
 * with the signature fully-rounded "pill" capsule as the hero variant.
 */
function Button({
  children,
  variant = "solid",
  size = "md",
  shape = "default",
  as = "button",
  className = "",
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      padding: "0.75em 1.5em",
      fontSize: "11px",
      letterSpacing: "0.12em"
    },
    md: {
      padding: "1.05em 2em",
      fontSize: "12.5px",
      letterSpacing: "0.14em"
    },
    lg: {
      padding: "1.25em 2.6em",
      fontSize: "13.5px",
      letterSpacing: "0.16em"
    }
  };
  const variants = {
    solid: {
      background: "var(--navy)",
      color: "var(--white)",
      border: "1.25px solid var(--navy)"
    },
    ink: {
      background: "var(--ink-black)",
      color: "var(--white)",
      border: "1.25px solid var(--ink-black)"
    },
    outline: {
      background: "transparent",
      color: "var(--charcoal)",
      border: "1.25px solid currentColor"
    },
    "outline-light": {
      background: "transparent",
      color: "var(--white)",
      border: "1.25px solid var(--border-on-dark)"
    },
    accent: {
      background: "var(--butter)",
      color: "var(--navy)",
      border: "1.25px solid var(--butter)"
    }
  };
  const base = {
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
    transition: "background var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out), opacity var(--dur-base) var(--ease-out)",
    ...sizes[size],
    ...variants[variant],
    ...style
  };
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: `ew-btn ${className}`,
    style: base
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Label.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Elsewhere Living — Label
 * The brand's signature eyebrow: an all-caps, wide-tracked sans phrase
 * wrapped in square brackets, e.g. [ WHO WE SERVE ].
 */
function Label({
  children,
  className = "",
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `ew-label ${className}`,
    style: style
  }, rest), "[ ", children, " ]");
}
Object.assign(__ds_scope, { Label });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Label.jsx", error: String((e && e.message) || e) }); }

// components/core/Wordmark.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Elsewhere Living — Wordmark
 * The logotype: "else" in italic serif joined to "WHERE" in roman small-caps.
 * Renders as a single inline element; size via the `size` prop or font-size.
 */
function Wordmark({
  size = 32,
  color = "currentColor",
  className = "",
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: `ew-wordmark ${className}`,
    style: {
      fontSize: typeof size === "number" ? `${size}px` : size,
      color,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "ew-else"
  }, "else"), /*#__PURE__*/React.createElement("span", {
    className: "ew-where"
  }, "where"));
}
Object.assign(__ds_scope, { Wordmark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Wordmark.jsx", error: String((e && e.message) || e) }); }

// components/forms/Field.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Elsewhere Living — Field
 * A minimal form field: an uppercase wide-tracked label over an underline-only
 * input. Borders, not boxes — matching the brand's hairline language.
 */
function Field({
  label,
  type = "text",
  placeholder,
  as = "input",
  tone = "light",
  className = "",
  style = {},
  ...rest
}) {
  const onDark = tone === "dark";
  const labelColor = onDark ? "var(--text-on-dark-mut)" : "var(--slate)";
  const textColor = onDark ? "var(--white)" : "var(--charcoal)";
  const lineColor = onDark ? "var(--border-on-dark)" : "var(--border-on-light)";
  const controlStyle = {
    width: "100%",
    boxSizing: "border-box",
    background: "transparent",
    border: "none",
    borderBottom: `1px solid ${lineColor}`,
    borderRadius: 0,
    padding: "10px 0",
    fontFamily: "var(--font-sans)",
    fontWeight: 300,
    fontSize: "15px",
    color: textColor,
    outline: "none"
  };
  const Control = as;
  return /*#__PURE__*/React.createElement("label", {
    className: `ew-field ${className}`,
    style: {
      display: "block",
      ...style
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: "var(--font-sans)",
      fontSize: "10.5px",
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: labelColor,
      marginBottom: "6px"
    }
  }, label) : null, /*#__PURE__*/React.createElement(Control, _extends({
    type: as === "input" ? type : undefined,
    placeholder: placeholder,
    rows: as === "textarea" ? 3 : undefined,
    style: controlStyle
  }, rest)));
}
Object.assign(__ds_scope, { Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Field.jsx", error: String((e && e.message) || e) }); }

// components/property/PropertyCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Elsewhere Living — PropertyCard
 * An editorial listing card: full-bleed photo, hairline-divided meta, a serif
 * title and a quiet facts row. Square corners, border over shadow.
 */
function PropertyCard({
  image,
  title,
  location,
  price,
  badge,
  beds,
  baths,
  area,
  className = "",
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("article", _extends({
    className: `ew-property-card ${className}`,
    style: {
      display: "flex",
      flexDirection: "column",
      background: "var(--white)",
      border: "1px solid var(--border-subtle)",
      overflow: "hidden",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      aspectRatio: "4 / 3",
      overflow: "hidden"
    },
    className: "ew-grain"
  }, /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: title,
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }), badge ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "14px",
      left: "14px"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "light"
  }, badge)) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px 22px 22px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "10.5px",
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: "var(--slate)"
    }
  }, location), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: "8px 0 0",
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: "26px",
      lineHeight: 1.12,
      color: "var(--navy)",
      letterSpacing: "-0.01em"
    }
  }, title), (beds || baths || area) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "18px",
      marginTop: "16px",
      paddingTop: "16px",
      borderTop: "1px solid var(--border-subtle)",
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: "12.5px",
      letterSpacing: "0.04em",
      color: "var(--text-body)"
    }
  }, beds ? /*#__PURE__*/React.createElement("span", null, beds, " Beds") : null, baths ? /*#__PURE__*/React.createElement("span", null, baths, " Baths") : null, area ? /*#__PURE__*/React.createElement("span", null, area) : null), price ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "16px",
      fontFamily: "var(--font-serif)",
      fontWeight: 400,
      fontSize: "19px",
      color: "var(--charcoal)"
    }
  }, price) : null));
}
Object.assign(__ds_scope, { PropertyCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/property/PropertyCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/HomeScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Elsewhere Living — Home screen */

function Hero({
  onNav
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "ew-grain",
    style: {
      position: "relative",
      minHeight: "92vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/imagery/c-ocean.jpg",
    alt: "",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(180deg, rgba(8,10,14,0.55) 0%, rgba(8,10,14,0.28) 38%, rgba(8,10,14,0.72) 100%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 2,
      textAlign: "center",
      color: "var(--white)",
      padding: "0 24px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 26
    }
  }, /*#__PURE__*/React.createElement(Label, {
    style: {
      letterSpacing: "0.22em"
    }
  }, "Living"), /*#__PURE__*/React.createElement(Wordmark, {
    size: 88,
    color: "var(--white)",
    style: {
      lineHeight: 1
    }
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: "var(--font-sans)",
      fontWeight: 400,
      fontSize: 19,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      lineHeight: 1.6,
      maxWidth: 560
    }
  }, "Your next chapter begins elsewhere"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    shape: "pill",
    onClick: () => onNav("listings")
  }, "Explore properties"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline-light",
    shape: "pill",
    onClick: () => onNav("contact")
  }, "Start your journey"))));
}
function MarketsStrip() {
  const markets = ["Samui", "Phuket", "Bangkok", "Dubai", "Bali"];
  return /*#__PURE__*/React.createElement("section", {
    className: "ew-grain",
    style: {
      background: "var(--mist)",
      padding: "96px 48px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement(Label, {
    style: {
      color: "var(--navy)"
    }
  }, "Our markets"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: "22px auto 0",
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: 42,
      lineHeight: 1.15,
      letterSpacing: "-0.01em",
      color: "var(--navy)",
      maxWidth: 760
    }
  }, "We specialize in the most sought-after lifestyle and investment destinations"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "14px 34px",
      justifyContent: "center",
      alignItems: "baseline",
      marginTop: 44
    }
  }, markets.map(m => /*#__PURE__*/React.createElement(Place, {
    key: m,
    style: {
      fontSize: 26,
      color: "var(--navy)"
    }
  }, m))));
}
function Pillars() {
  const pillars = [["Core Pillar 1", "Lifestyle First", "We don't just sell properties — we help clients build the life they want, beyond the boundaries of a single home."], ["Core Pillar 2", "Quality Over Quantity", "As a boutique agency, we only work with clients who align with our values, building relationships that last beyond the sale."], ["Core Pillar 3", "Numbers That Work", "Every property is vetted with ROI, rental potential and appreciation in mind. We'll never advise a deal that doesn't perform."]];
  return /*#__PURE__*/React.createElement("section", {
    className: "ew-grain",
    style: {
      background: "var(--navy)",
      color: "var(--white)",
      padding: "104px 48px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginBottom: 64
    }
  }, /*#__PURE__*/React.createElement(Label, {
    style: {
      color: "var(--mist)"
    }
  }, "Why work with us"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: "20px auto 0",
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: 40,
      color: "var(--white)",
      maxWidth: 640,
      lineHeight: 1.15
    }
  }, "Most people buy property.", /*#__PURE__*/React.createElement("br", null), "We believe in buying possibilities.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 1,
      background: "rgba(255,255,255,0.14)",
      border: "1px solid rgba(255,255,255,0.14)"
    }
  }, pillars.map(([tag, title, body]) => /*#__PURE__*/React.createElement("div", {
    key: title,
    style: {
      background: "var(--navy)",
      padding: "44px 38px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 10.5,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: "var(--mist)"
    }
  }, "[ ", tag, " ]"), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: "20px 0 16px",
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: 30,
      color: "var(--white)"
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 14.5,
      lineHeight: 1.72,
      color: "var(--text-on-dark-mut)"
    }
  }, body))))));
}
function FeaturedListings({
  onOpen,
  onNav
}) {
  const featured = window.LISTINGS.slice(0, 6);
  return /*#__PURE__*/React.createElement("section", {
    className: "ew-grain",
    style: {
      background: "var(--paper)",
      padding: "104px 48px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      marginBottom: 44,
      flexWrap: "wrap",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "Curated opportunities"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: "18px 0 0",
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: 40,
      color: "var(--navy)"
    }
  }, "Featured Properties")), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    shape: "pill",
    size: "sm",
    onClick: () => onNav("listings")
  }, "View all properties")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 28
    }
  }, featured.map(l => /*#__PURE__*/React.createElement(PropertyCard, _extends({
    key: l.id
  }, l, {
    onClick: () => onOpen(l.id)
  }))))));
}
function Testimonial() {
  return /*#__PURE__*/React.createElement("section", {
    className: "ew-grain",
    style: {
      position: "relative",
      padding: "120px 48px",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/imagery/c-deck-sea.jpg",
    alt: "",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "rgba(10,14,20,0.6)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 2,
      maxWidth: 800,
      margin: "0 auto",
      textAlign: "center",
      color: "var(--white)"
    }
  }, /*#__PURE__*/React.createElement(Label, null, "Testimonial"), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "20px 0 28px",
      letterSpacing: "0.5em",
      fontSize: 16,
      color: "var(--butter)"
    }
  }, "\u2606 \u2606 \u2606 \u2606 \u2606"), /*#__PURE__*/React.createElement("blockquote", {
    style: {
      margin: 0,
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontStyle: "italic",
      fontSize: 28,
      lineHeight: 1.45,
      letterSpacing: "-0.01em"
    }
  }, "\"Sofia was the only one who took the time to provide detailed, completely honest answers. Her knowledge and integrity sealed the deal.\""), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 26,
      fontFamily: "var(--font-sans)",
      fontSize: 11.5,
      letterSpacing: "0.2em",
      textTransform: "uppercase"
    }
  }, "\u2014 Erik")));
}
function ContactCTA({
  onNav
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "ew-grain",
    style: {
      background: "var(--mist)",
      color: "var(--navy)",
      padding: "100px 48px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement(Label, null, "Start your elsewhere journey"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: "22px auto 30px",
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: 52,
      lineHeight: 1.08,
      letterSpacing: "-0.01em",
      maxWidth: 620
    }
  }, "Find your place in the world"), /*#__PURE__*/React.createElement(Button, {
    variant: "solid",
    shape: "pill",
    size: "lg",
    onClick: () => onNav("contact")
  }, "Contact us"));
}
function HomeScreen({
  onNav,
  onOpen
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Hero, {
    onNav: onNav
  }), /*#__PURE__*/React.createElement(MarketsStrip, null), /*#__PURE__*/React.createElement(FeaturedListings, {
    onOpen: onOpen,
    onNav: onNav
  }), /*#__PURE__*/React.createElement(Pillars, null), /*#__PURE__*/React.createElement(Testimonial, null), /*#__PURE__*/React.createElement(ContactCTA, {
    onNav: onNav
  }));
}
Object.assign(window, {
  HomeScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/brand.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Elsewhere Living — UI kit brand primitives.
   Mirrors components/ but assigned to window so the kit previews standalone. */

function Wordmark({
  size = 32,
  color = "currentColor",
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: "ew-wordmark",
    style: {
      fontSize: typeof size === "number" ? size + "px" : size,
      color,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "ew-else"
  }, "else"), /*#__PURE__*/React.createElement("span", {
    className: "ew-where"
  }, "where"));
}
function Label({
  children,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: "ew-label",
    style: style
  }, rest), "[ ", children, " ]");
}
function Place({
  children,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: "ew-place",
    style: style
  }, rest), "( ", children, " )");
}
function Button({
  children,
  variant = "solid",
  size = "md",
  shape = "default",
  as = "button",
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      padding: "0.75em 1.5em",
      fontSize: 11,
      letterSpacing: "0.12em"
    },
    md: {
      padding: "1.05em 2em",
      fontSize: 12.5,
      letterSpacing: "0.14em"
    },
    lg: {
      padding: "1.25em 2.6em",
      fontSize: 13.5,
      letterSpacing: "0.16em"
    }
  };
  const variants = {
    solid: {
      background: "var(--navy)",
      color: "var(--white)",
      border: "1.25px solid var(--navy)"
    },
    ink: {
      background: "var(--ink-black)",
      color: "var(--white)",
      border: "1.25px solid var(--ink-black)"
    },
    outline: {
      background: "transparent",
      color: "var(--charcoal)",
      border: "1.25px solid currentColor"
    },
    "outline-light": {
      background: "transparent",
      color: "var(--white)",
      border: "1.25px solid var(--border-on-dark)"
    },
    accent: {
      background: "var(--butter)",
      color: "var(--navy)",
      border: "1.25px solid var(--butter)"
    }
  };
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: "ew-btn",
    style: {
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
      transition: "background var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out), opacity var(--dur-base) var(--ease-out)",
      ...sizes[size],
      ...variants[variant],
      ...style
    }
  }, rest), children);
}
function Badge({
  children,
  tone = "outline",
  style = {},
  ...rest
}) {
  const tones = {
    outline: {
      background: "transparent",
      color: "var(--charcoal)",
      border: "1px solid var(--border-subtle)"
    },
    navy: {
      background: "var(--navy)",
      color: "var(--white)",
      border: "1px solid var(--navy)"
    },
    accent: {
      background: "var(--butter)",
      color: "var(--navy)",
      border: "1px solid var(--butter)"
    },
    mist: {
      background: "var(--mist)",
      color: "var(--navy)",
      border: "1px solid var(--mist)"
    },
    light: {
      background: "var(--white)",
      color: "var(--charcoal)",
      border: "1px solid var(--border-subtle)"
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.4em",
      fontFamily: "var(--font-sans)",
      fontWeight: 400,
      fontSize: 10.5,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      padding: "0.45em 0.85em",
      borderRadius: "var(--radius-xs)",
      lineHeight: 1,
      ...tones[tone],
      ...style
    }
  }, rest), children);
}
function Field({
  label,
  type = "text",
  placeholder,
  as = "input",
  tone = "light",
  style = {},
  ...rest
}) {
  const onDark = tone === "dark";
  const Control = as;
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "block",
      ...style
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: "var(--font-sans)",
      fontSize: 10.5,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: onDark ? "var(--text-on-dark-mut)" : "var(--slate)",
      marginBottom: 6
    }
  }, label) : null, /*#__PURE__*/React.createElement(Control, _extends({
    type: as === "input" ? type : undefined,
    placeholder: placeholder,
    rows: as === "textarea" ? 3 : undefined,
    style: {
      width: "100%",
      boxSizing: "border-box",
      background: "transparent",
      border: "none",
      borderBottom: "1px solid " + (onDark ? "var(--border-on-dark)" : "var(--border-on-light)"),
      borderRadius: 0,
      padding: "10px 0",
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 15,
      color: onDark ? "var(--white)" : "var(--charcoal)",
      outline: "none"
    }
  }, rest)));
}
function PropertyCard({
  image,
  title,
  location,
  price,
  badge,
  beds,
  baths,
  area,
  onClick,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("article", {
    onClick: onClick,
    style: {
      display: "flex",
      flexDirection: "column",
      background: "var(--white)",
      border: "1px solid var(--border-subtle)",
      overflow: "hidden",
      cursor: onClick ? "pointer" : "default",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ew-grain",
    style: {
      position: "relative",
      aspectRatio: "4 / 3",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: title,
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 1.2s var(--ease-out)"
    }
  }), badge ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 14,
      left: 14
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "light"
  }, badge)) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px 22px 22px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 10.5,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: "var(--slate)"
    }
  }, location), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: "8px 0 0",
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: 26,
      lineHeight: 1.12,
      color: "var(--navy)",
      letterSpacing: "-0.01em"
    }
  }, title), (beds || baths || area) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 18,
      marginTop: 16,
      paddingTop: 16,
      borderTop: "1px solid var(--border-subtle)",
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 12.5,
      letterSpacing: "0.04em",
      color: "var(--text-body)"
    }
  }, beds ? /*#__PURE__*/React.createElement("span", null, beds, " Beds") : null, baths ? /*#__PURE__*/React.createElement("span", null, baths, " Baths") : null, area ? /*#__PURE__*/React.createElement("span", null, area) : null), price ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      fontFamily: "var(--font-serif)",
      fontWeight: 400,
      fontSize: 19,
      color: "var(--charcoal)"
    }
  }, price) : null));
}
Object.assign(window, {
  Wordmark,
  Label,
  Place,
  Button,
  Badge,
  Field,
  PropertyCard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/brand.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/chrome.jsx
try { (() => {
/* Elsewhere Living — site chrome: Nav + Footer */

function Nav({
  route,
  onNav,
  solid
}) {
  const navStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "26px 48px",
    color: solid ? "var(--charcoal)" : "var(--white)",
    borderBottom: solid ? "1px solid var(--border-subtle)" : "none",
    background: solid ? "var(--paper)" : "transparent"
  };
  const links = [["home", "Home"], ["listings", "Properties"], ["rentals", "Vacation Rentals"], ["about", "About"]];
  return /*#__PURE__*/React.createElement("nav", {
    style: navStyle
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => onNav("home"),
    style: {
      cursor: "pointer",
      display: "flex"
    }
  }, /*#__PURE__*/React.createElement(Wordmark, {
    size: 26,
    color: solid ? "var(--navy)" : "var(--white)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 34
    }
  }, links.map(([id, label]) => /*#__PURE__*/React.createElement("a", {
    key: id,
    onClick: () => onNav(id),
    style: {
      cursor: "pointer",
      fontFamily: "var(--font-sans)",
      fontWeight: 400,
      fontSize: 11.5,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: route === id ? solid ? "var(--navy)" : "var(--butter)" : "inherit",
      opacity: route === id ? 1 : 0.82,
      transition: "opacity var(--dur-base) var(--ease-out)"
    }
  }, label)), /*#__PURE__*/React.createElement(Button, {
    variant: solid ? "outline" : "outline-light",
    shape: "pill",
    size: "sm",
    onClick: () => onNav("contact")
  }, "Inquire")));
}
function Footer({
  onNav
}) {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: "var(--ink-black)",
      color: "var(--white)",
      padding: "72px 48px 40px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 48,
      maxWidth: 1200,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 320
    }
  }, /*#__PURE__*/React.createElement(Wordmark, {
    size: 34,
    color: "var(--white)"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 22,
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 14,
      lineHeight: 1.7,
      color: "var(--text-on-dark-mut)"
    }
  }, "Helping people discover, own, and experience extraordinary places beyond home."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement(Wordmark, {
    size: 20,
    color: "var(--text-on-dark-mut)"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 64,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(FooterCol, {
    title: "Explore",
    items: ["Properties", "Vacation Rentals", "Custom Homes", "Inquire"],
    onNav: onNav
  }), /*#__PURE__*/React.createElement(FooterCol, {
    title: "Company",
    items: ["About", "Our Pillars", "Testimonials", "Journal"],
    onNav: onNav
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ew-label",
    style: {
      color: "var(--text-on-dark-mut)"
    }
  }, "Contact"), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      padding: 0,
      margin: "18px 0 0",
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("li", {
    style: footLink
  }, "contact@elsewhere.living"), /*#__PURE__*/React.createElement("li", {
    style: footLink
  }, "WhatsApp +6692 999 3852"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "56px auto 0",
      paddingTop: 24,
      borderTop: "1px solid rgba(255,255,255,0.14)",
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...footLink,
      fontSize: 11,
      letterSpacing: "0.1em"
    }
  }, "\xA9 2026 Elsewhere Living. All rights reserved."), /*#__PURE__*/React.createElement("span", {
    style: {
      ...footLink,
      fontSize: 11,
      letterSpacing: "0.1em"
    }
  }, "Find Your Elsewhere.")));
}
const footLink = {
  fontFamily: "var(--font-sans)",
  fontWeight: 300,
  fontSize: 13.5,
  color: "var(--text-on-dark-mut)",
  cursor: "pointer"
};
function FooterCol({
  title,
  items,
  onNav
}) {
  const routeFor = it => {
    const k = it.toLowerCase();
    if (k.includes("propert")) return "listings";
    if (k.includes("rental")) return "rentals";
    if (k.includes("inquire") || k.includes("contact")) return "contact";
    if (k.includes("about") || k.includes("pillar") || k.includes("testimonial")) return "about";
    return "listings";
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ew-label",
    style: {
      color: "var(--text-on-dark-mut)"
    }
  }, title), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      padding: 0,
      margin: "18px 0 0",
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, items.map(it => /*#__PURE__*/React.createElement("li", {
    key: it,
    style: footLink,
    onClick: () => onNav && onNav(routeFor(it))
  }, it))));
}
Object.assign(window, {
  Nav,
  Footer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/chrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/data.js
try { (() => {
/* Elsewhere Living — sample listing data for the UI kit. */
window.LISTINGS = [{
  id: "cliffside-infinity",
  image: "../../assets/imagery/c-villa-pool.jpg",
  hero: "../../assets/imagery/c-villa-pool.jpg",
  location: "Koh Samui · Thailand",
  market: "Koh Samui",
  title: "Cliffside Infinity Villa",
  type: "Villa",
  beds: 4,
  baths: 5,
  area: "620 m²",
  price: "$2,400,000",
  badge: "New",
  blurb: "A teak-and-stone residence cantilevered over the Gulf of Thailand, with a 22-meter infinity edge dissolving into the horizon."
}, {
  id: "teak-pavilion",
  image: "../../assets/imagery/c-deck-sea.jpg",
  hero: "../../assets/imagery/c-deck-sea.jpg",
  location: "Phuket · Thailand",
  market: "Phuket",
  title: "Teak Pavilion Residence",
  type: "Villa",
  beds: 3,
  baths: 3,
  area: "410 m²",
  price: "$1,750,000",
  badge: "Off-Plan",
  blurb: "Open-air pavilion living wrapped in tropical hardwood, steps from a private stretch of Andaman coast."
}, {
  id: "midnight-bedroom-suite",
  image: "../../assets/imagery/c-ocean.jpg",
  hero: "../../assets/imagery/c-ocean.jpg",
  location: "Bali · Indonesia",
  market: "Bali",
  title: "Oceanfront Retreat",
  type: "Villa",
  beds: 5,
  baths: 5,
  area: "740 m²",
  price: "$3,100,000",
  badge: "Move-In Ready",
  blurb: "A meditative oceanfront retreat where every room opens to the sound of the surf."
}, {
  id: "jungle-canopy",
  image: "../../assets/imagery/c-chairs.jpg",
  hero: "../../assets/imagery/c-chairs.jpg",
  location: "Koh Samui · Thailand",
  market: "Koh Samui",
  title: "Canopy House",
  type: "Custom Home",
  beds: 4,
  baths: 4,
  area: "560 m²",
  price: "$1,980,000",
  badge: "Move-In Ready",
  blurb: "A bespoke commission set into the jungle canopy, designed with our trusted architects in Koh Samui."
}, {
  id: "water-garden",
  image: "../../assets/imagery/c-ocean.jpg",
  hero: "../../assets/imagery/c-ocean.jpg",
  location: "Dubai · UAE",
  market: "Dubai",
  title: "Marina Sky Residence",
  type: "Condominium",
  beds: 2,
  baths: 3,
  area: "240 m²",
  price: "$2,150,000",
  badge: "Off-Plan",
  blurb: "A high-floor residence with skyline-to-sea views — a quietly performing investment in a global city."
}, {
  id: "sky-penthouse",
  image: "../../assets/imagery/c-villa-pool.jpg",
  hero: "../../assets/imagery/c-villa-pool.jpg",
  location: "Bangkok · Thailand",
  market: "Bangkok",
  title: "Riverside Penthouse",
  type: "Condominium",
  beds: 3,
  baths: 4,
  area: "320 m²",
  price: "$2,680,000",
  badge: "New",
  blurb: "A penthouse above the Chao Phraya, where the city's energy meets a private sky terrace."
}];
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/data.js", error: String((e && e.message) || e) }); }

// ui_kits/website/screens.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Elsewhere Living — Listings, Property detail, Contact screens */

function PageHeader({
  label,
  title,
  sub
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ew-grain",
    style: {
      position: "relative",
      padding: "150px 48px 60px",
      overflow: "hidden",
      background: "var(--navy)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 2,
      maxWidth: 1200,
      margin: "0 auto",
      color: "var(--white)"
    }
  }, /*#__PURE__*/React.createElement(Label, {
    style: {
      color: "var(--mist)"
    }
  }, label), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: "18px 0 0",
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: 56,
      letterSpacing: "-0.01em",
      lineHeight: 1.05
    }
  }, title), sub ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "18px 0 0",
      maxWidth: 520,
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 15,
      lineHeight: 1.7,
      color: "var(--text-on-dark-mut)"
    }
  }, sub) : null));
}
function ListingsScreen({
  onOpen,
  label,
  title,
  sub
}) {
  const markets = ["All", "Koh Samui", "Phuket", "Bangkok", "Dubai", "Bali"];
  const [active, setActive] = React.useState("All");
  const shown = active === "All" ? window.LISTINGS : window.LISTINGS.filter(l => l.market === active);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHeader, {
    label: label || "Curated opportunities",
    title: title || "Properties",
    sub: sub || "Villas, condominiums, land and boutique resorts — each carefully selected for quality, location, design and long-term value."
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--paper)",
      padding: "44px 48px 104px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      flexWrap: "wrap",
      paddingBottom: 36,
      marginBottom: 44,
      borderBottom: "1px solid var(--border-subtle)"
    }
  }, markets.map(m => /*#__PURE__*/React.createElement("button", {
    key: m,
    onClick: () => setActive(m),
    style: {
      cursor: "pointer",
      fontFamily: "var(--font-sans)",
      fontSize: 11,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      padding: "0.7em 1.3em",
      borderRadius: "var(--radius-pill)",
      border: "1.25px solid " + (active === m ? "var(--navy)" : "var(--border-subtle)"),
      background: active === m ? "var(--navy)" : "transparent",
      color: active === m ? "var(--white)" : "var(--charcoal)",
      transition: "all var(--dur-base) var(--ease-out)"
    }
  }, m))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 28
    }
  }, shown.map(l => /*#__PURE__*/React.createElement(PropertyCard, _extends({
    key: l.id
  }, l, {
    onClick: () => onOpen(l.id)
  })))))));
}
function PropertyScreen({
  id,
  onNav,
  onOpen
}) {
  const l = window.LISTINGS.find(x => x.id === id) || window.LISTINGS[0];
  const more = window.LISTINGS.filter(x => x.id !== l.id).slice(0, 3);
  const facts = [["Type", l.type], ["Bedrooms", l.beds], ["Bathrooms", l.baths], ["Living area", l.area], ["Market", l.market]];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--paper)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ew-grain",
    style: {
      position: "relative",
      height: "72vh",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: l.hero,
    alt: l.title,
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(180deg, rgba(8,10,14,0.4) 0%, rgba(8,10,14,0.1) 40%, rgba(8,10,14,0.7) 100%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 48,
      bottom: 44,
      zIndex: 2,
      color: "var(--white)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "light"
  }, l.badge)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 11.5,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      opacity: 0.85
    }
  }, l.location), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: "10px 0 0",
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: 58,
      letterSpacing: "-0.01em",
      lineHeight: 1.02
    }
  }, l.title))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "80px 48px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: "1.5fr 1fr",
      gap: 72
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, "The residence"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "24px 0 0",
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: 27,
      lineHeight: 1.5,
      color: "var(--navy)",
      letterSpacing: "-0.01em"
    }
  }, l.blurb), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "28px 0 0",
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 15,
      lineHeight: 1.8,
      color: "var(--text-body)",
      maxWidth: "60ch"
    }
  }, "Through our trusted network of architects, designers and builders, every Elsewhere residence is considered for the life it makes possible \u2014 not only the address. Arrange a private viewing, in person or virtually, at a time that suits you."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      marginTop: 36
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "solid",
    shape: "pill",
    onClick: () => onNav("contact")
  }, "Inquire about this villa"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    shape: "pill",
    onClick: () => onNav("listings")
  }, "Back to properties"))), /*#__PURE__*/React.createElement("aside", null, /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid var(--border-subtle)",
      background: "var(--white)",
      padding: "30px 32px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 400,
      fontSize: 32,
      color: "var(--charcoal)"
    }
  }, l.price), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 11,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "var(--slate)",
      marginTop: 4
    }
  }, "Guide price"), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      padding: 0,
      margin: "26px 0 0"
    }
  }, facts.map(([k, v]) => /*#__PURE__*/React.createElement("li", {
    key: k,
    style: {
      display: "flex",
      justifyContent: "space-between",
      padding: "13px 0",
      borderTop: "1px solid var(--border-subtle)",
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 13.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--slate)",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      fontSize: 11
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--charcoal)"
    }
  }, v)))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "0 48px 104px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 56,
      borderTop: "1px solid var(--border-subtle)",
      marginBottom: 36
    }
  }, /*#__PURE__*/React.createElement(Label, null, "You may also like")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 28
    }
  }, more.map(m => /*#__PURE__*/React.createElement(PropertyCard, _extends({
    key: m.id
  }, m, {
    onClick: () => onOpen(m.id)
  })))))));
}
function ContactScreen() {
  const [sent, setSent] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    className: "ew-grain",
    style: {
      position: "relative",
      minHeight: "100vh",
      overflow: "hidden",
      display: "flex",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/imagery/c-villa-pool.jpg",
    alt: "",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "rgba(10,13,18,0.66)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 2,
      width: "100%",
      maxWidth: 560,
      margin: "0 auto",
      padding: "150px 32px 80px",
      color: "var(--white)",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement(Label, {
    style: {
      color: "var(--mist)"
    }
  }, "Start your elsewhere journey"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: "20px 0 10px",
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: 56,
      letterSpacing: "-0.01em"
    }
  }, "Contact Us"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 40px",
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 14.5,
      lineHeight: 1.7,
      color: "var(--text-on-dark-mut)"
    }
  }, "Tell us about the life you're imagining. We'll be in touch within one business day."), sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid var(--border-on-dark)",
      padding: "40px 32px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-serif)",
      fontStyle: "italic",
      fontSize: 24
    }
  }, "Thank you."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "12px 0 0",
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 14,
      color: "var(--text-on-dark-mut)"
    }
  }, "Your inquiry is on its way to the Elsewhere team.")) : /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setSent(true);
    },
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 26,
      textAlign: "left"
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Full name",
    tone: "dark",
    placeholder: "Your name"
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Email",
    type: "email",
    tone: "dark",
    placeholder: "you@email.com"
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Destination of interest",
    tone: "dark",
    placeholder: "Where in the world?"
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Message",
    as: "textarea",
    tone: "dark",
    placeholder: "Tell us about your elsewhere"
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    shape: "pill",
    size: "lg",
    style: {
      alignSelf: "center",
      marginTop: 8
    }
  }, "Send inquiry")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 44,
      display: "flex",
      flexDirection: "column",
      gap: 8,
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 13.5,
      color: "var(--text-on-dark-mut)"
    }
  }, /*#__PURE__*/React.createElement("span", null, "contact@elsewhere.living"), /*#__PURE__*/React.createElement("span", null, "WhatsApp +6692 999 3852"))));
}
function AboutScreen({
  onNav
}) {
  const pillars = [["Local Expertise", "Deep market knowledge combined with a global perspective across Southeast Asia and the Gulf."], ["Trust & Relationships", "Long-term partnerships built on transparency, discretion and exceptional service."], ["Freedom Through Ownership", "More options for living, investing, traveling and building wealth — wherever inspires you."]];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHeader, {
    label: "Our philosophy",
    title: "Live beyond home",
    sub: "Home is no longer limited to one place. Everyone deserves an elsewhere \u2014 a place that inspires them, restores them, and reflects the life they aspire to live."
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--paper)",
      padding: "104px 48px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 820,
      margin: "0 auto",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontStyle: "italic",
      fontSize: 32,
      lineHeight: 1.45,
      color: "var(--navy)",
      letterSpacing: "-0.01em"
    }
  }, "For some, that elsewhere is a beachfront villa in Koh Samui. For others, a penthouse in Bangkok, an investment in Dubai, or a private retreat in Bali."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "32px auto 0",
      maxWidth: "60ch",
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 15,
      lineHeight: 1.8,
      color: "var(--text-body)"
    }
  }, "Elsewhere Living is a boutique luxury real-estate and lifestyle company. We specialize in exceptional properties and curated lifestyle opportunities \u2014 villas, condominiums, land, boutique resorts and bespoke development \u2014 across the world's most sought-after destinations."))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--white)",
      padding: "0 48px 110px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1100,
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 48
    }
  }, pillars.map(([t, b]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      paddingTop: 32,
      borderTop: "1px solid var(--border-on-light)"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: 25,
      color: "var(--navy)"
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "14px 0 0",
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 14,
      lineHeight: 1.72,
      color: "var(--text-body)"
    }
  }, b))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--butter)",
      color: "var(--navy)",
      padding: "92px 48px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: "0 auto 28px",
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: 44,
      letterSpacing: "-0.01em",
      maxWidth: 600,
      lineHeight: 1.1
    }
  }, "Find your elsewhere"), /*#__PURE__*/React.createElement(Button, {
    variant: "solid",
    shape: "pill",
    size: "lg",
    onClick: () => onNav("contact")
  }, "Begin the conversation")));
}
Object.assign(window, {
  ListingsScreen,
  PropertyScreen,
  ContactScreen,
  AboutScreen,
  PageHeader
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/screens.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Label = __ds_scope.Label;

__ds_ns.Wordmark = __ds_scope.Wordmark;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.PropertyCard = __ds_scope.PropertyCard;

})();
