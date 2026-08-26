// ════════════════════════════════════════════════
//  DIRECTION A — "Beacon" (Editorial) · DEVELOPMENT / IDP FLOW
//  Faithful re-implementation of the V5 "Create your IDP" flow:
//  landing → intro → skill gap → AI chat → summary → loading →
//  generated 70·20·10 plan. Content verbatim from lighthouse-v5.jsx.
//  Reuses tokens/helpers from app-ed-detail.jsx. Overrides
//  window.EdGrowth.EdDevelopment.
// ════════════════════════════════════════════════

const { useState: idpUseState, useEffect: idpUseEffect, useRef: idpUseRef } = React;

// The Folio/editorial shell scrolls inside <main>, not the window. When we swap
// pages (mode/phase/step) the new content inherits the previous scroll position,
// so a long page can open part-way down. Reset the scroller to the top on every
// transition. Runs before paint (layout effect) so there's no visible jump.
function idpScrollTop() {
  const go = () => { try { const m = document.querySelector(".ed-shell main") || document.querySelector("main"); if (m) m.scrollTop = 0; window.scrollTo(0, 0); } catch (e) {} };
  go();                          // immediately, before paint
  requestAnimationFrame(go);     // again after layout settles (beats scroll-clamp on shorter pages)
}

const idpType = {
  "70": { label: "On-the-job (70%)", color: "var(--accent)", bg: "color-mix(in srgb, var(--accent) 10%, transparent)" },
  "20": { label: "From others (20%)", color: ePURP, bg: "rgba(143,32,222,.10)" },
  "10": { label: "Formal training (10%)", color: eWARN, bg: "rgba(203,126,3,.10)" },
};
const idpCatIcon = { experience: "rocket", social: "users", course: "book", reading: "fileText" };

// ── small helper: competency bars ──
function IdpCompBars() {
  const barColor = (s) => s >= 80 ? eSUCCESS : s >= 70 ? eWARN : eDANGER;
  return (
    <div style={{ background: eCARD, border: "1px solid " + eLINE, borderRadius: 16, padding: 20 }}>
      {LH.competencies.map((c, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: i < LH.competencies.length - 1 ? 14 : 0 }}>
          <div style={{ width: 150, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eINK, flexShrink: 0, textAlign: "right" }}>{c.label}</div>
          <div style={{ flex: 1, height: 10, background: "var(--track)", borderRadius: 5, overflow: "hidden" }}>
            <div style={{ width: `${c.score}%`, height: "100%", background: barColor(c.score), borderRadius: 5, transition: "width .8s ease" }} />
          </div>
          <div className="serif" style={{ width: 30, fontSize: 17, color: barColor(c.score), textAlign: "right" }}>{c.score}</div>
        </div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════
//  GUIDED IDP QUESTIONS — structured wizard (replaces the chat coach).
//  Left = one question at a time (textarea+chips / radio cards / multi-select
//  with AI-assist / timeline / upload); right = live AI notes. Brand-styled.
// ════════════════════════════════════════════════
// ── Coach design 3 · "Your Development Guide" script ─────────────────────────
// One entry per turn: the guide's message and the suggestion tags shown beneath it.
// Tapping a tag (or typing a reply) advances to the next entry. Add steps here as
// the conversation copy is finalised.
const G3_SCRIPT = [
  { id: "enjoy", label: "What you enjoy in your role", text: (name) => "Hi " + name + ", what do you enjoy most in your role?",
    chips: ["Team collaboration", "Problem-solving", "Leadership opportunities", "Creative projects"] },
  { id: "energy", label: "Energy-consuming responsibilities", text: () => "Thanks for sharing. What role responsibilities consume most of your energy, if any?",
    chips: ["Managing deadlines", "Client communications", "Administrative tasks", "Technical troubleshooting"] },
  { id: "timeline", label: "Development timeline", text: () => "What is a realistic timeline for you to develop these skills? (short term - 1-6 months, medium term - 6-12 months, long term - 1+ years)",
    chips: ["Short term", "Medium term", "Long term"] },
  { id: "learning", label: "Learning preference", learning: true, text: () => "What is your preferred way of learning new skills?",
    chips: ["Hands-on practice", "Online courses", "Mentorship", "Group discussions"] },
  { id: "evidence", label: "External evidence", evidence: true,
    text: (name, prev) => (prev ? prev + (/s$/i.test(prev) ? " are" : " is") : "That is") + " a fantastic way to grow and share knowledge. Do you have external evidence like 360 feedback or assessments to include in your development plan?",
    chips: ["Yes, I have some feedback", "No, not right now"] },
];

// Skill-gap analysis shown in the guide's closing summary (mirrors the Analysis
// summary page used by the other coach designs).
const G3_GAPS = {
  overview: "From your Leadership Assessment, these competencies show the largest gap to target — they shape the focus of your plan.",
  gaps: [
    { skill: "Communicate with Impact", score: 2.4, target: 3.8, note: "Influence and stakeholder communication" },
    { skill: "Champion Change and Innovation", score: 2.6, target: 3.6, note: "Driving and adopting change" },
    { skill: "Collaborate and Build Relationships", score: 2.9, target: 3.6, note: "Cross-team collaboration" },
  ],
  strengths: ["Execute with Excellence — 4.1 / 5 (above target)", "Act Professionally — 3.9 / 5 (above target)"],
};

// A typed message asking to attach something opens the drag-and-drop step.
const G3_ATTACH_RE = /\b(attach|upload|document|file|cv|resume|feedback|review)\b/i;
// A file only counts as relevant when it looks like development evidence.
const G3_RELEVANT_RE = /(feedback|review|appraisal|assessment|360|performance|development|idp|goals?)/i;

const IDP_Q = [
  { id: "like", short: "Likes", q: "What do you like about your job?", type: "text",
    chips: ["Work-life balance", "Team collaboration", "Learning opportunities", "Creative freedom", "Challenging projects", "Recognition", "Flexible schedule"],
    topics: ["work", "job", "role", "team", "colleague", "people", "collaborat", "learn", "grow", "skill", "project", "challeng", "creativ", "freedom", "recogni", "flexible", "schedule", "balance", "customer", "client", "impact", "solve", "solving", "build", "tech", "mentor", "autonomy", "purpose", "culture", "environment", "problem", "meeting", "manage", "deliver", "responsib", "opportunit", "leadership", "strategy", "product", "design", "analysis"],
    ai: "I genuinely enjoy the collaborative nature of my work — brainstorming with teammates, sharing ideas, and seeing those ideas come to life. The opportunity to learn new tools and grow my skills keeps me motivated every day." },
  { id: "dislike", short: "Frustrations", q: "What don't you enjoy about your job?", type: "text",
    chips: ["Limited growth", "Repetitive tasks", "Long commute", "Unclear expectations", "Limited resources", "Micromanagement", "Lack of feedback", "Work overload"],
    topics: ["work", "job", "task", "repetit", "growth", "commut", "expectation", "resource", "manage", "micromanage", "feedback", "overload", "stress", "priorit", "communicat", "deadline", "meeting", "bureaucr", "unclear", "boring", "slow", "admin", "process", "role", "team", "pressure", "hours", "workload", "politic", "conflict", "frustrat", "difficult", "challeng", "lack", "limited", "recognition", "support", "training", "tooling", "planning"],
    ai: "There are times when priorities shift without clear communication, which makes it hard to stay focused. Feedback cycles can also be slow, sometimes delaying my growth and project delivery." },
  { id: "direction", short: "Direction", q: "Are you planning to switch your role, or grow in your current one?", type: "radio",
    options: [
      { value: "switch", icon: "rocket", label: "Switch to a new role", desc: "Explore a different career path" },
      { value: "better", icon: "chart", label: "Grow in my current role", desc: "Deepen expertise in what I do now" },
      { value: "unsure", icon: "bulb", label: "Not sure yet", desc: "Still exploring my options" },
    ] },
  { id: "transfer", short: "Transferable skills", q: "What transferable skills do you bring from your current role?", type: "multi", placeholder: "Select skills…",
    skills: ["Communication", "Project Management", "Data Analysis", "Problem Solving", "Leadership", "Stakeholder Management", "Strategic Thinking", "Coaching"],
    ai: ["Communication", "Problem Solving", "Stakeholder Management", "Strategic Thinking"] },
  { id: "develop", short: "Skills to build", q: "Which skills do you want to work on?", type: "multi", placeholder: "Select skills…",
    skills: ["People Development", "Influence & Communication", "Decision Making", "Change Leadership", "Coaching", "Strategic Planning", "Executive Presence", "Data-driven Thinking"],
    ai: ["People Development", "Influence & Communication", "Coaching", "Executive Presence"] },
  { id: "learn", short: "Learning style", q: "How do you like to learn?", type: "multi", placeholder: "Select how you like to learn…",
    skills: ["Learning on the job", "Collaborative learning", "Formal learning"],
    ai: ["Learning on the job"] },
  { id: "timeline", short: "Timeline", q: "What's your timeline?", type: "timeline", quick: ["1 month", "3 months", "6 months", "12 months"],
    ai: "Based on your goals and current level, a 6-month timeline is recommended — enough runway to complete 2–3 focused learning modules, apply skills on live projects, and build a portfolio piece before transitioning." },
  { id: "docs", short: "Documents", q: "Upload relevant documents (optional)", type: "upload",
    hint: "Manager feedback, performance reviews, 360° comments, or self-assessments — anything that helps us tailor your plan." },
];

function idpFmt(qq, v) {
  if (v == null) return "";
  if (qq.type === "radio") { const o = qq.options.find((o) => o.value === v); return o ? o.label : ""; }
  if (qq.type === "multi") return Array.isArray(v) ? v.join(", ") : "";
  if (qq.type === "timeline") {
    if (v.quick) return v.quick;
    const f = (window.EdPlan && window.EdPlan.plFmt) || ((s) => s);
    return v.start ? (f(v.start) + (v.end ? " – " + f(v.end) : "")) : "";
  }
  return v;
}

// What a good answer looks like — the companion coaches the user toward it.
function idpGuide(q) {
  if (q.id === "like") return "Tell me what genuinely energises you at work — the parts of the role, the people, or the kind of problems you enjoy.";
  if (q.id === "dislike") return "Think about what drains you or slows you down — tasks, processes, or ways of working you would change.";
  if (q.id === "learn") return "Describe how you take in new skills best — for example courses, reading, hands-on projects, or mentoring.";
  return "Try to answer in the context of the question.";
}
// The companion validates free-text answers (prototype heuristic): it flags answers
// that are too short, look like nonsense, or don't relate to the question, and blocks
// the user from moving on until the answer fits the question.
function idpValidate(q, v) {
  if (q.type !== "text") return { ok: true };            // selections can't be off-topic
  const raw = (v || "").trim();
  if (raw.length < 4) return { ok: false, kind: "short", reason: "Your answer is very short.", guide: idpGuide(q) };
  const lower = raw.toLowerCase();
  const words = lower.split(/\s+/).filter(Boolean);
  const realWords = words.filter((w) => /[aeiou]/.test(w) && w.replace(/[^a-z]/g, "").length >= 2);
  const mashed = /(.)\1{3,}/.test(lower) || words.some((w) => w.replace(/[^a-z]/g, "").length >= 5 && !/[aeiou]/.test(w));
  if (realWords.length < 2 || mashed) return { ok: false, kind: "nonsense", reason: "That doesn't read like a real answer.", guide: idpGuide(q) };
  const topics = (q.topics || []).concat((q.chips || []).map((c) => c.toLowerCase()));
  const relevant = !topics.length || topics.some((t) => t.split(/\s+/).some((tok) => tok.length >= 4 && lower.includes(tok.slice(0, 4))));
  if (!relevant) return { ok: false, kind: "offtopic", reason: "This answer doesn't seem related to the question.", guide: idpGuide(q) };
  return { ok: true };
}

// Conversational acknowledgement the AI companion replies with after each answer.
function idpCompanion(qq, v) {
  const t = idpFmt(qq, v);
  const lc = t ? t.charAt(0).toLowerCase() + t.slice(1) : t;
  switch (qq.id) {
    case "like": return `I see you're drawn to \u201c${t}\u201d. This gives me valuable insight into what motivates you professionally. Let's explore how we can build on it.`;
    case "dislike": return `Thanks for being candid about \u201c${t}\u201d. Noting this helps me steer your plan away from these friction points.`;
    case "direction": return `Understood \u2014 you'd like to ${lc}. I'll tailor every recommendation to that direction.`;
    case "transfer": return `Strong foundation here: ${t}. These transferable strengths give you a real head start.`;
    case "develop": return `Got it \u2014 you want to grow in ${t}. I'll prioritise focused learning for each of these.`;
    case "learn": return `Helpful to know you learn best through ${lc}. I'll shape your plan around that format.`;
    case "timeline": return `A ${lc} timeline works well. I'll pace your milestones so they're realistic and achievable.`;
    case "docs": return `Received ${t}. I'll use it to make your plan more personal.`;
    default: return "Noted \u2014 thank you.";
  }
}

function IdpChip({ label, selected, onClick }) {
  return <button onClick={onClick} style={{ padding: "7px 14px", borderRadius: 8, border: "1.5px solid " + (selected ? eBLUE : eLINE), background: selected ? "color-mix(in srgb, var(--accent) 6%, transparent)" : "#fff", color: selected ? eBLUE : eINK, fontSize: 14, fontFamily: "var(--sans)", cursor: "pointer", fontWeight: selected ? 600 : 500 }}>{label}</button>;
}

function IdpAIBtn({ label, onClick, loading }) {
  return (
    <button onClick={onClick} disabled={loading} style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 7, background: "color-mix(in srgb, var(--accent) 6%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)", color: loading ? eMUT : eBLUE, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: loading ? "default" : "pointer", padding: "8px 14px", borderRadius: 9 }}>
      {loading
        ? <React.Fragment><span className="ed-spin" style={{ width: 14, height: 14, border: "2px solid " + eBLUE, borderTopColor: "transparent", borderRadius: "50%", display: "inline-block" }} /> Generating…</React.Fragment>
        : <React.Fragment><I.spark size={15} /> {label}</React.Fragment>}
    </button>
  );
}

// Skill picker, in two modes.
//   search: the field is a search box, never a count. A skill is either a tag below or
//           an option in the list, never both — picking one drops it from the list, and
//           clearing its tag puts it back. Used by both Add Skills screens.
//   default: the original "N selected" dropdown with tick marks, kept for the coach
//           wizard's own questions so designs 1 and 2 are untouched.
// The nearest ancestor that clips its overflow — inside the Add Skills modal that's the
// scrolling body, so the list has to fit within it rather than the whole viewport.
function idpClipBounds(el) {
  let n = el && el.parentElement;
  while (n && n !== document.body && n !== document.documentElement) {
    const cs = window.getComputedStyle(n);
    if (/(auto|scroll|hidden)/.test(cs.overflowY) || /(auto|scroll|hidden)/.test(cs.overflow)) {
      const r = n.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom };
    }
    n = n.parentElement;
  }
  return { top: 0, bottom: window.innerHeight };
}

