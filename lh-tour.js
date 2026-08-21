// ════════════════════════════════════════════════════════════════
//  Lighthouse Guided Tour (coach-marks)  ·  first draft
//  Plain JS. Spotlight + tooltip with Back / Next / Skip.
//  Steps target elements via [data-tour="..."]. Auto-starts for
//  first-time users; re-launch via window.LHTour.start(name).
//  State: localStorage "lh-tour-done-<name>".
// ════════════════════════════════════════════════════════════════
(function () {
  var NAVY = "#000F47", GOLD = "#FFBF00", INK = "#1A2340", MUT = "#5A6488";

  // ── Tour definitions ────────────────────────────────────────────
  // before(): optional hook to move the app to the right screen.
  var TOURS = {
    dashboard: {
      steps: [
        { sel: '[data-tour="profile"]', title: "Your profile", body: "Your account, role and language live here. Open it to review your details or sign out.", place: "bottom" },
        { sel: '[data-tour="dash-stats"]', title: "Your workload at a glance", body: "Candidates assigned, evaluations to do, items awaiting moderation, and completed sign-offs.", place: "top" },
        { sel: '[data-tour="dash-evals"]', title: "Evaluations", body: "Jump straight into any candidate that's in progress or not yet started.", place: "top" },
        { sel: '[data-tour="dash-campaigns"]', title: "Active campaigns", body: "Track every campaign you're assigned to \u2014 candidate count, evaluation progress, and quick access to each cohort.", place: "top" },
        { sel: '[data-tour="dash-ac"]', title: "Assessment center", body: "See your active and upcoming assessment centers at a glance, with session times and quick access to each one.", place: "top" },
        { sel: '[data-tour="dash-participants"]', title: "Participants", body: "Review all participants across your assigned centers — their slot, scheduling status, and quick access to details.", place: "top" },
        { sel: '[data-tour="dash-avail"]', title: "Your availability", body: "Check and manage the time windows you've shared with campaigns so you're only scheduled when you can attend.", place: "top" }
      ]
    },
    evaluation: {
      before: function (done) {
        var nav = document.querySelector('[data-tour="nav-dashboard"]');
        if (nav) nav.click();
        setTimeout(done, 350);
      },
      steps: [
        { sel: '[data-tour="eval-tabs"]', title: "Two ways to work", body: "Switch between By Participant (one person at a time) and By Campaign (a whole cohort).", place: "top" },
        { sel: '[data-tour="eval-table"]', title: "Pick a candidate", body: "Open any row to see their assessments, then Evaluate their responses or Moderate the final scores.", place: "top" }
      ]
    },
    ac: {
      before: function (done) {
        var nav = document.querySelector('[data-tour="nav-ac"]');
        if (nav) nav.click();
        setTimeout(done, 350);
      },
      steps: [
        { sel: '[data-tour="ac-tabs"]', title: "Campaigns & participants", body: "Switch between Campaigns (each scheduled center) and Participants (everyone taking part) using these tabs.", place: "top" },
        { sel: '[data-tour="ac-timeframe"]', title: "Filter by timeframe", body: "Focus on what's running now, what's coming up, or review past centers.", place: "top" },
        { sel: '[data-tour="ac-search"]', title: "Find anything fast", body: "Search by ID, slot, campaign or participant name to jump straight to the record you need.", place: "left" },
        { sel: '[data-tour="ac-table-wrap"]', title: "Open a center", body: "Select any row to open its detail \u2014 subjects, activities, meeting links and scheduling status.", place: "top" }
      ]
    },
    availability: {
      before: function (done) {
        var nav = document.querySelector('[data-tour="nav-avail"]');
        if (nav) nav.click();
        setTimeout(done, 350);
      },
      steps: [
        { sel: '[data-tour="avail-form"]', title: "Set the date range", body: "Choose your timezone and the start and end dates this availability should cover.", place: "top" },
        { sel: '[data-tour="avail-days"]', title: "Pick days & time slots", body: "Select the weekdays you're free, then add one or more time slots for each \u2014 or copy one day's slots to all.", place: "top" },
        { sel: '[data-tour="avail-save"]', title: "Save & publish", body: "Save to publish your availability. It joins your list, where you can edit or remove it anytime.", place: "left" }
      ]
    }
  };

  // ── Overlay DOM (built once) ────────────────────────────────────
  var el = {};

  function build() {
    if (el.root) return;
    var root = document.createElement("div");
    root.id = "lh-tour-root";
    root.style.cssText = "position:fixed;inset:0;z-index:99999;display:none;font-family:var(--sans,system-ui,sans-serif)";
    root.innerHTML =
      '<div id="lh-tour-mask" style="position:absolute;inset:0"></div>' +
      '<div id="lh-tour-ring" style="position:absolute;border-radius:4px;box-shadow:0 0 0 9999px rgba(0,15,71,.55);transition:all .25s cubic-bezier(.4,0,.2,1);pointer-events:none"></div>' +
      '<div id="lh-tour-arrow" style="position:absolute;width:12px;height:12px;background:#fff;transform:rotate(45deg);box-shadow:-2px -2px 5px rgba(0,0,0,.06);transition:all .25s cubic-bezier(.4,0,.2,1);pointer-events:none;z-index:1"></div>' +
      '<div id="lh-tour-pop" style="position:absolute;width:400px;max-width:calc(100vw - 32px);background:#fff;border-radius:8px;box-shadow:0 6px 16px 0 rgba(0,0,0,.08),0 3px 6px -4px rgba(0,0,0,.12),0 9px 28px 8px rgba(0,0,0,.05);padding:16px;transition:all .25s cubic-bezier(.4,0,.2,1)">' +
        '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px">' +
          '<div id="lh-tour-title" style="font-size:15px;font-weight:700;color:' + NAVY + ';line-height:1.4;margin-bottom:4px"></div>' +
          '<div style="display:flex;align-items:center;gap:12px;flex-shrink:0">' +
            '<button id="lh-tour-skip" style="background:none;border:none;color:' + MUT + ';font-size:13px;cursor:pointer;padding:0;white-space:nowrap">Skip tour</button>' +
            '<button id="lh-tour-close" style="background:none;border:none;cursor:pointer;padding:0;color:' + MUT + ';display:flex;flex-shrink:0" title="Close"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>' +
          '</div>' +
        '</div>' +
        '<div id="lh-tour-body" style="font-size:14px;line-height:1.57;color:' + INK + ';margin-bottom:14px"></div>' +
        '<div style="display:flex;align-items:center;gap:6px">' +
          '<div id="lh-tour-dots" style="display:flex;gap:4px;align-items:center"></div>' +
          '<div style="flex:1"></div>' +
          '<button id="lh-tour-back" style="background:#fff;border:1px solid rgba(0,15,71,.18);color:' + NAVY + ';font-size:14px;font-weight:600;cursor:pointer;padding:4px 15px;border-radius:6px;line-height:1.57">Previous</button>' +
          '<button id="lh-tour-next" style="background:' + GOLD + ';border:1px solid ' + GOLD + ';color:' + NAVY + ';font-size:14px;font-weight:700;cursor:pointer;padding:4px 15px;border-radius:6px;line-height:1.57"></button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(root);
    el.root = root;
    el.mask = root.querySelector("#lh-tour-mask");
    el.ring = root.querySelector("#lh-tour-ring");
    el.arrow = root.querySelector("#lh-tour-arrow");
    el.pop = root.querySelector("#lh-tour-pop");
    el.title = root.querySelector("#lh-tour-title");
    el.body = root.querySelector("#lh-tour-body");
    el.close = root.querySelector("#lh-tour-close");
    el.skip = root.querySelector("#lh-tour-skip");
    el.back = root.querySelector("#lh-tour-back");
    el.next = root.querySelector("#lh-tour-next");
    el.dots = root.querySelector("#lh-tour-dots");

    el.skip.addEventListener("click", finish);
    el.close.addEventListener("click", finish);
    el.mask.addEventListener("click", finish);
    el.back.addEventListener("click", function () { go(state.i - 1); });
    el.next.addEventListener("click", function () {
      if (state.i >= state.steps.length - 1) finish();
      else go(state.i + 1);
    });
    window.addEventListener("resize", function () { if (state.active) position(); });
  }

  var state = { active: false, steps: [], i: 0, name: null };

  function place(step) {
    var target = document.querySelector(step.sel);
    var pad = 4;
    if (!target) {
      el.ring.style.opacity = "0";
      el.arrow.style.opacity = "0";
      el.pop.style.left = (window.innerWidth / 2 - 170) + "px";
      el.pop.style.top = (window.innerHeight / 2 - 90) + "px";
      return;
    }
    el.ring.style.opacity = "1";
    el.arrow.style.opacity = "1";
    var r = target.getBoundingClientRect();
    el.ring.style.left = (r.left - pad) + "px";
    el.ring.style.top = (r.top - pad) + "px";
    el.ring.style.width = (r.width + pad * 2) + "px";
    el.ring.style.height = (r.height + pad * 2) + "px";

    var pw = 400, ph = el.pop.offsetHeight || 160, gap = 14;
    var pos = step.place || "bottom", left, top, aLeft, aTop;
    if (pos === "right") { left = r.right + gap; top = r.top + r.height / 2 - ph / 2; }
    else if (pos === "left") { left = r.left - pw - gap; top = r.top + r.height / 2 - ph / 2; }
    else if (pos === "top") { left = r.left + r.width / 2 - pw / 2; top = r.top - ph - gap; }
    else { left = r.left + r.width / 2 - pw / 2; top = r.bottom + gap; }
    left = Math.max(16, Math.min(left, window.innerWidth - pw - 16));
    top = Math.max(16, Math.min(top, window.innerHeight - ph - 16));
    el.pop.style.left = left + "px";
    el.pop.style.top = top + "px";
    // Arrow
    var as = 6;
    if (pos === "bottom") { aLeft = r.left + r.width / 2 - as; aTop = top - as; }
    else if (pos === "top") { aLeft = r.left + r.width / 2 - as; aTop = top + ph - as; }
    else if (pos === "right") { aLeft = left - as; aTop = r.top + r.height / 2 - as; }
    else { aLeft = left + pw - as; aTop = r.top + r.height / 2 - as; }
    aLeft = Math.max(left + 16, Math.min(aLeft, left + pw - 28));
    aTop = Math.max(top + 8, Math.min(aTop, top + ph - 20));
    el.arrow.style.left = aLeft + "px";
    el.arrow.style.top = aTop + "px";
  }

  function go(i) {
    if (i < 0 || i >= state.steps.length) return;
    state.i = i;
    var step = state.steps[i];
    // Dots
    var dots = "";
    for (var d = 0; d < state.steps.length; d++) {
      dots += '<span style="display:inline-block;width:6px;height:6px;border-radius:3px;background:' + (d === i ? NAVY : 'rgba(0,15,71,.2)') + '"></span>';
    }
    el.dots.innerHTML = dots;
    el.title.textContent = step.title;
    el.body.textContent = step.body;
    el.back.style.display = i === 0 ? "none" : "inline-block";
    el.next.textContent = i >= state.steps.length - 1 ? "Finish" : "Next";
    var t = document.querySelector(step.sel);
    if (t) { try { t.scrollIntoView({ block: "center", behavior: "instant" }); } catch (e) {} }
    setTimeout(function () { place(step); }, 100);
  }

  function start(name) {
    var tour = TOURS[name];
    if (!tour) return;
    build();
    state.name = name;
    var run = function () {
      state.steps = tour.steps;
      state.i = 0;
      state.active = true;
      el.root.style.display = "block";
      go(0);
    };
    if (tour.before) tour.before(run); else run();
  }

  function finish() {
    state.active = false;
    if (el.root) el.root.style.display = "none";
    if (state.name) { try { localStorage.setItem("lh-tour-done-" + state.name, "1"); } catch (e) {} }
  }

  function maybeAutoStart() {
    var done;
    try { done = localStorage.getItem("lh-tour-done-dashboard"); } catch (e) {}
    if (done) return;
    // wait until the dashboard is actually on screen
    var tries = 0;
    var iv = setInterval(function () {
      // A modal can hold the tour back (the "new experience" invitation does), so a
      // first-time assessor gets one thing at a time. Waiting doesn't burn retries.
      if (window.__LH_TOUR_HOLD) return;
      tries++;
      if (document.querySelector('[data-tour="profile"]')) {
        clearInterval(iv);
        setTimeout(function () { start("dashboard"); }, 500);
      } else if (tries > 40) { clearInterval(iv); }
    }, 300);
  }

  window.LHTour = { start: start, finish: finish, reset: function () { try { ["dashboard", "evaluation", "ac", "availability"].forEach(function (n) { localStorage.removeItem("lh-tour-done-" + n); }); } catch (e) {} } };

  // ── Persistent launcher (bottom-left) ───────────────────────────
  function buildLauncher() {
    if (document.getElementById("lh-tour-launcher")) return;
    var wrap = document.createElement("div");
    wrap.id = "lh-tour-launcher";
    wrap.style.cssText = "position:fixed;left:20px;bottom:80px;z-index:9998;font-family:var(--sans,system-ui,sans-serif)";
    wrap.innerHTML =
      '<div id="lh-tour-menu" style="display:none;background:#fff;border:1px solid rgba(0,15,71,.14);border-radius:12px;box-shadow:0 16px 44px rgba(6,12,40,.22);padding:6px;margin-bottom:10px;min-width:200px">' +
        '<div style="font-size:14px;font-weight:800;letter-spacing:.6px;text-transform:uppercase;color:' + MUT + ';padding:8px 12px 6px">Guided tours</div>' +
        '<button data-tour-go="dashboard" style="display:block;width:100%;text-align:left;padding:10px 12px;border:none;background:none;border-radius:8px;font-size:14px;font-weight:600;color:' + NAVY + ';cursor:pointer">Assessor Dashboard</button>' +
        '<button data-tour-go="evaluation" style="display:block;width:100%;text-align:left;padding:10px 12px;border:none;background:none;border-radius:8px;font-size:14px;font-weight:600;color:' + NAVY + ';cursor:pointer">Assessor Evaluation</button>' +
        '<button data-tour-go="ac" style="display:block;width:100%;text-align:left;padding:10px 12px;border:none;background:none;border-radius:8px;font-size:14px;font-weight:600;color:' + NAVY + ';cursor:pointer">Assessment Center</button>' +
        '<button data-tour-go="availability" style="display:block;width:100%;text-align:left;padding:10px 12px;border:none;background:none;border-radius:8px;font-size:14px;font-weight:600;color:' + NAVY + ';cursor:pointer">Availability</button>' +
      '</div>' +
      '<button id="lh-tour-fab" title="Guided tours" style="display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 15px;border-radius:20px;border:1px solid rgba(0,15,71,.14);background:#fff;color:' + NAVY + ';font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 6px 20px rgba(6,12,40,.16)">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12" y2="17"/></svg>' +
        'Take a tour' +
      '</button>';
    document.body.appendChild(wrap);
    wrap.style.display = "none";
    var menu = wrap.querySelector("#lh-tour-menu");
    wrap.querySelector("#lh-tour-fab").addEventListener("click", function () {
      menu.style.display = menu.style.display === "none" ? "block" : "none";
    });
    wrap.querySelectorAll("[data-tour-go]").forEach(function (b) {
      b.addEventListener("mouseenter", function () { b.style.background = "rgba(0,15,71,.05)"; });
      b.addEventListener("mouseleave", function () { b.style.background = "none"; });
      b.addEventListener("click", function () { menu.style.display = "none"; start(b.getAttribute("data-tour-go")); });
    });
    document.addEventListener("click", function (e) { if (!wrap.contains(e.target)) menu.style.display = "none"; });
    // Only show the launcher once the dashboard app is on screen (not on auth screens)
    setInterval(function () {
      var appRoot = document.getElementById("app-root");
      var dashUp = !!document.querySelector('[data-tour="profile"]') && (!appRoot || appRoot.style.display !== "none");
      wrap.style.display = dashUp ? "block" : "none";
      if (!dashUp) menu.style.display = "none";
    }, 500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { maybeAutoStart(); buildLauncher(); });
  else { maybeAutoStart(); buildLauncher(); }
})();
