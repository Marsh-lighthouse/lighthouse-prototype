// ════════════════════════════════════════════════
//  DIRECTION A — "Beacon" (Editorial) · OPEN ASSESSMENT FLOW
//  Faithful re-implementation of V5 OpenAssessPage: a full
//  assessment-taking experience launched by open exercises like the
//  Self-Assessment Survey and Situational Judgement Test. Six question
//  types — MCQ, open text, rank order, matrix rating, file upload,
//  audio recording — with intro and completion steps. Content verbatim
//  from lighthouse-v5.jsx. Reuses tokens/helpers from app-ed-detail.jsx.
//  Exports window.EdAssess = { EdOpenAssess }.
// ════════════════════════════════════════════════

const { useState: oaUseState, useEffect: oaUseEffect, useRef: oaUseRef } = React;

// The open assessment shows only the ORIGINAL representative questions (oq1..oqN —
// MCQ, text, rank, matrix, file, audio), not the full type-sample bank that powers
// the Question Types gallery. Pages are renumbered contiguously after filtering.
function oaInitialQuestions() {
  const list = ((typeof window !== "undefined" && window.LH && LH.openAssessQuestions) || []).filter((q) => /^oq\d+$/.test(q.id) || q.id === "oq_video");
  const pages = [];
  list.forEach((q) => { if (pages.indexOf(q.page) < 0) pages.push(q.page); });
  pages.sort((a, b) => a - b);
  return list.map((q) => Object.assign({}, q, { page: pages.indexOf(q.page) + 1 }));
}

const oaTypeLabel = (t) => ({ mcq: "Multiple choice", text: "Open text", rank: "Rank order", matrix: "Matrix rating", file: "File upload", audio: "Audio recording", factor: "Multi-select", constantsum: "Constant sum", slider: "Slider", sidebyside: "Side by side", gap: "Gap analysis", skillfeedback: "Factor feedback", pickgrouprank: "Pick & group", graphicslider: "Graphic slider", hotspot: "Hot spot", captcha: "Verification", video: "Video response", imgchoice: "Image choice", imgmulti: "Image multi-select", checkgrid: "Grid select", numgrid: "Numeric grid", slidergrid: "Slider grid", bargrid: "Bar rating", stargrid: "Star rating", fillgauge: "Fill gauge", shapedraw: "Shape annotation", dropdown: "Dropdown", email: "Email", bipolar: "Side by side (bipolar)", dropdowngrid: "Dropdown grid", richtext: "Rich text", form: "Form", datetime: "Date & time", chat: "Chat", rankgrid: "Rank grid", ranknum: "Rank (number)", ranklist: "Rank (reorder list)", sbs: "Side by side", timing: "Timing", metainfo: "Meta info" }[t] || "Question");
const oaTypeIcon = { mcq: "checkCircle", text: "fileText", rank: "filter", matrix: "panel", file: "upload", audio: "mic" };
// Native <select> styled MDS: hides the browser arrow and draws our own chevron with right spacing.
const oaSelectStyle = {
  appearance: "none", WebkitAppearance: "none", MozAppearance: "none",
  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5 6 6.5 11 1.5' fill='none' stroke='%236F6D68' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: 34,
};

// validate one question's answer for the current value; returns an error string or null
function oaError(q, v) {
  const isEmpty = v === undefined || v === null || v === "" ||
    (Array.isArray(v) && v.length === 0) ||
    (typeof v === "object" && !Array.isArray(v) && Object.keys(v).length === 0);
  switch (q.type) {
    case "text": {
      const words = String(v || "").trim().split(/\s+/).filter(Boolean).length;
      if (words === 0) return "This question requires a response.";
      if (q.minWords && words < q.minWords) return "Please write at least " + q.minWords + " words to continue — you've written " + words + ".";
      return null;
    }
    case "mcq": case "imgchoice": case "hotspot": case "graphicslider": case "fillgauge":
      return (v === undefined || v === null) ? "Please select an answer before continuing." : null;
    case "factor": case "imgmulti":
      return isEmpty ? "Please select at least one option to continue." : null;
    case "rank":
      return (Array.isArray(v) && v.length === (q.items || []).length) ? null : "Please rank every option before continuing.";
    case "matrix": case "gap":
      return isEmpty ? "Please rate each row before continuing." : null;
    case "file":
      return isEmpty ? "Please upload a file before continuing." : null;
    case "audio": case "video":
      return isEmpty ? "Please record a response before continuing." : null;
    case "captcha":
      return v ? null : "Please confirm you're not a robot.";
    case "constantsum": {
      const sum = (q.choices || []).reduce((a, _, i) => a + (Number((v || {})[i]) || 0), 0);
      return sum !== q.target ? ("Your points must total " + q.target + " — currently " + sum + ".") : null;
    }
    case "pickgrouprank": {
      const placed = Object.values(v || {}).reduce((a, arr) => a + (Array.isArray(arr) ? arr.length : 0), 0);
      const totalItems = (q.items || []).length;
      if (placed === 0) return "Please drag the items into groups before continuing.";
      if (placed < totalItems) return "Please place every item into a group — " + placed + " of " + totalItems + " placed.";
      return null;
    }
    default:
      return isEmpty ? "Please complete this question before continuing." : null;
  }
}

function EdAssessIntro({ exercise, onExit, onBegin }) {
  const Q = oaInitialQuestions();
  const total = Q.length;
  const title = exercise ? exercise.name : "Work Style Preferences";
  return (
    <div style={{ maxWidth: "var(--content-max)", margin: "36px var(--fol-mx) 72px", padding: 0 }}>
      <EdEyebrow color={"var(--primary)"}>Open task</EdEyebrow>
      <h1 className="serif" style={{ fontSize: 40, color: eMID, lineHeight: 1.08, margin: "0 0 8px" }}>{title}</h1>
      <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.6, margin: "0 0 30px", maxWidth: 560 }}>This task includes {total} questions across different formats. Take your time — there are no time limits.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
        {[{ ic: "fileText", t: `${total} questions`, d: "MCQ, text, ranking, matrix, file upload, audio, video" },
        { ic: "clock", t: "~15 minutes", d: "No time limit — go at your own pace" },
        { ic: "checkCircle", t: "Auto-save", d: "Answers saved as you go — resume anytime" },
        { ic: "lock", t: "Confidential", d: "Responses visible only to authorized assessors" }].map((it, i) => {
          const Ic = I[it.ic];
          return (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 13, padding: "15px 17px", background: eCARD, borderRadius: 14, border: "1px solid " + eLINE }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: "color-mix(in srgb, var(--accent-2) 14%, transparent)", border: "1px solid color-mix(in srgb, var(--accent-2) 24%, transparent)", color: "var(--accent-2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Ic size={18} /></div>
              <div><div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eMID }}>{it.t}</div><div style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.5 }}>{it.d}</div></div>
            </div>);

        })}
      </div>
      <EdBtn primary onClick={onBegin}>Begin task <I.arrow size={16} /></EdBtn>
    </div>);

}

// ── Consent screen (shown after "Begin task", before the assessment) ──
function EdPrivacyNotice({ onClose }) {
  const P = ({ children }) => <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.65, margin: "0 0 15px" }}>{children}</p>;
  const H = ({ children }) => <h2 className="serif" style={{ fontSize: 21, color: eMID, lineHeight: 1.15, margin: "26px 0 12px" }}>{children}</h2>;
  const rows = [
    ["Biographical identifiers", "Name, date of birth, age, place of birth, gender."],
    ["Contact information", "Home address, telephone number, personal email address."],
    ["Assessment data", "Responses, scores, timing, and behavioural data from activities."],
    ["Technical data", "Device, browser, IP address, and proctoring session data."],
  ];
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,15,71,.45)", backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 18, width: "min(820px, 100%)", maxHeight: "88vh", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 24px 70px rgba(0,15,71,.3)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 22px", borderBottom: "1px solid " + eLINE, flexShrink: 0 }}>
          <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, letterSpacing: 0.4, color: eBLUE }}>MARSH · CONFIDENTIAL</span>
          <button onClick={onClose} aria-label="Close" style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid " + eLINE, background: "var(--card)", color: eMID, cursor: "pointer", fontSize: 21, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>
        <div style={{ overflowY: "auto", padding: "28px 32px" }}>
          <h1 className="serif" style={{ fontSize: 28, color: eMID, lineHeight: 1.1, margin: "0 0 8px" }}>Marsh Talent Enterprise Privacy Notice</h1>
          <div style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT, marginBottom: 22 }}>Effective Date: 15 September 2024</div>
          <P>This Privacy Notice describes how Marsh Talent Enterprise (“MTE”) collects, uses, shares, retains, transfers and otherwise processes information relating to identified or identifiable individuals (Personal Information), and the rights you may have regarding your Personal Information.</P>
          <P>MTE is a provider of behavioural science assessment solutions and, in some instances, acts on behalf of and under the instructions of clients, financial institutions, merchants, and other partners who act as data controllers.</P>
          <H>What is our relationship to you</H>
          <P>You are being asked by a third party to complete an assessment on MTE’s platform. This third party is MTE’s client and may be your employer, potential employer, or another related party. MTE acts as a Processor for our clients, who determine the processing of your Personal Information.</P>
          <H>What personal information do we collect</H>
          <P>Our client directs us to collect certain information on their behalf. Based on the needs and direction of our client, we may collect the following categories of Personal Information:</P>
          <div style={{ border: "1px solid " + eLINE, borderRadius: 12, overflow: "hidden", marginTop: 4 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", background: eCARD, borderBottom: "1px solid " + eLINE }}>
              <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eMID, padding: "12px 16px" }}>Category</div>
              <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eMID, padding: "12px 16px", borderLeft: "1px solid " + eLINE }}>Examples</div>
            </div>
            {rows.map((r, i) =>
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", borderBottom: i < rows.length - 1 ? "1px solid " + eLINE : "none" }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMID, padding: "12px 16px" }}>{r[0]}</div>
                <div style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, padding: "12px 16px", borderLeft: "1px solid " + eLINE }}>{r[1]}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EdConsent({ exercise, onAccept, onExit }) {
  const [agreed, setAgreed] = oaUseState(false);
  const [showPrivacy, setShowPrivacy] = oaUseState(false);
  return (
    <div style={{ maxWidth: "var(--content-max)", margin: "36px var(--fol-mx) 72px", padding: 0 }}>
      <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, letterSpacing: 0.4, color: eBLUE, marginBottom: 12 }}>MARSH · CONFIDENTIAL</div>
      <h1 className="serif" style={{ fontSize: 40, color: eMID, lineHeight: 1.08, margin: "0 0 8px", maxWidth: 640 }}>Consent to Process and Transfer Personal Information</h1>
      <div style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT, marginBottom: 24 }}>Version 4.0 · Updated on May 29, 2025</div>
      <div style={{ background: eCARD, border: "1px solid " + eLINE, borderRadius: 16, padding: "30px 32px" }}>
        <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.65, margin: "0 0 16px" }}>In order to ensure your meaningful participation in this activity, some of your personal information will be collected and processed. The activity is being administered by Marsh Talent Enterprise on behalf of and at the instruction of our client, who determines the purpose for processing your personal information and how we may use it.</p>
        <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.65, margin: "0 0 16px" }}>Please note that your information may be transferred across national borders as part of the Services provided to our clients. In such an instance, we act as the Data Importer and our client acts as the Data Exporter. Any international transfer of personal information will be conducted in accordance with applicable data protection laws.</p>
        <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.65, margin: "0 0 24px" }}>For more information about how we process your personal information, please <span onClick={() => setShowPrivacy(true)} style={{ color: eBLUE, fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>read our global privacy notice</span>.</p>
        <label htmlFor="ed-consent-box" style={{ display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer", background: eCREAM, border: "1px solid " + eLINE, borderRadius: 12, padding: "16px 18px", marginBottom: 24 }}>
          <input id="ed-consent-box" type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ position: "absolute", opacity: 0, width: 1, height: 1 }} />
          <span style={{ width: 22, height: 22, flexShrink: 0, borderRadius: 2, border: "1.5px solid " + (agreed ? "var(--primary)" : "var(--control-line)"), background: agreed ? "var(--primary)" : "var(--card)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1, transition: "background .12s, border-color .12s" }}>{agreed && <I.check size={14} />}</span>
          <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eMID, lineHeight: 1.5 }}>By checking this box, you agree that you have read our privacy notice and consent to the collection and processing of your personal information as described therein, including the international transfer of your personal information.</span>
        </label>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button onClick={agreed ? onAccept : undefined} disabled={!agreed} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: agreed ? eGOLD : "var(--track)", color: agreed ? "var(--action-text)" : eMUT, border: "none", borderRadius: 10, padding: "13px 26px", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, cursor: agreed ? "pointer" : "not-allowed", transition: "background .12s" }}>Accept &amp; continue <I.arrow size={16} /></button>
        </div>
      </div>
      {showPrivacy && <EdPrivacyNotice onClose={() => setShowPrivacy(false)} />}
    </div>
  );
}

