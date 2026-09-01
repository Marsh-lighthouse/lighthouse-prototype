// ════════════════════════════════════════════════
//  DEVELOPMENT PLAN — the editable plan produced after "Generate my plan".
//  Categories → skills → development actions, with date ranges, completion,
//  ratings, public/private, comments, and three ways to add actions.
//  Tokens (eMID, eINK, …), EdBtn, I, LH come from the earlier-loaded scripts.
// ════════════════════════════════════════════════
const { useState: plUseState, useEffect: plUseEffect, useRef: plUseRef } = React;

// Learning-mix metadata (70·20·10).
const PL_LEARN = {
  10: { label: "Formal Learning", color: eMID, icon: "book" },
  20: { label: "Collaborative Learning", color: eSUCCESS, icon: "users" },
  70: { label: "Learning on the Job", color: eBLUE, icon: "user" },
};

// Seed plan content (mirrors the assessment competencies).
const PL_SEED = [
  { cat: "Behavioral", icon: "bulb", skills: [
    { name: "Execute with Excellence", rating: 0, isPublic: true, actions: [
      { id: 1, mix: 10, src: "Development Library", title: "Adopt Quality Assurance Techniques", desc: "Complete formal training or e-learning courses focused on quality assurance techniques to learn how to maintain precision and ensure quality in fast-paced or high-volume tasks." },
      { id: 2, mix: 20, src: "Development Library", title: "Apply Different Prioritization Approaches", desc: "Ask a high-performing colleague to walk you through how they prioritised their last busy week, then copy their method for one week and compare results." },
      { id: 3, mix: 70, src: "AI Coach", title: "Implement a Weekly Review Process", desc: "Dedicate 30 minutes each week to review completed tasks and identify areas for improvement, focusing on efficiency and quality." },
    ] },
    { name: "Communicate with Impact", rating: 0, isPublic: true, actions: [
      { id: 4, mix: 70, src: "Development Library", title: "Prepared Communication", desc: "Before an important discussion, write your goal and 3 key points, then end discussions by asking the other person to summarise the agreed next steps." },
      { id: 5, mix: 20, src: "Development Library", title: "Build Stakeholder Map", desc: "List your key stakeholders, confirm priorities with them in short check-ins, then create a map with preferred channels and contact frequency." },
      { id: 6, mix: 10, src: "AI Coach", title: "Practice Stress-Reducing Communication", desc: "Engage in regular mindfulness exercises to improve clarity and calmness in communication during high-pressure situations." },
    ] },
    { name: "Collaborate and Build Relationships", rating: 0, isPublic: true, actions: [
      { id: 7, mix: 70, src: "Development Library", title: "Clarify Team Roles", desc: "At the start of joint work, confirm who owns what, due dates, and how updates will be shared, then send a short written summary." },
      { id: 8, mix: 20, src: "Development Library", title: "Create an Inclusive Team Environment", desc: "In group discussions, deliberately invite input from quieter members with a direct question, then acknowledge their point and link it to the decision." },
      { id: 9, mix: 10, src: "AI Coach", title: "Facilitate Cross-Department Workshops", desc: "Organize and lead workshops involving multiple departments to address shared challenges and foster collaboration." },
    ] },
  ] },
  { cat: "Technical", icon: "monitor", skills: [
    { name: "Data & Analytics", rating: 0, isPublic: true, actions: [
      { id: 10, mix: 10, src: "Development Library", title: "Complete a Data Storytelling Course", desc: "Take a structured e-learning course on turning data into clear narratives, then apply the techniques to your next reporting deck." },
      { id: 11, mix: 70, src: "AI Coach", title: "Build a Self-Serve Dashboard", desc: "Create a dashboard for a recurring question your team asks, iterate with two colleagues, and retire one manual report it replaces." },
    ] },
    { name: "Product & Platform Fluency", rating: 0, isPublic: true, actions: [
      { id: 12, mix: 20, src: "Development Library", title: "Shadow a Product Specialist", desc: "Spend two sessions alongside a platform expert, note the workflows they rely on, and document a short cheat-sheet for your team." },
      { id: 13, mix: 10, src: "Development Library", title: "Earn a Platform Certification", desc: "Work through the official certification path for the core platform you use, scheduling one study block each week." },
    ] },
  ] },
];

// Library actions offered in the "Pick from our development library" modal.
const PL_LIBRARY = [
  { mix: 70, title: "Learn Relationship Building Techniques", desc: "Ask a peer who collaborates well to let you observe one cross-team interaction, then ask them which actions built trust and copy one in your next meeting." },
  { mix: 70, title: "Create Cross Functional Collaboration", desc: "Strengthen collaboration by inviting colleagues from other teams to share updates or challenges in your regular meetings." },
  { mix: 20, title: "Share Positive Praise", desc: "Make it a habit to acknowledge and praise colleagues' contributions during team interactions or briefings to boost morale and foster a sense of shared ownership." },
  { mix: 20, title: "Invite Constructive Feedback", desc: "Regularly ask peers for one thing you could do better, then act on it and close the loop with them." },
  { mix: 10, title: "Enroll in a Team Dynamics Workshop", desc: "Participate in a workshop focused on enhancing team collaboration, trust-building, and effective communication strategies." },
];

// AI-generated suggestions for the "Create with AI" modal.
const PL_AI = [
  { mix: 10, title: "Enroll in a Team Dynamics Workshop", desc: "Participate in a workshop focused on enhancing team collaboration, trust-building, and effective communication strategies. Ensure the program includes interactive sessions." },
  { mix: 20, title: "Regular Collaborative Tasks Review", desc: "Organize weekly team meetings to collectively review progress, align goals, and foster mutual understanding within the team." },
  { mix: 20, title: "Shadow a Collaborative Leader", desc: "Observe a peer or a mentor who excels in building strong work relationships during their group interactions and document effective methods for applying them." },
  { mix: 70, title: "Train via Co-Working Projects", desc: "Pair up with a colleague on a shared deliverable and agree on how you'll split ownership, review each other's work, and unblock one another." },
];

const plClone = (x) => JSON.parse(JSON.stringify(x));
let PL_UID = 1000;
const PlTrash = ({ size = 15 }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M6 6l1 14h10l1-14" /><path d="M10 11v6M14 11v6" /></svg>);

// Small learning-mix chip (icon tile + % + label) used on every action row.
function PlMix({ mix }) {
  const m = PL_LEARN[mix]; const Ic = I[m.icon];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
      <span style={{ width: 26, height: 26, borderRadius: 7, background: m.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Ic size={14} /></span>
      <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: m.color, fontWeight: 700 }}>{mix}%</span>
      <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT }}>{m.label}</span>
    </span>
  );
}

// Real thumbnail photos for development actions, grouped by learning mode so the image
// suits the action (study/e-learning, teamwork, on-the-job). Bundled locally so they
// work offline and on the live site. A stable hash keeps each action on one image.
const PL_IMAGES = {
  10: ["images/idp/formal-1.jpg", "images/idp/formal-2.jpg", "images/idp/formal-3.jpg"],
  20: ["images/idp/collab-1.jpg", "images/idp/collab-2.jpg", "images/idp/collab-3.jpg"],
  70: ["images/idp/job-1.jpg", "images/idp/job-2.jpg", "images/idp/job-3.jpg"],
};
function plHash(str) { let h = 0; str = String(str || ""); for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0; return h; }
function plActionImg(mix, seed) { const arr = PL_IMAGES[mix] || PL_IMAGES[10]; return arr[plHash(seed) % arr.length]; }
// Only some development actions carry an image — a stable ~half split by title.
function plHasImg(seed) { return plHash(seed) % 2 === 0; }

// Image thumbnail for a development action (Sample 7 + the library picker). Shows a real
// photo suited to the learning mode; the mode colour backs it while the image loads.
function PlThumb({ mix, seed, size = 78 }) {
  const m = PL_LEARN[mix];
  return (
    <div style={{ width: size, height: size, borderRadius: 11, flexShrink: 0, overflow: "hidden", background: m.color }}>
      <img src={plActionImg(mix, seed)} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    </div>
  );
}

// Fallback tile for actions with no photo — a big learning-mode icon on a colour
// gradient, so a media list stays visually consistent (every row has a left tile).
function PlThumbIcon({ mix, size = 78 }) {
  const m = PL_LEARN[mix]; const Ic = I[m.icon];
  return (
    <div style={{ width: size, height: size, borderRadius: 11, flexShrink: 0, position: "relative", overflow: "hidden", background: "linear-gradient(135deg, color-mix(in srgb, " + m.color + " 68%, #fff), " + m.color + ")", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.18)" }}>
      <span style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 28% 22%, rgba(255,255,255,.28), transparent 62%)" }} />
      <span style={{ position: "relative", color: "#fff", display: "flex", opacity: .95 }}><Ic size={Math.round(size * 0.4)} /></span>
    </div>
  );
}

// Small "i" info button with a hover / focus tooltip. Used beside the three
// add-action options. Copy lives in PL_ADD_TIPS below (final wording to come).
function PlInfoTip({ text, label }) {
  const [open, setOpen] = plUseState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
      <button type="button" aria-label={label ? label + " — more information" : "More information"}
        onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        style={{ background: "none", border: "none", padding: 0, marginLeft: 5, cursor: "pointer", color: eMUT, display: "flex", alignItems: "center" }}>
        <I.info size={14} />
      </button>
      {open && (
        <span role="tooltip" style={{ position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", width: "max-content", maxWidth: 256, background: "#FFFFFF", color: eMID, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 400, lineHeight: 1.43, borderRadius: 4, padding: "8px 10px", boxShadow: "0 2px 4px -2px rgba(0,0,0,.1), 0 4px 6px -1px rgba(0,0,0,.1)", zIndex: 80, textAlign: "left", pointerEvents: "none" }}>
          {text}
          <span style={{ position: "absolute", top: "100%", left: "50%", marginLeft: -6, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "6px solid #FFFFFF" }} />
        </span>
      )}
    </span>
  );
}

// Tooltip copy for the three "add a development action" options.
// TODO: replace with the final UX wording once provided.
const PL_ADD_TIPS = {
  own: "Write your own development action from scratch — you set the title, description and learning type.",
  library: "Browse ready-made development actions from the Marsh library and add the ones that fit your goals.",
  ai: "Let the AI coach suggest development actions tailored to your assessment results and preferences.",
};

// 5-star self rating.
function PlStars({ value, onChange, readOnly }) {
  return (
    <span style={{ display: "inline-flex", gap: 3 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} disabled={readOnly} onClick={() => onChange && onChange(n === value ? 0 : n)} aria-label={"Rate " + n}
          style={{ background: "none", border: "none", padding: 0, cursor: readOnly ? "default" : "pointer", color: n <= value ? "var(--action)" : "rgba(0,15,71,.18)", display: "flex" }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.8.7-5.1 4.6 1.5 6.7L12 17.9 5.9 20.3l1.5-6.7L2.3 9l6.8-.7z" /></svg>
        </button>
      ))}
    </span>
  );
}

// Public / Private — the MDS Segmented control (a 2-option pill). Exact MDS spec:
// full-pill container with a 1px navy (#000F47) outline, transparent fill; the
// selected segment is a navy pill with off-white (#F7F3EE) text; the unselected
// segment is bare navy text; Noto Sans 400. Replaces the old green on/off switch.
function PlPubToggle({ isPublic, onToggle }) {
  const seg = (on) => ({ background: on ? eMID : "transparent", color: on ? "#F7F3EE" : eMID, border: "none", borderRadius: 999, padding: "4px 14px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 400, lineHeight: 1.4, cursor: "pointer", whiteSpace: "nowrap" });
  return (
    <div role="group" aria-label="Skill visibility" title={isPublic ? "Public — everyone can see this" : "Private — only you can see this"}
      style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: 2, borderRadius: 999, border: "1px solid " + eMID, background: "transparent", flexShrink: 0 }}>
      <button type="button" aria-pressed={isPublic} onClick={() => { if (!isPublic) onToggle(); }} style={seg(isPublic)}>Public</button>
      <button type="button" aria-pressed={!isPublic} onClick={() => { if (isPublic) onToggle(); }} style={seg(!isPublic)}>Private</button>
    </div>
  );
}
// Read-only visibility indicator — shown in the SAVED (non-editable) plan in place
// of the interactive segmented control, so the reader still sees each skill's
// visibility. Globe = public, lock = private; a neutral MDS-badge outline.
function PlVisBadge({ isPublic }) {
  const Ic = isPublic ? I.globe : I.lock;
  return (
    <span title={isPublic ? "Public — everyone can see this" : "Private — only you can see this"}
      style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 400, color: eMID, background: "transparent", border: "1px solid #94918C", borderRadius: 999, padding: "3px 11px", whiteSpace: "nowrap" }}>
      {Ic ? <Ic size={13} /> : null} {isPublic ? "Public" : "Private"}
    </span>
  );
}

// Description with a "more" expander.
function PlDesc({ text }) {
  const [open, setOpen] = plUseState(false);
  const long = text.length > 240;
  const shown = open || !long ? text : text.slice(0, 240).trim();
  return (
    <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.55, margin: "3px 0 0", maxWidth: 620 }}>
      {shown}{long && !open && "… "}
      {long && <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", padding: 0, color: eBLUE, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{open ? " less" : "more"}</button>}
    </p>
  );
}

// One-line description that clamps to a single line; click the … to reveal the full text.
function PlDescLine({ text }) {
  const [open, setOpen] = plUseState(false);
  const base = { fontFamily: "var(--sans)", fontSize: 14, color: eMUT, lineHeight: 1.45, marginTop: 3, cursor: "pointer" };
  const clamp = { overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" };
  return <div onClick={() => setOpen((v) => !v)} title={open ? "Show less" : "Show full detail"} style={open ? base : { ...base, ...clamp }}>{text}{open && <button onClick={(e) => { e.stopPropagation(); setOpen(false); }} style={{ background: "none", border: "none", padding: 0, marginLeft: 6, color: eBLUE, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>less</button>}</div>;
}

// ── The three "add action" modals ──
function PlModal({ children, onClose }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 120, background: "rgba(0,15,71,.5)", backdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--card)", borderRadius: 16, width: "100%", maxWidth: 660, maxHeight: "88vh", display: "flex", flexDirection: "column", boxShadow: "0 30px 80px rgba(0,15,71,.4)", overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
}
function PlModalHead({ title, onClose }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, padding: "22px 24px 16px" }}>
      <div style={{ fontFamily: "var(--sans)", fontSize: 18, color: eMID }} className="serif">{title}</div>
      <button onClick={onClose} aria-label="Close" style={{ background: "none", border: "none", cursor: "pointer", color: eMUT, fontSize: 20, lineHeight: 1, flexShrink: 0 }}>✕</button>
    </div>
  );
}

function PlCreateOwnModal({ skillName, onAdd, onClose }) {
  const [mix, setMix] = plUseState(70);
  const [title, setTitle] = plUseState("");
  const [desc, setDesc] = plUseState("");
  const inp = { width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 10, border: "1.5px solid " + eLINE, fontSize: 14, fontFamily: "var(--sans)", color: eINK, outline: "none" };
  return (
    <PlModal onClose={onClose}>
      <PlModalHead onClose={onClose} title={<React.Fragment>Create my own development action for <strong style={{ color: eMID }}>{skillName}</strong></React.Fragment>} />
      <div style={{ padding: "0 24px 8px", display: "flex", flexDirection: "column", gap: 12, overflowY: "auto" }}>
        <select value={mix} onChange={(e) => setMix(+e.target.value)} style={{ ...inp, cursor: "pointer" }}>
          <option value={70}>Learning on the Job</option>
          <option value={20}>Collaborative Learning</option>
          <option value={10}>Formal Learning</option>
        </select>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter Development Action Title" style={inp} />
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Enter Development Action Description" rows={7} style={{ ...inp, resize: "vertical", lineHeight: 1.6 }} />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "14px 24px 20px" }}>
        <EdBtn primary disabled={!title.trim()} onClick={() => onAdd({ mix, title: title.trim(), desc: desc.trim(), src: "Custom" })}>Add</EdBtn>
      </div>
    </PlModal>
  );
}

