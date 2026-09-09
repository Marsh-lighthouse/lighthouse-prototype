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
    <button onClick={onClick} className={"ed-back" + (top ? " ed-pageback" : "")} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "none", border: "none", cursor: "pointer", color: "var(--primary)", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, padding: "4px 0", marginBottom: 22 }}>
      <I.arrowL size={17} /> {label}
    </button>);

}

function EdEyebrow({ children, color = eBLUE }) {
  return <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, letterSpacing: 0.2, color, marginBottom: 12 }}>{children}</div>;
}

function EdSectionLabel({ children }) {
  return <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, letterSpacing: 0.2, color: eMUT, marginBottom: 4 }}>{children}</div>;
}

function EdBtn({ children, primary, small, disabled, onClick, full, dark }) {
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    fontFamily: "var(--sans)", fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
    borderRadius: 10, padding: small ? "8px 14px" : "12px 18px", fontSize: small ? 15 : 15,
    width: full ? "100%" : "auto", opacity: disabled ? 0.5 : 1, transition: "filter .15s"
  };
  const style = dark ?
  (primary
    ? { ...base, background: "#DCE6F5", color: eMID, border: "1.5px solid #DCE6F5" }
    : { ...base, background: "transparent", color: "#fff", border: "1.5px solid rgba(255,255,255,.7)" }) :
  primary ?
  { ...base, background: eGOLD, color: "var(--action-text)", border: "1.5px solid transparent" } :
  { ...base, background: "transparent", color: eMID, border: "1.5px solid " + eMID };
  return <button style={style} disabled={disabled} onClick={disabled ? undefined : onClick} data-comment-anchor="562fd0fb97-button-54-10">{children}</button>;
}

// ── status helpers ──
const edStatusMeta = {
  complete: { label: "Done", color: "#14853D", bg: "color-mix(in srgb, #14853D 15%, #ffffff)" },
  progress: { label: "In progress", color: "#002C77", bg: "color-mix(in srgb, #002C77 15%, #ffffff)" },
  notstarted: { label: "Not started", color: "var(--ink)", bg: "var(--status-neutral-bg)" },
  locked: { label: "Locked", color: "var(--ink)", bg: "var(--status-neutral-bg)" }
};