function IdpMultiSelect({ options, selected, onChange, placeholder, search }) {
  const [open, setOpen] = idpUseState(false);
  const [query, setQuery] = idpUseState("");
  // Which way the list opens, and how tall it may be. Measured, not assumed — the last
  // category in the modal has almost no room below it.
  const [place, setPlace] = idpUseState({ up: false, maxH: 220 });
  const wrapRef = idpUseRef(null);
  const fieldRef = idpUseRef(null);
  const inputRef = idpUseRef(null);
  const remove = (v) => onChange(selected.filter((s) => s !== v));
  const add = (v) => {
    if (selected.indexOf(v) >= 0) return;
    onChange([...selected, v]);
    setQuery("");                                     // ready for the next search
    if (inputRef.current) inputRef.current.focus();
  };
  // What's left to offer, then what the search narrows it to.
  const available = options.filter((o) => selected.indexOf(o) < 0);
  const needle = query.trim().toLowerCase();
  const matches = needle ? available.filter((o) => o.toLowerCase().indexOf(needle) >= 0) : available;
  // Close on outside click / Escape (picking tags keeps it open).
  idpUseEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) { setOpen(false); setQuery(""); } };
    const onKey = (e) => { if (e.key === "Escape") { setOpen(false); setQuery(""); } };
    document.addEventListener("mousedown", onDoc); document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);
  // Place the list in whichever direction has room, and never taller than that room.
  idpUseEffect(() => {
    if (!open) return;
    const measure = () => {
      const el = fieldRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const clip = idpClipBounds(el);
      const GAP = 14;
      const below = clip.bottom - r.bottom - GAP;
      const above = r.top - clip.top - GAP;
      // Prefer opening down; flip only when down is genuinely cramped and up is better.
      const up = below < 150 && above > below;
      const room = up ? above : below;
      setPlace({ up: up, maxH: Math.max(120, Math.min(220, room)) });
    };
    measure();
    window.addEventListener("resize", measure, true);
    window.addEventListener("scroll", measure, true);
    return () => { window.removeEventListener("resize", measure, true); window.removeEventListener("scroll", measure, true); };
  }, [open, matches.length]);
  const rowStyle = { padding: "10px 12px", borderRadius: 8, fontSize: 14, fontFamily: "var(--sans)" };
  return (
    <div ref={wrapRef}>
      <div ref={fieldRef} style={{ position: "relative" }}>
        {search ? (
        <div onClick={() => { setOpen(true); if (inputRef.current) inputRef.current.focus(); }}
          style={{ border: "1.5px solid " + (open ? eBLUE : eLINE), borderRadius: 10, padding: "12px 14px", minHeight: 46, boxSizing: "border-box", cursor: "text", display: "flex", alignItems: "center", gap: 9, background: "var(--card)" }}>
          <span style={{ color: open ? eBLUE : eMUT, display: "flex", flexShrink: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
          </span>
          <input ref={inputRef} value={query} onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); if (matches.length) add(matches[0]); }
              else if (e.key === "Backspace" && !query && selected.length) remove(selected[selected.length - 1]);
            }}
            placeholder={placeholder || "Search skills…"}
            style={{ flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent", fontFamily: "var(--sans)", fontSize: 14, color: eMID, padding: 0 }} />
          <button onClick={(e) => { e.stopPropagation(); setOpen(!open); }} aria-label={open ? "Hide skills" : "Show skills"}
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: eMUT, display: "flex", flexShrink: 0 }}>
            <I.chevD size={15} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
          </button>
        </div>
        ) : (
        <div onClick={() => setOpen(!open)} style={{ border: "1.5px solid " + (open ? eBLUE : eLINE), borderRadius: 10, padding: "12px 14px", minHeight: 46, boxSizing: "border-box", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, background: "var(--card)" }}>
          <span style={{ flex: 1, minWidth: 0, color: selected.length ? eMID : eMUT, fontSize: 14, fontWeight: selected.length ? 600 : 400, fontFamily: "var(--sans)" }}>{selected.length ? selected.length + " selected" : placeholder}</span>
          <span style={{ color: eMUT, display: "flex", flexShrink: 0 }}><I.chevD size={15} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} /></span>
        </div>
        )}
        {open && (
          <div style={{ position: "absolute", top: place.up ? "auto" : "calc(100% + 6px)", bottom: place.up ? "calc(100% + 6px)" : "auto", left: 0, right: 0, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 12, zIndex: 50, maxHeight: place.maxH, overflowY: "auto", boxShadow: place.up ? "0 -12px 34px rgba(0,15,71,.16)" : "0 12px 34px rgba(0,15,71,.16)", padding: 6 }}>
            {search ? (
              <React.Fragment>
                {matches.map((opt) => (
                  <div key={opt} onClick={() => add(opt)}
                    onMouseDown={(e) => e.preventDefault()}
                    style={{ ...rowStyle, cursor: "pointer", color: eINK, fontWeight: 500 }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "color-mix(in srgb, var(--accent) 6%, transparent)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                    {opt}
                  </div>
                ))}
                {matches.length === 0 && (
                  <div style={{ ...rowStyle, color: eMUT }}>
                    {available.length === 0 ? "Every skill here is already added." : "No skills match “" + query.trim() + "”."}
                  </div>
                )}
              </React.Fragment>
            ) : options.map((opt) => { const sel = selected.indexOf(opt) >= 0; return (
              <div key={opt} onClick={() => sel ? remove(opt) : add(opt)} style={{ ...rowStyle, cursor: "pointer", background: sel ? "color-mix(in srgb, var(--accent) 6%, transparent)" : "transparent", color: sel ? eMID : eINK, fontWeight: sel ? 600 : 500, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {opt}{sel && <span style={{ color: eBLUE, display: "flex" }}><I.check size={15} /></span>}
              </div>
            ); })}
          </div>
        )}
      </div>
      {/* selected options as removable tags below the field */}
      {selected.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
          {selected.map((s) => (
            <span key={s} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "color-mix(in srgb, var(--accent) 10%, var(--card))", color: eBLUE, border: "1px solid color-mix(in srgb, var(--accent) 22%, transparent)", borderRadius: 8, padding: "5px 8px 5px 12px", fontSize: 14, fontWeight: 600, fontFamily: "var(--sans)" }}>
              {s}
              <button onClick={() => remove(s)} aria-label={"Remove " + s} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, borderRadius: 6, border: "none", background: "none", color: eBLUE, cursor: "pointer", flexShrink: 0, padding: 0 }}><I.plus size={13} style={{ transform: "rotate(45deg)" }} /></button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// One row in the companion's per-question progress timeline.
function IdpStep({ n, label, status, note, noteKind, last, stepRef }) {
  const map = {
    done:    { ring: eSUCCESS, fill: eSUCCESS, fg: "#fff", ic: <I.check size={12} /> },
    current: { ring: eBLUE, fill: "var(--card)", fg: eBLUE, ic: null },
    error:   { ring: eDANGER, fill: eDANGER, fg: "#fff", ic: <I.alertCircle size={12} /> },
    pending: { ring: eLINE, fill: "var(--card)", fg: eMUT, ic: null },
  };
  const s = map[status];
  const nb = noteKind === "error"
    ? { bg: "color-mix(in srgb, var(--danger) 8%, transparent)", bd: "color-mix(in srgb, var(--danger) 24%, transparent)" }
    : noteKind === "done"
    ? { bg: "rgba(20,133,61,.06)", bd: "rgba(20,133,61,.2)" }
    : { bg: "color-mix(in srgb, var(--accent) 6%, transparent)", bd: "color-mix(in srgb, var(--accent) 16%, transparent)" };
  return (
    <div ref={stepRef} style={{ display: "flex", gap: 12, alignItems: "stretch" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 24, height: 24, borderRadius: 999, background: s.fill, border: "2px solid " + s.ring, color: s.fg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "var(--sans)", fontSize: 11, fontWeight: 700 }}>{s.ic || n}</div>
        {!last && <div style={{ flex: 1, width: 2, background: eLINE, marginTop: 2, minHeight: 10 }} />}
      </div>
      <div style={{ flex: 1, minWidth: 0, paddingBottom: last ? 2 : 16 }}>
        <div style={{ fontFamily: "var(--sans)", fontSize: 12, fontWeight: 700, color: status === "pending" ? eMUT : status === "error" ? eDANGER : eMID, marginTop: 3 }}>Question {n} · {label}</div>
        {note && <div style={{ marginTop: 6, background: nb.bg, border: "1px solid " + nb.bd, borderRadius: 10, padding: "8px 11px", fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.5 }}>{note}</div>}
      </div>
    </div>
  );
}

function IdpWizard({ initial, onBack, onFinish }) {
  const [qi, setQi] = idpUseState(0);
  const [ans, setAns] = idpUseState(initial || {});
  // Coach experience skin: 1 = classic wizard (default), 2 = conversational coach,
  // 3 = pure chat ("Your Development Guide") — no question box, no companion panel.
  const [design, setDesign] = idpUseState(() => { try { const d = parseInt(localStorage.getItem("idp-coach-design"), 10); return d === 2 || d === 3 ? d : 1; } catch (e) { return 1; } });
  const pickDesign = (d) => { setDesign(d); try { localStorage.setItem("idp-coach-design", String(d)); } catch (e) {} };
  React.useLayoutEffect(() => { idpScrollTop(); }, [qi]);
  const [aiLoading, setAiLoading] = idpUseState(false);
  const [typing, setTyping] = idpUseState(false);
  const [messages, setMessages] = idpUseState([{ from: "bot", text: `Hi ${LH.user.first}! Answer each question and I'll capture insights and suggestions here as you go.` }]);
  const [ask, setAsk] = idpUseState("");
  const [error, setError] = idpUseState(null);   // set when the current answer fails validation
  const [uploadStatus, setUploadStatus] = idpUseState(null); // null | "ok" | "wrong" (documents step)
  const ackedRef = idpUseRef({});
  const upTriesRef = idpUseRef(0);
  // Track questions that hit a validation error and were then corrected → a neutral
  // "revised" marker in the Option 2 companion (a light audit trail, not a red flag).
  const erroredRef = idpUseRef({});
  const [revised, setRevised] = idpUseState({});

  // ── Design 3 ("Your Development Guide") — plain chat transcript state ──
  const [g3Msgs, setG3Msgs] = idpUseState(null);   // null until the chat is seeded
  const [g3Input, setG3Input] = idpUseState("");
  const [g3Step, setG3Step] = idpUseState(0);       // index into G3_SCRIPT
  const [g3Confirm, setG3Confirm] = idpUseState(false); // "discard this chat?" popover
  const [g3Attach, setG3Attach] = idpUseState(false);   // composer switched to drag-and-drop
  const [g3Doc, setG3Doc] = idpUseState(null);          // the accepted document { name, size }
  const g3UpTries = idpUseRef(0);
  const [g3Typing, setG3Typing] = idpUseState(false);
  const [g3Done, setG3Done] = idpUseState(false);
  const g3EndRef = idpUseRef(null);
  const g3ScrollRef = idpUseRef(null);
  const chatRef = idpUseRef(null);
  const curStepRef = idpUseRef(null);
  const coachScrollRef = idpUseRef(null);   // Coach (design 2) companion scroll area
  const coachCurRef = idpUseRef(null);      // Coach (design 2) current-question card
  // Keep the current question's step at the top of the companion (linked to the
  // question) in BOTH designs, so answering never buries the current step below.
  idpUseEffect(() => {
    const c1 = chatRef.current, s1 = curStepRef.current; if (c1 && s1) c1.scrollTop = Math.max(0, s1.offsetTop - 14);
    const c2 = coachScrollRef.current, s2 = coachCurRef.current; if (c2 && s2) { const cr = c2.getBoundingClientRect(), sr = s2.getBoundingClientRect(); c2.scrollTop = Math.max(0, c2.scrollTop + (sr.top - cr.top) - 12); }
  }, [qi, error, uploadStatus]);
  // When you reach the (optional) documents step, the companion offers to take a file.
  idpUseEffect(() => {
    if (IDP_Q[qi].type === "upload" && !ackedRef.current["docs-prompt"]) {
      ackedRef.current["docs-prompt"] = true;
      setTyping(true);
      setTimeout(() => { setMessages((m) => [...m, { from: "bot", text: "If you have a document that could help tailor your plan, you can upload it now — this step is optional." }]); setTyping(false); }, 600);
    }
  }, [qi]);
  const total = IDP_Q.length;
  const q = IDP_Q[qi];
  const val = ans[qi];
  // Moving to another question clears any standing error + upload state.
  idpUseEffect(() => { setError(null); setUploadStatus(null); }, [qi]);
  // Editing a text/selection answer clears its error; the upload step manages its
  // own doc-error (set/cleared explicitly), so don't auto-clear it on file change.
  idpUseEffect(() => { if (IDP_Q[qi].type !== "upload") setError(null); }, [val]);

  const setVal = (v) => setAns((a) => ({ ...a, [qi]: v }));
  const runAI = () => {
    setAiLoading(true);
    setTimeout(() => {
      if (q.type === "text" || q.type === "multi") setVal(q.ai);
      else if (q.type === "timeline") setVal({ ...(val || {}), ai: q.ai });
      setAiLoading(false);
    }, 1300);
  };

  const answered = q.type === "text" ? (val && val.trim())
    : q.type === "radio" ? !!val
    : q.type === "multi" ? (val && val.length > 0)
    : q.type === "timeline" ? (val && (val.quick || (val.start && val.end)))
    : true;
  const ackCurrent = () => {
    if (q.type === "upload") return; // the upload step posts its own evaluation messages
    if (answered && !ackedRef.current[qi]) {
      ackedRef.current[qi] = true;
      const reply = idpCompanion(q, ans[qi]);
      const stepNo = qi + 1;
      setTyping(true);
      setTimeout(() => { setMessages((m) => [...m, { from: "bot", text: reply, step: stepNo }]); setTyping(false); }, 700);
    }
  };
  const next = () => {
    // A wrong document on the (optional) upload step blocks Finish until it's removed/replaced.
    if (q.type === "upload" && uploadStatus === "wrong") { erroredRef.current[qi] = true; setError({ kind: "doc", reason: "This document doesn't look relevant.", guide: "Upload a different file, or remove it to continue without one." }); return; }
    const check = idpValidate(q, val);
    if (!check.ok) {
      // Block progress, mark the question + companion red, and coach the user.
      erroredRef.current[qi] = true;
      setError(check);
      const msg = check.reason + " " + check.guide;
      setMessages((m) => (m.length && m[m.length - 1].err && m[m.length - 1].text === msg) ? m : [...m, { from: "bot", err: true, text: msg }]);
      return;
    }
    setError(null);
    // If this question had been flagged earlier, it's now been corrected → mark revised.
    if (erroredRef.current[qi]) setRevised((r) => (r[qi] ? r : { ...r, [qi]: true }));
    ackCurrent();
    if (qi < total - 1) setQi(qi + 1); else setTimeout(() => onFinish(ans), 800);
  };
  const back = () => { if (qi > 0) setQi(qi - 1); else onBack(); };
  // Mock upload → the companion evaluates the file. The first attempt is an off-topic file
  // (flagged, since it has no development feedback); a second is valid (accepted). Optional step.
  const doUpload = () => {
    const wrong = upTriesRef.current === 0;
    upTriesRef.current += 1;
    const file = wrong ? { name: "ux-design.pdf", size: "174 KB" } : { name: "Manager_Feedback_2025.pdf", size: "212 KB" };
    setVal(file.name);
    setUploadStatus(wrong ? "wrong" : "ok");   // drives the companion's documents step note
    // A wrong document is treated like a validation error (red card + inline note + blocks Finish).
    if (wrong) setError({ kind: "doc", reason: "This document doesn't look relevant.", guide: "Upload a different file (like manager feedback or a performance review), or remove it to continue without one." });
    else setError(null);
  };
  // Reset chat: clear answers, jump back to question 1, and note it in the companion.
  const resetChat = () => {
    ackedRef.current = {};
    upTriesRef.current = 0;
    erroredRef.current = {};
    setRevised({});
    setUploadStatus(null);
    setError(null);
    setAns({});
    setQi(0);
    setTyping(false);
    setMessages([{ from: "bot", text: `Chat cleared — let's start fresh, ${LH.user.first}. Answer each question again and I'll capture new insights here.` }]);
  };
  // On Q1 the back lives in the shell's top bar (→ chat instructions). From Q2 on,
  // the top-bar back is removed and an inline "Back" button in the footer steps to
  // the previous question instead.
  useTopBarBack(qi === 0, "Back", back);
  const submitAsk = () => {
    const tx = ask.trim(); if (!tx) return;
    setMessages((m) => [...m, { from: "user", text: tx }]);
    setAsk("");
    setTyping(true);
    setTimeout(() => { setMessages((m) => [...m, { from: "bot", text: "Great question \u2014 I'll factor that into your plan. Keep answering and I'll keep refining my suggestions for you." }]); setTyping(false); }, 850);
  };

  // The answer input for the current question \u2014 shared by both coach designs.
  const renderInput = () => (
    <React.Fragment>
      {q.type === "text" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <textarea value={val || ""} onChange={(e) => setVal(e.target.value)} placeholder="Type your answer here…" rows={4} style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 10, border: "1.5px solid " + eLINE, fontSize: 14, resize: "vertical", outline: "none", fontFamily: "var(--sans)", color: eINK, lineHeight: 1.6 }} />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 9, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eMUT }}><span style={{ color: eBLUE, display: "flex" }}><I.spark size={14} /></span> Suggested by AI</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {q.chips.map((c) => { const on = (val || "").includes(c); return <IdpChip key={c} label={c} selected={on} onClick={() => setVal(val ? (on ? val : val + ", " + c) : c)} />; })}
            </div>
          </div>
        </div>
      )}

      {q.type === "radio" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {q.options.map((o) => { const sel = val === o.value; const Ic = I[o.icon]; return (
            <div key={o.value} onClick={() => setVal(o.value)} style={{ padding: "14px 16px", borderRadius: 12, border: "1.5px solid " + (sel ? eBLUE : eLINE), background: sel ? "color-mix(in srgb, var(--accent) 5%, transparent)" : "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 13, transition: "border-color .15s, background .15s" }}>
              <span style={{ width: 38, height: 38, borderRadius: 10, background: sel ? eBLUE : "rgba(0,15,71,.05)", color: sel ? "#fff" : eMID, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Ic size={18} /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eMID }}>{o.label}</div>
                <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, marginTop: 2 }}>{o.desc}</div>
              </div>
              <span style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid " + (sel ? eBLUE : "rgba(0,15,71,.2)"), background: sel ? eBLUE : "#fff", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>{sel && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--card)" }} />}</span>
            </div>
          ); })}
        </div>
      )}

      {q.type === "multi" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <IdpMultiSelect options={q.skills} selected={val || []} onChange={(v) => setVal(v)} placeholder={q.placeholder} />
        </div>
      )}

      {q.type === "timeline" && (() => {
        const PlDR = window.EdPlan && window.EdPlan.PlDateRange;
        const iso = (d) => { const p = (x) => String(x).padStart(2, "0"); return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()); };
        const setQuick = (label) => { const n = parseInt(label, 10) || 1; const s = new Date(); const e = new Date(); e.setMonth(e.getMonth() + n); setVal({ start: iso(s), end: iso(e), quick: label }); };
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {PlDR
              ? <PlDR start={(val && val.start) || ""} end={(val && val.end) || ""} onChange={(v) => setVal({ ...(val || {}), ...v, quick: "" })} />
              : <div style={{ border: "1.5px solid " + eLINE, borderRadius: 10, padding: "11px 14px", display: "flex", alignItems: "center", gap: 10 }}><span style={{ color: eMUT, display: "flex" }}><I.cal size={17} /></span><input type="date" value={(val && val.start) || ""} onChange={(e) => setVal({ ...(val || {}), start: e.target.value, quick: "" })} style={{ border: "none", outline: "none", fontSize: 14, color: eINK, fontFamily: "var(--sans)", flex: 1, background: "transparent" }} /></div>}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {q.quick.map((b) => { const on = val && val.quick === b; return <button key={b} onClick={() => setQuick(b)} style={{ flex: "1 1 0", minWidth: 76, padding: "9px 4px", borderRadius: 9, border: "1.5px solid " + (on ? eBLUE : eLINE), background: on ? "color-mix(in srgb, var(--accent) 6%, transparent)" : "#fff", color: on ? eBLUE : eINK, fontWeight: on ? 700 : 500, fontSize: 14, fontFamily: "var(--sans)", cursor: "pointer" }}>{b}</button>; })}
            </div>
          </div>
        );
      })()}

      {q.type === "upload" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, margin: 0, lineHeight: 1.55 }}>{q.hint}</p>
          {val ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 10, background: "rgba(0,15,71,.03)", border: "1px solid " + eLINE }}>
              <span style={{ color: eBLUE, display: "flex" }}><I.fileText size={17} /></span>
              <span style={{ flex: 1, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eMID }}>{val}</span>
              <button onClick={() => { setVal(null); setUploadStatus(null); setError(null); }} aria-label="Remove" style={{ background: "none", border: "none", color: eMUT, cursor: "pointer", display: "flex" }}><I.plus size={16} style={{ transform: "rotate(45deg)" }} /></button>
            </div>
          ) : (
            <button onClick={doUpload} style={{ border: "1.5px dashed var(--line)", borderRadius: 12, padding: "30px 20px", textAlign: "center", cursor: "pointer", background: "rgba(0,15,71,.02)", width: "100%" }}>
              <span style={{ color: eBLUE, display: "flex", justifyContent: "center", marginBottom: 8 }}><I.upload size={24} /></span>
              <div style={{ color: eMID, fontWeight: 600, fontSize: 14, fontFamily: "var(--sans)" }}>Click to upload a document</div>
              <div style={{ color: eMUT, fontSize: 14, fontFamily: "var(--sans)", marginTop: 4 }}>PDF, DOC, DOCX up to 10MB</div>
            </button>
          )}
        </div>
      )}
    </React.Fragment>
  );

  // A short "captured" summary of an answer \u2014 powers the Option 2 companion tags.
  const capturedTags = (i) => {
    const qq = IDP_Q[i], v = ans[i];
    if (v == null || v === "") return [];
    if (qq.type === "multi") return Array.isArray(v) ? v.slice(0, 4) : [];
    if (qq.type === "radio") { const o = (qq.options || []).find((x) => x.value === v); return o ? [o.label] : [v]; }
    if (qq.type === "timeline") { const f = idpFmt(qq, v); return f ? [f] : []; }
    if (qq.type === "upload") return [v];
    if (qq.type === "text") { const hit = (qq.chips || []).filter((c) => v.includes(c)); return hit.length ? hit.slice(0, 4) : [qq.short]; }
    return [qq.short];
  };

  // Shared design switcher \u2014 a floating chip (like "All directions") to flip skins.
  const designSwitch = (
    <div className="ed-idp-designchip" style={{ position: "fixed", left: "calc(var(--rail-w, 256px) + 20px)", bottom: 16, zIndex: 45, display: "flex", alignItems: "center", gap: 8, background: eCARD, border: "1px solid " + eLINE, borderRadius: 10, padding: "7px 9px 7px 12px", boxShadow: "0 6px 20px rgba(0,15,71,.12)" }}>
      <span style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: eMUT }}>Coach design</span>
      {[1, 2, 3].map((d) => (
        <button key={d} onClick={() => pickDesign(d)} title={d === 1 ? "Classic wizard" : d === 2 ? "Conversational coach" : "Chat only — Your Development Guide"}
          style={{ width: 30, height: 28, borderRadius: 7, border: "1px solid " + (design === d ? eBLUE : eLINE), background: design === d ? eBLUE : "#fff", color: design === d ? "#fff" : eMID, fontFamily: "var(--sans)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{d}</button>
      ))}
    </div>
  );

  // ── Option 2 · "Coaching Conversation" ─────────────────────────────────────
  const renderCoachChat = () => {
    const pct = Math.round((qi / total) * 100);
    const rC = 27, circ = 2 * Math.PI * rC;
    const resetBtn = (
      <button onClick={resetChat} title="Start over from question 1"
        style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "1px solid " + eLINE, borderRadius: 8, cursor: "pointer", color: eMUT, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, flexShrink: 0, padding: "7px 12px" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 2.6-6.4" /><path d="M3 4v5h5" /></svg>
        Reset
      </button>
    );
    // themes captured so far (from answered questions)
    const themes = []; for (let i = 0; i < qi; i++) { capturedTags(i).forEach((tg) => { if (tg && !themes.includes(tg)) themes.push(tg); }); }
    return (
      <React.Fragment>
        {designSwitch}
        <div className="ed-idp-main" style={{ maxWidth: "var(--content-max)", margin: "0 auto", width: "100%" }}>
          {/* coach hero */}
          <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 18 }}>
            <div style={{ width: 52, height: 52, flexShrink: 0 }}>
              <div style={{ width: 52, height: 52, borderRadius: 15, background: "var(--surface-deep)", color: eSKY, display: "flex", alignItems: "center", justifyContent: "center" }}><I.spark size={24} /></div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "var(--sans)", fontSize: 17, fontWeight: 700, color: eMID }}>AI Coach</div>
              <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT }}>A quick guided conversation — {total} questions to shape your plan.</div>
            </div>
            {resetBtn}
          </div>
          {/* progress bar */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: eMUT }}>
              <span>Question {qi + 1} of {total}</span><span>{pct}% complete</span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: "rgba(0,15,71,.08)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: pct + "%", borderRadius: 3, background: "var(--accent)", transition: "width .35s" }} />
            </div>
          </div>
          {/* conversation */}
          <div style={{ display: "flex", gap: 11, alignItems: "flex-start", marginBottom: 16 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "var(--surface-deep)", color: eSKY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><I.spark size={16} /></div>
            <div style={{ flex: 1, minWidth: 0, background: "#fff", border: "1px solid " + eLINE, borderRadius: 16, padding: "16px 18px" }}>
              <div style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: eBLUE, marginBottom: 6 }}>Question {qi + 1}</div>
              <div className="serif" style={{ fontSize: 20, color: eMID, lineHeight: 1.25 }}>{q.q}</div>
            </div>
          </div>
          {/* reply dock */}
          <div style={{ marginLeft: 45 }}>
            <div style={{ background: error ? "color-mix(in srgb, var(--danger) 5%, var(--card))" : eCARD, border: error ? "1.5px solid " + eDANGER : "1px solid " + eLINE, borderRadius: 16, padding: "18px 18px 20px", transition: "border-color .2s, background .2s" }}>
              <div style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", color: eMUT, marginBottom: 13 }}>Your reply</div>
              {renderInput()}
            </div>
            {/* Only errors surface inline (you must see them). Positive coach responses
                live on the right, under the Companion, once a question is captured — so
                they don't distract while the user is still filling their answer. */}
            {error && (
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 12, background: "color-mix(in srgb, var(--danger) 7%, transparent)", border: "1px solid color-mix(in srgb, var(--danger) 30%, transparent)", borderRadius: 12, padding: "12px 14px" }}>
                <span style={{ color: eDANGER, display: "flex", flexShrink: 0, marginTop: 1 }}><I.alertCircle size={17} /></span>
                <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.5 }}>
                  <span style={{ fontWeight: 700, color: eDANGER }}>{error.kind === "doc" ? "This isn't a relevant document." : error.kind === "offtopic" ? "This answer doesn't match the question." : error.kind === "nonsense" ? "That doesn't look like a valid answer." : "Your answer needs a little more."}</span> {error.guide} <span style={{ color: eMUT }}>You can't continue until this is resolved.</span>
                </div>
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 18 }}>
              {qi > 0 && <EdBtn onClick={() => { setError(null); setQi(qi - 1); }}><I.arrowL size={16} /> Back</EdBtn>}
              <div style={{ flex: 1 }} />
              <EdBtn primary onClick={next} disabled={!answered}>{qi === total - 1 ? "Finish" : "Continue"} <I.arrow size={16} /></EdBtn>
            </div>
          </div>
        </div>

        {/* Companion · "Your profile, taking shape" */}
        <aside className="ed-idp-notes ed-idp-rail" style={{ position: "fixed", top: 59, right: 0, bottom: 0, width: 344, zIndex: 30, background: eCARD, borderLeft: error ? "3px solid " + eDANGER : "1px solid " + eLINE, display: "flex", flexDirection: "column", overflow: "hidden", transition: "border-color .2s" }}>
          <div style={{ padding: "18px 18px 16px", borderBottom: "1px solid " + (error ? "color-mix(in srgb, var(--danger) 30%, transparent)" : eLINE), background: error ? "color-mix(in srgb, var(--danger) 6%, transparent)" : "transparent", transition: "background .2s" }}>
            <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: error ? eDANGER : eMID }}>AI Coach Companion</div>
            <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: error ? eDANGER : eMUT, marginBottom: 15 }}>Your profile, taking shape as you answer</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ position: "relative", width: 64, height: 64, flexShrink: 0 }}>
                <svg width="64" height="64" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r={rC} fill="none" stroke="rgba(0,15,71,.09)" strokeWidth="6" />
                  <circle cx="32" cy="32" r={rC} fill="none" stroke={error ? eDANGER : eBLUE} strokeWidth="6" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - qi / total)} transform="rotate(-90 32 32)" style={{ transition: "stroke-dashoffset .4s" }} />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: eMID }}>{qi}/{total}</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eMID }}>{qi} of {total} captured</div>
                <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: eMUT, lineHeight: 1.45, marginTop: 3 }}>{error ? "One answer needs a quick fix." : qi === 0 ? "Answer to start building your profile." : qi === total ? "All done — great work!" : "Nice progress — keep going."}</div>
              </div>
            </div>
          </div>
          <div ref={coachScrollRef} style={{ flex: 1, overflowY: "auto", padding: "16px 16px 70vh" }}>
            {themes.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", color: eMUT, marginBottom: 10 }}>What we have learned</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {themes.slice(0, 12).map((tg, ix) => <span key={ix} style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: eBLUE, background: "color-mix(in srgb, var(--accent) 10%, var(--card))", border: "1px solid color-mix(in srgb, var(--accent) 22%, transparent)", borderRadius: 8, padding: "5px 10px" }}>{tg}</span>)}
                </div>
              </div>
            )}
            <div style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", color: eMUT, marginBottom: 10 }}>Questions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {IDP_Q.map((qq, i) => {
                const isCur = i === qi, isErr = isCur && !!error, done = i < qi;
                const tags = done ? capturedTags(i) : [];
                const doneNote = done ? (qq.type === "upload" ? (ans[i] ? "Received “" + ans[i] + "”. I'll factor it into your plan." : "No document added — I'll work from your answers.") : idpCompanion(qq, ans[i])) : null;
                return (
                  <div key={i} ref={isCur ? coachCurRef : null} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "9px 11px", borderRadius: 10, background: isErr ? "color-mix(in srgb, var(--danger) 6%, transparent)" : isCur ? "color-mix(in srgb, var(--accent) 6%, transparent)" : done ? "rgba(0,15,71,.02)" : "transparent", border: "1px solid " + (isErr ? "color-mix(in srgb, var(--danger) 30%, transparent)" : isCur ? "color-mix(in srgb, var(--accent) 25%, transparent)" : "transparent") }}>
                    <span style={{ marginTop: 1, flexShrink: 0, width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: isErr ? eDANGER : done ? eSUCCESS : isCur ? eBLUE : "rgba(0,15,71,.10)", color: (done || isCur || isErr) ? "#fff" : eMUT, fontFamily: "var(--sans)", fontSize: 13, fontWeight: 700 }}>{isErr ? "!" : done ? <I.check size={12} /> : (i + 1)}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600, color: (isCur || done) ? eMID : eMUT }}>{qq.short}</span>
                        {revised[i] && <span title="This answer was revised" style={{ fontFamily: "var(--sans)", fontSize: 11, fontWeight: 700, letterSpacing: ".03em", textTransform: "uppercase", color: eMUT, background: "rgba(0,15,71,.06)", borderRadius: 5, padding: "1px 6px" }}>Revised</span>}
                      </div>
                      {isErr ? <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: eDANGER, lineHeight: 1.45, marginTop: 3 }}>{error.reason}</div>
                        : done ? <React.Fragment>
                            {tags.length > 0 && <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 5 }}>{tags.map((tg, ix) => <span key={ix} style={{ fontFamily: "var(--sans)", fontSize: 12, color: eMUT, background: "rgba(0,15,71,.05)", borderRadius: 6, padding: "2px 7px" }}>{tg}</span>)}</div>}
                            {doneNote && <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: eINK, lineHeight: 1.5, marginTop: 6 }}>{doneNote}</div>}
                          </React.Fragment>
                        : isCur ? <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: eMUT, marginTop: 3 }}>Answering now…</div>
                        : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </React.Fragment>
    );
  };

  // ── Option 3 · "Your Development Guide" — a pure chat, no question box ────────
  // The guide follows its own scripted conversation (G3_SCRIPT). Each step is one
  // message plus its suggestion tags; tapping a tag (or typing) advances the script.
  idpUseEffect(() => {
    if (design !== 3 || g3Msgs) return;
    setG3Msgs([{ from: "bot", text: G3_SCRIPT[0].text(LH.user.first) }]);
  }, [design, g3Msgs]);
  // Keep the newest message in view.
  idpUseEffect(() => {
    if (design !== 3) return;
    const el = g3EndRef.current; if (el && el.scrollIntoView) el.scrollIntoView({ block: "end" });
  }, [g3Msgs, g3Typing, design]);

  const g3Push = (msg) => setG3Msgs((m) => [...(m || []), msg]);
  const g3Seed = () => [{ from: "bot", text: G3_SCRIPT[0].text(LH.user.first) }];
  const g3Reset = () => { setG3Msgs(g3Seed()); setG3Step(0); setG3Input(""); setG3Done(false); setG3Typing(false); setG3Confirm(false); setG3Attach(false); setG3Doc(null); g3UpTries.current = 0; };

  // Ask the next scripted question, or close with the Chat Insight Summary.
  const g3Advance = (answers, fromStep) => {
    const nextStep = fromStep + 1;
    if (nextStep < G3_SCRIPT.length) {
      const prev = answers["g3-" + G3_SCRIPT[fromStep].id];
      g3Push({ from: "bot", text: G3_SCRIPT[nextStep].text(LH.user.first, prev) });
      setG3Step(nextStep);
    } else {
      setG3Done(true);
      g3Push({ kind: "summary", answers: answers });
    }
  };

  const g3Send = (raw) => {
    if (g3Done || g3Typing) return;
    const text = String(raw != null ? raw : g3Input).trim();
    if (!text) return;
    g3Push({ from: "me", text });
    setG3Input("");

    // "I'd like to attach my feedback doc" → open the drag-and-drop step instead of
    // treating it as the answer. The scripted question stays where it is.
    if (G3_ATTACH_RE.test(text) && !G3_SCRIPT[g3Step].chips.some((c) => c.toLowerCase() === text.toLowerCase())) {
      setG3Typing(true);
      setTimeout(() => {
        setG3Typing(false);
        g3Push({ from: "bot", text: "Sure — drop your document below and I'll take a look. Manager feedback, a performance review or a 360 report works best." });
        setG3Attach(true);   // the composer turns into the drag-and-drop area
      }, 700);
      return;
    }

    const step = G3_SCRIPT[g3Step];
    const answers = { ...ans, ["g3-" + (step ? step.id : g3Step)]: text };
    setAns(answers);
    setG3Typing(true);
    setTimeout(() => {
      setG3Typing(false);
      // "Yes, I have some feedback" → ask for the document instead of moving on.
      if (step && step.evidence && /^yes/i.test(text)) {
        g3Push({ from: "bot", text: "Great! Please upload the feedback or assessment document, and I'll analyze it to incorporate relevant insights into your development plan." });
        setG3Attach(true);
        return;
      }
      g3Advance(answers, g3Step);
    }, 800);
  };

  // A dropped / browsed file is checked for relevance before it's accepted.
  const g3File = (name) => {
    const fname = name || (g3UpTries.current === 0 ? "ux-design-portfolio.pdf" : "Manager_Feedback_2025.pdf");
    g3UpTries.current += 1;
    g3Push({ from: "me", text: fname, file: true });
    setG3Typing(true);
    setTimeout(() => {
      setG3Typing(false);
      if (!G3_RELEVANT_RE.test(fname)) {
        // Stay in drag-and-drop mode so they can try another file straight away.
        g3Push({ from: "bot", err: true, text: "This file doesn't look related to your development. Please upload the relevant file — for example manager feedback, a performance review or a 360 report." });
        return;
      }
      setG3Attach(false);   // accepted → composer returns to normal
      setAns((a) => ({ ...a, "g3-doc": fname }));
      setG3Doc({ name: fname, size: "212 KB" });
      g3Push({ kind: "file", name: fname, size: "212 KB" });
      g3Push({ from: "bot", text: "Thanks — I've reviewed " + fname + ". Here's what I took from it: your feedback highlights strong delivery and collaboration, with stakeholder communication and delegation called out as areas to grow. I'll factor that into your plan." });
      const cur = G3_SCRIPT[g3Step];
      if (cur && cur.evidence) { const withDoc = { ...ans, "g3-doc": fname }; setTimeout(() => g3Advance(withDoc, g3Step), 500); }
      else g3Push({ from: "bot", text: cur.text(LH.user.first) });
    }, 900);
  };


  // Uploaded-document card — same treatment as the other flows (PDF chip + Analysed).
  const g3FileCard = (name, size, onRemove) => (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, background: "rgba(0,15,71,.03)", border: "1px solid " + eLINE, maxWidth: 380 }}>
      <span style={{ width: 34, height: 40, borderRadius: 5, background: "#E4453A", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "var(--sans)", fontSize: 8, fontWeight: 800, letterSpacing: ".04em" }}>PDF</span>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eMID, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
        <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eSUCCESS, fontWeight: 600 }}>Analysed{size ? " · " + size : ""}</div>
      </div>
      {onRemove && (
        <button onClick={onRemove} title="Remove document" style={{ background: "none", border: "none", cursor: "pointer", color: eMUT, display: "flex", padding: 3, flexShrink: 0 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      )}
    </div>
  );

  // The composer itself becomes the drag-and-drop target while attaching.
  const g3DropZone = () => (
    <div onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.background = "color-mix(in srgb, var(--accent) 6%, transparent)"; }}
      onDragLeave={(e) => { e.currentTarget.style.background = "var(--card)"; }}
      onDrop={(e) => { e.preventDefault(); e.currentTarget.style.background = "var(--card)"; const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]; g3File(f ? f.name : null); }}
      onClick={() => g3File(null)}
      style={{ position: "relative", border: "1px solid " + eLINE, borderRadius: 12, background: "var(--card)", padding: "30px 18px", textAlign: "center", cursor: "pointer", transition: "background .15s" }}>
      <div style={{ color: eMID, display: "flex", justifyContent: "center", marginBottom: 10 }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 18a4.5 4.5 0 0 1-.5-9 6 6 0 0 1 11.5 1.5A3.75 3.75 0 0 1 17.5 18" /><path d="M12 21v-8" /><path d="M9 15l3-3 3 3" /></svg>
      </div>
      <div style={{ fontFamily: "var(--sans)", fontSize: 16, fontWeight: 700, color: eMID }}>Click or drop file here</div>
      <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, marginTop: 4 }}>Supported file type: PDF documents up to 5MB</div>
    </div>
  );

  // Closing "Chat Insight Summary" card — review, then proceed to plan creation.
  const g3Summary = (answers) => {
    const a = answers || ans;
    const rows = G3_SCRIPT.filter((s) => !s.learning && a["g3-" + s.id]);
    const learnStep = G3_SCRIPT.find((s) => s.learning);
    const learning = learnStep ? a["g3-" + learnStep.id] : null;
    const doc = a["g3-doc"];
    return (
      <div style={{ width: "100%", boxSizing: "border-box", border: "1px solid " + eLINE, borderRadius: 14, background: eCARD, padding: "22px 24px" }}>
        <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.6, margin: 0 }}>I've captured the key insights from your responses. Please review and confirm to proceed with your development plan.</p>
        <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.6, margin: "6px 0 0" }}>Disclaimer: This development plan includes AI-generated recommendations designed to support your growth. Please use your judgement when applying these suggestions.</p>
        <div style={{ borderTop: "1px solid " + eLINE, margin: "18px 0" }} />
        <h2 style={{ fontFamily: "var(--sans)", fontSize: 21, fontWeight: 700, color: eMID, margin: "0 0 14px" }}>Chat Insight Summary</h2>
        <div style={{ background: "rgba(0,15,71,.045)", borderRadius: 10, padding: "18px 20px" }}>
          <h3 style={{ fontFamily: "var(--sans)", fontSize: 16, fontWeight: 700, color: eMID, margin: "0 0 8px" }}>Your Responses</h3>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {rows.map((s) => (
              <li key={s.id} style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.75 }}>
                <strong style={{ color: eMID }}>{s.label}:</strong> {a["g3-" + s.id]}
              </li>
            ))}
            {doc && <li style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.75 }}><strong style={{ color: eMID }}>Document reviewed:</strong> {doc}</li>}
          </ul>
          {learning && (
            <React.Fragment>
              <h3 style={{ fontFamily: "var(--sans)", fontSize: 16, fontWeight: 700, color: eMID, margin: "16px 0 6px" }}>Learning Preference</h3>
              <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.6, margin: 0 }}>You prefer to learn through <strong style={{ color: eMID }}>{learning}</strong>, which will guide the selection of development actions in your plan.</p>
            </React.Fragment>
          )}
        </div>

        {/* Program Report Summary — the skill-gap analysis, as on the Analysis page */}
        <h2 style={{ fontFamily: "var(--sans)", fontSize: 21, fontWeight: 700, color: eMID, margin: "22px 0 10px" }}>Program Report Summary</h2>
        <div style={{ background: "rgba(0,15,71,.045)", borderRadius: 10, padding: "18px 20px" }}>
          <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.6, margin: 0 }}>{G3_GAPS.overview}</p>
          <h3 style={{ fontFamily: "var(--sans)", fontSize: 16, fontWeight: 700, color: eMID, margin: "16px 0 10px" }}>Priority gaps</h3>
          {G3_GAPS.gaps.map((g, i) => (
            <div key={i} style={{ marginBottom: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, marginBottom: 5 }}>
                <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eMID }}>{g.skill}</span>
                <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, whiteSpace: "nowrap" }}>{g.score.toFixed(1)} / {g.target.toFixed(1)} target</span>
              </div>
              <div style={{ position: "relative", height: 6, borderRadius: 3, background: "rgba(0,15,71,.10)" }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: (g.score / 5 * 100) + "%", background: eWARN, borderRadius: 3 }} />
                <div style={{ position: "absolute", left: (g.target / 5 * 100) + "%", top: -2, bottom: -2, width: 2, background: eMID, borderRadius: 1 }} title="Target" />
              </div>
              <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, marginTop: 4 }}>{g.note}</div>
            </div>
          ))}
          <h3 style={{ fontFamily: "var(--sans)", fontSize: 16, fontWeight: 700, color: eMID, margin: "16px 0 6px" }}>Strengths to leverage</h3>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {G3_GAPS.strengths.map((s, i) => <li key={i} style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.75 }}>{s}</li>)}
          </ul>
        </div>

        {/* Uploaded file — now lives inside the summary, not below the chat */}
        {g3Doc && (
          <React.Fragment>
            <h2 style={{ fontFamily: "var(--sans)", fontSize: 21, fontWeight: 700, color: eMID, margin: "22px 0 10px" }}>Uploaded File</h2>
            {g3FileCard(g3Doc.name, g3Doc.size, null)}
          </React.Fragment>
        )}
        <div style={{ borderTop: "1px solid " + eLINE, margin: "18px 0" }} />
        <p style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: eMID, lineHeight: 1.6, margin: "0 0 14px" }}>I can now create a tailored plan with practical actions to support your growth. You can also restart the chat to refine your inputs, if needed.</p>
        <div style={{ position: "relative", display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => setG3Confirm(true)}
            style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--danger)", color: "#fff", border: "none", borderRadius: 8, padding: "11px 17px", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 2.6-6.4" /><path d="M3 4v5h5" /></svg> Reset Chat
          </button>
          <button onClick={() => onFinish(a, true)}
            style={{ display: "inline-flex", alignItems: "center", gap: 7, background: eBLUE, color: "#fff", border: "none", borderRadius: 8, padding: "11px 17px", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
            <I.check size={16} /> Yes, proceed with plan creation
          </button>
          {g3Confirm && (
            <div style={{ position: "absolute", bottom: "calc(100% + 10px)", left: 0, background: eCARD, border: "1px solid " + eLINE, borderRadius: 12, boxShadow: "0 12px 36px rgba(0,15,71,.18)", padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, zIndex: 20 }}>
              <span style={{ color: "var(--action)", display: "flex", flexShrink: 0 }}><I.alertCircle size={18} /></span>
              <span style={{ fontFamily: "var(--sans)", fontSize: 15, color: eMID, whiteSpace: "nowrap" }}>Are you sure you want to discard this chat and start new?</span>
              <button onClick={() => setG3Confirm(false)} style={{ background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 7, padding: "6px 14px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eMID, cursor: "pointer" }}>No</button>
              <button onClick={g3Reset} style={{ background: eBLUE, border: "none", borderRadius: 7, padding: "6px 16px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer" }}>Yes</button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCoachGuide = () => {
    const chips = (!g3Done && !g3Typing && G3_SCRIPT[g3Step]) ? G3_SCRIPT[g3Step].chips || [] : [];
    const msgs = g3Msgs || [];
    const avatar = (
      <span style={{ width: 30, height: 30, borderRadius: "50%", background: "color-mix(in srgb, var(--accent) 12%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: eBLUE }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3 6H9l3-6z" /><path d="M9.5 8h5l1.5 13H8L9.5 8z" /><path d="M8 14h8" /></svg>
      </span>
    );
    return (
      <React.Fragment>
        {designSwitch}
        <div className="ed-idp-main" style={{ maxWidth: "var(--content-max)", margin: "0 var(--fol-mx)", width: "100%", display: "flex", flexDirection: "column", height: "calc(100vh - 132px)", minHeight: 520 }}>
          {/* header */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 0 16px", borderBottom: "1px solid " + eLINE, flexShrink: 0 }}>
            <h1 style={{ fontFamily: "var(--sans)", fontSize: 22, fontWeight: 700, color: eMID, margin: 0 }}>Your Development Guide</h1>
            <button onClick={g3Reset} title="Start the conversation again"
              style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "var(--danger)", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 600, padding: 2 }}>Reset Chat</button>
          </div>

          {/* transcript */}
          <div ref={g3ScrollRef} style={{ flex: 1, overflowY: "auto", padding: "20px 2px 8px" }}>
            {msgs.map((m, i) => m.kind === "summary" ? (
              <div key={i} style={{ marginBottom: 18 }}>
                {g3Summary(m.answers)}
              </div>
            ) : m.kind === "file" ? (
              <div key={i} style={{ display: "flex", justifyContent: "flex-end", marginBottom: 18 }}>
                {g3FileCard(m.name, m.size, null)}
              </div>
            ) : m.from === "bot" ? (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 18 }}>
                {avatar}
                <div style={{ fontFamily: "var(--sans)", fontSize: 15, color: m.err ? eDANGER : eINK, lineHeight: 1.6, paddingTop: 4, maxWidth: 640 }}>{m.text}</div>
              </div>
            ) : (
              <div key={i} style={{ display: "flex", justifyContent: "flex-end", marginBottom: 18 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "color-mix(in srgb, var(--accent) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 18%, transparent)", borderRadius: 14, padding: "10px 14px", fontFamily: "var(--sans)", fontSize: 15, color: eMID, lineHeight: 1.55, maxWidth: 520 }}>
                  {m.file && <I.clip size={15} />}{m.text}
                </div>
              </div>
            ))}
            {g3Typing && (
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 18 }}>
                {avatar}
                <span style={{ display: "inline-flex", gap: 4, paddingTop: 2 }}>
                  {[0, 1, 2].map((d) => <span key={d} style={{ width: 6, height: 6, borderRadius: 999, background: eMUT, animation: "idp-blink 1s infinite", animationDelay: d * 0.15 + "s" }} />)}
                </span>
              </div>
            )}
            <div ref={g3EndRef} />
          </div>

          {/* chips + composer */}
          <div style={{ flexShrink: 0, paddingTop: 8 }}>
            {chips.length > 0 && !g3Typing && !g3Attach && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                {chips.map((c) => (
                  <button key={c} onClick={() => g3Send(c)}
                    style={{ background: "var(--card)", border: "1px solid color-mix(in srgb, var(--accent) 45%, transparent)", color: eBLUE, borderRadius: 6, padding: "8px 14px", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 500, cursor: "pointer" }}>{c}</button>
                ))}
              </div>
            )}
            {/* The summary is the end of the conversation — there's nothing left to
                say to the guide, so the composer goes rather than sitting there greyed out. */}
            {!g3Done && (g3Attach ? g3DropZone() : (
            <div style={{ position: "relative", border: "1px solid " + eLINE, borderRadius: 12, background: "var(--card)", padding: "12px 96px 12px 14px" }}>
              <textarea value={g3Input} onChange={(e) => setG3Input(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); g3Send(); } }}
                placeholder="Type your message here..." rows={2}
                style={{ width: "100%", boxSizing: "border-box", border: "none", outline: "none", resize: "none", background: "transparent", fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.5 }} />
              <div style={{ position: "absolute", right: 12, bottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
                <button title="Voice input" style={{ background: "none", border: "none", cursor: "pointer", color: eBLUE, display: "flex", padding: 2 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0" /><path d="M12 18v3" /></svg>
                </button>
                <button onClick={() => g3Send()} title="Send" disabled={!g3Input.trim()}
                  style={{ width: 38, height: 38, borderRadius: "50%", border: "none", background: !g3Input.trim() ? "color-mix(in srgb, var(--accent) 35%, transparent)" : eBLUE, color: "#fff", cursor: !g3Input.trim() ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5" /><path d="M5 12l7-7 7 7" /></svg>
                </button>
              </div>
            </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "10px 0 14px", color: eMUT, fontFamily: "var(--sans)", fontSize: 13 }}>
              <I.info size={14} /> Development Guide can make mistakes. Please be careful while using the responses.
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  };

  if (design === 2) return renderCoachChat();
  if (design === 3) return renderCoachGuide();

  return (
    <React.Fragment>
      {designSwitch}
      <div className="ed-idp-main" style={{ maxWidth: "var(--content-max)", margin: "0 auto", width: "100%" }}>
        {/* coach header */}
        <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: "var(--surface-deep)", color: eSKY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><I.spark size={20} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: eMID }}>AI Coach</div>
            <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT }}>Question {qi + 1} of {total}</div>
          </div>
          <button onClick={resetChat} title="Start over from question 1"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "1px solid " + eLINE, borderRadius: 8, cursor: "pointer", color: eMUT, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, flexShrink: 0, padding: "7px 12px" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = eMID; e.currentTarget.style.borderColor = eMUT; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = eMUT; e.currentTarget.style.borderColor = eLINE; }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 2.6-6.4" /><path d="M3 4v5h5" /></svg>
            Reset chat
          </button>
        </div>
        {/* progress */}
        <div style={{ display: "flex", gap: 4, marginBottom: 22 }}>
          {IDP_Q.map((_, i) => <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < qi ? eSUCCESS : i === qi ? eBLUE : "rgba(0,15,71,.10)", transition: "background .3s" }} />)}
        </div>
        {/* question card — turns red when the answer fails validation */}
        <div style={{ background: error ? "color-mix(in srgb, var(--danger) 5%, var(--card))" : eCARD, border: (error ? "1.5px solid " + eDANGER : "1px solid " + eLINE), borderRadius: 18, padding: "24px 24px 26px", transition: "border-color .2s, background .2s" }}>
          <h2 className="serif" style={{ fontSize: 21, color: eMID, lineHeight: 1.18, margin: "0 0 18px" }}>{q.q}</h2>
          {renderInput()}
        </div>

        {/* inline error — the companion is blocking progress until the answer fits */}
        {error && (
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 14, background: "color-mix(in srgb, var(--danger) 7%, transparent)", border: "1px solid color-mix(in srgb, var(--danger) 30%, transparent)", borderRadius: 12, padding: "12px 14px" }}>
            <span style={{ color: eDANGER, display: "flex", flexShrink: 0, marginTop: 1 }}><I.alertCircle size={17} /></span>
            <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.5 }}>
              <span style={{ fontWeight: 700, color: eDANGER }}>{error.kind === "doc" ? "This isn't a relevant document." : error.kind === "offtopic" ? "This answer doesn't match the question." : error.kind === "nonsense" ? "That doesn't look like a valid answer." : "Your answer needs a little more."}</span> {error.guide} <span style={{ color: eMUT }}>You can't continue until this is resolved.</span>
            </div>
          </div>
        )}

        {/* footer nav — Q1's back is in the top bar; Q2+ get an inline Back opposite Next */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 18 }}>
          {qi > 0 && (
            <EdBtn onClick={() => { setError(null); setQi(qi - 1); }}><I.arrowL size={16} /> Back</EdBtn>
          )}
          <div style={{ flex: 1 }} />
          <EdBtn primary onClick={next} disabled={!answered}>{qi === total - 1 ? "Finish" : "Next"} <I.arrow size={16} /></EdBtn>
        </div>
      </div>

      {/* AI Coach Companion — fixed right rail attached to the screen edge (outside the
          main content). It records insights from your answers; there's no chat input. */}
      <aside className="ed-idp-notes ed-idp-rail" style={{ position: "fixed", top: 59, right: 0, bottom: 0, width: 344, zIndex: 30, background: eCARD, borderLeft: error ? "3px solid " + eDANGER : "1px solid " + eLINE, display: "flex", flexDirection: "column", overflow: "hidden", transition: "border-color .2s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "16px 18px", borderBottom: "1px solid " + (error ? "color-mix(in srgb, var(--danger) 30%, transparent)" : eLINE), background: error ? "color-mix(in srgb, var(--danger) 7%, transparent)" : "transparent", transition: "background .2s" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: error ? eDANGER : "var(--surface-deep)", color: error ? "#fff" : eSKY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{error ? <I.alertCircle size={19} /> : <I.spark size={19} />}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: error ? eDANGER : eMID }}>AI Coach Companion</div>
            <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: error ? eDANGER : eMUT }}>{error ? "Your answer needs attention" : `${qi} of ${total} captured`}</div>
          </div>
        </div>
        {/* Per-question progress — each note stays linked to its question (done ✓ / current / error / to come) */}
        <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: "16px 15px", background: "rgba(0,15,71,.015)" }}>
          {IDP_Q.map((qq, i) => {
            const isCur = i === qi;
            const isErr = isCur && !!error;
            const done = i < qi;
            const status = isErr ? "error" : done ? "done" : isCur ? "current" : "pending";
            let note = null, noteKind = null;
            if (status === "error") { note = error.reason + " " + error.guide; noteKind = "error"; }
            else if (status === "done") {
              note = qq.type === "upload" ? (ans[i] ? "Received “" + ans[i] + "”. I'll factor it into your plan." : "No document added — I'll work from your answers.") : idpCompanion(qq, ans[i]);
              noteKind = "done";
            } else if (status === "current") {
              if (qq.type === "upload") { const wrong = uploadStatus === "wrong"; note = wrong ? "That document doesn't seem to contain development feedback I can use. Try a different file, or continue without one." : uploadStatus === "ok" ? "Great — this looks like useful development feedback. I'll factor it in." : "Optional — share a document to personalise your plan, or continue without one."; noteKind = wrong ? "error" : "current"; }
              else { const hasVal = ans[i] != null && idpFmt(qq, ans[i]) !== ""; note = hasVal ? "Looks good — hit Next and I'll capture this." : "I'll capture your response here as you answer."; noteKind = "current"; }
            }
            return <IdpStep key={i} n={i + 1} label={qq.short} status={status} note={note} noteKind={noteKind} last={i === IDP_Q.length - 1} stepRef={isCur ? curStepRef : null} />;
          })}
        </div>
      </aside>
    </React.Fragment>
  );
}

