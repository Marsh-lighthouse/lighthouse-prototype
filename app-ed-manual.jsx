// ════════════════════════════════════════════════
//  MANUAL DEVELOPMENT PLAN — the four-step build-it-yourself route.
//    1 Getting Started  · intro video + what to expect
//    2 Add Skills       · the Add-Skills picker, as a page rather than a modal
//    3 Rate Skills      · self-rating for every skill just chosen
//    4 Reflective Qs    · one gamified card at a time, with Answer Later
//  Finishing writes a plan of chosen skills with NO development actions, so the
//  owner lands on their plan and fills it in via Edit Plan — from there the flow
//  is identical to the AI route (save → submit → manager → approve/reject).
//  Exports: window.EdManual
// ════════════════════════════════════════════════

const { useState: mnUseState, useEffect: mnUseEffect, useRef: mnUseRef } = React;

// Step navigation lives at the foot of the page: read the step, then move on.
function MnFooterNav({ onBack, onNext, nextLabel, nextDisabled }) {
  // No divider above the actions: the card edge already separates them, and
  // Getting Started / Reflective Questions don't carry one either.
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
      <button onClick={onBack}
        style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eMID,
          background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 10, padding: "10px 18px", cursor: "pointer" }}>
        <I.arrowL size={15} /> Back
      </button>
      <EdBtn primary disabled={nextDisabled} onClick={() => { if (!nextDisabled) onNext(); }}>{nextLabel} <I.arrow size={15} /></EdBtn>
    </div>
  );
}

const MN_STEPS = ["Getting Started", "Add Skills", "Rate Skills", "Reflective Questions"];

const MN_CATS = [
  { name: "Behavioral", icon: "bulb",
    options: ["Execute with Excellence", "Communicate with Impact", "Collaborate and Build Relationships", "Act Professionally", "Champion Change and Innovation", "Diversity and Inclusion", "Lead with Purpose", "Coach and Develop Others"],
    suggest: ["Execute with Excellence", "Communicate with Impact", "Act Professionally"] },
  { name: "Technical", icon: "monitor",
    options: ["Data & Analytics", "Product & Platform Fluency", "Process Automation", "Systems Thinking", "Technical Documentation"],
    suggest: ["Data & Analytics", "Product & Platform Fluency"] },
];

// ── the step indicator, in four flavours (switchable while we decide) ──
const MN_STEPPER_DESIGNS = [
  { id: 1, label: "Numbered rail", desc: "Circles joined by a line — the classic wizard" },
  { id: 2, label: "Segmented bar", desc: "Step count and name over a progress bar" },
  { id: 3, label: "Pills", desc: "Each step a chip; ticks mark what's done" },
  { id: 4, label: "Underlined tabs", desc: "Labels with a progress underline" },
];

