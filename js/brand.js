function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Elsewhere Living — brand primitives (extends the design-system kit). */

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

/* Brandmark — the elegant cursive "e" monogram (matches the favicon).
   Set in the official logotype face (The Silver Editorial, italic) so it is
   pixel-identical to the favicon glyph; inherits color via the `color` prop. */
function Brandmark({
  size = 38,
  color = "currentColor",
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: "ew-brandmark",
    role: "img",
    "aria-label": "Elsewhere Living",
    style: {
      fontFamily: "var(--font-logo)",
      fontStyle: "italic",
      fontWeight: 400,
      fontSize: typeof size === "number" ? size + "px" : size,
      lineHeight: 1,
      display: "inline-block",
      color,
      ...style
    }
  }, rest), "e");
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
    className: "ew-btn ew-btn--hover",
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
      marginBottom: 8
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
      padding: "11px 0",
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 15,
      color: onDark ? "var(--white)" : "var(--charcoal)",
      outline: "none",
      resize: as === "textarea" ? "vertical" : undefined
    }
  }, rest)));
}

/* Heart / save toggle. */
function HeartIcon({
  filled
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "17",
    viewBox: "0 0 24 24",
    fill: filled ? "currentColor" : "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    style: {
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 20.5S3.5 14.6 3.5 8.9A4.4 4.4 0 0 1 12 6.6a4.4 4.4 0 0 1 8.5 2.3c0 5.7-8.5 11.6-8.5 11.6Z",
    strokeLinejoin: "round"
  }));
}
function SaveButton({
  active,
  onToggle,
  tone = "light"
}) {
  const onDark = tone === "dark";
  return /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onToggle();
    },
    "aria-label": active ? "Remove from saved" : "Save property",
    title: active ? "Saved" : "Save",
    style: {
      width: 40,
      height: 40,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "var(--radius-pill)",
      cursor: "pointer",
      lineHeight: 0,
      background: active ? "var(--butter)" : onDark ? "rgba(20,22,28,0.42)" : "rgba(255,255,255,0.9)",
      color: active ? "var(--navy)" : onDark ? "var(--white)" : "var(--charcoal)",
      border: active ? "1px solid var(--butter)" : "1px solid " + (onDark ? "var(--border-on-dark)" : "var(--border-subtle)"),
      backdropFilter: "blur(6px)",
      transition: "all var(--dur-base) var(--ease-out)"
    }
  }, /*#__PURE__*/React.createElement(HeartIcon, {
    filled: active
  }));
}

/* Price shown in USD. When a listing carries an original (non-USD) price,
   the amount gets a dotted underline + info dot, with a hover tooltip naming
   the original currency. Listings already priced in USD render unchanged. */
function PriceTag({
  value,
  original,
  currency,
  size = 19,
  color = "var(--charcoal)",
  align = "left"
}) {
  const [show, setShow] = React.useState(false);
  const hasOrig = !!original;
  if (!hasOrig) {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-serif)",
        fontWeight: 400,
        fontSize: size,
        color
      }
    }, value);
  }
  const tipPos = align === "right" ? {
    right: 0
  } : {
    left: 0
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      cursor: "help"
    },
    tabIndex: 0,
    onMouseEnter: () => setShow(true),
    onMouseLeave: () => setShow(false),
    onFocus: () => setShow(true),
    onBlur: () => setShow(false)
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 400,
      fontSize: size,
      color,
      borderBottom: "1px dotted var(--stone)",
      paddingBottom: 1
    }
  }, value), /*#__PURE__*/React.createElement(Icon, {
    name: "info",
    size: Math.round(size * 0.72),
    color: "var(--slate)",
    stroke: 1.5
  }), show ? /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: "absolute",
      bottom: "calc(100% + 9px)",
      ...tipPos,
      zIndex: 50,
      whiteSpace: "nowrap",
      background: "var(--navy)",
      color: "var(--white)",
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 11.5,
      letterSpacing: "0.04em",
      lineHeight: 1.4,
      padding: "9px 13px",
      boxShadow: "0 14px 34px -14px rgba(15,22,40,0.6)",
      pointerEvents: "none"
    }
  }, "Shown in USD \u2014 originally ", original, currency ? " (" + currency + ")" : "", /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: "100%",
      ...tipPos,
      marginLeft: align === "right" ? 0 : 16,
      marginRight: align === "right" ? 16 : 0,
      width: 0,
      height: 0,
      borderLeft: "5px solid transparent",
      borderRight: "5px solid transparent",
      borderTop: "6px solid var(--navy)"
    }
  })) : null);
}

