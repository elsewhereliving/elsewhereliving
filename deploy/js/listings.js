/* Elsewhere Living — Properties (listings) screen */

function PageHeader({
  eyebrow,
  title,
  intro,
  image
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "ew-grain ew-scrim",
    style: {
      position: "relative",
      overflow: "hidden",
      color: "var(--white)",
      background: "var(--navy)"
    }
  }, image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: "",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      opacity: 0.55,
      zIndex: 0
    }
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(180deg, rgba(15,22,40,0.55), rgba(15,22,40,0.78))",
      zIndex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 2,
      maxWidth: 1320,
      margin: "0 auto",
      padding: "clamp(120px, 16vh, 200px) clamp(20px, 4vw, 56px) clamp(48px, 7vw, 84px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "reveal is-in",
    style: {
      color: "var(--text-on-dark-mut)",
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement(Label, null, eyebrow)), /*#__PURE__*/React.createElement("h1", {
    className: "reveal is-in",
    style: {
      margin: 0,
      maxWidth: 880,
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: "clamp(2.4rem, 5.4vw, 4.4rem)",
      lineHeight: 1.02,
      letterSpacing: "-0.02em"
    }
  }, title), intro ? /*#__PURE__*/React.createElement("p", {
    className: "reveal is-in",
    style: {
      margin: "24px 0 0",
      maxWidth: 560,
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 17,
      lineHeight: 1.7,
      color: "rgba(255,255,255,0.85)"
    }
  }, intro) : null));
}
function Segmented({
  label,
  options,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 10.5,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: "var(--slate)"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8
    }
  }, options.map(opt => {
    const active = value === opt.value;
    return /*#__PURE__*/React.createElement("button", {
      key: String(opt.value),
      onClick: () => onChange(opt.value),
      style: {
        cursor: "pointer",
        fontFamily: "var(--font-sans)",
        fontSize: 11.5,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        padding: "9px 14px",
        borderRadius: "var(--radius-pill)",
        border: "1px solid " + (active ? "var(--navy)" : "var(--border-subtle)"),
        background: active ? "var(--navy)" : "transparent",
        color: active ? "var(--white)" : "var(--charcoal)",
        transition: "all var(--dur-base) var(--ease-out)"
      }
    }, opt.label);
  })));
}
function ListingsScreen({
  onOpen,
  saved,
  onToggleSave,
  initialFilter
}) {
  const markets = ["All", ...window.MARKETS.map(m => m.name)];
  const types = ["All", "Villa", "Condominium", "Land"];
  const statuses = ["All", "Move-In Ready", "Off-Plan"];
  const views = ["All", "Sea View", "Beachfront", "Waterfront", "City View", "Mountain View", "Garden / Pool View"];
  const [market, setMarket] = React.useState(initialFilter && initialFilter.market || "All");
  const [type, setType] = React.useState(initialFilter && initialFilter.type || "All");
  const [status, setStatus] = React.useState("All");
  const [view, setView] = React.useState("All");
  const [minBeds, setMinBeds] = React.useState(0);
  const [sort, setSort] = React.useState("featured");
  React.useEffect(() => {
    if (initialFilter && initialFilter.market) setMarket(initialFilter.market);
    if (initialFilter && initialFilter.type) setType(initialFilter.type);
  }, [initialFilter]);
  let items = window.LISTINGS.filter(l => (market === "All" || l.market === market) && (type === "All" || l.type === type) && (status === "All" || l.status === status) && (view === "All" || window.viewList(l.view).includes(view)) && l.beds >= minBeds);
  const ewSalePrice = x => x.priceNum && x.priceNum > 0 ? x.priceNum : Infinity; // "Price on request" sorts as most expensive
  if (sort === "low") items = [...items].sort((a, b) => ewSalePrice(a) - ewSalePrice(b));
  if (sort === "high") items = [...items].sort((a, b) => ewSalePrice(b) - ewSalePrice(a));
  if (sort === "newest") items = [...items].sort((a, b) => (b.added || 0) - (a.added || 0));
  const reset = () => {
    setMarket("All");
    setType("All");
    setStatus("All");
    setView("All");
    setMinBeds(0);
    setSort("featured");
  };
  const activeFilters = (market !== "All") + (type !== "All") + (status !== "All") + (view !== "All") + (minBeds > 0);
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(PageHeader, {
    eyebrow: "The collection",
    title: "Homes chosen to be lived in \u2014 and to perform.",
    intro: "Every listing is personally vetted for design, location, and the numbers behind it. Filter to find the one that's yours.",
    image: window.PHOTO.deck
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--paper)",
      padding: "clamp(40px, 5vw, 64px) clamp(20px, 4vw, 56px) clamp(72px, 10vw, 120px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--white)",
      border: "1px solid var(--border-subtle)",
      padding: "clamp(22px, 3vw, 32px)",
      display: "flex",
      flexDirection: "column",
      gap: 26
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "26px 44px"
    }
  }, /*#__PURE__*/React.createElement(Segmented, {
    label: "Destination",
    value: market,
    onChange: setMarket,
    options: markets.map(m => ({
      label: m,
      value: m
    }))
  }), /*#__PURE__*/React.createElement(Segmented, {
    label: "Type",
    value: type,
    onChange: setType,
    options: types.map(t => ({
      label: t,
      value: t
    }))
  }), /*#__PURE__*/React.createElement(Segmented, {
    label: "Status",
    value: status,
    onChange: setStatus,
    options: statuses.map(s => ({
      label: s,
      value: s
    }))
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "26px 44px",
      paddingTop: 24,
      borderTop: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement(Segmented, {
    label: "View",
    value: view,
    onChange: setView,
    options: views.map(v => ({
      label: v,
      value: v
    }))
  }), /*#__PURE__*/React.createElement(Segmented, {
    label: "Bedrooms",
    value: minBeds,
    onChange: setMinBeds,
    options: [{
      label: "Any",
      value: 0
    }, {
      label: "1+",
      value: 1
    }, {
      label: "2+",
      value: 2
    }, {
      label: "3+",
      value: 3
    }, {
      label: "4+",
      value: 4
    }, {
      label: "5+",
      value: 5
    }, {
      label: "6+",
      value: 6
    }]
  }), /*#__PURE__*/React.createElement(Segmented, {
    label: "Sort",
    value: sort,
    onChange: setSort,
    options: [{
      label: "Featured",
      value: "featured"
    }, {
      label: "$ Low",
      value: "low"
    }, {
      label: "$ High",
      value: "high"
    }, {
      label: "Newest",
      value: "newest"
    }]
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 16,
      alignItems: "center",
      justifyContent: "space-between",
      margin: "28px 2px 26px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "var(--slate)"
    }
  }, items.length, " ", items.length === 1 ? "residence" : "residences", market !== "All" ? " in " + market : ""), activeFilters > 0 ? /*#__PURE__*/React.createElement("button", {
    onClick: reset,
    style: {
      cursor: "pointer",
      background: "transparent",
      border: "none",
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "var(--navy)",
      textDecoration: "underline",
      textUnderlineOffset: 4
    }
  }, "Clear filters") : null), items.length ? /*#__PURE__*/React.createElement("div", {
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
  }))) : /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "80px 20px",
      textAlign: "center",
      border: "1px solid var(--border-subtle)",
      background: "var(--white)"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: 26,
      color: "var(--navy)"
    }
  }, "Nothing matches just yet."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "12px 0 24px",
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 15,
      color: "var(--text-body)"
    }
  }, "Loosen a filter, or let us source it for you off-market."), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "md",
    shape: "pill",
    onClick: reset
  }, "Clear filters")))));
}
Object.assign(window, {
  ListingsScreen,
  PageHeader,
  Segmented
});