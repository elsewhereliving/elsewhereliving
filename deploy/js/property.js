/* Elsewhere Living — Property detail screen */

function Gallery({
  images,
  title
}) {
  const [active, setActive] = React.useState(0);
  const list = images && images.length ? images : [window.PHOTO.pool];
  const many = list.length > 1;
  const stripRef = React.useRef(null);
  const go = dir => setActive(a => (a + dir + list.length) % list.length);

  // Keep the active thumbnail in view within the strip (no scrollIntoView).
  React.useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const thumb = strip.children[active];
    if (!thumb) return;
    const target = thumb.offsetLeft - strip.clientWidth / 2 + thumb.clientWidth / 2;
    strip.scrollTo({
      left: Math.max(0, target),
      behavior: "smooth"
    });
  }, [active]);
  const arrowBase = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 3,
    width: 46,
    height: 46,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    border: "1px solid rgba(255,255,255,0.55)",
    background: "rgba(15,22,40,0.34)",
    backdropFilter: "blur(3px)",
    WebkitBackdropFilter: "blur(3px)",
    color: "var(--white)",
    transition: "background var(--dur-base) var(--ease-out)"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ew-grain",
    style: {
      position: "relative",
      aspectRatio: "16 / 10",
      overflow: "hidden",
      background: "var(--navy)"
    }
  }, list.map((src, i) => /*#__PURE__*/React.createElement("img", {
    key: i,
    src: src,
    alt: title + " — view " + (i + 1),
    loading: i === 0 ? "eager" : "lazy",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      opacity: i === active ? 1 : 0,
      transition: "opacity var(--dur-slow) var(--ease-out)"
    }
  })), many ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    onClick: () => go(-1),
    "aria-label": "Previous photo",
    className: "ew-gallery-arrow",
    style: {
      ...arrowBase,
      left: 14
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevronLeft",
    size: 22,
    color: "var(--white)",
    stroke: 1.5
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => go(1),
    "aria-label": "Next photo",
    className: "ew-gallery-arrow",
    style: {
      ...arrowBase,
      right: 14
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevronRight",
    size: 22,
    color: "var(--white)",
    stroke: 1.5
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      bottom: 14,
      right: 14,
      zIndex: 3,
      padding: "6px 12px",
      background: "rgba(15,22,40,0.5)",
      backdropFilter: "blur(3px)",
      WebkitBackdropFilter: "blur(3px)",
      fontFamily: "var(--font-sans)",
      fontSize: 11,
      letterSpacing: "0.14em",
      color: "var(--white)"
    }
  }, active + 1, " / ", list.length)) : null), many ? /*#__PURE__*/React.createElement("div", {
    ref: stripRef,
    className: "ew-gallery-strip",
    style: {
      display: "flex",
      gap: 10,
      marginTop: 10,
      overflowX: "auto",
      paddingBottom: 4,
      scrollbarWidth: "thin"
    }
  }, list.map((src, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: () => setActive(i),
    "aria-label": "View photo " + (i + 1),
    style: {
      flex: "0 0 auto",
      width: 96,
      padding: 0,
      border: "1px solid " + (i === active ? "var(--navy)" : "var(--border-subtle)"),
      cursor: "pointer",
      aspectRatio: "4 / 3",
      overflow: "hidden",
      background: "none",
      opacity: i === active ? 1 : 0.55,
      transition: "opacity var(--dur-base) var(--ease-out)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "",
    loading: "lazy",
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block"
    }
  })))) : null);
}

