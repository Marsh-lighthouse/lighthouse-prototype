// ════════════════════════════════════════════════════════════════════════
//  app-qtypes.jsx — Question Type gallery
//  Browses every assessment question type, grouped by the same categories the
//  team sees in the "Add question" menu. Each type renders through the SHARED
//  OaQuestionCard (app-ed-assess.jsx) using a live sample from
//  LH.openAssessQuestions — so it is 1:1 in sync with the live assessment:
//  any styling or behaviour change to a question shows in both places.
//  Mobile / iPad previews come free from OaQuestionCard's data-device compact
//  layouts (driven by the Tweaks "Screen" control). The URL hash (#q=<id>)
//  deep-links each type so the team can share a specific one.
//  Globals used (shared script scope): React, OaQuestionCard, oaTypeLabel, LH,
//  and the eMID/eINK/eLINE/eMUT colour tokens from app-ed-detail.jsx.
// ════════════════════════════════════════════════════════════════════════
(function () {
  const { useState, useEffect } = React;

  // Category → question types. `qid` points at a live sample question in
  // LH.openAssessQuestions; `kind:"soon"/"static-*"` renders a placeholder.
  const CATS = [
    { cat: "Static Content", items: [
      // A type with named sub-types → every kind is shown stacked one below another
      // (like the Matrix Table family), not as tabs.
      { id: "descriptive", label: "Descriptive Text", variants: [
        { id: "text",     label: "Text",     kind: "static-text" },
        { id: "graphic",  label: "Graphic",  kind: "static-graphic" },
        { id: "file",     label: "File",     kind: "static-file" },
        { id: "question", label: "Question", kind: "static-question" },
        { id: "link",     label: "Link",     kind: "static-link" },
      ]},
      { id: "graphic",     label: "Graphic",          kind: "static-graphic" },
    ]},
    { cat: "Standard Questions", items: [
      // Screenshot order first…
      // Multiple Choice also carries Image Choice, Image Multi-select and Dropdown — they are all
      // choose-an-option variants, so they render stacked inside the Multiple Choice view (and are
      // no longer separate side-menu entries).
      { id: "mcq",        label: "Multiple Choice",     qid: "oq1", also: ["imgchoice", "imgmulti", "dropdown"] },
      // Matrix Table also carries Check Grid, Numeric Grid and Side by Side — they are all part
      // of the matrix-table family, so they render stacked inside the Matrix Table view (and are
      // no longer separate side-menu entries).
      { id: "matrix",     label: "Matrix Table",        qid: "oq4", also: ["checkgrid", "numgrid", "sidebyside", "bipolar", "dropdowngrid"] },
      // Text Entry also carries Rich Text, Form, Date & time, Chat and Email — all text-answer
      // variants — stacked inside the Text Entry view (Email is no longer a separate menu entry).
      { id: "text",       label: "Text Entry",          qid: "oq2", also: ["richtext", "form", "datetime", "chat", "email"] },
      // Slider also carries Slider Grid, Bar Rating and Star Rating — all rating-scale variants —
      // stacked inside the Slider view (no longer separate side-menu entries).
      { id: "slider",     label: "Slider",              qid: "oq_slider", also: ["slidergrid", "bargrid", "stargrid"] },
      // Rank Order also carries the rank-grid, number-entry and reorder-list variants.
      { id: "rank",       label: "Rank Order",          qid: "oq3", also: ["rankgrid", "ranknum", "ranklist"] },
      // Side by Side — its own tab with several label-placement views (top / top & bottom / per row).
      { id: "sbs",        label: "Side by Side",        qid: "oq_sbs_top" },
    ]},
    { cat: "Speciality Questions", items: [
      // Constant Sum also shows the Slider Grid and Bar Rating examples (they stay under Slider too).
      { id: "constantsum",   label: "Constant Sum",             qid: "oq_csum", also: ["slidergrid", "bargrid"] },
      { id: "pickgrouprank", label: "Pick, Group and Rank",     qid: "oq_pgr" },
      // Graphic Slider carries its graphic variants (thermometer/traffic light/smiley/grade) and Fill Gauge.
      { id: "graphicslider", label: "Graphic Slider",           qid: "oq_gslider", also: ["fillgauge"] },
      { id: "gap",           label: "Gap Analysis",             qid: "oq_gap" },
      { id: "video",         label: "Video Response",           qid: "oq_video" },
      { id: "file",          label: "File Upload",              qid: "oq5" },
      { id: "audio",         label: "Audio Response",           qid: "oq6" },
      { id: "skillfeedback", label: "Campaign Factor Feedback", qid: "oq_skill" },
      { id: "factor",        label: "Factor Selection",         qid: "oq_factor" },
      // Hot Spot carries Shape Annotation (blank canvas + on-image variants); kept at the bottom.
      { id: "hotspot",       label: "Hot Spot",                 qid: "oq_shapedraw" },
    ]},
    { cat: "Advanced", items: [
      { id: "timing",  label: "Timing",               qid: "oq_timing" },
      { id: "meta",    label: "Meta Info Question",   qid: "oq_metainfo" },
      { id: "captcha", label: "Captcha Verification", qid: "oq_captcha" },
    ]},
  ];
  const ALL = CATS.reduce((a, c) => a.concat(c.items), []);
  const byId = (id) => ALL.find((x) => x.id === id);
  const catOf = (id) => { for (const c of CATS) { if (c.items.some((i) => i.id === id)) return c.cat; } return ""; };
  const qFor = (item) => (item && item.qid && window.LH && LH.openAssessQuestions ? LH.openAssessQuestions.find((q) => q.id === item.qid) : null);
  // Every sample question of this item's type — so a type with multiple variants
  // (e.g. Matrix Table's 4-point and 7-point) stacks them all, and new questions
  // added to the assessment of that type appear here automatically.
  // `item.also` folds other related types into this one's view (e.g. Matrix Table also shows
  // Check Grid and Side by Side, which are part of the same matrix-table family).
  const qsFor = (item) => { const b = qFor(item); if (!b) return []; const types = [b.type].concat(item.also || []); return (LH.openAssessQuestions || []).filter((q) => types.includes(q.type)); };
  const typeName = (q) => (q ? (typeof oaTypeLabel === "function" ? oaTypeLabel(q.type) : q.type) : "");

  // Hash format: #q=<type>[.<sub-variant>]  e.g. #q=matrix  or  #q=descriptive.file
  // Types folded into another menu entry redirect to their host (they're no longer separate items).
  const HASH_ALIAS = { sidebyside: "matrix", checkgrid: "matrix", numgrid: "matrix", bipolar: "matrix", dropdowngrid: "matrix", imgchoice: "mcq", imgmulti: "mcq", dropdown: "mcq", richtext: "text", form: "text", datetime: "text", chat: "text", email: "text", slidergrid: "slider", bargrid: "slider", stargrid: "slider", rankgrid: "rank", ranknum: "rank", ranklist: "rank", shapedraw: "hotspot", fillgauge: "graphicslider" };
  const parseHash = () => {
    const m = (location.hash || "").match(/q=([a-z0-9_]+)(?:\.([a-z0-9_]+))?/i);
    let id = m && m[1] ? (HASH_ALIAS[m[1]] || m[1]) : "mcq";
    if (!byId(id)) id = "mcq";
    return { id: id, v: m && m[2] ? m[2] : null };
  };

  // Static-content previews (Descriptive Text sub-types + the standalone Graphic).
  const renderStatic = (kind, cardWrap) => {
    if (kind === "static-text") {
      const body = { fontFamily: "var(--sans)", fontSize: 15, color: INK, lineHeight: 1.65, margin: "0 0 14px" };
      return (
        <div style={cardWrap}>
          <h3 className="serif" style={{ fontSize: 21, color: MID, margin: "0 0 12px" }}>Welcome to your assessment</h3>
          <p style={body}>Descriptive text presents information to the candidate — a welcome, context, or instructions — with no answer collected. This questionnaire explores your attitudes, preferences and working style. It has approximately 95 questions and takes an estimated 15–20 minutes to complete.</p>
          <p style={body}>Some things to remember:</p>
          <ul style={{ ...body, margin: "0 0 14px", paddingLeft: 20 }}>
            <li style={{ marginBottom: 6 }}>Answer as honestly as you can — there are no right or wrong answers.</li>
            <li style={{ marginBottom: 6 }}>Respond instinctively with the first response that comes to mind.</li>
            <li>Try to complete the questionnaire in one go, without interruptions.</li>
          </ul>
          <p style={body}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.</p>
          <p style={{ ...body, margin: 0, color: MUT }}>If you have any questions or require clarification regarding this questionnaire, please write to us at surveys@example.com.</p>
        </div>
      );
    }
    if (kind === "static-graphic") return (
      <div style={cardWrap}>
        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=525&fit=crop&q=75" alt="A team collaborating in an office"
          style={{ width: "100%", aspectRatio: "16 / 7", objectFit: "cover", borderRadius: "var(--lh-radius, 2px)", display: "block", background: "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 65%, #000))" }} />
      </div>
    );
    if (kind === "static-file") return (
      <div style={cardWrap}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, border: "1px solid " + LINE, borderRadius: "var(--lh-radius, 2px)", padding: "12px 16px", background: "var(--card,#fff)" }}>
          <span style={{ width: 34, height: 34, borderRadius: "var(--lh-radius, 2px)", background: "color-mix(in srgb, var(--accent) 10%, var(--card))", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--sans)", fontSize: 12, fontWeight: 700 }}>PDF</span>
          <div>
            <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: INK }}>Assessment_Brief.pdf</div>
            <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: MUT }}>A downloadable file shown to the candidate.</div>
          </div>
        </div>
      </div>
    );
    if (kind === "static-question") {
      const body = { fontFamily: "var(--sans)", fontSize: 15, color: INK, lineHeight: 1.65, margin: "0 0 14px" };
      return (
        <div style={cardWrap}>
          <p style={body}>A descriptive block can also pose a question for the candidate to reflect on before continuing. It collects no answer — it simply frames what comes next.</p>
          <p className="serif" style={{ fontSize: 18, color: MID, lineHeight: 1.3, margin: 0 }}>As you work through this section, what do you want to be true about how you lead a year from now?</p>
        </div>
      );
    }
    if (kind === "static-link") {
      const body = { fontFamily: "var(--sans)", fontSize: 15, color: INK, lineHeight: 1.65, margin: "0 0 14px" };
      return (
        <div style={cardWrap}>
          <p style={body}>A descriptive block can include a link to more information. Selecting it opens that page in a new tab, rather than navigating away from the assessment.</p>
          <a href="https://marsh-lighthouse.github.io/lighthouse-prototype/Lighthouse.html" target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: "var(--accent)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
            Read the full assessment guide <span aria-hidden="true">&#8599;</span>
          </a>
        </div>
      );
    }
    return null;
  };

  // Colour tokens — fall back to CSS vars if the app-ed-detail consts are absent.
  const MID = (typeof eMID !== "undefined") ? eMID : "var(--primary)";
  const INK = (typeof eINK !== "undefined") ? eINK : "var(--ink)";
  const LINE = (typeof eLINE !== "undefined") ? eLINE : "var(--line)";
  const MUT = (typeof eMUT !== "undefined") ? eMUT : "var(--muted)";

  function QuestionTypeGallery() {
    const [state, setState] = useState(parseHash);
    const [answers, setAnswers] = useState({});
    const [device, setDevice] = useState(() => document.documentElement.getAttribute("data-device") || "desktop");

    useEffect(() => {
      const onHash = () => setState(parseHash());
      window.addEventListener("hashchange", onHash);
      const o = new MutationObserver(() => setDevice(document.documentElement.getAttribute("data-device") || "desktop"));
      o.observe(document.documentElement, { attributes: true, attributeFilter: ["data-device"] });
      return () => { window.removeEventListener("hashchange", onHash); o.disconnect(); };
    }, []);

    const select = (id, v) => {
      setState({ id: id, v: v || null });
      const h = "#q=" + id + (v ? "." + v : "");
      try { history.replaceState(null, "", h); } catch (e) { try { location.hash = h.slice(1); } catch (e2) {} }
    };

    const sel = byId(state.id) || ALL[0];
    const variants = sel.variants || null;
    const activeV = variants ? (variants.find((x) => x.id === state.v) || variants[0]) : null;
    const qs = variants ? [] : qsFor(sel);
    // Match the assessment / Folio content width: card column = --content-max (848px).
    const previewMax = device === "mobile" ? 390 : device === "ipad" ? 834 : "calc(var(--content-max, 848px) + 56px)";

    const cardWrap = { background: "var(--card, #fff)", border: "1px solid " + LINE, borderRadius: 16, padding: "28px 30px" };

    let preview;
    if (variants) {                                   // Descriptive Text — every kind stacked one below another
      preview = (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {variants.map((v) => (
            <div key={v.id}>
              <div style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 400, letterSpacing: ".2px", color: MUT, margin: "0 0 8px" }}>{v.label}</div>
              {renderStatic(v.kind, cardWrap)}
            </div>
          ))}
        </div>
      );
    } else if (qs.length) {                           // one or more live sample questions of this type — stacked
      preview = (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {qs.map((qq) => <OaQuestionCard key={qq.id} q={qq} number={1} value={answers[qq.id]} onChange={(v) => setAnswers((a) => ({ ...a, [qq.id]: v }))} />)}
        </div>
      );
    } else if (sel.kind && sel.kind.indexOf("static") === 0) {  // a single static-content item (Graphic)
      preview = renderStatic(sel.kind, cardWrap);
    } else {                                          // no sample yet
      preview = (
        <div style={{ background: "var(--card, #fff)", border: "1px dashed " + LINE, borderRadius: 16, padding: "56px 30px", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: MUT, margin: 0 }}>The <b style={{ color: INK, fontWeight: 400 }}>{sel.label}</b> preview is coming soon.</p>
        </div>
      );
    }

    // Descriptive Text is now stacked (no tabs).
    const subtabs = null;

    const desc = variants
      ? ("Every kind of descriptive content block, shown one below another — " + variants.map((v) => v.label).join(" · ") + ".")
      : (qs.length ? ("Interactive preview — rendered with the same component as the assessment, so any change is reflected in both." + (qs.length > 1 ? (sel.also ? " Showing all " + qs.length + " examples in the " + sel.label + " family." : " Showing all " + qs.length + " variants of this type.") : "")) : "Placeholder — full preview coming with the simulator.");

    return (
      <div style={{ display: "flex", minHeight: "100vh", background: "var(--canvas, #F7F3EE)", fontFamily: "var(--sans)" }}>
        {/* ── Category side menu ── */}
        <aside style={{ width: 300, minWidth: 300, flexShrink: 0, background: "var(--card, #fff)", borderRight: "1px solid " + LINE, height: "100vh", overflowY: "auto", position: "sticky", top: 0, boxSizing: "border-box" }}>
          <div style={{ padding: "22px 22px 12px" }}>
            <div style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 400, letterSpacing: ".3px", color: MUT, marginBottom: 4 }}>Assessment</div>
            <h1 className="serif" style={{ fontSize: 21, color: MID, margin: 0 }}>Question Types</h1>
            <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: MUT, margin: "6px 0 0", lineHeight: 1.4 }}>Live previews — the same components the assessment uses.</p>
          </div>
          <nav style={{ padding: "4px 12px 28px" }}>
            {CATS.map((c) => (
              <div key={c.cat} style={{ marginBottom: 8 }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 400, color: MUT, padding: "10px 10px 6px" }}>{c.cat}</div>
                {c.items.map((it) => {
                  const active = it.id === sel.id;
                  return (
                    <button key={it.id} onClick={() => select(it.id)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, textAlign: "left", padding: "9px 10px", marginBottom: 2, border: "none", borderRadius: 8, background: active ? "color-mix(in srgb, var(--accent) 8%, transparent)" : "transparent", color: active ? MID : INK, fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, cursor: "pointer" }}>
                      <span>{it.label}</span>
                      {it.kind === "soon" && <span style={{ fontFamily: "var(--sans)", fontSize: 11.5, fontWeight: 500, color: MUT, border: "1px solid " + LINE, borderRadius: 999, padding: "1px 7px" }}>soon</span>}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </aside>

        {/* ── Live preview ── */}
        <main style={{ flex: 1, minWidth: 0, overflowY: "auto", padding: "40px 0 96px" }}>
          <div style={{ maxWidth: previewMax, margin: "0 auto", padding: device === "mobile" ? "0 16px" : "0 28px", boxSizing: "border-box", transition: "max-width .2s ease" }}>
            <div style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 400, letterSpacing: ".3px", color: MUT, marginBottom: 6 }}>{catOf(sel.id)}</div>
            <h2 className="serif" style={{ fontSize: 28, color: MID, margin: "0 0 6px" }}>{sel.label}</h2>
            <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: MUT, margin: "0 0 22px", lineHeight: 1.5 }}>{desc}</p>
            {subtabs}
            {preview}
          </div>
        </main>
      </div>
    );
  }

  window.QuestionTypeGallery = QuestionTypeGallery;
  window.QTypes = { QuestionTypeGallery: QuestionTypeGallery, CATS: CATS };
})();
