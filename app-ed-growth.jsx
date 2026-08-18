// ════════════════════════════════════════════════
//  DIRECTION A — "Beacon" (Editorial) · GROWTH PAGES
//  Development, Insights (reports), Scheduling — content from
//  lighthouse-v5.jsx, re-skinned in the Editorial system.
//  Reuses helpers/tokens from app-ed-detail.jsx (EdBack, EdEyebrow,
//  EdSectionLabel, EdBtn, EdRing2, eMID/eINK/… colour consts).
//  Exports: window.EdGrowth = { EdDevelopment, EdInsights, EdScheduling }
// ════════════════════════════════════════════════

// ── 70/20/10 development-tip styling ──
const edTipMeta = {
  "70": { label: "On-the-job", color: "var(--accent)", bg: "color-mix(in srgb, var(--accent) 10%, transparent)" },
  "20": { label: "From others", color: ePURP, bg: "rgba(143,32,222,.10)" },
  "10": { label: "Formal training", color: eWARN, bg: "rgba(203,126,3,.10)" },
};

// ════════════════════════════════════════════════
//  DEVELOPMENT — competency snapshot + 70/20/10 plan
// ════════════════════════════════════════════════
function EdDevelopment({ onBack }) {
  const comps = LH.competencies;
  const plan = LH.plan;
  const barColor = (s) => s >= 80 ? eSUCCESS : s >= 68 ? eBLUE : eWARN;

  return (
    <div style={{ maxWidth: "var(--content-max)", margin: "36px var(--fol-mx) 72px", padding: 0 }}>
      <EdBack label="Back to dashboard" onClick={onBack} />
      <EdEyebrow color={eBLUE}>Your plan</EdEyebrow>
      <h1 className="serif" style={{ fontSize: 40, color: eMID, lineHeight: 1.08, margin: "0 0 8px" }}>Development</h1>
      <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.6, margin: "0 0 4px", maxWidth: 560 }}>
        Built from your assessment results and growth conversations — organised by the 70·20·10 model: 70% on-the-job, 20% from others, 10% formal training.
      </p>

      {/* COMPETENCY SNAPSHOT */}
      <div style={{ borderTop: "1px solid " + eLINE, paddingTop: 26, marginTop: 32, marginBottom: 40 }}>
        <EdSectionLabel>Competency snapshot</EdSectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 40px", marginTop: 18 }}>
          {comps.map((c, i) => (
            <div key={i}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 7 }}>
                <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eMID }}>{c.label}</span>
                <span className="serif" style={{ fontSize: 18, color: barColor(c.score) }}>{c.score}</span>
              </div>
              <div style={{ height: 7, borderRadius: 4, background: "var(--track)", overflow: "hidden" }}>
                <div style={{ width: `${c.score}%`, height: "100%", borderRadius: 4, background: barColor(c.score) }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PLAN FOCUS AREAS */}
      <div style={{ borderTop: "1px solid " + eLINE, paddingTop: 26 }}>
        <EdSectionLabel>Focus areas</EdSectionLabel>
        <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, margin: "0 0 20px" }}>{plan.length} development priorities · {plan.reduce((n, s) => n + s.tips.length, 0)} actions</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {plan.map((skill, si) => (
            <div key={si} style={{ background: eCARD, border: "1px solid " + eLINE, borderRadius: 16, padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <h3 className="serif" style={{ fontSize: 22, color: eMID, margin: 0 }}>{skill.name}</h3>
                <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, letterSpacing: 0.2, textTransform: "capitalize", color: eMUT, background: "rgba(0,15,71,.05)", padding: "3px 9px", borderRadius: 5 }}>{skill.skillType}</span>
              </div>
              <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.6, margin: "0 0 18px", maxWidth: 600 }}>{skill.desc}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {skill.tips.map((t, ti) => {
                  const m = edTipMeta[t.type];
                  return (
                    <div key={ti} style={{ display: "flex", gap: 14, alignItems: "flex-start", paddingTop: ti === 0 ? 0 : 12, borderTop: ti === 0 ? "none" : "1px solid " + eLINE }}>
                      <div style={{ flexShrink: 0, width: 52, textAlign: "center" }}>
                        <div className="serif" style={{ fontSize: 22, color: m.color, lineHeight: 1 }}>{t.type}</div>
                        <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, letterSpacing: 0.2, color: m.color, marginTop: 2 }}>{m.label}</div>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eMID }}>{t.title}</div>
                        <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.55, margin: "3px 0 7px" }}>{t.desc}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                          <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, display: "inline-flex", alignItems: "center", gap: 5 }}><I.cal size={13} /> {t.start} – {t.end}</span>
                          {t.provider && <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT }}>{t.provider} · {t.duration}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
//  INSIGHTS — assessment reports grid
// ════════════════════════════════════════════════
function EdReportCard({ r, onPreview }) {
  const locked = !r.available;
  const RPT_PHOTOS = { hogan: "1507003211169-0a1dd7228f2d", thriving: "1506126613408-eca07ce68773", cognitive: "1456406644174-8ddd4cd52a06", integrated: "1542744173-8e7e53415bb0", sim: "1517048676732-d65bc937f952", "360": "1600880292203-757bb62b4baf" };
  const photo = RPT_PHOTOS[r.id] ? `https://images.unsplash.com/photo-${RPT_PHOTOS[r.id]}?w=640&h=320&fit=crop&q=72` : null;
  return (
    <div style={{ background: eCARD, border: "1px solid " + eLINE, borderRadius: 16, overflow: "hidden", opacity: locked ? 0.85 : 1, display: "flex", flexDirection: "column" }}>
      <div style={{ position: "relative", height: 150, background: "var(--surface-deep)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {photo
          ? <img src={photo} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", filter: locked ? "grayscale(.7) brightness(.85)" : "none" }} />
          : <span style={{ color: eSKY, display: "flex" }}><I.fileText size={38} /></span>}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,15,71,.15) 0%, rgba(0,15,71,0) 45%, rgba(0,15,71,.30) 100%)" }} />
        {r.available
          ? <span style={{ position: "absolute", top: 10, right: 10, background: "var(--success-fill)", color: "#fff", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, padding: "3px 9px", borderRadius: 5 }}>Available</span>
          : <span style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,.5)", color: "#fff", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, padding: "3px 9px", borderRadius: 5, display: "inline-flex", alignItems: "center", gap: 4, backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}><I.lock size={11} /> Locked</span>}
      </div>
      <div style={{ padding: 18, display: "flex", flexDirection: "column", flex: 1 }}>
        <h3 style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: locked ? eMUT : eMID, margin: "0 0 12px" }}>{r.name}</h3>
        <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eMUT, marginBottom: 6 }}>Based on {r.based.length === 1 ? "1 assessment" : `${r.based.length} assessments`}:</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
          {r.based.map((b, i) => {
            const isDone = i < r.doneCount;
            return <span key={i} style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, padding: "3px 8px", borderRadius: 5, background: isDone ? "rgba(20,133,61,.10)" : "rgba(0,15,71,.05)", color: isDone ? eSUCCESS : eMUT }}>{isDone && "✓ "}{b}</span>;
          })}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto" }}>
          <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, display: "inline-flex", alignItems: "center", gap: 4 }}><I.fileText size={13} /> {r.pages} pages</span>
        </div>
        <div style={{ marginTop: 12 }}>
          {r.available ? (
            <div style={{ display: "flex", gap: 8 }}>
              <EdBtn small primary onClick={() => onPreview && onPreview(r)}>Preview</EdBtn>
              <EdBtn small><I.download size={15} /> PDF</EdBtn>
            </div>
          ) : (
            <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, background: "rgba(0,15,71,.03)", borderRadius: 9, padding: "9px 12px" }}>
              Complete {r.based.length - r.doneCount} more {r.based.length - r.doneCount === 1 ? "assessment" : "assessments"} to unlock.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReportCover({ report, pages }) {
  return (
    <div>
      <img src="data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%3F%3E%0A%3Csvg%20id%3D%22Layer_2%22%20data-name%3D%22Layer%202%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2043.17%2044.26%22%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%0A%20%20%3C%2Fdefs%3E%0A%20%20%3Cg%20id%3D%22Layer_1-2%22%20data-name%3D%22Layer%201%22%3E%0A%20%20%20%20%3Cg%3E%0A%20%20%20%20%20%20%3Cpolygon%20class%3D%22cls-1%22%20fill%3D%22%23000F47%22%20points%3D%2242.49%200%2021.65%2030.43%2022.2%2030.43%2035.07%2024.39%2035.07%2044.26%2043.17%2044.26%2043.17%200%2042.49%200%22%3E%3C%2Fpolygon%3E%0A%20%20%20%20%20%20%3Cpolygon%20class%3D%22cls-1%22%20fill%3D%22%23000F47%22%20points%3D%220%200%200%2044.26%208.1%2044.26%208.1%2024.4%2020.9%2030.43%2021.52%2030.43%20.68%200%200%200%22%3E%3C%2Fpolygon%3E%0A%20%20%20%20%3C%2Fg%3E%0A%20%20%3C%2Fg%3E%0A%3C%2Fsvg%3E" alt="" style={{ width: 34, height: "auto", display: "block", marginBottom: 28 }} />
      <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, letterSpacing: 0.2, color: eBLUE, marginBottom: 10 }}>Marsh Lighthouse · Confidential</div>
      <h1 className="serif" style={{ fontSize: 32, color: eMID, lineHeight: 1.1, margin: "0 0 14px" }}>{report.name}</h1>
      <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.6, margin: "0 0 28px" }}>{report.desc}</p>
      <div style={{ borderTop: "1px solid " + eLINE, paddingTop: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT }}>Prepared for</span><span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eMID }}>{LH.user.first} {LH.user.last}</span></div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT }}>Based on</span><span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eMID }}>{report.based.join(", ")}</span></div>
        <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT }}>Length</span><span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eMID }}>{pages} pages</span></div>
      </div>
    </div>
  );
}

