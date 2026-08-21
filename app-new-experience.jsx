// ══════════════════════════════════════════════════════════════════════════
//  New Assessor Experience — the invitation that opens before the guided tour.
//
//  Self-contained on purpose: the Assessor page doesn't load app-shared.jsx, so
//  this file brings its own palette (mirroring lighthouse-assessor-editorial.jsx),
//  its own icons and its own keyframes.
//
//  The four miniatures follow the real screens' structure — the dashboard's stat
//  row and two-up cards, Evaluate's Brief | Your Response split, Moderate's
//  assessor-columns-to-Final matrix, the centre's info grid over its subject list.
//  They're an indication of the layout, not a pixel copy.
//
//  Four layouts and three motions are switchable from a floating chip so the shape
//  can be chosen from the real thing rather than described.
//
//  Holds the tour back while open (window.__LH_TOUR_HOLD); hands over on opt-in.
// ══════════════════════════════════════════════════════════════════════════
(function () {
  var NAVY = "#000F47";
  var TEAL = "#0B4BFF";
  var TX = "#1B2856";
  var TM = "#47527B";
  var BD = "rgba(0,15,71,.11)";
  var GOLD = "#FFBF00";
  var GREEN = "#14853D";
  var RED = "#C53532";
  var SANS = "var(--sans, system-ui, sans-serif)";
  var SERIF = "var(--serif, Georgia, serif)";
  var SEEN_KEY = "lh-new-exp-seen";
  var DESIGN_KEY = "ne-popup-design";
  var MOTION_KEY = "ne-popup-motion";

  var seen = null;
  try { seen = localStorage.getItem(SEEN_KEY); } catch (e) {}
  if (!seen) { window.__LH_TOUR_HOLD = true; }

  function styles() {
    if (document.getElementById("ne-style")) return;
    var s = document.createElement("style");
    s.id = "ne-style";
    s.textContent = [
      "@keyframes ne-in{from{opacity:0;transform:translateY(14px) scale(.985)}to{opacity:1;transform:none}}",
      "@keyframes ne-fade{from{opacity:0}to{opacity:1}}",
      "@keyframes ne-row{from{opacity:0;transform:translateY(9px)}to{opacity:1;transform:none}}",
      "@keyframes ne-sweep{0%{transform:translateX(-130%)}100%{transform:translateX(330%)}}",
      "@keyframes ne-pulse{0%,100%{opacity:.35;transform:scale(1)}50%{opacity:.8;transform:scale(1.1)}}",
      "@keyframes ne-cursor{0%{opacity:0;transform:translate(10px,10px) scale(.9)}18%{opacity:1;transform:none}72%{opacity:1;transform:none}100%{opacity:0;transform:none}}",
      "@keyframes ne-ring{0%{opacity:0;transform:scale(.6)}30%{opacity:.9}100%{opacity:0;transform:scale(1.9)}}",
      // motion 1 · slide
      "@keyframes ne-slide{from{opacity:0;transform:translateX(30px) scale(.975)}to{opacity:1;transform:none}}",
      // motion 2 · settle (soft cross-fade + lift)
      "@keyframes ne-settle{from{opacity:0;transform:translateY(12px) scale(.99)}to{opacity:1;transform:none}}",
      // motion 3 · deck (screens deal forward like cards)
      "@keyframes ne-deal{from{opacity:0;transform:translateY(22px) rotate(-1.4deg) scale(.94)}60%{opacity:1}to{opacity:1;transform:none}}",
      ".ne-dialog{animation:ne-in .34s cubic-bezier(.22,.95,.3,1) both}",
      ".ne-mask{animation:ne-fade .22s ease both}",
      ".ne-row{animation:ne-row .44s cubic-bezier(.22,.95,.3,1) both}",
      ".ne-sweep{animation:ne-sweep 1.6s ease-in-out .1s both}",
      ".ne-pulse{animation:ne-pulse 2.2s ease-in-out infinite}",
      ".ne-cursor{animation:ne-cursor 2.8s ease-out 1s both}",
      ".ne-ring{animation:ne-ring 1.5s ease-out 1.15s both}",
      ".ne-m1{animation:ne-slide .5s cubic-bezier(.22,.95,.3,1) both}",
      ".ne-m2{animation:ne-settle .55s cubic-bezier(.22,.95,.3,1) both}",
      ".ne-m3{animation:ne-deal .58s cubic-bezier(.22,.95,.3,1) both}",
      ".ne-cta{transition:transform .15s ease, box-shadow .15s ease}",
      ".ne-cta:hover{transform:translateY(-1px);box-shadow:0 10px 24px rgba(0,15,71,.32)}",
      ".ne-ghost:hover{background:rgba(0,15,71,.05)}",
      ".ne-dot{transition:width .25s ease, background .25s ease}",
      ".ne-chip button{transition:background .15s ease,color .15s ease}",
      "@media (prefers-reduced-motion: reduce){.ne-dialog,.ne-row,.ne-sweep,.ne-pulse,.ne-cursor,.ne-ring,.ne-m1,.ne-m2,.ne-m3{animation:none!important}}",
      "@media (max-width: 980px){.ne-split{flex-direction:column!important}.ne-left{flex:1 1 auto!important}.ne-stage{min-height:320px!important}}"
    ].join("\n");
    document.head.appendChild(s);
  }

  // ── shared bits ─────────────────────────────────────────────────────────
  function Row(p) {
    return React.createElement("div", { className: "ne-row", style: Object.assign({ animationDelay: (p.i || 0) * 0.07 + 0.12 + "s" }, p.style) }, p.children);
  }
  function pill(text, tone) {
    var map = { blue: { bg: "rgba(11,75,255,.10)", fg: TEAL }, green: { bg: "rgba(20,133,61,.11)", fg: GREEN },
      amber: { bg: "rgba(255,191,0,.20)", fg: "#8A6400" }, grey: { bg: "rgba(0,15,71,.06)", fg: TM } }[tone || "grey"];
    return React.createElement("span", { style: { display: "inline-block", padding: "2px 7px", borderRadius: 999, background: map.bg, color: map.fg, fontSize: 9, fontWeight: 700, whiteSpace: "nowrap" } }, text);
  }
  function avatar(initials, color, size) {
    var d = size || 19;
    return React.createElement("span", { style: { width: d, height: d, borderRadius: 999, background: color, color: "#fff", fontSize: d < 18 ? 7.5 : 8, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, initials);
  }
  function tabs(items, active) {
    return React.createElement("div", { style: { display: "flex", gap: 14, borderBottom: "1px solid " + BD, marginBottom: 9 } },
      items.map(function (t, i) {
        var on = i === active;
        return React.createElement("span", { key: i, style: { paddingBottom: 6, fontFamily: SANS, fontSize: 9.5, fontWeight: on ? 700 : 500, color: on ? NAVY : TM, borderBottom: "2px solid " + (on ? NAVY : "transparent"), marginBottom: -1, whiteSpace: "nowrap" } }, t);
      })
    );
  }
  function Cursor(p) {
    return React.createElement("div", { style: { position: "absolute", left: p.x, top: p.y, pointerEvents: "none", zIndex: 4 } },
      React.createElement("div", { className: "ne-ring", style: { position: "absolute", left: -13, top: -13, width: 28, height: 28, borderRadius: 999, border: "2px solid " + TEAL } }),
      React.createElement("svg", { className: "ne-cursor", width: "17", height: "17", viewBox: "0 0 24 24", fill: "#fff", stroke: NAVY, strokeWidth: "1.4", strokeLinejoin: "round", style: { filter: "drop-shadow(0 2px 4px rgba(0,15,71,.3))" } },
        React.createElement("path", { d: "M5 3l14 8-6.5 1.8L9.5 19z" })));
  }
  function card(children, style) {
    return React.createElement("div", { style: Object.assign({ background: "#fff", border: "1px solid " + BD, borderRadius: 8, overflow: "hidden" }, style) }, children);
  }

  // 01 · Assessor Dashboard — stat row, then Evaluations beside Active campaigns
  function ScreenDashboard() {
    var tiles = [["6", "Candidates"], ["4", "Evaluations to do"], ["1", "Awaiting moderation"], ["1", "Completed"]];
    var evals = [["LW", "Lukas Weber", "In progress", "blue", TEAL], ["DU", "Demo User", "In progress", "blue", "#7A4BD0"],
      ["SB", "Sofia Bianchi", "Not started", "amber", "#B4770A"], ["AM", "Alessandro Moretti", "Completed", "green", GREEN]];
    var camps = [["Generali DGE 2026", "6", "2/6"], ["Allianz — Global T…", "3", "2/3"], ["Munich Re — Lea…", "3", "0/3"]];
    return React.createElement("div", { style: { padding: "12px 14px", position: "relative" } },
      React.createElement(Row, { i: 0, style: { fontFamily: SERIF, fontSize: 16, color: NAVY, marginBottom: 9 } }, "Good morning, Elena."),
      React.createElement(Row, { i: 1, style: { display: "flex", gap: 6, marginBottom: 10 } },
        tiles.map(function (t, i) {
          return React.createElement("div", { key: i, style: { flex: 1, minWidth: 0, background: "#fff", border: "1px solid " + BD, borderRadius: 8, padding: "7px 8px" } },
            React.createElement("div", { style: { fontFamily: SERIF, fontSize: 18, lineHeight: 1, color: i === 1 ? TEAL : NAVY } }, t[0]),
            React.createElement("div", { style: { fontFamily: SANS, fontSize: 8, color: TM, marginTop: 3, lineHeight: 1.25 } }, t[1]));
        })),
      React.createElement(Row, { i: 2, style: { display: "flex", gap: 8 } },
        card([
          React.createElement("div", { key: "h", style: { display: "flex", alignItems: "center", padding: "6px 9px", borderBottom: "1px solid " + BD } },
            React.createElement("span", { style: { flex: 1, fontFamily: SANS, fontSize: 9.5, fontWeight: 700, color: NAVY } }, "Evaluations"),
            React.createElement("span", { style: { fontFamily: SANS, fontSize: 8.5, fontWeight: 600, color: TEAL } }, "View all ›")),
          evals.map(function (r, i) {
            return React.createElement("div", { key: i, className: "ne-row", style: { display: "flex", alignItems: "center", gap: 7, padding: "6px 9px", borderBottom: i === evals.length - 1 ? "none" : "1px solid " + BD, animationDelay: 0.28 + i * 0.06 + "s", background: i === 0 ? "rgba(11,75,255,.04)" : "transparent" } },
              avatar(r[0], r[4], 17),
              React.createElement("span", { style: { flex: 1, minWidth: 0, fontFamily: SANS, fontSize: 9.5, fontWeight: 600, color: TX, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, r[1]),
              pill(r[2], r[3]));
          })
        ], { flex: 1.15, minWidth: 0 }),
        card([
          React.createElement("div", { key: "h", style: { display: "flex", alignItems: "center", padding: "6px 9px", borderBottom: "1px solid " + BD } },
            React.createElement("span", { style: { flex: 1, fontFamily: SANS, fontSize: 9.5, fontWeight: 700, color: NAVY } }, "Active campaigns"),
            React.createElement("span", { style: { fontFamily: SANS, fontSize: 8.5, fontWeight: 600, color: TEAL } }, "View all ›")),
          React.createElement("div", { key: "sub", style: { display: "flex", padding: "5px 9px", borderBottom: "1px solid " + BD } },
            React.createElement("span", { style: { flex: 1, fontFamily: SANS, fontSize: 8, color: TM } }, "Campaign"),
            React.createElement("span", { style: { width: 26, textAlign: "center", fontFamily: SANS, fontSize: 8, color: TM } }, "Cand."),
            React.createElement("span", { style: { width: 34, textAlign: "center", fontFamily: SANS, fontSize: 8, color: TM } }, "Eval")),
          camps.map(function (c, i) {
            return React.createElement("div", { key: i, className: "ne-row", style: { display: "flex", alignItems: "center", padding: "7px 9px", borderBottom: i === camps.length - 1 ? "none" : "1px solid " + BD, animationDelay: 0.3 + i * 0.07 + "s" } },
              React.createElement("span", { style: { flex: 1, minWidth: 0, fontFamily: SANS, fontSize: 9, fontWeight: 600, color: TX, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, c[0]),
              React.createElement("span", { style: { width: 26, textAlign: "center", fontFamily: SANS, fontSize: 9, color: TX } }, c[1]),
              React.createElement("span", { style: { width: 34, textAlign: "center", fontFamily: SANS, fontSize: 9, fontWeight: 700, color: NAVY } }, c[2]));
          })
        ], { flex: 1, minWidth: 0 })
      ),
      React.createElement(Cursor, { x: 92, y: 150 })
    );
  }

  // 02 · Evaluate — the real split: Assessor Brief | Your Response
  function ScreenEvaluate() {
    return React.createElement("div", { style: { position: "relative", height: "100%", display: "flex", flexDirection: "column" } },
      React.createElement(Row, { i: 0, style: { display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderBottom: "1px solid " + BD, background: "rgba(0,15,71,.02)" } },
        React.createElement("div", { style: { flex: 1, minWidth: 0 } },
          React.createElement("span", { style: { fontFamily: SERIF, fontSize: 14, color: NAVY } }, "Lukas Weber"),
          React.createElement("span", { style: { fontFamily: SANS, fontSize: 8.5, color: TM, marginLeft: 5 } }, "· l.weber@tte.email")),
        React.createElement("div", { style: { textAlign: "right" } },
          React.createElement("div", { style: { fontFamily: SANS, fontSize: 8, color: TM } }, "Forms complete"),
          React.createElement("div", { style: { fontFamily: SANS, fontSize: 9.5, fontWeight: 700, color: TX } }, "3 / 5")),
        React.createElement("div", { style: { width: 22, height: 22, borderRadius: 999, border: "2.5px solid " + TEAL, borderRightColor: "rgba(0,15,71,.12)", borderBottomColor: "rgba(0,15,71,.12)", flexShrink: 0 } })),
      React.createElement("div", { style: { flex: 1, display: "flex", minHeight: 0 } },
        // left · Assessor Brief (read only)
        React.createElement(Row, { i: 1, style: { width: "44%", borderRight: "1px solid rgba(0,15,71,.18)", padding: "9px 11px", background: "rgba(0,15,71,.02)", minWidth: 0 } },
          React.createElement("div", { style: { fontFamily: SANS, fontSize: 9.5, fontWeight: 700, color: NAVY, marginBottom: 7 } }, "Assessor Brief"),
          tabs(["Overview", "Role play"], 0),
          React.createElement("div", { style: { fontFamily: SANS, fontSize: 8.5, color: TM, lineHeight: 1.65 } },
            "The participant presents a turnaround plan to the board. Observe how they read the market and commit to a direction under challenge.")),
        // right · Your Response (editable)
        React.createElement(Row, { i: 2, style: { flex: 1, padding: "9px 11px", background: "#fff", minWidth: 0 } },
          React.createElement("div", { style: { fontFamily: SANS, fontSize: 9.5, fontWeight: 700, color: NAVY, marginBottom: 7 } }, "Your Response"),
          React.createElement("div", { style: { display: "flex", gap: 10, borderBottom: "1px solid " + BD, marginBottom: 9 } },
            [["1. Leadership", true], ["2. Strategy", false]].map(function (t, i) {
              return React.createElement("span", { key: i, style: { display: "inline-flex", alignItems: "center", gap: 4, paddingBottom: 6, borderBottom: "2px solid " + (i === 0 ? NAVY : "transparent"), marginBottom: -1, fontFamily: SANS, fontSize: 9, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? NAVY : TM, whiteSpace: "nowrap" } },
                React.createElement("span", { style: { width: 9, height: 9, borderRadius: 999, background: t[1] ? GREEN : GOLD, flexShrink: 0 } }), t[0]);
            })),
          React.createElement("div", { style: { fontFamily: SANS, fontSize: 8, fontWeight: 700, color: TEAL } }, "ST1"),
          React.createElement("div", { style: { fontFamily: SANS, fontSize: 10, fontWeight: 600, color: TX, marginTop: 2 } }, "Reads market signals"),
          React.createElement("div", { style: { display: "flex", gap: 4, marginTop: 8 } },
            [1, 2, 3, 4, 5].map(function (n) {
              var on = n === 4;
              return React.createElement("div", { key: n, style: { width: 23, height: 23, borderRadius: 6, border: "1px solid " + (on ? TEAL : BD), background: on ? TEAL : "#fff", color: on ? "#fff" : "rgba(0,15,71,.38)", fontFamily: SANS, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" } }, n);
            })),
          React.createElement("div", { style: { marginTop: 8, borderRadius: 6, background: "rgba(0,15,71,.03)", border: "1px solid " + BD, padding: "6px 7px", fontFamily: SANS, fontSize: 8.5, color: TM, lineHeight: 1.5 } },
            "Spotted the shift before the panel raised it…"))),
      React.createElement(Cursor, { x: 296, y: 176 })
    );
  }

  // 03 · Moderate — assessor columns resolving into the navy Final column
  function ScreenModerate() {
    var head = ["Competency / Indicator", "WB", "ET", "Range", "Avg", "Final"];
    var col = [1.85, 0.5, 0.5, 0.62, 0.5, 0.8];
    var rows = [
      { group: "Strategic Thinker" },
      { code: "ST1", name: "Reads market signals", v: ["4", "4", "4 – 4", "4.00"], fin: "4" },
      { code: "ST3", name: "Connects unit to Group", v: ["3.33", "3.33", "3.3 – 3.3", "3.33"], fin: "3.3", hot: true },
      { group: "Impactful Decision Maker" },
      { code: "IDM1", name: "Timely calls under pressure", v: ["3", "3.50", "3 – 4", "3.40"], fin: "3.4" }
    ];
    return React.createElement("div", { style: { position: "relative", height: "100%", display: "flex", flexDirection: "column" } },
      React.createElement(Row, { i: 0, style: { display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderBottom: "1px solid " + BD } },
        avatar("AM", GREEN),
        React.createElement("span", { style: { flex: 1, fontFamily: SERIF, fontSize: 14, color: NAVY } }, "Alessandro Moretti"),
        React.createElement("span", { style: { fontFamily: SANS, fontSize: 8.5, fontWeight: 600, color: TM, border: "1px solid " + BD, borderRadius: 6, padding: "3px 7px", background: "#fff" } }, "Collapse all")),
      React.createElement("div", { style: { padding: "8px 12px", flex: 1, minHeight: 0 } },
        React.createElement(Row, { i: 1, style: { display: "flex", gap: 12, marginBottom: 7, fontFamily: SANS, fontSize: 8.5, color: TM } },
          React.createElement("span", null, React.createElement("b", { style: { color: TX } }, "Assessor 1:"), " William Bennett"),
          React.createElement("span", null, React.createElement("b", { style: { color: TX } }, "Assessor 2:"), " Elizabeth Turner")),
        card([
          React.createElement("div", { key: "h", className: "ne-row", style: { display: "flex", animationDelay: ".2s" } },
            head.map(function (h, i) {
              return React.createElement("div", { key: i, style: { flex: col[i], padding: "6px 5px", background: i === 5 ? NAVY : "rgba(0,15,71,.04)", color: i === 5 ? "#fff" : TM, fontFamily: SANS, fontSize: 8.5, fontWeight: 700, textAlign: i === 0 ? "left" : "center", whiteSpace: "nowrap", overflow: "hidden" } }, h);
            })),
          rows.map(function (r, i) {
            if (r.group) {
              return React.createElement("div", { key: i, className: "ne-row", style: { display: "flex", borderTop: "1px solid " + BD, background: "rgba(0,15,71,.035)", animationDelay: 0.26 + i * 0.06 + "s" } },
                React.createElement("div", { style: { flex: 1, padding: "5px 8px", fontFamily: SANS, fontSize: 9, fontWeight: 700, color: NAVY } }, "⌄  " + r.group));
            }
            return React.createElement("div", { key: i, className: "ne-row", style: { display: "flex", alignItems: "center", borderTop: "1px solid " + BD, animationDelay: 0.26 + i * 0.06 + "s" } },
              React.createElement("div", { style: { flex: col[0], padding: "5px 8px", display: "flex", gap: 5, alignItems: "center", minWidth: 0 } },
                React.createElement("span", { style: { fontFamily: SANS, fontSize: 8, fontWeight: 700, color: TEAL, flexShrink: 0 } }, r.code),
                React.createElement("span", { style: { fontFamily: SANS, fontSize: 9, color: TX, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, r.name)),
              r.v.map(function (v, k) {
                return React.createElement("div", { key: k, style: { flex: col[k + 1], padding: "5px 3px", textAlign: "center", fontFamily: SANS, fontSize: 9, fontWeight: k === 3 ? 700 : 500, color: r.hot ? RED : TX, whiteSpace: "nowrap" } }, v);
              }),
              React.createElement("div", { style: { flex: col[5], padding: "3px 5px", display: "flex", justifyContent: "center" } },
                React.createElement("span", { style: { minWidth: 28, padding: "3px 5px", borderRadius: 5, border: "1px solid " + (r.hot ? TEAL : BD), background: r.hot ? "rgba(11,75,255,.08)" : "#fff", fontFamily: SANS, fontSize: 9, fontWeight: 700, color: NAVY, textAlign: "center" } }, r.fin)));
          })
        ])),
      React.createElement(Row, { i: 6, style: { display: "flex", justifyContent: "flex-end", gap: 6, padding: "7px 12px", borderTop: "1px solid " + BD, background: "rgba(0,15,71,.02)" } },
        ["Reset", "Save"].map(function (t, i) {
          return React.createElement("span", { key: i, style: { fontFamily: SANS, fontSize: 8.5, fontWeight: 600, color: TM, border: "1px solid " + BD, borderRadius: 5, padding: "3px 9px", background: "#fff" } }, t);
        }),
        React.createElement("span", { style: { fontFamily: SANS, fontSize: 8.5, fontWeight: 700, color: NAVY, borderRadius: 5, padding: "3px 11px", background: GOLD } }, "Submit")),
      React.createElement(Cursor, { x: 322, y: 150 })
    );
  }

  // 04 · Assessment Centre — info grid, then the subjects table
  function ScreenCentre() {
    var cells = [["Date & Time", "16 Sep 2025, 4:30 pm"], ["Duration", "8h"], ["Status", "Open"],
      ["Timezone", "Asia/Kolkata"], ["Seats booked", "2"], ["Seats remaining", "88"]];
    var subs = [["TI", "TI user", "6/6", "1/3", "On Time", "green", TEAL], ["RG", "RG user", "6/6", "1/3", "No Status", "grey", RED]];
    return React.createElement("div", { style: { padding: "12px 14px", position: "relative" } },
      React.createElement(Row, { i: 0, style: { fontFamily: SERIF, fontSize: 15, color: NAVY, marginBottom: 8 } }, "16th Sep 2025, 4:30 pm"),
      React.createElement(Row, { i: 1, style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: BD, border: "1px solid " + BD, borderRadius: 8, overflow: "hidden", marginBottom: 9 } },
        cells.map(function (c, i) {
          return React.createElement("div", { key: i, style: { background: "#fff", padding: "6px 8px" } },
            React.createElement("div", { style: { fontFamily: SANS, fontSize: 7.5, color: TM } }, c[0]),
            i === 2 ? React.createElement("div", { style: { marginTop: 3 } }, pill("Open", "green"))
              : React.createElement("div", { style: { fontFamily: SANS, fontSize: 9, fontWeight: 700, color: NAVY, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, c[1]));
        })),
      React.createElement(Row, { i: 2, style: { marginBottom: 7 } }, tabs(["Subjects", "Resources", "Activities", "Recordings"], 0)),
      card(
        [React.createElement("div", { key: "h", className: "ne-row", style: { display: "flex", padding: "6px 9px", borderBottom: "1px solid " + BD, animationDelay: ".3s" } },
          ["Participants", "Prework", "Activity", "Attendance"].map(function (h, i) {
            return React.createElement("span", { key: i, style: { flex: i === 0 ? 2 : 1, fontFamily: SANS, fontSize: 8.5, fontWeight: 700, color: TM, textAlign: i === 0 ? "left" : "center" } }, h);
          }))].concat(
        subs.map(function (s, i) {
          return React.createElement("div", { key: i, className: "ne-row", style: { display: "flex", alignItems: "center", padding: "7px 9px", borderBottom: i === subs.length - 1 ? "none" : "1px solid " + BD, animationDelay: 0.36 + i * 0.08 + "s" } },
            React.createElement("span", { style: { flex: 2, display: "flex", alignItems: "center", gap: 6, minWidth: 0 } }, avatar(s[0], s[6], 17),
              React.createElement("span", { style: { fontFamily: SANS, fontSize: 9.5, fontWeight: 600, color: TX } }, s[1])),
            React.createElement("span", { style: { flex: 1, textAlign: "center", fontFamily: SANS, fontSize: 9, color: TX } }, s[2]),
            React.createElement("span", { style: { flex: 1, textAlign: "center", fontFamily: SANS, fontSize: 9, color: TX } }, s[3]),
            React.createElement("span", { style: { flex: 1, display: "flex", justifyContent: "center" } }, pill(s[4], s[5])));
        }))
      ),
      React.createElement(Cursor, { x: 250, y: 176 })
    );
  }

  var SCREENS = [
    { key: "dash", label: "Assessor Dashboard", note: "Everything assigned to you, in one place.", render: ScreenDashboard },
    { key: "eval", label: "Evaluate", note: "Brief and scoring side by side.", render: ScreenEvaluate },
    { key: "mod", label: "Moderate", note: "Every assessor's score, one final call.", render: ScreenModerate },
    { key: "ac", label: "Assessment Centre", note: "Run the session, track every subject.", render: ScreenCentre }
  ];

  // ── the showcase ────────────────────────────────────────────────────────
  function Showcase(p) {
    var motion = p.motion || 1;
    var st = React.useState(0), idx = st[0], setIdx = st[1];
    var hv = React.useState(false), hover = hv[0], setHover = hv[1];
    React.useEffect(function () {
      if (hover) return;
      var t = setTimeout(function () { setIdx(function (n) { return (n + 1) % SCREENS.length; }); }, 4200);
      return function () { clearTimeout(t); };
    }, [idx, hover]);
    var s = SCREENS[idx];
    var frameH = p.tall ? 300 : 288;
    return React.createElement("div", {
      className: "ne-stage",
      onMouseEnter: function () { setHover(true); }, onMouseLeave: function () { setHover(false); },
      style: Object.assign({ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0 }, p.style)
    },
      React.createElement("div", { style: { position: "relative" } },
        // motion 3 stacks a hint of the next screens behind the live one
        motion === 3 ? [1, 2].map(function (g) {
          return React.createElement("div", { key: g, style: { position: "absolute", left: 10 * g, right: 10 * g, top: -6 * g, height: 26, borderRadius: 12, background: "#fff", border: "1px solid " + BD, opacity: 0.55 - g * 0.18, zIndex: 0 } });
        }) : null,
        React.createElement("div", { style: { position: "relative", zIndex: 1, background: "#fff", borderRadius: 12, border: "1px solid " + BD, boxShadow: "0 24px 54px rgba(0,15,71,.18)", overflow: "hidden" } },
          React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, padding: "8px 11px", borderBottom: "1px solid " + BD, background: "rgba(0,15,71,.02)" } },
            [0, 1, 2].map(function (i) { return React.createElement("span", { key: i, style: { width: 7, height: 7, borderRadius: 999, background: "rgba(0,15,71,.16)" } }); }),
            React.createElement("div", { style: { flex: 1, display: "flex", justifyContent: "center" } },
              React.createElement("div", { style: { padding: "2px 12px", borderRadius: 999, background: "rgba(0,15,71,.05)", fontFamily: SANS, fontSize: 10.5, fontWeight: 600, color: TM } }, s.label)),
            React.createElement("span", { style: { width: 7, height: 7 } })),
          motion === 1 ? React.createElement("div", { key: "sw-" + idx, className: "ne-sweep", style: { position: "absolute", top: 0, bottom: 0, width: "38%", pointerEvents: "none", zIndex: 3, background: "linear-gradient(100deg, transparent, rgba(11,75,255,.09), transparent)" } }) : null,
          React.createElement("div", { style: { display: "flex", background: "rgba(0,15,71,.02)", height: frameH } },
            React.createElement("div", { style: { width: 42, flexShrink: 0, background: NAVY, padding: "11px 7px" } },
              [0, 1, 2, 3].map(function (i) {
                return React.createElement("div", { key: i, style: { height: 6, borderRadius: 3, marginBottom: 9, background: i === idx ? GOLD : "rgba(255,255,255,.22)", width: i === idx ? "100%" : "68%", transition: "background .3s ease, width .3s ease" } });
              })),
            React.createElement("div", { key: s.key, className: "ne-m" + motion, style: { flex: 1, minWidth: 0, overflow: "hidden" } }, React.createElement(s.render))))),
      React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, marginTop: 14 } },
        React.createElement("div", { key: "cap-" + idx, className: "ne-row", style: { flex: 1, minWidth: 0, fontFamily: SANS, fontSize: 13, color: p.onDark ? "rgba(255,255,255,.86)" : TX } },
          React.createElement("b", { style: { color: p.onDark ? "#fff" : NAVY } }, s.label), " — ", s.note),
        React.createElement("div", { style: { display: "flex", gap: 5, flexShrink: 0 } },
          SCREENS.map(function (x, i) {
            return React.createElement("button", { key: x.key, className: "ne-dot", onClick: function () { setIdx(i); }, "aria-label": "Show " + x.label,
              style: { width: i === idx ? 20 : 7, height: 7, borderRadius: 999, border: "none", padding: 0, cursor: "pointer", background: i === idx ? (p.onDark ? GOLD : TEAL) : (p.onDark ? "rgba(255,255,255,.3)" : "rgba(0,15,71,.18)") } });
          })))
    );
  }

  // ── the copy, kept short ────────────────────────────────────────────────
  function Copy(p) {
    var dark = p.onDark;
    return React.createElement(React.Fragment, null,
      p.badge === false ? null : React.createElement("div", { style: { display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: 7, padding: "5px 11px", borderRadius: 999, background: dark ? "rgba(255,255,255,.14)" : "rgba(11,75,255,.10)", color: dark ? "#fff" : TEAL, fontFamily: SANS, fontSize: 11.5, fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase" } },
        React.createElement("span", { className: "ne-pulse", style: { width: 7, height: 7, borderRadius: 999, background: dark ? GOLD : TEAL, display: "inline-block" } }), "New experience"),
      React.createElement("h2", { style: { fontFamily: SERIF, fontSize: p.big ? 34 : 30, lineHeight: 1.14, color: dark ? "#fff" : NAVY, margin: p.badge === false ? "0" : "16px 0 0", fontWeight: 600 } }, "A new way to assess."),
      React.createElement("p", { style: { fontFamily: SANS, fontSize: 15, lineHeight: 1.6, color: dark ? "rgba(255,255,255,.82)" : TX, margin: "11px 0 0", maxWidth: 460 } },
        "A clearer dashboard, faster scoring, and moderation that shows every assessor side by side."),
      React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8, margin: "14px 0 0" } },
        ["Everything assigned to you on one dashboard", "Score and moderate without losing your place", "Same data, same sign-off — nothing is lost"].map(function (t, i) {
          return React.createElement("div", { key: i, style: { display: "flex", gap: 9, alignItems: "flex-start", fontFamily: SANS, fontSize: 14, lineHeight: 1.45, color: dark ? "rgba(255,255,255,.88)" : TX } },
            React.createElement("svg", { width: "15", height: "15", viewBox: "0 0 24 24", fill: "none", stroke: dark ? GOLD : TEAL, strokeWidth: "2.6", strokeLinecap: "round", strokeLinejoin: "round", style: { flexShrink: 0, marginTop: 3 } },
              React.createElement("path", { d: "M20 6L9 17l-5-5" })), t);
        })),
      // The one thing that must land: this is where everyone is going.
      React.createElement("div", { style: { display: "flex", gap: 10, alignItems: "center", margin: "16px 0 0", padding: "11px 14px", borderRadius: 10, borderLeft: "4px solid " + GOLD, background: dark ? "rgba(255,191,0,.16)" : "rgba(255,191,0,.16)" } },
        React.createElement("svg", { width: "17", height: "17", viewBox: "0 0 24 24", fill: "none", stroke: dark ? GOLD : "#8A6400", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", style: { flexShrink: 0 } },
          React.createElement("circle", { cx: "12", cy: "12", r: "9" }), React.createElement("path", { d: "M12 8v5l3 2" })),
        React.createElement("div", { style: { fontFamily: SANS, fontSize: 13.5, lineHeight: 1.45, color: dark ? "#fff" : "#5E4400" } },
          React.createElement("b", { style: { fontWeight: 800 } }, "Everyone moves across soon."),
          " You can switch back any time until then."))
    );
  }
  function Actions(p) {
    var dark = p.onDark;
    return React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginTop: p.mt === undefined ? 20 : p.mt } },
      React.createElement("button", { className: "ne-ghost", onClick: p.later,
        style: { padding: "13px 20px", borderRadius: 10, border: "1px solid " + (dark ? "rgba(255,255,255,.3)" : BD), background: dark ? "transparent" : "#fff", color: dark ? "#fff" : TX, fontFamily: SANS, fontSize: 15, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 } }, "Maybe later"),
      React.createElement("button", { className: "ne-cta", onClick: p.tryIt,
        style: { padding: "13px 24px", borderRadius: 10, border: "none", background: dark ? "#fff" : NAVY, color: dark ? NAVY : "#fff", fontFamily: SANS, fontSize: 15, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, whiteSpace: "nowrap", flexShrink: 0 } },
        "Try new experience",
        React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", style: { flexShrink: 0 } },
          React.createElement("path", { d: "M5 12h13" }), React.createElement("path", { d: "M12 5l7 7-7 7" })))
    );
  }

  var STAGE_BG = "linear-gradient(160deg, rgba(11,75,255,.08), rgba(0,15,71,.05))";

  function Dialog() {
    var op = React.useState(function () { var v = null; try { v = localStorage.getItem(SEEN_KEY); } catch (e) {} return !v; });
    var open = op[0], setOpen = op[1];
    var dg = React.useState(function () { var v = 1; try { v = parseInt(localStorage.getItem(DESIGN_KEY), 10) || 1; } catch (e) {} return v > 0 && v < 5 ? v : 1; });
    var design = dg[0], setDesign = dg[1];
    var mo = React.useState(function () { var v = 1; try { v = parseInt(localStorage.getItem(MOTION_KEY), 10) || 1; } catch (e) {} return v > 0 && v < 4 ? v : 1; });
    var motion = mo[0], setMotion = mo[1];

    React.useEffect(function () { if (open) styles(); }, [open]);

    var close = function (choice) {
      try { localStorage.setItem(SEEN_KEY, choice); } catch (e) {}
      setOpen(false);
      if (choice !== "try") return;
      window.__LH_TOUR_HOLD = false;
      setTimeout(function () {
        var done = null;
        try { done = localStorage.getItem("lh-tour-done-dashboard"); } catch (e) {}
        if (!done && window.LHTour && window.LHTour.start) window.LHTour.start("dashboard");
      }, 420);
    };
    var later = function () { close("later"); }, tryIt = function () { close("try"); };

    React.useEffect(function () {
      if (!open) return;
      var onKey = function (e) { if (e.key === "Escape") later(); };
      document.addEventListener("keydown", onKey);
      return function () { document.removeEventListener("keydown", onKey); };
    }, [open]);

    if (!open) return null;

    var shell = { background: "#fff", borderRadius: 18, boxShadow: "0 40px 90px rgba(6,12,40,.34)", overflow: "hidden", maxHeight: "94vh" };
    var body;

    if (design === 1) {
      // 1 · Split — words left, screens right
      body = React.createElement("div", { className: "ne-dialog", role: "dialog", "aria-modal": "true", "aria-label": "New assessor experience", style: Object.assign({ width: "min(1080px, 100%)", overflow: "auto", display: "flex" }, shell) },
        React.createElement("div", { className: "ne-split", style: { display: "flex", alignItems: "stretch", width: "100%" } },
          // no filler gap: the copy sits as one block, centred against the animation
          React.createElement("div", { className: "ne-left", style: { flex: "0 0 42%", minWidth: 0, padding: "32px 34px", display: "flex", flexDirection: "column", justifyContent: "center" } },
            React.createElement(Copy), React.createElement(Actions, { later: later, tryIt: tryIt })),
          React.createElement(Showcase, { motion: motion, style: { flex: 1, background: STAGE_BG, padding: "26px 26px 20px", minHeight: 440 } })));

    } else if (design === 2) {
      // 2 · Reversed — screens left, words right
      body = React.createElement("div", { className: "ne-dialog", role: "dialog", "aria-modal": "true", "aria-label": "New assessor experience", style: Object.assign({ width: "min(1080px, 100%)", overflow: "auto", display: "flex" }, shell) },
        React.createElement("div", { className: "ne-split", style: { display: "flex", alignItems: "stretch", width: "100%" } },
          React.createElement(Showcase, { motion: motion, style: { flex: 1, background: STAGE_BG, padding: "26px 26px 20px", minHeight: 440 } }),
          React.createElement("div", { className: "ne-left", style: { flex: "0 0 42%", minWidth: 0, padding: "32px 34px", display: "flex", flexDirection: "column", justifyContent: "center" } },
            React.createElement(Copy), React.createElement(Actions, { later: later, tryIt: tryIt }))));

    } else if (design === 3) {
      // 3 · Stacked — screens on top, words beneath
      body = React.createElement("div", { className: "ne-dialog", role: "dialog", "aria-modal": "true", "aria-label": "New assessor experience", style: Object.assign({ width: "min(880px, 100%)", overflow: "auto", display: "flex", flexDirection: "column" }, shell) },
        React.createElement(Showcase, { motion: motion, style: { background: STAGE_BG, padding: "24px 30px 18px", borderBottom: "1px solid " + BD } }),
        React.createElement("div", { style: { padding: "26px 34px 30px", display: "flex", flexDirection: "column" } },
          React.createElement(Copy), React.createElement(Actions, { later: later, tryIt: tryIt })));

    } else {
      // 4 · Overlay — full-bleed screens on navy, words floating over them
      // shell first, then the overrides — the other way round its white background wins
      body = React.createElement("div", { className: "ne-dialog", role: "dialog", "aria-modal": "true", "aria-label": "New assessor experience", style: Object.assign({}, shell, { width: "min(1080px, 100%)", overflow: "auto", background: NAVY, display: "flex", flexDirection: "column", position: "relative" }) },
        React.createElement("div", { style: { position: "absolute", inset: 0, background: "radial-gradient(120% 90% at 78% 12%, rgba(11,75,255,.5), transparent 62%)", pointerEvents: "none" } }),
        React.createElement("div", { style: { position: "relative", display: "flex", alignItems: "stretch", flexWrap: "wrap" } },
          React.createElement("div", { style: { flex: "1 1 380px", minWidth: 0, padding: "40px 34px 34px", display: "flex", flexDirection: "column", justifyContent: "center" } },
            React.createElement(Copy, { onDark: true, big: true }), React.createElement(Actions, { later: later, tryIt: tryIt, onDark: true })),
          React.createElement(Showcase, { motion: motion, onDark: true, style: { flex: "1 1 460px", padding: "30px 30px 22px", minHeight: 430 } })));
    }

    return ReactDOM.createPortal(
      React.createElement(React.Fragment, null,
        React.createElement("div", { className: "ne-mask", style: { position: "fixed", inset: 0, zIndex: 10000, background: "rgba(6,12,40,.55)", backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 } },
          body,
          React.createElement("button", { onClick: later, "aria-label": "Close",
            style: { position: "fixed", top: "max(20px, 3vh)", right: "max(20px, 3vw)", width: 38, height: 38, borderRadius: 999, border: "1px solid rgba(255,255,255,.28)", background: "rgba(255,255,255,.12)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10001 } },
            React.createElement("svg", { width: "17", height: "17", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.1", strokeLinecap: "round" },
              React.createElement("path", { d: "M6 6l12 12" }), React.createElement("path", { d: "M18 6L6 18" })))),
        // sample switcher — same idea as the plan/coach design chips elsewhere
        React.createElement("div", { className: "ne-chip", style: { position: "fixed", left: 20, bottom: 20, zIndex: 10002, display: "flex", gap: 8, flexWrap: "wrap", fontFamily: SANS } },
          [["Layout", [1, 2, 3, 4], design, function (v) { setDesign(v); try { localStorage.setItem(DESIGN_KEY, String(v)); } catch (e) {} }],
           ["Motion", [1, 2, 3], motion, function (v) { setMotion(v); try { localStorage.setItem(MOTION_KEY, String(v)); } catch (e) {} }]
          ].map(function (grp) {
            return React.createElement("div", { key: grp[0], style: { display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,.94)", border: "1px solid " + BD, borderRadius: 10, boxShadow: "0 6px 20px rgba(0,15,71,.18)", padding: "6px 9px" } },
              React.createElement("span", { style: { fontSize: 12, fontWeight: 700, color: TM } }, grp[0]),
              grp[1].map(function (v) {
                var on = grp[2] === v;
                return React.createElement("button", { key: v, onClick: function () { grp[3](v); },
                  style: { width: 24, height: 24, borderRadius: 7, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, background: on ? NAVY : "rgba(0,15,71,.06)", color: on ? "#fff" : TM } }, v);
              }));
          }))
      ),
      document.body);
  }

  window.LHNewExperience = {
    Dialog: Dialog,
    reset: function () {
      try { localStorage.removeItem(SEEN_KEY); } catch (e) {}
      if (window.LHTour && window.LHTour.reset) window.LHTour.reset();
      location.reload();
    }
  };
})();
