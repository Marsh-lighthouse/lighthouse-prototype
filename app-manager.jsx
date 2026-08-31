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
//  status: notstarted | pending | approved | rejected  (draft reads as Not Started)
const MGR_TEAM = [
  { id: "john", sub: "Product Management", entity: "Star Trek Inc.", level: "Management", grade: "1A", qual: "Masters in Business", dept: "Department A", joined: "2023-04-26", first: "John", last: "Doe", initials: "JD", role: "Product Management", email: "john.doe@marsh.com",
    linked: true, skills: 5,
    // Opens at Pending Approval so the review flow is there on a cold visit; the
    // moment the employee flow writes anything, the store takes over (syncSubmission).
    status: "pending", plan: "Leadership Potential Assessment 2026" },
  // Only John Doe is wired to the employee flow — everyone else sits at Not Started
  // so nothing on this screen pretends to be live when it isn't.
  { id: "amelia", sub: "Human Resources", entity: "Star Trek Inc.", level: "Professional", grade: "2B", qual: "MSc Organisational Psychology", dept: "Human Resources", joined: "2021-09-13", first: "Amelia", last: "Rahman", initials: "AR", role: "Senior Consultant", email: "amelia.rahman@marsh.com",
    skills: 4, status: "notstarted", plan: "Leadership Potential Assessment 2026" },
  { id: "daniel", sub: "Client Services", entity: "Star Trek Inc.", level: "Management", grade: "1A", qual: "MBA", dept: "Department B", joined: "2019-02-01", first: "Daniel", last: "Okafor", initials: "DO", role: "Client Manager", email: "daniel.okafor@marsh.com",
    skills: 3, status: "notstarted", plan: "Leadership Potential Assessment 2026" },
  { id: "sofia", sub: "Analytics", entity: "Star Trek Inc.", level: "Professional", grade: "3A", qual: "BSc Statistics", dept: "Analytics", joined: "2023-06-19", first: "Sofia", last: "Marchetti", initials: "SM", role: "Data Analyst", email: "sofia.marchetti@marsh.com",
    skills: 3, status: "approved", note: "Strong plan — the analytics actions are well scoped.", plan: "360° Perspective Feedback" },
  { id: "haruto", sub: "Operations", entity: "Star Trek Inc.", level: "Management", grade: "1B", qual: "BEng", dept: "Operations", joined: "2020-11-02", first: "Haruto", last: "Tanaka", initials: "HT", role: "Operations Lead", email: "haruto.tanaka@marsh.com",
    skills: 2, status: "notstarted", plan: "Leadership Potential Assessment 2026" },
  { id: "lena", sub: "Risk Advisory", entity: "Star Trek Inc.", level: "Professional", grade: "2A", qual: "MSc Risk Management", dept: "Risk", joined: "2022-04-25", first: "Lena", last: "Fischer", initials: "LF", role: "Risk Specialist", email: "lena.fischer@marsh.com",
    skills: 2, status: "notstarted", plan: "Leadership Potential Assessment 2026" },
];

// The manager's own record — drives the "My Plan" page under Development.
// Named to match the manager already speaking in the plan's comment threads, so the
// employee and manager views show one consistent person.
const MGR_ME = { id: "sarah", sub: "Product Management", entity: "Star Trek Inc.", level: "Management", grade: "1A",
  qual: "MBA", dept: "Department A", joined: "2018-08-06", first: "Sarah", last: "Mitchell", initials: "SM",
  role: "People Manager", email: "sarah.mitchell@marsh.com", skills: 4, status: "inprogress",
  plan: "Leadership Potential Assessment 2026" };

// The manager's four statuses. Colours come from the employee's palette
// (window.EdPlan.STATUS) so a status looks identical on both sides.
//   notstarted — nothing has reached the manager yet (incl. a plan still in Draft)
//   pending    — submitted, waiting on this manager
//   review     — the manager opened it for review; now they must decide
//   approved / rejected — the manager has ruled
const MGR_NORM = (st) => (st === "draft" || st === "notstarted" ? "notstarted"
  : st === "pending" || st === "review" || st === "approved" || st === "rejected" ? st : "notstarted");
const MGR_TONE = (st) => {
  const P = (window.EdPlan && window.EdPlan.STATUS) || {};
  const s = P[MGR_NORM(st)];
  return s ? { label: s.label, color: s.color, bg: s.bg, icon: s.icon }
           : { label: "Not Started", color: eMUT, bg: "rgba(0,15,71,.06)", icon: null };
};
const MGR_DETAIL_TONE = (status) => { const t = MGR_TONE(status); return { color: t.color, background: t.bg }; };

// What the linked employee actually changed, diffed against the plan they started from.
function mgrChanges() {
  const P = window.EdPlan;
  if (!P || !P.diff || !P.loadPlan) return [];
  return P.diff(P.loadPlan(P.OWNER)) || [];
}

// Build a plan for a reportee from the shared seed, tagging what they changed.
function mgrPlanFor(p) {
  const seed = (window.EdPlan && window.EdPlan.SEED) || [];
  const clone = (window.EdPlan && window.EdPlan.clone) || ((x) => JSON.parse(JSON.stringify(x)));
  // The linked reportee's plan is the real thing the employee is editing — rows,
  // dates, completion, ratings and all. Everyone else gets a plan built from the seed.
  const live = p.linked && window.EdPlan && window.EdPlan.loadPlan && window.EdPlan.loadPlan(window.EdPlan.OWNER);
  if (live) {
    const out = clone(live);
    const bySkill = {};
    (p.changes || []).forEach((c) => { (bySkill[c.skill] = bySkill[c.skill] || []).push(c); });
    out.forEach((cat) => (cat.skills || []).forEach((s) => {
      const mine = bySkill[s.name] || [];
      s.changes = mine;
      s.edited = mine.length > 0;
      (s.actions || []).forEach((a) => {
        const hit = mine.find((c) => c.label === a.title);
        if (hit) a.badge = hit.kind === "added" ? "New" : "Edited";
      });
    }));
    return out;
  }
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
      a.completion = [100, 100, 0][i % 3];
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

// How the decision note (rejection reason / approval note) is surfaced — three options to compare.
const MGR_NOTE_DESIGNS = [
  { id: 1, label: "Popover", desc: "Icon by the status chip, opens the note" },
  { id: 2, label: "Note card", desc: "Quiet card above the plan" },
  { id: 3, label: "Inline banner", desc: "Tinted strip across the top of the plan" },
];
// Relative time for a decision that happened in this session.
function mgrWhen(ts) {
  if (!ts) return "";
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return m + (m === 1 ? " minute ago" : " minutes ago");
  const h = Math.floor(m / 60);
  if (h < 24) return h + (h === 1 ? " hour ago" : " hours ago");
  return new Date(ts).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

// Nothing to review yet — the reportee hasn't put any skills in their plan.
const MgrNoPlan = ({ name, what }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22, padding: "78px 20px 96px", textAlign: "center" }}>
    <svg width="132" height="116" viewBox="0 0 132 116" fill="none" aria-hidden="true">
      <ellipse className="mgr-empty-shadow" cx="60" cy="106" rx="40" ry="6" fill="rgba(0,15,71,.10)" />
      <g className="mgr-empty-art">
        <rect x="30" y="16" width="60" height="62" rx="6" fill="rgba(0,15,71,.07)" />
        <rect x="42" y="31" width="36" height="5" rx="2.5" fill="rgba(0,15,71,.16)" />
        <rect x="42" y="43" width="28" height="5" rx="2.5" fill="rgba(0,15,71,.12)" />
        <rect x="42" y="55" width="32" height="5" rx="2.5" fill="rgba(0,15,71,.12)" />
        <path d="M22 62h22a6 6 0 0 0 12 0h22v20a6 6 0 0 1-6 6H28a6 6 0 0 1-6-6z" fill="rgba(0,15,71,.13)" />
        <circle cx="102" cy="22" r="16" fill="rgba(0,15,71,.09)" />
        <path d="M94 42l4-8 6 3z" fill="rgba(0,15,71,.09)" />
        <circle className="mgr-empty-dot" style={{ animationDelay: "0s" }} cx="96" cy="22" r="2" fill="rgba(0,15,71,.42)" />
        <circle className="mgr-empty-dot" style={{ animationDelay: ".18s" }} cx="102" cy="22" r="2" fill="rgba(0,15,71,.42)" />
        <circle className="mgr-empty-dot" style={{ animationDelay: ".36s" }} cx="108" cy="22" r="2" fill="rgba(0,15,71,.42)" />
      </g>
    </svg>
    <div style={{ fontFamily: "var(--sans)", fontSize: 15.5, fontWeight: 500, color: eMUT, lineHeight: 1.5, maxWidth: 340 }}>
      {(name || "This reportee") + " has not " + (what || "added any skills") + " yet."}
    </div>
  </div>
);