function MnStepper({ step, design }) {
  const d = design || 1;

  // 2 · segmented progress bar
  if (d === 2) {
    return (
      <div style={{ marginBottom: 30 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--sans)", fontSize: 13, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: eMUT }}>Step {step + 1} of {MN_STEPS.length}</span>
          <span style={{ fontFamily: "var(--sans)", fontSize: 17, fontWeight: 700, color: eMID }}>{MN_STEPS[step]}</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {MN_STEPS.map((l, i) => (
            <span key={l} title={l} style={{ flex: 1, height: 5, borderRadius: 3, transition: "background .3s",
              background: i < step ? eSUCCESS : i === step ? eMID : "rgba(0,15,71,.10)" }} />
          ))}
        </div>
      </div>
    );
  }

  // 3 · pills
  if (d === 3) {
    return (
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 30 }}>
        {MN_STEPS.map((l, i) => {
          const done = i < step, on = i === step;
          return (
            <span key={l} style={{ display: "inline-flex", alignItems: "center", gap: 7, borderRadius: 999, padding: "7px 14px",
              fontFamily: "var(--sans)", fontSize: 13.5, fontWeight: on ? 700 : 600, whiteSpace: "nowrap",
              background: on ? eMID : done ? "rgba(20,133,61,.10)" : "var(--card)",
              color: on ? "#fff" : done ? eSUCCESS : eMUT,
              border: "1px solid " + (on ? eMID : done ? "transparent" : eLINE) }}>
              {done ? <I.check size={14} /> : <span style={{ fontSize: 12, opacity: on ? 1 : .7 }}>{i + 1}</span>}{l}
            </span>
          );
        })}
      </div>
    );
  }

  // 4 · underlined tabs
  if (d === 4) {
    return (
      <div style={{ display: "flex", gap: 4, marginBottom: 30, flexWrap: "wrap", borderBottom: "1px solid " + eLINE }}>
        {MN_STEPS.map((l, i) => {
          const done = i < step, on = i === step;
          return (
            <span key={l} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 14px", marginBottom: -1,
              fontFamily: "var(--sans)", fontSize: 14, fontWeight: on ? 700 : 500, whiteSpace: "nowrap",
              color: on ? eMID : done ? eSUCCESS : eMUT,
              borderBottom: "3px solid " + (on ? eMID : done ? eSUCCESS : "transparent") }}>
              {done && <I.check size={14} />}{l}
            </span>
          );
        })}
      </div>
    );
  }

  // 1 · numbered rail (default)
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 30, flexWrap: "nowrap", overflowX: "auto", paddingBottom: 2 }}>
      {MN_STEPS.map((label, i) => {
        const done = i < step, on = i === step;
        return (
          <React.Fragment key={label}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
              <span style={{ width: 26, height: 26, borderRadius: 13, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                background: done ? eSUCCESS : on ? eMID : "rgba(0,15,71,.06)",
                color: done || on ? "#fff" : eMUT,
                border: done ? "none" : "1px solid " + (on ? eMID : eLINE),
                fontFamily: "var(--sans)", fontSize: 13, fontWeight: 700 }}>
                {done ? <I.check size={16} /> : i + 1}
              </span>
              <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: on ? 700 : 500, color: on ? eMID : eMUT, whiteSpace: "nowrap" }}>{label}</span>
            </div>
            {i < MN_STEPS.length - 1 && <span style={{ flex: "1 1 14px", minWidth: 12, height: 1, background: i < step ? eSUCCESS : eLINE, margin: "0 9px" }} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ── step 1 · Getting Started ──
function MnGettingStarted({ onNext }) {
  const [watched, setWatched] = mnUseState(false);
  return (
    <div>
      <h1 className="serif" style={{ fontSize: 30, color: eMID, lineHeight: 1.1, margin: "0 0 8px" }}>Getting Started</h1>
      <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: eINK, lineHeight: 1.6, margin: "0 0 24px" }}>
        You're building this plan yourself. Watch the short introduction, then choose the skills you want to
        work on, rate where you are today, and answer a few reflective questions.
      </p>

      <div onClick={() => setWatched(true)} style={{ position: "relative", width: "100%", paddingBottom: "46%", borderRadius: 16, overflow: "hidden", background: "var(--surface-deep)", marginBottom: 24, cursor: "pointer" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 120% at 20% 0%, rgba(206,236,255,.22), transparent 55%), linear-gradient(135deg, var(--surface-deep), #001F8C)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
          {watched ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(20,133,61,.92)", padding: "9px 18px", borderRadius: 22 }}>
              <span style={{ color: "#fff", display: "flex" }}><I.check size={17} /></span>
              <span style={{ color: "#fff", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700 }}>Video watched</span>
            </div>
          ) : (
            <React.Fragment>
              <div style={{ width: 60, height: 60, borderRadius: 30, background: eSKY, color: "#0B1220", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 28px rgba(0,0,0,.3)" }}><I.play size={24} /></div>
              <span style={{ color: "#fff", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600 }}>Watch introduction (2 min)</span>
            </React.Fragment>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 16 }}>
        {[{ ic: "chart", l: "70% On-the-job", d: "Stretch assignments, projects, and real work" },
          { ic: "users", l: "20% From others", d: "Coaching, mentoring, and feedback from peers" },
          { ic: "book", l: "10% Formal training", d: "Courses, certifications, and reading" }].map((it, i) => {
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
        {["Choose the behavioural and technical skills you want to develop",
          "Rate yourself honestly on each one — today's level, not your target",
          "Answer a few short reflective questions (you can leave these for later)",
          "Add development actions to each skill, then submit for approval"].map((t, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: i < 3 ? 10 : 0 }}>
            <div className="serif" style={{ width: 22, height: 22, borderRadius: 7, background: "color-mix(in srgb, var(--accent) 8%, transparent)", color: eBLUE, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14 }}>{i + 1}</div>
            <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK, lineHeight: 1.5 }}>{t}</span>
          </div>
        ))}
      </div>

      <EdBtn primary full onClick={onNext}>Continue <I.arrow size={16} /></EdBtn>
    </div>
  );
}

// ── step 2 · Add Skills (the picker, on the page) ──
function MnAddSkills({ sel, setSel, onBack, onNext }) {
  const setCat = (ci, v) => setSel((x) => x.map((arr, i) => (i === ci ? v : arr)));
  const addSug = (ci, s) => setSel((x) => x.map((arr, i) => (i === ci && !arr.includes(s) ? [...arr, s] : arr)));
  const total = sel.reduce((n, a) => n + a.length, 0);
  return (
    <div>
      <h1 style={{ fontFamily: "var(--sans)", fontSize: 22, fontWeight: 700, color: eMID, margin: "0 0 20px" }}>Add Skills</h1>

      {MN_CATS.map((c, ci) => (
        <div key={ci} style={{ background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 16,
          padding: "20px 22px 24px", marginBottom: 16, boxShadow: "0 1px 3px rgba(0,15,71,.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <div style={{ width: 46, height: 46, borderRadius: 23, background: "rgba(0,15,71,.06)", color: eMID, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{React.createElement(I[c.icon], { size: 22 })}</div>
            <div>
              <div className="serif" style={{ fontSize: 21, color: eMID }}>{c.name}</div>
              <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT }}>Choose the skills you want to develop further as part of your development plan.</div>
            </div>
          </div>
          <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eMID, margin: "16px 0 10px" }}>Search your skills</div>
          <IdpMultiSelect search options={c.options} selected={sel[ci]} onChange={(v) => setCat(ci, v)} placeholder="Search skills…" />
          {c.suggest.filter((s) => !sel[ci].includes(s)).length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
              <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT }}>Suggestions</span>
              {c.suggest.filter((s) => !sel[ci].includes(s)).map((s) => (
                <button key={s} onClick={() => addSug(ci, s)} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 8, padding: "8px 13px", fontFamily: "var(--sans)", fontSize: 14, color: eMID, cursor: "pointer" }}><I.plus size={14} /> {s}</button>
              ))}
            </div>
          )}
        </div>
      ))}
      <MnFooterNav onBack={onBack} onNext={onNext} nextLabel="Continue to Rate skills" nextDisabled={total === 0} />
    </div>
  );
}

