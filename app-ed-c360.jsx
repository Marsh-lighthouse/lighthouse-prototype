// ════════════════════════════════════════════════
//  DIRECTION A — "Beacon" (Editorial) · 360° PERSPECTIVE FEEDBACK
//  Full campaign flow ported from the extracted Perspective360 module.
//  Content (copy, competencies, roster, step logic) is VERBATIM; only the
//  design system is Folio: midnight/cream canvas, Marsh Serif headlines
//  (weight 400), gold actions, purple program accent, flat editorial cards,
//  and the platform-wide --content-max left-aligned grid.
//  Internal step routing:  home → selfIntro → selfQ → selfDone → nominate → track → report
//  Exports: window.EdC360
// ════════════════════════════════════════════════

const { useState: cUseState } = React;

// ── Folio tokens (brand-driven; honor Tweaks via CSS vars) ──
const qMID = "var(--primary)", qCANVAS = "var(--canvas)", qINK = "var(--ink)", qMUT = "var(--muted)",
  qLINE = "var(--line)", qCARD = "#fff",
  qBLUE = "var(--accent)",          // self-evaluation step accent
  qPURPLE = "#8F20DE",              // nominate step accent (brand purple-750)
  qPURPLE_BG = "rgba(143,32,222,.08)",
  qGOLD = "var(--action)",          // primary CTA fill
  qGOLDINK = "#CB7E03",             // readable gold text (track step accent)
  qGREEN = "var(--success)", qRED = "var(--danger)",
  qBLUE_BG = "color-mix(in srgb, var(--accent) 10%, var(--card))";