function ReportPage({ report, page }) {
  const comps = [
    { name: "Strategic Thinking", score: 85 },
    { name: "Influence & Communication", score: 72 },
    { name: "Team Development", score: 68 },
    { name: "Decision Making", score: 79 },
    { name: "Resilience", score: 91 },
    { name: "Execution Focus", score: 74 },
  ];
  const Para = ({ children }) => <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.6, margin: "0 0 14px" }}>{children}</p>;
  const H = ({ children }) => <h2 className="serif" style={{ fontSize: 24, color: eMID, margin: "0 0 16px" }}>{children}</h2>;
  const Eyebrow = ({ children }) => <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, letterSpacing: 0.2, color: eBLUE, marginBottom: 10 }}>{children}</div>;
  const t = (page - 1) % 5;

  if (t === 0) return (
    <div>
      <Eyebrow>Section {page} · Executive summary</Eyebrow>
      <H>Executive summary</H>
      <Para>This report synthesises {LH.user.first}'s results across the assessment battery into an integrated view of leadership capability, motivation, and growth potential. Findings are benchmarked against a global norm group of senior managers.</Para>
      <Para>Overall, the profile indicates a capable, resilient leader with clear strengths in strategic thinking and personal drive, alongside development opportunities in how influence and team development are exercised day to day.</Para>
      <div style={{ background: "color-mix(in srgb, var(--accent) 5%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 18%, transparent)", borderRadius: 12, padding: "16px 18px", marginTop: 6 }}>
        <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eMID, marginBottom: 10 }}>Key themes</div>
        {["Drives clarity and direction under ambiguity", "Builds trust quickly but delegates selectively", "Highly resilient; sustains performance under pressure", "Growth edge: scaling influence beyond direct authority"].map((x, i) => (
          <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start", marginBottom: i < 3 ? 8 : 0 }}>
            <span style={{ color: eBLUE, display: "flex", marginTop: 2 }}><I.check size={13} /></span>
            <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.5 }}>{x}</span>
          </div>
        ))}
      </div>
    </div>
  );
  if (t === 1) return (
    <div>
      <Eyebrow>Section {page} · Competency scores</Eyebrow>
      <H>Competency profile</H>
      <Para>Scores use a 0–100 percentile scale relative to the benchmark group. Bars above 80 indicate distinctive strengths; those below 70 mark priority development areas.</Para>
      <div style={{ display: "flex", flexDirection: "column", gap: 15, marginTop: 4 }}>
        {comps.map((c, i) => (
          <div key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eMID }}>{c.name}</span>
              <span className="serif" style={{ fontSize: 15, color: c.score >= 80 ? eSUCCESS : c.score < 70 ? eWARN : eBLUE }}>{c.score}</span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: "var(--track)", overflow: "hidden" }}>
              <div style={{ width: c.score + "%", height: "100%", borderRadius: 4, background: c.score >= 80 ? eSUCCESS : c.score < 70 ? eWARN : eBLUE }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  if (t === 2) return (
    <div>
      <Eyebrow>Section {page} · Strengths & development</Eyebrow>
      <H>Strengths & development areas</H>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
        <div style={{ background: "rgba(20,133,61,.06)", border: "1px solid rgba(20,133,61,.2)", borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eSUCCESS, marginBottom: 10 }}>Strengths</div>
          {["Strategic, big-picture orientation", "Composure and resilience under stress", "Bias for action and follow-through"].map((x, i) => <div key={i} style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.5, marginBottom: 8 }}>• {x}</div>)}
        </div>
        <div style={{ background: "rgba(203,126,3,.06)", border: "1px solid rgba(203,126,3,.2)", borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eWARN, marginBottom: 10 }}>Development areas</div>
          {["Influencing without formal authority", "Coaching and developing others", "Inviting dissent before deciding"].map((x, i) => <div key={i} style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.5, marginBottom: 8 }}>• {x}</div>)}
        </div>
      </div>
      <Para>These patterns are consistent across self-report and behavioural data, suggesting stable preferences rather than situational responses. The development plan translates each area into concrete on-the-job actions.</Para>
    </div>
  );
  if (t === 3) return (
    <div>
      <Eyebrow>Section {page} · Behavioural insights</Eyebrow>
      <H>Behavioural insights</H>
      <Para>Under typical conditions, {LH.user.first} leads through clarity and structure — setting direction, sequencing priorities, and holding a steady course. Peers experience this as dependable and calming.</Para>
      <div style={{ borderLeft: "3px solid " + eBLUE, padding: "6px 0 6px 16px", margin: "4px 0 18px" }}>
        <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 16, color: eMID, lineHeight: 1.5 }}>“Stays composed when things get hard, and helps the team find the next step.”</span>
        <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, marginTop: 8 }}>— Aggregated 360° feedback</div>
      </div>
      <Para>Under pressure, those same strengths can narrow: decisions become more independent and feedback loops shorten. Deliberately widening input at key moments will amplify impact across the wider organisation.</Para>
    </div>
  );
  return (
    <div>
      <Eyebrow>Section {page} · Recommendations</Eyebrow>
      <H>Recommended next steps</H>
      <Para>The following actions are prioritised for the coming two quarters and feed directly into the 70-20-10 development plan.</Para>
      {["Lead a cross-functional initiative to practise lateral influence", "Establish a regular coaching rhythm with two direct reports", "Run a pre-mortem on major decisions to surface dissent early", "Seek a stretch assignment beyond the current domain"].map((x, i) => (
        <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
          <div className="serif" style={{ width: 26, height: 26, borderRadius: 7, background: "color-mix(in srgb, var(--accent) 8%, transparent)", color: eBLUE, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14 }}>{i + 1}</div>
          <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.6 }}>{x}</span>
        </div>
      ))}
    </div>
  );
}