// ── step 3 · Rate Skills ──
function MnRateSkills({ rows, ratings, setRatings, onBack, onNext }) {
  const head = { fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eMID };
  return (
    <div>
      <h1 style={{ fontFamily: "var(--sans)", fontSize: 22, fontWeight: 700, color: eMID, margin: "0 0 20px" }}>Rate Skills</h1>

      {/* The guidance stays on the page, not in the card — the white box belongs to
          the thing you actually act on, so the ratings keep the attention. */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 22 }}>
        {/* a star, not the AI sparkle — this step is about self-rating */}
        <div style={{ width: 46, height: 46, borderRadius: 23, background: "color-mix(in srgb, var(--action) 18%, transparent)", color: "var(--action)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l2.9 6.3 6.8.7-5.1 4.6 1.5 6.7L12 17.9 5.9 20.3l1.5-6.7L2.3 9l6.8-.7z" /></svg>
        </div>
        <p style={{ fontFamily: "var(--sans)", fontSize: 14.5, color: eINK, lineHeight: 1.6, margin: 0 }}>
          Now that you have selected your developmental priorities, please rate yourself on each of the following.
          Remember to rate yourself based on your current level and not on your past or desired level.
        </p>
      </div>

      <div style={{ background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,15,71,.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", borderBottom: "1px solid " + eLINE }}>
          <div style={{ ...head, flex: 1, minWidth: 0 }}>Skill</div>
          <div style={{ ...head, width: 170, flexShrink: 0 }}>Skill Type</div>
          <div style={{ ...head, width: 130, flexShrink: 0, textAlign: "right" }}>Your self rating</div>
        </div>
        {rows.map((r, i) => (
          <div key={r.name} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 20px", borderTop: i ? "1px solid " + eLINE : "none" }}>
            <div style={{ flex: 1, minWidth: 0, fontFamily: "var(--sans)", fontSize: 14.5, color: eMID }}>{r.name}</div>
            <div style={{ width: 170, flexShrink: 0, display: "flex", alignItems: "center", gap: 9 }}>
              <span style={{ width: 28, height: 28, borderRadius: 14, background: "rgba(0,15,71,.06)", color: eMID, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {React.createElement(I[r.cat === "Technical" ? "monitor" : "bulb"], { size: 15 })}
              </span>
              <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: eINK }}>{r.cat}</span>
            </div>
            <div style={{ width: 130, flexShrink: 0, display: "flex", justifyContent: "flex-end" }}>
              <PlStars value={ratings[r.name] || 0} onChange={(v) => setRatings((x) => ({ ...x, [r.name]: v }))} />
            </div>
          </div>
        ))}
      </div>
      <MnFooterNav onBack={onBack} onNext={onNext} nextLabel="Continue to Reflective questions" />
    </div>
  );
}

// ── step 4 · Reflective Questions, one card at a time ──
function MnReflect({ answers, setAnswers, onBack, onFinish }) {
  const QS = (window.EdPlan && window.EdPlan.REFLECT_QS) || [];
  const [i, setI] = mnUseState(0);
  const [dir, setDir] = mnUseState(1);           // 1 forward, -1 back — drives the slide
  const [tried, setTried] = mnUseState(false);
  const q = QS[i] || {};
  const text = answers[i] || "";
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const min = q.min || 0, max = q.max || 0;
  const short = q.req && words < Math.max(min, 1);
  const over = max > 0 && words > max;
  const blocked = short || over;

  const go = (n) => { setDir(n > i ? 1 : -1); setTried(false); setI(n); };
  const next = () => {
    if (blocked) { setTried(true); return; }
    if (i < QS.length - 1) go(i + 1); else onFinish();
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <h1 style={{ fontFamily: "var(--sans)", fontSize: 22, fontWeight: 700, color: eMID, margin: 0 }}>Reflective Questions</h1>
        <button onClick={onFinish} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 10, padding: "9px 16px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eMID, cursor: "pointer" }}>
          Answer Later <I.arrow size={15} />
        </button>
      </div>

      {/* progress pips — one per question, the deck you're working through */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {QS.map((_, n) => (
          <span key={n} style={{ flex: 1, height: 4, borderRadius: 2, transition: "background .25s",
            background: n < i ? eSUCCESS : n === i ? eMID : "rgba(0,15,71,.10)" }} />
        ))}
      </div>

      {/* A deck: up to three cards still to come sit behind the live one. Each is the
          same box, stepped down by a fixed 15px and narrowed on X only, so every
          visible edge is an equal, symmetrical sliver — a real stack, not a blur. */}
      {(() => { const n = Math.min(3, QS.length - i - 1); return (
      <div style={{ position: "relative", paddingBottom: 15 * n }}>
        {Array.from({ length: n }).map((_, g) => (
          <div key={"ghost" + g} aria-hidden="true" className="mn-ghost"
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 15 * n,
              "--mn-y": 15 * (g + 1) + "px", "--mn-sx": 1 - (g + 1) * 0.045,
              // each sheet a shade deeper, so the edges separate cleanly
              background: g === 0 ? "var(--card)" : "color-mix(in srgb, var(--primary) " + (2 + g * 2) + "%, var(--card))",
              border: "1px solid " + eLINE, borderRadius: 16,
              boxShadow: "0 2px 5px rgba(0,15,71,.05)", zIndex: 9 - g }} />
        ))}
      <div key={i} className="mn-card" style={{ "--mn-from": dir > 0 ? "18px" : "-18px", position: "relative", zIndex: 10,
        background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 16, padding: "22px 24px", boxShadow: "0 10px 30px rgba(0,15,71,.10)" }}>
        <div style={{ display: "inline-flex", alignItems: "center", fontFamily: "var(--sans)", fontSize: 13, fontWeight: 400, color: eMID, background: "rgba(0,15,71,.05)", border: "1px solid " + eLINE, borderRadius: 8, padding: "6px 12px", marginBottom: 16 }}>
          Question {i + 1} of {QS.length}
        </div>
        <h3 style={{ fontFamily: "var(--sans)", fontSize: 17, fontWeight: 700, color: eMID, margin: "0 0 12px", lineHeight: 1.45 }}>
          {q.q}{q.req && <span style={{ color: "var(--danger)", marginLeft: 3 }}>*</span>}
          {!q.req && <span style={{ fontFamily: "var(--sans)", fontSize: 12, fontWeight: 400, color: "var(--ink)", background: "var(--status-neutral-bg)", borderRadius: 6, padding: "4px 10px", marginLeft: 8 }}>Optional</span>}
        </h3>

        <div style={{ border: "1.5px solid " + (tried && blocked ? "var(--danger)" : "var(--field-line)"), borderRadius: 2, overflow: "hidden", background: "var(--card)" }}>
          <textarea autoFocus value={text} onChange={(e) => { const v = e.target.value; setAnswers((a) => ({ ...a, [i]: v })); }}
            rows={4} placeholder="Write your answer here…"
            style={{ width: "100%", boxSizing: "border-box", padding: "14px 16px", border: "none", outline: "none", resize: "vertical", background: "transparent", fontFamily: "var(--sans)", fontSize: 14.5, color: eINK, lineHeight: 1.6, display: "block" }} />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 18, padding: "8px 16px", borderTop: "1px solid " + eLINE, background: "rgba(0,15,71,.02)" }}>
            <span style={{ fontFamily: "var(--sans)", fontSize: 13, color: over ? "var(--danger)" : eMUT }}>Words : {words}</span>
            <span style={{ fontFamily: "var(--sans)", fontSize: 13, color: eMUT }}>Characters : {chars}</span>
          </div>
        </div>

        {(min || max) > 0 && (
          <div style={{ fontFamily: "var(--sans)", fontSize: 13, color: tried && blocked ? "var(--danger)" : eMUT, marginTop: 8 }}>
            {tried && short ? "Please write at least " + Math.max(min, 1) + " words."
              : tried && over ? "That's over the " + max + " word limit."
              : "Must be between " + min + " and " + max + " words"}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 20 }}>
          {i > 0
            ? <button onClick={() => go(i - 1)}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eMID, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 10, padding: "9px 18px", cursor: "pointer" }}>
                <I.arrowL size={15} /> Previous question
              </button>
            : <span />}
          <EdBtn primary small onClick={next}>
            {i === QS.length - 1
              ? <React.Fragment><I.spark size={15} /> Create Development Plan</React.Fragment>
              : <React.Fragment>Next <I.arrow size={15} /></React.Fragment>}
          </EdBtn>
        </div>
      </div>
      </div> ); })()}

      {/* Outside the card: one hop back to the previous step, from any question. */}
      <div style={{ marginTop: 18 }}>
        <button onClick={onBack}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eMID,
            background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 10, padding: "10px 18px", cursor: "pointer" }}>
          <I.arrowL size={15} /> Back
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
//  THE FLOW
// ════════════════════════════════════════════════
function MnManualFlow({ onExit, onDone }) {
  const [step, setStep] = mnUseState(0);
  const [sel, setSel] = mnUseState(() => MN_CATS.map(() => []));
  const [ratings, setRatings] = mnUseState({});
  const [answers, setAnswers] = mnUseState(() => (window.EdPlan && window.EdPlan.loadReflect ? window.EdPlan.loadReflect(window.EdPlan.OWNER) : {}));
  // Step-indicator design, switchable from the floating chip while we settle on one.
  const [stepDesign, setStepDesign] = mnUseState(() => { const v = parseInt(localStorage.getItem("mn-stepper-design"), 10); return v >= 1 && v <= 4 ? v : 1; });   // 1 = numbered rail, the default
  const [stepMenu, setStepMenu] = mnUseState(false);
  const stepRef = mnUseRef(null);
  mnUseEffect(() => {
    if (!stepMenu) return;
    const onDoc = (e) => { if (stepRef.current && !stepRef.current.contains(e.target)) setStepMenu(false); };
    const onKey = (e) => { if (e.key === "Escape") setStepMenu(false); };
    document.addEventListener("mousedown", onDoc); document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [stepMenu]);

  React.useLayoutEffect(() => { try { window.scrollTo(0, 0); } catch (e) {} }, [step]);

  // Step 1's back leaves the flow entirely; the rest step backwards.
  useTopBarBack(step === 0, "Back", () => onExit && onExit());

  const rows = [];
  MN_CATS.forEach((c, ci) => sel[ci].forEach((name) => rows.push({ name, cat: c.name })));

  // Build the plan: the chosen skills, each with no development actions yet.
  const finish = () => {
    const P = window.EdPlan || {};
    const data = MN_CATS.map((c) => ({
      cat: c.name,
      icon: c.name === "Technical" ? "monitor" : "bulb",
      skills: sel[MN_CATS.indexOf(c)].map((name) => ({ name, rating: ratings[name] || 0, isPublic: true, actions: [] })),
    })).filter((c) => c.skills.length);
    if (P.savePlan) P.savePlan(P.OWNER, data);
    if (P.saveReflect) P.saveReflect(P.OWNER, answers);
    // a freshly built plan is a draft, whatever came before
    try { localStorage.setItem("lh-idp-submission", JSON.stringify({ status: "draft", at: Date.now() })); } catch (e) {}
    onDone && onDone();
  };

  return (
    <div style={{ maxWidth: "var(--content-max)", margin: "32px var(--fol-mx) 72px", padding: 0 }}>
      <MnStepper step={step} design={stepDesign} />
      {step === 0 && <MnGettingStarted onNext={() => setStep(1)} />}
      {step === 1 && <MnAddSkills sel={sel} setSel={setSel} onBack={() => setStep(0)} onNext={() => setStep(2)} />}
      {step === 2 && <MnRateSkills rows={rows} ratings={ratings} setRatings={setRatings} onBack={() => setStep(1)} onNext={() => setStep(3)} />}
      {step === 3 && <MnReflect answers={answers} setAnswers={setAnswers} onBack={() => setStep(2)} onFinish={finish} />}

      {/* design switcher, beside the other floating chrome */}
      {ReactDOM.createPortal(
        <div ref={stepRef} className="ed-plan-sample-chip" style={{ position: "fixed", right: 200, bottom: 14, zIndex: 60, fontFamily: "var(--sans)" }}>
          {stepMenu && (
            <div style={{ position: "absolute", bottom: 44, right: 0, width: 276, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 12, boxShadow: "0 12px 36px rgba(0,15,71,.18)", padding: 7 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: eMUT, padding: "6px 9px 4px" }}>Step design</div>
              {MN_STEPPER_DESIGNS.map((o) => { const on = stepDesign === o.id; return (
                <button key={o.id} onClick={() => { setStepDesign(o.id); try { localStorage.setItem("mn-stepper-design", String(o.id)); } catch (e) {} setStepMenu(false); }}
                  style={{ width: "100%", display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 9px", borderRadius: 8, border: "none", background: on ? "color-mix(in srgb, var(--accent) 7%, transparent)" : "transparent", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ width: 16, flexShrink: 0, marginTop: 2, color: eBLUE, display: "flex", justifyContent: "center" }}>{on ? <I.check size={15} /> : null}</span>
                  <span><span style={{ display: "block", fontSize: 14, fontWeight: 600, color: on ? eMID : eINK }}>{o.label}</span><span style={{ display: "block", fontSize: 14, color: eMUT, lineHeight: 1.4 }}>{o.desc}</span></span>
                </button>); })}
            </div>
          )}
          <button onClick={() => setStepMenu((v) => !v)} title="Switch the step-indicator design"
            style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 999, padding: "7px 14px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eMID, cursor: "pointer", boxShadow: "0 2px 10px rgba(0,15,71,.10)" }}>
            <I.layers size={14} /> Step design · {stepDesign}
          </button>
        </div>, document.body)}
    </div>
  );
}

window.EdManual = { ManualFlow: MnManualFlow };
