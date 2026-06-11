/* Elsewhere Living — Custom Homes screen (end-to-end build service) */

function CustomHomesScreen({
  onNav
}) {
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(PageHeader, {
    eyebrow: "Custom Homes",
    title: "Build it from nothing. We'll be with you for all of it.",
    intro: "From the first plot of land to the last cushion, we manage the entire journey of creating your home \u2014 so you can simply imagine it, then arrive.",
    image: window.PHOTO.pool
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--paper)",
      padding: "clamp(72px, 10vw, 130px) clamp(20px, 4vw, 56px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "reveal",
    style: {
      maxWidth: 980,
      margin: "0 auto",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--slate)",
      marginBottom: 26
    }
  }, /*#__PURE__*/React.createElement(Label, null, "Guided from the ground up")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: "clamp(1.8rem, 3.8vw, 3rem)",
      lineHeight: 1.18,
      letterSpacing: "-0.015em",
      color: "var(--navy)",
      textWrap: "balance"
    }
  }, "Most builds mean juggling agents, architects and contractors across languages and time zones. We start you on the right ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: "italic"
    }
  }, "land"), " \u2014 then introduce the people we trust to bring it to life."))), /*#__PURE__*/React.createElement("section", {
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
      marginBottom: 56
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    onDark: true,
    eyebrow: "How it works",
    title: "Six stages. We guide you through them.",
    max: 640
  })), /*#__PURE__*/React.createElement("div", {
    className: "reveal",
    "data-grid": "3",
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "clamp(28px, 4vw, 52px)"
    }
  }, window.CUSTOM_STEPS.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.n,
    style: {
      borderTop: "1px solid var(--border-on-dark)",
      paddingTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: 15,
      color: "var(--butter)",
      marginBottom: 16
    }
  }, s.n), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: "clamp(1.4rem, 2.4vw, 1.9rem)",
      lineHeight: 1.12,
      letterSpacing: "-0.01em"
    }
  }, s.t), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "14px 0 0",
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 14.5,
      lineHeight: 1.72,
      color: "rgba(255,255,255,0.78)"
    }
  }, s.b)))))), /*#__PURE__*/React.createElement("section", {
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
      marginBottom: 50
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Where we build",
    title: "Two islands we know intimately.",
    intro: "We build where we have deep roots, trusted crews, and the land worth building on.",
    max: 680
  })), /*#__PURE__*/React.createElement("div", {
    className: "reveal",
    "data-grid": "split",
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 26
    }
  }, window.CUSTOM_LOCATIONS.map(loc => /*#__PURE__*/React.createElement("article", {
    key: loc.market,
    style: {
      background: "var(--white)",
      border: "1px solid var(--border-subtle)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ew-grain",
    style: {
      position: "relative",
      aspectRatio: "16 / 10",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: loc.image,
    alt: loc.market,
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
      background: "linear-gradient(180deg, rgba(15,22,40,0) 40%, rgba(15,22,40,0.62))"
    }
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      position: "absolute",
      left: 24,
      bottom: 20,
      margin: 0,
      color: "var(--white)",
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
      letterSpacing: "-0.01em"
    }
  }, "( ", loc.market, " )")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "26px 26px 28px",
      display: "flex",
      flexDirection: "column",
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 15,
      lineHeight: 1.7,
      color: "var(--text-body)",
      flex: 1
    }
  }, loc.note), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22,
      paddingTop: 20,
      borderTop: "1px solid var(--border-subtle)",
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 10.5,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: "var(--slate)"
    }
  }, "Total budget from"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 400,
      fontSize: "clamp(1.5rem, 2.4vw, 2rem)",
      color: "var(--navy)"
    }
  }, loc.from)))))), /*#__PURE__*/React.createElement("p", {
    className: "reveal",
    style: {
      margin: "26px 0 0",
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 13.5,
      color: "var(--slate)",
      textAlign: "center"
    }
  }, "Budgets are all-in \u2014 land, design, construction, interiors and furnishing. We'll model your exact figure before anything begins."))), /*#__PURE__*/React.createElement("section", {
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
      marginBottom: 52
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    onDark: true,
    eyebrow: "Who builds it",
    eyebrow: "How we work together",
    title: "We help you find the land \u2014 then introduce you to the team who builds on it.",
    intro: "Our role starts at the ground. We help you secure the right plot, then introduce you to architecture, construction and interior partners who know these islands \u2014 steep hillsides, tropical rain, salt air and tricky logistics \u2014 and have built through all of it. We stay close through the early steps, when the decisions matter most.",
    max: 800
  })), /*#__PURE__*/React.createElement("div", {
    className: "reveal",
    style: {
      maxWidth: 760,
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid var(--border-on-dark)",
      padding: "16px 30px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 11,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: "var(--butter)"
    }
  }, "You"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: 17,
      color: "var(--white)"
    }
  }, "The buyer")), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 36,
      background: "var(--border-on-dark)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid var(--butter)",
      background: "rgba(247,242,160,0.05)",
      padding: "26px 38px",
      textAlign: "center",
      maxWidth: 480
    }
  }, /*#__PURE__*/React.createElement(Wordmark, {
    size: 34,
    color: "var(--white)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "8px 0 0",
      fontFamily: "var(--font-sans)",
      fontSize: 10.5,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: "var(--butter)"
    }
  }, "We guide the start"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "16px 0 0",
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 14.5,
      lineHeight: 1.7,
      color: "rgba(255,255,255,0.82)"
    }
  }, "We help you buy the right land and introduce you to the right people \u2014 staying alongside you, especially through the early decisions.")), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 36,
      background: "var(--border-on-dark)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginBottom: 16,
      fontFamily: "var(--font-sans)",
      fontSize: 10.5,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color: "var(--butter)"
    }
  }, "Hand in hand \u2014 often at the same time"), /*#__PURE__*/React.createElement("div", {
    "data-grid": "split",
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 16
    }
  }, [{
    r: "Land purchase",
    n: "Secure the right plot with us"
  }, {
    r: "Architect consultation",
    n: "Often first — so the design shapes which land you choose"
  }].map(p => /*#__PURE__*/React.createElement("div", {
    key: p.r,
    style: {
      border: "1px solid var(--border-on-dark)",
      borderTop: "2px solid var(--butter)",
      padding: "20px 18px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: "clamp(1.1rem, 1.8vw, 1.35rem)",
      lineHeight: 1.15,
      color: "var(--white)"
    }
  }, p.r), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 12.5,
      lineHeight: 1.55,
      color: "rgba(255,255,255,0.62)"
    }
  }, p.n)))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "16px 0 0",
      maxWidth: 540,
      marginLeft: "auto",
      marginRight: "auto",
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 13.5,
      lineHeight: 1.7,
      color: "rgba(255,255,255,0.6)",
      textAlign: "center"
    }
  }, "An architect can help you choose the plot that fits the home you imagine \u2014 so design and land are decided together, not one after the other.")), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 36,
      background: "var(--border-on-dark)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    "data-grid": "split",
    style: {
      width: "100%",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 16
    }
  }, [{
    r: "Construction company",
    n: "Built for island terrain"
  }, {
    r: "Interior designer",
    n: "Furnished, turnkey"
  }].map(p => /*#__PURE__*/React.createElement("div", {
    key: p.r,
    style: {
      border: "1px solid var(--border-on-dark)",
      padding: "20px 18px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: "clamp(1.1rem, 1.8vw, 1.35rem)",
      lineHeight: 1.15,
      color: "var(--white)"
    }
  }, p.r), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 12.5,
      lineHeight: 1.55,
      color: "rgba(255,255,255,0.62)"
    }
  }, p.n)))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "30px 0 0",
      maxWidth: 540,
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 13.5,
      lineHeight: 1.7,
      color: "rgba(255,255,255,0.6)",
      textAlign: "center"
    }
  }, "From the first plot to the final furnishing, you're introduced to a trusted local team \u2014 and we stay with you through the start of the journey.")))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--mist)",
      color: "var(--navy)",
      padding: "clamp(64px, 9vw, 110px) clamp(20px, 4vw, 56px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "reveal",
    style: {
      marginBottom: 40
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Always included",
    title: "Everything, handled.",
    max: 620
  })), /*#__PURE__*/React.createElement("div", {
    className: "reveal",
    "data-grid": "3",
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "16px 40px"
    }
  }, [{
    l: "Plot sourcing & due diligence",
    i: "plot"
  }, {
    l: "Architecture & 3D visuals",
    i: "home"
  }, {
    l: "Build project management",
    i: "check"
  }, {
    l: "Interior design",
    i: "sofa"
  }, {
    l: "Furniture & art sourcing",
    i: "sparkles"
  }, {
    l: "Styled, turnkey handover",
    i: "pin"
  }].map(f => /*#__PURE__*/React.createElement("div", {
    key: f.l,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "16px 0",
      borderBottom: "1px solid rgba(21,38,68,0.14)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: f.i,
    size: 20,
    color: "var(--navy)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 15.5
    }
  }, f.l)))))), /*#__PURE__*/React.createElement("section", {
    className: "ew-grain ew-scrim",
    style: {
      position: "relative",
      overflow: "hidden",
      color: "var(--white)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/imagery/custom-cta-render.jpg",
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
      background: "linear-gradient(180deg, rgba(10,12,16,0.45), rgba(10,12,16,0.64))",
      zIndex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "reveal",
    style: {
      position: "relative",
      zIndex: 2,
      maxWidth: 860,
      margin: "0 auto",
      padding: "clamp(80px, 12vw, 160px) clamp(20px, 4vw, 56px)",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: "clamp(2.1rem, 4.6vw, 3.6rem)",
      lineHeight: 1.06,
      letterSpacing: "-0.02em"
    }
  }, "Tell us the home you see."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "22px auto 0",
      maxWidth: 520,
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 17,
      lineHeight: 1.7,
      color: "rgba(255,255,255,0.85)"
    }
  }, "Share the rough shape of your dream and your budget \u2014 we'll come back with land options and a realistic plan."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 14,
      justifyContent: "center",
      marginTop: 36
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "lg",
    shape: "pill",
    onClick: () => onNav("contact")
  }, "Start a custom build"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline-light",
    size: "lg",
    shape: "pill",
    onClick: () => onNav("properties", {
      type: "Land"
    })
  }, "See available land")))));
}
Object.assign(window, {
  CustomHomesScreen
});