/* Elsewhere Living — Rentals, About, Contact, Saved screens */

/* ---------- Vacation Rentals ---------- */
function RentalCard({
  item,
  onOpen
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("article", {
    onClick: () => onOpen && onOpen(item),
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: "var(--white)",
      border: "1px solid var(--border-subtle)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      cursor: onOpen ? "pointer" : "default",
      boxShadow: hover ? "0 26px 60px -38px rgba(15,22,40,0.5)" : "none",
      transform: hover ? "translateY(-3px)" : "none",
      transition: "box-shadow var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ew-grain",
    style: {
      position: "relative",
      aspectRatio: "3 / 2",
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
      transform: hover ? "scale(1.06)" : "scale(1)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 14,
      left: 14,
      zIndex: 2,
      display: "flex",
      flexWrap: "wrap",
      gap: 6
    }
  }, window.viewList(item.view).map(v => /*#__PURE__*/React.createElement(Badge, {
    key: v,
    tone: "light"
  }, v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "22px 24px 26px"
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
      fontSize: 27,
      lineHeight: 1.1,
      letterSpacing: "-0.01em",
      color: "var(--navy)"
    }
  }, item.title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 16,
      marginTop: 12,
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 12.5,
      letterSpacing: "0.03em",
      color: "var(--text-body)"
    }
  }, /*#__PURE__*/React.createElement("span", {
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
    name: "users",
    size: 15,
    color: "var(--slate)",
    stroke: 1.4
  }), " ", item.guestsLabel || item.guests, " guests"), /*#__PURE__*/React.createElement("span", {
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
  }), " ", item.size)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      marginTop: 20,
      paddingTop: 18,
      borderTop: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 9.5,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: "var(--slate)"
    }
  }, "From"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 400,
      fontSize: 22,
      color: "var(--charcoal)"
    }
  }, /*#__PURE__*/React.createElement(PriceTag, {
    value: item.nightly,
    original: item.nightlyOriginal,
    currency: item.nightlyCurrency,
    size: 22
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      color: "var(--slate)",
      letterSpacing: "0.04em"
    }
  }, " / night"))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 11,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "var(--slate)"
    }
  }, item.note))));
}
function RentalsScreen({
  onNav,
  onOpen
}) {
  const [sent, setSent] = React.useState(false);
  const destinations = ["All", ...Array.from(new Set(window.RENTALS.map(r => window.rentDest(r.location)).filter(Boolean)))];
  const views = ["All", "Sea View", "Beachfront", "Waterfront", "Mountain View", "Garden / Pool View"];
  const _q = ewReadQuery();
  const [dest, setDest] = React.useState(_q.dest || "All");
  const [view, setView] = React.useState(_q.view || "All");
  const [minBeds, setMinBeds] = React.useState(_q.beds ? Number(_q.beds) : 0);
  const [sort, setSort] = React.useState(_q.sort || "featured");

  // Reflect active filters in the URL so the view is shareable and Back returns here.
  React.useEffect(() => {
    ewWriteFilters({
      dest: dest,
      view: view,
      beds: minBeds,
      sort: sort
    });
  }, [dest, view, minBeds, sort]);
  let items = window.RENTALS.filter(r => (dest === "All" || window.rentDest(r.location) === dest) && (view === "All" || window.viewList(r.view).includes(view)) && (r.beds || 0) >= minBeds);
  const ewRentPrice = x => x.nightlyNum && x.nightlyNum > 0 ? x.nightlyNum : Infinity; // "on request" sorts as most expensive
  if (sort === "low") items = [...items].sort((a, b) => ewRentPrice(a) - ewRentPrice(b));
  if (sort === "high") items = [...items].sort((a, b) => ewRentPrice(b) - ewRentPrice(a));
  if (sort === "guests") items = [...items].sort((a, b) => (b.guests || 0) - (a.guests || 0));
  const reset = () => {
    setDest("All");
    setView("All");
    setMinBeds(0);
    setSort("featured");
  };
  const activeFilters = (dest !== "All") + (view !== "All") + (minBeds > 0);
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(PageHeader, {
    eyebrow: "Vacation rentals",
    title: "Live elsewhere \u2014 first, for a week.",
    intro: "Stay in the calibre of home we sell. Many of our buyers began as guests who simply didn't want to leave.",
    image: window.PHOTO.chairs
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
      flexWrap: "wrap",
      gap: "26px 44px"
    }
  }, /*#__PURE__*/React.createElement(Segmented, {
    label: "Destination",
    value: dest,
    onChange: setDest,
    options: destinations.map(d => ({
      label: d,
      value: d
    }))
  }), /*#__PURE__*/React.createElement(Segmented, {
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
    }, {
      label: "7+",
      value: 7
    }, {
      label: "8+",
      value: 8
    }, {
      label: "9+",
      value: 9
    }, {
      label: "10+",
      value: 10
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
      label: "Most guests",
      value: "guests"
    }]
  })), /*#__PURE__*/React.createElement("div", {
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
  }, items.length, " ", items.length === 1 ? "villa" : "villas", dest !== "All" ? " in " + dest : ""), activeFilters > 0 ? /*#__PURE__*/React.createElement("button", {
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
  }, items.map(r => /*#__PURE__*/React.createElement(RentalCard, {
    key: r.id,
    item: r,
    onOpen: onOpen
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
  }, "Loosen a filter, or tell us your dates and we'll source it."), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "md",
    shape: "pill",
    onClick: reset
  }, "Clear filters")))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--navy)",
      color: "var(--white)",
      padding: "clamp(64px, 9vw, 120px) clamp(20px, 4vw, 56px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "reveal",
    style: {
      maxWidth: 920,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginBottom: 44
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    onDark: true,
    align: "center",
    eyebrow: "Plan your stay",
    title: "Tell us your dates.",
    intro: "We'll match you to the right home and handle every detail \u2014 transfers, chef, the lot.",
    max: 620
  })), sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "20px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--butter)",
      fontSize: 30,
      marginBottom: 14
    }
  }, "\u2736"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: 26
    }
  }, "Wonderful \u2014 we'll be in touch shortly with availability.")) : /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setSent(true);
    },
    style: {
      background: "var(--navy-80)",
      border: "1px solid var(--border-on-dark)",
      padding: "clamp(26px, 4vw, 44px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    "data-grid": "split",
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 28
    }
  }, /*#__PURE__*/React.createElement(Field, {
    tone: "dark",
    label: "Destination",
    placeholder: "Koh Samui, Bali\u2026"
  }), /*#__PURE__*/React.createElement(Field, {
    tone: "dark",
    label: "Min. bedrooms",
    type: "number",
    min: "1",
    placeholder: "3"
  }), /*#__PURE__*/React.createElement(Field, {
    tone: "dark",
    label: "Adults",
    type: "number",
    min: "1",
    placeholder: "2"
  }), /*#__PURE__*/React.createElement(Field, {
    tone: "dark",
    label: "Kids (under 12)",
    type: "number",
    min: "0",
    placeholder: "0"
  }), /*#__PURE__*/React.createElement(Field, {
    tone: "dark",
    label: "Arrive",
    type: "date"
  }), /*#__PURE__*/React.createElement(Field, {
    tone: "dark",
    label: "Depart",
    type: "date"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 30,
      display: "flex",
      justifyContent: "flex-end"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "md",
    shape: "pill",
    type: "submit"
  }, "Check availability"))))));
}

