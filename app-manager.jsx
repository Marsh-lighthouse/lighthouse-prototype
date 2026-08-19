// ════════════════════════════════════════════════
//  MANAGER WORKSPACE — the other side of the Development Plan.
//  A manager sees the plans their team submitted, opens one for review with the
//  employee's details on top (the card the employee flow hides), and approves or
//  sends it back. They can also start a plan on someone's behalf.
//
//  Deliberately self-contained: it reads the shared plan seed through
//  window.EdPlan.SEED but never mutates anything the employee flow relies on.
//  Exports: window.LHManager
// ════════════════════════════════════════════════

const { useState: mgUseState, useEffect: mgUseEffect, useRef: mgUseRef } = React;

// ── the manager's team, with where each plan currently stands ──
//  status: submitted | approved | changes | draft | none
const MGR_TEAM = [
  { id: "amelia", first: "Amelia", last: "Rahman", initials: "AR", role: "Senior Consultant", email: "amelia.rahman@marsh.com",
    dept: "Human Resources", entity: "Star Trek Inc.", level: "Professional", grade: "2B", qual: "MSc Organisational Psychology",
    sub: "Human Resources", joined: "2021-09-13", program: "Leadership Potential Assessment 2026",
    status: "submitted", submitted: "Mar 4, 2026", actions: 9, skills: 5 },
  { id: "daniel", first: "Daniel", last: "Okafor", initials: "DO", role: "Client Manager", email: "daniel.okafor@marsh.com",
    dept: "Department B", entity: "Star Trek Inc.", level: "Management", grade: "1A", qual: "MBA",
    sub: "Client Services", joined: "2019-02-01", program: "Leadership Potential Assessment 2026",
    status: "submitted", submitted: "Mar 6, 2026", actions: 7, skills: 4 },
  { id: "sofia", first: "Sofia", last: "Marchetti", initials: "SM", role: "Data Analyst", email: "sofia.marchetti@marsh.com",
    dept: "Analytics", entity: "Star Trek Inc.", level: "Professional", grade: "3A", qual: "BSc Statistics",
    sub: "Analytics", joined: "2023-06-19", program: "360° Perspective Feedback",
    status: "approved", submitted: "Feb 24, 2026", actions: 6, skills: 3 },
  { id: "haruto", first: "Haruto", last: "Tanaka", initials: "HT", role: "Operations Lead", email: "haruto.tanaka@marsh.com",
    dept: "Operations", entity: "Star Trek Inc.", level: "Management", grade: "1B", qual: "BEng",
    sub: "Operations", joined: "2020-11-02", program: "Leadership Potential Assessment 2026",
    status: "changes", submitted: "Mar 1, 2026", actions: 8, skills: 4 },
  { id: "lena", first: "Lena", last: "Fischer", initials: "LF", role: "Risk Specialist", email: "lena.fischer@marsh.com",
    dept: "Risk", entity: "Star Trek Inc.", level: "Professional", grade: "2A", qual: "MSc Risk Management",
    sub: "Risk Advisory", joined: "2022-04-25", program: "Leadership Potential Assessment 2026",
    status: "draft", submitted: null, actions: 4, skills: 2 },
  { id: "omar", first: "Omar", last: "Haddad", initials: "OH", role: "Consultant", email: "omar.haddad@marsh.com",
    dept: "Advisory", entity: "Star Trek Inc.", level: "Professional", grade: "3B", qual: "BA Economics",
    sub: "Advisory", joined: "2024-01-08", program: "Leadership Potential Assessment 2026",
    status: "none", submitted: null, actions: 0, skills: 0 },
];

// Status chips read the way the live product does: an outlined pill per state.
const MGR_STATUS = {
  submitted: { label: "Pending", color: "#B4770A", bg: "rgba(255,191,0,.10)", border: "rgba(203,126,3,.45)" },
  approved: { label: "Approved", color: eSUCCESS, bg: "rgba(20,133,61,.08)", border: "rgba(20,133,61,.40)" },
  changes: { label: "Changes requested", color: "var(--danger)", bg: "rgba(197,53,50,.07)", border: "rgba(197,53,50,.38)" },
  draft: { label: "Draft", color: eMUT, bg: "rgba(0,15,71,.04)", border: eLINE },
  none: { label: "Not started", color: eMUT, bg: "rgba(0,15,71,.04)", border: eLINE },
};

