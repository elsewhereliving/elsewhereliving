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
function App() {
  const [route, setRoute] = React.useState("home");
  const [activeItem, setActiveItem] = React.useState(null);
  const [filter, setFilter] = React.useState(null);
  const [saved, toggleSaved] = useSaved();
  const navigate = React.useCallback((to, opts) => {
    if (to === "properties" && opts && (opts.market || opts.type)) setFilter({
      market: opts.market || null,
      type: opts.type || null
    });else if (to === "properties") setFilter(null);
    setActiveItem(null);
    setRoute(to);
    window.scrollTo({
      top: 0,
      behavior: "auto"
    });
  }, []);
  const openProperty = React.useCallback(item => {
    setActiveItem(item);
    setRoute("property");
    window.scrollTo({
      top: 0,
      behavior: "auto"
    });
  }, []);
  const openRental = React.useCallback(item => {
    setActiveItem(item);
    setRoute("rental");
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