// ════════════════════════════════════════════════
//  THE FLOW
// ════════════════════════════════════════════════
function EdIdpFlow({ onExit, onDone, initialStep }) {
  const [step, setStep] = idpUseState(initialStep || 0); // 0 intro · 1 skillgap · 2 chat · 3 summary · 4 loading
  // A full Program Report page precedes the Intro. "report" shows it; "flow" runs
  // the numbered steps above. A deep-link (initialStep set) skips straight to the flow.
  const [phase, setPhase] = idpUseState(initialStep ? "flow" : "report");
  const [msgs, setMsgs] = idpUseState([]);
  const [q, setQ] = idpUseState(0);
  const [answers, setAnswers] = idpUseState({});
  // Report download feedback — an inline banner at the top of the content area. It
  // persists until dismissed or cleared by a successful retry.
  const [toast, setToast] = idpUseState(null); // { kind: "success" | "error", msg, sub }
  const [input, setInput] = idpUseState("");
  const [typing, setTyping] = idpUseState(false);
  const [files, setFiles] = idpUseState([]);
  const [progress, setProgress] = idpUseState(0);
  const chatRef = idpUseRef(null);

  // Top-bar back for the Report / Chat-instructions pages. On the flow steps the
  // IdpWizard registers its OWN top-bar back, so we deliberately don't clear it here.
  const idpTopCtx = React.useContext(LHTopBarContext);
  idpUseEffect(() => {
    if (!idpTopCtx) return;
    if (phase === "report") { idpTopCtx.setBack({ label: "Back to Development", onClick: () => onExit() }); return () => idpTopCtx.setBack(null); }
    if (phase === "chatintro") { idpTopCtx.setBack({ label: "Program Report", onClick: () => setPhase("report") }); return () => idpTopCtx.setBack(null); }
    // Flow: the guided-questions step (2) registers its own top-bar back via IdpWizard;
    // the Analysis summary step (3) goes back to the Chat instructions screen.
    if (phase === "flow" && step === 3) { idpTopCtx.setBack({ label: "Chat instructions", onClick: () => setPhase("chatintro") }); return () => idpTopCtx.setBack(null); }
  }, [phase, step, idpTopCtx]);

  // Collapse the left rail once the guided questions begin (Chat instructions →
  // Continue) and keep it collapsed through generation; expand it again on the
  // report / chat-intro screens that come before.
  idpUseEffect(() => {
    if (idpTopCtx && idpTopCtx.collapseRail) idpTopCtx.collapseRail(phase === "flow");
  }, [phase, idpTopCtx]);

  // Start every page (report / chat intro / summary …) at the top.
  React.useLayoutEffect(() => { idpScrollTop(); }, [phase, step]);

  const Q = LH.chatQuestions;
  const fileStep = Q.length;

  idpUseEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [msgs, typing]);

  const answer = (text, qi) => {
    setMsgs((m) => [...m, { from: "user", text }]);
    setAnswers((a) => ({ ...a, [qi]: text }));
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const next = qi + 1;
      if (next < Q.length) { setQ(next); setMsgs((m) => [...m, { from: "bot", text: Q[next].q }]); }
      else { setQ(fileStep); setMsgs((m) => [...m, { from: "bot", text: "Great insights! One last thing — do you have any external documents to share? These could be manager feedback, performance reviews, 360° comments, or self-assessments. They help me create a more personalized plan." }]); }
    }, 750);
  };
  const uploadFile = (name) => {
    setFiles((f) => [...f, name]);
    setMsgs((m) => [...m, { from: "user", text: `📄 Uploaded: ${name}` }, { from: "bot", text: `Got it, I've received "${name}". Upload more or continue when ready.` }]);
  };
  const finishChat = () => {
    setMsgs((m) => [...m, { from: "bot", text: "Thank you! I now have everything I need. Let me analyze your responses and assessment data to build your personalized development plan." }]);
    setTimeout(() => setStep(3), 1100);
  };
  const generate = () => {
    setStep(4); setProgress(0);
    // Longer run so each of the 4 rotating lines gets a few seconds of reading time.
    [8, 16, 25, 33, 42, 50, 58, 67, 75, 83, 92, 100].forEach((p, i) => setTimeout(() => setProgress(p), 750 * (i + 1)));
    setTimeout(() => onDone(), 750 * 13);
  };

  // shared shell for the flow steps (no step dots; the shell .ed-topbar carries the back).
  const Shell = ({ children, narrow, className, center }) => (
    <div className={className} style={{ maxWidth: "var(--content-max)", margin: center ? "0 auto" : "32px var(--fol-mx) 72px", padding: 0, width: center ? "100%" : undefined }}>
      {children}
    </div>
  );

  // ── SKILL GAP REPORT (full report page, before Intro) ──
  if (phase === "report") {
    const RP = window.EdGrowth && window.EdGrowth.ReportPage;
    const rpt = { name: "Leadership Program Report", desc: "A snapshot of your competency scores from the Leadership Assessment, benchmarked against a global norm group of senior managers. These results form the foundation of your development plan.", based: ["Leadership Assessment"], pages: 3 };
    // Each sheet is a true A4 portrait (210:297) — content sits top-aligned and any
    // leftover space stays blank, exactly like a printed page. Page 1 is a branded
    // dark cover; pages 2-3 are white document pages (shared Insights report content).
    const a4 = { width: "100%", maxWidth: 720, margin: "0 auto", aspectRatio: "210 / 297", borderRadius: 10, boxShadow: "0 6px 30px rgba(0,15,71,.10)", boxSizing: "border-box", display: "flex", flexDirection: "column" };
    // Hand a self-contained HTML snapshot of the report to the browser to download,
    // then confirm with a bottom toast (or a failure toast if the hand-off throws).
    const downloadReport = () => {
      // ⚠️ DEMO MODE: Download report always shows the failure state (no real download)
      // so the error can be presented to the team. To restore real downloads, delete
      // the next two lines.
      setToast({ kind: "error", msg: "We couldn't download your report", sub: "Something went wrong preparing the file. Please try again." });
      return;
      try {
        // Demo/test hook: run `window.__dlFail = true` in the console to force the
        // failure toast (downloads normally succeed, so the error path is otherwise
        // unreachable). Set it back to false for normal behaviour.
        if (window.__dlFail) throw new Error("forced download failure (demo)");
        const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
        const html = `<!doctype html><html><head><meta charset="utf-8"><title>${esc(rpt.name)}</title>`
          + `<style>body{font-family:Georgia,'Times New Roman',serif;color:#000F47;margin:48px;line-height:1.6}`
          + `.eyebrow{font-family:Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#3358B7}`
          + `h1{font-size:30px;margin:6px 0 20px}.meta{font-family:Arial,sans-serif;font-size:13px;color:#5B6685}`
          + `.meta b{color:#000F47}</style></head><body>`
          + `<div class="eyebrow">Confidential · For internal use only</div>`
          + `<h1>${esc(rpt.name)}</h1>`
          + `<p>${esc(rpt.desc)}</p>`
          + `<p class="meta">Report for <b>${esc(LH.user.first + " " + LH.user.last)}</b><br>Based on <b>${esc(rpt.based.join(", "))}</b></p>`
          + `</body></html>`;
        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Leadership_Program_Report.html";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1500);
        // Success is left to the browser's own download indicator — no in-app toast.
        setToast(null);
      } catch (e) {
        setToast({ kind: "error", msg: "We couldn't download your report", sub: "Something went wrong preparing the file. Please try again." });
      }
    };
    return (
      <div style={{ maxWidth: "var(--content-max)", margin: "0 var(--fol-mx) 72px", padding: 0 }}>
        {/* Report header — scrolls away with the content; only the shell's .ed-topbar
            (Back + controls) stays fixed on scroll. */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", rowGap: 10, padding: "20px 0 16px", marginBottom: 20 }}>
          <h1 className="serif" style={{ fontSize: 28, color: eMID, lineHeight: 1.1, margin: 0 }}>Program Report</h1>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
            <EdBtn onClick={downloadReport}><I.download size={15} /> Download report</EdBtn>
            <EdBtn primary onClick={() => setPhase("chatintro")}>Next <I.arrow size={16} /></EdBtn>
          </div>
        </div>

        {/* Download feedback — inline banner at the top of the content area. */}
        {toast && (() => {
          const ok = toast.kind === "success";
          const accent = ok ? eSUCCESS : eDANGER;
          return (
            <div role={ok ? "status" : "alert"} style={{ display: "flex", alignItems: "flex-start", gap: 11, background: "color-mix(in srgb, " + accent + " 6%, " + eCARD + ")", border: "1px solid " + eLINE, borderLeft: "4px solid " + accent, borderRadius: 12, padding: "13px 14px", marginBottom: 22, boxShadow: "0 2px 10px rgba(0,15,71,.05)", animation: "ed-banner-in .22s ease-out" }}>
              <span style={{ color: accent, display: "flex", flexShrink: 0, marginTop: 1 }}>{ok ? <I.check size={19} /> : <I.alertCircle size={19} />}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eMID }}>{toast.msg}</div>
                {toast.sub && <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: eMUT, lineHeight: 1.5, marginTop: 2 }}>{toast.sub}</div>}
              </div>
              <button onClick={() => setToast(null)} title="Dismiss" style={{ background: "none", border: "none", cursor: "pointer", color: eMUT, display: "flex", flexShrink: 0, padding: 2, marginTop: 1 }}><I.plus size={16} style={{ transform: "rotate(45deg)" }} /></button>
            </div>
          );
        })()}

        {/* Report document — same content as the Insights report reader, rendered inline
            (not a modal). .ed-report-page keeps each white sheet light even in dark mode. */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {Array.from({ length: rpt.pages }).map((_, i) => {
            if (i === 0) {
              // ── Branded dark cover (page 1) ──
              return (
                <div key={i} className="ed-report-page" style={{ ...a4, background: "radial-gradient(120% 120% at 15% 0%, rgba(206,236,255,.16), transparent 55%), linear-gradient(150deg, var(--surface-deep), #001F8C)", padding: "56px 56px", overflow: "hidden", justifyContent: "space-between" }}>
                  <svg viewBox="0 0 43.17 44.26" width="36" height="37" aria-hidden="true" style={{ display: "block" }}>
                    <polygon fill="#fff" points="42.49 0 21.65 30.43 22.2 30.43 35.07 24.39 35.07 44.26 43.17 44.26 43.17 0 42.49 0" />
                    <polygon fill="#fff" points="0 0 0 44.26 8.1 44.26 8.1 24.4 20.9 30.43 21.52 30.43 .68 0 0 0" />
                  </svg>
                  <div>
                    <div style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "#CEECFF", marginBottom: 14 }}>Confidential · For internal use only</div>
                    <h1 className="serif" style={{ fontSize: 40, color: "#fff", lineHeight: 1.06, margin: "0 0 26px", maxWidth: 440 }}>Leadership Program Report</h1>
                    <div style={{ borderTop: "1px solid rgba(255,255,255,.22)", paddingTop: 18, display: "flex", gap: 48, flexWrap: "wrap" }}>
                      <div>
                        <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: "rgba(206,236,255,.75)", marginBottom: 5 }}>Report for</div>
                        <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 600, color: "#fff" }}>{LH.user.first} {LH.user.last}</div>
                      </div>
                      <div>
                        <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: "rgba(206,236,255,.75)", marginBottom: 5 }}>Based on</div>
                        <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 600, color: "#fff" }}>{rpt.based.join(", ")}</div>
                      </div>
                    </div>
                  </div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: "rgba(206,236,255,.7)" }}>Marsh · All rights reserved</div>
                </div>
              );
            }
            // ── White content page (2-6) ──
            return (
              <div key={i} className="ed-report-page" style={{ ...a4, background: "var(--card)", border: "1px solid " + eLINE, padding: "48px 52px" }}>
                <div style={{ flex: 1, minHeight: 0 }}>{RP ? <RP report={rpt} page={i} /> : null}</div>
                <div style={{ marginTop: 24, paddingTop: 18, borderTop: "1px solid " + eLINE, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--sans)", fontSize: 13, color: eMUT }}>Marsh · Confidential</span>
                  <span style={{ fontFamily: "var(--sans)", fontSize: 13, color: eMUT }}>{rpt.name} · Page {i + 1}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── CHAT INSTRUCTIONS (between the Program Report and the IDP intro) ──
  if (phase === "chatintro") return (
    <div style={{ maxWidth: "var(--content-max)", margin: "0 var(--fol-mx) 72px", padding: 0 }}>
      <h1 className="serif" style={{ fontSize: 28, color: eMID, lineHeight: 1.1, margin: "24px 0 0" }}>Chat instructions</h1>
      <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.7, margin: "18px 0 0", maxWidth: 640 }}>Now that you have reviewed your feedback report — it's time to explore your strengths and focus areas with the help of our <strong style={{ color: eMID }}>chat assistant</strong>. This guided conversation will help you identify what you enjoy about your role and how you enjoy learning.</p>

      <div style={{ borderTop: "1px solid " + eLINE, margin: "26px 0 28px" }} />

      {/* Creative chat-assistant section — a live "chat preview" card beside the intro copy.
          (Built from our tokens rather than an external image, so the prototype stays offline-safe.) */}
      <div style={{ display: "flex", gap: 28, alignItems: "stretch", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 300px", minWidth: 260, borderRadius: 18, padding: "30px 22px", background: "radial-gradient(120% 120% at 15% 0%, rgba(206,236,255,.16), transparent 55%), linear-gradient(150deg, var(--surface-deep), #001F8C)", color: "#fff", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          {/* AI-coach illustration (inline SVG, so it works in the offline prototype). */}
          <svg viewBox="0 0 300 232" width="100%" style={{ maxWidth: 300, display: "block" }} aria-hidden="true">
            <circle cx="150" cy="110" r="92" fill="rgba(206,236,255,.07)" />
            <circle cx="150" cy="110" r="62" fill="rgba(206,236,255,.11)" />
            <circle cx="150" cy="110" r="50" fill="#CEECFF" />
            <g transform="translate(108 75) scale(3.5)" fill="var(--surface-deep)"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /></g>
            <g>
              <rect x="196" y="44" width="76" height="48" rx="15" fill="rgba(255,255,255,.15)" />
              <rect x="209" y="60" width="50" height="6" rx="3" fill="rgba(255,255,255,.6)" />
              <rect x="209" y="72" width="34" height="6" rx="3" fill="rgba(255,255,255,.38)" />
            </g>
            <g>
              <rect x="30" y="150" width="76" height="44" rx="15" fill="rgba(255,255,255,.12)" />
              <rect x="43" y="164" width="46" height="6" rx="3" fill="rgba(255,255,255,.5)" />
              <rect x="43" y="176" width="30" height="6" rx="3" fill="rgba(255,255,255,.33)" />
            </g>
            <g transform="translate(224 112) scale(0.75)" fill="rgba(206,236,255,.9)"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /></g>
            <g transform="translate(64 52) scale(0.5)" fill="rgba(206,236,255,.7)"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /></g>
            <circle cx="250" cy="176" r="4" fill="rgba(206,236,255,.5)" />
            <circle cx="52" cy="120" r="3" fill="rgba(206,236,255,.45)" />
          </svg>
          <div style={{ marginTop: 20, fontFamily: "var(--sans)", fontSize: 16, fontWeight: 700, color: "#fff" }}>AI Coach</div>
          <div style={{ marginTop: 3, fontFamily: "var(--sans)", fontSize: 13, color: "rgba(206,236,255,.85)" }}>Your AI-assisted development coach</div>
        </div>
        <div style={{ flex: "1 1 340px", minWidth: 280 }}>
          <h2 className="serif" style={{ fontSize: 24, color: eMID, margin: "0 0 14px" }}>Chat assistant introduction</h2>
          <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.7, margin: "0 0 14px" }}><strong style={{ color: eMID }}>Hi, I'm your AI-assisted Development Coach</strong>, and I'm here to guide you through some thoughtful reflection on your development priorities and strengths. I will ask clear, focused questions that encourage you to consider the behaviors assessed during your evaluation.</p>
          <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.7, margin: 0 }}>Your development efforts should primarily focus on the specific behaviors assessed during your evaluation. Concentrating on these targeted areas ensures your growth is aligned to your role and your success within your organization. While your main plan centers on these behaviors, you may also choose to include optional stretch goals beyond this scope to explore new skills and broaden your capabilities.</p>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 32 }}>
        <EdBtn primary onClick={() => { setStep(2); setPhase("flow"); }}>Continue <I.arrow size={16} /></EdBtn>
      </div>
    </div>
  );

  // ── STEP 2 · GUIDED QUESTIONS (entry point after Chat instructions) ──
  // (The former Intro + Skill-gap pages were removed; Chat instructions → Continue lands
  //  here directly, and Back returns to the Chat instructions screen.)
  if (step === 2) return (
    <IdpWizard initial={answers} onBack={() => setPhase("chatintro")} onFinish={(a, direct) => { setAnswers(a); if (direct) generate(); else setStep(3); }} />
  );

  // ── STEP 2 (legacy chat — retained, unused) ──
  if (false) {
    const isFileStep = q >= fileStep;
    const noteEntries = Q.map((qq, i) => (answers[i] != null && answers[i] !== "") ? { label: qq.short || qq.q, value: answers[i] } : null).filter(Boolean);
    return (
      <Shell>
        <div style={{ display: "flex", gap: 18, alignItems: "stretch" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 14 }}>
          <div style={{ width: 38, height: 38, borderRadius: 19, background: "color-mix(in srgb, var(--accent) 10%, transparent)", color: eBLUE, display: "flex", alignItems: "center", justifyContent: "center" }}><I.bulb size={19} /></div>
          <div>
            <div style={{ fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: eMID }}>AI Coach</div>
            <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT }}>Question {Math.min(q + 1, Q.length)} of {Q.length}{isFileStep ? " · File upload" : ""}</div>
          </div>
        </div>
        <div ref={chatRef} style={{ height: 380, overflowY: "auto", background: "rgba(0,15,71,.02)", border: "1px solid " + eLINE, borderRadius: 16, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ alignSelf: m.from === "bot" ? "flex-start" : "flex-end", maxWidth: "84%" }}>
              <div style={{ background: m.from === "bot" ? "#fff" : eMID, color: m.from === "bot" ? eINK : "#fff", padding: "10px 14px", borderRadius: m.from === "bot" ? "4px 14px 14px 14px" : "14px 4px 14px 14px", fontFamily: "var(--sans)", fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-line", border: m.from === "bot" ? "1px solid " + eLINE : "none" }}>{m.text}</div>
            </div>
          ))}
          {typing && <div style={{ alignSelf: "flex-start" }}><div style={{ background: "var(--card)", border: "1px solid " + eLINE, padding: "12px 14px", borderRadius: "4px 14px 14px 14px", display: "flex", gap: 4 }}>{[0, 1, 2].map((i) => <span key={i} className="ed-spin" style={{ width: 6, height: 6, borderRadius: 3, background: eMUT, animation: "idp-blink 1s ease " + (i * 0.2) + "s infinite" }} />)}</div></div>}
          {!typing && !isFileStep && q < Q.length && (
            <div style={{ alignSelf: "flex-start", maxWidth: "92%", display: "flex", flexWrap: "wrap", gap: 7, marginTop: 2 }}>
              {Q[q].suggestions.map((s, i) => (
                <button key={i} onClick={() => answer(s, q)} style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)", background: "color-mix(in srgb, var(--accent) 5%, transparent)", color: eBLUE, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer", lineHeight: 1.3 }}>{s}</button>
              ))}
            </div>
          )}
          {!typing && isFileStep && (
            <div style={{ alignSelf: "flex-start", maxWidth: "92%", marginTop: 2 }}>
              {files.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 10 }}>
                  {files.map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 9, background: "rgba(20,133,61,.08)", border: "1px solid rgba(20,133,61,.2)" }}>
                      <span style={{ color: eSUCCESS, display: "flex" }}><I.fileText size={15} /></span>
                      <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eSUCCESS }}>{f}</span>
                      <span style={{ color: eSUCCESS, display: "flex", marginLeft: "auto" }}><I.check size={15} /></span>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button onClick={() => uploadFile("Manager_Feedback_2025.pdf")} style={{ padding: "10px 16px", borderRadius: 10, border: "1.5px dashed var(--line)", background: "transparent", color: eINK, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}><I.upload size={15} /> Upload document</button>
                <EdBtn small primary onClick={finishChat}>{files.length > 0 ? "Continue" : "Skip & continue"} <I.arrow size={15} /></EdBtn>
              </div>
            </div>
          )}
        </div>
        {!isFileStep && q < Q.length && !typing && (
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Or type your own answer…" onKeyDown={(e) => { if (e.key === "Enter" && input.trim()) answer(input.trim(), q); }}
              style={{ flex: 1, padding: "11px 14px", borderRadius: 10, border: "1px solid " + eLINE, background: "var(--card)", color: eINK, fontFamily: "var(--sans)", fontSize: 14, outline: "none" }} />
            <button onClick={() => input.trim() && answer(input.trim(), q)} disabled={!input.trim()} style={{ width: 44, height: 44, borderRadius: 10, background: input.trim() ? eMID : "rgba(0,15,71,.12)", color: "#fff", border: "none", cursor: input.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><I.send size={17} /></button>
          </div>
        )}
        </div>
        <aside style={{ width: 296, flexShrink: 0, alignSelf: "stretch", background: eCARD, border: "1px solid " + eLINE, borderRadius: 16, padding: 16, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 12, borderBottom: "1px solid " + eLINE }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: "color-mix(in srgb, var(--accent) 10%, transparent)", color: eBLUE, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><I.spark size={17} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eMID }}>AI notes</div>
              <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT }}>{noteEntries.length} captured from your answers</div>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", marginTop: 14, maxHeight: 372 }}>
            {noteEntries.length === 0 && !typing && (
              <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, lineHeight: 1.6, background: "rgba(0,15,71,.02)", border: "1px dashed " + eLINE, borderRadius: 12, padding: 14 }}>As you chat, I'll note the key points — your goals, strengths, and preferences appear here and feed into your plan.</div>
            )}
            {noteEntries.map((n, i) => (
              <div key={i} style={{ paddingBottom: 12, marginBottom: 12, borderBottom: i < noteEntries.length - 1 ? "1px solid " + eLINE : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ color: eSUCCESS, display: "flex" }}><I.check size={13} /></span>
                  <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, letterSpacing: 0.2, color: eBLUE }}>{n.label}</span>
                </div>
                <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.55 }}>{n.value}</div>
              </div>
            ))}
            {typing && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "2px 0 8px", fontFamily: "var(--sans)", fontSize: 14, color: eMUT }}>
                <span style={{ display: "flex", gap: 3 }}>{[0, 1, 2].map((i) => <span key={i} style={{ width: 5, height: 5, borderRadius: 3, background: eBLUE, animation: "idp-blink 1s ease " + (i * 0.2) + "s infinite" }} />)}</span>
                Noting your answer…
              </div>
            )}
          </div>
        </aside>
        </div>
      </Shell>
    );
  }

  // ── STEP 3 · SUMMARY ──
  if (step === 3) {
    // Chat-insight responses gathered from the guided questions.
    const resp = [
      { label: "What you enjoy in your role", value: idpFmt(IDP_Q[0], answers[0]) },
      { label: "Frustrations to steer around", value: idpFmt(IDP_Q[1], answers[1]) },
      { label: "Career direction", value: idpFmt(IDP_Q[2], answers[2]) },
      { label: "Transferable strengths", value: idpFmt(IDP_Q[3], answers[3]) },
      { label: "Skills to develop", value: idpFmt(IDP_Q[4], answers[4]) },
      { label: "Development timeline", value: idpFmt(IDP_Q[6], answers[6]) },
    ].filter((r) => r.value);
    const learnPref = idpFmt(IDP_Q[5], answers[5]);
    const uploadedFile = answers[7];
    // AI-extracted insights from the uploaded document (demo content).
    const docInsights = [
      { h: "Development themes", items: ["Consistently seeks growth and stretch opportunities beyond the current remit.", "Balances multiple priorities with strong organisation and follow-through.", "Ready to step into leadership — mentoring and developing others.", "Aims to deepen strategic influence across the wider organisation."] },
      { h: "Skills mentioned", items: ["Collaboration and cross-functional coordination.", "Strategic thinking and structured problem solving.", "Delivery discipline and consistency."] },
      { h: "Strengths", items: ["Resilient and composed under pressure.", "Highly motivated with a growth-oriented mindset.", "Translates complex problems into clear, actionable plans.", "Dependable, consistent delivery across projects."] },
      { h: "Recommended development areas", items: ["Take on formal mentoring to develop others and scale impact.", "Broaden influence and stakeholder engagement beyond direct authority."] },
    ];
    const docTone = "Positive — recognises strong performance while offering forward-looking suggestions for growth.";

    const sectionHead = (icon, title) => (
      <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 16 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: "color-mix(in srgb, var(--accent) 10%, transparent)", color: eBLUE, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>
        <h2 className="serif" style={{ fontSize: 20, color: eMID, margin: 0 }}>{title}</h2>
      </div>
    );
    const subHead = (t) => <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eMID, margin: "18px 0 9px" }}>{t}</div>;
    const bullet = (node, key) => (
      <div key={key} style={{ display: "flex", gap: 9, alignItems: "flex-start", marginBottom: 7 }}>
        <span style={{ marginTop: 7, flexShrink: 0, width: 5, height: 5, borderRadius: 3, background: eBLUE, display: "inline-block" }} />
        <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.55 }}>{node}</span>
      </div>
    );

    // Program Report summary — always shown, so the analysis is rich even when no
    // document is attached. Mirrors the priority gaps from the Leadership Assessment.
    const gapSummary = {
      overview: "From your Leadership Assessment, these competencies show the largest gap to target — they shape the focus of your plan.",
      gaps: [
        { skill: "Communicate with Impact", score: 2.4, target: 3.8, note: "Influence and stakeholder communication" },
        { skill: "Champion Change and Innovation", score: 2.6, target: 3.6, note: "Driving and adopting change" },
        { skill: "Collaborate and Build Relationships", score: 2.9, target: 3.6, note: "Cross-team collaboration" },
      ],
      strengths: ["Execute with Excellence — 4.1 / 5 (above target)", "Act Professionally — 3.9 / 5 (above target)"],
    };
    const gapRow = (g, i) => (
      <div key={i} style={{ marginBottom: 13 }}>
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
    );

    return (
      <Shell narrow>
        <h1 className="serif" style={{ fontSize: 28, color: eMID, lineHeight: 1.1, margin: "0 0 8px" }}>Analysis summary</h1>
        <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.6, margin: "0 0 24px", maxWidth: 620 }}>Got it — I've reviewed your responses{uploadedFile ? " and document" : ""}. Have a look before we generate your plan.</p>

        {/* 1 · Chat Insight Summary */}
        <div style={{ background: eCARD, border: "1px solid " + eLINE, borderRadius: 16, padding: "20px 22px", marginBottom: 14 }}>
          {sectionHead(<I.spark size={17} />, "Chat Insight Summary")}
          {subHead("Your responses")}
          {resp.map((r, i) => bullet(<React.Fragment><strong style={{ color: eMID }}>{r.label}:</strong> {r.value}</React.Fragment>, i))}
          {learnPref && (
            <React.Fragment>
              {subHead("Learning preference")}
              <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.6, margin: 0 }}>You prefer to learn through <strong style={{ color: eMID }}>{String(learnPref).toLowerCase()}</strong>, which will guide the development actions selected for your plan.</p>
            </React.Fragment>
          )}
        </div>

        {/* 2 · Program Report Summary — always shown (rich analysis even with no attachment) */}
        <div style={{ background: eCARD, border: "1px solid " + eLINE, borderRadius: 16, padding: "20px 22px", marginBottom: 14 }}>
          {sectionHead(<I.chart size={17} />, "Program Report Summary")}
          <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.6, margin: 0 }}>{gapSummary.overview}</p>
          {subHead("Priority gaps")}
          {gapSummary.gaps.map((g, i) => gapRow(g, i))}
          {subHead("Strengths to leverage")}
          {gapSummary.strengths.map((s, i) => bullet(s, "str" + i))}
        </div>

        {/* 3 · Uploaded Document Insights */}
        {uploadedFile && (
          <div style={{ background: eCARD, border: "1px solid " + eLINE, borderRadius: 16, padding: "20px 22px", marginBottom: 14 }}>
            {sectionHead(<I.fileText size={17} />, "Uploaded Document Insights")}
            {docInsights.map((g, gi) => (
              <React.Fragment key={gi}>
                {subHead(g.h)}
                {g.items.map((it, j) => bullet(it, j))}
              </React.Fragment>
            ))}
            {subHead("Tone")}
            <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.6, margin: 0 }}>{docTone}</p>
          </div>
        )}

        {/* 4 · Uploaded File */}
        {uploadedFile && (
          <div style={{ background: eCARD, border: "1px solid " + eLINE, borderRadius: 16, padding: "20px 22px", marginBottom: 20 }}>
            {sectionHead(<I.clip size={17} />, "Uploaded File")}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, background: "rgba(0,15,71,.03)", border: "1px solid " + eLINE, maxWidth: 360 }}>
              <span style={{ width: 34, height: 40, borderRadius: 5, background: "#E4453A", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "var(--sans)", fontSize: 8, fontWeight: 800, letterSpacing: ".04em" }}>PDF</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eMID, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{uploadedFile}</div>
                <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eSUCCESS, fontWeight: 600 }}>Analysed</div>
              </div>
            </div>
          </div>
        )}

        <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, lineHeight: 1.6, margin: "0 0 18px" }}>With your permission, I can create your development plan now. Otherwise, reset the chat to start again{uploadedFile ? " or upload a different file" : ""}.</p>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: 1 }} />
          <EdBtn onClick={() => { setAnswers({}); setStep(2); }}>Reset chat</EdBtn>
          <EdBtn primary onClick={generate}>Generate my plan <I.arrow size={16} /></EdBtn>
        </div>
      </Shell>
    );
  }

  // ── STEP 4 · LOADING ──
  // 4 rotating "big" lines (final UX copy), plus a persistent reassurance line.
  const stages = [
    { at: 0, text: "I'm busy analyzing your insights. Hang in there! Your plan will be ready shortly" },
    { at: 25, text: "Identifying your preferences mentioned in the chat" },
    { at: 50, text: "Fetching development actions from the template" },
    { at: 75, text: "Your plan is nearly ready! I'm just adding and adjusting some activities according to your preferences" },
  ];
  const loadingSecondary = "Feel free to step away. Your plan will be ready when you return.";
  const cur = [...stages].reverse().find((s) => progress >= s.at) || stages[0];
  return (
    <Shell narrow center className="ed-idp-loading">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "52px 28px", textAlign: "center", maxWidth: 520, width: "100%", margin: "0 auto", boxSizing: "border-box", background: "var(--card)", border: "1px solid " + eLINE, boxShadow: "0 8px 34px rgba(0,15,71,.08)", borderRadius: 18, overflow: "hidden" }}>
        {/* Branded loader — the Marsh "M" mark inside a spinning ring, matching the platform sign-in loader */}
        <div style={{ position: "relative", width: 120, height: 120, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 30 }}>
          <svg viewBox="0 0 100 100" width="120" height="120" style={{ position: "absolute", inset: 0, animation: "ed-spin 1.15s linear infinite" }} aria-hidden="true">
            <circle cx="50" cy="50" r="46" fill="none" stroke="var(--action)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="78 220" />
            <circle cx="50" cy="50" r="46" fill="none" stroke="var(--action)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="30 220" strokeDashoffset="-150" opacity="0.5" />
          </svg>
          <svg viewBox="0 0 43.17 44.26" width="52" height="53" style={{ overflow: "visible" }} aria-hidden="true">
            <polygon fill="var(--primary)" points="42.49 0 21.65 30.43 22.2 30.43 35.07 24.39 35.07 44.26 43.17 44.26 43.17 0 42.49 0" />
            <polygon fill="var(--primary)" points="0 0 0 44.26 8.1 44.26 8.1 24.4 20.9 30.43 21.52 30.43 .68 0 0 0" />
          </svg>
        </div>
        <div style={{ fontFamily: "var(--sans)", fontSize: 20, fontWeight: 700, color: eMID, lineHeight: 1.35, maxWidth: 400, minHeight: 82, display: "flex", alignItems: "center", marginBottom: 12 }}>{cur.text}</div>
        {/* No percentage readout: the number is invented, and watching it stall short
            of 100 reads as a fault. The spinning mark and the bar carry the progress. */}
        <div style={{ width: 260, height: 4, background: "rgba(0,15,71,.08)", borderRadius: 3, overflow: "hidden", marginTop: 12 }}>
          <div style={{ width: `${progress}%`, height: "100%", background: "var(--action)", borderRadius: 3, transition: "width .5s ease" }} />
        </div>
        <div style={{ fontFamily: "var(--sans)", fontSize: 13.5, color: eMUT, lineHeight: 1.5, maxWidth: 320, marginTop: 22 }}>{loadingSecondary}</div>
      </div>
    </Shell>
  );
}

