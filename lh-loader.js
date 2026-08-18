/* ════════════════════════════════════════════════════════════════════
   lh-loader.js  —  Marsh-only in-page sign-in loader
   Shows a branded "signing you in" overlay ON TOP of the login screen
   (login stays visible, dimmed + blurred behind it), then the caller
   redirects to the dashboard. Only runs for the Marsh brand.

   API:  window.LHLoader.showLogin()   → paints the overlay, returns true
                                          (no-op + returns false off-Marsh)
   ════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var GOLD = "#FFBF00", WHITE = "#FFFFFF", SKY = "#CEECFF";
  var injected = false;

  function isMarsh() {
    try {
      if (window.LHBrand && typeof window.LHBrand.current === "function") return window.LHBrand.current() === "marsh";
      var b = document.documentElement.getAttribute("data-client-brand");
      return !b || b === "marsh";
    } catch (e) { return true; }
  }

  function injectStyles() {
    if (injected) return;
    injected = true;
    var css = document.createElement("style");
    css.textContent =
      "#lh-loader{position:fixed;inset:0;z-index:2147483647;display:flex;flex-direction:column;" +
      "align-items:center;justify-content:center;font-family:'Noto Sans',system-ui,sans-serif;" +
      "background:rgba(0,15,71,.52);-webkit-backdrop-filter:blur(7px) saturate(1.05);backdrop-filter:blur(7px) saturate(1.05);" +
      "opacity:0;transition:opacity .32s ease;}" +
      "#lh-loader.lh-in{opacity:1;}" +
      "#lh-loader .lh-l-stage{position:relative;width:128px;height:128px;display:flex;align-items:center;justify-content:center;}" +
      "#lh-loader .lh-l-ring{position:absolute;inset:0;opacity:0;animation:lhl-ringin .4s ease .92s forwards,lhl-spin 1.15s linear .92s infinite;}" +
      "#lh-loader .lh-l-ring circle{fill:none;stroke:" + GOLD + ";stroke-width:2.5;stroke-linecap:round;}" +
      "#lh-loader .lh-l-flash{position:absolute;width:96px;height:96px;border-radius:50%;background:radial-gradient(circle,rgba(255,191,0,.55),rgba(255,191,0,0) 68%);opacity:0;transform:scale(.4);animation:lhl-flash .55s ease-out .78s;}" +
      "#lh-loader .lh-l-mark{width:58px;height:auto;overflow:visible;filter:drop-shadow(0 4px 18px rgba(0,0,0,.35));transform-origin:50% 50%;animation:lhl-snap .42s cubic-bezier(.34,1.56,.55,1) .76s both;}" +
      "#lh-loader .lh-l-mark polygon{opacity:0;transform-origin:50% 50%;}" +
      "#lh-loader .lh-l-mark .lh-l-left{animation:lhl-in-l .8s cubic-bezier(.16,1,.3,1) .12s forwards;}" +
      "#lh-loader .lh-l-mark .lh-l-right{animation:lhl-in-r .8s cubic-bezier(.16,1,.3,1) .12s forwards;}" +
      "#lh-loader .lh-l-word{margin-top:28px;font-size:12.5px;letter-spacing:.22em;text-transform:uppercase;" +
      "color:rgba(255,255,255,.9);font-weight:600;opacity:0;animation:lhl-fade .5s ease .5s forwards;text-shadow:0 1px 8px rgba(0,0,0,.4);}" +
      "#lh-loader .lh-l-word i{font-style:normal;}" +
      "#lh-loader .lh-l-word i::after{content:'';animation:lhl-dots 1.4s steps(1,end) infinite;}" +
      "#lh-loader .lh-l-bar{margin-top:16px;width:118px;height:2px;border-radius:2px;background:rgba(255,255,255,.22);overflow:hidden;opacity:0;animation:lhl-fade .5s ease .5s forwards;}" +
      "#lh-loader .lh-l-bar i{display:block;height:100%;width:40%;border-radius:2px;background:" + GOLD + ";animation:lhl-slide 1.15s ease-in-out infinite;}" +
      "@keyframes lhl-spin{to{transform:rotate(360deg);}}" +
      "@keyframes lhl-ringin{from{opacity:0;}to{opacity:1;}}" +
      "@keyframes lhl-flash{0%{opacity:0;transform:scale(.4);}45%{opacity:1;}100%{opacity:0;transform:scale(1.25);}}" +
      "@keyframes lhl-snap{0%{transform:scale(1);}40%{transform:scale(1.14);}100%{transform:scale(1);}}" +
      "@keyframes lhl-in-l{0%{opacity:0;transform:translateX(-52px) rotate(-7deg);}70%{opacity:1;}100%{opacity:1;transform:translateX(0) rotate(0);}}" +
      "@keyframes lhl-in-r{0%{opacity:0;transform:translateX(52px) rotate(7deg);}70%{opacity:1;}100%{opacity:1;transform:translateX(0) rotate(0);}}" +
      "@keyframes lhl-fade{to{opacity:1;}}" +
      "@keyframes lhl-dots{0%{content:'';}25%{content:'.';}50%{content:'..';}75%{content:'...';}100%{content:'';}}" +
      "@keyframes lhl-slide{0%{transform:translateX(-110%);}100%{transform:translateX(330%);}}" +
      "@media(prefers-reduced-motion:reduce){#lh-loader .lh-l-ring,#lh-loader .lh-l-bar i{animation-duration:.001s;}" +
      "#lh-loader .lh-l-mark{animation:none!important;}#lh-loader .lh-l-flash{display:none;}" +
      "#lh-loader .lh-l-mark polygon{opacity:1!important;animation:none!important;transform:none!important;}}";
    (document.head || document.documentElement).appendChild(css);
  }

  function showLogin(msg) {
    if (!isMarsh()) return false;
    if (document.getElementById("lh-loader")) return true;
    injectStyles();
    var el = document.createElement("div");
    el.id = "lh-loader";
    el.setAttribute("role", "status");
    el.setAttribute("aria-label", "Signing you in");
    el.innerHTML =
      '<div class="lh-l-stage">' +
        '<div class="lh-l-flash" aria-hidden="true"></div>' +
        '<svg class="lh-l-ring" viewBox="0 0 100 100" aria-hidden="true">' +
          '<circle cx="50" cy="50" r="47" stroke-dasharray="78 220"></circle>' +
          '<circle cx="50" cy="50" r="47" stroke-dasharray="30 220" stroke-dashoffset="-150" opacity="0.55"></circle>' +
        '</svg>' +
        '<svg class="lh-l-mark" viewBox="0 0 43.17 44.26" aria-hidden="true">' +
          '<polygon class="lh-l-right" fill="' + SKY + '" points="42.49 0 21.65 30.43 22.2 30.43 35.07 24.39 35.07 44.26 43.17 44.26 43.17 0 42.49 0"></polygon>' +
          '<polygon class="lh-l-left" fill="' + WHITE + '" points="0 0 0 44.26 8.1 44.26 8.1 24.4 20.9 30.43 21.52 30.43 .68 0 0 0"></polygon>' +
        '</svg>' +
      '</div>' +
      '<div class="lh-l-word">' + (msg || "Signing you in") + '<i></i></div>';
    (document.body || document.documentElement).appendChild(el);
    // trigger fade-in next frame
    requestAnimationFrame(function () { el.classList.add("lh-in"); });
    return true;
  }

  window.LHLoader = { showLogin: showLogin };
})();
