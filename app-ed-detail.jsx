// ════════════════════════════════════════════════
//  DIRECTION A — "Beacon" (Editorial) · PROGRAM DETAIL PAGES
//  Content lifted from lighthouse-v5.jsx (Instructions, Program
//  tasks, Assessment Center, Proctored system check), re-skinned in
//  the Editorial system: midnight rail, warm cream canvas, Marsh
//  Serif headlines, gold actions, thin editorial rules.
//  Exports: window.EdDetail = { EdInstructions, EdTasks, EdCenter, EdPreCheck }
// ════════════════════════════════════════════════

const { useState: edUseState } = React;

const eMID = "var(--primary)",eCREAM = "var(--canvas)",eINK = "var(--ink)",eMUT = "var(--muted)",
  eLINE = "var(--line)",eCARD = "#fff",eBLUE = "var(--accent)",eGOLD = "var(--action)",
  eSKY = "#CEECFF",ePURP = "#8F20DE",eSUCCESS = "var(--success)",eWARN = "#CB7E03",eDANGER = "var(--danger)";

function EdRing2({ pct, size = 18, stroke = 2.5, color = eBLUE, track = "rgba(0,15,71,.12)" }) {
  const r = (size - stroke) / 2,c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
      strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} strokeLinecap="round"
      transform={`rotate(-90 ${size / 2} ${size / 2})`} />
    </svg>);

}

function EdBack({ label, onClick }) {
  const top = /^Back to (programs|program|dashboard|tasks)$/.test(label || "");
  return (
    <button onClick={onClick} className={"ed-back" + (top ? " ed-pageback" : "")} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "none", border: "none", cursor: "pointer", color: "var(--primary)", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, padding: "4px 0", marginBottom: 22 }}>
      <I.arrowL size={17} /> {label}
    </button>);

}

function EdEyebrow({ children, color = eBLUE }) {
  return <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, letterSpacing: 0.2, color, marginBottom: 12 }}>{children}</div>;
}

function EdSectionLabel({ children }) {
  return <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, letterSpacing: 0.2, color: eMUT, marginBottom: 4 }}>{children}</div>;
}

function EdBtn({ children, primary, small, disabled, onClick, full }) {
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    fontFamily: "var(--sans)", fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
    borderRadius: 10, padding: small ? "8px 14px" : "12px 18px", fontSize: small ? 14 : 14,
    width: full ? "100%" : "auto", opacity: disabled ? 0.5 : 1, transition: "filter .15s"
  };
  const style = primary ?
  { ...base, background: eGOLD, color: "var(--action-text)", border: "none" } :
  { ...base, background: "transparent", color: eMID, border: "1.5px solid " + eMID };
  return <button style={style} disabled={disabled} onClick={disabled ? undefined : onClick} data-comment-anchor="562fd0fb97-button-54-10">{children}</button>;
}

// ── status helpers ──
const edStatusMeta = {
  complete: { label: "Done", color: eSUCCESS, bg: "rgba(20,133,61,.10)" },
  progress: { label: "In progress", color: eBLUE, bg: "color-mix(in srgb, var(--accent) 10%, var(--card))" },
  notstarted: { label: "Not started", color: eWARN, bg: "rgba(203,126,3,.10)" },
  locked: { label: "Locked", color: eMUT, bg: "rgba(123,121,116,.12)" }
};

function EdBadge({ status }) {
  const m = edStatusMeta[status] || edStatusMeta.locked;
  return <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: m.color, background: m.bg, padding: "4px 11px", borderRadius: 6, whiteSpace: "nowrap" }}>{m.label}</span>;
}

// ── universal exercise / center row ──
function EdRow({ item, accent, onClick }) {
  const st = item._status || item.status;
  const locked = st === "locked";
  const active = st === "progress" || st === "notstarted";
  const Ic = st === "complete" ? I.checkCircle : locked ? I.lock : null;
  const col = accent || eBLUE;
  return (
    <div onClick={locked ? undefined : onClick}
    style={{ display: "flex", alignItems: "center", gap: 16, background: eCARD, border: "1px solid " + eLINE, borderRadius: 14, padding: "16px 18px", opacity: locked ? 0.6 : 1, cursor: locked || !onClick ? "default" : "pointer" }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
        background: st === "complete" ? "rgba(20,133,61,.10)" : locked ? "rgba(123,121,116,.10)" : col + "18",
        color: st === "complete" ? eSUCCESS : locked ? eMUT : col }}>
        {Ic ? <Ic size={20} /> : <EdRing2 pct={item.pct || 0} size={24} stroke={3} color={col} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: eMID }}>{item.name}</span>
          {item.proctored && <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: ePURP, background: "rgba(143,32,222,.10)", padding: "2px 8px", borderRadius: 5, display: "inline-flex", alignItems: "center", gap: 4 }}><I.shield size={12} /> Proctored</span>}
          {item.hasReport && <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eBLUE, background: "color-mix(in srgb, var(--accent) 10%, var(--card))", padding: "2px 8px", borderRadius: 5 }}>Report ready</span>}
        </div>
        {item.desc && <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.5, marginTop: 3, maxWidth: 460 }}>{item.desc}</div>}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 7 }}>
          <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, display: "inline-flex", alignItems: "center", gap: 4 }}><I.clock size={14} /> {item.time}</span>
          {item.extra && <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT }}>{item.extra}</span>}
          {st === "progress" && <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: col }}>{item.pct}%</span>}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, flexShrink: 0 }}>
        <EdBadge status={st} />
        {active && onClick && <EdBtn small primary onClick={onClick}>{(item.pct || 0) > 0 ? "Continue" : "Start"} <I.arrow size={15} /></EdBtn>}
      </div>
    </div>);

}

// real topical photos per card (stable Unsplash CDN), keyed by exercise id
const EDCARD_PHOTOS = {
  sim: "1517048676732-d65bc937f952", lac: "1542744173-8e7e53415bb0",
  hogan: "1507003211169-0a1dd7228f2d", cognitive: "1456406644174-8ddd4cd52a06",
  interview: "1573497019940-1c28c88b4f3e", thriving: "1506126613408-eca07ce68773",
  self: "1517245386807-bb43f82c33c4", sjt: "1521737711867-e3b97375f902",
  self360: "1600880292203-757bb62b4baf", nominate: "1552664730-d307ca884978",
  track: "1551288049-bebda4e38f71",
  // assessment-center activities (reuse known-good photo hashes)
  pre: "1454165804606-c3d57bc86b40", s1: "1456406644174-8ddd4cd52a06",
  s2: "1573497019940-1c28c88b4f3e", s3: "1517048676732-d65bc937f952",
  brief: "1506126613408-eca07ce68773", group: "1542744173-8e7e53415bb0",
  roleplay: "1521737711867-e3b97375f902", case: "1507003211169-0a1dd7228f2d"
};
const edPhoto = (id) => EDCARD_PHOTOS[id] ? `https://images.unsplash.com/photo-${EDCARD_PHOTOS[id]}?w=640&h=300&fit=crop&q=72` : null;