function EdBadge({ status }) {
  const m = edStatusMeta[status] || edStatusMeta.locked;
  return <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: m.color, background: m.bg, padding: "4px 11px", borderRadius: 6, whiteSpace: "nowrap" }}>{m.label}</span>;
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
          {item.proctored && <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: ePURP, background: "rgba(143,32,222,.10)", padding: "2px 8px", borderRadius: 5, display: "inline-flex", alignItems: "center", gap: 4 }}><I.shield size={12} /> Proctored</span>}
          {item.hasReport && <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: "#002C77", background: "color-mix(in srgb, #002C77 15%, #ffffff)", padding: "4px 10px", borderRadius: 5 }}>Report ready</span>}
        </div>
        {item.desc && <div style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.5, marginTop: 3, maxWidth: 460 }}>{item.desc}</div>}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 7 }}>
          <span style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT, display: "inline-flex", alignItems: "center", gap: 4 }}><I.clock size={14} /> {item.time}</span>
          {item.extra && <span style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT }}>{item.extra}</span>}
          {st === "progress" && <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: col }}>{item.pct}%</span>}
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
          {item.proctored && <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: "#fff", background: "var(--surface-deep)", padding: "3px 9px", borderRadius: 6, display: "inline-flex", alignItems: "center", gap: 4 }}><I.shield size={12} /> Proctored</span>}
          {item.hasReport && <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: "#002C77", background: "color-mix(in srgb, #002C77 15%, #ffffff)", padding: "4px 10px", borderRadius: 6 }}>Report ready</span>}
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
          <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: eMUT }}>Progress</span>
          <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: isError ? eDANGER : isComplete ? eSUCCESS : st === "notstarted" || locked ? eMUT : col }}>{progLabel}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", height: 4, overflow: "hidden", marginBottom: 12 }}>
          <div style={{ width: `${barPct}%`, height: "100%", background: isError ? eDANGER : isComplete ? eSUCCESS : "var(--pl-fill)", flexShrink: 0 }} />
          {barPct > 0 && barPct < 100 && <div style={{ width: 2, flexShrink: 0 }} />}
          <div style={{ flex: 1, height: "100%", background: "#94918C" }} />
        </div>

        {/* footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: "auto", paddingTop: 10 }}>
          <span style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT, display: "inline-flex", alignItems: "center", gap: 5 }}><I.clock size={14} /> {item.time}</span>
          {locked ?
          <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: eMUT, display: "inline-flex", alignItems: "center", gap: 5 }}><I.lock size={13} /> Locked</span> :
          isError ?
          <button onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--danger-fill)", color: "#fff", border: "none", borderRadius: 10, padding: "9px 17px", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Retry <I.arrow size={14} /></button> :
          isComplete ?
          <button onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "transparent", color: eMID, border: "1.5px solid " + eMID, borderRadius: 10, padding: "8px 16px", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, cursor: onClick ? "pointer" : "default" }}>Review</button> :

          <button onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--primary)", color: "var(--on-accent)", border: "none", borderRadius: 10, padding: "9px 17px", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>{pct > 0 ? "Continue" : "Start"} <I.arrow size={14} /></button>
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
      <h1 className="serif" style={{ fontSize: 40, color: eMID, lineHeight: 1.06, margin: "0 0 10px" }}>{prog.name}</h1>
      <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.6, margin: "0 0 32px", maxWidth: 600 }}>{t("watchTheShortIntroduction")}</p>

      {/* intro video */}
      <div onClick={onWatch} style={{ position: "relative", width: "100%", paddingBottom: "50%", borderRadius: 16, overflow: "hidden", background: "var(--surface-deep)", marginBottom: 28, cursor: "pointer" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(120% 120% at 20% 0%, ${"rgba(206,236,255,.22)"}, transparent 55%), linear-gradient(135deg, var(--surface-deep), #001F8C)` }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
          {watched ?
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(20,133,61,.92)", padding: "9px 18px", borderRadius: 22 }}>
              <I.check size={17} /><span style={{ color: "#fff", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700 }}>{t("introductionWatched")}</span>
            </div> :

          <React.Fragment>
              <div style={{ width: 60, height: 60, borderRadius: 30, background: eSKY, color: "#0B1220", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 28px rgba(0,0,0,.3)" }}><I.play size={24} /></div>
              <span style={{ color: "#fff", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700 }}>{t("watchIntroductionVideo")} ({d.videoLen})</span>
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
              <div className="serif" style={{ width: 30, height: 30, borderRadius: 8, background: "color-mix(in srgb, var(--accent) 10%, var(--card))", color: eBLUE, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 15 }}>{i + 1}</div>
              <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.6, margin: 0, flex: 1 }}>{window.tInstruction ? window.tInstruction(pt) : pt}</p>
            </div>
          )}
        </div>
      </div>

      {!acked ?
      <React.Fragment>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <input type="checkbox" id="instructions-read" checked={instructionsRead} onChange={(e) => setInstructionsRead(e.target.checked)} style={{ width: 18, height: 18, cursor: "pointer" }} />
          <label htmlFor="instructions-read" style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, cursor: "pointer", margin: 0 }}>{t("iHaveReadInstructions")}</label>
        </div>
        <EdBtn primary full disabled={!instructionsRead} onClick={onContinue}>
          {t("continue")} <I.arrow size={16} />
        </EdBtn>
      </React.Fragment> :

      <MdsAlert severity="success" align="center">{t("instructionsAcknowledged")}</MdsAlert>
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
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: over ? eDANGER : eBLUE, background: over ? "rgba(197,53,50,.08)" : "color-mix(in srgb, var(--accent) 7%, transparent)", border: "1px solid " + (over ? "rgba(197,53,50,.28)" : "color-mix(in srgb, var(--accent) 18%, transparent)"), padding: "4px 10px", borderRadius: 7, fontVariantNumeric: "tabular-nums" }}><I.clock size={14} /> {over ? "Time's up" : txt + " left"}</span>;
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
    if (ex.audioOnly) return { ...ex, _status: ex.status === "progress" ? "progress" : "notstarted" }; // audio proctored demo — always accessible
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
          <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: "#002C77", background: "color-mix(in srgb, #002C77 15%, #ffffff)", padding: "4px 11px", borderRadius: 6 }}>In progress</span>
        </div>
        <h1 className="serif" style={{ fontSize: 40, color: "#fff", lineHeight: 1.06, margin: "0 0 12px", maxWidth: 560 }}>{prog.name}</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 26, flexWrap: "wrap" }}>
          {stats.map((m, i) =>
        <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span className="serif" style={{ fontSize: 28, color: i === 1 ? eGOLD : i === 2 ? eSKY : "#fff" }}>{m.v}</span>
              <span style={{ fontFamily: "var(--sans)", fontSize: 15, color: "rgba(255,255,255,.82)" }}>{m.l}</span>
            </div>
        )}
          <div style={{ flex: 1, minWidth: 100 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10, width: 180 }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", height: 4, overflow: "hidden" }}>
              <div style={{ width: `${prog.pct}%`, height: "100%", background: eSKY, flexShrink: 0 }} />
              {prog.pct > 0 && prog.pct < 100 && <div style={{ width: 2, flexShrink: 0 }} />}
              <div style={{ flex: 1, height: "100%", background: "rgba(255,255,255,.22)" }} />
            </div>
            <span className="serif" style={{ fontSize: 21, color: eSKY }}>{prog.pct}%</span>
          </div>
        </div>
      </div>
    </div>;


  const heroLight =
  <div style={{ background: eCARD, border: "1px solid " + eLINE, borderRadius: 20, padding: "32px 34px", marginBottom: 40 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: "#002C77", background: "color-mix(in srgb, #002C77 15%, #ffffff)", padding: "4px 11px", borderRadius: 6 }}>In progress</span>
      </div>
      <h1 className="serif" style={{ fontSize: 40, color: eMID, lineHeight: 1.06, margin: "0 0 12px", maxWidth: 560 }}>{prog.name}</h1>
      <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 24, flexWrap: "wrap" }}>
        {stats.map((m, i) =>
      <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span className="serif" style={{ fontSize: 28, color: i === 1 ? eBLUE : eMID }}>{m.v}</span>
            <span style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT }}>{m.l}</span>
          </div>
      )}
        <div style={{ flex: 1, minWidth: 100 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, width: 180 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", height: 4, overflow: "hidden" }}>
            <div style={{ width: `${prog.pct}%`, height: "100%", background: "var(--pl-fill)", flexShrink: 0 }} />
            {prog.pct > 0 && prog.pct < 100 && <div style={{ width: 2, flexShrink: 0 }} />}
            <div style={{ flex: 1, height: "100%", background: "#94918C" }} />
          </div>
          <span className="serif" style={{ fontSize: 21, color: eBLUE }}>{prog.pct}%</span>
        </div>
      </div>
    </div>;


  const heroMinimal =
  <div style={{ marginBottom: 40 }}>
      <span style={{ display: "inline-block", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: "#002C77", background: "color-mix(in srgb, #002C77 15%, #ffffff)", padding: "4px 11px", borderRadius: 6, marginBottom: 14 }}>In progress</span>
      <h1 className="serif" style={{ fontSize: 40, color: eMID, lineHeight: 1.02, margin: "0 0 24px", maxWidth: 620 }}>{prog.name}</h1>
      <div className="ed-hstats" style={{ display: "flex", alignItems: "center", padding: "4px 0 0" }}>
        {stats.map((m, i) =>
      <div key={i} className="ed-hstat" style={{ paddingRight: 32, marginRight: 32, borderRight: "1px solid " + eLINE }}>
            <span className="serif" style={{ fontSize: 28, color: eMID, lineHeight: 1 }}>{m.v}</span>
            <span style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT, marginLeft: 8 }}>{m.l}</span>
          </div>
      )}
        <div className="ed-hspacer" style={{ flex: 1 }} />
        <div className="ed-hprog" style={{ display: "flex", alignItems: "center", gap: 10, width: 180 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", height: 4, overflow: "hidden" }}>
            <div style={{ width: `${prog.pct}%`, height: "100%", background: "var(--pl-fill)", flexShrink: 0 }} />
            {prog.pct > 0 && prog.pct < 100 && <div style={{ width: 2, flexShrink: 0 }} />}
            <div style={{ flex: 1, height: "100%", background: "#94918C" }} />
          </div>
          <span className="serif" style={{ fontSize: 21, color: eMID }}>{prog.pct}%</span>
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
        <h1 className="serif" style={{ fontSize: 40, color: eMID, lineHeight: 1.02, margin: 0, maxWidth: 560 }}>{prog.name}</h1>
        <span style={{ display: "inline-block", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: "#002C77", background: "color-mix(in srgb, #002C77 15%, #ffffff)", padding: "4px 11px", borderRadius: 6 }}>In progress</span>
      </div>
      {/* data line: progress summary leads, then the task breakdown (wraps on mobile) */}
      <div className="ed-hstats" style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", rowGap: 10 }}>
        <div className="ed-hprog" style={{ display: "flex", alignItems: "center", gap: 10, width: 172, flexShrink: 0 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", height: 4, overflow: "hidden" }}>
            <div style={{ width: `${prog.pct}%`, height: "100%", background: "var(--pl-fill)", flexShrink: 0 }} />
            {prog.pct > 0 && prog.pct < 100 && <div style={{ width: 2, flexShrink: 0 }} />}
            <div style={{ flex: 1, height: "100%", background: "#94918C" }} />
          </div>
          <span className="serif" style={{ fontSize: 21, color: eMID, lineHeight: 1 }}>{prog.pct}%</span>
        </div>
        <div style={{ width: 1, height: 22, background: eLINE, flexShrink: 0 }} />
        <div style={{ display: "flex", alignItems: "baseline" }}>
          {stats.map((m, i) => {
            const c = i === 0 ? eBLUE : i === 1 ? "var(--accent-2)" : eSUCCESS;
            return (
          <div key={i} className="ed-hstat" style={{ display: "flex", alignItems: "baseline", gap: 6, paddingLeft: i ? 16 : 0, marginLeft: i ? 16 : 0, borderLeft: i ? "1px solid " + eLINE : "none" }}>
                <span className="serif" style={{ fontSize: 21, color: c, lineHeight: 1 }}>{m.v}</span>
                <span style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT }}>{m.l}</span>
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
          <h1 className="serif" style={{ fontSize: 40, color: eMID, lineHeight: 1.04, margin: 0 }}>{prog.name}</h1>
          <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: "#002C77", background: "color-mix(in srgb, #002C77 15%, #ffffff)", padding: "5px 12px", borderRadius: 6 }}>In progress</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 13, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: "#002C77", background: "color-mix(in srgb, #002C77 15%, #ffffff)", padding: "5px 12px", borderRadius: 8 }}>{all.length} Total</span>
          <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: "#14853D", background: "color-mix(in srgb, #14853D 15%, #ffffff)", padding: "5px 12px", borderRadius: 8 }}>{done} Done</span>
          <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: ePURP, background: "rgba(143,32,222,.08)", padding: "5px 12px", borderRadius: 8 }}>{prog.pct}% Progress</span>
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
          <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, color: "#002C77", background: "color-mix(in srgb, #002C77 15%, #ffffff)", padding: "4px 10px", borderRadius: 6 }}>In progress</span>
        </div>
        <h1 className="serif" style={{ fontSize: 28, color: eMID, lineHeight: 1.05, margin: 0 }}>{prog.name}</h1>
      </div>
      {/* inline stats */}
      <div style={{ display: "flex", flexShrink: 0 }}>
        {stats.map((m, i) =>
      <div key={i} style={{ textAlign: "center", padding: "0 18px", borderLeft: i ? "1px solid " + eLINE : "none" }}>
            <div className="serif" style={{ fontSize: 21, color: i === 1 ? eWARN : eMID, lineHeight: 1 }}>{m.v}</div>
            <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, letterSpacing: 0.2, color: eMUT, marginTop: 5 }}>{m.l}</div>
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
          <h2 className={bannerMeta.big ? "serif" : undefined} style={{ fontFamily: bannerMeta.big ? undefined : "var(--sans)", fontSize: bannerMeta.big ? 28 : 15, fontWeight: 700, color: eMID, margin: bannerMeta.big ? "0 0 7px" : "0 0 4px", lineHeight: bannerMeta.big ? 1.12 : 1.3, letterSpacing: -0.1 }}>{bannerMeta.title}</h2>
          <p style={{ fontFamily: "var(--sans)", fontSize: bannerMeta.big ? 15 : 15, fontWeight: bannerMeta.big ? 700 : 400, color: eINK, lineHeight: 1.55, margin: 0, maxWidth: 660 }}>{bannerMeta.body}</p>
        </div>
        {bannerMeta.cta &&
          <button onClick={() => setTab("reports")} style={{ display: "inline-flex", alignItems: "center", gap: 8, flexShrink: 0, alignSelf: "center", background: "var(--primary)", color: "var(--on-accent)", border: "none", borderRadius: 10, padding: "10px 18px", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>{bannerMeta.cta} <I.arrow size={15} /></button>}
      </div>
    </div> : null;

  // reusable assessment-center callout (same design as the standard single callout)
  const renderCallout = (c, title, mb, locked, done) =>
    <div style={{ margin: "0 0 " + (mb == null ? 24 : mb) + "px", background: done ? "rgba(20,133,61,.05)" : eCARD, border: "1px solid " + (done ? "rgba(20,133,61,.28)" : eLINE), borderRadius: 16, padding: "20px 24px", display: "flex", gap: 18, alignItems: "flex-start", opacity: locked ? 0.62 : 1 }}>
      <div style={{ width: 44, height: 44, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: done ? "rgba(20,133,61,.12)" : locked ? "rgba(123,121,116,.10)" : "rgba(143,32,222,.10)", color: done ? eSUCCESS : locked ? eMUT : ePURP }}>{done ? <I.checkCircle size={22} /> : locked ? <I.lock size={20} /> : <I.users size={22} />}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h2 style={{ fontFamily: "var(--sans)", fontSize: 21, fontWeight: 700, color: eMID, margin: "0 0 4px", letterSpacing: -0.1 }}>{title}</h2>
        <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.5, margin: 0, maxWidth: 600 }}>{done ? "You've completed every activity in this assessment center. Your results are included in your reports." : "You will be added to the assessment center or receive an invite to book your slot. Once you're part of the center, you can complete the activities by clicking the View Detail button."}</p>
      </div>
      {done ?
        <span style={{ display: "inline-flex", alignItems: "center", gap: 7, flexShrink: 0, alignSelf: "center", color: eSUCCESS, fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700 }}><I.check size={15} /> Completed</span> :
      locked ?
        <span style={{ display: "inline-flex", alignItems: "center", gap: 7, flexShrink: 0, alignSelf: "center", color: eMUT, fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700 }}><I.lock size={15} /> Locked</span> :
        <button onClick={() => onOpenCenter(c)} style={{ display: "inline-flex", alignItems: "center", gap: 8, flexShrink: 0, alignSelf: "center", background: "var(--primary)", color: "var(--on-accent)", border: "none", borderRadius: 10, padding: "10px 18px", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>View Detail <I.arrow size={15} /></button>
      }
    </div>;

  // per-center section for the multiple-centers layout — invite/reserve card or simple callout, then drill in via View Detail
  const centerSection = (c, last, locked, done) => {
    const reservedAt = reserveAt[c.id];
    const reserved = !!reservedAt;
    const needsReserve = c.needsReserve && !reserved;
    const durMs = edParseDuration(c.time);
    const ghostBtn = { display: "inline-flex", alignItems: "center", gap: 7, background: "var(--card)", color: eMID, border: "1.5px solid " + eMID, borderRadius: 10, padding: "9px 17px", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, cursor: "pointer" };
    const solidBtn = { display: "inline-flex", alignItems: "center", gap: 7, background: "var(--primary)", color: "var(--on-accent)", border: "none", borderRadius: 10, padding: "9px 18px", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, cursor: "pointer" };
    if (done) {
      return (
        <div key={c.id} className="ed-center-card" style={{ background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 16, padding: "26px 28px", marginBottom: last ? 30 : 22, boxShadow: "0 1px 3px rgba(0,15,71,.04)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 18 }}>
            <div style={{ width: 44, height: 44, borderRadius: 22, flexShrink: 0, background: "var(--success-fill)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}><I.check size={22} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
                <h2 className="serif" style={{ fontSize: 21, color: eMID, lineHeight: 1.15, margin: 0 }}>{c.name}</h2>
                <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, letterSpacing: ".04em", textTransform: "uppercase", color: "#14853D", background: "color-mix(in srgb, #14853D 15%, #ffffff)", padding: "4px 10px", borderRadius: 5 }}>Completed</span>
              </div>
              <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.55, margin: 0, maxWidth: 600 }}>You've completed every activity in this assessment center. Your results have been submitted and are being processed.</p>
            </div>
          </div>
          <div style={{ borderTop: "1px solid " + eLINE, paddingTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT, display: "inline-flex", alignItems: "center", gap: 6 }}><I.check size={14} /> {(c.activities || []).length} of {(c.activities || []).length} activities complete</span>
            <button onClick={() => onOpenCenter(c)} style={ghostBtn}>View summary <I.arrow size={14} /></button>
          </div>
        </div>);
    }
    if (locked) {
      return (
        <React.Fragment key={c.id}>
          <div style={{ maxWidth: 660, margin: "0 0 14px" }}>
            <h2 className="serif" style={{ fontSize: 21, color: eMID, lineHeight: 1.15, margin: "0 0 6px" }}>Assessment Center</h2>
            <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.55, margin: 0 }}>This section unlocks once you begin the assessment.</p>
          </div>
          <div className="ed-center-card" style={{ background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 16, padding: "26px 28px", marginBottom: last ? 30 : 22, boxShadow: "0 1px 3px rgba(0,15,71,.04)", opacity: 0.62 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap", marginBottom: 9 }}>
              <h3 style={{ fontFamily: "var(--sans)", fontSize: 21, fontWeight: 700, color: eMID, margin: 0 }}>{c.name}</h3>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
              <span style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT, display: "inline-flex", alignItems: "center", gap: 5 }}><I.clock size={14} /> {c.time}</span>
            </div>
            <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.55, margin: "0 0 14px", maxWidth: 640 }}>{c.desc}</p>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7, color: eMUT, fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700 }}><I.lock size={15} /> Locked</span>
            </div>
          </div>
        </React.Fragment>);
    }
    return (
      <React.Fragment key={c.id}>
        <div style={{ maxWidth: 660, margin: "0 0 14px" }}>
          <h2 className="serif" style={{ fontSize: 21, color: eMID, lineHeight: 1.15, margin: "0 0 6px" }}>{c.needsReserve ? "Assessment Center" : c.name}</h2>
          <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.55, margin: 0 }}>
            {c.needsReserve
              ? (needsReserve ? "You have received an invite. Please reserve your slot." : "Your slot is booked — your time has started. Open View Detail to complete your tasks before the countdown ends.")
              : "You'll be added to the assessment center or invited to book a slot. Once you're part of the center, complete the activities by clicking View Detail."}
          </p>
        </div>
        <div className="ed-center-card" style={{ background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 16, padding: "24px 26px", marginBottom: last ? 30 : 22, boxShadow: "0 1px 3px rgba(0,15,71,.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap", marginBottom: 9 }}>
            <h3 style={{ fontFamily: "var(--sans)", fontSize: 21, fontWeight: 700, color: eMID, margin: 0 }}>{c.name}</h3>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
            <span style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT, display: "inline-flex", alignItems: "center", gap: 5 }}><I.clock size={14} /> {c.time}</span>
            {reserved && durMs > 0 && <CenterTimer end={reservedAt + durMs} />}
          </div>
          <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.55, margin: "0 0 16px", maxWidth: 640 }}>{c.desc}</p>
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
      <div style={{ width: 44, height: 44, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--card)", color: eBLUE }}><I.clock size={22} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: eMID, marginBottom: 4 }}>Your Assessment Center will start in</div>
        <div className="serif" style={{ fontSize: 21, color: eBLUE, marginBottom: 14, letterSpacing: 0.3 }}>3h 2m 1s</div>
        <button onClick={() => onOpenCenter(d.centers[0])} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--card)", color: eBLUE, border: "1.5px solid " + eBLUE, borderRadius: 9, padding: "8px 16px", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>View Details <I.arrow size={14} /></button>
      </div>
    </div>;

  // gated layout header: "Begin when ready" block
  const gatedHeader =
    <div style={eCOL}>
      <div style={{ display: "flex", gap: 0, marginBottom: 34, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 16, overflow: "hidden" }}>
        <div style={{ width: 4, background: started ? eSUCCESS : eBLUE, alignSelf: "stretch", flexShrink: 0 }} />
        <div style={{ flex: 1, padding: "24px 26px" }}>
          <h2 className="serif" style={{ fontSize: 21, color: eMID, lineHeight: 1.1, margin: "0 0 8px" }}>{started ? "Assessment in progress" : "Begin when ready"}</h2>
          <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.6, margin: "0 0 18px", maxWidth: 600 }}>{started ? "Your activities below are now unlocked. Complete them in your own time — your progress is saved automatically." : "This entire program is proctored. You'll need to complete the proctoring system check before you can begin the assessment."}</p>
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
        <h1 className="serif" style={{ fontSize: 28, color: eMID, lineHeight: 1.1, margin: "0 0 12px", maxWidth: 520 }}>{title}</h1>
        <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.6, margin: "0 0 30px", maxWidth: 480 }}>{body}</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          {primaryLabel &&
            <button onClick={onPrimary} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--primary)", color: "var(--on-accent)", border: "none", borderRadius: 10, padding: "12px 22px", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>{primaryLabel} <I.arrow size={16} /></button>}
          {secondaryLabel &&
            <button onClick={onSecondary} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: eMID, border: "1.5px solid " + eMID, borderRadius: 10, padding: "12px 22px", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>{secondaryLabel}</button>}
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
            <button key={t.id} onClick={() => setTab(t.id)} className={"ed-tabbtn" + (on ? " ed-tabbtn-on" : "")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--sans)", fontSize: 15, fontWeight: on ? 700 : 700, color: on ? eMID : eMUT, padding: "10px 18px", borderBottom: "2px solid " + (on ? eMID : "transparent"), marginBottom: -1, transition: "color .15s" }}>{t.l}</button>);

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
              <span style={{ color: "#fff", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700 }}>Watch introduction video ({d.videoLen})</span>
            </div>
          </div>
          <div style={{ borderTop: "1px solid " + eLINE, paddingTop: 24 }}>
            <EdSectionLabel>Before you begin</EdSectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 16 }}>
              {d.instructions.map((pt, i) =>
            <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div className="serif" style={{ width: 30, height: 30, borderRadius: 8, background: "color-mix(in srgb, var(--accent) 10%, var(--card))", color: eBLUE, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 15 }}>{i + 1}</div>
                  <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.6, margin: 0, flex: 1 }}>{pt}</p>
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
          <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT, margin: "0 0 16px" }}>Complete in order — each unlocks the next.</p>
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
                    <span style={{ width: 28, height: 28, borderRadius: 14, flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700,
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
                    <span style={{ fontFamily: "var(--sans)", fontSize: 15, color: eDANGER, lineHeight: 1.45, fontWeight: 700 }}>{errMsg}</span>
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
          <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT, margin: "0 0 16px" }}>Complete in any order, at your own pace.</p>
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
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(0,15,71,.04)", border: "1px solid rgba(0,15,71,.10)", color: eMUT, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}><I.fileText size={22} /></div>
              <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: eMID, marginBottom: 4 }}>No reports yet</div>
              <div style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT }}>Reports unlock automatically as you complete the underlying tasks.</div>
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
      <h1 className="serif" style={{ fontSize: 40, color: eMID, lineHeight: 1.08, margin: "0 0 28px" }}>{center.name}</h1>

      {/* Reserve button removed per request — needsReserve centers open already reserved. */}

      {/* ACTIVITIES */}
      <div style={{ marginBottom: 28, marginTop: sequential ? 0 : 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {seqActs.map((a, i) => sequential ? (
            <div key={a.id} className="ed-seqcell" style={{ display: "flex", flexDirection: "column" }}>
              <div className="ed-seqstep" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ width: 28, height: 28, borderRadius: 14, flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700,
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

// ═══════════════════════════════════════════════════════════════════════════
//  PRE-CHECK (Proctored) — Systems check
//  Multi-step flow rebuilt from the reference screenshots, re-skinned in the
//  MDS design system: Welcome → 1 Browser → 2 Network → 3 Video and Audio → 4 Result.
//  Center screen only. Content is reference; fonts/colors/sizes are ours.
//  NOTE: step components live at module scope (stable identity) so state and
//  timers survive parent re-renders — nesting them inside EdPreCheck remounts them.
// ═══════════════════════════════════════════════════════════════════════════
const SC_PHRASE = "I am ready. This is a test recording to confirm that my video and microphone are working properly.";
const SC_PHRASE_AUDIO = "I am ready. This is a test recording to confirm that my microphone is working properly.";
const SC_REQ_DL = 3, SC_REQ_UL = 8;
const SC_STEPS = ["Browser", "Network", "Video and Audio", "Result"];
const SC_STEPS_AUDIO = ["Browser", "Network", "Audio", "Result"];
const SC_AUTO_ADVANCE = true; // "Continue (4)" auto-advance countdown after a step passes (all three flows)
const scWrap = { maxWidth: "var(--content-max)", margin: "36px var(--fol-mx) 72px", padding: 0 };
const scWrapV = { margin: 0, padding: 0 }; // embedded (vertical single-page) — no page margins
const scCard = { background: eCARD, border: "1px solid " + eLINE, borderRadius: 16 };
const scTint = (c, a) => "color-mix(in srgb, " + c + " " + a + ", transparent)";

function ScBadge({ state }) {
  const m = {
    pending: { bg: scTint(eBLUE, "12%"), col: eBLUE, ic: <span className="ed-spin" style={{ width: 12, height: 12, borderRadius: 6, border: "2px solid " + scTint(eBLUE, "40%"), borderTopColor: eBLUE, display: "block" }} />, l: "Pending" },
    pass: { bg: scTint(eSUCCESS, "14%"), col: eSUCCESS, ic: <I.checkCircle size={13} />, l: "Pass" },
    fail: { bg: scTint(eDANGER, "12%"), col: eDANGER, ic: <I.alertCircle size={13} />, l: "Fail" },
  }[state] || {};
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--sans)", fontSize: 13, fontWeight: 700, color: m.col, background: m.bg, padding: "4px 11px", borderRadius: 6, whiteSpace: "nowrap" }}>{m.ic} {m.l}</span>;
}

// Reads the prototype's device frame (Desktop / Mobile / iPad) and re-renders on change.
function useScDevice() {
  const [dev, setDev] = React.useState(() => (typeof document !== "undefined" && document.documentElement.getAttribute("data-device")) || "desktop");
  React.useEffect(() => {
    const read = () => setDev(document.documentElement.getAttribute("data-device") || "desktop");
    read();
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-device"] });
    return () => obs.disconnect();
  }, []);
  return dev;
}

// Segmented step progress bar for phones — discrete steps, filled up to the current one.
// Mobile step progress — numbered-circle rail, matching the development-plan
// stepper (MnStepper design 1 in app-ed-manual.jsx): filled circle + label for
// the active step, plain numbered circles for the rest, hairline connectors.
function ScMobileSteps({ labels, index }) {
  return (
    <div style={{ display: "flex", alignItems: "center", margin: "0 0 20px", flexWrap: "nowrap", overflowX: "auto", paddingBottom: 2 }}>
      {labels.map((label, i) => {
        const done = i < index, on = i === index;
        return (
          <React.Fragment key={label}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 9, flexShrink: 0 }}>
              <span style={{ width: 26, height: 26, borderRadius: 13, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                background: done ? eSUCCESS : on ? eMID : "rgba(0,15,71,.06)",
                color: done || on ? "#fff" : eMUT,
                border: done ? "none" : "1px solid " + (on ? eMID : eLINE),
                fontFamily: "var(--sans)", fontSize: 13, fontWeight: 700 }}>
                {done ? <I.check size={15} /> : i + 1}
              </span>
              {on && <span style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 700, color: eMID, whiteSpace: "nowrap" }}>{label}</span>}
            </div>
            {i < labels.length - 1 && <span style={{ flex: "1 1 12px", minWidth: 10, height: 1, background: done ? eSUCCESS : eLINE, margin: "0 8px" }} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function ScStepper({ index, audioOnly }) {
  const dev = useScDevice();
  const labels = audioOnly ? SC_STEPS_AUDIO : SC_STEPS;
  if (dev === "mobile") return <ScMobileSteps labels={labels} index={index} />;
  return (
    <div style={{ display: "flex", alignItems: "center", margin: "0 0 30px" }}>
      {labels.map((label, i) => {
        const done = i < index, active = i === index;
        return (
          <React.Fragment key={i}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, flexShrink: 0 }}>
              <div style={{ width: 30, height: 30, borderRadius: 15, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, background: active ? eMID : done ? scTint(eMID, "8%") : scTint(eMID, "6%"), color: active ? "#fff" : done ? eMID : eMUT }}>
                {done ? <I.check size={15} /> : i + 1}
              </div>
              <span style={{ fontFamily: "var(--sans)", fontSize: dev === "ipad" ? 13 : 15, fontWeight: 700, color: active || done ? eMID : eMUT, whiteSpace: "nowrap" }}>{label}</span>
            </div>
            {i < labels.length - 1 && <div style={{ flex: 1, height: 2, background: done ? eMID : eLINE, margin: dev === "ipad" ? "0 8px" : "0 14px", minWidth: dev === "ipad" ? 8 : 18 }} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function ScHead({ icon, title, sub, badge }) {
  const mob = useScDevice() === "mobile";
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: mob ? 10 : 16, marginBottom: mob ? 16 : 22 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: mob ? 10 : 13, minWidth: 0 }}>
        {icon && <div style={{ width: 44, height: 44, borderRadius: "50%", background: scTint(eBLUE, "10%"), border: "1px solid " + scTint(eBLUE, "22%"), color: eBLUE, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>}
        <div style={{ minWidth: 0 }}>
          <h1 style={{ fontFamily: "var(--sans)", fontSize: 21, fontWeight: 700, color: eMID, lineHeight: 1.25, margin: 0 }}>{title}</h1>
          {sub && <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT, margin: "4px 0 0", lineHeight: 1.45 }}>{sub}</p>}
        </div>
      </div>
      {badge && !mob && <ScBadge state={badge} />}
    </div>
  );
}

function ScFoot({ onBackClick, right }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginTop: 22, flexWrap: "wrap" }}>
      <EdBtn onClick={onBackClick}><I.arrowL size={16} /> Back</EdBtn>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>{right}</div>
    </div>
  );
}

function ScHowToFix({ items }) {
  return (
    <div style={{ background: scTint(eDANGER, "5%"), border: "1px solid " + scTint(eDANGER, "18%"), borderRadius: 12, padding: "16px 18px", marginTop: 16 }}>
      <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: eDANGER, marginBottom: 8 }}>How to fix:</div>
      <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
        {items.map((t, i) => <li key={i} style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.5 }}>{t}</li>)}
      </ul>
    </div>
  );
}

// countdown auto-advance — shows "(n)" and fires onDone at 0
function useScCountdown(active, onDone) {
  const [n, setN] = React.useState(null);
  const cb = React.useRef(onDone); cb.current = onDone;
  React.useEffect(() => {
    if (!active) { setN(null); return; }
    setN(4); let c = 4;
    const t = setInterval(() => { c -= 1; setN(c); if (c <= 0) { clearInterval(t); cb.current && cb.current(); } }, 1000);
    return () => clearInterval(t);
  }, [active]);
  return n;
}

// ═══ WELCOME ═══════════════════════════════════════════════════════════════
function ScWelcome({ target, onStart, audioOnly }) {
  const [ack, setAck] = React.useState(false);
  const iconTile = (icon) => <div style={{ width: 44, height: 44, borderRadius: "50%", background: scTint(eBLUE, "10%"), border: "1px solid " + scTint(eBLUE, "22%"), color: eBLUE, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>;
  const cardHead = (icon, title, subtitle) => <div style={{ display: "flex", alignItems: subtitle ? "flex-start" : "center", gap: 13, marginBottom: 16 }}>{iconTile(icon)}<div><h3 style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: eMID, margin: 0, lineHeight: 1.25 }}>{title}</h3>{subtitle && <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT, margin: "3px 0 0", lineHeight: 1.45 }}>{subtitle}</p>}</div></div>;
  const note = (t) => <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT, lineHeight: 1.55, margin: "14px 0 0" }}>{t}</p>;
  const kv = (k, v) => <div style={{ display: "flex", gap: 12, padding: "6px 0", alignItems: "baseline" }}><span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: eMUT, minWidth: 118, flexShrink: 0, whiteSpace: "nowrap" }}>{k}</span><span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: eMID }}>{v}</span></div>;
  const chk = (icon, label) => <div style={{ display: "flex", alignItems: "center", gap: 9 }}><span style={{ color: eBLUE, display: "flex" }}>{icon}</span><span style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK }}>{label}</span></div>;
  const li = (t, i) => <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}><span style={{ color: eSUCCESS, display: "flex", flexShrink: 0, marginTop: 1 }}><I.check size={16} /></span><span style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.5 }}>{t}</span></div>;
  const colTitle = (icon, title) => <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}><span style={{ color: eMID, display: "flex" }}>{icon}</span><h4 style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: eMID, margin: 0 }}>{title}</h4></div>;
  const env = ["A quiet, well-lit room with no other people present", "Clean desk with no unauthorized materials", "Stable internet connection (minimum 1 Mbps)", "Working camera and microphone", "Ready to share your screen throughout the session"];
  const pers = ["Close all unnecessary applications and browser tabs", "Ensure your device is fully charged or plugged into socket", "Set aside uninterrupted time for the full assessment"];
  const box = { ...scCard, padding: 24 };
  return (
    <div style={scWrap}>
      <div style={{ marginBottom: 22 }}>
        <h1 className="serif" style={{ fontSize: 28, color: eMID, lineHeight: 1.1, margin: "0 0 8px" }}>System check</h1>
        <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.6, margin: 0 }}>Confirm your device and connection are ready before you begin{target && target.name ? " " + target.name : ""}.</p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginBottom: 20 }}>
        <div style={{ ...box, flex: 1, minWidth: 260 }}>
          {cardHead(<I.clock size={22} />, "Time Commitment")}
          {kv("System Check", "Less than 5 minutes")}
          {kv("Task Duration", target && target.time ? target.time : "5 hours")}
          {note("Plan for the full duration. Once started, breaks may not be allowed depending on the assessment type.")}
        </div>
        <div style={{ ...box, flex: 1, minWidth: 260 }}>
          {cardHead(<I.monitor size={22} />, "System Checks")}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{chk(<I.monitor size={16} />, "Browser & Device")}{chk(<I.wifi size={16} />, "Internet Speed")}{chk(audioOnly ? <I.mic size={16} /> : <I.cam size={16} />, audioOnly ? "Audio" : "Video & Audio")}</div>
          {note("All checks must pass before you can proceed.")}
        </div>
      </div>

      <div style={{ ...box, marginBottom: 24 }}>
        {cardHead(<I.bulb size={22} />, "Before you begin", "Make sure you and your environment are fully prepared")}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 44 }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            {colTitle(<I.globe size={18} />, "Environment Setup")}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{env.map(li)}</div>
          </div>
          <div style={{ flex: 1, minWidth: 260 }}>
            {colTitle(<I.user size={18} />, "Personal Readiness")}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{pers.map(li)}</div>
          </div>
        </div>
      </div>

      <label style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 20, cursor: "pointer" }}>
        <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} style={{ width: 18, height: 18, accentColor: eMID, marginTop: 1, flexShrink: 0 }} />
        <span><span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: eMID, display: "block", marginBottom: 2 }}>I acknowledge and understand</span><span style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK }}>I have read and understood the instructions above and am ready to proceed with the system check.</span></span>
      </label>

      <EdBtn primary full disabled={!ack} onClick={() => ack && onStart()}>Start System Check <I.arrow size={16} /></EdBtn>
    </div>
  );
}

