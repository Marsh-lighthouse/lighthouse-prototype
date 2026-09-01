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
  var DEFAULT = 2; // slider's starting position the first time it's touched — MDS radius-sm (2px) base

  // Elements whose radius we drive. The attribute selector covers every
  // inline-styled rounded element in the React apps; the explicit element
  // and .lg-* selectors cover form controls + the class-based login chrome.
  var SEL = [
    '[style*="border-radius"]:not([style*="50%"])',
    'button:not([style*="50%"])', 'input:not([style*="50%"])',
    'select:not([style*="50%"])', 'textarea:not([style*="50%"])',
    ".lg-btn", ".lg-input", ".lg-form-panel", ".lg-alert", ".lg-cobrand-box",
    ".lg-style-chip", ".lg-type-chip", ".lg-style-menu", ".lg-type-menu", ".lg-style-item",
    ".lh-back", ".lh-brand-switch"
  ].join(",");

  function get() {
    try {
      var v = localStorage.getItem(KEY);
      if (v === null || v === "") return null;
      var n = parseInt(v, 10);
      return isNaN(n) ? null : n;
    } catch (e) { return null; }
  }

  function apply() {
    var v = get();
    var el = document.getElementById("lh-radius-style");
    if (v === null) {
      if (el) el.parentNode.removeChild(el);
      document.documentElement.removeAttribute("data-radius");
      return;
    }
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
    window.dispatchEvent(new CustomEvent("lh-radius-change", { detail: null }));
  }

  window.LHRadius = { get: get, set: set, reset: reset, apply: apply, DEFAULT: DEFAULT };

  apply();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  }
  window.addEventListener("storage", function (e) { if (e.key === KEY) apply(); });
})();