function PlLibraryModal({ skillName, onAdd, onClose }) {
  const [filter, setFilter] = plUseState("All");
  const [q, setQ] = plUseState("");
  const [sel, setSel] = plUseState({});
  const tabs = ["All", "Learning on the Job", "Collaborative Learning", "Formal Learning"];
  const items = PL_LIBRARY.filter((a) => (filter === "All" || PL_LEARN[a.mix].label === filter) && (!q || a.title.toLowerCase().includes(q.toLowerCase())));
  const count = Object.values(sel).filter(Boolean).length;
  return (
    <PlModal onClose={onClose}>
      <PlModalHead onClose={onClose} title={<React.Fragment>Development Actions Library for <strong style={{ color: eMID }}>{skillName}</strong></React.Fragment>} />
      <div style={{ padding: "0 24px 12px" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          {tabs.map((t) => <button key={t} onClick={() => setFilter(t)} style={{ padding: "7px 13px", borderRadius: 8, border: "1.5px solid " + (filter === t ? eBLUE : eLINE), background: filter === t ? "color-mix(in srgb, var(--accent) 6%, transparent)" : "var(--card)", color: filter === t ? eBLUE : eINK, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{t}</button>)}
        </div>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search Development Actions" style={{ width: "100%", boxSizing: "border-box", padding: "11px 14px", borderRadius: 10, border: "1.5px solid " + eLINE, fontSize: 14, fontFamily: "var(--sans)", color: eINK, outline: "none" }} />
      </div>
      <div style={{ overflowY: "auto", padding: "0 24px", flex: 1 }}>
        {items.map((a, i) => {
          const on = !!sel[a.title];
          return (
            <label key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "16px 14px", borderRadius: 12, background: on ? "color-mix(in srgb, var(--accent) 6%, transparent)" : "transparent", cursor: "pointer", borderBottom: "1px solid " + eLINE }}>
              <input type="checkbox" checked={on} onChange={() => setSel((s) => ({ ...s, [a.title]: !on }))} style={{ marginTop: 3, width: 16, height: 16, flexShrink: 0, accentColor: "var(--accent)" }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: 16, fontWeight: 700, color: eMID }}>{a.title}</div>
                <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.55, margin: "4px 0 10px" }}>{a.desc}</p>
                <PlMix mix={a.mix} />
              </div>
              {plHasImg(a.title) && <PlThumb mix={a.mix} seed={a.title} size={54} />}
            </label>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 14, padding: "14px 24px 20px" }}>
        <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT }}>{count} selected</span>
        <EdBtn primary disabled={!count} onClick={() => onAdd(PL_LIBRARY.filter((a) => sel[a.title]).map((a) => ({ ...a, src: "Development Library" })))}>Add</EdBtn>
      </div>
    </PlModal>
  );
}

function PlAiModal({ skillName, onAdd, onClose }) {
  const [loading, setLoading] = plUseState(true);
  const [items, setItems] = plUseState([]);
  const [sel, setSel] = plUseState({});
  const load = (more) => {
    setLoading(true);
    setTimeout(() => { setItems((prev) => more ? [...prev, ...PL_AI.map((a) => ({ ...a, title: a.title }))] : PL_AI.slice()); setLoading(false); }, 1300);
  };
  plUseEffect(() => { load(false); }, []);
  const count = Object.values(sel).filter(Boolean).length;
  return (
    <PlModal onClose={onClose}>
      <PlModalHead onClose={onClose} title={<React.Fragment>Preparing development actions for <strong style={{ color: eMID }}>{skillName}</strong></React.Fragment>} />
      {loading && items.length === 0 ? (
        <div style={{ padding: "40px 24px 48px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", gap: 6 }}>{[0, 1, 2].map((i) => <span key={i} style={{ width: 9, height: 9, borderRadius: 5, background: eBLUE, animation: "idp-blink 1s ease " + (i * 0.2) + "s infinite" }} />)}</div>
          <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eBLUE }}>Generating development actions…</span>
        </div>
      ) : (
        <React.Fragment>
          <div style={{ overflowY: "auto", padding: "4px 24px", flex: 1 }}>
            {items.map((a, i) => {
              const on = !!sel[i];
              return (
                <label key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "16px 4px", cursor: "pointer", borderBottom: "1px solid " + eLINE }}>
                  <input type="checkbox" checked={on} onChange={() => setSel((s) => ({ ...s, [i]: !on }))} style={{ marginTop: 3, width: 16, height: 16, flexShrink: 0, accentColor: "var(--accent)" }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--sans)", fontSize: 16, fontWeight: 700, color: eMID }}>{a.title}</div>
                    <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.55, margin: "4px 0 10px" }}>{a.desc}</p>
                    <PlMix mix={a.mix} />
                  </div>
                </label>
              );
            })}
            <div style={{ display: "flex", justifyContent: "center", padding: "14px 0" }}>
              <button onClick={() => load(true)} disabled={loading} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "none", border: "none", color: eBLUE, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ animation: loading ? "ed-spin .7s linear infinite" : "none" }}><path d="M3 12a9 9 0 1 0 2.6-6.4" /><path d="M3 4v5h5" /></svg>
                {loading ? "Generating…" : "Generate More"}
              </button>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "14px 24px 20px" }}>
            <EdBtn primary disabled={!count} onClick={() => onAdd(items.filter((_, i) => sel[i]).map((a) => ({ ...a, src: "AI Coach" })))}>Add</EdBtn>
          </div>
        </React.Fragment>
      )}
    </PlModal>
  );
}

// ── Comments right sidebar ──
// A running conversation between the manager and the participant about a skill
// and its development actions. Plain messages sit left (manager) / right (me);
// plan changes (completion %, dates, public/private) appear as centred activity
// notes so the thread reads as a shared history, not just free text.
const PL_MGR = "Sarah Mitchell";
const PL_ME = "John Doe";
// Each skill holds top-level comments; each comment can have a thread of replies.
// The plan-level conversation — not tied to any one skill. Always listed first.
const PL_OVERALL = "Overall plan";
const PL_THREADS = {
  [PL_OVERALL]: [
    { who: "mgr", time: "11 Aug · 09:02", text: "I've read through the whole plan — the shape is right. Let's keep this thread for anything that spans more than one skill.", replies: [
      { who: "me", time: "11 Aug · 09:20", text: "Sounds good. I'll flag here if the timelines start slipping." },
    ] },
  ],
  "Execute with Excellence": [
    { who: "mgr", time: "11 Aug · 14:22", text: "Good start on this skill. For “Adopt Quality Assurance Techniques”, could you add a concrete target date so we can track it in our 1:1s?", replies: [
      { who: "me", time: "11 Aug · 16:41", text: "Done — the start date is in, and I’m aiming to finish the e-learning by end of September." },
      { who: "mgr", time: "11 Aug · 17:02", text: "Perfect, thanks for turning that around so quickly." },
    ] },
    { who: "mgr", time: "12 Aug · 09:15", text: "I’d also pair with Priya on the prioritisation action — she’s strong there.", replies: [
      { who: "me", time: "12 Aug · 09:20", text: "Good idea, I’ll set up a session with her this week." },
    ] },
  ],
  "Communicate with Impact": [
    { who: "mgr", time: "10 Aug · 11:05", text: "Your presentation last week was a clear step up. Let’s make “present with confidence” a formal action here.", replies: [
      { who: "me", time: "10 Aug · 11:30", text: "Thanks! I’ve added it to the plan." },
    ] },
  ],
  "Collaborate and Build Relationships": [
    { who: "me", time: "9 Aug · 15:12", text: "I’ve asked the wider team for peer feedback on this one.", replies: [
      { who: "mgr", time: "9 Aug · 15:40", text: "Perfect. Once it’s in, let’s review it together." },
    ] },
  ],
};

// Skills whose most recent message (comment or reply) is from the manager → an
// unopened "new message". Their chat icons get a highlighted unread dot.
const PL_NEW_MSG_SKILLS = Object.keys(PL_THREADS).filter((k) => { const flat = PL_THREADS[k].flatMap((c) => [c, ...(c.replies || [])]); const last = flat[flat.length - 1]; return last && last.who === "mgr"; });

// ── shared comment store ──
// Threads live in localStorage keyed by whose plan they belong to, so the employee's
// plan and the manager's review of that same plan are one conversation, not two copies.
const PL_THREAD_KEY = "lh-plan-threads";
const PL_THREAD_EVENT = "lh-threads-change";
function plThreadsFor(owner) {
  try { const all = JSON.parse(localStorage.getItem(PL_THREAD_KEY) || "{}"); if (all && all[owner]) return all[owner]; } catch (e) {}
  return plClone(PL_THREADS);
}
function plSaveThreads(owner, threads) {
  let all = {};
  try { all = JSON.parse(localStorage.getItem(PL_THREAD_KEY) || "{}") || {}; } catch (e) {}
  all[owner] = threads;
  try { localStorage.setItem(PL_THREAD_KEY, JSON.stringify(all)); } catch (e) {}
  try { window.dispatchEvent(new CustomEvent(PL_THREAD_EVENT, { detail: owner })); } catch (e) {}
}
// Seed-format timestamp ("20 Aug · 14:22") so posted messages age honestly.
function plNow() {
  const d = new Date(), p = (n) => String(n).padStart(2, "0");
  return d.getDate() + " " + d.toLocaleDateString(undefined, { month: "short" }) + " · " + p(d.getHours()) + ":" + p(d.getMinutes());
}
const plInitials = (name) => (name || "").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

// ── shared plan store ──
// The plan itself lives in localStorage keyed by owner, so the manager reviewing
// John's plan sees the very rows John edited — not a rebuild from the seed.
const PL_OWNER = "john";                 // whose plan the Folio flow is editing
const PL_PLAN_KEY = "lh-plan-data";
const PL_PLAN_EVENT = "lh-plan-change";
function plLoadPlan(owner) {
  try { const all = JSON.parse(localStorage.getItem(PL_PLAN_KEY) || "{}"); if (all && all[owner]) return all[owner]; } catch (e) {}
  return null;
}
function plSavePlan(owner, data) {
  let all = {};
  try { all = JSON.parse(localStorage.getItem(PL_PLAN_KEY) || "{}") || {}; } catch (e) {}
  all[owner] = data;
  try { localStorage.setItem(PL_PLAN_KEY, JSON.stringify(all)); } catch (e) {}
  try { window.dispatchEvent(new CustomEvent(PL_PLAN_EVENT, { detail: owner })); } catch (e) {}
}
// What the owner changed, measured against the seed the plan started from.
// Drives the manager's per-skill change summary — no hand-maintained list.
function plDiff(plan) {
  // No stored plan means the owner hasn't touched anything yet — that's "no changes",
  // not "everything removed". Without this the first visit reports the whole seed
  // as deleted and the manager opens on a change summary that never happened.
  if (!plan) return [];
  const baseAction = {}, baseSkill = {};
  PL_SEED.forEach((c) => c.skills.forEach((s) => {
    baseSkill[s.name] = s;
    s.actions.forEach((a) => { baseAction[s.name + "|" + a.title] = a; });
  }));
  const seen = {}, out = [], liveSkill = {};
  (plan || []).forEach((c) => (c.skills || []).forEach((s) => {
    liveSkill[s.name] = true;
    // A skill the owner added is a change in its own right — it reads as one even
    // when they haven't put a single development action under it yet.
    if (!baseSkill[s.name]) out.push({ kind: "added", scope: "skill", skill: s.name, label: s.name });
    (s.actions || []).forEach((a) => {
      const key = s.name + "|" + a.title;
      seen[key] = true;
      const base = baseAction[key];
      if (!base) { out.push({ kind: "added", scope: "action", skill: s.name, label: a.title }); return; }
      if ((a.start || "") !== (base.start || "") || (a.end || "") !== (base.end || "") ||
          (a.completion || 0) !== (base.completion || 0)) {
        out.push({ kind: "modified", scope: "action", skill: s.name, label: a.title });
      }
    });
  }));
  // A dropped skill is reported once, as a skill — listing each of its actions as
  // removed on top of that would bury the one fact the manager needs.
  Object.keys(baseSkill).forEach((name) => {
    if (!liveSkill[name]) out.push({ kind: "removed", scope: "skill", skill: name, label: name });
  });
  Object.keys(baseAction).forEach((key) => {
    const i = key.indexOf("|"), name = key.slice(0, i);
    if (!seen[key] && liveSkill[name]) out.push({ kind: "removed", scope: "action", skill: name, label: key.slice(i + 1) });
  });
  return out;
}

// ── plan status, one palette for both sides ──
// The employee's badge and the manager's chip read from this, so a status can never
// mean one colour on one screen and another colour on the other.
const PL_STATUS = {
  // MDS Badge soft-background variants: Neutral outline / Notice / Informative /
  // Positive / Negative. Colours are the exact MDS hues; fill = 85%-white tint.
  notstarted: { label: "Not Started", color: "var(--ink)", bg: "var(--status-neutral-bg)", icon: null },
  draft: { label: "Draft", color: "var(--ink)", bg: "var(--status-neutral-bg)", icon: null },
  pending: { label: "Pending Approval", color: "#CB7E03", bg: "color-mix(in srgb, #CB7E03 15%, #ffffff)", icon: "clock" },
  // The manager has opened the plan for review — no longer just queued.
  review: { label: "In Review", color: "#002C77", bg: "color-mix(in srgb, #002C77 15%, #ffffff)", icon: "eye" },
  approved: { label: "Approved", color: "#14853D", bg: "color-mix(in srgb, #14853D 15%, #ffffff)", icon: "checkCircle" },
  rejected: { label: "Rejected", color: "#C53532", bg: "color-mix(in srgb, #C53532 15%, #ffffff)", icon: "alertCircle" },
  // The owner's own marker once they've finished the work — not a manager decision.
  completed: { label: "Completed", color: "#14853D", bg: "color-mix(in srgb, #14853D 15%, #ffffff)", icon: "checkCircle" },
};
// The badge itself — same pill wherever a plan status is shown.
function PlStatusBadge({ status, size = 14 }) {
  const s = PL_STATUS[status] || PL_STATUS.notstarted;
  const Ic = s.icon && I[s.icon];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--sans)", fontSize: size,
      fontWeight: 400, color: s.color, background: s.bg, padding: "4px 11px", borderRadius: 6, whiteSpace: "nowrap" }}>
      {Ic ? <Ic size={size} /> : null}{s.label}
    </span>
  );
}

// ── reflective questions, shared with the manager ──
// The owner answers them; the manager reads them and may edit the wording.
const PL_REFLECT_QS = [
  { q: "What strengths do you want to continue to focus on?", req: true, min: 3, max: 60 },
  { q: "What behavioural competencies/skills do you want to develop?", req: true, min: 3, max: 60 },
  { q: "What critical experiences do you need to gain?", req: true, min: 3, max: 60 },
  { q: "What are your allowable weaknesses?", req: false, min: 2, max: 40 },
  { q: "What do the next 5 to 10 years look like?", req: false, min: 3, max: 80 },
];
const PL_REFLECT_KEY = "lh-reflections";
const PL_REFLECT_EVENT = "lh-reflect-change";
function plLoadReflect(owner) {
  try { const all = JSON.parse(localStorage.getItem(PL_REFLECT_KEY) || "{}"); if (all && all[owner]) return all[owner]; } catch (e) {}
  return {};
}
function plSaveReflect(owner, ans) {
  let all = {};
  try { all = JSON.parse(localStorage.getItem(PL_REFLECT_KEY) || "{}") || {}; } catch (e) {}
  all[owner] = ans;
  try { localStorage.setItem(PL_REFLECT_KEY, JSON.stringify(all)); } catch (e) {}
  try { window.dispatchEvent(new CustomEvent(PL_REFLECT_EVENT, { detail: owner })); } catch (e) {}
}

// ── the manager's decision on a submitted plan ──
// Written by the manager workspace, read here; one component so both sides match.
const PL_SUB_KEY = "lh-idp-submission";
function plSubmission() {
  try { return JSON.parse(localStorage.getItem(PL_SUB_KEY) || "null"); } catch (e) { return null; }
}
function plWhen(ts) {
  if (!ts) return "";
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return m + (m === 1 ? " minute ago" : " minutes ago");
  const h = Math.floor(m / 60);
  if (h < 24) return h + (h === 1 ? " hour ago" : " hours ago");
  return new Date(ts).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}
// Inline note: the reason on a rejection, the manager's note on an approval.
// No attribution — the message is the point.
function PlDecisionNote({ status, note, when }) {
  const reject = status === "rejected";
  if (!reject && status !== "approved") return null;
  if (!String(note || "").trim()) return null;
  const tone = reject ? "var(--danger)" : eSUCCESS;
  return (
    <div style={{ display: "flex", gap: 11, alignItems: "flex-start", marginBottom: 18,
      background: reject ? "rgba(197,53,50,.06)" : "rgba(20,133,61,.06)",
      border: "1px solid " + (reject ? "color-mix(in srgb, var(--danger) 28%, transparent)" : "color-mix(in srgb, " + eSUCCESS + " 32%, transparent)"),
      borderRadius: 12, padding: "13px 16px" }}>
      <span style={{ color: tone, display: "flex", flexShrink: 0, marginTop: 1 }}>{reject ? <I.alertCircle size={17} /> : <I.checkCircle size={17} />}</span>
      <div style={{ minWidth: 0, fontFamily: "var(--sans)", fontSize: 14.5, color: eINK, lineHeight: 1.55 }}>
        <b style={{ color: tone }}>{reject ? "Rejected" : "Approved"}</b>
        {when && <span style={{ color: eMUT }}> · {when}</span>}
        <div style={{ marginTop: 3 }}>{note}</div>
      </div>
    </div>
  );
}

// A skill the owner has chosen but not yet filled in. Deliberately NOT a solid card:
// a dashed slot on white reads as a space waiting to be filled, so it can't be mistaken
// for a real development action.
function PlNoActions({ editable }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14,
      padding: "26px 22px", marginBottom: 6, borderRadius: 12, background: "var(--card)",
      border: "1.5px dashed color-mix(in srgb, var(--primary) 24%, transparent)" }}>
      <span style={{ width: 46, height: 46, borderRadius: 12, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
        background: "color-mix(in srgb, var(--primary) 6%, transparent)", color: eMID }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3 3 8l9 5 9-5-9-5z" />
          <path d="M3 13l9 5 9-5" />
          <path d="M3 18l9 5 9-5" />
        </svg>
      </span>
      <div>
        <div style={{ fontFamily: "var(--sans)", fontSize: 14.5, fontWeight: 700, color: eMID }}>No development actions yet</div>
        <div style={{ fontFamily: "var(--sans)", fontSize: 13.5, color: eMUT, marginTop: 2 }}>
          {editable ? "Add one from the options below to start building this skill." : "Edit the plan to add development actions for this skill."}
        </div>
      </div>
    </div>
  );
}

