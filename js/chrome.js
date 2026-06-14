/* Elsewhere Living — site chrome: Nav + Footer */

const NAV_LINKS = [{
  route: "home",
  label: "Home"
}, {
  route: "properties",
  label: "Properties"
}, {
  route: "custom",
  label: "Custom Homes"
}, {
  route: "rentals",
  label: "Vacation Rentals"
}, {
  route: "about",
  label: "About"
}, {
  route: "contact",
  label: "Contact"
}];
function Nav({
  route,
  onNav,
  savedCount,
  transparent
}) {
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, {
      passive: true
    });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  React.useEffect(() => {
    setMenuOpen(false);
  }, [route]);

  // On the hero, nav is light (white text) until scrolled; elsewhere it's solid.
  const solid = !transparent || scrolled;
  const fg = solid ? "var(--charcoal)" : "var(--white)";
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("header", {
    style: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 200,
      transition: "background var(--dur-slow) var(--ease-out), border-color var(--dur-slow) var(--ease-out)",
      background: solid ? "rgba(239,239,239,0.86)" : "transparent",
      backdropFilter: solid ? "blur(14px)" : "none",
      borderBottom: "1px solid " + (solid ? "var(--border-subtle)" : "transparent")
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: "0 auto",
      padding: "0 clamp(20px, 4vw, 56px)",
      height: 74,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => onNav("home"),
    style: {
      cursor: "pointer",
      color: fg,
      transition: "color var(--dur-slow) var(--ease-out)"
    }
  }, /*#__PURE__*/React.createElement(Wordmark, {
    size: 27,
    color: fg
  })), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "clamp(20px, 2.6vw, 40px)"
    },
    className: "ew-nav-desktop"
  }, NAV_LINKS.map(l => {
    const active = l.route === route;
    return /*#__PURE__*/React.createElement("a", {
      key: l.route,
      onClick: () => onNav(l.route),
      style: {
        cursor: "pointer",
        position: "relative",
        color: fg,
        fontFamily: "var(--font-sans)",
        fontWeight: 400,
        fontSize: 11.5,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        paddingBottom: 4,
        opacity: active ? 1 : 0.82,
        transition: "opacity var(--dur-base) var(--ease-out), color var(--dur-slow) var(--ease-out)"
      }
    }, l.label, /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        left: 0,
        bottom: 0,
        height: 1,
        width: "100%",
        background: solid ? "var(--charcoal)" : "var(--white)",
        transform: active ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left",
        transition: "transform var(--dur-base) var(--ease-out)"
      }
    }));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => onNav("saved"),
    title: "Saved properties",
    className: "ew-nav-saved",
    style: {
      cursor: "pointer",
      color: fg,
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      fontFamily: "var(--font-sans)",
      fontSize: 11.5,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      transition: "color var(--dur-slow) var(--ease-out)"
    }
  }, /*#__PURE__*/React.createElement(HeartIcon, {
    filled: savedCount > 0
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 18,
      textAlign: "center",
      color: route === "saved" ? solid ? "var(--navy)" : "var(--white)" : "inherit"
    }
  }, savedCount)), /*#__PURE__*/React.createElement(Button, {
    variant: solid ? "solid" : "outline-light",
    size: "sm",
    shape: "pill",
    onClick: () => onNav("contact"),
    className: "ew-nav-cta"
  }, "Enquire"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setMenuOpen(true),
    "aria-label": "Open menu",
    className: "ew-nav-burger",
    style: {
      display: "none",
      background: "transparent",
      border: "none",
      cursor: "pointer",
      color: fg,
      padding: 6
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.4"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 6h18M3 12h18M3 18h18"
  })))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 300,
      pointerEvents: menuOpen ? "auto" : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => setMenuOpen(false),
    style: {
      position: "absolute",
      inset: 0,
      background: "rgba(10,12,16,0.5)",
      opacity: menuOpen ? 1 : 0,
      transition: "opacity var(--dur-base) var(--ease-out)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      width: "min(82vw, 360px)",
      background: "var(--navy)",
      padding: "30px 30px 40px",
      transform: menuOpen ? "translateX(0)" : "translateX(100%)",
      transition: "transform var(--dur-slow) var(--ease-out)",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 44
    }
  }, /*#__PURE__*/React.createElement(Wordmark, {
    size: 24,
    color: "var(--white)"
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => setMenuOpen(false),
    "aria-label": "Close menu",
    style: {
      background: "transparent",
      border: "none",
      cursor: "pointer",
      color: "var(--white)",
      padding: 6
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.4"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 5l14 14M19 5L5 19"
  })))), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, NAV_LINKS.concat([{
    route: "saved",
    label: "Saved (" + savedCount + ")"
  }]).map(l => /*#__PURE__*/React.createElement("a", {
    key: l.route,
    onClick: () => onNav(l.route),
    style: {
      cursor: "pointer",
      color: "var(--white)",
      padding: "14px 0",
      borderBottom: "1px solid var(--border-on-dark)",
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: 26,
      letterSpacing: "-0.01em",
      opacity: l.route === route ? 1 : 0.7
    }
  }, l.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "auto"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "md",
    shape: "pill",
    onClick: () => onNav("contact"),
    style: {
      width: "100%"
    }
  }, "Start your enquiry")))));
}
function Footer({
  onNav
}) {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: "var(--ink-black)",
      color: "var(--white)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: "0 auto",
      padding: "clamp(56px, 7vw, 96px) clamp(20px, 4vw, 56px) 40px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    "data-grid": "split",
    style: {
      display: "grid",
      gridTemplateColumns: "1.3fr 1fr",
      gap: "clamp(40px, 6vw, 90px)",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Wordmark, {
    size: 40,
    color: "var(--white)"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "24px 0 0",
      maxWidth: 420,
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 16,
      lineHeight: 1.7,
      color: "var(--text-on-dark-mut)"
    }
  }, "A boutique property agency for global citizens. We help you buy not just a home abroad, but the freedom to live on your own terms."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 30
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "md",
    shape: "pill",
    onClick: () => onNav("contact")
  }, "Begin your elsewhere"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--text-on-dark-mut)",
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(Label, null, "Explore")), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      margin: 0,
      padding: 0,
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, NAV_LINKS.map(l => /*#__PURE__*/React.createElement("li", {
    key: l.route
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => onNav(l.route),
    style: {
      cursor: "pointer",
      color: "var(--white)",
      opacity: 0.82,
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 14.5
    }
  }, l.label))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--text-on-dark-mut)",
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(Label, null, "Contact")), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      margin: 0,
      padding: 0,
      display: "flex",
      flexDirection: "column",
      gap: 12,
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 14.5
    }
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "mailto:" + window.CONTACT.email,
    style: {
      color: "var(--white)",
      opacity: 0.82
    }
  }, window.CONTACT.email)), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--white)",
      opacity: 0.82
    }
  }, "WhatsApp ", window.CONTACT.whatsapp))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 16,
      marginTop: 24
    }
  }, [{
    label: "Instagram",
    href: "https://www.instagram.com/elsewhere.living/",
    svg: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.7"
    }, /*#__PURE__*/React.createElement("rect", {
      x: "2.5",
      y: "2.5",
      width: "19",
      height: "19",
      rx: "5"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "4.2"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "17.3",
      cy: "6.7",
      r: "1.15",
      fill: "currentColor",
      stroke: "none"
    }))
  }, {
    label: "TikTok",
    href: "https://www.tiktok.com/@sofia.elsewhere",
    svg: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "currentColor"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M16.5 3c.3 2.1 1.5 3.6 3.5 3.9V9c-1.3 0-2.5-.4-3.5-1.1v6.6c0 3.2-2.4 5.5-5.4 5.5C8.6 20 6.5 18 6.5 15.3c0-2.7 2.2-4.8 5.1-4.6v2.4c-.4-.1-.8-.2-1.2-.2-1.3 0-2.4 1-2.4 2.4 0 1.4 1 2.4 2.3 2.4 1.4 0 2.5-1.1 2.5-2.7V3h3.6z"
    }))
  }, {
    label: "YouTube",
    href: "https://www.youtube.com/@sofia.elsewhere",
    svg: /*#__PURE__*/React.createElement("svg", {
      width: "22",
      height: "22",
      viewBox: "0 0 24 24",
      fill: "currentColor"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M22 8.2c0-1.4-1.1-2.5-2.5-2.6C17.6 5.4 14.8 5.3 12 5.3s-5.6.1-7.5.3C3.1 5.7 2 6.8 2 8.2 1.9 9.4 1.9 10.7 1.9 12s0 2.6.1 3.8c0 1.4 1.1 2.5 2.5 2.6 1.9.2 4.7.3 7.5.3s5.6-.1 7.5-.3c1.4-.1 2.5-1.2 2.5-2.6.1-1.2.1-2.5.1-3.8s0-2.6-.1-3.8zM10 15V9l5.2 3L10 15z"
    }))
  }].map(s => /*#__PURE__*/React.createElement("a", {
    key: s.label,
    href: s.href,
    target: "_blank",
    rel: "noopener noreferrer",
    "aria-label": s.label,
    className: "ew-textlink",
    style: {
      color: "var(--white)",
      display: "inline-flex"
    }
  }, s.svg)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 64,
      paddingTop: 26,
      borderTop: "1px solid var(--border-on-dark)",
      display: "flex",
      flexWrap: "wrap",
      gap: 16,
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 11,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "var(--text-on-dark-mut)"
    }
  }, "\xA9 ", new Date().getFullYear(), " Elsewhere Living"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 16,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("a", {
    onClick: () => onNav("privacy"),
    style: {
      cursor: "pointer",
      fontFamily: "var(--font-sans)",
      fontSize: 11,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "var(--text-on-dark-mut)"
    }
  }, "Privacy Policy")))));
}
Object.assign(window, {
  Nav,
  Footer,
  NAV_LINKS
});