// ═══ WELCOME — System Check 2 (new design variant; work-in-progress canvas) ══
function ScWelcome2({ target, onStart }) {
  const [ack, setAck] = React.useState(false);
  const checks = [
    { icon: <I.monitor size={20} />, t: "Browser & Device", d: "We confirm your browser supports every required feature." },
    { icon: <I.wifi size={20} />, t: "Internet Speed", d: "We test that your connection meets the minimum speed." },
    { icon: <I.cam size={20} />, t: "Video & Audio", d: "We check your camera and microphone are working." },
  ];
  return (
    <div style={scWrap}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--sans)", fontSize: 11.5, fontWeight: 700, letterSpacing: 0.3, textTransform: "uppercase", color: eBLUE, background: scTint(eBLUE, "12%"), padding: "4px 10px", borderRadius: 999 }}>Design 2</span>
      </div>
      <h1 className="serif" style={{ fontSize: 28, color: eMID, lineHeight: 1.1, margin: "0 0 8px" }}>System check</h1>
      <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.6, margin: "0 0 24px", maxWidth: 620 }}>A quick check of your device and connection — under 5 minutes — before you begin{target && target.name ? " " + target.name : ""}. All checks must pass to continue.</p>

      <div style={{ ...scCard, padding: "6px 26px", marginBottom: 24 }}>
        {checks.map((c, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 0", borderBottom: i < checks.length - 1 ? "1px solid " + eLINE : "none" }}>
            <div style={{ width: 46, height: 46, borderRadius: "50%", background: scTint(eBLUE, "10%"), border: "1px solid " + scTint(eBLUE, "22%"), color: eBLUE, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{c.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: eMID }}>{c.t}</div>
              <div style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT, lineHeight: 1.5 }}>{c.d}</div>
            </div>
          </div>
        ))}
      </div>

      <label style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 20, cursor: "pointer" }}>
        <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} style={{ width: 18, height: 18, accentColor: eMID, marginTop: 1, flexShrink: 0 }} />
        <span style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK }}>I have a quiet, well-lit space, a stable connection, and a working camera and microphone, and I'm ready to begin.</span>
      </label>

      <EdBtn primary full disabled={!ack} onClick={() => ack && onStart()}>Start System Check <I.arrow size={16} /></EdBtn>
    </div>
  );
}

// ── SC2 auto-scan helpers ──
const scWait = (ms) => new Promise((r) => setTimeout(r, ms));
function scDetectBrowser() {
  let name = "your browser", ver = "";
  try {
    const ua = navigator.userAgent;
    if (/Edg\//.test(ua)) { name = "Edge"; ver = (ua.match(/Edg\/([\d.]+)/) || [])[1] || ""; }
    else if (/OPR\//.test(ua)) { name = "Opera"; ver = (ua.match(/OPR\/([\d.]+)/) || [])[1] || ""; }
    else if (/Firefox\//.test(ua)) { name = "Firefox"; ver = (ua.match(/Firefox\/([\d.]+)/) || [])[1] || ""; }
    else if (/Chrome\//.test(ua)) { name = "Chrome"; ver = (ua.match(/Chrome\/([\d.]+)/) || [])[1] || ""; }
    else if (/Safari\//.test(ua)) { name = "Safari"; ver = (ua.match(/Version\/([\d.]+)/) || [])[1] || ""; }
  } catch (e) {}
  return name + (ver ? " " + ver.split(".")[0] : "") + " · WebGL, MediaRecorder, storage OK";
}

// SC2 · single-page automatic scan — all checks run on one screen as live status rows
function ScScan2({ target, onBack, onLaunch, onStep }) {
  const rows = [
    { k: "browser", icon: <I.monitor size={20} />, label: "Browser & Device", checking: "Verifying browser features…", done: () => scDetectBrowser() },
    { k: "network", icon: <I.wifi size={20} />, label: "Internet Speed", checking: "Measuring connection speed…", done: () => "6.70 Mbps download · 10.04 Mbps upload" },
    { k: "video", icon: <I.cam size={20} />, label: "Video & Audio", checking: "Detecting camera and microphone…", done: () => "FaceTime HD Camera · MacBook Pro Microphone" },
  ];
  const [st, setSt] = React.useState({ browser: "pending", network: "pending", video: "pending" });
  const [detail, setDetail] = React.useState({ browser: "", network: "", video: "" });
  const [nonce, setNonce] = React.useState(0);

  React.useEffect(() => { if (onStep) onStep("scan"); }, []);
  React.useEffect(() => {
    let alive = true;
    (async () => {
      for (const r of rows) {
        if (!alive) return;
        setSt((s) => ({ ...s, [r.k]: "checking" }));
        await scWait(1500 + Math.random() * 900);
        if (!alive) return;
        setDetail((d) => ({ ...d, [r.k]: r.done() }));
        setSt((s) => ({ ...s, [r.k]: "pass" }));
      }
    })();
    return () => { alive = false; };
  }, [nonce]);

  const states = Object.values(st);
  const done = states.every((v) => v === "pass" || v === "fail");
  const allPass = states.every((v) => v === "pass");
  const anyFail = states.some((v) => v === "fail");
  const completed = states.filter((v) => v === "pass" || v === "fail").length;
  const rerun = () => { setSt({ browser: "pending", network: "pending", video: "pending" }); setDetail({ browser: "", network: "", video: "" }); setNonce((n) => n + 1); };

  const tileColor = (s) => s === "pass" ? eSUCCESS : s === "fail" ? eDANGER : s === "checking" ? eBLUE : eMUT;
  const pill = (s) => {
    if (s === "pending") return <span style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 700, color: eMUT }}>Waiting</span>;
    if (s === "checking") return <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--sans)", fontSize: 13, fontWeight: 700, color: eBLUE }}><span className="ed-spin" style={{ width: 13, height: 13, borderRadius: 7, border: "2px solid " + scTint(eBLUE, "35%"), borderTopColor: eBLUE, display: "block" }} /> Checking…</span>;
    return <ScBadge state={s} />;
  };
  const bannerBg = done ? (allPass ? scTint(eSUCCESS, "7%") : scTint(eWARN, "8%")) : scTint(eBLUE, "5%");
  const barColor = anyFail ? eWARN : eBLUE;

  return (
    <div style={scWrap}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--sans)", fontSize: 11.5, fontWeight: 700, letterSpacing: 0.3, textTransform: "uppercase", color: eBLUE, background: scTint(eBLUE, "12%"), padding: "4px 10px", borderRadius: 999 }}>Design 2</span>
      </div>
      <h1 className="serif" style={{ fontSize: 28, color: eMID, lineHeight: 1.1, margin: "0 0 8px" }}>System check</h1>
      <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.6, margin: "0 0 24px", maxWidth: 620 }}>Sit tight — we're automatically checking your device and connection{target && target.name ? " for " + target.name : ""}. This only takes a moment.</p>

      <div style={{ ...scCard, overflow: "hidden" }}>
        {/* overall status banner */}
        <div style={{ padding: "22px 26px", display: "flex", alignItems: "center", gap: 16, background: bannerBg, transition: "background .3s" }}>
          {!done && <span className="ed-spin" style={{ width: 30, height: 30, borderRadius: 16, border: "3px solid " + scTint(eBLUE, "28%"), borderTopColor: eBLUE, display: "block", flexShrink: 0 }} />}
          {done && allPass && <span style={{ width: 34, height: 34, borderRadius: "50%", background: eSUCCESS, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><I.check size={19} /></span>}
          {done && anyFail && <span style={{ color: eWARN, display: "flex", flexShrink: 0 }}><I.alertCircle size={32} /></span>}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: eMID }}>{!done ? "Running system checks…" : allPass ? "You're all set" : "Some checks need attention"}</div>
            <div style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT, marginTop: 2 }}>{!done ? completed + " of " + rows.length + " complete" : allPass ? "Your device and connection are ready." : "Review the items below, then re-run the checks."}</div>
          </div>
        </div>
        {/* progress bar */}
        <div style={{ height: 4, background: scTint(eMID, "8%") }}><div style={{ height: "100%", width: (completed / rows.length * 100) + "%", background: barColor, transition: "width .5s ease" }} /></div>
        {/* live check rows */}
        {rows.map((r, i) => {
          const s = st[r.k];
          return (
            <div key={r.k} style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 26px", borderTop: "1px solid " + eLINE, opacity: s === "pending" ? 0.55 : 1, transition: "opacity .3s" }}>
              <div style={{ width: 46, height: 46, borderRadius: "50%", background: scTint(tileColor(s), "10%"), border: "1px solid " + scTint(tileColor(s), "24%"), color: tileColor(s), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "color .3s, background .3s, border-color .3s" }}>{r.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: eMID }}>{r.label}</div>
                <div style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT, lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s === "checking" ? r.checking : s === "pending" ? "Waiting to start" : detail[r.k]}</div>
              </div>
              {pill(s)}
            </div>
          );
        })}
      </div>

      <ScFoot onBackClick={onBack} right={done ? (allPass
        ? <EdBtn primary onClick={onLaunch}>Continue <I.arrow size={16} /></EdBtn>
        : <React.Fragment><EdBtn onClick={rerun}>Re-run Checks</EdBtn><EdBtn primary onClick={onLaunch}>Continue <I.arrow size={16} /></EdBtn></React.Fragment>)
        : <EdBtn primary disabled>Checking…</EdBtn>} />
    </div>
  );
}