// compact live countdown pill for the assessment top bar
function OaCountdown({ end, label, danger, compact }) {
  const [now, setNow] = oaUseState(Date.now());
  oaUseEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const diff = Math.max(0, end - now);
  const d = Math.floor(diff / 86400000), h = Math.floor(diff % 86400000 / 3600000), m = Math.floor(diff % 3600000 / 60000), s = Math.floor(diff % 60000 / 1000);
  const txt = d > 0 ? `${d}d ${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m` : `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  const low = danger && diff < 120000; // under 2 min on the task timer
  const tone = low ? eDANGER : danger ? "#CB7E03" : eBLUE;
  const bg = low ? "rgba(197,53,50,.08)" : danger ? "rgba(203,126,3,.08)" : "color-mix(in srgb, var(--accent) 6%, transparent)";
  const bd = low ? "rgba(197,53,50,.32)" : danger ? "rgba(203,126,3,.28)" : "color-mix(in srgb, var(--accent) 18%, transparent)";
  if (compact) return (
    <div className="oa-cd" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 9px", borderRadius: 7, background: bg, border: "1px solid " + bd, whiteSpace: "nowrap", flexShrink: 0 }}>
      <span style={{ color: tone, display: "flex" }}><I.clock size={12} /></span>
      <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eMUT }}>{label}</span>
      <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: tone, fontVariantNumeric: "tabular-nums" }}>{txt}</span>
    </div>
  );
  return (
    <div className="oa-cd" style={{ display: "flex", alignItems: "center", gap: 7, padding: "5px 11px", borderRadius: 8, background: bg, border: "1px solid " + bd, whiteSpace: "nowrap", flexShrink: 0 }}>
      <span style={{ color: tone, display: "flex" }}><I.clock size={14} /></span>
      <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.05 }}>
        <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eMUT }}>{label}</span>
        <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: tone, fontVariantNumeric: "tabular-nums" }}>{txt}</span>
      </span>
    </div>
  );
}

// Video / Audio response capture — reuses the SAME real camera/mic capture as the
// System Check (ScVideoLive / ScAudioLive, embed mode). Real getUserMedia live feed,
// device pickers, browser permission prompt, Record, and playback — just without the
// System Check stepper/header chrome. `onCapture` fires when the candidate accepts the
// recording ("Use this recording"), which stores the answer; a truthy value shows the
// recorded-confirmation card with a Re-record option.
function OaMediaResponse({ audioOnly, maxDuration, value, onChange }) {
  const dur = maxDuration || 30;
  const mm = (n) => String(Math.floor(n / 60)).padStart(2, "0") + ":" + String(n % 60).padStart(2, "0");
  const R = "var(--lh-radius, 2px)";

  if (value) {
    return (
      <div style={{ background: eCARD, border: "1px solid " + eLINE, borderRadius: R, padding: 20, textAlign: "center" }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--success-fill)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}><I.check size={24} /></div>
        <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eMID }}>{audioOnly ? "Audio" : "Video"} response recorded</div>
        <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: eMUT, marginTop: 4 }}>Your response has been captured.</div>
        <button onClick={() => onChange(undefined)} style={{ marginTop: 14, display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 18px", borderRadius: R, border: "1px solid rgba(197,53,50,.35)", background: "none", color: eDANGER, cursor: "pointer", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 600 }}><I.sync size={14} /> Re-record</button>
      </div>
    );
  }
  const Live = audioOnly ? ScAudioLive : ScVideoLive;
  return <Live embed onCapture={() => onChange(true)} setResult={() => {}} onBack={() => {}} onNext={() => {}} />;
}

// single question rendered as a stacked card (question on top, options below) — used by the paged layout
function OaQuestionCard({ q, number, value, onChange, error, hidePrompt, narrow }) {
  const [dragIdx, setDragIdx] = oaUseState(null);
  const [rankDrag, setRankDrag] = oaUseState(null); // { item, from:"pool"|"rank", idx? } for the rank question
  const [recording, setRecording] = oaUseState(false);
  const [recTime, setRecTime] = oaUseState(0);
  const [factorOpen, setFactorOpen] = oaUseState(false);
  // Close the factor dropdown on an outside click (or Escape) — picking options keeps it open.
  const factorRef = oaUseRef(null);
  oaUseEffect(() => {
    if (!factorOpen) return;
    const onDoc = (e) => { if (factorRef.current && !factorRef.current.contains(e.target)) setFactorOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setFactorOpen(false); };
    document.addEventListener("mousedown", onDoc); document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [factorOpen]);
  // Single-select Dropdown question — same outside-click/Escape close behaviour as the factor field.
  const [dropOpen, setDropOpen] = oaUseState(false);
  const dropRef = oaUseRef(null);
  oaUseEffect(() => {
    if (!dropOpen) return;
    const onDoc = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setDropOpen(false); };
    document.addEventListener("mousedown", onDoc); document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [dropOpen]);
  // Email question — which recipient field (to|cc|bcc) is open as a searchable picker, and its query.
  const [emailField, setEmailField] = oaUseState(null);
  const [emailQuery, setEmailQuery] = oaUseState("");
  const emailRef = oaUseRef(null);
  oaUseEffect(() => {
    if (!emailField) return;
    const onDoc = (e) => { if (emailRef.current && !emailRef.current.contains(e.target)) setEmailField(null); };
    const onKey = (e) => { if (e.key === "Escape") setEmailField(null); };
    document.addEventListener("mousedown", onDoc); document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [emailField]);
  // Dropdown-grid question — which row's dropdown is open (one at a time).
  const [gridDropRow, setGridDropRow] = oaUseState(null);
  const gridDropRef = oaUseRef(null);
  oaUseEffect(() => {
    if (gridDropRow === null) return;
    const onDoc = (e) => { if (gridDropRef.current && !gridDropRef.current.contains(e.target)) setGridDropRow(null); };
    const onKey = (e) => { if (e.key === "Escape") setGridDropRow(null); };
    document.addEventListener("mousedown", onDoc); document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [gridDropRow]);
  // Draft text for the Chat answer type.
  const [chatDraft, setChatDraft] = oaUseState("");
  // Selected item in the listbox (up/down reorder) rank variant.
  const [rankListSel, setRankListSel] = oaUseState(null);
  // Selected item for the touch (tap-to-place) variant of the pick-&-group question.
  const [pickSel, setPickSel] = oaUseState(null);
  // compact = mobile/iPad device-preview → use the stacked-card layouts; desktop keeps the original grids
  const [compact, setCompact] = oaUseState(() => ["mobile", "ipad"].includes(document.documentElement.getAttribute("data-device")));
  oaUseEffect(() => {
    const sync = () => setCompact(["mobile", "ipad"].includes(document.documentElement.getAttribute("data-device")));
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-device"] });
    return () => obs.disconnect();
  }, []);
  oaUseEffect(() => { if (!recording) return; const t = setInterval(() => setRecTime((p) => p + 1), 1000); return () => clearInterval(t); }, [recording]);
  const items = q.type === "rank" ? (Array.isArray(value) ? value : []) : null;
  const a = q.type === "matrix" ? (value || {}) : null;
  const lbl = { mcq: q.multi ? "Select all that apply" : "Select one", text: "Your response", rank: "Tap to rank \u00b7 Drag to reorder \u00b7 Tap \u00d7 to return to options", matrix: "Rate each", file: "Upload file", audio: "Audio response", factor: "Factor selection", constantsum: "Distribute points", slider: "Set each level", sidebyside: "Choose per context", sbs: "Choose per context", gap: "Rate each area", skillfeedback: "Map factor & add feedback", pickgrouprank: "Drag into groups", graphicslider: "Set your level", hotspot: "Click a region", captcha: "", timing: "", metainfo: "", video: "Record your answer", imgchoice: "Select an image", imgmulti: "Select all that apply", checkgrid: "Check all that apply per row", numgrid: "Enter a value per scale point", slidergrid: "Drag each slider", bargrid: "Click the track to set each bar", stargrid: "Tap to rate each row", fillgauge: "Drag the slider to fill the gauge", shapedraw: "Draw and edit shapes", richtext: "Your response", form: "Complete the form", datetime: q.dateOnly ? "Select a date" : "Select date & time", chat: "", rankgrid: "Rank each item", ranknum: "Type a rank for each option", ranklist: "Select an item, then reorder" }[q.type];
  return (
    <div style={{ background: "var(--card)", border: "1px solid " + (error ? eDANGER : eLINE), borderRadius: 16, padding: "26px 28px", transition: "border-color .15s" }}>
      {!hidePrompt && <p className="serif" style={{ fontSize: 18, color: eMID, lineHeight: 1.3, margin: "0 0 18px" }}>{q.prompt}</p>}
      {lbl && <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eMUT, letterSpacing: 0.2, marginBottom: 10 }}>{lbl}</div>}

      {q.type === "mcq" && (() => {
        // `layout: "grid"` lays the options out horizontally, two per row. iPad/desktop keep two
        // columns; only a phone (mobile) collapses to a single column.
        // `multi: true` = choose several (checkboxes, value = array of indices) instead of one (radio).
        const grid = q.layout === "grid" && document.documentElement.getAttribute("data-device") !== "mobile";
        const multi = q.multi;
        const arr = Array.isArray(value) ? value : [];
        const isSel = (oi) => multi ? arr.includes(oi) : value === oi;
        const toggle = (oi) => multi ? onChange(arr.includes(oi) ? arr.filter((x) => x !== oi) : arr.concat(oi)) : onChange(oi);
        return (
          <div style={grid ? { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 } : { display: "flex", flexDirection: "column", gap: 10 }}>
            {q.options.map((opt, oi) => {
              const sel = isSel(oi);
              return (
                <button key={oi} onClick={() => toggle(oi)} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", borderRadius: 12, border: "1.5px solid " + (sel ? eBLUE : eLINE), background: sel ? "color-mix(in srgb, var(--accent) 5%, transparent)" : eCARD, cursor: "pointer", textAlign: "left", width: "100%", transition: "all .15s" }}>
                  <div style={{ width: 20, height: 20, borderRadius: multi ? 5 : "50%", border: "2px solid " + (sel ? eBLUE : "var(--control-line)"), background: multi && sel ? eBLUE : "transparent", color: "var(--on-accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{multi ? (sel && <I.check size={13} />) : (sel && <div style={{ width: 10, height: 10, borderRadius: "50%", background: eBLUE }} />)}</div>
                  <span style={{ fontFamily: "var(--sans)", fontSize: 15, color: sel ? eMID : eINK, fontWeight: 400, lineHeight: 1.45 }}>{opt}</span>
                </button>);
            })}
          </div>);
      })()}

      {q.type === "text" && ((q.singleLine || q.password) ? (
        // single-line variants: plain single line, or a masked password field
        <div>
          <input type={q.password ? "password" : "text"} value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={q.placeholder} maxLength={q.maxChars || (q.password ? 64 : 120)}
            onFocus={(e) => { e.currentTarget.style.borderColor = eBLUE; }} onBlur={(e) => { e.currentTarget.style.borderColor = "var(--field-line)"; }}
            style={{ width: "100%", height: 46, padding: "0 16px", borderRadius: 12, border: "1px solid var(--field-line)", background: eCARD, color: eINK, fontFamily: "var(--sans)", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
          {!q.password && <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 7 }}>
            <span style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT }}>{(value || "").length} / {q.maxChars || 120}</span>
          </div>}
        </div>
      ) : (
        // multi-line (default) or a taller essay box
        <div>
          <textarea value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={q.placeholder}
            style={{ width: "100%", minHeight: q.essay ? 280 : 150, padding: "14px 16px", borderRadius: 12, border: "1px solid " + eLINE, background: eCARD, color: eINK, fontFamily: "var(--sans)", fontSize: 15, lineHeight: 1.6, resize: "vertical", outline: "none", boxSizing: "border-box" }} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 7 }}>
            <span style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT }}>{(value || "").split(/\s+/).filter(Boolean).length} words</span>
            {(q.minWords || q.maxWords) && <span style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT }}>{q.minWords}–{q.maxWords}</span>}
          </div>
        </div>
      ))}

      {/* RICH TEXT — formatting toolbar + editable area (Text Entry family) */}
      {q.type === "richtext" && (() => {
        const v = value && typeof value === "object" ? value : { html: "", text: "" };
        const cmd = (c) => { try { document.execCommand(c, false, null); } catch (e) {} };
        const tbtn = (node, c, title) => <button key={title} title={title} onMouseDown={(e) => { e.preventDefault(); cmd(c); }} style={{ minWidth: 30, height: 30, padding: "0 6px", display: "inline-flex", alignItems: "center", justifyContent: "center", border: "1px solid " + eLINE, borderRadius: 6, background: "#fff", color: eINK, cursor: "pointer", fontFamily: "var(--sans)", fontSize: 14 }}>{node}</button>;
        const words = (v.text || "").split(/\s+/).filter(Boolean).length;
        return (
          <div style={{ border: "1px solid var(--field-line)", borderRadius: 12, overflow: "hidden", background: eCARD }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: 10, borderBottom: "1px solid " + eLINE, background: "color-mix(in srgb, var(--accent) 2%, #fff)" }}>
              {tbtn(<b>B</b>, "bold", "Bold")}
              {tbtn(<i>I</i>, "italic", "Italic")}
              {tbtn(<u>U</u>, "underline", "Underline")}
              {tbtn(<s>S</s>, "strikeThrough", "Strikethrough")}
              {tbtn(<span>x<sub>2</sub></span>, "subscript", "Subscript")}
              {tbtn(<span>x<sup>2</sup></span>, "superscript", "Superscript")}
              {tbtn(<span>&#8226;&#8801;</span>, "insertUnorderedList", "Bulleted list")}
              {tbtn(<span>1.&#8801;</span>, "insertOrderedList", "Numbered list")}
            </div>
            <div contentEditable suppressContentEditableWarning
              onInput={(e) => onChange({ html: e.currentTarget.innerHTML, text: e.currentTarget.innerText })}
              data-ph={q.placeholder || "Type something"}
              style={{ minHeight: 140, padding: "14px 16px", outline: "none", fontFamily: "var(--sans)", fontSize: 15, lineHeight: 1.6, color: eINK }} />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 18, padding: "8px 16px", borderTop: "1px solid " + eLINE }}>
              <span style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT }}>Words : {words}</span>
              <span style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT }}>Characters : {(v.text || "").length}</span>
            </div>
          </div>
        );
      })()}

      {/* FORM — several labelled fields, each with a field-type selector (Text Entry family) */}
      {q.type === "form" && (() => {
        const v = value || {};
        const set = (i, val) => onChange({ ...v, [i]: val });
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {q.fields.map((f, i) => (
              <div key={i} style={{ display: compact ? "block" : "grid", gridTemplateColumns: compact ? undefined : "minmax(140px,1fr) 120px minmax(160px,1.4fr)", columnGap: 12, alignItems: "center", rowGap: 6 }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eINK, marginBottom: compact ? 6 : 0 }}>{f.label}</div>
                <select defaultValue={f.type || "Input"} style={{ ...oaSelectStyle, height: 44, padding: "0 34px 0 12px", border: "1px solid var(--field-line)", borderRadius: 10, backgroundColor: "#fff", backgroundImage: oaSelectStyle.backgroundImage, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", color: eINK, fontFamily: "var(--sans)", fontSize: 15, outline: "none", marginBottom: compact ? 6 : 0, width: compact ? "100%" : "auto" }}>
                  {["Input", "Email", "Number", "Date"].map((o) => <option key={o}>{o}</option>)}
                </select>
                <input value={v[i] || ""} onChange={(e) => set(i, e.target.value)} placeholder={f.placeholder || "Type here…"}
                  onFocus={(e) => e.currentTarget.style.borderColor = eBLUE} onBlur={(e) => e.currentTarget.style.borderColor = "var(--field-line)"}
                  style={{ width: "100%", height: 44, padding: "0 14px", border: "1px solid var(--field-line)", borderRadius: 10, background: eCARD, color: eINK, fontFamily: "var(--sans)", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}
          </div>
        );
      })()}

      {/* DATE & TIME — date + time pickers with a format note (Text Entry family) */}
      {q.type === "datetime" && (() => {
        const v = value || {};
        const set = (k, val) => onChange({ ...v, [k]: val });
        const fld = { height: 46, padding: "0 14px", border: "1px solid var(--field-line)", borderRadius: 12, background: eCARD, color: eINK, fontFamily: "var(--sans)", fontSize: 15, outline: "none", boxSizing: "border-box" };
        return (
          <div>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <label style={{ display: "flex", flexDirection: "column", gap: 6, flex: "1 1 180px" }}>
                <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eINK }}>Date</span>
                <input type="date" value={v.date || ""} onChange={(e) => set("date", e.target.value)} style={{ ...fld, width: "100%" }} />
              </label>
              {!q.dateOnly && <label style={{ display: "flex", flexDirection: "column", gap: 6, flex: "1 1 140px" }}>
                <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eINK }}>Time</span>
                <input type="time" value={v.time || ""} onChange={(e) => set("time", e.target.value)} style={{ ...fld, width: "100%" }} />
              </label>}
            </div>
            <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: eMUT, marginTop: 8 }}>Format: DD-MM-YYYY{q.dateOnly ? "" : " · 24-hour time"}</div>
          </div>
        );
      })()}

      {/* CHAT — conversational answer (Text Entry family): grey circle avatar + name, a
         separator, message rows with a grip handle, and a borderless composer bar
         (input + inline dropdown + green circular send). */}
      {q.type === "chat" && (() => {
        const userMsgs = Array.isArray(value) ? value : [];
        const all = (q.botIntro ? [{ from: "bot", text: q.botIntro }] : []).concat(userMsgs);
        const send = () => { const t = (chatDraft || "").trim(); if (!t) return; onChange(userMsgs.concat([{ from: "user", text: t }])); setChatDraft(""); };
        const green = "var(--primary)"; // brand primary blue for the candidate's bubbles + send
        const circle = (size, node) => <span style={{ width: size, height: size, borderRadius: "50%", background: "color-mix(in srgb, var(--ink) 8%, #fff)", color: eMUT, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{node}</span>;
        return (
          <div style={{ border: "1px solid " + eLINE, borderRadius: 14, overflow: "hidden", background: eCARD }}>
            {q.subtitle && <div style={{ padding: "16px 18px 0", fontFamily: "var(--sans)", fontSize: 15, color: eMUT, lineHeight: 1.5 }}>{q.subtitle}</div>}
            {/* who you're chatting with */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px" }}>
              {circle(52, <I.user size={24} />)}
              <div style={{ fontFamily: "var(--sans)", fontSize: 18, fontWeight: 700, color: eINK }}>{q.botName || "Rupert Smith"}</div>
            </div>
            <div style={{ borderTop: "1px solid " + eLINE }} />
            {/* conversation */}
            <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 16, minHeight: 150 }}>
              {all.map((m, i) => {
                const mine = m.from === "user";
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ color: eMUT, display: "flex", flexShrink: 0 }} aria-hidden="true"><I.menu size={18} /></span>
                    <div style={{ marginLeft: mine ? "auto" : 0, maxWidth: "75%", background: mine ? green : "color-mix(in srgb, var(--ink) 6%, #fff)", color: mine ? "#fff" : eINK, borderRadius: mine ? "14px 14px 4px 14px" : "14px 14px 14px 4px", padding: "12px 16px", fontFamily: "var(--sans)", fontSize: 15, lineHeight: 1.45 }}>{m.text}</div>
                  </div>
                );
              })}
            </div>
            {/* composer bar — borderless input, inline dropdown, green circular send */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderTop: "1px solid " + eLINE, background: "color-mix(in srgb, var(--ink) 3%, #fff)" }}>
              <input value={chatDraft} onChange={(e) => setChatDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); send(); } }} placeholder="Write your Message…"
                style={{ flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent", fontFamily: "var(--sans)", fontSize: 15, color: eINK }} />
              <select defaultValue="Mine" style={{ ...oaSelectStyle, height: 38, padding: "0 34px 0 12px", border: "1px solid var(--field-line)", borderRadius: 8, backgroundColor: "#fff", backgroundImage: oaSelectStyle.backgroundImage, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", color: eINK, fontFamily: "var(--sans)", fontSize: 15, outline: "none", flexShrink: 0 }}>
                {["Mine", "Shared with team"].map((o) => <option key={o}>{o}</option>)}
              </select>
              <button onClick={send} aria-label="Send" style={{ width: 40, height: 40, flexShrink: 0, borderRadius: "50%", border: "none", background: green, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><I.send size={16} /></button>
            </div>
          </div>
        );
      })()}

      {/* RANK GRID — assign a rank to each item via a radio grid (items × rank columns) */}
      {q.type === "rankgrid" && (() => {
        const a2 = value || {};
        const gcols = `minmax(140px,1fr) repeat(${q.cols.length}, 1fr)`;
        return (
          <div className="oa-matrix">
            <div style={{ display: "grid", gridTemplateColumns: gcols, columnGap: 10, marginBottom: 8, padding: "0 15px", alignItems: "end" }}>
              <div />
              {q.cols.map((c, ci) => <div key={ci} style={{ textAlign: "center", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eINK }}>{c}</div>)}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {q.items.map((it, ri) => (
                <div key={ri} style={{ display: "grid", gridTemplateColumns: gcols, columnGap: 10, alignItems: "center", padding: "12px 15px", borderRadius: 12, background: eCARD, border: "1px solid " + (a2[ri] !== undefined ? eBLUE : eLINE), transition: "border-color .15s" }}>
                  <div style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.35, paddingRight: 8 }}>{it}</div>
                  {q.cols.map((c, ci) => (
                    <div key={ci} style={{ display: "flex", justifyContent: "center" }}>
                      <button onClick={() => onChange({ ...a2, [ri]: ci })} aria-label={it + " — " + c} style={{ width: 24, height: 24, borderRadius: "50%", border: "2px solid " + (a2[ri] === ci ? eBLUE : "var(--control-line)"), background: a2[ri] === ci ? eBLUE : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s" }}>{a2[ri] === ci && <div style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--card)" }} />}</button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* RANK (number entry) — type a rank number next to each option */}
      {q.type === "ranknum" && (() => {
        const v = value || {};
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.items.map((it, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <input type="number" inputMode="numeric" min={1} max={q.items.length} value={v[i] || ""} onChange={(e) => onChange({ ...v, [i]: e.target.value })}
                  onFocus={(e) => e.currentTarget.style.borderColor = eBLUE} onBlur={(e) => e.currentTarget.style.borderColor = "var(--field-line)"}
                  style={{ width: 48, height: 44, flexShrink: 0, textAlign: "center", border: "1px solid var(--field-line)", borderRadius: 10, background: eCARD, color: eINK, fontFamily: "var(--sans)", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
                <span style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.4 }}>{it}</span>
              </div>
            ))}
          </div>
        );
      })()}

      {/* RANK (listbox) — select an item, then reorder it with the up / down arrows */}
      {q.type === "ranklist" && (() => {
        const order = (Array.isArray(value) && value.length) ? value : q.items;
        const move = (dir) => { if (rankListSel == null) return; const i = order.indexOf(rankListSel); const j = i + dir; if (i < 0 || j < 0 || j >= order.length) return; const n = order.slice(); const t = n[i]; n[i] = n[j]; n[j] = t; onChange(n); };
        const arrowBtn = (dir, label) => <button onClick={() => move(dir)} aria-label={label} style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, border: "none", background: "var(--primary)", color: "var(--on-accent)", cursor: "pointer" }}><I.chevD size={18} style={{ transform: dir < 0 ? "rotate(180deg)" : "none" }} /></button>;
        return (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0, border: "1px solid var(--field-line)", borderRadius: 12, overflow: "hidden", background: eCARD }}>
              {order.map((it) => {
                const sel = it === rankListSel;
                return (
                  <div key={it} onClick={() => setRankListSel(it)} style={{ padding: "12px 16px", fontFamily: "var(--sans)", fontSize: 15, color: eINK, cursor: "pointer", background: sel ? "color-mix(in srgb, var(--accent) 10%, transparent)" : "transparent", borderBottom: "1px solid " + eLINE }}>{it}</div>
                );
              })}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
              {arrowBtn(-1, "Move up")}
              {arrowBtn(1, "Move down")}
            </div>
          </div>
        );
      })()}

      {/* DROPDOWN — single select, MDS text-field border (--field-line) */}
      {q.type === "dropdown" && (() => {
        const chosen = typeof value === "number" ? q.options[value] : null;
        return (
          <div ref={dropRef} style={{ position: "relative", maxWidth: 440 }}>
            <div onClick={() => setDropOpen((v) => !v)} role="button" tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setDropOpen((v) => !v); } }}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "12px 14px", border: "1px solid " + (dropOpen ? eBLUE : "var(--field-line)"), borderRadius: 12, background: eCARD, minHeight: 46, cursor: "pointer" }}>
              <span style={{ fontFamily: "var(--sans)", fontSize: 15, color: chosen ? eINK : eMUT }}>{chosen || q.placeholder || "Select an option"}</span>
              <span style={{ color: eMUT, display: "flex", transform: dropOpen ? "rotate(180deg)" : "", transition: "transform .15s", flexShrink: 0 }}><I.chevD size={16} /></span>
            </div>
            {dropOpen &&
            <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 20, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 12, boxShadow: "0 12px 32px rgba(0,15,71,.14)", padding: 6, maxHeight: 260, overflowY: "auto" }}>
              {q.options.map((opt, oi) => {
                const sel = value === oi;
                return (
                  <button key={oi} onClick={() => { onChange(oi); setDropOpen(false); }}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, width: "100%", textAlign: "left", padding: "10px 12px", borderRadius: 8, border: "none", background: sel ? "color-mix(in srgb, var(--accent) 6%, transparent)" : "transparent", cursor: "pointer", fontFamily: "var(--sans)", fontSize: 15, color: eINK, fontWeight: sel ? 500 : 400 }}
                    onMouseEnter={(e) => { if (!sel) e.currentTarget.style.background = "color-mix(in srgb, var(--accent) 5%, transparent)"; }} onMouseLeave={(e) => { if (!sel) e.currentTarget.style.background = "transparent"; }}>
                    {opt}{sel && <span style={{ color: eBLUE, display: "flex", flexShrink: 0 }}><I.check size={15} /></span>}
                  </button>);
              })}
            </div>
            }
          </div>);
      })()}

      {/* EMAIL COMPOSITION — stacked, individually-labelled fields, each in the MDS text-field style.
         To / Cc / Bcc are searchable recipient pickers (click → search input + contact list). */}
      {q.type === "email" && (() => {
        const v = value && typeof value === "object" ? value : {};
        const set = (k, val) => onChange({ ...v, [k]: val });
        const CONTACTS = q.contacts || ["Rupert Smith", "Amelia Chen", "David Okafor", "Priya Nair", "Marcus Bell", "Sofia Rossi"];
        const words = (v.body || "").split(/\s+/).filter(Boolean).length;
        const labelStyle = { display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eINK, margin: "0 0 7px" };
        const linkBtn = { background: "none", border: "none", cursor: "pointer", color: eBLUE, fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, padding: "2px 8px", borderRadius: 6 };
        const linkOn = { background: "color-mix(in srgb, var(--accent) 10%, transparent)", fontWeight: 600 };
        // The Cc / Bcc links stay put permanently and toggle their field: add on click, remove on click again
        // (removing also clears any recipient chosen in that field).
        const toggleField = (k) => {
          const shownKey = k + "Shown";
          if (v[shownKey]) { onChange({ ...v, [shownKey]: false, [k]: "" }); if (emailField === k) setEmailField(null); }
          else set(shownKey, true);
        };
        const fieldShell = (focused) => ({ display: "flex", alignItems: "center", gap: 8, padding: "0 14px", height: 46, border: "1px solid " + (focused ? eBLUE : "var(--field-line)"), borderRadius: 12, background: eCARD, boxSizing: "border-box" });
        const bareInput = { flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: "var(--sans)", fontSize: 15, color: eINK, height: "100%" };
        // one searchable recipient field (To / Cc / Bcc)
        const recip = (key, label, withToggle) => {
          const open = emailField === key;
          const selected = key === "to" ? (v.to !== undefined ? v.to : (q.to || "")) : (v[key] || "");
          const matches = CONTACTS.filter((c) => c.toLowerCase().includes(emailQuery.toLowerCase()));
          return (
            <div style={{ marginBottom: 16 }}>
              <div style={labelStyle}>
                <span>{label}</span>
                {withToggle &&
                  <span style={{ display: "inline-flex", gap: 8 }}>
                    <button onClick={() => toggleField("cc")} style={{ ...linkBtn, ...(v.ccShown ? linkOn : null) }}>Cc</button>
                    <button onClick={() => toggleField("bcc")} style={{ ...linkBtn, ...(v.bccShown ? linkOn : null) }}>Bcc</button>
                  </span>}
              </div>
              <div style={{ position: "relative" }}>
                {open ? (
                  <div style={fieldShell(true)}>
                    <input autoFocus value={emailQuery} onChange={(e) => setEmailQuery(e.target.value)} placeholder="Search for a person…" style={bareInput} />
                    <span style={{ color: eMUT, display: "flex", flexShrink: 0 }}><I.searchGlass size={16} /></span>
                  </div>
                ) : (
                  <div onClick={() => { setEmailField(key); setEmailQuery(""); }} style={{ ...fieldShell(false), cursor: "pointer" }}>
                    {selected
                      ? <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "color-mix(in srgb, var(--accent) 7%, transparent)", color: eINK, border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)", borderRadius: 7, padding: "3px 9px", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 500 }}>{selected}<span onClick={(e) => { e.stopPropagation(); set(key, ""); }} style={{ cursor: "pointer", color: eMUT, fontSize: 15, lineHeight: 1 }}>×</span></span>
                      : <span style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT }}>Search for a person…</span>}
                    <span style={{ marginLeft: "auto", color: eMUT, display: "flex", flexShrink: 0, transition: "transform .15s" }}><I.chevD size={16} /></span>
                  </div>
                )}
                {open &&
                <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 20, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 12, boxShadow: "0 12px 32px rgba(0,15,71,.14)", padding: 6, maxHeight: 220, overflowY: "auto" }}>
                  {matches.length === 0 && <div style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT, padding: "10px 12px" }}>No people match “{emailQuery}”.</div>}
                  {matches.map((c) => {
                    const sel = selected === c;
                    return (
                      <button key={c} onClick={() => { set(key, c); setEmailField(null); }}
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, width: "100%", textAlign: "left", padding: "10px 12px", borderRadius: 8, border: "none", background: sel ? "color-mix(in srgb, var(--accent) 6%, transparent)" : "transparent", cursor: "pointer", fontFamily: "var(--sans)", fontSize: 15, color: eINK, fontWeight: sel ? 500 : 400 }}
                        onMouseEnter={(e) => { if (!sel) e.currentTarget.style.background = "color-mix(in srgb, var(--accent) 5%, transparent)"; }} onMouseLeave={(e) => { if (!sel) e.currentTarget.style.background = "transparent"; }}>
                        {c}{sel && <span style={{ color: eBLUE, display: "flex", flexShrink: 0 }}><I.check size={15} /></span>}
                      </button>);
                  })}
                </div>}
              </div>
            </div>);
        };
        const focusBlue = (e) => { e.currentTarget.style.borderColor = eBLUE; };
        const blurLine = (e) => { e.currentTarget.style.borderColor = "var(--field-line)"; };
        return (
          <div ref={emailRef}>
            {recip("to", "To", true)}
            {v.ccShown && recip("cc", "Cc")}
            {v.bccShown && recip("bcc", "Bcc")}
            <div style={{ marginBottom: 16 }}>
              <div style={labelStyle}><span>Subject</span></div>
              <input value={v.subject || ""} onChange={(e) => set("subject", e.target.value)} onFocus={(e) => { setEmailField(null); focusBlue(e); }} onBlur={blurLine} placeholder="Add a subject"
                style={{ width: "100%", height: 46, padding: "0 14px", border: "1px solid var(--field-line)", borderRadius: 12, background: eCARD, color: eINK, fontFamily: "var(--sans)", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <div style={labelStyle}><span>Your Message</span></div>
              <textarea value={v.body || ""} onChange={(e) => set("body", e.target.value)} onFocus={(e) => { setEmailField(null); focusBlue(e); }} onBlur={blurLine} placeholder={q.placeholder || "Write your message here…"}
                style={{ width: "100%", minHeight: 160, padding: "12px 14px", border: "1px solid var(--field-line)", borderRadius: 12, background: eCARD, color: eINK, fontFamily: "var(--sans)", fontSize: 15, lineHeight: 1.6, resize: "vertical", outline: "none", boxSizing: "border-box", display: "block" }} />
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 7 }}>
                <span style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT }}>{words}{q.maxWords ? " / " + q.maxWords : ""} words</span>
              </div>
            </div>
          </div>);
      })()}

      {q.type === "rank" && (() => {
        const ranked = items; // ordered subset the user has placed
        const pool = q.items.filter((it) => !ranked.includes(it));
        const draggingPool = rankDrag && rankDrag.from === "pool";
        const reorder = (from, to) => { if (from == null || to == null || from === to) return; const n = [...ranked]; const [m] = n.splice(from, 1); n.splice(to, 0, m); onChange(n); };
        const addItem = (it) => { if (!ranked.includes(it)) onChange([...ranked, it]); };
        const removeItem = (it) => onChange(ranked.filter((x) => x !== it));
        const grip = (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 3px)", gap: 3 }} aria-hidden="true">
            {Array.from({ length: 6 }).map((_, k) => <span key={k} style={{ width: 3, height: 3, borderRadius: 2, background: "currentColor", display: "block" }} />)}
          </div>
        );
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {/* YOUR RANKING — drop zone */}
            <div>
              <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eMUT, letterSpacing: 0.2, marginBottom: 10 }}>Your ranking</div>
              <div
                onDragOver={(e) => { if (draggingPool) e.preventDefault(); }}
                onDrop={(e) => { e.preventDefault(); if (draggingPool) addItem(rankDrag.item); setRankDrag(null); }}
                style={ranked.length === 0
                  ? { border: "2px dashed " + (draggingPool ? eBLUE : "var(--control-line)"), borderRadius: 14, background: draggingPool ? "color-mix(in srgb, var(--accent) 5%, transparent)" : "rgba(0,15,71,.02)", padding: "40px 24px", textAlign: "center", transition: "all .15s" }
                  : { display: "flex", flexDirection: "column", gap: 10, padding: draggingPool ? 8 : 0, border: draggingPool ? "2px dashed " + eBLUE : "none", borderRadius: 14, transition: "all .15s" }}>
                {ranked.length === 0
                  ? <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontStyle: "italic", color: eMUT }}>Drag an option below to rank it here</span>
                  : ranked.map((item, i) => {
                      const dragging = rankDrag && rankDrag.from === "rank" && rankDrag.idx === i;
                      return (
                        <div key={item} draggable
                          onDragStart={(e) => { setRankDrag({ item, from: "rank", idx: i }); e.dataTransfer.effectAllowed = "move"; }}
                          onDragOver={(e) => { e.preventDefault(); if (rankDrag && rankDrag.from === "rank" && rankDrag.idx !== i) { reorder(rankDrag.idx, i); setRankDrag({ ...rankDrag, idx: i }); } }}
                          onDragEnd={() => setRankDrag(null)}
                          style={{ display: "flex", alignItems: "stretch", borderRadius: 12, background: "var(--card)", border: "1px solid " + (dragging ? eBLUE : eLINE), overflow: "hidden", cursor: "grab", boxShadow: dragging ? "0 10px 24px rgba(0,15,71,.14)" : "none", transition: "box-shadow .15s, border-color .15s" }}>
                          <span style={{ display: "flex", alignItems: "center", paddingLeft: 14, color: eMUT, flexShrink: 0 }} aria-hidden="true">{grip}</span>
                          <span className="serif" style={{ width: 56, flexShrink: 0, background: "var(--surface-deep)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 21, margin: "0 16px" }}>{i + 1}</span>
                          <span style={{ flex: 1, fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.5, padding: "16px 0", alignSelf: "center" }}>{item}</span>
                          <button onClick={() => removeItem(item)} title="Return to options" aria-label="Return to options" style={{ flexShrink: 0, width: 48, background: "none", border: "none", borderLeft: "1px solid " + eLINE, color: eMUT, cursor: "pointer", fontFamily: "var(--sans)", fontSize: 21, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>&times;</button>
                        </div>);
                    })}
              </div>
            </div>
            {/* counter */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 500, letterSpacing: 0.2, color: ranked.length === q.items.length ? eMID : eMUT, background: eCARD, border: "1px solid " + eLINE, borderRadius: "var(--lh-radius, 2px)", padding: "8px 18px" }}>{ranked.length} of {q.items.length} ranked</span>
            </div>
            {/* OPTIONS — pool */}
            <div>
              <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eMUT, letterSpacing: 0.2, marginBottom: 10 }}>Options</div>
              {pool.length === 0
                ? <div style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT, fontStyle: "italic", padding: "8px 2px" }}>All options ranked.</div>
                : <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {pool.map((item) => (
                      <div key={item} draggable
                        onDragStart={(e) => { setRankDrag({ item, from: "pool" }); e.dataTransfer.effectAllowed = "move"; }}
                        onDragEnd={() => setRankDrag(null)}
                        onClick={() => addItem(item)}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = eBLUE; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = eLINE; }}
                        style={{ display: "flex", alignItems: "stretch", borderRadius: 12, background: "var(--card)", border: "1px solid " + eLINE, overflow: "hidden", cursor: "pointer", transition: "border-color .15s" }}>
                        <span style={{ flex: 1, fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.5, padding: "16px 18px" }}>{item}</span>
                        <button onClick={(e) => { e.stopPropagation(); addItem(item); }} title="Add to ranking" aria-label="Add to ranking" style={{ flexShrink: 0, width: 52, background: "none", border: "none", borderLeft: "1px solid " + eLINE, color: eMUT, cursor: "pointer", fontFamily: "var(--sans)", fontSize: 21, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                      </div>
                    ))}
                  </div>}
            </div>
          </div>
        );
      })()}

      {q.type === "matrix" && ((compact || q.stacked || (narrow && q.cols.length > 5)) ? (
      <div className="oa-matrix" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {q.rows.map((row, ri) => {
          const answered = a[ri] !== undefined;
          return (
            <div key={ri} style={{ padding: "14px 16px", borderRadius: 12, background: eCARD, border: "1px solid " + (answered ? eBLUE : eLINE), transition: "border-color .15s" }}>
              <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eINK, lineHeight: 1.4, marginBottom: 12 }}>{row}</div>
              {(() => { const single = q.cols.length > 5; return (
              <div className="oa-mopts" style={{ display: "flex", flexDirection: single ? "column" : "row", flexWrap: single ? "nowrap" : "wrap", gap: 8 }}>
                {q.cols.map((col, ci) => {
                  const sel = a[ri] === ci;
                  return (
                    <button key={ci} className="oa-mopt" onClick={() => onChange({ ...a, [ri]: ci })} style={{ flex: single ? "none" : "1 1 auto", width: single ? "100%" : "auto", minWidth: single ? "auto" : 72, display: "inline-flex", alignItems: "center", justifyContent: single ? "flex-start" : "center", gap: single ? 10 : 7, padding: single ? "12px 14px" : "9px 12px", borderRadius: 9, border: "1.5px solid " + (sel ? eBLUE : eLINE), background: sel ? "color-mix(in srgb, var(--accent) 6%, transparent)" : "#fff", cursor: "pointer", transition: "all .15s" }}>
                      <span style={{ width: 16, height: 16, flexShrink: 0, borderRadius: "50%", border: "2px solid " + (sel ? eBLUE : "var(--control-line)"), background: sel ? eBLUE : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>{sel && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--card)" }} />}</span>
                      <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: sel ? eMID : eINK }}>{col}</span>
                    </button>);
                })}
              </div>
              ); })()}
              {q.rowText && <div style={{ marginTop: 12, fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.4 }}>{q.rowText[ri]}</div>}
              {!q.rowText && q.textCol && <div style={{ marginTop: 12 }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eINK, marginBottom: 6 }}>{q.textCol}</div>
                <input value={a["t" + ri] || ""} onChange={(e) => onChange({ ...a, ["t" + ri]: e.target.value })} placeholder="Type your answer…"
                  onFocus={(e) => e.currentTarget.style.borderColor = eBLUE} onBlur={(e) => e.currentTarget.style.borderColor = "var(--field-line)"}
                  style={{ width: "100%", height: 42, padding: "0 12px", border: "1px solid var(--field-line)", borderRadius: 10, background: "#fff", color: eINK, fontFamily: "var(--sans)", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
              </div>}
            </div>);
        })}
      </div>
      ) : (() => {
        // With ≤5 short-label columns keep the fixed 88px scale columns (unchanged).
        // With more (e.g. a 7-point Likert) share the width via equal fluid columns and
        // let headers wrap, so 7 points fit cleanly in both the single-page and split panes.
        const many = q.cols.length > 5;
        const hasTrail = q.textCol || q.rowText; // trailing column: q.rowText = static text (no header), q.textCol = input + header
        const gcols = (many ? `minmax(140px, 1.4fr) repeat(${q.cols.length}, minmax(0, 1fr))` : `1fr repeat(${q.cols.length}, 88px)`) + (hasTrail ? " minmax(120px, 1.2fr)" : "");
        const cgap = many ? 6 : 10;
        return (
        <div className="oa-matrix">
          <div style={{ display: "grid", gridTemplateColumns: gcols, columnGap: cgap, marginBottom: 8, padding: "0 15px", alignItems: "end" }}>
            <div />
            {q.cols.map((col, ci) => <div key={ci} style={{ textAlign: "center", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eMUT, whiteSpace: many ? "normal" : "nowrap", lineHeight: 1.25 }}>{col}</div>)}
            {q.textCol && <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eMUT, lineHeight: 1.25, paddingLeft: 4 }}>{q.textCol}</div>}
            {q.rowText && <div />}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {q.rows.map((row, ri) => {
              const answered = a[ri] !== undefined;
              return (
                <div key={ri} style={{ display: "grid", gridTemplateColumns: gcols, columnGap: cgap, alignItems: "center", padding: "12px 15px", borderRadius: 12, background: eCARD, border: "1px solid " + (answered ? eBLUE : eLINE), transition: "border-color .15s" }}>
                  <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eINK, lineHeight: 1.35, paddingRight: 8 }}>{row}</div>
                  {q.cols.map((col, ci) =>
                    <div key={ci} style={{ display: "flex", justifyContent: "center" }}>
                      <button onClick={() => onChange({ ...a, [ri]: ci })} style={{ width: 26, height: 26, borderRadius: "50%", border: "2px solid " + (a[ri] === ci ? eBLUE : "var(--control-line)"), background: a[ri] === ci ? eBLUE : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s" }}>{a[ri] === ci && <div style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--card)" }} />}</button>
                    </div>
                  )}
                  {q.rowText
                    ? <div style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.4, paddingLeft: 4 }}>{q.rowText[ri]}</div>
                    : q.textCol && <input value={a["t" + ri] || ""} onChange={(e) => onChange({ ...a, ["t" + ri]: e.target.value })} placeholder="Type…"
                      onFocus={(e) => e.currentTarget.style.borderColor = eBLUE} onBlur={(e) => e.currentTarget.style.borderColor = "var(--field-line)"}
                      style={{ width: "100%", height: 38, padding: "0 10px", border: "1px solid var(--field-line)", borderRadius: 8, background: "#fff", color: eINK, fontFamily: "var(--sans)", fontSize: 15, outline: "none", boxSizing: "border-box" }} />}
                </div>);
            })}
          </div>
        </div>
        );
      })())}

      {/* BIPOLAR (side-by-side) — statement centred, one option group flanking each side.
         Part of the matrix-table family: pick left or right for each statement. */}
      {q.type === "bipolar" && (() => {
        const a2 = value || {};
        const dot = (on) => <span style={{ width: 20, height: 20, flexShrink: 0, borderRadius: "50%", border: "2px solid " + (on ? eBLUE : "var(--control-line)"), background: on ? eBLUE : "transparent", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{on && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--card)" }} />}</span>;
        if (compact) {
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {q.statements.map((st, ri) => (
                <div key={ri} style={{ padding: "14px 16px", borderRadius: 12, background: eCARD, border: "1px solid " + (a2[ri] ? eBLUE : eLINE) }}>
                  <div style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.4, marginBottom: 12 }}>{st}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {[["left", q.leftLabel], ["right", q.rightLabel]].map(([side, lbl]) => (
                      <button key={side} onClick={() => onChange({ ...a2, [ri]: side })} style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px 12px", borderRadius: 9, border: "1.5px solid " + (a2[ri] === side ? eBLUE : eLINE), background: a2[ri] === side ? "color-mix(in srgb, var(--accent) 6%, transparent)" : "#fff", cursor: "pointer" }}>
                        {dot(a2[ri] === side)}<span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: a2[ri] === side ? eMID : eINK }}>{lbl}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        }
        const gcols = "minmax(90px, 1fr) minmax(160px, 2fr) minmax(90px, 1fr)";
        return (
          <div className="oa-matrix">
            <div style={{ display: "grid", gridTemplateColumns: gcols, columnGap: 10, marginBottom: 8, padding: "0 15px", alignItems: "end" }}>
              <div style={{ textAlign: "center", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eINK }}>{q.leftLabel}</div>
              <div />
              <div style={{ textAlign: "center", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eINK }}>{q.rightLabel}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {q.statements.map((st, ri) => (
                <div key={ri} style={{ display: "grid", gridTemplateColumns: gcols, columnGap: 10, alignItems: "center", padding: "12px 15px", borderRadius: 12, background: eCARD, border: "1px solid " + (a2[ri] ? eBLUE : eLINE), transition: "border-color .15s" }}>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <button onClick={() => onChange({ ...a2, [ri]: "left" })} style={{ background: "none", border: "none", cursor: "pointer", padding: 3, display: "flex" }}>{dot(a2[ri] === "left")}</button>
                  </div>
                  <div style={{ textAlign: "center", fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.4 }}>{st}</div>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <button onClick={() => onChange({ ...a2, [ri]: "right" })} style={{ background: "none", border: "none", cursor: "pointer", padding: 3, display: "flex" }}>{dot(a2[ri] === "right")}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* CHECK GRID — rows × scale-point columns with square checkboxes + Not Applicable */}
      {q.type === "checkgrid" && (() => {
        const v = value || {};
        const cols = q.cols;
        const naIdx = q.noNa ? -1 : cols.length - 1; // last column = Not Applicable (exclusive), unless noNa
        const toggle = (ri, ci) => {
          const cur = Array.isArray(v[ri]) ? v[ri] : [];
          let next;
          if (ci === naIdx) next = cur.includes(ci) ? [] : [naIdx];
          else next = cur.includes(ci) ? cur.filter((x) => x !== ci) : cur.filter((x) => x !== naIdx).concat(ci);
          onChange({ ...v, [ri]: next });
        };
        return (
          compact ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.rows.map((row, ri) => {
              const cur = Array.isArray(v[ri]) ? v[ri] : [];
              const answered = cur.length > 0;
              return (
                <div key={ri} style={{ padding: "14px 16px", borderRadius: 12, background: eCARD, border: "1px solid " + (answered ? eMID : eLINE), transition: "border-color .15s" }}>
                  <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eINK, lineHeight: 1.4, marginBottom: 12 }}>{row}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {cols.map((col, ci) => {
                      const on = cur.includes(ci);
                      return (
                        <button key={ci} onClick={() => toggle(ri, ci)} aria-label={row + " — " + col} style={{ width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "flex-start", gap: 10, padding: "10px 14px", borderRadius: 9, border: "1.5px solid " + (on ? eMID : eLINE), background: on ? "var(--track)" : "#fff", cursor: "pointer", textAlign: "left", transition: "all .15s" }}>
                          <span style={{ width: 16, height: 16, flexShrink: 0, borderRadius: 5, border: "2px solid " + (on ? eMID : "var(--control-line)"), background: on ? eMID : "transparent", color: "var(--on-accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>{on && <I.check size={11} />}</span>
                          <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: on ? eMID : eINK }}>{col}</span>
                        </button>);
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          ) : (() => {
            // ≤4 columns keep fixed 116px; more (e.g. a 6-point grid) share the width fluidly so they fit.
            const many = cols.length > 4;
            const gridCols = many ? `minmax(140px, 1.4fr) repeat(${cols.length}, minmax(0, 1fr))` : `1fr repeat(${cols.length}, 116px)`;
            return (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: gridCols, columnGap: many ? 8 : 14, padding: "0 4px 10px", borderBottom: "1px solid " + eLINE, alignItems: "end" }}>
                  <div />
                  {cols.map((col, ci) => <div key={ci} style={{ textAlign: "center", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eMUT, lineHeight: 1.25, padding: "0 6px" }}>{col}</div>)}
                </div>
                <div>
                  {q.rows.map((row, ri) => {
                    const cur = Array.isArray(v[ri]) ? v[ri] : [];
                    return (
                      <div key={ri} style={{ display: "grid", gridTemplateColumns: gridCols, columnGap: many ? 8 : 14, alignItems: "center", padding: "14px 4px", borderBottom: "1px solid " + eLINE }}>
                        <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eINK, lineHeight: 1.35, paddingRight: 10 }}>{row}</div>
                        {cols.map((col, ci) => {
                          const on = cur.includes(ci);
                          return (
                            <div key={ci} style={{ display: "flex", justifyContent: "center" }}>
                              <button onClick={() => toggle(ri, ci)} aria-label={row + " — " + col} style={{ width: 26, height: 26, borderRadius: 6, border: "2px solid " + (on ? eMID : "var(--control-line)"), background: on ? eMID : "#fff", color: "var(--on-accent)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s" }}>{on && <I.check size={15} />}</button>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()
        );
      })()}

      {/* NUM GRID — numeric inputs per scale point + Not Applicable + row Total */}
      {q.type === "numgrid" && (() => {
        const v = value || {};
        const setRow = (ri, patch) => onChange({ ...v, [ri]: { ...(v[ri] || {}), ...patch } });
        const rowTotal = (ri) => { const r = v[ri] || {}; if (r.na) return 0; return q.cols.reduce((s, _, ci) => s + (Number((r.vals || {})[ci]) || 0), 0); };
        return (
          compact ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.rows.map((row, ri) => {
              const r = v[ri] || {};
              const na = !!r.na;
              return (
                <div key={ri} style={{ padding: "14px 16px", borderRadius: 12, background: eCARD, border: "1px solid " + eLINE }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eINK, lineHeight: 1.4 }}>{row}</span>
                    <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: na ? eMUT : eMID }}>Total: {na ? "—" : rowTotal(ri)}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "stretch" }}>
                    {q.cols.map((col, ci) => (
                      <label key={ci} style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", gap: 5 }}>
                        <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eMUT }}>{col}</span>
                        {q.cellSelect
                          ? <select disabled={na} value={na ? "" : (((r.vals || {})[ci]) ?? "")} onChange={(e) => setRow(ri, { vals: { ...(r.vals || {}), [ci]: e.target.value } })} style={{ width: "100%", boxSizing: "border-box", height: 40, border: "1px solid var(--field-line)", borderRadius: 8, fontFamily: "var(--sans)", fontSize: 15, color: eMID, background: na ? "rgba(0,15,71,.04)" : "#fff", outline: "none", padding: "0 10px" }}><option value="">Select…</option>{(q.selectOptions || [0, 1, 2, 3, 4, 5]).map((o) => <option key={o} value={o}>{o}</option>)}</select>
                          : <input type="number" inputMode="numeric" disabled={na} value={na ? "" : (((r.vals || {})[ci]) ?? "")} onChange={(e) => setRow(ri, { vals: { ...(r.vals || {}), [ci]: e.target.value } })} style={{ width: "100%", boxSizing: "border-box", height: 40, textAlign: "center", border: "1px solid " + eLINE, borderRadius: 8, fontFamily: "var(--sans)", fontSize: 15, color: eMID, background: na ? "rgba(0,15,71,.04)" : "#fff", outline: "none" }} />}
                      </label>
                    ))}
                    {!q.noNa && <button onClick={() => setRow(ri, { na: !na })} aria-label={row + " — Not Applicable"} style={{ flex: "0 0 auto", height: 40, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "0 12px", borderRadius: 8, border: "1.5px solid " + (na ? eMID : eLINE), background: na ? "var(--track)" : "#fff", cursor: "pointer", whiteSpace: "nowrap" }}>
                      <span style={{ width: 16, height: 16, flexShrink: 0, borderRadius: 5, border: "2px solid " + (na ? eMID : "var(--control-line)"), background: na ? eMID : "transparent", color: "var(--on-accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>{na && <I.check size={11} />}</span>
                      <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eMUT, whiteSpace: "nowrap" }}>Not Applicable</span>
                    </button>}
                  </div>
                </div>
              );
            })}
          </div>
          ) : (() => {
            // totalRow = a single Total row at the bottom (column sums) instead of a per-row Total column.
            const colTotal = (ci) => q.rows.reduce((s, _, ri) => { const rr = v[ri] || {}; if (rr.na) return s; return s + (Number((rr.vals || {})[ci]) || 0); }, 0);
            const gridCols = `1.2fr repeat(${q.cols.length}, 76px)` + (q.noNa ? "" : " 96px") + (q.totalRow ? "" : " 76px");
            return (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: gridCols, columnGap: 14, padding: "0 4px 10px", borderBottom: "1px solid " + eLINE, alignItems: "end" }}>
                  <div />
                  {q.cols.map((col, ci) => <div key={ci} style={{ textAlign: "center", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eMUT, lineHeight: 1.25, padding: "0 4px" }}>{col}</div>)}
                  {!q.noNa && <div style={{ textAlign: "center", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eMUT }}>Not Applicable</div>}
                  {!q.totalRow && <div style={{ textAlign: "center", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eMUT }}>Total</div>}
                </div>
                <div>
                  {q.rows.map((row, ri) => {
                    const r = v[ri] || {};
                    const na = !!r.na;
                    return (
                      <div key={ri} style={{ display: "grid", gridTemplateColumns: gridCols, columnGap: 14, alignItems: "center", padding: "12px 4px", borderBottom: "1px solid " + eLINE }}>
                        <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eINK, lineHeight: 1.35, paddingRight: 10 }}>{row}</div>
                        {q.cols.map((col, ci) => (
                          <div key={ci} style={{ display: "flex", justifyContent: "center" }}>
                            {q.cellSelect
                              ? <select disabled={na} value={na ? "" : (((r.vals || {})[ci]) ?? "")} onChange={(e) => setRow(ri, { vals: { ...(r.vals || {}), [ci]: e.target.value } })} style={{ width: 64, height: 38, textAlign: "center", border: "1px solid var(--field-line)", borderRadius: 2, fontFamily: "var(--sans)", fontSize: 15, color: eMID, background: na ? "rgba(0,15,71,.04)" : "#fff", outline: "none" }}><option value="">–</option>{(q.selectOptions || [0, 1, 2, 3, 4, 5]).map((o) => <option key={o} value={o}>{o}</option>)}</select>
                              : <input type="number" inputMode="numeric" disabled={na} value={na ? "" : (((r.vals || {})[ci]) ?? "")} onChange={(e) => setRow(ri, { vals: { ...(r.vals || {}), [ci]: e.target.value } })} style={{ width: 56, height: 38, textAlign: "center", border: "1px solid " + eLINE, borderRadius: 2, fontFamily: "var(--sans)", fontSize: 15, color: eMID, background: na ? "rgba(0,15,71,.04)" : "#fff", outline: "none" }} />}
                          </div>
                        ))}
                        {!q.noNa && <div style={{ display: "flex", justifyContent: "center" }}>
                          <button onClick={() => setRow(ri, { na: !na })} aria-label={row + " — Not Applicable"} style={{ width: 26, height: 26, borderRadius: 6, border: "2px solid " + (na ? eMID : "var(--control-line)"), background: na ? eMID : "#fff", color: "var(--on-accent)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{na && <I.check size={15} />}</button>
                        </div>}
                        {!q.totalRow && <div style={{ display: "flex", justifyContent: "center" }}>
                          <div style={{ width: 56, height: 38, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid " + eLINE, borderRadius: 2, fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: na ? eMUT : eMID, background: eCARD }}>{na ? "—" : rowTotal(ri)}</div>
                        </div>}
                      </div>
                    );
                  })}
                  {q.totalRow && (
                    <div style={{ display: "grid", gridTemplateColumns: gridCols, columnGap: 14, alignItems: "center", padding: "12px 4px" }}>
                      <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eINK }}>Total</div>
                      {q.cols.map((col, ci) => (
                        <div key={ci} style={{ display: "flex", justifyContent: "center" }}>
                          <div style={{ width: 56, height: 38, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid " + eLINE, borderRadius: 2, fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eMID, background: eCARD }}>{colTotal(ci)}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })()
        );
      })()}

      {/* DROPDOWN GRID — one MDS dropdown per row (single select from the columns).
         Part of the matrix-table family. */}
      {q.type === "dropdowngrid" && (() => {
        const a3 = value || {};
        return (
          <div ref={gridDropRef} style={{ display: "flex", flexDirection: "column", gap: compact ? 14 : 10 }}>
            {q.rows.map((row, ri) => {
              const open = gridDropRow === ri;
              const chosen = typeof a3[ri] === "number" ? q.cols[a3[ri]] : null;
              return (
                <div key={ri} style={{ display: compact ? "block" : "grid", gridTemplateColumns: compact ? undefined : "minmax(150px, 1fr) minmax(220px, 1.3fr)", columnGap: 16, alignItems: "center" }}>
                  <div style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.4, marginBottom: compact ? 6 : 0 }}>{row}</div>
                  <div style={{ position: "relative" }}>
                    <div onClick={() => setGridDropRow(open ? null : ri)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setGridDropRow(open ? null : ri); } }}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "12px 14px", border: "1px solid " + (open ? eBLUE : "var(--field-line)"), borderRadius: 12, background: eCARD, minHeight: 46, cursor: "pointer" }}>
                      <span style={{ fontFamily: "var(--sans)", fontSize: 15, color: chosen ? eINK : eMUT }}>{chosen || q.placeholder || "Select an option"}</span>
                      <span style={{ color: eMUT, display: "flex", transform: open ? "rotate(180deg)" : "", transition: "transform .15s", flexShrink: 0 }}><I.chevD size={16} /></span>
                    </div>
                    {open &&
                    <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 30, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 12, boxShadow: "0 12px 32px rgba(0,15,71,.14)", padding: 6, maxHeight: 240, overflowY: "auto" }}>
                      {q.cols.map((col, ci) => {
                        const s = a3[ri] === ci;
                        return (
                          <button key={ci} onClick={() => { onChange({ ...a3, [ri]: ci }); setGridDropRow(null); }}
                            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, width: "100%", textAlign: "left", padding: "10px 12px", borderRadius: 8, border: "none", background: s ? "color-mix(in srgb, var(--accent) 6%, transparent)" : "transparent", cursor: "pointer", fontFamily: "var(--sans)", fontSize: 15, color: eINK, fontWeight: s ? 500 : 400 }}
                            onMouseEnter={(e) => { if (!s) e.currentTarget.style.background = "color-mix(in srgb, var(--accent) 5%, transparent)"; }} onMouseLeave={(e) => { if (!s) e.currentTarget.style.background = "transparent"; }}>
                            {col}{s && <span style={{ color: eBLUE, display: "flex", flexShrink: 0 }}><I.check size={15} /></span>}
                          </button>);
                      })}
                    </div>}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* SLIDER GRID — labelled 0–100 scale, one slider per row, value box + Clear */}
      {q.type === "slidergrid" && (() => {
        const v = value || {};
        const set = (ri, val) => onChange({ ...v, [ri]: val });
        return (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(120px,1.1fr) 3fr 64px", gap: 14, alignItems: "end", marginBottom: 6 }}>
              <div />
              <div>
                {q.labels &&
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    {q.labels.map((l, li) => <div key={li} style={{ flex: 1, textAlign: li === 0 ? "left" : li === q.labels.length - 1 ? "right" : "center", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eINK }}>{l}</div>)}
                  </div>}
              </div>
              <div />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {q.rows.map((row, ri) => {
                const set50 = v[ri];
                return (
                  <div key={ri} style={{ display: "grid", gridTemplateColumns: "minmax(120px,1.1fr) 3fr 64px", gap: 14, alignItems: "center" }}>
                    <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eINK }}>{row}</div>
                    <input type="range" min="0" max="100" step="10" value={set50 ?? 0} onChange={(e) => set(ri, Number(e.target.value))} className="oa-range" style={{ width: "100%", accentColor: eMID }} />
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{ width: 56, height: 36, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid " + eLINE, borderRadius: 8, fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: set50 == null ? eMUT : eMID, background: eCARD }}>{set50 == null ? "–" : set50}</div>
                      <button onClick={() => { const n = { ...v }; delete n[ri]; onChange(n); }} style={{ background: "none", border: "none", color: eBLUE, cursor: "pointer", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, padding: 0 }}>Clear</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* BAR GRID — click a 0–100 track to set a bar per row, value at right */}
      {q.type === "bargrid" && (() => {
        const v = value || {};
        const onTrack = (ri, e) => { const r = e.currentTarget.getBoundingClientRect(); const pct = Math.round(((e.clientX - r.left) / r.width) * 10) * 10; onChange({ ...v, [ri]: Math.max(0, Math.min(100, pct)) }); };
        return (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(120px,1fr) 3fr 44px", gap: 12, alignItems: "end", marginBottom: 6 }}>
              <div />
              <div>
                {q.labels &&
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    {q.labels.map((l, li) => <div key={li} style={{ flex: 1, textAlign: "center", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eINK }}>{l}</div>)}
                  </div>}
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--sans)", fontSize: 15, color: eMUT }}>
                  {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((n) => <span key={n}>{n}</span>)}
                </div>
              </div>
              <div />
            </div>
            <div style={{ borderLeft: "2px solid " + eMID }}>
              {q.rows.map((row, ri) => {
                const val = v[ri];
                return (
                  <div key={ri} style={{ display: "grid", gridTemplateColumns: "minmax(120px,1fr) 3fr 44px", gap: 12, alignItems: "center", padding: "10px 0", borderBottom: "1px solid " + eLINE }}>
                    <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eINK, paddingLeft: 10 }}>{row}</div>
                    <div onClick={(e) => onTrack(ri, e)} style={{ position: "relative", height: 26, background: "var(--track)", cursor: "pointer", borderRight: "1px solid " + eLINE }}>
                      {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((n) => <div key={n} style={{ position: "absolute", top: 0, bottom: 0, left: n + "%", width: 1, background: "rgba(0,15,71,.07)" }} />)}
                      {val != null && <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: val + "%", background: "var(--accent)" }} />}
                    </div>
                    <div style={{ textAlign: "right", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: val == null ? eMUT : eMID }}>{val == null ? "–" : val}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* STAR GRID — 5-star rating per row */}
      {q.type === "stargrid" && (() => {
        const v = value || {};
        const max = q.max || 5;
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {q.rows.map((row, ri) => {
              const rating = v[ri] || 0;
              return (
                <div key={ri} style={{ display: "grid", gridTemplateColumns: "minmax(120px,1fr) auto", gap: 18, alignItems: "center" }}>
                  <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eINK }}>{row}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {Array.from({ length: max }).map((_, si) => {
                      const on = si < rating;
                      return (
                        <button key={si} onClick={() => onChange({ ...v, [ri]: si + 1 === rating ? 0 : si + 1 })} aria-label={(si + 1) + " of " + max} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", lineHeight: 0 }}>
                          <svg width="28" height="28" viewBox="0 0 24 24" fill={on ? "var(--action)" : "none"} stroke="var(--action)" strokeWidth="1.6" strokeLinejoin="round"><path d="M12 2.5l2.95 5.98 6.6.96-4.77 4.65 1.13 6.57L12 18.6l-5.9 3.1 1.13-6.57L2.46 9.44l6.6-.96L12 2.5z" /></svg>
                        </button>
                      );
                    })}
                    <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eMID, marginLeft: 4 }}>{rating || "–"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })()}

      {/* FILL GAUGE — vertical segmented bar that fills from the bottom as the slider moves */}
      {q.type === "fillgauge" && (() => {
        const segs = q.segments || 9;
        const val = typeof value === "number" ? value : 0;
        const filled = Math.round((val / 100) * segs);
        return (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22, padding: "6px 0" }}>
            <div style={{ width: 220, border: "2px solid " + eMID, borderRadius: 12, padding: 12, display: "flex", flexDirection: "column-reverse", gap: 9, background: "var(--card)" }}>
              {Array.from({ length: segs }).map((_, i) => {
                const on = i < filled;
                return (
                  <div key={i} style={{ height: 26, borderRadius: 5, border: "2px solid #0E5C2A", background: on ? "repeating-linear-gradient(45deg, #14853D, #14853D 6px, #117A38 6px, #117A38 12px)" : "#fff", transition: "background .12s" }} />
                );
              })}
            </div>
            <input type="range" min="0" max="100" step={Math.round(100 / segs)} value={val} onChange={(e) => onChange(Number(e.target.value))} style={{ width: 320, maxWidth: "100%", accentColor: "var(--primary)" }} />
            <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eMID }}>{filled} / {segs}</div>
          </div>
        );
      })()}

      {/* SHAPE DRAW — polygon annotation editor with draggable vertices */}
      {q.type === "shapedraw" && (() => {
        const data = (value && value.shapes) ? value : { shapes: [], sel: -1 };
        const shapes = data.shapes;
        const sel = data.sel;
        const commit = (next) => onChange(next);
        const rectAt = (cx, cy, w, h) => [{ x: cx - w / 2, y: cy - h / 2 }, { x: cx + w / 2, y: cy - h / 2 }, { x: cx + w / 2, y: cy + h / 2 }, { x: cx - w / 2, y: cy + h / 2 }];
        const addShape = () => commit({ shapes: shapes.concat([rectAt(50, 50, 30, 34)]), sel: shapes.length });
        const cloneShape = () => { if (sel < 0) return; const s = shapes[sel].map((p) => ({ x: Math.min(95, p.x + 6), y: Math.min(95, p.y + 6) })); commit({ shapes: shapes.concat([s]), sel: shapes.length }); };
        const removeShape = () => { if (sel < 0) return; const ns = shapes.filter((_, i) => i !== sel); commit({ shapes: ns, sel: ns.length - 1 }); };
        const addPoint = () => { if (sel < 0) return; const s = shapes[sel].slice(); const a = s[0], b = s[1]; s.splice(1, 0, { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }); commit({ shapes: shapes.map((sh, i) => i === sel ? s : sh), sel }); };
        const removePoint = () => { if (sel < 0 || shapes[sel].length <= 3) return; commit({ shapes: shapes.map((sh, i) => i === sel ? sh.slice(0, -1) : sh), sel }); };
        const startDrag = (containerRef, si, pi, e) => {
          e.preventDefault();
          const el = containerRef;
          const move = (ev) => {
            const r = el.getBoundingClientRect();
            const x = Math.max(0, Math.min(100, ((ev.clientX - r.left) / r.width) * 100));
            const y = Math.max(0, Math.min(100, ((ev.clientY - r.top) / r.height) * 100));
            commit({ shapes: shapes.map((sh, i) => i === si ? sh.map((p, j) => j === pi ? { x, y } : p) : sh), sel: si });
          };
          const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
          window.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
        };
        const startShapeDrag = (containerRef, si, e) => {
          e.preventDefault();
          commit({ shapes, sel: si });
          const el = containerRef;
          const r = el.getBoundingClientRect();
          const startX = ((e.clientX - r.left) / r.width) * 100;
          const startY = ((e.clientY - r.top) / r.height) * 100;
          const orig = shapes[si].map((p) => ({ x: p.x, y: p.y }));
          const minX = Math.min(...orig.map((p) => p.x)), maxX = Math.max(...orig.map((p) => p.x));
          const minY = Math.min(...orig.map((p) => p.y)), maxY = Math.max(...orig.map((p) => p.y));
          const move = (ev) => {
            let dx = ((ev.clientX - r.left) / r.width) * 100 - startX;
            let dy = ((ev.clientY - r.top) / r.height) * 100 - startY;
            dx = Math.max(-minX, Math.min(100 - maxX, dx));
            dy = Math.max(-minY, Math.min(100 - maxY, dy));
            commit({ shapes: shapes.map((s, i) => i === si ? orig.map((p) => ({ x: p.x + dx, y: p.y + dy })) : s), sel: si });
          };
          const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
          window.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
        };
        const btn = (label, kind, onClick, disabled) => {
          const muted = kind === "muted";
          const bg = kind === "dark" ? "var(--primary)" : kind === "danger" ? "var(--danger-fill)" : "var(--card)";
          const fg = kind === "dark" ? "var(--on-accent)" : muted ? "var(--ink)" : "#fff";
          return <button onClick={onClick} disabled={disabled} style={{ padding: "11px 18px", borderRadius: 8, border: muted ? "1px solid var(--line)" : "none", background: bg, color: fg, fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.45 : 1 }}>{label}</button>;
        };
        let canvasEl = null;
        return (
          <div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, padding: 10, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 10, marginBottom: 18 }}>
              {btn("Add Shape", "dark", addShape)}
              {btn("Clone Shape", "dark", cloneShape, sel < 0)}
              {btn("Add Point", "muted", addPoint, sel < 0)}
              {btn("Remove Point", "muted", removePoint, sel < 0 || (shapes[sel] && shapes[sel].length <= 3))}
              <div style={{ flex: 1 }} />
              {btn("Remove Shape", "danger", removeShape, sel < 0)}
            </div>
            <div ref={(el) => { canvasEl = el; }} style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", background: "#ECECEC", border: "1px solid " + eLINE, borderRadius: 8, overflow: "hidden", userSelect: "none", touchAction: "none" }}>
              {q.image && <img src={q.image} alt="" draggable="false" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} />}
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                {shapes.map((sh, si) => (
                  <polygon key={si} points={sh.map((p) => p.x + "," + p.y).join(" ")} onPointerDown={(e) => startShapeDrag(canvasEl, si, e)}
                    fill="#EEEDB6" stroke={si === sel ? eMID : "var(--primary)"} strokeWidth={si === sel ? 0.7 : 0.5} strokeDasharray={si === sel ? "2 1.5" : "none"} vectorEffect="non-scaling-stroke" style={{ cursor: "move" }} />
                ))}
              </svg>
              {sel >= 0 && shapes[sel] && shapes[sel].map((p, pi) => (
                <div key={pi} onPointerDown={(e) => startDrag(canvasEl, sel, pi, e)} style={{ position: "absolute", left: p.x + "%", top: p.y + "%", width: 14, height: 14, marginLeft: -7, marginTop: -7, borderRadius: "50%", background: "var(--card)", border: "2px solid " + eMID, cursor: "grab", boxShadow: "0 1px 4px rgba(0,0,0,.25)" }} />
              ))}
              {shapes.length === 0 &&
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--sans)", fontSize: 15, color: eMUT, pointerEvents: "none" }}>Click "Add Shape" to begin annotating</div>}
            </div>
          </div>
        );
      })()}

      {/* FILE UPLOAD — a small MDS "Select File" button; once chosen, the file shows as a
         link with an MDS trash-icon remove control (mirrors the product). */}
      {q.type === "file" && (value ?
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: eBLUE, display: "flex", flexShrink: 0 }}><I.doc size={18} /></span>
          <a href="#" onClick={(e) => e.preventDefault()} style={{ flex: 1, fontFamily: "var(--sans)", fontSize: 15, color: eBLUE, textDecoration: "none", wordBreak: "break-word", lineHeight: 1.4 }}>{value}</a>
          <button onClick={() => onChange(undefined)} title="Remove file" aria-label="Remove file" style={{ flexShrink: 0, background: "none", border: "none", cursor: "pointer", color: eMUT, display: "flex", alignItems: "center", padding: 4 }}
            onMouseEnter={(e) => e.currentTarget.style.color = eDANGER} onMouseLeave={(e) => e.currentTarget.style.color = eMUT}><I.trash size={18} /></button>
        </div> :
        <div>
          {/* MDS Secondary button (the shared EdBtn component: navy text + 1.5px navy border, radius-sm) */}
          <EdBtn small onClick={() => onChange(q.sampleFile || "Leadership_Impact_Report.pdf")}><I.upload size={16} /> Select File</EdBtn>
          {(q.accepts || q.maxSize) && <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: eMUT, marginTop: 8 }}>{q.accepts}{q.accepts && q.maxSize ? " · " : ""}{q.maxSize ? "Max " + q.maxSize : ""}</div>}
        </div>)
      }

      {q.type === "audio" && <OaMediaResponse audioOnly maxDuration={q.maxDuration} value={value} onChange={onChange} />}

      {/* FACTOR SELECT — dropdown that adds tags into the field */}
      {q.type === "factor" && (() => {
        const sel = Array.isArray(value) ? value : [];
        const remove = (o) => onChange(sel.filter((x) => x !== o));
        const add = (o) => onChange([...sel, o]);
        const remaining = q.options.filter((o) => !sel.includes(o));
        return (
          <div ref={factorRef} style={{ position: "relative" }}>
            <div onClick={() => setFactorOpen((v) => !v)} style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", padding: "10px 40px 10px 12px", border: "1px solid " + (factorOpen ? eBLUE : "var(--field-line)"), borderRadius: 12, background: eCARD, minHeight: 46, cursor: "pointer", position: "relative" }}>
              {sel.length === 0 && <span style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT }}>Select factors…</span>}
              {sel.map((o) => <span key={o} onClick={(e) => { e.stopPropagation(); remove(o); }} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "color-mix(in srgb, var(--accent) 7%, transparent)", color: eINK, border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)", borderRadius: 7, padding: "4px 9px", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 500 }}>{o} <span style={{ cursor: "pointer", color: eMUT, fontSize: 15, lineHeight: 1 }}>×</span></span>)}
              <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%) " + (factorOpen ? "rotate(180deg)" : ""), color: eMUT, display: "flex", transition: "transform .15s" }}><I.chevD size={16} /></span>
            </div>
            {factorOpen &&
            <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 20, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 12, boxShadow: "0 12px 32px rgba(0,15,71,.14)", padding: 6, maxHeight: 240, overflowY: "auto" }}>
              {remaining.length === 0 && <div style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT, padding: "10px 12px" }}>All factors selected.</div>}
              {remaining.map((o) =>
                <button key={o} onClick={() => add(o)} style={{ display: "flex", alignItems: "center", width: "100%", textAlign: "left", padding: "10px 12px", borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", fontFamily: "var(--sans)", fontSize: 15, color: eINK }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "color-mix(in srgb, var(--accent) 5%, transparent)"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  {o}
                </button>
              )}
            </div>
            }
          </div>);
      })()}

      {/* CONSTANT SUM */}
      {q.type === "constantsum" && (() => {
        const v = value || {};
        const sum = q.choices.reduce((a, _, i) => a + (Number(v[i]) || 0), 0);
        const ok = sum === q.target;
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.choices.map((c, i) =>
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 12, background: eCARD, border: "1px solid " + eLINE }}>
                <span style={{ flex: 1, fontFamily: "var(--sans)", fontSize: 15, color: eINK }}>{c}</span>
                <input type="number" min="0" value={v[i] == null ? "" : v[i]} onChange={(e) => onChange({ ...v, [i]: e.target.value === "" ? undefined : Number(e.target.value) })} style={{ width: 76, padding: "8px 10px", borderRadius: 8, border: "1px solid " + eLINE, fontFamily: "var(--sans)", fontSize: 15, textAlign: "right", outline: "none" }} />
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 14px" }}>
              <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eMID }}>Total</span>
              <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: ok ? eSUCCESS : eDANGER }}>{sum} / {q.target}</span>
            </div>
          </div>);
      })()}

      {/* SLIDER ROWS */}
      {q.type === "slider" && (() => {
        const v = value || {};
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {q.labels.map((l, i) => <span key={i} style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eINK }}>{l}</span>)}
            </div>
            {q.choices.map((c, i) =>
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK }}>{c}</span>
                  <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: "var(--primary)" }}>{v[i] == null ? 0 : v[i]}</span>
                </div>
                <input type="range" min="0" max="100" value={v[i] == null ? 0 : v[i]} onChange={(e) => onChange({ ...v, [i]: Number(e.target.value) })} style={{ width: "100%", accentColor: "var(--primary)" }} />
              </div>
            )}
          </div>);
      })()}

      {/* SIDE BY SIDE */}
      {(q.type === "sidebyside" || q.type === "sbs") && (() => {
        const v = value || {};
        return compact ? (
          // Phone: the wide context table becomes one card per statement — each context
          // ("In my current role" …) with its options as buttons, so nothing scrolls off.
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.statements.map((s, si) => (
              <div key={si} style={{ padding: "14px 16px", borderRadius: 12, background: eCARD, border: "1px solid " + eLINE }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eINK, lineHeight: 1.4, marginBottom: 12 }}>{s}</div>
                {q.groups.map((g, gi) => (
                  <div key={gi} style={{ marginBottom: gi < q.groups.length - 1 ? 12 : 0 }}>
                    <div style={{ fontFamily: "var(--sans)", fontSize: 11.5, fontWeight: 400, color: eINK, marginBottom: 6 }}>{g.label}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {g.cols.map((c, ci) => {
                        const sel = v[si] && v[si][gi] === ci;
                        return (
                          <button key={ci} onClick={() => onChange({ ...v, [si]: { ...(v[si] || {}), [gi]: ci } })} style={{ flex: "1 1 0", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "9px 10px", borderRadius: 9, border: "1.5px solid " + (sel ? eBLUE : eLINE), background: sel ? "color-mix(in srgb, var(--accent) 6%, transparent)" : "#fff", cursor: "pointer" }}>
                            <span style={{ width: 16, height: 16, flexShrink: 0, borderRadius: "50%", border: "2px solid " + (sel ? eBLUE : "var(--control-line)"), background: sel ? eBLUE : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>{sel && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--card)" }} />}</span>
                            <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: sel ? eMID : eINK }}>{c}</span>
                          </button>);
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (() => {
          // `labels`: "top" (default) = group + answer headers at the top only.
          // "topBottom" = also repeat the answer headers at the bottom.
          // "repeat" = repeat the answer headers under every choice row.
          const groupHeadRow = (k) => (
            <tr key={k}>
              <th></th>
              {q.groups.map((g, gi) => <th key={gi} colSpan={g.cols.length} style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eINK, padding: "6px 8px", textAlign: "center", borderBottom: "1px solid " + eLINE }}>{g.label}</th>)}
            </tr>
          );
          const answerHeadRow = (k) => (
            <tr key={k}>
              <th></th>
              {q.groups.map((g, gi) => g.cols.map((c, ci) => <th key={gi + "-" + ci} style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT, fontWeight: 400, padding: "8px 10px", textAlign: "center" }}>{c}</th>))}
            </tr>
          );
          const rowEl = (s, si) => (
            <tr key={"r" + si} style={{ borderTop: "1px solid " + eLINE }}>
              <td style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, padding: "12px 8px" }}>{s}</td>
              {q.groups.map((g, gi) => g.cols.map((c, ci) => {
                const sel = v[si] && v[si][gi] === ci;
                return (
                  <td key={gi + "-" + ci} style={{ textAlign: "center", padding: "12px 8px" }}>
                    <button onClick={() => onChange({ ...v, [si]: { ...(v[si] || {}), [gi]: ci } })} style={{ width: 22, height: 22, borderRadius: "50%", border: "2px solid " + (sel ? eBLUE : "var(--control-line)"), background: "transparent", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 0 }}>{sel && <span style={{ width: 10, height: 10, borderRadius: "50%", background: eBLUE, display: "block" }} />}</button>
                  </td>);
              }))}
            </tr>
          );
          const body = [];
          q.statements.forEach((s, si) => {
            body.push(rowEl(s, si));
            if (q.labels === "repeat") body.push(answerHeadRow("rep-" + si));
          });
          if (q.labels === "topBottom") body.push(answerHeadRow("bottom"));
          return (
            <div style={{ overflowX: "auto" }}>
              <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 480 }}>
                <thead>{groupHeadRow("gh")}{answerHeadRow("ah")}</thead>
                <tbody>{body}</tbody>
              </table>
            </div>);
        })();
      })()}

      {/* GAP ANALYSIS — face scale + Tell Us Why */}
      {q.type === "gap" && (() => {
        const v = value || {};
        const set = (ci, patch) => onChange({ ...v, [ci]: { ...(v[ci] || {}), ...patch } });
        return (
          compact ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.categories.map((cat, ci) => {
              const row = v[ci] || {};
              const why = row.why || [];
              const answered = row.s !== undefined;
              return (
                <div key={ci} style={{ padding: "14px 16px", borderRadius: 12, background: eCARD, border: "1px solid " + (answered ? eBLUE : eLINE), transition: "border-color .15s" }}>
                  <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eMUT, lineHeight: 1.4, marginBottom: 12 }}>{cat}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                    {q.scale.map((e, si) => {
                      const sel = row.s === si;
                      return (
                        <button key={si} onClick={() => set(ci, { s: si })} aria-label={cat + " — rating " + (si + 1)} style={{ flex: "1 1 auto", minWidth: 52, height: 48, display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: 10, border: "2px solid " + (sel ? eBLUE : eLINE), background: sel ? "color-mix(in srgb, var(--accent) 6%, transparent)" : "#fff", cursor: "pointer", fontSize: 21, transition: "all .15s" }}>{e}</button>);
                    })}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eMUT }}>Tell us why</span>
                    <div style={{ display: "flex", gap: 8 }}>
                      {[0, 1, 2].map((wi) => {
                        const on = !!why[wi];
                        return (
                          <button key={wi} onClick={() => { const nw = [...why]; nw[wi] = !on; set(ci, { why: nw }); }} aria-label={cat + " — reason " + (wi + 1)} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 11px", borderRadius: 8, border: "1.5px solid " + (on ? eBLUE : eLINE), background: on ? "color-mix(in srgb, var(--accent) 6%, transparent)" : "#fff", cursor: "pointer" }}>
                            <span style={{ width: 15, height: 15, flexShrink: 0, borderRadius: 4, border: "1.5px solid " + (on ? "var(--primary)" : "var(--control-line)"), background: on ? "var(--primary)" : "transparent", color: "var(--on-accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>{on && <I.check size={10} />}</span>
                            <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eMID }}>{wi + 1}</span>
                          </button>);
                      })}
                    </div>
                  </div>
                </div>);
            })}
          </div>
          ) : (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: `1fr repeat(${q.scale.length}, 38px) 30px repeat(3, 40px)`, alignItems: "center", marginBottom: 6, paddingLeft: 4, columnGap: 8 }}>
              <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eINK }}>Categories</span>
              {q.scale.map((e, i) => <span key={i} style={{ textAlign: "center", fontSize: 21 }}>{e}</span>)}
              <span></span>
              <span style={{ gridColumn: "span 3", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eINK, textAlign: "center" }}>Tell Us Why</span>
            </div>
            {q.categories.map((cat, ci) => {
              const row = v[ci] || {};
              const why = row.why || [];
              return (
                <div key={ci} style={{ display: "grid", gridTemplateColumns: `1fr repeat(${q.scale.length}, 38px) 30px repeat(3, 40px)`, alignItems: "center", padding: "10px 4px", borderTop: "1px solid " + eLINE, columnGap: 8 }}>
                  <span style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK }}>{cat}</span>
                  {q.scale.map((e, si) => {
                    const sel = row.s === si;
                    return <div key={si} style={{ display: "flex", justifyContent: "center" }}>
                      <button onClick={() => set(ci, { s: si })} style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid " + (sel ? eBLUE : "var(--control-line)"), background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>{sel && <span style={{ width: 9, height: 9, borderRadius: "50%", background: eBLUE, display: "block" }} />}</button>
                    </div>;
                  })}
                  <span style={{ display: "flex", justifyContent: "center", color: eMUT }}><I.arrow size={14} /></span>
                  {[0, 1, 2].map((wi) => {
                    const on = !!why[wi];
                    return <div key={wi} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                      <span style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT }}>Why</span>
                      <button onClick={() => { const nw = [...why]; nw[wi] = !on; set(ci, { why: nw }); }} style={{ width: 16, height: 16, borderRadius: 4, border: "1.5px solid " + (on ? "var(--primary)" : "var(--control-line)"), background: on ? "var(--primary)" : "transparent", color: "var(--on-accent)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>{on && <I.check size={11} />}</button>
                    </div>;
                  })}
                </div>);
            })}
          </div>
          ));
      })()}

      {/* SKILL FACTOR FEEDBACK */}
      {q.type === "skillfeedback" && (() => {
        const v = value || {};
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {q.skills.map((sk, i) => {
              const e = v[i] || {};
              return (
                <div key={i}>
                  <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eINK, marginBottom: 8 }}>{sk}</div>
                  <select value={e.factor || ""} onChange={(ev) => onChange({ ...v, [i]: { ...e, factor: ev.target.value } })} style={{ width: "100%", padding: "10px 38px 10px 12px", borderRadius: 9, border: "1px solid " + eLINE, fontFamily: "var(--sans)", fontSize: 15, color: e.factor ? eINK : eMUT, background: eCARD + " url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23667085' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\") no-repeat right 14px center", appearance: "none", WebkitAppearance: "none", MozAppearance: "none", marginBottom: 8, outline: "none" }}>
                    <option value="">Select skill factor…</option>
                    {q.factors.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                  <textarea value={e.feedback || ""} onChange={(ev) => onChange({ ...v, [i]: { ...e, feedback: ev.target.value } })} placeholder="Feedback" style={{ width: "100%", minHeight: 60, padding: "10px 12px", borderRadius: 9, border: "1px solid " + eLINE, fontFamily: "var(--sans)", fontSize: 15, resize: "vertical", outline: "none", boxSizing: "border-box" }} />
                </div>);
            })}
          </div>);
      })()}

      {/* PICK, GROUP & RANK — drag items into groups */}
      {q.type === "pickgrouprank" && (() => {
        const v = value || {};
        const assigned = Object.keys(v).reduce((a, k) => a.concat(v[k] || []), []);
        const pool = q.items.filter((it) => !assigned.includes(it));
        const moveTo = (item, gi) => {
          const nv = {};
          q.groups.forEach((_, i) => { nv[i] = (v[i] || []).filter((x) => x !== item); });
          if (gi != null) nv[gi] = [...(nv[gi] || []), item];
          onChange(nv);
        };
        const onDrop = (e, gi) => { e.preventDefault(); const it = e.dataTransfer.getData("text/plain"); if (it) moveTo(it, gi); };
        return compact ? (
          // Phone: HTML5 drag doesn't fire on touch, so this is tap-to-place — tap an item,
          // then tap a group; tap a placed item to send it back to the pool.
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: pickSel ? eBLUE : eMUT, marginBottom: 8 }}>
                {pool.length === 0 ? "All items placed" : pickSel ? "Now tap a group to place “" + pickSel + "”" : "Tap an item, then tap a group"}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {pool.map((it) => { const on = pickSel === it; return (
                  <button key={it} onClick={() => setPickSel(on ? null : it)} style={{ padding: "10px 13px", borderRadius: 2, border: (on ? "2px solid " + eBLUE : "1px dashed " + eLINE), background: on ? "color-mix(in srgb, var(--accent) 8%, transparent)" : eCARD, fontFamily: "var(--sans)", fontSize: 15, fontWeight: on ? 500 : 400, color: on ? eMID : eINK, cursor: "pointer" }}>{it}</button>); })}
              </div>
            </div>
            {q.groups.map((g, gi) => { const armed = pickSel != null; return (
              <div key={gi} onClick={() => { if (pickSel) { moveTo(pickSel, gi); setPickSel(null); } }} style={{ border: "1px solid " + (armed ? eBLUE : eLINE), borderRadius: 12, overflow: "hidden", cursor: armed ? "pointer" : "default", transition: "border-color .15s" }}>
                <div style={{ background: eCARD, padding: "8px 14px", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eMID, borderBottom: "1px solid " + eLINE, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>{g}</span>{armed && <span style={{ fontSize: 11.5, fontWeight: 400, color: eBLUE }}>Tap to place</span>}
                </div>
                <div style={{ minHeight: 48, padding: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {(v[gi] || []).map((it) => <button key={it} onClick={(e) => { e.stopPropagation(); moveTo(it, null); }} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "7px 8px 7px 11px", borderRadius: 8, background: "color-mix(in srgb, var(--accent) 7%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)", fontFamily: "var(--sans)", fontSize: 15, color: eMID, cursor: "pointer" }}>{it} <span style={{ color: eMUT, fontSize: 15, lineHeight: 1 }}>&times;</span></button>)}
                  {(v[gi] || []).length === 0 && <span style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT, alignSelf: "center" }}>{armed ? "Tap to place here" : "No items yet"}</span>}
                </div>
              </div>); })}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "170px 1fr", gap: 16 }}>
            <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDrop(e, null)}>
              <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eINK, marginBottom: 8 }}>Items</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {pool.map((it) => <div key={it} draggable onDragStart={(e) => e.dataTransfer.setData("text/plain", it)} style={{ padding: "10px 12px", borderRadius: 2, border: "1px dashed " + eLINE, background: eCARD, fontFamily: "var(--sans)", fontSize: 15, color: eINK, cursor: "grab" }}>{it}</div>)}
                {pool.length === 0 && <span style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT }}>All items placed.</span>}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {q.groups.map((g, gi) =>
                <div key={gi} onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDrop(e, gi)} style={{ border: "1px solid " + eLINE, borderRadius: 12, overflow: "hidden" }}>
                  <div style={{ background: eCARD, padding: "8px 14px", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: eINK, borderBottom: "1px solid " + eLINE }}>{g}</div>
                  <div style={{ minHeight: 54, padding: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {(v[gi] || []).map((it) => <span key={it} draggable onDragStart={(e) => e.dataTransfer.setData("text/plain", it)} style={{ padding: "7px 11px", borderRadius: 8, background: "color-mix(in srgb, var(--accent) 7%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)", fontFamily: "var(--sans)", fontSize: 15, color: eINK, cursor: "grab" }}>{it}</span>)}
                    {(v[gi] || []).length === 0 && <span style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT, alignSelf: "center" }}>Drop items here</span>}
                  </div>
                </div>
              )}
            </div>
          </div>);
      })()}

      {/* GRAPHIC SLIDER — gauge */}
      {q.type === "graphicslider" && (() => {
        const val = typeof value === "number" ? value : 0;
        // `graphic`: thermometer | trafficlight | smiley | grade | gradeAD → big graphic + vertical slider.
        if (q.graphic) {
          const pick = (arr) => arr[Math.min(arr.length - 1, Math.max(0, Math.floor(val / 100 * arr.length)))];
          const blue = "var(--primary)"; // brand primary — all graphics use this except the smiley
          let graphic = null;
          if (q.graphic === "thermometer") {
            const top = 24, bot = 196; const fillTop = top + (1 - val / 100) * (bot - top);
            graphic = (
              <svg viewBox="0 0 90 280" width="90" height="260">
                <rect x="34" y="14" width="22" height="188" rx="11" fill="#fff" stroke="#8A8A8A" strokeWidth="3" />
                <circle cx="45" cy="228" r="34" fill="#fff" stroke="#8A8A8A" strokeWidth="3" />
                <circle cx="45" cy="228" r="24" fill={blue} />
                <rect x="39" y={fillTop} width="12" height={232 - fillTop} rx="6" fill={blue} />
                {Array.from({ length: 8 }).map((_, i) => <line key={i} x1="58" x2={i % 2 ? 74 : 68} y1={30 + i * 22} y2={30 + i * 22} stroke="#4A4A4A" strokeWidth="2.5" strokeLinecap="round" />)}
              </svg>
            );
          } else if (q.graphic === "trafficlight") {
            // Housing uses brand primary; the lit lamp tracks the slider — bottom (low) climbs to top (high),
            // going red → amber → green as it rises.
            const active = val < 34 ? "low" : val < 67 ? "mid" : "high";
            const lamp = (cy, on, onColor) => <circle cx="60" cy={cy} r="26" fill={on ? onColor : "#3A4A52"} opacity={on ? 1 : 0.55} />;
            graphic = (
              <svg viewBox="0 0 120 250" width="110" height="250">
                <rect x="18" y="10" width="84" height="230" rx="18" fill={blue} />
                {lamp(62, active === "high", "#2FA36B")}
                {lamp(125, active === "mid", "#F5C451")}
                {lamp(188, active === "low", "#E5484D")}
              </svg>
            );
          } else if (q.graphic === "smiley") {
            const ctrl = 50 + (val / 100) * 34; // 50 frown → 84 smile (kept yellow per request)
            graphic = (
              <svg viewBox="0 0 100 100" width="220" height="220">
                <circle cx="50" cy="50" r="45" fill="#F7D117" stroke="#111" strokeWidth="4" />
                <circle cx="36" cy="42" r="5.5" fill="#111" />
                <circle cx="64" cy="42" r="5.5" fill="#111" />
                <path d={`M32,64 Q50,${ctrl} 68,64`} fill="none" stroke="#111" strokeWidth="5" strokeLinecap="round" />
              </svg>
            );
          } else if (q.graphic === "grade" || q.graphic === "gradeAD") {
            const scale = q.graphic === "gradeAD" ? ["D", "C", "B", "A"] : ["D-", "D", "D+", "C-", "C", "C+", "B-", "B", "B+", "A-", "A", "A+"];
            const g = pick(scale); const letter = g[0]; const sign = g.slice(1);
            graphic = (
              <svg viewBox="0 0 200 200" width="220" height="220">
                <circle cx="100" cy="100" r="95" fill={blue} />
                <text x="100" y="100" fontFamily="var(--sans)" fontWeight="400" fontSize="120" fill="#fff" textAnchor="middle" dominantBaseline="central">
                  {letter}{sign && <tspan fontSize="52" baselineShift="super">{sign}</tspan>}
                </text>
              </svg>
            );
          } else if (q.graphic === "dial") {
            const ang = -90 + val / 100 * 180;
            graphic = (
              <div style={{ width: 180, height: 180, borderRadius: "50%", background: "var(--surface-deep)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--card)", zIndex: 1 }} />
                <div style={{ position: "absolute", width: 5, height: 64, background: "#fff", borderRadius: 3, transformOrigin: "center bottom", bottom: "50%", left: "calc(50% - 2.5px)", transform: `rotate(${ang}deg)` }} />
              </div>
            );
          }
          return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 44, padding: "6px 0", minHeight: 260 }}>
              <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>{graphic}</div>
              <input type="range" min="0" max="100" value={val} onChange={(e) => onChange(Number(e.target.value))}
                style={{ writingMode: "vertical-lr", direction: "rtl", width: 24, height: 240, accentColor: "var(--primary)", cursor: "pointer" }} />
            </div>);
        }
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
            <div style={{ width: 88, height: 88, borderRadius: "50%", background: "var(--surface-deep)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: "var(--card)", zIndex: 1 }} />
              <div style={{ position: "absolute", width: 3, height: 32, background: "#fff", borderRadius: 2, transformOrigin: "bottom center", bottom: "50%", left: "calc(50% - 1.5px)", transform: `rotate(${-90 + val / 100 * 180}deg)` }} />
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <input type="range" min="0" max="100" value={val} onChange={(e) => onChange(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--primary)" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--sans)", fontSize: 15, color: eMUT, marginTop: 4 }}><span>Low</span><span style={{ fontWeight: 400, color: "var(--primary)" }}>{val}</span><span>High</span></div>
            </div>
          </div>);
      })()}

      {/* HOT SPOT — clickable regions on an image */}
      {q.type === "hotspot" && (
        <div style={{ position: "relative", width: "100%", paddingBottom: "50%", borderRadius: 14, overflow: "hidden", background: "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 65%, #000))" }}>
          {q.spots.map((sp, i) => {
            const sel = value === i;
            return <button key={i} onClick={() => onChange(i)} title={sp.label} style={{ position: "absolute", left: sp.x + "%", top: sp.y + "%", transform: "translate(-50%,-50%)", width: 34, height: 34, borderRadius: "50%", border: "2px solid #fff", background: sel ? eGOLD : "rgba(255,255,255,.25)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>{sel && <span style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--card)" }} />}</button>;
          })}
          {typeof value === "number" && <div style={{ position: "absolute", bottom: 10, left: 14, fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: "#fff", background: "rgba(0,15,71,.5)", padding: "4px 10px", borderRadius: 6 }}>{q.spots[value].label}</div>}
        </div>)
      }

      {/* CAPTCHA */}
      {q.type === "captcha" &&
        <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "14px 16px", border: "1px solid " + eLINE, borderRadius: 8, background: eCARD }}>
          <span onClick={() => onChange(!value)} style={{ width: 24, height: 24, borderRadius: 5, border: "2px solid " + (value ? eSUCCESS : "var(--control-line)"), background: value ? eSUCCESS : "#fff", color: "var(--on-accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer" }}>{value && <I.check size={15} />}</span>
          <span onClick={() => onChange(!value)} style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, cursor: "pointer" }}>I'm not a robot</span>
          <span style={{ marginLeft: 14, display: "flex", flexDirection: "column", alignItems: "center", color: eMUT }}><I.shield size={20} /><span style={{ fontFamily: "var(--sans)", fontSize: 15, marginTop: 2 }}>reCAPTCHA</span></span>
        </div>
      }

      {/* TIMING — hidden question: records time on page; admin sets submit/auto-advance timers */}
      {q.type === "timing" && (() => {
        const v = value || {};
        const numField = (label, key) => (
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, marginBottom: 6 }}>{label}</div>
            <input type="number" min="0" value={v[key] ?? 0} onChange={(e) => onChange({ ...v, [key]: e.target.value })}
              onFocus={(e) => e.currentTarget.style.borderColor = eBLUE} onBlur={(e) => e.currentTarget.style.borderColor = "var(--field-line)"}
              style={{ width: 110, height: 44, textAlign: "center", padding: "0 12px", border: "1px solid var(--field-line)", borderRadius: 10, background: eCARD, color: eINK, fontFamily: "var(--sans)", fontSize: 15, outline: "none", boxSizing: "border-box" }} />
          </div>
        );
        return (
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "color-mix(in srgb, var(--ink) 5%, #fff)", color: eMUT, borderRadius: 999, padding: "4px 12px", fontFamily: "var(--sans)", fontSize: 13, marginBottom: 16 }}><I.info size={14} /> Not shown to the participant</div>
            {numField("Enable submit after (seconds)", "submitAfter")}
            {numField("Auto-advance after (seconds)", "autoAdvance")}
          </div>
        );
      })()}

      {/* META INFO — hidden question: records the recipient's browser/device metadata */}
      {q.type === "metainfo" && (
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "color-mix(in srgb, var(--ink) 5%, #fff)", color: eMUT, borderRadius: 999, padding: "4px 12px", fontFamily: "var(--sans)", fontSize: 13, marginBottom: 14 }}><I.info size={14} /> Not shown to the user</div>
          <ul style={{ margin: 0, paddingLeft: 20, fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.9 }}>
            {(q.fields || []).map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        </div>
      )}

      {/* VIDEO RESPONSE */}
      {q.type === "video" && <OaMediaResponse maxDuration={q.maxDuration} value={value} onChange={onChange} />}

      {/* IMAGE CHOICE — pick a graphic, no text labels */}
      {q.type === "imgchoice" && (() => {
        const sel = value;
        return (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14 }}>
            {q.choices.map((c, i) => {
              const on = sel === i;
              return (
                <button key={i} onClick={() => onChange(i)} aria-label={c.alt || ("Option " + (i + 1))} title={c.alt || ""} style={{ position: "relative", padding: 0, border: "2px solid " + (on ? eMID : eLINE), borderRadius: 14, overflow: "hidden", background: "var(--card)", cursor: "pointer", aspectRatio: "4 / 3", display: "block", boxShadow: on ? "0 8px 24px rgba(0,15,71,.16)" : "none", transition: "border-color .15s, box-shadow .15s" }}>
                  {c.img
                    ? <img src={c.img} alt={c.alt || ""} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    : <div style={{ position: "absolute", inset: 0 }} dangerouslySetInnerHTML={{ __html: c.svg }} />}
                  {on &&
                    <span style={{ position: "absolute", top: 10, right: 10, width: 26, height: 26, borderRadius: "var(--lh-radius, 2px)", background: "var(--surface-deep)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,.25)" }}><I.check size={15} /></span>
                  }
                </button>
              );
            })}
          </div>
        );
      })()}
      {/* IMAGE MULTI-SELECT — checkbox + thumbnail + label per choice */}
      {q.type === "imgmulti" && (() => {
        const sel = Array.isArray(value) ? value : [];
        const toggle = (i) => onChange(sel.includes(i) ? sel.filter((x) => x !== i) : sel.concat(i));
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {q.choices.map((c, i) => {
              const on = sel.includes(i);
              return (
                <button key={i} onClick={() => toggle(i)} style={{ display: "flex", alignItems: "center", gap: 14, padding: 12, border: "1px solid " + (on ? eMID : eLINE), borderRadius: 12, background: on ? "rgba(0,15,71,.03)" : "#fff", cursor: "pointer", textAlign: "left", width: "100%" }}>
                  <span style={{ width: 22, height: 22, borderRadius: 5, border: "2px solid " + (on ? eMID : "var(--control-line)"), background: on ? eMID : "#fff", color: "var(--on-accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{on && <I.check size={14} />}</span>
                  <span style={{ width: 52, height: 52, borderRadius: 9, overflow: "hidden", flexShrink: 0, background: eCARD, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {c.img
                      ? <img src={c.img} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      : <I.image size={22} style={{ color: eMUT }} />}
                  </span>
                  <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: on ? eMID : eINK }}>{c.text}</span>
                </button>
              );
            })}
          </div>
        );
      })()}

      {error &&
        <MdsAlert severity="critical" align="center" mt={16}>{error}</MdsAlert>
      }
    </div>
  );
}

function EdOpenAssess({ exercise, onExit, onBack, onNext, hasNext, nextEx, initialStep, initialLayout, initialQIdx, onPos }) {
  const Q = oaInitialQuestions();
  const [step, setStep] = oaUseState(initialStep || "question"); // question | complete
  const taskMin = parseInt((exercise && exercise.time) || "20", 10) || 20;
  const [taskEnd] = oaUseState(() => Date.now() + taskMin * 60000);
  const campaignEnd = new Date(((LH.deadline && LH.deadline.due) || "Jul 24, 2026") + " 23:59:59").getTime();
  const [page, setPage] = oaUseState(0);
  const [qIdx, setQIdx] = oaUseState(initialQIdx || 0); // flat question index for the split (one-per-screen) layout
  const [ans, setAns] = oaUseState({});
  const [errors, setErrors] = oaUseState({}); // { [qid]: message }
  const [layout, setLayout] = oaUseState(() => { if (initialLayout) return initialLayout; try { return localStorage.getItem("ed-assess-layout") || "paged"; } catch (e) { return "paged"; } });
  const [align, setAlign] = oaUseState(() => { try { return localStorage.getItem("ed-assess-align") || "center"; } catch (e) { return "center"; } });
  const chooseAlign = (v) => { setAlign(v); try { localStorage.setItem("ed-assess-align", v); } catch (e) {} };
  const [layoutMenu, setLayoutMenu] = oaUseState(false);
  // scroll containers — reset to top whenever the page / question changes
  const pagedScrollRef = oaUseRef(null);
  const splitQRef = oaUseRef(null);
  const splitARef = oaUseRef(null);
  // Reset to the top of the next question. The inner ref is the scroll container on desktop,
  // but inside the device frame (oa-root is height:100vh, re-anchored to 100%) the OUTER <main>
  // is what actually scrolls — so walk up from the ref and zero every scrollable ancestor, on
  // the next frame so it wins against layout settling / scroll-anchoring.
  const resetScrollTop = (el) => {
    const run = () => {
      let n = el;
      while (n && n !== document.body && n !== document.documentElement) {
        if (n.scrollTop) n.scrollTop = 0;
        n = n.parentElement;
      }
    };
    run();
    requestAnimationFrame(run);
  };
  oaUseEffect(() => { resetScrollTop(pagedScrollRef.current); }, [page]);
  oaUseEffect(() => {
    resetScrollTop(splitQRef.current);
    resetScrollTop(splitARef.current);
  }, [qIdx]);
  // Report the current position (which question / the success screen / layout) so the parent
  // can give each its own URL — lets the team deep-link straight to any step.
  oaUseEffect(() => { if (onPos) onPos({ step, qIdx, page, layout }); }, [step, qIdx, page, layout]);
  const chooseLayout = (v) => { setLayout(v); setLayoutMenu(false); setErrors({}); try { localStorage.setItem("ed-assess-layout", v); } catch (e) {} };

  const total = Q.length;
  const pageNums = [...new Set(Q.map((qq) => qq.page || 1))].sort((a, b) => a - b);
  const pages = pageNums.length;
  const curPage = pageNums[page] || pageNums[0];
  const pageItems = Q.filter((qq) => (qq.page || 1) === curPage);
  const answeredCount = Object.keys(ans).filter((k) => ans[k] !== undefined && ans[k] !== "").length;
  const title = exercise ? exercise.name : "Work Style Preferences";

  // set an answer + clear any standing error for that question
  const setAnswer = (qid, v) => { setAns((p) => ({ ...p, [qid]: v })); setErrors((e) => { if (!e[qid]) return e; const n = { ...e }; delete n[qid]; return n; }); };
  // validate a list of questions; writes errors and returns true if all valid
  const validate = (items) => {
    const errs = {};
    items.forEach((qq) => { const m = oaError(qq, ans[qq.id]); if (m) errs[qq.id] = m; });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // bottom-left chip — switch the survey between the single-page and split-screen layouts (matches the dashboard chips)
  // Portaled to <body> so on iPad it escapes the device frame and sits beside the "All directions" chip (desktop position is unchanged).
  const layoutChip = ReactDOM.createPortal((
    <div className="ed-tasks-layout-chip" style={{ position: "fixed", right: 179, bottom: 14, zIndex: 60 }}>
      {layoutMenu &&
        <div style={{ position: "absolute", bottom: 42, right: 0, width: 256, background: "var(--card)", border: "1px solid var(--line)", borderRadius: 12, boxShadow: "0 10px 34px rgba(0,15,71,.16)", padding: 7, fontFamily: "var(--sans)" }}>
          <div style={{ fontSize: 15, fontWeight: 400, letterSpacing: 0.2, color: "var(--muted)", padding: "7px 9px 5px" }}>Survey layout</div>
          {[{ id: "paged", l: "Single page", d: "Multiple questions per page" }, { id: "split", l: "Split screen", d: "One question \u2014 prompt left, answer right" }].map((o) => {
            const on = layout === o.id;
            return (
              <button key={o.id} onClick={() => chooseLayout(o.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 9px", borderRadius: 8, border: "none", background: on ? "color-mix(in srgb, var(--accent) 6%, transparent)" : "transparent", cursor: "pointer", textAlign: "left" }}>
                <span style={{ width: 16, display: "flex", justifyContent: "center", color: "var(--accent)" }}>{on ? <I.check size={15} /> : null}</span>
                <span style={{ flex: 1 }}>
                  <span style={{ display: "block", fontSize: 15, fontWeight: 400, color: on ? "var(--primary)" : "var(--ink)" }}>{o.l}</span>
                  <span style={{ display: "block", fontSize: 15, color: "var(--muted)" }}>{o.d}</span>
                </span>
              </button>);
          })}
          {layout === "split" &&
            <React.Fragment>
              <div style={{ height: 1, background: "var(--track)", margin: "5px 4px" }} />
              <div style={{ fontSize: 15, fontWeight: 400, letterSpacing: 0.2, color: "var(--muted)", padding: "7px 9px 5px" }}>Alignment</div>
              {[{ id: "center", l: "Centered", d: "Prompt & answer centered" }, { id: "left", l: "Left", d: "Prompt & answer left-aligned" }].map((o) => {
                const on = align === o.id;
                return (
                  <button key={o.id} onClick={() => chooseAlign(o.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 9px", borderRadius: 8, border: "none", background: on ? "color-mix(in srgb, var(--accent) 6%, transparent)" : "transparent", cursor: "pointer", textAlign: "left" }}>
                    <span style={{ width: 16, display: "flex", justifyContent: "center", color: "var(--accent)" }}>{on ? <I.check size={15} /> : null}</span>
                    <span style={{ flex: 1 }}>
                      <span style={{ display: "block", fontSize: 15, fontWeight: 400, color: on ? "var(--primary)" : "var(--ink)" }}>{o.l}</span>
                      <span style={{ display: "block", fontSize: 15, color: "var(--muted)" }}>{o.d}</span>
                    </span>
                  </button>);
              })}
            </React.Fragment>
          }
        </div>
      }
      <button onClick={() => setLayoutMenu((v) => !v)} title="Switch survey layout"
        style={{ display: "inline-flex", alignItems: "center", gap: 6, background: layoutMenu ? "#fff" : "rgba(255,255,255,.72)", color: layoutMenu ? "var(--primary)" : "var(--muted)", border: "1px solid var(--line)", borderRadius: 8, padding: "6px 11px", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,15,71,.06)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", opacity: layoutMenu ? 1 : 0.62, transition: "opacity .15s, color .15s, background .15s" }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.color = "var(--primary)"; }}
        onMouseLeave={(e) => { if (!layoutMenu) { e.currentTarget.style.opacity = 0.62; e.currentTarget.style.color = "var(--muted)"; } }}>
        <I.panel size={14} /> {layout === "split" ? "Split screen" : "Single page"}
      </button>
    </div>), document.body);

  // ── COMPLETE ──
  if (step === "complete") return (
    <div style={{ width: "100%", flex: "1 1 auto", minHeight: "100vh", background: eCREAM, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
      <div style={{ textAlign: "center", maxWidth: 480, background: eCARD, border: "1px solid " + eLINE, borderRadius: 20, padding: "52px 44px", boxShadow: "0 12px 40px rgba(0,15,71,.08)" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--success-fill)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 8px 28px rgba(20,133,61,.3)", color: "#fff" }}><I.check size={34} /></div>
        <h1 className="serif" style={{ fontSize: 28, color: eMID, lineHeight: 1.08, margin: "0 0 10px" }}>Task complete</h1>
        <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.6, margin: "0 0 28px" }}>Your response has been saved.</p>
        {hasNext && nextEx ? (
          <React.Fragment>
            <div className="oa-upnext" style={{ textAlign: "left", background: "color-mix(in srgb, var(--accent) 5%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 18%, transparent)", borderRadius: 14, padding: "16px 18px", marginBottom: 16 }}>
              <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, letterSpacing: 0.3, color: eMUT, marginBottom: 6 }}>Up next</div>
              <div className="serif" style={{ fontSize: 21, color: eMID, lineHeight: 1.2, marginBottom: 5 }}>{nextEx.name}</div>
              <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.5, margin: 0 }}>{nextEx.desc}</p>
              {nextEx.time && nextEx.time !== "\u2014" && <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 10, fontFamily: "var(--sans)", fontSize: 15, color: eMUT }}><I.clock size={13} /> {nextEx.time}</div>}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <EdBtn primary full onClick={onNext}>Go to next task <I.arrow size={16} /></EdBtn>
              <EdBtn full onClick={onExit}>Return to program</EdBtn>
            </div>
          </React.Fragment>
        ) : (
          <EdBtn primary full onClick={onExit}>Return to program <I.arrow size={16} /></EdBtn>
        )}
      </div>
    </div>);


  // ── SPLIT-SCREEN VIEW (one question per screen — prompt left, answer right) ──
  if (layout === "split") {
    const curQ = Q[qIdx];
    return (
      <div className="oa-root" style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", background: eCREAM }}>
        <div style={{ flexShrink: 0, background: "var(--card)", borderBottom: "1px solid " + eLINE, padding: "10px 28px" }}>
          <div className="oa-headrow" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => { if (qIdx > 0) setQIdx(qIdx - 1); else (onBack || onExit)(); }} className="oa-back" style={{ background: "none", border: "none", cursor: "pointer", color: eMUT, padding: 4, display: "flex", flexShrink: 0 }}><I.arrowL size={18} /></button>
            <h1 className="serif oa-headtitle" style={{ fontSize: 21, color: eMID, lineHeight: 1.1, margin: 0, marginRight: "auto" }}>{title}</h1>
            <div className="oa-timers" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <OaCountdown end={taskEnd} label="This task" danger compact />
              <OaCountdown end={campaignEnd} label="Program" compact />
            </div>
            <button onClick={onExit} className="oa-exit" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: eMID, fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, padding: "4px 6px", flexShrink: 0 }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg> Exit</button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 10 }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", height: 4, overflow: "hidden" }}>
              <div style={{ width: `${(qIdx + 1) / total * 100}%`, height: "100%", background: "var(--pl-fill)", flexShrink: 0, transition: "width .35s ease" }} />
              {qIdx + 1 < total && <div style={{ width: 2, flexShrink: 0 }} />}
              <div style={{ flex: 1, height: "100%", background: "#94918C" }} />
            </div>
            <span style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT, whiteSpace: "nowrap", flexShrink: 0 }}>{answeredCount}/{total} answered</span>
          </div>
        </div>

        {/* split view: full-height two panes — question left, answer right */}
        <div className="oa-split" style={{ flex: 1, display: "flex", flexDirection: "row", overflow: "hidden" }}>
          {/* LEFT: question prompt */}
          <div className="oa-split-q" ref={splitQRef} style={{ width: "42%", flexShrink: 0, overflowY: "auto", background: "var(--card)", borderRight: "1px solid " + eLINE, padding: "48px 52px", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
            <div style={{ maxWidth: 560, width: "100%", margin: 0, textAlign: "left" }}>
              <h2 className="serif" style={{ fontSize: 18, color: eMID, lineHeight: 1.3, margin: 0 }}>{curQ.prompt}</h2>
            </div>
          </div>
          {/* RIGHT: answer area */}
          <div className="oa-split-a" ref={splitARef} style={{ flex: 1, minWidth: 0, overflowY: "auto", background: eCREAM, padding: "48px 52px 120px" }}>
            <div style={{ maxWidth: 640, width: "100%", margin: align === "center" ? "0 auto" : 0 }}>
              <OaQuestionCard key={curQ.id} q={curQ} number={qIdx + 1} value={ans[curQ.id]} onChange={(v) => setAnswer(curQ.id, v)} error={errors[curQ.id]} hidePrompt narrow />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginTop: 24 }}>
                <div style={{ display: "flex", gap: 12 }}>
                  {qIdx > 0 &&
                    <button onClick={() => setQIdx(qIdx - 1)} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: eMID, border: "1.5px solid " + eMID, borderRadius: 10, padding: "12px 22px", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Previous</button>
                  }
                  <button onClick={onExit} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: eMID, border: "1.5px solid " + eMID, borderRadius: 10, padding: "12px 22px", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Save</button>
                </div>
                {qIdx < total - 1 ?
                  <EdBtn primary onClick={() => { if (validate([curQ])) setQIdx(qIdx + 1); }}>Next <I.arrow size={16} /></EdBtn> :
                  <button onClick={() => { if (validate([curQ])) setStep("complete"); }} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: "var(--primary)", color: "#fff", border: "none", borderRadius: 10, padding: "12px 26px", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Submit <I.check size={16} /></button>
                }
              </div>
            </div>
          </div>
        </div>
        {layoutChip}
      </div>);
  }

  // ── QUESTION VIEW (stacked, paged) ──
  return (
    <div className="oa-root" style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", background: eCREAM }}>
      {/* top bar: row 1 = arrow + heading (left), timers + save (right); row 2 = progress bar + page/answered */}
      <div style={{ flexShrink: 0, background: "var(--card)", borderBottom: "1px solid " + eLINE, padding: "10px 28px" }}>
        <div className="oa-headrow" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => { if (page > 0) setPage(page - 1); else (onBack || onExit)(); }} className="oa-back" style={{ background: "none", border: "none", cursor: "pointer", color: eMUT, padding: 4, display: "flex", flexShrink: 0 }}><I.arrowL size={18} /></button>
          <h1 className="serif oa-headtitle" style={{ fontSize: 21, color: eMID, lineHeight: 1.1, margin: 0, marginRight: "auto" }}>{title}</h1>
          <div className="oa-timers" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <OaCountdown end={taskEnd} label="This task" danger compact />
            <OaCountdown end={campaignEnd} label="Program" compact />
          </div>
          <button onClick={onExit} className="oa-exit" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: eMID, fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, padding: "4px 6px", flexShrink: 0 }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg> Exit</button>
                  </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 10 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", height: 4, overflow: "hidden" }}>
            <div style={{ width: `${(page + 1) / pages * 100}%`, height: "100%", background: "var(--pl-fill)", flexShrink: 0, transition: "width .35s ease" }} />
            {page + 1 < pages && <div style={{ width: 2, flexShrink: 0 }} />}
            <div style={{ flex: 1, height: "100%", background: "#94918C" }} />
          </div>
          <span style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT, whiteSpace: "nowrap", flexShrink: 0 }}>{answeredCount}/{total} answered</span>
        </div>
      </div>

      {/* stacked single column */}
      <div ref={pagedScrollRef} style={{ flex: 1, overflowY: "auto", padding: "32px 0 120px" }}>
        <div style={{ maxWidth: "calc(var(--content-max) + 56px)", margin: "0 auto", padding: "0 28px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {pageItems.map((q) => {
              const num = Q.indexOf(q) + 1;
              return <OaQuestionCard key={q.id} q={q} number={num} value={ans[q.id]} onChange={(v) => setAnswer(q.id, v)} error={errors[q.id]} />;
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginTop: 28 }}>
            <div style={{ display: "flex", gap: 12 }}>
              {page > 0 &&
                <button onClick={() => setPage(page - 1)} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: eMID, border: "1.5px solid " + eMID, borderRadius: 10, padding: "12px 22px", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Previous</button>
              }
              <button onClick={onExit} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: eMID, border: "1.5px solid " + eMID, borderRadius: 10, padding: "12px 22px", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Save</button>
            </div>
            {page < pages - 1 ?
              <EdBtn primary onClick={() => { if (validate(pageItems)) setPage(page + 1); }}>Next <I.arrow size={16} /></EdBtn> :
              <button onClick={() => { if (validate(pageItems)) setStep("complete"); }} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: "var(--primary)", color: "#fff", border: "none", borderRadius: 10, padding: "12px 26px", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Submit <I.check size={16} /></button>
            }
          </div>
        </div>
      </div>
      {layoutChip}
    </div>);

}

window.EdAssess = { EdOpenAssess, EdAssessIntro, EdConsent };