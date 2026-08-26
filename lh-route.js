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
  function get() {
    try { return decodeURIComponent(String(location.hash || "").replace(/^#\/?/, "")); }
    catch (e) { return String(location.hash || "").replace(/^#\/?/, ""); }
  }
  function write(path, replace) {
    var h = "#/" + norm(path);
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
    push: function (p) { write(p, false); },
    replace: function (p) { write(p, true); },
    onPop: onPop
  };
})();
