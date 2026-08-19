// ════════════════════════════════════════════════
//  MANAGER WORKSPACE — Direct Reportees.
//  The other side of the Development Plan: the manager sees who has submitted,
//  opens the plan, reads a change summary of what the employee edited, and
//  approves (with a note) or rejects (with a reason).
//
//  The employee's own "Submit Plan" writes lh-idp-submission to localStorage, so
//  John Doe's row here reflects the real submission from the Folio flow.
//  Self-contained: reads the shared plan seed via window.EdPlan.SEED, mutates nothing.
//  Exports: window.LHManager
// ════════════════════════════════════════════════

const { useState: mgUseState, useEffect: mgUseEffect, useRef: mgUseRef } = React;

const MGR_SUB_KEY = "lh-idp-submission";

// ── direct reportees ──
//  status: notstarted | pending | approved | rejected | completed
const MGR_TEAM = [
  { id: "john", first: "John", last: "Doe", initials: "JD", role: "Product Management", email: "john.doe@marsh.com",
    linked: true, skills: 5,
    status: "notstarted", plan: "Leadership Potential Assessment 2026" },
  { id: "amelia", first: "Amelia", last: "Rahman", initials: "AR", role: "Senior Consultant", email: "amelia.rahman@marsh.com",
    skills: 4, status: "pending", plan: "Leadership Potential Assessment 2026",
    changes: [
      { kind: "added", skill: "Execute with Excellence", label: "Peer Collaboration Sessions" },
      { kind: "modified", skill: "Execute with Excellence", label: "Adopt Quality Assurance Techniques" },
      { kind: "modified", skill: "Communicate with Impact", label: "Prepared Communication" },
      { kind: "added", skill: "Data & Analytics", label: "Build a Reporting Playbook" },
      { kind: "modified", skill: "Data & Analytics", label: "Complete a Data Storytelling Course" },
    ] },
  { id: "daniel", first: "Daniel", last: "Okafor", initials: "DO", role: "Client Manager", email: "daniel.okafor@marsh.com",
    skills: 3, status: "notstarted", plan: "Leadership Potential Assessment 2026" },
  { id: "sofia", first: "Sofia", last: "Marchetti", initials: "SM", role: "Data Analyst", email: "sofia.marchetti@marsh.com",
    skills: 3, status: "completed", plan: "360° Perspective Feedback" },
  { id: "haruto", first: "Haruto", last: "Tanaka", initials: "HT", role: "Operations Lead", email: "haruto.tanaka@marsh.com",
    skills: 2, status: "notstarted", plan: "Leadership Potential Assessment 2026" },
  { id: "lena", first: "Lena", last: "Fischer", initials: "LF", role: "Risk Specialist", email: "lena.fischer@marsh.com",
    skills: 2, status: "notstarted", plan: "Leadership Potential Assessment 2026" },
];

const MGR_STATUS = {
  notstarted: { label: "Not Started", color: eMUT, bg: "rgba(0,15,71,.05)", border: "transparent" },
  pending: { label: "Pending Approval", color: "#B4770A", bg: "rgba(255,191,0,.14)", border: "transparent" },
  approved: { label: "Approved", color: eSUCCESS, bg: "rgba(20,133,61,.10)", border: "transparent" },
  completed: { label: "Completed", color: "#6B49C8", bg: "rgba(107,73,200,.10)", border: "transparent" },
  rejected: { label: "Rejected", color: "var(--danger)", bg: "rgba(197,53,50,.10)", border: "transparent" },
};
// The chip shown on the detail page for each state.
const MGR_DETAIL_STATUS = { pending: "In Review", approved: "Approved", rejected: "Rejected", completed: "Completed", notstarted: "Not Started" };