// ── reference-style feature card: image header · title · desc · progress · footer ──
function EdCard({ item, accent, icon, image, segTotal, segDone, onClick }) {
  const st = item._status || item.status;
  const locked = st === "locked";
  const active = st === "progress" || st === "notstarted";
  const isComplete = st === "complete";
  const isError = st === "error";
  const pct = item.pct || 0;
  const col = accent || eBLUE;
  const imgSrc = image || edPhoto(item.id) || `images/cards/${item.id}.jpg`;

  // progress label + bar — always percentage style for consistency
  const useSegments = typeof segTotal === "number" && segTotal > 0;
  const barPct = isComplete ? 100 : useSegments ? Math.round((segDone / segTotal) * 100) : pct;
  const progLabel = isError ? "Action required" : isComplete ? "Completed" : st === "notstarted" ? "Not started" : st === "locked" ? "Locked" : `${barPct}% done`;

  return (
    <div onClick={locked ? undefined : onClick}
    style={{ display: "flex", flexDirection: "column", flex: "1 0 auto", background: eCARD, border: "1px solid " + (isError ? eDANGER : eLINE), borderRadius: 16, overflow: "hidden", opacity: locked ? 0.62 : 1, cursor: locked || !onClick ? "default" : "pointer", transition: "border-color .15s, transform .15s" }}
    onMouseEnter={(e) => {if (!locked && !isError && onClick) {e.currentTarget.style.borderColor = "rgba(0,15,71,.38)";e.currentTarget.style.transform = "translateY(-2px)";}}}
    onMouseLeave={(e) => {e.currentTarget.style.borderColor = isError ? eDANGER : eLINE;e.currentTarget.style.transform = "none";}}>

      {/* feature image */}
      <div style={{ position: "relative", height: 104, overflow: "hidden", background: "var(--surface-deep)", borderBottom: "1px solid " + (isError ? eDANGER : eLINE) }}>
        <img src={imgSrc} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", filter: locked ? "grayscale(.5) saturate(.6)" : isError ? "grayscale(.35) saturate(.7)" : "none" }} />
        {isError && <div style={{ position: "absolute", inset: 0, background: "rgba(197,53,50,.32)", mixBlendMode: "multiply" }} />}
        {/* badges */}
        <div style={{ position: "absolute", top: 12, left: 14, display: "flex", gap: 7, flexWrap: "wrap" }}>
          {item.proctored && <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: "#fff", background: "var(--surface-deep)", padding: "3px 9px", borderRadius: 6, display: "inline-flex", alignItems: "center", gap: 4 }}><I.shield size={12} /> Proctored</span>}
          {item.hasReport && <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eMID, background: "var(--card)", padding: "3px 9px", borderRadius: 6 }}>Report ready</span>}
        </div>
        <div style={{ position: "absolute", top: 12, right: 14 }}>
          {isComplete ? <span style={{ width: 26, height: 26, borderRadius: 13, background: "var(--success-fill)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}><I.check size={15} /></span> :
          isError ? <span style={{ width: 26, height: 26, borderRadius: 13, background: "var(--danger-fill)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}><I.alertCircle size={15} /></span> :
          locked ? <span style={{ width: 26, height: 26, borderRadius: 13, background: "var(--surface-deep)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}><I.lock size={13} /></span> :
          null}
        </div>
      </div>

      {/* body */}
      <div style={{ padding: "14px 16px 15px", display: "flex", flexDirection: "column", flex: 1 }}>
        <h3 style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: eMID, margin: "0 0 10px", lineHeight: 1.25 }}>{item.name}</h3>

        {/* progress */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eMUT }}>Progress</span>
          <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: isError ? eDANGER : isComplete ? eSUCCESS : st === "notstarted" || locked ? eMUT : col }}>{progLabel}</span>
        </div>
        <div style={{ height: 4, borderRadius: 2, background: "var(--track)", overflow: "hidden", marginBottom: 12 }}>
          <div style={{ width: `${barPct}%`, height: "100%", borderRadius: 2, background: isError ? eDANGER : isComplete ? eSUCCESS : col }} />
        </div>

        {/* footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: "auto", paddingTop: 10 }}>
          <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, display: "inline-flex", alignItems: "center", gap: 5 }}><I.clock size={14} /> {item.time}</span>
          {locked ?
          <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eMUT, display: "inline-flex", alignItems: "center", gap: 5 }}><I.lock size={13} /> Locked</span> :
          isError ?
          <button onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--danger-fill)", color: "#fff", border: "none", borderRadius: 10, padding: "9px 17px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Retry <I.arrow size={14} /></button> :
          isComplete ?
          <button onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", color: eMID, border: "1.5px solid " + eMID, borderRadius: 10, padding: "8px 16px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: onClick ? "pointer" : "default" }}>Review</button> :

          <button onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--primary)", color: "var(--on-accent)", border: "none", borderRadius: 10, padding: "9px 17px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{pct > 0 ? "Continue" : "Start"} <I.arrow size={14} /></button>
          }
        </div>
      </div>
    </div>);

}

// ════════════════════════════════════════════════
//  INSTRUCTIONS
// ════════════════════════════════════════════════
function EdInstructions({ prog, watched, onWatch, acked, onContinue, onBack }) {
  const d = prog.detail;
  const [instructionsRead, setInstructionsRead] = React.useState(false);
  const t = window.t || ((k) => k);
  return (
    <div style={{ maxWidth: "var(--content-max)", margin: "36px var(--fol-mx) 72px", padding: 0 }}>
      <EdEyebrow color={eMUT}>{t("programInstructions")}</EdEyebrow>
      <h1 className="serif" style={{ fontSize: 44, color: eMID, lineHeight: 1.06, margin: "0 0 10px" }}>{prog.name}</h1>
      <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.6, margin: "0 0 32px", maxWidth: 600 }}>{t("watchTheShortIntroduction")}</p>

      {/* intro video */}
      <div onClick={onWatch} style={{ position: "relative", width: "100%", paddingBottom: "50%", borderRadius: 16, overflow: "hidden", background: "var(--surface-deep)", marginBottom: 28, cursor: "pointer" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(120% 120% at 20% 0%, ${"rgba(206,236,255,.22)"}, transparent 55%), linear-gradient(135deg, var(--surface-deep), #001F8C)` }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
          {watched ?
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(20,133,61,.92)", padding: "9px 18px", borderRadius: 22 }}>
              <I.check size={17} /><span style={{ color: "#fff", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700 }}>{t("introductionWatched")}</span>
            </div> :

          <React.Fragment>
              <div style={{ width: 60, height: 60, borderRadius: 30, background: eSKY, color: "#0B1220", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 28px rgba(0,0,0,.3)" }}><I.play size={24} /></div>
              <span style={{ color: "#fff", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600 }}>{t("watchIntroductionVideo")} ({d.videoLen})</span>
            </React.Fragment>
          }
        </div>
      </div>

      {/* before you begin */}
      <div style={{ borderTop: "1px solid " + eLINE, paddingTop: 24, marginBottom: 28 }}>
        <EdSectionLabel>{t("beforeYouBegin")}</EdSectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 16 }}>
          {d.instructions.map((pt, i) =>
          <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div className="serif" style={{ width: 30, height: 30, borderRadius: 8, background: "color-mix(in srgb, var(--accent) 10%, var(--card))", color: eBLUE, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16 }}>{i + 1}</div>
              <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.6, margin: 0, flex: 1 }}>{window.tInstruction ? window.tInstruction(pt) : pt}</p>
            </div>
          )}
        </div>
      </div>

      {!acked ?
      <React.Fragment>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <input type="checkbox" id="instructions-read" checked={instructionsRead} onChange={(e) => setInstructionsRead(e.target.checked)} style={{ width: 18, height: 18, cursor: "pointer" }} />
          <label htmlFor="instructions-read" style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, cursor: "pointer", margin: 0 }}>{t("iHaveReadInstructions")}</label>
        </div>
        <EdBtn primary full disabled={!instructionsRead} onClick={onContinue}>
          {t("continue")}
        </EdBtn>
      </React.Fragment> :

      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 16px", background: "rgba(20,133,61,.08)", border: "1px solid rgba(20,133,61,.20)", borderRadius: 12 }}>
          <span style={{ color: eSUCCESS, display: "flex" }}><I.check size={18} /></span>
          <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eSUCCESS, fontWeight: 600 }}>{t("instructionsAcknowledged")}</span>
        </div>
      }
    </div>);

}

// ════════════════════════════════════════════════
//  PROGRAM TASKS — hero + centers + sequential + open
// ════════════════════════════════════════════════

// parse "90 min" / "3 hr" / "1h 30m" → milliseconds
const edParseDuration = (s) => {
  if (!s) return 0;
  const str = String(s).toLowerCase(); let ms = 0;
  const h = str.match(/(\d+)\s*(?:hr|hour|h)\b/); if (h) ms += parseInt(h[1], 10) * 3600000;
  const m = str.match(/(\d+)\s*(?:min|minute|m)\b/); if (m) ms += parseInt(m[1], 10) * 60000;
  if (!ms) { const n = parseInt(str, 10); if (n) ms = n * 60000; }
  return ms;
};

// live countdown shown once a timed center has been reserved
function CenterTimer({ end }) {
  const [now, setNow] = edUseState(Date.now());
  React.useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const diff = Math.max(0, end - now);
  const over = diff <= 0;
  const h = Math.floor(diff / 3600000), m = Math.floor(diff % 3600000 / 60000), s = Math.floor(diff % 60000 / 1000);
  const txt = String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: over ? eDANGER : eBLUE, background: over ? "rgba(197,53,50,.08)" : "color-mix(in srgb, var(--accent) 7%, transparent)", border: "1px solid " + (over ? "rgba(197,53,50,.28)" : "color-mix(in srgb, var(--accent) 18%, transparent)"), padding: "4px 10px", borderRadius: 7, fontVariantNumeric: "tabular-nums" }}><I.clock size={14} /> {over ? "Time's up" : txt + " left"}</span>;
}