// SC2 · vertical single-page stepper — identical checks to SC1, stacked on one screen
const SC_VSTEPS = [
  { k: "browser", icon: <I.monitor size={17} />, label: "Browser & Device", d: "We confirm your browser supports every required feature." },
  { k: "network", icon: <I.wifi size={17} />, label: "Internet Speed", d: "We test that your connection meets the minimum speed." },
  { k: "video", icon: <I.cam size={17} />, label: "Video and Audio", d: "We check your camera and microphone are working." },
  { k: "result", icon: <I.checkCircle size={17} />, label: "Result", d: "Review your results, then continue to the assessment." },
];
function ScVertical({ target, onBack, onLaunch, onStep, audioOnly }) {
  const [phase, setPhase] = React.useState("browser");
  const [results, setResults] = React.useState({ browser: "pending", network: "pending", video: "pending" });
  const setResult = (k, v) => setResults((p) => (p[k] === v ? p : { ...p, [k]: v }));
  const rerun = () => { setResults({ browser: "pending", network: "pending", video: "pending" }); setPhase("browser"); };
  const activeIndex = SC_VSTEPS.findIndex((s) => s.k === phase);
  React.useEffect(() => { if (onStep) onStep("vertical/" + phase); }, [phase]);

  const activeBody = (k) => {
    if (k === "browser") return <ScBrowser vertical audioOnly={audioOnly} result={results.browser} setResult={(v) => setResult("browser", v)} onBack={onBack} onNext={() => setPhase("network")} />;
    if (k === "network") return <ScNetwork vertical audioOnly={audioOnly} setResult={(v) => setResult("network", v)} onBack={() => setPhase("browser")} onNext={() => setPhase("video")} />;
    if (k === "video") return audioOnly
      ? <ScAudioLive vertical setResult={(v) => setResult("video", v)} onBack={() => setPhase("network")} onNext={() => setPhase("result")} />
      : <ScVideoLive vertical setResult={(v) => setResult("video", v)} onBack={() => setPhase("network")} onNext={() => setPhase("result")} />;
    if (k === "result") return <ScResult vertical audioOnly={audioOnly} results={results} onRerun={rerun} onBack={() => setPhase("video")} onLaunch={onLaunch} />;
    return null;
  };

  return (
    <div style={scWrap}>
      <h1 className="serif" style={{ fontSize: 28, color: eMID, lineHeight: 1.15, margin: "0 0 6px" }}>System check</h1>
      <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT, margin: "0 0 26px", maxWidth: 620 }}>We'll take you through each check below, one at a time{target && target.name ? ", before you begin " + target.name : ""}. Your progress is shown on the left.</p>
      {SC_VSTEPS.map((s, i) => {
        const done = i < activeIndex;
        const isActive = i === activeIndex;
        const last = i === SC_VSTEPS.length - 1;
        const nodeBg = isActive ? eMID : done ? eSUCCESS : scTint(eMID, "6%");
        const nodeColor = isActive || done ? "#fff" : eMUT;
        const badgeState = s.k === "result" ? "pass" : results[s.k];
        return (
          <div key={s.k} style={{ display: "flex", gap: 18, alignItems: "stretch" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 34, flexShrink: 0 }}>
              <div style={{ width: 34, height: 34, borderRadius: 17, background: nodeBg, color: nodeColor, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, flexShrink: 0, transition: "background .3s" }}>{done ? <I.check size={16} /> : i + 1}</div>
              {!last && <div style={{ flex: 1, width: 2, minHeight: 22, background: done ? eSUCCESS : eLINE, margin: "6px 0" }} />}
            </div>
            <div style={{ flex: 1, minWidth: 0, paddingBottom: last ? 0 : 26 }}>
              {isActive ? (
                <div style={{ paddingTop: 2 }}>{activeBody(s.k)}</div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 12, minHeight: 34, opacity: done ? 1 : 0.5 }}>
                  <span style={{ color: done ? eBLUE : eMUT, display: "flex" }}>{audioOnly && s.k === "video" ? <I.mic size={17} /> : s.icon}</span>
                  <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: done ? eMID : eMUT }}>{audioOnly && s.k === "video" ? "Audio" : s.label}</span>
                  {done && <ScBadge state={badgeState} />}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// SC3 · split layout — left step-nav bar + current step content on the right (single view, no scroll)
function ScPanel({ target, onBack, onLaunch, onStep, audioOnly }) {
  const [phase, setPhase] = React.useState("browser");
  const [results, setResults] = React.useState({ browser: "pending", network: "pending", video: "pending" });
  const setResult = (k, v) => setResults((p) => (p[k] === v ? p : { ...p, [k]: v }));
  const rerun = () => { setResults({ browser: "pending", network: "pending", video: "pending" }); setPhase("browser"); };
  const activeIndex = SC_VSTEPS.findIndex((s) => s.k === phase);
  const dev = useScDevice();
  React.useEffect(() => { if (onStep) onStep("panel/" + phase); }, [phase]);

  const activeBody = (k) => {
    if (k === "browser") return <ScBrowser vertical panel audioOnly={audioOnly} result={results.browser} setResult={(v) => setResult("browser", v)} onBack={onBack} onNext={() => setPhase("network")} />;
    if (k === "network") return <ScNetwork vertical panel audioOnly={audioOnly} setResult={(v) => setResult("network", v)} onBack={() => setPhase("browser")} onNext={() => setPhase("video")} />;
    if (k === "video") return audioOnly
      ? <ScAudioLive vertical panel setResult={(v) => setResult("video", v)} onBack={() => setPhase("network")} onNext={() => setPhase("result")} />
      : <ScVideoLive vertical panel setResult={(v) => setResult("video", v)} onBack={() => setPhase("network")} onNext={() => setPhase("result")} />;
    if (k === "result") return <ScResult vertical audioOnly={audioOnly} results={results} onRerun={rerun} onBack={() => setPhase("video")} onLaunch={onLaunch} />;
    return null;
  };

  const stepLabel = (s) => (audioOnly && s.k === "video") ? "Audio" : s.label;

  if (dev === "mobile") {
    // phones: hide the side rail, show the segmented step progress + the active step full width
    return (
      <div style={scWrap}>
        <ScMobileSteps labels={SC_VSTEPS.map(stepLabel)} index={activeIndex} />
        <div style={{ minWidth: 0 }}>{activeBody(phase)}</div>
      </div>
    );
  }

  return (
    <div style={scWrap}>
      <div style={{ display: "grid", gridTemplateColumns: dev === "ipad" ? "190px minmax(0,1fr)" : "232px minmax(0,1fr)", gap: dev === "ipad" ? 22 : 32, alignItems: "start" }}>
        {/* LEFT · step navigation */}
        <div style={{ padding: "2px 8px 0 0", position: "sticky", top: 16 }}>
          <div style={{ display: "flex", gap: 9, alignItems: "flex-start", marginBottom: 22 }}>
            <span style={{ color: eBLUE, display: "flex", flexShrink: 0, marginTop: 1 }}><I.info size={17} /></span>
            <span style={{ fontFamily: "var(--sans)", fontSize: 13, color: eINK, lineHeight: 1.5 }}>Complete each step below to finish your system check.</span>
          </div>
          {SC_VSTEPS.map((s, i) => {
            const done = i < activeIndex, active = i === activeIndex, last = i === SC_VSTEPS.length - 1;
            const dim = !done && !active;
            return (
              <div key={s.k} style={{ display: "flex", gap: 14, alignItems: "stretch" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: dim ? scTint(eBLUE, "9%") : eBLUE, color: dim ? eMUT : "#fff", border: dim ? "1px solid " + scTint(eBLUE, "20%") : "none", boxShadow: active ? "0 0 0 4px " + scTint(eBLUE, "16%") : "none", transition: "background .2s, box-shadow .2s" }}>{done ? <I.check size={19} /> : (audioOnly && s.k === "video" ? <I.mic size={17} /> : s.icon)}</div>
                  {!last && <div style={{ flex: 1, width: 2, minHeight: 20, background: done ? eBLUE : scTint(eMID, "12%"), margin: "6px 0" }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0, paddingBottom: last ? 0 : 20, opacity: dim ? 0.7 : 1 }}>
                  <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: dim ? eMUT : eMID, marginTop: 9 }}>{audioOnly && s.k === "video" ? "Audio" : s.label}</div>
                  {active && <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: eMUT, lineHeight: 1.45, marginTop: 3 }}>{audioOnly && s.k === "video" ? "We check your microphone is working." : s.d}</div>}
                </div>
              </div>
            );
          })}
        </div>
        {/* RIGHT · current step */}
        <div style={{ minWidth: 0 }}>{activeBody(phase)}</div>
      </div>
    </div>
  );
}

function ScBrowser({ result, setResult, onBack, onNext, vertical, panel, audioOnly }) {
  const [rows, setRows] = React.useState([]);
  React.useEffect(() => {
    let name = "your browser", ver = "";
    try {
      const ua = navigator.userAgent;
      if (/Edg\//.test(ua)) { name = "Edge"; ver = (ua.match(/Edg\/([\d.]+)/) || [])[1] || ""; }
      else if (/OPR\//.test(ua)) { name = "Opera"; ver = (ua.match(/OPR\/([\d.]+)/) || [])[1] || ""; }
      else if (/Firefox\//.test(ua)) { name = "Firefox"; ver = (ua.match(/Firefox\/([\d.]+)/) || [])[1] || ""; }
      else if (/Chrome\//.test(ua)) { name = "Chrome"; ver = (ua.match(/Chrome\/([\d.]+)/) || [])[1] || ""; }
      else if (/Safari\//.test(ua)) { name = "Safari"; ver = (ua.match(/Version\/([\d.]+)/) || [])[1] || ""; }
    } catch (e) {}
    let webgl = false; try { webgl = !!document.createElement("canvas").getContext("webgl"); } catch (e) {}
    const mr = typeof window.MediaRecorder !== "undefined";
    let ls = false; try { localStorage.setItem("__sc", "1"); localStorage.removeItem("__sc"); ls = true; } catch (e) {}
    const all = [
      { l: "Browser Compatibility: " + name + (ver ? " " + ver : ""), ok: true },
      { l: "WebGL API Support", ok: webgl },
      { l: "MediaRecorder API Support", ok: mr },
      { l: "LocalStorage Enabled", ok: ls },
    ];
    const timers = all.map((r, i) => setTimeout(() => setRows((p) => (p.length > i ? p : [...p, r])), 350 * (i + 1)));
    const done = setTimeout(() => setResult(all.every((r) => r.ok) ? "pass" : "fail"), 350 * all.length + 250);
    return () => { timers.forEach(clearTimeout); clearTimeout(done); };
  }, []);
  const finished = result !== "pending";
  const cd = useScCountdown(SC_AUTO_ADVANCE && finished && result === "pass", onNext);
  return (
    <div style={vertical ? scWrapV : scWrap}>
      {!vertical && <ScStepper index={0} audioOnly={audioOnly} />}
      <ScHead icon={panel ? null : <I.globe size={22} />} title="Browser Compatibility Test" sub="Checking if your browser supports all required features" badge={finished ? result : "pending"} />
      <div style={{ ...scCard, padding: "6px 22px" }}>
        {rows.map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 13, padding: "13px 0", borderBottom: i < 3 ? "1px solid " + eLINE : "none" }}>
            <span style={{ color: r.ok ? eSUCCESS : eDANGER, display: "flex" }}>{r.ok ? <I.checkCircle size={20} /> : <I.alertCircle size={20} />}</span>
            <span style={{ flex: 1, fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: eMID }}>{r.l}</span>
            <ScBadge state={r.ok ? "pass" : "fail"} />
          </div>
        ))}
        {rows.length < 4 && <div style={{ padding: "13px 0", fontFamily: "var(--sans)", fontSize: 15, color: eMUT }}>Checking…</div>}
      </div>
      <ScFoot onBackClick={onBack} right={<EdBtn primary disabled={!finished} onClick={onNext}>Continue{cd != null && cd > 0 ? " (" + cd + ")" : ""} <I.arrow size={16} /></EdBtn>} />
    </div>
  );
}

// ═══ NETWORK ═══════════════════════════════════════════════════════════════
function ScNetwork({ setResult, onBack, onNext, vertical, panel, audioOnly }) {
  const [runs, setRuns] = React.useState(0);
  const [stage, setStage] = React.useState("latency"); // latency|download|upload|done
  const [dl, setDl] = React.useState(0);
  const [ul, setUl] = React.useState(0);
  const [outcome, setOutcome] = React.useState(null);

  React.useEffect(() => {
    const finalDl = runs === 0 ? 2.11 : 6.70;
    const finalUl = runs === 0 ? 6.40 : 10.04;
    let cancelled = false; const timers = [];
    const T = (fn, ms) => { const t = setTimeout(() => { if (!cancelled) fn(); }, ms); timers.push(() => clearTimeout(t)); };
    const ramp = (to, setter, ms, after) => {
      const start = Date.now();
      const iv = setInterval(() => {
        if (cancelled) { clearInterval(iv); return; }
        const t = Math.min(1, (Date.now() - start) / ms);
        setter(+(to * t).toFixed(2));
        if (t >= 1) { clearInterval(iv); after && after(); }
      }, 60);
      timers.push(() => clearInterval(iv));
    };
    setStage("latency"); setDl(0); setUl(0); setOutcome(null);
    T(() => { setStage("download"); ramp(finalDl, setDl, 1600, () => {
      T(() => { setStage("upload"); ramp(finalUl, setUl, 1600, () => {
        T(() => { const pass = finalDl >= SC_REQ_DL && finalUl >= SC_REQ_UL; setStage("done"); setOutcome(pass ? "pass" : "fail"); setResult(pass ? "pass" : "fail"); }, 300);
      }); }, 300);
    }); }, 900);
    return () => { cancelled = true; timers.forEach((c) => c()); };
  }, [runs]);

  const cd = useScCountdown(SC_AUTO_ADVANCE && outcome === "pass", onNext);
  const pending = stage !== "done";
  const mob = useScDevice() === "mobile";
  const statPad = vertical ? "12px 12px" : "18px 12px";
  return (
    <div style={vertical ? scWrapV : scWrap}>
      {!vertical && <ScStepper index={1} audioOnly={audioOnly} />}
      <ScHead icon={panel ? null : <I.wifi size={22} />} title="Internet Speed Test" sub="Testing the quality of your internet connection between our servers and your device." badge={pending ? "pending" : outcome} />
      {pending && (
        <div style={{ ...scCard, padding: "48px 22px", textAlign: "center" }}>
          <div style={{ position: "relative", width: 120, height: 120, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
            <span className="ed-ping" style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px solid " + scTint(eMID, "25%") }} />
            <span className="ed-ping" style={{ position: "absolute", inset: 18, borderRadius: "50%", border: "1px solid " + scTint(eMID, "35%"), animationDelay: ".4s" }} />
            <span style={{ width: 64, height: 64, borderRadius: "50%", background: eMID, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}><I.wifi size={30} /></span>
          </div>
          <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMID, fontWeight: 700, margin: "26px 0 0" }}>{stage === "latency" ? "Checking latency…" : stage === "download" ? "Testing download speed…" : "Testing upload speed…"}</p>
          {stage !== "latency" && (
            <div style={{ maxWidth: 340, margin: "16px auto 0" }}>
              <div style={{ height: 6, borderRadius: 3, background: eLINE, overflow: "hidden" }}><div style={{ height: "100%", width: (stage === "download" ? (dl / 8) : 1) * 100 + "%", background: eMID, borderRadius: 3, transition: "width .2s" }} /></div>
              <div style={{ fontFamily: "var(--sans)", fontSize: 28, fontWeight: 700, color: eMID, marginTop: 16 }}>{(stage === "download" ? dl : ul).toFixed(2)}</div>
              <div style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT }}>{stage === "download" ? "Download" : "Upload"}</div>
            </div>
          )}
        </div>
      )}
      {!pending && outcome === "pass" && (
        <div style={{ ...scCard, padding: vertical ? "20px" : "30px 22px", textAlign: "center" }}>
          <div style={{ width: vertical ? 50 : 60, height: vertical ? 50 : 60, borderRadius: "50%", border: "3px solid " + eSUCCESS, color: eSUCCESS, display: "flex", alignItems: "center", justifyContent: "center", margin: vertical ? "0 auto 8px" : "0 auto 12px" }}><I.check size={vertical ? 26 : 32} /></div>
          <p style={{ fontFamily: "var(--sans)", fontSize: 21, fontWeight: 700, color: eMID, margin: vertical ? "0 0 16px" : "0 0 20px" }}>Your connection speed is optimal</p>
          <div style={mob ? { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 0", maxWidth: 320, margin: "0 auto" } : { display: "flex", maxWidth: vertical ? 520 : 560, margin: "0 auto" }}>
            {[[dl.toFixed(2), "Download", "Mbps", eMID], [ul.toFixed(2), "Upload", "Mbps", eMID], [SC_REQ_DL, "Required", "download", eINK], [SC_REQ_UL, "Required", "upload", eINK]].map((s, i) => (
              <div key={i} style={{ flex: mob ? undefined : 1, padding: "0 6px", borderLeft: mob ? (i % 2 === 1 ? "1px solid " + eLINE : "none") : (i > 0 ? "1px solid " + eLINE : "none") }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: vertical ? 21 : 28, fontWeight: 700, color: s[3] }}>{s[0]}</div>
                <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: eMUT, marginTop: 3, lineHeight: 1.35 }}>{s[1]}<br />{s[2]}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {!pending && outcome === "fail" && (
        <div style={{ ...scCard, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ color: eDANGER, display: "flex", flexShrink: 0, marginTop: 2 }}><I.alertCircle size={22} /></span>
              <div><h3 style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: eMID, margin: "0 0 4px" }}>Internet speed is slower than required for the campaign</h3><p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, margin: 0, lineHeight: 1.5 }}>Minimum Download Speed of {SC_REQ_DL} Mbps and Minimum Upload Speed of {SC_REQ_UL} Mbps required for this campaign.</p></div>
            </div>
            <ScBadge state="fail" />
          </div>
          <ScHowToFix items={["Close other applications that may be using bandwidth (video streaming, downloads)", "Move closer to your Wi-Fi router or connect via ethernet cable", "Restart your router/modem and try again", "Try using a different network connection if available", "If the issue persists, contact your internet service provider for further assistance"]} />
        </div>
      )}
      <ScFoot onBackClick={onBack} right={<React.Fragment>
        {!pending && <EdBtn onClick={() => setRuns((r) => r + 1)}><I.sync size={15} /> Re-run Check</EdBtn>}
        <EdBtn primary disabled={pending} onClick={onNext}>Continue{cd != null && cd > 0 ? " (" + cd + ")" : ""} <I.arrow size={16} /></EdBtn>
      </React.Fragment>} />
    </div>
  );
}