// ════════════════════════════════════════════════
//  REFLECTIVE QUESTIONS — NOT surfaced in the manager.
//  Reflections are the owner's private space, so the manager has no tab for them.
//  Kept here (unused) because the read/edit view is ready if that ever changes.
// ════════════════════════════════════════════════
function MgrReflect({ person, showToast }) {
  const P = window.EdPlan || {};
  const QS = P.REFLECT_QS || [];
  const owner = person.linked ? P.OWNER : person.id;
  const [ans, setAns] = mgUseState(() => (P.loadReflect ? P.loadReflect(owner) : {}));
  const [editing, setEditing] = mgUseState(null);   // question index being edited
  const [draft, setDraft] = mgUseState("");
  mgUseEffect(() => {
    const sync = () => { if (P.loadReflect) setAns(P.loadReflect(owner)); };
    const ev = P.REFLECT_EVENT || "lh-reflect-change";
    window.addEventListener(ev, sync); window.addEventListener("storage", sync); window.addEventListener("focus", sync);
    return () => { window.removeEventListener(ev, sync); window.removeEventListener("storage", sync); window.removeEventListener("focus", sync); };
  }, [owner]);

  const answered = QS.some((it, i) => (ans[i] || "").trim());
  if (!answered) return <MgrNoPlan name={person.first + " " + person.last} what="answered the reflective questions" />;

  const save = (i) => {
    const next = { ...ans, [i]: draft };
    setAns(next);
    if (P.saveReflect) P.saveReflect(owner, next);
    setEditing(null);
    if (showToast) showToast("Reflection updated");
  };

  return (
    <div style={{ maxWidth: 820, marginTop: 24 }}>
      {QS.map((it, i) => {
        const text = (ans[i] || "").trim();
        const on = editing === i;
        return (
          <div key={i} style={{ marginBottom: 22, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 8 }}>
              <h3 style={{ flex: 1, minWidth: 0, fontFamily: "var(--sans)", fontSize: 15.5, fontWeight: 700, color: eMID, margin: 0, lineHeight: 1.45 }}>
                {it.q}{!it.req && <span style={{ fontFamily: "var(--sans)", fontSize: 12, fontWeight: 600, color: eMUT, background: "rgba(0,15,71,.05)", borderRadius: 6, padding: "2px 8px", marginLeft: 8 }}>Optional</span>}
              </h3>
              {!on && (
                <button onClick={() => { setEditing(i); setDraft(ans[i] || ""); }} title="Edit this answer"
                  style={{ flexShrink: 0, background: "none", border: "none", cursor: "pointer", color: eMUT, display: "flex", padding: 2 }}>
                  <I.edit size={16} />
                </button>
              )}
            </div>
            {on ? (
              <React.Fragment>
                <textarea autoFocus value={draft} onChange={(e) => setDraft(e.target.value)} rows={4}
                  style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 10, border: "1.5px solid " + eLINE, background: "var(--card)", fontSize: 14, resize: "vertical", outline: "none", fontFamily: "var(--sans)", color: eINK, lineHeight: 1.6 }} />
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 12 }}>
                  <button onClick={() => setEditing(null)}
                    style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eMID, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 10, padding: "8px 16px", cursor: "pointer" }}>Cancel</button>
                  <EdBtn primary small onClick={() => save(i)}>Save</EdBtn>
                </div>
              </React.Fragment>
            ) : (
              <div style={{ fontFamily: "var(--sans)", fontSize: 14.5, color: text ? eINK : eMUT, lineHeight: 1.65, whiteSpace: "pre-wrap" }}>
                {text || "Not answered."}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── small shared bits ──
const MgrBadge = ({ status }) => {
  const t = MGR_TONE(status);
  const Ic = t.icon && I[t.icon];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: t.bg, color: t.color, fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, padding: "4px 11px", borderRadius: 6, whiteSpace: "nowrap" }}>
      {Ic ? <Ic size={13} /> : null}{t.label}
    </span>
  );
};

const MgrTag = ({ kind }) => {
  const map = { Edited: { c: "#B4770A", b: "rgba(255,191,0,.16)" }, New: { c: eBLUE, b: "color-mix(in srgb, var(--accent) 12%, transparent)" } };
  const m = map[kind] || map.Edited;
  return <span style={{ background: m.b, color: m.c, fontFamily: "var(--sans)", fontSize: 12, fontWeight: 600, padding: "2px 8px", borderRadius: 6, whiteSpace: "nowrap" }}>{kind}</span>;
};

const MgrAvatar = ({ p, size = 42 }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: "rgba(0,15,71,.08)", color: eMUT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
    <I.user size={Math.round(size * 0.5)} />
  </div>
);