/* Icon facts strip beneath the gallery. */
function FactsStrip({
  item
}) {
  const facts = [];
  if (item.type !== "Land") {
    facts.push({
      i: "bed",
      l: "Bedrooms",
      v: item.bedsLabel || item.beds
    });
    facts.push({
      i: "bath",
      l: "Bathrooms",
      v: item.baths
    });
  }
  if (item.interior && item.interior !== "—") facts.push({
    i: "interior",
    l: "Property size",
    v: item.interior
  });
  if (item.plot && item.plot !== "—") facts.push({
    i: "plot",
    l: "Plot size",
    v: item.plot
  });
  facts.push({
    i: "view",
    l: "Aspect",
    v: window.viewText(item.view)
  });
  if (item.year) facts.push({
    i: "year",
    l: "Completion",
    v: item.year
  });
  if (item.ownership) facts.push({
    i: "key",
    l: "Ownership",
    v: item.ownership
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 26,
      border: "1px solid var(--border-subtle)",
      background: "var(--white)",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))"
    }
  }, facts.map((f, idx) => /*#__PURE__*/React.createElement("div", {
    key: f.l,
    style: {
      padding: "20px 22px",
      display: "flex",
      flexDirection: "column",
      gap: 9,
      borderRight: "1px solid var(--border-subtle)",
      borderBottom: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: f.i,
    size: 19,
    color: "var(--navy)",
    stroke: 1.4
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 400,
      fontSize: 18,
      color: "var(--charcoal)",
      lineHeight: 1.1
    }
  }, f.v), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 10,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: "var(--slate)",
      marginTop: 4
    }
  }, f.l)))));
}
function FeaturesGrid({
  features
}) {
  if (!features || !features.length) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 48
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--slate)",
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement(Label, null, "Features & amenities")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "2px 32px"
    }
  }, features.map(f => /*#__PURE__*/React.createElement("div", {
    key: f.l,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "15px 0",
      borderBottom: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: f.i,
    size: 20,
    color: "var(--navy)",
    stroke: 1.4
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 15.5,
      color: "var(--charcoal)"
    }
  }, f.l)))));
}

