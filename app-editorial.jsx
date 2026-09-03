// ════════════════════════════════════════════════
//  DIRECTION A — "Editorial"
//  Branded Midnight Blue left rail · big Marsh Serif display ·
//  spacious single column on warm cream · gold action accent.
// ════════════════════════════════════════════════

const MID = "var(--primary)", SKY = "#CEECFF", GOLD = "var(--action)", INK = "var(--ink)",
      MUT = "var(--muted)", CREAM = "var(--canvas)", BLUE = "var(--accent)", PURP = "#8F20DE";

function Ring({ pct, size = 48, stroke = 4, color = BLUE, track = "rgba(255,255,255,.25)" }) {
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

function EdRail({ activeId, onNav, collapsed, onToggle, items, showAccount = true, showProgress = true, user }) {
  const W = collapsed ? 74 : 256;
  const [theme, setThemeState] = React.useState(() => { try { return localStorage.getItem("lh-theme") === "dark" ? "dark" : "light"; } catch (e) { return "light"; } });
  React.useEffect(() => {
    const h = (e) => setThemeState(e.detail === "dark" ? "dark" : "light");
    window.addEventListener("lh-theme-change", h);
    return () => window.removeEventListener("lh-theme-change", h);
  }, []);
  const setTheme = (m) => {
    setThemeState(m);
    document.documentElement.setAttribute("data-theme", m);
    try { localStorage.setItem("lh-theme", m); } catch (e) {}
    window.dispatchEvent(new CustomEvent("lh-theme-change", { detail: m }));
  };
  const Item = ({ item, active }) => {
    const Ic = I[item.icon] || I.home;
    const t = (key) => window.LangSwitcher?.get(key) || key;
    const getLabel = () => {
      const labelMap = {
        "Dashboard": "dashboard",
        "Development": "development",
        "Scheduling": "scheduling",
        "Insights": "insights",
        "Leadership 2026": "leadershipAssessment2026",
        "360° Perspective": "perspective360Feedback"
      };
      return t(labelMap[item.label] || item.label);
    };
    return (
    <div onClick={() => onNav(item.id)}
      role="button" tabIndex={0} aria-current={active ? "page" : undefined}
      aria-label={collapsed ? getLabel() : undefined}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onNav(item.id); } }}
      title={collapsed ? getLabel() : undefined} style={{
      display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", gap: 12,
      padding: collapsed ? "11px 0" : "10px 14px", borderRadius: 9,
      background: active ? "var(--rail-active-bg)" : "transparent",
      color: active ? "var(--rail-active-fg)" : "var(--rail-fg)", cursor: "pointer",
      fontFamily: "var(--sans)", fontSize: 14, fontWeight: active ? 600 : 400, position: "relative",
    }}>
      {active && !collapsed && <div style={{ position: "absolute", left: 0, top: 9, bottom: 9, width: 3, borderRadius: 3, background: SKY }} />}
      <span style={{ color: active ? "var(--rail-active-icon)" : "var(--rail-icon)", display: "flex" }}><Ic size={19} /></span>
      {!collapsed && getLabel()}
    </div>
  );};
  // Second-level rail entry. Only rendered for items that declare `children`
  // (Folio's nav has none, so its rail is unchanged).
  const SubItem = ({ item, active }) => (
    <div onClick={() => onNav(item.id)}
      role="button" tabIndex={0} aria-current={active ? "page" : undefined}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onNav(item.id); } }}
      style={{
        display: "flex", alignItems: "center", gap: 10, padding: "8px 14px 8px 45px", borderRadius: 9,
        background: active ? "var(--rail-active-bg)" : "transparent",
        color: active ? "var(--rail-active-fg)" : "var(--rail-fg)", cursor: "pointer",
        fontFamily: "var(--sans)", fontSize: 13.5, fontWeight: active ? 600 : 400, position: "relative",
      }}>
      <span style={{ position: "absolute", left: 27, width: 5, height: 5, borderRadius: 5, background: active ? SKY : "var(--rail-icon)", opacity: active ? 1 : .55 }} />
      {item.label}
    </div>
  );
  const Logo = ({ icon }) => {
    const cb = (typeof window !== "undefined" && window.LHBrand && window.LHBrand.current() !== "marsh") ? window.LHBrand.get() : null;
    if (cb) {
      // For DGE, when collapsed, show only the white outline icon (never the dark variant)
      const isDgeCollapsed = cb.label === "DGE" && icon;
      const h = icon ? cb.railIconH : cb.railLogoH;
      const st = (disp) => ({ height: h, width: "auto", maxWidth: icon ? 56 : 168, objectFit: "contain", display: disp, marginRight: icon ? 0 : "auto" });
      return (
        <React.Fragment>
          <img src={icon ? cb.iconWhite : cb.logoWhite} alt={cb.label} style={st("var(--rail-logo-white, block)")} />
          {!isDgeCollapsed && <img src={icon ? cb.icon : cb.logo} alt={cb.label} style={st("var(--rail-logo-dark, none)")} />}
        </React.Fragment>
      );
    }
    return (
    <React.Fragment>
      <img src={icon ? window.LHLogo.iconWhite : window.LHLogo.wordmarkWhite} alt="Marsh" style={{ height: icon ? 28 : 24, display: "var(--rail-logo-white, block)", marginRight: icon ? 0 : "auto" }} />
      <img src={icon ? window.LHLogo.iconDark : window.LHLogo.wordmarkDark} alt="Marsh" style={{ height: icon ? 28 : 24, display: "var(--rail-logo-dark, none)", marginRight: icon ? 0 : "auto" }} />
    </React.Fragment>
  );};
  return (
    <aside className="ed-rail" style={{ width: W, minWidth: W, maxWidth: W, flexShrink: 0, height: "100%", overflowY: "auto", overflowX: "hidden", background: "var(--rail-bg)", display: "flex", flexDirection: "column", color: "var(--rail-active-fg)", transition: "width .2s ease, min-width .2s ease, max-width .2s ease", borderRight: "1px solid var(--rail-border)" }}>
      <div style={{ padding: collapsed ? "20px 0 16px" : "24px 18px 18px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Logo icon={collapsed} />
      </div>
      <nav style={{ flex: 1, padding: collapsed ? "4px 10px" : "4px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Bookings is hidden for now — the tab and its page are switched off. */}
        {(items || LH.nav).filter((it) => it.id !== "leadership" && it.id !== "360" && it.id !== "bookings").map((it) => {
          const kids = it.children || [];
          const inSection = kids.some((c) => c.id === activeId);
          return (
          <React.Fragment key={it.id}>
            {it.group && it.group !== "Growth" && !collapsed && <div style={{ padding: "16px 14px 6px", fontSize: 14, fontFamily: "var(--sans)", color: "var(--rail-group)", fontWeight: 600 }}>{it.group}</div>}
            {it.group && it.group !== "Growth" && collapsed && <div style={{ height: 1, background: "var(--rail-border)", margin: "12px 8px 8px" }} />}
            <Item item={it} active={it.id === activeId || inSection} />
            {/* sub-items belong to their section — they appear only while you're in it */}
            {kids.length > 0 && !collapsed && (inSection || it.id === activeId) && (
              <div style={{ display: "flex", flexDirection: "column", gap: 2, margin: "2px 0 6px" }}>
                {kids.map((c) => <SubItem key={c.id} item={c} active={c.id === activeId} />)}
              </div>
            )}
          </React.Fragment>
        );})}
        {showAccount && <Item item={{ id: "profile", label: t("myProfile"), icon: "user" }} active={activeId === "profile"} />}
        {showAccount && <Item item={{ id: "changePassword", label: "Change password", icon: "lock" }} active={activeId === "changePassword"} />}
      </nav>
      <div style={{ padding: collapsed ? "10px 8px 16px" : "10px 12px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
        {collapsed ? (
          <React.Fragment>
            {showProgress && <button onClick={() => onNav("profile")} title={t("profileCompletion") + " — " + LH.profile.pct + "%"} style={{ width: "100%", border: "none", background: "transparent", padding: 0, cursor: "pointer", display: "flex", justifyContent: "center", marginBottom: 4 }}>
              <div style={{ position: "relative", width: 40, height: 40, flexShrink: 0 }}>
                <Ring pct={LH.profile.pct} size={40} stroke={3} color="var(--rail-active-icon)" />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "var(--rail-fg)" }}>{LH.profile.pct}%</div>
              </div>
            </button>}
            <EdUserMenuCollapsed onNav={onNav} user={user} />
          </React.Fragment>
        ) : (
          <React.Fragment>
            {showProgress && <div style={{ borderTop: "1px solid var(--rail-border)", paddingTop: 12, marginBottom: 8 }}>
              <div style={{ fontSize: 14, fontFamily: "var(--sans)", color: "var(--rail-group)", fontWeight: 600, padding: "0 2px 12px" }}>{t("profileCompletion")}</div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "16px 12px", background: "var(--rail-active-bg)", borderRadius: 10 }}>
                <div style={{ position: "relative", width: 60, height: 60, flexShrink: 0 }}>
                  <Ring pct={LH.profile.pct} size={60} stroke={4} color="var(--rail-active-icon)" />
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "var(--rail-active-fg)" }}>{LH.profile.pct}%</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--rail-active-fg)" }}>{LH.profile.done} {t("of")} {LH.profile.total}</div>
                  <div style={{ fontSize: 14, color: "var(--rail-active-fg)", opacity: 0.9 }}>{t("sectionsCompleted")}</div>
                </div>
                <button onClick={() => onNav("profile")} style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,.95)", color: "#0B1220", border: "none", borderRadius: 8, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "background .15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#E9EDF4"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,.95)"; }}>
                  {t("completeProfile")}
                </button>
              </div>
            </div>}
            <EdUserMenuExpanded onNav={onNav} user={user} />
          </React.Fragment>
        )}
      </div>
    </aside>
  );
}