// Illustrative mock of the browser's camera/mic permission prompt — shown in the
// flow so people see how granting access will look. It is the app's own UI (not a
// real system dialog); "Allow" proceeds to the real camera step.
function ScPermissionPrompt({ host, onAllow, onDeny }) {
  const pill = { display: "block", width: "100%", textAlign: "center", background: scTint(eBLUE, "14%"), color: eMID, border: "none", borderRadius: 999, padding: "12px 16px", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, cursor: "pointer" };
  const dd = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, background: "#fff", border: "1px solid " + eLINE, borderRadius: 10, padding: "10px 12px", fontFamily: "var(--sans)", fontSize: 15, color: eINK };
  const row = { display: "flex", alignItems: "center", gap: 12, color: "#3c4043", fontFamily: "var(--sans)", fontSize: 15 };
  const panel = { background: scTint(eBLUE, "9%"), borderRadius: 12, padding: 12, marginBottom: 12 };
  return (
    <div onClick={onDeny} style={{ position: "fixed", inset: 0, background: "rgba(0,15,71,.32)", zIndex: 200, display: "flex", alignItems: "flex-start", justifyContent: "flex-start", padding: "14px 16px 16px 14px", overflow: "auto" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 380, maxWidth: "100%", background: "#fff", borderRadius: 16, boxShadow: "0 24px 64px rgba(0,0,0,.34)", padding: "18px 18px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
          <div style={{ fontFamily: "var(--sans)", fontSize: 15, color: "#202124", lineHeight: 1.35 }}><span style={{ fontWeight: 700 }}>{host}</span><br />wants to</div>
          <button onClick={onDeny} aria-label="Close" style={{ background: "none", border: "none", cursor: "pointer", color: "#5f6368", fontSize: 21, lineHeight: 1, padding: 0 }}>&times;</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 13, marginBottom: 16 }}>
          <div style={row}><I.cam size={18} /> Use available cameras (1)</div>
          <div style={row}><I.mic size={18} /> Use available microphones (3)</div>
        </div>
        <div style={panel}>
          <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", background: "#0b1020", aspectRatio: "16 / 10", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "rgba(255,255,255,.55)", display: "flex" }}><I.cam size={30} /></span>
            <span style={{ position: "absolute", top: 8, right: 8, background: "#c8f0d0", color: "#137333", fontFamily: "var(--sans)", fontSize: 11.5, fontWeight: 700, borderRadius: 999, padding: "3px 9px", display: "inline-flex", alignItems: "center", gap: 5 }}><I.cam size={12} /> Preview</span>
          </div>
          <div style={dd}><span>FaceTime HD Camera</span><I.chevD size={16} /></div>
        </div>
        <div style={panel}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ color: "#5f6368", display: "flex" }}><I.mic size={16} /></span>
            <div style={{ flex: 1, height: 4, borderRadius: 2, background: "#dfe1e5", position: "relative" }}><span style={{ position: "absolute", left: 6, top: -4, width: 12, height: 12, borderRadius: 6, background: eBLUE }} /></div>
          </div>
          <div style={dd}><span>MacBook Pro Microphone</span><I.chevD size={16} /></div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button onClick={onAllow} style={pill}>Allow while visiting the site</button>
          <button onClick={onAllow} style={pill}>Allow this time</button>
          <button onClick={onDeny} style={pill}>Never allow</button>
        </div>
      </div>
    </div>
  );
}

// ═══ VIDEO AND AUDIO ═══════════════════════════════════════════════════════
// Simulated for the prototype: no real camera capture or recording. Every screen
// (permission popup, preview, countdown, recording, review, checking, pass, fail,
// denied) is mocked with a placeholder webcam thumbnail so the whole flow demos.
function ScVideo({ setResult, onBack, onNext, onStep, vertical }) {
  const [vstate, setVstate] = React.useState("permission"); // permission|denied|preview|countdown|recording|reviewing|checking|pass|fail
  const [attempts, setAttempts] = React.useState(0);
  const [count, setCount] = React.useState(3);
  const [sec, setSec] = React.useState(0);
  React.useEffect(() => { if (onStep) onStep("video/" + vstate); }, [vstate]);

  React.useEffect(() => {
    if (vstate !== "countdown") return;
    setCount(3); let c = 3;
    const iv = setInterval(() => { c -= 1; setCount(c); if (c <= 0) { clearInterval(iv); setVstate("recording"); } }, 800);
    return () => clearInterval(iv);
  }, [vstate]);

  React.useEffect(() => {
    if (vstate !== "recording") return;
    setSec(0); let s = 0;
    const iv = setInterval(() => { s += 1; setSec(s); if (s >= 30) { clearInterval(iv); setVstate("reviewing"); } }, 1000);
    return () => clearInterval(iv);
  }, [vstate]);

  const evaluate = () => { setVstate("checking"); setTimeout(() => { const ok = attempts >= 1; setVstate(ok ? "pass" : "fail"); setResult(ok ? "pass" : "fail"); }, 1400); };

  let host = "this site"; try { host = window.location.hostname || host; } catch (e) {}
  const media = { position: "relative", width: "100%", background: "linear-gradient(160deg,#16264a,#0b1020)", borderRadius: 14, overflow: "hidden", aspectRatio: "16 / 9" };
  const overlayText = { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, textAlign: "center", padding: 24, color: "#fff", zIndex: 2 };
  const silhouette = (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "flex-end", justifyContent: "center", overflow: "hidden" }}>
      <svg viewBox="0 0 120 78" width="42%" style={{ opacity: 0.3, display: "block" }} fill="#cfe0ff" aria-hidden="true">
        <circle cx="60" cy="30" r="19" /><path d="M18 78 C18 55 38 48 60 48 C82 48 102 55 102 78 Z" />
      </svg>
    </div>
  );
  const chip = (icon, label) => <span style={{ background: "#DCE6F5", color: eMID, borderRadius: 8, padding: "5px 10px", fontFamily: "var(--sans)", fontSize: 11.5, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6 }}>{icon} {label}</span>;

  if (vstate === "permission") {
    return (
      <div style={vertical ? scWrapV : scWrap}>
        {!vertical && <ScStepper index={2} />}
        <ScHead icon={<I.cam size={22} />} title="Camera and Microphone Test" sub="Verify your camera and microphone work properly, then play back your recording to confirm." badge="pending" />
        <div style={media}>{silhouette}<div style={overlayText}><span style={{ fontFamily: "var(--sans)", fontSize: 15, color: "rgba(255,255,255,.75)" }}>Allow camera &amp; microphone access to continue.</span></div></div>
        <ScFoot onBackClick={onBack} right={<EdBtn onClick={() => setVstate("permission")}>Show permission prompt</EdBtn>} />
        <ScPermissionPrompt host={host} onAllow={() => setVstate("preview")} onDeny={() => { setResult("fail"); setVstate("denied"); }} />
      </div>
    );
  }

  if (vstate === "denied") {
    return (
      <div style={vertical ? scWrapV : scWrap}>
        {!vertical && <ScStepper index={2} />}
        <ScHead icon={<I.cam size={22} />} title="Camera and Microphone Test" sub="Verify your camera and microphone work properly, then play back your recording to confirm." badge="fail" />
        <div style={{ background: scTint(eMID, "4%"), border: "1px solid " + eLINE, borderRadius: 14, padding: "60px 24px", textAlign: "center" }}>
          <span style={{ color: eDANGER, display: "inline-flex" }}><I.alertCircle size={44} /></span>
          <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMID, fontWeight: 700, maxWidth: 460, margin: "16px auto 0", lineHeight: 1.5 }}>Camera/Microphone access was denied or blocked by your browser. Please check your browser permissions.</p>
        </div>
        <ScHowToFix items={["Check your browser's site permissions and allow camera & microphone access", "Refresh the browser to apply the changes, then re-run the check"]} />
        <ScFoot onBackClick={onBack} right={<React.Fragment>
          <EdBtn onClick={() => { setAttempts((a) => a + 1); setVstate("permission"); }}><I.sync size={15} /> Re-run Check</EdBtn>
          <EdBtn primary onClick={() => { setResult("fail"); onNext(); }}>Continue <I.arrow size={16} /></EdBtn>
        </React.Fragment>} />
      </div>
    );
  }

  return (
    <div style={vertical ? scWrapV : scWrap}>
      {!vertical && <ScStepper index={2} />}
      <ScHead icon={<I.cam size={22} />} title="Camera and Microphone Test" sub="Verify your camera and microphone work properly, then play back your recording to confirm." badge={vstate === "pass" ? "pass" : vstate === "fail" ? "fail" : "pending"} />

      {(vstate === "preview" || vstate === "countdown" || vstate === "recording") && (
        <div style={media}>
          {silhouette}
          {vstate === "preview" && <div style={{ ...overlayText, background: "rgba(0,15,71,.5)" }}>
            <p style={{ fontFamily: "var(--sans)", fontSize: 15, lineHeight: 1.5, maxWidth: 460, margin: 0 }}>Select your microphone and camera, click <strong>Let's start</strong>, then read aloud and repeat the sentence appearing at the bottom 3 times.</p>
            <EdBtn primary dark onClick={() => setVstate("countdown")}>Let's start! <I.arrow size={16} /></EdBtn>
          </div>}
          {vstate === "countdown" && <div style={overlayText}><div style={{ fontFamily: "var(--sans)", fontSize: 40, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{count > 0 ? count : ""}</div></div>}
          {vstate === "recording" && <React.Fragment>
            {/* top-left: REC pill + live audio meter */}
            <div style={{ position: "absolute", left: 14, top: 14, zIndex: 3, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,15,71,.55)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", color: "#fff", borderRadius: 8, padding: "6px 12px", fontFamily: "var(--sans)", fontSize: 13, fontWeight: 700, letterSpacing: ".02em" }}>
                <span className="ed-blink" style={{ width: 9, height: 9, borderRadius: 5, background: eDANGER, display: "inline-block", boxShadow: "0 0 0 4px rgba(203,17,17,.25)" }} />
                REC {String(Math.floor(sec / 60)).padStart(2, "0")}:{String(sec % 60).padStart(2, "0")}
              </span>
              <span title="Microphone level" style={{ display: "inline-flex", alignItems: "center", gap: 3, height: 30, background: "rgba(0,15,71,.55)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", borderRadius: 8, padding: "0 12px" }}>
                {[0, 1, 2, 3, 4].map((i) => <span key={i} className="ed-eq" style={{ width: 3, borderRadius: 2, background: "#7fd0a0", animationDelay: (i * 0.13) + "s" }} />)}
              </span>
            </div>

            {/* teleprompter caption */}
            <div style={{ position: "absolute", left: 16, right: 16, bottom: 82, zIndex: 3, display: "flex", justifyContent: "center" }}>
              <div style={{ maxWidth: 620, background: "rgba(0,15,71,.6)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,.14)", borderRadius: 14, padding: "14px 22px", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: 11.5, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(220,230,245,.72)", marginBottom: 8 }}>Read aloud</div>
                <p style={{ fontFamily: "var(--sans)", fontSize: 15, lineHeight: 1.5, color: "#fff", margin: 0, fontWeight: 700 }}>{SC_PHRASE}</p>
              </div>
            </div>

            {/* bottom: progress toward 0:30 + Stop */}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 3, background: "linear-gradient(transparent, rgba(0,0,0,.55))", padding: "44px 16px 14px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1, height: 5, borderRadius: 3, background: "rgba(255,255,255,.22)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: (Math.min(sec, 30) / 30 * 100) + "%", background: eDANGER, borderRadius: 3, transition: "width .9s linear" }} />
                </div>
                <span style={{ fontFamily: "var(--sans)", fontSize: 11.5, fontWeight: 700, color: "rgba(255,255,255,.82)", minWidth: 42 }}>{String(Math.floor(sec / 60)).padStart(2, "0")}:{String(sec % 60).padStart(2, "0")} / 00:30</span>
              </div>
              <button onClick={() => setVstate("reviewing")} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: eDANGER, color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 14px rgba(203,17,17,.4)" }}>
                <span style={{ width: 11, height: 11, borderRadius: 2, background: "#fff", display: "inline-block" }} /> Stop recording
              </button>
            </div>
          </React.Fragment>}
          {vstate === "preview" && <div style={{ position: "absolute", left: 14, top: 14, display: "flex", gap: 8, zIndex: 2 }}>{chip(<I.cam size={13} />, "FaceTime HD Camera")}{chip(<I.mic size={13} />, "MacBook Pro Microphone")}</div>}
        </div>
      )}

      {vstate === "reviewing" && (
        <div>
          <div style={{ ...media, cursor: "pointer" }} onClick={evaluate}>
            {silhouette}
            <div style={overlayText}>
              <span style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,.9)", color: eMID, display: "flex", alignItems: "center", justifyContent: "center" }}><I.play size={26} /></span>
              <span style={{ fontFamily: "var(--sans)", fontSize: 15, color: "rgba(255,255,255,.85)" }}>Your recording &middot; 0:30</span>
            </div>
          </div>
          <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT, margin: "12px 0 0", textAlign: "center" }}>Play back your recording. If your video and audio are clear, confirm to continue.</p>
        </div>
      )}

      {vstate === "checking" && <div style={{ ...scCard, padding: "60px 22px", textAlign: "center" }}><span className="ed-spin" style={{ width: 28, height: 28, borderRadius: 14, border: "3px solid " + eLINE, borderTopColor: eBLUE, display: "inline-block" }} /><p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMID, margin: "16px 0 0" }}>Verifying your recording…</p></div>}

      {vstate === "fail" && <div style={{ background: scTint(eMID, "4%"), border: "1px solid " + eLINE, borderRadius: 14, padding: "56px 24px", textAlign: "center" }}>
        <span style={{ color: eDANGER, display: "inline-flex" }}><I.alertCircle size={44} /></span>
        <h3 style={{ fontFamily: "var(--sans)", fontSize: 21, fontWeight: 700, color: eMID, margin: "14px 0 6px" }}>Video check failed</h3>
        <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT, maxWidth: 480, margin: "0 auto", lineHeight: 1.5 }}>Your speech did not match the test phrase. Please try again and speak the phrase clearly.</p>
      </div>}

      {vstate === "pass" && <div style={{ ...scCard, padding: "40px 22px", textAlign: "center", background: scTint(eSUCCESS, "6%"), borderColor: scTint(eSUCCESS, "22%") }}>
        <div style={{ width: 62, height: 62, borderRadius: "50%", background: eSUCCESS, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}><I.check size={30} /></div>
        <h3 style={{ fontFamily: "var(--sans)", fontSize: 21, fontWeight: 700, color: eMID, margin: "0 0 6px" }}>Camera and microphone verified</h3>
        <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, margin: 0 }}>Your video and audio are working correctly.</p>
      </div>}

      <ScFoot onBackClick={onBack} right={<React.Fragment>
        {vstate === "reviewing" && <EdBtn onClick={() => { setAttempts((a) => a + 1); setVstate("preview"); }}>Re-record</EdBtn>}
        {vstate === "reviewing" && <EdBtn primary onClick={evaluate}>Confirm recording <I.arrow size={16} /></EdBtn>}
        {vstate === "fail" && <EdBtn onClick={() => { setAttempts((a) => a + 1); setVstate("preview"); }}><I.sync size={15} /> Re-run Check</EdBtn>}
        {vstate === "fail" && <EdBtn primary onClick={onNext}>Continue <I.arrow size={16} /></EdBtn>}
        {vstate === "pass" && <EdBtn primary onClick={onNext}>Continue <I.arrow size={16} /></EdBtn>}
      </React.Fragment>} />
    </div>
  );
}


