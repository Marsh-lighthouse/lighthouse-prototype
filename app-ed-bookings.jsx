// ════════════════════════════════════════════════
//  BOOKINGS — Cal.com-style session booking, rebuilt in the Lighthouse
//  design system (Marsh Serif headings · Noto Sans · midnight/gold/cream,
//  design tokens, 14px min type). Ported from the TÜV SÜD UAT flow.
//  Flow:  Invites list → calendar (date · time · language · timezone)
//         → confirm → scheduled (add-to-calendar / cancel / reschedule).
//  Exports: window.EdBookings
// ════════════════════════════════════════════════

const { useState: bkUseState } = React;

// ── tokens (brand-driven; honor Tweaks + dark mode via CSS vars) ──
const kINK = "var(--ink)", kMUT = "var(--muted)", kLINE = "var(--line)", kCARD = "var(--card)",
  kMID = "var(--primary)", kACCENT = "var(--accent)", kGOLD = "var(--action)", kGOLDTX = "var(--action-text)",
  kSUCCESS = "var(--success)", kSUCCESSFILL = "var(--success-fill)", kWARN = "#CB7E03",
  kSKY = "var(--sky-surface)", kCANVAS = "var(--canvas)";

// ── invitations (verbatim copy from the UAT) ──
const BK_INVITES = [
  {
    id: "cap", title: "Invitation to the Capability Review", dur: "1h", durMin: 60,
    desc: "You have been invited to join a Capability Review and should book your session slots now. You will select from three separate slot bookings: a behavioral interview with questions about your business mindset, a case-study discussion, and a role simulation, with approximately 4.5 hours needed in total for all three activities. To book, you must book your interview slot first, after which you can book the case-study slot and you will receive an email, and finally you can book the role-simulation slot. You must complete the interview booking before moving to the next steps. Click the “Book” button to see available dates and times and choose what works best for you. You can cancel or reschedule up to 2 days before your session, but please only do this if necessary as we have limited spots available. After booking, you will receive a calendar invite and email confirmation, and on the day of your session you should log into this platform to join. If you have questions, email mte.surveys@marsh.com.",
  },
  {
    id: "case", title: "Invitation to booking the Case-Study", dur: "2h", durMin: 120,
    desc: "Your timeslot for conducting the interview has been approved successfully. Now it’s time to book the case-study. The same process applies here: You can reschedule your booking once and up to 2 days before your session. Please only do this if really necessary. We have limited spots available. Moreover, each rescheduling leads to changes for the availabilities for role-play as we want you to work with a different consultant there. 2-3 days after you have booked the case-study, you will receive a notification to book the role-play. Click the “Book” button to see available dates and times and choose what works best for you. After booking, you will receive a calendar invite and email confirmation, and on the day of your session you should log into this platform to join. If you have questions, email mte.surveys@marsh.com.",
  },
  {
    id: "role", title: "Invitation to booking the Role-Play", dur: "1h 30m", durMin: 90,
    desc: "Your timeslot for conducting the case-study has been approved successfully. Now it’s time to book the role-play. The same process applies here: You can reschedule your booking once and up to 2 days before your session. Please only do this if really necessary. We have limited spots available. Click the “Book” button to see available dates and times and choose what works best for you. After booking, you will receive a calendar invite and email confirmation, and on the day of your session you should log into this platform to join. If you have questions, email mte.surveys@marsh.com.",
  },
];

const BK_SLOTS = ["09:00 am", "11:00 am", "01:00 pm", "03:30 pm"];
const BK_AVAIL = [3, 4, 5];            // selectable dates in Aug 2026
const BK_MONTH = "Aug", BK_YEAR = 2026;
// Aug 2026 starts on a Saturday → leading blanks then 1..31
const BK_CELLS = [null, null, null, null, null, null].concat(Array.from({ length: 31 }, (_, i) => i + 1));

function bkAddMinutes(start12, min) {
  // start12 like "01:00 pm" → returns "02:00PM"
  const m = start12.match(/(\d+):(\d+)\s*(am|pm)/i);
  let h = +m[1] % 12; if (/pm/i.test(m[3])) h += 12;
  let total = h * 60 + (+m[2]) + min;
  let hh = Math.floor(total / 60) % 24, mm = total % 60;
  const ap = hh >= 12 ? "PM" : "AM"; let h12 = hh % 12; if (h12 === 0) h12 = 12;
  return `${String(h12).padStart(2, "0")}:${String(mm).padStart(2, "0")}${ap}`;
}

// ── shared button (mirrors the platform EdBtn: gold primary / midnight outline) ──
function BkBtn({ children, kind = "primary", onClick, style }) {
  const base = { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, borderRadius: 10, padding: "12px 18px", cursor: "pointer", transition: "filter .15s, background .15s", whiteSpace: "nowrap" };
  const kinds = {
    primary: { background: kGOLD, color: kGOLDTX, border: "none" },
    outline: { background: "transparent", color: kMID, border: "1.5px solid " + kMID },
    danger: { background: "var(--danger-fill)", color: "#fff", border: "none" },
    dangerOutline: { background: "transparent", color: "var(--danger)", border: "1.5px solid var(--danger)" },
  };
  return <button onClick={onClick} style={{ ...base, ...kinds[kind], ...style }}>{children}</button>;
}

