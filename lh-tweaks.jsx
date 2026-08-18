// ════════════════════════════════════════════════
//  Lighthouse Tweaks — theme/color switcher shared by all pages.
//  Overrides the brand CSS vars (--accent / --action / --canvas)
//  live on :root. Persists via useTweaks.
// ════════════════════════════════════════════════

// Floating launcher so Tweaks can be opened from inside the prototype itself
// (not only the host toolbar). Sits in the bottom-right corner; the "All
// directions" chip is shifted left to sit beside it.
const LH_FAB_CSS = `
.lh-tweak-fab{position:fixed;right:14px;bottom:14px;z-index:61;width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:8px;background:rgba(255,255,255,.9);color:#6D6B66;border:1px solid rgba(0,15,71,.12);box-shadow:0 2px 8px rgba(0,15,71,.06);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);cursor:pointer;transition:all .15s ease;}
.lh-tweak-fab:hover{color:#000F47;background:#fff;border-color:rgba(0,15,71,.2);}
/* Demo switch (bottom-left) to preview the global "no internet" state. */
.lh-net-fab{position:fixed;left:50%;transform:translateX(-50%);bottom:58px;z-index:3001;display:inline-flex;align-items:center;gap:7px;border-radius:8px;background:rgba(255,255,255,.9);color:#6D6B66;border:1px solid rgba(0,15,71,.12);box-shadow:0 2px 8px rgba(0,15,71,.06);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);cursor:pointer;font-family:var(--sans,system-ui,sans-serif);font-size:13px;font-weight:600;padding:8px 12px;opacity:.55;transition:opacity .15s ease,color .15s ease,background .15s ease,border-color .15s ease;}
.lh-net-fab:hover{opacity:1;color:#000F47;background:#fff;border-color:rgba(0,15,71,.2);}
.lh-net-fab.on{opacity:1;color:#B4231F;border-color:rgba(180,35,31,.4);background:#fff;}
.lh-net-overlay{position:fixed;inset:0;z-index:3000;display:flex;align-items:flex-start;justify-content:center;padding:64px 28px 28px;overflow-y:auto;background:var(--canvas,#F7F3EE);animation:lh-net-fade .22s ease-out;}
@keyframes lh-net-fade{from{opacity:0}to{opacity:1}}
/* Offline skeletons for the shell chrome (it can't load without a connection). */
.lh-skel{animation:lh-skel-pulse 1.4s ease-in-out infinite;}
@keyframes lh-skel-pulse{0%,100%{opacity:.45}50%{opacity:.85}}
`;

// Read-only reference: the active brand's DARK-mode palette (dark mode is a fixed
// derived palette, not editable in Tweaks — this mirrors DESIGN.md §9 so the codes
// can be eyeballed in-app). Updates live when the brand chip changes.
function DarkPaletteRef() {
  const [brand, setBrand] = React.useState(() => (typeof window !== "undefined" && window.LHBrand) ? window.LHBrand.current() : "marsh");
  React.useEffect(() => {
    const f = () => setBrand((window.LHBrand && window.LHBrand.current()) || "marsh");
    window.addEventListener("lh-brand-change", f);
    return () => window.removeEventListener("lh-brand-change", f);
  }, []);
  // Per-brand dark values (must match client-brand.js varsDark / lh-tweaks dark branch).
  const PER = {
    marsh:    { accent: "#7BA6FF", action: "#FFBF00", actionText: "#0B1220" },
    dge:      { accent: "#9DBBD8", action: "#81A0BD", actionText: "#0B1220" },
    generali: { accent: "#FF8A85", action: "#D23A34", actionText: "#FFFFFF" },
  };
  const p = PER[brand] || PER.marsh;
  const items = [
    ["Canvas", "#0B1220"], ["Card", "#151E30"],
    ["Deep panel", "#1E2C46"], ["Sky panel", "#1C2A44"],
    ["Text", "#E9EEF6"], ["Muted", "#A4B2C6"],
    ["Accent", p.accent], ["Rail", "#0B1526"],
    ["CTA fill", p.action], ["CTA text", p.actionText],
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7px 9px", marginTop: 3 }}>
      {items.map(([name, hex]) => (
        <div key={name} style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
          <span style={{ width: 18, height: 18, borderRadius: 5, flexShrink: 0, background: hex, boxShadow: "inset 0 0 0 .5px rgba(0,0,0,.35)" }} />
          <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.12, minWidth: 0 }}>
            <b style={{ fontSize: 9.5, fontWeight: 600, color: "rgba(41,38,27,.74)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</b>
            <i style={{ fontSize: 9, fontStyle: "normal", color: "rgba(41,38,27,.5)", fontVariantNumeric: "tabular-nums" }}>{hex.toUpperCase()}</i>
          </span>
        </div>
      ))}
    </div>
  );
}

