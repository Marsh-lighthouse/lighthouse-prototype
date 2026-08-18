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
      id: "dge", label: "DGE", dot: "#81A0BD",
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
      id: "generali", label: "Generali", dot: "#AA1B17",
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

  var current = "marsh";
  try { current = localStorage.getItem("lh-client-brand") || "marsh"; } catch (e) {}
  if (!BRANDS[current]) current = "marsh";

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
      Object.keys(vars).forEach(function (k) { r.style.setProperty(k, vars[k]); });
    }
  }

  // swap the auth-page logos (.lg-logo / .lg-logo--white) in place
  function swapLoginLogos() {
    var b = BRANDS[current];
    [
      [document.querySelector(".lg-logo:not(.lg-logo--white)"), "logo"],
      [document.querySelector(".lg-logo--white"), "logoWhite"]
    ].forEach(function (pair) {
      var el = pair[0];
      if (!el) return;
      if (!el.dataset.origSrc) el.dataset.origSrc = el.getAttribute("src");
      el.setAttribute("src", current === "marsh" ? el.dataset.origSrc : b[pair[1]]);
      el.setAttribute("alt", current === "marsh" ? "Mercer Lighthouse" : b.loginAlt);
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

  function set(id) {
    if (!BRANDS[id]) id = "marsh";
    current = id;
    try { localStorage.setItem("lh-client-brand", id); } catch (e) {}
    applyVars();
    swapLoginLogos();
    swapLoginPhoto();
    syncChip();
    window.dispatchEvent(new CustomEvent("lh-brand-change", { detail: id }));
  }

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
  function init() { swapLoginLogos(); swapLoginPhoto(); buildChip(); syncChip(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