function EdUserMenuCollapsed({ onNav, user }) {
  const U = user || LH.user;
  const [open, setOpen] = React.useState(false);
  const [pos, setPos] = React.useState(null);
  const btnRef = React.useRef(null);
  const items = [
    { ic: "logout", l: "Log out", act: () => { window.location.href = "Login.html"; } },
  ];
  const toggle = () => {
    setOpen((v) => {
      const n = !v;
      if (n && btnRef.current) {
        const r = btnRef.current.getBoundingClientRect();
        const rtl = document.documentElement.dir === "rtl";
        // On iPad the framed #root carries a transform, so it (not the viewport)
        // is the containing block for this position:fixed menu — offset the
        // coordinates into #root's space so the menu stays beside its button.
        const host = document.documentElement.getAttribute("data-device") === "ipad"
          ? document.getElementById("root") : null;
        const hb = host ? host.getBoundingClientRect()
          : { left: 0, right: window.innerWidth, bottom: window.innerHeight };
        const bottom = hb.bottom - r.bottom;
        setPos(rtl
          ? { bottom, right: hb.right - r.left + 10 }
          : { bottom, left: r.right - hb.left + 10 });
      }
      return n;
    });
  };
  return (
    <div style={{ position: "relative" }}>
      <button ref={btnRef} onClick={toggle} title={`${U.first} ${U.last}`} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "1px solid var(--rail-border)", borderRadius: 10, padding: "8px", cursor: "pointer", color: "var(--rail-icon)" }}>
        <span style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--rail-active-bg)", color: "var(--rail-active-fg)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--sans)", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{U.initials}</span>
      </button>
      {open && pos && (
        <React.Fragment>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 1000 }} />
          <div style={{ position: "fixed", bottom: pos.bottom, left: pos.left, right: pos.right, width: 224, background: "var(--card)", border: "1px solid var(--line)", borderRadius: 12, boxShadow: "0 14px 40px rgba(0,15,71,.18)", zIndex: 1001, overflow: "hidden", fontFamily: "var(--sans)" }}>
            <div style={{ padding: "13px 15px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 11 }}>
              <span style={{ width: 38, height: 38, borderRadius: "50%", background: MID, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{U.initials}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: MID }}>{U.first} {U.last}</div>
              </div>
            </div>
            {items.map((m, i) => { const Ic = I[m.ic]; const danger = m.l === "Log out"; return (
              <button key={i} onClick={() => { m.act(); setOpen(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 11, padding: "11px 15px", background: "none", border: "none", borderTop: i === items.length - 1 ? "1px solid var(--line)" : "none", cursor: "pointer", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 500, color: danger ? "var(--danger)" : "var(--ink)", textAlign: "left" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,15,71,.03)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}>
                <Ic size={16} style={{ color: danger ? "var(--danger)" : MUT }} /> {m.l}
              </button>
            ); })}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

function EdUserMenuExpanded({ onNav, user }) {
  const U = user || LH.user;
  const email = (U.first + "." + U.last + "@marsh.com").toLowerCase().replace(/\s+/g, "");
  const _cb = (typeof window !== "undefined" && window.LHBrand && window.LHBrand.current() !== "marsh") ? window.LHBrand.current() : null;
  const logoutColor = (_cb === "dge" || _cb === "generali") ? "#fff" : "var(--danger)";
  return (
    <div style={{ marginTop: 4 }}>
      {/* User identity — no inline logout icon anymore */}
      <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "8px 4px 12px 8px" }}>
        <span style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--rail-active-bg)", color: "var(--rail-active-fg)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--sans)", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{U.initials}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--rail-active-fg)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{U.first} {U.last}</div>
          <div style={{ fontSize: 14, color: "var(--rail-fg)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: 1 }}>{email}</div>
        </div>
      </div>
      {/* Full-width Logout button at the bottom of the rail */}
      <button onClick={() => { window.location.href = "Login.html"; }} title="Log out" aria-label="Log out"
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "transparent", border: "1px solid color-mix(in srgb, var(--rail-active-fg) 28%, transparent)", borderRadius: 10, padding: "11px 16px", cursor: "pointer", color: "var(--rail-active-fg)", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, transition: "background .15s, border-color .15s" }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--rail-active-bg)"; e.currentTarget.style.borderColor = "color-mix(in srgb, var(--rail-active-fg) 45%, transparent)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "color-mix(in srgb, var(--rail-active-fg) 28%, transparent)"; }}>
        Logout <I.logout size={16} />
      </button>
    </div>
  );
}

function EdUserMenu({ onNav }) {
  const [open, setOpen] = React.useState(false);
  const items = [
    { ic: "user", l: t("myProfile"), act: () => onNav("profile") },
    { ic: "gear", l: "Settings", act: () => onNav("settings") },
    { ic: "logout", l: "Log out", act: () => { window.location.href = "Login.html"; } },
  ];
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen((v) => !v)} title={`${U.first} ${U.last}`} style={{ display: "flex", alignItems: "center", gap: 7, background: "var(--card)", border: "1px solid var(--line)", borderRadius: 10, padding: "4px 9px 4px 4px", cursor: "pointer" }}>
        <span style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--sky-surface)", color: MID, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--sans)", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{U.initials}</span>
        <I.chevD size={15} style={{ color: MUT, transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
      </button>
      {open && (
        <React.Fragment>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
          <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: 224, background: "var(--card)", border: "1px solid var(--line)", borderRadius: 12, boxShadow: "0 14px 40px rgba(0,15,71,.18)", zIndex: 41, overflow: "hidden", fontFamily: "var(--sans)" }}>
            <div style={{ padding: "13px 15px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 11 }}>
              <span style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--sky-surface)", color: MID, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{U.initials}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: MID }}>{U.first} {U.last}</div>
                <div style={{ fontSize: 14, color: MUT }}>{U.role}</div>
              </div>
            </div>
            {items.map((m, i) => { const Ic = I[m.ic]; const danger = m.l === "Log out"; return (
              <button key={i} onClick={() => { m.act(); setOpen(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 11, padding: "11px 15px", background: "none", border: "none", borderTop: i === items.length - 1 ? "1px solid var(--line)" : "none", cursor: "pointer", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 500, color: danger ? "var(--danger)" : "var(--ink)", textAlign: "left" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,15,71,.03)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}>
                <Ic size={16} style={{ color: danger ? "var(--danger)" : MUT }} /> {m.l}
              </button>
            ); })}
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

function EdSettings({ onBack }) {
  const [s, setS] = React.useState({ remind: true, digest: true, updates: false, twofa: false, visible: true, lang: "English (US)", tz: "GST (UTC+4)" });
  const set = (k, v) => setS((p) => ({ ...p, [k]: v }));
  const sw = (on, onClick) => (
    <button onClick={onClick} style={{ width: 42, height: 24, borderRadius: 999, border: "none", background: on ? "var(--accent)" : "rgba(0,15,71,.18)", position: "relative", cursor: "pointer", flexShrink: 0, transition: "background .15s" }}>
      <span style={{ position: "absolute", top: 3, left: on ? 21 : 3, width: 18, height: 18, borderRadius: "50%", background: "var(--card)", transition: "left .15s", boxShadow: "0 1px 3px rgba(0,0,0,.25)" }} />
    </button>
  );
  const select = (val, opts, onChange) => (
    <select value={val} onChange={(e) => onChange(e.target.value)} style={{ border: "1.5px solid var(--line)", borderRadius: 9, padding: "8px 38px 8px 12px", fontFamily: "var(--sans)", fontSize: 14, color: "var(--ink)", cursor: "pointer", outline: "none", appearance: "none", WebkitAppearance: "none", MozAppearance: "none", background: "var(--card) url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%238A94A6' stroke-width='1.6' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\") no-repeat right 14px center" }}>
      {opts.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
  const row = (title, desc, control, last) => (
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "15px 0", borderBottom: last ? "none" : "1px solid var(--line)" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: MID }}>{title}</div>
        {desc && <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: MUT, marginTop: 2 }}>{desc}</div>}
      </div>
      {control}
    </div>
  );
  const card = (label, children) => (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: "var(--accent)", marginBottom: 10 }}>{label}</div>
      <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 16, padding: "4px 22px" }}>{children}</div>
    </div>
  );
  const ghostBtn = { background: "transparent", color: MID, border: "1.5px solid " + MID, borderRadius: 10, padding: "9px 15px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer", flexShrink: 0 };
  return (
    <div style={{ maxWidth: "var(--content-max)", margin: "36px var(--fol-mx) 72px", padding: 0 }}>
      <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, letterSpacing: 0.2, color: "var(--accent)", marginBottom: 12 }}>Settings</div>
      <h1 className="serif" style={{ fontSize: 40, color: MID, lineHeight: 1.06, margin: "0 0 28px" }}>Settings</h1>
      {card("Notifications", <React.Fragment>
        {row("Assessment reminders", "Email me before upcoming deadlines.", sw(s.remind, () => set("remind", !s.remind)))}
        {row("Weekly digest", "A summary of your progress every Monday.", sw(s.digest, () => set("digest", !s.digest)))}
        {row("Product updates", "News about new features.", sw(s.updates, () => set("updates", !s.updates)), true)}
      </React.Fragment>)}
      {card("Preferences", <React.Fragment>
        {row("Language", "Interface display language.", select(s.lang, ["English (US)", "English (UK)", "Arabic", "French"], (v) => set("lang", v)))}
        {row("Time zone", "Used for scheduling and reminders.", select(s.tz, ["GST (UTC+4)", "GMT (UTC+0)", "EST (UTC-5)", "PST (UTC-8)"], (v) => set("tz", v)), true)}
      </React.Fragment>)}
      {card("Privacy & security", <React.Fragment>
        {row("Two-factor authentication", "Add an extra layer of security at sign-in.", sw(s.twofa, () => set("twofa", !s.twofa)))}
        {row("Profile visibility", "Allow assessors to view your profile details.", sw(s.visible, () => set("visible", !s.visible)))}
        {row("Password", "Last changed 3 months ago.", <button style={ghostBtn}>Change</button>, true)}
      </React.Fragment>)}
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: "var(--danger)", marginBottom: 10 }}>Danger zone</div>
        <div style={{ background: "var(--card)", border: "1px solid rgba(197,53,50,.28)", borderRadius: 16, padding: "16px 22px", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: MID }}>Delete account</div>
            <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: MUT, marginTop: 2 }}>Permanently remove your account and all associated data.</div>
          </div>
          <button style={{ background: "transparent", color: "var(--danger)", border: "1.5px solid var(--danger)", borderRadius: 10, padding: "9px 15px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function EdProfile({ onBack, onNav }) {
  const u = LH.user;
  const initial = {
    first: u.first, last: u.last,
    email: (u.first + "." + u.last + "@marsh.com").toLowerCase().replace(/\s+/g, ""),
    age: "", gender: "", lang: "English", timezone: "(GMT+04:00) Gulf Standard Time — Dubai",
    targetJob: "", targetEntity: "", yearsExp: "",
    minEdu: "", prefEdu: "", avatar: null
  };
  const [data, setData] = React.useState(initial);
  // which section is being edited in place: 'personal' | 'time' | 'other' | null
  const [section, setSection] = React.useState(null);
  const [draft, setDraft] = React.useState(initial);
  // which section just saved (shows a transient "Saved" badge in that card's header)
  const [savedSection, setSavedSection] = React.useState(null);
  const fileRef = React.useRef(null);
  const setD = (k, v) => setDraft((d) => ({ ...d, [k]: v }));
  const onFile = (ev) => { const file = ev.target.files && ev.target.files[0]; if (!file) return; const r = new FileReader(); r.onload = () => setD("avatar", r.result); r.readAsDataURL(file); };
  const startEdit = (s) => { setDraft(data); setSection(s); setSavedSection(null); };
  const cancel = () => setSection(null);
  const save = (s) => { setData(draft); setSection(null); setSavedSection(s); };
  const initials = ((data.first[0] || "") + (data.last[0] || "")).toUpperCase();

  const labelSt = { display: "block", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: MID, marginBottom: 7 };
  const inputSt = { width: "100%", boxSizing: "border-box", border: "1.5px solid var(--line)", borderRadius: 10, padding: "11px 13px", fontFamily: "var(--sans)", fontSize: 14, color: "var(--ink)", outline: "none", background: "var(--card)" };
  const reqMark = <span style={{ color: "var(--danger)" }}>* </span>;
  const field = (label, k, opts) => {
    opts = opts || {};
    return (
      <div style={{ flex: opts.full ? "1 1 100%" : "1 1 calc(50% - 9px)", minWidth: 0 }}>
        <label style={labelSt}>{opts.required ? reqMark : null}{label}</label>
        <input type={opts.type || "text"} value={draft[k]} placeholder={opts.placeholder || ""} onChange={(ev) => setD(k, ev.target.value)} style={inputSt} />
      </div>
    );
  };
  const select = (label, k, options, opts) => {
    opts = opts || {};
    return (
      <div style={{ flex: opts.full ? "1 1 100%" : "1 1 calc(50% - 9px)", minWidth: 0 }}>
        <label style={labelSt}>{opts.required ? reqMark : null}{label}</label>
        <select value={draft[k]} onChange={(ev) => setD(k, ev.target.value)} style={{ ...inputSt, cursor: "pointer", appearance: "none", WebkitAppearance: "none", MozAppearance: "none", paddingRight: 40, background: "var(--card) url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%238A94A6' stroke-width='1.6' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\") no-repeat right 14px center" }}>
          {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
        </select>
      </div>
    );
  };

  const genderLabel = ({ Female: "Female", Male: "Male", Other: "Prefer not to say" })[data.gender] || "—";
  const generalRows = [
    { label: "First Name", value: data.first || "—" },
    { label: "Last Name", value: data.last || "—" },
    { label: "Email", value: data.email || "—" },
    { label: "Age", value: data.age || "—" },
    { label: "Gender", value: genderLabel },
    { label: "Preferred Language", value: data.lang || "—" }
  ];
  const timezoneRows = [
    { label: "Time Zone", value: data.timezone || "—" }
  ];
  const otherRows = [
    { label: "Target Job", value: data.targetJob || "—" },
    { label: "Target Entity", value: data.targetEntity || "—" },
    { label: "Years of Experience Required for Target Job", value: data.yearsExp || "—" },
    { label: "Minimum Educational Qualification Required for Target Job", value: data.minEdu || "—" },
    { label: "Preferred Educational Qualification Required for Target Job", value: data.prefEdu || "—" }
  ];
  const TZ = [
    "(GMT-08:00) Pacific Time", "(GMT-05:00) Eastern Time", "(GMT+00:00) GMT — London",
    "(GMT+01:00) Central European Time", "(GMT+03:00) Arabia Standard Time — Riyadh",
    "(GMT+04:00) Gulf Standard Time — Dubai", "(GMT+05:30) India Standard Time", "(GMT+08:00) China Standard Time", "(GMT+09:00) Japan Standard Time"
  ];
  const avatarView = data.avatar
    ? <img src={data.avatar} alt="" style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", display: "block", flexShrink: 0 }} />
    : <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--sky-surface)", color: MID, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--sans)", fontWeight: 700, fontSize: 22, flexShrink: 0 }}>{initials}</div>;

  // ── shared card chrome: each section is its own card with an inline edit toggle ──
  const cardSt = { background: "var(--card)", border: "1px solid var(--line)", borderRadius: 16, overflow: "hidden" };
  const cancelBtnSt = { background: "transparent", color: MUT, border: "1px solid var(--line)", borderRadius: 10, padding: "11px 18px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer" };
  const saveBtnSt = { display: "inline-flex", alignItems: "center", gap: 8, background: GOLD, color: "var(--action-text)", border: "none", borderRadius: 10, padding: "11px 22px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, cursor: "pointer" };
  const pencilSt = { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, background: "transparent", color: MID, border: "1px solid var(--line)", borderRadius: 9, cursor: "pointer", flexShrink: 0 };

  const sectionHead = (s, title) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "16px 22px", borderBottom: "1px solid var(--line)" }}>
      <div style={{ fontFamily: "var(--sans)", fontSize: 16, fontWeight: 700, color: MID }}>{title}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {savedSection === s && section !== s && <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: "var(--success)" }}>Saved</span>}
        {section !== s && <button onClick={() => startEdit(s)} title={"Edit " + title.toLowerCase()} style={pencilSt}><I.edit size={15} /></button>}
      </div>
    </div>
  );

  const readRows = (rows) => (
    <div className="ed-profile-rows" style={{ padding: "6px 22px 16px" }}>
      {rows.map((r, i) => (
        <div key={i} className="ed-profile-row" style={{ display: "flex", flexDirection: "column", gap: 3, padding: "13px 0", borderBottom: i < rows.length - 1 ? "1px solid var(--line)" : "none" }}>
          <div style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, color: MUT }}>{r.label}</div>
          <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: INK, overflowWrap: "anywhere" }}>{r.value}</div>
        </div>
      ))}
    </div>
  );

  const editFooter = (s) => (
    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", padding: "8px 22px 20px" }}>
      <button onClick={cancel} style={cancelBtnSt}>Cancel</button>
      <button onClick={() => save(s)} style={saveBtnSt}>Save <I.arrow size={16} /></button>
    </div>
  );

  return (
    <div style={{ maxWidth: "var(--content-max)", margin: "36px var(--fol-mx) 72px", padding: 0 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
        <div>
          <h1 className="serif" style={{ fontSize: 40, color: MID, lineHeight: 1.06, margin: 0 }}>My Profile</h1>
        </div>
      </div>

      <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 16, padding: "20px 22px", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ position: "relative", width: 46, height: 46, flexShrink: 0 }}>
            <svg width="46" height="46" viewBox="0 0 46 46" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="23" cy="23" r="20" fill="none" stroke="var(--track)" strokeWidth="4" />
              <circle cx="23" cy="23" r="20" fill="none" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round" strokeDasharray={2 * Math.PI * 20} strokeDashoffset={2 * Math.PI * 20 * (1 - LH.profile.pct / 100)} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: MID }}>{LH.profile.pct}%</div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "var(--sans)", fontSize: 16, fontWeight: 700, color: MID }}>{t("profileCompletion")}</div>
            <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: MUT, marginTop: 2 }}>{LH.profile.done} {t("of")} {LH.profile.total} {t("sectionsCompleted")} — finish to unlock personalized insights.</div>
          </div>
        </div>
      </div>

      <div className="ed-profile-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>
        <div style={cardSt}>
          {sectionHead("personal", "Personal information")}
          {section === "personal" ? (
            <React.Fragment>
              <div style={{ padding: "18px 22px 0" }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: MUT, marginBottom: 18 }}><span style={{ color: "var(--danger)" }}>*</span> Indicates mandatory fields</div>
                <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
                  <div style={{ flexShrink: 0 }}>
                    <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{ display: "none" }} />
                    <div onClick={() => fileRef.current && fileRef.current.click()} title="Add photo" style={{ width: 104, height: 104, borderRadius: "50%", border: draft.avatar ? "1px solid var(--line)" : "1.5px dashed var(--line)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer", color: MID, overflow: "hidden", background: draft.avatar ? "transparent" : "rgba(0,15,71,.02)" }}>
                      {draft.avatar
                        ? <img src={draft.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        : <React.Fragment><I.plus size={24} /><span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600 }}>Add Photo</span></React.Fragment>}
                    </div>
                    {draft.avatar && <button onClick={() => setD("avatar", null)} style={{ display: "block", margin: "10px auto 0", background: "none", border: "none", color: "var(--danger)", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Remove</button>}
                  </div>
                  <div style={{ flex: 1, minWidth: 240, display: "flex", flexWrap: "wrap", gap: 18 }}>
                    {field("First Name", "first", { required: true })}
                    {field("Last Name", "last", { required: true })}
                    {field("Email", "email", { full: true, type: "email" })}
                    {field("Age", "age", { type: "number" })}
                    {select("Gender", "gender", [{ v: "", l: "Select" }, { v: "Female", l: "Female" }, { v: "Male", l: "Male" }, { v: "Other", l: "Prefer not to say" }])}
                    {select("Preferred Language", "lang", [{ v: "English", l: "English" }, { v: "Arabic", l: "العربية" }, { v: "French", l: "Français" }], { full: true })}
                  </div>
                </div>
              </div>
              {editFooter("personal")}
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 22px", borderBottom: "1px solid var(--line)" }}>
                {avatarView}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--sans)", fontSize: 18, fontWeight: 700, color: MID }}>{data.first} {data.last}</div>
                  <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: MUT, marginTop: 2 }}>{data.email}</div>
                </div>
              </div>
              {readRows(generalRows)}
            </React.Fragment>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={cardSt}>
            {sectionHead("time", "Time")}
            {section === "time" ? (
              <React.Fragment>
                <div style={{ padding: "18px 22px 4px", display: "flex", flexWrap: "wrap", gap: 18 }}>
                  {select("Time Zone", "timezone", TZ.map((z) => ({ v: z, l: z })), { full: true })}
                </div>
                {editFooter("time")}
              </React.Fragment>
            ) : readRows(timezoneRows)}
          </div>

          <div style={cardSt}>
            {sectionHead("other", "Other information")}
            {section === "other" ? (
              <React.Fragment>
                <div style={{ padding: "18px 22px 4px", display: "flex", flexWrap: "wrap", gap: 18 }}>
                  {field("Target Job", "targetJob", { full: true })}
                  {field("Target Entity", "targetEntity", { full: true })}
                  {field("Years of Experience Required for Target Job", "yearsExp", { full: true })}
                  {field("Minimum Educational Qualification Required for Target Job (To be taken from Job Description)", "minEdu", { full: true })}
                  {field("Preferred Educational Qualification Required for Target Job (To be taken from Job Description)", "prefEdu", { full: true })}
                </div>
                {editFooter("other")}
              </React.Fragment>
            ) : readRows(otherRows)}
          </div>
        </div>
      </div>
    </div>
  );
}