function LighthouseTweaks() {
  const FOLIO = typeof window !== "undefined" && !!window.__LH_FOLIO;
  // Pages that opt out of the dark-mode feature entirely (e.g. the Assessor
  // workspace): no Theme control, no Dark-palette reference, and the palette is
  // pinned LIGHT even if lh-theme was set to "dark" elsewhere in the platform.
  const HIDE_DARK = typeof window !== "undefined" && !!window.__LH_HIDE_DARK;
  const DEFAULTS = { accent: "#0B4BFF", action: "#FFBF00", canvas: "#F7F3EE", heading: "Serif", primary: "#000F47", sidebar: "Midnight", align: (typeof document !== "undefined" && getComputedStyle(document.documentElement).getPropertyValue("--fol-mx").trim() === "auto") ? "Center" : "Left", theme: (typeof localStorage !== "undefined" && localStorage.getItem("lh-theme") === "dark") ? "Dark" : "Light", device: (typeof localStorage !== "undefined" && localStorage.getItem("lh-device")) || "Desktop" };
  const [t, setTweak] = useTweaks(DEFAULTS);
  // Demo toggle for the "no internet" failure state (previewed via the bottom
  // switch). Purely a prototype affordance — real apps would drive this from the
  // browser's online/offline events.
  const [offline, setOffline] = React.useState(false);
  // The "no internet" preview switch only belongs on the Development page. Track the
  // active page (published to <html data-lh-page> by the shell) and hide the switch —
  // and clear any active offline preview — everywhere else.
  const [lhPage, setLhPage] = React.useState(() => (typeof document !== "undefined" ? document.documentElement.getAttribute("data-lh-page") : null));
  const [devMode, setDevMode] = React.useState(() => (typeof document !== "undefined" ? document.documentElement.getAttribute("data-lh-devmode") : null));
  React.useEffect(() => {
    const read = () => { setLhPage(document.documentElement.getAttribute("data-lh-page")); setDevMode(document.documentElement.getAttribute("data-lh-devmode")); };
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-lh-page", "data-lh-devmode"] });
    return () => mo.disconnect();
  }, []);
  // Only the main Development page (the choose screen) shows the switch — not the
  // landing / report / questions / plan sub-pages.
  const onDevPage = lhPage === "development" && devMode === "choose";
  React.useEffect(() => { if (!onDevPage) setOffline(false); }, [onDevPage]);
  // The offline message covers only the content area — the cached shell (left rail
  // + top bar) stays visible. Track the content region so the panel matches it.
  const [netRect, setNetRect] = React.useState(null);
  React.useEffect(() => {
    if (!offline) { setNetRect(null); return; }
    const measure = () => {
      const el = document.querySelector(".ed-content") || document.querySelector("#root main") || document.querySelector("main");
      if (!el) { setNetRect(null); return; }
      const r = el.getBoundingClientRect();
      setNetRect({ left: Math.round(r.left), top: Math.round(r.top), width: Math.round(r.width), height: Math.round(r.height) });
    };
    measure();
    window.addEventListener("resize", measure);
    const id = window.setInterval(measure, 400); // catch rail collapse / layout shifts
    return () => { window.removeEventListener("resize", measure); window.clearInterval(id); };
  }, [offline]);

  // Re-run color effects when the client brand chip changes (client-brand.js)
  const [brandTick, setBrandTick] = React.useState(0);

  // Border radius (shared global control via window.LHRadius). null = default.
  const [radius, setRadius] = React.useState(() => {
    const v = (typeof window !== "undefined" && window.LHRadius) ? window.LHRadius.get() : null;
    return v == null ? null : v;
  });
  React.useEffect(() => {
    const h = (e) => setRadius(e.detail == null ? null : e.detail);
    window.addEventListener("lh-radius-change", h);
    return () => window.removeEventListener("lh-radius-change", h);
  }, []);
  const radiusVal = radius == null ? ((typeof window !== "undefined" && window.LHRadius) ? window.LHRadius.DEFAULT : 8) : radius;
  React.useEffect(() => {
    const f = () => setBrandTick((n) => n + 1);
    window.addEventListener("lh-brand-change", f);
    return () => window.removeEventListener("lh-brand-change", f);
  }, []);

  // Track light/dark so the colour + rail effects can apply the dark palette.
  // Works for Folio (Tweaks Appearance control) and Boardroom (top-bar toggle),
  // since both dispatch lh-theme-change and stamp data-theme on <html>.
  // Init from the persisted lh-theme (source of truth both shells write) rather than
  // data-theme — the shells stamp data-theme in a post-mount effect, which can run
  // AFTER this component renders, so reading data-theme here races to "light" and the
  // dark inline palette (--primary/--canvas/--accent) never applies on a fresh load.
  // Auth pages (Login / Sign up / Forgot password) are ALWAYS light — dark mode is an
  // in-app (post-login) feature only. So even if the persisted lh-theme is "dark"
  // (set while inside the app), logging out lands on a light login screen.
  const isAuthPage = typeof document !== "undefined" && !!document.querySelector(".lg-split");
  const forceLight = isAuthPage || HIDE_DARK;
  const [themeMode, setThemeMode] = React.useState(() => {
    if (forceLight) return "light";
    try { if (localStorage.getItem("lh-theme") === "dark") return "dark"; } catch (e) {}
    return (typeof document !== "undefined" && document.documentElement.getAttribute("data-theme") === "dark") ? "dark" : "light";
  });
  React.useEffect(() => {
    if (forceLight) {
      // Never dark on auth pages; also clear any stray data-theme so no dark CSS applies.
      document.documentElement.removeAttribute("data-theme");
      setThemeMode("light");
      return;
    }
    // Reconcile once on mount in case data-theme/localStorage settled after first render.
    let settled = "light";
    try { settled = localStorage.getItem("lh-theme") === "dark" ? "dark" : "light"; } catch (e) {}
    if (document.documentElement.getAttribute("data-theme") === "dark") settled = "dark";
    setThemeMode(settled);
    const h = (e) => setThemeMode(e.detail === "dark" ? "dark" : "light");
    window.addEventListener("lh-theme-change", h);
    return () => window.removeEventListener("lh-theme-change", h);
  }, []);

  React.useEffect(() => {
    const r = document.documentElement.style;
    const dark = themeMode === "dark";
    // Canvas is dark for every brand in dark mode (else the Tweaks value).
    r.setProperty("--canvas", dark ? "#0B1220" : t.canvas);
    // When a client brand (DGE / Generali) is active it owns the color vars
    // (client-brand.js, which is also dark-aware).
    if (window.LHBrand && window.LHBrand.current() !== "marsh") return;
    if (dark) {
      // Marsh dark palette: light emphasis text, brighter accent, gold CTA kept.
      r.setProperty("--primary", "#DCE6F8");   // headings / emphasis text on dark
      r.setProperty("--accent", "#7BA6FF");    // links / active — AA on dark card
      r.setProperty("--action", "#FFBF00");    // gold reads well on dark
      r.setProperty("--action-text", "#0B1220");
      return;
    }
    r.setProperty("--accent", t.accent);
    r.setProperty("--action", t.action);
    r.setProperty("--primary", t.primary);
    // Keep the CTA label legible: dark fills (e.g. Blue-1000 Midnight) get white text,
    // light fills (Gold, Sky, etc.) keep midnight text.
    const hex = String(t.action || "").replace("#", "");
    const h6 = hex.length === 3 ? hex.replace(/./g, (c) => c + c) : hex.padEnd(6, "0");
    const n = parseInt(h6.slice(0, 6), 16);
    const isDark = !Number.isNaN(n) && (((n >> 16 & 255) * 299 + (n >> 8 & 255) * 587 + (n & 255) * 114) / 1000) < 150;
    r.setProperty("--action-text", isDark ? "#FFFFFF" : "#000F47");
  }, [t.accent, t.action, t.canvas, t.primary, brandTick, themeMode]);

  // Heading typeface: Marsh Serif (display) ⇄ Noto Sans (sans-serif). Headings use
  // the .serif class, which reads --heading-family / --heading-weight from :root.
  React.useEffect(() => {
    const r = document.documentElement.style;
    if (t.heading === "Sans") {
      r.setProperty("--heading-family", '"Noto Sans", system-ui, -apple-system, sans-serif');
      r.setProperty("--heading-weight", "600");
    } else {
      r.setProperty("--heading-family", '"Marsh Serif", Georgia, "Times New Roman", serif');
      r.setProperty("--heading-weight", "400");
    }
  }, [t.heading]);

  // Side menu (rail) theme: Midnight (default) ⇄ White. Drives the --rail-* vars.
  // Foreground contrast is held to WCAG 2.1 AA against the rail fill: labels are
  // white on a dark rail (Marsh midnight / Generali red) but flip to dark ink when
  // a client brand paints the rail in a LIGHT primary (e.g. DGE steel #81A0BD),
  // where white text would only reach ~2.7:1. Opacities are raised so nav labels,
  // icons and group headers all clear AA (group headers at .5 were ~4.4:1).
  React.useEffect(() => {
    const r = document.documentElement.style;
    const set = (o) => Object.entries(o).forEach(([k, v]) => r.setProperty(k, v));
    if (themeMode === "dark") {
      // Dark mode: every brand gets a dark rail with light text; the active
      // icon takes a light tint of the brand accent. All values AA on the fill.
      const brand = (window.LHBrand && window.LHBrand.current()) || "marsh";
      const activeIcon = brand === "generali" ? "#FF8A85" : brand === "dge" ? "#9DBBD8" : "#A9C7F0";
      set({ "--rail-bg": "#0B1526", "--rail-fg": "rgba(255,255,255,.82)", "--rail-icon": "rgba(255,255,255,.75)", "--rail-active-bg": "rgba(255,255,255,.14)", "--rail-active-fg": "#ffffff", "--rail-active-icon": activeIcon, "--rail-group": "rgba(255,255,255,.7)", "--rail-border": "rgba(255,255,255,.1)", "--rail-logo-white": "block", "--rail-logo-dark": "none" });
      return;
    }
    if (t.sidebar === "White") {
      set({ "--rail-bg": "#FFFFFF", "--rail-fg": "var(--primary)", "--rail-icon": "var(--primary)", "--rail-active-bg": "rgba(11,75,255,.08)", "--rail-active-fg": "#000F47", "--rail-active-icon": "#0B4BFF", "--rail-group": "#6B6A64", "--rail-border": "rgba(0,15,71,.14)", "--rail-logo-white": "none", "--rail-logo-dark": "block" });
      return;
    }
    // Midnight preset: rail fill = --primary. Pick a foreground that passes AA on it.
    const primary = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim() || "#000F47";
    const toRGB = (h) => { h = h.replace("#", ""); if (h.length === 3) h = h.replace(/./g, (c) => c + c); const n = parseInt(h.slice(0, 6), 16); return Number.isNaN(n) ? [0, 15, 71] : [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
    const relLum = (c) => { const s = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * s[0] + 0.7152 * s[1] + 0.0722 * s[2]; };
    // Crossover luminance where dark ink beats white for contrast is ~0.18;
    // above it (DGE steel ≈0.335) white text fails, so use dark ink.
    if (relLum(toRGB(primary)) > 0.18) {
      // Light rail (DGE steel): dark ink foreground — AA on the light primary fill.
      set({ "--rail-bg": "var(--primary)", "--rail-fg": "rgba(0,15,71,.86)", "--rail-icon": "rgba(0,15,71,.74)", "--rail-active-bg": "rgba(0,15,71,.14)", "--rail-active-fg": "#000F47", "--rail-active-icon": "#000F47", "--rail-group": "rgba(0,15,71,.86)", "--rail-border": "rgba(0,15,71,.20)", "--rail-logo-white": "none", "--rail-logo-dark": "block" });
    } else {
      // Dark rail (Marsh midnight / Generali red): white foreground, raised opacities.
      // Group opacity is set for the *lighter* dark brand (Generali red ≈0.095 luminance):
      // sky at .72 was only 3.6:1 on red, so it's raised to .9 (passes on red and midnight).
      set({ "--rail-bg": "var(--primary)", "--rail-fg": "rgba(255,255,255,.8)", "--rail-icon": "rgba(255,255,255,.75)", "--rail-active-bg": "rgba(206,236,255,.16)", "--rail-active-fg": "#ffffff", "--rail-active-icon": "#CEECFF", "--rail-group": "rgba(206,236,255,.9)", "--rail-border": "rgba(255,255,255,.12)", "--rail-logo-white": "block", "--rail-logo-dark": "none" });
    }
  }, [t.sidebar, brandTick, themeMode]);

  // Content alignment: Left (default) ⇄ Center. Drives --fol-mx (0 vs auto) on every
  // Folio content container so the whole platform aligns left or centres in the area
  // to the right of the side menu.
  React.useEffect(() => {
    document.documentElement.style.setProperty("--fol-mx", t.align === "Center" ? "auto" : "0");
  }, [t.align]);

  // Folio-only: Dark mode (filter-based, covers every inline color) + device preview.
  React.useEffect(() => {
    if (!FOLIO) return;
    const m = t.theme === "Dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", m);
    try { localStorage.setItem("lh-theme", m); } catch (e) {}
    window.dispatchEvent(new CustomEvent("lh-theme-change", { detail: m }));
  }, [t.theme, FOLIO]);
  React.useEffect(() => {
    if (!FOLIO) return;
    const h = (e) => setTweak("theme", e.detail === "dark" ? "Dark" : "Light");
    window.addEventListener("lh-theme-change", h);
    return () => window.removeEventListener("lh-theme-change", h);
  }, [FOLIO]);
  React.useEffect(() => {
    const d = (t.device || "Desktop").toLowerCase();
    document.documentElement.setAttribute("data-device", d);
    try { localStorage.setItem("lh-device", t.device || "Desktop"); } catch (e) {}
  }, [t.device]);

  return (
    <React.Fragment>
      <style>{LH_FAB_CSS}</style>
      {ReactDOM.createPortal(
      <button className="lh-tweak-fab" title="Tweaks — change colors & fonts" aria-label="Open Tweaks"
        onClick={() => window.postMessage({ type: "__activate_edit_mode" }, "*")}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
          <path d="M19.4 13a7.6 7.6 0 0 0 0-2l2-1.5-2-3.4-2.3 1a7.6 7.6 0 0 0-1.7-1l-.3-2.5h-4l-.3 2.5a7.6 7.6 0 0 0-1.7 1l-2.3-1-2 3.4L4.6 11a7.6 7.6 0 0 0 0 2l-2 1.5 2 3.4 2.3-1a7.6 7.6 0 0 0 1.7 1l.3 2.5h4l.3-2.5a7.6 7.6 0 0 0 1.7-1l2.3 1 2-3.4z" />
        </svg>
      </button>, document.body)}
      {/* Demo switch + the "no internet" overlay it previews — Development page only. */}
      {onDevPage && ReactDOM.createPortal(
      <button className={"lh-net-fab" + (offline ? " on" : "")} title="Preview the no-internet state" aria-pressed={offline}
        onClick={() => setOffline((v) => !v)}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" /><line x1="2" y1="2" x2="22" y2="22" />
        </svg>
        {offline ? "Back online" : "No internet"}
      </button>, document.body)}
      {/* Offline: the shell chrome can't load either — show it as skeleton wireframes. */}
      {offline && netRect && ReactDOM.createPortal(
      <React.Fragment>
        {/* left rail skeleton */}
        <div style={{ position: "fixed", left: 0, top: 0, width: netRect.left, bottom: 0, zIndex: 2999, background: "var(--surface-deep)", display: "flex", flexDirection: "column", gap: 13, padding: "22px 16px", boxSizing: "border-box", overflow: "hidden" }}>
          <div className="lh-skel" style={{ width: 42, height: 42, borderRadius: 11, background: "rgba(255,255,255,.14)", marginBottom: 10 }} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <div className="lh-skel" style={{ width: 20, height: 20, borderRadius: 6, background: "rgba(255,255,255,.13)", flexShrink: 0 }} />
              {netRect.left > 120 && <div className="lh-skel" style={{ flex: 1, height: 11, borderRadius: 6, background: "rgba(255,255,255,.10)" }} />}
            </div>
          ))}
          <div style={{ flex: 1 }} />
          <div className="lh-skel" style={{ width: "100%", height: 66, borderRadius: 12, background: "rgba(255,255,255,.09)" }} />
        </div>
        {/* top bar skeleton */}
        <div style={{ position: "fixed", left: netRect.left, top: 0, width: netRect.width, height: netRect.top, zIndex: 2999, background: "var(--canvas, #F7F3EE)", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, padding: "0 24px", boxSizing: "border-box" }}>
          <div className="lh-skel" style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(0,15,71,.08)" }} />
          <div className="lh-skel" style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(0,15,71,.08)" }} />
          <div className="lh-skel" style={{ width: 92, height: 36, borderRadius: 9, background: "rgba(0,15,71,.08)" }} />
        </div>
      </React.Fragment>, document.body)}
      {offline && ReactDOM.createPortal(
      <div className="lh-net-overlay" role="alert" aria-live="assertive"
        style={netRect ? { left: netRect.left, top: netRect.top, width: netRect.width, height: netRect.height, right: "auto", bottom: "auto" } : undefined}>
        <div style={{ textAlign: "center", maxWidth: 420, padding: "0 8px" }}>
          <div style={{ width: 116, height: 116, margin: "0 auto 26px", borderRadius: "50%", background: "rgba(0,15,71,.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="var(--primary, #000F47)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" /><line x1="2.5" y1="2.5" x2="21.5" y2="21.5" stroke="#B4231F" />
            </svg>
          </div>
          <h1 className="serif" style={{ fontSize: 30, color: "var(--primary, #000F47)", lineHeight: 1.12, margin: "0 0 12px" }}>No internet connection</h1>
          <p style={{ fontFamily: "var(--sans, system-ui, sans-serif)", fontSize: 15, color: "var(--muted, #6D6B66)", lineHeight: 1.6, margin: "0 0 26px" }}>We can't reach Mercer Lighthouse right now. Check your connection and try again.</p>
          <button onClick={() => setOffline(false)} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--primary, #000F47)", color: "#fff", border: "none", borderRadius: 10, padding: "12px 22px", fontFamily: "var(--sans, system-ui, sans-serif)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 2.6-6.4" /><path d="M3 4v5h5" /></svg>
            Try again
          </button>
        </div>
      </div>, document.body)}
      {ReactDOM.createPortal((
      <TweaksPanel title="Tweaks">
      {<React.Fragment>
        <TweakSection label="Device preview" />
        <TweakRadio label="Screen" value={t.device}
          options={["Desktop", "iPad", "Mobile"]}
          onChange={(v) => setTweak("device", v)} />
      </React.Fragment>}
      <TweakSection label="Content alignment" />
      <TweakRadio label="Layout" value={t.align}
        options={["Left", "Center"]}
        onChange={(v) => setTweak("align", v)} />
      {FOLIO && <React.Fragment>
        <TweakSection label="Appearance" />
        <TweakRadio label="Theme" value={t.theme}
          options={["Light", "Dark"]}
          onChange={(v) => setTweak("theme", v)} />
      </React.Fragment>}
      <TweakSection label="Heading font" />
      <TweakRadio label="Typeface" value={t.heading}
        options={["Serif", "Sans"]}
        onChange={(v) => setTweak("heading", v)} />
      {/* Swatch labels use the Marsh colour-guideline token names (scale 1000→250)
          so each Tweak maps 1:1 to a design token — the name shows on hover. */}
      <TweakSection label="Accent" />
      <TweakColor label="Primary" value={t.primary}
        options={[
          { value: "#000F47", label: "Blue-1000 · Midnight Blue" },
          { value: "#5E017F", label: "Purple-1000" },
          { value: "#2F7500", label: "Green-1000" },
          { value: "#3D3C37", label: "Neutral-1000" },
        ]}
        onChange={(v) => setTweak("primary", v)} />
      <TweakColor label="Highlights" value={t.accent}
        options={[
          { value: "#0B4BFF", label: "Blue-750" },
          { value: "#8F20DE", label: "Purple-750" },
          { value: "#2F7500", label: "Green-1000" },
          { value: "#CB7E03", label: "Gold-1000" },
          { value: "#000F47", label: "Blue-1000 · Midnight Blue" },
        ]}
        onChange={(v) => setTweak("accent", v)} />
      <TweakSection label="Action button" />
      <TweakColor label="CTA fill" value={t.action}
        options={[
          { value: "#FFBF00", label: "Gold-750" },
          { value: "#000F47", label: "Blue-1000 · Midnight Blue" },
          { value: "#CEECFF", label: "Blue-250 · Sky Blue" },
          { value: "#DFECD7", label: "Green-250" },
          { value: "#FFD98A", label: "Gold-500" },
        ]}
        onChange={(v) => setTweak("action", v)} />
      <TweakSection label="Surface" />
      <TweakColor label="Canvas" value={t.canvas}
        options={[
          { value: "#F7F3EE", label: "Neutral-250 · Cream" },
          { value: "#FFFFFF", label: "White" },
        ]}
        onChange={(v) => setTweak("canvas", v)} />
      <TweakSection label="Side menu" />
      <TweakRadio label="Background" value={t.sidebar}
        options={["Midnight", "White"]}
        onChange={(v) => setTweak("sidebar", v)} />
      {/* Read-only reference to the fixed dark palette (see DESIGN.md §9).
          Hidden on pages that opt out of dark mode (HIDE_DARK). */}
      {!HIDE_DARK && <React.Fragment>
        <TweakSection label="Dark palette · reference" />
        <div style={{ fontSize: 9.5, color: "rgba(41,38,27,.5)", margin: "-4px 0 1px" }}>
          Read-only · active brand · applied in dark mode · WCAG AA
        </div>
        <DarkPaletteRef />
      </React.Fragment>}
      <TweakSection label="Border radius" />
      <TweakSlider label="Corners" value={radiusVal} min={0} max={20} step={1} unit="px"
        onChange={(v) => { if (window.LHRadius) window.LHRadius.set(v); }} />
      {radius != null && (
        <TweakButton label="Reset to default" secondary
          onClick={() => { if (window.LHRadius) window.LHRadius.reset(); }} />
      )}
      </TweaksPanel>
      ), document.body)}
    </React.Fragment>
  );
}

window.LighthouseTweaks = LighthouseTweaks;
