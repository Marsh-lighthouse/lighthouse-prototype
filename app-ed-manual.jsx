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
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap",
      borderTop: "1px solid " + eLINE, marginTop: 32, paddingTop: 20 }}>
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

// ── the step rail across the top ──
function MnStepper({ step }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 30, flexWrap: "wrap" }}>
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
            {i < MN_STEPS.length - 1 && <span style={{ flex: "1 1 30px", minWidth: 24, height: 1, background: i < step ? eSUCCESS : eLINE, margin: "0 14px" }} />}
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
        <div key={ci} style={{ borderTop: ci ? "1px solid " + eLINE : "none", paddingTop: ci ? 26 : 0, marginTop: ci ? 26 : 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <div style={{ width: 46, height: 46, borderRadius: 23, background: "rgba(0,15,71,.06)", color: eMID, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{React.createElement(I[c.icon], { size: 22 })}</div>
            <div>
              <div className="serif" style={{ fontSize: 21, color: eMID }}>{c.name}</div>
              <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: eMUT }}>Choose the skills you want to develop further as part of your development plan.</div>
            </div>
          </div>
          <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: eMID, margin: "16px 0 10px" }}>Select your skills</div>
          <IdpMultiSelect options={c.options} selected={sel[ci]} onChange={(v) => setCat(ci, v)} placeholder="Select skills" />
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

      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 22 }}>
        <div style={{ width: 46, height: 46, borderRadius: 23, background: "color-mix(in srgb, var(--accent) 8%, transparent)", color: eBLUE, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><I.spark size={22} /></div>
        <p style={{ fontFamily: "var(--sans)", fontSize: 14.5, color: eINK, lineHeight: 1.6, margin: 0 }}>
          Now that you have selected your developmental priorities, please rate yourself on each of the following.
          Remember to rate yourself based on your current level and not on your past or desired level.
        </p>
      </div>

      <div style={{ background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 14, overflow: "hidden" }}>
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

      <div key={i} className="mn-card" style={{ "--mn-from": dir > 0 ? "34px" : "-34px",
        background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 16, padding: "22px 24px", boxShadow: "0 6px 24px rgba(0,15,71,.07)" }}>
        <div style={{ display: "inline-flex", alignItems: "center", fontFamily: "var(--sans)", fontSize: 13, fontWeight: 700, color: eMID, background: "rgba(0,15,71,.05)", border: "1px solid " + eLINE, borderRadius: 8, padding: "6px 12px", marginBottom: 16 }}>
          Question {i + 1} of {QS.length}
        </div>
        <h3 style={{ fontFamily: "var(--sans)", fontSize: 17, fontWeight: 700, color: eMID, margin: "0 0 12px", lineHeight: 1.45 }}>
          {q.q}{q.req && <span style={{ color: "var(--danger)", marginLeft: 3 }}>*</span>}
          {!q.req && <span style={{ fontFamily: "var(--sans)", fontSize: 12, fontWeight: 600, color: eMUT, background: "rgba(0,15,71,.05)", borderRadius: 6, padding: "2px 8px", marginLeft: 8 }}>Optional</span>}
        </h3>

        <div style={{ border: "1.5px solid " + (tried && blocked ? "var(--danger)" : eLINE), borderRadius: 12, overflow: "hidden", background: "var(--card)" }}>
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
          <button onClick={() => (i > 0 ? go(i - 1) : onBack())}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: eMID, background: "var(--card)", border: "1px solid " + eLINE, borderRadius: 10, padding: "9px 18px", cursor: "pointer" }}>
            <I.arrowL size={15} /> Back
          </button>
          <EdBtn primary small onClick={next}>
            {i === QS.length - 1 ? "Submit" : "Next"} <I.arrow size={15} />
          </EdBtn>
        </div>
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
      <MnStepper step={step} />
      {step === 0 && <MnGettingStarted onNext={() => setStep(1)} />}
      {step === 1 && <MnAddSkills sel={sel} setSel={setSel} onBack={() => setStep(0)} onNext={() => setStep(2)} />}
      {step === 2 && <MnRateSkills rows={rows} ratings={ratings} setRatings={setRatings} onBack={() => setStep(1)} onNext={() => setStep(3)} />}
      {step === 3 && <MnReflect answers={answers} setAnswers={setAnswers} onBack={() => setStep(2)} onFinish={finish} />}
    </div>
  );
}

window.EdManual = { ManualFlow: MnManualFlow };