/* Property card with hover zoom + save toggle. */
function PropertyCard({
  item,
  onOpen,
  saved,
  onToggleSave,
  style = {}
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("article", {
    onClick: () => onOpen && onOpen(item),
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "flex",
      flexDirection: "column",
      background: "var(--white)",
      border: "1px solid var(--border-subtle)",
      overflow: "hidden",
      cursor: onOpen ? "pointer" : "default",
      transition: "box-shadow var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)",
      boxShadow: hover ? "0 26px 60px -38px rgba(15,22,40,0.55)" : "0 0 0 rgba(0,0,0,0)",
      transform: hover ? "translateY(-3px)" : "none",
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
    src: item.image,
    alt: item.title,
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 1.4s var(--ease-out)",
      transform: hover ? "scale(1.07)" : "scale(1)"
    }
  }), item.status ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 14,
      left: 14,
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "light"
  }, item.status)) : null, onToggleSave ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 12,
      right: 12,
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement(SaveButton, {
    active: saved,
    onToggle: () => onToggleSave(item.id)
  })) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px 22px 22px",
      display: "flex",
      flexDirection: "column",
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 10.5,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: "var(--slate)"
    }
  }, item.location), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: "8px 0 0",
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: 26,
      lineHeight: 1.12,
      color: "var(--navy)",
      letterSpacing: "-0.01em"
    }
  }, item.title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px 16px",
      marginTop: 16,
      paddingTop: 16,
      borderTop: "1px solid var(--border-subtle)",
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 12.5,
      letterSpacing: "0.03em",
      color: "var(--text-body)"
    }
  }, item.type === "Land" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plot",
    size: 15,
    color: "var(--slate)",
    stroke: 1.4
  }), " ", item.plot), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "view",
    size: 15,
    color: "var(--slate)",
    stroke: 1.4
  }), " ", window.viewText(item.view))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bed",
    size: 15,
    color: "var(--slate)",
    stroke: 1.4
  }), " ", item.bedsLabel || item.beds), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bath",
    size: 15,
    color: "var(--slate)",
    stroke: 1.4
  }), " ", item.baths), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "interior",
    size: 15,
    color: "var(--slate)",
    stroke: 1.4
  }), " ", item.interior))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(PriceTag, {
    value: item.price,
    original: item.priceOriginal,
    currency: item.priceCurrency,
    size: 19
  }), item.yield ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 10.5,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "var(--slate)"
    }
  }, item.type === "Land" ? item.yield : item.yield + " yield") : null)));
}

/* Section eyebrow + serif title block, reused across pages. */
function SectionHead({
  eyebrow,
  title,
  intro,
  align = "left",
  onDark = false,
  max = 720,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: max,
      marginLeft: align === "center" ? "auto" : 0,
      marginRight: align === "center" ? "auto" : 0,
      textAlign: align,
      ...style
    }
  }, eyebrow ? /*#__PURE__*/React.createElement("div", {
    style: {
      color: onDark ? "var(--text-on-dark-mut)" : "var(--slate)",
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(Label, null, eyebrow)) : null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: "clamp(2rem, 4vw, 3.1rem)",
      lineHeight: 1.08,
      letterSpacing: "-0.015em",
      color: onDark ? "var(--white)" : "var(--navy)"
    }
  }, title), intro ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "22px 0 0",
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 17,
      lineHeight: 1.7,
      color: onDark ? "var(--text-on-dark-mut)" : "var(--text-body)",
      marginLeft: align === "center" ? "auto" : 0,
      marginRight: align === "center" ? "auto" : 0,
      maxWidth: align === "center" ? 620 : "none"
    }
  }, intro) : null);
}
Object.assign(window, {
  Wordmark,
  Label,
  Place,
  Button,
  Badge,
  Field,
  HeartIcon,
  SaveButton,
  PropertyCard,
  PriceTag,
  SectionHead
});