// The comments panel only pushes the page aside when the content column can keep
// its full width beside it. Otherwise it floats over the content, so tabs, headers
// and tables never get squeezed into wrapping.
const PL_PANEL_W = 344;
function plHasPushRoom() {
  try {
    const rail = document.querySelector(".ed-rail");
    const railW = rail ? rail.getBoundingClientRect().width : 0;
    const cs = getComputedStyle(document.documentElement);
    const px = parseInt(cs.getPropertyValue("--fol-px"), 10) || 56;
    const max = parseInt(cs.getPropertyValue("--content-max"), 10) || 848;
    return window.innerWidth - railW - PL_PANEL_W - px * 2 >= max;
  } catch (e) { return false; }
}
function plUsePushRoom(dep) {
  const [room, setRoom] = plUseState(plHasPushRoom);
  plUseEffect(() => {
    const on = () => setRoom(plHasPushRoom());
    on();
    const t = setTimeout(on, 260);            // after the rail's width transition
    window.addEventListener("resize", on);
    return () => { clearTimeout(t); window.removeEventListener("resize", on); };
  }, [dep]);
  return room;
}

const plCLink = { display: "inline-flex", alignItems: "center", gap: 5, background: "none", border: "none", padding: 0, color: eBLUE, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer" };
const PlReplyIcon = ({ size = 13 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M9 14 4 9l5-5" /><path d="M4 9h11a5 5 0 0 1 5 5v3" /></svg>;

// One threaded comment — avatar · name · time · text · Reply — with nested replies.
// No like/dislike; the only action is Reply.
function PlCommentItem({ item, onReply, role = "me", names, onResolve }) {
  const NAMES = names || { me: PL_ME, mgr: PL_MGR };
  const [replying, setReplying] = plUseState(false);
  const [showReplies, setShowReplies] = plUseState(true);
  const [text, setText] = plUseState("");
  const mine = item.who === role;        // "mine" depends on which side is reading
  const name = NAMES[item.who] || PL_ME;
  const replies = item.replies || [];
  const submit = () => { const t = text.trim(); if (!t) return; onReply(t); setText(""); setReplying(false); setShowReplies(true); };
  return (
    <div style={{ display: "flex", gap: 11, marginBottom: 16 }}>
      <span style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: mine ? eBLUE : "var(--surface-deep)", color: "#fff", fontFamily: "var(--sans)", fontSize: 12, fontWeight: 700 }}>{plInitials(name)}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eMID }}>{name}</span>
          <span style={{ fontFamily: "var(--sans)", fontSize: 12, color: eMUT }}>{item.time}</span>
        </div>
        <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.5, marginTop: 3 }}>{item.text}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}>
          <button onClick={() => setReplying((v) => !v)} style={plCLink}><PlReplyIcon /> Reply</button>
          {/* Resolving a comment resolves the whole exchange beneath it. */}
          {onResolve && (
            <button onClick={() => onResolve(!item.resolved)} style={{ ...plCLink, color: item.resolved ? eSUCCESS : eMUT }}
              title={item.resolved ? "Reopen this comment" : "Mark as resolved"}>
              <I.check size={14} /> {item.resolved ? "Reopen" : "Resolve"}
            </button>
          )}
          {replies.length > 0 && <button onClick={() => setShowReplies((v) => !v)} style={{ ...plCLink, color: eMUT }}>{showReplies ? "Hide" : "Show"} {replies.length} {replies.length === 1 ? "reply" : "replies"}</button>}
        </div>
        {replying && (
          <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center" }}>
            <input autoFocus value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") submit(); }} placeholder={"Reply to " + name.split(" ")[0] + "…"} style={{ flex: 1, border: "1px solid " + eLINE, borderRadius: 20, padding: "8px 14px", outline: "none", fontFamily: "var(--sans)", fontSize: 14, color: eINK, background: "var(--card)", minWidth: 0 }} />
            <button onClick={submit} disabled={!text.trim()} aria-label="Send reply" style={{ width: 32, height: 32, borderRadius: 999, background: text.trim() ? eMID : "rgba(0,15,71,.08)", border: "none", color: text.trim() ? "#fff" : eMUT, cursor: text.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><I.send size={15} /></button>
          </div>
        )}
        {replies.length > 0 && showReplies && (
          <div style={{ marginTop: 14, paddingLeft: 13, borderLeft: "2px solid " + eLINE }}>
            {replies.map((r, i) => <PlCommentItem key={i} item={r} onReply={onReply} role={role} names={NAMES} />)}
          </div>
        )}
      </div>
    </div>
  );
}

// Right-side comments panel. Global (chip=null) = an inbox of skill conversations;
// a skill (chip=name) = its threaded comments with replies.
// The skills a plan actually contains. A thread can outlive the skill it belongs to —
// a manual plan starts from scratch, and skills can be removed — so the comments panel
// needs to know what's really on the page before offering to jump to it.
function plSkillNames(plan) {
  const out = [];
  (plan || []).forEach((c) => (c.skills || []).forEach((s) => { if (s && s.name) out.push(s.name); }));
  return out;
}

// Jump the page to a skill without opening its thread. Works on both plan renderers —
// the employee's and the manager's — since both tag their skill blocks with data-skill.
function plGoToSkill(name) {
  const sel = "[data-skill=\"" + (typeof CSS !== "undefined" && CSS.escape ? CSS.escape(name) : name) + "\"]";
  const el = document.querySelector(sel);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  // A brief flash, so it's obvious which block was landed on.
  const prev = el.style.boxShadow;
  el.style.transition = "box-shadow .25s ease";
  el.style.boxShadow = "0 0 0 3px color-mix(in srgb, var(--accent) 45%, transparent)";
  setTimeout(function () { el.style.boxShadow = prev || "none"; }, 1100);
}