// ════════════════════════════════════════════════
//  GENERATED PLAN VIEW
// ════════════════════════════════════════════════
function EdPlanView({ onBack, onRestart }) {
  const plan = LH.plan;
  const [expanded, setExpanded] = idpUseState(0);
  const [tipStatus, setTipStatus] = idpUseState({});
  const [editing, setEditing] = idpUseState(null);
  const [edits, setEdits] = idpUseState({});
  const [status, setStatus] = idpUseState("draft");
  const totalTips = plan.reduce((a, s) => a + s.tips.length, 0);
  const doneCount = Object.values(tipStatus).filter((s) => s === "done").length;

  const statusMeta = {
    draft: { label: "Draft", color: eMUT, bg: "rgba(123,121,116,.12)" },
    "under-review": { label: "Under review", color: eWARN, bg: "rgba(203,126,3,.10)" },
    approved: { label: "Approved", color: eSUCCESS, bg: "rgba(20,133,61,.10)" },
  };
  const sm = statusMeta[status];

  return (
    <div style={{ maxWidth: "var(--content-max)", margin: "36px var(--fol-mx) 72px", padding: 0 }}>
      <EdBack label="Back to dashboard" onClick={onBack} />
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <EdEyebrow color={eBLUE}>Development plan</EdEyebrow>
          <h1 className="serif" style={{ fontSize: 40, color: eMID, lineHeight: 1.08, margin: "0 0 8px" }}>Your development plan</h1>
          <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.6, margin: 0, maxWidth: 540 }}>A balanced 70·20·10 plan generated from your assessment and goals.</p>
        </div>
        <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: sm.color, background: sm.bg, padding: "6px 13px", borderRadius: 6, marginTop: 8, whiteSpace: "nowrap" }}>{sm.label}</span>
      </div>

      {/* stat strip */}
      <div style={{ display: "flex", padding: "4px 0", margin: "24px 0 8px" }}>
        {[{ v: plan.length, l: "Focus areas" }, { v: totalTips, l: "Development actions" }, { v: `${doneCount}/${totalTips}`, l: "Completed" }, { v: "Mar–Aug", l: "Timeline" }].map((s, i) => (
          <div key={i} style={{ flex: 1, paddingLeft: i === 0 ? 0 : 24, paddingRight: 24, borderRight: i < 3 ? "1px solid " + eLINE : "none" }}>
            <div className="serif" style={{ fontSize: 30, color: eMID, lineHeight: 1 }}>{s.v}</div>
            <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, marginTop: 6 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* skills accordion */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 24 }}>
        {plan.map((skill, si) => {
          const open = expanded === si;
          const skillDone = skill.tips.filter((t) => tipStatus[`${si}-${t.type}`] === "done").length;
          return (
            <div key={si} style={{ background: eCARD, border: "1px solid " + eLINE, borderRadius: 16, overflow: "hidden" }}>
              <button onClick={() => setExpanded(open ? -1 : si)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "20px 22px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <h3 className="serif" style={{ fontSize: 21, color: eMID, margin: 0 }}>{skill.name}</h3>
                    <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, letterSpacing: 0.2, textTransform: "capitalize", color: eMUT, background: "rgba(0,15,71,.05)", padding: "3px 9px", borderRadius: 5 }}>{skill.skillType}</span>
                  </div>
                  <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.55, margin: 0, maxWidth: 580 }}>{skill.desc}</p>
                </div>
                <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, whiteSpace: "nowrap" }}>{skillDone}/{skill.tips.length}</span>
                <span style={{ color: eMUT, display: "flex", transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }}><I.chevD size={18} /></span>
              </button>
              {open && (
                <div style={{ padding: "0 22px 8px" }}>
                  {skill.tips.map((t, ti) => {
                    const m = idpType[t.type];
                    const CatIc = I[idpCatIcon[t.category] || "rocket"];
                    const key = `${si}-${t.type}`;
                    const st = tipStatus[key] || "todo";
                    const isDone = st === "done";
                    const isProg = st === "progress";
                    const isEditing = editing === key;
                    const ed = edits[key] || {};
                    const tTitle = ed.title != null ? ed.title : t.title;
                    const tDesc = ed.desc != null ? ed.desc : t.desc;
                    return (
                      <div key={ti} style={{ borderTop: "1px solid " + eLINE, padding: "16px 0", display: "flex", gap: 14 }}>
                        <div style={{ width: 40, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 11, background: m.bg, color: m.color, display: "flex", alignItems: "center", justifyContent: "center" }}><CatIc size={18} /></div>
                          <div className="serif" style={{ fontSize: 15, color: m.color, lineHeight: 1 }}>{t.type}%</div>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                            <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, letterSpacing: 0.2, color: m.color, background: m.bg, padding: "3px 9px", borderRadius: 5 }}>{m.label}</span>
                            {t.provider && <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT }}>{t.provider} · {t.duration}</span>}
                          </div>
                          <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eMID, textDecoration: isDone ? "line-through" : "none" }}>{t.title}</div>
                          <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.55, margin: "4px 0 8px" }}>{t.desc}</p>
                          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}><span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, display: "inline-flex", alignItems: "center", gap: 5 }}><I.cal size={13} /> {t.start} – {t.end}</span></div>
                          <div style={{ background: "rgba(20,133,61,.06)", borderRadius: 9, padding: "9px 12px", marginBottom: 7 }}>
                            <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eSUCCESS }}>Success looks like </span>
                            <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.5 }}>{t.success}</span>
                          </div>
                          <div style={{ background: "color-mix(in srgb, var(--accent) 5%, transparent)", borderRadius: 9, padding: "9px 12px", marginBottom: 10, display: "flex", gap: 8 }}>
                            <span style={{ color: eBLUE, display: "flex", flexShrink: 0, marginTop: 1 }}><I.spark size={14} /></span>
                            <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.5 }}><strong style={{ color: eBLUE }}>Why this: </strong>{t.insight}</span>
                          </div>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                            <button onClick={() => setTipStatus((d) => ({ ...d, [key]: isProg ? "todo" : "progress" }))} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: isProg ? "color-mix(in srgb, var(--accent) 10%, transparent)" : "transparent", color: isProg ? eBLUE : eMID, border: "1.5px solid " + (isProg ? "color-mix(in srgb, var(--accent) 35%, transparent)" : eMID), borderRadius: 9, padding: "7px 13px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>In progress</button>
                            <button onClick={() => setTipStatus((d) => ({ ...d, [key]: isDone ? "todo" : "done" }))} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: isDone ? "rgba(20,133,61,.10)" : "transparent", color: isDone ? eSUCCESS : eMID, border: "1.5px solid " + (isDone ? "rgba(20,133,61,.3)" : eMID), borderRadius: 9, padding: "7px 13px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{isDone ? <React.Fragment><I.check size={14} /> Completed</React.Fragment> : "Mark complete"}</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* footer actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 28, paddingTop: 24, borderTop: "1px solid " + eLINE, flexWrap: "wrap" }}>
        <EdBtn onClick={onRestart}>Regenerate plan</EdBtn>
        <div style={{ flex: 1 }} />
        {status === "draft" && <EdBtn primary onClick={() => setStatus("under-review")}><I.send size={15} /> Submit for approval</EdBtn>}
        {status === "under-review" && <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eWARN, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 7 }}><I.clock size={16} /> Sent to Sarah Chen for review</span>}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