// ── select with a custom, theme-aware chevron (native arrow hidden; clear gap from the edge) ──
function BkSelect({ value, onChange, children, wrapStyle, fontSize = 14 }) {
  return (
    <div style={{ position: "relative", display: "inline-block", ...wrapStyle }}>
      <select value={value} onChange={onChange} style={{ width: "100%", appearance: "none", WebkitAppearance: "none", MozAppearance: "none", fontFamily: "var(--sans)", fontSize, color: kINK, background: kCARD, border: "1px solid " + kLINE, borderRadius: 8, padding: "9px 38px 9px 12px", cursor: "pointer" }}>
        {children}
      </select>
      <span style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: kMUT, display: "flex" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
      </span>
    </div>
  );
}

// ── calendar-provider brand glyphs (simplified marks, rendered inline) ──
function BkProviderIcon({ name }) {
  const s = 17;
  switch (name) {
    case "Google": // Google Calendar — the four-colour “G”
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" aria-hidden="true"><path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" /><path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" /><path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z" /><path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" /></svg>
      );
    case "Outlook": // blue square + white “O”
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="5" fill="#0A5AB4" /><ellipse cx="12" cy="12" rx="4.6" ry="5.6" fill="none" stroke="#fff" strokeWidth="2.4" /></svg>
      );
    case "Office 365": // Microsoft four-square mark
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="9" height="9" fill="#F25022" /><rect x="13" y="2" width="9" height="9" fill="#7FBA00" /><rect x="2" y="13" width="9" height="9" fill="#00A4EF" /><rect x="13" y="13" width="9" height="9" fill="#FFB900" /></svg>
      );
    case "iCal": // Apple Calendar — red header + date dots
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="17" rx="3.5" fill="#fff" stroke="#DADCE0" strokeWidth="1" /><path d="M3 7.5A3.5 3.5 0 0 1 6.5 4h11A3.5 3.5 0 0 1 21 7.5V9H3z" fill="#FF3B30" /><g fill="#FF3B30"><circle cx="8" cy="13.5" r="1.25" /><circle cx="12" cy="13.5" r="1.25" /><circle cx="16" cy="13.5" r="1.25" /><circle cx="8" cy="17.5" r="1.25" /><circle cx="12" cy="17.5" r="1.25" /></g></svg>
      );
    case "Yahoo": // purple square + white “Y!”
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="5" fill="#6001D2" /><path d="M6.2 6.5h2.3l1.9 3.4 1.9-3.4h2.3l-3.1 5.3v3.8h-2.1v-3.8z" fill="#fff" /><rect x="14.4" y="13.4" width="2.1" height="2.1" rx=".4" fill="#fff" /><rect x="14.5" y="6.6" width="1.9" height="5.4" rx=".6" fill="#fff" /></svg>
      );
    default:
      return <I.cal size={16} />;
  }
}
const BK_CAL_PROVIDERS = ["Google", "Outlook", "Office 365", "iCal", "Yahoo"];

// ── Read more / Show less toggle: primary colour + chevron (down collapsed, up expanded) ──
function BkMoreToggle({ open, onClick }) {
  return (
    <button onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "none", border: "none", padding: 0, cursor: "pointer", color: kMID, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700 }}>
      {open ? "Show less" : "Read more"}
      <span style={{ display: "flex", transition: "transform .18s", transform: open ? "rotate(180deg)" : "none" }}><I.chevD size={16} /></span>
    </button>
  );
}