/* ---------- Rental detail ---------- */
function RentalBookingForm({
  item
}) {
  const [sent, setSent] = React.useState(false);
  if (sent) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center",
        padding: "12px 4px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        color: "var(--butter)",
        fontSize: 26,
        marginBottom: 12
      }
    }, "\u2736"), /*#__PURE__*/React.createElement("h3", {
      style: {
        margin: 0,
        fontFamily: "var(--font-serif)",
        fontWeight: 300,
        fontSize: 24,
        color: "var(--navy)"
      }
    }, "Request received."), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: "12px 0 0",
        fontFamily: "var(--font-sans)",
        fontWeight: 300,
        fontSize: 14.5,
        lineHeight: 1.6,
        color: "var(--text-body)"
      }
    }, "We'll confirm availability for ", item.title, " and come back with a tailored quote within one business day."));
  }
  return /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setSent(true);
    },
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    "data-grid": "split",
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Arrive",
    type: "date",
    required: true
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Depart",
    type: "date",
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    "data-grid": "split",
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Adults",
    type: "number",
    min: "1",
    placeholder: "2",
    required: true
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Kids (under 12)",
    type: "number",
    min: "0",
    placeholder: "0"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Min. bedrooms",
    type: "number",
    min: "1",
    placeholder: String(item.beds)
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Full name",
    placeholder: "Your name",
    required: true
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Email",
    type: "email",
    placeholder: "you@email.com",
    required: true
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "solid",
    size: "md",
    type: "submit",
    style: {
      width: "100%",
      marginTop: 4
    }
  }, "Request to book"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 11,
      letterSpacing: "0.04em",
      color: "var(--slate)",
      textAlign: "center"
    }
  }, item.note, " \xB7 or WhatsApp ", window.CONTACT.whatsapp));
}
function RentalScreen({
  item,
  onBack,
  onOpen
}) {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [item && item.id]);
  if (!item) return null;
  const related = window.RENTALS.filter(r => r.id !== item.id).slice(0, 3);
  return /*#__PURE__*/React.createElement("main", {
    style: {
      background: "var(--paper)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: "0 auto",
      padding: "clamp(104px, 13vh, 140px) clamp(20px, 4vw, 56px) clamp(72px, 10vw, 120px)"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      cursor: "pointer",
      background: "transparent",
      border: "none",
      padding: 0,
      marginBottom: 28,
      display: "inline-flex",
      alignItems: "center",
      gap: 9,
      fontFamily: "var(--font-sans)",
      fontSize: 11.5,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "var(--slate)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16
    }
  }, "\u2190"), " All rentals"), /*#__PURE__*/React.createElement("div", {
    "data-grid": "split",
    style: {
      display: "grid",
      gridTemplateColumns: "1.55fr 1fr",
      gap: "clamp(32px, 5vw, 72px)",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "reveal is-in",
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(Gallery, {
    images: item.gallery,
    title: item.title
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 48
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--slate)",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(Label, null, "The stay")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: "clamp(1.4rem, 2.4vw, 1.9rem)",
      lineHeight: 1.4,
      letterSpacing: "-0.01em",
      color: "var(--navy)"
    }
  }, item.blurb), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "26px 0 0",
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 16,
      lineHeight: 1.8,
      color: "var(--text-body)",
      maxWidth: 640,
      whiteSpace: "pre-line"
    }
  }, item.detail || "Every Elsewhere rental comes fully staffed and ready — housekeeping, a welcome stock, and a local concierge a message away. Tell us your dates and we'll handle transfers, a private chef, and anything else that makes the week effortless.")), /*#__PURE__*/React.createElement(FeaturesGrid, {
    features: item.features
  })), /*#__PURE__*/React.createElement("aside", {
    style: {
      position: "sticky",
      top: 100
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--white)",
      border: "1px solid var(--border-subtle)",
      padding: "clamp(24px, 3vw, 34px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7,
      fontFamily: "var(--font-sans)",
      fontSize: 10.5,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: "var(--slate)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pin",
    size: 13,
    color: "var(--slate)",
    stroke: 1.4
  }), " ", item.place), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: "10px 0 0",
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: "clamp(1.9rem, 3vw, 2.5rem)",
      lineHeight: 1.06,
      letterSpacing: "-0.015em",
      color: "var(--navy)"
    }
  }, item.title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "navy"
  }, "Vacation Rental"), window.viewList(item.view).map(v => /*#__PURE__*/React.createElement(Badge, {
    key: v,
    tone: "mist"
  }, v))), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "24px 0 6px"
    }
  }, /*#__PURE__*/React.createElement(SpecRow, {
    label: "Nightly rate",
    value: /*#__PURE__*/React.createElement(PriceTag, {
      value: /^(from |price)/i.test(item.nightly) ? item.nightly : "from " + item.nightly,
      original: item.nightlyOriginal,
      currency: item.nightlyCurrency,
      size: 17,
      align: "right"
    })
  }), /*#__PURE__*/React.createElement(SpecRow, {
    label: "Bedrooms",
    value: item.bedsLabel || item.beds
  }), /*#__PURE__*/React.createElement(SpecRow, {
    label: "Sleeps",
    value: (item.guestsLabel || item.guests) + " guests"
  }), /*#__PURE__*/React.createElement(SpecRow, {
    label: "Property size",
    value: item.size
  })), item.occupancy ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "12px 0 0",
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 12.5,
      lineHeight: 1.5,
      color: "var(--slate)"
    }
  }, "Sleeps ", item.occupancy, " \u2014 configured to your party.") : null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 26,
      paddingTop: 26,
      borderTop: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--slate)",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(Label, null, "Check availability")), /*#__PURE__*/React.createElement(RentalBookingForm, {
    item: item
  }))))), /*#__PURE__*/React.createElement(LocationMap, {
    item: item
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "clamp(64px, 9vw, 110px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "reveal",
    style: {
      marginBottom: 36
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "More places to stay",
    title: "Other homes by the week.",
    max: 560
  })), /*#__PURE__*/React.createElement("div", {
    className: "reveal",
    "data-grid": "3",
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 26
    }
  }, related.map(r => /*#__PURE__*/React.createElement(RentalCard, {
    key: r.id,
    item: r,
    onOpen: onOpen
  }))))));
}