function EdChangePassword({ onBack }) {
  const [show, setShow] = React.useState({ old: false, pw: false, conf: false });
  const [vals, setVals] = React.useState({ old: "", pw: "", conf: "" });
  const labelSt = { display: "block", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: MID, marginBottom: 7 };
  const wrapSt = { position: "relative" };
  const inputSt = { width: "100%", boxSizing: "border-box", border: "1.5px solid var(--line)", borderRadius: 10, padding: "12px 44px 12px 13px", fontFamily: "var(--sans)", fontSize: 14, color: "var(--ink)", outline: "none", background: "var(--card)" };
  const eyeBtn = (k) => (
    <button type="button" onClick={() => setShow((s) => ({ ...s, [k]: !s[k] }))} title={show[k] ? "Hide" : "Show"} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", color: "var(--accent)", cursor: "pointer" }}>
      {show[k]
        ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>
        : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3l18 18" /><path d="M10.6 5.1A10.9 10.9 0 0112 5c7 0 10 7 10 7a13.2 13.2 0 01-2.2 3.2M6.6 6.6A13.3 13.3 0 002 12s3 7 10 7a10.7 10.7 0 005.4-1.4" /><path d="M9.9 9.9a3 3 0 004.2 4.2" /></svg>}
    </button>
  );
  const pwField = (label, k) => (
    <div style={{ marginBottom: 22 }}>
      <label style={labelSt}>{label}</label>
      <div style={wrapSt}>
        <input type={show[k] ? "text" : "password"} value={vals[k]} onChange={(ev) => { const v = ev.target.value; setVals((s) => ({ ...s, [k]: v })); }} style={inputSt} />
        {eyeBtn(k)}
      </div>
    </div>
  );
  return (
    <div style={{ maxWidth: "var(--content-max)", margin: "36px var(--fol-mx) 72px", padding: 0 }}>
      <h1 className="serif" style={{ fontSize: 40, color: MID, lineHeight: 1.06, margin: "0 0 28px" }}>Change Password</h1>
      <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 16, padding: "26px 26px 28px", marginBottom: 20 }}>
        {pwField("Old Password", "old")}
        {pwField("Password", "pw")}
        {pwField("Password Confirmation", "conf")}
        <MdsAlert severity="critical" mb={24}><strong style={{ fontWeight: 700 }}>Important:</strong> Changing your password will log you out.</MdsAlert>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={() => { window.location.href = "Login.html"; }} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: GOLD, color: "var(--action-text)", border: "none", borderRadius: 10, padding: "12px 26px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Update <I.arrow size={16} /></button>
        </div>
      </div>
    </div>
  );
}

function EdStat({ value, label, last }) {
  return (
    <div style={{ flex: 1, padding: "0 32px", borderRight: last ? "none" : "1px solid var(--line)" }}>
      <div className="serif" style={{ fontSize: 32, color: MID, lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: "var(--sans)", fontSize: 14, color: MUT, marginTop: 8 }}>{label}</div>
    </div>
  );
}