// Each person's plan: the shared seed, trimmed so team members differ a little.
function mgrPlanFor(p) {
  const seed = (window.EdPlan && window.EdPlan.SEED) || [];
  const clone = (window.EdPlan && window.EdPlan.clone) || ((x) => JSON.parse(JSON.stringify(x)));
  const data = clone(seed);
  let skillBudget = p.skills;
  const out = [];
  data.forEach((cat) => {
    const keep = [];
    cat.skills.forEach((s) => { if (skillBudget > 0) { keep.push(s); skillBudget -= 1; } });
    if (keep.length) out.push({ ...cat, skills: keep });
  });
  // give the plan some lived-in progress
  let i = 0;
  out.forEach((c) => c.skills.forEach((s) => {
    s.rating = ((i + 3) % 5) + 1;
    s.actions.forEach((a) => {
      a.start = ["2026-04-06", "2026-05-11", "2026-06-01"][i % 3];
      a.end = ["2026-06-30", "2026-08-14", "2026-09-30"][i % 3];
      a.completion = p.status === "approved" ? [40, 65, 20][i % 3] : [0, 25, 10][i % 3];
      i += 1;
    });
  }));
  return out;
}

// ── small shared bits ──
const MgrBadge = ({ status }) => {
  const s = MGR_STATUS[status] || MGR_STATUS.none;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", background: s.bg, color: s.color, border: "1px solid " + s.border, fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, padding: "3px 11px", borderRadius: 6, whiteSpace: "nowrap" }}>
      {s.label}
    </span>
  );
};

const MgrAvatar = ({ p, size = 42 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: "var(--surface-deep)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--sans)", fontSize: Math.round(size / 3), fontWeight: 700, flexShrink: 0 }}>{p.initials}</div>
);