/* ---------- About ---------- */
function AboutScreen({
  onNav
}) {
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(PageHeader, {
    eyebrow: "About",
    title: "A boutique agency for the way you actually want to live.",
    intro: "We're small on purpose. It's the only way to give every client the honesty, attention and judgement that buying abroad deserves.",
    image: window.PHOTO.wave
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--paper)",
      padding: "clamp(72px, 10vw, 130px) clamp(20px, 4vw, 56px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    "data-grid": "split",
    style: {
      maxWidth: 1320,
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "clamp(40px, 6vw, 90px)",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "reveal"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Our belief",
    title: "Most people buy property. We help you buy possibilities.",
    intro: "A home elsewhere isn't a transaction \u2014 it's a different rhythm of life: slower mornings, a base for the family, a quietly appreciating asset that also happens to be paradise. We exist to make that leap feel safe, considered, and genuinely yours."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "solid",
    size: "md",
    shape: "pill",
    onClick: () => onNav("properties")
  }, "See the collection"))), /*#__PURE__*/React.createElement("div", {
    className: "reveal ew-grain",
    style: {
      position: "relative",
      aspectRatio: "4 / 5",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/imagery/belief-jungle-pool.jpg",
    alt: "",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  })))), /*#__PURE__*/React.createElement("section", {
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
      marginBottom: 54
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    onDark: true,
    eyebrow: "Who we serve",
    title: "Three kinds of people we love working with.",
    intro: "Most of our clients arrive as one of these \u2014 and many become all three over time.",
    max: 680
  })), /*#__PURE__*/React.createElement("div", {
    className: "reveal",
    "data-grid": "3",
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "clamp(28px, 4vw, 52px)"
    }
  }, window.PERSONAS.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.k,
    style: {
      borderTop: "1px solid var(--border-on-dark)",
      paddingTop: 26
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: p.i,
    size: 30,
    color: "var(--butter)",
    stroke: 1.4
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: "22px 0 0",
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: "clamp(1.5rem, 2.6vw, 2rem)",
      lineHeight: 1.1,
      letterSpacing: "-0.01em"
    }
  }, p.k), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "14px 0 0",
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 15,
      lineHeight: 1.72,
      color: "rgba(255,255,255,0.78)"
    }
  }, p.b)))))), /*#__PURE__*/React.createElement("section", {
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
      marginBottom: 54
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "What makes us different",
    title: "Why owners, buyers and developers choose us.",
    max: 680
  })), /*#__PURE__*/React.createElement("div", {
    className: "reveal",
    "data-grid": "3",
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "36px clamp(28px, 4vw, 56px)"
    }
  }, window.DIFFERENTIATORS.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: d.t,
    style: {
      borderTop: "1px solid var(--border-subtle)",
      paddingTop: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: d.i,
    size: 22,
    color: "var(--navy)",
    stroke: 1.4
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 11,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: "var(--slate)"
    }
  }, "0" + (i + 1))), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: "16px 0 0",
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: "clamp(1.4rem, 2.3vw, 1.85rem)",
      lineHeight: 1.12,
      letterSpacing: "-0.01em",
      color: "var(--navy)"
    }
  }, d.t), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "12px 0 0",
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 15,
      lineHeight: 1.72,
      color: "var(--text-body)"
    }
  }, d.b)))))), /*#__PURE__*/React.createElement(CTABand, {
    onNav: onNav
  }));
}