function EdReportReader({ report, onClose }) {
  const [page, setPage] = React.useState(0);
  const [zoom, setZoom] = React.useState(1);
  const pages = report.pages;
  // While the reader is open, flag the document so the floating top controls (accessibility /
  // language) and the AI assistant FAB hide — they otherwise overlap the full-screen reader.
  React.useEffect(() => {
    document.documentElement.setAttribute("data-modal-open", "1");
    return () => document.documentElement.removeAttribute("data-modal-open");
  }, []);
  return (
    <div onClick={onClose} className="ed-reader" style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(0,15,71,.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "28px" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 18, width: "100%", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 30px 80px rgba(0,15,71,.4)" }}>
        {/* header */}
        <div className="ed-reader-head" style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 22px", borderBottom: "1px solid " + eLINE, flexShrink: 0 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--surface-deep)", color: eSKY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><I.fileText size={18} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: eMID, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{report.name}</div>
            <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT }}>Page {page + 1} of {pages}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 2, border: "1px solid " + eLINE, borderRadius: 9, padding: 3, flexShrink: 0 }}>
            <button onClick={() => setZoom((z) => Math.max(0.5, Math.round((z - 0.25) * 100) / 100))} disabled={zoom <= 0.5} title="Zoom out" style={{ width: 28, height: 28, borderRadius: 7, border: "none", background: "transparent", color: zoom <= 0.5 ? "rgba(0,15,71,.25)" : eMID, cursor: zoom <= 0.5 ? "default" : "pointer", fontSize: 18, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
            <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eMID, minWidth: 44, textAlign: "center" }}>{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom((z) => Math.min(2, Math.round((z + 0.25) * 100) / 100))} disabled={zoom >= 2} title="Zoom in" style={{ width: 28, height: 28, borderRadius: 7, border: "none", background: "transparent", color: zoom >= 2 ? "rgba(0,15,71,.25)" : eMID, cursor: zoom >= 2 ? "default" : "pointer", fontSize: 17, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
          </div>
          <EdBtn small><I.download size={15} /> <span className="ed-reader-pdf-lbl">Download PDF</span></EdBtn>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: 9, border: "1px solid " + eLINE, background: "var(--card)", color: eMUT, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--sans)", fontSize: 18, flexShrink: 0 }}>×</button>
        </div>
        <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
          {/* page rail */}
          <div className="ed-reader-rail" style={{ width: 96, flexShrink: 0, borderRight: "1px solid " + eLINE, overflowY: "auto", padding: "12px 0", display: "flex", flexDirection: "column", gap: 8, alignItems: "center", background: "rgba(0,15,71,.02)" }}>
            {Array.from({ length: pages }).map((_, i) => (
              <button key={i} onClick={() => setPage(i)} style={{ width: 56, height: 74, borderRadius: 5, border: i === page ? "2px solid " + eBLUE : "1px solid " + eLINE, background: "var(--card)", cursor: "pointer", padding: 0, flexShrink: 0, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, width: 600, transform: "scale(" + (56 / 600) + ")", transformOrigin: "top left", pointerEvents: "none" }}>
                  <div className="ed-report-page" style={{ width: 600, minHeight: 793, background: "var(--card)", padding: "56px 60px", boxSizing: "border-box" }}>
                    {i === 0 ? <ReportCover report={report} pages={pages} /> : <ReportPage report={report} page={i} />}
                  </div>
                </div>
                <span style={{ position: "absolute", bottom: 2, right: 4, fontFamily: "var(--sans)", fontSize: 14, color: eMUT, background: "rgba(255,255,255,.85)", borderRadius: 3, padding: "0 3px", zIndex: 2 }}>{i + 1}</span>
              </button>
            ))}
          </div>
          {/* page viewer */}
          <div className="ed-reader-viewer" style={{ flex: 1, overflowY: "auto", overflowX: "auto", background: "rgba(0,15,71,.03)", display: "flex", justifyContent: zoom > 1 ? "flex-start" : "center", padding: 28 }}>
            <div className="ed-report-page" style={{ width: "100%", maxWidth: 600, minHeight: 848, zoom: zoom, background: "var(--card)", borderRadius: 4, boxShadow: "0 6px 30px rgba(0,15,71,.14)", padding: "56px 60px", alignSelf: "flex-start", flexShrink: 0, display: "flex", flexDirection: "column" }}>
              {page === 0 ? (
                <ReportCover report={report} pages={pages} />
              ) : (
                <ReportPage report={report} page={page} />
              )}
              <div style={{ marginTop: "auto", paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT }}>Marsh Lighthouse · Confidential</span>
                <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT }}>{report.name} · Page {page + 1}</span>
              </div>
            </div>
          </div>
        </div>
        {/* footer nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "12px 22px", borderTop: "1px solid " + eLINE, flexShrink: 0 }}>
          <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} style={{ width: 36, height: 36, borderRadius: 9, border: "1px solid " + eLINE, background: "var(--card)", color: page === 0 ? "rgba(0,15,71,.2)" : eMID, cursor: page === 0 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><I.chevL size={17} /></button>
          <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT }}>{page + 1} / {pages}</span>
          <button onClick={() => setPage((p) => Math.min(pages - 1, p + 1))} disabled={page === pages - 1} style={{ width: 36, height: 36, borderRadius: 9, border: "1px solid " + eLINE, background: "var(--card)", color: page === pages - 1 ? "rgba(0,15,71,.2)" : eMID, cursor: page === pages - 1 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><I.chevR size={17} /></button>
        </div>
      </div>
    </div>
  );
}

function EdInsights({ onBack, initialPreview }) {
  const reps = LH.reportsFull;
  const [preview, setPreview] = React.useState(() => initialPreview ? (LH.reportsFull.find((r) => r.id === initialPreview && r.available) || null) : null);
  const groups = [
    { label: "Leadership 2026", items: reps.filter((r) => r.program === "Leadership 2026") },
    { label: "360° Perspective", items: reps.filter((r) => r.program === "360° Perspective") },
  ];
  const availCount = reps.filter((r) => r.available).length;
  return (
    <div style={{ maxWidth: "var(--content-max)", margin: "36px var(--fol-mx) 72px", padding: 0 }}>
      <EdBack label="Back to dashboard" onClick={onBack} />
      <h1 className="serif" style={{ fontSize: 40, color: eMID, lineHeight: 1.08, margin: "0 0 8px" }}>Insights</h1>
      <p className="ed-insights-banner" style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.7, margin: 0, maxWidth: "none", whiteSpace: "nowrap" }}>
        <span style={{ display: "inline-block", fontSize: 14, fontWeight: 700, color: eBLUE, background: "color-mix(in srgb, var(--accent) 8%, transparent)", padding: "3px 10px", borderRadius: 6, marginRight: 9, verticalAlign: "1px", whiteSpace: "nowrap" }}>{availCount} of {reps.length} ready</span>
        Reports unlock automatically as you complete their underlying tasks.
      </p>

      {groups.map((g, gi) => (
        <div key={gi} style={{ borderTop: "1px solid " + eLINE, paddingTop: 26, marginTop: 32 }}>
          <h2 className="serif" style={{ fontSize: 21, color: eMID, lineHeight: 1.15, margin: "0 0 18px" }}>{g.label}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 18 }}>
            {g.items.map((r) => <EdReportCard key={r.id} r={r} onPreview={setPreview} />)}
          </div>
        </div>
      ))}

      {preview && <EdReportReader report={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}

// ════════════════════════════════════════════════
//  SCHEDULING — book assessment-center sessions
// ════════════════════════════════════════════════
// Timezones offered when viewing slots (same idea as the Bookings flow). Slot times
// in the data are authored in GST (UTC+4); picking another zone shifts them.
const SCHED_TZS = [
  { v: "(GMT+04:00) Asia/Dubai", short: "GST (UTC+4)", off: 4 },
  { v: "(GMT+00:00) UTC", short: "UTC", off: 0 },
  { v: "(GMT+01:00) Europe/London", short: "BST (UTC+1)", off: 1 },
  { v: "(GMT+02:00) Europe/Berlin", short: "CEST (UTC+2)", off: 2 },
  { v: "(GMT+05:30) Asia/Kolkata", short: "IST (UTC+5:30)", off: 5.5 },
  { v: "(GMT-05:00) America/New York", short: "EST (UTC-5)", off: -5 },
];
const SCHED_BASE_OFF = 4;   // slot data is authored in GST
// Shift one "9:00 AM" by a fractional-hour delta.
function schedShiftOne(t, deltaHrs) {
  const m = String(t).match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return t;
  let h = (+m[1]) % 12; if (/pm/i.test(m[3])) h += 12;
  let total = h * 60 + (+m[2]) + Math.round(deltaHrs * 60);
  total = ((total % 1440) + 1440) % 1440;
  const hh = Math.floor(total / 60), mm = total % 60;
  const ap = hh >= 12 ? "PM" : "AM";
  return (hh % 12 || 12) + ":" + String(mm).padStart(2, "0") + " " + ap;
}
// Shift a "9:00 AM – 10:30 AM" range.
function schedShiftRange(range, deltaHrs) {
  if (!deltaHrs) return range;
  return String(range).split("–").map((x) => schedShiftOne(x.trim(), deltaHrs)).join(" – ");
}

function EdScheduling({ onBack, initialCenter, demo }) {
  // demo: optional initial UI state for static screen boards — { calView, pop, confirm, cancel, booked }
  const demoCtx = () => { const p = LH.scheduling[0], c = p.centers[0]; return { slot: c.slots[0], center: c, program: p.program }; };
  const [booked, setBooked] = React.useState(() => (demo && (demo.booked || demo.cancel)) ? { [LH.scheduling[0].centers[0].slots[0].id]: true } : {});
  const [confirmSlot, setConfirmSlot] = React.useState(() => (demo && demo.confirm) ? demoCtx() : null); // {slot, center, program}
  const [cancelSlot, setCancelSlot] = React.useState(() => (demo && demo.cancel) ? demoCtx() : null);
  const [pop, setPop] = React.useState(() => (demo && demo.pop) ? { ...demoCtx(), booked: false, relLeft: 260, relRight: 500, relTop: 120 } : null);
  // Language preference asked in the confirm dialog, then the "booked" step that
  // offers Add-to-calendar — same pattern as the Bookings module.
  const [langPref, setLangPref] = React.useState("no");   // "yes" | "no"
  const [lang, setLang] = React.useState("English");
  const [doneSlot, setDoneSlot] = React.useState(null);   // {slot, center, program, langPref, lang}
  const [tz, setTz] = React.useState(SCHED_TZS[0].v);
  const tzMeta = SCHED_TZS.find((z) => z.v === tz) || SCHED_TZS[0];
  const tzDelta = tzMeta.off - SCHED_BASE_OFF;
  const slotTime = (t) => schedShiftRange(t, tzDelta);   // time in the chosen zone
  const [schedToast, setSchedToast] = React.useState(null);
  const showSchedToast = (m) => { setSchedToast(m); setTimeout(() => setSchedToast(null), 2400); };
  const calWrapRef = React.useRef(null);
  const [view, setView] = React.useState(initialCenter || null);   // null = overview | centerId
  // when a slot is booked, start the matching center's timer (task center id = schedId minus "-sched")
  const markCenterReserved = (center) => { try { if (center && center.id) localStorage.setItem("lh-center-resv-" + center.id.replace("-sched", ""), String(Date.now())); } catch (e) {} };
  const [calView, setCalView] = React.useState(!!(demo && (demo.calView || demo.pop))); // false = list, true = calendar
  const [calMonth, setCalMonth] = React.useState(2);    // 0=Jan … default March
  const [calWeek, setCalWeek] = React.useState(0);      // index into derived weeks
  const data = LH.scheduling;

  // When viewing a single centre's detail, surface its "All assessment centers"
  // back in the dashboard's fixed top bar instead of inline in the page.
  // Also covers the booking-confirmed page, which is driven by doneSlot rather than
  // view — clearing only view would leave that page up with no way back.
  useTopBarBack(!!view || !!doneSlot, "All assessment centers", () => { setDoneSlot(null); setView(null); });

  const allCenters = data.flatMap((p) => p.centers.map((c) => ({ ...c, program: p.program })));
  const selCenter = view ? allCenters.find((c) => c.id === view) : null;

  const myBookings = [];
  data.forEach((prog) => prog.centers.forEach((c) => c.slots.forEach((s) => {
    if (booked[s.id]) myBookings.push({ slot: s, center: c, program: prog.program });
  })));

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthFull = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const ToggleBtn = ({ on, onClick, icon, label }) => {
    const Ic = I[icon];
    return (
      <button onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 15px", borderRadius: 8, fontFamily: "var(--sans)", fontSize: 14, fontWeight: on ? 700 : 500, cursor: "pointer", border: "none", background: on ? "#fff" : "transparent", color: on ? eMID : eMUT, boxShadow: on ? "0 1px 4px rgba(0,15,71,.1)" : "none", transition: "all .15s" }}>
        <Ic size={15} /> {label}
      </button>
    );
  };

  // ── CENTER DETAIL VIEW ──
  const renderCenterDetail = () => {
    const c = selCenter;
    const Ic = I[c.icon] || I.cal;
    return (
      <div style={{ maxWidth: "var(--content-max)", margin: "36px var(--fol-mx) 72px", padding: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 15, marginBottom: 18 }}>
          <div style={{ width: 50, height: 50, borderRadius: 13, background: c.color + "16", color: c.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Ic size={23} /></div>
          <div>
            <h1 className="serif" style={{ fontSize: 32, color: eMID, lineHeight: 1.08, margin: "0 0 2px" }}>{c.name}</h1>
            <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT }}>{c.program}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
          <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, display: "inline-flex", alignItems: "center", gap: 6 }}><I.globe size={15} /> {c.location}</span>
          <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, display: "inline-flex", alignItems: "center", gap: 6 }}><I.clock size={15} /> {c.duration}</span>
        </div>
        <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.6, margin: "0 0 24px", paddingBottom: 24, borderBottom: "1px solid " + eLINE, maxWidth: 560 }}>{c.desc}</p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
          <div style={{ display: "inline-flex", gap: 4, background: "rgba(0,15,71,.05)", borderRadius: 10, padding: 3 }}>
            <ToggleBtn on={!calView} onClick={() => setCalView(false)} icon="menu" label="List" />
            <ToggleBtn on={calView} onClick={() => setCalView(true)} icon="cal" label="Calendar" />
          </div>
          {/* timezone — slot times convert as you switch (same as the Bookings flow) */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: eMUT, display: "flex" }}><I.globe size={16} /></span>
            <div style={{ position: "relative", display: "inline-block" }}>
              <select value={tz} onChange={(e) => setTz(e.target.value)} title="Show times in this timezone"
                style={{ appearance: "none", WebkitAppearance: "none", MozAppearance: "none", fontFamily: "var(--sans)", fontSize: 14, color: eINK, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 8, padding: "9px 38px 9px 12px", cursor: "pointer" }}>
                {SCHED_TZS.map((z) => <option key={z.v} value={z.v}>{z.v}</option>)}
              </select>
              <span style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: eMUT, display: "flex" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
              </span>
            </div>
          </div>
        </div>
        {calView ? renderCalendar(c.id) : (
        <React.Fragment>
        <EdSectionLabel>Available slots</EdSectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 14 }}>
          {c.slots.map((slot) => {
            const isBooked = booked[slot.id];
            const full = slot.remaining <= 0 && !isBooked;
            const low = slot.remaining <= 2 && slot.remaining > 0;
            return (
              <div key={slot.id} className="ed-slot-row" style={{ background: isBooked ? "rgba(20,133,61,.05)" : eCARD, border: "1px solid " + (isBooked ? "rgba(20,133,61,.3)" : eLINE), borderRadius: 14, padding: "16px 18px", opacity: full ? 0.55 : 1, display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ textAlign: "center", width: 54, flexShrink: 0 }}>
                  <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eMUT, letterSpacing: 0.2 }}>{slot.day.slice(0, 3)}</div>
                  <div className="serif" style={{ fontSize: 24, color: eMID, lineHeight: 1.05 }}>{slot.date.split(" ")[1].replace(",", "")}</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT }}>{slot.date.split(" ")[0]}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eMID, marginBottom: 4 }}>{slotTime(slot.time)}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT }}>{tzMeta.short}</span>
                    <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: low ? eDANGER : slot.remaining === slot.total ? eSUCCESS : eMUT }}>{slot.remaining}/{slot.total} seats{low ? " — filling fast" : ""}</span>
                    {slot.cancelBefore ? (
                      <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eBLUE, background: "color-mix(in srgb, var(--accent) 8%, transparent)", padding: "2px 8px", borderRadius: 5 }}>Cancel OK ({slot.cancelBefore})</span>
                    ) : (
                      <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eDANGER, background: "rgba(197,53,50,.08)", padding: "2px 8px", borderRadius: 5 }}>No cancellation</span>
                    )}
                  </div>
                </div>
                <div className="ed-slot-action" style={{ flexShrink: 0 }}>
                  {isBooked ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eSUCCESS, display: "inline-flex", alignItems: "center", gap: 5 }}><I.check size={15} /> Booked</span>
                      {slot.cancelBefore && <button onClick={() => setCancelSlot({ slot, center: c, program: c.program })} style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eDANGER, background: "none", border: "1px solid rgba(197,53,50,.3)", borderRadius: 8, padding: "6px 11px", cursor: "pointer" }}>Cancel</button>}
                    </div>
                  ) : full ? (
                    <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eMUT }}>Full</span>
                  ) : (
                    <EdBtn small primary onClick={() => setConfirmSlot({ slot, center: c, program: c.program })}>Book slot</EdBtn>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        </React.Fragment>
        )}
      </div>
    );
  };

  // ── CALENDAR VIEW — weekly time grid ──
  const renderCalendar = (onlyCenterId = null) => {
    const monthIdx = (m) => monthNames.indexOf(m);
    const parseTime = (t) => {
      const m = t.trim().match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!m) return 9;
      let h = parseInt(m[1]) % 12; if (/pm/i.test(m[3])) h += 12;
      return h + parseInt(m[2]) / 60;
    };
    // build events from all slots
    const events = [];
    data.forEach((p) => p.centers.forEach((c) => { if (onlyCenterId && c.id !== onlyCenterId) return; c.slots.forEach((s) => {
      const parts = s.date.split(" ");
      const dt = new Date(2026, monthIdx(parts[0]), parseInt(parts[1]));
      const [t1, t2] = s.time.split("–").map((x) => x.trim());
      events.push({ slot: s, center: c, program: p.program, dt, start: parseTime(t1), end: parseTime(t2 || t1) });
    }); }));
    // monday of a date
    const mondayOf = (d) => { const x = new Date(d); const dow = (x.getDay() + 6) % 7; x.setDate(x.getDate() - dow); x.setHours(0, 0, 0, 0); return x; };
    const weekKeys = [...new Set(events.map((e) => mondayOf(e.dt).getTime()))].sort((a, b) => a - b);
    const wkIdx = Math.min(calWeek, weekKeys.length - 1);
    const weekStart = new Date(weekKeys[wkIdx]);
    const dayCols = Array.from({ length: 7 }).map((_, i) => { const d = new Date(weekStart); d.setDate(d.getDate() + i); return d; });
    const wdNames = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    const monAbbr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

    const gridStart = 9, gridEnd = 16, rowH = 64;
    const hours = []; for (let h = gridStart; h <= gridEnd; h++) hours.push(h);
    const hourLabel = (h) => { const ap = h < 12 ? "AM" : "PM"; const hh = h % 12 === 0 ? 12 : h % 12; return `${hh} ${ap}`; };
    const rangeLabel = `${monAbbr[weekStart.getMonth()]} ${weekStart.getDate()} – ${monAbbr[dayCols[6].getMonth()]} ${dayCols[6].getDate()}, 2026`;

    return (
      <div ref={calWrapRef} style={{ marginBottom: 24, position: "relative" }}>
        {/* header */}
        <div className="ed-cal-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setCalWeek(Math.max(0, wkIdx - 1))} disabled={wkIdx <= 0} style={{ width: 34, height: 34, borderRadius: 9, background: eCARD, border: "1px solid " + eLINE, cursor: wkIdx <= 0 ? "default" : "pointer", color: wkIdx <= 0 ? "rgba(0,15,71,.2)" : eMID, display: "flex", alignItems: "center", justifyContent: "center" }}><I.chevL size={17} /></button>
            <h3 className="serif" style={{ fontSize: 21, color: eMID, margin: 0, minWidth: 220, textAlign: "center" }}>{rangeLabel}</h3>
            <button onClick={() => setCalWeek(Math.min(weekKeys.length - 1, wkIdx + 1))} disabled={wkIdx >= weekKeys.length - 1} style={{ width: 34, height: 34, borderRadius: 9, background: eCARD, border: "1px solid " + eLINE, cursor: wkIdx >= weekKeys.length - 1 ? "default" : "pointer", color: wkIdx >= weekKeys.length - 1 ? "rgba(0,15,71,.2)" : eMID, display: "flex", alignItems: "center", justifyContent: "center" }}><I.chevR size={17} /></button>
          </div>
          <div className="ed-cal-legend" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "var(--sans)", fontSize: 14, color: eMUT }}>
              <div style={{ width: 9, height: 9, borderRadius: 3, background: "var(--success-fill)" }} />Booked
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "var(--sans)", fontSize: 14, color: eMUT }}>
              <div style={{ width: 9, height: 9, borderRadius: 3, background: eBLUE }} />Available
            </div>
          </div>
        </div>

        {/* week grid */}
        <div className="ed-cal-scroll" style={{ border: "1px solid " + eLINE, borderRadius: 14, overflow: "hidden", background: eCARD }}>
          {/* day header row */}
          <div className="ed-cal-grid" style={{ display: "grid", gridTemplateColumns: "56px repeat(7, 1fr)", borderBottom: "1px solid " + eLINE, background: "rgba(0,15,71,.02)" }}>
            <div />
            {dayCols.map((d, i) => (
              <div key={i} style={{ padding: "12px 10px", textAlign: "center", borderLeft: "1px solid " + eLINE }}>
                <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eMID }}>{String(d.getDate()).padStart(2, "0")} </span>
                <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eMUT, letterSpacing: 0.5 }}>{wdNames[i]}</span>
              </div>
            ))}
          </div>
          {/* body: time gutter + columns */}
          <div className="ed-cal-grid" style={{ display: "grid", gridTemplateColumns: "56px repeat(7, 1fr)", position: "relative" }}>
            {/* time gutter */}
            <div style={{ position: "relative" }}>
              {hours.map((h, i) => (
                <div key={h} style={{ height: rowH, position: "relative" }}>
                  <span style={{ position: "absolute", top: -8, right: 8, fontFamily: "var(--sans)", fontSize: 14, color: eMUT }}>{i === 0 ? "" : hourLabel(h)}</span>
                </div>
              ))}
            </div>
            {/* day columns */}
            {dayCols.map((d, ci) => {
              const dayEvents = events.filter((e) => sameDay(e.dt, d));
              return (
                <div key={ci} style={{ position: "relative", borderLeft: "1px solid " + eLINE, height: (gridEnd - gridStart) * rowH }}>
                  {/* hour lines */}
                  {hours.slice(0, -1).map((h, i) => (
                    <div key={h} style={{ position: "absolute", top: (i + 1) * rowH, left: 0, right: 0, borderTop: "1px solid var(--line)" }} />
                  ))}
                  {dayEvents.map((e, ei) => {
                    const top = (e.start - gridStart) * rowH;
                    const height = Math.min(Math.max((e.end - e.start) * rowH - 5, 40), 46);
                    const isBooked = booked[e.slot.id];
                    const tint = isBooked ? eSUCCESS : eBLUE;
                    return (
                      <div key={ei} onClick={(ev) => { const blockRect = ev.currentTarget.getBoundingClientRect(); const wrap = calWrapRef.current; const wRect = wrap ? wrap.getBoundingClientRect() : { left: 0, top: 0, width: 1 }; const scale = (wrap && wrap.offsetWidth) ? (wRect.width / wrap.offsetWidth) : 1; setPop({ slot: e.slot, center: e.center, program: e.program, booked: isBooked, relLeft: (blockRect.left - wRect.left) / scale, relRight: (blockRect.right - wRect.left) / scale, relTop: (blockRect.top - wRect.top) / scale }); }}
                        style={{ position: "absolute", top: top + 2, left: 4, right: 4, height, background: tint + "14", borderLeft: "3px solid " + tint, borderRadius: 8, padding: "7px 9px", cursor: "pointer", overflow: "hidden", transition: "background .15s" }}
                        onMouseEnter={(ev) => ev.currentTarget.style.background = tint + "22"}
                        onMouseLeave={(ev) => ev.currentTarget.style.background = tint + "14"}>
                        <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eMID, lineHeight: 1.2, marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{slotTime(e.slot.time)}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                            {isBooked ? (
                              <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eSUCCESS, display: "inline-flex", alignItems: "center", gap: 3 }}><I.check size={11} /> Booked</span>
                            ) : (
                              <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: e.slot.remaining <= 2 ? eDANGER : eMUT }}>{e.slot.remaining}/{e.slot.total} seats</span>
                            )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, marginTop: 12 }}>Tap a session to book it. Booked sessions appear in green.</p>

        {pop && (() => {
          const { slot, center } = pop;
          const W = 240;
          const wrapW = calWrapRef.current ? calWrapRef.current.offsetWidth : 800;
          let left = pop.relRight + 8;
          if (left + W > wrapW) left = pop.relLeft - W - 8; // flip to the left of the block
          if (left < 0) left = Math.max(4, Math.min(pop.relRight + 8, wrapW - W - 4));
          const top = Math.max(0, pop.relTop);
          return (
            <React.Fragment>
              <div onClick={() => setPop(null)} style={{ position: "fixed", inset: 0, zIndex: 79 }} />
              <div className="ed-cal-pop" style={{ position: "absolute", top, left, width: W, zIndex: 80, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 14, boxShadow: "0 16px 44px rgba(0,15,71,.22)", padding: 16, fontFamily: "var(--sans)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                  <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eMID, lineHeight: 1.2 }}>Book this slot</div>
                  <button onClick={() => setPop(null)} title="Close" style={{ background: "none", border: "none", color: eMUT, cursor: "pointer", display: "flex", flexShrink: 0, padding: 0 }}><I.plus size={16} style={{ transform: "rotate(45deg)" }} /></button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 13 }}>
                  <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, display: "inline-flex", alignItems: "center", gap: 6 }}><I.cal size={13} /> {slot.date} · {slot.day}</span>
                  <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, display: "inline-flex", alignItems: "center", gap: 6 }}><I.clock size={13} /> {slotTime(slot.time)} · {tzMeta.short}</span>
                  <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, display: "inline-flex", alignItems: "center", gap: 6 }}><I.globe size={13} /> {center.location}</span>
                  <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: slot.remaining <= 2 ? eDANGER : eMUT, display: "inline-flex", alignItems: "center", gap: 6 }}><I.users size={13} /> {slot.remaining} of {slot.total} seats left</span>
                </div>
                {pop.booked ? (
                  <button onClick={() => { setBooked((b) => { const n = { ...b }; delete n[slot.id]; return n; }); setPop(null); }} style={{ width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, background: "var(--danger-fill)", color: "#fff", border: "none", borderRadius: 9, padding: "10px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Cancel booking</button>
                ) : (
                  <button onClick={() => { setBooked((b) => ({ ...b, [slot.id]: true })); markCenterReserved(center); setPop(null); }} style={{ width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, background: eBLUE, color: "#fff", border: "none", borderRadius: 9, padding: "10px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Book this slot <I.check size={14} /></button>
                )}
              </div>
            </React.Fragment>
          );
        })()}
      </div>
    );
  };

  // ── MODALS (shared) ──
  const modals = (
    <React.Fragment>
      {confirmSlot && (() => { const { slot, center } = confirmSlot; return (
        <div onClick={() => setConfirmSlot(null)} style={{ position: "fixed", inset: 0, zIndex: 80, background: "rgba(0,15,71,.4)", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", background: "var(--card)", border: "1px solid var(--line)", borderRadius: 18, padding: 28, maxWidth: 440, width: "100%", boxShadow: "0 24px 60px rgba(0,15,71,.3)" }}>
            <button onClick={() => setConfirmSlot(null)} title="Close" style={{ position: "absolute", top: 16, right: 16, width: 32, height: 32, borderRadius: 8, border: "none", background: "rgba(0,15,71,.05)", color: eMUT, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><I.plus size={18} style={{ transform: "rotate(45deg)" }} /></button>
            <EdEyebrow color={eBLUE}>Confirm booking</EdEyebrow>
            <h2 className="serif" style={{ fontSize: 26, color: eMID, lineHeight: 1.1, margin: "0 0 16px" }}>{center.name}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              {[[I.cal, `${slot.date} · ${slot.day}`], [I.clock, `${slotTime(slot.time)} · ${tzMeta.short}`], [I.globe, center.location]].map(([Ic, txt], i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ color: eBLUE, display: "flex" }}><Ic size={17} /></span><span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK }}>{txt}</span></div>
              ))}
            </div>
            {/* language preference — same question as the Bookings flow */}
            <div style={{ borderTop: "1px solid " + eLINE, paddingTop: 18, marginBottom: 18 }}>
              <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, marginBottom: 10 }}>Do you have a language preference?</div>
              <div style={{ display: "flex", gap: 22, marginBottom: langPref === "yes" ? 12 : 0 }}>
                {["yes", "no"].map((v) => (
                  <label key={v} style={{ display: "inline-flex", alignItems: "center", gap: 7, cursor: "pointer", fontFamily: "var(--sans)", fontSize: 14, color: eINK }}>
                    <input type="radio" name="sched-lang" checked={langPref === v} onChange={() => setLangPref(v)} style={{ accentColor: eBLUE, width: 16, height: 16 }} />
                    {v === "yes" ? "Yes" : "No"}
                  </label>
                ))}
              </div>
              {langPref === "yes" && (
                <select value={lang} onChange={(e) => setLang(e.target.value)}
                  style={{ width: "100%", boxSizing: "border-box", fontFamily: "var(--sans)", fontSize: 14, color: eINK, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 10, padding: "11px 13px", cursor: "pointer" }}>
                  <option>English</option><option>Deutsch</option><option>Français</option><option>العربية</option>
                </select>
              )}
            </div>
            <div style={{ background: slot.cancelBefore ? "color-mix(in srgb, var(--accent) 5%, transparent)" : "rgba(203,126,3,.07)", borderRadius: 10, padding: "10px 13px", marginBottom: 22 }}>
              <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.5 }}>{slot.cancelBefore ? `Free cancellation up to ${slot.cancelBefore} before the session.` : "This session is non-refundable once booked."}</span>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <EdBtn primary onClick={() => { setBooked((b) => ({ ...b, [slot.id]: true })); markCenterReserved(center); setDoneSlot({ ...confirmSlot, langPref, lang }); setConfirmSlot(null); }}>Confirm booking <I.check size={15} /></EdBtn>
            </div>
          </div>
        </div>
      ); })()}

      {schedToast && (
        <div style={{ position: "fixed", left: "50%", bottom: 28, transform: "translateX(-50%)", zIndex: 90, background: eMID, color: "#fff", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, padding: "11px 18px", borderRadius: 10, boxShadow: "0 10px 30px rgba(0,15,71,.28)", display: "inline-flex", alignItems: "center", gap: 8 }}>
          <I.check size={16} /> {schedToast}
        </div>
      )}

      {cancelSlot && (() => { const { slot, center } = cancelSlot; return (
        <div onClick={() => setCancelSlot(null)} style={{ position: "fixed", inset: 0, zIndex: 80, background: "rgba(0,15,71,.4)", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", background: "var(--card)", border: "1px solid var(--line)", borderRadius: 18, padding: 28, maxWidth: 420, width: "100%", boxShadow: "0 24px 60px rgba(0,15,71,.3)" }}>
            <button onClick={() => setCancelSlot(null)} title="Close" style={{ position: "absolute", top: 16, right: 16, width: 32, height: 32, borderRadius: 8, border: "none", background: "rgba(0,15,71,.05)", color: eMUT, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><I.plus size={18} style={{ transform: "rotate(45deg)" }} /></button>
            <div style={{ width: 46, height: 46, borderRadius: 13, background: "rgba(197,53,50,.10)", color: eDANGER, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}><I.info size={22} /></div>
            <h2 className="serif" style={{ fontSize: 24, color: eMID, lineHeight: 1.12, margin: "0 0 8px" }}>Cancel this booking?</h2>
            <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.6, margin: "0 0 8px" }}>You're about to cancel <strong style={{ color: eMID }}>{center.name}</strong> on {slot.date} at {slotTime(slot.time)}.</p>
            <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, lineHeight: 1.5, margin: "0 0 22px" }}>{slot.cancelBefore ? `This is within the free cancellation window (${slot.cancelBefore} before).` : "This session is non-refundable — cancelling forfeits your seat."}</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => { setBooked((b) => { const n = { ...b }; delete n[slot.id]; return n; }); setCancelSlot(null); setDoneSlot(null); }} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--danger-fill)", color: "#fff", border: "none", borderRadius: 10, padding: "12px 18px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Cancel booking</button>
            </div>
          </div>
        </div>
      ); })()}
    </React.Fragment>
  );

  // ── CENTER DETAIL ──
  // ── BOOKING CONFIRMED PAGE ("You're all set") ──
  // A full page rather than a dialog: it's the end of the task and carries its own
  // actions (calendar, cancel, reschedule) — same pattern as the Bookings module.
  const renderBooked = () => {
    const { slot, center } = doneSlot;
    const PIcon = (window.EdBookings && window.EdBookings.ProviderIcon) || null;
    const providers = (window.EdBookings && window.EdBookings.CAL_PROVIDERS) || ["Google", "Outlook", "Office 365", "iCal", "Yahoo"];
    const row = (label, value) => (
      <div style={{ display: "flex", gap: 20, padding: "14px 0", borderTop: "1px solid " + eLINE }}>
        <div style={{ width: 110, flexShrink: 0, fontFamily: "var(--sans)", fontSize: 14, color: eMUT }}>{label}</div>
        <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMID, fontWeight: 600 }}>{value}</div>
      </div>
    );
    return (
      <div style={{ maxWidth: "var(--content-max)", margin: "36px var(--fol-mx) 72px", padding: 0 }}>
        <div style={{ background: eCARD, border: "1px solid " + eLINE, borderRadius: 18, padding: "40px 36px" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ width: 62, height: 62, borderRadius: "50%", background: eSUCCESS, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}><I.check size={30} /></div>
            <h1 className="serif" style={{ fontSize: 32, color: eMID, lineHeight: 1.1, margin: "0 0 10px" }}>{doneSlot.justBooked === false ? "Your booking" : "You're all set"}</h1>
            <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.6, margin: "0 auto", maxWidth: 460 }}>{doneSlot.justBooked === false ? "This session is confirmed. You can add it to your calendar, reschedule, or cancel below." : "Your session is booked. We've emailed you and the other attendees a calendar invitation with all the details."}</p>
          </div>

          <div style={{ border: "1px solid " + eLINE, borderRadius: 14, padding: "4px 20px 14px", marginBottom: 26 }}>
            <div style={{ display: "flex", gap: 20, padding: "14px 0" }}>
              <div style={{ width: 110, flexShrink: 0, fontFamily: "var(--sans)", fontSize: 14, color: eMUT }}>Session</div>
              <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMID, fontWeight: 700 }}>{center.name}</div>
            </div>
            {row("When", <React.Fragment>{slot.date} · {slot.day}<br /><span style={{ fontWeight: 700 }}>{slotTime(slot.time)}</span> <span style={{ fontWeight: 400, color: eMUT }}>({tzMeta.short})</span></React.Fragment>)}
            {row("Location", center.location)}
            {doneSlot.langPref === "yes" && row("Language", doneSlot.lang)}
            {slot.cancelBefore && row("Cancellation", "Free up to " + slot.cancelBefore + " before the session")}
          </div>

          {/* what the session actually is — so this page works as the booking's detail view */}
          {center.desc && (
            <div style={{ marginBottom: 26 }}>
              <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: eMID, marginBottom: 8 }}>About this session</div>
              <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.6, margin: 0 }}>{center.desc}</p>
              <button onClick={() => { setDoneSlot(null); setView(center.id); }}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, background: "none", border: "none", padding: 0, cursor: "pointer", color: eBLUE, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600 }}>
                View all slots for this center <I.arrow size={14} />
              </button>
            </div>
          )}
          <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: eMID, marginBottom: 12 }}>Add to your calendar</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {providers.map((c) => (
              <button key={c} onClick={() => showSchedToast("Added to " + c)}
                style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eINK, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 10, padding: "10px 16px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 9, transition: "border-color .15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = eMID; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--line)"; }}>
                {PIcon ? <PIcon name={c} /> : <I.cal size={15} />} {c}
              </button>
            ))}
          </div>

          <div style={{ borderTop: "1px solid " + eLINE, marginTop: 30, paddingTop: 22, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
            <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT }}>Need to make changes?</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setCancelSlot(doneSlot); }} style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eDANGER, background: "var(--card)", border: "1px solid " + eDANGER, borderRadius: 10, padding: "11px 18px", cursor: "pointer" }}>Cancel booking</button>
              <button onClick={() => { setBooked((b) => { const n = { ...b }; delete n[slot.id]; return n; }); setDoneSlot(null); setView(center.id); }} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eMID, background: "var(--card)", border: "1px solid " + eMID, borderRadius: 10, padding: "11px 18px", cursor: "pointer" }}><I.clock size={15} /> Reschedule</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (doneSlot) return <React.Fragment>{renderBooked()}{modals}</React.Fragment>;
  if (selCenter) return <React.Fragment>{renderCenterDetail()}{modals}</React.Fragment>;

  // ── OVERVIEW (list / calendar) ──

  return (
    <div style={{ maxWidth: "var(--content-max)", margin: "36px var(--fol-mx) 72px", padding: 0 }}>
      <EdBack label="Back to dashboard" onClick={onBack} />
      <h1 className="serif" style={{ fontSize: 40, color: eMID, lineHeight: 1.08, margin: "0 0 8px" }}>Scheduling</h1>
      <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.6, margin: "0 0 22px", maxWidth: 560 }}>Browse available time slots and book your assessment center sessions.</p>

      {/* List / Calendar toggle removed from overview — calendar lives inside each center.
         renderCalendar() is retained for that per-center view and future use. */}
      <React.Fragment>
          {/* My bookings */}
          {myBookings.length > 0 && (
            <div style={{ marginBottom: 30 }}>
              <EdSectionLabel>My bookings</EdSectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
                {myBookings.map((b, i) => (
                  <div key={i} onClick={() => setDoneSlot({ ...b, justBooked: false })} title="View booking details"
                    style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(20,133,61,.05)", border: "1px solid rgba(20,133,61,.22)", borderRadius: 14, padding: "14px 18px", cursor: "pointer", transition: "background .15s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(20,133,61,.09)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(20,133,61,.05)"; }}>
                    <div style={{ width: 40, height: 40, borderRadius: 11, background: "var(--success-fill)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><I.checkCircle size={19} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eMID }}>{b.center.name}</div>
                      <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT }}>{b.slot.date} · {slotTime(b.slot.time)} · {b.center.location}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => { setBooked((x) => { const n = { ...x }; delete n[b.slot.id]; return n; }); setView(b.center.id); }}
                        style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eMID, background: "none", border: "1px solid " + eLINE, borderRadius: 8, padding: "6px 11px", cursor: "pointer" }}><I.clock size={14} /> Reschedule</button>
                      {b.slot.cancelBefore ? (
                        <button onClick={() => setCancelSlot(b)} style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eDANGER, background: "none", border: "1px solid rgba(197,53,50,.3)", borderRadius: 8, padding: "6px 11px", cursor: "pointer" }}>Cancel</button>
                      ) : (
                        <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eMUT }}>Non-cancellable</span>
                      )}
                      <span style={{ color: eMUT, display: "flex" }}><I.chevR size={16} /></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* programs → centers */}
          {data.map((prog, pi) => (
            <div key={pi} style={{ marginBottom: 28 }}>
              <EdSectionLabel>{prog.program}</EdSectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, marginTop: 14 }}>
                {prog.centers.map((c) => {
                  const Ic = I[c.icon] || I.cal;
                  const bookedInCenter = c.slots.filter((s) => booked[s.id]).length;
                  const totalRemaining = c.slots.reduce((a, s) => a + s.remaining, 0);
                  const nextSlot = c.slots.find((s) => s.remaining > 0 && !booked[s.id]);
                  return (
                    <div key={c.id} onClick={() => setView(c.id)} style={{ display: "flex", flexDirection: "column", background: eCARD, border: "1px solid " + eLINE, borderRadius: 16, padding: "16px 18px", cursor: "pointer", boxShadow: "0 1px 3px rgba(0,15,71,.04)", transition: "box-shadow .15s, transform .15s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,15,71,.10)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,15,71,.04)"; e.currentTarget.style.transform = "none"; }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 13, marginBottom: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 11, background: "color-mix(in srgb, var(--accent) 8%, transparent)", color: eBLUE, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Ic size={19} /></div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: "var(--sans)", fontSize: 16, fontWeight: 700, color: eMID, marginBottom: 4 }}>{c.name}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                            <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, display: "inline-flex", alignItems: "center", gap: 4 }}><I.globe size={13} /> {c.location}</span>
                            <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, display: "inline-flex", alignItems: "center", gap: 4 }}><I.clock size={13} /> {c.duration}</span>
                          </div>
                        </div>
                        {bookedInCenter > 0 && <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eSUCCESS, background: "rgba(20,133,61,.10)", padding: "3px 9px", borderRadius: 6, display: "inline-flex", alignItems: "center", gap: 4, flexShrink: 0 }}><I.check size={11} /> {bookedInCenter} booked</span>}
                      </div>
                      <div className="ed-sched-foot" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, paddingTop: 12, borderTop: "1px solid " + eLINE }}>
                        <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: totalRemaining <= 5 ? eWARN : eMUT }}>{c.slots.length} slots · {totalRemaining} open{!bookedInCenter && nextSlot ? ` · next ${nextSlot.date}` : ""}</span>
                        <span className="ed-sched-view" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5, color: eMID, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600 }}>View slots <I.chevR size={15} /></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </React.Fragment>

      {modals}
    </div>
  );
}

window.EdGrowth = { EdDevelopment, EdInsights, EdScheduling, EdReportReader, EdReportCard, ReportCover, ReportPage };