//  DEVELOPMENT — landing + flow + plan
// ════════════════════════════════════════════════
// Entry choice — how to build the plan. AI opens the guided flow; Manual is a
// placeholder for now (prompts to come). Styled after the "development assistant" ref.
function EdDevChoice({ onBack, onPickAI, onPickManual }) {
  const card = { flex: "1 1 330px", minWidth: 280, boxSizing: "border-box", background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 16, padding: "32px 28px 28px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 14, boxShadow: "0 1px 3px rgba(0,15,71,.05)" };
  return (
    <div className="ed-dev-choose" style={{ maxWidth: "var(--content-max)", margin: "36px var(--fol-mx) 72px", padding: 0 }}>
      <EdBack label="Back to dashboard" onClick={onBack} />
      <h1 className="serif" style={{ fontSize: 40, color: eMID, lineHeight: 1.08, margin: "0 0 8px" }}>Development</h1>
      <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.6, margin: "0 0 44px", maxWidth: 560 }}>Build a personalized growth plan based on your assessment insights.</p>
      <h2 className="serif" style={{ fontSize: 26, color: eMID, lineHeight: 1.15, margin: "8px 0 22px" }}>Choose how you'd like to build your plan.</h2>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "stretch" }}>
        {/* Manual — placeholder, not clickable yet */}
        <div style={card}>
          <div style={{ width: 54, height: 54, borderRadius: 14, background: "rgba(0,15,71,.06)", color: eMID, display: "flex", alignItems: "center", justifyContent: "center" }}><I.edit size={24} /></div>
          <div className="serif" style={{ fontSize: 21, color: eMID }}>Manual Development Plan</div>
          <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, lineHeight: 1.6, margin: 0, flex: 1 }}>Build the plan yourself — choose the skills and development actions you want to work on, step by step.</p>
          <button onClick={onPickManual} title="Build your plan step by step" style={{ marginTop: 4, display: "inline-flex", alignItems: "center", gap: 7, background: "var(--card)", color: eMID, border: "1.5px solid " + eMID, borderRadius: 10, padding: "11px 20px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Start manually <I.arrow size={15} /></button>
        </div>
        {/* AI — opens the guided flow */}
        <div style={card}>
          <div style={{ width: 54, height: 54, borderRadius: 14, background: "var(--surface-deep)", color: eSKY, display: "flex", alignItems: "center", justifyContent: "center" }}><I.spark size={24} /></div>
          <div className="serif" style={{ fontSize: 21, color: eMID }}>AI Development Plan</div>
          <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT, lineHeight: 1.6, margin: 0, flex: 1 }}>An interactive, conversation-driven flow where you co-create your plan with the AI in a few guided steps.</p>
          <div style={{ marginTop: 4 }}><EdBtn primary onClick={onPickAI}>Start with AI <I.arrow size={15} /></EdBtn></div>
        </div>
      </div>
    </div>
  );
}