function EdBookings() {
  const [tab, setTab] = bkUseState("invites");
  const [invites, setInvites] = bkUseState(BK_INVITES);
  const [bookings, setBookings] = bkUseState([]);
  // flow: null (list) | { invite, step, date, time, langPref, lang, tz }
  const [flow, setFlow] = bkUseState(null);
  const [cancelId, setCancelId] = bkUseState(null);
  const [toast, setToast] = bkUseState("");
  const [openCards, setOpenCards] = bkUseState({});   // accordion: which cards are expanded
  const toggleCard = (id) => setOpenCards((o) => ({ ...o, [id]: !o[id] }));
  const [sample, setSample] = bkUseState(0);          // invite-card layout sample (see BK_SAMPLES)
  const [sampleMenu, setSampleMenu] = bkUseState(false); // sample-picker dropdown open?

  // When inside a booking flow, surface the back in the shell top bar (platform pattern).
  useTopBarBack(!!flow, "Back", () => setFlow(null));

  const showToast = (m) => { setToast(m); setTimeout(() => setToast(""), 2400); };
  // Same content column + alignment as every other side-menu page (respects Tweaks Left/Center).
  const wrap = { maxWidth: "var(--content-max)", margin: "36px var(--fol-mx) 72px", padding: 0 };
  const clamp = { display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" };

  const startBooking = (invite, existing) => setFlow({
    invite, step: "cal",
    date: existing ? existing.day : null, time: existing ? existing.time : null,
    langPref: existing ? (existing.lang ? "yes" : "no") : "yes",
    lang: existing ? existing.lang : "English",
    tz: "(GMT+02:00) Europe/Berlin", reschedule: !!existing,
  });

  const confirmBooking = () => {
    const f = flow;
    const end = bkAddMinutes(f.time, f.invite.durMin);
    const start24 = f.time.replace(/\s*(am|pm)/i, (x) => x.trim().toUpperCase());
    const rec = {
      id: f.invite.id, title: f.invite.title, durMin: f.invite.durMin, desc: f.invite.desc,
      day: f.date, time: f.time, start: start24, end,
      lang: f.langPref === "yes" ? f.lang : null,
      whenLong: `Tuesday, August 0${f.date}, 2026`,
    };
    setBookings((b) => [...b.filter((x) => x.id !== rec.id), rec]);
    if (!f.reschedule) setInvites((iv) => iv.filter((x) => x.id !== f.invite.id));
    setFlow({ ...f, step: "scheduled", rec });
  };

  const doCancel = (id) => {
    const rec = bookings.find((b) => b.id === id);
    setBookings((b) => b.filter((x) => x.id !== id));
    if (rec) { const inv = BK_INVITES.find((i) => i.id === id); if (inv) setInvites((iv) => [...iv.filter((x) => x.id !== id), inv].sort((a, c) => BK_INVITES.indexOf(a) - BK_INVITES.indexOf(c))); }
    setCancelId(null); setFlow(null); setTab("invites"); showToast("Booking cancelled");
  };

  // ══════════ SCHEDULED (success destination) — confirm is a modal over the calendar ══════════
  if (flow && flow.step === "scheduled") {
    const f = flow, end = bkAddMinutes(f.time, f.invite.durMin);
    const Row = ({ label, children }) => (
      <div style={{ display: "flex", gap: 14, padding: "13px 0", borderTop: "1px solid " + kLINE }}>
        <div style={{ flex: "0 0 96px", fontFamily: "var(--sans)", fontSize: 14, color: kMUT }}>{label}</div>
        <div style={{ flex: 1, minWidth: 0, fontFamily: "var(--sans)", fontSize: 15, color: kINK }}>{children}</div>
      </div>
    );
    return (
      <div style={wrap}>
        <div style={{ background: kCARD, border: "1px solid " + kLINE, borderRadius: 16, padding: "40px 44px" }}>
          {/* hero */}
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 60, height: 60, borderRadius: 30, background: kSUCCESSFILL, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", color: "#fff" }}><I.check size={28} /></div>
            <h1 className="serif" style={{ fontSize: 28, color: kINK, margin: "0 0 8px", lineHeight: 1.1 }}>You're all set</h1>
            <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: kMUT, margin: "0 auto 4px", maxWidth: 440, lineHeight: 1.5 }}>Your session is booked. We've emailed you and the other attendees a calendar invitation with all the details.</p>
          </div>

          {/* details summary panel */}
          <div style={{ marginTop: 28, borderRadius: 12, border: "1px solid " + kLINE, background: "transparent", padding: "6px 20px 8px" }}>
            <div style={{ display: "flex", gap: 14, padding: "13px 0" }}>
              <div style={{ flex: "0 0 96px", fontFamily: "var(--sans)", fontSize: 14, color: kMUT }}>Session</div>
              <div style={{ flex: 1, minWidth: 0, fontFamily: "var(--sans)", fontSize: 15, color: kINK, fontWeight: 600 }}>{f.invite.title}</div>
            </div>
            <Row label="When">
              Tuesday, August 0{f.date}, 2026<br />
              <span style={{ fontWeight: 600 }}>{f.time.replace(/\s*(am|pm)/i, (x) => x.trim().toUpperCase())} – {end}</span> <span style={{ color: kMUT }}>(GMT+2)</span>
            </Row>
            {f.langPref === "yes" && <Row label="Language">{f.lang}</Row>}
          </div>

          {/* add to calendar — real provider marks */}
          <div style={{ marginTop: 26 }}>
            <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: kINK, marginBottom: 12 }}>Add to your calendar</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {BK_CAL_PROVIDERS.map((c) =>
                <button key={c} onClick={() => showToast("Added to " + c)} style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: kINK, background: kCARD, border: "1px solid " + kLINE, borderRadius: 10, padding: "9px 14px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, transition: "border-color .15s, background .15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = kMID; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--line)"; }}>
                  <BkProviderIcon name={c} /> {c}
                </button>)}
            </div>
          </div>

          {/* manage actions — buttons, not text links */}
          <div style={{ borderTop: "1px solid " + kLINE, marginTop: 28, paddingTop: 22, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
            <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: kMUT }}>Need to make changes?</div>
            <div style={{ display: "flex", gap: 10 }}>
              <BkBtn kind="dangerOutline" onClick={() => setCancelId(f.invite.id)}>Cancel booking</BkBtn>
              <BkBtn kind="outline" onClick={() => setFlow({ ...f, step: "cal" })}><I.clock size={15} /> Reschedule</BkBtn>
            </div>
          </div>
        </div>
        {cancelId && <BkCancelDialog onNo={() => setCancelId(null)} onYes={() => doCancel(cancelId)} />}
        {toast && <BkToast msg={toast} />}
      </div>
    );
  }

  // ══════════ CALENDAR (date · time · language · timezone) ══════════
  if (flow && (flow.step === "cal" || flow.step === "confirm")) {
    const f = flow;
    const set = (patch) => setFlow((p) => ({ ...p, ...patch }));
    const canBook = f.date && f.time;
    const descOpen = openCards.flowdesc;
    return (
      <div style={wrap}>
        {/* ── heading + description live on the page (not trapped in a scrolling box) ── */}
        <h1 className="serif" style={{ fontSize: 30, color: kINK, lineHeight: 1.12, margin: "0 0 10px" }}>{f.invite.title}</h1>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, color: kMUT, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, marginBottom: 14 }}>
          <I.clock size={16} /> {f.invite.dur} session
        </div>
        <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: kINK, lineHeight: 1.65, margin: "0 0 6px", maxWidth: 720, ...(descOpen ? {} : { display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }) }}>{f.invite.desc}</p>
        <BkMoreToggle open={descOpen} onClick={() => toggleCard("flowdesc")} />

        {/* ── the booking form ── */}
        <div style={{ borderTop: "1px solid " + kLINE, marginTop: 26, paddingTop: 26 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
            <h2 className="serif" style={{ fontSize: 20, color: kINK, margin: 0 }}>Select a date &amp; time</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: kMUT, display: "flex" }}><I.globe size={16} /></span>
              <BkSelect value={f.tz} onChange={(e) => set({ tz: e.target.value })}>
                <option>(GMT+02:00) Europe/Berlin</option>
                <option>(GMT+00:00) UTC</option>
                <option>(GMT+01:00) Europe/London</option>
                <option>(GMT-05:00) America/New York</option>
              </BkSelect>
            </div>
          </div>
          <div className="bk-cal-grid" style={{ border: "1px solid " + kLINE, borderRadius: 14, overflow: "hidden", background: kCARD, display: "grid", gridTemplateColumns: "minmax(0,1.25fr) minmax(0,1fr)" }}>
            {/* month calendar */}
            <div style={{ padding: "24px 26px", borderRight: "1px solid " + kLINE }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, marginBottom: 18 }}>
                <button style={{ background: "none", border: "none", cursor: "pointer", color: kMUT, display: "flex" }}><I.chevL size={18} /></button>
                <span className="serif" style={{ fontSize: 18, color: kINK }}>{BK_MONTH} {BK_YEAR}</span>
                <button style={{ background: "none", border: "none", cursor: "pointer", color: kMUT, display: "flex" }}><I.chevR size={18} /></button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6 }}>
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) =>
                  <div key={d} style={{ textAlign: "center", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: kMUT, paddingBottom: 6 }}>{d}</div>)}
                {BK_CELLS.map((n, i) => {
                  if (n == null) return <div key={i} />;
                  const avail = BK_AVAIL.includes(n);
                  const sel = f.date === n;
                  return (
                    <button key={i} disabled={!avail} onClick={() => set({ date: n, time: null })}
                      style={{
                        aspectRatio: "1", borderRadius: 10, border: "none", cursor: avail ? "pointer" : "default",
                        fontFamily: "var(--sans)", fontSize: 14, fontWeight: sel ? 700 : 500,
                        background: sel ? kACCENT : avail ? kSKY : "transparent",
                        color: sel ? "var(--on-accent)" : avail ? kINK : kMUT,
                      }}>{n}</button>
                  );
                })}
              </div>
            </div>
            {/* time slots → language preference */}
            <div style={{ padding: "24px 22px" }}>
              {!f.date &&
                <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: kMUT, lineHeight: 1.5 }}>Select an available date to see open times.</div>}
              {f.date && !f.time && <React.Fragment>
                <div style={{ fontFamily: "var(--sans)", fontSize: 15, color: kINK, fontWeight: 600, marginBottom: 14 }}><span style={{ fontWeight: 700 }}>Tue,</span> {f.date}th Aug</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {BK_SLOTS.map((s) =>
                    <button key={s} onClick={() => set({ time: s })} style={{ textAlign: "center", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: kMID, background: kCARD, border: "1px solid " + kLINE, borderRadius: 10, padding: "12px", cursor: "pointer" }}>{s}</button>)}
                </div>
              </React.Fragment>}
              {f.date && f.time && <React.Fragment>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                  <button onClick={() => set({ time: null })} style={{ background: "none", border: "none", cursor: "pointer", color: kMUT, display: "flex", padding: 0 }}><I.chevL size={16} /></button>
                  <span style={{ fontFamily: "var(--sans)", fontSize: 15, color: kINK }}><span style={{ fontWeight: 700 }}>Tue,</span> {f.date}th Aug, <span style={{ fontWeight: 700 }}>{f.time}</span></span>
                </div>
                <div style={{ fontFamily: "var(--sans)", fontSize: 15, color: kINK, marginBottom: 12 }}>Do you have a language preference?</div>
                <div style={{ display: "flex", gap: 22, marginBottom: 16 }}>
                  {["yes", "no"].map((v) =>
                    <label key={v} style={{ display: "inline-flex", alignItems: "center", gap: 7, cursor: "pointer", fontFamily: "var(--sans)", fontSize: 15, color: kINK }}>
                      <input type="radio" name="bk-lang" checked={f.langPref === v} onChange={() => set({ langPref: v })} style={{ accentColor: kACCENT, width: 16, height: 16 }} />
                      {v === "yes" ? "Yes" : "No"}
                    </label>)}
                </div>
                {f.langPref === "yes" &&
                  <BkSelect value={f.lang} onChange={(e) => set({ lang: e.target.value })} fontSize={15} wrapStyle={{ display: "block", width: "100%" }}>
                    <option>English</option><option>Deutsch</option>
                  </BkSelect>}
              </React.Fragment>}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
            <BkBtn kind="primary" onClick={() => canBook && setFlow({ ...f, step: "confirm" })} style={{ opacity: canBook ? 1 : 0.45, cursor: canBook ? "pointer" : "not-allowed", padding: "12px 26px" }}>Book <I.arrow size={15} /></BkBtn>
          </div>
        </div>
        {f.step === "confirm" && <BkConfirmDialog f={f} end={bkAddMinutes(f.time, f.invite.durMin)} onClose={() => setFlow({ ...f, step: "cal" })} onConfirm={confirmBooking} />}
        {toast && <BkToast msg={toast} />}
      </div>
    );
  }

  // ══════════ LIST (Invites / Bookings tabs) ══════════
  // Styled to match the program-detail tabs (Intro / Tasks / Reports).
  const Tab = ({ id, label, count }) => {
    const on = tab === id;
    return (
      <button onClick={() => setTab(id)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--sans)", fontSize: 14, fontWeight: on ? 700 : 500, color: on ? kMID : kMUT, padding: "10px 18px", borderBottom: "2px solid " + (on ? kMID : "transparent"), marginBottom: -1, transition: "color .15s" }}>
        {label} <span style={{ color: kMUT, fontWeight: 500 }}>({count})</span>
      </button>
    );
  };

  // one collapsible card (accordion): compact preview, full content on click
  const Card = ({ id, head, body, footer }) => {
    const open = !!openCards[id];
    return (
      <div style={{ background: kCARD, border: "1px solid " + kLINE, borderRadius: 14 }}>
        <div onClick={() => toggleCard(id)} style={{ cursor: "pointer", padding: "20px 24px 4px" }}>
          <div style={{ flex: 1, minWidth: 0 }}>{head}</div>
          <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: open ? kINK : kMUT, lineHeight: 1.6, margin: "12px 0 0", ...(open ? {} : clamp) }}>{body}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "12px 24px 20px" }}>
          <BkMoreToggle open={open} onClick={() => toggleCard(id)} />
          {footer}
        </div>
      </div>
    );
  };

  // ── Invite-card layout SAMPLES (same content, different presentation). ──
  // Add a new object to BK_SAMPLES to extend the gallery; the bottom switcher cycles them.
  const inviteMeta = (iv, size) => (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 7, color: kMUT, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600 }}><I.clock size={size || 16} /> {iv.dur}</div>
  );
  // 1 · Editorial — the accordion card (current default)
  const inviteEditorial = (iv) => (
    <Card key={iv.id} id={iv.id}
      head={<React.Fragment>
        <h2 className="serif" style={{ fontSize: 21, color: kINK, margin: "0 0 8px", lineHeight: 1.15 }}>{iv.title}</h2>
        {inviteMeta(iv)}
      </React.Fragment>}
      body={iv.desc}
      footer={<BkBtn kind="primary" onClick={() => startBooking(iv)}>Book <I.arrow size={15} /></BkBtn>} />
  );
  // 2 · Compact — title + Book on one row, tight meta, expandable description
  const inviteCompact = (iv) => {
    const open = !!openCards[iv.id];
    return (
      <div key={iv.id} style={{ background: kCARD, border: "1px solid " + kLINE, borderRadius: 14, padding: "18px 22px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 className="serif" style={{ fontSize: 19, color: kINK, margin: "0 0 6px", lineHeight: 1.2 }}>{iv.title}</h2>
            {inviteMeta(iv, 15)}
          </div>
          <BkBtn kind="primary" onClick={() => startBooking(iv)}>Book <I.arrow size={15} /></BkBtn>
        </div>
        <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: kMUT, lineHeight: 1.6, margin: "12px 0 0", ...(open ? {} : clamp) }}>{iv.desc}</p>
        <div style={{ marginTop: 8 }}><BkMoreToggle open={open} onClick={() => toggleCard(iv.id)} /></div>
      </div>
    );
  };
  // 3 · Split — content left, CTA panel right
  const inviteSplit = (iv) => {
    const open = !!openCards[iv.id];
    return (
      <div key={iv.id} style={{ background: kCARD, border: "1px solid " + kLINE, borderRadius: 14, overflow: "hidden", display: "grid", gridTemplateColumns: "minmax(0,1fr) 190px" }}>
        <div style={{ padding: "22px 24px" }}>
          <h2 className="serif" style={{ fontSize: 21, color: kINK, margin: "0 0 10px", lineHeight: 1.15 }}>{iv.title}</h2>
          <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: kMUT, lineHeight: 1.6, margin: 0, ...(open ? {} : clamp) }}>{iv.desc}</p>
          <div style={{ marginTop: 8 }}><BkMoreToggle open={open} onClick={() => toggleCard(iv.id)} /></div>
        </div>
        <div style={{ borderLeft: "1px solid " + kLINE, padding: "22px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, textAlign: "center" }}>
          {inviteMeta(iv, 15)}
          <BkBtn kind="primary" onClick={() => startBooking(iv)} style={{ width: "100%", justifyContent: "center" }}>Book <I.arrow size={15} /></BkBtn>
        </div>
      </div>
    );
  };
  // 4 · Stepped — numbered badge (reflects the interview → case-study → role-play order)
  const inviteStepped = (iv, i) => {
    const open = !!openCards[iv.id];
    return (
      <div key={iv.id} style={{ background: kCARD, border: "1px solid " + kLINE, borderRadius: 14, padding: "20px 24px", display: "flex", gap: 16 }}>
        <div style={{ flexShrink: 0, width: 30, height: 30, borderRadius: 15, background: kACCENT, color: "var(--on-accent)", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 3 }}>{i + 1}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 14 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 className="serif" style={{ fontSize: 20, color: kINK, margin: "0 0 6px", lineHeight: 1.18 }}>{iv.title}</h2>
              {inviteMeta(iv, 15)}
            </div>
            <BkBtn kind="primary" onClick={() => startBooking(iv)}>Book <I.arrow size={15} /></BkBtn>
          </div>
          <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: kMUT, lineHeight: 1.6, margin: "12px 0 0", ...(open ? {} : clamp) }}>{iv.desc}</p>
          <div style={{ marginTop: 8 }}><BkMoreToggle open={open} onClick={() => toggleCard(iv.id)} /></div>
        </div>
      </div>
    );
  };
  // 5 · Two-up — two standard cards per row (compact, consistent with the rest of the platform).
  // Description is clamped to 3 lines (…); the full text lives one click deeper, on Book.
  const inviteGrid = (iv) => (
    <div key={iv.id} style={{ background: kCARD, border: "1px solid " + kLINE, borderRadius: 14, padding: "20px 22px", display: "flex", flexDirection: "column", height: "100%" }}>
      <h2 className="serif" style={{ fontSize: 19, color: kINK, margin: "0 0 8px", lineHeight: 1.2 }}>{iv.title}</h2>
      {inviteMeta(iv, 15)}
      <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: kMUT, lineHeight: 1.6, margin: "12px 0 18px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{iv.desc}</p>
      <div style={{ marginTop: "auto" }}>
        <BkBtn kind="primary" onClick={() => startBooking(iv)} style={{ width: "100%", justifyContent: "center" }}>Book <I.arrow size={15} /></BkBtn>
      </div>
    </div>
  );
  const BK_SAMPLES = [
    { name: "Editorial", render: inviteEditorial },
    { name: "Compact", render: inviteCompact },
    { name: "Split", render: inviteSplit },
    { name: "Stepped", render: inviteStepped },
    { name: "Two-up", render: inviteGrid, grid: true },
  ];
  const activeSample = BK_SAMPLES[sample] || BK_SAMPLES[0];

  return (
    <div style={wrap}>
      <h1 className="serif" style={{ fontSize: 40, color: kINK, lineHeight: 1.08, margin: "0 0 8px" }}>Bookings</h1>
      <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: kINK, lineHeight: 1.6, margin: "0 0 24px", maxWidth: 560 }}>Review your invitations and book your assessment sessions.</p>
      <div style={{ display: "flex", gap: 2, borderBottom: "1px solid " + kLINE, marginBottom: 30 }}>
        <Tab id="invites" label="Invites" count={invites.length} />
        <Tab id="bookings" label="Bookings" count={bookings.length} />
      </div>

      {tab === "invites" && (invites.length === 0 ?
        <BkEmpty msg="No invites right now. Booked sessions appear under Bookings." /> :
        <div style={activeSample.grid
          ? { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16, alignItems: "stretch" }
          : { display: "flex", flexDirection: "column", gap: 16 }}>
          {invites.map((iv, i) => activeSample.render(iv, i))}
        </div>)}

      {tab === "bookings" && (bookings.length === 0 ?
        <BkEmpty msg="You haven't booked any sessions yet. Open an invite and pick a slot." /> :
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {bookings.map((bk) => {
            const durLabel = bk.durMin >= 60 ? `${Math.floor(bk.durMin / 60)}h${bk.durMin % 60 ? " " + (bk.durMin % 60) + "m" : ""}` : bk.durMin + "m";
            return (
            <Card key={bk.id} id={"b-" + bk.id}
              head={<React.Fragment>
                <h2 className="serif" style={{ fontSize: 21, color: kINK, margin: "0 0 10px", lineHeight: 1.15 }}>{bk.title}</h2>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16, fontFamily: "var(--sans)", fontSize: 14 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: kMUT, fontWeight: 600 }}><I.clock size={15} /> {durLabel}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: kINK }}><I.cal size={15} /> {bk.day}th August 2026 <b style={{ fontWeight: 700 }}>{bk.start}</b> - <b style={{ fontWeight: 700 }}>{bk.end}</b> <span style={{ color: kMUT }}>(GMT+2)</span></span>
                </div>
              </React.Fragment>}
              body={bk.desc}
              footer={<div style={{ display: "flex", gap: 10 }}>
                <BkBtn kind="outline" onClick={() => setCancelId(bk.id)}>Cancel</BkBtn>
                <BkBtn kind="primary" onClick={() => { const inv = BK_INVITES.find((i) => i.id === bk.id); startBooking(inv, bk); }}>Modify <I.arrow size={15} /></BkBtn>
              </div>} />);
          })}
        </div>)}

      {cancelId && <BkCancelDialog onNo={() => setCancelId(null)} onYes={() => doCancel(cancelId)} />}
      {toast && <BkToast msg={toast} />}

      {/* page-scoped sample picker — a dropdown of invite-card layouts (grows as samples are added). Sits just above "All directions". */}
      {tab === "invites" && invites.length > 0 && <React.Fragment>
        {sampleMenu && <div onClick={() => setSampleMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 189 }} />}
        <div style={{ position: "fixed", right: 172, bottom: 14, zIndex: 190 }}>
          {sampleMenu &&
            <div style={{ position: "absolute", bottom: "calc(100% + 8px)", right: 0, minWidth: 220, background: kCARD, border: "1px solid " + kLINE, borderRadius: 12, boxShadow: "0 16px 44px rgba(0,15,71,.20)", padding: 6 }}>
              <div style={{ fontFamily: "var(--sans)", fontSize: 12, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", color: kMUT, padding: "8px 12px 6px" }}>Card style</div>
              {BK_SAMPLES.map((s, i) => {
                const on = i === sample;
                return (
                  <button key={s.name} onClick={() => { setSample(i); setSampleMenu(false); }}
                    onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = "rgba(0,15,71,.05)"; }}
                    onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = "transparent"; }}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, width: "100%", background: on ? kSKY : "transparent", border: "none", borderRadius: 8, cursor: "pointer", padding: "10px 12px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: on ? 700 : 500, color: kINK, textAlign: "left" }}>
                    {s.name}
                    {on && <span style={{ display: "flex", color: kMID }}><I.check size={16} /></span>}
                  </button>
                );
              })}
            </div>}
          <button onClick={() => setSampleMenu((v) => !v)} title="Choose a booking-card layout"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: kCARD, color: kMID, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, padding: "7px 13px", borderRadius: 9, border: "1px solid " + kLINE, boxShadow: "0 3px 12px rgba(0,15,71,.12)", cursor: "pointer" }}>
            <span style={{ display: "flex", color: kMUT }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="7" rx="1.5" /><rect x="3" y="14" width="18" height="6" rx="1.5" /></svg></span>
            Card style · {activeSample.name}
            <span style={{ display: "flex", color: kMUT, transition: "transform .18s", transform: sampleMenu ? "rotate(180deg)" : "none" }}><I.chevD size={15} /></span>
          </button>
        </div>
      </React.Fragment>}
    </div>
  );
}