// ── reportee card — the same three layouts as the employee's user card ──
function MgrPersonCard({ p, design }) {
  const fields = [
    ["Sub Function", p.sub], ["Entity", p.entity], ["Job Level", p.level],
    ["Grade", p.grade], ["Qualification", p.qual], ["Department", p.dept],
    ["Date of Joining Entity", p.joined], ["Program", p.plan],
  ].filter(([, v]) => !!v);
  const lbl = { fontFamily: "var(--sans)", fontSize: 11.5, fontWeight: 500, color: eMUT, marginBottom: 1 };
  const val = { fontFamily: "var(--sans)", fontSize: 13.5, fontWeight: 600, color: eMID };
  const identity = (
    <div style={{ lineHeight: 1.35 }}>
      <div style={{ fontFamily: "var(--sans)", fontSize: 15.5, fontWeight: 700, color: eMID }}>{p.first} {p.last}</div>
      <div style={{ fontFamily: "var(--sans)", fontSize: 12.5, fontWeight: 600, color: "var(--accent)" }}>{p.role}</div>
      <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: eMUT }}>{p.email}</div>
    </div>
  );

  if (design === 2) {   // Minimal — just who it is: picture, name, email
    return (
      <div style={{ background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 16, padding: "16px 20px", marginBottom: 22, boxShadow: "0 1px 2px rgba(0,15,71,.04)", display: "flex", alignItems: "center", gap: 13 }}>
        <MgrAvatar p={p} size={46} />
        <div style={{ lineHeight: 1.35 }}>
          <div style={{ fontFamily: "var(--sans)", fontSize: 15.5, fontWeight: 700, color: eMID }}>{p.first} {p.last}</div>
          <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: eMUT }}>{p.email}</div>
        </div>
      </div>
    );
  }
  if (design === 3) {   // Hero panel
    return (
      <div style={{ background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 16, marginBottom: 22, overflow: "hidden", display: "flex", flexWrap: "wrap", boxShadow: "0 1px 2px rgba(0,15,71,.04)" }}>
        <div style={{ flex: "0 0 auto", minWidth: 210, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10, padding: "18px 22px", background: "color-mix(in srgb, var(--primary) 5%, transparent)", borderRight: "1px solid " + eLINE }}>
          <MgrAvatar p={p} size={52} />{identity}
        </div>
        <div style={{ flex: 1, minWidth: 260, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px 24px", alignContent: "center", padding: "18px 22px" }}>
          {fields.map(([k, v]) => <div key={k}><div style={lbl}>{k}</div><div style={val}>{v}</div></div>)}
        </div>
      </div>
    );
  }
  // Divided (default)
  return (
    <div style={{ background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 16, padding: "16px 20px", marginBottom: 22, display: "flex", gap: 20, flexWrap: "wrap", alignItems: "stretch", boxShadow: "0 1px 2px rgba(0,15,71,.04)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 13, flex: "0 0 auto", paddingRight: 20, borderRight: "1px solid " + eLINE, minWidth: 200 }}>
        <MgrAvatar p={p} size={46} />{identity}
      </div>
      <div style={{ flex: 1, minWidth: 260, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "10px 22px", alignContent: "center" }}>
        {fields.map(([k, v]) => <div key={k}><div style={lbl}>{k}</div><div style={val}>{v}</div></div>)}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
//  1 · DIRECT REPORTEES — the list
// ════════════════════════════════════════════════
function MgrList({ team, onOpen, onSummary }) {
  const head = { fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eMID };
  return (
    <div style={{ maxWidth: "var(--content-max)", margin: "32px var(--fol-mx) 72px", padding: 0 }}>
      <h1 style={{ fontFamily: "var(--sans)", fontSize: 22, fontWeight: 700, color: eMID, margin: "0 0 6px" }}>Direct Reportees</h1>
      {/* running total, the same line the assessor flow puts under its list headings */}
      <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, marginBottom: 14 }}>Total : <b style={{ color: eMID }}>{team.length}</b></div>

      <div style={{ background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 14, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 22px", borderBottom: "1px solid " + eLINE }}>
          <div style={{ ...head, flex: 1, minWidth: 0 }}>Users</div>
          <div style={{ ...head, width: 160, flexShrink: 0 }}>Status</div>
          <div style={{ ...head, width: 130, flexShrink: 0 }}>Actions</div>
        </div>

        {/* the whole row opens the reportee — the chevron is the affordance, as in the assessor tables */}
        {team.map((p, i) => (
          <div key={p.id} className="mgr-row" role="button" tabIndex={0}
            onClick={() => onOpen(p)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(p); } }}
            style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 22px", borderTop: i ? "1px solid " + eLINE : "none", cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0 }}>
              <MgrAvatar p={p} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: 14.5, fontWeight: 700, color: eMID, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.first} {p.last}</div>
                <div style={{ fontFamily: "var(--sans)", fontSize: 13.5, color: eMUT, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.email}</div>
              </div>
            </div>
            <div style={{ width: 160, flexShrink: 0 }}><MgrBadge status={p.status} /></div>
            <div style={{ width: 130, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              {/* The link is tied to there being changes, not to a status: what the
                  reportee altered is worth reading while reviewing and after deciding. */}
              {(p.changes || []).length > 0 ? (
                <button onClick={(e) => { e.stopPropagation(); onSummary(p); }} className="mgr-link"
                  style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "var(--accent)", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600 }}>Summary</button>
              ) : <span />}
              <span style={{ color: eMUT, display: "flex", flexShrink: 0 }}><I.chevR size={17} /></span>
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
  const total = (person.changes || []).length;
  return (
    <React.Fragment>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 85, background: "rgba(0,15,71,.28)" }} />
      <aside style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(460px, 92vw)", zIndex: 86, background: "var(--card)", boxShadow: "-18px 0 50px rgba(0,15,71,.20)", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "20px 24px", borderBottom: "1px solid " + eLINE }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontFamily: "var(--sans)", fontSize: 16.5, fontWeight: 700, color: eMID, margin: 0 }}>Change summary</h2>
            <div style={{ fontFamily: "var(--sans)", fontSize: 13.5, color: eMUT, marginTop: 2 }}>
              {person.first} {person.last} · {total} {total === 1 ? "change" : "changes"}
            </div>
          </div>
          <button onClick={onClose} title="Close" style={{ background: "none", border: "none", cursor: "pointer", color: eMUT, display: "flex", padding: 2, flexShrink: 0 }}><I.plus size={19} style={{ transform: "rotate(45deg)" }} /></button>
        </div>

        {/* one line per change, grouped by skill — no boilerplate, no repeated tags */}
        <div style={{ flex: 1, overflowY: "auto", padding: "18px 24px" }}>
          {total === 0 && (
            <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, lineHeight: 1.6, padding: "8px 0" }}>
              {person.first} hasn't changed anything since the plan was created.
            </div>
          )}
          {Object.keys(groups).map((skill) => (
            <div key={skill} style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 700, color: eMUT, marginBottom: 8 }}>{skill}</div>
              {groups[skill].map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 10, padding: "7px 0", borderTop: i ? "1px solid " + eLINE : "none" }}>
                  <span style={{ flexShrink: 0, width: 64, fontFamily: "var(--sans)", fontSize: 12, fontWeight: 600, color: c.kind === "added" ? eBLUE : c.kind === "removed" ? "var(--danger)" : "#B4770A" }}>{c.kind === "added" ? "Added" : c.kind === "removed" ? "Removed" : "Edited"}</span>
                  <span style={{ fontFamily: "var(--sans)", fontSize: 14.5, color: eINK, lineHeight: 1.45 }}>
                    {c.label}
                    {c.scope === "skill" && <span style={{ color: eMUT, fontSize: 13 }}> · whole skill</span>}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Same gate as the plan screen: a decision only becomes available once the
            review has actually been started, and never again after it's been taken. */}
        <div style={{ borderTop: "1px solid " + eLINE, padding: "18px 26px", display: "flex", alignItems: "center", gap: 10, justifyContent: "flex-end" }}>
          {person.status === "pending" && (
            <EdBtn primary onClick={() => onDecide("review")}><I.eye size={15} /> Start Review</EdBtn>
          )}
          {person.status === "review" && (
            <React.Fragment>
              <button onClick={() => onDecide("rejected")} style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eMID, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 10, padding: "10px 20px", cursor: "pointer" }}>Reject</button>
              <EdBtn primary onClick={() => onDecide("approved")}>Approve</EdBtn>
            </React.Fragment>
          )}
          {(person.status === "approved" || person.status === "rejected") && (
            <div style={{ fontFamily: "var(--sans)", fontSize: 13.5, color: eMUT }}>
              Already {person.status === "approved" ? "approved" : "rejected"} — open the plan to review the decision.
            </div>
          )}
          {person.status !== "pending" && person.status !== "review" && person.status !== "approved" && person.status !== "rejected" && (
            <div style={{ fontFamily: "var(--sans)", fontSize: 13.5, color: eMUT }}>
              {person.first} hasn't submitted this plan for approval yet.
            </div>
          )}
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
        style={{ width: "100%", boxSizing: "border-box", padding: "11px 13px", borderRadius: 10, border: "1px solid " + eLINE, fontSize: 14, resize: "vertical", outline: "none", fontFamily: "var(--sans)", color: eINK, lineHeight: 1.5, marginBottom: 14 }} />
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <EdBtn primary disabled={isReject && !text.trim()} onClick={() => onSubmit(text.trim())}>Submit</EdBtn>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
//  3 · DIRECT REPORTEES DETAIL — the plan, with the decision
// ════════════════════════════════════════════════
function MgrDetail({ person, onBack, onDecide, showToast, self }) {
  const [tab, setTab] = mgUseState("plan");
  const [pop, setPop] = mgUseState(null);          // "approved" | "rejected"
  const [showReason, setShowReason] = mgUseState(false);
  // How the decision note is presented — 3 (inline) by default, same as the employee view.
  const [noteDesign, setNoteDesign] = mgUseState(() => { const v = parseInt(localStorage.getItem("mgr-reject-note"), 10); return v >= 1 && v <= 3 ? v : 3; });
  const [noteMenu, setNoteMenu] = mgUseState(false);
  // ── comments: the same panel and the same threads the employee sees ──
  const Comments = window.EdPlan && window.EdPlan.Comments;
  const threadsFor = (window.EdPlan && window.EdPlan.threadsFor) || (() => ({}));
  const [comments, setComments] = mgUseState(null);   // skill name, "" for the inbox, null = closed
  const owner = self ? "self" : person.id;
  const [threadTick, setThreadTick] = mgUseState(0);
  mgUseEffect(() => {
    const ev = (window.EdPlan && window.EdPlan.THREAD_EVENT) || "lh-threads-change";
    const bump = () => setThreadTick((n) => n + 1);
    window.addEventListener(ev, bump); window.addEventListener("storage", bump); window.addEventListener("focus", bump);
    return () => { window.removeEventListener(ev, bump); window.removeEventListener("storage", bump); window.removeEventListener("focus", bump); };
  }, []);
  // A skill is unread for the manager when the employee had the last word.
  const unreadSkills = React.useMemo(() => {
    const store = threadsFor(owner) || {};
    return Object.keys(store).filter((k) => {
      const flat = (store[k] || []).flatMap((c) => [c, ...(c.replies || [])]);
      const last = flat[flat.length - 1];
      return last && last.who !== "mgr";
    });
  }, [owner, threadTick]);
  const anyUnread = unreadSkills.length > 0;
  // same rule as the employee plan: only push the page when the column still fits
  const pushRoom = (window.EdPlan && window.EdPlan.usePushRoom) ? window.EdPlan.usePushRoom(comments) : false;
  // opening a skill's thread brings that section into view, as on the employee side
  mgUseEffect(() => {
    if (!comments) return;
    const sel = "[data-skill=\"" + (typeof CSS !== "undefined" && CSS.escape ? CSS.escape(comments) : comments) + "\"]";
    const el = document.querySelector(sel);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [comments]);
  // while the panel covers the right edge, shift the floating chrome left
  mgUseEffect(() => {
    const el = document.documentElement;
    if (comments != null) el.setAttribute("data-lh-comments", "1"); else el.removeAttribute("data-lh-comments");
    return () => el.removeAttribute("data-lh-comments");
  }, [comments]);
  const pickNote = (n) => { setNoteDesign(n); try { localStorage.setItem("mgr-reject-note", String(n)); } catch (e) {} setNoteMenu(false); };
  // The decision note — the reason on a rejection, the manager's note on an approval.
  // No attribution: the message is the point, not who wrote it.
  const isReject = !self && person.status === "rejected";
  const isApprove = !self && person.status === "approved";
  const note = ((isReject ? person.reason : isApprove ? person.note : "") || "").trim();
  const hasNote = !!note;
  const noteLabel = isReject ? "Rejected" : "Approved";
  const noteTone = isReject ? "var(--danger)" : eSUCCESS;
  const noteBg = isReject ? "rgba(197,53,50,.06)" : "rgba(20,133,61,.06)";
  const noteBorder = isReject ? "color-mix(in srgb, var(--danger) 28%, transparent)" : "color-mix(in srgb, " + eSUCCESS + " 32%, transparent)";
  const when = mgrWhen(person.decidedAt);
  const [planTick, setPlanTick] = mgUseState(0);
  mgUseEffect(() => {
    const ev = (window.EdPlan && window.EdPlan.PLAN_EVENT) || "lh-plan-change";
    const bump = () => setPlanTick((n) => n + 1);
    window.addEventListener(ev, bump); window.addEventListener("storage", bump); window.addEventListener("focus", bump);
    return () => { window.removeEventListener(ev, bump); window.removeEventListener("storage", bump); window.removeEventListener("focus", bump); };
  }, []);
  const data = React.useMemo(() => mgrPlanFor(person), [person.id, person.status, person.changes, planTick]);
  const LEARN = (window.EdPlan && window.EdPlan.LEARN) || {};
  const ACard = window.EdPlan && window.EdPlan.ActionCard;   // same card the employee sees
  const SAMPLES = (window.EdPlan && window.EdPlan.SAMPLES) || [];
  const Report = window.EdPlan && window.EdPlan.ReportTab;   // same report preview as the employee side
  const Note = window.EdPlan && window.EdPlan.DecisionNote;  // same inline decision note
  const NoActions = window.EdPlan && window.EdPlan.NoActions;
  const META = (window.EdPlan && window.EdPlan.metaLabel) || {};
  // Same plan-design switcher as the employee side; design 6 is the default here.
  const [sample, setSample] = mgUseState(() => { const v = parseInt(localStorage.getItem("mgr-plan-design"), 10); return v >= 1 && v <= 9 ? v : 6; });
  const [sampleMenu, setSampleMenu] = mgUseState(false);
  // 2 (Minimal — picture, name, email) is the default reportee card.
  const [userCard, setUserCard] = mgUseState(() => { const v = parseInt(localStorage.getItem("mgr-usercard-design"), 10); return v >= 1 && v <= 3 ? v : 2; });
  const [userCardMenu, setUserCardMenu] = mgUseState(false);
  const pickUserCard = (n) => { setUserCard(n); try { localStorage.setItem("mgr-usercard-design", String(n)); } catch (e) {} setUserCardMenu(false); };
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
  const canReview = !self && person.status === "pending";   // queued → open it for review
  const canDecide = !self && person.status === "review";    // in review → approve or reject
  // Only the linked reportee has a real plan behind them — the rest are samples.
  const canEdit = !self && !!person.linked && person.status === "review";   // edit only while reviewing
  const [editing, setEditing] = mgUseState(false);
  const editable = editing && canEdit && !decided;
  mgUseEffect(() => { if (decided) setEditing(false); }, [decided]);
  // Strip the manager-only annotations before writing back, so John's plan keeps
  // its own shape and the diff stays meaningful.
  const mgrStrip = (d) => (d || []).map((cat) => ({ ...cat, skills: (cat.skills || []).map((sk) => {
    const s2 = { ...sk }; delete s2.changes; delete s2.edited;
    s2.actions = (sk.actions || []).map((a) => { const a2 = { ...a }; delete a2.badge; return a2; });
    return s2;
  }) }));
  const mutate = (fn) => {
    const next = JSON.parse(JSON.stringify(data));
    fn(next);
    if (window.EdPlan && window.EdPlan.savePlan) window.EdPlan.savePlan(window.EdPlan.OWNER, mgrStrip(next));
  };
  // Nothing to show on the Plan tab: either there are no skills, or this reportee
  // hasn't started (the unlinked ones never do — only John Doe is wired to the flow).
  const showEmpty = !self && ((person.status === "notstarted" && !person.linked)
    || !data.some((c) => (c.skills || []).length));

  const head = { fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eMID };

  return (
    <div className="ed-plan-wrap" style={{ paddingRight: comments != null && pushRoom ? 344 : 0, transition: "padding .25s ease" }}>
    <div style={{ maxWidth: "var(--content-max)", margin: "32px var(--fol-mx) 72px", padding: 0 }}>
      {/* title row — status sits under the heading, as on the employee's plan, so a
          long title can never shove anything onto a second line */}
      <div className="ed-plan-head" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 18 }}>
        <div style={{ flex: "1 1 auto", minWidth: 0, display: "flex", flexWrap: "wrap", alignItems: "center", gap: "9px 12px" }}>
        {self ? (
          <h1 style={{ fontFamily: "var(--sans)", fontSize: 22, fontWeight: 700, color: eMID, margin: 0, lineHeight: 1.3 }}>My Development Plan</h1>
        ) : (
        <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}>
          <I.arrowL size={20} style={{ color: eMID, flexShrink: 0 }} />
          <span style={{ fontFamily: "var(--sans)", fontSize: 22, fontWeight: 700, color: eMID, lineHeight: 1.3 }}>Direct Reportees Detail</span>
        </button>
        )}
        <div style={{ position: "relative", display: "flex", flexShrink: 0, alignItems: "center", gap: 8 }}>
          {!self && <span style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 500, ...MGR_DETAIL_TONE(person.status), padding: "4px 11px", borderRadius: 6 }}>
            {MGR_TONE(person.status).label}
          </span>}
          {/* 1 · the note lives behind a comment icon next to the chip */}
          {hasNote && noteDesign === 1 && (
            <button onClick={() => setShowReason((v) => !v)} title={noteLabel} style={{ background: "none", border: "none", cursor: "pointer", color: noteTone, display: "flex", padding: 0 }}>{isReject ? <I.alertCircle size={17} /> : <I.checkCircle size={17} />}</button>
          )}
          {hasNote && noteDesign === 1 && showReason && (
            <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: 288, zIndex: 60, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 12, boxShadow: "0 16px 44px rgba(0,15,71,.20)", padding: "14px 16px", textAlign: "left" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
                <span style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 700, color: noteTone }}>{noteLabel}</span>
                {when && <span style={{ fontFamily: "var(--sans)", fontSize: 12, color: eMUT }}>{when}</span>}
              </div>
              <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.55 }}>{note}</div>
            </div>
          )}
        </div>
        </div>
      </div>

      {/* 2 · the note reads as a comment on the plan */}
      {hasNote && noteDesign === 2 && (
        <div style={{ display: "flex", gap: 12, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 14, padding: "14px 16px", marginBottom: 18, boxShadow: "0 1px 2px rgba(0,15,71,.04)" }}>
          <span style={{ color: noteTone, display: "flex", flexShrink: 0, marginTop: 2 }}>{isReject ? <I.alertCircle size={18} /> : <I.checkCircle size={18} />}</span>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
              <span style={{ fontFamily: "var(--sans)", fontSize: 13.5, fontWeight: 700, color: noteTone }}>{noteLabel}</span>
              {when && <span style={{ fontFamily: "var(--sans)", fontSize: 13, color: eMUT }}>{when}</span>}
            </div>
            <div style={{ fontFamily: "var(--sans)", fontSize: 14.5, color: eINK, lineHeight: 1.55 }}>{note}</div>
          </div>
        </div>
      )}

      {/* 3 · inline — the very component the employee sees on their own plan */}
      {hasNote && noteDesign === 3 && (
        Note ? <Note status={person.status} note={note} when={when} /> : null
      )}

      {/* the reportee's details, in the same card the employee side uses */}
      <MgrPersonCard p={person} design={userCard} />

      {/* tabs + actions */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", borderBottom: "1px solid " + eLINE, marginBottom: 4 }}>
        <div style={{ display: "flex", gap: 2 }}>
          {[["plan", "Plan"], ["gap", "Program Report"]].map(([k, l]) => {
            const on = tab === k;
            return <button key={k} onClick={() => setTab(k)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--sans)", fontSize: 14, fontWeight: on ? 700 : 500, color: on ? eMID : eMUT, padding: "10px 14px", borderBottom: "2px solid " + (on ? eMID : "transparent"), marginBottom: -1 }}>{l}</button>;
          })}
        </div>
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10, paddingBottom: 8 }}>
          {/* the report tab carries one action of its own */}
          {tab === "gap" && (
            <button onClick={() => showToast("Program Report downloaded")}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eMID, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 10, padding: "9px 16px", cursor: "pointer" }}>
              <I.download size={16} /> Download Program Report
            </button>
          )}
          {tab === "plan" && canReview && (
            <EdBtn primary small onClick={() => {
              onDecide(person.id, "review", "");
              showToast("Review started");
            }}><I.eye size={15} /> Start Review</EdBtn>
          )}
          {tab === "plan" && canDecide && (
            <React.Fragment>
              <button onClick={() => setPop(pop === "rejected" ? null : "rejected")}
                style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eMID, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 10, padding: "9px 18px", cursor: "pointer" }}>Reject</button>
              <EdBtn primary small onClick={() => setPop(pop === "approved" ? null : "approved")}>Approve</EdBtn>
            </React.Fragment>
          )}
          {/* The manager may only edit while the plan is with them. Once it is
              approved or rejected it belongs to the owner again — no Edit here. */}
          {tab === "plan" && !showEmpty && !decided && (editable
            ? <EdBtn primary small onClick={() => { setEditing(false); showToast("Changes saved to " + person.first + "'s plan"); }}>Done editing</EdBtn>
            : <button onClick={() => { if (canEdit) setEditing(true); }} disabled={!canEdit}
                title={canEdit ? "Edit this plan" : "Start the review first"}
                style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: canEdit ? eMID : eMUT, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 10, padding: "9px 16px", cursor: canEdit ? "pointer" : "not-allowed", opacity: canEdit ? 1 : .55 }}>
                <I.edit size={15} /> Edit Plan
              </button>)}
          {tab === "plan" && <button onClick={() => { if (comments == null) setComments(""); else setComments(null); }}
            title={anyUnread ? "New message from " + person.first : "Comments"}
            style={{ position: "relative", width: 38, height: 38, borderRadius: 9, border: "1px solid " + (comments != null ? eMID : anyUnread ? "var(--danger)" : eLINE), background: comments != null ? eMID : "var(--card)", color: comments != null ? "#fff" : eMID, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <I.chat size={17} />
            {anyUnread && comments == null && <span style={{ position: "absolute", top: 6, right: 6, width: 9, height: 9, borderRadius: 999, background: "var(--danger)", border: "1.5px solid var(--card)" }} />}
          </button>}
          {pop && <MgrNotePop kind={pop} onClose={() => setPop(null)} onSubmit={(text) => {
            onDecide(person.id, pop, text);
            setPop(null);
            showToast(pop === "approved" ? "Plan approved" : "Plan rejected");
          }} />}
        </div>
      </div>

      {tab === "gap" ? (
        /* The Program Report preview — literally the employee's own tab */
        <div style={{ marginTop: 24 }}>
          {Report ? <Report /> : null}
        </div>
      ) : showEmpty ? (
        <MgrNoPlan name={person.first + " " + person.last} />
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
                const active = comments === skill.name;   // its thread is open → highlight the section
                return (
                <div key={si} data-skill={skill.name} style={{ marginBottom: 26, borderRadius: 12, transition: "background .2s",
                  background: active ? "color-mix(in srgb, var(--accent) 5%, transparent)" : "transparent",
                  outline: active ? "2px solid color-mix(in srgb, var(--accent) 35%, transparent)" : "none", outlineOffset: -2,
                  padding: active ? "8px 12px" : 0, marginLeft: active ? -12 : 0, marginRight: active ? -12 : 0 }}>
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
                    <button onClick={() => setComments(skill.name)} title={"Comments on " + skill.name}
                      style={{ position: "relative", background: "none", border: "none", cursor: "pointer", color: comments === skill.name ? eMID : eMUT, display: "flex", padding: 2 }}>
                      <I.chat size={17} />
                      {unreadSkills.indexOf(skill.name) >= 0 && comments !== skill.name && <span style={{ position: "absolute", top: 0, right: 0, width: 8, height: 8, borderRadius: 999, background: "var(--danger)", border: "1.5px solid var(--canvas)" }} />}
                    </button>
                  </div>

                  {/* the employee's plan cards, rendered with the very same component */}
                  {skill.actions.length === 0 && NoActions && <NoActions editable={editable} />}
                  {skill.actions.length > 0 && wrapCards(skill.actions.map((a, ai) => (
                    ACard
                      ? <ACard key={a.id} action={a} editable={editable} sample={sample === 8 ? 1 : sample} last={ai === skill.actions.length - 1}
                          onDate={(v) => mutate((n) => { Object.assign(n[ci].skills[si].actions[ai], v); })}
                          onComplete={(v) => mutate((n) => { n[ci].skills[si].actions[ai].completion = v; })}
                          onDelete={() => mutate((n) => { n[ci].skills[si].actions.splice(ai, 1); })} />
                      : <div key={a.id} style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, padding: "10px 0" }}>{a.title}</div>
                  )))}

                  {/* what changed on this skill — sits under the skill, not above it */}
                  {skillChanges.length > 0 && (
                    <div style={{ background: "rgba(0,15,71,.03)", border: "1px solid " + eLINE, borderRadius: 10, padding: "13px 16px", marginTop: 4 }}>
                      <div style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 700, color: eMID, marginBottom: 7 }}>Change summary</div>
                      <ul style={{ margin: 0, paddingLeft: 18 }}>
                        {skillChanges.map((c, i) => (
                          <li key={i} style={{ fontFamily: "var(--sans)", fontSize: 13.5, color: eINK, lineHeight: 1.9 }}>
                            {c.kind === "added" ? "Added" : c.kind === "removed" ? "Removed" : "Modified"}{" "}
                            {c.scope === "skill" ? "Skill" : "Development Action"}:{" "}
                            <span style={{ background: c.kind === "added" ? "color-mix(in srgb, var(--accent) 12%, transparent)" : "rgba(255,191,0,.16)", color: c.kind === "added" ? eBLUE : "#B4770A", padding: "1px 8px", borderRadius: 6 }}>{c.label}</span>
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
        <div className="ed-plan-sample-chip" style={{ position: "fixed", right: 200, bottom: 14, zIndex: 60, fontFamily: "var(--sans)" }}>
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

      {/* rejection-note switcher — only meaningful once a plan has been sent back */}
      {hasNote && ReactDOM.createPortal(
        <div className="mgr-note-chip" style={{ position: "fixed", right: 200, bottom: 98, zIndex: 60, fontFamily: "var(--sans)" }}>
          {noteMenu && (
            <div style={{ position: "absolute", bottom: 44, right: 0, width: 268, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 12, boxShadow: "0 12px 36px rgba(0,15,71,.18)", padding: 7 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: eMUT, padding: "6px 9px 4px" }}>Decision note</div>
              {MGR_NOTE_DESIGNS.map((o) => { const on = noteDesign === o.id; return (
                <button key={o.id} onClick={() => pickNote(o.id)} style={{ width: "100%", display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 9px", borderRadius: 8, border: "none", background: on ? "color-mix(in srgb, var(--accent) 7%, transparent)" : "transparent", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ width: 16, flexShrink: 0, marginTop: 2, color: eBLUE, display: "flex", justifyContent: "center" }}>{on ? <I.check size={15} /> : null}</span>
                  <span><span style={{ display: "block", fontSize: 14, fontWeight: 600, color: on ? eMID : eINK }}>{o.label}</span><span style={{ display: "block", fontSize: 14, color: eMUT, lineHeight: 1.4 }}>{o.desc}</span></span>
                </button>); })}
            </div>
          )}
          <button onClick={() => setNoteMenu((v) => !v)} title="Switch how the decision note is shown"
            style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 999, padding: "7px 14px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eMID, cursor: "pointer", boxShadow: "0 2px 10px rgba(0,15,71,.10)" }}>
            <I.fileText size={14} /> Decision note · {noteDesign}
          </button>
        </div>, document.body)}

      {ReactDOM.createPortal(
        <div className="ed-plan-usercard-chip" style={{ position: "fixed", right: 200, bottom: 56, zIndex: 60, fontFamily: "var(--sans)" }}>
          {userCardMenu && (
            <div style={{ position: "absolute", bottom: 44, right: 0, width: 250, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 12, boxShadow: "0 12px 36px rgba(0,15,71,.18)", padding: 7 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: eMUT, padding: "6px 9px 4px" }}>Reportee card</div>
              {[[1, "Divided", "Identity beside a metadata grid"], [2, "Minimal", "Just picture, name and email"], [3, "Hero panel", "Tinted identity column"]].map(([id, label, desc]) => { const on = userCard === id; return (
                <button key={id} onClick={() => pickUserCard(id)} style={{ width: "100%", display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 9px", borderRadius: 8, border: "none", background: on ? "color-mix(in srgb, var(--accent) 7%, transparent)" : "transparent", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ width: 16, flexShrink: 0, marginTop: 2, color: eBLUE, display: "flex", justifyContent: "center" }}>{on ? <I.check size={15} /> : null}</span>
                  <span><span style={{ display: "block", fontSize: 14, fontWeight: 600, color: on ? eMID : eINK }}>{label}</span><span style={{ display: "block", fontSize: 14, color: eMUT, lineHeight: 1.4 }}>{desc}</span></span>
                </button>); })}
            </div>
          )}
          <button onClick={() => setUserCardMenu((v) => !v)} title="Switch the reportee card design"
            style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 999, padding: "7px 14px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eMID, cursor: "pointer", boxShadow: "0 2px 10px rgba(0,15,71,.10)" }}>
            <I.user size={14} /> Reportee card · {userCard}
          </button>
        </div>, document.body)}

      {/* the employee's own comments panel, reading and writing the same threads */}
      {comments != null && Comments && ReactDOM.createPortal(
        <Comments chip={comments || null} role="mgr" owner={owner}
          skills={data.reduce((a, c) => a.concat((c.skills || []).map((s) => s.name)), [])}
          names={{ me: person.first + " " + person.last, mgr: MGR_ME.first + " " + MGR_ME.last }}
          onClose={() => setComments(null)} onOpen={(name) => setComments(name || "")} />,
        document.body)}
    </div>
    </div>
  );
}

// ════════════════════════════════════════════════
//  SHELL
// ════════════════════════════════════════════════
// ── URL routing ── each manager page gets its own hash URL (deep-linkable, back/forward).
function mgrRouteToPath(r, myPlanMode) {
  if (!r) return "reportees";
  if (r.page === "myplan") return myPlanMode === "flow" ? "my-plan/questions" : "my-plan";
  if (r.page === "detail" && r.person) return "reportee/" + r.person.id;
  return "reportees";
}
function mgrPathToRoute(path) {
  const segs = window.LHRoute ? LHRoute.norm(path).split("/").filter(Boolean) : [];
  const s0 = segs[0];
  if (s0 === "my-plan" || s0 === "myplan") return { page: "myplan", person: null };
  if (s0 === "reportee") { const p = (typeof MGR_TEAM !== "undefined" ? MGR_TEAM : []).find((t) => t.id === segs[1]); return p ? { page: "detail", person: p } : { page: "list", person: null }; }
  return { page: "list", person: null };
}
// My Plan has two screens: the guided questions (flow) and the finished plan.
function mgrMyPlanMode(path) {
  const segs = window.LHRoute ? LHRoute.norm(path).split("/").filter(Boolean) : [];
  if (segs[0] === "my-plan" || segs[0] === "myplan") return segs[1] === "questions" ? "flow" : "plan";
  return "flow";
}

function LHManager() {
  const [route, setRoute] = mgUseState(() => (window.LHRoute ? mgrPathToRoute(LHRoute.get()) : { page: "list", person: null }));
  const [myPlanMode, setMyPlanMode] = mgUseState(() => (window.LHRoute ? mgrMyPlanMode(LHRoute.get()) : "flow"));   // "flow" | "plan"
  const mgrSynced = React.useRef(false);
  mgUseEffect(() => {
    if (!window.LHRoute) return;
    const path = mgrRouteToPath(route, myPlanMode);
    if (!mgrSynced.current) { mgrSynced.current = true; LHRoute.replace(path); }
    else LHRoute.push(path);
  }, [route, myPlanMode]);
  mgUseEffect(() => { if (window.LHRoute) return LHRoute.onPop(() => { setRoute(mgrPathToRoute(LHRoute.get())); setMyPlanMode(mgrMyPlanMode(LHRoute.get())); }); }, []);
  const [team, setTeam] = mgUseState(MGR_TEAM);
  const [summary, setSummary] = mgUseState(null);
  // The score-summary drawer is an addressable overlay (?drawer=summary); Back closes it.
  mgUseEffect(() => { if (window.LHRoute) window.LHRoute.setQuery("drawer", summary ? "summary" : null); }, [summary]);
  mgUseEffect(() => { if (window.LHRoute) return window.LHRoute.onPop(() => { if (window.LHRoute.getQuery("drawer") == null) setSummary(null); }); }, []);
  const [toast, setToast] = mgUseState(null);
  // remembers the choice, same preference Folio stores
  const [collapsed, setCollapsed] = mgUseState(() => { try { return localStorage.getItem("ed-rail-collapsed") === "1"; } catch (e) { return false; } });
  const toggleRail = () => setCollapsed((v) => { const n = !v; try { localStorage.setItem("ed-rail-collapsed", n ? "1" : "0"); } catch (e) {} return n; });
  // "My Plan" opens on the guided questions; once generated it shows the plan.
  const Flow = window.EdIdp && window.EdIdp.EdIdpFlow;
  // The idp flow asks for a top bar to host its back link and to collapse the rail.
  const [topBack, setTopBack] = mgUseState(null);
  const topCtx = React.useMemo(() => ({ setBack: setTopBack, collapseRail: (v) => setCollapsed(!!v) }), []);
  const showToast = (m) => { setToast(m); setTimeout(() => setToast(null), 2800); };
  const Rail = window.EdShell && window.EdShell.EdRail;
  const Footer = window.EdShell && window.EdShell.EdFooter;

  // John Doe's row mirrors whatever the employee flow submitted.
  const syncSubmission = React.useCallback(() => {
    let sub = null;
    try { sub = JSON.parse(localStorage.getItem(MGR_SUB_KEY) || "null"); } catch (e) {}
    // The summary is measured, never remembered: recompute it on every sync so it
    // tracks whatever the owner's plan says right now — including "nothing changed".
    const changes = mgrChanges();
    setTeam((t) => t.map((p) => {
      if (!p.linked) return p;
      const next = { ...p, changes };
      // nothing submitted yet — the row keeps its opening status
      if (!sub) return next;
      // a decision already taken (this session or a previous one) wins
      if (sub.status === "approved" || sub.status === "rejected") {
        return { ...next, status: sub.status, decidedAt: sub.at,
          reason: sub.status === "rejected" ? (sub.note || "Rejected") : p.reason,
          note: sub.status === "approved" ? (sub.note || "") : p.note };
      }
      // the owner reopened the plan for editing — back to Draft, verdict cleared
      if (sub.status === "draft") return { ...next, status: "draft", reason: undefined, note: undefined, decidedAt: undefined };
      // the manager has this open for review
      if (sub.status === "review") return { ...next, status: "review" };
      // submitted or resubmitted — back in the queue, any old verdict cleared
      if (sub.status === "pending") return { ...next, status: "pending", reason: undefined, note: undefined, decidedAt: undefined };
      return next;
    }));
  }, []);
  mgUseEffect(() => {
    syncSubmission();
    // Status changes arrive on focus/storage; plan edits arrive on the plan event —
    // both have to re-measure the summary, or the manager reads a stale one.
    const ev = (window.EdPlan && window.EdPlan.PLAN_EVENT) || "lh-plan-change";
    window.addEventListener("focus", syncSubmission);
    window.addEventListener("storage", syncSubmission);
    window.addEventListener(ev, syncSubmission);
    return () => {
      window.removeEventListener("focus", syncSubmission);
      window.removeEventListener("storage", syncSubmission);
      window.removeEventListener(ev, syncSubmission);
    };
  }, [syncSubmission]);

  mgUseEffect(() => { window.scrollTo(0, 0); if (route.page !== "myplan") setTopBack(null); }, [route]);

  const decide = (id, status, text) => {
    const at = Date.now();
    // Hand the verdict back to the employee's own plan — the other half of the
    // handshake that Submit Plan started.
    const target = team.find((p) => p.id === id);
    if (target && target.linked) {
      try { localStorage.setItem(MGR_SUB_KEY, JSON.stringify({ status, note: text || "", at })); } catch (e) {}
    }
    setTeam((t) => t.map((p) => p.id === id ? { ...p, status, decidedAt: at, reason: status === "rejected" ? (text || "Rejected") : p.reason, note: status === "approved" ? text : p.note } : p));
    if (route.person && route.person.id === id) setRoute((r) => ({ ...r, person: { ...r.person, status, decidedAt: at, reason: text || "Rejected" } }));
  };

  const person = route.person ? (team.find((t) => t.id === route.person.id) || route.person) : null;

  // Development carries two destinations: the manager's own plan, and the team list.
  const activeId = route.page === "myplan" ? "myplan"
    : (route.page === "list" || route.page === "detail") ? "reportees" : route.page;
  const navTo = (id) => {
    if (id === "myplan") setRoute({ page: "myplan", person: null });
    else if (id === "development" || id === "reportees") setRoute({ page: "list", person: null });
  };

  return (
    <LHTopBarContext.Provider value={topCtx}>
    <div className="ed-shell" style={{ width: "100%", height: "100%", overflow: "clip", background: "var(--canvas)", display: "flex", fontFamily: "var(--sans)", position: "relative" }}>
      {/* Folio's own rail, with the manager's three destinations */}
      {Rail
        ? <Rail activeId={activeId} onNav={navTo}
            collapsed={collapsed} onToggle={toggleRail} showAccount={false} showProgress={false}
            user={{ first: MGR_ME.first, last: MGR_ME.last, initials: MGR_ME.initials, role: MGR_ME.role }}
            items={[
              { id: "home", label: "Home", icon: "home" },
              { id: "development", label: "Development", icon: "book", children: [
                { id: "myplan", label: "My Plan" },
                { id: "reportees", label: "Direct Reportees" },
              ] },
              { id: "profile", label: "Profile", icon: "user" },
            ]} />
        : null}

      {/* the rail's own collapse/expand handle, same control Folio uses */}
      <button onClick={toggleRail} title={collapsed ? "Expand menu" : "Collapse menu"} className="ed-rail-toggle"
        style={{ position: "absolute", top: 30, left: (collapsed ? 74 : 256) - 14, transition: "left .2s ease", zIndex: 50, width: 28, height: 28, borderRadius: "50%", background: "var(--card)", border: "1px solid " + eLINE, boxShadow: "0 2px 10px rgba(0,15,71,.16)", color: eMID, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
        {collapsed ? <I.chevR size={16} /> : <I.chevL size={16} />}
      </button>

      <main style={{ flex: 1, minWidth: 0, height: "100%", overflowY: "auto", overflowAnchor: "none" }}>
        <div style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
        <div className="ed-topbar" style={{ position: "sticky", top: 0, zIndex: 40, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, minHeight: 58, boxSizing: "border-box", padding: "10px var(--fol-px, 56px)", background: "var(--canvas)", borderBottom: "1px solid " + eLINE }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0 }}>
            {route.page === "detail" ? (
              <button onClick={() => setRoute({ page: "list", person: null })} className="ed-topbar-back"
                style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "none", border: "none", padding: "4px 0", color: eMID, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                <I.chevL size={17} /> Back
              </button>
            ) : topBack ? (
              <button onClick={topBack.onClick} className="ed-topbar-back"
                style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "none", border: "none", padding: "4px 0", color: eMID, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                <I.chevL size={17} /> {topBack.label}
              </button>
            ) : null}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <span style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 400, color: "var(--ink)", background: "var(--status-neutral-bg)", padding: "4px 10px", borderRadius: 8 }}>Manager view</span>
          </div>
        </div>
        <div className="ed-content" style={{ padding: "0 var(--fol-px, 56px)", flex: "1 0 auto", display: "flex", flexDirection: "column" }}>
          <div>
            {route.page === "myplan"
              ? (myPlanMode === "flow" && Flow
                  // straight into the guided questions — the report / chat-intro
                  // screens that precede them on the employee side are skipped
                  ? <Flow initialStep={2} onExit={() => setMyPlanMode("plan")} onDone={() => setMyPlanMode("plan")} />
                  : <MgrDetail self person={MGR_ME} onBack={() => {}} onDecide={() => {}} showToast={showToast} />)
              : route.page === "detail" && person
                ? <MgrDetail person={person} onBack={() => setRoute({ page: "list", person: null })} onDecide={decide} showToast={showToast} />
                : <MgrList team={team} onOpen={(p) => setRoute({ page: "detail", person: p })} onSummary={(p) => setSummary(p)} />}
          </div>
          {/* footer sits on the bottom edge even when the page is short */}
          <div style={{ marginTop: "auto" }}>{Footer ? <Footer /> : null}</div>
        </div>
        </div>
      </main>

      {summary && <MgrSummaryDrawer person={team.find((t) => t.id === summary.id) || summary} onClose={() => setSummary(null)} onDecide={(status) => {
        // Starting the review isn't a verdict — keep the drawer open so the manager
        // can read the changes and then decide, exactly as on the plan screen.
        if (status === "review") { decide(summary.id, "review", ""); showToast("Review started"); return; }
        decide(summary.id, status, status === "rejected" ? "Rejected" : "");
        setSummary(null);
        showToast(status === "approved" ? "Plan approved" : "Plan rejected");
      }} />}

      {toast && (
        <div style={{ position: "fixed", left: "50%", bottom: 28, transform: "translateX(-50%)", zIndex: 90, background: eMID, color: "#fff", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, padding: "11px 18px", borderRadius: 10, boxShadow: "0 10px 30px rgba(0,15,71,.28)", display: "inline-flex", alignItems: "center", gap: 8 }}>
          <I.check size={16} /> {toast}
        </div>
      )}
    </div>
    </LHTopBarContext.Provider>
  );
}

window.LHManager = LHManager;