function EdTasks({ prog, onBack, onOpenCenter, onProctored, onOpenAssess, onSchedule, heroStyle = "light", tasksLayout = "standard" }) {
  const d = prog.detail;
  const all = [...d.centers, ...d.sequential, ...d.open];
  const done = all.filter((e) => e.status === "complete").length;
  const active = all.filter((e) => e.status === "progress").length;

  // sequential gating: first non-complete is active; everything after is locked
  let lockedFrom = false;
  const seq = d.sequential.map((ex) => {
    if (ex.status === "complete") return { ...ex, _status: "complete" };
    if (!lockedFrom) {lockedFrom = true;return { ...ex, _status: ex.status === "progress" ? "progress" : "notstarted" };}
    return { ...ex, _status: "locked" };
  });

  const centerPct = (c) => Math.round(c.activities.filter((a) => a.status === "complete").length / c.activities.length * 100);

  const stats = [{ v: all.length, l: "Task Assigned" }, { v: active, l: "Active" }, { v: done, l: "Done" }];

  // tabs: Intro (instructions, read-only) · Tasks (exercises) · Reports (completed reports)
  const [tab, setTab] = edUseState("tasks");
  const [started, setStarted] = edUseState(false); // gated layout: has "Begin assessment" been clicked
  const [reportPreview, setReportPreview] = edUseState(null);
  // reserved slots for timed centers — SESSION ONLY (in-memory): resets to default
  // ("Reserve your spot" + "View Detail") on reload / back / logout / login.
  const [reserveAt, setReserveAt] = edUseState(() => {
    try {
      const seed = window.__ED_RESERVE;
      if (seed && seed[prog.id]) {
        const now = Date.now(), out = {};
        seed[prog.id].forEach((id) => { out[id] = now; });
        return out;
      }
    } catch (e) {}
    return {};
  });
  const reserveCenter = (c) => {
    const ts = Date.now();
    setReserveAt((p) => ({ ...p, [c.id]: ts }));
  };
  const progReports = (LH.reportsFull || []).filter((r) => {
    const key = (r.program || "").split(" ")[0];
    return r.available && key && prog.name.indexOf(key) !== -1;
  });

  // ── hero variants ──
  const heroMidnight =
  <div style={{ background: "var(--surface-deep)", borderRadius: 20, padding: "34px 36px", position: "relative", overflow: "hidden", marginBottom: 40 }}>
      <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "rgba(206,236,255,.07)" }} />
      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eSKY, background: "rgba(206,236,255,.14)", padding: "4px 11px", borderRadius: 6 }}>In progress</span>
        </div>
        <h1 className="serif" style={{ fontSize: 40, color: "#fff", lineHeight: 1.06, margin: "0 0 12px", maxWidth: 560 }}>{prog.name}</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 26, flexWrap: "wrap" }}>
          {stats.map((m, i) =>
        <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span className="serif" style={{ fontSize: 30, color: i === 1 ? eGOLD : i === 2 ? eSKY : "#fff" }}>{m.v}</span>
              <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: "rgba(255,255,255,.82)" }}>{m.l}</span>
            </div>
        )}
          <div style={{ flex: 1, minWidth: 100 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10, width: 180 }}>
            <div style={{ flex: 1, height: 7, borderRadius: 4, background: "rgba(255,255,255,.14)", overflow: "hidden" }}>
              <div style={{ width: `${prog.pct}%`, height: "100%", borderRadius: 4, background: eSKY }} />
            </div>
            <span className="serif" style={{ fontSize: 18, color: eSKY }}>{prog.pct}%</span>
          </div>
        </div>
      </div>
    </div>;


  const heroLight =
  <div style={{ background: eCARD, border: "1px solid " + eLINE, borderRadius: 20, padding: "32px 34px", marginBottom: 40 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eBLUE, background: "color-mix(in srgb, var(--accent) 10%, var(--card))", padding: "4px 11px", borderRadius: 6 }}>In progress</span>
      </div>
      <h1 className="serif" style={{ fontSize: 40, color: eMID, lineHeight: 1.06, margin: "0 0 12px", maxWidth: 560 }}>{prog.name}</h1>
      <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 24, flexWrap: "wrap" }}>
        {stats.map((m, i) =>
      <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span className="serif" style={{ fontSize: 30, color: i === 1 ? eBLUE : eMID }}>{m.v}</span>
            <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT }}>{m.l}</span>
          </div>
      )}
        <div style={{ flex: 1, minWidth: 100 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, width: 180 }}>
          <div style={{ flex: 1, height: 7, borderRadius: 4, background: "var(--track)", overflow: "hidden" }}>
            <div style={{ width: `${prog.pct}%`, height: "100%", borderRadius: 4, background: eBLUE }} />
          </div>
          <span className="serif" style={{ fontSize: 18, color: eBLUE }}>{prog.pct}%</span>
        </div>
      </div>
    </div>;


  const heroMinimal =
  <div style={{ marginBottom: 40 }}>
      <span style={{ display: "inline-block", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eBLUE, background: "color-mix(in srgb, var(--accent) 10%, var(--card))", padding: "4px 11px", borderRadius: 6, marginBottom: 14 }}>In progress</span>
      <h1 className="serif" style={{ fontSize: 48, color: eMID, lineHeight: 1.02, margin: "0 0 24px", maxWidth: 620 }}>{prog.name}</h1>
      <div className="ed-hstats" style={{ display: "flex", alignItems: "center", padding: "4px 0 0" }}>
        {stats.map((m, i) =>
      <div key={i} className="ed-hstat" style={{ paddingRight: 32, marginRight: 32, borderRight: "1px solid " + eLINE }}>
            <span className="serif" style={{ fontSize: 32, color: eMID, lineHeight: 1 }}>{m.v}</span>
            <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, marginLeft: 8 }}>{m.l}</span>
          </div>
      )}
        <div className="ed-hspacer" style={{ flex: 1 }} />
        <div className="ed-hprog" style={{ display: "flex", alignItems: "center", gap: 10, width: 180 }}>
          <div style={{ flex: 1, height: 6, borderRadius: 4, background: "var(--track)", overflow: "hidden" }}>
            <div style={{ width: `${prog.pct}%`, height: "100%", borderRadius: 4, background: "var(--accent)" }} />
          </div>
          <span className="serif" style={{ fontSize: 18, color: eMID }}>{prog.pct}%</span>
        </div>
      </div>
    </div>;


  // ── NEW: "Minimal 2" — a compact take on Minimal. Colored stat figures
  // (blue / purple / green), smaller numbers, the progress moved up beside the
  // status badge, and tighter vertical rhythm so the block takes less height. ──
  const heroMinimal2 =
  <div style={{ marginBottom: 30 }}>
      {/* title + inline status chip (state belongs to the program) */}
      <div style={{ display: "flex", alignItems: "center", gap: 13, flexWrap: "wrap", rowGap: 8, marginBottom: 15 }}>
        <h1 className="serif" style={{ fontSize: 44, color: eMID, lineHeight: 1.02, margin: 0, maxWidth: 560 }}>{prog.name}</h1>
        <span style={{ display: "inline-block", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eBLUE, background: "color-mix(in srgb, var(--accent) 10%, var(--card))", padding: "4px 11px", borderRadius: 6 }}>In progress</span>
      </div>
      {/* data line: progress summary leads, then the task breakdown (wraps on mobile) */}
      <div className="ed-hstats" style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", rowGap: 10 }}>
        <div className="ed-hprog" style={{ display: "flex", alignItems: "center", gap: 10, width: 172, flexShrink: 0 }}>
          <div style={{ flex: 1, height: 6, borderRadius: 4, background: "color-mix(in srgb, var(--ink) 14%, transparent)", overflow: "hidden" }}>
            <div style={{ width: `${prog.pct}%`, height: "100%", borderRadius: 4, background: eMID }} />
          </div>
          <span className="serif" style={{ fontSize: 17, color: eMID, lineHeight: 1 }}>{prog.pct}%</span>
        </div>
        <div style={{ width: 1, height: 22, background: eLINE, flexShrink: 0 }} />
        <div style={{ display: "flex", alignItems: "baseline" }}>
          {stats.map((m, i) => {
            const c = i === 0 ? eBLUE : i === 1 ? "var(--accent-2)" : eSUCCESS;
            return (
          <div key={i} className="ed-hstat" style={{ display: "flex", alignItems: "baseline", gap: 6, paddingLeft: i ? 16 : 0, marginLeft: i ? 16 : 0, borderLeft: i ? "1px solid " + eLINE : "none" }}>
                <span className="serif" style={{ fontSize: 24, color: c, lineHeight: 1 }}>{m.v}</span>
                <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT }}>{m.l}</span>
              </div>);
          })}
        </div>
      </div>
    </div>;


  const heroCompact =
  <div style={{ display: "flex", gap: 16, marginBottom: 34 }}>
      <div style={{ width: 4, borderRadius: 3, background: prog.accent, alignSelf: "stretch", flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <h1 className="serif" style={{ fontSize: 38, color: eMID, lineHeight: 1.04, margin: 0 }}>{prog.name}</h1>
          <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eBLUE, background: "color-mix(in srgb, var(--accent) 10%, var(--card))", padding: "5px 12px", borderRadius: 6 }}>In progress</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 13, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eBLUE, background: "color-mix(in srgb, var(--accent) 10%, var(--card))", padding: "5px 12px", borderRadius: 8 }}>{all.length} Total</span>
          <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eSUCCESS, background: "rgba(20,133,61,.10)", padding: "5px 12px", borderRadius: 8 }}>{done} Done</span>
          <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: ePURP, background: "rgba(143,32,222,.08)", padding: "5px 12px", borderRadius: 8 }}>{prog.pct}% Progress</span>
        </div>
      </div>
    </div>;


  // ── NEW: "Ribbon" — slim horizontal band, gold progress ring + inline stats. Short, warm, no dark/blue fill. ──
  const heroRibbon =
  <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap", background: eCARD, border: "1px solid " + eLINE, borderRadius: 18, padding: "20px 26px 20px 30px", marginBottom: 36, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 5, background: eGOLD }} />
      {/* progress ring */}
      <div style={{ position: "relative", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <EdRing2 pct={prog.pct} size={76} stroke={7} color={eGOLD} track="rgba(0,15,71,.08)" />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span className="serif" style={{ fontSize: 21, color: eMID, lineHeight: 1 }}>{prog.pct}%</span>
        </div>
      </div>
      {/* title + meta */}
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
          <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eWARN, background: "rgba(203,126,3,.12)", padding: "3px 10px", borderRadius: 6 }}>In progress</span>
        </div>
        <h1 className="serif" style={{ fontSize: 29, color: eMID, lineHeight: 1.05, margin: 0 }}>{prog.name}</h1>
      </div>
      {/* inline stats */}
      <div style={{ display: "flex", flexShrink: 0 }}>
        {stats.map((m, i) =>
      <div key={i} style={{ textAlign: "center", padding: "0 18px", borderLeft: i ? "1px solid " + eLINE : "none" }}>
            <div className="serif" style={{ fontSize: 26, color: i === 1 ? eWARN : eMID, lineHeight: 1 }}>{m.v}</div>
            <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, letterSpacing: 0.2, color: eMUT, marginTop: 5 }}>{m.l}</div>
          </div>
      )}
      </div>
    </div>;


  const hero = heroStyle === "minimal" ? heroMinimal : heroStyle === "minimal2" ? heroMinimal2 : heroStyle === "light" ? heroLight : heroStyle === "ribbon" ? heroRibbon : heroCompact;

  const eCOL = { maxWidth: "var(--content-max)", margin: "0 var(--fol-mx)", padding: 0 };

  // gated: locked until "Begin assessment". closed: everything locked (window passed). completed: everything done. error: one blocking task.
  const forceComplete = tasksLayout === "completed";
  const errorMode = tasksLayout === "error";
  // varied sample error reasons so different cards show different problems
  const errSamples = [
    "Your last attempt couldn't be submitted. Please retry to continue.",
    "Proctoring check failed — your camera or connection dropped during the session.",
    "This task timed out before you finished. Restart to try again.",
  ];
  const lockAll = (tasksLayout === "gated" && !started) || tasksLayout === "closed";

  // top banner for completed / closed / error states (cards still render below)
  const bannerMeta = forceComplete
    ? { tint: "rgba(20,133,61,.07)", line: "rgba(20,133,61,.28)", iconBg: "rgba(20,133,61,.12)", tone: eSUCCESS, icon: <I.checkCircle size={24} />, title: "Assessment complete", body: "You've submitted every activity below. Your reports are ready in the Reports tab — your responses can no longer be changed.", cta: "View reports", big: true }
    : tasksLayout === "closed"
    ? { tint: "rgba(123,121,116,.07)", line: eLINE, iconBg: "rgba(123,121,116,.12)", tone: eMUT, icon: <I.clock size={22} />, title: "This assessment is closed", body: "The submission window closed on " + prog.due + ". All activities below are locked and can no longer be changed. Any completed reports remain available in the Reports tab.", cta: "View reports", big: true }
    : errorMode
    ? { tint: "rgba(197,53,50,.06)", line: "rgba(197,53,50,.28)", iconBg: "rgba(197,53,50,.12)", tone: eDANGER, icon: <I.alertCircle size={23} />, title: "Action needed to continue", body: "One of your tasks couldn't be completed — see the highlighted task below. The remaining tasks stay locked until it's resolved. If the problem continues, contact your program administrator.", cta: null }
    : null;
  const statusBanner = bannerMeta ?
    <div style={eCOL}>
      <div style={{ display: "flex", gap: 15, alignItems: "flex-start", background: bannerMeta.tint, border: "1px solid " + bannerMeta.line, borderRadius: 16, padding: "20px 24px", marginBottom: 32 }}>
        <div style={{ width: 46, height: 46, borderRadius: 23, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: bannerMeta.iconBg, color: bannerMeta.tone }}>{bannerMeta.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 className={bannerMeta.big ? "serif" : undefined} style={{ fontFamily: bannerMeta.big ? undefined : "var(--sans)", fontSize: bannerMeta.big ? 26 : 17, fontWeight: 700, color: eMID, margin: bannerMeta.big ? "0 0 7px" : "0 0 4px", lineHeight: bannerMeta.big ? 1.12 : 1.3, letterSpacing: -0.1 }}>{bannerMeta.title}</h2>
          <p style={{ fontFamily: "var(--sans)", fontSize: bannerMeta.big ? 16 : 14, fontWeight: bannerMeta.big ? 500 : 400, color: eINK, lineHeight: 1.55, margin: 0, maxWidth: 660 }}>{bannerMeta.body}</p>
        </div>
        {bannerMeta.cta &&
          <button onClick={() => setTab("reports")} style={{ display: "inline-flex", alignItems: "center", gap: 8, flexShrink: 0, alignSelf: "center", background: "var(--primary)", color: "var(--on-accent)", border: "none", borderRadius: 10, padding: "10px 18px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{bannerMeta.cta} <I.arrow size={15} /></button>}
      </div>
    </div> : null;

  // reusable assessment-center callout (same design as the standard single callout)
  const renderCallout = (c, title, mb, locked, done) =>
    <div style={{ margin: "0 0 " + (mb == null ? 24 : mb) + "px", background: done ? "rgba(20,133,61,.05)" : eCARD, border: "1px solid " + (done ? "rgba(20,133,61,.28)" : eLINE), borderRadius: 16, padding: "20px 24px", display: "flex", gap: 18, alignItems: "flex-start", opacity: locked ? 0.62 : 1 }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: done ? "rgba(20,133,61,.12)" : locked ? "rgba(123,121,116,.10)" : "rgba(143,32,222,.10)", color: done ? eSUCCESS : locked ? eMUT : ePURP }}>{done ? <I.checkCircle size={22} /> : locked ? <I.lock size={20} /> : <I.users size={22} />}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h2 style={{ fontFamily: "var(--sans)", fontSize: 17, fontWeight: 700, color: eMID, margin: "0 0 4px", letterSpacing: -0.1 }}>{title}</h2>
        <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.5, margin: 0, maxWidth: 600 }}>{done ? "You've completed every activity in this assessment center. Your results are included in your reports." : "You will be added to the assessment center or receive an invite to book your slot. Once you're part of the center, you can complete the activities by clicking the View Detail button."}</p>
      </div>
      {done ?
        <span style={{ display: "inline-flex", alignItems: "center", gap: 7, flexShrink: 0, alignSelf: "center", color: eSUCCESS, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600 }}><I.check size={15} /> Completed</span> :
      locked ?
        <span style={{ display: "inline-flex", alignItems: "center", gap: 7, flexShrink: 0, alignSelf: "center", color: eMUT, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600 }}><I.lock size={15} /> Locked</span> :
        <button onClick={() => onOpenCenter(c)} style={{ display: "inline-flex", alignItems: "center", gap: 8, flexShrink: 0, alignSelf: "center", background: "var(--primary)", color: "var(--on-accent)", border: "none", borderRadius: 10, padding: "10px 18px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>View Detail <I.arrow size={15} /></button>
      }
    </div>;

  // per-center section for the multiple-centers layout — invite/reserve card or simple callout, then drill in via View Detail
  const centerSection = (c, last, locked, done) => {
    const reservedAt = reserveAt[c.id];
    const reserved = !!reservedAt;
    const needsReserve = c.needsReserve && !reserved;
    const durMs = edParseDuration(c.time);
    const ghostBtn = { display: "inline-flex", alignItems: "center", gap: 7, background: "var(--card)", color: eMID, border: "1.5px solid " + eMID, borderRadius: 10, padding: "9px 17px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer" };
    const solidBtn = { display: "inline-flex", alignItems: "center", gap: 7, background: "var(--primary)", color: "var(--on-accent)", border: "none", borderRadius: 10, padding: "9px 18px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, cursor: "pointer" };
    if (done) {
      return (
        <div key={c.id} className="ed-center-card" style={{ background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 16, padding: "26px 28px", marginBottom: last ? 30 : 22, boxShadow: "0 1px 3px rgba(0,15,71,.04)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 18 }}>
            <div style={{ width: 44, height: 44, borderRadius: 22, flexShrink: 0, background: "var(--success-fill)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}><I.check size={22} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
                <h2 className="serif" style={{ fontSize: 22, color: eMID, lineHeight: 1.15, margin: 0 }}>{c.name}</h2>
                <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: eSUCCESS, background: "rgba(20,133,61,.10)", padding: "3px 9px", borderRadius: 5 }}>Completed</span>
              </div>
              <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.55, margin: 0, maxWidth: 600 }}>You've completed every activity in this assessment center. Your results have been submitted and are being processed.</p>
            </div>
          </div>
          <div style={{ borderTop: "1px solid " + eLINE, paddingTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, display: "inline-flex", alignItems: "center", gap: 6 }}><I.check size={14} /> {(c.activities || []).length} of {(c.activities || []).length} activities complete</span>
            <button onClick={() => onOpenCenter(c)} style={ghostBtn}>View summary <I.arrow size={14} /></button>
          </div>
        </div>);
    }
    if (locked) {
      return (
        <React.Fragment key={c.id}>
          <div style={{ maxWidth: 660, margin: "0 0 14px" }}>
            <h2 className="serif" style={{ fontSize: 22, color: eMID, lineHeight: 1.15, margin: "0 0 6px" }}>Assessment Center</h2>
            <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.55, margin: 0 }}>This section unlocks once you begin the assessment.</p>
          </div>
          <div className="ed-center-card" style={{ background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 16, padding: "26px 28px", marginBottom: last ? 30 : 22, boxShadow: "0 1px 3px rgba(0,15,71,.04)", opacity: 0.62 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap", marginBottom: 9 }}>
              <h3 style={{ fontFamily: "var(--sans)", fontSize: 17, fontWeight: 700, color: eMID, margin: 0 }}>{c.name}</h3>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
              <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, display: "inline-flex", alignItems: "center", gap: 5 }}><I.clock size={14} /> {c.time}</span>
            </div>
            <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.55, margin: "0 0 14px", maxWidth: 640 }}>{c.desc}</p>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7, color: eMUT, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600 }}><I.lock size={15} /> Locked</span>
            </div>
          </div>
        </React.Fragment>);
    }
    return (
      <React.Fragment key={c.id}>
        <div style={{ maxWidth: 660, margin: "0 0 14px" }}>
          <h2 className="serif" style={{ fontSize: 22, color: eMID, lineHeight: 1.15, margin: "0 0 6px" }}>{c.needsReserve ? "Assessment Center" : c.name}</h2>
          <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.55, margin: 0 }}>
            {c.needsReserve
              ? (needsReserve ? "You have received an invite. Please reserve your slot." : "Your slot is booked — your time has started. Open View Detail to complete your tasks before the countdown ends.")
              : "You'll be added to the assessment center or invited to book a slot. Once you're part of the center, complete the activities by clicking View Detail."}
          </p>
        </div>
        <div className="ed-center-card" style={{ background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 16, padding: "24px 26px", marginBottom: last ? 30 : 22, boxShadow: "0 1px 3px rgba(0,15,71,.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap", marginBottom: 9 }}>
            <h3 style={{ fontFamily: "var(--sans)", fontSize: 17, fontWeight: 700, color: eMID, margin: 0 }}>{c.name}</h3>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
            <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, display: "inline-flex", alignItems: "center", gap: 5 }}><I.clock size={14} /> {c.time}</span>
            {reserved && durMs > 0 && <CenterTimer end={reservedAt + durMs} />}
          </div>
          <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.55, margin: "0 0 16px", maxWidth: 640 }}>{c.desc}</p>
          <div className="ed-center-actions" style={{ display: "flex", justifyContent: "flex-end", gap: 10, flexWrap: "wrap" }}>
            <button onClick={() => onOpenCenter(c)} style={ghostBtn}>View Detail <I.arrow size={14} /></button>
            {c.needsReserve && needsReserve && <button onClick={() => reserveCenter(c)} style={solidBtn}>Reserve your spot <I.arrow size={14} /></button>}
          </div>
        </div>
      </React.Fragment>);
  };

  // "Assessment Center will start in" info card (used in the multiple-centers layout)
  const centerStartCard =
    <div style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "rgba(206,236,255,.45)", border: "1px solid color-mix(in srgb, var(--accent) 10%, var(--card))", borderRadius: 14, padding: "22px 24px", marginBottom: 24 }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--card)", color: eBLUE }}><I.clock size={22} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--sans)", fontSize: 16, fontWeight: 700, color: eMID, marginBottom: 4 }}>Your Assessment Center will start in</div>
        <div className="serif" style={{ fontSize: 22, color: eBLUE, marginBottom: 14, letterSpacing: 0.3 }}>3h 2m 1s</div>
        <button onClick={() => onOpenCenter(d.centers[0])} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--card)", color: eBLUE, border: "1.5px solid " + eBLUE, borderRadius: 9, padding: "8px 16px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>View Details <I.arrow size={14} /></button>
      </div>
    </div>;

  // gated layout header: "Begin when ready" block
  const gatedHeader =
    <div style={eCOL}>
      <div style={{ display: "flex", gap: 0, marginBottom: 34, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 16, overflow: "hidden" }}>
        <div style={{ width: 4, background: started ? eSUCCESS : eBLUE, alignSelf: "stretch", flexShrink: 0 }} />
        <div style={{ flex: 1, padding: "24px 26px" }}>
          <h2 className="serif" style={{ fontSize: 26, color: eMID, lineHeight: 1.1, margin: "0 0 8px" }}>{started ? "Assessment in progress" : "Begin when ready"}</h2>
          <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.6, margin: "0 0 18px", maxWidth: 600 }}>{started ? "Your activities below are now unlocked. Complete them in your own time — your progress is saved automatically." : "This entire program is proctored. You'll need to complete the proctoring system check before you can begin the assessment."}</p>
          {!started &&
            <button onClick={() => setStarted(true)} style={{ display: "inline-flex", alignItems: "center", gap: 9, background: eGOLD, color: "var(--action-text)", border: "none", borderRadius: 10, padding: "12px 22px", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Begin <I.arrow size={17} /></button>
          }
        </div>
      </div>
    </div>;

  // status state panel — success / error / closed layouts
  const statePanel = ({ icon, tint, tone, title, body, primaryLabel, onPrimary, secondaryLabel, onSecondary }) =>
    <div style={eCOL}>
      <div style={{ background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 20, padding: "60px 48px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 76, height: 76, borderRadius: 38, display: "flex", alignItems: "center", justifyContent: "center", background: tint, color: tone, marginBottom: 24 }}>{icon}</div>
        <h1 className="serif" style={{ fontSize: 34, color: eMID, lineHeight: 1.1, margin: "0 0 12px", maxWidth: 520 }}>{title}</h1>
        <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.6, margin: "0 0 30px", maxWidth: 480 }}>{body}</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          {primaryLabel &&
            <button onClick={onPrimary} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--primary)", color: "var(--on-accent)", border: "none", borderRadius: 10, padding: "12px 22px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{primaryLabel} <I.arrow size={16} /></button>}
          {secondaryLabel &&
            <button onClick={onSecondary} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: eMID, border: "1.5px solid " + eMID, borderRadius: 10, padding: "12px 22px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{secondaryLabel}</button>}
        </div>
      </div>
    </div>;

  return (
    <div style={{ margin: "32px 0 72px" }}>

      <div style={eCOL}>
      {/* HERO */}
      {hero}

      {/* TABS */}
      <div className="ed-tabs" style={{ display: "flex", gap: 2, borderBottom: "1px solid " + eLINE, marginBottom: 30 }}>
        {[{ id: "intro", l: "Intro" }, { id: "tasks", l: "Tasks" }, { id: "reports", l: "Reports" }].map((t) => {
          const on = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} className={"ed-tabbtn" + (on ? " ed-tabbtn-on" : "")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--sans)", fontSize: 14, fontWeight: on ? 700 : 500, color: on ? eMID : eMUT, padding: "10px 18px", borderBottom: "2px solid " + (on ? eMID : "transparent"), marginBottom: -1, transition: "color .15s" }}>{t.l}</button>);

        })}
      </div>
      </div>

      {/* INTRO TAB — instructions, read-only (no actions) */}
      {tab === "intro" &&
      <div style={eCOL}>
          <div style={{ position: "relative", width: "100%", paddingBottom: "50%", borderRadius: 16, overflow: "hidden", background: "var(--surface-deep)", marginBottom: 28 }}>
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(120% 120% at 20% 0%, rgba(206,236,255,.22), transparent 55%), linear-gradient(135deg, var(--surface-deep), #001F8C)` }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
              <div style={{ width: 60, height: 60, borderRadius: 30, background: eSKY, color: "#0B1220", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 28px rgba(0,0,0,.3)" }}><I.play size={24} /></div>
              <span style={{ color: "#fff", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600 }}>Watch introduction video ({d.videoLen})</span>
            </div>
          </div>
          <div style={{ borderTop: "1px solid " + eLINE, paddingTop: 24 }}>
            <EdSectionLabel>Before you begin</EdSectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 16 }}>
              {d.instructions.map((pt, i) =>
            <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div className="serif" style={{ width: 30, height: 30, borderRadius: 8, background: "color-mix(in srgb, var(--accent) 10%, var(--card))", color: eBLUE, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16 }}>{i + 1}</div>
                  <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.6, margin: 0, flex: 1 }}>{pt}</p>
                </div>
            )}
            </div>
          </div>
        </div>
      }

      {/* TASKS TAB — STANDARD / MULTIPLE-CENTERS / GATED / COMPLETED / CLOSED / ERROR LAYOUTS */}
      {tab === "tasks" && (tasksLayout === "standard" || tasksLayout === "centers" || tasksLayout === "gated" || tasksLayout === "completed" || tasksLayout === "closed" || tasksLayout === "error") && <React.Fragment>

      {/* GATED HEADER */}
      {tasksLayout === "gated" && gatedHeader}

      {/* COMPLETED / CLOSED BANNER */}
      {statusBanner}


      {/* MULTIPLE ASSESSMENT CENTERS — one section per named center; View Detail drills in, Reserve books a slot */}
      {tasksLayout === "centers" && d.centers.length > 0 &&
        <div style={eCOL}>{d.centers.map((c, i) => centerSection(c, i === d.centers.length - 1))}</div>
      }

      {/* ASSESSMENT CENTER CALLOUT — standard / gated / completed / closed / error: same card + functionality as the centers layout */}
      {tasksLayout !== "centers" && d.centers.length > 0 &&
        <div style={eCOL}>
          {centerSection(d.centers[0], true, lockAll, forceComplete)}
        </div>
      }

      {/* SEQUENTIAL */}
      <div style={eCOL}>
      {seq.length > 0 &&
        <div style={{ marginBottom: 28 }}>
          <h2 className="serif" style={{ fontSize: 21, color: eMID, lineHeight: 1.15, margin: "0 0 4px" }}>Sequential exercises</h2>
          <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, margin: "0 0 16px" }}>Complete in order — each unlocks the next.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {seq.map((ex, i) => {
              const sSt = forceComplete ? "complete" : lockAll ? "locked" : errorMode ? (ex._status === "complete" ? "complete" : "error") : ex._status;
              const sDone = sSt === "complete";
              const sLocked = sSt === "locked";
              const prevDone = forceComplete || (!lockAll && i > 0 && seq[i - 1]._status === "complete");
              const errMsg = errSamples[i % errSamples.length];
              return (
                <div key={ex.id} className="ed-seqcell" style={{ display: "flex", flexDirection: "column" }}>
                  {/* stepper header */}
                  <div className="ed-seqstep" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <span style={{ width: 28, height: 28, borderRadius: 14, flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700,
                      background: sDone ? eSUCCESS : sLocked ? "var(--card)" : prog.accent,
                      color: sLocked ? eMUT : "var(--on-accent)", border: sLocked ? "1.5px solid " + eLINE : "none" }}>{sDone ? <I.check size={15} /> : i + 1}</span>
                    {i !== seq.length - 1 && <div className="ed-seqline" style={{ flex: 1, height: 2, borderRadius: 1, marginLeft: 4, background: sDone ? eSUCCESS : eLINE }} />}
                  </div>
                  <div className="ed-seqbody" style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
                  <EdCard accent={prog.accent} icon={ex.proctored ? "shield" : "fileText"}
                  onClick={errorMode ? (ex.proctored ? () => onProctored(ex, "assessment") : () => onOpenAssess(ex)) : lockAll ? undefined : forceComplete ? () => onOpenAssess(ex) : ex._status === "progress" || ex._status === "notstarted" ? ex.proctored ? () => onProctored(ex, "assessment") : () => onOpenAssess(ex) : undefined}
                  item={forceComplete ? { ...ex, _status: "complete", pct: 100 } : lockAll ? { ...ex, _status: "locked" } : errorMode ? { ...ex, _status: sSt } : ex} />
                  {sSt === "error" &&
                  <div style={{ display: "flex", gap: 7, alignItems: "flex-start", marginTop: 10 }}>
                    <span style={{ color: eDANGER, display: "flex", flexShrink: 0, marginTop: 1 }}><I.alertCircle size={14} /></span>
                    <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eDANGER, lineHeight: 1.45, fontWeight: 500 }}>{errMsg}</span>
                  </div>
                  }
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        }

      {/* OPEN */}
      {d.open.length > 0 &&
        <div style={{ borderTop: "1px solid " + eLINE, paddingTop: 24 }}>
          <h2 className="serif" style={{ fontSize: 21, color: eMID, lineHeight: 1.15, margin: "0 0 4px" }}>Open exercises</h2>
          <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, margin: "0 0 16px" }}>Complete in any order, at your own pace.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {d.open.map((ex) =>
            <EdCard key={ex.id} accent={prog.accent} icon={ex.proctored ? "shield" : ex.hasReport ? "bars" : "fileText"}
            onClick={lockAll ? undefined : forceComplete ? () => onOpenAssess(ex) : ex.proctored ? () => onProctored(ex, "assessment") : () => onOpenAssess(ex)}
            item={forceComplete ? { ...ex, _status: "complete", pct: 100 } : lockAll ? { ...ex, _status: "locked" } : ex} />
            )}
          </div>
        </div>
        }
      </div>

      {/* BOTTOM CALLOUT removed — multiple-centers layout now renders one section per center above */}

      </React.Fragment>}

      {/* REPORTS TAB — completed reports only, icon + list, no thumbnails */}
      {tab === "reports" &&
      <div style={eCOL}>
          <h2 className="serif" style={{ fontSize: 21, color: eMID, lineHeight: 1.15, margin: "0 0 4px" }}>Your reports</h2>
          {progReports.length > 0 ?
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
              {progReports.map((r) =>
                window.EdGrowth && window.EdGrowth.EdReportCard
                  ? React.createElement(window.EdGrowth.EdReportCard, { key: r.id, r, onPreview: setReportPreview })
                  : null
          )}
            </div> :

        <div style={{ marginTop: 16, background: eCARD, border: "1px dashed " + eLINE, borderRadius: 16, padding: "44px 24px", textAlign: "center" }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(0,15,71,.04)", color: eMUT, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}><I.fileText size={22} /></div>
              <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: eMID, marginBottom: 4 }}>No reports yet</div>
              <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT }}>Reports unlock automatically as you complete the underlying tasks.</div>
            </div>
        }
        </div>
      }
      {reportPreview && window.EdGrowth && window.EdGrowth.EdReportReader &&
        React.createElement(window.EdGrowth.EdReportReader, { report: reportPreview, onClose: () => setReportPreview(null) })}
    </div>);

}