// Build a plan for a reportee from the shared seed, tagging what they changed.
function mgrPlanFor(p) {
  const seed = (window.EdPlan && window.EdPlan.SEED) || [];
  const clone = (window.EdPlan && window.EdPlan.clone) || ((x) => JSON.parse(JSON.stringify(x)));
  const data = clone(seed);
  let budget = p.skills || 3;
  const out = [];
  data.forEach((cat) => {
    const keep = [];
    cat.skills.forEach((s) => { if (budget > 0) { keep.push(s); budget -= 1; } });
    if (keep.length) out.push({ ...cat, skills: keep });
  });
  // Group the employee's edits by the skill they belong to, so every skill that
  // changed carries its own "Edited" tag, badges and change summary.
  const bySkill = {};
  (p.changes || []).forEach((c) => { (bySkill[c.skill] = bySkill[c.skill] || []).push(c); });
  let i = 0;
  out.forEach((cat) => cat.skills.forEach((s) => {
    s.rating = 0;
    const mine = bySkill[s.name] || [];
    s.changes = mine;
    s.edited = mine.length > 0;
    s.actions.forEach((a) => {
      a.completion = p.status === "completed" ? 100 : [100, 100, 0][i % 3];
      const hit = mine.find((c) => c.label === a.title);
      if (hit) a.badge = hit.kind === "added" ? "New" : "Edited";
      i += 1;
    });
    // an "added" action the seed doesn't have yet — show it as a new card
    mine.filter((c) => c.kind === "added" && !s.actions.some((a) => a.title === c.label))
      .forEach((c, k) => s.actions.push({ id: s.name + "-new-" + k, mix: 20, src: "Custom", title: c.label,
        desc: "Added by " + p.first + " while editing this plan.", completion: 0, badge: "New" }));
  }));
  return out;
}

// Skill-gap analysis — the same figures the employee sees on their side.
const MGR_GAPS = {
  overview: "From the Leadership Assessment, these competencies show the largest gap to target — they shape the focus of this plan.",
  gaps: [
    { skill: "Communicate with Impact", score: 2.4, target: 3.8, note: "Influence and stakeholder communication" },
    { skill: "Champion Change and Innovation", score: 2.6, target: 3.6, note: "Driving and adopting change" },
    { skill: "Collaborate and Build Relationships", score: 2.9, target: 3.6, note: "Cross-team collaboration" },
  ],
  strengths: ["Execute with Excellence \u2014 4.1 / 5 (above target)", "Act Professionally \u2014 3.9 / 5 (above target)"],
};

// ── small shared bits ──
const MgrBadge = ({ status }) => {
  const s = MGR_STATUS[status] || MGR_STATUS.notstarted;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", background: s.bg, color: s.color, fontFamily: "var(--sans)", fontSize: 13, fontWeight: 500, padding: "4px 11px", borderRadius: 6, whiteSpace: "nowrap" }}>{s.label}</span>
  );
};

const MgrTag = ({ kind }) => {
  const map = { Edited: { c: "#B4770A", b: "rgba(255,191,0,.16)" }, New: { c: eBLUE, b: "color-mix(in srgb, var(--accent) 12%, transparent)" } };
  const m = map[kind] || map.Edited;
  return <span style={{ background: m.b, color: m.c, fontFamily: "var(--sans)", fontSize: 12, fontWeight: 600, padding: "2px 8px", borderRadius: 5, whiteSpace: "nowrap" }}>{kind}</span>;
};