// Approximate area coordinates for each location (exact address shared privately).
const EW_GEO = {
  "Kata Beach, Phuket, Thailand": [7.8206, 98.2967],
  "Sri Panwa, Cape Panwa, Phuket, Thailand": [7.7670, 98.4090],
  "Surin Beach, Choeng Thale, Phuket, Thailand": [7.9776, 98.2786],
  "Bo Phut, Koh Samui, Thailand": [9.5697, 100.0186],
  "Kamala, Phuket, Thailand": [7.9558, 98.2839],
  "Uluwatu, Bali, Indonesia": [-8.8290, 115.0880],
  "Maenam, Koh Samui, Thailand": [9.5736, 99.9619],
  "Dubai Marina, Dubai": [25.0805, 55.1403],
  "Sathorn, Bangkok, Thailand": [13.7180, 100.5290],
  "Chaweng Noi, Koh Samui, Thailand": [9.5180, 100.0650],
  "Natai Beach, Phang Nga, Thailand": [8.1530, 98.2870],
  "Layan Beach, Phuket, Thailand": [7.9990, 98.2960],
  "Chaweng Beach, Koh Samui, Thailand": [9.5380, 100.0610]
};
function ewResolveCoords(item) {
  const raw = (item.mapQuery || "").trim();
  const m = raw.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
  if (m) return [parseFloat(m[1]), parseFloat(m[2])];
  if (EW_GEO[raw]) return EW_GEO[raw];
  if (EW_GEO[item.place]) return EW_GEO[item.place];
  return [9.5120, 100.0136]; // Koh Samui fallback
}
function LocationMap({
  item
}) {
  const coords = ewResolveCoords(item);
  const key = window.GOOGLE_MAPS_KEY || "";
  const useGoogle = !!key;
  const elRef = React.useRef(null);
  const mapRef = React.useRef(null);
  React.useEffect(() => {
    if (useGoogle) return undefined; // Google path uses an iframe, no Leaflet init
    if (!window.L || !elRef.current) return undefined;
    const L = window.L;
    const map = L.map(elRef.current, {
      center: coords,
      zoom: 14,
      scrollWheelZoom: false,
      zoomControl: true,
      attributionControl: true
    });
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      maxZoom: 20,
      subdomains: "abcd",
      attribution: '&copy; OpenStreetMap &copy; CARTO'
    }).addTo(map);
    const pinHtml = '<div class="ew-map-pin-wrap">' + '<span class="ew-map-pin-ring"></span>' + '<div style="width:44px;height:44px;border-radius:50%;background:#152644;border:2px solid #fff;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 22px -8px rgba(15,22,40,.6);">' + '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F7F2A0" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 21V12h6v9"/></svg>' + '</div>' + '<div style="width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-top:11px solid #152644;margin-top:-1px;filter:drop-shadow(0 3px 2px rgba(15,22,40,.35));"></div>' + '</div>';
    const icon = L.divIcon({
      className: "ew-map-pin",
      html: pinHtml,
      iconSize: [44, 57],
      iconAnchor: [22, 55]
    });
    L.marker(coords, {
      icon,
      keyboard: false,
      interactive: false
    }).addTo(map);
    mapRef.current = map;
    setTimeout(() => {
      try {
        map.invalidateSize();
      } catch (e) {}
    }, 220);
    return () => {
      try {
        map.remove();
      } catch (e) {}
      mapRef.current = null;
    };
  }, [item.id, useGoogle]);
  const googleSrc = "https://www.google.com/maps/embed/v1/place?key=" + key + "&q=" + coords[0] + "," + coords[1] + "&zoom=14";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "clamp(56px, 8vw, 96px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--slate)",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(Label, null, "Location")), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      display: "flex",
      alignItems: "center",
      gap: 12,
      fontFamily: "var(--font-serif)",
      fontWeight: 300,
      fontSize: "clamp(1.6rem, 2.8vw, 2.3rem)",
      letterSpacing: "-0.01em",
      color: "var(--navy)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pin",
    size: 24,
    color: "var(--navy)",
    stroke: 1.4
  }), item.place)), useGoogle ? /*#__PURE__*/React.createElement("iframe", {
    title: "Location of " + item.title,
    src: googleSrc,
    loading: "lazy",
    referrerPolicy: "no-referrer-when-downgrade",
    allowFullScreen: true,
    style: {
      display: "block",
      width: "100%",
      height: "clamp(300px, 42vw, 460px)",
      border: "1px solid var(--border-subtle)"
    }
  }) : /*#__PURE__*/React.createElement("div", {
    ref: elRef,
    className: "ew-leaflet",
    style: {
      width: "100%",
      height: "clamp(300px, 42vw, 460px)",
      border: "1px solid var(--border-subtle)"
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "14px 0 0",
      fontFamily: "var(--font-sans)",
      fontWeight: 300,
      fontSize: 13,
      color: "var(--slate)",
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "view",
    size: 15,
    color: "var(--slate)",
    stroke: 1.4
  }), "Approximate area shown \u2014 the exact address is shared privately upon enquiry."));
}
function InquiryForm({
  item,
  onSubmitted
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
    }, "Thank you."), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: "12px 0 0",
        fontFamily: "var(--font-sans)",
        fontWeight: 300,
        fontSize: 14.5,
        lineHeight: 1.6,
        color: "var(--text-body)"
      }
    }, "We've noted your interest in ", item.title, ". One of our advisors will reach out personally within one business day."));
  }
  return /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setSent(true);
      onSubmitted && onSubmitted();
    },
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Full name",
    placeholder: "Your name",
    required: true
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Email",
    type: "email",
    placeholder: "you@email.com",
    required: true
  }), /*#__PURE__*/React.createElement(Field, {
    label: "Message",
    as: "textarea",
    placeholder: "I'd love to know more about " + item.title + "…"
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "solid",
    size: "md",
    type: "submit",
    style: {
      width: "100%",
      marginTop: 4
    }
  }, "Request details"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 11,
      letterSpacing: "0.04em",
      color: "var(--slate)",
      textAlign: "center"
    }
  }, "or WhatsApp us at ", window.CONTACT.whatsapp));
}
function SpecRow({
  label,
  value
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      padding: "14px 0",
      borderBottom: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 11,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: "var(--slate)"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-serif)",
      fontWeight: 400,
      fontSize: 17,
      color: "var(--charcoal)",
      textAlign: "right"
    }
  }, value));
}
function ewYouTubeId(u) {
  if (!u) return "";
  const m = String(u).match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);
  return m ? m[1] : String(u);
}
function VideoTour({
  url,
  title
}) {
  const id = ewYouTubeId(url);
  if (!id) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "clamp(56px, 8vw, 96px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "var(--slate)",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(Label, null, "Film")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      aspectRatio: "16 / 9",
      overflow: "hidden",
      background: "var(--navy)",
      border: "1px solid var(--border-subtle)"
    }
  }, /*#__PURE__*/React.createElement("iframe", {
    title: title + " \u2014 film",
    src: "https://www.youtube-nocookie.com/embed/" + id + "?rel=0",
    loading: "lazy",
    allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
    allowFullScreen: true,
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      border: 0
    }
  })));
}
function PropertyScreen({
  item,
  onBack,
  onOpen,
  saved,
  onToggleSave
}) {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [item && item.id]);
  if (!item) return null;
  const related = window.LISTINGS.filter(l => l.id !== item.id && l.market === item.market).concat(window.LISTINGS.filter(l => l.id !== item.id && l.market !== item.market)).slice(0, 3);
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
  }, "\u2190"), " All properties"), /*#__PURE__*/React.createElement("div", {
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
  }, /*#__PURE__*/React.createElement(Label, null, "The residence")), /*#__PURE__*/React.createElement("p", {
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
  }, item.detail || "Each Elsewhere home is held to the same standard: architecturally considered, in a location we'd choose ourselves, and underwritten by numbers that work. We'll walk you through the full picture — ownership structure, rental projections, and the honest trade-offs — before you ever commit.")), /*#__PURE__*/React.createElement(FeaturesGrid, {
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
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
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
  }, item.title)), /*#__PURE__*/React.createElement(SaveButton, {
    active: saved.includes(item.id),
    onToggle: () => onToggleSave(item.id)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "navy"
  }, item.type), window.viewList(item.view).map(v => /*#__PURE__*/React.createElement(Badge, {
    key: v,
    tone: "mist"
  }, v)), /*#__PURE__*/React.createElement(Badge, {
    tone: "accent"
  }, item.status)), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "24px 0 6px"
    }
  }, /*#__PURE__*/React.createElement(SpecRow, {
    label: "Price",
    value: /*#__PURE__*/React.createElement(PriceTag, {
      value: item.price,
      original: item.priceOriginal,
      currency: item.priceCurrency,
      size: 17,
      align: "right"
    })
  }), item.type !== "Land" ? /*#__PURE__*/React.createElement(SpecRow, {
    label: "Bedrooms",
    value: item.bedsLabel || item.beds
  }) : null, item.type !== "Land" ? /*#__PURE__*/React.createElement(SpecRow, {
    label: "Bathrooms",
    value: item.baths
  }) : null, item.interior !== "—" ? /*#__PURE__*/React.createElement(SpecRow, {
    label: "Property size",
    value: item.interior
  }) : null, item.plot && item.plot !== "—" ? /*#__PURE__*/React.createElement(SpecRow, {
    label: "Plot size",
    value: item.plot
  }) : null, item.year ? /*#__PURE__*/React.createElement(SpecRow, {
    label: "Completion",
    value: item.year
  }) : null, item.ownership ? /*#__PURE__*/React.createElement(SpecRow, {
    label: "Ownership",
    value: item.ownership
  }) : null, item.yield ? /*#__PURE__*/React.createElement(SpecRow, {
    label: item.type === "Land" ? "Status" : "Projected yield",
    value: item.yield
  }) : null), /*#__PURE__*/React.createElement("div", {
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
  }, /*#__PURE__*/React.createElement(Label, null, "Enquire")), /*#__PURE__*/React.createElement(InquiryForm, {
    item: item
  }))))), item.video ? /*#__PURE__*/React.createElement(VideoTour, {
    url: item.video,
    title: item.title
  }) : null, /*#__PURE__*/React.createElement(LocationMap, {
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
    eyebrow: "You may also love",
    title: "More from the collection.",
    max: 560
  })), /*#__PURE__*/React.createElement("div", {
    className: "reveal",
    "data-grid": "3",
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 26
    }
  }, related.map(it => /*#__PURE__*/React.createElement(PropertyCard, {
    key: it.id,
    item: it,
    onOpen: onOpen,
    saved: saved.includes(it.id),
    onToggleSave: onToggleSave
  }))))));
}
Object.assign(window, {
  PropertyScreen,
  Gallery,
  FeaturesGrid,
  LocationMap,
  VideoTour,
  SpecRow
});