// ════════════════════════════════════════════════
//  ASSESSMENT CENTER DETAIL — phase timeline
// ════════════════════════════════════════════════
function EdCenter({ center, onBack, onProctored, onOpenAssess, onReserve }) {
  const acts = center.activities || [];
  const doneCount = acts.filter((a) => a.status === "complete").length;
  const sequential = !!center.sequential;
  // SESSION-ONLY reservation (in-memory). The detail-page Reserve button was removed per
  // request, so a needsReserve center is treated as already reserved on mount (cards active).
  const [reservedAt, setReservedAt] = edUseState(center.needsReserve ? Date.now() : null);
  const durMs = edParseDuration(center.time);
  const needsReserve = !!center.needsReserve && !reservedAt;

  // gating: locked while a reserve is still required; otherwise sequential phases unlock in order
  let lockedFrom = false;
  const seqActs = acts.map((a, i) => {
    if (center.needsReserve && !reservedAt) return { ...a, _status: "locked" };
    if (center.lockActivities && !reservedAt) return { ...a, _status: "locked" };
    // timer running on a sequential center: first phase is a fresh "Not started", the rest locked until it's done
    if (sequential && reservedAt) return { ...a, _status: i === 0 ? "notstarted" : "locked", pct: 0 };
    if (a.status === "complete") return { ...a, _status: "complete" };
    if (needsReserve) return { ...a, _status: "locked" };
    if (!sequential) return { ...a, _status: a.status === "locked" ? "notstarted" : a.status };
    if (!lockedFrom) { lockedFrom = true; return { ...a, _status: a.status === "progress" ? "progress" : "notstarted" }; }
    return { ...a, _status: "locked" };
  });

  const openActivity = (a) => {
    if (a._status === "locked") return;
    if (a.proctored) onProctored(center, "center");
    else if (onOpenAssess) onOpenAssess(a);
  };

  return (
    <div style={{ maxWidth: "var(--content-max)", margin: "36px var(--fol-mx) 72px", padding: 0 }}>
      <EdBack label="Back to tasks" onClick={onBack} />
      <h1 className="serif" style={{ fontSize: 40, color: eMID, lineHeight: 1.08, margin: "0 0 28px" }}>{center.name}</h1>

      {/* Reserve button removed per request — needsReserve centers open already reserved. */}

      {/* ACTIVITIES */}
      <div style={{ marginBottom: 28, marginTop: sequential ? 0 : 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {seqActs.map((a, i) => sequential ? (
            <div key={a.id} className="ed-seqcell" style={{ display: "flex", flexDirection: "column" }}>
              <div className="ed-seqstep" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ width: 28, height: 28, borderRadius: 14, flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700,
                  background: a._status === "complete" ? eSUCCESS : a._status === "locked" ? "var(--card)" : ePURP,
                  color: a._status === "locked" ? eMUT : a._status === "complete" ? "var(--on-accent)" : "#fff", border: a._status === "locked" ? "1.5px solid " + eLINE : "none" }}>{a._status === "complete" ? <I.check size={15} /> : i + 1}</span>
                {i !== seqActs.length - 1 && <div className="ed-seqline" style={{ flex: 1, height: 2, borderRadius: 1, marginLeft: 4, background: a._status === "complete" ? eSUCCESS : eLINE }} />}
              </div>
              <div className="ed-seqbody" style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
                <EdCard accent={ePURP} icon={a.proctored ? "shield" : "fileText"} item={a} onClick={a._status === "locked" ? undefined : () => openActivity(a)} />
              </div>
            </div>
          ) : (
            <EdCard key={a.id} accent={ePURP} icon={a.proctored ? "shield" : "fileText"} item={a} onClick={a._status === "locked" ? undefined : () => openActivity(a)} />
          ))}
        </div>
      </div>

      {/* PROCTORED system-check launch removed per request */}
    </div>);

}