// ── employee details card — shown here because the manager needs the context ──
function MgrPersonCard({ p }) {
  const fields = [
    ["Sub Function", p.sub], ["Entity", p.entity], ["Job Level", p.level],
    ["Grade", p.grade], ["Qualification", p.qual], ["Department", p.dept],
    ["Date of Joining Entity", p.joined], ["Program", p.program],
  ];
  return (
    <div style={{ background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 16, padding: "16px 20px", marginBottom: 22, display: "flex", gap: 20, flexWrap: "wrap", alignItems: "stretch", boxShadow: "0 1px 2px rgba(0,15,71,.04)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 13, flex: "0 0 auto", paddingRight: 20, borderRight: "1px solid " + eLINE, minWidth: 200 }}>
        <MgrAvatar p={p} size={46} />
        <div style={{ lineHeight: 1.35 }}>
          <div style={{ fontFamily: "var(--sans)", fontSize: 15.5, fontWeight: 700, color: eMID }}>{p.first} {p.last}</div>
          <div style={{ fontFamily: "var(--sans)", fontSize: 12.5, fontWeight: 600, color: "var(--accent)" }}>{p.role}</div>
          <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: eMUT }}>{p.email}</div>
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 260, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "10px 22px", alignContent: "center" }}>
        {fields.map(([k, v]) => (
          <div key={k}>
            <div style={{ fontFamily: "var(--sans)", fontSize: 11.5, fontWeight: 500, color: eMUT, marginBottom: 1 }}>{k}</div>
            <div style={{ fontFamily: "var(--sans)", fontSize: 13.5, fontWeight: 600, color: eMID }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
//  1 · MY DIRECT REPORTS — the manager's list, with bulk approve
// ════════════════════════════════════════════════
function MgrTeamList({ team, onOpen, onCreate, onBulkApprove, showToast }) {
  const [sel, setSel] = mgUseState({});
  const approvable = team.filter((p) => p.status === "submitted");
  const selIds = Object.keys(sel).filter((k) => sel[k]);
  const allOn = approvable.length > 0 && approvable.every((p) => sel[p.id]);
  const toggleAll = () => {
    if (allOn) { setSel({}); return; }
    const n = {}; approvable.forEach((p) => { n[p.id] = true; }); setSel(n);
  };
  const cell = { fontFamily: "var(--sans)", fontSize: 13.5, fontWeight: 600, color: eMUT };
  const box = (on, onChange, disabled) => (
    <input type="checkbox" checked={!!on} disabled={disabled} onChange={onChange} onClick={(e) => e.stopPropagation()}
      style={{ width: 16, height: 16, accentColor: "var(--accent)", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? .35 : 1, flexShrink: 0 }} />
  );

  return (
    <div style={{ maxWidth: "var(--content-max)", margin: "36px var(--fol-mx) 72px", padding: 0 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <h1 style={{ fontFamily: "var(--sans)", fontSize: 22, fontWeight: 700, color: eMID, margin: 0 }}>My Direct Reports</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <EdBtn onClick={onCreate}><I.plus size={15} /> Create a plan</EdBtn>
          <EdBtn primary disabled={!selIds.length} onClick={() => { onBulkApprove(selIds); showToast(selIds.length + (selIds.length === 1 ? " plan approved" : " plans approved")); setSel({}); }}>Approve</EdBtn>
        </div>
      </div>

      <div style={{ background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 14, overflow: "hidden" }}>
        {/* column header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", borderBottom: "1px solid " + eLINE }}>
          {box(allOn, toggleAll, !approvable.length)}
          <div style={{ ...cell, flex: 1, minWidth: 0 }}>Users</div>
          <div style={{ ...cell, width: 150, flexShrink: 0 }}>Status</div>
          <div style={{ ...cell, width: 74, flexShrink: 0, textAlign: "right" }}>Action</div>
        </div>

        {team.map((p, i) => (
          <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 20px", borderTop: i ? "1px solid " + eLINE : "none", transition: "background .15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,15,71,.015)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
            {box(sel[p.id], () => setSel((s) => ({ ...s, [p.id]: !s[p.id] })), p.status !== "submitted")}
            <div style={{ display: "flex", alignItems: "center", gap: 13, flex: 1, minWidth: 0 }}>
              <MgrAvatar p={p} size={40} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: 14.5, fontWeight: 700, color: eMID, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.first} {p.last}</div>
                <div style={{ fontFamily: "var(--sans)", fontSize: 13.5, color: eMUT, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.email}</div>
              </div>
            </div>
            <div style={{ width: 150, flexShrink: 0 }}><MgrBadge status={p.status} /></div>
            <div style={{ width: 74, flexShrink: 0, textAlign: "right" }}>
              <button onClick={() => onOpen(p)}
                style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "var(--accent)", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600 }}>Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


// ════════════════════════════════════════════════
//  2 · PLAN REVIEW — the employee's plan, read-only, with a decision
// ════════════════════════════════════════════════
function MgrPlanReview({ person, onBack, onDecision, showToast }) {
  const [tab, setTab] = mgUseState("plan");
  const [note, setNote] = mgUseState("");
  const [confirm, setConfirm] = mgUseState(null);   // "approve" | "changes"
  const data = React.useMemo(() => mgrPlanFor(person), [person.id]);
  const LEARN = (window.EdPlan && window.EdPlan.LEARN) || {};
  const decided = person.status === "approved" || person.status === "changes";

  const bar = (pct, color) => (
    <div style={{ flex: 1, maxWidth: 200, height: 6, borderRadius: 3, background: "rgba(0,15,71,.08)", overflow: "hidden" }}>
      <div style={{ width: pct + "%", height: "100%", background: color, borderRadius: 3 }} />
    </div>
  );

  return (
    <div style={{ maxWidth: "var(--content-max)", margin: "36px var(--fol-mx) 72px", padding: 0 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <h1 style={{ fontFamily: "var(--sans)", fontSize: 22, fontWeight: 700, color: eMID, margin: 0 }}>{person.first} {person.last}, Development Plan</h1>
          <MgrBadge status={person.status} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button title="Download" style={{ width: 38, height: 38, borderRadius: 9, border: "1px solid " + eLINE, background: "var(--card)", color: eMID, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><I.download size={17} /></button>
        </div>
      </div>

      {/* the employee's details — the card the employee's own view hides */}
      <div style={{ marginTop: 22 }}><MgrPersonCard p={person} /></div>

      <div className="ed-tabs" style={{ display: "flex", alignItems: "center", gap: 2, borderBottom: "1px solid " + eLINE, marginBottom: 26 }}>
        {[["plan", "Plan"], ["report", "Program Report"], ["reflect", "Reflective Questions"]].map(([k, l]) => {
          const on = tab === k;
          return <button key={k} onClick={() => setTab(k)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--sans)", fontSize: 14, fontWeight: on ? 700 : 500, color: on ? eMID : eMUT, padding: "10px 18px", borderBottom: "2px solid " + (on ? eMID : "transparent"), marginBottom: -1, transition: "color .15s" }}>{l}</button>;
        })}
      </div>

      {tab !== "plan" ? (
        <div style={{ background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 14, padding: "40px 24px", textAlign: "center", fontFamily: "var(--sans)", fontSize: 15, color: eMUT }}>
          {tab === "report" ? "The program report for " + person.first + " opens here." : person.first + "'s reflective answers appear here once submitted."}
        </div>
      ) : (
        <React.Fragment>
          {data.map((cat, ci) => (
            <div key={ci} style={{ marginTop: ci ? 30 : 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 18 }}>
                <div style={{ width: 46, height: 46, borderRadius: 23, background: "rgba(0,15,71,.06)", color: eMID, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{React.createElement(I[cat.icon] || I.bulb, { size: 22 })}</div>
                <h2 style={{ fontFamily: "var(--sans)", fontSize: 21, fontWeight: 700, color: eMID, margin: 0 }}>{cat.cat}</h2>
              </div>
              {cat.skills.map((skill, si) => (
                <div key={si} style={{ marginBottom: 22 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", padding: "6px 0 14px" }}>
                    <h3 style={{ fontFamily: "var(--sans)", fontSize: 17, fontWeight: 700, color: eMID, margin: 0 }}>{skill.name}</h3>
                    <span style={{ display: "inline-flex", gap: 3 }}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <svg key={n} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ color: n <= skill.rating ? "var(--action)" : "rgba(0,15,71,.18)" }}><path d="M12 2l2.9 6.3 6.8.7-5.1 4.6 1.5 6.7L12 17.9 5.9 20.3l1.5-6.7L2.3 9l6.8-.7z" /></svg>
                      ))}
                    </span>
                    <span style={{ fontFamily: "var(--sans)", fontSize: 13, color: eMUT }}>{skill.isPublic ? "Shared with you" : "Private to employee"}</span>
                  </div>
                  <div style={{ background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 12, padding: "2px 16px" }}>
                    {skill.actions.map((a, ai) => {
                      const m = LEARN[a.mix] || { label: "", color: eMID };
                      return (
                        <div key={a.id} style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "14px 2px", borderTop: ai ? "1px solid " + eLINE : "none", flexWrap: "wrap" }}>
                          <span style={{ marginTop: 6, width: 8, height: 8, borderRadius: 4, background: m.color, flexShrink: 0 }} />
                          <div style={{ flex: "1 1 240px", minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
                              <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: eMID }}>{a.title}</div>
                              <span style={{ fontFamily: "var(--sans)", fontSize: 12, fontWeight: 700, color: m.color, background: "color-mix(in srgb, " + m.color + " 12%, transparent)", borderRadius: 20, padding: "2px 9px" }}>{a.mix}% · {m.label}</span>
                            </div>
                            <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, lineHeight: 1.45, marginTop: 3 }}>{a.desc}</div>
                          </div>
                          <div style={{ width: 168, flexShrink: 0 }}>
                            <div style={{ fontFamily: "var(--sans)", fontSize: 11, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", color: eMUT, marginBottom: 6 }}>Start – End date</div>
                            <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eMID }}>{a.start && a.end ? a.start + " → " + a.end : "Not set"}</div>
                          </div>
                          <div style={{ width: 160, flexShrink: 0 }}>
                            <div style={{ fontFamily: "var(--sans)", fontSize: 11, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", color: eMUT, marginBottom: 6 }}>Completion</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                              {bar(a.completion || 0, (a.completion || 0) >= 50 ? eSUCCESS : "var(--action)")}
                              <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eMID }}>{a.completion || 0}%</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* the decision */}
          <div style={{ background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 16, padding: "22px 24px", marginTop: 34 }}>
            <h2 style={{ fontFamily: "var(--sans)", fontSize: 18, fontWeight: 700, color: eMID, margin: "0 0 6px" }}>Your decision</h2>
            <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, lineHeight: 1.6, margin: "0 0 14px" }}>
              {decided ? "You've already responded to this plan. Your note is shared with " + person.first + "." : "Approve the plan, or send it back with a note on what should change. " + person.first + " will be notified either way."}
            </p>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder={"Add a note for " + person.first + "…"}
              style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 10, border: "1.5px solid " + eLINE, fontSize: 14, resize: "vertical", outline: "none", fontFamily: "var(--sans)", color: eINK, lineHeight: 1.6, marginBottom: 16 }} />
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
              <button onClick={() => setConfirm("changes")}
                style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: "var(--danger)", background: "var(--card)", border: "1px solid var(--danger)", borderRadius: 10, padding: "12px 18px", cursor: "pointer" }}>Request changes</button>
              <EdBtn primary onClick={() => setConfirm("approve")}><I.check size={15} /> Approve plan</EdBtn>
            </div>
          </div>
        </React.Fragment>
      )}

      {confirm && (
        <div onClick={() => setConfirm(null)} style={{ position: "fixed", inset: 0, zIndex: 80, background: "rgba(0,15,71,.4)", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 18, padding: 28, maxWidth: 420, width: "100%", boxShadow: "0 24px 60px rgba(0,15,71,.3)" }}>
            <h2 className="serif" style={{ fontSize: 24, color: eMID, lineHeight: 1.12, margin: "0 0 8px" }}>
              {confirm === "approve" ? "Approve this plan?" : "Send the plan back?"}
            </h2>
            <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.6, margin: "0 0 20px" }}>
              {confirm === "approve"
                ? person.first + " will be notified that their development plan is approved and can start tracking progress."
                : person.first + " will be able to edit the plan again and resubmit it for your approval."}
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <EdBtn onClick={() => setConfirm(null)}>Cancel</EdBtn>
              <EdBtn primary onClick={() => {
                onDecision(person.id, confirm === "approve" ? "approved" : "changes");
                setConfirm(null);
                showToast(confirm === "approve" ? "Plan approved — " + person.first + " has been notified" : "Sent back to " + person.first + " with your note");
                onBack();
              }}>{confirm === "approve" ? "Yes, approve" : "Yes, send back"}</EdBtn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════
//  3 · CREATE A PLAN — pick the person, then run the same guided flow
// ════════════════════════════════════════════════
function MgrCreate({ team, onBack, onLaunch }) {
  const [sel, setSel] = mgUseState(null);
  return (
    <div style={{ maxWidth: "var(--content-max)", margin: "36px var(--fol-mx) 72px", padding: 0 }}>
      <h1 className="serif" style={{ fontSize: 40, color: eMID, lineHeight: 1.08, margin: "0 0 8px" }}>Create a development plan</h1>
      <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.6, margin: "0 0 26px" }}>Choose a team member and the AI coach will build a plan with you, using their assessment insights. They can refine it before it becomes final.</p>

      <div style={{ fontFamily: "var(--sans)", fontSize: 12, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", color: eMUT, marginBottom: 12 }}>Who is this plan for?</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12, marginBottom: 28 }}>
        {team.map((p) => {
          const on = sel === p.id;
          return (
            <button key={p.id} onClick={() => setSel(p.id)}
              style={{ display: "flex", alignItems: "center", gap: 12, textAlign: "left", background: on ? "color-mix(in srgb, var(--accent) 6%, transparent)" : "var(--card)", border: "1.5px solid " + (on ? "var(--accent)" : eLINE), borderRadius: 14, padding: "14px 16px", cursor: "pointer", transition: "border-color .15s, background .15s" }}>
              <MgrAvatar p={p} size={38} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: 14.5, fontWeight: 700, color: eMID }}>{p.first} {p.last}</div>
                <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: eMUT }}>{p.role}</div>
              </div>
              {on && <span style={{ color: "var(--accent)", display: "flex" }}><I.check size={18} /></span>}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <EdBtn onClick={onBack}>Cancel</EdBtn>
        <EdBtn primary disabled={!sel} onClick={() => sel && onLaunch(team.find((t) => t.id === sel))}>Start the guided plan <I.arrow size={15} /></EdBtn>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
//  SHELL — rail + top bar, matching the employee workspace
// ════════════════════════════════════════════════
function LHManager() {
  const [route, setRoute] = mgUseState({ page: "team", person: null });
  const [team, setTeam] = mgUseState(MGR_TEAM);
  const [toast, setToast] = mgUseState(null);
  const [collapsed, setCollapsed] = mgUseState(false);
  const [pageBack, setPageBack] = mgUseState(null);
  const showToast = (m) => { setToast(m); setTimeout(() => setToast(null), 2800); };
  const bulkApprove = (ids) => setTeam((t) => t.map((p) => ids.indexOf(p.id) !== -1 ? { ...p, status: "approved" } : p));
  const decide = (id, status) => setTeam((t) => t.map((p) => p.id === id ? { ...p, status, submitted: p.submitted || "Mar 8, 2026" } : p));

  mgUseEffect(() => { window.scrollTo(0, 0); const c = document.querySelector(".ed-content"); if (c) c.scrollTop = 0; }, [route]);

  // Mirrors the employee rail — Development just gains "My Direct Reports".
  const NAV = [
    { id: "home", label: "Dashboard", icon: "home", muted: true },
    { id: "dev", label: "Development", icon: "book", group: true, children: [
      { id: "myplan", label: "My Plan", muted: true },
      { id: "team", label: "My Direct Reports" },
    ] },
    { id: "scheduling", label: "Scheduling", icon: "cal", muted: true },
    { id: "insights", label: "Insights", icon: "chart", muted: true },
    { id: "profile", label: "My profile", icon: "user", muted: true },
  ];

  const topBack = route.page === "review" ? { label: "My Direct Reports", onClick: () => setRoute({ page: "team", person: null }) }
    : route.page === "create" ? { label: "My Direct Reports", onClick: () => setRoute({ page: "team", person: null }) }
    : pageBack;

  let content;
  if (route.page === "review" && route.person) {
    const p = team.find((t) => t.id === route.person.id) || route.person;
    content = <MgrPlanReview person={p} onBack={() => setRoute({ page: "team", person: null })} onDecision={decide} showToast={showToast} />;
  } else if (route.page === "create") {
    content = <MgrCreate team={team} onBack={() => setRoute({ page: "team", person: null })} onLaunch={(p) => { showToast("Starting a plan for " + p.first + " " + p.last); setRoute({ page: "team", person: null }); }} />;
  } else {
    content = <MgrTeamList team={team} onOpen={(p) => setRoute({ page: "review", person: p })} onCreate={() => setRoute({ page: "create", person: null })} onBulkApprove={bulkApprove} showToast={showToast} />;
  }

  return (
    <div className="ed-shell" style={{ display: "flex", minHeight: "100vh", background: "var(--canvas)" }}>
      {/* rail */}
      {/* sticky full-height rail — stays put while the page scrolls, as in the employee shell */}
      <aside style={{ width: collapsed ? 76 : 256, flexShrink: 0, background: "var(--surface-deep)", display: "flex", flexDirection: "column", transition: "width .2s", position: "sticky", top: 0, height: "100vh", alignSelf: "flex-start" }}>
        <div style={{ padding: collapsed ? "22px 0 18px" : "22px 22px 18px", display: "flex", justifyContent: collapsed ? "center" : "flex-start" }}>
          <span className="serif" style={{ color: "#fff", fontSize: collapsed ? 22 : 19, letterSpacing: ".01em" }}>{collapsed ? "M" : "Marsh Lighthouse"}</span>
        </div>
        <div style={{ padding: collapsed ? "0 10px" : "0 14px", display: "flex", flexDirection: "column", gap: 4, flex: 1, overflowY: "auto" }}>
          {NAV.map((n) => {
            const Ic = I[n.icon] || I.users;
            if (n.group) {
              return (
                <React.Fragment key={n.id}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: collapsed ? "center" : "flex-start", padding: collapsed ? "12px 0" : "11px 13px", color: "rgba(255,255,255,.9)", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600 }}>
                    <Ic size={18} />{!collapsed && n.label}
                  </div>
                  {!collapsed && n.children.map((c) => {
                    const on = route.page === c.id || (c.id === "team" && route.page === "review");
                    return (
                      <button key={c.id} onClick={() => { if (!c.muted) setRoute({ page: c.id, person: null }); }} title={c.muted ? c.label + " (employee view)" : c.label}
                        style={{ display: "flex", alignItems: "center", gap: 10, textAlign: "left", background: on ? "rgba(206,236,255,.16)" : "transparent", border: "none", borderLeft: "2px solid " + (on ? "var(--sky-surface, #CEECFF)" : "transparent"), borderRadius: on ? 8 : 0, padding: "9px 13px 9px 30px", cursor: c.muted ? "default" : "pointer", color: on ? "#fff" : "rgba(255,255,255," + (c.muted ? ".42" : ".72") + ")", fontFamily: "var(--sans)", fontSize: 13.5, fontWeight: on ? 700 : 500 }}>
                        {c.label}
                      </button>
                    );
                  })}
                </React.Fragment>
              );
            }
            const on = route.page === n.id;
            return (
              <button key={n.id} onClick={() => { if (!n.muted) setRoute({ page: n.id, person: null }); }} title={n.muted ? n.label + " (employee view)" : n.label}
                style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: collapsed ? "center" : "flex-start", background: on ? "rgba(206,236,255,.14)" : "transparent", border: "none", borderRadius: 10, padding: collapsed ? "12px 0" : "11px 13px", cursor: n.muted ? "default" : "pointer", color: on ? "#fff" : "rgba(255,255,255," + (n.muted ? ".42" : ".72") + ")", fontFamily: "var(--sans)", fontSize: 14, fontWeight: on ? 700 : 500 }}>
                <Ic size={18} />{!collapsed && n.label}
              </button>
            );
          })}
        </div>
        <div style={{ padding: collapsed ? "14px 10px 18px" : "14px 16px 18px", borderTop: "1px solid rgba(255,255,255,.12)", display: "flex", alignItems: "center", gap: 11, justifyContent: collapsed ? "center" : "flex-start" }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(206,236,255,.18)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--sans)", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>PS</div>
          {!collapsed && (
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: "var(--sans)", fontSize: 13.5, fontWeight: 700, color: "#fff" }}>Priya Sharma</div>
              <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: "rgba(255,255,255,.6)" }}>People Manager</div>
            </div>
          )}
        </div>
        <button onClick={() => setCollapsed((v) => !v)} title={collapsed ? "Expand menu" : "Collapse menu"}
          style={{ position: "absolute", top: 26, right: -13, width: 26, height: 26, borderRadius: "50%", background: "#fff", border: "1px solid " + eLINE, color: eMID, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,15,71,.15)" }}>
          <I.chevR size={14} style={{ transform: collapsed ? "none" : "rotate(180deg)" }} />
        </button>
      </aside>

      {/* main */}
      <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <div className="ed-topbar" style={{ position: "sticky", top: 0, zIndex: 40, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, minHeight: 58, boxSizing: "border-box", padding: "10px var(--fol-px, 56px)", background: "var(--canvas)", borderBottom: "1px solid " + eLINE }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0 }}>
            {topBack && (
              <button onClick={topBack.onClick} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "none", border: "none", padding: "4px 0", color: eMID, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                <I.chevL size={17} />{topBack.label}
              </button>
            )}
          </div>
          <span style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: eMUT, background: "rgba(0,15,71,.05)", padding: "5px 12px", borderRadius: 999 }}>Manager view</span>
        </div>
        <div className="ed-content" style={{ padding: "0 var(--fol-px, 56px)", flex: 1 }}>{content}</div>
      </main>

      {toast && (
        <div style={{ position: "fixed", left: "50%", bottom: 28, transform: "translateX(-50%)", zIndex: 90, background: eMID, color: "#fff", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, padding: "11px 18px", borderRadius: 10, boxShadow: "0 10px 30px rgba(0,15,71,.28)", display: "inline-flex", alignItems: "center", gap: 8 }}>
          <I.check size={16} /> {toast}
        </div>
      )}
    </div>
  );
}

window.LHManager = LHManager;