/* ---------- Contact ---------- */
function IntentChecks({
  value,
  onToggle
}) {
  const opts = [{
    id: "buy",
    l: "Buy a property"
  }, {
    id: "rent",
    l: "Rent a vacation home"
  }, {
    id: "custom",
    l: "Build a custom home"
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: "var(--font-sans)",
      fontSize: 10.5,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: "var(--slate)",
      marginBottom: 12
    }
  }, "I'm looking to"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 10
    }
  }, opts.map(o => {
    const active = value.includes(o.id);
    return /*#__PURE__*/React.createElement("button", {
      key: o.id,
      type: "button",
      onClick: () => onToggle(o.id),
      "aria-pressed": active,
      style: {
        flex: "1 1 0",
        minWidth: 150,
        display: "flex",
        alignItems: "center",
        gap: 11,
        cursor: "pointer",
        background: active ? "var(--mist)" : "transparent",
        border: "1px solid " + (active ? "var(--navy)" : "var(--border-on-light)"),
        borderRadius: "var(--radius-xs)",
        padding: "13px 14px",
        textAlign: "left",
        transition: "background var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 19,
        height: 19,
        flexShrink: 0,
        borderRadius: 2,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: active ? "var(--navy)" : "transparent",
        border: "1.5px solid " + (active ? "var(--navy)" : "var(--slate)")
      }
    }, active ? /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 12,
      color: "var(--white)",
      stroke: 2.4
    }) : null), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-sans)",
        fontWeight: 300,
        fontSize: 14,
        color: "var(--charcoal)"
      }
    }, o.l));
  })));
}
function ContactScreen() {
  const [sent, setSent] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [intents, setIntents] = React.useState([]);
  const toggleIntent = id => setIntents(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const c = window.CONTACT;

  // On submit we compose a pre-filled email to contact@elsewhere.living with the
  // visitor's details and open their mail client (no server/backend needed).
  const handleSubmit = e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const g = k => (fd.get(k) || "").toString().trim();
    const intentLabel = {
      buy: "Buy a property",
      rent: "Rent a villa",
      custom: "Build a custom home"
    };
    const want = intents.map(i => intentLabel[i]).filter(Boolean).join(", ");
    const who = [g("first_name"), g("last_name")].filter(Boolean).join(" ") || "Website visitor";
    const subject = "New enquiry — " + who + (want ? " · " + want : "");
    const lines = ["Name: " + who, "Email: " + g("email"), g("whatsapp") ? "WhatsApp: " + g("whatsapp") : null, want ? "Looking to: " + want : null, g("destination") ? "Where: " + g("destination") : null, g("budget") ? "Budget: " + g("budget") : null, "", g("message") || ""].filter(l => l !== null);
    const href = "mailto:" + c.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n"));
    window.location.href = href;
    setSent(true);
  };
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(PageHeader, {
    eyebrow: "Start your elsewhere journey",
    title: "Let's talk.",
    intro: "No pressure, no obligation \u2014 just an honest conversation about what you're looking for. We typically reply within one business day.",
    image: window.PHOTO.deck
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--paper)",
      padding: "clamp(64px, 9vw, 120px) clamp(20px, 4vw, 56px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    "data-grid": "split",
    style: {
      maxWidth: 1320,
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "clamp(40px, 6vw, 90px)",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "reveal"
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Direct lines",
    title: "Reach us however suits you.",
    max: 520
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 40,
      display: "flex",
      flexDirection: "column"
    }
  }, [{
    k: "Email",
    v: c.email,
    href: "mailto:" + c.email
  }, {
    k: "WhatsApp",
    v: c.whatsapp,
    href: null
  }].map(row => /*#__PURE__*/React.createElement("div", {
    key: row.k,
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      gap: 16,
      padding: "20px 0",
      borderBottom: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 11,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: "var(--slate)"
    }
  }, row.k), row.href ? /*#__PURE__*/React.createElement("a", {
    href: row.href,
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 400,
      fontSize: "clamp(1.1rem, 1.8vw, 1.5rem)",
      color: "var(--navy)",
      textAlign: "right"
    }
  }, row.v) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 400,
      fontSize: "clamp(1.1rem, 1.8vw, 1.5rem)",
      color: "var(--navy)",
      textAlign: "right"
    }
  }, row.v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 44
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--slate)",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(Label, null, "Follow along")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 22px",
      maxWidth: 440,
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 15,
      lineHeight: 1.7,
      color: "var(--text-body)"
    }
  }, "Our latest homes, island life and behind-the-scenes live on our socials \u2014 it's where most of our community finds us. Come say hello."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 12
    }
  }, [{
    label: "Instagram",
    handle: "@elsewhere.living",
    href: "https://www.instagram.com/elsewhere.living/",
    svg: /*#__PURE__*/React.createElement("svg", {
      width: "18",
      height: "18",
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
    handle: "@sofia.elsewhere",
    href: "https://www.tiktok.com/@sofia.elsewhere",
    svg: /*#__PURE__*/React.createElement("svg", {
      width: "18",
      height: "18",
      viewBox: "0 0 24 24",
      fill: "currentColor"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M16.5 3c.3 2.1 1.5 3.6 3.5 3.9V9c-1.3 0-2.5-.4-3.5-1.1v6.6c0 3.2-2.4 5.5-5.4 5.5C8.6 20 6.5 18 6.5 15.3c0-2.7 2.2-4.8 5.1-4.6v2.4c-.4-.1-.8-.2-1.2-.2-1.3 0-2.4 1-2.4 2.4 0 1.4 1 2.4 2.3 2.4 1.4 0 2.5-1.1 2.5-2.7V3h3.6z"
    }))
  }, {
    label: "YouTube",
    handle: "@sofia.elsewhere",
    href: "https://www.youtube.com/@sofia.elsewhere",
    svg: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "20",
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
      display: "inline-flex",
      alignItems: "center",
      gap: 9,
      padding: "11px 16px",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-pill)",
      color: "var(--navy)",
      fontFamily: "var(--font-sans)",
      fontWeight: 400,
      fontSize: 13.5
    }
  }, s.svg, /*#__PURE__*/React.createElement("span", null, s.handle)))))), /*#__PURE__*/React.createElement("div", {
    className: "reveal",
    style: {
      background: "var(--white)",
      border: "1px solid var(--border-subtle)",
      padding: "clamp(28px, 4vw, 48px)"
    }
  }, sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "40px 10px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--butter)",
      fontSize: 34,
      marginBottom: 16
    }
  }, "\u2736"), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: 30,
      color: "var(--navy)"
    }
  }, "Your email is ready."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "14px auto 0",
      maxWidth: 380,
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 15,
      lineHeight: 1.7,
      color: "var(--text-body)"
    }
  }, "We've opened a pre-filled message in your email app \u2014 just press send to reach us at ", /*#__PURE__*/React.createElement("a", {
    href: "mailto:" + c.email,
    style: {
      color: "var(--navy)",
      textDecoration: "underline",
      textUnderlineOffset: 3
    }
  }, c.email), ". If nothing opened, email us there directly.")) : /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--slate)",
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement(Label, null, "Enquiry")), /*#__PURE__*/React.createElement(IntentChecks, {
    value: intents,
    onToggle: toggleIntent
  }), /*#__PURE__*/React.createElement("div", {
    "data-grid": "split",
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 22
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "First name",
    name: "first_name",
    placeholder: "First",
    required: true
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Last name",
    name: "last_name",
    placeholder: "Last",
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    "data-grid": "split",
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 22
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Email",
    name: "email",
    type: "email",
    placeholder: "you@email.com",
    required: true
  }), /*#__PURE__*/React.createElement(Field, {
    label: "WhatsApp (optional)",
    name: "whatsapp",
    type: "tel",
    placeholder: "+66 \u2026"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Where are you dreaming of?",
    name: "destination",
    placeholder: "Koh Samui, Bali, not sure yet\u2026"
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Budget",
    name: "budget",
    placeholder: "e.g. $500k\u2013$1M, or flexible"
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Tell us a little more",
    name: "message",
    as: "textarea",
    placeholder: "What does your elsewhere look like?"
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "solid",
    size: "md",
    type: "submit",
    style: {
      width: "100%",
      marginTop: 4
    }
  }, "Send enquiry"))))));
}