// ════════════════════════════════════════════════
//  PRE-CHECK (Proctored) — guidelines → system check → launch
// ════════════════════════════════════════════════
function EdPreCheck({ target, onBack, onLaunch }) {
  const [consent, setConsent] = edUseState(false);
  const [checks, setChecks] = edUseState({});
  const [running, setRunning] = edUseState(false);
  const [done, setDone] = edUseState(false);

  const sysItems = [
  { k: "browser", ic: I.monitor, l: "Browser" },
  { k: "internet", ic: I.wifi, l: "Internet" },
  { k: "camera", ic: I.cam, l: "Camera" },
  { k: "mic", ic: I.mic, l: "Microphone" },
  { k: "upload", ic: I.upload, l: "Upload speed" }];


  const runChecks = () => {
    setConsent(true);setRunning(true);setChecks({});setDone(false);
    ["browser", "internet", "camera", "mic", "upload"].forEach((c, i) => {
      setTimeout(() => {
        setChecks((p) => ({ ...p, [c]: c === "internet" ? "warning" : "pass" }));
        if (i === 4) {setRunning(false);setDone(true);}
      }, 650 * (i + 1));
    });
  };

  const step = !consent ? "info" : !done ? "check" : "ready";

  const guidelines = [
  { ic: I.cam, title: "Camera & video recording", desc: "Your camera will be active throughout. Ensure good lighting and a clear background." },
  { ic: I.mic, title: "Microphone monitoring", desc: "Audio will be monitored. Be in a quiet environment with no interruptions." },
  { ic: I.wifi, title: "Stable internet connection", desc: "A minimum of 2 Mbps upload speed is required. Use a wired connection if possible." },
  { ic: I.users, title: "Professional appearance", desc: "Dress presentably as if attending a professional assessment. Be camera-ready." },
  { ic: I.bulb, title: "Right mindset & focus", desc: "Close all other apps and tabs. Give this your full, undivided attention." }];


  return (
    <div style={{ maxWidth: "var(--content-max)", margin: "36px var(--fol-mx) 72px", padding: 0 }}>

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <div style={{ width: 46, height: 46, borderRadius: 13, background: "rgba(143,32,222,.10)", color: ePURP, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><I.shield size={22} /></div>
        <div>
          <EdEyebrow color={ePURP}>Proctored</EdEyebrow>
          <h1 className="serif" style={{ fontSize: 28, color: eMID, lineHeight: 1.1, margin: "0 0 2px" }}>System check</h1>
          <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, margin: 0 }}>{target.name}</p>
        </div>
      </div>

      {/* step indicator */}
      <div style={{ display: "flex", alignItems: "center", margin: "0 0 28px" }}>
        {["Read guidelines", "System check", "Launch"].map((label, i) => {
          const sDone = i === 0 && consent || i === 1 && done;
          const sActive = i === 0 && step === "info" || i === 1 && step === "check" || i === 2 && step === "ready";
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : "none" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <div style={{ width: 26, height: 26, borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700,
                  background: sDone ? eSUCCESS : sActive ? eMID : "rgba(0,15,71,.08)", color: sDone || sActive ? "#fff" : eMUT }}>
                  {sDone ? <I.check size={13} /> : i + 1}
                </div>
                <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: sActive ? 700 : 500, color: sActive ? eMID : eMUT, whiteSpace: "nowrap" }}>{label}</span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: 2, background: sDone ? "rgba(20,133,61,.35)" : eLINE, margin: "0 10px", marginBottom: 16, minWidth: 16 }} />}
            </div>);

        })}
      </div>

      {step === "info" &&
      <div>
          <div style={{ background: eCARD, border: "1px solid " + eLINE, borderRadius: 16, padding: 24, marginBottom: 18 }}>
            <h3 style={{ fontFamily: "var(--sans)", fontSize: 16, fontWeight: 700, color: eMID, margin: "0 0 8px" }}>What happens next</h3>
            <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.6, margin: "0 0 18px" }}>This is a proctored task. We'll check your system readiness and then launch the task in a monitored environment.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {guidelines.map((g, i) =>
            <div key={i} style={{ display: "flex", gap: 13, alignItems: "flex-start" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "color-mix(in srgb, var(--accent) 10%, var(--card))", color: eBLUE, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><g.ic size={18} /></div>
                  <div>
                    <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eMID, marginBottom: 3 }}>{g.title}</div>
                    <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.55 }}>{g.desc}</div>
                  </div>
                </div>
            )}
            </div>
          </div>
          <div style={{ background: "rgba(203,126,3,.07)", border: "1px solid rgba(203,126,3,.22)", borderRadius: 14, padding: 16, marginBottom: 20, display: "flex", gap: 11, alignItems: "flex-start" }}>
            <span style={{ color: eWARN, display: "flex", flexShrink: 0, marginTop: 1 }}><I.info size={18} /></span>
            <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.55, margin: 0 }}>
              <strong style={{ color: eMID }}>Important:</strong> Once you start, the timer begins and cannot be paused. Any suspicious activity (leaving the tab, multiple faces detected) will be flagged. Ensure you are fully prepared before proceeding.
            </p>
          </div>
          <EdBtn primary full onClick={runChecks}>I understand — Proceed to system check <I.arrow size={16} /></EdBtn>
        </div>
      }

      {step === "check" &&
      <div>
          <div style={{ background: eCARD, border: "1px solid " + eLINE, borderRadius: 16, padding: "8px 22px", marginBottom: 18 }}>
            {sysItems.map((itm, i) => {
            const st = checks[itm.k];
            return (
              <div key={itm.k} style={{ display: "flex", alignItems: "center", gap: 13, padding: "13px 0", borderBottom: i < sysItems.length - 1 ? "1px solid " + eLINE : "none" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  background: st === "pass" ? "rgba(20,133,61,.10)" : st === "warning" ? "rgba(203,126,3,.10)" : "color-mix(in srgb, var(--accent) 10%, var(--card))",
                  color: st === "pass" ? eSUCCESS : st === "warning" ? eWARN : eBLUE }}><itm.ic size={18} /></div>
                  <span style={{ flex: 1, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eMID }}>{itm.l}</span>
                  {!st && <span className="ed-spin" style={{ width: 16, height: 16, borderRadius: 8, border: "2px solid var(--line)", borderTopColor: eBLUE, display: "block" }} />}
                  {st === "pass" && <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eSUCCESS, fontWeight: 700 }}>✓ Pass</span>}
                  {st === "warning" && <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eWARN, fontWeight: 700 }}>⚠ Slow</span>}
                </div>);

          })}
          </div>
          {running && <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, textAlign: "center" }}>Please wait while we verify your setup…</p>}
        </div>
      }

      {step === "ready" &&
      <div>
          <div style={{ background: "rgba(20,133,61,.07)", border: "1px solid rgba(20,133,61,.22)", borderRadius: 16, padding: 26, marginBottom: 20, textAlign: "center" }}>
            <div style={{ width: 50, height: 50, borderRadius: 25, background: "var(--success-fill)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}><I.check size={24} /></div>
            <h3 className="serif" style={{ fontSize: 24, color: eMID, margin: "0 0 6px" }}>System check passed</h3>
            <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, margin: 0 }}>Your device is ready. Click below to enter the task.</p>
            {Object.values(checks).includes("warning") && <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eWARN, marginTop: 10 }}>Note: your internet speed is slow. Performance may be affected.</p>}
          </div>
          <EdBtn primary full onClick={onLaunch}>Launch {target.name} <I.arrow size={16} /></EdBtn>
        </div>
      }
    </div>);

}