function EdProgram({ p, onOpen, onSystemCheck, variant, timer, timerPos = "top" }) {
  const stColor = (s) => s === "complete" ? "var(--success)" : s === "progress" ? p.accent : MUT;
  const state = p.state || (p.pct >= 100 ? "complete" : p.pct > 0 ? "progress" : "notstarted");
  const completed = p.steps.filter((s) => s.status === "complete").length;
  const pending = p.steps.length - completed;
  const [remain, setRemain] = React.useState(timer ? timer.seconds : 0);
  React.useEffect(() => {
    if (!timer) return;
    const id = setInterval(() => setRemain((r) => (r > 0 ? r - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [timer]);
  const cd = timer ? Math.floor(remain / 60).toString().padStart(2, "0") + ":" + (remain % 60).toString().padStart(2, "0") : "";
  // MDS Badge component colours (exact Figma hues): Positive #14853D and
  // Informative #0065AC as "Soft background" variants — 1px border in the hue
  // (added by mds-folio.css) + an 85%-white tint of the hue as fill. Neutral
  // ("Not started") is the outline variant (#94918C border, no fill) handled
  // in mds-folio.css off the --status-neutral-bg tell.
  const tag = state === "complete"
    ? { label: t("statusCompleted"), fg: "#14853D", bg: "color-mix(in srgb, #14853D 15%, #ffffff)" }
    : state === "notstarted"
      ? { label: t("statusNotStarted"), fg: "var(--ink)", bg: "var(--status-neutral-bg)" }
      : { label: t("statusInProgress"), fg: "#002C77", bg: "color-mix(in srgb, #002C77 15%, #ffffff)" };
  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 16, padding: 22, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {timer && timerPos === "top" && (
        <div style={{ display: "flex", alignItems: "center", gap: 9, margin: "-22px -22px 16px", padding: "9px 16px", background: "color-mix(in srgb, var(--accent) 7%, transparent)", color: "var(--accent)", borderBottom: "1px solid color-mix(in srgb, var(--accent) 16%, transparent)", whiteSpace: "nowrap" }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "currentColor", flexShrink: 0, animation: "ed-pulse 1.4s ease-in-out infinite" }} />
          <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>{timer.message}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, fontVariantNumeric: "tabular-nums", flexShrink: 0 }}><I.clock size={13} />{cd}</span>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 11 }}>
        <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 400, letterSpacing: ".02em", color: tag.fg, background: tag.bg, padding: "4px 10px", borderRadius: 6 }}>{tag.label}</span>
        {timer && timerPos === "bottom" ? (
          <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: "var(--accent)", fontVariantNumeric: "tabular-nums", display: "flex", alignItems: "center", gap: 6 }}><I.clock size={14} />{cd}</span>
        ) : (
          <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: MUT, display: "flex", alignItems: "center", gap: 6 }}><I.clock size={14} />{p.daysLeft} {t("daysLeft")}</span>
        )}
      </div>
      <h3 className="serif" style={{ fontSize: 22, color: MID, lineHeight: 1.15, margin: "0 0 14px" }}>{t(p.nameKey || p.name)}</h3>

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
        {/* MDS Linear Bar — same as the development plan (thin 4px, square ends, navy
            #000F47 fill that flips to #82BAFF in dark via --pl-fill, #94918C track, 2px gap) */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", height: 4, overflow: "hidden" }}>
          <div style={{ width: `${p.pct}%`, height: "100%", background: "var(--pl-fill)", flexShrink: 0 }} />
          {p.pct > 0 && p.pct < 100 && <div style={{ width: 2, flexShrink: 0 }} />}
          <div style={{ flex: 1, height: "100%", background: "#94918C" }} />
        </div>
      </div>

      {variant === "summary" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
          {[
            { v: p.steps.length, l: "Tasks assigned", icon: <I.fileText size={16} />, c: MUT },
            { v: pending, l: "Active", icon: <I.clock size={16} />, c: p.accent },
            { v: completed, l: "Done", icon: <I.checkCircle size={16} />, c: "var(--success)" },
          ].map((m, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, fontFamily: "var(--sans)", fontSize: 14 }}>
              <span style={{ color: m.c, display: "flex" }}>{m.icon}</span>
              <span style={{ color: INK }}><span style={{ fontVariantNumeric: "tabular-nums" }}>{m.v}</span> {m.l}</span>
            </div>
          ))}
        </div>
      ) : (
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
        {p.steps.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, fontFamily: "var(--sans)", fontSize: 14 }}>
            <span style={{ color: stColor(s.status), display: "flex" }}>
              {s.status === "complete" ? <I.checkCircle size={16} /> : s.status === "locked" ? <I.lock size={15} /> : s.status === "notstarted" ? <I.alertCircle size={16} /> : <Ring pct={s.pct || 0} size={16} stroke={2.5} color={p.accent} />}
            </span>
            <span style={{ color: s.status === "locked" ? MUT : INK }}>{t(s.nameKey || s.name)}</span>
          </div>
        ))}
      </div>
      )}

      {timer && timerPos === "bottom" && (
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: "auto", marginBottom: 12, padding: "9px 14px", borderRadius: 10, background: "color-mix(in srgb, var(--accent) 10%, var(--card))", color: "var(--accent)", border: "1px solid color-mix(in srgb, var(--accent) 18%, transparent)", whiteSpace: "nowrap" }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "currentColor", flexShrink: 0, animation: "ed-pulse 1.4s ease-in-out infinite" }} />
          <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>{timer.message}</span>
        </div>
      )}

      <div className="ed-prog-actions" style={{ display: "flex", gap: 12, marginTop: timer && timerPos === "bottom" ? 0 : "auto", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => onOpen(p.id)} className="ed-gold" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: GOLD, color: "var(--action-text)", border: "none", borderRadius: 10, padding: "9px 16px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          {state === "notstarted" ? t("beginProgram") : t("continueProgram")} <I.arrow size={16} />
        </button>
        {p.id === "leadership" && (
          <button onClick={() => onSystemCheck(p.id)} className="ed-syscheck" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, background: "none", color: "var(--primary)", border: "1.5px solid var(--primary)", borderRadius: 10, padding: "8px 16px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            {t("systemCheck")} <I.arrow size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

function EdDashboardContent({ onOpen, onSystemCheck, sample }) {
  const [langKey, setLangKey] = React.useState(0);
  React.useEffect(() => {
    const h = () => setLangKey(k => k + 1);
    window.addEventListener("lh-language-change", h);
    return () => window.removeEventListener("lh-language-change", h);
  }, []);
  const t = (key) => window.LangSwitcher?.get(key) || key;
  if (sample === "2") {
    // — Dashboard sample 2: greeting left · stats + profile completion fixed on the right —
    //   programs immediately below. Same type scale as sample 1; no font-size reductions.
    return (
      <div style={{ maxWidth: "var(--content-max)", margin: "0 var(--fol-mx)", padding: "28px 0 28px" }}>
        {/* Hero row — greeting left, stats + profile right */}
        <div className="ed-c-hero" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 32, flexWrap: "wrap", paddingBottom: 24, borderBottom: "1px solid var(--line)", marginBottom: 28 }}>
          <div style={{ flex: "1 1 320px", minWidth: 280 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: MUT, marginBottom: 8 }}>{t("welcomeBack")}</div>
            <h1 className="serif ed-hero-h1" style={{ fontSize: 40, color: MID, lineHeight: 1.05, margin: "0 0 8px" }}>
              {t("goodAfternoon")} {LH.user.first}.
            </h1>
          </div>
          <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="ed-stats" style={{ display: "flex" }}>
              {LH.stats.map((s, i) => (
                <div key={i} style={{ paddingLeft: i === 0 ? 0 : 24, paddingRight: i < 1 ? 24 : 0, borderRight: i < 1 ? "1px solid var(--line)" : "none" }}>
                  <div className="serif" style={{ fontSize: 32, color: MID, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 14, color: MUT, marginTop: 8 }}>{(() => { const _t=(k)=>window.LangSwitcher?.get(k)||k; const _lm={"Active programs":"activePrograms","Reports ready":"reportsReady"}; return _t(_lm[s.label]||s.label); })()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Programs immediately below */}
        <h2 className="serif" style={{ fontSize: 32, color: MID, margin: "0 0 6px" }}>{t("yourPrograms")}</h2>
        <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: MUT, lineHeight: 1.55, margin: "0 0 22px" }}>{t("programsSubhead")}</p>
        <div className="ed-prog-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {LH.programs.map((p) => <EdProgram key={p.id} p={p} onOpen={onOpen} onSystemCheck={onSystemCheck} />)}
        </div>
      </div>
    );
  }
  
  if (sample === "3") {
    // — Dashboard sample 3: original layout with profile card in center —
    return (
      <div style={{ maxWidth: "var(--content-max)", margin: "0 var(--fol-mx)", padding: "28px 0 28px" }}>
        {/* Hero */}
        <div style={{ marginBottom: 26 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: MUT, marginBottom: 8 }}>{t("welcomeBack")}</div>
          <h1 className="serif ed-hero-h1" style={{ fontSize: 40, color: MID, lineHeight: 1.05, margin: "0 0 8px" }}>
            {t("goodAfternoon")} {LH.user.first}.
          </h1>
        </div>

        {/* Editorial stats */}
        <div className="ed-stats" style={{ display: "flex", borderTop: "1px solid var(--line)", padding: "22px 0 0", marginBottom: 34 }}>
          {LH.stats.map((s, i) => {
            const t = (key) => window.LangSwitcher?.get(key) || key;
            const labelMap = {
              "Active programs": "activePrograms",
              "Reports ready": "reportsReady"
            };
            const translatedLabel = t(labelMap[s.label] || s.label);
            return (
              <div key={i} style={{ flex: 1, paddingLeft: i === 0 ? 0 : 32, paddingRight: 32, borderRight: i < 1 ? "1px solid var(--line)" : "none" }}>
                <div className="serif" style={{ fontSize: 32, color: MID, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 14, color: MUT, marginTop: 8 }}>{translatedLabel}</div>
              </div>
            );
          })}
        </div>

        {/* {t("profileCompletion")} */}
        <div className="ed-m-wrap" style={{ display: "flex", alignItems: "center", gap: 18, background: "var(--card)", border: "1px solid var(--line)", borderRadius: 14, padding: "18px 22px", marginBottom: 48 }}>
          <div style={{ position: "relative", width: 52, height: 52, flexShrink: 0 }}>
            <Ring pct={LH.profile.pct} size={52} stroke={4.5} color={BLUE} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: MID }}>{LH.profile.pct}%</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: MID }}>Complete your profile</div>
            <div style={{ fontSize: 14, color: MUT, marginTop: 2 }}>{LH.profile.done} of {LH.profile.total} done — finish to unlock personalized insights</div>
          </div>
          <button onClick={() => onOpen("profile")} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: MID, border: "1.5px solid " + MID, borderRadius: 10, padding: "10px 16px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Continue setup <I.arrow size={16} /></button>
        </div>

        {/* Programs */}
        <h2 className="serif" style={{ fontSize: 32, color: MID, margin: "0 0 6px" }}>{t("yourPrograms")}</h2>
        <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: MUT, lineHeight: 1.55, margin: "0 0 22px" }}>{t("programsSubhead")}</p>
        <div className="ed-prog-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {LH.programs.map((p) => <EdProgram key={p.id} p={p} onOpen={onOpen} onSystemCheck={onSystemCheck} />)}
        </div>
      </div>
    );
  }
  
  if (sample === "4") {
    // — Dashboard sample 4: same layout as sample 1, but program cards show
    //   task/report counts (pending · completed · reports ready · notes started)
    //   instead of the per-exercise step list. —
    return (
      <div style={{ maxWidth: "var(--content-max)", margin: "0 var(--fol-mx)", padding: "28px 0 28px" }}>
        <div style={{ marginBottom: 26 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: MUT, marginBottom: 8 }}>{t("welcomeBack")}</div>
          <h1 className="serif ed-hero-h1" style={{ fontSize: 40, color: MID, lineHeight: 1.05, margin: "0 0 8px" }}>
            {t("goodAfternoon")} {LH.user.first}.
          </h1>
        </div>

        <div className="ed-stats" style={{ display: "flex", borderTop: "1px solid var(--line)", padding: "22px 0 0", marginBottom: 34 }}>
          {LH.stats.map((s, i) => (
            <div key={i} style={{ flex: 1, paddingLeft: i === 0 ? 0 : 32, paddingRight: 32, borderRight: i < 1 ? "1px solid var(--line)" : "none" }}>
              <div className="serif" style={{ fontSize: 32, color: MID, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 14, color: MUT, marginTop: 8 }}>{(() => { const _t=(k)=>window.LangSwitcher?.get(k)||k; const _lm={"Active programs":"activePrograms","Reports ready":"reportsReady"}; return _t(_lm[s.label]||s.label); })()}</div>
            </div>
          ))}
        </div>

        <h2 className="serif" style={{ fontSize: 32, color: MID, margin: "0 0 6px" }}>{t("yourPrograms")}</h2>
        <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: MUT, lineHeight: 1.55, margin: "0 0 22px" }}>{t("programsSubhead")}</p>
        <div className="ed-prog-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <EdProgram key="timer-demo" p={LH.programs[0]} onOpen={onOpen} onSystemCheck={onSystemCheck} variant="summary" timer={{ seconds: 30 * 60, message: "Assessment window is closing" }} />
          {LH.programs.map((p) => <EdProgram key={p.id} p={p} onOpen={onOpen} onSystemCheck={onSystemCheck} variant="summary" />)}
        </div>
      </div>
    );
  }

  if (sample === "5") {
    // — Dashboard sample 5: same summary cards as sample 4, but the "assessment
    //   window is closing" alert bar sits ABOVE the action buttons instead of as a
    //   top ribbon — so every card's header lines up uniformly. —
    return (
      <div style={{ maxWidth: "var(--content-max)", margin: "0 var(--fol-mx)", padding: "28px 0 28px" }}>
        <div style={{ marginBottom: 26 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: MUT, marginBottom: 8 }}>{t("welcomeBack")}</div>
          <h1 className="serif ed-hero-h1" style={{ fontSize: 40, color: MID, lineHeight: 1.05, margin: "0 0 8px" }}>
            {t("goodAfternoon")} {LH.user.first}.
          </h1>
        </div>

        <div className="ed-stats" style={{ display: "flex", borderTop: "1px solid var(--line)", padding: "22px 0 0", marginBottom: 34 }}>
          {LH.stats.map((s, i) => (
            <div key={i} style={{ flex: 1, paddingLeft: i === 0 ? 0 : 32, paddingRight: 32, borderRight: i < 1 ? "1px solid var(--line)" : "none" }}>
              <div className="serif" style={{ fontSize: 32, color: MID, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 14, color: MUT, marginTop: 8 }}>{(() => { const _t=(k)=>window.LangSwitcher?.get(k)||k; const _lm={"Active programs":"activePrograms","Reports ready":"reportsReady"}; return _t(_lm[s.label]||s.label); })()}</div>
            </div>
          ))}
        </div>

        <h2 className="serif" style={{ fontSize: 32, color: MID, margin: "0 0 6px" }}>{t("yourPrograms")}</h2>
        <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: MUT, lineHeight: 1.55, margin: "0 0 22px" }}>{t("programsSubhead")}</p>
        <div className="ed-prog-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <EdProgram key="timer-demo" p={LH.programs[0]} onOpen={onOpen} onSystemCheck={onSystemCheck} variant="summary" timer={{ seconds: 30 * 60, message: "Assessment window is closing" }} timerPos="bottom" />
          {LH.programs.map((p) => <EdProgram key={p.id} p={p} onOpen={onOpen} onSystemCheck={onSystemCheck} variant="summary" />)}
        </div>
      </div>
    );
  }

  // — Dashboard sample 1: profile on sidebar, clean center —
  return (
    <div style={{ maxWidth: "var(--content-max)", margin: "0 var(--fol-mx)", padding: "28px 0 28px" }}>
      {/* Hero */}
      <div style={{ marginBottom: 26 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: MUT, marginBottom: 8 }}>{t("welcomeBack")}</div>
        <h1 className="serif ed-hero-h1" style={{ fontSize: 40, color: MID, lineHeight: 1.05, margin: "0 0 8px" }}>
          {t("goodAfternoon")} {LH.user.first}.
        </h1>
      </div>

      {/* Editorial stats */}
      <div className="ed-stats" style={{ display: "flex", borderTop: "1px solid var(--line)", padding: "22px 0 0", marginBottom: 34 }}>
        {LH.stats.map((s, i) => (
          <div key={i} style={{ flex: 1, paddingLeft: i === 0 ? 0 : 32, paddingRight: 32, borderRight: i < 1 ? "1px solid var(--line)" : "none" }}>
            <div className="serif" style={{ fontSize: 32, color: MID, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 14, color: MUT, marginTop: 8 }}>{(() => { const _t=(k)=>window.LangSwitcher?.get(k)||k; const _lm={"Active programs":"activePrograms","Reports ready":"reportsReady"}; return _t(_lm[s.label]||s.label); })()}</div>
          </div>
        ))}
      </div>

      {/* Programs - NO profile card in between */}
      <h2 className="serif" style={{ fontSize: 32, color: MID, margin: "0 0 6px" }}>{t("yourPrograms")}</h2>
      <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: MUT, lineHeight: 1.55, margin: "0 0 22px" }}>{t("programsSubhead")}</p>
      <div className="ed-prog-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {LH.programs.map((p) => <EdProgram key={p.id} p={p} onOpen={onOpen} onSystemCheck={onSystemCheck} />)}
      </div>
    </div>
  );
}

