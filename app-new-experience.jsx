// ══════════════════════════════════════════════════════════════════════════
//  New Assessor Experience — the invitation that opens before the guided tour.
//
//  Self-contained on purpose: the Assessor page doesn't load app-shared.jsx, so
//  this file brings its own palette (mirroring lighthouse-assessor-editorial.jsx),
//  its own icons and its own keyframes.
//
//  It holds the tour back while it's open (window.__LH_TOUR_HOLD) and hands over
//  when dismissed, so a first-time assessor sees invitation → tour, never both.
// ══════════════════════════════════════════════════════════════════════════
(function () {
  var NAVY = "#000F47";
  var TEAL = "#0B4BFF";
  var TX = "#1B2856";
  var TM = "#47527B";
  var BD = "rgba(0,15,71,.11)";
  var GOLD = "#FFBF00";
  var SEEN_KEY = "lh-new-exp-seen";

  // Hold the tour from the moment this script loads, so it can't fire behind the
  // dialog. Cleared the instant the assessor chooses either way.
  var seen = null;
  try { seen = localStorage.getItem(SEEN_KEY); } catch (e) {}
  if (!seen) { window.__LH_TOUR_HOLD = true; }

  // ── keyframes ───────────────────────────────────────────────────────────
  function styles() {
    if (document.getElementById("ne-style")) return;
    var s = document.createElement("style");
    s.id = "ne-style";
    s.textContent = [
      "@keyframes ne-in{from{opacity:0;transform:translateY(14px) scale(.985)}to{opacity:1;transform:none}}",
      "@keyframes ne-fade{from{opacity:0}to{opacity:1}}",
      // a screen slides in from the right as the previous one leaves
      "@keyframes ne-screen{from{opacity:0;transform:translateX(26px) scale(.97)}to{opacity:1;transform:none}}",
      // rows inside a screen settle in one after another
      "@keyframes ne-row{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}",
      // the accent sweep across the frame while a screen lands
      "@keyframes ne-sweep{0%{transform:translateX(-120%)}100%{transform:translateX(320%)}}",
      "@keyframes ne-pulse{0%,100%{opacity:.35;transform:scale(1)}50%{opacity:.75;transform:scale(1.08)}}",
      ".ne-dialog{animation:ne-in .34s cubic-bezier(.22,.95,.3,1) both}",
      ".ne-mask{animation:ne-fade .22s ease both}",
      ".ne-screen{animation:ne-screen .5s cubic-bezier(.22,.95,.3,1) both}",
      ".ne-row{animation:ne-row .42s cubic-bezier(.22,.95,.3,1) both}",
      ".ne-sweep{animation:ne-sweep 1.5s ease-in-out .1s both}",
      ".ne-pulse{animation:ne-pulse 2.2s ease-in-out infinite}",
      ".ne-cta{transition:transform .15s ease, box-shadow .15s ease}",
      ".ne-cta:hover{transform:translateY(-1px);box-shadow:0 10px 24px rgba(11,75,255,.28)}",
      ".ne-ghost:hover{background:rgba(0,15,71,.05)}",
      ".ne-dot{transition:width .25s ease, background .25s ease}",
      "@media (prefers-reduced-motion: reduce){",
      "  .ne-dialog,.ne-screen,.ne-row,.ne-sweep,.ne-pulse{animation:none!important}",
      "}",
      "@media (max-width: 900px){ .ne-split{flex-direction:column!important} .ne-stage{min-height:290px!important} }"
    ].join("\n");
    document.head.appendChild(s);
  }

  // ── tiny building blocks for the screen mock-ups ────────────────────────
  function bar(w, h, c, r) {
    return { width: w, height: h || 8, borderRadius: r === undefined ? 3 : r, background: c || "rgba(0,15,71,.13)" };
  }
  function Row(props) {
    // one staggered line inside a screen
    return React.createElement("div", {
      className: "ne-row",
      style: Object.assign({ animationDelay: (props.i || 0) * 0.06 + 0.12 + "s" }, props.style)
    }, props.children);
  }

  // 01 · Dashboard — stat tiles over the evaluations table
  function ScreenDashboard() {
    var tiles = [["6", "Candidates"], ["4", "Evaluations"], ["1", "Moderation"], ["1", "Completed"]];
    return React.createElement("div", { style: { padding: "14px 16px" } },
      React.createElement(Row, { i: 0, style: { display: "flex", gap: 8, marginBottom: 12 } },
        tiles.map(function (t, i) {
          return React.createElement("div", {
            key: i,
            style: { flex: 1, background: "#fff", border: "1px solid " + BD, borderRadius: 8, padding: "9px 10px" }
          },
            React.createElement("div", { style: { fontFamily: "var(--serif, Georgia, serif)", fontSize: 19, lineHeight: 1, color: i === 1 ? TEAL : NAVY, fontWeight: 600 } }, t[0]),
            React.createElement("div", { style: { marginTop: 5 } }, React.createElement("div", { style: bar("78%", 5) }))
          );
        })
      ),
      React.createElement(Row, { i: 1, style: { background: "#fff", border: "1px solid " + BD, borderRadius: 8, overflow: "hidden" } },
        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, padding: "9px 11px", borderBottom: "1px solid " + BD } },
          React.createElement("div", { style: bar(64, 6, "rgba(0,15,71,.28)") }),
          React.createElement("div", { style: { flex: 1 } }),
          React.createElement("div", { style: bar(34, 6, "rgba(11,75,255,.35)") })
        ),
        [0, 1, 2, 3].map(function (i) {
          return React.createElement("div", {
            key: i, className: "ne-row",
            style: {
              display: "flex", alignItems: "center", gap: 9, padding: "9px 11px",
              borderBottom: i === 3 ? "none" : "1px solid " + BD,
              animationDelay: 0.22 + i * 0.07 + "s",
              background: i === 1 ? "rgba(11,75,255,.05)" : "transparent"
            }
          },
            React.createElement("div", { style: { width: 18, height: 18, borderRadius: 999, background: i === 1 ? TEAL : "rgba(0,15,71,.16)", flexShrink: 0 } }),
            React.createElement("div", { style: { flex: 1 } },
              React.createElement("div", { style: bar(i === 1 ? "58%" : "44%", 6) }),
              React.createElement("div", { style: Object.assign(bar("30%", 4), { marginTop: 4 }) })
            ),
            React.createElement("div", { style: { width: 46, height: 15, borderRadius: 999, background: i < 2 ? "rgba(11,75,255,.14)" : "rgba(0,15,71,.07)" } })
          );
        })
      )
    );
  }

  // 02 · Evaluate — the scoring form, one indicator being scored
  function ScreenEvaluate() {
    return React.createElement("div", { style: { padding: "14px 16px", display: "flex", gap: 10 } },
      React.createElement("div", { style: { flex: 1 } },
        React.createElement(Row, { i: 0, style: { marginBottom: 10 } },
          React.createElement("div", { style: bar(120, 7, "rgba(0,15,71,.3)") }),
          React.createElement("div", { style: Object.assign(bar("70%", 5), { marginTop: 6 }) })
        ),
        [0, 1].map(function (b) {
          return React.createElement("div", {
            key: b, className: "ne-row",
            style: {
              background: "#fff", border: "1px solid " + (b === 0 ? "rgba(11,75,255,.4)" : BD),
              borderRadius: 8, padding: "10px 11px", marginBottom: 8,
              boxShadow: b === 0 ? "0 0 0 3px rgba(11,75,255,.10)" : "none",
              animationDelay: 0.18 + b * 0.1 + "s"
            }
          },
            React.createElement("div", { style: bar(b === 0 ? "62%" : "48%", 6) }),
            React.createElement("div", { style: { display: "flex", gap: 5, marginTop: 9 } },
              [1, 2, 3, 4, 5].map(function (n) {
                var on = b === 0 && n === 4;
                return React.createElement("div", {
                  key: n,
                  style: {
                    width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                    border: "1px solid " + (on ? TEAL : BD),
                    background: on ? TEAL : "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--sans, system-ui, sans-serif)", fontSize: 11, fontWeight: 700,
                    color: on ? "#fff" : "rgba(0,15,71,.34)"
                  }
                }, n);
              })
            ),
            b === 0 ? React.createElement("div", { style: { marginTop: 9, height: 26, borderRadius: 6, background: "rgba(0,15,71,.04)", border: "1px solid " + BD } }) : null
          );
        })
      ),
      React.createElement(Row, { i: 3, style: { width: 62, flexShrink: 0 } },
        React.createElement("div", { style: { background: "#fff", border: "1px solid " + BD, borderRadius: 8, padding: 8 } },
          [0, 1, 2].map(function (i) {
            return React.createElement("div", { key: i, style: Object.assign(bar("100%", 5), { marginBottom: i === 2 ? 0 : 6 }) });
          })
        )
      )
    );
  }

  // 03 · Moderate — the consolidation matrix, Final column carrying the decision
  function ScreenModerate() {
    return React.createElement("div", { style: { padding: "14px 16px" } },
      React.createElement(Row, { i: 0, style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 9 } },
        React.createElement("div", { style: bar(96, 7, "rgba(0,15,71,.3)") }),
        React.createElement("div", { style: { flex: 1 } }),
        React.createElement("div", { style: { width: 60, height: 16, borderRadius: 6, border: "1px solid " + BD, background: "#fff" } })
      ),
      React.createElement("div", { style: { border: "1px solid " + BD, borderRadius: 8, overflow: "hidden", background: "#fff" } },
        // header: assessor columns + the navy Final column
        React.createElement("div", { className: "ne-row", style: { display: "flex", animationDelay: ".16s" } },
          React.createElement("div", { style: { flex: 1.5, padding: "8px 10px", background: "rgba(0,15,71,.04)" } }, React.createElement("div", { style: bar("70%", 5, "rgba(0,15,71,.26)") })),
          [0, 1].map(function (i) { return React.createElement("div", { key: i, style: { flex: 1, padding: "8px 6px", background: "rgba(0,15,71,.04)", display: "flex", justifyContent: "center" } }, React.createElement("div", { style: { width: 14, height: 14, borderRadius: 999, background: i ? "rgba(197,53,50,.4)" : "rgba(11,75,255,.4)" } })); }),
          React.createElement("div", { style: { flex: 1, padding: "8px 6px", background: "rgba(0,15,71,.06)" } }, React.createElement("div", { style: bar("74%", 5, "rgba(0,15,71,.26)") })),
          React.createElement("div", { style: { flex: 1, padding: "8px 6px", background: NAVY } }, React.createElement("div", { style: bar("70%", 5, "rgba(255,255,255,.85)") }))
        ),
        [0, 1, 2, 3].map(function (i) {
          var group = i === 0 || i === 2;
          return React.createElement("div", {
            key: i, className: "ne-row",
            style: { display: "flex", borderTop: "1px solid " + BD, background: group ? "rgba(0,15,71,.03)" : "#fff", animationDelay: 0.22 + i * 0.07 + "s" }
          },
            React.createElement("div", { style: { flex: 1.5, padding: "8px 10px" } }, React.createElement("div", { style: bar(group ? "56%" : "72%", 5, group ? "rgba(0,15,71,.3)" : "rgba(0,15,71,.13)") })),
            [0, 1].map(function (k) { return React.createElement("div", { key: k, style: { flex: 1, padding: "8px 6px", display: "flex", justifyContent: "center" } }, group ? null : React.createElement("div", { style: bar(11, 5) })); }),
            React.createElement("div", { style: { flex: 1, padding: "8px 6px", display: "flex", justifyContent: "center" } }, group ? null : React.createElement("div", { style: bar(11, 5) })),
            React.createElement("div", { style: { flex: 1, padding: "6px", display: "flex", justifyContent: "center" } },
              group ? null : React.createElement("div", { style: { width: 26, height: 15, borderRadius: 4, border: "1px solid " + (i === 1 ? TEAL : BD), background: i === 1 ? "rgba(11,75,255,.10)" : "#fff" } })
            )
          );
        })
      )
    );
  }

  // 04 · Assessment Centre — session detail over the subject list
  function ScreenCentre() {
    return React.createElement("div", { style: { padding: "14px 16px" } },
      React.createElement(Row, { i: 0, style: { marginBottom: 10 } },
        React.createElement("div", { style: bar(150, 8, "rgba(0,15,71,.3)") })
      ),
      React.createElement(Row, { i: 1, style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: BD, border: "1px solid " + BD, borderRadius: 8, overflow: "hidden", marginBottom: 10 } },
        [0, 1, 2, 3, 4, 5, 6, 7].map(function (i) {
          return React.createElement("div", { key: i, style: { background: "#fff", padding: "9px 10px" } },
            React.createElement("div", { style: bar("62%", 4) }),
            i === 2
              ? React.createElement("div", { style: { marginTop: 6, width: 34, height: 13, borderRadius: 999, background: "rgba(20,133,61,.14)" } })
              : React.createElement("div", { style: Object.assign(bar("80%", 6, "rgba(0,15,71,.22)"), { marginTop: 6 }) })
          );
        })
      ),
      React.createElement("div", { style: { background: "#fff", border: "1px solid " + BD, borderRadius: 8, overflow: "hidden" } },
        [0, 1, 2].map(function (i) {
          return React.createElement("div", {
            key: i, className: "ne-row",
            style: { display: "flex", alignItems: "center", gap: 9, padding: "9px 11px", borderBottom: i === 2 ? "none" : "1px solid " + BD, animationDelay: 0.26 + i * 0.08 + "s" }
          },
            React.createElement("div", { style: { width: 17, height: 17, borderRadius: 999, background: ["rgba(11,75,255,.35)", "rgba(197,53,50,.3)", "rgba(0,15,71,.16)"][i], flexShrink: 0 } }),
            React.createElement("div", { style: { flex: 1 } }, React.createElement("div", { style: bar(["52%", "44%", "60%"][i], 6) })),
            React.createElement("div", { style: { width: 26, height: 14, borderRadius: 999, background: i === 0 ? TEAL : "rgba(0,15,71,.10)" } })
          );
        })
      )
    );
  }

  var SCREENS = [
    { key: "dash", label: "Assessor Dashboard", note: "Everything assigned to you, in one place.", render: ScreenDashboard },
    { key: "eval", label: "Evaluate", note: "Score each indicator without losing your place.", render: ScreenEvaluate },
    { key: "mod", label: "Moderate", note: "Compare assessors and agree the final score.", render: ScreenModerate },
    { key: "ac", label: "Assessment Centre", note: "Run the session and track every subject.", render: ScreenCentre }
  ];

  // ── the framed, auto-advancing showcase ─────────────────────────────────
  function Showcase() {
    var st = React.useState(0), idx = st[0], setIdx = st[1];
    var hv = React.useState(false), hover = hv[0], setHover = hv[1];
    React.useEffect(function () {
      if (hover) return;
      var t = setTimeout(function () { setIdx(function (n) { return (n + 1) % SCREENS.length; }); }, 3600);
      return function () { clearTimeout(t); };
    }, [idx, hover]);
    var s = SCREENS[idx];
    return React.createElement("div", {
      className: "ne-stage",
      onMouseEnter: function () { setHover(true); },
      onMouseLeave: function () { setHover(false); },
      style: { flex: 1, minWidth: 0, background: "linear-gradient(160deg, rgba(11,75,255,.07), rgba(0,15,71,.05))", padding: "26px 26px 20px", display: "flex", flexDirection: "column", justifyContent: "center", minHeight: 380 }
    },
      // browser-ish frame
      React.createElement("div", { style: { position: "relative", background: "#fff", borderRadius: 12, border: "1px solid " + BD, boxShadow: "0 22px 50px rgba(0,15,71,.16)", overflow: "hidden" } },
        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, padding: "8px 11px", borderBottom: "1px solid " + BD, background: "rgba(0,15,71,.02)" } },
          [0, 1, 2].map(function (i) { return React.createElement("span", { key: i, style: { width: 7, height: 7, borderRadius: 999, background: "rgba(0,15,71,.16)" } }); }),
          React.createElement("div", { style: { flex: 1, display: "flex", justifyContent: "center" } },
            React.createElement("div", { style: { padding: "2px 12px", borderRadius: 999, background: "rgba(0,15,71,.05)", fontFamily: "var(--sans, system-ui, sans-serif)", fontSize: 10.5, fontWeight: 600, color: TM } }, s.label)
          ),
          React.createElement("span", { style: { width: 7, height: 7 } })
        ),
        // an accent sweep marks each change of screen
        React.createElement("div", { key: "sweep-" + idx, className: "ne-sweep", style: { position: "absolute", top: 0, bottom: 0, width: "38%", pointerEvents: "none", zIndex: 3, background: "linear-gradient(100deg, transparent, rgba(11,75,255,.10), transparent)" } }),
        React.createElement("div", { style: { display: "flex", background: "rgba(0,15,71,.02)", minHeight: 214 } },
          // mini rail
          React.createElement("div", { style: { width: 42, flexShrink: 0, background: NAVY, padding: "12px 8px" } },
            [0, 1, 2, 3].map(function (i) {
              return React.createElement("div", {
                key: i,
                style: { height: 7, borderRadius: 3, marginBottom: 9, background: i === idx ? GOLD : "rgba(255,255,255,.22)", width: i === idx ? "100%" : "72%", transition: "background .3s ease, width .3s ease" }
              });
            })
          ),
          React.createElement("div", { key: s.key, className: "ne-screen", style: { flex: 1, minWidth: 0 } }, React.createElement(s.render))
        )
      ),
      // caption + dots
      React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, marginTop: 16 } },
        React.createElement("div", { key: "cap-" + idx, className: "ne-row", style: { flex: 1, minWidth: 0, fontFamily: "var(--sans, system-ui, sans-serif)", fontSize: 13.5, color: TX } },
          React.createElement("b", { style: { color: NAVY } }, s.label), " — ", s.note
        ),
        React.createElement("div", { style: { display: "flex", gap: 5, flexShrink: 0 } },
          SCREENS.map(function (x, i) {
            return React.createElement("button", {
              key: x.key, className: "ne-dot", onClick: function () { setIdx(i); },
              "aria-label": "Show " + x.label,
              style: { width: i === idx ? 20 : 7, height: 7, borderRadius: 999, border: "none", padding: 0, cursor: "pointer", background: i === idx ? TEAL : "rgba(0,15,71,.18)" }
            });
          })
        )
      )
    );
  }

  // ── the dialog ──────────────────────────────────────────────────────────
  function Dialog() {
    var op = React.useState(function () {
      var v = null;
      try { v = localStorage.getItem(SEEN_KEY); } catch (e) {}
      return !v;
    });
    var open = op[0], setOpen = op[1];

    React.useEffect(function () { if (open) styles(); }, [open]);

    // Only "try" hands over to the tour. Someone who said "maybe later" has declined
    // the new experience — walking them through it anyway would ignore the answer they
    // just gave. They can still start it themselves from the Take a tour launcher.
    var close = function (choice) {
      try { localStorage.setItem(SEEN_KEY, choice); } catch (e) {}
      setOpen(false);
      if (choice !== "try") return;                 // hold stays on: no auto-tour
      window.__LH_TOUR_HOLD = false;
      setTimeout(function () {
        var done = null;
        try { done = localStorage.getItem("lh-tour-done-dashboard"); } catch (e) {}
        if (!done && window.LHTour && window.LHTour.start) window.LHTour.start("dashboard");
      }, 420);
    };

    React.useEffect(function () {
      if (!open) return;
      var onKey = function (e) { if (e.key === "Escape") close("later"); };
      document.addEventListener("keydown", onKey);
      return function () { document.removeEventListener("keydown", onKey); };
    }, [open]);

    if (!open) return null;

    return ReactDOM.createPortal(
      React.createElement("div", { className: "ne-mask", style: { position: "fixed", inset: 0, zIndex: 10000, background: "rgba(6,12,40,.55)", backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 } },
        React.createElement("div", {
          className: "ne-dialog", role: "dialog", "aria-modal": "true", "aria-label": "New assessor experience",
          style: { width: "min(1000px, 100%)", maxHeight: "92vh", overflow: "auto", background: "#fff", borderRadius: 18, boxShadow: "0 40px 90px rgba(6,12,40,.34)", display: "flex", flexDirection: "column" }
        },
          React.createElement("div", { className: "ne-split", style: { display: "flex", alignItems: "stretch" } },
            // ── left: the message
            React.createElement("div", { style: { flex: "0 0 42%", minWidth: 0, padding: "34px 32px 28px", display: "flex", flexDirection: "column" } },
              React.createElement("div", { style: { display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: 7, padding: "5px 11px", borderRadius: 999, background: "rgba(11,75,255,.10)", color: TEAL, fontFamily: "var(--sans, system-ui, sans-serif)", fontSize: 12, fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase" } },
                React.createElement("span", { className: "ne-pulse", style: { width: 7, height: 7, borderRadius: 999, background: TEAL, display: "inline-block" } }),
                "New experience"
              ),
              React.createElement("h2", { style: { fontFamily: "var(--serif, Georgia, serif)", fontSize: 30, lineHeight: 1.15, color: NAVY, margin: "16px 0 0", fontWeight: 600 } }, "A new way to assess."),
              React.createElement("p", { style: { fontFamily: "var(--sans, system-ui, sans-serif)", fontSize: 15, lineHeight: 1.6, color: TX, margin: "12px 0 0" } },
                "We've rebuilt the assessor experience — a clearer dashboard, faster scoring, and moderation that shows every assessor side by side."
              ),
              React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 9, margin: "18px 0 0" } },
                ["Everything assigned to you on one dashboard", "Score and moderate without losing your place", "Same data, same sign-off — nothing is lost"].map(function (t, i) {
                  return React.createElement("div", { key: i, style: { display: "flex", gap: 9, alignItems: "flex-start", fontFamily: "var(--sans, system-ui, sans-serif)", fontSize: 14, color: TX, lineHeight: 1.45 } },
                    React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: TEAL, strokeWidth: "2.4", strokeLinecap: "round", strokeLinejoin: "round", style: { flexShrink: 0, marginTop: 2 } }, React.createElement("path", { d: "M20 6L9 17l-5-5" })),
                    t
                  );
                })
              ),
              React.createElement("div", { style: { flex: 1, minHeight: 14 } }),
              // the "soon" note — this is where it's going, not just an option
              React.createElement("div", { style: { display: "flex", gap: 9, alignItems: "flex-start", padding: "11px 13px", borderRadius: 10, background: "rgba(255,191,0,.10)", border: "1px solid rgba(255,191,0,.34)", margin: "0 0 18px" } },
                React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "#8A6400", strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round", style: { flexShrink: 0, marginTop: 1 } },
                  React.createElement("circle", { cx: "12", cy: "12", r: "9" }), React.createElement("path", { d: "M12 8v5l3 2" })),
                React.createElement("div", { style: { fontFamily: "var(--sans, system-ui, sans-serif)", fontSize: 13, lineHeight: 1.5, color: "#6B4E00" } },
                  "Everyone moves to the new experience soon. Switch whenever you're ready — you can go back from ",
                  React.createElement("b", null, "Profile settings"), " until then."
                )
              ),
              React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" } },
                React.createElement("button", {
                  className: "ne-ghost", onClick: function () { close("later"); },
                  style: { flex: "0 0 auto", padding: "12px 20px", borderRadius: 10, border: "1px solid " + BD, background: "#fff", color: TX, fontFamily: "var(--sans, system-ui, sans-serif)", fontSize: 15, fontWeight: 600, cursor: "pointer" }
                }, "Maybe later"),
                React.createElement("button", {
                  className: "ne-cta", onClick: function () { close("try"); },
                  style: { flex: 1, minWidth: 190, padding: "12px 22px", borderRadius: 10, border: "none", background: TEAL, color: "#fff", fontFamily: "var(--sans, system-ui, sans-serif)", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }
                },
                  "Try new experience",
                  React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round" }, React.createElement("path", { d: "M5 12h13" }), React.createElement("path", { d: "M12 5l7 7-7 7" }))
                )
              )
            ),
            // ── right: the animated showcase
            React.createElement(Showcase)
          )
        ),
        // close affordance, top-right of the dialog
        React.createElement("button", {
          onClick: function () { close("later"); }, "aria-label": "Close",
          style: { position: "fixed", top: "max(28px, 4vh)", right: "max(28px, 4vw)", width: 38, height: 38, borderRadius: 999, border: "1px solid rgba(255,255,255,.28)", background: "rgba(255,255,255,.12)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10001 }
        }, React.createElement("svg", { width: "17", height: "17", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.1", strokeLinecap: "round" }, React.createElement("path", { d: "M6 6l12 12" }), React.createElement("path", { d: "M18 6L6 18" })))
      ),
      document.body
    );
  }

  window.LHNewExperience = {
    Dialog: Dialog,
    // Demo helper: clear the flag so the invitation (and the tour) run again.
    reset: function () {
      try { localStorage.removeItem(SEEN_KEY); } catch (e) {}
      if (window.LHTour && window.LHTour.reset) window.LHTour.reset();
      location.reload();
    }
  };
})();