function PlComments({ chip, onClose, onOpen, role = "me", owner = "john", names, skills }) {
  const NAMES = names || { me: PL_ME, mgr: PL_MGR };
  const inThread = !!chip;
  const [text, setText] = plUseState("");
  // Backed by the shared store, so a message posted on one side shows up on the other.
  const [store, setStore] = plUseState(() => plThreadsFor(owner));
  plUseEffect(() => { setStore(plThreadsFor(owner)); setText(""); }, [owner, chip]);
  plUseEffect(() => {
    const sync = () => setStore(plThreadsFor(owner));
    window.addEventListener(PL_THREAD_EVENT, sync);   // same tab
    window.addEventListener("storage", sync);          // the other flow in another tab
    window.addEventListener("focus", sync);
    return () => { window.removeEventListener(PL_THREAD_EVENT, sync); window.removeEventListener("storage", sync); window.removeEventListener("focus", sync); };
  }, [owner]);
  const thread = store[chip] || [];
  const write = (next) => { const all = { ...store, [chip]: next }; setStore(all); plSaveThreads(owner, all); };
  const postTo = (name, t) => {
    const all = { ...store, [name]: [...(store[name] || []), { who: role, time: plNow(), text: t, replies: [] }] };
    setStore(all); plSaveThreads(owner, all);
  };
  const addComment = () => { const t = text.trim(); if (!t) return; postTo(chip, t); setText(""); };
  // From the inbox, a new message starts the plan-level conversation and opens it.
  const addOverall = () => { const t = text.trim(); if (!t) return; postTo(PL_OVERALL, t); setText(""); onOpen(PL_OVERALL); };
  const addReply = (ci) => (t) => write(thread.map((c, i) => (i === ci ? { ...c, replies: [...(c.replies || []), { who: role, time: plNow(), text: t }] } : c)));
  // Resolved comments drop out of the list; the filter brings them back.
  const [filter, setFilter] = plUseState("open");   // open | resolved | all
  const [filterMenu, setFilterMenu] = plUseState(false);
  const filterRef = plUseRef(null);
  // The filter is sticky across navigation: browsing resolved comments in the inbox
  // and opening one should keep showing resolved, not silently flip back to open.
  plUseEffect(() => { setFilterMenu(false); }, [chip]);
  plUseEffect(() => {
    if (!filterMenu) return;
    const onDoc = (e) => { if (filterRef.current && !filterRef.current.contains(e.target)) setFilterMenu(false); };
    const onKey = (e) => { if (e.key === "Escape") setFilterMenu(false); };
    document.addEventListener("mousedown", onDoc); document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [filterMenu]);
  const setResolved = (ci) => (val) => write(thread.map((c, i) => (i === ci ? { ...c, resolved: val } : c)));
  const visible = thread.map((c, i) => ({ c, i })).filter((x) => filter === "all" || !!x.c.resolved === (filter === "resolved"));
  const hasOpen = (name) => (store[name] || []).some((c) => !c.resolved);
  const hasDone = (name) => (store[name] || []).some((c) => !!c.resolved);

  // Without the prop (an older caller) assume every skill is present, so the link
  // behaves exactly as it did rather than silently disappearing.
  const inPlan = (name) => !skills || skills.indexOf(name) >= 0;

  const threadNames = [PL_OVERALL].concat(Object.keys(store).filter((k) => k !== PL_OVERALL));
  const rowsAll = threadNames.map((name) => {
    const flat = (store[name] || []).flatMap((c) => [c, ...(c.replies || [])]);
    const last = flat[flat.length - 1];
    // unread = the last word was the other side's
    return { name, last, count: flat.length, unread: !!last && last.who !== role, overall: name === PL_OVERALL };
  }).filter((r) => r.overall || !!r.last);   // the plan-level thread is always offered
  // In the inbox the same filter picks conversations rather than single comments.
  const inboxOpen = rowsAll.filter((r) => hasOpen(r.name) || (r.overall && !r.last));
  const inboxDone = rowsAll.filter((r) => hasDone(r.name));
  const rows = inThread ? rowsAll : (filter === "all" ? rowsAll : filter === "resolved" ? inboxDone : inboxOpen);
  const openCount = inThread ? thread.filter((c) => !c.resolved).length : inboxOpen.length;
  const doneCount = inThread ? thread.length - thread.filter((c) => !c.resolved).length : inboxDone.length;
  const allCount = inThread ? thread.length : rowsAll.length;

  return (
    <aside className="ed-idp-notes" style={{ position: "fixed", top: 59, right: 0, bottom: 0, width: 344, zIndex: 40, background: eCARD, borderLeft: "1px solid " + eLINE, display: "flex", flexDirection: "column" }}>
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderBottom: "1px solid " + eLINE, flexShrink: 0 }}>
        {inThread && <button onClick={() => onOpen("")} title="All conversations" style={{ background: "none", border: "none", cursor: "pointer", color: eMID, display: "flex", flexShrink: 0, padding: 2 }}><I.arrowL size={18} /></button>}
        <div style={{ flex: 1, minWidth: 0, fontFamily: "var(--sans)", fontSize: 16, fontWeight: 700, color: eMID, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{inThread ? chip : "Comments"}</div>
        <div ref={filterRef} style={{ position: "relative", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <button onClick={() => setFilterMenu((v) => !v)} title={filter === "open" ? "Filter comments" : "Showing " + filter}
            style={{ background: "none", border: "none", cursor: "pointer", color: filter === "open" ? eMUT : eBLUE, display: "flex", padding: 2 }}>
            <I.filter size={17} />
          </button>
          <button onClick={onClose} aria-label="Close" style={{ background: "none", border: "none", cursor: "pointer", color: eMUT, display: "flex" }}><I.plus size={18} style={{ transform: "rotate(45deg)" }} /></button>
          {filterMenu && (
            <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: 190, zIndex: 60, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 12, boxShadow: "0 14px 40px rgba(0,15,71,.20)", padding: 6 }}>
              {[["all", "All", allCount], ["open", "Open", openCount], ["resolved", "Resolved", doneCount]].map(([val, label, n]) => {
                const on = filter === val;
                return (
                  <button key={label} onClick={() => { setFilter(val); setFilterMenu(false); }}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "8px 9px", borderRadius: 8, border: "none", cursor: "pointer", textAlign: "left",
                      background: on ? "color-mix(in srgb, var(--accent) 7%, transparent)" : "transparent" }}>
                    <span style={{ width: 15, flexShrink: 0, color: eBLUE, display: "flex" }}>{on ? <I.check size={14} /> : null}</span>
                    <span style={{ flex: 1, fontFamily: "var(--sans)", fontSize: 14, fontWeight: on ? 700 : 500, color: on ? eMID : eINK }}>{label}</span>
                    <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT }}>{n}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {inThread ? (
        <React.Fragment>
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px" }}>
            {visible.length
              ? visible.map(({ c, i }) => <PlCommentItem key={i} item={c} onReply={addReply(i)} onResolve={setResolved(i)} role={role} names={NAMES} />)
              : <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, textAlign: "center", padding: "26px 0" }}>
                  {thread.length === 0 ? "No comments yet. Start the conversation below."
                    : filter === "resolved" ? "Nothing resolved yet." : "All comments here are resolved."}
                </div>}
          </div>
        </React.Fragment>
      ) : (
        // inbox of conversations
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px" }}>
          <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, padding: "2px 4px 10px" }}>{rows.length} {filter === "resolved" ? "with resolved comments" : (rows.length === 1 ? "conversation" : "conversations")} · tap one to open the thread</div>
          {rows.map((r, i) => {
            const mine = r.last ? r.last.who === role : false;
            const lastName = r.last ? (NAMES[r.last.who] || PL_ME) : "";
            // The plan-level thread isn't one of the skills — it gets its own tag and a
            // tinted card so it reads as the odd one out rather than the first of a list.
            // Two light MDS outline badges (these tags appear on most cards, so no
            // heavy solid fill): the plan-level thread is an Informative blue outline
            // (#002C77 + a faint tint), skill threads are the Neutral gray outline.
            const tag = r.overall
              ? { label: "Whole plan", fg: "#002C77", bg: "color-mix(in srgb, #002C77 10%, transparent)", border: "1px solid #002C77" }
              : { label: "Skill", fg: "var(--ink)", bg: "transparent", border: "1px solid #94918C" };
            return (
              <div key={i} role="button" tabIndex={0} onClick={() => onOpen(r.name)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(r.name); } }}
                style={{ width: "100%", textAlign: "left", display: "flex", gap: 11, alignItems: "flex-start", padding: 12, borderRadius: 4, border: "1px solid " + (r.unread ? "color-mix(in srgb, var(--danger) 30%, transparent)" : "#DEDBD6"), background: "#F9F5F1", cursor: "pointer", marginBottom: 8, boxSizing: "border-box" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#F2ECE4"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#F9F5F1"}>
                <span style={{ width: 36, height: 36, borderRadius: "50%", background: mine ? eBLUE : "var(--surface-deep)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--sans)", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{r.last ? plInitials(lastName) : <I.chat size={16} />}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ flex: 1, minWidth: 0, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eMID, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</span>
                    {r.unread && <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--danger)", flexShrink: 0 }} />}
                  </div>
                  <span style={{ display: "inline-block", marginTop: 5, padding: "3px 9px", borderRadius: 8, background: tag.bg, color: tag.fg, border: tag.border, boxSizing: "border-box", fontFamily: "var(--sans)", fontSize: 12, fontWeight: 400 }}>{tag.label}</span>
                  <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, lineHeight: 1.4, marginTop: 5, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{r.last ? <React.Fragment><b style={{ color: eMID, fontWeight: 600 }}>{mine ? "You" : lastName.split(" ")[0]}:</b> {r.last.text}</React.Fragment> : "No messages yet — start the conversation."}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
                    <span style={{ fontFamily: "var(--sans)", fontSize: 12, color: eMUT }}>{r.last ? r.last.time + " · " + r.count + " " + (r.count === 1 ? "message" : "messages") : "Plan-level conversation"}</span>
                    {/* Skill threads can jump to the skill itself without opening the thread.
                        A thread whose skill isn't in this plan says so rather than offering
                        a link that would go nowhere. */}
                    {!r.overall && (inPlan(r.name) ? (
                      <button onClick={(e) => { e.stopPropagation(); plGoToSkill(r.name); }}
                        style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 4, background: "none", border: "none", padding: 0, cursor: "pointer", color: eBLUE, fontFamily: "var(--sans)", fontSize: 12, fontWeight: 600 }}>
                        Go to skill <I.chevR size={13} />
                      </button>
                    ) : (
                      <span style={{ marginLeft: "auto", fontFamily: "var(--sans)", fontSize: 12, color: eMUT, fontStyle: "italic" }}>Not in this plan</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* One composer, always available. In a thread it posts there; from the
          inbox it starts the plan-level conversation and opens it. */}
      <div style={{ padding: "10px 16px 16px", borderTop: "1px solid " + eLINE, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input value={text} onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") (inThread ? addComment : addOverall)(); }}
            placeholder={inThread ? "Write a comment…" : "Write a message about the plan…"}
            style={{ flex: 1, border: "none", outline: "none", fontFamily: "var(--sans)", fontSize: 14, color: eINK, background: "transparent", minWidth: 0, padding: "8px 0" }} />
          <button onClick={() => (inThread ? addComment : addOverall)()} aria-label="Send" disabled={!text.trim()}
            style={{ width: 34, height: 34, borderRadius: 999, background: text.trim() ? eMID : "rgba(0,15,71,.08)", border: "none", color: text.trim() ? "#fff" : eMUT, cursor: text.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><I.send size={16} /></button>
        </div>
      </div>
    </aside>
  );
}

// ── Add Skills — full-page modal ──
function PlAddSkills({ current, onClose, onSave }) {
  const cats = [
    { name: "Behavioral", icon: "bulb",
      options: ["Execute with Excellence", "Communicate with Impact", "Collaborate and Build Relationships", "Act Professionally", "Champion Change and Innovation", "Diversity and Inclusion", "Lead with Purpose", "Coach and Develop Others"],
      suggest: ["Act Professionally", "Champion Change and Innovation", "Diversity and Inclusion"] },
    { name: "Technical", icon: "monitor",
      options: ["Data & Analytics", "Product & Platform Fluency", "Process Automation", "Systems Thinking", "Technical Documentation"],
      suggest: ["Data & Analytics", "Product & Platform Fluency"] },
  ];
  const cur = current || [[], []];
  cats.forEach((c, ci) => { (cur[ci] || []).forEach((n) => { if (c.options.indexOf(n) < 0) c.options = c.options.concat(n); }); });
  const [sel, setSel] = plUseState(() => cats.map((c, ci) => (cur[ci] || []).slice()));
  const setCat = (ci, v) => setSel((x) => x.map((arr, i) => (i === ci ? v : arr)));
  const addSug = (ci, s) => setSel((x) => x.map((arr, i) => (i === ci && !arr.includes(s) ? [...arr, s] : arr)));
  plUseEffect(() => { const onKey = (e) => { if (e.key === "Escape") onClose(); }; document.addEventListener("keydown", onKey); return () => document.removeEventListener("keydown", onKey); }, []);
  return ReactDOM.createPortal(
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,15,71,.45)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "clamp(20px,5vh,60px) 20px", overflowY: "auto" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 720, background: "var(--card)", borderRadius: 16, boxShadow: "0 40px 90px rgba(0,15,71,.35)", overflow: "hidden", display: "flex", flexDirection: "column", maxHeight: "calc(100vh - 80px)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "20px 24px", borderBottom: "1px solid " + eLINE, flexShrink: 0 }}>
          <h1 className="serif" style={{ fontSize: 24, color: eMID, margin: 0 }}>Add Skills</h1>
          <button onClick={onClose} title="Close" style={{ width: 34, height: 34, borderRadius: 9, border: "1px solid " + eLINE, background: "var(--card)", color: eMUT, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><I.plus size={18} style={{ transform: "rotate(45deg)" }} /></button>
        </div>
        <div style={{ padding: "8px 24px 24px", overflowY: "auto" }}>
          {cats.map((c, ci) => (
            <div key={ci} style={{ borderTop: ci ? "1px solid " + eLINE : "none", paddingTop: ci ? 26 : 18, marginTop: ci ? 26 : 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                <div style={{ width: 46, height: 46, borderRadius: 23, background: "rgba(0,15,71,.06)", color: eMID, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{React.createElement(I[c.icon], { size: 22 })}</div>
                <div>
                  <div className="serif" style={{ fontSize: 22, color: eMID }}>{c.name}</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT }}>Choose the skills you want to develop further as part of your development plan.</div>
                </div>
              </div>
              <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eMID, margin: "16px 0 10px" }}>Search your skills</div>
              <IdpMultiSelect search options={c.options} selected={sel[ci]} onChange={(v) => setCat(ci, v)} placeholder="Search skills…" />
              {c.suggest.filter((s) => !sel[ci].includes(s)).length > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
                  <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT }}>Suggestions</span>
                  {c.suggest.filter((s) => !sel[ci].includes(s)).map((s) => <button key={s} onClick={() => addSug(ci, s)} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 8, padding: "8px 13px", fontFamily: "var(--sans)", fontSize: 14, color: eMID, cursor: "pointer" }}><I.plus size={14} /> {s}</button>)}
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid " + eLINE, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, color: eMUT, fontFamily: "var(--sans)", fontSize: 14 }}>
            <span style={{ display: "flex", flexShrink: 0, color: eWARN }}><I.alertCircle size={17} /></span>
            This is a final action — it adds the selected skills to your development plan.
          </div>
          <EdBtn primary onClick={() => onSave(sel)}>Save Skills</EdBtn>
        </div>
      </div>
    </div>, document.body);
}

// ── Delete confirmation dialog ──
function PlConfirmDelete({ label, onNo, onYes }) {
  plUseEffect(() => { const onKey = (e) => { if (e.key === "Escape") onNo(); }; document.addEventListener("keydown", onKey); return () => document.removeEventListener("keydown", onKey); }, []);
  return ReactDOM.createPortal(
    <div onClick={onNo} style={{ position: "fixed", inset: 0, zIndex: 320, background: "rgba(0,15,71,.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 420, background: "var(--card)", borderRadius: 16, boxShadow: "0 40px 90px rgba(0,15,71,.35)", padding: "26px 26px 22px", textAlign: "center" }}>
        <div style={{ width: 54, height: 54, margin: "0 auto 16px", borderRadius: "50%", background: "color-mix(in srgb, var(--danger) 10%, transparent)", color: "var(--danger)", display: "flex", alignItems: "center", justifyContent: "center" }}><PlTrash size={24} /></div>
        <h2 style={{ fontFamily: "var(--sans)", fontSize: 20, fontWeight: 700, color: eMID, margin: "0 0 8px" }}>Are you sure you want to delete?</h2>
        <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, lineHeight: 1.55, margin: "0 0 22px" }}>This will remove {label} from your plan. This action can’t be undone.</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <EdBtn onClick={onNo}>No, keep it</EdBtn>
          <button onClick={onYes} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--danger)", color: "#fff", border: "none", borderRadius: 10, padding: "12px 20px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Yes, delete</button>
        </div>
      </div>
    </div>, document.body);
}

// ── User information card (plan owner snapshot) — 3 switchable designs ──
function PlUserInfo({ design }) {
  const u = LH.user;
  const email = u.first.toLowerCase() + "." + u.last.toLowerCase() + "@marsh.com";
  const fields = [
    ["Sub Function", "Human Resources"], ["Entity", "Star Trek Inc."],
    ["Job Level", "Management"], ["Action", "Yes"],
    ["Grade", "1A"], ["Qualification", "Masters in Business"],
    ["Department", "Department A"], ["Date of Joining Entity", "2023-04-26"],
  ];
  const lbl = { fontFamily: "var(--sans)", fontSize: 11.5, fontWeight: 500, color: eMUT, marginBottom: 1 };
  const val = { fontFamily: "var(--sans)", fontSize: 13.5, fontWeight: 600, color: eMID };
  const avatar = (sz) => (
    <div style={{ width: sz, height: sz, borderRadius: "50%", background: "var(--surface-deep)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--sans)", fontSize: Math.round(sz / 3), fontWeight: 700, flexShrink: 0, boxShadow: "0 0 0 3px color-mix(in srgb, var(--primary) 10%, transparent)" }}>{u.initials}</div>
  );
  const identity = (
    <div style={{ lineHeight: 1.35 }}>
      <div style={{ fontFamily: "var(--sans)", fontSize: 15.5, fontWeight: 700, color: eMID }}>{u.first} {u.last}</div>
      <div style={{ fontFamily: "var(--sans)", fontSize: 12.5, fontWeight: 600, color: "var(--accent)" }}>{u.role}</div>
      <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: eMUT }}>{email}</div>
    </div>
  );

  // Design 2 — soft pills: identity, then each field as a tinted rounded chip.
  if (design === 2) {
    return (
      <div style={{ background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 16, padding: "16px 20px", marginBottom: 22, boxShadow: "0 1px 2px rgba(0,15,71,.04)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 14 }}>
          {avatar(46)}{identity}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {fields.map(([k, v]) => (
            <div key={k} style={{ background: "color-mix(in srgb, var(--primary) 4%, transparent)", border: "1px solid " + eLINE, borderRadius: 10, padding: "6px 12px" }}>
              <div style={lbl}>{k}</div>
              <div style={val}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Design 3 — hero panel: tinted identity column on the left, metadata grid right.
  if (design === 3) {
    return (
      <div style={{ background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 16, marginBottom: 22, overflow: "hidden", display: "flex", flexWrap: "wrap", boxShadow: "0 1px 2px rgba(0,15,71,.04)" }}>
        <div style={{ flex: "0 0 auto", minWidth: 210, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10, padding: "18px 22px", background: "color-mix(in srgb, var(--primary) 5%, transparent)", borderRight: "1px solid " + eLINE }}>
          {avatar(52)}{identity}
        </div>
        <div style={{ flex: 1, minWidth: 260, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px 24px", alignContent: "center", padding: "18px 22px" }}>
          {fields.map(([k, v]) => (
            <div key={k}><div style={lbl}>{k}</div><div style={val}>{v}</div></div>
          ))}
        </div>
      </div>
    );
  }

  // Design 1 (default) — divided: identity | divider | inline label/value grid.
  return (
    <div style={{ background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 16, padding: "16px 20px", marginBottom: 22, display: "flex", gap: 20, flexWrap: "wrap", alignItems: "stretch", boxShadow: "0 1px 2px rgba(0,15,71,.04)" }}>
      {/* identity */}
      <div style={{ display: "flex", alignItems: "center", gap: 13, flex: "0 0 auto", paddingRight: 20, borderRight: "1px solid " + eLINE, minWidth: 200 }}>
        {avatar(46)}{identity}
      </div>
      {/* metadata — compact inline label / value pairs */}
      <div style={{ flex: 1, minWidth: 260, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "10px 22px", alignContent: "center" }}>
        {fields.map(([k, v]) => (
          <div key={k}><div style={lbl}>{k}</div><div style={val}>{v}</div></div>
        ))}
      </div>
    </div>
  );
}

// ── Reflective Questions tab — empty answer boxes (filled in the AI platform) + Save ──
// `forceError` (demo toggle) shows the "mandatory fields missing" error state up-front.
function PlReflectTab({ forceError, showToast }) {
  const QS = PL_REFLECT_QS;
  // Shared with the manager, who reads these and can edit them.
  const [ans, setAns] = plUseState(() => plLoadReflect(PL_OWNER));
  // Answered already? Then this is a read view with per-question editing —
  // the same pattern the manager side uses.
  const [saved, setSavedState] = plUseState(() => PL_REFLECT_QS.some((q, i) => ((plLoadReflect(PL_OWNER) || {})[i] || "").trim()));
  const [editing, setEditing] = plUseState(null);
  const [draft, setDraft] = plUseState("");
  // Persist on change — but skip the write if nothing actually differs, and ignore
  // our own change event, or the two would ping-pong forever.
  plUseEffect(() => {
    const cur = plLoadReflect(PL_OWNER);
    if (JSON.stringify(cur) !== JSON.stringify(ans)) plSaveReflect(PL_OWNER, ans);
  }, [ans]);
  plUseEffect(() => {
    const sync = () => setAns((prev) => {
      const next = plLoadReflect(PL_OWNER);
      return JSON.stringify(next) === JSON.stringify(prev) ? prev : next;
    });
    window.addEventListener(PL_REFLECT_EVENT, sync); window.addEventListener("storage", sync); window.addEventListener("focus", sync);
    return () => { window.removeEventListener(PL_REFLECT_EVENT, sync); window.removeEventListener("storage", sync); window.removeEventListener("focus", sync); };
  }, []);
  const [tried, setTried] = plUseState(false);
  const showErr = forceError || tried; // reveal errors after a failed save (or via the demo toggle)
  const missing = (i) => QS[i].req && !(ans[i] && ans[i].trim());
  const allReq = QS.every((it, i) => !it.req || (ans[i] && ans[i].trim()));
  const saveOne = (i) => {
    setAns((a) => ({ ...a, [i]: draft }));
    setEditing(null);
    if (showToast) showToast("Reflection updated");
  };

  if (saved) {
    return (
      <div style={{ maxWidth: 820 }}>
        {QS.map((it, i) => {
          const text = (ans[i] || "").trim();
          const on = editing === i;
          return (
            <div key={i} style={{ marginBottom: 22, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 12, padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 8 }}>
                <h3 style={{ flex: 1, minWidth: 0, fontFamily: "var(--sans)", fontSize: 15.5, fontWeight: 700, color: eMID, margin: 0, lineHeight: 1.45 }}>
                  {it.q}{!it.req && <span style={{ fontFamily: "var(--sans)", fontSize: 12, fontWeight: 600, color: "var(--ink)", background: "var(--status-neutral-bg)", borderRadius: 6, padding: "4px 10px", marginLeft: 8 }}>Optional</span>}
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
                    <EdBtn primary small onClick={() => saveOne(i)}>Save</EdBtn>
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

  return (
    <div style={{ maxWidth: 820 }}>
      {showErr && !allReq && (
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 22, background: "color-mix(in srgb, var(--danger) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--danger) 30%, transparent)", borderRadius: 10, padding: "11px 14px" }}>
          <span style={{ color: "var(--danger)", display: "flex", flexShrink: 0 }}><I.alertCircle size={16} /></span>
          <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMID }}>Please answer all required questions (marked <span style={{ color: "var(--danger)", fontWeight: 700 }}>*</span>) before saving.</span>
        </div>
      )}
      {QS.map((it, i) => {
        const err = showErr && missing(i);
        return (
        <div key={i} style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9, flexWrap: "wrap" }}>
            <h3 style={{ fontFamily: "var(--sans)", fontSize: 16, fontWeight: 700, color: eMID, margin: 0 }}>{it.q}{it.req && <span style={{ color: "var(--danger)", marginLeft: 3 }}>*</span>}</h3>
            {!it.req && <span style={{ fontFamily: "var(--sans)", fontSize: 12, fontWeight: 600, color: "var(--ink)", background: "var(--status-neutral-bg)", borderRadius: 6, padding: "4px 10px" }}>Optional</span>}
          </div>
          {(() => {
            const v = ans[i] || "";
            const words = v.trim() ? v.trim().split(/\s+/).length : 0;
            const over = it.max > 0 && words > it.max;
            return (
              <React.Fragment>
                <div style={{ border: "1.5px solid " + (err || over ? "var(--danger)" : "var(--field-line)"), borderRadius: 2, overflow: "hidden", background: err ? "color-mix(in srgb, var(--danger) 4%, transparent)" : "var(--card)" }}>
                  <textarea value={v} onChange={(e) => { const nv = e.target.value; setAns((a) => ({ ...a, [i]: nv })); setSavedState(false); }} placeholder="Write your reflection here…" rows={4}
                    style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", border: "none", background: "transparent", fontSize: 14, resize: "vertical", outline: "none", fontFamily: "var(--sans)", color: eINK, lineHeight: 1.6, display: "block" }} />
                  {/* word / character budget, the same counters the manual flow shows */}
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 18, padding: "7px 14px", borderTop: "1px solid " + eLINE, background: "rgba(0,15,71,.02)" }}>
                    <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: over ? "var(--danger)" : eMUT }}>Words : {words}</span>
                    <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT }}>Characters : {v.length}</span>
                  </div>
                </div>
                {(it.min || it.max) > 0 && !err && (
                  <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: over ? "var(--danger)" : eMUT, marginTop: 6 }}>
                    {over ? "That's over the " + it.max + " word limit." : "Must be between " + it.min + " and " + it.max + " words"}
                  </div>
                )}
              </React.Fragment>
            );
          })()}
          {err && <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, color: "var(--danger)", fontFamily: "var(--sans)", fontSize: 14 }}><I.alertCircle size={13} /> This question is required.</div>}
        </div>
        );
      })}
      <div style={{ borderTop: "1px solid " + eLINE, marginTop: 8, paddingTop: 20, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: eMUT, fontFamily: "var(--sans)", fontSize: 14 }}>
          <span style={{ color: "var(--danger)", fontWeight: 700 }}>*</span> Required — answer all starred questions before saving.
        </div>
        <EdBtn primary onClick={() => { if (allReq) setSavedState(true); else setTried(true); }}>Save Reflections</EdBtn>
      </div>
      {saved && allReq && (
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 16, background: "color-mix(in srgb, var(--success) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--success) 26%, transparent)", borderRadius: 10, padding: "11px 14px" }}>
          <span style={{ color: eSUCCESS, display: "flex" }}><I.check size={16} /></span>
          <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMID }}>Your reflections have been saved.</span>
        </div>
      )}
    </div>
  );
}

// ── Program Report tab (reuses the report document from the Insights reader) ──
function PlReportTab() {
  const RP = window.EdGrowth && window.EdGrowth.ReportPage;
  const rpt = { name: "Leadership Program Report", based: ["Leadership Assessment"], pages: 3 };
  const a4 = { width: "100%", maxWidth: 720, margin: "0 auto", aspectRatio: "210 / 297", borderRadius: 10, boxShadow: "0 6px 30px rgba(0,15,71,.10)", boxSizing: "border-box", display: "flex", flexDirection: "column" };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingTop: 8 }}>
      {[0, 1, 2].map((i) => i === 0 ? (
        <div key={i} className="ed-report-page" style={{ ...a4, background: "radial-gradient(120% 120% at 15% 0%, rgba(206,236,255,.16), transparent 55%), linear-gradient(150deg, var(--surface-deep), #001F8C)", padding: 56, overflow: "hidden", justifyContent: "space-between" }}>
          <svg viewBox="0 0 43.17 44.26" width="36" height="37" aria-hidden="true"><polygon fill="#fff" points="42.49 0 21.65 30.43 22.2 30.43 35.07 24.39 35.07 44.26 43.17 44.26 43.17 0 42.49 0" /><polygon fill="#fff" points="0 0 0 44.26 8.1 44.26 8.1 24.4 20.9 30.43 21.52 30.43 .68 0 0 0" /></svg>
          <div>
            <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "#CEECFF", marginBottom: 14 }}>Confidential · For internal use only</div>
            <h1 className="serif" style={{ fontSize: 40, color: "#fff", lineHeight: 1.06, margin: 0, maxWidth: 440 }}>Leadership Program Report</h1>
          </div>
          <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: "rgba(206,236,255,.7)" }}>Marsh · All rights reserved</div>
        </div>
      ) : (
        <div key={i} className="ed-report-page" style={{ ...a4, background: "var(--card)", border: "1px solid " + eLINE, padding: "48px 52px" }}>
          <div style={{ flex: 1, minHeight: 0 }}>{RP ? <RP report={rpt} page={i} /> : null}</div>
        </div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════
function EdPlanPage({ onBack, onRestart, startLocked }) {
  const [tab, setTab] = plUseState("plan");
  // Which action-card design (see PL_SAMPLES). 6 by default, and the choice sticks —
  // the manager side already remembers its own the same way.
  const [sample, setSample] = plUseState(() => { const v = parseInt(localStorage.getItem("pl-plan-design"), 10); return v >= 1 && v <= 10 ? v : 6; });
  const [sampleMenu, setSampleMenu] = plUseState(false);
  // Sample 10 (accordion) — the key "ci-si" of the one open skill; "" means all closed.
  const [openSkill, setOpenSkill] = plUseState("0-0");
  // User-info presentation. 4 (default) hides the info card entirely and puts the
  // owner's name in the page title instead; 1–3 are the card layouts.
  const [userCard, setUserCard] = plUseState(() => { const v = parseInt(localStorage.getItem("pl-usercard-design"), 10); return v >= 1 && v <= 4 ? v : 4; });
  const [userCardMenu, setUserCardMenu] = plUseState(false);
  const [reflectErr, setReflectErr] = plUseState(false); // demo: force the Reflective-questions error state
  const [reflectMenu, setReflectMenu] = plUseState(false);
  const reflectRef = plUseRef(null);
  const [triedSave, setTriedSave] = plUseState(false); // user pressed Save with dates missing
  const userCardRef = plUseRef(null);
  // The plan is shared state: it survives reloads and is what the manager reviews.
  const [data, setData] = plUseState(() => plLoadPlan(PL_OWNER) || plClone(PL_SEED));
  // A generated plan opens in EDIT mode (Save Plan). A manually built one opens in
  // the read view, so the owner sees the empty skills and chooses to edit.
  const [locked, setLocked] = plUseState(!!startLocked);
                                                      // after saving it becomes the read view (Edit / Submit Plan)
  const [toast, setToast] = plUseState(null);
  const [comments, setComments] = plUseState(null);   // skill name whose comments are open, or "" for global
  const [readSkills, setReadSkills] = plUseState([]);  // threads the user has opened (clears the unread dot)
  const isUnread = (name) => PL_NEW_MSG_SKILLS.includes(name) && readSkills.indexOf(name) < 0;
  const anyUnread = PL_NEW_MSG_SKILLS.some((n) => readSkills.indexOf(n) < 0);
  const openComments = (name) => { setComments(name); setReadSkills((rs) => name ? (rs.indexOf(name) < 0 ? rs.concat(name) : rs) : PL_NEW_MSG_SKILLS.slice()); };
  const [modal, setModal] = plUseState(null);         // { kind, ci, si }
  const [addSkills, setAddSkills] = plUseState(false);
  const [confirmDel, setConfirmDel] = plUseState(null); // { label, onYes }
  const [submitted, setSubmitted] = plUseState(false); // submitted → locked, awaiting manager approval
  // The manager's verdict on this plan, written back by the Manager workspace.
  const [decision, setDecision] = plUseState(() => plSubmission());
  plUseEffect(() => {
    const sync = () => setDecision(plSubmission());
    window.addEventListener("focus", sync); window.addEventListener("storage", sync);
    return () => { window.removeEventListener("focus", sync); window.removeEventListener("storage", sync); };
  }, []);
  // every edit lands in the shared store, so the manager's view is always current
  plUseEffect(() => { plSavePlan(PL_OWNER, data); }, [data]);
  const verdict = decision && (decision.status === "approved" || decision.status === "rejected") ? decision : null;
  const storeStatus = decision && decision.status;
  // Waiting on the manager — either queued (pending) or actively being reviewed.
  const awaiting = (submitted || storeStatus === "pending" || storeStatus === "review") && !verdict;
  // Once the manager has ruled — either way — the plan is READ ONLY: the owner reads
  // the note first. Editing is a deliberate act that sends the plan back to Draft.
  const editable = !locked && !awaiting && !verdict;
  const reopen = () => {
    setLocked(false); setSubmitted(false); setDecision({ status: "draft", at: Date.now() });
    try { localStorage.setItem("lh-idp-submission", JSON.stringify({ status: "draft", at: Date.now() })); } catch (e) {}
    showToast("Plan reopened — back to draft");
  };
  // Once the manager has approved it, finishing the work is the owner's own call.
  // Kept as a flag beside the approval, so the manager still reads "Approved".
  const completed = !!(verdict && verdict.status === "approved" && decision && decision.completed);
  const markComplete = () => {
    const next = { ...(decision || {}), completed: true, completedAt: Date.now() };
    setDecision(next);
    try { localStorage.setItem("lh-idp-submission", JSON.stringify(next)); } catch (e) {}
    showToast("Plan marked as complete");
  };

  // Close the plan-design sample menu on outside click / Escape.
  const sampleRef = plUseRef(null);
  plUseEffect(() => {
    if (!sampleMenu) return;
    const onDoc = (e) => { if (sampleRef.current && !sampleRef.current.contains(e.target)) setSampleMenu(false); };
    const onKey = (e) => { if (e.key === "Escape") setSampleMenu(false); };
    document.addEventListener("mousedown", onDoc); document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [sampleMenu]);
  plUseEffect(() => {
    if (!userCardMenu) return;
    const onDoc = (e) => { if (userCardRef.current && !userCardRef.current.contains(e.target)) setUserCardMenu(false); };
    const onKey = (e) => { if (e.key === "Escape") setUserCardMenu(false); };
    document.addEventListener("mousedown", onDoc); document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [userCardMenu]);
  plUseEffect(() => {
    if (!reflectMenu) return;
    const onDoc = (e) => { if (reflectRef.current && !reflectRef.current.contains(e.target)) setReflectMenu(false); };
    const onKey = (e) => { if (e.key === "Escape") setReflectMenu(false); };
    document.addEventListener("mousedown", onDoc); document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [reflectMenu]);
  const pickUserCard = (n) => { setUserCard(n); localStorage.setItem("pl-usercard-design", String(n)); setUserCardMenu(false); };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2600); };
  const mutate = (fn) => setData((d) => { const n = plClone(d); fn(n); return n; });

  // Start + end dates are mandatory on every development action (completion is not).
  const missingDates = [];
  data.forEach((cat) => cat.skills.forEach((sk) => sk.actions.forEach((a) => { if (!a.start || !a.end) missingDates.push(a.id); })));
  const dateErrIds = missingDates;
  // The date-validation error belongs to Sample 8 only — it's the design that shows
  // the "save blocked" state. Every other design saves straight away (demo mode).
  const showDateErr = sample === 8 && (triedSave || missingDates.length > 0) && missingDates.length > 0;

  // Link the chat to the plan: opening a skill's thread scrolls that skill into view.
  plUseEffect(() => {
    if (!comments) return;
    const sel = "[data-skill=\"" + (typeof CSS !== "undefined" && CSS.escape ? CSS.escape(comments) : comments) + "\"]";
    const el = document.querySelector(sel);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [comments]);
  // While the comments panel is open it covers the right edge — flag the document so
  // the floating chrome (Plan design / All directions / gear / help) shifts left and
  // doesn't hide the message composer. Cleared when the panel closes.
  plUseEffect(() => {
    const el = document.documentElement;
    if (comments != null) el.setAttribute("data-lh-comments", "1"); else el.removeAttribute("data-lh-comments");
    return () => el.removeAttribute("data-lh-comments");
  }, [comments]);

  const modalSkill = modal ? data[modal.ci].skills[modal.si] : null;
  const addActions = (arr) => { mutate((n) => { arr.forEach((a) => n[modal.ci].skills[modal.si].actions.push({ id: ++PL_UID, ...a })); }); setModal(null); showToast("Development action(s) added"); };

  // "Save Plan" only becomes active once every development action has a start and
  // end date — the fields you fill in while editing the freshly generated plan.
  const canSave = data.every((c) => c.skills.every((s) => s.actions.every((a) => a.start && a.end)));
  const pushRoom = plUsePushRoom(comments);

  return (
    <div className="ed-plan-wrap" style={{ paddingRight: comments != null && pushRoom ? PL_PANEL_W : 0, transition: "padding .25s ease" }}>
    <div style={{ maxWidth: "var(--content-max)", margin: "28px var(--fol-mx) 72px" }}>
      {/* header */}
      {/* Title left, actions hard right. The status sits under the heading so a long
          name can never push the buttons onto a second line. */}
      <div className="ed-plan-head" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 6 }}>
        {/* The status rides beside the title while there's room for it, and drops
            onto its own line when the actions on the right leave none. */}
        <div style={{ flex: "1 1 auto", minWidth: 0, display: "flex", flexWrap: "wrap", alignItems: "center", gap: "9px 12px" }}>
          <h1 style={{ fontFamily: "var(--sans)", fontSize: 22, fontWeight: 700, color: eMID, margin: 0, lineHeight: 1.3, minWidth: 0 }}>{userCard === 4 ? LH.user.first + " " + LH.user.last + ", Development Plan" : "Development Plan"}</h1>
          <span style={{ flexShrink: 0, display: "inline-flex" }}>
            <PlStatusBadge status={completed ? "completed" : verdict ? verdict.status : storeStatus === "review" ? "review" : awaiting ? "pending" : "draft"} />
          </span>
        </div>
      </div>

      {/* the manager's note, once they've approved or sent the plan back */}
      {verdict && <div style={{ marginTop: 16 }}><PlDecisionNote status={verdict.status} note={verdict.note} when={plWhen(verdict.at)} /></div>}

      {/* User information — a snapshot of the plan owner, shown above the tabs */}
      {userCard !== 4 && <PlUserInfo design={userCard} />}

      {/* tabs — same structure/colours as the program task-detail tabs (Intro / Tasks / Reports) */}
      {/* Tabs left, plan actions right — mirrors the manager's detail layout. */}
      <div className="ed-tabs" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", borderBottom: "1px solid " + eLINE, marginTop: 22, marginBottom: 30 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 2, minWidth: 0, flexWrap: "wrap" }}>
        {[["plan", "Plan"], ["report", "Program Report"], ["reflect", "Reflective Questions"]].map(([k, l]) => {
          const on = tab === k;
          return <button key={k} onClick={() => setTab(k)} className={"ed-tabbtn" + (on ? " ed-tabbtn-on" : "")} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--sans)", fontSize: 14, fontWeight: on ? 700 : 500, color: on ? eMID : eMUT, padding: "10px 18px", borderBottom: "2px solid " + (on ? eMID : "transparent"), marginBottom: -1, transition: "color .15s" }}>{l}</button>;
        })}
        </div>
        {/* plan actions belong to the Plan tab, as in the manager */}
        {tab === "plan" && <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, paddingBottom: 8 }}>
        {/* Add Skills leads the plan actions, left of Download. */}
          {editable && (
            <button onClick={() => setAddSkills(true)} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--card)", color: eMID, border: "1px solid " + eLINE, borderRadius: 9, padding: "8px 14px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "border-color .15s, background .15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = eMID; e.currentTarget.style.background = "rgba(0,15,71,.03)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = eLINE; e.currentTarget.style.background = "var(--card)"; }}>
            <I.plus size={15} /> Add Skills
          </button>
          )}
          <button title="Download" style={{ width: 38, height: 38, borderRadius: 9, border: "1px solid " + eLINE, background: "var(--card)", color: eMID, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><I.download size={17} /></button>
          {verdict
            // decided → read view: reopen as a draft, or (once approved) mark it done
            ? <React.Fragment>
                <EdBtn small onClick={reopen}><I.edit size={15} /> Edit Plan</EdBtn>
                {verdict.status === "approved" && !completed &&
                  <EdBtn primary small onClick={markComplete}><I.checkCircle size={15} /> Mark as Complete</EdBtn>}
              </React.Fragment>
            : awaiting
            ? null
            : locked
            ? <React.Fragment>
                <EdBtn small onClick={() => setLocked(false)}><I.edit size={15} /> Edit Plan</EdBtn>
                <EdBtn primary small onClick={() => {
                  setSubmitted(true);
                  // Hand the submission to the Manager workspace (Direct Reportees).
                  // Resubmitting after a rejection clears the old verdict.
                  const sub = { status: "pending", at: Date.now() };
                  setDecision(sub);
                  try { localStorage.setItem("lh-idp-submission", JSON.stringify(sub)); } catch (e) {}
                  showToast("Plan submitted — pending approval");
                }}>Submit Plan</EdBtn>
              </React.Fragment>
            : <EdBtn primary small onClick={() => {
                // Sample 8 demonstrates the blocked save; the other designs save as usual.
                if (sample === 8 && missingDates.length) { setTriedSave(true); showToast("Add start and end dates before saving"); return; }
                setTriedSave(false); setLocked(true); showToast("Plan saved");
              }}>Save Plan</EdBtn>}
          <button onClick={() => { if (comments == null) openComments(""); else setComments(null); }} title={anyUnread ? "New message from your manager" : "Comments"} style={{ position: "relative", width: 38, height: 38, borderRadius: 9, border: "1px solid " + (comments != null ? eMID : anyUnread ? "var(--danger)" : eLINE), background: comments != null ? eMID : "var(--card)", color: comments != null ? "#fff" : eMID, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <I.chat size={17} />
            {anyUnread && comments == null && <span style={{ position: "absolute", top: 6, right: 6, width: 9, height: 9, borderRadius: 999, background: "var(--danger)", border: "1.5px solid var(--card)" }} />}
          </button>
        </div>}
      </div>

      {tab === "report" ? <PlReportTab /> : tab === "reflect" ? <PlReflectTab forceError={reflectErr} showToast={showToast} /> : (
        <React.Fragment>
          {/* Save blocked — required start / end dates are missing on one or more actions. */}
          {showDateErr && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, margin: "0 0 6px", background: "color-mix(in srgb, var(--danger) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--danger) 30%, transparent)", borderRadius: 12, padding: "13px 16px" }}>
              <span style={{ color: "var(--danger)", display: "flex", flexShrink: 0, marginTop: 1 }}><I.alertCircle size={17} /></span>
              <div>
                <div style={{ fontFamily: "var(--sans)", fontSize: 14.5, fontWeight: 700, color: eMID }}>We couldn't save your plan</div>
                <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.5, marginTop: 2 }}>
                  {missingDates.length} development action{missingDates.length === 1 ? "" : "s"} still need a start and end date. Set the highlighted dates below, then save again. Completion can be left at 0%.
                </div>
              </div>
            </div>
          )}
          {/* Sample 10 · plan-wide summary bar under the tabs */}
          {sample === 10 && (() => {
            const st = plStats(data);
            const status = completed ? "completed" : verdict ? verdict.status : awaiting ? (storeStatus === "review" ? "review" : "pending") : "draft";
            return <PlPlanSummary stats={st} status={status} />;
          })()}
          {data.map((cat, ci) => (
            <div key={ci} style={{ marginTop: 26 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 18 }}>
                <div style={{ width: 46, height: 46, borderRadius: 23, background: "rgba(0,15,71,.06)", color: eMID, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{React.createElement(I[cat.icon], { size: 22 })}</div>
                <h2 style={{ fontFamily: "var(--sans)", fontSize: 22, fontWeight: 700, color: eMID, margin: 0 }}>{cat.cat}</h2>
              </div>

              {cat.skills.map((skill, si) => {
                const active = comments === skill.name; // this skill's message thread is open → highlight it
                const acc = sample === 10;              // accordion layout (single skill open at a time)
                const openKey = ci + "-" + si;
                const open = !acc || openSkill === openKey;
                const sActs = skill.actions.length;
                const sPct = sActs ? Math.round(skill.actions.reduce((t, a) => t + (a.completion || 0), 0) / sActs) : 0;

                // Shared header controls — identical whether flat or accordion.
                const stars = <PlStars value={skill.rating} readOnly={!editable} onChange={(v) => mutate((n) => { n[ci].skills[si].rating = v; })} />;
                const pub = editable ? <PlPubToggle isPublic={skill.isPublic} onToggle={() => { mutate((n) => { n[ci].skills[si].isPublic = !skill.isPublic; }); showToast("Skill '" + skill.name + "' has been marked as " + (skill.isPublic ? "private and will be hidden from your manager" : "public")); }} /> : <PlVisBadge isPublic={skill.isPublic} />;
                const commentBtn = (
                  <button onClick={() => openComments(skill.name)} title={isUnread(skill.name) ? "New message" : "Comments"} style={{ position: "relative", background: "none", border: "none", cursor: "pointer", color: isUnread(skill.name) ? "var(--danger)" : eMUT, display: "flex" }}>
                    <I.chat size={18} />
                    {isUnread(skill.name) && <span style={{ position: "absolute", top: -3, right: -3, width: 9, height: 9, borderRadius: 999, background: "var(--danger)", border: "1.5px solid var(--card)" }} />}
                  </button>
                );
                const delBtn = editable ? <button onClick={() => setConfirmDel({ label: "the skill “" + skill.name + "”", onYes: () => { mutate((n) => { n[ci].skills.splice(si, 1); }); showToast("Skill removed"); } })} title="Remove skill" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--danger)", display: "flex", alignItems: "center", justifyContent: "center", padding: 4 }}><PlTrash size={16} /></button> : null;

                // action cards (design chosen via the plan-design sample switcher)
                const actionsNode = (
                  <React.Fragment>
                    {skill.actions.length === 0 && <PlNoActions editable={editable} />}
                    {skill.actions.length > 0 && (() => {
                    const cards = skill.actions.map((a, ai) => (
                      <PlActionCard key={a.id} action={a} editable={editable} sample={sample === 8 ? 1 : sample} last={ai === skill.actions.length - 1}
                        dateErr={showDateErr && dateErrIds.indexOf(a.id) !== -1}
                        onDate={(v) => mutate((n) => { Object.assign(n[ci].skills[si].actions[ai], v); })}
                        onComplete={(v) => mutate((n) => { n[ci].skills[si].actions[ai].completion = v; })}
                        onDelete={() => setConfirmDel({ label: a.title ? "the action “" + a.title + "”" : "this development action", onYes: () => { mutate((n) => { n[ci].skills[si].actions.splice(ai, 1); }); showToast("Development action removed"); } })} />
                    ));
                    // Samples 4 & 6 group the rows inside one shared card, split by
                    // dividers, under a labelled column header (Action / Start–End /
                    // Completion). Sample 4 keeps an inline delete column; sample 6 tucks
                    // delete at each row's bottom-right, so it needs no delete spacer.
                    return (sample === 4 || sample === 6)
                      ? <div style={{ background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 12, padding: sample === 6 ? "6px 16px" : "0 16px 2px", boxShadow: "0 1px 3px rgba(0,15,71,.05)", marginBottom: 6 }}>
                          {sample === 4 && (
                            <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "13px 2px 9px", borderBottom: "1px solid " + eLINE }}>
                              <span style={{ width: 8, flexShrink: 0 }} />
                              <div style={{ ...plMetaLabel, margin: 0, flex: "1 1 260px", minWidth: 0 }}>Development action</div>
                              <div style={{ ...plMetaLabel, margin: 0, width: 168, flexShrink: 0 }}>Start – End date</div>
                              <div style={{ ...plMetaLabel, margin: 0, width: 148, flexShrink: 0 }}>Completion</div>
                              {editable && <span style={{ width: 24, flexShrink: 0 }} />}
                            </div>
                          )}
                          {cards}
                        </div>
                      : sample === 9
                      // Sample 9 lays the action cards out two per row (one column on narrow screens).
                      ? <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 12, alignItems: "stretch", marginBottom: 6 }}>{cards}</div>
                      : cards;
                  })()}
                  </React.Fragment>
                );

                // per-skill add row
                const addRowNode = editable ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap", padding: "14px 0 6px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center" }}>
                      <button onClick={() => setModal({ kind: "own", ci, si })} style={plLink}><I.plus size={15} /> Create my own</button>
                      <PlInfoTip label="Create my own" text={PL_ADD_TIPS.own} />
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center" }}>
                      <button onClick={() => setModal({ kind: "library", ci, si })} style={plLink}><I.plus size={15} /> Pick from our development library</button>
                      <PlInfoTip label="Pick from our development library" text={PL_ADD_TIPS.library} />
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center" }}>
                      <button onClick={() => setModal({ kind: "ai", ci, si })} style={plLink}><I.plus size={15} /> Create with AI</button>
                      <PlInfoTip label="Create with AI" text={PL_ADD_TIPS.ai} />
                    </span>
                  </div>
                ) : null;

                // ── Accordion layout (Sample 10) — no box; the plain skill heading with a
                //    leading arrow, a divider line between skills, and the body collapsing.
                //    Collapsed shows exactly the heading (name, rating, public, chat, delete). ──
                if (acc) {
                  return (
                    <div key={si} data-skill={skill.name} style={{ borderTop: si > 0 ? "1px solid " + eLINE : "none", background: active ? "color-mix(in srgb, var(--accent) 5%, transparent)" : "transparent", outline: active ? "2px solid color-mix(in srgb, var(--accent) 35%, transparent)" : "none", outlineOffset: -2 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", padding: open ? "16px 0 14px" : "16px 0" }}>
                        <button onClick={() => setOpenSkill(open ? "" : openKey)} title={open ? "Collapse" : "Expand"} style={{ background: "none", border: "none", cursor: "pointer", color: eMUT, display: "flex", padding: 2, marginLeft: -2 }}>
                          <span style={{ display: "flex", transition: "transform .2s", transform: open ? "none" : "rotate(-90deg)" }}><I.chevD size={18} /></span>
                        </button>
                        <h3 onClick={() => setOpenSkill(open ? "" : openKey)} style={{ fontFamily: "var(--sans)", fontSize: 18, fontWeight: 700, color: eMID, margin: 0, cursor: "pointer" }}>{skill.name}</h3>
                        {stars}
                        {pub}
                        <div style={{ flex: 1 }} />
                        {commentBtn}
                        {delBtn}
                      </div>
                      {open && <div style={{ paddingBottom: 16 }}>{actionsNode}{addRowNode}</div>}
                    </div>
                  );
                }

                // ── Flat layout (Samples 1–9, unchanged) ──
                return (
                <div key={si} data-skill={skill.name} style={{ borderRadius: 12, transition: "background .2s", background: active ? "color-mix(in srgb, var(--accent) 5%, transparent)" : "transparent", outline: active ? "2px solid color-mix(in srgb, var(--accent) 35%, transparent)" : "none", outlineOffset: -2, padding: active ? "8px 12px" : 0, margin: active ? (si > 0 ? "28px -12px 6px" : "0 -12px 6px") : (si > 0 ? "28px 0 6px" : "0 0 6px") }}>
                  {/* skill header */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", padding: "6px 0 14px" }}>
                    <h3 style={{ fontFamily: "var(--sans)", fontSize: 18, fontWeight: 700, color: eMID, margin: 0 }}>{skill.name}</h3>
                    {stars}
                    {pub}
                    <div style={{ flex: 1 }} />
                    {commentBtn}
                    {delBtn}
                  </div>
                  {actionsNode}
                  {addRowNode}
                </div>
                );
              })}
            </div>
          ))}
          {/* Add Skills now lives in the tab row (top right), not at the end of the plan. */}
        </React.Fragment>
      )}

      {/* toast */}
      {toast && (
        <div style={{ position: "fixed", top: 70, left: "50%", transform: "translateX(-50%)", zIndex: 200, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 10, boxShadow: "0 10px 34px rgba(0,15,71,.18)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, maxWidth: 520 }}>
          <span style={{ color: eSUCCESS, display: "flex", flexShrink: 0 }}><I.check size={18} /></span>
          <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMID }}>{toast}</span>
        </div>
      )}

      {/* modals */}
      {modal && modal.kind === "own" && <PlCreateOwnModal skillName={modalSkill.name} onClose={() => setModal(null)} onAdd={(a) => addActions([a])} />}
      {modal && modal.kind === "library" && <PlLibraryModal skillName={modalSkill.name} onClose={() => setModal(null)} onAdd={addActions} />}
      {modal && modal.kind === "ai" && <PlAiModal skillName={modalSkill.name} onClose={() => setModal(null)} onAdd={addActions} />}

      {/* Add Skills — full-page modal (replaces the old separate page) */}
      {addSkills && <PlAddSkills
        current={["Behavioral", "Technical"].map((name) => {
          const cat = data.find((c) => c.cat === name);
          return cat ? cat.skills.map((sk) => sk.name) : [];
        })}
        onClose={() => setAddSkills(false)}
        onSave={(sel) => {
          // Add everything newly ticked. A skill that was un-ticked is only dropped
          // when it has no development actions — never silently discard real work.
          let added = 0, removed = 0, kept = 0;
          mutate((n) => {
            ["Behavioral", "Technical"].forEach((name, ci) => {
              const want = sel[ci] || [];
              let cat = n.find((c) => c.cat === name);
              if (!cat && want.length) { cat = { cat: name, icon: name === "Technical" ? "monitor" : "bulb", skills: [] }; n.push(cat); }
              if (!cat) return;
              cat.skills = cat.skills.filter((sk) => {
                if (want.indexOf(sk.name) >= 0) return true;
                if ((sk.actions || []).length) { kept += 1; return true; }
                removed += 1; return false;
              });
              want.forEach((nm) => {
                if (!cat.skills.some((sk) => sk.name === nm)) { cat.skills.push({ name: nm, rating: 0, isPublic: true, actions: [] }); added += 1; }
              });
            });
            // drop a category that has ended up empty
            for (let k = n.length - 1; k >= 0; k--) if (!n[k].skills.length) n.splice(k, 1);
          });
          setAddSkills(false);
          const bits = [];
          if (added) bits.push(added + (added === 1 ? " skill added" : " skills added"));
          if (removed) bits.push(removed + " removed");
          if (kept) bits.push(kept + " kept (has actions)");
          showToast(bits.length ? bits.join(" · ") : "No changes to your skills");
        }} />}

      {/* Delete confirmation */}
      {confirmDel && <PlConfirmDelete label={confirmDel.label} onNo={() => setConfirmDel(null)} onYes={() => { confirmDel.onYes(); setConfirmDel(null); }} />}

      {/* comments */}
      {comments != null && <PlComments chip={comments || null} skills={plSkillNames(data)} onClose={() => setComments(null)} onOpen={(name) => openComments(name || "")} />}

      {/* Plan-design sample switcher — floats near the Marsh / All-directions chrome,
          only on the Plan tab. The chosen design carries into the saved (read) view. */}
      {tab === "plan" && ReactDOM.createPortal(
        <div ref={sampleRef} className="ed-plan-sample-chip" style={{ position: "fixed", right: 200, bottom: 14, zIndex: 60, fontFamily: "var(--sans)" }}>
          {sampleMenu && (
            <div style={{ position: "absolute", bottom: 44, right: 0, width: 268, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 12, boxShadow: "0 12px 36px rgba(0,15,71,.18)", padding: 7 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: eMUT, padding: "6px 9px 4px" }}>Plan design</div>
              {PL_SAMPLES.map((s) => { const on = sample === s.id; return (
                <button key={s.id} onClick={() => { setSample(s.id); try { localStorage.setItem("pl-plan-design", String(s.id)); } catch (e) {} setSampleMenu(false); }} style={{ width: "100%", display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 9px", borderRadius: 8, border: "none", background: on ? "color-mix(in srgb, var(--accent) 7%, transparent)" : "transparent", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ width: 16, flexShrink: 0, marginTop: 2, color: eBLUE, display: "flex", justifyContent: "center" }}>{on ? <I.check size={15} /> : null}</span>
                  <span><span style={{ display: "block", fontSize: 14, fontWeight: 600, color: on ? eMID : eINK }}>{s.label}</span><span style={{ display: "block", fontSize: 14, color: eMUT, lineHeight: 1.4 }}>{s.desc}</span></span>
                </button>); })}
            </div>
          )}
          <button onClick={() => setSampleMenu((v) => !v)} title="Switch the plan card design" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 999, padding: "7px 14px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eMID, cursor: "pointer", boxShadow: "0 2px 10px rgba(0,15,71,.10)" }}>
            <I.layers size={14} /> Plan design · {sample}
          </button>
        </div>, document.body)}

      {/* User-info card design switcher — floats to the left of the plan-design chip. */}
      {ReactDOM.createPortal(
        <div ref={userCardRef} className="ed-plan-usercard-chip" style={{ position: "fixed", right: 200, bottom: 56, zIndex: 60, fontFamily: "var(--sans)" }}>
          {userCardMenu && (
            <div style={{ position: "absolute", bottom: 44, right: 0, width: 250, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 12, boxShadow: "0 12px 36px rgba(0,15,71,.18)", padding: 7 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: eMUT, padding: "6px 9px 4px" }}>User card design</div>
              {[[4, "Name in title", "No info bar — name sits in the heading"], [1, "Divided", "Identity beside a metadata grid"], [2, "Pills", "Details as soft tinted chips"], [3, "Hero panel", "Tinted identity column"]].map(([id, label, desc]) => { const on = userCard === id; return (
                <button key={id} onClick={() => pickUserCard(id)} style={{ width: "100%", display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 9px", borderRadius: 8, border: "none", background: on ? "color-mix(in srgb, var(--accent) 7%, transparent)" : "transparent", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ width: 16, flexShrink: 0, marginTop: 2, color: eBLUE, display: "flex", justifyContent: "center" }}>{on ? <I.check size={15} /> : null}</span>
                  <span><span style={{ display: "block", fontSize: 14, fontWeight: 600, color: on ? eMID : eINK }}>{label}</span><span style={{ display: "block", fontSize: 14, color: eMUT, lineHeight: 1.4 }}>{desc}</span></span>
                </button>); })}
            </div>
          )}
          <button onClick={() => setUserCardMenu((v) => !v)} title="Switch the user-info card design" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 999, padding: "7px 14px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eMID, cursor: "pointer", boxShadow: "0 2px 10px rgba(0,15,71,.10)" }}>
            <I.user size={14} /> User card · {userCard}
          </button>
        </div>, document.body)}

      {/* Reflective-questions error preview — floats only on the Reflect tab. */}
      {tab === "reflect" && ReactDOM.createPortal(
        <div ref={reflectRef} className="ed-plan-usercard-chip" style={{ position: "fixed", right: 200, bottom: 14, zIndex: 60, fontFamily: "var(--sans)" }}>
          {reflectMenu && (
            <div style={{ position: "absolute", bottom: 44, right: 0, width: 250, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 12, boxShadow: "0 12px 36px rgba(0,15,71,.18)", padding: 7 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: eMUT, padding: "6px 9px 4px" }}>Reflective questions</div>
              {[[false, "Normal", "Empty answer boxes"], [true, "Error", "Mandatory fields not filled"]].map(([val, label, desc]) => { const on = reflectErr === val; return (
                <button key={label} onClick={() => { setReflectErr(val); setReflectMenu(false); }} style={{ width: "100%", display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 9px", borderRadius: 8, border: "none", background: on ? "color-mix(in srgb, var(--accent) 7%, transparent)" : "transparent", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ width: 16, flexShrink: 0, marginTop: 2, color: eBLUE, display: "flex", justifyContent: "center" }}>{on ? <I.check size={15} /> : null}</span>
                  <span><span style={{ display: "block", fontSize: 14, fontWeight: 600, color: on ? eMID : eINK }}>{label}</span><span style={{ display: "block", fontSize: 14, color: eMUT, lineHeight: 1.4 }}>{desc}</span></span>
                </button>); })}
            </div>
          )}
          <button onClick={() => setReflectMenu((v) => !v)} title="Preview the Reflective-questions error state" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: reflectErr ? "color-mix(in srgb, var(--danger) 10%, transparent)" : "var(--card)", border: "1px solid " + (reflectErr ? "color-mix(in srgb, var(--danger) 40%, transparent)" : eLINE), borderRadius: 999, padding: "7px 14px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: reflectErr ? "var(--danger)" : eMID, cursor: "pointer", boxShadow: "0 2px 10px rgba(0,15,71,.10)" }}>
            <I.alertCircle size={14} /> Reflect · {reflectErr ? "Error" : "Normal"}
          </button>
        </div>, document.body)}
    </div>
    </div>
  );
}

const plLink = { display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: eBLUE, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, padding: 0 };

// ── Custom two-month date-range picker (replaces the native date inputs) ──
const PL_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const PL_DOW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const plIso = (d) => { const p = (n) => String(n).padStart(2, "0"); return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()); };
const plParse = (s) => { if (!s) return null; const a = String(s).split("-").map(Number); return new Date(a[0], a[1] - 1, a[2]); };
const plFmt = (s) => { const d = plParse(s); return d ? d.getDate() + " " + PL_MONTHS[d.getMonth()].slice(0, 3) + " " + d.getFullYear() : ""; };
const plFmtShort = (s) => { const d = plParse(s); return d ? d.getDate() + " " + PL_MONTHS[d.getMonth()].slice(0, 3) : ""; };
const plSameDay = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

// ── Sample 10 (accordion) helpers ──────────────────────────────────────────
// Rounded human duration between two ISO dates (used beside the source label).
const plDur = (a, b) => { const s = plParse(a), e = plParse(b); if (!s || !e) return ""; const days = Math.round((e - s) / 86400000); if (days <= 0) return ""; if (days < 14) return days + " day" + (days === 1 ? "" : "s"); if (days < 60) { const w = Math.round(days / 7); return w + " week" + (w === 1 ? "" : "s"); } const mo = Math.max(1, Math.round(days / 30.4)); return mo + " month" + (mo === 1 ? "" : "s"); };
// Roll the whole plan up into the numbers the summary bar shows.
function plStats(data) {
  let skills = 0, actions = 0, complete = 0, sum = 0, overdue = 0, minS = null, maxE = null;
  const today = new Date();
  (data || []).forEach((c) => (c.skills || []).forEach((s) => {
    skills += 1;
    (s.actions || []).forEach((a) => {
      actions += 1; const pc = a.completion || 0; sum += pc; if (pc >= 100) complete += 1;
      const e = plParse(a.end); if (e && pc < 100 && e < today) overdue += 1;
      const st = plParse(a.start); if (st && (!minS || st < minS)) minS = st;
      if (e && (!maxE || e > maxE)) maxE = e;
    });
  }));
  const monY = (d) => PL_MONTHS[d.getMonth()].slice(0, 3) + " " + d.getFullYear();
  return { skills, actions, complete, pct: actions ? Math.round(sum / actions) : 0, overdue, range: (minS && maxE) ? monY(minS) + " – " + monY(maxE) : "" };
}
// Stepped 0/25/50/75/100 completion picker — the MDS Segmented Button, Small
// (32px) variant. Exact MDS values (verified in the Figma): selected bg #000F47
// navy / text #CEECFF (Sky Blue); unselected transparent / navy #000F47 text;
// 1px #000F47 border per segment; 2px outer corner radius; Noto Sans 700 16px;
// hover on an unselected segment = rgba(0,15,71,.08). See .pl-seg-btn hover in
// mds-folio.css.
function PlSeg({ value, onChange, readOnly }) {
  const steps = [0, 25, 50, 75, 100];
  // The outline lives on the CONTAINER; each segment carries only a single
  // border-left divider (none on the first). This gives ONE 1px line between
  // options — not the doubled 2px seam you get when every segment has its own
  // full border. overflow:hidden clips the segments to the container's 2px radius.
  return (
    <div role="group" aria-label="Completion" style={{ display: "inline-flex", height: 32, boxSizing: "border-box", border: "1px solid #000F47", borderRadius: 2, overflow: "hidden" }}>
      {steps.map((s, i) => { const on = (value || 0) === s; return (
        <button key={s} type="button" aria-pressed={on} className="pl-seg-btn" onClick={readOnly ? undefined : () => onChange(s)}
          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 40, padding: "0 12px", background: on ? "#000F47" : "transparent", color: on ? "#CEECFF" : "#000F47", border: "none", borderLeft: i > 0 ? "1px solid #000F47" : "none", fontFamily: "var(--sans)", fontSize: 16, fontWeight: 700, cursor: readOnly ? "default" : "pointer" }}>{s}</button>
      ); })}
    </div>
  );
}
// Full-width completion bar along the bottom of a Sample-10 card.
function PlWideBar({ pct }) {
  return <div style={{ height: 6, background: "rgba(0,15,71,.08)", borderRadius: 3, overflow: "hidden", marginTop: 14 }}><div style={{ width: (pct || 0) + "%", height: "100%", background: eBLUE, borderRadius: 3, transition: "width .3s" }} /></div>;
}
// MDS Linear Bar (determinate) — the read-only completion indicator. Exact MDS
// values from the Figma: 8px height, SQUARE ends (radius 0), fill #000F47 navy
// (--v3-surface-primary), unfilled track #94918C gray (--v3-surface-disabled-strong).
function PlLinearBar({ pct, width = 96 }) {
  const v = Math.max(0, Math.min(100, pct || 0));
  // Navy fill + a 2px gap + gray track (the MDS separation between the two
  // segments). The gap is a transparent sliver, shown only mid-range.
  return (
    <div style={{ display: "flex", alignItems: "center", width, height: 8, overflow: "hidden", flexShrink: 0 }}>
      <div style={{ width: v + "%", height: "100%", background: "#000F47", flexShrink: 0 }} />
      {v > 0 && v < 100 && <div style={{ width: 2, flexShrink: 0 }} />}
      <div style={{ flex: 1, height: "100%", background: "#94918C" }} />
    </div>
  );
}
// MDS Slider (completion). Exact MDS values: 2px track — filled #000F47 navy,
// unfilled #94918C neutral — with a 12×12 navy circular thumb (see .pl-slider in
// mds-folio.css). Interactive when editable; a static filled track when read-only.
function PlSlider({ value, onChange, readOnly }) {
  const v = Math.max(0, Math.min(100, value || 0));
  if (readOnly) {
    return (
      <div style={{ position: "relative", height: 2, borderRadius: 2, background: "linear-gradient(to right, #000F47 " + v + "%, #94918C " + v + "%)", margin: "20px 0 8px" }}>
        <span style={{ position: "absolute", top: -5, left: "calc(" + v + "% - 6px)", width: 12, height: 12, borderRadius: "50%", background: "#000F47" }} />
      </div>
    );
  }
  return (
    <div style={{ marginTop: 12 }}>
      <input type="range" min="0" max="100" step="1" value={v} className="pl-slider" aria-label="Completion percentage"
        onChange={(e) => onChange(parseInt(e.target.value, 10))} style={{ ["--pct"]: v + "%" }} />
    </div>
  );
}
// Summary bar under the tabs — plan-wide roll-up (Sample 10 only).
function PlPlanSummary({ stats, status, lead }) {
  const lbl = { fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eMUT, marginBottom: 6 };
  const big = { fontFamily: "var(--sans)", fontSize: 22, fontWeight: 800, color: eMID, lineHeight: 1.1 };
  const cell = (last) => ({ flex: "1 1 140px", minWidth: 120, padding: "14px 18px", borderRight: last ? "none" : "1px solid " + eLINE });
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", flexWrap: "wrap", background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 8, boxShadow: "0 1px 3px rgba(0,15,71,.05)", overflow: "hidden" }}>
        {/* optional identity row (manager view folds the reportee's profile into the same box) */}
        {lead && <div style={{ flex: "1 1 100%", padding: "14px 18px", borderBottom: "1px solid " + eLINE }}>{lead}</div>}
        <div style={cell()}><div style={lbl}>Skills</div><div style={big}>{stats.skills}</div></div>
        <div style={cell()}><div style={lbl}>Development actions</div><div style={big}>{stats.actions}</div><div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, marginTop: 3 }}>{stats.complete} complete</div></div>
        <div style={{ ...cell(), minWidth: 150 }}><div style={lbl}>Completion</div><div style={{ height: 6, background: "rgba(0,15,71,.08)", borderRadius: 3, overflow: "hidden", margin: "3px 0 7px" }}><div style={{ width: stats.pct + "%", height: "100%", background: eBLUE, borderRadius: 3 }} /></div><div style={big}>{stats.pct}%</div></div>
        <div style={cell()}><div style={lbl}>Overdue</div><div style={{ ...big, color: stats.overdue ? "#CB7E03" : eMID }}>{stats.overdue}</div></div>
        <div style={cell(true)}><div style={lbl}>Status</div><div style={{ marginTop: 6 }}><PlStatusBadge status={status} size={15} /></div></div>
      </div>
    </div>
  );
}

