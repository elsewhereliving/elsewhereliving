/* Elsewhere Living — Home */

function Hero({
  onNav
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: "relative",
      minHeight: "100svh",
      display: "flex",
      alignItems: "flex-end",
      overflow: "hidden",
      background: "var(--ink-black)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    className: "ew-kenburns",
    src: "assets/imagery/hero-banner.jpg",
    alt: "",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      zIndex: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(180deg, rgba(10,12,16,0) 45%, rgba(10,12,16,0.5) 100%)",
      zIndex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 2,
      width: "100%",
      maxWidth: 1320,
      margin: "0 auto",
      padding: "0 clamp(20px, 4vw, 56px) clamp(56px, 8vh, 104px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "reveal is-in",
    style: {
      color: "var(--text-on-dark-mut)",
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement(Label, null, "Living")), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      maxWidth: 1000,
      color: "var(--white)",
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: "clamp(2.7rem, 6.4vw, 6rem)",
      lineHeight: 0.98,
      letterSpacing: "-0.02em"
    }
  }, "Your next chapter", /*#__PURE__*/React.createElement("br", null), "begins ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: "italic",
      fontWeight: 200
    }
  }, "elsewhere"), "."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "28px 0 0",
      maxWidth: 540,
      color: "rgba(255,255,255,0.84)",
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 18,
      lineHeight: 1.65
    }
  }, "A boutique agency placing global citizens into extraordinary homes across Thailand, Bali and the UAE \u2014 properties chosen to be lived in, and to perform."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 14,
      marginTop: 38
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "lg",
    shape: "pill",
    onClick: () => onNav("properties")
  }, "Browse properties"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline-light",
    size: "lg",
    shape: "pill",
    onClick: () => onNav("about")
  }, "Why elsewhere"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: "clamp(20px, 4vw, 56px)",
      bottom: "clamp(56px, 8vh, 104px)",
      zIndex: 2,
      display: "flex",
      alignItems: "center",
      gap: 12,
      color: "rgba(255,255,255,0.7)",
      fontFamily: "var(--font-sans)",
      fontSize: 10.5,
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      writingMode: "vertical-rl"
    },
    className: "ew-scroll-hint"
  }, "Scroll", /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      height: 44,
      background: "rgba(255,255,255,0.5)"
    }
  })));
}
function Services({
  onNav
}) {
  const items = [{
    i: "home",
    t: "Buy & Sell",
    b: "Villas, land and condominiums across our markets — each one personally vetted for design, location and the numbers behind it.",
    cta: "Browse properties",
    route: "properties"
  }, {
    i: "key",
    t: "Custom Homes",
    b: "Build from nothing. We handle the land, the architecture, construction, interiors and furnishing — then hand you the keys.",
    cta: "Explore custom homes",
    route: "custom"
  }, {
    i: "sun",
    t: "Vacation Rentals",
    b: "Short stays of 30 days or less in the same calibre of home — live the life here before you decide to make it yours.",
    cta: "See rentals",
    route: "rentals"
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--mist)",
      padding: "clamp(72px, 10vw, 130px) clamp(20px, 4vw, 56px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "reveal",
    style: {
      marginBottom: 54
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "What we do",
    title: "Three ways to find your elsewhere.",
    intro: "Whether you're buying, building from the ground up, or simply staying a while \u2014 we look after the whole journey.",
    max: 720
  })), /*#__PURE__*/React.createElement("div", {
    className: "reveal",
    "data-grid": "3",
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "clamp(28px, 4vw, 56px)"
    }
  }, items.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.t,
    style: {
      borderTop: "1px solid var(--border-on-light)",
      paddingTop: 26,
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: s.i,
    size: 30,
    color: "var(--navy)",
    stroke: 1.4
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: "22px 0 0",
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: "clamp(1.5rem, 2.6vw, 2rem)",
      lineHeight: 1.1,
      letterSpacing: "-0.01em",
      color: "var(--navy)"
    }
  }, s.t), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "14px 0 22px",
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 15,
      lineHeight: 1.72,
      color: "var(--text-body)",
      flex: 1
    }
  }, s.b), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNav(s.route),
    style: {
      alignSelf: "flex-start",
      cursor: "pointer",
      background: "transparent",
      border: "none",
      padding: 0,
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      fontFamily: "var(--font-sans)",
      fontSize: 11.5,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "var(--navy)"
    },
    className: "ew-textlink"
  }, s.cta, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15
    }
  }, "\u2192")))))));
}
function Destinations({
  onNav
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--navy)",
      color: "var(--white)",
      padding: "clamp(72px, 10vw, 130px) clamp(20px, 4vw, 56px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "reveal",
    style: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: 24,
      marginBottom: 54
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    onDark: true,
    eyebrow: "Where we sell",
    title: "The most sought-after places to own.",
    max: 620
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      maxWidth: 320,
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 15,
      lineHeight: 1.7,
      color: "var(--text-on-dark-mut)"
    }
  }, "We specialise deeply in five markets \u2014 enough to know every street, not so many that we lose the thread.")), /*#__PURE__*/React.createElement("div", {
    className: "reveal",
    style: {
      borderTop: "1px solid var(--border-on-dark)"
    }
  }, window.MARKETS.map((m, i) => /*#__PURE__*/React.createElement("button", {
    key: m.name,
    onClick: () => onNav("properties", {
      market: m.name
    }),
    className: "ew-dest-row",
    style: {
      width: "100%",
      textAlign: "left",
      background: "transparent",
      border: "none",
      borderBottom: "1px solid var(--border-on-dark)",
      cursor: "pointer",
      color: "var(--white)",
      padding: "26px 6px",
      display: "grid",
      gridTemplateColumns: "auto 1fr auto",
      gap: 24,
      alignItems: "center",
      transition: "padding var(--dur-base) var(--ease-out)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      letterSpacing: "0.16em",
      color: "var(--navy-60)"
    }
  }, "0", i + 1), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "baseline",
      gap: "10px 18px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: "clamp(1.7rem, 3.4vw, 2.7rem)",
      letterSpacing: "-0.01em"
    }
  }, m.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 12.5,
      letterSpacing: "0.06em",
      color: "var(--text-on-dark-mut)"
    }
  }, m.country, " \u2014 ", m.note)), /*#__PURE__*/React.createElement("span", {
    className: "ew-dest-arrow",
    style: {
      fontSize: 22,
      opacity: 0.6,
      transition: "transform var(--dur-base) var(--ease-out), opacity var(--dur-base) var(--ease-out)"
    }
  }, "\u2192"))))));
}
function WhereWeRent({
  onNav
}) {
  const rentMarkets = [{
    name: "Koh Samui",
    img: "assets/imagery/samui-card.jpg"
  }, {
    name: "Phuket",
    img: "assets/imagery/phuket-card.jpg"
  }, {
    name: "Bali",
    img: "assets/imagery/bali-card.jpg"
  }, {
    name: "Lombok",
    img: "https://www.tampahhills.com/wp-content/uploads/2025/08/Villa-Kala-SoMe-2025-@solen_studios-2.jpg"
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--paper)",
      padding: "clamp(72px, 10vw, 130px) clamp(20px, 4vw, 56px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "reveal",
    style: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: 24,
      marginBottom: 40
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Where we rent",
    title: "Stay a while, wherever we host.",
    max: 640
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "md",
    shape: "pill",
    onClick: () => onNav("rentals")
  }, "See all rentals")), /*#__PURE__*/React.createElement("div", {
    className: "reveal",
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: 16
    }
  }, rentMarkets.map(m => /*#__PURE__*/React.createElement("button", {
    key: m.name,
    onClick: () => onNav("rentals"),
    className: "ew-rent-tile ew-grain",
    style: {
      position: "relative",
      aspectRatio: "3 / 4",
      overflow: "hidden",
      border: "none",
      padding: 0,
      cursor: "pointer",
      background: "var(--navy)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: m.img,
    alt: m.name,
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
      background: "linear-gradient(180deg, rgba(10,12,18,0.05) 35%, rgba(10,12,18,0.66))"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 22,
      right: 22,
      bottom: 22,
      textAlign: "left"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 10,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: "rgba(255,255,255,0.75)",
      marginBottom: 8
    }
  }, "Vacation rentals"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: "clamp(1.5rem, 2.4vw, 2.1rem)",
      letterSpacing: "-0.01em",
      color: "var(--white)"
    }
  }, m.name), /*#__PURE__*/React.createElement("span", {
    className: "ew-rent-arrow",
    style: {
      color: "var(--butter)",
      fontSize: 19,
      transition: "transform var(--dur-base) var(--ease-out)"
    }
  }, "\u2192"))))))));
}
function FeaturedListings({
  onOpen,
  onNav,
  saved,
  onToggleSave
}) {
  const items = window.LISTINGS.slice(0, 3);
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--paper)",
      padding: "clamp(72px, 10vw, 130px) clamp(20px, 4vw, 56px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "reveal",
    style: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: 24,
      marginBottom: 50
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "The collection",
    title: "A few homes worth crossing oceans for.",
    max: 640
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "md",
    shape: "pill",
    onClick: () => onNav("properties")
  }, "View all properties")), /*#__PURE__*/React.createElement("div", {
    className: "reveal",
    "data-grid": "3",
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 26
    }
  }, items.map(it => /*#__PURE__*/React.createElement(PropertyCard, {
    key: it.id,
    item: it,
    onOpen: onOpen,
    saved: saved.includes(it.id),
    onToggleSave: onToggleSave
  })))));
}
function Pillars() {
  return /*#__PURE__*/React.createElement("section", {
    className: "ew-grain",
    style: {
      position: "relative",
      color: "var(--white)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: window.PHOTO.wave,
    alt: "",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      zIndex: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(180deg, rgba(10,12,18,0.82), rgba(10,12,18,0.74))",
      zIndex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 2,
      maxWidth: 1320,
      margin: "0 auto",
      padding: "clamp(72px, 10vw, 130px) clamp(20px, 4vw, 56px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "reveal",
    style: {
      marginBottom: 60
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    onDark: true,
    eyebrow: "What guides us",
    title: "Three things we never compromise.",
    max: 640
  })), /*#__PURE__*/React.createElement("div", {
    className: "reveal",
    "data-grid": "3",
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "clamp(28px, 4vw, 56px)"
    }
  }, window.PILLARS.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.n,
    style: {
      borderTop: "1px solid var(--border-on-dark)",
      paddingTop: 26
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: 15,
      color: "var(--butter)",
      marginBottom: 18
    }
  }, p.n), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: "clamp(1.5rem, 2.6vw, 2rem)",
      lineHeight: 1.1,
      letterSpacing: "-0.01em"
    }
  }, p.title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "16px 0 0",
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 15,
      lineHeight: 1.72,
      color: "rgba(255,255,255,0.78)"
    }
  }, p.body))))));
}
function WhoWeServe() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--mist)",
      color: "var(--navy)",
      padding: "clamp(72px, 10vw, 130px) clamp(20px, 4vw, 56px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "reveal",
    style: {
      maxWidth: 1000,
      margin: "0 auto",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--navy)",
      opacity: 0.6,
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement(Label, null, "Who we serve")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: "clamp(1.7rem, 3.6vw, 2.9rem)",
      lineHeight: 1.2,
      letterSpacing: "-0.015em",
      textWrap: "balance"
    }
  }, "Our clients are global citizens who understand that true wealth isn't only financial. They're seeking the freedom to live on their own terms.")));
}
function TestimonialBand() {
  const items = window.TESTIMONIALS;
  const [idx, setIdx] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  React.useEffect(() => {
    if (paused || items.length < 2) return;
    const id = setInterval(() => setIdx(i => (i + 1) % items.length), 7000);
    return () => clearInterval(id);
  }, [paused, items.length]);
  const t = items[idx];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--paper)",
      padding: "clamp(72px, 10vw, 130px) clamp(20px, 4vw, 56px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "reveal",
    style: {
      maxWidth: 920,
      margin: "0 auto",
      textAlign: "center"
    },
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--slate)",
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement(Label, null, "Testimonial")), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--butter)",
      letterSpacing: "0.3em",
      fontSize: 18,
      marginBottom: 28,
      filter: "drop-shadow(0 1px 0 rgba(0,0,0,0.12))"
    }
  }, "\u2605\u2605\u2605\u2605\u2605"), /*#__PURE__*/React.createElement("div", {
    key: idx,
    className: "ew-testi-fade"
  }, /*#__PURE__*/React.createElement("blockquote", {
    style: {
      margin: 0,
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: "clamp(1.5rem, 3vw, 2.4rem)",
      lineHeight: 1.32,
      letterSpacing: "-0.01em",
      color: "var(--navy)",
      textWrap: "balance"
    }
  }, "\u201C", t.quote, "\u201D"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32,
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: "var(--slate)"
    }
  }, t.name, " \u2014 ", t.place)), items.length > 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      justifyContent: "center",
      marginTop: 38
    }
  }, items.map((it, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    className: "ew-testi-dot",
    "aria-current": i === idx,
    "aria-label": "Show testimonial from " + it.name,
    onClick: () => setIdx(i)
  })))));
}
function CTABand({
  onNav
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "ew-grain ew-scrim",
    style: {
      position: "relative",
      overflow: "hidden",
      color: "var(--white)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/imagery/cta-journey.jpg",
    alt: "",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      zIndex: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(180deg, rgba(10,12,16,0.45), rgba(10,12,16,0.62))",
      zIndex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "reveal",
    style: {
      position: "relative",
      zIndex: 2,
      maxWidth: 880,
      margin: "0 auto",
      padding: "clamp(80px, 12vw, 170px) clamp(20px, 4vw, 56px)",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: "clamp(2.2rem, 5vw, 4rem)",
      lineHeight: 1.04,
      letterSpacing: "-0.02em"
    }
  }, "Start your ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: "italic"
    }
  }, "elsewhere"), " journey."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "24px auto 0",
      maxWidth: 520,
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 17,
      lineHeight: 1.7,
      color: "rgba(255,255,255,0.85)"
    }
  }, "A short, honest conversation \u2014 no obligation. Tell us what your elsewhere looks like and we'll take it from there."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 14,
      justifyContent: "center",
      marginTop: 38
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "lg",
    shape: "pill",
    onClick: () => onNav("contact")
  }, "Begin the conversation"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline-light",
    size: "lg",
    shape: "pill",
    onClick: () => onNav("properties")
  }, "See the collection"))));
}
function HomeScreen({
  onNav,
  onOpen,
  saved,
  onToggleSave
}) {
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(Hero, {
    onNav: onNav
  }), /*#__PURE__*/React.createElement(FeaturedListings, {
    onOpen: onOpen,
    onNav: onNav,
    saved: saved,
    onToggleSave: onToggleSave
  }), /*#__PURE__*/React.createElement(Destinations, {
    onNav: onNav
  }), /*#__PURE__*/React.createElement(WhereWeRent, {
    onNav: onNav
  }), /*#__PURE__*/React.createElement(Services, {
    onNav: onNav
  }), /*#__PURE__*/React.createElement(Pillars, null), /*#__PURE__*/React.createElement(TestimonialBand, null), /*#__PURE__*/React.createElement(CTABand, {
    onNav: onNav
  }));
}
Object.assign(window, {
  HomeScreen
});