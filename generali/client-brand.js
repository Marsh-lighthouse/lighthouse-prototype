// ════════════════════════════════════════════════
//  Client brand switcher — Marsh (default) · DGE · Generali
//  Applies the client's primary color + logos across the
//  login screens and the Folio app. Persists in
//  localStorage "lh-client-brand". When a client brand is
//  active it owns --primary/--accent/--action; the Tweaks
//  panel skips its color overrides (see lh-tweaks.jsx).
// ════════════════════════════════════════════════
(function () {
  var BRANDS = {
    marsh: {
      id: "marsh", label: "Marsh", dot: "#000F47"
    },
    dge: {
      id: "dge", label: "DG", dot: "#81A0BD",
      // DGE steel is a LIGHT fill — CTA text must be dark navy (white = ~2.7:1, fails AA); navy ≈ 6.6:1.
      vars: { "--primary": "#81A0BD", "--accent": "#54779B", "--action": "#81A0BD", "--action-text": "#000F47" },
      // Dark mode: lighter steel for fills/accents; steel CTA keeps dark text. Running
      // text is neutralised to light ink by dark-theme.css.
      varsDark: { "--primary": "#9DBBD8", "--accent": "#9DBBD8", "--action": "#81A0BD", "--action-text": "#0B1220" },
      logo: "brand/clients/dge.png", logoWhite: "brand/clients/dge-white.svg",
      icon: "brand/clients/dge-icon.png", iconWhite: "brand/clients/dge-icon-white.svg",
      railLogoH: 30, railIconH: 56, loginAlt: "Department of Government Enablement",
      // Login screen only: DGE-specific feature photo (user-supplied)
      loginPhoto: "brand/clients/dge-login.jpg"
    },
    generali: {
      id: "generali", label: "General", dot: "#AA1B17",
      vars: { "--primary": "#AA1B17", "--accent": "#AA1B17", "--action": "#AA1B17", "--action-text": "#FFFFFF" },
      // Dark mode: brighter red for the CTA (more presence on the dark canvas, white
      // text ≈4.8:1); lighter coral accents. Running text neutralised by dark-theme.css.
      varsDark: { "--primary": "#F0A6A2", "--accent": "#FF8A85", "--action": "#D23A34", "--action-text": "#FFFFFF" },
      logo: "brand/clients/generali.svg", logoWhite: "brand/clients/generali-white.svg",
      icon: "brand/clients/generali-icon.svg", iconWhite: "brand/clients/generali-icon-white.svg",
      railLogoH: 56, railIconH: 30, loginAlt: "Generali",
      // Login screen only: transparent people-collage PNG over the primary red
      loginPhoto: "brand/clients/generali-login.png"
    }
  };
  var VARS = ["--primary", "--accent", "--action", "--action-text"];

  // Friendly, shareable URL slugs (?brand=…). The internal ids stay put (they key
  // the asset paths); the slugs are what a shared link carries and reads back —
  // marsh / general / dg — with the raw ids accepted as aliases too.
  var SLUG_OF = { marsh: "marsh", generali: "general", dge: "dg" };   // id → url slug
  var ID_OF = { marsh: "marsh", general: "generali", generali: "generali", dg: "dge", dge: "dge" }; // slug/alias → id

  // Read the brand a shared link asks for, straight from the hash query string —
  // parsed WITHOUT LHRoute, since this file loads before lh-route.js and we want the
  // right brand applied pre-paint. Returns a canonical id, or null.
  function readUrlBrand() {
    try {
      var h = String(location.hash || "");
      var qi = h.indexOf("?");
      if (qi < 0) return null;
      var v = new URLSearchParams(h.slice(qi + 1)).get("brand");
      if (!v) return null;
      v = v.toLowerCase();
      return ID_OF[v] || (BRANDS[v] ? v : null);
    } catch (e) { return null; }
  }
  // Write the current brand into the hash query so the URL is shareable. Prefer
  // LHRoute (keeps the route path intact); fall back to editing the hash directly
  // if it hasn't loaded yet.
  function writeUrlBrand(id) {
    var slug = SLUG_OF[id] || id;
    try {
      if (window.LHRoute && LHRoute.replaceQuery) { LHRoute.replaceQuery("brand", slug); return; }
      var h = String(location.hash || "#/"), parts = h.replace(/^#\/?/, "").split("?");
      var params = new URLSearchParams(parts[1] || "");
      params.set("brand", slug);
      var qs = params.toString();
      location.hash = "#/" + parts[0] + (qs ? "?" + qs : "");
    } catch (e) {}
  }

  var current = "marsh";
  try { current = localStorage.getItem("lh-client-brand") || "marsh"; } catch (e) {}
  if (!BRANDS[current]) current = "marsh";
  // A brand named in the URL wins over the viewer's saved choice, so a shared
  // "?brand=general" link always opens in that brand regardless of local state.
  var urlBrand = readUrlBrand();
  if (urlBrand) { current = urlBrand; try { localStorage.setItem("lh-client-brand", current); } catch (e) {} }
  // ── Project brand lock ──
  // This is the dedicated Generali build: force the brand and hide the switcher,
  // regardless of URL or saved choice. Removing this one line makes it a normal
  // switchable build again.
  var LOCK = "generali";
  if (LOCK && BRANDS[LOCK]) { current = LOCK; try { localStorage.setItem("lh-client-brand", current); } catch (e) {} }

  function applyVars() {
    var r = document.documentElement;
    if (current === "marsh") {
      r.removeAttribute("data-client-brand");
      VARS.forEach(function (v) { r.style.removeProperty(v); });
    } else {
      r.setAttribute("data-client-brand", current);
      var b = BRANDS[current];
      // Dark mode uses the brand's dark palette so fills/accents stay legible on
      // the dark canvas (running text is neutralised to light ink by dark-theme.css).
      var dark = r.getAttribute("data-theme") === "dark";
      var vars = (dark && b.varsDark) ? b.varsDark : b.vars;
      // Set with !important so the brand accent/primary win over the stylesheet
      // !important locks (mds-folio.css and login-styles.css pin --accent:#0065AC).
      // An important inline declaration beats an important author-stylesheet rule,
      // so accents re-theme everywhere; Marsh clears these and falls back to the CSS.
      Object.keys(vars).forEach(function (k) { r.style.setProperty(k, vars[k], "important"); });
    }
  }

  // swap the auth-page logos (.lg-logo / .lg-logo--white) in place. The auth pages
  // embed the wordmark as an inline <svg>, so for a client brand we REPLACE each with
  // an <img> pointing at the brand logo (a plain src swap can't retint an inline SVG).
  function swapLoginLogos() {
    var b = BRANDS[current];
    var nodes = document.querySelectorAll(".lg-logo");
    Array.prototype.forEach.call(nodes, function (el) {
      if (current === "marsh") return;              // locked builds are never marsh
      var white = el.classList.contains("lg-logo--white");
      var src = white ? b.logoWhite : b.logo;
      var alt = b.loginAlt || b.label;
      if (el.tagName.toLowerCase() === "img") {
        if (!el.dataset.origSrc) el.dataset.origSrc = el.getAttribute("src") || "";
        el.setAttribute("src", src); el.setAttribute("alt", alt);
      } else {
        var img = document.createElement("img");
        // getAttribute, not .className: on an <svg> .className is an SVGAnimatedString.
        img.setAttribute("class", el.getAttribute("class") || "");   // keep .lg-logo / --white
        img.setAttribute("src", src); img.setAttribute("alt", alt);
        if (el.parentNode) el.parentNode.replaceChild(img, el);
      }
    });
  }

  // swap the feature photo for brands that define one — applies to EVERY auth
  // flow (Login, Sign up, Forgot password), each of which has a single #lg-photo.
  function swapLoginPhoto() {
    var photo = document.querySelector('#lg-photo');
    if (!photo) return;
    if (!photo.dataset.origSrc) photo.dataset.origSrc = photo.getAttribute("src");
    var b = BRANDS[current];
    photo.setAttribute("src", b.loginPhoto || photo.dataset.origSrc);
  }

  // ── chip UI ──
  var sw = null;
  function buildChip() {
    if (LOCK) return;   // locked project build — no brand switcher
    if (sw) return;
    sw = document.createElement("div");
    sw.className = "lh-brand-switch";
    var items = Object.keys(BRANDS).map(function (id) {
      var b = BRANDS[id];
      return '<button class="lh-brand-item" type="button" role="menuitemradio" data-brand="' + id + '" aria-checked="false">' +
        '<span class="lh-brand-dot" style="background:' + b.dot + '"></span>' +
        '<span class="lh-brand-name">' + b.label + '</span>' +
        '<span class="lh-check">✓</span></button>';
    }).join("");
    sw.innerHTML =
      '<button class="lh-brand-chip" type="button" aria-haspopup="true">' +
      '<span class="lh-brand-dot"></span><span class="lh-brand-label">Brand</span></button>' +
      '<div class="lh-brand-menu" role="menu"><div class="lh-brand-title">Brand</div>' + items + '</div>';

    // Append to controls bar if it exists, otherwise to body
    var controlsBar = document.querySelector('.lg-controls-bar');
    if (controlsBar) {
      controlsBar.insertBefore(sw, controlsBar.firstChild);
    } else {
      document.body.appendChild(sw);
    }

    sw.querySelector(".lh-brand-chip").addEventListener("click", function (e) {
      e.stopPropagation(); sw.classList.toggle("open");
    });
    Array.prototype.forEach.call(sw.querySelectorAll(".lh-brand-item"), function (b) {
      b.addEventListener("click", function () { set(b.dataset.brand); sw.classList.remove("open"); });
    });
    document.addEventListener("click", function (e) {
      if (!sw.contains(e.target)) sw.classList.remove("open");
    });
  }
  function syncChip() {
    if (!sw) return;
    sw.querySelector(".lh-brand-label").textContent = BRANDS[current].label;
    Array.prototype.forEach.call(sw.querySelectorAll(".lh-brand-item"), function (b) {
      b.setAttribute("aria-checked", b.dataset.brand === current ? "true" : "false");
    });
  }

  // Apply a brand everywhere. writeUrl=false when the change CAME from the URL
  // (a shared link or a back/forward hop) so we don't rewrite the hash we just read.
  function apply(id, writeUrl) {
    if (!BRANDS[id]) id = "marsh";
    current = id;
    try { localStorage.setItem("lh-client-brand", id); } catch (e) {}
    if (writeUrl) writeUrlBrand(id);
    applyVars();
    swapLoginLogos();
    swapLoginPhoto();
    syncChip();
    window.dispatchEvent(new CustomEvent("lh-brand-change", { detail: id }));
  }
  function set(id) { apply(id, true); }

  window.LHBrand = {
    brands: BRANDS,
    current: function () { return current; },
    get: function () { return BRANDS[current]; },
    set: set
  };

  // attr + vars right away (pre-paint when loaded in <head>); DOM bits on ready
  applyVars();
  // Re-apply the brand vars when light/dark flips, so a client brand swaps to its
  // dark palette (and back). Marsh is a no-op here (lh-tweaks owns its colours).
  window.addEventListener("lh-theme-change", function () { if (current !== "marsh") applyVars(); });
  function init() {
    swapLoginLogos(); swapLoginPhoto(); buildChip(); syncChip();
    // Now that lh-route.js is loaded: reflect the active brand in the URL (so even a
    // localStorage-only default becomes a shareable link) and follow back/forward.
    if (!LOCK && window.LHRoute && LHRoute.onPop) {
      if (current !== "marsh" || urlBrand) writeUrlBrand(current);
      LHRoute.onPop(function () { var b = readUrlBrand() || "marsh"; if (b !== current) apply(b, false); });
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