// ── icons (self-contained; color via currentColor) ──
const QI = {
  Arrow: (p) => <svg width={p && p.s || 14} height={p && p.s || 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={p && p.style}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>,
  Check: (p) => <svg width={p && p.s || 16} height={p && p.s || 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={p && p.style}><polyline points="20 6 9 17 4 12" /></svg>,
  Lock: (p) => <svg width={p && p.s || 14} height={p && p.s || 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={p && p.style}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>,
};

// ── shared button: gold primary / midnight outline (Folio EdBtn convention) ──
function QBtn({ children, primary, small, disabled, onClick, style: s }) {
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    fontFamily: "var(--sans)", fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
    borderRadius: 10, padding: small ? "8px 14px" : "12px 22px", minHeight: small ? 34 : 44,
    fontSize: small ? 14 : 14, opacity: disabled ? 0.45 : 1, transition: "filter .15s, background .15s",
  };
  const style = primary
    ? { ...base, background: qGOLD, color: "var(--action-text)", border: "none" }
    : { ...base, background: "transparent", color: qMID, border: "1.5px solid " + qMID };
  return <button style={{ ...style, ...s }} disabled={disabled} onClick={disabled ? undefined : onClick}>{children}</button>;
}

function EdC360({ prog, onBack, onBuildPlan, countdown, initialStep } = {}) {
  const cr = 14, br = 10, sr = 10, ir = 8;   // radii (Folio card scale)
  const [isMob, setIsMob] = cUseState(typeof window !== "undefined" && window.innerWidth < 769);
  React.useEffect(() => {
    const h = () => setIsMob(window.innerWidth < 769);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  const wrap = { maxWidth: "var(--content-max)", margin: "28px var(--fol-mx) 8px" };

  const programDue = (prog && prog.due) || "Aug 14, 2026";

  // ═══════════ CAMPAIGN STATE (verbatim) ═══════════
  const [c360Step, setC360Step] = cUseState(initialStep || "home");
  const [c360SelfQ, setC360SelfQ] = cUseState(0);
  const [c360SelfAns, setC360SelfAns] = cUseState({});
  const [c360SelfDone, setC360SelfDone] = cUseState(false);
  const [c360Invited, setC360Invited] = cUseState(false);
  const [c360Msg, setC360Msg] = cUseState("Hi, I'd value your perspective on my leadership. This should take ~10 min. Honest, direct feedback helps me grow — thank you.");
  const [c360Deadline, setC360Deadline] = cUseState("2026-05-02");
  const [c360Roster, setC360Roster] = cUseState([
    { id: "r1", name: "Sarah Chen", role: "Manager", rel: "manager", avatar: "SC", status: "complete", progress: 100, invited: "Apr 10", completed: "Apr 14" },
    { id: "r2", name: "Arjun Patel", role: "Peer · Product", rel: "peer", avatar: "AP", status: "complete", progress: 100, invited: "Apr 10", completed: "Apr 15" },
    { id: "r3", name: "Maya Rodriguez", role: "Peer · Design", rel: "peer", avatar: "MR", status: "in-progress", progress: 60, invited: "Apr 10", completed: null },
    { id: "r4", name: "Priya Sharma", role: "Peer · Ops", rel: "peer", avatar: "PS", status: "in-progress", progress: 30, invited: "Apr 10", completed: null },
    { id: "r5", name: "Liam O'Connor", role: "Peer · Eng", rel: "peer", avatar: "LO", status: "opened", progress: 0, invited: "Apr 10", completed: null },
    { id: "r6", name: "Dani Kim", role: "Direct · Analytics", rel: "direct", avatar: "DK", status: "complete", progress: 100, invited: "Apr 10", completed: "Apr 13" },
    { id: "r7", name: "Raj Mehta", role: "Direct · Engineering", rel: "direct", avatar: "RM", status: "invited", progress: 0, invited: "Apr 10", completed: null },
    { id: "r8", name: "Ana Torres", role: "Direct · Research", rel: "direct", avatar: "AT", status: "declined", progress: 0, invited: "Apr 10", completed: null },
  ]);
  const [c360ToastMsg, setC360ToastMsg] = cUseState("");
  const c360Comps = [
    { key: "strategy", label: "Strategic Thinking", desc: "Sets long-term direction and connects work to broader goals." },
    { key: "decision", label: "Decision Making", desc: "Makes timely, sound decisions with incomplete information." },
    { key: "communicate", label: "Communication", desc: "Articulates ideas clearly; listens actively." },
    { key: "empower", label: "Empowerment", desc: "Delegates ownership and unlocks others' capability." },
    { key: "feedback", label: "Feedback Culture", desc: "Gives and receives honest, constructive feedback." },
    { key: "adapt", label: "Adaptability", desc: "Navigates ambiguity and change with composure." },
    { key: "influence", label: "Influence", desc: "Builds alignment across stakeholders and boundaries." },
    { key: "integrity", label: "Integrity", desc: "Acts consistently with values; builds trust." },
  ];

  // ═══════════ DERIVED ═══════════
  const roster = c360Roster;
  const tot = roster.length;
  const doneCount = roster.filter(r => r.status === "complete").length;
  const responseRate = Math.round((doneCount / tot) * 100);
  const byRel = (rel) => roster.filter(r => r.rel === rel);
  const totalSelf = c360Comps.length;
  const selfAnsweredCount = Object.keys(c360SelfAns).length;
  const selfPct = Math.round((selfAnsweredCount / totalSelf) * 100);

  const showToast = (m) => { setC360ToastMsg(m); setTimeout(() => setC360ToastMsg(""), 2400); };
  const buildPlan = () => (onBuildPlan ? onBuildPlan() : showToast("Opening development plan"));

  const scale = [{ n: 1, l: "Emerging" }, { n: 2, l: "Developing" }, { n: 3, l: "Capable" }, { n: 4, l: "Strong" }, { n: 5, l: "Exemplary" }];

  // On any 360 sub-step the "Back" up-navigation lives in the shell
  // top bar (like Scheduling's "All assessment centers"), not as an in-content
  // back link. At the campaign home the shell shows its own "Back".
  useTopBarBack(c360Step !== "home", "Back", () => setC360Step("home"));

  // eyebrow chip
  const Eyebrow = ({ color, bg, dot, children }) => (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 12px", borderRadius: sr, background: bg, color, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, marginBottom: 16 }}>
      {dot && <div style={{ width: 6, height: 6, borderRadius: 3, background: color }} />} {children}
    </div>
  );

  const Toast = () => c360ToastMsg ? (
    <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: qMID, color: "#fff", padding: "12px 20px", borderRadius: sr, boxShadow: "0 10px 30px rgba(0,15,71,.28)", fontSize: 14, fontWeight: 600, fontFamily: "var(--sans)", display: "flex", alignItems: "center", gap: 8, zIndex: 1000 }}>
      <span style={{ color: "#8CE0A8", display: "flex" }}><QI.Check s={14} /></span> {c360ToastMsg}
    </div>
  ) : null;

  // ═══════════════════════════════════════════════════════════
  //  STEP: HOME HUB
  // ═══════════════════════════════════════════════════════════
  if (c360Step === "home") return (
    <div style={wrap}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "none", border: "none", cursor: "pointer", color: qMID, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, padding: "4px 0" }}>
          <QI.Arrow s={16} style={{ transform: "rotate(180deg)" }} /> Dashboard
        </button>
        {countdown || null}
      </div>

      <div style={{ marginBottom: 16 }}>
        <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 400, color: "#002C77", background: "color-mix(in srgb, #002C77 15%, #ffffff)", padding: "4px 11px", borderRadius: 6, whiteSpace: "nowrap" }}>In progress</span>
      </div>

      <h1 className="serif" style={{ fontSize: isMob ? 34 : 44, color: qMID, lineHeight: 1.05, margin: "0 0 14px", textWrap: "pretty" }}>Your 360° campaign, at a glance.</h1>
      <p style={{ fontSize: 16, color: qINK, fontFamily: "var(--sans)", lineHeight: 1.6, margin: "0 0 32px", maxWidth: 680 }}>
        Complete your self-evaluation, invite the people who see your work from every angle, and unlock a consolidated report when enough raters respond. Due <strong style={{ color: qMID }}>{programDue}</strong>.
      </p>

      {/* metrics strip */}
      <div style={{ display: "grid", gridTemplateColumns: isMob ? "1fr 1fr" : "repeat(4,1fr)", gap: 12, marginBottom: 32 }}>
        {[
          { k: "Self", v: c360SelfDone ? "Done" : `${selfAnsweredCount}/${totalSelf}`, hint: c360SelfDone ? "Submitted" : "In progress", color: c360SelfDone ? qGREEN : qBLUE },
          { k: "Raters invited", v: c360Invited ? tot : 0, hint: c360Invited ? "Campaign live" : "Not yet sent", color: c360Invited ? qPURPLE : qMUT },
          { k: "Responses", v: `${doneCount}/${tot}`, hint: `${responseRate}% response rate`, color: responseRate >= 60 ? qGREEN : qGOLDINK },
          { k: "Report", v: responseRate >= 60 ? "Ready" : "Locked", hint: responseRate >= 60 ? "Review now" : "Needs 60%+", color: responseRate >= 60 ? qGREEN : qMUT },
        ].map((m) => (
          <div key={m.k} style={{ padding: "16px", background: qCARD, border: "1px solid " + qLINE, borderRadius: cr }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: qMUT, fontFamily: "var(--sans)", marginBottom: 8 }}>{m.k}</div>
            <div className="serif" style={{ fontSize: 26, color: m.color, lineHeight: 1, marginBottom: 4 }}>{m.v}</div>
            <div style={{ fontSize: 14, color: qINK, fontFamily: "var(--sans)" }}>{m.hint}</div>
          </div>
        ))}
      </div>

      {/* step cards */}
      <div style={{ display: "grid", gridTemplateColumns: isMob ? "1fr" : "1fr 1fr", gap: 16, gridAutoRows: "1fr" }}>

        {/* Step 1 — Self */}
        <div onClick={() => setC360Step(c360SelfDone ? "selfDone" : "selfIntro")} style={{ cursor: "pointer", padding: 24, background: qCARD, border: "1px solid " + qLINE, borderRadius: cr, transition: "border-color .2s, transform .2s", display: "flex", flexDirection: "column" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = qMID; }} onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = qLINE; }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: qMUT, fontFamily: "var(--sans)" }}>Step 01 · Self-evaluation</div>
            {c360SelfDone && <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 99, background: "color-mix(in srgb, #14853D 15%, #ffffff)", color: "#14853D", fontSize: 14, fontWeight: 400, fontFamily: "var(--sans)" }}><QI.Check s={11} /> Done</div>}
          </div>
          <h2 className="serif" style={{ fontSize: 24, color: qMID, lineHeight: 1.15, margin: "0 0 10px" }}>Rate yourself first.</h2>
          <p style={{ fontSize: 14, color: qINK, fontFamily: "var(--sans)", lineHeight: 1.6, margin: "0 0 18px" }}>Score yourself on {totalSelf} leadership competencies. Your answers anchor the gap analysis in your final report.</p>
          <div style={{ height: 4, background: "var(--track)", borderRadius: 2, overflow: "hidden", marginBottom: 14 }}>
            <div style={{ height: "100%", width: `${c360SelfDone ? 100 : selfPct}%`, background: c360SelfDone ? qGREEN : qBLUE, transition: "width .3s ease" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: "auto", color: qBLUE, fontSize: 14, fontWeight: 700, fontFamily: "var(--sans)" }}>
            {c360SelfDone ? "Review responses" : selfAnsweredCount > 0 ? "Continue" : "Begin self-evaluation"} <QI.Arrow />
          </div>
        </div>

        {/* Step 2 — Nominate */}
        <div onClick={() => setC360Step("nominate")} style={{ cursor: "pointer", padding: 24, background: qCARD, border: "1px solid " + qLINE, borderRadius: cr, transition: "border-color .2s, transform .2s", display: "flex", flexDirection: "column" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = qMID; }} onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = qLINE; }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: qMUT, fontFamily: "var(--sans)" }}>Step 02 · Nominate</div>
            {c360Invited && <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 99, background: qPURPLE_BG, color: qPURPLE, fontSize: 14, fontWeight: 700, fontFamily: "var(--sans)" }}>Invitations sent</div>}
          </div>
          <h2 className="serif" style={{ fontSize: 24, color: qMID, lineHeight: 1.15, margin: "0 0 10px" }}>Invite your raters.</h2>
          <p style={{ fontSize: 14, color: qINK, fontFamily: "var(--sans)", lineHeight: 1.6, margin: "0 0 18px" }}>Nominate managers, peers, direct reports, and optional others. Aim for a mix that sees your leadership from every angle.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
            {[
              { l: "Managers", c: byRel("manager").length, mx: "1 req" },
              { l: "Peers", c: byRel("peer").length, mx: "3–8" },
              { l: "Directs", c: byRel("direct").length, mx: "2+" },
            ].map(x => (
              <div key={x.l} style={{ padding: "4px 10px", borderRadius: sr, background: "rgba(0,15,71,.04)", fontSize: 14, fontFamily: "var(--sans)", color: qINK, display: "flex", alignItems: "center", gap: 6 }}>
                <strong style={{ color: qMID, fontWeight: 700 }}>{x.c}</strong> {x.l} <span style={{ color: qMUT }}>· {x.mx}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: "auto", color: qBLUE, fontSize: 14, fontWeight: 700, fontFamily: "var(--sans)" }}>
            {c360Invited ? "Adjust raters" : "Review & send invites"} <QI.Arrow />
          </div>
        </div>

        {/* Step 3 — Track */}
        <div onClick={() => setC360Step("track")} style={{ cursor: "pointer", padding: 24, background: qCARD, border: "1px solid " + qLINE, borderRadius: cr, transition: "border-color .2s, transform .2s", display: "flex", flexDirection: "column" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = qMID; }} onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = qLINE; }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: qMUT, fontFamily: "var(--sans)" }}>Step 03 · Track</div>
            <div style={{ fontSize: 14, fontFamily: "var(--sans)", color: qINK }}>{doneCount}/{tot} complete</div>
          </div>
          <h2 className="serif" style={{ fontSize: 24, color: qMID, lineHeight: 1.15, margin: "0 0 10px" }}>Watch responses come in.</h2>
          <p style={{ fontSize: 14, color: qINK, fontFamily: "var(--sans)", lineHeight: 1.6, margin: "0 0 18px" }}>Send reminders, swap non-responders, and see real-time progress. Responses are never attributed individually.</p>
          <div style={{ display: "flex", gap: 3, marginBottom: 14, height: 6 }}>
            {roster.map(r => (
              <div key={r.id} style={{ flex: 1, borderRadius: 2, background: r.status === "complete" ? qGREEN : r.status === "in-progress" ? qBLUE : r.status === "opened" ? qGOLDINK : r.status === "declined" ? qRED : "rgba(0,15,71,.08)" }} />
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: "auto", color: qBLUE, fontSize: 14, fontWeight: 700, fontFamily: "var(--sans)" }}>
            Open tracker <QI.Arrow />
          </div>
        </div>

        {/* Step 4 — Report */}
        <div onClick={() => setC360Step("report")} style={{ cursor: "pointer", padding: 24, background: qCARD, border: "1px solid " + qLINE, borderRadius: cr, transition: "border-color .2s, transform .2s", display: "flex", flexDirection: "column", opacity: responseRate >= 60 ? 1 : .9 }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = qMID; }} onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = qLINE; }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: qMUT, fontFamily: "var(--sans)" }}>Step 04 · Report</div>
            {responseRate >= 60 ? (
              <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 99, background: "color-mix(in srgb, #002C77 15%, #ffffff)", color: "#002C77", fontSize: 14, fontWeight: 700, fontFamily: "var(--sans)" }}>Ready</div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 4, color: qMUT, fontSize: 14, fontFamily: "var(--sans)" }}><QI.Lock s={12} /> Locked</div>
            )}
          </div>
          <h2 className="serif" style={{ fontSize: 24, color: qMID, lineHeight: 1.15, margin: "0 0 10px" }}>See yourself through others' eyes.</h2>
          <p style={{ fontSize: 14, color: qINK, fontFamily: "var(--sans)", lineHeight: 1.6, margin: "0 0 18px" }}>Self vs. rater averages, blind spots, hidden strengths, and a narrative summary across all {c360Comps.length} competencies.</p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: "auto", color: qBLUE, fontSize: 14, fontWeight: 700, fontFamily: "var(--sans)" }}>
            {responseRate >= 60 ? "View report" : `Unlocks at 60% (now ${responseRate}%)`} <QI.Arrow />
          </div>
        </div>
      </div>

      <Toast />
    </div>
  );

  // ═══════════════════════════════════════════════════════════
  //  STEP: SELF INTRO
  // ═══════════════════════════════════════════════════════════
  if (c360Step === "selfIntro") return (
    <div style={{ ...wrap, maxWidth: 720 }}>
      <Eyebrow color={qBLUE} bg={qBLUE_BG}>Step 01 · Self-evaluation</Eyebrow>
      <h1 className="serif" style={{ fontSize: isMob ? 30 : 38, color: qMID, lineHeight: 1.05, margin: "0 0 16px" }}>Before you ask others, rate yourself.</h1>
      <p style={{ fontSize: 15, color: qINK, fontFamily: "var(--sans)", lineHeight: 1.7, margin: "0 0 28px" }}>You'll rate yourself on {totalSelf} leadership competencies using a 5-point scale. About 6 minutes. Your answers are private — they anchor the gap analysis when raters respond.</p>
      <div style={{ background: qCARD, border: "1px solid " + qLINE, borderRadius: cr, padding: 20, marginBottom: 28 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: qMUT, fontFamily: "var(--sans)", marginBottom: 12 }}>Rating scale</div>
        <div style={{ display: "grid", gridTemplateColumns: isMob ? "1fr" : "repeat(5,1fr)", gap: isMob ? 6 : 4 }}>
          {scale.map((x, xi) => (
            <div key={x.n} style={{ padding: 10, textAlign: isMob ? "left" : "center", borderLeft: isMob ? "2px solid " + qLINE : "none", borderRight: isMob ? "none" : (xi < 4 ? "1px solid " + qLINE : "none"), paddingLeft: isMob ? 12 : 10 }}>
              <div className="serif" style={{ fontSize: 20, color: qMID, marginBottom: 2 }}>{x.n}</div>
              <div style={{ fontSize: 14, color: qINK, fontFamily: "var(--sans)" }}>{x.l}</div>
            </div>
          ))}
        </div>
      </div>
      <QBtn primary onClick={() => { setC360SelfQ(0); setC360Step("selfQ"); }}>Begin self-evaluation <QI.Arrow /></QBtn>
      <Toast />
    </div>
  );

  // ═══════════════════════════════════════════════════════════
  //  STEP: SELF Q-BY-Q
  // ═══════════════════════════════════════════════════════════
  if (c360Step === "selfQ") {
    const i = c360SelfQ;
    const comp = c360Comps[i];
    const selected = c360SelfAns[i];
    const isLast = i === c360Comps.length - 1;
    return (
      <div style={{ ...wrap, maxWidth: 720 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: qMUT, fontFamily: "var(--sans)", whiteSpace: "nowrap" }}>Question {i + 1} of {c360Comps.length}</div>
          <div style={{ flex: 1, height: 3, background: "var(--track)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${((i + 1) / c360Comps.length) * 100}%`, background: qBLUE, transition: "width .3s ease" }} />
          </div>
        </div>
        <h2 className="serif" style={{ fontSize: isMob ? 26 : 30, color: qMID, lineHeight: 1.15, margin: "0 0 12px" }}>{comp.label}</h2>
        <p style={{ fontSize: 15, color: qINK, fontFamily: "var(--sans)", lineHeight: 1.6, margin: "0 0 32px" }}>{comp.desc}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 32 }}>
          {scale.map(opt => {
            const isSel = selected === opt.n;
            return (
              <button key={opt.n} onClick={() => setC360SelfAns(a => ({ ...a, [i]: opt.n }))} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: isSel ? qBLUE_BG : qCARD, border: "1px solid " + (isSel ? qBLUE : qLINE), borderRadius: cr, cursor: "pointer", textAlign: "left", fontFamily: "var(--sans)", transition: "all .15s ease" }}>
                <div className="serif" style={{ width: 32, height: 32, borderRadius: 16, background: isSel ? qBLUE : "rgba(0,15,71,.05)", color: isSel ? "#fff" : qINK, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>{opt.n}</div>
                <div style={{ flex: 1, fontSize: 15, fontWeight: 600, color: qMID }}>{opt.l}</div>
                {isSel && <span style={{ color: qBLUE }}><QI.Check s={16} /></span>}
              </button>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "space-between" }}>
          <QBtn disabled={i === 0} onClick={() => setC360SelfQ(i - 1)}>Previous</QBtn>
          {isLast ? (
            <QBtn primary disabled={selected === undefined} onClick={() => { setC360SelfDone(true); setC360Step("selfDone"); }}>Submit <QI.Arrow /></QBtn>
          ) : (
            <QBtn primary disabled={selected === undefined} onClick={() => setC360SelfQ(i + 1)}>Next <QI.Arrow /></QBtn>
          )}
        </div>
        <Toast />
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  //  STEP: SELF DONE
  // ═══════════════════════════════════════════════════════════
  if (c360Step === "selfDone") return (
    <div style={{ ...wrap, maxWidth: 640, textAlign: "center", paddingTop: isMob ? 24 : 56 }}>
      <div style={{ background: qCARD, border: "1px solid " + qLINE, borderRadius: cr, padding: isMob ? "32px 22px" : "44px 40px", marginBottom: 24 }}>
        <div style={{ width: 72, height: 72, margin: "0 auto 24px", borderRadius: 36, background: qGREEN, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><QI.Check s={32} /></div>
        <h1 className="serif" style={{ fontSize: isMob ? 28 : 36, color: qMID, lineHeight: 1.1, margin: "0 0 12px" }}>Self-evaluation submitted.</h1>
        <p style={{ fontSize: 15, color: qINK, fontFamily: "var(--sans)", lineHeight: 1.6, margin: "0 auto", maxWidth: 460 }}>Your {totalSelf} ratings are locked in. Next, nominate the people whose perspective will balance your view.</p>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
        <QBtn primary onClick={() => setC360Step("nominate")}>Nominate raters <QI.Arrow /></QBtn>
      </div>
      <Toast />
    </div>
  );

  // ═══════════════════════════════════════════════════════════
  //  STEP: NOMINATE
  // ═══════════════════════════════════════════════════════════
  if (c360Step === "nominate") {
    const candidates = [
      { id: "c1", name: "Sarah Chen", role: "VP Product · Manager", rel: "manager", avatar: "SC" },
      { id: "c2", name: "Arjun Patel", role: "Senior PM · Product", rel: "peer", avatar: "AP" },
      { id: "c3", name: "Maya Rodriguez", role: "Staff Designer", rel: "peer", avatar: "MR" },
      { id: "c4", name: "Priya Sharma", role: "Head of Ops", rel: "peer", avatar: "PS" },
      { id: "c5", name: "Liam O'Connor", role: "Staff Eng · Platform", rel: "peer", avatar: "LO" },
      { id: "c6", name: "Dani Kim", role: "Analytics Lead", rel: "direct", avatar: "DK" },
      { id: "c7", name: "Raj Mehta", role: "Eng Manager · Payments", rel: "direct", avatar: "RM" },
      { id: "c8", name: "Ana Torres", role: "Research Lead", rel: "direct", avatar: "AT" },
    ];
    const toggle = (cand) => {
      const exists = roster.find(r => r.id === cand.id || r.name === cand.name);
      if (exists) setC360Roster(roster.filter(r => r.id !== exists.id));
      else setC360Roster([...roster, { ...cand, status: "invited", progress: 0, invited: "Apr 10", completed: null }]);
    };
    const managers = byRel("manager"), peers = byRel("peer"), directs = byRel("direct");
    const validManagers = managers.length >= 1;
    const validPeers = peers.length >= 3 && peers.length <= 8;
    const validDirects = directs.length >= 2;
    const canSend = validManagers && validPeers && validDirects;
    return (
      <div style={wrap}>
        <Eyebrow color={qPURPLE} bg={qPURPLE_BG}>Step 02 · Nominate</Eyebrow>
        <h1 className="serif" style={{ fontSize: isMob ? 30 : 38, color: qMID, lineHeight: 1.05, margin: "0 0 14px" }}>Who should give you feedback?</h1>
        <p style={{ fontSize: 15, color: qINK, fontFamily: "var(--sans)", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 680 }}>Aim for a mix that sees different facets of your leadership. You'll need at least <strong style={{ color: qMID }}>1 manager, 3–8 peers, and 2 direct reports</strong>.</p>

        <div style={{ display: "grid", gridTemplateColumns: isMob ? "1fr" : "1fr 320px", gap: 24, alignItems: "flex-start" }}>
          {/* candidate list */}
          <div>
            {[
              { rel: "manager", l: "Managers", min: "1 required", ok: validManagers },
              { rel: "peer", l: "Peers", min: "3–8", ok: validPeers },
              { rel: "direct", l: "Direct reports", min: "2+", ok: validDirects },
            ].map(grp => (
              <div key={grp.rel} style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12, paddingBottom: 10, borderBottom: "1px solid " + qLINE }}>
                  <div className="serif" style={{ fontSize: 17, color: qMID }}>{grp.l}</div>
                  <div style={{ fontSize: 14, fontFamily: "var(--sans)", color: grp.ok ? qGREEN : qMUT, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                    {byRel(grp.rel).length} selected · {grp.min} {grp.ok && <QI.Check s={11} />}
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: isMob ? "1fr" : "1fr 1fr", gap: 8 }}>
                  {candidates.filter(c => c.rel === grp.rel).map(cand => {
                    const picked = !!roster.find(r => r.id === cand.id || r.name === cand.name);
                    return (
                      <button key={cand.id} onClick={() => toggle(cand)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: picked ? qPURPLE_BG : qCARD, border: "1px solid " + (picked ? qPURPLE : qLINE), borderRadius: sr, cursor: "pointer", textAlign: "left", fontFamily: "var(--sans)", transition: "all .15s ease" }}>
                        <div className="serif" style={{ width: 36, height: 36, borderRadius: 18, background: picked ? qPURPLE : "rgba(0,15,71,.07)", color: picked ? "#fff" : qMID, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{cand.avatar}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: qMID, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cand.name}</div>
                          <div style={{ fontSize: 14, color: qINK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cand.role}</div>
                        </div>
                        <div style={{ width: 20, height: 20, borderRadius: 10, border: "1px solid " + (picked ? qPURPLE : qLINE), background: picked ? qPURPLE : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#fff" }}>
                          {picked && <QI.Check s={12} />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* invitation + send */}
          <div style={{ background: qCARD, border: "1px solid " + qLINE, borderRadius: cr, padding: 24, position: isMob ? "static" : "sticky", top: 20 }}>
            <div className="serif" style={{ fontSize: 17, color: qMID, marginBottom: 6 }}>Invitation</div>
            <div style={{ fontSize: 14, color: qINK, fontFamily: "var(--sans)", marginBottom: 14 }}>Preview before sending</div>
            <textarea value={c360Msg} onChange={e => setC360Msg(e.target.value)} rows={5} style={{ width: "100%", padding: "10px 12px", borderRadius: ir, border: "1px solid " + qLINE, background: "var(--card)", color: qMID, fontFamily: "var(--sans)", fontSize: 14, lineHeight: 1.5, resize: "vertical", boxSizing: "border-box", marginBottom: 14 }} />
            <div style={{ fontSize: 14, fontWeight: 700, color: qMUT, fontFamily: "var(--sans)", marginBottom: 6 }}>Deadline</div>
            <input type="date" value={c360Deadline} onChange={e => setC360Deadline(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: ir, border: "1px solid " + qLINE, background: "var(--card)", color: qMID, fontFamily: "var(--sans)", fontSize: 14, boxSizing: "border-box", marginBottom: 18 }} />
            <div style={{ padding: "12px 14px", background: canSend ? "rgba(20,133,61,.08)" : "rgba(0,15,71,.03)", borderRadius: sr, fontSize: 14, color: canSend ? qGREEN : qINK, fontFamily: "var(--sans)", marginBottom: 14, lineHeight: 1.5, display: "flex", gap: 8 }}>
              <span style={{ color: canSend ? qGREEN : qMUT, flexShrink: 0, marginTop: 2 }}><QI.Check s={14} /></span>
              <div>{canSend ? `Ready to send to ${roster.length} raters.` : "Meet the minimums above to enable sending."}</div>
            </div>
            <QBtn primary disabled={!canSend} onClick={() => { setC360Invited(true); showToast(`Invitations sent to ${roster.length} raters`); setC360Step("track"); }} style={{ width: "100%" }}>Send {roster.length} invitations</QBtn>
          </div>
        </div>
        <Toast />
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  //  STEP: TRACK
  // ═══════════════════════════════════════════════════════════
  if (c360Step === "track") {
    const remind = (r) => showToast(`Reminder sent to ${r.name}`);
    return (
      <div style={wrap}>
        <Eyebrow color={qGOLDINK} bg="rgba(203,126,3,.10)">Step 03 · Track</Eyebrow>
        <h1 className="serif" style={{ fontSize: isMob ? 30 : 38, color: qMID, lineHeight: 1.05, margin: "0 0 14px" }}>Response tracker</h1>
        <p style={{ fontSize: 15, color: qINK, fontFamily: "var(--sans)", lineHeight: 1.7, margin: "0 0 28px" }}>Individual responses are never attributed. You'll unlock your report when response rate reaches 60%.</p>

        {/* summary */}
        <div style={{ background: qCARD, border: "1px solid " + qLINE, borderRadius: cr, padding: 20, marginBottom: 28, display: "grid", gridTemplateColumns: isMob ? "1fr 1fr" : "repeat(4,1fr)", gap: 16 }}>
          {[
            { l: "Invited", n: tot, c: qMUT },
            { l: "Complete", n: doneCount, c: qGREEN },
            { l: "In progress", n: roster.filter(r => r.status === "in-progress").length, c: qBLUE },
            { l: "Response rate", n: `${responseRate}%`, c: responseRate >= 60 ? qGREEN : qGOLDINK },
          ].map((m) => (
            <div key={m.l}>
              <div style={{ fontSize: 14, fontWeight: 700, color: qMUT, fontFamily: "var(--sans)", marginBottom: 6 }}>{m.l}</div>
              <div className="serif" style={{ fontSize: 30, color: m.c }}>{m.n}</div>
            </div>
          ))}
        </div>

        {/* rater list */}
        <div style={{ background: qCARD, border: "1px solid " + qLINE, borderRadius: cr, overflow: "hidden" }}>
          {roster.map((r, i) => {
            const stCfg = {
              complete: { l: "Complete", c: "#14853D", bg: "color-mix(in srgb, #14853D 15%, #ffffff)" },
              "in-progress": { l: "In progress", c: "#002C77", bg: "color-mix(in srgb, #002C77 15%, #ffffff)" },
              opened: { l: "Opened", c: "#CB7E03", bg: "color-mix(in srgb, #CB7E03 15%, #ffffff)" },
              invited: { l: "Invited", c: "var(--ink)", bg: "var(--status-neutral-bg)" },
              declined: { l: "Declined", c: "#C53532", bg: "color-mix(in srgb, #C53532 15%, #ffffff)" },
            }[r.status];
            return (
              <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderTop: i > 0 ? "1px solid " + qLINE : "none" }}>
                <div className="serif" style={{ width: 40, height: 40, borderRadius: 20, background: "rgba(0,15,71,.06)", color: qMID, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{r.avatar}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: qMID, fontFamily: "var(--sans)", marginBottom: 2 }}>{r.name}</div>
                  <div style={{ fontSize: 14, color: qINK, fontFamily: "var(--sans)" }}>{r.role}</div>
                </div>
                {!isMob && <div style={{ width: 100, height: 4, background: "var(--track)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${r.progress}%`, background: stCfg.c, transition: "width .3s ease" }} />
                </div>}
                <div style={{ padding: "4px 10px", borderRadius: 99, background: stCfg.bg, color: stCfg.c, fontSize: 14, fontWeight: 400, fontFamily: "var(--sans)", flexShrink: 0 }}>{stCfg.l}</div>
                {(r.status === "invited" || r.status === "opened" || r.status === "in-progress") && (
                  <button onClick={() => remind(r)} style={{ padding: "6px 12px", borderRadius: sr, border: "1px solid " + qLINE, background: "transparent", color: qMID, fontSize: 14, fontWeight: 600, fontFamily: "var(--sans)", cursor: "pointer", flexShrink: 0 }}>Remind</button>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end", flexWrap: "wrap" }}>
          <QBtn onClick={() => setC360Step("nominate")}>Add raters</QBtn>
          <QBtn primary disabled={responseRate < 60} onClick={() => setC360Step("report")}>View report <QI.Arrow /></QBtn>
        </div>
        <Toast />
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  //  STEP: REPORT
  // ═══════════════════════════════════════════════════════════
  if (c360Step === "report") {
    const ready = responseRate >= 60;
    if (!ready) {
      return (
        <div style={{ ...wrap, textAlign: "center" }}>
          <div style={{ background: qCARD, border: "1px solid " + qLINE, borderRadius: cr, padding: isMob ? "32px 22px" : "48px 40px" }}>
            <div style={{ width: 72, height: 72, margin: "0 auto 24px", borderRadius: 36, background: qPURPLE_BG, color: qPURPLE, display: "flex", alignItems: "center", justifyContent: "center" }}><QI.Lock s={32} /></div>
            <h1 className="serif" style={{ fontSize: isMob ? 26 : 34, color: qMID, lineHeight: 1.1, margin: "0 0 12px" }}>Your report isn't ready.</h1>
            <p style={{ fontSize: 15, color: qINK, fontFamily: "var(--sans)", lineHeight: 1.7, margin: "0 auto 24px", maxWidth: 460 }}>Reports unlock at <strong style={{ color: qMID }}>60% response rate</strong>. You're currently at <strong style={{ color: qGOLDINK }}>{responseRate}%</strong> ({doneCount} of {tot} complete).</p>
            <QBtn primary onClick={() => setC360Step("track")}>Open tracker</QBtn>
          </div>
          <Toast />
        </div>
      );
    }
    const scores = c360Comps.map((c, i) => {
      const self = c360SelfAns[i] ?? (3 + (i % 3) * 0.5);
      const manager = 3.2 + ((i * 7) % 18) / 10;
      const peer = 3.4 + ((i * 11) % 16) / 10;
      const direct = 3.6 + ((i * 13) % 14) / 10;
      const othersAvg = (manager + peer + direct) / 3;
      return { ...c, self, manager, peer, direct, othersAvg, gap: self - othersAvg };
    });
    const blindSpots = [...scores].filter(s => s.gap > 0.4).sort((a, b) => b.gap - a.gap).slice(0, 2);
    const hiddenStrengths = [...scores].filter(s => s.gap < -0.3).sort((a, b) => a.gap - b.gap).slice(0, 2);
    const topStrengths = [...scores].sort((a, b) => b.othersAvg - a.othersAvg).slice(0, 2);
    return (
      <div style={wrap}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
          <div style={{ maxWidth: 640 }}>
            <Eyebrow color={qGREEN} bg="rgba(20,133,61,.12)">Step 04 · Report ready</Eyebrow>
            <h1 className="serif" style={{ fontSize: isMob ? 32 : 40, color: qMID, lineHeight: 1.02, margin: "0 0 12px" }}>How others see you.</h1>
            <p style={{ fontSize: 15, color: qINK, fontFamily: "var(--sans)", lineHeight: 1.7, margin: 0 }}>{doneCount} of {tot} raters responded ({responseRate}%). Self vs. rater averages across {c360Comps.length} competencies.</p>
          </div>
          <QBtn small onClick={() => showToast("Report exported")}>Export PDF</QBtn>
        </div>

        {/* narrative callouts */}
        <div style={{ display: "grid", gridTemplateColumns: isMob ? "1fr" : "repeat(3,1fr)", gap: 16, marginBottom: 40 }}>
          {[
            { l: "Top strengths", items: topStrengths, c: qGREEN },
            { l: "Blind spots", items: blindSpots, c: qGOLDINK, hint: "Rated higher by you than others" },
            { l: "Hidden strengths", items: hiddenStrengths, c: qBLUE, hint: "Rated higher by others than you" },
          ].map((g) => (
            <div key={g.l} style={{ padding: 20, background: qCARD, border: "1px solid " + qLINE, borderRadius: cr }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: g.c }} />
                <div style={{ fontSize: 14, fontWeight: 700, color: g.c, fontFamily: "var(--sans)" }}>{g.l}</div>
              </div>
              {g.hint && <div style={{ fontSize: 14, color: qMUT, fontFamily: "var(--sans)", marginBottom: 10 }}>{g.hint}</div>}
              {g.items.length === 0 ? (
                <div style={{ fontSize: 14, color: qMUT, fontFamily: "var(--sans)", fontStyle: "italic" }}>None detected</div>
              ) : g.items.slice(0, 3).map(s => (
                <div key={s.key} style={{ paddingTop: 10, borderTop: "1px solid " + qLINE, marginTop: 10 }}>
                  <div className="serif" style={{ fontSize: 16, color: qMID, marginBottom: 2 }}>{s.label}</div>
                  <div style={{ fontSize: 14, color: qINK, fontFamily: "var(--sans)" }}>Self {s.self.toFixed(1)} · Others {s.othersAvg.toFixed(1)} · Δ {s.gap > 0 ? "+" : ""}{s.gap.toFixed(1)}</div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* competency rows */}
        <div className="serif" style={{ fontSize: 20, color: qMID, margin: "0 0 16px" }}>Competency-by-competency</div>
        <div style={{ background: qCARD, border: "1px solid " + qLINE, borderRadius: cr, overflow: "hidden" }}>
          {scores.map((s, si) => {
            const selfPos = (s.self / 5) * 100, oth = (s.othersAvg / 5) * 100;
            return (
              <div key={s.key} style={{ padding: "18px 20px", borderTop: si > 0 ? "1px solid " + qLINE : "none" }}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14, gap: 12, flexWrap: "wrap" }}>
                  <div>
                    <div className="serif" style={{ fontSize: 16, color: qMID, marginBottom: 2 }}>{s.label}</div>
                    <div style={{ fontSize: 14, color: qINK, fontFamily: "var(--sans)" }}>{s.desc}</div>
                  </div>
                  <div style={{ display: "flex", gap: 14, alignItems: "baseline", fontFamily: "var(--sans)", fontSize: 14, color: qMUT }}>
                    <div>Self <strong className="serif" style={{ color: qMID, fontSize: 15 }}>{s.self.toFixed(1)}</strong></div>
                    <div>Others <strong className="serif" style={{ color: qMID, fontSize: 15 }}>{s.othersAvg.toFixed(1)}</strong></div>
                    <div className="serif" style={{ color: Math.abs(s.gap) < 0.3 ? qMUT : s.gap > 0 ? qGOLDINK : qBLUE, fontSize: 15 }}>Δ {s.gap > 0 ? "+" : ""}{s.gap.toFixed(1)}</div>
                  </div>
                </div>
                <div style={{ position: "relative", height: 8, background: "rgba(0,15,71,.06)", borderRadius: 4, overflow: "visible" }}>
                  <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${oth}%`, background: qPURPLE, borderRadius: 4 }} />
                  <div style={{ position: "absolute", left: `${selfPos}%`, top: -4, width: 2, height: 16, background: qMID, transform: "translateX(-1px)" }} />
                  <div style={{ position: "absolute", left: `${selfPos}%`, top: -18, transform: "translateX(-50%)", fontSize: 14, fontWeight: 700, fontFamily: "var(--sans)", color: qMID, background: qCANVAS, padding: "1px 5px", borderRadius: 2, whiteSpace: "nowrap" }}>self</div>
                </div>
                <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 14, fontFamily: "var(--sans)", color: qMUT, flexWrap: "wrap" }}>
                  <div><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 4, background: qPURPLE, marginRight: 4, verticalAlign: "middle" }} />Manager {s.manager.toFixed(1)}</div>
                  <div><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 4, background: qBLUE, marginRight: 4, verticalAlign: "middle" }} />Peers {s.peer.toFixed(1)}</div>
                  <div><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 4, background: qGREEN, marginRight: 4, verticalAlign: "middle" }} />Directs {s.direct.toFixed(1)}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ fontSize: 14, color: qMUT, fontFamily: "var(--sans)" }}>Generated {new Date().toLocaleDateString()}. Individual rater responses are never attributed.</div>
          <QBtn primary onClick={buildPlan}>Build development plan <QI.Arrow /></QBtn>
        </div>
        <Toast />
      </div>
    );
  }

  return null;
}

window.EdC360 = EdC360;
