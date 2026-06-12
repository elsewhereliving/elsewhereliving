/* Elsewhere Living — app shell: routing, saved store, scroll reveals */

const SAVED_KEY = "ew_saved_v1";
function useSaved() {
  const [saved, setSaved] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SAVED_KEY)) || [];
    } catch (e) {
      return [];
    }
  });
  React.useEffect(() => {
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
    } catch (e) {}
  }, [saved]);
  const toggle = React.useCallback(id => {
    setSaved(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);
  return [saved, toggle];
}

/* Observe .reveal elements and add .is-in as they enter the viewport. */
function useRevealObserver(deps) {
  React.useEffect(() => {
    const els = Array.from(document.querySelectorAll(".reveal:not(.is-in)"));
    if (!els.length) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px"
    });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, deps);
}

/* ---------- URL routing: real per-page & per-property URLs ----------
   The app stays a single-page app, but every page and property gets a real
   path (via the History API), and the static deploy ships a prerendered HTML
   file per URL so links are shareable and crawlable. On load we read the path;
   on navigation we push the matching path; back/forward re-read it. */
const EW_ROUTE_KEYS = ["properties", "property", "rentals", "custom-homes", "custom", "about", "contact", "saved", "privacy"];
function ewPathFor(route, item) {
  switch (route) {
    case "home":
      return "/";
    case "properties":
      return "/properties/";
    case "property":
      return item ? "/property/" + item.id + "/" : "/properties/";
    case "rentals":
      return "/rentals/";
    case "rental":
      return item ? "/rentals/" + item.id + "/" : "/rentals/";
    case "custom":
      return "/custom-homes/";
    case "about":
      return "/about/";
    case "contact":
      return "/contact/";
    case "saved":
      return "/saved/";
    case "privacy":
      return "/privacy/";
    default:
      return "/";
  }
}
function ewParsePath(pathname) {
  const segs = (pathname || "/").split("?")[0].split("#")[0].split("/").filter(Boolean).filter(function (s) {
    return s.toLowerCase() !== "index.html";
  });
  const i = segs.findIndex(function (s) {
    return EW_ROUTE_KEYS.indexOf(s.toLowerCase()) !== -1;
  });
  if (i === -1) return {
    route: "home"
  };
  const a = segs[i].toLowerCase();
  const next = segs[i + 1];
  if (a === "property") return next ? {
    route: "property",
    id: decodeURIComponent(next)
  } : {
    route: "properties"
  };
  if (a === "rentals") return next ? {
    route: "rental",
    id: decodeURIComponent(next)
  } : {
    route: "rentals"
  };
  if (a === "properties") return {
    route: "properties"
  };
  if (a === "custom-homes" || a === "custom") return {
    route: "custom"
  };
  if (a === "about") return {
    route: "about"
  };
  if (a === "contact") return {
    route: "contact"
  };
  if (a === "saved") return {
    route: "saved"
  };
  if (a === "privacy") return {
    route: "privacy"
  };
  return {
    route: "home"
  };
}
function ewFindItem(spec) {
  if (!spec || !spec.id) return null;
  const L = (window.LISTINGS || []).find(function (x) {
    return x.id === spec.id;
  });
  if (L) return L;
  return (window.RENTALS || []).find(function (x) {
    return x.id === spec.id;
  }) || null;
}
function ewInitialState() {
  const spec = ewParsePath(window.location.pathname);
  if (spec.route === "property") {
    const it = ewFindItem(spec);
    return it ? {
      route: "property",
      item: it
    } : {
      route: "properties",
      item: null
    };
  }
  if (spec.route === "rental") {
    const it = ewFindItem(spec);
    return it ? {
      route: "rental",
      item: it
    } : {
      route: "rentals",
      item: null
    };
  }
  return {
    route: spec.route,
    item: null
  };
}
function ewTitleFor(route, item) {
  const base = "Elsewhere Living";
  if ((route === "property" || route === "rental") && item) return item.title + " — " + base;
  const map = {
    home: "Luxury Villas & Property for Sale in Koh Samui | Elsewhere Living",
    properties: "Luxury Villas & Property for Sale | Elsewhere Living",
    rentals: "Luxury Vacation Rentals | Elsewhere Living",
    custom: "Custom Homes | Elsewhere Living",
    about: "About | Elsewhere Living",
    contact: "Contact | Elsewhere Living",
    saved: "Saved Properties | Elsewhere Living",
    privacy: "Privacy | Elsewhere Living"
  };
  return map[route] || base;
}
function ewSyncUrl(route, item, replace) {
  try {
    const path = ewPathFor(route, item);
    const cur = window.location.pathname.replace(/\/index\.html$/i, "/");
    if (cur !== path) {
      window.history[replace ? "replaceState" : "pushState"]({
        ewRoute: route,
        ewId: item ? item.id : null
      }, "", path);
    }
  } catch (e) {/* sandboxed preview without history access: ignore */}
}
function App() {
  const _ewInit = ewInitialState();
  const [route, setRoute] = React.useState(_ewInit.route);
  const [activeItem, setActiveItem] = React.useState(_ewInit.item);
  const [filter, setFilter] = React.useState(null);
  const [saved, toggleSaved] = useSaved();
  const navigate = React.useCallback((to, opts) => {
    if (to === "properties" && opts && (opts.market || opts.type)) setFilter({
      market: opts.market || null,
      type: opts.type || null
    });else if (to === "properties") setFilter(null);
    setActiveItem(null);
    setRoute(to);
    ewSyncUrl(to, null);
    window.scrollTo({
      top: 0,
      behavior: "auto"
    });
  }, []);
  const openProperty = React.useCallback(item => {
    setActiveItem(item);
    setRoute("property");
    ewSyncUrl("property", item);
    window.scrollTo({
      top: 0,
      behavior: "auto"
    });
  }, []);
  const openRental = React.useCallback(item => {
    setActiveItem(item);
    setRoute("rental");
    ewSyncUrl("rental", item);
    window.scrollTo({
      top: 0,
      behavior: "auto"
    });
  }, []);

  // Re-run reveal observer whenever the view changes.
  useRevealObserver([route, activeItem && activeItem.id]);

  // Lightweight debug hooks (no UI impact) — handy for deep-linking in tests.
  React.useEffect(() => {
    window.__ewNav = navigate;
    window.__ewOpenRental = openRental;
    window.__ewOpenProperty = openProperty;
  }, [navigate, openRental, openProperty]);

  // Back/forward buttons: re-read the URL and restore the matching view.
  React.useEffect(() => {
    const onPop = () => {
      const spec = ewParsePath(window.location.pathname);
      if (spec.route === "property") {
        const it = ewFindItem(spec);
        setActiveItem(it || null);
        setRoute(it ? "property" : "properties");
      } else if (spec.route === "rental") {
        const it = ewFindItem(spec);
        setActiveItem(it || null);
        setRoute(it ? "rental" : "rentals");
      } else {
        setActiveItem(null);
        setRoute(spec.route);
      }
      window.scrollTo({
        top: 0,
        behavior: "auto"
      });
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Keep the document title in sync with the current view (history + SEO).
  React.useEffect(() => {
    try {
      document.title = ewTitleFor(route, activeItem);
    } catch (e) {}
  }, [route, activeItem && activeItem.id]);
  const transparentNav = route === "home";
  let screen;
  if (route === "home") screen = /*#__PURE__*/React.createElement(HomeScreen, {
    onNav: navigate,
    onOpen: openProperty,
    saved: saved,
    onToggleSave: toggleSaved
  });else if (route === "properties") screen = /*#__PURE__*/React.createElement(ListingsScreen, {
    onOpen: openProperty,
    saved: saved,
    onToggleSave: toggleSaved,
    initialFilter: filter
  });else if (route === "property") screen = /*#__PURE__*/React.createElement(PropertyScreen, {
    item: activeItem,
    onBack: () => navigate("properties"),
    onOpen: openProperty,
    saved: saved,
    onToggleSave: toggleSaved
  });else if (route === "custom") screen = /*#__PURE__*/React.createElement(CustomHomesScreen, {
    onNav: navigate
  });else if (route === "rentals") screen = /*#__PURE__*/React.createElement(RentalsScreen, {
    onNav: navigate,
    onOpen: openRental
  });else if (route === "rental") screen = /*#__PURE__*/React.createElement(RentalScreen, {
    item: activeItem,
    onBack: () => navigate("rentals"),
    onOpen: openRental
  });else if (route === "about") screen = /*#__PURE__*/React.createElement(AboutScreen, {
    onNav: navigate
  });else if (route === "contact") screen = /*#__PURE__*/React.createElement(ContactScreen, null);else if (route === "saved") screen = /*#__PURE__*/React.createElement(SavedScreen, {
    onNav: navigate,
    onOpen: openProperty,
    saved: saved,
    onToggleSave: toggleSaved
  });else if (route === "privacy") screen = /*#__PURE__*/React.createElement(PrivacyScreen, {
    onNav: navigate
  });else screen = /*#__PURE__*/React.createElement(HomeScreen, {
    onNav: navigate,
    onOpen: openProperty,
    saved: saved,
    onToggleSave: toggleSaved
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Nav, {
    route: route,
    onNav: navigate,
    savedCount: saved.length,
    transparent: transparentNav
  }), screen, /*#__PURE__*/React.createElement(Footer, {
    onNav: navigate
  }));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));