// ═══ VIDEO (LIVE CAPTURE) ══════════════════════════════════════════════════
// Real camera + microphone via getUserMedia + MediaRecorder. Used in SC2 (vertical).
// Falls back to clear "enable / denied / unsupported" states where the camera is
// blocked (e.g. sandboxed preview panes); the live feed works on the deployed site.
function ScVideoLive({ setResult, onBack, onNext, vertical, panel }) {
  const [vstate, setVstate] = React.useState("intro"); // intro|denied|unsupported|preview|countdown|recording|reviewing|checking|pass
  const [count, setCount] = React.useState(3);
  const [sec, setSec] = React.useState(0);
  const [busy, setBusy] = React.useState(false);
  const [devices, setDevices] = React.useState({ cam: "Camera", mic: "Microphone" });
  const [level, setLevel] = React.useState(0);
  const [cameras, setCameras] = React.useState([]);
  const [mics, setMics] = React.useState([]);
  const [selCam, setSelCam] = React.useState("");
  const [selMic, setSelMic] = React.useState("");
  const [devMenu, setDevMenu] = React.useState(null); // null | "cam" | "mic"
  const [pbPlaying, setPbPlaying] = React.useState(false);
  const [pbTime, setPbTime] = React.useState(0);
  const [pbDur, setPbDur] = React.useState(0);
  const [pbMuted, setPbMuted] = React.useState(false);
  const videoRef = React.useRef(null);
  const playbackRef = React.useRef(null);
  const streamRef = React.useRef(null);
  const recorderRef = React.useRef(null);
  const chunksRef = React.useRef([]);
  const blobUrlRef = React.useRef(null);
  const audioCtxRef = React.useRef(null);
  const rafRef = React.useRef(null);

  const supported = typeof navigator !== "undefined" && navigator.mediaDevices && navigator.mediaDevices.getUserMedia && typeof window.MediaRecorder !== "undefined";

  const stopMeter = () => { try { if (rafRef.current) cancelAnimationFrame(rafRef.current); } catch (e) {} rafRef.current = null; try { if (audioCtxRef.current) { audioCtxRef.current.close(); } } catch (e) {} audioCtxRef.current = null; };
  const stopStream = () => { stopMeter(); try { if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop()); } catch (e) {} streamRef.current = null; };
  React.useEffect(() => () => { stopStream(); try { if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current); } catch (e) {} }, []);

  React.useEffect(() => {
    if ((vstate === "preview" || vstate === "countdown" || vstate === "recording") && videoRef.current && streamRef.current) {
      try { videoRef.current.srcObject = streamRef.current; const p = videoRef.current.play(); if (p && p.catch) p.catch(() => {}); } catch (e) {}
    }
  }, [vstate]);

  const startMeter = (stream) => {
    try {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      const ctx = new AC(); audioCtxRef.current = ctx;
      const analyser = ctx.createAnalyser(); analyser.fftSize = 256;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => { analyser.getByteFrequencyData(data); let sum = 0; for (let i = 0; i < data.length; i++) sum += data[i]; setLevel(Math.min(1, (sum / data.length) / 80)); rafRef.current = requestAnimationFrame(tick); };
      tick();
    } catch (e) {}
  };

  const enumDevices = async () => {
    try {
      const list = await navigator.mediaDevices.enumerateDevices();
      setCameras(list.filter((d) => d.kind === "videoinput"));
      setMics(list.filter((d) => d.kind === "audioinput"));
    } catch (e) {}
  };

  const enable = async () => {
    if (!supported) { setVstate("unsupported"); setResult("fail"); return; }
    setBusy(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: true });
      streamRef.current = stream;
      const vt = stream.getVideoTracks()[0], at = stream.getAudioTracks()[0];
      setDevices({ cam: (vt && vt.label) || "Camera", mic: (at && at.label) || "Microphone" });
      try { setSelCam(vt && vt.getSettings ? vt.getSettings().deviceId || "" : ""); } catch (e) {}
      try { setSelMic(at && at.getSettings ? at.getSettings().deviceId || "" : ""); } catch (e) {}
      enumDevices();
      startMeter(stream);
      setBusy(false); setVstate("preview");
    } catch (err) { setBusy(false); setResult("fail"); setVstate("denied"); }
  };

  const switchDevice = async (kind, deviceId) => {
    setDevMenu(null);
    if (kind === "cam") setSelCam(deviceId); else setSelMic(deviceId);
    try {
      stopMeter();
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
      const camId = kind === "cam" ? deviceId : selCam;
      const micId = kind === "mic" ? deviceId : selMic;
      const stream = await navigator.mediaDevices.getUserMedia({
        video: camId ? { deviceId: { exact: camId }, width: 1280, height: 720 } : { width: 1280, height: 720 },
        audio: micId ? { deviceId: { exact: micId } } : true,
      });
      streamRef.current = stream;
      const vt = stream.getVideoTracks()[0], at = stream.getAudioTracks()[0];
      setDevices({ cam: (vt && vt.label) || "Camera", mic: (at && at.label) || "Microphone" });
      startMeter(stream);
      if (videoRef.current) { videoRef.current.srcObject = stream; const p = videoRef.current.play(); if (p && p.catch) p.catch(() => {}); }
    } catch (e) {}
  };

  React.useEffect(() => {
    if (vstate !== "countdown") return;
    setCount(3); let c = 3;
    const iv = setInterval(() => { c -= 1; setCount(c); if (c <= 0) { clearInterval(iv); startRecording(); } }, 800);
    return () => clearInterval(iv);
  }, [vstate]);

  const startRecording = () => {
    if (!streamRef.current) { setVstate("preview"); return; }
    try {
      chunksRef.current = [];
      const cands = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm", "video/mp4"];
      let mime = ""; for (const m of cands) { try { if (window.MediaRecorder.isTypeSupported && window.MediaRecorder.isTypeSupported(m)) { mime = m; break; } } catch (e) {} }
      const rec = mime ? new MediaRecorder(streamRef.current, { mimeType: mime }) : new MediaRecorder(streamRef.current);
      recorderRef.current = rec;
      rec.ondataavailable = (e) => { if (e.data && e.data.size) chunksRef.current.push(e.data); };
      rec.onstop = () => { try { const blob = new Blob(chunksRef.current, { type: mime || "video/webm" }); if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current); blobUrlRef.current = URL.createObjectURL(blob); } catch (e) {} setVstate("reviewing"); };
      rec.start();
      setVstate("recording");
    } catch (e) { setVstate("preview"); }
  };

  React.useEffect(() => {
    if (vstate !== "recording") return;
    setSec(0); let s = 0;
    const iv = setInterval(() => { s += 1; setSec(s); if (s >= 30) { clearInterval(iv); stopRecording(); } }, 1000);
    return () => clearInterval(iv);
  }, [vstate]);

  const stopRecording = () => { try { if (recorderRef.current && recorderRef.current.state !== "inactive") recorderRef.current.stop(); else setVstate("reviewing"); } catch (e) { setVstate("reviewing"); } };

  React.useEffect(() => { if (vstate === "reviewing" && playbackRef.current && blobUrlRef.current) { try { playbackRef.current.src = blobUrlRef.current; } catch (e) {} } }, [vstate]);

  const confirm = () => { setVstate("checking"); setTimeout(() => { stopStream(); setResult("pass"); setVstate("pass"); }, 1300); };
  const reRecord = () => { setVstate("preview"); };

  const media = { position: "relative", width: "100%", background: "linear-gradient(160deg,#0a1a55,#000f47)", borderRadius: 14, overflow: "hidden", aspectRatio: panel ? "3 / 2" : "16 / 9" };
  const overlay = { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, textAlign: "center", padding: 24, color: "#fff", zIndex: 2 };
  const chip = (icon, label) => <span title={label} style={{ background: "#DCE6F5", color: eMID, borderRadius: 8, padding: "5px 10px", fontFamily: "var(--sans)", fontSize: 11.5, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6, maxWidth: 200, minWidth: 0 }}><span style={{ flexShrink: 0, display: "flex" }}>{icon}</span><span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>{label}</span></span>;
  const liveVideo = <video ref={videoRef} autoPlay muted playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)", zIndex: 0 }} />;

  const ctrlBar = { position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 4 };
  const barRow = { background: eMID, display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 8, padding: "10px 12px", minHeight: 36 };
  const devBtn = (kind) => (
    <button onClick={() => setDevMenu((m) => (m === kind ? null : kind))} title={kind === "cam" ? "Select camera" : "Select microphone"}
      style={{ display: "inline-flex", alignItems: "center", gap: 5, background: devMenu === kind ? "rgba(255,255,255,.14)" : "transparent", color: "#fff", border: "1.5px solid rgba(255,255,255,.85)", borderRadius: 8, padding: "8px 10px", cursor: "pointer", flexShrink: 0 }}>
      {kind === "cam" ? <I.cam size={16} /> : <I.mic size={16} />} <I.chevD size={11} />
    </button>
  );
  const devControls = <div style={{ justifySelf: "end", display: "inline-flex", alignItems: "center", gap: 8 }}>{devBtn("mic")}{devBtn("cam")}</div>;
  const devPopover = devMenu && (
    <React.Fragment>
      <div onClick={() => setDevMenu(null)} style={{ position: "absolute", inset: 0, zIndex: 5 }} />
      <div style={{ position: "absolute", right: 12, bottom: 62, zIndex: 6, width: 280, background: "#fff", border: "1px solid " + eLINE, borderRadius: 12, boxShadow: "0 12px 30px rgba(0,15,71,.22)", padding: 12 }}>
        <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: eMID, marginBottom: 8 }}>{devMenu === "cam" ? "Select a Camera" : "Select a Microphone"}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, maxHeight: 190, overflowY: "auto" }}>
          {(devMenu === "cam" ? cameras : mics).map((d, i) => {
            const on = (devMenu === "cam" ? selCam : selMic) === d.deviceId;
            return (
              <button key={d.deviceId || i} onClick={() => switchDevice(devMenu, d.deviceId)}
                style={{ display: "flex", alignItems: "center", gap: 8, textAlign: "left", background: on ? scTint(eBLUE, "8%") : "transparent", border: "none", borderRadius: 8, padding: "9px 10px", cursor: "pointer", fontFamily: "var(--sans)", fontSize: 13, fontWeight: on ? 700 : 400, color: on ? eMID : eINK }}>
                <span style={{ width: 15, color: eBLUE, display: "flex", flexShrink: 0 }}>{on ? <I.check size={14} /> : null}</span>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.label || ((devMenu === "cam" ? "Camera " : "Microphone ") + (i + 1))}</span>
              </button>
            );
          })}
          {(devMenu === "cam" ? cameras : mics).length === 0 && <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: eMUT, padding: "6px 10px" }}>No devices found</div>}
        </div>
      </div>
    </React.Fragment>
  );
  const audioMeter = (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 3, height: 26, background: "rgba(0,15,71,.5)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", borderRadius: 8, padding: "0 11px" }}>
      {[0, 1, 2, 3, 4].map((i) => { const h = Math.max(4, Math.min(18, 4 + level * 34 * (i === 2 ? 1 : i % 2 ? 0.7 : 0.45))); return <span key={i} style={{ width: 3, height: h, borderRadius: 2, background: "#fff", transition: "height .08s linear" }} />; })}
    </span>
  );

  return (
    <div style={vertical ? scWrapV : scWrap}>
      {!vertical && <ScStepper index={2} />}
      <ScHead icon={panel ? null : <I.cam size={22} />} title="Camera and Microphone Test" sub="We'll use your real camera and microphone. Record a short clip, then play it back to confirm." badge={vstate === "pass" ? "pass" : (vstate === "denied" || vstate === "unsupported") ? "fail" : "pending"} />

      {(vstate === "intro" || vstate === "denied" || vstate === "unsupported") && (
        <div style={media}>
          <div style={overlay}>
            <span style={{ color: vstate === "intro" ? "#CEECFF" : "#FFC9C7", display: "flex" }}>{vstate === "intro" ? <I.cam size={40} /> : <I.alertCircle size={40} />}</span>
            <p style={{ fontFamily: "var(--sans)", fontSize: 15, lineHeight: 1.55, maxWidth: 480, margin: 0 }}>
              {vstate === "intro" && "Select your microphone and camera, click Record, then read aloud and repeat the sentence appearing at the bottom 3 times."}
              {vstate === "denied" && "Camera and microphone access was blocked. Allow access in your browser's site settings (address-bar icon), then try again."}
              {vstate === "unsupported" && "Live camera capture isn't available in this browser or context. Open the check on the deployed site in Chrome, Edge, Safari or Firefox."}
            </p>
            {vstate !== "unsupported" && <EdBtn primary dark disabled={busy} onClick={enable}>{busy ? "Requesting access…" : vstate === "denied" ? "Try again" : "Let's start!"} <I.arrow size={16} /></EdBtn>}
          </div>
        </div>
      )}

      {(vstate === "preview" || vstate === "countdown" || vstate === "recording") && (
        <div style={media}>
          {liveVideo}

          {vstate === "countdown" && <div style={{ ...overlay, background: "rgba(0,15,71,.35)" }}><div style={{ fontFamily: "var(--sans)", fontSize: 72, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{count > 0 ? count : ""}</div></div>}

          {vstate === "recording" && <div style={{ position: "absolute", top: 14, right: 14, zIndex: 4 }}>{audioMeter}</div>}

          {devPopover}

          {(vstate === "preview" || vstate === "countdown") && (
            <div style={ctrlBar}>
              <div style={barRow}>
                <div />
                <button disabled={vstate === "countdown"} onClick={() => { setDevMenu(null); setVstate("countdown"); }}
                  style={{ justifySelf: "center", display: "inline-flex", alignItems: "center", gap: 8, background: "#DCE6F5", color: eMID, border: "1.5px solid #DCE6F5", borderRadius: 8, padding: "9px 22px", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, cursor: vstate === "countdown" ? "default" : "pointer", opacity: vstate === "countdown" ? 0.55 : 1 }}>
                  <I.cam size={17} /> Record
                </button>
                {devControls}
              </div>
            </div>
          )}

          {vstate === "recording" && (
            <div style={ctrlBar}>
              <div style={{ background: "rgba(0,15,71,.82)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", padding: "12px 18px", textAlign: "center" }}>
                <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: "#fff" }}>{SC_PHRASE}</span>
              </div>
              <div style={{ height: 4, background: "rgba(255,255,255,.2)" }}><div style={{ height: "100%", width: (Math.min(sec, 30) / 30 * 100) + "%", background: eBLUE, transition: "width .9s linear" }} /></div>
              <div style={barRow}>
                <span style={{ justifySelf: "start", display: "inline-flex", alignItems: "center", gap: 8, color: "#fff", fontFamily: "var(--sans)", fontSize: 13, fontWeight: 700 }}>
                  <span className="ed-blink" style={{ width: 8, height: 8, borderRadius: 4, background: eDANGER, display: "inline-block" }} /> REC {String(Math.floor(sec / 60)).padStart(2, "0")}:{String(sec % 60).padStart(2, "0")} / 00:30
                </span>
                <button onClick={stopRecording} style={{ justifySelf: "center", display: "inline-flex", alignItems: "center", gap: 8, background: eDANGER, color: "#fff", border: "none", borderRadius: 8, padding: "9px 22px", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, cursor: "pointer" }}><span style={{ width: 11, height: 11, borderRadius: 2, background: "#fff", display: "inline-block" }} /> Stop</button>
                {devControls}
              </div>
            </div>
          )}
        </div>
      )}

      {vstate === "reviewing" && (
        <div>
          <div style={media}>
            <video ref={playbackRef} playsInline
              onClick={() => { const v = playbackRef.current; if (!v) return; if (v.paused) v.play(); else v.pause(); }}
              onPlay={() => setPbPlaying(true)} onPause={() => setPbPlaying(false)} onEnded={() => setPbPlaying(false)}
              onTimeUpdate={(e) => setPbTime(e.target.currentTime || 0)}
              onLoadedMetadata={(e) => { const v = e.target; if (!isFinite(v.duration) || isNaN(v.duration)) { v.currentTime = 1e101; const onT = () => { v.removeEventListener("timeupdate", onT); v.currentTime = 0; setPbDur(isFinite(v.duration) ? v.duration : 0); }; v.addEventListener("timeupdate", onT); } else setPbDur(v.duration); }}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1, cursor: "pointer" }} />
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 3, background: "linear-gradient(transparent, rgba(0,0,0,.65))", padding: "44px 16px 12px", display: "flex", alignItems: "center", gap: 14 }}>
              <button onClick={() => { const v = playbackRef.current; if (!v) return; if (v.paused) v.play(); else v.pause(); }} title={pbPlaying ? "Pause" : "Play"}
                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "transparent", color: "#fff", border: "none", cursor: "pointer", flexShrink: 0, padding: 2 }}>
                {pbPlaying ? <I.pause size={20} /> : <I.play size={20} />}
              </button>
              <span style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 700, color: "#fff", flexShrink: 0, minWidth: 34 }}>{Math.floor((pbTime || 0) / 60)}:{String(Math.floor((pbTime || 0) % 60)).padStart(2, "0")}</span>
              <div onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); const f = (e.clientX - r.left) / r.width; if (playbackRef.current && pbDur) playbackRef.current.currentTime = Math.max(0, Math.min(1, f)) * pbDur; }}
                style={{ flex: 1, height: 5, borderRadius: 3, background: "rgba(255,255,255,.35)", cursor: "pointer", position: "relative" }}>
                <div style={{ height: "100%", width: (pbDur ? Math.min(100, (pbTime / pbDur) * 100) : 0) + "%", background: "#fff", borderRadius: 3 }} />
              </div>
              <button onClick={() => { const v = playbackRef.current; const nm = !pbMuted; setPbMuted(nm); if (v) v.muted = nm; }} title={pbMuted ? "Unmute" : "Mute"}
                style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "transparent", color: "#fff", border: "none", cursor: "pointer", flexShrink: 0, padding: 2, opacity: pbMuted ? 0.5 : 1 }}>
                <I.volume size={19} />
              </button>
            </div>
          </div>
          <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT, margin: "12px 0 0", textAlign: "center" }}>Play back your recording. If your video and audio are clear, confirm to continue.</p>
        </div>
      )}

      {vstate === "checking" && <div style={{ ...scCard, padding: "48px 22px", textAlign: "center" }}><span className="ed-spin" style={{ width: 28, height: 28, borderRadius: 14, border: "3px solid " + eLINE, borderTopColor: eBLUE, display: "inline-block" }} /><p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMID, margin: "16px 0 0" }}>Verifying your recording…</p></div>}

      {vstate === "pass" && <div style={{ ...scCard, padding: "34px 22px", textAlign: "center", background: scTint(eSUCCESS, "6%"), borderColor: scTint(eSUCCESS, "22%") }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: eSUCCESS, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}><I.check size={28} /></div>
        <h3 style={{ fontFamily: "var(--sans)", fontSize: 21, fontWeight: 700, color: eMID, margin: "0 0 6px" }}>Camera and microphone verified</h3>
        <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, margin: 0 }}>Your video and audio are working correctly.</p>
      </div>}

      <ScFoot onBackClick={onBack} right={<React.Fragment>
        {vstate === "reviewing" && <EdBtn onClick={reRecord}><I.sync size={15} /> Retake</EdBtn>}
        {vstate === "reviewing" && <EdBtn primary onClick={confirm}>Confirm recording <I.arrow size={16} /></EdBtn>}
        {(vstate === "denied" || vstate === "unsupported") && <EdBtn primary onClick={() => { setResult("fail"); onNext(); }}>Continue <I.arrow size={16} /></EdBtn>}
        {vstate === "pass" && <EdBtn primary onClick={onNext}>Continue <I.arrow size={16} /></EdBtn>}
      </React.Fragment>} />
    </div>
  );
}