const MgrAvatar = ({ p, size = 42 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: "rgba(0,15,71,.08)", color: eMUT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <I.user size={Math.round(size * 0.5)} />
  </div>
);

// ════════════════════════════════════════════════
//  1 · DIRECT REPORTEES — the list
// ════════════════════════════════════════════════
function MgrList({ team, onOpen, onSummary }) {
  const head = { fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eMID };
  return (
    <div style={{ maxWidth: "var(--content-max)", margin: "32px var(--fol-mx) 72px", padding: 0 }}>
      <h1 style={{ fontFamily: "var(--sans)", fontSize: 22, fontWeight: 700, color: eMID, margin: "0 0 20px" }}>Direct Reportees</h1>

      <div style={{ background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 14, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 22px", borderBottom: "1px solid " + eLINE }}>
          <div style={{ ...head, flex: 1, minWidth: 0 }}>Users</div>
          <div style={{ ...head, width: 160, flexShrink: 0 }}>Status</div>
          <div style={{ ...head, width: 150, flexShrink: 0 }}>Actions</div>
        </div>

        {team.map((p, i) => (
          <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 22px", borderTop: i ? "1px solid " + eLINE : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0 }}>
              <MgrAvatar p={p} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: 14.5, fontWeight: 700, color: eMID, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.first} {p.last}</div>
                <div style={{ fontFamily: "var(--sans)", fontSize: 13.5, color: eMUT, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.email}</div>
              </div>
            </div>
            <div style={{ width: 160, flexShrink: 0 }}><MgrBadge status={p.status} /></div>
            <div style={{ width: 150, flexShrink: 0, display: "flex", alignItems: "center", gap: 16 }}>
              <button onClick={() => onOpen(p)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "var(--accent)", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600 }}>Details</button>
              {p.status === "pending" && (p.changes || []).length > 0 && (
                <button onClick={() => onSummary(p)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "var(--accent)", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600 }}>Summary</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
//  2 · SUMMARY LOGS — side drawer of what the employee changed
// ════════════════════════════════════════════════
function MgrSummaryDrawer({ person, onClose, onDecide }) {
  const groups = {};
  (person.changes || []).forEach((c) => { const k = c.skill || "Development plan"; (groups[k] = groups[k] || []).push(c); });
  return (
    <React.Fragment>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 85, background: "rgba(0,15,71,.28)" }} />
      <aside style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(560px, 92vw)", zIndex: 86, background: "var(--card)", boxShadow: "-18px 0 50px rgba(0,15,71,.20)", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "22px 26px", borderBottom: "1px solid " + eLINE }}>
          <button onClick={onClose} title="Close" style={{ background: "none", border: "none", cursor: "pointer", color: eMID, display: "flex", padding: 2 }}><I.plus size={20} style={{ transform: "rotate(45deg)" }} /></button>
          <h2 style={{ fontFamily: "var(--sans)", fontSize: 17, fontWeight: 700, color: eMID, margin: 0 }}>Summary logs for {person.first} {person.last}</h2>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "22px 26px" }}>
          {Object.keys(groups).map((skill) => (
            <div key={skill} style={{ marginBottom: 26 }}>
              <h3 style={{ fontFamily: "var(--sans)", fontSize: 17, fontWeight: 700, color: eMID, margin: "0 0 8px" }}>{skill}</h3>
              <div style={{ marginBottom: 12 }}><MgrTag kind="Edited" /></div>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {groups[skill].map((c, i) => (
                  <li key={i} style={{ fontFamily: "var(--sans)", fontSize: 14.5, color: eINK, lineHeight: 2 }}>
                    {c.kind === "added" ? "Added" : "Modified"} Development Action:{" "}
                    <span style={{ background: c.kind === "added" ? "color-mix(in srgb, var(--accent) 12%, transparent)" : "rgba(255,191,0,.16)", color: c.kind === "added" ? eBLUE : "#B4770A", padding: "2px 9px", borderRadius: 5, fontWeight: 500 }}>{c.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid " + eLINE, padding: "18px 26px", display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={() => onDecide("rejected")} style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eMID, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 9, padding: "10px 20px", cursor: "pointer" }}>Reject</button>
          <EdBtn primary onClick={() => onDecide("approved")}>Approve</EdBtn>
        </div>
      </aside>
    </React.Fragment>
  );
}

// ── note / reason popover used by Approve and Reject ──
function MgrNotePop({ kind, onClose, onSubmit }) {
  const [text, setText] = mgUseState("");
  const isReject = kind === "rejected";
  return (
    <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: 320, zIndex: 60, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 12, boxShadow: "0 16px 44px rgba(0,15,71,.20)", padding: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: eMID }}>{isReject ? "Reject Plan" : "Approve Plan"}</div>
        <button onClick={onClose} title="Close" style={{ background: "none", border: "none", cursor: "pointer", color: eMUT, display: "flex", padding: 0 }}><I.plus size={17} style={{ transform: "rotate(45deg)" }} /></button>
      </div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} placeholder={isReject ? "Add Reason…" : "Add Note…"}
        style={{ width: "100%", boxSizing: "border-box", padding: "11px 13px", borderRadius: 9, border: "1px solid " + eLINE, fontSize: 14, resize: "vertical", outline: "none", fontFamily: "var(--sans)", color: eINK, lineHeight: 1.5, marginBottom: 14 }} />
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <EdBtn primary disabled={isReject && !text.trim()} onClick={() => onSubmit(text.trim())}>Submit <I.arrow size={14} /></EdBtn>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
//  3 · DIRECT REPORTEES DETAIL — the plan, with the decision
// ════════════════════════════════════════════════
function MgrDetail({ person, onBack, onDecide, showToast }) {
  const [tab, setTab] = mgUseState("plan");
  const [pop, setPop] = mgUseState(null);          // "approved" | "rejected"
  const [showReason, setShowReason] = mgUseState(false);
  const data = React.useMemo(() => mgrPlanFor(person), [person.id, person.status]);
  const LEARN = (window.EdPlan && window.EdPlan.LEARN) || {};
  const ACard = window.EdPlan && window.EdPlan.ActionCard;   // same card the employee sees
  const SAMPLES = (window.EdPlan && window.EdPlan.SAMPLES) || [];
  const META = (window.EdPlan && window.EdPlan.metaLabel) || {};
  // Same plan-design switcher as the employee side; design 6 is the default here.
  const [sample, setSample] = mgUseState(() => { const v = parseInt(localStorage.getItem("mgr-plan-design"), 10); return v >= 1 && v <= 9 ? v : 6; });
  const [sampleMenu, setSampleMenu] = mgUseState(false);
  const pickSample = (n) => { setSample(n); try { localStorage.setItem("mgr-plan-design", String(n)); } catch (e) {} setSampleMenu(false); };
  // Wrap a skill's cards the way the employee plan does for grouped designs.
  const wrapCards = (cards) => {
    if (sample === 4 || sample === 6) {
      return (
        <div style={{ background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 12, padding: sample === 6 ? "6px 16px" : "0 16px 2px", boxShadow: "0 1px 3px rgba(0,15,71,.05)", marginBottom: 6 }}>
          {sample === 4 && (
            <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "13px 2px 9px", borderBottom: "1px solid " + eLINE }}>
              <span style={{ width: 8, flexShrink: 0 }} />
              <div style={{ ...META, margin: 0, flex: "1 1 260px", minWidth: 0 }}>Development action</div>
              <div style={{ ...META, margin: 0, width: 168, flexShrink: 0 }}>Start – End date</div>
              <div style={{ ...META, margin: 0, width: 148, flexShrink: 0 }}>Completion</div>
            </div>
          )}
          {cards}
        </div>
      );
    }
    if (sample === 9) return <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 12, alignItems: "stretch", marginBottom: 6 }}>{cards}</div>;
    return cards;
  };
  const decided = person.status === "approved" || person.status === "rejected" || person.status === "completed";
  const changesBySkill = (person.changes || []);

  const head = { fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eMID };

  return (
    <div style={{ maxWidth: "var(--content-max)", margin: "32px var(--fol-mx) 72px", padding: 0 }}>
      {/* title row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 18 }}>
        <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "none", border: "none", padding: 0, cursor: "pointer" }}>
          <I.arrowL size={20} style={{ color: eMID }} />
          <span style={{ fontFamily: "var(--sans)", fontSize: 22, fontWeight: 700, color: eMID }}>Direct Reportees Detail</span>
        </button>
        <div style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 500, color: person.status === "rejected" ? "var(--danger)" : eMUT, background: person.status === "rejected" ? "rgba(197,53,50,.10)" : "rgba(0,15,71,.05)", padding: "4px 11px", borderRadius: 6 }}>
            {MGR_DETAIL_STATUS[person.status] || "In Review"}
          </span>
          {person.status === "rejected" && (
            <button onClick={() => setShowReason((v) => !v)} title="Reason for rejection" style={{ background: "none", border: "none", cursor: "pointer", color: eMUT, display: "flex", padding: 0 }}><I.info size={17} /></button>
          )}
          {showReason && person.status === "rejected" && (
            <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: 260, zIndex: 60, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 12, boxShadow: "0 16px 44px rgba(0,15,71,.20)", padding: "14px 16px" }}>
              <div style={{ fontFamily: "var(--sans)", fontSize: 14.5, fontWeight: 700, color: eMID, marginBottom: 6 }}>Reason for Rejection</div>
              <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.5 }}>{person.reason || "Rejected"}</div>
            </div>
          )}
        </div>
      </div>

      {/* person */}
      <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 20 }}>
        <MgrAvatar p={person} size={40} />
        <div>
          <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: eMID }}>{person.first} {person.last}</div>
          <div style={{ fontFamily: "var(--sans)", fontSize: 13.5, color: eMUT }}>{person.email}</div>
        </div>
      </div>

      {/* tabs + actions */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", borderBottom: "1px solid " + eLINE, marginBottom: 4 }}>
        <div style={{ display: "flex", gap: 2 }}>
          {[["plan", "Plan"], ["gap", "Skill Gap Report"]].map(([k, l]) => {
            const on = tab === k;
            return <button key={k} onClick={() => setTab(k)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--sans)", fontSize: 14, fontWeight: on ? 700 : 500, color: on ? eMID : eMUT, padding: "10px 14px", borderBottom: "2px solid " + (on ? eMID : "transparent"), marginBottom: -1 }}>{l}</button>;
          })}
        </div>
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10, paddingBottom: 8 }}>
          {!decided && (
            <React.Fragment>
              <button onClick={() => setPop(pop === "rejected" ? null : "rejected")}
                style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eMID, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 9, padding: "9px 18px", cursor: "pointer" }}>Reject</button>
              <EdBtn primary small onClick={() => setPop(pop === "approved" ? null : "approved")}>Approve</EdBtn>
            </React.Fragment>
          )}
          <button disabled={decided} title={decided ? "Plan is closed" : "Edit plan"}
            style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: decided ? eMUT : eMID, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 9, padding: "9px 16px", cursor: decided ? "not-allowed" : "pointer", opacity: decided ? .55 : 1 }}>
            <I.edit size={15} /> Edit Plan
          </button>
          <button title="Comments" style={{ width: 38, height: 38, borderRadius: 9, border: "1px solid " + eLINE, background: "var(--card)", color: eMID, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><I.chat size={17} /></button>
          {pop && <MgrNotePop kind={pop} onClose={() => setPop(null)} onSubmit={(text) => {
            onDecide(person.id, pop, text);
            setPop(null);
            showToast(pop === "approved" ? "Plan approved" : "Plan rejected");
          }} />}
        </div>
      </div>

      {tab === "gap" ? (
        /* Skill Gap Report — the same analysis the employee sees */
        <div style={{ marginTop: 24 }}>
          <div style={{ background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 16, padding: "22px 24px" }}>
            <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.6, margin: 0 }}>{MGR_GAPS.overview}</p>
            <h3 style={{ fontFamily: "var(--sans)", fontSize: 16, fontWeight: 700, color: eMID, margin: "18px 0 12px" }}>Priority gaps</h3>
            {MGR_GAPS.gaps.map((g, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, marginBottom: 5 }}>
                  <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eMID }}>{g.skill}</span>
                  <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, whiteSpace: "nowrap" }}>{g.score.toFixed(1)} / {g.target.toFixed(1)} target</span>
                </div>
                <div style={{ position: "relative", height: 6, borderRadius: 3, background: "rgba(0,15,71,.08)" }}>
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: (g.score / 5 * 100) + "%", background: eWARN, borderRadius: 3 }} />
                  <div style={{ position: "absolute", left: (g.target / 5 * 100) + "%", top: -2, bottom: -2, width: 2, background: eMID, borderRadius: 1 }} title="Target" />
                </div>
                <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, marginTop: 4 }}>{g.note}</div>
              </div>
            ))}
            <h3 style={{ fontFamily: "var(--sans)", fontSize: 16, fontWeight: 700, color: eMID, margin: "18px 0 6px" }}>Strengths to leverage</h3>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {MGR_GAPS.strengths.map((s, i) => <li key={i} style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.75 }}>{s}</li>)}
            </ul>
          </div>
        </div>
      ) : (
        <React.Fragment>
          {data.map((cat, ci) => (
            <div key={ci} style={{ marginTop: 26 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 18 }}>
                <div style={{ width: 46, height: 46, borderRadius: 23, background: "rgba(0,15,71,.06)", color: eMID, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{React.createElement(I[cat.icon] || I.bulb, { size: 22 })}</div>
                <h2 style={{ fontFamily: "var(--sans)", fontSize: 21, fontWeight: 700, color: eMID, margin: 0 }}>{cat.cat}</h2>
              </div>

              {cat.skills.map((skill, si) => {
                const skillChanges = skill.changes || [];
                return (
                <div key={si} style={{ marginBottom: 26 }}>
                  {/* skill header — same shape as the employee plan */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", padding: "6px 0 14px" }}>
                    <h3 style={{ fontFamily: "var(--sans)", fontSize: 17, fontWeight: 700, color: eMID, margin: 0 }}>{skill.name}</h3>
                    <span style={{ display: "inline-flex", gap: 3 }}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <svg key={n} width="17" height="17" viewBox="0 0 24 24" fill="currentColor" style={{ color: n <= (skill.rating || 0) ? "var(--action)" : "rgba(0,15,71,.18)" }}><path d="M12 2l2.9 6.3 6.8.7-5.1 4.6 1.5 6.7L12 17.9 5.9 20.3l1.5-6.7L2.3 9l6.8-.7z" /></svg>
                      ))}
                    </span>
                    {skill.edited && <MgrTag kind="Edited" />}
                    <div style={{ flex: 1 }} />
                    <button title="Comments on this skill" style={{ background: "none", border: "none", cursor: "pointer", color: eMUT, display: "flex", padding: 2 }}><I.chat size={17} /></button>
                  </div>

                  {/* the employee's plan cards, rendered with the very same component */}
                  {wrapCards(skill.actions.map((a, ai) => (
                    ACard
                      ? <ACard key={a.id} action={a} editable={false} sample={sample === 8 ? 1 : sample} last={ai === skill.actions.length - 1} onDate={() => {}} onComplete={() => {}} onDelete={() => {}} />
                      : <div key={a.id} style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, padding: "10px 0" }}>{a.title}</div>
                  )))}

                  {/* what changed on this skill — sits under the skill, not above it */}
                  {skillChanges.length > 0 && (
                    <div style={{ background: "rgba(0,15,71,.03)", border: "1px solid " + eLINE, borderRadius: 10, padding: "13px 16px", marginTop: 4 }}>
                      <div style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 700, color: eMID, marginBottom: 7 }}>Change summary</div>
                      <ul style={{ margin: 0, paddingLeft: 18 }}>
                        {skillChanges.map((c, i) => (
                          <li key={i} style={{ fontFamily: "var(--sans)", fontSize: 13.5, color: eINK, lineHeight: 1.9 }}>
                            {c.kind === "added" ? "Added" : "Modified"} Development Action:{" "}
                            <span style={{ background: c.kind === "added" ? "color-mix(in srgb, var(--accent) 12%, transparent)" : "rgba(255,191,0,.16)", color: c.kind === "added" ? eBLUE : "#B4770A", padding: "1px 8px", borderRadius: 5 }}>{c.label}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          ))}
        </React.Fragment>
      )}

      {/* plan-design switcher — the same nine samples as the employee side */}
      {tab === "plan" && SAMPLES.length > 0 && ReactDOM.createPortal(
        <div style={{ position: "fixed", right: 200, bottom: 14, zIndex: 60, fontFamily: "var(--sans)" }}>
          {sampleMenu && (
            <div style={{ position: "absolute", bottom: 44, right: 0, width: 268, maxHeight: 420, overflowY: "auto", background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 12, boxShadow: "0 12px 36px rgba(0,15,71,.18)", padding: 7 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: eMUT, padding: "6px 9px 4px" }}>Plan design</div>
              {SAMPLES.map((sm) => { const on = sample === sm.id; return (
                <button key={sm.id} onClick={() => pickSample(sm.id)} style={{ width: "100%", display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 9px", borderRadius: 8, border: "none", background: on ? "color-mix(in srgb, var(--accent) 7%, transparent)" : "transparent", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ width: 16, flexShrink: 0, marginTop: 2, color: eBLUE, display: "flex", justifyContent: "center" }}>{on ? <I.check size={15} /> : null}</span>
                  <span><span style={{ display: "block", fontSize: 14, fontWeight: 600, color: on ? eMID : eINK }}>{sm.label}</span><span style={{ display: "block", fontSize: 14, color: eMUT, lineHeight: 1.4 }}>{sm.desc}</span></span>
                </button>); })}
            </div>
          )}
          <button onClick={() => setSampleMenu((v) => !v)} title="Switch the plan card design"
            style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 999, padding: "7px 14px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eMID, cursor: "pointer", boxShadow: "0 2px 10px rgba(0,15,71,.10)" }}>
            <I.layers size={14} /> Plan design · {sample}
          </button>
        </div>, document.body)}
    </div>
  );
}

// ════════════════════════════════════════════════
//  SHELL
// ════════════════════════════════════════════════
function LHManager() {
  const [route, setRoute] = mgUseState({ page: "list", person: null });
  const [team, setTeam] = mgUseState(MGR_TEAM);
  const [summary, setSummary] = mgUseState(null);
  const [toast, setToast] = mgUseState(null);
  const [collapsed, setCollapsed] = mgUseState(false);
  const [devOpen, setDevOpen] = mgUseState(true);
  const showToast = (m) => { setToast(m); setTimeout(() => setToast(null), 2800); };

  // John Doe's row mirrors whatever the employee flow submitted.
  const syncSubmission = React.useCallback(() => {
    let sub = null;
    try { sub = JSON.parse(localStorage.getItem(MGR_SUB_KEY) || "null"); } catch (e) {}
    setTeam((t) => t.map((p) => {
      if (!p.linked) return p;
      if (sub && sub.status === "pending" && p.status === "notstarted") {
        return { ...p, status: "pending", changes: [
          { kind: "added", label: "Implement a Weekly Review Process" },
          { kind: "modified", label: "Adopt Quality Assurance Techniques" },
        ] };
      }
      return p;
    }));
  }, []);
  mgUseEffect(() => {
    syncSubmission();
    const onFocus = () => syncSubmission();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [syncSubmission]);

  mgUseEffect(() => { window.scrollTo(0, 0); }, [route]);

  const decide = (id, status, text) => {
    setTeam((t) => t.map((p) => p.id === id ? { ...p, status, reason: status === "rejected" ? (text || "Rejected") : p.reason, note: status === "approved" ? text : p.note } : p));
    if (route.person && route.person.id === id) setRoute((r) => ({ ...r, person: { ...r.person, status, reason: text || "Rejected" } }));
  };

  const person = route.person ? (team.find((t) => t.id === route.person.id) || route.person) : null;

  const railItem = (label, icon, active, onClick, sub) => (
    <button onClick={onClick} title={label}
      style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: collapsed ? "center" : "flex-start", background: active ? "rgba(206,236,255,.16)" : "transparent", border: "none", borderRadius: 9, padding: collapsed ? "12px 0" : (sub ? "10px 13px 10px 30px" : "11px 13px"), cursor: "pointer", color: active ? "#fff" : "rgba(255,255,255,.75)", fontFamily: "var(--sans)", fontSize: sub ? 13.5 : 14, fontWeight: active ? 700 : 500, width: "100%", textAlign: "left" }}>
      {icon && React.createElement(I[icon] || I.home, { size: 18 })}{!collapsed && label}
    </button>
  );

  return (
    <div className="ed-shell" style={{ display: "flex", minHeight: "100vh", background: "var(--canvas)" }}>
      <aside style={{ width: collapsed ? 76 : 244, flexShrink: 0, background: "var(--surface-deep)", display: "flex", flexDirection: "column", transition: "width .2s", position: "sticky", top: 0, height: "100vh", alignSelf: "flex-start" }}>
        <div style={{ padding: collapsed ? "22px 0 20px" : "22px 20px 20px", display: "flex", justifyContent: collapsed ? "center" : "flex-start" }}>
          <span className="serif" style={{ color: "#fff", fontSize: collapsed ? 22 : 19 }}>{collapsed ? "M" : "Marsh Lighthouse"}</span>
        </div>
        <nav style={{ padding: collapsed ? "0 10px" : "0 12px", display: "flex", flexDirection: "column", gap: 3, flex: 1, overflowY: "auto" }}>
          {railItem("Home", "home", false, () => {})}
          <button onClick={() => setDevOpen((v) => !v)} style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: collapsed ? "center" : "flex-start", background: "transparent", border: "none", borderRadius: 9, padding: collapsed ? "12px 0" : "11px 13px", cursor: "pointer", color: "#fff", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, width: "100%" }}>
            <I.book size={18} />{!collapsed && <React.Fragment>Development<span style={{ marginLeft: "auto", display: "flex" }}><I.chevD size={15} style={{ transform: devOpen ? "rotate(180deg)" : "none" }} /></span></React.Fragment>}
          </button>
          {!collapsed && devOpen && (
            <React.Fragment>
              {railItem("My Plan", null, false, () => {}, true)}
              {railItem("Direct Reportees", null, route.page === "list" || route.page === "detail", () => setRoute({ page: "list", person: null }), true)}
            </React.Fragment>
          )}
          {railItem("Profile", "user", false, () => {})}
        </nav>
        <div style={{ padding: collapsed ? "14px 10px 18px" : "14px 16px 18px", display: "flex", alignItems: "center", gap: 11, justifyContent: collapsed ? "center" : "flex-start" }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,.14)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><I.user size={17} /></div>
          {!collapsed && (
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: "var(--sans)", fontSize: 13.5, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Priya Sharma</div>
              <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--action)", cursor: "pointer" }}>Log out</div>
            </div>
          )}
        </div>
        <button onClick={() => setCollapsed((v) => !v)} title={collapsed ? "Expand menu" : "Collapse menu"}
          style={{ position: "absolute", top: 26, right: -13, width: 26, height: 26, borderRadius: "50%", background: "#fff", border: "1px solid " + eLINE, color: eMID, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,15,71,.15)" }}>
          <I.chevR size={14} style={{ transform: collapsed ? "none" : "rotate(180deg)" }} />
        </button>
      </aside>

      <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <div className="ed-topbar" style={{ position: "sticky", top: 0, zIndex: 40, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 16, minHeight: 58, boxSizing: "border-box", padding: "10px var(--fol-px, 56px)", background: "var(--canvas)", borderBottom: "1px solid " + eLINE }}>
          <span style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: eMUT, background: "rgba(0,15,71,.05)", padding: "5px 12px", borderRadius: 999 }}>Manager view</span>
        </div>
        <div className="ed-content" style={{ padding: "0 var(--fol-px, 56px)", flex: 1 }}>
          {route.page === "detail" && person
            ? <MgrDetail person={person} onBack={() => setRoute({ page: "list", person: null })} onDecide={decide} showToast={showToast} />
            : <MgrList team={team} onOpen={(p) => setRoute({ page: "detail", person: p })} onSummary={(p) => setSummary(p)} />}
        </div>
      </main>

      {summary && <MgrSummaryDrawer person={summary} onClose={() => setSummary(null)} onDecide={(status) => { decide(summary.id, status, status === "rejected" ? "Rejected" : ""); setSummary(null); showToast(status === "approved" ? "Plan approved" : "Plan rejected"); }} />}

      {toast && (
        <div style={{ position: "fixed", left: "50%", bottom: 28, transform: "translateX(-50%)", zIndex: 90, background: eMID, color: "#fff", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, padding: "11px 18px", borderRadius: 10, boxShadow: "0 10px 30px rgba(0,15,71,.28)", display: "inline-flex", alignItems: "center", gap: 8 }}>
          <I.check size={16} /> {toast}
        </div>
      )}
    </div>
  );
}

window.LHManager = LHManager;