// One month grid inside the picker popover.
function PlMonth({ base, sIso, eIso, hIso, onPick, onHover }) {
  const year = base.getFullYear(), month = base.getMonth();
  const lead = new Date(year, month, 1).getDay();
  const dim = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= dim; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  const s = plParse(sIso), e = plParse(eIso), h = plParse(hIso), today = new Date();
  const rangeEnd = e || (s ? h : null);
  const inRange = (dt) => { if (!s || !rangeEnd) return false; const lo = s < rangeEnd ? s : rangeEnd, hi = s < rangeEnd ? rangeEnd : s; return dt >= lo && dt <= hi; };
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 3 }}>
        {PL_DOW.map((w) => <div key={w} style={{ textAlign: "center", fontFamily: "var(--sans)", fontSize: 12, fontWeight: 600, color: eMUT, padding: "3px 0" }}>{w}</div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 }}>
        {cells.map((dt, i) => {
          if (!dt) return <div key={i} />;
          const sel = plSameDay(dt, s) || plSameDay(dt, e), rng = !sel && inRange(dt), isToday = plSameDay(dt, today);
          return (
            <button key={i} onClick={() => onPick(dt)} onMouseEnter={() => onHover(plIso(dt))}
              style={{ height: 34, border: isToday && !sel ? "1.5px solid " + eBLUE : "1.5px solid transparent", cursor: "pointer",
                background: sel ? eMID : rng ? "color-mix(in srgb, var(--accent) 16%, transparent)" : "transparent",
                color: sel ? "#fff" : eINK, borderRadius: 8, fontFamily: "var(--sans)", fontSize: 14, padding: 0 }}>
              {dt.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Effective viewport for positioning portalled popovers. In the iPad/iPhone device
// preview the page is a bezel-framed #root, so fixed popovers must be sized and
// clamped to that frame rather than the whole desktop window.
function plViewport() {
  const dev = document.documentElement.getAttribute("data-device");
  if (dev === "mobile" || dev === "ipad") {
    const el = document.getElementById("root");
    if (el) { const r = el.getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height }; }
  }
  return { left: 0, right: window.innerWidth, top: 0, bottom: window.innerHeight, width: window.innerWidth, height: window.innerHeight };
}

// Trigger field + two-month range popover.
function PlDateRange({ start, end, onChange, invalid }) {
  const [open, setOpen] = plUseState(false);
  const [view, setView] = plUseState(() => plParse(start) || new Date());
  const [pos, setPos] = plUseState(null);
  const [hIso, setHIso] = plUseState(null);
  const btnRef = plUseRef(null), popRef = plUseRef(null);

  plUseEffect(() => {
    if (!open) return;
    const onDoc = (ev) => { if (popRef.current && !popRef.current.contains(ev.target) && btnRef.current && !btnRef.current.contains(ev.target)) setOpen(false); };
    const onKey = (ev) => { if (ev.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc); document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);

  const openPop = () => {
    const r = btnRef.current.getBoundingClientRect();
    const vp = plViewport();
    const W = Math.min(544, vp.width - 24);
    const narrow = W < 500;                       // one month instead of two on small screens
    let left = Math.min(r.left, vp.right - W - 12); if (left < vp.left + 12) left = vp.left + 12;
    const popH = narrow ? 380 : 340;
    let top = r.bottom + 6; if (top + popH > vp.bottom) top = Math.max(vp.top + 12, r.top - popH - 6);
    setPos({ top, left, width: W, narrow, maxH: Math.max(240, vp.bottom - top - 12) });
    setView(plParse(start) || plParse(end) || new Date());
    setHIso(null); setOpen(true);
  };
  const pick = (date) => {
    const iso = plIso(date);
    if (!start || (start && end)) onChange({ start: iso, end: "" });
    else { const s = plParse(start); if (date < s) onChange({ start: iso, end: "" }); else { onChange({ start, end: iso }); setOpen(false); } }
  };
  const shift = (n) => setView(new Date(view.getFullYear(), view.getMonth() + n, 1));
  const right = new Date(view.getFullYear(), view.getMonth() + 1, 1);
  const nav = { width: 30, height: 30, borderRadius: 8, border: "1px solid " + eLINE, background: "var(--card)", cursor: "pointer", color: eMID, fontFamily: "var(--sans)", fontSize: 16, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 };
  const title = { flex: 1, textAlign: "center", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eMID };
  const label = (start || end) ? (plFmtShort(start) || "—") + "  →  " + (plFmtShort(end) || "…") : null;

  return (
    <React.Fragment>
      <button ref={btnRef} onClick={() => open ? setOpen(false) : openPop()} title="Set start & end dates"
        style={{ width: "100%", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 6, border: "1px solid " + (invalid ? "var(--danger)" : open ? eBLUE : "var(--field-line)"), borderRadius: 2, padding: "8px 10px", background: invalid ? "color-mix(in srgb, var(--danger) 4%, transparent)" : "var(--card)", cursor: "pointer" }}>
        <span style={{ flex: 1, textAlign: "left", fontFamily: "var(--sans)", fontSize: 12, fontWeight: label ? 600 : 400, color: label ? eMID : eMUT, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label || "Start date  →  End date"}</span>
        <I.cal size={14} style={{ color: eMUT, flexShrink: 0 }} />
      </button>
      {open && pos && ReactDOM.createPortal(
        <div ref={popRef} style={{ position: "fixed", top: pos.top, left: pos.left, width: pos.width, maxHeight: pos.maxH, overflowY: "auto", boxSizing: "border-box", zIndex: 4000, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 14, boxShadow: "0 18px 50px rgba(0,15,71,.22)", padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <button style={nav} title="Previous year" onClick={() => shift(-12)}>«</button>
            <button style={nav} title="Previous month" onClick={() => shift(-1)}>‹</button>
            <div style={title}>{PL_MONTHS[view.getMonth()]} {view.getFullYear()}</div>
            {!pos.narrow && <div style={title}>{PL_MONTHS[right.getMonth()]} {right.getFullYear()}</div>}
            <button style={nav} title="Next month" onClick={() => shift(1)}>›</button>
            <button style={nav} title="Next year" onClick={() => shift(12)}>»</button>
          </div>
          <div style={{ display: "flex", gap: 22 }}>
            <PlMonth base={view} sIso={start} eIso={end} hIso={hIso} onPick={pick} onHover={setHIso} />
            {!pos.narrow && <PlMonth base={right} sIso={start} eIso={end} hIso={hIso} onPick={pick} onHover={setHIso} />}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: 14, paddingTop: 12, borderTop: "1px solid " + eLINE }}>
            <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT }}>{start ? (plFmt(start) + (end ? "  →  " + plFmt(end) : "  →  select end date")) : "Select start date"}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button onClick={() => { onChange({ start: "", end: "" }); setHIso(null); }} style={{ background: "none", border: "none", color: eMUT, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Clear</button>
              <EdBtn small primary onClick={() => setOpen(false)}>Done</EdBtn>
            </div>
          </div>
        </div>, document.body)}
    </React.Fragment>
  );
}

// Completion editor — the pencil opens a popover with a slider + preset chips + Save/Cancel.
function PlCompletionEdit({ value, onSave }) {
  const [open, setOpen] = plUseState(false);
  const [val, setVal] = plUseState(value || 0);
  const [pos, setPos] = plUseState(null);
  const btnRef = plUseRef(null), popRef = plUseRef(null);
  plUseEffect(() => {
    if (!open) return;
    const onDoc = (ev) => { if (popRef.current && !popRef.current.contains(ev.target) && btnRef.current && !btnRef.current.contains(ev.target)) setOpen(false); };
    const onKey = (ev) => { if (ev.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc); document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);
  const openPop = () => {
    const r = btnRef.current.getBoundingClientRect();
    const vp = plViewport();
    const W = Math.min(244, vp.width - 24); let left = Math.min(r.right - W, vp.right - W - 12); if (left < vp.left + 12) left = vp.left + 12;
    let top = r.bottom + 8; if (top + 190 > vp.bottom) top = Math.max(vp.top + 12, r.top - 198);
    setPos({ top, left, width: W }); setVal(value || 0); setOpen(true);
  };
  return (
    <React.Fragment>
      <button ref={btnRef} onClick={() => open ? setOpen(false) : openPop()} title="Update completion" style={{ background: "none", border: "none", cursor: "pointer", color: eMUT, display: "flex" }}><I.edit size={14} /></button>
      {open && pos && ReactDOM.createPortal(
        <div ref={popRef} style={{ position: "fixed", top: pos.top, left: pos.left, width: pos.width, boxSizing: "border-box", zIndex: 4000, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 12, boxShadow: "0 16px 44px rgba(0,15,71,.22)", padding: 16 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eMID }}>Completion</span>
            <span style={{ fontFamily: "var(--sans)", fontSize: 20, fontWeight: 800, color: eSUCCESS }}>{val}%</span>
          </div>
          <input type="range" min={0} max={100} step={5} value={val} onChange={(e) => setVal(Number(e.target.value))} style={{ width: "100%", accentColor: eSUCCESS, cursor: "pointer" }} />
          <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
            {[0, 25, 50, 75, 100].map((p) => (
              <button key={p} onClick={() => setVal(p)} style={{ flex: "1 1 0", minWidth: 0, padding: "6px 2px", borderRadius: 8, border: "1px solid " + (val === p ? eBLUE : eLINE), background: val === p ? "color-mix(in srgb, var(--accent) 8%, transparent)" : "var(--card)", color: val === p ? eBLUE : eINK, fontFamily: "var(--sans)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{p}</button>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8, marginTop: 14 }}>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: eMUT, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer", padding: "6px 8px" }}>Cancel</button>
            <EdBtn small primary onClick={() => { onSave(val); setOpen(false); }}>Save</EdBtn>
          </div>
        </div>, document.body)}
    </React.Fragment>
  );
}

// ── Development-action card ──────────────────────────────────────────────────
// The column-header row is gone; every field is labelled inside its own card.
// Three switchable layouts (PL_SAMPLES) let the user pick a design.
const PL_SAMPLES = [
  { id: 1, label: "Sample 1 · Stacked", desc: "Details on top, labelled Timeline + Completion footer" },
  { id: 2, label: "Sample 2 · Side panel", desc: "Content left, a labelled meta panel with a progress ring on the right" },
  { id: 3, label: "Sample 3 · Compact", desc: "Tighter one-glance row with an accent stripe" },
  { id: 4, label: "Sample 4 · Clean list", desc: "One card per skill — actions are compact rows split by a line" },
  { id: 5, label: "Sample 5 · Ring cards", desc: "Borderless cards with a left accent, dot on top and a circular progress ring" },
  { id: 6, label: "Sample 6 · Aligned list", desc: "One boxed list, columns aligned to the top, delete tucked at the bottom-right" },
  { id: 7, label: "Sample 7 · Media cards", desc: "Each action leads with an image thumbnail, details and progress alongside" },
  { id: 8, label: "Sample 8 · Error", desc: "Save blocked — required start / end dates are missing" },
  { id: 9, label: "Sample 9 · Two-up grid", desc: "Actions as cards, two per row instead of a single list" },
  { id: 10, label: "Sample 10 · Accordion", desc: "Skills collapse into an accordion (one open at a time); a summary bar under the tabs, and each action shows a stepped 0–100 completion with a full-width bar" },
];
const plMetaLabel = { fontFamily: "var(--sans)", fontSize: 12.5, fontWeight: 600, color: eMUT, margin: "0 0 6px" };

// Linear completion bar + %.
function PlBar({ pct }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
      <div style={{ flex: 1, height: 6, borderRadius: 3, background: "rgba(0,15,71,.08)", overflow: "hidden" }}><div style={{ width: (pct || 0) + "%", height: "100%", background: eSUCCESS, borderRadius: 3 }} /></div>
      <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eMID, minWidth: 32, textAlign: "right" }}>{pct || 0}%</span>
    </div>
  );
}
// Circular completion ring with % in the centre.
function PlRing({ pct, size = 46 }) {
  const r = (size - 6) / 2, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(0,15,71,.1)" strokeWidth="4" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={eSUCCESS} strokeWidth="4" strokeLinecap="round" strokeDasharray={`${((pct || 0) / 100) * c} ${c}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: "stroke-dasharray .3s" }} />
      <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle" style={{ fontFamily: "var(--sans)", fontSize: size * 0.28, fontWeight: 800, fill: eMID }}>{pct || 0}%</text>
    </svg>
  );
}

function PlActionCard({ action, editable, sample, onDate, onComplete, onDelete, last, dateErr }) {
  const [showWhy, setShowWhy] = plUseState(false); // Sample 10 "Why this development action" expander
  const m = PL_LEARN[action.mix];
  const srcLabel = action.src === "AI Coach" ? "AI Coach" : action.src === "Custom" ? "Custom" : "Development Library";
  const src = <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--sans)", fontSize: 14, color: eMUT }}>{action.src === "AI Coach" ? <I.spark size={14} /> : <I.layers size={14} />}{srcLabel}</span>;
  const title = <div style={{ fontFamily: "var(--sans)", fontSize: 16, fontWeight: 700, color: eMID }}>{action.title}</div>;
  const dateNode = editable
    ? <React.Fragment>
        <PlDateRange start={action.start || ""} end={action.end || ""} onChange={onDate} invalid={dateErr} />
        {dateErr && <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 5, color: "var(--danger)", fontFamily: "var(--sans)", fontSize: 12.5 }}><I.alertCircle size={12} /> Required</div>}
      </React.Fragment>
    : <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: action.start ? eMID : eMUT }}>{action.start ? plFmt(action.start) + " – " + (action.end ? plFmt(action.end) : "…") : "Not set"}</span>;
  const del = editable ? <button onClick={onDelete} title="Remove development action" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--danger)", display: "flex", padding: 4 }}><PlTrash size={16} /></button> : null;
  const pencil = editable ? <PlCompletionEdit value={action.completion || 0} onSave={onComplete} /> : null;

  // ── Sample 2 · content left, labelled meta panel (with ring) on the right ──
  if (sample === 2) {
    return (
      <div className="pl-card-2" style={{ position: "relative", display: "flex", background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 14, marginBottom: 14, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,15,71,.05)" }}>
        <div style={{ flex: 1, minWidth: 0, padding: "16px 18px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}><div style={{ flex: 1, minWidth: 0 }}>{title}<PlDesc text={action.desc} /></div>{del}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 12, flexWrap: "wrap" }}><PlMix mix={action.mix} />{src}</div>
        </div>
        <div style={{ width: 216, flexShrink: 0, background: "rgba(0,15,71,.025)", borderLeft: "1px solid " + eLINE, padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
          <div><div style={plMetaLabel}>Start – End date</div>{dateNode}</div>
          <div style={{ height: 1, background: eLINE }} />
          <div><div style={plMetaLabel}>Completion</div><div style={{ display: "flex", alignItems: "center", gap: 12 }}><PlRing pct={action.completion || 0} />{pencil}</div></div>
        </div>
      </div>
    );
  }

  // ── Sample 3 · compact one-glance row with accent stripe ──
  if (sample === 3) {
    return (
      <div className="pl-card-3" style={{ display: "flex", alignItems: "center", gap: 16, background: "var(--card)", border: "1px solid " + eLINE, borderLeft: "4px solid " + m.color, borderRadius: 10, padding: "13px 16px", marginBottom: 10, boxShadow: "0 1px 2px rgba(0,15,71,.04)" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>{title}<span style={{ fontFamily: "var(--sans)", fontSize: 12, fontWeight: 400, color: m.color, background: "color-mix(in srgb, " + m.color + " 12%, transparent)", borderRadius: 20, padding: "2px 9px" }}>{action.mix}% · {m.label}</span></div>
          <PlDesc text={action.desc} />
          <div style={{ marginTop: 8 }}>{src}</div>
        </div>
        <div style={{ width: 172, flexShrink: 0 }}><div style={plMetaLabel}>Start – End</div>{dateNode}</div>
        <div style={{ width: 150, flexShrink: 0 }}><div style={plMetaLabel}>Completion</div><div style={{ display: "flex", alignItems: "center", gap: 8 }}><PlBar pct={action.completion || 0} />{pencil}</div></div>
        {del && <div style={{ flexShrink: 0, alignSelf: "flex-start" }}>{del}</div>}
      </div>
    );
  }

  // ── Sample 4 · compact list row inside one shared card (divider between rows) ──
  if (sample === 4) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "13px 2px", borderBottom: last ? "none" : "1px solid " + eLINE, flexWrap: "wrap" }}>
        {/* status dot — leading marker, aligned to the top beside the heading */}
        <span style={{ alignSelf: "flex-start", marginTop: 6, width: 8, height: 8, borderRadius: 4, background: m.color, flexShrink: 0 }} />
        <div style={{ flex: "1 1 260px", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
            {title}
            <span style={{ fontFamily: "var(--sans)", fontSize: 12, fontWeight: 400, color: m.color, background: "color-mix(in srgb, " + m.color + " 12%, transparent)", borderRadius: 20, padding: "2px 9px" }}>{action.mix}% · {m.label}</span>
          </div>
          <PlDescLine text={action.desc} />
        </div>
        <div style={{ width: 168, flexShrink: 0 }}>{dateNode}</div>
        <div style={{ width: 148, flexShrink: 0, display: "flex", alignItems: "center", gap: 8 }}><PlBar pct={action.completion || 0} />{pencil}</div>
        {del}
      </div>
    );
  }

  // ── Sample 6 · boxed list, no table header — each row carries its own inline
  //    labels above the date + circular completion, delete tucked at bottom-right ──
  if (sample === 6) {
    return (
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "14px 2px", borderBottom: last ? "none" : "1px solid " + eLINE, flexWrap: "wrap" }}>
        <span style={{ marginTop: 6, width: 8, height: 8, borderRadius: 4, background: m.color, flexShrink: 0 }} />
        <div style={{ flex: "1 1 240px", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
            {title}
            <span style={{ fontFamily: "var(--sans)", fontSize: 12, fontWeight: 400, color: m.color, background: "color-mix(in srgb, " + m.color + " 12%, transparent)", borderRadius: 20, padding: "2px 9px" }}>{action.mix}% · {m.label}</span>
          </div>
          <PlDescLine text={action.desc} />
        </div>
        <div style={{ width: 168, flexShrink: 0 }}>
          <div style={plMetaLabel}>Start – End date</div>
          {dateNode}
        </div>
        <div style={{ width: 120, flexShrink: 0 }}>
          <div style={plMetaLabel}>Completion</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}><PlRing pct={action.completion || 0} size={42} />{pencil}</div>
        </div>
        {del && <div style={{ flexShrink: 0, alignSelf: "stretch", display: "flex", alignItems: "flex-end", paddingBottom: 2 }}>{del}</div>}
      </div>
    );
  }

  // ── Sample 5 · borderless soft card, dot marker, meta on the right to fill the width ──
  if (sample === 5) {
    return (
      <div style={{ background: "var(--card)", borderRadius: 12, padding: "15px 18px", marginBottom: 8, boxShadow: "0 4px 16px rgba(0,15,71,.07)", display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
        <span style={{ width: 9, height: 9, borderRadius: 5, background: m.color, flexShrink: 0, alignSelf: "flex-start", marginTop: 7 }} />
        <div style={{ flex: "1 1 300px", minWidth: 0 }}>
          {title}
          <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "6px 0 6px", flexWrap: "wrap" }}><PlMix mix={action.mix} />{src}</div>
          <PlDesc text={action.desc} />
        </div>
        <div style={{ flexShrink: 0, display: "flex", alignItems: "flex-start", gap: 28 }}>
          <div><div style={plMetaLabel}>Start – End date</div>{dateNode}</div>
          <div><div style={plMetaLabel}>Completion</div><div style={{ display: "flex", alignItems: "center", gap: 12 }}><PlRing pct={action.completion || 0} />{pencil}</div></div>
        </div>
        {del && <div style={{ alignSelf: "flex-start" }}>{del}</div>}
      </div>
    );
  }

  // ── Sample 7 · media card — image thumbnail leads each action ──
  if (sample === 7) {
    return (
      <div style={{ background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 14, padding: 14, marginBottom: 12, boxShadow: "0 1px 3px rgba(0,15,71,.05)", display: "flex", gap: 14, alignItems: "flex-start" }}>
        {plHasImg(action.title)
          ? <PlThumb mix={action.mix} seed={action.title} />
          : <PlThumbIcon mix={action.mix} />}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}>{title}</div>
            {del}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "6px 0 8px", flexWrap: "wrap" }}><PlMix mix={action.mix} />{src}</div>
          <PlDesc text={action.desc} />
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap", marginTop: 12 }}>
            <div><div style={plMetaLabel}>Start – End date</div>{dateNode}</div>
            <div><div style={plMetaLabel}>Completion</div><div style={{ display: "flex", alignItems: "center", gap: 10 }}><PlRing pct={action.completion || 0} size={42} />{pencil}</div></div>
          </div>
        </div>
      </div>
    );
  }

  // ── Sample 10 · accordion body card — mode chip, why-expander, stepped
  //    completion (0/25/50/75/100) and a full-width progress bar along the bottom ──
  if (sample === 10) {
    const durTxt = plDur(action.start, action.end);
    const modeChip = (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: m.color, background: "color-mix(in srgb, " + m.color + " 12%, transparent)", borderRadius: 8, padding: "3px 10px" }}>
        {React.createElement(I[m.icon] || I.book, { size: 13 })}{m.label}
      </span>
    );
    const why = "Included to develop this skill through " + m.label.toLowerCase() + ". Work towards the completion target using the steps below, and mark your progress as you go.";
    return (
      <div style={{ background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 8, padding: "16px 18px 18px", marginBottom: 12, boxShadow: "0 1px 3px rgba(0,15,71,.05)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <div style={{ fontFamily: "var(--sans)", fontSize: 16, fontWeight: 700, color: eMID }}>{action.title}</div>
              {modeChip}
              <span style={{ fontFamily: "var(--sans)", fontSize: 13.5, color: eMUT }}>{srcLabel}{durTxt ? " · " + durTxt : ""}</span>
            </div>
            <PlDescLine text={action.desc} />
            <button onClick={() => setShowWhy((v) => !v)} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", padding: 0, marginTop: 8, color: eBLUE, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}><I.spark size={13} /> Why this development action</button>
            {showWhy && <div style={{ background: "color-mix(in srgb, var(--accent) 5%, transparent)", borderRadius: 8, padding: "9px 12px", marginTop: 7, fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.5 }}>{why}</div>}
          </div>
          {del}
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 18, flexWrap: "wrap", marginTop: 14 }}>
          <div style={{ minWidth: 170 }}><div style={plMetaLabel}>Start – End date</div>{dateNode}</div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 7 }}>
            <div style={plMetaLabel}>Completion</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "flex-end" }}>
              {/* edit mode: quick-select steps (0/25/50/75/100) + slider below.
                  view mode: the MDS Linear Bar as a compact visual next to the %. */}
              {editable ? <PlSeg value={action.completion || 0} onChange={onComplete} /> : <PlLinearBar pct={action.completion || 0} />}
              <span style={{ fontFamily: "var(--sans)", fontSize: 16, fontWeight: 700, color: eMID, minWidth: 40, textAlign: "right" }}>{action.completion || 0}%</span>
            </div>
          </div>
        </div>
        {/* The slider is an editing control — in the saved/view mode we drop it and
            keep just the % readout above, which makes the card shorter. */}
        {editable && <PlSlider value={action.completion || 0} onChange={onComplete} />}
      </div>
    );
  }

  // ── Sample 9 · compact card sized for a two-per-row grid (see the grid wrapper) ──
  if (sample === 9) {
    return (
      <div style={{ background: "var(--card)", border: "1px solid " + eLINE, borderTop: "3px solid " + m.color, borderRadius: 14, padding: "15px 17px", boxShadow: "0 1px 3px rgba(0,15,71,.05)", height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>{title}</div>
          {del}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "8px 0 8px", flexWrap: "wrap" }}><PlMix mix={action.mix} />{src}</div>
        <PlDesc text={action.desc} />
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", borderTop: "1px solid " + eLINE, marginTop: 14, paddingTop: 13 }}>
          <div style={{ minWidth: 150, flex: 1 }}><div style={plMetaLabel}>Start – End date</div>{dateNode}</div>
          <div><div style={plMetaLabel}>Completion</div><div style={{ display: "flex", alignItems: "center", gap: 8 }}><PlRing pct={action.completion || 0} size={40} />{pencil}</div></div>
        </div>
      </div>
    );
  }

  // ── Sample 1 (default) · stacked details + labelled footer ──
  return (
    <div style={{ background: "var(--card)", border: "1px solid " + eLINE, borderLeft: "3px solid " + m.color, borderRadius: 12, padding: "16px 18px", marginBottom: 12, boxShadow: "0 1px 3px rgba(0,15,71,.05)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}><div style={{ flex: 1, minWidth: 0 }}>{title}<PlDesc text={action.desc} /></div>{del}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "10px 0 14px", flexWrap: "wrap" }}><PlMix mix={action.mix} />{src}</div>
      <div style={{ display: "flex", gap: 28, flexWrap: "wrap", borderTop: "1px solid " + eLINE, paddingTop: 14 }}>
        <div style={{ minWidth: 176 }}><div style={plMetaLabel}>Start – End date</div>{dateNode}</div>
        <div style={{ flex: 1, minWidth: 190 }}><div style={plMetaLabel}>Completion</div><div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ flex: 1, maxWidth: 220, display: "flex" }}><PlBar pct={action.completion || 0} /></div>{pencil}</div></div>
      </div>
    </div>
  );
}