// ── confirm-booking dialog (pop-up over the calendar) ──
function BkConfirmDialog({ f, end, onClose, onConfirm }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,15,71,.4)", backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", background: kCARD, border: "1px solid var(--line)", borderRadius: 18, padding: 28, maxWidth: 440, width: "100%", boxShadow: "0 24px 60px rgba(0,15,71,.3)" }}>
        <button onClick={onClose} title="Close" style={{ position: "absolute", top: 16, right: 16, width: 32, height: 32, borderRadius: 8, border: "none", background: "rgba(0,15,71,.05)", color: kMUT, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><I.plus size={18} style={{ transform: "rotate(45deg)" }} /></button>
        <div style={{ width: 46, height: 46, borderRadius: 13, background: kSKY, color: kACCENT, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}><I.cal size={22} /></div>
        <h2 className="serif" style={{ fontSize: 24, color: kINK, lineHeight: 1.12, margin: "0 0 8px" }}>Confirm this booking?</h2>
        <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: kMUT, lineHeight: 1.6, margin: "0 0 20px" }}>Please confirm these details are correct before we finalize your session.</p>
        <div style={{ borderTop: "1px solid " + kLINE, textAlign: "left", padding: "18px 0 4px", display: "grid", gridTemplateColumns: "88px 1fr", rowGap: 16, columnGap: 12 }}>
          <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: kMUT }}>What</div>
          <div style={{ fontFamily: "var(--sans)", fontSize: 15, color: kINK, fontWeight: 500 }}>{f.invite.title}</div>
          <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: kMUT }}>When</div>
          <div style={{ fontFamily: "var(--sans)", fontSize: 15, color: kINK }}>
            Tuesday, August 0{f.date}, 2026<br />
            <span style={{ fontWeight: 500 }}>{f.time.replace(/\s*(am|pm)/i, (x) => x.trim().toUpperCase())} - {end}</span> <span style={{ color: kMUT }}>(GMT+2)</span>
          </div>
          {f.langPref === "yes" && <React.Fragment>
            <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: kMUT }}>Language</div>
            <div style={{ fontFamily: "var(--sans)", fontSize: 15, color: kINK }}>{f.lang}</div>
          </React.Fragment>}
        </div>
        <div style={{ borderTop: "1px solid " + kLINE, marginTop: 18, paddingTop: 18, display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <BkBtn kind="outline" onClick={onClose}>Back</BkBtn>
          <BkBtn kind="primary" onClick={onConfirm}>Confirm booking <I.arrow size={15} /></BkBtn>
        </div>
      </div>
    </div>
  );
}

