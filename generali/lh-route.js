/*  lh-route.js — tiny hash-based router shared by every Lighthouse surface.
 *
 *  The prototype is hosted as static files on GitHub Pages, so real path URLs
 *  (/program/leadership/tasks) can't be served without a backend rewrite. The
 *  hash fragment gives each in-app page its own distinct, shareable, back/forward
 *  -capable URL (Folio.html#/program/leadership/tasks) with no server needed.
 *
 *  Each app owns the serialize (route -> path) and parse (path -> route) logic;
 *  this file only carries the browser mechanics:
 *    LHRoute.get()          -> current path string (no leading '#/')
 *    LHRoute.push(path)      -> new history entry (a real navigation)
 *    LHRoute.replace(path)   -> rewrite current entry (initial sync, redirects)
 *    LHRoute.onPop(fn)       -> fire fn on back/forward; returns an unsubscribe
 *
 *  pushState/replaceState do NOT emit popstate or hashchange, so writing the URL
 *  never re-triggers the app's own listener — no feedback loop, no guards needed.
 *  Back/forward buttons emit popstate; a hand-edited hash emits hashchange; we
 *  listen to both.
 */
(function () {
  function norm(p) { return String(p == null ? "" : p).replace(/^[#/]+|\/+$/g, ""); }
  function raw() { return String(location.hash || "").replace(/^#\/?/, ""); }
  // The page path (everything before the query string). Overlays/modals live in the query
  // (e.g. ?popup=new-experience) so they never disturb the route path a page parses.
  function get() {
    var s = raw().split("?")[0];
    try { return decodeURIComponent(s); } catch (e) { return s; }
  }
  function getQuery(key) {
    try { return new URLSearchParams(raw().split("?").slice(1).join("?")).get(key); }
    catch (e) { return null; }
  }
  function setQueries(obj, replace) {
    var parts = raw().split("?"), params;
    try { params = new URLSearchParams(parts.slice(1).join("?")); } catch (e) { params = new URLSearchParams(); }
    Object.keys(obj).forEach(function (k) { var v = obj[k]; if (v == null || v === "") params.delete(k); else params.set(k, String(v)); });
    var qs = params.toString();
    var h = "#/" + parts[0] + (qs ? "?" + qs : "");
    if (location.hash === h) return;
    try { history[replace ? "replaceState" : "pushState"](null, "", h); }
    catch (e) { location.hash = h; }
  }
  function setQuery(key, val, replace) { var o = {}; o[key] = val; setQueries(o, replace); }
  function write(path, replace) {
    // keep the current query (overlay state) when only the path changes
    var qs = raw().split("?").slice(1).join("?");
    var h = "#/" + norm(path) + (qs ? "?" + qs : "");
    if (location.hash === h) return;
    try { history[replace ? "replaceState" : "pushState"](null, "", h); }
    catch (e) { location.hash = h; }
  }
  function onPop(fn) {
    window.addEventListener("popstate", fn);
    window.addEventListener("hashchange", fn);
    return function () {
      window.removeEventListener("popstate", fn);
      window.removeEventListener("hashchange", fn);
    };
  }
  window.LHRoute = {
    norm: norm,
    get: get,
    getQuery: getQuery,
    setQuery: function (k, v) { setQuery(k, v, false); },
    replaceQuery: function (k, v) { setQuery(k, v, true); },
    setQueries: function (o) { setQueries(o, false); },
    push: function (p) { write(p, false); },
    replace: function (p) { write(p, true); },
    onPop: onPop
  };
})();

/*  Marsh wordmark logo — replaces the old "Mercer | Lighthouse" mark in the Marsh brand.
 *  One path, so colour and crop are runtime tweaks: white for dark rails / dark mode,
 *  navy (#000F47) for light rails (dark-theme.css inverts the navy variant to white).
 *  The "icon" variants crop the viewBox to the leading "M" for the collapsed rail.  */
(function () {
  var P = "M21.645 30.43h.556l12.868-6.04v19.874h8.101V0h-.676zM0 0v44.264h8.099V24.396l12.805 6.034h.619L.679 0zm68.962.37L48.24 44.263h8.167l3.622-8.112h17.659l3.648 8.112H90.3L69.519.37zm-6.078 29.385 5.943-13.311 5.985 13.311zm56.83-3.413c2.244-1.086 4.02-2.613 5.317-4.582q1.948-2.954 1.948-6.763c0-2.745-.663-5.14-1.981-7.19q-1.986-3.072-5.445-4.825-3.463-1.751-7.854-1.75H95.371v43.032h8.413V8.484h6.992q3.334-.001 5.595 1.75c1.508 1.168 2.259 2.76 2.259 4.765s-.756 3.618-2.259 4.825-3.372 1.814-5.595 1.814h-5.752l13.606 22.623h9.464l-10.605-17.062a15.6 15.6 0 0 0 2.225-.858m40.017-3.532a17.6 17.6 0 0 0-4.298-2.06 55 55 0 0 0-4.732-1.323 38 38 0 0 1-4.331-1.261c-1.303-.47-2.351-1.106-3.157-1.905q-1.208-1.2-1.206-3.23.001-2.456 2.194-4.088c1.464-1.086 3.263-1.628 5.411-1.628 2.428 0 4.688.41 6.77 1.232q3.123 1.229 5.101 3.259v-8.73a21.6 21.6 0 0 0-5.629-1.935 32.5 32.5 0 0 0-6.247-.582q-4.456 0-8.011 1.628-3.558 1.63-5.658 4.61c-1.398 1.988-2.103 4.316-2.103 6.978q-.001 3.44 1.204 5.655 1.21 2.21 3.156 3.563a17.2 17.2 0 0 0 4.332 2.153 61 61 0 0 0 4.732 1.383c1.565.392 3 .809 4.298 1.26 1.302.45 2.35 1.047 3.156 1.784l.01-.005c.806.741 1.207 1.72 1.207 2.953 0 1.639-.757 3-2.26 4.089-1.508 1.085-3.39 1.628-5.657 1.628-2.761 0-5.343-.491-7.733-1.473q-3.585-1.47-6-3.933v9.158a23.4 23.4 0 0 0 6.463 2.303c2.332.47 4.75.708 7.27.708q4.574 0 8.195-1.628 3.614-1.63 5.751-4.61c1.42-1.988 2.132-4.311 2.132-6.978q.001-3.379-1.204-5.533-1.21-2.15-3.156-3.442M199.589 1.23v17.767h-19.36V1.23h-8.411v43.034h8.411V26.25h19.36v18.013H208V1.23z";
  function src(fill, vb) {
    return "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + vb + '"><path fill="' + fill + '" d="' + P + '"/></svg>');
  }
  // On the dark primary-blue rail the logo is the brand light blue (#CEECFF "Sky"), not
  // pure white — per the brand guidelines. Navy (#000F47) is used on light rails.
  window.LHLogo = {
    wordmarkWhite: src("#CEECFF", "0 0 208 45"),
    wordmarkDark:  src("#000F47", "0 0 208 45"),
    iconWhite:     src("#CEECFF", "0 0 44 45"),
    iconDark:      src("#000F47", "0 0 44 45")
  };
})();