window.EdPlan = { EdPlanPage, PlDateRange, plFmt };
// Read-only shares for the Manager workspace (app-manager.jsx). Additive only —
// the employee-facing plan behaviour is unchanged.
window.EdPlan.SEED = PL_SEED;
window.EdPlan.LEARN = PL_LEARN;
window.EdPlan.clone = plClone;
// The manager renders plans with the very same card, so the two sides can't drift.
window.EdPlan.ActionCard = PlActionCard;
window.EdPlan.metaLabel = plMetaLabel;
window.EdPlan.SAMPLES = PL_SAMPLES;
window.EdPlan.ReportTab = PlReportTab;   // the manager shows the very same report preview
// Comments: one conversation shared by the employee and their manager.
window.EdPlan.Comments = PlComments;
window.EdPlan.threadsFor = plThreadsFor;
window.EdPlan.THREAD_EVENT = PL_THREAD_EVENT;
window.EdPlan.MGR_NAME = PL_MGR;
window.EdPlan.ME_NAME = PL_ME;
// The decision note, shared so employee and manager render the identical thing.
window.EdPlan.DecisionNote = PlDecisionNote;
window.EdPlan.when = plWhen;
// The plan itself, shared with the manager, plus the diff that drives their change summary.
window.EdPlan.loadPlan = plLoadPlan;
window.EdPlan.savePlan = plSavePlan;
window.EdPlan.diff = plDiff;
window.EdPlan.PLAN_EVENT = PL_PLAN_EVENT;
window.EdPlan.OWNER = PL_OWNER;
// One status palette / badge for the employee and the manager alike.
window.EdPlan.STATUS = PL_STATUS;
window.EdPlan.StatusBadge = PlStatusBadge;
window.EdPlan.PlanSummary = PlPlanSummary;   // Sample-10 summary bar — reused read-only by the manager
window.EdPlan.stats = plStats;               // plan roll-up used by that bar
window.EdPlan.VisBadge = PlVisBadge;          // read-only public/private badge (accordion header)
window.EdPlan.Stars = PlStars;                // rating stars (read-only on the manager)
window.EdPlan.usePushRoom = plUsePushRoom;   // shared panel-vs-overlay rule
window.EdPlan.NoActions = PlNoActions;   // per-skill empty state, shared with the manager
// Reflective questions — shared, so the manager reads and can edit the same answers.
window.EdPlan.REFLECT_QS = PL_REFLECT_QS;
window.EdPlan.loadReflect = plLoadReflect;
window.EdPlan.saveReflect = plSaveReflect;
window.EdPlan.REFLECT_EVENT = PL_REFLECT_EVENT;
window.EdPlan.OVERALL = PL_OVERALL;   // the plan-level conversation thread