// ── cancel confirmation dialog ──
function BkCancelDialog({ onNo, onYes }) {
  return (
    <div onClick={onNo} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,15,71,.4)", backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", background: kCARD, border: "1px solid var(--line)", borderRadius: 18, padding: 28, maxWidth: 420, width: "100%", boxShadow: "0 24px 60px rgba(0,15,71,.3)" }}>
        <button onClick={onNo} title="Close" style={{ position: "absolute", top: 16, right: 16, width: 32, height: 32, borderRadius: 8, border: "none", background: "rgba(0,15,71,.05)", color: kMUT, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><I.plus size={18} style={{ transform: "rotate(45deg)" }} /></button>
        <div style={{ width: 46, height: 46, borderRadius: 13, background: "rgba(197,53,50,.10)", color: "var(--danger)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}><I.info size={22} /></div>
        <h2 className="serif" style={{ fontSize: 24, color: kINK, lineHeight: 1.12, margin: "0 0 8px" }}>Cancel this booking?</h2>
        <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: kMUT, lineHeight: 1.6, margin: "0 0 22px" }}>You can rebook from your invites afterwards, but spots are limited — you may not get the same slot back.</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <BkBtn kind="outline" onClick={onNo}>Keep booking</BkBtn>
          <BkBtn kind="danger" onClick={onYes}>Cancel booking</BkBtn>
        </div>
      </div>
    </div>
  );
}

function BkEmpty({ msg }) {
  return (
    <div style={{ margin: 0, textAlign: "center", background: kCARD, border: "1px dashed " + kLINE, borderRadius: 14, padding: "56px 30px" }}>
      <div style={{ width: 52, height: 52, borderRadius: 26, background: kSKY, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", color: kACCENT }}><I.cal size={24} /></div>
      <p style={{ fontFamily: "var(--sans)", fontSize: 15, color: kMUT, margin: 0, lineHeight: 1.5 }}>{msg}</p>
    </div>
  );
}

function BkToast({ msg }) {
  return (
    <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: kMID, color: "#fff", padding: "12px 20px", borderRadius: 10, boxShadow: "0 10px 30px rgba(0,15,71,.28)", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, zIndex: 300, display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ color: "#8CE0A8", display: "flex" }}><I.check size={15} /></span> {msg}
    </div>
  );
}

window.EdBookings = EdBookings;
// Shared with Scheduling so its "Add to calendar" step uses the same provider marks.
window.EdBookings.ProviderIcon = BkProviderIcon;
window.EdBookings.CAL_PROVIDERS = BK_CAL_PROVIDERS;