function LHFooter({ full }) {
  const t = (k) => (window.LangSwitcher ? window.LangSwitcher.get(k) : k);
  const links = [
    { label: "Privacy Notice", key: "privacyNotice" },
    { label: "Cookie Notice", key: "cookieNotice" },
    { label: "Manage Cookies", key: "manageCookies" }
  ];
  return (
    <footer style={{ maxWidth: full ? "none" : "var(--content-max)", margin: full ? "0" : "40px var(--fol-mx) 0", padding: full ? "22px 32px 10px" : "22px 0 10px", borderTop: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
      <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT }}>© 2026 Marsh Lighthouse. {t("allRightsReserved")}.</span>
      <nav style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
        {links.map((l) => (
          <a key={l.key} href="#" onClick={(e) => e.preventDefault()} style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, textDecoration: "none", transition: "color .15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = eMID; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = eMUT; }}>{t(l.key)}</a>
        ))}
      </nav>
    </footer>
  );
}

function LHSparkle({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" style={{ display: "block" }}>
      <path d="M9.3 3.2 Q9.3 11.8 1 11.8 Q9.3 11.8 9.3 20.4 Q9.3 11.8 17.6 11.8 Q9.3 11.8 9.3 3.2 Z" />
      <path d="M18.8 4 Q18.8 7 22 7 Q18.8 7 18.8 10 Q18.8 7 15.6 7 Q18.8 7 18.8 4 Z" />
      <path d="M17.8 15.4 Q17.8 18.4 21 18.4 Q17.8 18.4 17.8 21.4 Q17.8 18.4 14.6 18.4 Q17.8 18.4 17.8 15.4 Z" />
    </svg>
  );
}