/* ---------- Saved ---------- */
function SavedScreen({
  onNav,
  onOpen,
  saved,
  onToggleSave
}) {
  const items = window.LISTINGS.filter(l => saved.includes(l.id));
  const c = window.CONTACT;

  // Build a ready-to-send shortlist message from the saved properties.
  const lines = items.map((it, i) => i + 1 + ". " + it.title + " — " + it.location + " · " + it.price);
  const message = "Hello Elsewhere Living,\n\nI've shortlisted " + items.length + " " + (items.length === 1 ? "property" : "properties") + " on your site that I'd love to view:\n\n" + lines.join("\n") + "\n\nPlease get in touch to arrange viewings — in person or by private video tour.\n\nName:\nPreferred contact time:";
  const waDigits = (c.whatsapp || "").replace(/[^0-9]/g, "");
  const waHref = "https://wa.me/" + waDigits + "?text=" + encodeURIComponent(message);
  const mailHref = "mailto:" + c.email + "?subject=" + encodeURIComponent("Property shortlist — " + items.length + " saved") + "&body=" + encodeURIComponent(message);
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(PageHeader, {
    eyebrow: "Saved",
    title: "Your shortlist.",
    intro: "The homes you've set aside. Send them to us and we'll arrange viewings \u2014 in person or by private video tour.",
    image: window.PHOTO.pool
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--paper)",
      padding: "clamp(64px, 9vw, 120px) clamp(20px, 4vw, 56px)",
      minHeight: "40vh"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1320,
      margin: "0 auto"
    }
  }, items.length ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "reveal",
    "data-grid": "split",
    style: {
      background: "var(--white)",
      border: "1px solid var(--border-subtle)",
      padding: "clamp(24px, 3.4vw, 38px)",
      marginBottom: 36,
      display: "grid",
      gridTemplateColumns: "1fr auto",
      gap: "clamp(20px, 3vw, 44px)",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--slate)",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(Label, null, items.length + " " + (items.length === 1 ? "home" : "homes") + " shortlisted")), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: "clamp(1.5rem, 2.6vw, 2.1rem)",
      lineHeight: 1.1,
      letterSpacing: "-0.01em",
      color: "var(--navy)"
    }
  }, "Send your shortlist to our advisors."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "12px 0 0",
      maxWidth: 540,
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 15,
      lineHeight: 1.7,
      color: "var(--text-body)"
    }
  }, "We'll open a message pre-filled with these ", items.length === 1 ? "property" : "properties", " so you don't have to retype a thing \u2014 just add your name and hit send. We typically reply within one business day.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12,
      minWidth: 210
    }
  }, /*#__PURE__*/React.createElement(Button, {
    as: "a",
    href: waHref,
    target: "_blank",
    rel: "noopener noreferrer",
    variant: "solid",
    size: "md",
    shape: "pill",
    style: {
      width: "100%",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "whatsapp",
    size: 16,
    color: "currentColor",
    stroke: 1.6
  }), " Send via WhatsApp"), /*#__PURE__*/React.createElement(Button, {
    as: "a",
    href: mailHref,
    variant: "outline",
    size: "md",
    shape: "pill",
    style: {
      width: "100%",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "mail",
    size: 16,
    color: "currentColor",
    stroke: 1.5
  }), " Send via email"), /*#__PURE__*/React.createElement("a", {
    onClick: () => onNav("contact"),
    className: "ew-textlink",
    style: {
      cursor: "pointer",
      textAlign: "center",
      fontFamily: "var(--font-sans)",
      fontSize: 11,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "var(--slate)",
      paddingTop: 2
    }
  }, "Or use the enquiry form"))), /*#__PURE__*/React.createElement("div", {
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
    saved: true,
    onToggleSave: onToggleSave
  })))) : /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "60px 20px",
      maxWidth: 520,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--stone)",
      marginBottom: 22,
      display: "flex",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(HeartIcon, {
    filled: false
  })), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
      color: "var(--navy)"
    }
  }, "Nothing saved yet."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "14px 0 28px",
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 15.5,
      lineHeight: 1.7,
      color: "var(--text-body)"
    }
  }, "Tap the heart on any property to build your shortlist. It'll be waiting here when you come back."), /*#__PURE__*/React.createElement(Button, {
    variant: "solid",
    size: "md",
    shape: "pill",
    onClick: () => onNav("properties")
  }, "Browse the collection")))));
}

