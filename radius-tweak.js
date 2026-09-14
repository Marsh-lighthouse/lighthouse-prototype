// ════════════════════════════════════════════════
//  Lighthouse Radius — global border-radius control.
//  A single slider (in the Tweaks panel) sets a uniform border-radius
//  on every box, button, status, banner, input and panel across ALL
//  pages (Folio, Boardroom, Focus, Console + login pages).
//
//  How it works: a stylesheet rule with !important beats the inline
//  border-radius values used throughout the React apps. Because it is a
//  stylesheet rule (not per-node), it also applies to nodes React mounts
//  later. True circles (border-radius:50% — avatars, dots, rings) are
//  excluded so they stay round.
//
//  State lives in localStorage "lh-radius":
//    • absent / ""  → DEFAULT (no override — native varied radii)
//    • a number     → uniform radius in px (0 = fully square)
//
//  window.LHRadius = { get, set, reset, apply, DEFAULT }
// ════════════════════════════════════════════════
(function () {
  var KEY = "lh-radius";
  var DEFAULT = 2; // MDS baseline — every card/button/pill/badge is 2px unless the switch says otherwise.

  // Elements whose radius we drive. The attribute selector covers every
  // inline-styled rounded element in the React apps; the explicit element
  // and .lg-* selectors cover form controls + the class-based login chrome.
  // The Tweaks panel itself (.twk-panel subtree) and its gear FAB are excluded
  // so the control's own chrome keeps its native radii while it drives the page.
  var NOTPANEL = ':not(.twk-panel *):not(.lh-tweak-fab)';
  // Never touch true circles (50%) or true pills (999/99/9999px) — radio dots,
  // avatars, toggle switches. Badges authored as pills are re-shaped by the
  // normalization layer (mds-folio.css) instead, so they still follow the switch.
  var NOTROUND = ':not([style*="50%"]):not([style*="border-radius: 999"]):not([style*="border-radius: 99px"]):not([style*="border-radius: 9999"])';
  var SEL = [
    '[style*="border-radius"]' + NOTROUND + NOTPANEL,
    'button' + NOTROUND + NOTPANEL, 'input:not([style*="50%"])' + NOTPANEL,
    'select:not([style*="50%"])' + NOTPANEL, 'textarea:not([style*="50%"])' + NOTPANEL,
    ".lg-btn", ".lg-input", ".lg-form-panel", ".lg-alert", ".lg-cobrand-box",
    ".lg-style-chip", ".lg-type-chip", ".lg-style-menu", ".lg-type-menu", ".lg-style-item",
    ".lh-back", ".lh-brand-switch",
    // directions page (Lighthouse.html) — the flow cards + their inner mock panels
    ".card:not([style*=\"50%\"])", ".s-card"
  ].join(",");

  // Unset localStorage resolves to the MDS default (2px), not "no override":
  // the whole platform is uniformly 2px out of the box, driven entirely by the
  // Rounded-corners switch. Only an explicit stored number overrides that.
  function get() {
    try {
      var v = localStorage.getItem(KEY);
      if (v === null || v === "") return DEFAULT;
      var n = parseInt(v, 10);
      return isNaN(n) ? DEFAULT : n;
    } catch (e) { return DEFAULT; }
  }

  function apply() {
    var v = get();
    if (v === null || isNaN(v)) v = DEFAULT;
    // (1) Drive the MDS normalization layer (mds-folio.css) — its high-specificity
    //     !important rules resolve to var(--lh-radius, 2px), so setting this one
    //     custom property retints every normalized card/badge/button/input on the
    //     app pages (where the flat SEL rule below is outranked by that layer).
    document.documentElement.style.setProperty("--lh-radius", v + "px");
    // (2) Emit the flat !important rule for pages WITHOUT the normalization layer
    //     (the static directions page's .card, the class-based login chrome).
    var el = document.getElementById("lh-radius-style");
    if (!el) {
      el = document.createElement("style");
      el.id = "lh-radius-style";
      (document.head || document.documentElement).appendChild(el);
    }
    el.textContent = SEL + "{border-radius:" + v + "px !important;}";
    document.documentElement.setAttribute("data-radius", String(v));
  }

  function set(v) {
    var n = Math.max(0, parseInt(v, 10) || 0);
    try { localStorage.setItem(KEY, String(n)); } catch (e) {}
    apply();
    window.dispatchEvent(new CustomEvent("lh-radius-change", { detail: n }));
  }

  function reset() {
    try { localStorage.removeItem(KEY); } catch (e) {}
    apply();
    // Unset now means the MDS default (2px), so report DEFAULT, not null.
    window.dispatchEvent(new CustomEvent("lh-radius-change", { detail: DEFAULT }));
  }

  window.LHRadius = { get: get, set: set, reset: reset, apply: apply, DEFAULT: DEFAULT };

  apply();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  }
  window.addEventListener("storage", function (e) { if (e.key === KEY) apply(); });
})();