function LHAssistant() {
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [msgs, setMsgs] = React.useState([{ from: "bot", text: "Hi John — I'm your Lighthouse assistant. Ask me about your programs, deadlines, or how a task works." }]);
  const bodyRef = React.useRef(null);
  React.useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [msgs, open]);
  const send = () => {
    const tx = input.trim();
    if (!tx) return;
    setMsgs((m) => [...m, { from: "me", text: tx }, { from: "bot", text: "Thanks for asking. This is a demo assistant — in the live product I'd answer instantly, or connect you with the Lighthouse support team." }]);
    setInput("");
  };
  const quick = ["When is my next deadline?", "What's a proctored task?", "How do I book a session?"];
  return (
    <React.Fragment>
      {open && (
        <div style={{ position: "fixed", right: 24, bottom: 124, width: 366, maxWidth: "calc(100vw - 48px)", height: 480, maxHeight: "calc(100vh - 150px)", background: "var(--card)", borderRadius: 18, border: "1px solid var(--line)", boxShadow: "0 24px 64px rgba(0,15,71,.24)", zIndex: 71, display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: "var(--sans)" }}>
          <div style={{ background: "var(--surface-deep)", color: "#fff", padding: "15px 17px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(206,236,255,.16)", color: eSKY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><LHSparkle size={20} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Lighthouse assistant</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,.82)", display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 7, height: 7, borderRadius: 4, background: "var(--success)" }} /> Online</div>
            </div>
            <button onClick={() => setOpen(false)} title="Close" style={{ background: "none", border: "none", color: "rgba(255,255,255,.82)", cursor: "pointer", display: "flex" }}><I.plus size={18} style={{ transform: "rotate(45deg)" }} /></button>
          </div>
          <div ref={bodyRef} style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10, background: eCREAM }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ alignSelf: m.from === "bot" ? "flex-start" : "flex-end", maxWidth: "86%", background: m.from === "bot" ? "#fff" : eMID, color: m.from === "bot" ? eINK : "#fff", border: m.from === "bot" ? "1px solid var(--line)" : "none", padding: "10px 13px", borderRadius: m.from === "bot" ? "4px 14px 14px 14px" : "14px 14px 4px 14px", fontSize: 14, lineHeight: 1.5 }}>{m.text}</div>
            ))}
            {msgs.length <= 1 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 4 }}>
                {quick.map((q) => (
                  <button key={q} onClick={() => { setMsgs((m) => [...m, { from: "me", text: q }, { from: "bot", text: "Great question — this is a demo assistant, but here's where I'd surface that answer for you." }]); }} style={{ fontFamily: "var(--sans)", fontSize: 14, color: eBLUE, background: "color-mix(in srgb, var(--accent) 6%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)", borderRadius: 16, padding: "7px 12px", cursor: "pointer" }}>{q}</button>
                ))}
              </div>
            )}
          </div>
          <div style={{ borderTop: "1px solid var(--line)", padding: 12, display: "flex", gap: 8, background: "var(--card)", flexShrink: 0 }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") send(); }} placeholder="Ask a question…" style={{ flex: 1, border: "1px solid var(--line)", borderRadius: 10, padding: "10px 13px", fontFamily: "var(--sans)", fontSize: 14, color: eINK, outline: "none" }} />
            <button onClick={send} title="Send" style={{ width: 40, height: 40, borderRadius: 10, background: eGOLD, color: "var(--action-text)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><I.send size={17} /></button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen((v) => !v)} title="Lighthouse assistant" style={{ position: "fixed", right: 24, bottom: 60, width: 54, height: 54, borderRadius: "50%", background: "var(--surface-deep)", color: "#fff", border: "none", boxShadow: "0 10px 30px rgba(0,15,71,.32)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 72, transition: "transform .15s" }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.06)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}>
        {open ? <I.plus size={24} style={{ transform: "rotate(45deg)" }} /> : <LHSparkle size={24} />}
      </button>
    </React.Fragment>
  );
}

window.EdDetail = { EdInstructions, EdTasks, EdCenter, EdPreCheck, LHFooter, LHAssistant };