// ═══ AUDIO ONLY (MICROPHONE TEST) ══════════════════════════════════════════
// Audio-only variant of the proctored recording step: real getUserMedia(audio),
// live waveform, MediaRecorder, playback. Same placement as the client reference,
// styled in MDS. Used when the campaign is flagged audioOnly.
function ScAudioLive({ setResult, onBack, onNext, vertical, panel }) {
  const [vstate, setVstate] = React.useState("loading"); // loading|ready|denied|unsupported|recording|reviewing|pass
  const [sec, setSec] = React.useState(0);
  const [mics, setMics] = React.useState([]);
  const [selMic, setSelMic] = React.useState("");
  const [micLabel, setMicLabel] = React.useState("Microphone");
  const [devMenu, setDevMenu] = React.useState(false);
  const [pbPlaying, setPbPlaying] = React.useState(false);
  const [pbTime, setPbTime] = React.useState(0);
  const [pbDur, setPbDur] = React.useState(0);
  const [pbMuted, setPbMuted] = React.useState(false);
  const streamRef = React.useRef(null);
  const recorderRef = React.useRef(null);
  const chunksRef = React.useRef([]);
  const blobUrlRef = React.useRef(null);
  const audioCtxRef = React.useRef(null);
  const analyserRef = React.useRef(null);
  const rafRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const audioElRef = React.useRef(null);
  const waveSmoothRef = React.useRef(null);

  const supported = typeof navigator !== "undefined" && navigator.mediaDevices && navigator.mediaDevices.getUserMedia && typeof window.MediaRecorder !== "undefined";

  const stopWave = () => { try { if (rafRef.current) cancelAnimationFrame(rafRef.current); } catch (e) {} rafRef.current = null; try { if (audioCtxRef.current) audioCtxRef.current.close(); } catch (e) {} audioCtxRef.current = null; analyserRef.current = null; };
  const stopStream = () => { stopWave(); try { if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop()); } catch (e) {} streamRef.current = null; };
  React.useEffect(() => () => { stopStream(); try { if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current); } catch (e) {} }, []);

  const setupAnalyser = (stream) => {
    try {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      const ctx = new AC(); audioCtxRef.current = ctx;
      const an = ctx.createAnalyser(); an.fftSize = 1024; analyserRef.current = an;
      ctx.createMediaStreamSource(stream).connect(an);
    } catch (e) {}
  };

  const enumMics = async () => { try { const list = await navigator.mediaDevices.enumerateDevices(); setMics(list.filter((d) => d.kind === "audioinput")); } catch (e) {} };

  const acquire = async (deviceId) => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: deviceId ? { deviceId: { exact: deviceId } } : true });
    streamRef.current = stream;
    const at = stream.getAudioTracks()[0];
    setMicLabel((at && at.label) || "Microphone");
    try { setSelMic(at && at.getSettings ? at.getSettings().deviceId || "" : ""); } catch (e) {}
    setupAnalyser(stream);
  };

  React.useEffect(() => {
    if (!supported) { setVstate("unsupported"); setResult("fail"); return; }
    (async () => { try { await acquire(); enumMics(); setVstate("ready"); } catch (e) { setResult("fail"); setVstate("denied"); } })();
  }, []);

  const switchMic = async (deviceId) => {
    setDevMenu(false); setSelMic(deviceId);
    try { stopWave(); if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop()); await acquire(deviceId); } catch (e) {}
  };

  // live waveform while recording
  React.useEffect(() => {
    if (vstate !== "recording" || !analyserRef.current || !canvasRef.current) return;
    const an = analyserRef.current, canvas = canvasRef.current, ctx = canvas.getContext("2d");
    const buf = new Uint8Array(an.fftSize);
    const COLS = 96;
    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      const w = canvas.width, h = canvas.height, mid = h / 2;
      an.getByteTimeDomainData(buf);
      let sm = waveSmoothRef.current; if (!sm || sm.length !== COLS) { sm = new Array(COLS).fill(0); waveSmoothRef.current = sm; }
      const step = Math.max(1, Math.floor(buf.length / COLS));
      ctx.clearRect(0, 0, w, h);
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, "#3B82F6"); grad.addColorStop(0.28, "#3B82F6"); grad.addColorStop(0.5, "#22C55E"); grad.addColorStop(0.72, "#22C55E"); grad.addColorStop(1, "#F43F5E");
      ctx.fillStyle = grad;
      const amps = [];
      for (let c = 0; c < COLS; c++) {
        let sum = 0; const base = c * step;
        for (let k = 0; k < step; k++) { const v = (buf[base + k] - 128) / 128; sum += v * v; }
        let a = Math.sqrt(sum / step) * Math.sin(Math.PI * c / (COLS - 1)); // rms, tapered at edges
        sm[c] = sm[c] * 0.6 + a * 0.4; // ease for smooth motion
        amps.push(Math.min(mid - 1.5, Math.max(1.1, sm[c] * mid * 5)));
      }
      ctx.beginPath();
      for (let c = 0; c < COLS; c++) { const x = c / (COLS - 1) * w; c === 0 ? ctx.moveTo(x, mid - amps[c]) : ctx.lineTo(x, mid - amps[c]); }
      for (let c = COLS - 1; c >= 0; c--) { const x = c / (COLS - 1) * w; ctx.lineTo(x, mid + amps[c]); }
      ctx.closePath(); ctx.fill();
    };
    draw();
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [vstate]);

  const startRecording = () => {
    if (!streamRef.current) return;
    try {
      chunksRef.current = [];
      const cands = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg"];
      let mime = ""; for (const m of cands) { try { if (window.MediaRecorder.isTypeSupported && window.MediaRecorder.isTypeSupported(m)) { mime = m; break; } } catch (e) {} }
      const rec = mime ? new MediaRecorder(streamRef.current, { mimeType: mime }) : new MediaRecorder(streamRef.current);
      recorderRef.current = rec;
      rec.ondataavailable = (e) => { if (e.data && e.data.size) chunksRef.current.push(e.data); };
      rec.onstop = () => { try { const blob = new Blob(chunksRef.current, { type: mime || "audio/webm" }); if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current); blobUrlRef.current = URL.createObjectURL(blob); if (audioElRef.current) audioElRef.current.src = blobUrlRef.current; } catch (e) {} setPbTime(0); setPbPlaying(false); setVstate("reviewing"); };
      rec.start(); setVstate("recording");
    } catch (e) {}
  };
  React.useEffect(() => {
    if (vstate !== "recording") return;
    setSec(0); let s = 0;
    const iv = setInterval(() => { s += 1; setSec(s); if (s >= 30) { clearInterval(iv); stopRecording(); } }, 1000);
    return () => clearInterval(iv);
  }, [vstate]);
  const stopRecording = () => { try { if (recorderRef.current && recorderRef.current.state !== "inactive") recorderRef.current.stop(); else setVstate("reviewing"); } catch (e) { setVstate("reviewing"); } };
  const retake = () => { setVstate("ready"); };
  const proceed = () => { stopStream(); setResult("pass"); onNext(); };
  const fmt = (t) => Math.floor((t || 0) / 60) + ":" + String(Math.floor((t || 0) % 60)).padStart(2, "0");

  const micChip = (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button onClick={() => setDevMenu((v) => !v)} title="Select microphone" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: eINK, border: "none", cursor: "pointer", fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600 }}>
        <span style={{ color: eMUT, display: "flex" }}><I.mic size={15} /></span>{micLabel}<I.chevD size={13} />
      </button>
      {devMenu && <React.Fragment>
        <div onClick={() => setDevMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 20 }} />
        <div style={{ position: "absolute", right: 0, top: 30, zIndex: 21, width: 300, background: "#fff", border: "1px solid " + eLINE, borderRadius: 12, boxShadow: "0 12px 30px rgba(0,15,71,.2)", padding: 8 }}>
          {mics.map((d, i) => { const on = selMic === d.deviceId; return (
            <button key={d.deviceId || i} onClick={() => switchMic(d.deviceId)} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", textAlign: "left", background: on ? scTint(eBLUE, "8%") : "transparent", border: "none", borderRadius: 8, padding: "9px 10px", cursor: "pointer", fontFamily: "var(--sans)", fontSize: 13, fontWeight: on ? 700 : 400, color: on ? eMID : eINK }}>
              <span style={{ width: 15, color: eBLUE, display: "flex", flexShrink: 0 }}>{on ? <I.check size={14} /> : null}</span>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.label || ("Microphone " + (i + 1))}</span>
            </button>
          ); })}
          {mics.length === 0 && <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: eMUT, padding: "6px 10px" }}>No microphones found</div>}
        </div>
      </React.Fragment>}
    </div>
  );

  const sentence = (
    <div style={{ textAlign: "center", padding: "10px 10px 0" }}>
      <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, margin: "0 0 18px" }}>Please speak and repeat the following sentence 3 times.</p>
      <p style={{ fontFamily: "var(--sans)", fontSize: 28, fontWeight: 700, color: eMID, lineHeight: 1.35, margin: 0, maxWidth: 720, marginLeft: "auto", marginRight: "auto" }}>&ldquo;{SC_PHRASE_AUDIO}&rdquo;</p>
    </div>
  );

  const badge = vstate === "pass" ? "pass" : (vstate === "denied" || vstate === "unsupported") ? "fail" : "pending";

  return (
    <div style={vertical ? scWrapV : scWrap}>
      {!vertical && <ScStepper index={2} audioOnly />}
      <ScHead icon={panel ? null : <I.mic size={22} />} title="Microphone Test" sub="Verify your microphone is working properly for recording" badge={badge} />

      {(vstate === "denied" || vstate === "unsupported") && (
        <div style={{ ...scCard, padding: "48px 24px", textAlign: "center" }}>
          <span style={{ color: eDANGER, display: "inline-flex" }}><I.alertCircle size={40} /></span>
          <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMID, fontWeight: 600, maxWidth: 480, margin: "14px auto 0", lineHeight: 1.5 }}>{vstate === "denied" ? "Microphone access was blocked. Allow access in your browser's site settings, then try again." : "Microphone recording isn't available in this browser. Open the check on the deployed site in Chrome, Edge, Safari or Firefox."}</p>
          <div style={{ marginTop: 18, display: "flex", justifyContent: "center", gap: 12 }}>
            {vstate === "denied" && <EdBtn onClick={() => { setVstate("loading"); (async () => { try { await acquire(); enumMics(); setVstate("ready"); } catch (e) { setVstate("denied"); } })(); }}><I.sync size={15} /> Try again</EdBtn>}
            <EdBtn primary onClick={() => { setResult("fail"); onNext(); }}>Continue <I.arrow size={16} /></EdBtn>
          </div>
        </div>
      )}

      {(vstate === "loading" || vstate === "ready" || vstate === "recording" || vstate === "reviewing") && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8, minHeight: 24 }}>{(vstate === "ready" || vstate === "recording") && micChip}</div>
          <div style={{ ...scCard, position: "relative", padding: "26px 24px 30px", minHeight: 300, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {vstate === "recording" && <span style={{ position: "absolute", left: 18, top: 16, display: "inline-flex", alignItems: "center", gap: 8, background: scTint(eMID, "88%"), color: "#fff", borderRadius: 8, padding: "5px 11px", fontFamily: "var(--sans)", fontSize: 13, fontWeight: 700 }}><span className="ed-blink" style={{ width: 8, height: 8, borderRadius: 4, background: eDANGER, display: "inline-block" }} /> REC &middot; {sec}s</span>}
            {vstate === "loading" && <div style={{ textAlign: "center" }}><span className="ed-spin" style={{ width: 26, height: 26, borderRadius: 13, border: "3px solid " + eLINE, borderTopColor: eBLUE, display: "inline-block" }} /><p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT, margin: "14px 0 0" }}>Requesting microphone access…</p></div>}
            {vstate !== "loading" && sentence}
            {vstate === "recording" && <canvas ref={canvasRef} width={640} height={70} style={{ width: "100%", maxWidth: 460, height: 70, margin: "20px auto 0", display: "block" }} />}
            {vstate === "reviewing" && (
              <React.Fragment>
                <audio ref={audioElRef} onPlay={() => setPbPlaying(true)} onPause={() => setPbPlaying(false)} onEnded={() => setPbPlaying(false)} onTimeUpdate={(e) => setPbTime(e.target.currentTime || 0)}
                  onLoadedMetadata={(e) => { const a = e.target; if (!isFinite(a.duration) || isNaN(a.duration)) { a.currentTime = 1e101; const onT = () => { a.removeEventListener("timeupdate", onT); a.currentTime = 0; setPbDur(isFinite(a.duration) ? a.duration : 0); }; a.addEventListener("timeupdate", onT); } else setPbDur(a.duration); }} style={{ display: "none" }} />
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, background: "#fff", borderBottomLeftRadius: 16, borderBottomRightRadius: 16, padding: "12px 22px", display: "flex", alignItems: "center", gap: 14 }}>
                  <button onClick={() => { const a = audioElRef.current; if (!a) return; if (a.paused) a.play(); else a.pause(); }} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "transparent", color: eMID, border: "none", cursor: "pointer", flexShrink: 0, padding: 2 }}>{pbPlaying ? <I.pause size={20} /> : <I.play size={20} />}</button>
                  <span style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 700, color: eINK, flexShrink: 0, minWidth: 34 }}>{fmt(pbTime)}</span>
                  <div onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); const f = (e.clientX - r.left) / r.width; if (audioElRef.current && pbDur) audioElRef.current.currentTime = Math.max(0, Math.min(1, f)) * pbDur; }} style={{ flex: 1, height: 6, borderRadius: 3, background: scTint(eMID, "12%"), cursor: "pointer" }}><div style={{ height: "100%", width: (pbDur ? Math.min(100, (pbTime / pbDur) * 100) : 0) + "%", background: eBLUE, borderRadius: 3 }} /></div>
                  <button onClick={() => { const a = audioElRef.current; const nm = !pbMuted; setPbMuted(nm); if (a) a.muted = nm; }} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "transparent", color: eMID, border: "none", cursor: "pointer", flexShrink: 0, padding: 2, opacity: pbMuted ? 0.5 : 1 }}><I.volume size={19} /></button>
                </div>
              </React.Fragment>
            )}
          </div>

          {vstate === "reviewing" && (
            <div style={{ marginTop: 14, border: "1px solid " + eLINE, borderRadius: 12, overflow: "hidden", background: "#fff" }}>
              {[["Access"], ["Uploading"]].map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 16px", borderBottom: i === 0 ? "1px solid " + eLINE : "none" }}>
                  <span style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 600, color: eINK }}>{r[0]}</span>
                  <span style={{ width: 22, height: 22, borderRadius: "50%", background: eSUCCESS, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><I.check size={13} /></span>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 24 }}>
            {vstate === "ready" && <EdBtn primary onClick={startRecording}><I.cam size={16} /> Start Recording</EdBtn>}
            {vstate === "recording" && <button onClick={stopRecording} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: eDANGER, color: "#fff", border: "none", borderRadius: 10, padding: "12px 20px", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, cursor: "pointer" }}><span style={{ width: 11, height: 11, borderRadius: 2, background: "#fff", display: "inline-block" }} /> Stop Recording</button>}
            {vstate === "reviewing" && <React.Fragment>
              <EdBtn onClick={retake}><I.sync size={15} /> No, I want to retake</EdBtn>
              <EdBtn primary onClick={proceed}>Yes, Ok to proceed <I.arrow size={16} /></EdBtn>
            </React.Fragment>}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══ RESULT ════════════════════════════════════════════════════════════════
