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
      { id: "descriptive", label: "Descriptive Text", kind: "static-text" },
      { id: "graphic",     label: "Graphic",          kind: "static-graphic" },
    ]},
    { cat: "Standard Questions", items: [
      // Screenshot order first…
      { id: "mcq",        label: "Multiple Choice",     qid: "oq1" },
      { id: "matrix",     label: "Matrix Table",        qid: "oq4" },
      { id: "text",       label: "Text Entry",          qid: "oq2" },
      { id: "slider",     label: "Slider",              qid: "oq_slider" },
      { id: "rank",       label: "Rank Order",          qid: "oq3" },
      { id: "sidebyside", label: "Side by Side",        qid: "oq_sbs" },
      // …then the extra variants we already have built.
      { id: "checkgrid",  label: "Check Grid",          qid: "oq_checkgrid" },
      { id: "numgrid",    label: "Numeric Grid",        qid: "oq_numgrid" },
      { id: "slidergrid", label: "Slider Grid",         qid: "oq_slidergrid" },
      { id: "bargrid",    label: "Bar Rating",          qid: "oq_bargrid" },
      { id: "stargrid",   label: "Star Rating",         qid: "oq_stargrid" },
      { id: "imgchoice",  label: "Image Choice",        qid: "oq_img" },
      { id: "imgmulti",   label: "Image Multi-select",  qid: "oq_imgmulti" },
    ]},
    { cat: "Speciality Questions", items: [
      { id: "constantsum",   label: "Constant Sum",             qid: "oq_csum" },
      { id: "pickgrouprank", label: "Pick, Group and Rank",     qid: "oq_pgr" },
      { id: "hotspot",       label: "Hot Spot",                 kind: "soon" },
      { id: "graphicslider", label: "Graphic Slider",           qid: "oq_gslider" },
      { id: "gap",           label: "Gap Analysis",             qid: "oq_gap" },
      { id: "video",         label: "Video Response",           qid: "oq_video" },
      { id: "file",          label: "File Upload",              qid: "oq5" },
      { id: "audio",         label: "Audio Response",           qid: "oq6" },
      { id: "skillfeedback", label: "Campaign Factor Feedback", qid: "oq_skill" },
      { id: "factor",        label: "Factor Selection",         qid: "oq_factor" },
      { id: "fillgauge",     label: "Fill Gauge",               qid: "oq_fillgauge" },
      { id: "shapedraw",     label: "Shape Annotation",         qid: "oq_shapedraw" },
    ]},
    { cat: "Advanced", items: [
      { id: "captcha", label: "Captcha Verification", qid: "oq_captcha" },
      { id: "timing",  label: "Timing",               kind: "soon" },
      { id: "meta",    label: "Meta Info Question",   kind: "soon" },
    ]},
  ];
  const ALL = CATS.reduce((a, c) => a.concat(c.items), []);
  const byId = (id) => ALL.find((x) => x.id === id);
  const catOf = (id) => { for (const c of CATS) { if (c.items.some((i) => i.id === id)) return c.cat; } return ""; };
  const qFor = (item) => (item && item.qid && window.LH && LH.openAssessQuestions ? LH.openAssessQuestions.find((q) => q.id === item.qid) : null);
  const typeName = (q) => (q ? (typeof oaTypeLabel === "function" ? oaTypeLabel(q.type) : q.type) : "");

  const readHash = () => { const m = (location.hash || "").match(/q=([a-z0-9_]+)/i); return m && byId(m[1]) ? m[1] : "mcq"; };

  // Colour tokens — fall back to CSS vars if the app-ed-detail consts are absent.
  const MID = (typeof eMID !== "undefined") ? eMID : "var(--primary)";
  const INK = (typeof eINK !== "undefined") ? eINK : "var(--ink)";
  const LINE = (typeof eLINE !== "undefined") ? eLINE : "var(--line)";
  const MUT = (typeof eMUT !== "undefined") ? eMUT : "var(--muted)";

  function QuestionTypeGallery() {
    const [selId, setSelId] = useState(readHash);
    const [answers, setAnswers] = useState({});
    const [device, setDevice] = useState(() => document.documentElement.getAttribute("data-device") || "desktop");

    useEffect(() => {
      const onHash = () => setSelId(readHash());
      window.addEventListener("hashchange", onHash);
      const o = new MutationObserver(() => setDevice(document.documentElement.getAttribute("data-device") || "desktop"));
      o.observe(document.documentElement, { attributes: true, attributeFilter: ["data-device"] });
      return () => { window.removeEventListener("hashchange", onHash); o.disconnect(); };
    }, []);

    const select = (id) => { setSelId(id); try { history.replaceState(null, "", "#q=" + id); } catch (e) { try { location.hash = "q=" + id; } catch (e2) {} } };

    const sel = byId(selId) || ALL[0];
    const q = qFor(sel);
    // Match the assessment / Folio content width: card column = --content-max (848px),
    // container adds 56px (28px each side) like the assessment's paged layout.
    const previewMax = device === "mobile" ? 390 : device === "ipad" ? 834 : "calc(var(--content-max, 848px) + 56px)";

    const cardWrap = { background: "var(--card, #fff)", border: "1px solid " + LINE, borderRadius: 16, padding: "28px 30px" };

    let preview;
    if (q) {
      // Render the shared card DIRECTLY (OaQuestionCard supplies its own card) — no extra box.
      preview = <OaQuestionCard q={q} number={1} value={answers[sel.id]} onChange={(v) => setAnswers((a) => ({ ...a, [sel.id]: v }))} />;
    } else if (sel.kind === "static-text") {
      preview = (
        <div style={cardWrap}>
          <h3 className="serif" style={{ fontSize: 21, color: MID, margin: "0 0 10px" }}>Section heading</h3>
          <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: INK, lineHeight: 1.65, margin: 0 }}>Descriptive text presents information to the candidate — instructions, context, or a transition between sections. No answer is collected.</p>
        </div>
      );
    } else if (sel.kind === "static-graphic") {
      preview = (
        <div style={cardWrap}>
          <div style={{ width: "100%", aspectRatio: "16 / 7", borderRadius: 12, background: "linear-gradient(135deg, var(--primary), #001F8C)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,.85)", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 500 }}>Graphic / image block</div>
        </div>
      );
    } else {
      preview = (
        <div style={{ background: "var(--card, #fff)", border: "1px dashed " + LINE, borderRadius: 16, padding: "56px 30px", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: MUT, margin: 0 }}>The <b style={{ color: INK, fontWeight: 600 }}>{sel.label}</b> preview is coming soon.</p>
        </div>
      );
    }

    return (
      <div style={{ display: "flex", minHeight: "100vh", background: "var(--canvas, #F7F3EE)", fontFamily: "var(--sans)" }}>
        {/* ── Category side menu ── */}
        <aside style={{ width: 300, minWidth: 300, flexShrink: 0, background: "var(--card, #fff)", borderRight: "1px solid " + LINE, height: "100vh", overflowY: "auto", position: "sticky", top: 0, boxSizing: "border-box" }}>
          <div style={{ padding: "22px 22px 12px" }}>
            <div style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, letterSpacing: ".3px", color: MUT, marginBottom: 4 }}>Assessment</div>
            <h1 className="serif" style={{ fontSize: 21, color: MID, margin: 0 }}>Question Types</h1>
            <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: MUT, margin: "6px 0 0", lineHeight: 1.4 }}>Live previews — the same components the assessment uses.</p>
          </div>
          <nav style={{ padding: "4px 12px 28px" }}>
            {CATS.map((c) => (
              <div key={c.cat} style={{ marginBottom: 8 }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: MUT, padding: "10px 10px 6px" }}>{c.cat}</div>
                {c.items.map((it) => {
                  const active = it.id === sel.id;
                  return (
                    <button key={it.id} onClick={() => select(it.id)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, textAlign: "left", padding: "9px 10px", marginBottom: 2, border: "none", borderRadius: 8, background: active ? "color-mix(in srgb, var(--accent) 8%, transparent)" : "transparent", color: active ? MID : INK, fontFamily: "var(--sans)", fontSize: 15, fontWeight: active ? 600 : 400, cursor: "pointer" }}>
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
            <div style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, letterSpacing: ".3px", color: MUT, marginBottom: 6 }}>{catOf(sel.id)}</div>
            <h2 className="serif" style={{ fontSize: 28, color: MID, margin: "0 0 6px" }}>{sel.label}</h2>
            <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: MUT, margin: "0 0 26px", lineHeight: 1.5 }}>
              {q ? "Interactive preview — rendered with the same component as the assessment, so any change is reflected in both." : "Placeholder — full preview coming with the simulator."}
            </p>
            {preview}
          </div>
        </main>
      </div>
    );
  }

  window.QuestionTypeGallery = QuestionTypeGallery;
  window.QTypes = { QuestionTypeGallery: QuestionTypeGallery, CATS: CATS };
})();
