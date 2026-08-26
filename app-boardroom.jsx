// ════════════════════════════════════════════════
//  DIRECTION B — "Boardroom"
//  Thin Midnight branding rail + signature Sky-Blue split hero ·
//  main column + right rail of bento cards on warm cream.
//  NOW A ROUTED SHELL: dashboard → program detail / growth flows,
//  reusing the shared Ed* flow pages (same content & structure as
//  Direction A), wrapped in Boardroom's own chrome.
// ════════════════════════════════════════════════

const bMID = "var(--primary)", bSKY = "#CEECFF", bGOLD = "var(--action)", bINK = "var(--ink)",
      bMUT = "var(--muted)", bCREAM = "var(--canvas)", bBLUE = "var(--accent)", bPURP = "#8F20DE",
      bLINE = "var(--line)";

function RingB({ pct, size = 48, stroke = 4, color = bBLUE, track = "rgba(255,255,255,.18)" }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={c} strokeDashoffset={c * (1 - pct/100)} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`} />
    </svg>
  );
}

const bToggleBtn = {
  width: 32, height: 32, borderRadius: 8, border: "1px solid " + bLINE,
  background: "var(--card)", color: bMUT,
  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0,
};

// Full collapsible WHITE side menu. Expanded shows labels; collapsed shows icons only.
function BRail({ activeId, onNav, collapsed, onToggle, theme }) {
  const dark = theme === "dark";
  const Item = ({ item, active }) => {
    const Ic = I[item.icon] || I.home;
    return (
      <div onClick={() => onNav(item.id)}
        role="button" tabIndex={0} aria-current={active ? "page" : undefined}
        aria-label={collapsed ? item.label : undefined}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onNav(item.id); } }}
        title={collapsed ? item.label : undefined} style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: collapsed ? "11px 0" : "10px 14px",
        justifyContent: collapsed ? "center" : "flex-start", borderRadius: 9,
        background: active ? "var(--sky-surface)" : "transparent",
        color: active ? bMID : bMID, cursor: "pointer",
        fontFamily: "var(--sans)", fontSize: 14, fontWeight: active ? 600 : 400, position: "relative",
      }}>
        {active && !collapsed && <div style={{ position: "absolute", left: 0, top: 9, bottom: 9, width: 3, borderRadius: 3, background: bGOLD }} />}
        <span style={{ color: active ? bMID : bMID, display: "flex" }}><Ic size={19} /></span>
        {!collapsed && item.label}
      </div>
    );
  };
  return (
    <aside className="lh-rail" style={{ width: collapsed ? 76 : 256, minWidth: collapsed ? 76 : 256, maxWidth: collapsed ? 76 : 256, flexShrink: 0, height: "100vh", overflowY: "auto", background: "var(--card)", borderRight: "1px solid " + bLINE, display: "flex", flexDirection: "column", color: bINK, transition: "width .22s ease, min-width .22s ease, max-width .22s ease" }}>
      {/* header — brand + collapse toggle */}
      <div style={{ padding: collapsed ? "22px 0 16px" : "26px 22px 18px", display: "flex", flexDirection: "column", alignItems: collapsed ? "center" : "stretch", gap: 16 }}>
        {collapsed ? (
          <React.Fragment>
            {window.LHBrand && window.LHBrand.current() !== "marsh" ? <img src={dark ? window.LHBrand.get().iconWhite : window.LHBrand.get().icon} alt={window.LHBrand.get().label} style={{ width: 30, height: "auto", maxHeight: 36, objectFit: "contain", display: "block" }} /> : <img src={window.LHLogo.iconDark} className="bd-mercer-logo" alt="Marsh" style={{ width: 30, height: "auto", display: "block" }} />}
            <button onClick={onToggle} title="Expand menu" style={bToggleBtn}><I.chevR size={18} /></button>
          </React.Fragment>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            {window.LHBrand && window.LHBrand.current() !== "marsh" ? <img src={dark ? window.LHBrand.get().logoWhite : window.LHBrand.get().logo} alt={window.LHBrand.get().label} style={{ height: window.LHBrand.current() === "generali" ? 38 : 36, width: "auto", maxWidth: 190, objectFit: "contain", display: "block" }} /> : <img src={window.LHLogo.wordmarkDark} className="bd-mercer-logo" alt="Marsh" style={{ height: 24, display: "block" }} />}
          </div>
        )}
      </div>
      <nav style={{ flex: 1, padding: "4px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Bookings hidden for now */}
        {LH.nav.filter((it) => it.id !== "leadership" && it.id !== "360" && it.id !== "bookings").map((it) => (
          <Item key={it.id} item={it} active={it.id === activeId} />
        ))}
        <Item item={{ id: "profile", label: "My profile", icon: "user" }} active={activeId === "profile"} />
        <Item item={{ id: "changePassword", label: "Change password", icon: "lock" }} active={activeId === "changePassword"} />
      </nav>
      {!collapsed && (
        <div style={{ padding: "0 14px 6px" }}>
          <div style={{ background: "var(--sky-surface)", borderRadius: 12, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
              <div style={{ position: "relative", width: 56, height: 56, flexShrink: 0, borderRadius: "50%", background: "conic-gradient(" + bGOLD + " " + (LH.profile.pct * 3.6) + "deg, rgba(0,15,71,.12) 0)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--card)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--sans)", fontSize: 15, fontWeight: 700, color: bMID }}>{LH.profile.pct}%</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: bMID }}>Profile completion</div>
                <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: bMUT, marginTop: 2 }}>{LH.profile.done} of {LH.profile.total} sections</div>
              </div>
            </div>
            <button onClick={() => onNav("profile")} style={{ width: "100%", padding: "9px 12px", background: "var(--card)", color: bMID, border: "1px solid " + bLINE, borderRadius: 8, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Complete profile</button>
          </div>
        </div>
      )}
      <div style={{ padding: collapsed ? "14px 0" : 14, borderTop: "1px solid " + bLINE, display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", gap: 11 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--surface-deep)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--sans)", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{LH.user.initials}</div>
        {!collapsed && (
          <React.Fragment>
            <span style={{ flex: 1, minWidth: 0, fontFamily: "var(--sans)" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: bMID }}>{LH.user.first} {LH.user.last}</div>
              <button onClick={() => { window.location.href = "Login.html"; }} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "none", border: "none", padding: 0, marginTop: 2, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: bBLUE, cursor: "pointer" }}>Log out</button>
            </span>
            <button onClick={onToggle} title="Collapse menu" style={bToggleBtn}><I.chevL size={18} /></button>
          </React.Fragment>
        )}
      </div>
    </aside>
  );
}

// Change Password — mirrors Folio's EdChangePassword.
function BChangePassword({ onBack }) {
  const [show, setShow] = React.useState({ old: false, pw: false, conf: false });
  const [vals, setVals] = React.useState({ old: "", pw: "", conf: "" });
  const labelSt = { display: "block", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: bMID, marginBottom: 7 };
  const inputSt = { width: "100%", boxSizing: "border-box", border: "1.5px solid " + bLINE, borderRadius: 10, padding: "12px 44px 12px 13px", fontFamily: "var(--sans)", fontSize: 14, color: "var(--ink)", outline: "none", background: "var(--card)" };
  const eyeBtn = (k) => (
    <button type="button" onClick={() => setShow((s) => ({ ...s, [k]: !s[k] }))} title={show[k] ? "Hide" : "Show"} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", color: bBLUE, cursor: "pointer" }}>
      {show[k]
        ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>
        : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l18 18" /><path d="M10.6 5.1A10.9 10.9 0 0112 5c7 0 10 7 10 7a13.2 13.2 0 01-2.2 3.2M6.6 6.6A13.3 13.3 0 002 12s3 7 10 7a10.7 10.7 0 005.4-1.4" /><path d="M9.9 9.9a3 3 0 004.2 4.2" /></svg>}
    </button>
  );
  const pwField = (label, k) => (
    <div style={{ marginBottom: 22 }}>
      <label style={labelSt}>{label}</label>
      <div style={{ position: "relative" }}>
        <input type={show[k] ? "text" : "password"} value={vals[k]} onChange={(ev) => { const v = ev.target.value; setVals((s) => ({ ...s, [k]: v })); }} style={inputSt} />
        {eyeBtn(k)}
      </div>
    </div>
  );
  return (
    <div style={{ maxWidth: "var(--content-max)", margin: "36px var(--fol-mx) 72px", padding: 0 }}>
      <h1 className="serif" style={{ fontSize: 40, color: bMID, lineHeight: 1.06, margin: "0 0 28px" }}>Change Password</h1>
      <div style={{ background: "var(--card)", border: "1px solid " + bLINE, borderRadius: 16, padding: "26px 26px 28px", marginBottom: 20 }}>
        {pwField("Old Password", "old")}
        {pwField("Password", "pw")}
        {pwField("Password Confirmation", "conf")}
        <div style={{ background: "rgba(203,126,3,.08)", border: "1px solid rgba(203,126,3,.28)", borderRadius: 12, padding: "13px 15px", display: "flex", gap: 11, alignItems: "flex-start", marginBottom: 24 }}>
          <span style={{ color: "#CB7E03", display: "flex", flexShrink: 0, marginTop: 1 }}><I.info size={18} /></span>
          <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: bINK, lineHeight: 1.5, margin: 0 }}><strong style={{ color: bMID }}>Important:</strong> Changing your password will log you out.</p>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={() => { window.location.href = "Login.html"; }} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: bGOLD, color: "var(--action-text)", border: "none", borderRadius: 10, padding: "12px 26px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Update <I.arrow size={16} /></button>
        </div>
      </div>
    </div>
  );
}

// Profile page (My profile) — view + edit, mirrors Folio's profile content.
function BProfile({ onBack }) {
  const u = LH.user;
  const initial = { first: u.first, last: u.last, email: (u.first + "." + u.last + "@marsh.com").toLowerCase().replace(/\s+/g, ""), age: "", gender: "", lang: "English", targetJob: "", targetEntity: "", yearsExp: "", minEdu: "", prefEdu: "", avatar: null };
  const [data, setData] = React.useState(initial);
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(initial);
  const fileRef = React.useRef(null);
  const setD = (k, v) => setDraft((d) => ({ ...d, [k]: v }));
  const onFile = (ev) => { const f = ev.target.files && ev.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => setD("avatar", r.result); r.readAsDataURL(f); };
  const startEdit = () => { setDraft(data); setEditing(true); };
  const save = () => { setData(draft); setEditing(false); };
  const initials = ((data.first[0] || "") + (data.last[0] || "")).toUpperCase();
  const labelSt = { display: "block", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: bMID, marginBottom: 7 };
  const inputSt = { width: "100%", boxSizing: "border-box", border: "1.5px solid " + bLINE, borderRadius: 10, padding: "11px 13px", fontFamily: "var(--sans)", fontSize: 14, color: bINK, outline: "none", background: "var(--card)" };
  const field = (label, k, opts) => { opts = opts || {}; return (<div style={{ flex: opts.full ? "1 1 100%" : "1 1 calc(50% - 9px)", minWidth: 0 }}><label style={labelSt}>{label}</label><input type={opts.type || "text"} value={draft[k]} placeholder={opts.placeholder || ""} onChange={(ev) => setD(k, ev.target.value)} style={inputSt} /></div>); };
  const select = (label, k, options) => (<div style={{ flex: "1 1 calc(50% - 9px)", minWidth: 0 }}><label style={labelSt}>{label}</label><select value={draft[k]} onChange={(ev) => setD(k, ev.target.value)} style={{ ...inputSt, cursor: "pointer", appearance: "none", WebkitAppearance: "none", MozAppearance: "none", paddingRight: 40, background: "#fff url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23000F47' stroke-width='1.6' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\") no-repeat right 14px center" }}>{options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}</select></div>);
  const genderLabel = ({ Female: "Female", Male: "Male", Other: "Prefer not to say" })[data.gender] || "—";
  const rows = [["First Name", data.first || "—"], ["Last Name", data.last || "—"], ["Email", data.email || "—"], ["Age", data.age || "—"], ["Gender", genderLabel], ["Preferred Language", data.lang || "—"], ["Target Job", data.targetJob || "—"], ["Target Entity", data.targetEntity || "—"], ["Years of Experience", data.yearsExp || "—"], ["Minimum Education", data.minEdu || "—"], ["Preferred Education", data.prefEdu || "—"]];
  const avatarView = data.avatar ? <img src={data.avatar} alt="" style={{ width: 64, height: 64, borderRadius: 16, objectFit: "cover", display: "block", flexShrink: 0 }} /> : <div style={{ width: 64, height: 64, borderRadius: 16, background: "var(--sky-surface)", color: bMID, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--sans)", fontWeight: 700, fontSize: 22, flexShrink: 0 }}>{initials}</div>;
  return (
    <div style={{ maxWidth: "var(--content-max)", margin: "36px var(--fol-mx) 72px", padding: 0 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
        <div>
          <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, letterSpacing: 0.2, color: bBLUE, marginBottom: 12 }}>My profile</div>
          <h1 className="serif" style={{ fontSize: 40, color: bMID, lineHeight: 1.06, margin: 0 }}>My Profile</h1>
        </div>
        {!editing
          ? <button onClick={startEdit} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: bGOLD, color: "var(--action-text)", border: "none", borderRadius: 10, padding: "10px 18px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Edit profile</button>
          : <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setEditing(false)} style={{ background: "transparent", color: bMID, border: "1.5px solid " + bMID, borderRadius: 10, padding: "10px 18px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={save} style={{ background: bGOLD, color: "var(--action-text)", border: "none", borderRadius: 10, padding: "10px 18px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Save changes</button>
            </div>}
      </div>
      {editing ? (
        <div style={{ background: "var(--card)", border: "1px solid " + bLINE, borderRadius: 16, padding: 26 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{ display: "none" }} />
            {avatarView}
            <button onClick={() => fileRef.current && fileRef.current.click()} style={{ background: "transparent", color: bMID, border: "1.5px solid " + bLINE, borderRadius: 9, padding: "8px 14px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Upload photo</button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 18 }}>
            {field("First Name", "first")}
            {field("Last Name", "last")}
            {field("Email", "email", { full: true, type: "email" })}
            {field("Age", "age", { type: "number" })}
            {select("Gender", "gender", [{ v: "", l: "Select" }, { v: "Female", l: "Female" }, { v: "Male", l: "Male" }, { v: "Other", l: "Prefer not to say" }])}
            {select("Preferred Language", "lang", [{ v: "English", l: "English" }, { v: "Arabic", l: "العربية" }, { v: "French", l: "Français" }])}
            {field("Target Job", "targetJob", { full: true })}
            {field("Target Entity", "targetEntity", { full: true })}
            {field("Years of Experience", "yearsExp")}
            {field("Minimum Education", "minEdu")}
            {field("Preferred Education", "prefEdu", { full: true })}
          </div>
        </div>
      ) : (
        <div style={{ background: "var(--card)", border: "1px solid " + bLINE, borderRadius: 16, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "20px 22px", borderBottom: "1px solid " + bLINE }}>
            {avatarView}
            <div>
              <div className="serif" style={{ fontSize: 24, color: bMID, lineHeight: 1.1 }}>{data.first} {data.last}</div>
              <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: bMUT, marginTop: 3 }}>{data.email}</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            {rows.map((r, i) => (
              <div key={i} style={{ padding: "16px 22px", borderBottom: "1px solid " + bLINE, borderRight: i % 2 === 0 ? "1px solid " + bLINE : "none" }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: bMUT, marginBottom: 5 }}>{r[0]}</div>
                <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: bMID, fontWeight: 500 }}>{r[1]}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Top bar holds accessibility (text size), theme, language, and a profile button.
function BTopBar({ left, center, language, langMenu, setLangMenu, a11yOpen, setA11yOpen, fontScale, incFont, decFont, resetFont, theme, setTheme }) {
  const ctlBtn = (active) => ({ width: 40, height: 40, borderRadius: 10, border: "1px solid " + (active ? "var(--muted)" : "var(--line)"), background: active ? "color-mix(in srgb, var(--muted) 12%, transparent)" : "var(--card)", color: bMID, display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative", flexShrink: 0 });
  const stepBtn = { width: 52, height: 46, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--card)", border: "none", color: bMID, cursor: "pointer" };
  return (
    <header className="lh-topbar" style={{ position: "sticky", top: 0, zIndex: 10, height: 64, background: "var(--card)", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", padding: "0 28px", gap: 8, flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0, flex: 1 }}>{left}</div>
      {center && <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center" }}>{center}</div>}
      {/* Accessibility — text size */}
      <div style={{ position: "relative" }}>
        <button title="Accessibility — text size" onClick={() => setA11yOpen((v) => !v)} style={ctlBtn(a11yOpen)}>
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="7.2" r="1.3" fill="currentColor" stroke="none" /><path d="M5.5 9.5c2 1 4.2 1.4 6.5 1.4s4.5-.4 6.5-1.4" /><path d="M12 10.9V15" /><path d="M12 15l-2.3 4M12 15l2.3 4" /></svg>
        </button>
        {a11yOpen && (
          <div style={{ position: "absolute", top: "calc(100% + 10px)", right: 0, zIndex: 998, background: "var(--card)", border: "1px solid var(--line)", borderRadius: 14, boxShadow: "0 12px 38px rgba(0,15,71,.18)", padding: 10, fontFamily: "var(--sans)" }}>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 0.2, color: "var(--muted)", padding: "2px 4px 8px" }}>Text size</div>
            <div style={{ display: "flex", border: "1px solid var(--line)", borderRadius: 10, overflow: "hidden" }}>
              <button title="Decrease text size" onClick={decFont} style={{ ...stepBtn, borderRight: "1px solid var(--line)" }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14" /></svg></button>
              <button title="Reset to default (100%)" onClick={resetFont} style={{ minWidth: 64, height: 46, padding: "0 10px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--card)", border: "none", borderRight: "1px solid var(--line)", color: bMID, cursor: "pointer", fontVariantNumeric: "tabular-nums" }}><span style={{ fontSize: 14, fontWeight: 700 }}>{Math.round(fontScale * 100)}%</span></button>
              <button title="Increase text size" onClick={incFont} style={stepBtn}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg></button>
            </div>
            {fontScale !== 1 && (
              <button onClick={resetFont} style={{ marginTop: 8, width: "100%", height: 32, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
                Reset to default
              </button>
            )}
          </div>
        )}
      </div>
      {/* Theme toggle (light / dark) */}
      <button title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={ctlBtn(false)}>
        {theme === "dark" ? <I.moon size={19} /> : <I.sun size={19} />}
      </button>
      {/* Language */}
      <div style={{ position: "relative" }}>
        <button onClick={() => setLangMenu((v) => !v)} title="Switch language" style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 40, boxSizing: "border-box", background: "var(--card)", color: bMID, border: "1px solid var(--line)", borderRadius: 10, padding: "0 14px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          <span>{language === "en" ? "English" : "العربية"}</span>
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        {langMenu && (
          <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 998, width: 160, background: "var(--card)", border: "1px solid var(--line)", borderRadius: 12, boxShadow: "0 10px 34px rgba(0,15,71,.16)", padding: 7, fontFamily: "var(--sans)" }}>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 0.2, color: "var(--muted)", padding: "7px 9px 5px" }}>Language</div>
            {["en", "ar"].map((lang) => { const active = language === lang; return (
              <button key={lang} onClick={() => { window.LangSwitcher?.setLanguage(lang); setLangMenu(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 9px", borderRadius: 8, border: "none", background: active ? "color-mix(in srgb, var(--accent) 6%, transparent)" : "transparent", cursor: "pointer", textAlign: "left" }}>
                <span style={{ width: 16, display: "flex", justifyContent: "center", color: "var(--accent)" }}>{active ? <I.check size={15} /> : null}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: active ? bMID : "var(--ink)" }}>{lang === "en" ? "English" : "العربية"}</span>
              </button>); })}
          </div>
        )}
      </div>
    </header>
  );
}

// Live deadline countdown pill (sky-tinted to match Boardroom).
function BCountdown({ due }) {
  const [cd, setCd] = React.useState({ d: 0, h: 0, m: 0, s: 0 });
  React.useEffect(() => {
    const deadline = new Date(due + " 23:59:59");
    const tick = () => {
      const diff = Math.max(0, deadline - new Date());
      setCd({ d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [due]);
  const urgent = cd.d <= 14;
  const cdColor = urgent ? "var(--danger)" : bBLUE;
  const parts = [[cd.d, "d"], [cd.h, "h"], [cd.m, "m"], [cd.s, "s"]];
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "var(--sky-surface)", border: "1px solid var(--line)", borderRadius: 6, padding: "7px 15px" }}>
      <span style={{ color: bMID, display: "flex" }}><I.clock size={15} /></span>
      <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: bMID }}>Due {due}</span>
      <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: cdColor, fontVariantNumeric: "tabular-nums", letterSpacing: 0.2 }}>
        {parts.map(([v, l]) => `${String(v).padStart(2, "0")}${l}`).join(" : ")}
      </span>
    </div>
  );
}

function BProgramRow({ p, onOpen, onSystemCheck }) {
  const state = p.state || (p.pct >= 100 ? "complete" : p.pct > 0 ? "progress" : "notstarted");
  const tag = state === "complete"
    ? { label: "Completed", fg: "var(--success)", bg: "rgba(31,138,91,.10)" }
    : state === "notstarted"
      ? { label: "Not started", fg: bMUT, bg: "var(--status-neutral-bg)" }
      : { label: "In progress", fg: p.accent, bg: "color-mix(in srgb, " + p.accent + " 12%, var(--card))" };
  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 16, padding: 24, display: "flex", gap: 22, alignItems: "flex-start" }}>
      <div style={{ position: "relative", width: 76, height: 76, flexShrink: 0 }}>
        <RingB pct={p.pct} size={76} stroke={6} color={p.accent} track="rgba(0,15,71,.08)" />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          <span className="serif" style={{ fontSize: 21, color: bMID, lineHeight: 1 }}>{p.pct}%</span>
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
          <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, letterSpacing: ".02em", color: tag.fg, background: tag.bg, padding: "4px 10px", borderRadius: 6 }}>{tag.label}</span>
          <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: bMUT, display: "flex", alignItems: "center", gap: 5 }}><I.clock size={14} />{p.daysLeft} days left · due {p.due}</span>
        </div>
        <h3 className="serif" style={{ fontSize: 22, color: bMID, margin: "0 0 16px", lineHeight: 1.15 }}>{p.name}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <button onClick={() => onOpen(p.id)} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: bGOLD, color: "var(--action-text)", border: "none", borderRadius: 10, padding: "11px 18px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            Continue <I.arrow size={16} />
          </button>
          {p.id === "leadership" && (
            <button onClick={() => onSystemCheck && onSystemCheck(p.id)} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: "none", color: p.accent, border: "1.5px solid " + p.accent, borderRadius: 10, padding: "10px 16px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            System Check <I.arrow size={16} />
          </button>
          )}
        </div>
      </div>
    </div>
  );
}

function BSideCard({ children, pad = 20 }) {
  return <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 16, padding: pad }}>{children}</div>;
}

function BDashboardContent({ onOpen, onSystemCheck }) {
  return (
    <div className="lh-page" style={{ padding: "32px 40px 56px" }}>
      {/* Signature Sky-Blue hero with midnight inset */}
      <div className="lh-hero" style={{ display: "flex", gap: 0, borderRadius: 22, overflow: "hidden", marginBottom: 36 }}>
        <div style={{ flex: 1.6, background: "var(--sky-surface)", padding: "44px 48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: bBLUE, marginBottom: 14 }}>Your leadership journey</div>
          <h1 className="serif" style={{ fontSize: 48, color: bMID, lineHeight: 1.04, margin: "0 0 14px" }}>{LH.greeting} {LH.user.first}.</h1>
          <p style={{ fontSize: 16, color: bMID, lineHeight: 1.6, margin: 0, maxWidth: 440, opacity: .85 }}>{LH.intro}</p>
        </div>
        <div style={{ flex: 1, background: "var(--surface-deep)", padding: "44px 40px", color: "#fff", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: 14, color: bSKY, fontWeight: 600, marginBottom: 18 }}>Overall progress</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 22 }}>
            <span className="serif" style={{ fontSize: 76, color: "#fff", lineHeight: .9 }}>30</span>
            <span className="serif" style={{ fontSize: 40, color: bSKY }}>%</span>
          </div>
          <div style={{ display: "flex", gap: 28 }}>
            {[{ n: "3", l: "Done" }, { n: "5", l: "Active" }, { n: "2", l: "Reports" }].map((s, i) => (
              <div key={i}>
                <div className="serif" style={{ fontSize: 26, color: "#fff", lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,.82)", marginTop: 4 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main + right rail */}
      <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 28 }}>
        <div>
          <h2 className="serif" style={{ fontSize: 26, color: bMID, margin: "0 0 18px" }}>Your programs</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {LH.programs.map((p) => <BProgramRow key={p.id} p={p} onOpen={onOpen} onSystemCheck={onSystemCheck} />)}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Profile */}
          <BSideCard>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
              <div style={{ position: "relative", width: 50, height: 50 }}>
                <RingB pct={LH.profile.pct} size={50} stroke={4.5} color={bBLUE} track="rgba(0,15,71,.08)" />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: bMID }}>{LH.profile.pct}%</div>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: bMID }}>Complete your profile</div>
                <div style={{ fontSize: 14, color: bMUT, marginTop: 2 }}>{LH.profile.done} of {LH.profile.total} done</div>
              </div>
            </div>
            <button style={{ width: "100%", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: "transparent", color: bMID, border: "1.5px solid " + bMID, borderRadius: 10, padding: "10px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Continue setup <I.arrow size={16} /></button>
          </BSideCard>

          {/* Deadline */}
          <BSideCard>
            <div style={{ fontSize: 14, fontWeight: 600, color: bMUT, marginBottom: 12 }}>Upcoming deadline</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: "rgba(197,53,50,.10)", color: "var(--danger)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><I.clock size={22} /></div>
              <div>
                <div className="serif" style={{ fontSize: 19, color: bMID, lineHeight: 1.1 }}>{LH.deadline.daysLeft} days left</div>
                <div style={{ fontSize: 14, color: bMUT, marginTop: 2 }}>{LH.deadline.program} · {LH.deadline.due}</div>
              </div>
            </div>
          </BSideCard>

          {/* Reports */}
          <BSideCard>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: bMUT }}>Reports ready</span>
              <span onClick={() => onOpen("insights")} style={{ fontSize: 14, fontWeight: 600, color: bBLUE, cursor: "pointer" }}>View all</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {LH.reports.map((r, i) => (
                <div key={i} onClick={() => onOpen("insights")} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderTop: i ? "1px solid var(--line)" : "none", cursor: "pointer" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: "var(--sky-surface)", color: bMID, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><I.doc size={18} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: bMID, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</div>
                    <div style={{ fontSize: 14, color: bMUT }}>{r.program} · {r.pages} pages</div>
                  </div>
                  <span style={{ color: bMUT, display: "flex" }}><I.arrowUR size={16} /></span>
                </div>
              ))}
            </div>
          </BSideCard>
        </div>
      </div>
    </div>
  );
}

// ── Floating "Card design" hero-variant menu (parity with Direction A) ──
function BHeroMenu({ heroStyle, setHero }) {
  const [open, setOpen] = React.useState(false);
  const opts = [
    { id: "light", l: "Light card", d: "Clean white, airy" },
    { id: "compact", l: "Compact", d: "Title, badge & chips" },
    { id: "minimal", l: "Minimal", d: "No box, editorial rules" },
    { id: "ribbon", l: "Ribbon", d: "Slim band, gold ring & stats" },
  ];
  return (
    <div style={{ position: "fixed", right: 179, bottom: 14, zIndex: 60 }}>
      {open && (
        <div style={{ position: "absolute", bottom: 42, right: 0, width: 230, background: "var(--card)", border: "1px solid var(--line)", borderRadius: 12, boxShadow: "0 10px 34px rgba(0,15,71,.16)", padding: 7, fontFamily: "var(--sans)" }}>
          <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 0.2, color: "var(--muted)", padding: "7px 9px 5px" }}>Card design</div>
          {opts.map((o) => {
            const on = heroStyle === o.id;
            return (
              <button key={o.id} onClick={() => { setHero(o.id); setOpen(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 9px", borderRadius: 8, border: "none", background: on ? "color-mix(in srgb, var(--accent) 6%, transparent)" : "transparent", cursor: "pointer", textAlign: "left" }}>
                <span style={{ width: 16, display: "flex", justifyContent: "center", color: "var(--accent)" }}>{on ? <I.check size={15} /> : null}</span>
                <span style={{ flex: 1 }}>
                  <span style={{ display: "block", fontSize: 14, fontWeight: 600, color: on ? "var(--primary)" : "var(--ink)" }}>{o.l}</span>
                  <span style={{ display: "block", fontSize: 14, color: "var(--muted)" }}>{o.d}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}
      <button onClick={() => setOpen((v) => !v)} title="Switch card design"
        style={{ display: "inline-flex", alignItems: "center", gap: 6, background: open ? "#fff" : "rgba(255,255,255,.72)", color: open ? "var(--primary)" : "var(--muted)", border: "1px solid var(--line)", borderRadius: 8, padding: "6px 11px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 500, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,15,71,.06)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", opacity: open ? 1 : 0.62, transition: "opacity .15s, color .15s, background .15s" }}>
        <I.panel size={14} /> Card design
      </button>
    </div>
  );
}

// ── ROUTED SHELL ──────────────────────────────────
function DashBoardroom() {
  // re-render chrome (sidebar logo) when the client brand chip changes
  const [, setLHBrandTick] = React.useState(0);
  React.useEffect(() => { const f = () => setLHBrandTick((n) => n + 1); window.addEventListener("lh-brand-change", f); return () => window.removeEventListener("lh-brand-change", f); }, []);

  const [route, setRoute] = React.useState(() => (window.LHRoute && window.edPathToRoute ? edPathToRoute(LHRoute.get()) : { page: "dash", progId: null, center: null, target: null }));
  // Reflect each page in the URL hash (shareable, back/forward-capable). First render replaces,
  // later navigations push; pushState never re-fires our listener, so no loop.
  const brSynced = React.useRef(false);
  React.useEffect(() => {
    if (!window.LHRoute || !window.edRouteToPath) return;
    const path = edRouteToPath(route);
    if (!brSynced.current) { brSynced.current = true; LHRoute.replace(path); }
    else LHRoute.push(path);
  }, [route]);
  React.useEffect(() => { if (window.LHRoute && window.edPathToRoute) return LHRoute.onPop(() => setRoute((r) => { const nr = edPathToRoute(LHRoute.get()); nr.oaNav = (r.oaNav || 0) + 1; return nr; })); }, []);
  const [consent, setConsent] = React.useState({});
  const [watched, setWatched] = React.useState({});
  const [heroStyle, setHeroStyle] = React.useState(() => { try { return localStorage.getItem("br-hero-style") || "light"; } catch (e) { return "light"; } });
  const [collapsed, setCollapsed] = React.useState(() => { try { return localStorage.getItem("br-rail-collapsed") === "1"; } catch (e) { return false; } });
  const toggleRail = () => setCollapsed((v) => { const n = !v; try { localStorage.setItem("br-rail-collapsed", n ? "1" : "0"); } catch (e) {} return n; });
  const setHero = (v) => { setHeroStyle(v); try { localStorage.setItem("br-hero-style", v); } catch (e) {} };
  const mainRef = React.useRef(null);
  const contentZoomRef = React.useRef(null);

  // ── Top-bar controls (mirror Folio): language · theme · accessibility text-size ──
  const [language, setLanguage] = React.useState(() => window.LangSwitcher?.currentLang || "en");
  const [langMenu, setLangMenu] = React.useState(false);
  const [a11yOpen, setA11yOpen] = React.useState(false);
  const [fontScale, setFontScale] = React.useState(() => { try { return parseFloat(localStorage.getItem("lh-font-scale")) || 1; } catch (e) { return 1; } });
  const [theme, setThemeState] = React.useState(() => { try { return localStorage.getItem("lh-theme") === "dark" ? "dark" : "light"; } catch (e) { return "light"; } });
  React.useEffect(() => {
    if (contentZoomRef.current) contentZoomRef.current.style.zoom = String(fontScale);
    try { localStorage.setItem("lh-font-scale", String(fontScale)); } catch (e) {}
  }, [fontScale]);
  const incFont = () => setFontScale((s) => Math.min(+(s + 0.1).toFixed(2), 1.5));
  const decFont = () => setFontScale((s) => Math.max(+(s - 0.1).toFixed(2), 0.8));
  const resetFont = () => setFontScale(1);
  const setTheme = (m) => { setThemeState(m); document.documentElement.setAttribute("data-theme", m); try { localStorage.setItem("lh-theme", m); } catch (e) {} window.dispatchEvent(new CustomEvent("lh-theme-change", { detail: m })); };
  React.useEffect(() => { document.documentElement.setAttribute("data-theme", theme); }, []);
  React.useEffect(() => {
    const h = () => setLanguage(window.LangSwitcher?.currentLang || "en");
    window.LangSwitcher?.subscribe?.((lang) => setLanguage(lang));
    window.addEventListener("lh-language-updated", h);
    window.addEventListener("lh-language-change", h);
    return () => { window.removeEventListener("lh-language-updated", h); window.removeEventListener("lh-language-change", h); };
  }, []);

  React.useEffect(() => { if (mainRef.current) mainRef.current.scrollTop = 0; }, [route.page, route.progId, route.center, route.target]);

  const prog = route.progId ? LH.programs.find((p) => p.id === route.progId) : null;

  const openProgram = (id) => {
    if (id === "dash") { setRoute({ page: "dash", progId: null, center: null, target: null }); return; }
    if (id === "bookings") return;   // Bookings is switched off for now
    if (id === "development" || id === "scheduling" || id === "insights" || id === "profile" || id === "changePassword") {
      setRoute({ page: id, progId: null, center: null, target: null }); return;
    }
    const isProg = LH.programs.some((p) => p.id === id);
    if (!isProg) { setRoute({ page: "dash", progId: null, center: null, target: null }); return; }
    setRoute({ page: consent[id] ? "tasks" : "instructions", progId: id, center: null, target: null });
  };

  const D = window.EdDetail || {};
  const G = window.EdGrowth || {};
  const A = window.EdAssess || {};
  const Bk = window.EdBookings;
  const toDash = () => setRoute({ page: "dash", progId: null, center: null, target: null });
  const toTasks = () => setRoute((r) => ({ ...r, page: "tasks", center: null, target: null }));
  const openSystemCheck = (id) => {
    const p = LH.programs.find((x) => x.id === id);
    const d = p && p.detail;
    const target = d && ([...(d.sequential || []), ...(d.open || []), ...(d.centers || [])].find((e) => e.proctored));
    if (!target) { openProgram(id); return; }
    setRoute({ page: "precheck", progId: id, center: null, target });
  };

  let content;
  if (route.page === "development") {
    content = <G.EdDevelopment onBack={toDash} />;
  } else if (route.page === "scheduling") {
    content = <G.EdScheduling onBack={toDash} />;
  } else if (route.page === "insights") {
    content = <G.EdInsights onBack={toDash} />;
  } else if (route.page === "bookings") {
    content = null;   // Bookings hidden
  } else if (route.page === "profile") {
    content = <BProfile onBack={toDash} />;
  } else if (route.page === "changePassword") {
    content = <BChangePassword onBack={() => setRoute({ page: "profile", progId: null, center: null, target: null })} />;
  } else if (route.page === "dash" || !prog) {
    content = <BDashboardContent onOpen={openProgram} onSystemCheck={openSystemCheck} />;
  } else if (route.page === "instructions") {
    content = <D.EdInstructions prog={prog}
      watched={!!watched[prog.id]}
      acked={!!consent[prog.id]}
      onWatch={() => setWatched((w) => ({ ...w, [prog.id]: true }))}
      onContinue={() => { setConsent((c) => ({ ...c, [prog.id]: true })); toTasks(); }}
      onBack={toDash} />;
  } else if (route.page === "tasks") {
    content = <D.EdTasks prog={prog}
      onBack={toDash}
      onOpenCenter={(c) => setRoute((r) => ({ ...r, page: "center", center: c }))}
      onProctored={(target) => setRoute((r) => ({ ...r, page: "precheck", target }))}
      onOpenAssess={(ex) => setRoute((r) => ({ ...r, page: "assessintro", target: ex }))}
      heroStyle={heroStyle} />;
  } else if (route.page === "center") {
    content = <D.EdCenter center={route.center}
      onBack={toTasks}
      onProctored={(target) => setRoute((r) => ({ ...r, page: "precheck", target }))} />;
  } else if (route.page === "precheck") {
    content = <D.EdPreCheck target={route.target}
      onBack={() => setRoute((r) => ({ ...r, page: route.center ? "center" : "tasks", target: null }))}
      onLaunch={toTasks} />;
  } else if (route.page === "assessintro") {
    content = <A.EdAssessIntro exercise={route.target} onExit={toTasks} onBegin={() => setRoute((r) => ({ ...r, page: "openassess" }))} />;
  } else if (route.page === "openassess") {
    const _pool = (prog && prog.detail) ? [...prog.detail.sequential, ...prog.detail.open].filter((e) => !e.proctored) : [];
    const _idx = route.target ? _pool.findIndex((e) => e.id === route.target.id) : -1;
    const _next = _idx >= 0 ? _pool[_idx + 1] : null;
    content = <A.EdOpenAssess key={"oa-" + (route.oaNav || 0)} exercise={route.target} onExit={toTasks}
      initialStep={route.oaStep} initialLayout={route.oaLayout} initialQIdx={route.oaQIdx}
      onPos={(pos) => setRoute((r) => (r.page === "openassess" && r.oaStep === pos.step && r.oaQIdx === pos.qIdx && r.oaPage === pos.page && r.oaLayout === pos.layout ? r : { ...r, oaStep: pos.step, oaQIdx: pos.qIdx, oaPage: pos.page, oaLayout: pos.layout }))}
      onBack={() => setRoute((r) => ({ ...r, page: "assessintro" }))}
      hasNext={!!_next} nextEx={_next}
      onNext={() => _next ? setRoute((r) => ({ ...r, page: "assessintro", target: _next })) : toTasks()} />;
  }

  const activeId = ["development", "scheduling", "insights", "bookings", "profile", "changePassword"].includes(route.page) ? route.page : route.page === "dash" ? "dash" : route.progId;
  const immersive = route.page === "openassess";
  const isDash = route.page === "dash" || !prog && !["development", "scheduling", "insights", "profile", "changePassword"].includes(route.page);
  // Header back button in the utility bar — mirrors Folio (inline .ed-pageback buttons are hidden in Boardroom.html)
  const isMainPage = ["development", "scheduling", "insights", "profile", "changePassword"].includes(route.page);
  const headerBack = () => {
    if (route.page === "center") toTasks();
    else if (route.page === "precheck") setRoute((r) => ({ ...r, page: route.center ? "center" : "tasks", target: null }));
    else if (route.page === "assessintro") toTasks();
    else toDash();
  };
  const headerBackLabel = route.page === "assessintro" ? "Back to program"
    : route.page === "center" ? "Back to tasks"
    : ["development", "scheduling", "insights", "bookings", "profile", "changePassword", "tasks", "instructions"].includes(route.page) ? "Back to dashboard"
    : "Back";
  const [pageBack, setPageBack] = React.useState(null);
  const topBarCtx = React.useMemo(() => ({ setBack: setPageBack }), []);
  const renderBdBack = (label, onClick) => (
    <button onClick={onClick} className="bd-topbar-back" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "none", border: "none", padding: 0, color: "var(--primary)", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: document.documentElement.dir === "rtl" ? "scaleX(-1)" : "none" }}><path d="M15 18l-6-6 6-6" /></svg>
      {label}
    </button>
  );
  const bdRouteBack = (!isDash && !isMainPage) ? renderBdBack(headerBackLabel, headerBack) : null;
  const bdTopBack = pageBack ? renderBdBack(pageBack.label, pageBack.onClick) : bdRouteBack;
  const bdTopCenter = (!isDash && prog && route.page !== "instructions") ? <BCountdown due={prog.due} /> : null;

  return (
    <React.Fragment>
      <div className="bd-shell" style={{ width: "100%", height: "100vh", overflow: "hidden", background: bCREAM, display: "flex", fontFamily: "var(--sans)" }}>
        {!immersive && <BRail activeId={activeId} onNav={openProgram} collapsed={collapsed} onToggle={toggleRail} theme={theme} />}
        <div ref={mainRef} style={{ flex: 1, minWidth: 0, height: "100vh", overflowY: "auto", display: "flex", flexDirection: "column" }}>
          {immersive ? content : (
            <React.Fragment>
              <BTopBar left={bdTopBack} center={bdTopCenter} language={language} langMenu={langMenu} setLangMenu={setLangMenu} a11yOpen={a11yOpen} setA11yOpen={setA11yOpen} fontScale={fontScale} incFont={incFont} decFont={decFont} resetFont={resetFont} theme={theme} setTheme={setTheme} />
              <div ref={contentZoomRef} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <LHTopBarContext.Provider value={topBarCtx}>
              {isDash ? content : (
                <div className="lh-page" style={{ padding: "0 var(--fol-px, 56px)" }}>{content}<D.LHFooter /></div>
              )}
              </LHTopBarContext.Provider>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
      {route.page === "tasks" && <BHeroMenu heroStyle={heroStyle} setHero={setHero} />}
      {!immersive && !isDash && <D.LHAssistant />}
    </React.Fragment>
  );
}

window.DashBoardroom = DashBoardroom;