function EdDevelopmentNew({ onBack, initialMode, idpStep, onMode }) {
  const [mode, setMode] = idpUseState(initialMode || "choose"); // choose | landing | flow | manual | plan
  const [watched, setWatched] = idpUseState(false);
  const [fromManual, setFromManual] = idpUseState(false);   // a hand-built plan opens read-only

  // The rail can drive the mode (New Plan / My Plan). React only to an actual change
  // of the prop, so internal transitions (generate → plan) aren't clobbered.
  const prevInit = idpUseRef(initialMode);
  idpUseEffect(() => {
    if (initialMode && initialMode !== prevInit.current) { prevInit.current = initialMode; setMode(initialMode); }
  }, [initialMode]);
  // Report the mode back so the rail can highlight the right sub-item.
  idpUseEffect(() => { if (onMode) onMode(mode); }, [mode]);

  // Reset scroll to the top whenever we switch between choose / landing / flow / plan.
  React.useLayoutEffect(() => { idpScrollTop(); }, [mode]);

  // Publish the Development sub-mode so page-scoped chrome (the "no internet" preview
  // switch) can show only on the main choose screen, not the deeper flow/plan pages.
  React.useEffect(() => {
    document.documentElement.setAttribute("data-lh-devmode", mode);
    return () => document.documentElement.removeAttribute("data-lh-devmode");
  }, [mode]);

  // Top-bar back: the "choose" screen is the Development tab's main screen, so it
  // gets no back — same as the other nav tabs. Landing → choose. The flow/plan
  // screens register their own back, so we deliberately leave those alone here.
  const devTopCtx = React.useContext(LHTopBarContext);
  idpUseEffect(() => {
    if (!devTopCtx) return;
    if (mode === "choose") { devTopCtx.setBack(null); return; }
    if (mode === "landing") { devTopCtx.setBack({ label: "Back", onClick: () => setMode("choose") }); return () => devTopCtx.setBack(null); }
    // flow / plan register their OWN top-bar back via their children (EdIdpFlow /
    // EdPlanPage), so we deliberately don't touch it here — clearing it would
    // clobber the child's back, since child effects run before this parent one.
  }, [mode, devTopCtx]);

  // Rail: keep it collapsed on the generated plan, expand it on the choose/landing
  // entry screens (EdIdpFlow handles the questions/generation screens itself).
  idpUseEffect(() => {
    if (!devTopCtx || !devTopCtx.collapseRail) return;
    if (mode === "plan") devTopCtx.collapseRail(true);
    // the manual flow keeps the rail as-is, so its pages are the same width as the rest
    else if (mode === "choose" || mode === "landing" || mode === "manual") devTopCtx.collapseRail(false);
  }, [mode, devTopCtx]);
  // Restore the rail to its pre-Development state when leaving the Development tab.
  idpUseEffect(() => {
    let prev = false; try { prev = localStorage.getItem("ed-rail-collapsed") === "1"; } catch (e) {}
    return () => { if (devTopCtx && devTopCtx.collapseRail) devTopCtx.collapseRail(prev); };
  }, []);

  if (mode === "choose") return <EdDevChoice onBack={onBack} onPickAI={() => setMode("landing")} onPickManual={() => setMode("manual")} />;
  if (mode === "manual") { const M = window.EdManual && window.EdManual.ManualFlow;
    return M ? <M onExit={() => setMode("choose")} onDone={() => { setFromManual(true); setMode("plan"); }} /> : null; }
  if (mode === "flow") return <EdIdpFlow initialStep={idpStep} onExit={() => setMode("landing")} onDone={() => setMode("plan")} />;
  if (mode === "plan") { const P = window.EdPlan && window.EdPlan.EdPlanPage; return P ? <P onBack={onBack} onRestart={() => setMode("flow")} startLocked={fromManual} /> : <EdPlanView onBack={onBack} onRestart={() => setMode("flow")} />; }

  return (
    <div style={{ maxWidth: "var(--content-max)", margin: "36px var(--fol-mx) 72px", padding: 0 }}>
      <EdBack label="Back to dashboard" onClick={onBack} />
      <h1 className="serif" style={{ fontSize: 40, color: eMID, lineHeight: 1.08, margin: "0 0 8px" }}>Development</h1>
      <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.6, margin: "0 0 32px", maxWidth: 560 }}>Build a personalized growth plan based on your assessment insights.</p>

      <h2 className="serif" style={{ fontSize: 24, color: eMID, margin: "0 0 6px" }}>My plan</h2>
      <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.6, margin: "0 0 20px" }}>Create your AI-powered Individual Development Plan. We'll walk you through your skill gaps, ask a few questions about your goals, and generate a tailored 70-20-10 growth plan.</p>

      {/* Intro video (system intro-video style) — plays an overview of the IDP,
          then Continue starts the guided flow. */}
      <div onClick={() => setWatched(true)} style={{ position: "relative", width: "100%", paddingBottom: "50%", borderRadius: 16, overflow: "hidden", background: "var(--surface-deep)", marginBottom: 24, cursor: "pointer" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 120% at 20% 0%, rgba(206,236,255,.22), transparent 55%), linear-gradient(135deg, var(--surface-deep), #001F8C)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
          {watched ?
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(20,133,61,.92)", padding: "9px 18px", borderRadius: 22 }}>
              <span style={{ color: "#fff", display: "flex" }}><I.check size={17} /></span><span style={{ color: "#fff", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700 }}>Video watched</span>
            </div> :
          <React.Fragment>
              <div style={{ width: 60, height: 60, borderRadius: 30, background: eSKY, color: "#0B1220", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 28px rgba(0,0,0,.3)" }}><I.play size={24} /></div>
              <span style={{ color: "#fff", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600 }}>Watch introduction (2 min)</span>
            </React.Fragment>
          }
        </div>
      </div>

      {/* 70-20-10 model + what to expect (same overview content as the IDP intro) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16, textAlign: "left" }}>
        {[{ ic: "chart", l: "70% On-the-job", d: "Learning through stretch assignments, projects, and real work" },
          { ic: "users", l: "20% From others", d: "Coaching, mentoring, and feedback from peers and leaders" },
          { ic: "book", l: "10% Formal training", d: "Structured courses, certifications, and reading materials" }].map((it, i) => {
          const Ic = I[it.ic];
          return (
            <div key={i} style={{ background: eCARD, border: "1px solid " + eLINE, borderRadius: 14, padding: 16 }}>
              <span style={{ color: eBLUE, display: "flex", marginBottom: 8 }}><Ic size={20} /></span>
              <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eMID, marginBottom: 4 }}>{it.l}</div>
              <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.5 }}>{it.d}</div>
            </div>
          );
        })}
      </div>
      <div style={{ background: eCARD, border: "1px solid " + eLINE, borderRadius: 14, padding: 18, marginBottom: 28 }}>
        <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eMID, marginBottom: 12 }}>What to expect</div>
        {["Review your program report from your assessment", "Answer a few questions about your goals and preferences", "Optionally upload manager feedback or self-assessments", "Get an AI-generated plan tailored to you"].map((t, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: i < 3 ? 10 : 0 }}>
            <div className="serif" style={{ width: 22, height: 22, borderRadius: 7, background: "color-mix(in srgb, var(--accent) 8%, transparent)", color: eBLUE, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14 }}>{i + 1}</div>
            <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.5 }}>{t}</span>
          </div>
        ))}
      </div>

      <EdBtn primary full onClick={() => setMode("flow")}>Continue <I.arrow size={16} /></EdBtn>
    </div>
  );
}

// override the simple growth Development page with the full flow
if (window.EdGrowth) window.EdGrowth.EdDevelopment = EdDevelopmentNew;
window.EdIdp = { EdDevelopmentNew, EdIdpFlow, EdPlanView };
