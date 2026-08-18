// ════════════════════════════════════════════════
//  Login Type Switch (Sign Up / Forgot Password)
//  The Participant / SSO / Magic Link chip. On these
//  pages there are no login forms, so picking a type
//  stores it and navigates to Login.html, which reads
//  localStorage "lh-login-type" on load.
// ════════════════════════════════════════════════
(function () {
  function init() {
    var chipBtn = document.getElementById("lg-type-chip-btn");
    var menu = document.getElementById("lg-type-menu");
    var label = document.getElementById("lg-type-label");
    var sw = document.getElementById("lg-type-switch");
    if (!chipBtn || !menu || !sw) return;

    var items = menu.querySelectorAll(".lg-type-item");

    function setActive(type) {
      items.forEach(function (it) {
        var on = it.dataset.type === type;
        it.classList.toggle("active", on);
        it.setAttribute("aria-checked", on ? "true" : "false");
        if (on && label) label.textContent = it.textContent.split("✓")[0].trim();
      });
    }

    // Reflect saved type in the chip label (default participant)
    var saved = "participant";
    try { saved = localStorage.getItem("lh-login-type") || "participant"; } catch (e) {}
    setActive(saved);
    // If "Error Screens" was chosen, show the error demo on this page
    if (saved === "errors" && window.LHErrors) { LHErrors.show(); }

    chipBtn.addEventListener("click", function (e) {
      e.preventDefault();
      menu.classList.toggle("active");
    });

    document.addEventListener("click", function (e) {
      if (!sw.contains(e.target)) menu.classList.remove("active");
    });

    items.forEach(function (it) {
      it.addEventListener("click", function (e) {
        e.preventDefault();
        var type = it.dataset.type;
        try { localStorage.setItem("lh-login-type", type); } catch (err) {}
        menu.classList.remove("active");
        // "Error Screens" stays on this page and shows the error demo
        if (type === "errors") {
          setActive("errors");
          if (window.LHErrors) LHErrors.show();
          return;
        }
        // Other flows live on the login screen
        if (window.LHErrors) LHErrors.clear();
        window.location.href = "Login.html";
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