function EdCountdown({ due }) {
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
  const cdColor = urgent ? "var(--danger)" : "var(--accent)";
  const parts = [[cd.d, "d"], [cd.h, "h"], [cd.m, "m"], [cd.s, "s"]];
  return (
    <div className="ed-cd" style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "var(--card)", border: "1px solid var(--line)", borderRadius: 6, padding: "7px 15px" }}>
      <span className="ed-cd-date" style={{ display: "inline-flex", alignItems: "center", gap: 9, whiteSpace: "nowrap" }}>
        <span style={{ color: MID, display: "flex" }}><I.clock size={15} /></span>
        <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: MID }}>Due {due}</span>
      </span>
      <span style={{ fontFamily: "var(--sans)", fontSize: 14, fontWeight: 700, color: cdColor, fontVariantNumeric: "tabular-nums", letterSpacing: 0.2, whiteSpace: "nowrap" }}>
        {parts.map(([v, l], i) => `${String(v).padStart(2, "0")}${l}`).join(" : ")}
      </span>
    </div>
  );
}

function EdFooter() {
  const links = [
    { label: "Privacy Notice", key: "privacyNotice" },
    { label: "Cookie Notice", key: "cookieNotice" },
    { label: "Manage Cookies", key: "manageCookies" }
  ];
  return (
    <footer style={{ maxWidth: "var(--content-max)", margin: "0 var(--fol-mx)", padding: "22px 0 10px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
      <span style={{ fontFamily: "var(--sans)", fontSize: 14, color: MUT }}>© 2026 Marsh. {t("allRightsReserved")}.</span>
      <nav style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
        {links.map((l) => (
          <a key={l.key} href="#" onClick={(e) => e.preventDefault()} style={{ fontFamily: "var(--sans)", fontSize: 14, color: MUT, textDecoration: "none", transition: "color .15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = MID; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = MUT; }}>{t(l.key)}</a>
        ))}
      </nav>
    </footer>
  );
}

function AiSparkle({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" style={{ display: "block" }}>
      <path d="M9.3 3.2 Q9.3 11.8 1 11.8 Q9.3 11.8 9.3 20.4 Q9.3 11.8 17.6 11.8 Q9.3 11.8 9.3 3.2 Z" />
      <path d="M18.8 4 Q18.8 7 22 7 Q18.8 7 18.8 10 Q18.8 7 15.6 7 Q18.8 7 18.8 4 Z" />
      <path d="M17.8 15.4 Q17.8 18.4 21 18.4 Q17.8 18.4 17.8 21.4 Q17.8 18.4 14.6 18.4 Q17.8 18.4 17.8 15.4 Z" />
    </svg>
  );
}

function ChatBubble({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="257 29 42 42" fill="none" stroke="currentColor" strokeWidth="4.16667" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
      <path d="M281.318 45.3792C281.318 46.2632 280.967 47.1111 280.341 47.7362C279.716 48.3613 278.868 48.7125 277.984 48.7125H267.984L261.318 55.3792V37.0459C261.318 36.1618 261.669 35.314 262.294 34.6888C262.919 34.0637 263.767 33.7125 264.651 33.7125H277.984C278.868 33.7125 279.716 34.0637 280.341 34.6888C280.967 35.314 281.318 36.1618 281.318 37.0459V45.3792Z" />
      <path d="M287.984 45.3792H291.318C292.202 45.3792 293.05 45.7304 293.675 46.3555C294.3 46.9806 294.651 47.8285 294.651 48.7125V67.0459L287.984 60.3792H277.984C277.1 60.3792 276.252 60.028 275.627 59.4029C275.002 58.7778 274.651 57.9299 274.651 57.0459V55.3792" />
    </svg>
  );
}

function AiAssistant() {
  const [open, setOpen] = React.useState(false);
  const [tipClosed, setTipClosed] = React.useState(false);
  const t = (k) => (window.LangSwitcher ? window.LangSwitcher.get(k) : k);
  const [input, setInput] = React.useState("");
  const [msgs, setMsgs] = React.useState([{ from: "bot", text: "Hi John — I'm your AI Assistant. Ask me about your programs, deadlines, or how a task works." }]);
  const bodyRef = React.useRef(null);
  React.useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [msgs, open]);
  const send = () => {
    const t = input.trim();
    if (!t) return;
    setMsgs((m) => [...m, { from: "me", text: t }, { from: "bot", text: "Thanks for asking. This is a demo assistant — in the live product I'd answer instantly, or connect you with the support team." }]);
    setInput("");
  };
  const quick = ["When is my next deadline?", "What's a proctored task?", "How do I book a session?"];
  return (
    <React.Fragment>
      {open && (
        <div className="ed-aipanel" style={{ position: "fixed", right: 24, bottom: 124, width: 366, maxWidth: "calc(100vw - 48px)", height: 480, maxHeight: "calc(100vh - 150px)", background: "var(--card)", borderRadius: 18, border: "1px solid var(--line)", boxShadow: "0 24px 64px rgba(0,15,71,.24)", zIndex: 71, display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: "var(--sans)" }}>
          <div style={{ background: "var(--surface-deep)", color: "#fff", padding: "15px 17px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(206,236,255,.16)", color: SKY, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><ChatBubble size={20} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>AI Assistant</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,.82)", display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 7, height: 7, borderRadius: 4, background: "var(--success)" }} /> Online</div>
            </div>
            <button onClick={() => setOpen(false)} title="Close" style={{ background: "none", border: "none", color: "rgba(255,255,255,.82)", cursor: "pointer", display: "flex" }}><I.plus size={18} style={{ transform: "rotate(45deg)" }} /></button>
          </div>
          <div ref={bodyRef} style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10, background: CREAM }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ alignSelf: m.from === "bot" ? "flex-start" : "flex-end", maxWidth: "86%", background: m.from === "bot" ? "#fff" : MID, color: m.from === "bot" ? INK : "#fff", border: m.from === "bot" ? "1px solid var(--line)" : "none", padding: "10px 13px", borderRadius: m.from === "bot" ? "4px 14px 14px 14px" : "14px 14px 4px 14px", fontSize: 14, lineHeight: 1.5 }}>{m.text}</div>
            ))}
            {msgs.length <= 1 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 4 }}>
                {quick.map((q) => (
                  <button key={q} onClick={() => { setMsgs((m) => [...m, { from: "me", text: q }, { from: "bot", text: "Great question — this is a demo assistant, but here's where I'd surface that answer for you." }]); }} style={{ fontFamily: "var(--sans)", fontSize: 14, color: BLUE, background: "color-mix(in srgb, var(--accent) 6%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)", borderRadius: 16, padding: "7px 12px", cursor: "pointer" }}>{q}</button>
                ))}
              </div>
            )}
          </div>
          <div style={{ borderTop: "1px solid var(--line)", padding: 12, display: "flex", gap: 8, background: "var(--card)", flexShrink: 0 }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") send(); }} placeholder="Ask a question…" style={{ flex: 1, border: "1px solid var(--line)", borderRadius: 10, padding: "10px 13px", fontFamily: "var(--sans)", fontSize: 14, color: INK, outline: "none" }} />
            <button onClick={send} title="Send" style={{ width: 40, height: 40, borderRadius: "50%", background: GOLD, color: "var(--action-text)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><I.send size={17} /></button>
          </div>
        </div>
      )}
      <div className="ed-aifab" style={{ position: "fixed", right: 24, bottom: 60, zIndex: 72, display: "flex", alignItems: "center", gap: 10 }}>
        {!open && !tipClosed && (
          <span style={{ position: "relative", display: "inline-flex", alignItems: "center", background: "var(--card)", color: MID, border: "1px solid var(--line)", boxShadow: "0 6px 20px rgba(0,15,71,.18)", borderRadius: 999, padding: "9px 16px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, whiteSpace: "nowrap", cursor: "pointer" }} onClick={() => setOpen(true)}>
            {t("reportTechnicalProblem")}
            <button onClick={(e) => { e.stopPropagation(); setTipClosed(true); }} title="Dismiss" style={{ position: "absolute", top: -8, left: -8, width: 22, height: 22, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", background: "var(--card)", border: "1px solid var(--line)", boxShadow: "0 2px 6px rgba(0,15,71,.2)", color: MUT, cursor: "pointer", zIndex: 1 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="M5 5l14 14M19 5L5 19" /></svg>
            </button>
          </span>
        )}
        <button onClick={() => setOpen((v) => !v)} title={t("reportTechnicalProblem")} style={{ width: 54, height: 54, borderRadius: "50%", background: "var(--surface-deep)", color: "#fff", border: "none", boxShadow: "0 10px 30px rgba(0,15,71,.32)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform .15s" }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.06)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}>
          {open ? <I.plus size={24} style={{ transform: "rotate(45deg)" }} /> : <ChatBubble size={26} />}
        </button>
      </div>
    </React.Fragment>
  );
}

function DashEditorial({ initialRoute } = {}) {
  const [route, setRoute] = React.useState(() => initialRoute || (window.LHRoute ? edPathToRoute(LHRoute.get()) : { page: "dash", progId: null, center: null, target: null }));
  // Sync the route to the URL hash so each page is its own shareable, back/forward URL.
  // First render REPLACES (no phantom history entry); later navigations PUSH. pushState
  // never re-fires our popstate listener, so there is no feedback loop.
  const edSynced = React.useRef(false);
  React.useEffect(() => {
    if (!window.LHRoute) return;
    const path = edRouteToPath(route);
    if (!edSynced.current) { edSynced.current = true; LHRoute.replace(path); }
    else LHRoute.push(path);
  }, [route]);
  // Back/forward + deep-link: parse the URL and bump oaNav so the assessment (which keeps its
  // own answer state) remounts at the target question/step instead of ignoring the change.
  React.useEffect(() => { if (window.LHRoute) return LHRoute.onPop(() => setRoute((r) => { const nr = edPathToRoute(LHRoute.get()); nr.oaNav = (r.oaNav || 0) + 1; return nr; })); }, []);
  // Publish the active page to the DOM so page-scoped chrome (e.g. the "no internet"
  // preview switch in lh-tweaks) can show itself only on the pages it belongs to.
  React.useEffect(() => { document.documentElement.setAttribute("data-lh-page", route.page || ""); }, [route.page]);
  const [consent, setConsent] = React.useState({});
  const [watched, setWatched] = React.useState({});
  const [heroStyle, setHeroStyle] = React.useState(() => { try { return localStorage.getItem("ed-hero-style") || "minimal"; } catch (e) { return "minimal"; } });
  const [heroMenu, setHeroMenu] = React.useState(false);
  const [railCollapsed, setRailCollapsed] = React.useState(() => { try { return localStorage.getItem("ed-rail-collapsed") === "1"; } catch (e) { return false; } });
  const toggleRail = () => setRailCollapsed((v) => { const n = !v; try { localStorage.setItem("ed-rail-collapsed", n ? "1" : "0"); } catch (e) {} return n; });
  const setHero = (v) => { setHeroStyle(v); try { localStorage.setItem("ed-hero-style", v); } catch (e) {} };
  const [tasksLayout, setTasksLayout] = React.useState(() => { try { return localStorage.getItem("ed-tasks-layout") || "standard"; } catch (e) { return "standard"; } });
  const [layoutMenu, setLayoutMenu] = React.useState(false);
  const setLayout = (v) => { setTasksLayout(v); try { localStorage.setItem("ed-tasks-layout", v); } catch (e) {} };
  const [dashSample, setDashSample] = React.useState(() => { try { return localStorage.getItem("ed-dash-sample") || "5"; } catch (e) { return "5"; } });
  const [dashMenu, setDashMenu] = React.useState(false);
  const setSample = (v) => { setDashSample(v); try { localStorage.setItem("ed-dash-sample", v); } catch (e) {} };
  const [mobileNav, setMobileNav] = React.useState(false);
  const [langMenu, setLangMenu] = React.useState(false);
  const [language, setLanguage] = React.useState(() => window.LangSwitcher?.currentLang || "en");
  const [a11yOpen, setA11yOpen] = React.useState(false);
  const [theme, setThemeState] = React.useState(() => { try { return localStorage.getItem("lh-theme") === "dark" ? "dark" : "light"; } catch (e) { return "light"; } });
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    const h = (e) => setThemeState(e.detail === "dark" ? "dark" : "light");
    window.addEventListener("lh-theme-change", h);
    return () => window.removeEventListener("lh-theme-change", h);
  }, []);
  const setTheme = (m) => { setThemeState(m); document.documentElement.setAttribute("data-theme", m); try { localStorage.setItem("lh-theme", m); } catch (e) {} window.dispatchEvent(new CustomEvent("lh-theme-change", { detail: m })); };
  const [fontScale, setFontScale] = React.useState(() => { try { return parseFloat(localStorage.getItem("lh-font-scale")) || 1; } catch (e) { return 1; } });
  React.useEffect(() => {
    document.documentElement.style.zoom = "";
    if (mainRef.current) mainRef.current.style.zoom = "";
    // Text-size zoom applies on real desktop only. Inside the mobile/iPad device-preview frame
    // the page is already in a scaled, fixed-size shell, and CSS `zoom` there reliably breaks
    // scroll/paint (content scrolls off the top → blank screen). So force scale 1 in those modes.
    const inDeviceFrame = ["mobile", "ipad"].includes(document.documentElement.getAttribute("data-device"));
    if (zoomRef.current) zoomRef.current.style.zoom = inDeviceFrame ? "" : String(fontScale);
    try { localStorage.setItem("lh-font-scale", String(fontScale)); } catch (e) {}
    const id = requestAnimationFrame(() => { if (mainRef.current) mainRef.current.scrollTop = 0; });
    return () => cancelAnimationFrame(id);
  }, [fontScale, route.page]);
  // Re-apply the zoom rule whenever the device-preview mode changes (Tweaks → Device preview).
  React.useEffect(() => {
    const sync = () => {
      const inDeviceFrame = ["mobile", "ipad"].includes(document.documentElement.getAttribute("data-device"));
      if (zoomRef.current) zoomRef.current.style.zoom = inDeviceFrame ? "" : String(fontScale);
      if (mainRef.current) mainRef.current.scrollTop = 0;
    };
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-device"] });
    return () => obs.disconnect();
  }, [fontScale]);
  const incFont = () => setFontScale((s) => Math.min(+(s + 0.1).toFixed(2), 1.5));
  const decFont = () => setFontScale((s) => Math.max(+(s - 0.1).toFixed(2), 0.8));
  const resetFont = () => setFontScale(1);
  const t = (key) => window.LangSwitcher?.get(key) || key;
  // re-render chrome (rail logo) when the client brand chip changes
  const [, setBrandTick] = React.useState(0);
  React.useEffect(() => {
    const f = () => setBrandTick((n) => n + 1);
    window.addEventListener("lh-brand-change", f);
    return () => window.removeEventListener("lh-brand-change", f);
  }, []);
  React.useEffect(() => {
    const handleLangChange = (lang) => setLanguage(lang);
    window.LangSwitcher?.subscribe(handleLangChange);
    window.addEventListener("lh-language-updated", () => {
      setLanguage(window.LangSwitcher?.currentLang || "en");
    });
  }, []);
  const mainRef = React.useRef(null);
  const zoomRef = React.useRef(null);

  // Reset scroll to top on every route change — and do it AFTER layout settles (rAF) so it
  // wins against scroll-anchoring, which otherwise overshoots when the text-size `zoom`
  // reflows the content and pushes the whole page off the top of the frame (looks blank).
  React.useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
    const id = requestAnimationFrame(() => { if (mainRef.current) mainRef.current.scrollTop = 0; });
    return () => cancelAnimationFrame(id);
  }, [route.page, route.progId, route.center, route.target]);

  // iPad only: collapse the left rail when arriving at the program detail (tasks) page so the
  // task list gets the full width. State-only (no localStorage write) so it doesn't change the
  // saved desktop preference; keyed on the route so a manual expand while on the page isn't undone.
  React.useEffect(() => {
    if (route.page === "tasks" && document.documentElement.getAttribute("data-device") === "ipad") {
      setRailCollapsed(true);
    }
  }, [route.page, route.progId]);

  const prog = route.progId ? LH.programs.find((p) => p.id === route.progId) : null;

  const openProgram = (id) => {
    if (id === "dash") { setRoute({ page: "dash", progId: null, center: null, target: null }); return; }
    if (id === "bookings") return;   // Bookings is switched off for now
    // Development's two sub-destinations: build a new plan, or jump straight to
    // the one plan this user has (shortcut — no need to re-answer the questions).
    if (id === "newplan" || id === "development") {
      setRoute({ page: "development", progId: null, center: null, target: null, idpMode: "choose" }); return;
    }
    if (id === "myplan") {
      setRoute({ page: "development", progId: null, center: null, target: null, idpMode: "plan" }); return;
    }
    if (id === "development" || id === "scheduling" || id === "insights" || id === "profile" || id === "settings" || id === "changePassword") {
      setRoute({ page: id, progId: null, center: null, target: null }); return;
    }
    const isProg = LH.programs.some((p) => p.id === id);
    if (!isProg) { setRoute({ page: "dash", progId: null, center: null, target: null }); return; }
    // 360° Perspective skips the standard instructions screen — Begin program
    // drops straight into the campaign flow (EdC360 owns its own intro/steps).
    if (id === "360") { setRoute({ page: "tasks", progId: id, center: null, target: null }); return; }
    setRoute({ page: consent[id] ? "tasks" : "instructions", progId: id, center: null, target: null });
  };

  const openSystemCheck = (id) => {
    const p = LH.programs.find((x) => x.id === id);
    const d = p && p.detail;
    const target = d && ([...(d.sequential || []), ...(d.open || []), ...(d.centers || [])].find((e) => e.proctored));
    if (!target) { openProgram(id); return; }
    setRoute({ page: "precheck", progId: id, center: null, target });
  };

  // Development carries two destinations in the rail (Folio only — LH.nav itself
  // is shared with the other directions and stays untouched).
  const railItems = React.useMemo(() => LH.nav.map((it) => it.id === "development"
    ? { ...it, children: [{ id: "newplan", label: "New Plan" }, { id: "myplan", label: "My Plan" }] }
    : it), []);

  const D = window.EdDetail || {};
  const G = window.EdGrowth || {};
  const A = window.EdAssess || {};
  const C360 = window.EdC360;
  const Bk = window.EdBookings;
  const toDash = () => setRoute({ page: "dash", progId: null, center: null, target: null });
  const toTasks = () => setRoute((r) => ({ ...r, page: "tasks", center: null, target: null }));

  let content;
  if (route.page === "settings") {
    content = <EdSettings onBack={toDash} />;
  } else if (route.page === "profile") {
    content = <EdProfile onBack={toDash} onNav={openProgram} />;
  } else if (route.page === "changePassword") {
    content = <EdChangePassword onBack={() => setRoute({ page: "profile", progId: null, center: null, target: null })} />;
  } else if (route.page === "development") {
    content = <G.EdDevelopment key={"dev-" + (route.oaNav || 0)} onBack={toDash} initialMode={route.idpMode} idpStep={route.idpStep}
      onMode={(m) => setRoute((r) => (r.page === "development" && r.idpMode !== m ? { ...r, idpMode: m, idpStep: m === "flow" ? r.idpStep : undefined } : r))}
      onStep={(s) => setRoute((r) => (r.page === "development" && r.idpMode === "flow" && r.idpStep !== s ? { ...r, idpStep: s } : r))} />;
  } else if (route.page === "scheduling") {
    content = <G.EdScheduling key={"sched-" + (route.oaNav || 0)} onBack={toDash} initialCenter={route.schedCenter} demo={route.schedDemo}
      onView={(v) => setRoute((r) => (r.page === "scheduling" && r.schedCenter === (v || null) ? r : { ...r, schedCenter: v || null }))} />;
  } else if (route.page === "insights") {
    content = <G.EdInsights onBack={toDash} initialPreview={route.insightPreview} />;
  } else if (route.page === "bookings") {
    content = null;   // Bookings hidden — nothing renders if something still points here
  } else if (route.page === "dash" || !prog) {
    content = <EdDashboardContent onOpen={openProgram} onSystemCheck={openSystemCheck} sample={dashSample} />;
  } else if (route.page === "instructions") {
    content = <D.EdInstructions prog={prog}
      watched={!!watched[prog.id]}
      acked={!!consent[prog.id]}
      onWatch={() => setWatched((w) => ({ ...w, [prog.id]: true }))}
      onContinue={() => { setConsent((c) => ({ ...c, [prog.id]: true })); toTasks(); }}
      onBack={toDash} />;
  } else if (route.page === "tasks") {
    content = (prog.id === "360" && C360) ? <C360 prog={prog}
      initialStep={route.c360Step}
      onBack={toDash}
      onBuildPlan={() => openProgram("development")}
      countdown={<EdCountdown due={prog.due} />} /> : <D.EdTasks prog={prog}
      onBack={toDash}
      onOpenCenter={(c) => setRoute((r) => ({ ...r, page: "center", center: c }))}
      onProctored={(target) => setRoute((r) => ({ ...r, page: "precheck", target }))}
      onOpenAssess={(ex) => setRoute((r) => ({ ...r, page: "assessintro", target: ex }))}
      onSchedule={(c) => setRoute((r) => ({ ...r, page: "scheduling", schedCenter: c && c.schedId }))}
      heroStyle={heroStyle} tasksLayout={tasksLayout} />;
  } else if (route.page === "center") {
    content = <D.EdCenter center={route.center}
      onBack={toTasks}
      onOpenAssess={(ex) => setRoute((r) => ({ ...r, page: "assessintro", target: ex }))}
      onReserve={(c) => { setRoute((r) => ({ ...r, page: "scheduling", schedCenter: c && c.schedId })); }}
      onProctored={(target) => setRoute((r) => ({ ...r, page: "precheck", target }))} />;
  } else if (route.page === "precheck") {
    content = <D.EdPreCheck target={route.target}
      onBack={() => setRoute((r) => ({ ...r, page: route.center ? "center" : "tasks", target: null }))}
      onLaunch={toTasks} />;
  } else if (route.page === "assessintro") {
    content = <A.EdAssessIntro exercise={route.target} onExit={toTasks} onBegin={() => setRoute((r) => ({ ...r, page: "consent" }))} />;
  } else if (route.page === "consent") {
    content = <A.EdConsent exercise={route.target} onExit={() => setRoute((r) => ({ ...r, page: "assessintro" }))} onAccept={() => setRoute((r) => ({ ...r, page: "openassess" }))} />;
  } else if (route.page === "openassess") {
    const assessPool = (prog && prog.detail) ? [...prog.detail.sequential, ...prog.detail.open].filter((e) => !e.proctored) : [];
    const assessIdx = route.target ? assessPool.findIndex((e) => e.id === route.target.id) : -1;
    const nextAssess = assessIdx >= 0 ? assessPool[assessIdx + 1] : null;
    content = <A.EdOpenAssess key={"oa-" + (route.oaNav || 0)} exercise={route.target} onExit={toTasks}
      initialStep={route.oaStep} initialLayout={route.oaLayout} initialQIdx={route.oaQIdx}
      onPos={(pos) => setRoute((r) => (r.page === "openassess" && r.oaStep === pos.step && r.oaQIdx === pos.qIdx && r.oaPage === pos.page && r.oaLayout === pos.layout ? r : { ...r, oaStep: pos.step, oaQIdx: pos.qIdx, oaPage: pos.page, oaLayout: pos.layout }))}
      onBack={() => setRoute((r) => ({ ...r, page: "consent" }))}
      hasNext={!!nextAssess} nextEx={nextAssess}
      onNext={() => nextAssess ? setRoute((r) => ({ ...r, page: "assessintro", target: nextAssess })) : toTasks()} />;
  }

  const devSub = route.idpMode === "plan" ? "myplan" : "newplan";
  const activeId = route.page === "development" ? devSub : route.page === "changePassword" ? "changePassword" : (["development", "scheduling", "insights", "bookings", "profile", "settings"].includes(route.page) ? route.page : route.page === "dash" ? "dash" : route.progId);
  const immersive = route.page === "openassess";
  const onDash = route.page === "dash" || (!prog && !["development", "scheduling", "insights", "profile", "settings", "changePassword"].includes(route.page));
  const headerBack = () => {
    if (route.page === "center") toTasks();
    else if (route.page === "precheck") setRoute((r) => ({ ...r, page: route.center ? "center" : "tasks", target: null }));
    else if (route.page === "assessintro") toTasks();
    else if (route.page === "consent") setRoute((r) => ({ ...r, page: "assessintro" }));
    else toDash();
  };
  const headerBackLabel = route.page === "assessintro" ? "Back"
    : route.page === "consent" ? "Back"
    : route.page === "center" ? "Back"
    : ["development", "scheduling", "insights", "bookings", "profile", "settings", "changePassword", "tasks", "instructions"].includes(route.page) ? "Back"
    : "Back";
  const isMainPage = ["development", "scheduling", "insights", "profile", "settings", "changePassword"].includes(route.page);
  const isC360Flow = route.page === "tasks" && prog && prog.id === "360" && C360;

  // Shared top-bar controls (dark mode · accessibility · language) — used in the
  // fixed desktop header and the mobile bar.
  const topControls = (
    <React.Fragment>
      <button title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        style={{ width: 38, height: 38, borderRadius: 8, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "var(--card)", color: "var(--primary)", border: "1px solid var(--line)", cursor: "pointer", transition: "border-color .15s", flexShrink: 0 }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--muted)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--line)"; }}>
        {theme === "dark" ? <I.moon size={19} /> : <I.sun size={19} />}
      </button>
      <div style={{ position: "relative" }}>
        <button title="Accessibility — text size" onClick={() => setA11yOpen((v) => !v)}
          style={{ width: 38, height: 38, borderRadius: 8, display: "inline-flex", alignItems: "center", justifyContent: "center", background: a11yOpen ? "color-mix(in srgb, var(--muted) 12%, transparent)" : "var(--card)", color: "var(--primary)", border: "1px solid " + (a11yOpen ? "var(--muted)" : "var(--line)"), cursor: "pointer", transition: "border-color .15s, background .15s", flexShrink: 0 }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--muted)"; }}
          onMouseLeave={(e) => { if (!a11yOpen) e.currentTarget.style.borderColor = "var(--line)"; }}>
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="7.2" r="1.3" fill="currentColor" stroke="none" />
            <path d="M5.5 9.5c2 1 4.2 1.4 6.5 1.4s4.5-.4 6.5-1.4" />
            <path d="M12 10.9V15" />
            <path d="M12 15l-2.3 4M12 15l2.3 4" />
          </svg>
        </button>
        {a11yOpen && (
          <div style={{ position: "absolute", top: "calc(100% + 10px)", [language === "ar" ? "left" : "right"]: 0, zIndex: 998, background: "var(--card)", border: "1px solid var(--line)", borderRadius: 14, boxShadow: "0 12px 38px rgba(0,15,71,.18)", padding: 10, fontFamily: "var(--sans)" }}>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 0.2, color: "var(--muted)", padding: "2px 4px 8px" }}>Text size</div>
            <div style={{ display: "flex", border: "1px solid var(--line)", borderRadius: 10, overflow: "hidden" }}>
              <button title="Decrease text size" onClick={decFont} style={{ width: 52, height: 46, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--card)", border: "none", borderRight: "1px solid var(--line)", color: "var(--primary)", cursor: "pointer" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,15,71,.04)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14" /></svg>
              </button>
              <button title="Reset to default (100%)" onClick={resetFont} style={{ minWidth: 64, height: 46, padding: "0 10px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--card)", border: "none", borderRight: "1px solid var(--line)", color: "var(--primary)", cursor: "pointer", fontVariantNumeric: "tabular-nums" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,15,71,.04)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{Math.round(fontScale * 100)}%</span>
              </button>
              <button title="Increase text size" onClick={incFont} style={{ width: 52, height: 46, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--card)", border: "none", color: "var(--primary)", cursor: "pointer" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,15,71,.04)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
              </button>
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
      <div style={{ position: "relative" }}>
        <button onClick={() => setLangMenu((v) => !v)} title="Switch language"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 38, boxSizing: "border-box", background: "var(--card)", color: "var(--primary)", border: "1px solid var(--line)", borderRadius: 8, padding: "8px 14px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "border-color .15s, background .15s" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--muted)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--line)"; }}>
          <span>{language === "en" ? "English" : "العربية"}</span>
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        {langMenu && (
          <div style={{ position: "absolute", top: "calc(100% + 8px)", [language === "ar" ? "left" : "right"]: 0, zIndex: 998, width: 160, background: "var(--card)", border: "1px solid var(--line)", borderRadius: 12, boxShadow: "0 10px 34px rgba(0,15,71,.16)", padding: 7, fontFamily: "var(--sans)" }}>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 0.2, color: "var(--muted)", padding: "7px 9px 5px" }}>Language</div>
            {["en", "ar"].map((lang) => {
              const active = language === lang;
              return (
                <button key={lang} onClick={() => { window.LangSwitcher?.setLanguage(lang); setLangMenu(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 9px", borderRadius: 8, border: "none", background: active ? "color-mix(in srgb, var(--accent) 6%, transparent)" : "transparent", cursor: "pointer", textAlign: "left" }}>
                  <span style={{ width: 16, display: "flex", justifyContent: "center", color: "var(--accent)" }}>{active ? <I.check size={15} /> : null}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: active ? "var(--primary)" : "var(--ink)" }}>
                    {lang === "en" ? "English" : "العربية"}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </React.Fragment>
  );
  const [pageBack, setPageBack] = React.useState(null);
  // Let nested pages (e.g. the Development flow) collapse/expand the left rail.
  const collapseRail = React.useCallback((v) => { setRailCollapsed(v); try { localStorage.setItem("ed-rail-collapsed", v ? "1" : "0"); } catch (e) {} }, []);
  const topBarCtx = React.useMemo(() => ({ setBack: setPageBack, collapseRail }), [collapseRail]);
  const renderTopBack = (label, onClick) => (
    <button onClick={onClick} className="ed-topbar-back" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "none", border: "none", padding: "4px 0", margin: 0, color: "var(--primary)", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: document.documentElement.dir === "rtl" ? "scaleX(-1)" : "none" }}><path d="M15 18l-6-6 6-6" /></svg>
      Back
    </button>
  );
  // Route-level back (program-flow pages) — hidden on the dashboard and main nav pages.
  const routeBack = (!onDash && !immersive && !isMainPage) ? renderTopBack(headerBackLabel, headerBack) : null;
  // A page's registered in-page sub-view back takes precedence when present.
  const topBackBtn = pageBack ? renderTopBack(pageBack.label, pageBack.onClick) : routeBack;

  return (
    <React.Fragment>
    <div className="ed-shell" style={{ width: "100%", height: "100%", overflow: "clip", background: CREAM, display: "flex", fontFamily: "var(--sans)", position: "relative" }}>
      {!immersive && <EdRail activeId={activeId} onNav={openProgram} collapsed={railCollapsed} onToggle={toggleRail} items={railItems} />}
      {!immersive && (
        <button onClick={toggleRail} title={railCollapsed ? "Expand menu" : "Collapse menu"} className="ed-rail-toggle"
          style={{ position: "absolute", top: 30, ...(document.documentElement.dir === "rtl" ? { right: (railCollapsed ? 74 : 256) - 14, transition: "right .2s ease" } : { left: (railCollapsed ? 74 : 256) - 14, transition: "left .2s ease" }), zIndex: 50, width: 28, height: 28, borderRadius: "50%", background: "var(--card)", border: "1px solid var(--line)", boxShadow: "0 2px 10px rgba(0,15,71,.16)", color: MID, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          {railCollapsed ? (document.documentElement.dir === "rtl" ? <I.chevL size={16} /> : <I.chevR size={16} />) : (document.documentElement.dir === "rtl" ? <I.chevR size={16} /> : <I.chevL size={16} />)}
        </button>
      )}
      <main ref={mainRef} style={{ flex: 1, minWidth: 0, height: "100%", overflowY: "auto", overflowAnchor: "none" }}>
        {/* min-height (not height) so this wrapper grows with tall content — otherwise it
            caps at one viewport and the sticky .ed-topbar unsticks after the first screen. */}
        <div ref={zoomRef} style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
        {immersive ? content : (
          <React.Fragment>
            {/* mobile top bar — hamburger + logo (left), search + bell (right); phone only via CSS */}
            <div className="ed-mbar" style={{ display: "none", alignItems: "center", justifyContent: "space-between", padding: "11px 18px", background: CREAM, borderBottom: "1px solid var(--line)", position: "sticky", top: 0, zIndex: 30 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button onClick={() => setMobileNav(true)} aria-label="Open menu" style={{ background: "none", border: "none", cursor: "pointer", color: MID, display: "flex", padding: 2 }}><I.menu size={24} /></button>
                {(() => {
                  const cb = (typeof window !== "undefined" && window.LHBrand && window.LHBrand.current() !== "marsh") ? window.LHBrand.get() : null;
                  if (cb) return <img src={cb.icon} alt={cb.label} style={{ height: cb.label === "DGE" ? 30 : 26, width: "auto", maxWidth: 130, objectFit: "contain", display: "block" }} />;
                  return (
                <svg width="25" height="25" viewBox="0 0 43.17 44.26" style={{ display: "block", fill: MID }} aria-label="Marsh">
                  <polygon points="42.49 0 21.65 30.43 22.2 30.43 35.07 24.39 35.07 44.26 43.17 44.26 43.17 0 42.49 0" />
                  <polygon points="0 0 0 44.26 8.1 44.26 8.1 24.4 20.9 30.43 21.52 30.43 .68 0 0 0" />
                </svg>
                  );
                })()}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {topControls}
              </div>
            </div>
            {prog && route.page !== "instructions" && (
              <div className="ed-mbar-cd" style={{ display: "none", padding: "10px 18px", borderBottom: "1px solid var(--line)", background: CREAM }}>
                <EdCountdown due={prog.due} />
              </div>
            )}
            {/* Fixed desktop top header — back link (far left) + controls (right) */}
            <div className="ed-topbar" style={{ position: "sticky", top: 0, zIndex: 40, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, minHeight: 58, boxSizing: "border-box", padding: "10px var(--fol-px, 56px)", background: CREAM, borderBottom: "1px solid var(--line)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0 }}>
                {topBackBtn}
              </div>
              {prog && route.page !== "instructions" && (
                <div className="ed-utilbar-cd" style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center" }}><EdCountdown due={prog.due} /></div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                {topControls}
              </div>
            </div>

            <div className="ed-content" style={{ padding: "0 var(--fol-px, 56px)", flex: "1 0 auto", display: "flex", flexDirection: "column" }}>
              <div>
              <LHTopBarContext.Provider value={topBarCtx}>{content}</LHTopBarContext.Provider>
              </div>
              <div style={{ marginTop: "auto" }}><EdFooter /></div>
            </div>
          </React.Fragment>
        )}
        </div>
      </main>
      {mobileNav && (
        <div onClick={() => setMobileNav(false)} className="ed-drawer-bg" style={{ position: "absolute", inset: 0, background: "rgba(0,15,71,.45)", zIndex: 90 }}>
          <div onClick={(e) => e.stopPropagation()} className="ed-rail-drawer" style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 256, zIndex: 91, boxShadow: "0 0 50px rgba(0,0,0,.35)" }}>
            <EdRail activeId={activeId} onNav={(id) => { openProgram(id); setMobileNav(false); }} collapsed={false} onToggle={() => setMobileNav(false)} items={railItems} />
          </div>
        </div>
      )}
    </div>
    {!mobileNav && <AiAssistant />}
    {route.page === "dash" && ReactDOM.createPortal((
      <div style={{ position: "fixed", right: 179, bottom: 14, zIndex: 60 }}>
        {dashMenu && (
          <div style={{ position: "absolute", bottom: 42, right: 0, width: 244, background: "var(--card)", border: "1px solid var(--line)", borderRadius: 12, boxShadow: "0 10px 34px rgba(0,15,71,.16)", padding: 7, fontFamily: "var(--sans)" }}>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 0.2, color: "var(--muted)", padding: "7px 9px 5px" }}>Dashboard sample</div>
            {[{ id: "1", l: "Dashboard sample 1", d: "Profile on sidebar — clean center" }, { id: "2", l: "Dashboard sample 2", d: "Compact top — programs up front" }, { id: "3", l: "Dashboard sample 3", d: "Profile card in center — original" }, { id: "4", l: "Dashboard sample 4", d: "Cards show task & report counts" }, { id: "5", l: "Dashboard sample 5", d: "Alert bar above the buttons" }].map((o) => {
              const on = dashSample === o.id;
              return (
                <button key={o.id} onClick={() => { setSample(o.id); setDashMenu(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 9px", borderRadius: 8, border: "none", background: on ? "color-mix(in srgb, var(--accent) 6%, transparent)" : "transparent", cursor: "pointer", textAlign: "left" }}>
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
        <button onClick={() => setDashMenu((v) => !v)} title="Switch dashboard sample"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, background: dashMenu ? "#fff" : "rgba(255,255,255,.72)", color: dashMenu ? "var(--primary)" : "var(--muted)", border: "1px solid var(--line)", borderRadius: 8, padding: "6px 11px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 500, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,15,71,.06)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", opacity: dashMenu ? 1 : 0.62, transition: "opacity .15s, color .15s, background .15s" }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.color = "var(--primary)"; }}
          onMouseLeave={(e) => { if (!dashMenu) { e.currentTarget.style.opacity = 0.62; e.currentTarget.style.color = "var(--muted)"; } }}>
          <I.panel size={14} /> Sample {dashSample}
        </button>
      </div>
    ), document.body)}
    {route.page === "tasks" && ReactDOM.createPortal((
      <div style={{ position: "fixed", right: 300, bottom: 14, zIndex: 60 }}>
        {layoutMenu && (
          <div style={{ position: "absolute", bottom: 42, right: 0, width: 248, background: "var(--card)", border: "1px solid var(--line)", borderRadius: 12, boxShadow: "0 10px 34px rgba(0,15,71,.16)", padding: 7, fontFamily: "var(--sans)" }}>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 0.2, color: "var(--muted)", padding: "7px 9px 5px" }}>Tasks layout</div>
            {[{ id: "standard", l: "Standard", d: "Centers, sequential & open sections" }, { id: "centers", l: "Multiple centers", d: "Standard layout, one card per center" }, { id: "gated", l: "Begin assessment", d: "Locked until you start, then unlocks" }, { id: "completed", l: "Completed", d: "Success — assessment submitted" }, { id: "error", l: "Error", d: "Something went wrong state" }, { id: "closed", l: "Closed", d: "Submission window has closed" }].map((o) => {
              const on = tasksLayout === o.id;
              return (
                <button key={o.id} onClick={() => { setLayout(o.id); setLayoutMenu(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 9px", borderRadius: 8, border: "none", background: on ? "color-mix(in srgb, var(--accent) 6%, transparent)" : "transparent", cursor: "pointer", textAlign: "left" }}>
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
        <button onClick={() => setLayoutMenu((v) => !v)} title="Switch tasks layout"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, background: layoutMenu ? "#fff" : "rgba(255,255,255,.72)", color: layoutMenu ? "var(--primary)" : "var(--muted)", border: "1px solid var(--line)", borderRadius: 8, padding: "6px 11px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 500, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,15,71,.06)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", opacity: layoutMenu ? 1 : 0.62, transition: "opacity .15s, color .15s, background .15s" }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.color = "var(--primary)"; }}
          onMouseLeave={(e) => { if (!layoutMenu) { e.currentTarget.style.opacity = 0.62; e.currentTarget.style.color = "var(--muted)"; } }}>
          <I.layers size={14} /> Layout
        </button>
      </div>
    ), document.body)}
    {route.page === "tasks" && ReactDOM.createPortal((
      <div style={{ position: "fixed", right: 179, bottom: 14, zIndex: 60 }}>
        {heroMenu && (
          <div style={{ position: "absolute", bottom: 42, right: 0, width: 230, background: "var(--card)", border: "1px solid var(--line)", borderRadius: 12, boxShadow: "0 10px 34px rgba(0,15,71,.16)", padding: 7, fontFamily: "var(--sans)" }}>
            <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 0.2, color: "var(--muted)", padding: "7px 9px 5px" }}>Card design</div>
            {[{ id: "compact", l: "Compact", d: "Title, badge & chips" }, { id: "light", l: "Light card", d: "Clean white, airy" }, { id: "minimal", l: "Minimal", d: "No box, editorial rules" }, { id: "minimal2", l: "Minimal 2", d: "Compact — colored stats" }, { id: "ribbon", l: "Ribbon", d: "Slim band, gold ring & stats" }].map((o) => {
              const on = heroStyle === o.id;
              return (
                <button key={o.id} onClick={() => { setHero(o.id); setHeroMenu(false); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 9px", borderRadius: 8, border: "none", background: on ? "color-mix(in srgb, var(--accent) 6%, transparent)" : "transparent", cursor: "pointer", textAlign: "left" }}>
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
        <button onClick={() => setHeroMenu((v) => !v)} title="Search for different card designs"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, background: heroMenu ? "#fff" : "rgba(255,255,255,.72)", color: heroMenu ? "var(--primary)" : "var(--muted)", border: "1px solid var(--line)", borderRadius: 8, padding: "6px 11px", fontFamily: "var(--sans)", fontSize: 14, fontWeight: 500, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,15,71,.06)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", opacity: heroMenu ? 1 : 0.62, transition: "opacity .15s, color .15s, background .15s" }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.color = "var(--primary)"; }}
          onMouseLeave={(e) => { if (!heroMenu) { e.currentTarget.style.opacity = 0.62; e.currentTarget.style.color = "var(--muted)"; } }}>
          <I.panel size={14} /> Card design
        </button>
      </div>
    ), document.body)}
    </React.Fragment>
  );
}

window.DashEditorial = DashEditorial;
// The Manager workspace reuses the very same rail.
window.EdShell = { EdRail, EdFooter };