/* ---------- Privacy Policy ---------- */
const PRIVACY_SECTIONS = [{
  id: "intro",
  title: "Who we are",
  body: [{
    p: "Elsewhere Living (\u201cElsewhere,\u201d \u201cwe,\u201d \u201cus,\u201d or \u201cour\u201d) is a boutique luxury real-estate and lifestyle agency operating across Koh Samui, Phuket, Bangkok, Bali, Lombok and Dubai. This Privacy Policy explains how we collect, use, share and protect your personal information when you visit our website, contact us, or engage with our advertising and social media."
  }, {
    p: "By using our website or submitting an enquiry, you agree to the practices described in this policy. If you do not agree, please do not use the site."
  }]
}, {
  id: "collect",
  title: "Information we collect",
  body: [{
    p: "We collect information in three ways:"
  }, {
    ul: ["Information you give us \u2014 such as your name, email address, phone or WhatsApp number, the destinations and properties you\u2019re interested in, and anything you tell us in an enquiry or message.", "Information collected automatically \u2014 such as your IP address, device and browser type, pages viewed, links clicked, referring website, and approximate location. This is gathered through cookies and similar technologies.", "Information from third parties \u2014 such as advertising and analytics partners (for example Meta/Facebook and Google) who may share aggregated campaign or audience data with us, and partner agents or developers when a property enquiry is shared with your consent."]
  }]
}, {
  id: "cookies",
  title: "Cookies & tracking technologies",
  body: [{
    p: "We use cookies, pixels, tags and similar technologies to operate the site, remember your preferences, measure performance, and deliver and measure advertising."
  }, {
    p: "In particular, we use the Meta Pixel (Facebook and Instagram) and may use Google Analytics and Google Ads tags. These tools place cookies and collect usage and device data so we can understand how visitors find and use our site, show you relevant advertising on Meta and other platforms, and measure whether those ads are effective."
  }, {
    p: "You can control or disable cookies through your browser settings, and you can manage ad personalisation directly with Meta and Google through their own settings. Disabling cookies may affect how parts of the site function."
  }]
}, {
  id: "use",
  title: "How we use your information",
  body: [{
    p: "We use your information to:"
  }, {
    ul: ["Respond to your enquiries and provide property, rental, custom-home and advisory services.", "Send you information, listings or updates you\u2019ve asked for.", "Operate, maintain, secure and improve our website and services.", "Deliver, target and measure advertising \u2014 including on Meta and Google \u2014 and build audiences of people with similar interests.", "Comply with our legal obligations and protect against fraud or misuse."]
  }]
}, {
  id: "ads",
  title: "Advertising & analytics",
  body: [{
    p: "We advertise our properties and services on platforms such as Facebook, Instagram and Google. To do this, we share certain data \u2014 such as your interaction with our website and, where applicable, a hashed identifier \u2014 with these platforms so that our ads can be shown to relevant audiences and their performance measured."
  }, {
    p: "These third-party platforms act as independent data controllers for the data they collect through their own pixels and tags, and their use of that data is governed by their own privacy policies. We encourage you to review the privacy and ad-preference settings of Meta and Google to control how your data is used for advertising."
  }]
}, {
  id: "sharing",
  title: "How we share information",
  body: [{
    p: "We do not sell your personal information. We share it only with:"
  }, {
    ul: ["Service providers who help us run our business \u2014 such as hosting, email, analytics and advertising partners \u2014 under appropriate confidentiality obligations.", "Partner agents, developers or property owners, only as needed to progress an enquiry you\u2019ve made and with your knowledge.", "Authorities or advisors where required by law, or to protect our rights, safety or property."]
  }]
}, {
  id: "retention",
  title: "Data retention",
  body: [{
    p: "We keep your personal information only for as long as necessary to provide our services, maintain our legitimate business records, and meet legal requirements. When it\u2019s no longer needed, we securely delete or anonymise it."
  }]
}, {
  id: "rights",
  title: "Your rights & choices",
  body: [{
    p: "Depending on where you live (including under the EU/UK GDPR and similar laws), you may have the right to access, correct, delete or restrict the use of your personal information, to object to certain processing, to withdraw consent, and to request a copy of your data. You can also opt out of marketing at any time using the unsubscribe link in our emails or by contacting us."
  }, {
    p: "To exercise any of these rights, contact us using the details below. We\u2019ll respond within the timeframe required by applicable law."
  }]
}, {
  id: "security",
  title: "Data security & international transfers",
  body: [{
    p: "We take reasonable technical and organisational measures to protect your information against loss, misuse and unauthorised access. No method of transmission over the internet is completely secure, however, and we cannot guarantee absolute security."
  }, {
    p: "Because we operate internationally, your information may be processed in countries other than your own, including where our service providers are located. Where required, we use appropriate safeguards for such transfers."
  }]
}, {
  id: "children",
  title: "Children\u2019s privacy",
  body: [{
    p: "Our website and services are intended for adults. We do not knowingly collect personal information from anyone under 18. If you believe a child has provided us with information, please contact us and we will delete it."
  }]
}, {
  id: "changes",
  title: "Changes to this policy",
  body: [{
    p: "We may update this Privacy Policy from time to time. When we do, we\u2019ll revise the \u201clast updated\u201d date below, and material changes will be reflected on this page. Please review it periodically."
  }]
}];
function PrivacyScreen({
  onNav
}) {
  const c = window.CONTACT;
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(PageHeader, {
    eyebrow: "Legal",
    title: "Privacy Policy",
    intro: "How Elsewhere Living collects, uses and protects your information \u2014 including through our website, enquiries and advertising.",
    image: window.PHOTO.wave
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--paper)",
      padding: "clamp(64px, 9vw, 120px) clamp(20px, 4vw, 56px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    "data-privacy-grid": true,
    style: {
      maxWidth: 1180,
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: "240px 1fr",
      gap: "clamp(36px, 6vw, 84px)",
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("aside", {
    "data-privacy-toc": true,
    style: {
      position: "sticky",
      top: 104
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--slate)",
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(Label, null, "Contents")), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      margin: 0,
      padding: 0,
      display: "flex",
      flexDirection: "column",
      gap: 11
    }
  }, PRIVACY_SECTIONS.map((s, i) => /*#__PURE__*/React.createElement("li", {
    key: s.id
  }, /*#__PURE__*/React.createElement("a", {
    href: "#priv-" + s.id,
    className: "ew-textlink",
    style: {
      cursor: "pointer",
      display: "flex",
      gap: 10,
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 13.5,
      lineHeight: 1.5,
      color: "var(--text-body)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--stone)",
      fontVariantNumeric: "tabular-nums"
    }
  }, ("0" + (i + 1)).slice(-2)), /*#__PURE__*/React.createElement("span", null, s.title)))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 8px",
      fontFamily: "var(--font-sans)",
      fontSize: 11,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: "var(--slate)"
    }
  }, "Last updated \xB7 11 June 2026"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 calc(var(--space-7))",
      maxWidth: 680,
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 16.5,
      lineHeight: 1.8,
      color: "var(--text-body)"
    }
  }, "Your privacy matters to us. This policy is written to be read \u2014 plainly and without jargon \u2014 so you know exactly what we collect and why."), PRIVACY_SECTIONS.map((s, i) => /*#__PURE__*/React.createElement("section", {
    key: s.id,
    id: "priv-" + s.id,
    className: "reveal",
    style: {
      scrollMarginTop: 100,
      paddingTop: 34,
      marginTop: 34,
      borderTop: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 14,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 11,
      letterSpacing: "0.16em",
      color: "var(--stone)",
      fontVariantNumeric: "tabular-nums"
    }
  }, ("0" + (i + 1)).slice(-2)), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: "clamp(1.45rem, 2.5vw, 1.95rem)",
      lineHeight: 1.12,
      letterSpacing: "-0.01em",
      color: "var(--navy)"
    }
  }, s.title)), s.body.map((blk, bi) => blk.ul ? /*#__PURE__*/React.createElement("ul", {
    key: bi,
    style: {
      margin: "0 0 16px",
      paddingLeft: 0,
      listStyle: "none",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      maxWidth: 680
    }
  }, blk.ul.map((li, li2) => /*#__PURE__*/React.createElement("li", {
    key: li2,
    style: {
      position: "relative",
      paddingLeft: 22,
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 15.5,
      lineHeight: 1.75,
      color: "var(--text-body)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 0,
      top: "0.72em",
      width: 7,
      height: 1,
      background: "var(--navy)"
    }
  }), li))) : /*#__PURE__*/React.createElement("p", {
    key: bi,
    style: {
      margin: "0 0 16px",
      maxWidth: 680,
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 15.5,
      lineHeight: 1.8,
      color: "var(--text-body)"
    }
  }, blk.p)))), /*#__PURE__*/React.createElement("section", {
    id: "priv-contact",
    className: "reveal",
    style: {
      scrollMarginTop: 100,
      paddingTop: 34,
      marginTop: 34,
      borderTop: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 14,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 11,
      letterSpacing: "0.16em",
      color: "var(--stone)",
      fontVariantNumeric: "tabular-nums"
    }
  }, ("0" + (PRIVACY_SECTIONS.length + 1)).slice(-2)), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: "clamp(1.45rem, 2.5vw, 1.95rem)",
      lineHeight: 1.12,
      letterSpacing: "-0.01em",
      color: "var(--navy)"
    }
  }, "Contact us")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 22px",
      maxWidth: 680,
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 15.5,
      lineHeight: 1.8,
      color: "var(--text-body)"
    }
  }, "If you have any questions about this policy, or wish to exercise your privacy rights, please get in touch:"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      borderTop: "1px solid var(--border-subtle)",
      maxWidth: 560
    }
  }, [{
    k: "Email",
    v: c.email,
    href: "mailto:" + c.email
  }, {
    k: "WhatsApp",
    v: c.whatsapp,
    href: null
  }].map(row => /*#__PURE__*/React.createElement("div", {
    key: row.k,
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      gap: 16,
      padding: "18px 0",
      borderBottom: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 11,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: "var(--slate)"
    }
  }, row.k), row.href ? /*#__PURE__*/React.createElement("a", {
    href: row.href,
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 400,
      fontSize: "clamp(1.05rem, 1.7vw, 1.4rem)",
      color: "var(--navy)",
      textAlign: "right"
    }
  }, row.v) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 400,
      fontSize: "clamp(1.05rem, 1.7vw, 1.4rem)",
      color: "var(--navy)",
      textAlign: "right"
    }
  }, row.v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 34
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "solid",
    size: "md",
    shape: "pill",
    onClick: () => onNav("contact")
  }, "Start your enquiry")))))));
}
Object.assign(window, {
  RentalsScreen,
  RentalScreen,
  AboutScreen,
  ContactScreen,
  SavedScreen,
  PrivacyScreen
});