function ScResult({ results, onRerun, onBack, onLaunch, vertical, audioOnly }) {
  const [open, setOpen] = React.useState({});
  const CHECKS = [
    { k: "browser", icon: <I.globe size={20} />, label: "Browser Compatibility", passMsg: "Your browser is compatible with this campaign.", failMsg: "Your browser is missing one or more required features.", fix: { title: "Browser", items: ["Update your browser to the latest version", "Use a supported browser (Chrome, Edge, Firefox, Safari)", "Disable extensions that may block required features"] } },
    { k: "network", icon: <I.wifi size={20} />, label: "Internet Speed", passMsg: "Your Internet speed meets the minimum requirements for the campaign.", failMsg: "Your speed is slower than required (min " + SC_REQ_DL + " Mbps down / " + SC_REQ_UL + " Mbps up).", fix: { title: "Internet Speed", items: ["Close other applications using bandwidth", "Move closer to your Wi-Fi router or use an ethernet cable", "Restart your router/modem and re-run the check"] } },
    audioOnly
      ? { k: "video", icon: <I.mic size={20} />, label: "Audio", passMsg: "Microphone check passed successfully.", failMsg: "Your microphone recording failed, or access was blocked.", fix: { title: "Microphone", items: ["Click the lock/info icon in your browser's address bar to check microphone permission. If blocked, reset it in browser settings", "Find \"Microphone\" settings and set it to \"Allow\"", "Refresh the page after changing permissions", "On Windows: Check Privacy Settings > Microphone access", "On Mac: Check System Preferences > Security & Privacy > Microphone", "If permission is enabled and there was an upload issue, re-run the check"] } }
      : { k: "video", icon: <I.cam size={20} />, label: "Video and Audio", passMsg: "Your camera and microphone are working correctly.", failMsg: "Your speech did not match the test phrase, or access was blocked.", fix: { title: "Video and Audio Recording", items: ["Click the lock/info icon in your browser's address bar to check camera and microphone permissions. If blocked, reset permissions in browser settings", "Find \"Camera\" and \"Microphone\" settings and set them to \"Allow\"", "Refresh the page after changing permissions", "On Windows: Check Privacy Settings > Camera/Microphone access", "On Mac: Check System Preferences > Security & Privacy > Camera/Microphone", "If permission is enabled and there was an upload issue, re-run the check and try uploading the video again"] } },
  ];
  const allPass = CHECKS.every((c) => results[c.k] === "pass");
  const failed = CHECKS.filter((c) => results[c.k] !== "pass");
  const dev = useScDevice();
  const mob = dev === "mobile";
  return (
    <div style={vertical ? scWrapV : scWrap}>
      {!vertical && <ScStepper index={3} audioOnly={audioOnly} />}
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <span style={{ display: "inline-flex", color: allPass ? eSUCCESS : eWARN }}>{allPass ? <I.checkCircle size={64} /> : <I.alertCircle size={64} />}</span>
        <h1 style={{ fontFamily: "var(--sans)", fontSize: 28, fontWeight: 700, color: eMID, margin: "8px 0 6px" }}>{allPass ? "System Check Complete" : "System Check Warning"}</h1>
        <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT, margin: 0 }}>{allPass ? "All checks passed — you're ready to begin your assessment." : "Potential system failures may affect assessments — please proceed only after all checks pass."}</p>
      </div>
      <div style={{ ...scCard, overflow: "hidden", marginTop: 22 }}>
        {!mob && <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 148px", gap: 16, padding: "14px 22px", background: scTint(eMID, "3%"), borderBottom: "1px solid " + eLINE, fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: eMID }}>
          <span>Check</span><span style={{ textAlign: "center" }}>Result</span><span style={{ textAlign: "right" }}>Details</span>
        </div>}
        {CHECKS.map((c, i) => {
          const st = results[c.k] === "pass" ? "pass" : "fail"; const isOpen = !!open[c.k];
          const detailsBtn = <button onClick={() => setOpen((p) => ({ ...p, [c.k]: !p[c.k] }))} style={{ background: "none", border: "none", cursor: "pointer", color: eBLUE, fontFamily: "var(--sans)", fontSize: 15, fontWeight: 400, display: "inline-flex", alignItems: "center", gap: 5, whiteSpace: "nowrap", padding: 0 }}>View Details <I.chevD size={16} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }} /></button>;
          const nameSpan = <span style={{ display: "inline-flex", alignItems: "center", gap: 11, fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: eMID }}><span style={{ color: eBLUE, display: "flex", flexShrink: 0 }}>{c.icon}</span>{c.label}</span>;
          return (
            <div key={c.k} style={{ borderBottom: i < CHECKS.length - 1 ? "1px solid " + eLINE : "none", background: isOpen ? scTint(eMID, "3%") : "transparent", transition: "background .2s" }}>
              {mob ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "16px 18px" }}>
                  {nameSpan}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}><ScBadge state={st} />{detailsBtn}</div>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 148px", gap: 16, alignItems: "center", padding: "16px 22px" }}>
                  {nameSpan}
                  <span style={{ justifySelf: "center" }}><ScBadge state={st} /></span>
                  <span style={{ justifySelf: "end" }}>{detailsBtn}</span>
                </div>
              )}
              {isOpen && <div style={{ margin: mob ? "0 18px" : "0 22px", borderTop: "1px solid " + eLINE, padding: "14px 0 18px" }}>
                <div style={{ display: "flex", gap: 9, alignItems: "flex-start" }}><span style={{ color: st === "pass" ? eSUCCESS : eDANGER, flexShrink: 0, marginTop: 1, display: "flex" }}>{st === "pass" ? <I.checkCircle size={16} /> : <I.alertCircle size={16} />}</span><span style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.55 }}>{st === "pass" ? c.passMsg : c.failMsg}</span></div>
              </div>}
            </div>
          );
        })}
      </div>
      {failed.length > 0 && (
        <div style={{ ...scCard, padding: 24, marginTop: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}><span style={{ color: eBLUE, display: "flex" }}><I.info size={20} /></span><h3 style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: eMID, margin: 0 }}>Troubleshooting Guide</h3></div>
          <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT, margin: "0 0 16px" }}>Follow these steps to resolve the issues detected during the system check</p>
          {failed.map((c, idx) => (
            <div key={c.k} style={{ padding: idx > 0 ? "18px 0" : "0 0 18px", borderTop: idx > 0 ? "1px solid " + eLINE : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}><span style={{ color: eBLUE, display: "flex" }}>{c.icon}</span><h4 style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: eMID, margin: 0 }}>{c.fix.title}</h4></div>
              <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>{c.fix.items.map((t, j) => <li key={j} style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.5 }}>{t}</li>)}</ul>
            </div>
          ))}
        </div>
      )}
      <ScFoot onBackClick={onBack} right={<React.Fragment>
        <EdBtn onClick={onRerun}><I.sync size={15} /> Re-run Checks</EdBtn>
        <EdBtn primary onClick={onLaunch}>Continue <I.arrow size={16} /></EdBtn>
      </React.Fragment>} />
    </div>
  );
}

function EdPreCheck({ target, onBack, onLaunch, onStep, initialStep, variant }) {
  const v2 = variant === "2";
  const v3 = variant === "3";
  const audioOnly = !!(target && target.audioOnly);
  const [phase, setPhase] = edUseState(() => { const p = initialStep ? String(initialStep).split("/")[0] : "welcome"; return ["welcome", "vertical", "panel", "browser", "network", "video", "result"].indexOf(p) >= 0 ? p : "welcome"; });
  const [results, setResults] = edUseState({ browser: "pending", network: "pending", video: "pending" });
  const setResult = (k, v) => setResults((p) => (p[k] === v ? p : { ...p, [k]: v }));
  const rerun = () => { setResults({ browser: "pending", network: "pending", video: "pending" }); setPhase("browser"); };
  // reflect the current step in the URL (video reports its own sub-step; vertical/panel own their sub-URLs)
  React.useEffect(() => { if (onStep && phase !== "vertical" && phase !== "panel") onStep(phase); }, [phase]);

  if (phase === "welcome") return <ScWelcome target={target} audioOnly={audioOnly} onStart={() => setPhase(v3 ? "panel" : v2 ? "vertical" : "browser")} />;
  if (phase === "vertical") return <ScVertical target={target} audioOnly={audioOnly} onStep={onStep} onBack={() => setPhase("welcome")} onLaunch={onLaunch} />;
  if (phase === "panel") return <ScPanel target={target} audioOnly={audioOnly} onStep={onStep} onBack={() => setPhase("welcome")} onLaunch={onLaunch} />;
  if (phase === "browser") return <ScBrowser audioOnly={audioOnly} result={results.browser} setResult={(v) => setResult("browser", v)} onBack={() => setPhase("welcome")} onNext={() => setPhase("network")} />;
  if (phase === "network") return <ScNetwork audioOnly={audioOnly} setResult={(v) => setResult("network", v)} onBack={() => setPhase("browser")} onNext={() => setPhase("video")} />;
  if (phase === "video") return audioOnly
    ? <ScAudioLive setResult={(v) => setResult("video", v)} onBack={() => setPhase("network")} onNext={() => setPhase("result")} />
    : <ScVideoLive setResult={(v) => setResult("video", v)} onBack={() => setPhase("network")} onNext={() => setPhase("result")} />;
  if (phase === "result") return <ScResult results={results} audioOnly={audioOnly} onRerun={rerun} onBack={() => setPhase("video")} onLaunch={onLaunch} />;
  return null;
}


function LHFooter({ full }) {
  const t = (k) => (window.LangSwitcher ? window.LangSwitcher.get(k) : k);
  const links = [
    { label: "Privacy Notice", key: "privacyNotice" },
    { label: "Cookie Notice", key: "cookieNotice" },
    { label: "Manage Cookies", key: "manageCookies" }
  ];
  return (
    <footer style={{ maxWidth: full ? "none" : "var(--content-max)", margin: full ? "0" : "0 var(--fol-mx)", padding: full ? "22px 32px 10px" : "22px 0 10px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
      <span style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT }}>© 2026 Marsh. {t("allRightsReserved")}.</span>
      <nav style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
        {links.map((l) => (
          <a key={l.key} href="#" onClick={(e) => e.preventDefault()} style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMUT, textDecoration: "none", transition: "color .15s" }}
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
  const [msgs, setMsgs] = React.useState([{ from: "bot", text: "Hi John — I'm your AI Assistant. Ask me about your programs, deadlines, or how a task works." }]);
  const bodyRef = React.useRef(null);
  React.useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [msgs, open]);
  const send = () => {
    const tx = input.trim();
    if (!tx) return;
    setMsgs((m) => [...m, { from: "me", text: tx }, { from: "bot", text: "Thanks for asking. This is a demo assistant — in the live product I'd answer instantly, or connect you with the support team." }]);
    setInput("");
  };
  const quick = ["When is my next deadline?", "What's a proctored task?", "How do I book a session?"];
  return (
    <React.Fragment>
      {open && (
        <div style={{ position: "fixed", right: 24, bottom: 124, width: 366, maxWidth: "calc(100vw - 48px)", height: 480, maxHeight: "calc(100vh - 150px)", background: "var(--card)", borderRadius: 18, border: "1px solid var(--line)", boxShadow: "0 24px 64px rgba(0,15,71,.24)", zIndex: 71, display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: "var(--sans)" }}>
          <div style={{ background: "var(--surface-deep)", color: "#fff", padding: "15px 17px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(206,236,255,.16)", color: eSKY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><LHSparkle size={20} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>AI Assistant</div>
              <div style={{ fontSize: 15, color: "rgba(255,255,255,.82)", display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 7, height: 7, borderRadius: 4, background: "var(--success)" }} /> Online</div>
            </div>
            <button onClick={() => setOpen(false)} title="Close" style={{ background: "none", border: "none", color: "rgba(255,255,255,.82)", cursor: "pointer", display: "flex" }}><I.plus size={18} style={{ transform: "rotate(45deg)" }} /></button>
          </div>
          <div ref={bodyRef} style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10, background: eCREAM }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ alignSelf: m.from === "bot" ? "flex-start" : "flex-end", maxWidth: "86%", background: m.from === "bot" ? "#fff" : eMID, color: m.from === "bot" ? eINK : "#fff", border: m.from === "bot" ? "1px solid var(--line)" : "none", padding: "10px 13px", borderRadius: m.from === "bot" ? "4px 14px 14px 14px" : "14px 14px 4px 14px", fontSize: 15, lineHeight: 1.5 }}>{m.text}</div>
            ))}
            {msgs.length <= 1 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 4 }}>
                {quick.map((q) => (
                  <button key={q} onClick={() => { setMsgs((m) => [...m, { from: "me", text: q }, { from: "bot", text: "Great question — this is a demo assistant, but here's where I'd surface that answer for you." }]); }} style={{ fontFamily: "var(--sans)", fontSize: 15, color: eBLUE, background: "color-mix(in srgb, var(--accent) 6%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)", borderRadius: 16, padding: "7px 12px", cursor: "pointer" }}>{q}</button>
                ))}
              </div>
            )}
          </div>
          <div style={{ borderTop: "1px solid var(--line)", padding: 12, display: "flex", gap: 8, background: "var(--card)", flexShrink: 0 }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") send(); }} placeholder="Ask a question…" style={{ flex: 1, border: "1px solid var(--line)", borderRadius: 10, padding: "10px 13px", fontFamily: "var(--sans)", fontSize: 15, color: eINK, outline: "none" }} />
            <button onClick={send} title="Send" style={{ width: 40, height: 40, borderRadius: "50%", background: eGOLD, color: "var(--action-text)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><I.send size={17} /></button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen((v) => !v)} title="AI Assistant" style={{ position: "fixed", right: 24, bottom: 60, width: 54, height: 54, borderRadius: "50%", background: "var(--surface-deep)", color: "#fff", border: "none", boxShadow: "0 10px 30px rgba(0,15,71,.32)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 72, transition: "transform .15s" }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.06)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}>
        {open ? <I.plus size={24} style={{ transform: "rotate(45deg)" }} /> : <LHSparkle size={24} />}
      </button>
    </React.Fragment>
  );
}

window.EdDetail = { EdInstructions, EdTasks, EdCenter, EdPreCheck, LHFooter, LHAssistant };