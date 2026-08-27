// LIGHTHOUSE — ASSESSOR (Editorial)
// Built on V5 Editorial design language: DM Sans, navy/teal palette, content-first separators,
// uppercase eyebrow labels, large display typography, radius 4, #FAFAFA bg.
// Functional scope: Dashboard → Candidate → Evaluate → Moderate, with right-rail drawers,
// pinned left column, single-competency view, N/A toggle, 3 narrative boxes, I Agree pattern.

function AssessorEditorial() {
  const { useState, useEffect, useRef, useMemo } = React;

  // ═══════ TOKENS (Folio · Accessor Flow 2026) ═══════
  const navy = "#000F47";               // midnight — primary brand
  const teal = "#0B4BFF";               // accent blue — links, active, rings, progress
  const gold = "#0B4BFF";               // action — primary CTA fill (blue, white text). Was gold #FFBF00.
  const goldDark = "#0A3FD6";           // CTA hover (darker blue)
  const tealBg = `${teal}14`;
  const navyBg = `${navy}0D`;
  const bg = "#F7F3EE";                  // cream canvas
  const bg2 = "#EDE7DE";
  const sbBg = "#F1EBE3";
  const card = "#FFFFFF";
  const tx = "#1B2856";                 // ink — body (Folio color-mix primary 88%)
  const ts = "#333F6B";                 // secondary body
  const tm = "#47527B";                 // muted / captions (Folio muted, WCAG-darkened)
  const tf = "rgba(0,15,71,.4)";       // faint — placeholders, em-dashes (Folio navy-tinted)
  const bd = "rgba(0,15,71,.11)";
  const bdStrong = "rgba(0,15,71,.17)";
  const green = "#14853D";
  const red = "#C53532";
  const orange = "#C07A12";
  const warn = "#CB7E03";
  const purple = "#8F20DE";
  const purpleBg = "rgba(143,32,222,.08)";
  const f = "'Noto Sans',system-ui,-apple-system,sans-serif";
  const serif = "'Marsh Serif',Georgia,'Times New Roman',serif";

  // Folio radii
  const cr = 8, br = 8, sr = 8, ir = 6;

  const eSep = {borderTop:`1px solid ${bd}`,paddingTop:24,marginBottom:32};

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap');
    *{margin:0;padding:0;box-sizing:border-box}
    html,body,#root{height:100%;background:${bg};font-family:${f};color:${tx};-webkit-font-smoothing:antialiased}
    @keyframes fin{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
    @keyframes fade{from{opacity:0}to{opacity:1}}
    @keyframes spin{to{transform:rotate(360deg)}}
    .an{animation:fade .3s ease both}
    .an1{animation:fin .4s ease both}
    .an2{animation:fin .4s ease .08s both}
    .an3{animation:fin .4s ease .16s both}
    .an4{animation:fin .4s ease .24s both}
    .slin{animation:slIn .28s cubic-bezier(.2,.8,.2,1) both}
    ::-webkit-scrollbar{width:6px;height:6px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:${navy}14;border-radius:3px}
    *:focus-visible{outline:2px solid ${teal};outline-offset:2px;border-radius:${ir}px}
    button{font-family:${f};border:none;background:none;cursor:pointer;color:inherit}
    input,textarea,select{font-family:${f}}
    .tnum{font-variant-numeric:tabular-nums}
    .elide{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    tr.rh:hover td{background:${navyBg}}
    .row-arrow{position:absolute;right:12px;top:50%;transform:translateY(-50%);color:${tm};display:inline-flex;align-items:center;pointer-events:none}
    .rh-link:hover{background:${navyBg}}
    .link{color:${navy};cursor:pointer;text-decoration:none}
    .link:hover{text-decoration:underline}
    .eyebrow{font-size:14px;font-weight:700;letter-spacing:0;text-transform:none;color:${tm}}
    .display{font-family:${serif};font-size:40px;font-weight:400;letter-spacing:-.01em;line-height:1.04;color:${navy}}
    .h1{font-family:${serif};font-size:26px;font-weight:400;letter-spacing:-.01em;line-height:1.1;color:${navy}}
    .h2{font-family:${serif};font-size:20px;font-weight:400;letter-spacing:-.005em;color:${navy}}
    .h3{font-size:14px;font-weight:700;color:${tx}}
    .tag{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;font-size:14px;font-weight:600;letter-spacing:0;border-radius:3px}
    .dot{width:6px;height:6px;border-radius:3px;flex-shrink:0}
    .row-bb{border-bottom:1px solid ${bd}}
    .btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;font-size:14px;font-weight:600;border-radius:${br}px;cursor:pointer;transition:all .15s}
    .btn-primary{background:${gold};color:#fff;font-weight:700}
    .btn-primary:hover{background:${goldDark}}
    .btn-secondary{background:${card};color:${tx};border:1px solid ${bd}}
    .btn-secondary:hover{border-color:${bdStrong}}
    .btn-ghost{background:transparent;color:${tx}}
    .btn-ghost:hover{background:${navyBg}}
    .pill{display:inline-flex;align-items:center;gap:5px;font-size:14px;font-weight:500;color:${tx}}
    .rule{border:none;border-top:1px solid ${bd};margin:28px 0}
    [data-screen-label]{scroll-margin-top:16px}
    .ex-head .ex-tip{opacity:0;visibility:hidden;transition:opacity .12s;transition-delay:0s}
    .ex-head:hover .ex-tip{opacity:1;visibility:visible;transition-delay:.15s}
    main.no-sb::-webkit-scrollbar,.no-sb::-webkit-scrollbar{width:0;height:0}
    main.no-sb,.no-sb{scrollbar-width:none;-ms-overflow-style:none}
  `;

  // ═══════ ICONS ═══════
  const I = {
    Search:(p)=><svg width={p?.s||16} height={p?.s||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>,
    Sort:(p)=><svg width={p?.s||12} height={p?.s||12} viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5-5 5 5z" opacity=".5"/><path d="M7 14l5 5 5-5z" opacity=".5"/></svg>,
    Users:(p)=><svg width={p?.s||18} height={p?.s||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    Cal:(p)=><svg width={p?.s||18} height={p?.s||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>,
    Dash:(p)=><svg width={p?.s||18} height={p?.s||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>,
    Bell:(p)=><svg width={p?.s||16} height={p?.s||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
    Eye:(p)=><svg width={p?.s||16} height={p?.s||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    Globe:(p)=><svg width={p?.s||14} height={p?.s||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 014 10 15 15 0 01-4 10 15 15 0 01-4-10 15 15 0 014-10z"/></svg>,
    Down:(p)=><svg width={p?.s||11} height={p?.s||11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>,
    Chev:(p)=><svg width={p?.s||14} height={p?.s||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{transform:`rotate(${p?.r||0}deg)`,transition:"transform .15s"}}><path d="m9 18 6-6-6-6"/></svg>,
    Menu:(p)=><svg width={p?.s||18} height={p?.s||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>,
    Gear:(p)=><svg width={p?.s||16} height={p?.s||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    Filter:(p)=><svg width={p?.s||14} height={p?.s||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5h18l-7 8v6l-4-2v-4z"/></svg>,
    Alert:(p)=><svg width={p?.s||15} height={p?.s||15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><circle cx="12" cy="16" r=".6" fill="currentColor" stroke="none"/></svg>,
    CheckCircle:(p)=><svg width={p?.s||15} height={p?.s||15} viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><path d="M17 9l-5.5 5.5L8 11" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    X:(p)=><svg width={p?.s||14} height={p?.s||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>,
    Check:(p)=><svg width={p?.s||14} height={p?.s||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={p?.style}><path d="M20 6 9 17l-5-5"/></svg>,
    Play:(p)=><svg width={p?.s||14} height={p?.s||14} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>,
    Doc:(p)=><svg width={p?.s||16} height={p?.s||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>,
    Edit:(p)=><svg width={p?.s||14} height={p?.s||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    Back:(p)=><svg width={p?.s||14} height={p?.s||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>,
    Info:(p)=><svg width={p?.s||13} height={p?.s||13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>,
    Dots:(p)=><svg width={p?.s||16} height={p?.s||16} viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/></svg>,
    User:(p)=><svg width={p?.s||18} height={p?.s||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/></svg>,
    Chart:(p)=><svg width={p?.s||18} height={p?.s||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m7 15 3-3 4 4 6-7"/></svg>,
    Report:(p)=><svg width={p?.s||18} height={p?.s||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></svg>,
    Clipboard:(p)=><svg width={p?.s||18} height={p?.s||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 12h6M9 16h4"/></svg>,
    Video:(p)=><svg width={p?.s||18} height={p?.s||18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="14" height="12" rx="2"/><path d="m22 8-6 4 6 4V8z"/></svg>,
    Funnel:(p)=><svg width={p?.s||13} height={p?.s||13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>,
    NoEntry:(p)=><svg width={p?.s||14} height={p?.s||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 14.14 14.14"/></svg>,
    Star:(p)=><svg width={p?.s||14} height={p?.s||14} viewBox="0 0 24 24" fill={p?.f||"none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    Sparkle:(p)=><svg width={p?.s||14} height={p?.s||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></svg>,
    Drag:(p)=><svg width={p?.s||10} height={p?.s||10} viewBox="0 0 10 10" fill="currentColor"><circle cx="3" cy="2" r="1"/><circle cx="7" cy="2" r="1"/><circle cx="3" cy="5" r="1"/><circle cx="7" cy="5" r="1"/><circle cx="3" cy="8" r="1"/><circle cx="7" cy="8" r="1"/></svg>,
    Flag:(p)=><svg width={p?.s||14} height={p?.s||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
    Save:(p)=><svg width={p?.s||14} height={p?.s||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
    Download:(p)=><svg width={p?.s||14} height={p?.s||14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  };

  // ═══════ RESPONSIVE ═══════
  const [vw, setVw] = useState(typeof window !== "undefined" ? window.innerWidth : 1440);
  useEffect(() => { const h=()=>setVw(window.innerWidth); window.addEventListener("resize",h); return ()=>window.removeEventListener("resize",h); }, []);
  const isNarrow = vw < 900;

  // ═══════ URL ROUTING ═══════ each page gets its own hash URL (deep-linkable, back/forward)
  const asParse = (path) => {
    const segs = (window.LHRoute ? LHRoute.norm(path) : "").split("/").filter(Boolean);
    const s0 = segs[0], r = { route: "home", subjectId: null, campaignId: null, acCampaignId: null, dashTab: "participant", candidateTab: "assessments", acDetailTab: "subjects" };
    if (!s0 || s0 === "home") return r;
    if (s0 === "dashboard") { r.route = "dashboard"; if (segs[1] === "campaigns") r.dashTab = "campaign"; return r; }
    if (s0 === "campaign") { r.route = "campaign"; r.campaignId = segs[1] || null; return r; }
    if (s0 === "candidate") {
      r.subjectId = segs[1] || null;
      const leaf = segs[2];
      if (leaf === "evaluate") r.route = "evaluate";
      else if (leaf === "moderate") r.route = "moderate";
      else { r.route = "candidate"; if (leaf === "recordings") r.candidateTab = leaf; }
      return r;
    }
    if (s0 === "assessment-centre") {
      if (segs[1]) { r.acCampaignId = segs[1]; r.route = "acCampaign"; if (["resources", "activities", "recordings"].includes(segs[2])) r.acDetailTab = segs[2]; }
      else r.route = "ac";
      return r;
    }
    return r;
  };
  const asInit = useMemo(() => (window.LHRoute ? asParse(LHRoute.get()) : { route: "home", subjectId: null, campaignId: null, acCampaignId: null, dashTab: "participant", candidateTab: "assessments", acDetailTab: "subjects" }), []);

  // ═══════ STATE ═══════
  const [route, setRoute] = useState(asInit.route); // home | dashboard | campaign | candidate | evaluate | moderate
  const [subjectId, setSubjectId] = useState(asInit.subjectId);
  const [campaignId, setCampaignId] = useState(asInit.campaignId);
  const [dashTab, setDashTab] = useState(asInit.dashTab); // participant | campaign
  const [entryPath, setEntryPath] = useState("participant"); // participant | campaign — affects breadcrumb
  const [candidateTab, setCandidateTab] = useState(asInit.candidateTab);
  const [toast, setToast] = useState("");
  const showToast = (m) => { setToast(m); setTimeout(()=>setToast(""), 2200); };
  const [openReport, setOpenReport] = useState(null);
  const [reportsTab, setReportsTab] = useState("main"); // "main" | "other"
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [newExp, setNewExp] = useState(true);
  // Assessment Center + Availability (Accessor Flow 2026)
  const [client, setClient] = useState("QA FINAL 2024 GAME ON");
  const [acTab, setAcTab] = useState("campaigns");   // campaigns | participants
  const [acSub, setAcSub] = useState("current");     // current | upcoming | past
  const [acCampaignId, setAcCampaignId] = useState(asInit.acCampaignId);
  const [acDetailTab, setAcDetailTab] = useState(asInit.acDetailTab); // subjects | resources | activities | recordings
  const [acDetailQ, setAcDetailQ] = useState("");
  const [acStatus, setAcStatus] = useState("Open");  // Open | Closed
  const [statusModal, setStatusModal] = useState(() => !!(window.LHRoute && LHRoute.getQuery("dialog") === "status"));

  // Sync route + ids to the URL hash so each page is its own shareable, back/forward URL.
  const asSynced = useRef(false);
  const asRouteToPath = () => {
    switch (route) {
      case "dashboard": return dashTab === "campaign" ? "dashboard/campaigns" : "dashboard";
      case "campaign": return campaignId ? "campaign/" + campaignId : "dashboard";
      case "candidate": {
        if (!subjectId) return "dashboard";
        const b = "candidate/" + subjectId;
        return candidateTab === "recordings" ? b + "/recordings" : b;
      }
      case "evaluate": return subjectId ? "candidate/" + subjectId + "/evaluate" : "dashboard";
      case "moderate": return subjectId ? "candidate/" + subjectId + "/moderate" : "dashboard";
      case "ac": return "assessment-centre";
      case "acCampaign": {
        if (!acCampaignId) return "assessment-centre";
        const b = "assessment-centre/" + acCampaignId;
        return (acDetailTab && acDetailTab !== "subjects") ? b + "/" + acDetailTab : b;
      }
      default: return "home";
    }
  };
  useEffect(() => {
    if (!window.LHRoute) return;
    const path = asRouteToPath();
    if (!asSynced.current) { asSynced.current = true; LHRoute.replace(path); }
    else LHRoute.push(path);
  }, [route, subjectId, campaignId, acCampaignId, dashTab, candidateTab, acDetailTab]);
  useEffect(() => {
    if (!window.LHRoute) return;
    return LHRoute.onPop(() => {
      const p = asParse(LHRoute.get());
      if (p.subjectId) setSubjectId(p.subjectId);
      if (p.campaignId) setCampaignId(p.campaignId);
      if (p.acCampaignId) setAcCampaignId(p.acCampaignId);
      setCandidateTab(p.candidateTab);
      setDashTab(p.dashTab);
      setAcDetailTab(p.acDetailTab);
      setRoute(p.route);
    });
  }, []);

  // ═══════ EVALUATE NOTES / TO-DO (floating pencil widget) ═══════
  const [notesOpen, setNotesOpen] = useState(() => !!(window.LHRoute && LHRoute.getQuery("notes") === "1"));
  const [notesTab, setNotesTab] = useState("notes"); // notes | todo
  const [notes, setNotes] = useState([]);            // {id, text, ts}
  const [noteDraft, setNoteDraft] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingNoteText, setEditingNoteText] = useState("");

  // Overlays are addressable: the report / status dialogs (?dialog=…) and the notes panel
  // (?notes=1). Back closes whatever's open; forward reopens it.
  useEffect(() => { if (window.LHRoute) window.LHRoute.setQuery("dialog", openReport ? "report" : statusModal ? "status" : null); }, [openReport, statusModal]);
  useEffect(() => { if (window.LHRoute) window.LHRoute.setQuery("notes", notesOpen ? "1" : null); }, [notesOpen]);
  useEffect(() => {
    if (!window.LHRoute) return;
    return window.LHRoute.onPop(() => {
      if (window.LHRoute.getQuery("dialog") == null) { setOpenReport(null); setStatusModal(false); }
      setNotesOpen(window.LHRoute.getQuery("notes") === "1");
    });
  }, []);
  const [todos, setTodos] = useState([]);            // {id, text, done}
  const [newTodo, setNewTodo] = useState("");
  const notesLoaded = useRef(false);
  const fmtTime = (ts) => new Date(ts).toLocaleString(undefined, { month:"short", day:"numeric", hour:"numeric", minute:"2-digit" });
  useEffect(() => {
    try {
      const n = localStorage.getItem("assessor-eval-notes-v2");
      const t = localStorage.getItem("assessor-eval-todos");
      if (n) setNotes(JSON.parse(n));
      if (t) setTodos(JSON.parse(t));
    } catch (e) {}
    notesLoaded.current = true;
  }, []);
  useEffect(() => { if (notesLoaded.current) { try { localStorage.setItem("assessor-eval-notes-v2", JSON.stringify(notes)); localStorage.setItem("assessor-eval-todos", JSON.stringify(todos)); } catch (e) {} } }, [notes, todos]);
  const addNote = () => {
    const v = noteDraft.trim();
    if (!v) return;
    setNotes(p => [{ id: Date.now(), text: v, ts: Date.now() }, ...p]);
    setNoteDraft("");
    showToast("Note added");
  };
  const saveNoteEdit = (id) => {
    const v = editingNoteText.trim();
    if (!v) { removeNote(id); } else { setNotes(p => p.map(n => n.id === id ? { ...n, text: v, ts: Date.now() } : n)); }
    setEditingNoteId(null); setEditingNoteText("");
    showToast("Note updated");
  };
  const removeNote = (id) => { setNotes(p => p.filter(n => n.id !== id)); if (editingNoteId === id) setEditingNoteId(null); };
  const addTodo = () => {
    const v = newTodo.trim();
    if (!v) return;
    setTodos(p => [...p, { id: Date.now(), text: v, done: false }]);
    setNewTodo("");
  };
  const toggleTodo = (id) => setTodos(p => p.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const removeTodo = (id) => setTodos(p => p.filter(t => t.id !== id));

  // ═══════ DATA (Generali DGE, production-level) ═══════
  const campaign = { project: "Generali DGE 2026", subtitle:"Senior Leadership Development Center", window:"02 Apr – 14 Jun 2026" };

  // Campaigns — 1 active (all 6 candidates) + 2 contextual siblings so the "By Campaign" view has structure.
  const campaigns = [
    { id:"DGE-2026-Q2", project:"Generali DGE 2026", subtitle:"Senior Leadership Development Center",
      client:"Generali Group", window:"02 Apr – 14 Jun 2026", status:"Active",
      owner:"Elena Accardi", candidateIds:["467088","467089","467090","467091","467092","467093"] },
    { id:"AXA-CEO-26", project:"AXA — CEO Succession Pool", subtitle:"Group Executive Committee pipeline",
      client:"AXA Group", window:"18 Mar – 28 May 2026", status:"Active",
      owner:"Elena Accardi", candidateIds:[] },
    { id:"ALZ-TALENT-26", project:"Allianz — Global Talent Review", subtitle:"High-potential succession center",
      client:"Allianz SE", window:"05 May – 30 Jun 2026", status:"Active",
      owner:"Elena Accardi", candidateIds:["467089","467091","467092"] },
    { id:"MUN-LDR-26", project:"Munich Re — Leadership Horizon", subtitle:"Director capability assessment",
      client:"Munich Re", window:"12 May – 10 Jul 2026", status:"Active",
      owner:"Marco Rossi", candidateIds:["467088","467090","467093"] },
    { id:"ZUR-ERB-25", project:"Zurich — EMEA Ring-fence Benchmark", subtitle:"Regional MD calibration",
      client:"Zurich Insurance", window:"Closed 14 Jan 2026", status:"Archived",
      owner:"Marco Rossi", candidateIds:[] },
  ];
  const activeCampaignId = "DGE-2026-Q2";

  const candidates = [
    { id:"467088", name:"Demo User", email:"demo+user02042026@tte.email",
      evalStatus:"In progress", evalDone:2, evalTotal:5,
      modStatus:"Not started", modDone:0, modTotal:1,
      lastActivity:"2h ago",
      profile:{ grade:"2", entity:"AAM", compliance:"1", lang:"English",
        targetRole:"Finance Director", currentRole:"Financial Reports Section Head", targetLevel:"Management",
        raven:"Raven 1"
      }
    },
    { id:"467089", name:"Alessandro Moretti", email:"a.moretti+02042026@tte.email",
      evalStatus:"Completed", evalDone:5, evalTotal:5,
      modStatus:"In progress", modDone:0, modTotal:1,
      lastActivity:"Yesterday",
      profile:{ grade:"3", entity:"GBS", compliance:"2", lang:"Italian",
        targetRole:"Regional Head of Operations", currentRole:"Operations Manager EMEA", targetLevel:"Senior Management",
        raven:"Raven 2"
      }
    },
    { id:"467090", name:"Sofia Bianchi", email:"s.bianchi+02042026@tte.email",
      evalStatus:"Not started", evalDone:0, evalTotal:5,
      modStatus:"Not started", modDone:0, modTotal:1,
      lastActivity:"4d ago",
      profile:{ grade:"2", entity:"AAM", compliance:"1", lang:"English",
        targetRole:"Head of Risk & Compliance", currentRole:"Senior Risk Analyst", targetLevel:"Management",
        raven:"Raven 1"
      }
    },
    { id:"467091", name:"Lukas Weber", email:"l.weber+02042026@tte.email",
      evalStatus:"In progress", evalDone:3, evalTotal:5,
      modStatus:"Not started", modDone:0, modTotal:1,
      lastActivity:"3h ago",
      profile:{ grade:"2", entity:"GCI", compliance:"1", lang:"German",
        targetRole:"Claims Operations Lead", currentRole:"Senior Claims Specialist", targetLevel:"Management",
        raven:"Raven 1"
      }
    },
    { id:"467092", name:"Marta Oliveira", email:"m.oliveira+02042026@tte.email",
      evalStatus:"Completed", evalDone:5, evalTotal:5,
      modStatus:"Completed", modDone:1, modTotal:1,
      lastActivity:"6d ago",
      profile:{ grade:"3", entity:"GAM", compliance:"2", lang:"Portuguese",
        targetRole:"Head of Digital Distribution", currentRole:"Digital Product Lead", targetLevel:"Senior Management",
        raven:"Raven 3"
      }
    },
    { id:"467093", name:"Priya Kapoor", email:"p.kapoor+02042026@tte.email",
      evalStatus:"In progress", evalDone:2, evalTotal:5,
      modStatus:"Not started", modDone:0, modTotal:1,
      lastActivity:"1h ago",
      profile:{ grade:"2", entity:"AAM", compliance:"1", lang:"English",
        targetRole:"Talent & Leadership Director", currentRole:"HR Business Partner", targetLevel:"Management",
        raven:"Raven 2"
      }
    },
  ];

  const assessments = [
    { id:"1682199", name:"1. Professional Experience", type:"Participant", status:"Completed", progress:1.0 },
    { id:"1682200", name:"Generali — BEI Assessor Form", type:"Assessor", status:"In Progress", progress:0.4 },
    { id:"1682203", name:"Generali — Peer Meeting Assessor Form", type:"Assessor", status:"Not Started", progress:0 },
  ];
  const reports = [
    { id:"1377888", name:"Generali Development Center Report", type:"Main Report", status:"Available", pages:6 },
    { id:"1377889", name:"Hogan Judgement Report", type:"Personality", status:"Not Available", pages:4 },
    { id:"1377890", name:"Hogan Flash", type:"Personality", status:"Available", pages:3 },
    { id:"1377891", name:"HBRI — Business Reasoning", type:"Cognitive", status:"Not Available", pages:4 },
  ];
  const mainReport = reports.find(r => r.type==="Main Report");
  const otherReports = reports.filter(r => r.type!=="Main Report");
  const recordings = [
    { id:"rec1", label:"Role Play — Direct Report Meeting", date:"Mon, 13 Apr · 15:48", dur:"12 min", exercise:"DR Meeting", acDate:"13th Apr 2026, 15:30", assessor:"Marco Rossi", participant:"Aisha Khan", transcript:true },
    { id:"rec2", label:"Role Play — Peer Meeting", date:"Mon, 13 Apr · 16:05", dur:"14 min", exercise:"Peer Meeting", acDate:"13th Apr 2026, 16:00", assessor:"Marco Rossi", participant:"Aisha Khan", transcript:true },
    { id:"rec3", label:"Case Study Defense", date:"Tue, 14 Apr · 10:30", dur:"18 min", exercise:"Case", acDate:"14th Apr 2026, 10:15", assessor:"Elena Conti", participant:"Aisha Khan", transcript:false },
    { id:"rec4", label:"BEI — Part 1", date:"Tue, 14 Apr · 11:15", dur:"22 min", exercise:"BEI", acDate:"14th Apr 2026, 11:00", assessor:"Elena Conti", participant:"Aisha Khan", transcript:true },
    { id:"rec5", label:"BEI — Part 2", date:"Tue, 14 Apr · 11:50", dur:"16 min", exercise:"BEI", acDate:"14th Apr 2026, 11:45", assessor:"Elena Conti", participant:"Aisha Khan", transcript:false },
    { id:"rec6", label:"Technical Interview", date:"Wed, 15 Apr · 09:00", dur:"24 min", exercise:"Tech Interview", acDate:"15th Apr 2026, 09:00", assessor:"David Park", participant:"Aisha Khan", transcript:true },
  ];

  // Generali competency framework (full 8)
  const competencies = [
    { id:"ST", name:"Strategic Thinker", def:"Analyses the external environment and sets long-term direction that connects unit work to Group strategy.", indicators:[
      { id:"ST1", label:"Reads market signals" },
      { id:"ST2", label:"Sets long-term direction" },
      { id:"ST3", label:"Connects unit to Group" },
      { id:"ST4", label:"Anticipates disruption" },
      { id:"ST5", label:"Prioritises investments" },
    ]},
    { id:"IDM", name:"Impactful Decision Maker", def:"Makes timely, sound decisions with incomplete information and owns the consequences.", indicators:[
      { id:"IDM1", label:"Timely calls under pressure" },
      { id:"IDM2", label:"Balances data & judgement" },
      { id:"IDM3", label:"Owns outcomes" },
      { id:"IDM4", label:"Escalates appropriately" },
    ]},
    { id:"IE", name:"Innovation Explorer", def:"Challenges the status quo; experiments with new business models and technologies.", indicators:[
      { id:"IE1", label:"Challenges status quo" },
      { id:"IE2", label:"Runs experiments" },
      { id:"IE3", label:"Applies new tech" },
      { id:"IE4", label:"Learns from failure" },
    ]},
    { id:"TE", name:"Transformation Enabler", def:"Leads change by aligning people, structure and processes to a clear future-state vision.", indicators:[
      { id:"TE1", label:"Creates change case" },
      { id:"TE2", label:"Engages stakeholders" },
      { id:"TE3", label:"Redesigns process" },
      { id:"TE4", label:"Builds momentum" },
      { id:"TE5", label:"Sustains new ways" },
    ]},
    { id:"CA", name:"Customer Advocate", def:"Places the customer at the centre of every decision and measures success by customer value.", indicators:[
      { id:"CA1", label:"Customer insight" },
      { id:"CA2", label:"Journey orientation" },
      { id:"CA3", label:"Value delivery" },
      { id:"CA4", label:"Closes the loop" },
    ]},
    { id:"RD", name:"Results Driver", def:"Sets ambitious yet achievable targets and drives relentless execution to deliver.", indicators:[
      { id:"RD1", label:"Ambitious targets" },
      { id:"RD2", label:"Execution discipline" },
      { id:"RD3", label:"Removes blockers" },
      { id:"RD4", label:"Accountability" },
    ]},
    { id:"TN", name:"Talent Nurturer", def:"Develops diverse talent, builds succession strength and cultivates a learning culture.", indicators:[
      { id:"TN1", label:"Identifies potential" },
      { id:"TN2", label:"Coaches for growth" },
      { id:"TN3", label:"Builds succession" },
      { id:"TN4", label:"Champions diversity" },
    ]},
    { id:"EC", name:"Effective Collaborator", def:"Builds trusted relationships across boundaries and mobilises teams around shared goals.", indicators:[
      { id:"EC1", label:"Cross-boundary work" },
      { id:"EC2", label:"Trust & candour" },
      { id:"EC3", label:"Conflict resolution" },
      { id:"EC4", label:"Shared ownership" },
    ]},
  ];

  // 5 DGE Executive Assessor Forms
  const assessorForms = [
    { short:"CBI", name:"DGE — Executive CBI AF", exercise:"Competency-Based Interview" },
    { short:"CASE", name:"DGE — Executive Case Study AF", exercise:"Business Case" },
    { short:"RP", name:"DGE — Executive Role Play AF", exercise:"Role Play (DR / Peer)" },
    { short:"TIG", name:"DGE — Executive Technical Interview Guide AF", exercise:"Technical Interview" },
    { short:"TRW", name:"DGE — Executive Technical Report Writing AF", exercise:"Report Writing" },
  ];

  // Scores per (indicator, form) — order matches assessorForms
  const scoreData = {
    "ST1":[4,4,4,4,4],   "ST2":[null,null,4,null,4], "ST3":[3.33,3.33,null,3.33,null], "ST4":[4,4,4,4,4], "ST5":[4,4,4,4,4],
    "IDM1":[3,3.5,3,4,3.5], "IDM2":[4,4,4,4,4], "IDM3":[3,3,3,3,3], "IDM4":[3,3,3,3,3],
    "IE1":[2,2,2,2,2], "IE2":[2,2.5,2,2,2], "IE3":[2,2,2,2,2], "IE4":[2,2,2,2,2],
    "TE1":[4,4,4,4,4], "TE2":[null,null,4,null,4], "TE3":[3.33,3.33,null,3.33,null], "TE4":[4,4,4,4,4], "TE5":[4,4,4,4,4],
    "CA1":[3,3,3,3,3.5], "CA2":[3,3,3,3,3], "CA3":[3,3,3,3,3], "CA4":[3,3.5,3,3,3],
    "RD1":[3,3,3,3,3], "RD2":[3,3,3,3,3], "RD3":[3,3,3,3,3.5], "RD4":[3,3,3,3,3],
    "TN1":[3.5,3.5,3,3.5,3], "TN2":[3,3,3,3,3], "TN3":[3.5,3.5,3.5,3,3], "TN4":[3,3,3,3,3],
    "EC1":[3,3,3,3,3], "EC2":[3,3,3,3,3], "EC3":[3,3,3,3,3.5], "EC4":[3,3,3,3,3],
  };

  const hoganScores = [
    { k:"Strategic Thinker", v:2 },
    { k:"Impactful Decision Maker", v:3 },
    { k:"Innovation Explorer", v:2 },
    { k:"Transformation Enabler", v:1 },
    { k:"Customer Advocate", v:1 },
    { k:"Results Driver", v:2 },
    { k:"Talent Nurturer", v:2 },
    { k:"Effective Collaborator", v:2 },
  ];
  const hoganTotal = 1.88;
  const competencyAvgs = [
    { k:"Strategic Thinker", v:3.11 },
    { k:"Impactful Decision Maker", v:3.29 },
    { k:"Innovation Explorer", v:2.94 },
    { k:"Transformation Enabler", v:3.00 },
    { k:"Customer Advocate", v:3.22 },
    { k:"Results Driver", v:3.11 },
    { k:"Talent Nurturer", v:3.34 },
    { k:"Effective Collaborator", v:3.05 },
  ];
  const acScores = [
    { k:"Transformation Enabler VLC", v:4.33 },
    { k:"Innovation Explorer VLC", v:1 },
    { k:"Results Driver VLC", v:3.58 },
    { k:"Talent Nurturer VLC", v:3.92 },
    { k:"Impactful Decision Maker VLC", v:3.42 },
    { k:"Strategic Thinker VLC", v:3.58 },
  ];

  const ravenText = {
    "Raven 1":[
      "Define the basic elements of most problems; may misperceive some key elements of complex situations.",
      "Find it challenging to recognise some evident relationships among complex events or ideas.",
      "Miss opportunities to integrate information from a variety of perspectives when developing arguments.",
      "Inadequately recognise some of the strategic implications of actions or decisions.",
      "Have difficulty detecting complex cause-effect relationships.",
    ],
    "Raven 2":[
      "Identify the main elements of most problems; occasionally overlook nuances in complex situations.",
      "Recognise most relationships among related situations, events, or ideas.",
      "Integrate information from multiple perspectives reasonably well when developing arguments.",
      "Recognise many of the strategic implications of actions or decisions.",
      "Detect most cause-effect relationships in moderately complex scenarios.",
    ],
    "Raven 3":[
      "Reliably identify the core elements of both simple and complex problems.",
      "Recognise and articulate relationships among diverse situations, events, or ideas.",
      "Integrate information from many perspectives when developing arguments.",
      "Anticipate the strategic implications of actions or decisions with confidence.",
      "Detect complex cause-effect relationships and patterns across domains.",
    ],
  };

  // ═══════ STATUS STYLES ═══════
  const statusStyle = (s) => ({
    "Not started":{c:warn, bg:"rgba(203,126,3,.10)"},
    "Not Started":{c:warn, bg:"rgba(203,126,3,.10)"},
    "In progress":{c:teal, bg:"rgba(11,75,255,.10)"},
    "In Progress":{c:teal, bg:"rgba(11,75,255,.10)"},
    "Completed":{c:green, bg:"rgba(20,133,61,.10)"},
    "Not Available":{c:tm, bg:"rgba(123,121,116,.12)"},
    "Available":{c:green, bg:"rgba(20,133,61,.10)"},
    "On Time":{c:green, bg:"rgba(20,133,61,.10)"},
    "Scheduled":{c:teal, bg:"rgba(11,75,255,.10)"},
    "No Status":{c:tm, bg:"rgba(123,121,116,.12)"},
    "Open":{c:green, bg:"rgba(20,133,61,.10)"},
    "Closed":{c:red, bg:"rgba(197,53,50,.10)"},
  }[s] || {c:tm, bg:"rgba(123,121,116,.12)"});
  const StatusPill = ({s}) => {
    const cfg = statusStyle(s);
    return <span style={{fontFamily:f,fontSize:14,fontWeight:700,color:cfg.c,background:cfg.bg,padding:"4px 11px",borderRadius:6,whiteSpace:"nowrap"}}>{s}</span>;
  };

  // ═══════ SIDEBAR + TOPBAR ═══════
  const LighthouseLogo = ({s=22, c=navy}) => (
    <svg width={s} height={s} viewBox="0 0 100 100" fill="none" stroke={c} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M28 72V36l22 19 22-19v36"/>
    </svg>
  );

  const MarshM = ({s=26, c="#fff"}) => (
    <svg width={s*0.975} height={s} viewBox="0 0 43.17 44.26" fill={c}><polygon points="42.49 0 21.65 30.43 22.2 30.43 35.07 24.39 35.07 44.26 43.17 44.26 43.17 0 42.49 0"/><polygon points="0 0 0 44.26 8.1 44.26 8.1 24.4 20.9 30.43 21.52 30.43 .68 0 0 0"/></svg>
  );

  const Sidebar = () => {
    const railBg = navy, railBorder = "rgba(255,255,255,.08)", railFg = "rgba(255,255,255,.62)", railIcon = "rgba(255,255,255,.5)", railActiveBg = "rgba(206,236,255,.14)", railActiveFg = "#ffffff", railActiveIcon = "#CEECFF", railGroup = "rgba(206,236,255,.5)";
    const items = [
      { k:"home", l:"Assessor Dashboard", I:I.Dash, count:null },
      { k:"dashboard", l:"Assessor Evaluation", I:I.Flag, count:null },
      { k:"ac", l:"Assessment Center", I:I.Users, count:null },
      { k:"avail", l:"Availability", I:I.Cal, count:null },
    ];
    const collapsed = !sidebarOpen;
    return (
      <aside style={{width:collapsed?72:256,flexShrink:0,background:railBg,borderRight:`1px solid ${railBorder}`,color:railActiveFg,display:"flex",flexDirection:"column",overflow:"hidden",transition:"width .2s"}}>
        <div style={{padding:collapsed?"24px 0 18px":"24px 18px 18px",display:"flex",alignItems:"center",justifyContent:collapsed?"center":"flex-start",minWidth:collapsed?72:256}}>
          {collapsed ? <MarshM s={26}/> : (
          <img src={window.LHLogo.wordmarkWhite} alt="Marsh" style={{height:26,width:"auto",maxWidth:168,objectFit:"contain",marginRight:"auto"}}/>
          )}
        </div>
        <nav style={{padding:"0 12px",minWidth:collapsed?72:256}}>
          {items.map(it => {
            const active = it.k === "home" ? route === "home" : (it.k === "dashboard" ? ["dashboard","candidate","evaluate","moderate","campaign"].includes(route) : (it.k==="ac" ? ["ac","acCampaign"].includes(route) : route === it.k));
            const disabled = false;
            return (
              <button key={it.k} data-tour={"nav-"+it.k} onClick={()=>{ setRoute(it.k); }} title={collapsed?it.l:undefined} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:collapsed?"center":"flex-start",gap:12,padding:collapsed?"11px 0":"10px 14px",borderRadius:9,background:active?railActiveBg:"transparent",color:active?railActiveFg:railFg,fontSize:14,fontWeight:active?600:400,marginBottom:2,textAlign:"left",position:"relative",transition:"all .15s"}}>
                {active && <div style={{position:"absolute",left:0,top:9,bottom:9,width:3,borderRadius:3,background:gold}}/>}
                <span style={{color:active?railActiveIcon:railIcon,display:"flex"}}><it.I s={18}/></span>
                {!collapsed && <span style={{flex:1}}>{it.l}</span>}
                {!collapsed && it.count !== null && !it.soon && <span style={{fontSize:14,color:railFg,fontWeight:600}}>{it.count}</span>}
                {!collapsed && it.soon && <span className="tag" style={{background:"transparent",color:railFg,padding:"1px 6px",fontSize:14,border:`1px solid ${railBorder}`}}>Soon</span>}
              </button>
            );
          })}
        </nav>

        <div style={{marginTop:"auto",padding:collapsed?"14px 12px 16px":"14px 16px 16px",minWidth:collapsed?72:256}}>
          {collapsed ? (
            <button onClick={()=>setNewExp(!newExp)} aria-pressed={newExp} title="New experience" style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",padding:"11px 0",background:"transparent",border:"none",cursor:"pointer"}}>
              <span style={{width:30,height:18,borderRadius:9,background:newExp?gold:"rgba(255,255,255,.22)",flexShrink:0,position:"relative",transition:"background .18s ease"}}><span style={{width:12,height:12,borderRadius:6,background:"#fff",position:"absolute",top:3,left:newExp?15:3,boxShadow:"0 1px 3px rgba(0,0,0,.35)",transition:"left .18s ease"}}></span></span>
            </button>
          ) : (
          <button onClick={()=>setNewExp(!newExp)} aria-pressed={newExp} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:newExp?gold:"rgba(255,255,255,.04)",border:`1px solid ${newExp?gold:"rgba(255,255,255,.14)"}`,borderRadius:10,cursor:"pointer",textAlign:"left",transition:"all .18s ease"}}>
            <span style={{width:34,height:20,borderRadius:10,background:newExp?navy:"rgba(255,255,255,.22)",flexShrink:0,position:"relative",transition:"background .18s ease"}}><span style={{width:14,height:14,borderRadius:7,background:"#fff",position:"absolute",top:3,left:newExp?17:3,boxShadow:"0 1px 3px rgba(0,0,0,.35)",transition:"left .18s ease"}}></span></span>
            <span style={{flex:1,minWidth:0,fontSize:14,fontWeight:700,color:newExp?navy:"#fff",lineHeight:1.3}}>New experience</span>
          </button>
          )}
        </div>
      </aside>
    );
  };

  const TopBar = () => {
    const [langOpen, setLangOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    return (
      <header style={{height:60,background:bg,borderBottom:`1px solid ${bd}`,display:"flex",alignItems:"center",padding:"0 24px",gap:14,flexShrink:0,position:"relative",zIndex:20}}>
        {/* Kept for reference — hamburger hidden in favour of the Folio-style floating edge chevron */}
        <button onClick={()=>setSidebarOpen(!sidebarOpen)} className="btn btn-ghost" style={{padding:6,display:"none"}}><I.Menu s={18}/></button>
        {["ac","acCampaign","avail"].includes(route) && <ClientSwitcher/>}
        <div style={{flex:1}}/>
        <div style={{position:"relative"}}>
          <button onClick={()=>{setLangOpen(!langOpen);setProfileOpen(false);}} style={{display:"inline-flex",alignItems:"center",gap:8,height:38,boxSizing:"border-box",background:card,color:navy,border:`1px solid ${bdStrong}`,borderRadius:8,padding:"8px 14px",fontFamily:f,fontSize:14,fontWeight:600,cursor:"pointer",transition:"border-color .15s"}}>
            <I.Globe s={14}/> English <I.Down s={10}/>
          </button>
          {langOpen && (
            <div style={{position:"absolute",top:"calc(100% + 4px)",right:0,background:card,border:`1px solid ${bd}`,borderRadius:br,boxShadow:`0 4px 16px rgba(0,0,0,.08)`,minWidth:140,padding:4,zIndex:30}}>
              {["English","Italiano","Deutsch","Français","Português"].map(l => (
                <div key={l} onClick={()=>{setLangOpen(false);showToast(`Language: ${l}`);}} style={{padding:"8px 12px",fontSize:14,cursor:"pointer",borderRadius:3}} onMouseEnter={e=>e.currentTarget.style.background=navyBg} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>{l}</div>
              ))}
            </div>
          )}
        </div>
        <div style={{position:"relative"}}>
          <button data-tour="profile" onClick={()=>{setProfileOpen(!profileOpen);setLangOpen(false);}} className="btn btn-ghost" style={{padding:"4px 10px 4px 4px",gap:8}}>
            <div style={{width:28,height:28,borderRadius:8,background:teal,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:f,fontSize:14,fontWeight:700}}>EA</div>
            <span style={{fontFamily:f,fontSize:14,fontWeight:700,color:navy}}>Elena Accardi</span>
            <I.Down s={10}/>
          </button>
          {profileOpen && (
            <div style={{position:"absolute",top:"calc(100% + 6px)",right:0,background:card,border:`1px solid ${bd}`,borderRadius:12,boxShadow:`0 12px 40px rgba(0,15,71,.18)`,minWidth:280,padding:6,zIndex:30}}>
              <div style={{display:"flex",alignItems:"center",gap:14,padding:"14px 14px 16px"}}>
                <div style={{width:52,height:52,borderRadius:8,background:teal,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:f,fontSize:18,fontWeight:700,flexShrink:0}}>EA</div>
                <div style={{minWidth:0}}>
                  <div style={{fontSize:16,fontWeight:700,color:navy}} className="elide">Elena Accardi</div>
                  <div style={{fontSize:14,color:ts}} className="elide">elena.accardi@marsh.com</div>
                  <div style={{fontSize:14,color:tm,marginTop:2}}>Role - Assessor</div>
                </div>
              </div>
              {[
                {l:"Profile Details",icon:<I.User s={17}/>,fn:()=>showToast("Profile Details")},
                {l:"Change Password",icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,fn:()=>showToast("Change Password")},
                {l:"Logout",icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></svg>,fn:()=>{ if(window.LHShowLogin){window.LHShowLogin();} else {window.location.href="Login.html";} }},
              ].map(o => (
                <div key={o.l} onClick={()=>{setProfileOpen(false);o.fn();}} style={{display:"flex",alignItems:"center",gap:13,padding:"13px 16px",fontSize:14,fontWeight:500,color:tx,cursor:"pointer",borderTop:`1px solid ${bd}`}} onMouseEnter={e=>e.currentTarget.style.background=bg2} onMouseLeave={e=>e.currentTarget.style.background="transparent"}><span style={{color:tm,display:"inline-flex"}}>{o.icon}</span>{o.l}</div>
              ))}
            </div>
          )}
        </div>
      </header>
    );
  };

  // ═══════ HEADLINES (shared layout piece for inner pages) ═══════
  const Breadcrumb = ({items}) => (
    <div style={{display:"flex",alignItems:"center",gap:8,fontSize:14,color:tm,marginBottom:12}}>
      {items.map((it,i)=>(
        <React.Fragment key={i}>
          {i>0 && <span style={{opacity:.5}}>›</span>}
          {it.onClick ? <span className="link" onClick={it.onClick}>{it.label}</span> : <span style={{color:i===items.length-1?tx:tm,fontWeight:i===items.length-1?600:400}}>{it.label}</span>}
        </React.Fragment>
      ))}
    </div>
  );

  // ─────────────────────────────────────────
  // SCREEN 1: DASHBOARD
  // ─────────────────────────────────────────
  const [dashQ, setDashQ] = useState("");
  const [dashFilter, setDashFilter] = useState("all"); // all | tod0 | inprog | done
  const [dashSort, setDashSort] = useState({k:"id", dir:"asc"});
  const [dashProjFilter, setDashProjFilter] = useState("all"); // project-name filter (toolbar)
  const [dashNameFilter, setDashNameFilter] = useState("all"); // candidate-name filter (toolbar)
  const [colFilter, setColFilter] = useState({evalStatus:"all", modStatus:"all"});
  const [openFilter, setOpenFilter] = useState(null); // "toolbar" | "evalStatus" | "modStatus" | null
  const [cdQ, setCdQ] = useState("");
  const [cdColFilter, setCdColFilter] = useState({evalStatus:"all", modStatus:"all"});
  const [cdOpenFilter, setCdOpenFilter] = useState(null); // "nameSearch" | "evalStatus" | "modStatus" | null
  const [cdActSort, setCdActSort] = useState(null); // null | "asc" | "desc"

  // Designed empty state shown when a search / filter returns nothing.
  const NoResults = ({query, onClear, label="results", filtered}) => (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"56px 24px 60px",textAlign:"center",backgroundColor:"#FFF9F9"}}>
      <svg width="140" height="112" viewBox="0 0 140 112" fill="none">
        <ellipse cx="70" cy="103" rx="46" ry="6" fill={bg2}/>
        <rect x="28" y="12" width="66" height="82" rx="6" fill={card} stroke={bd} strokeWidth="2"/>
        <rect x="40" y="28" width="42" height="5" rx="2.5" fill={bg2}/>
        <rect x="40" y="42" width="30" height="5" rx="2.5" fill={bg2}/>
        <rect x="40" y="56" width="38" height="5" rx="2.5" fill={bg2}/>
        <circle cx="88" cy="74" r="21" fill={card} stroke={teal} strokeWidth="3"/>
        <path d="M80 74a8 8 0 0 1 8-8" stroke={teal} strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="103" y1="89" x2="115" y2="101" stroke={teal} strokeWidth="4.5" strokeLinecap="round"/>
      </svg>
      <div className="serif" style={{fontSize:22,fontWeight:400,color:navy,margin:"22px 0 8px",letterSpacing:-.3}}>No {label} found</div>
      <div style={{fontSize:14,color:tm,maxWidth:380,lineHeight:1.6}}>
        {query
          ? <>We couldn't find any {label} matching "<b style={{color:tx,fontWeight:600}}>{query}</b>". Try a different name, ID, or status.</>
          : <>No {label} match the current filters. Try adjusting or clearing them.</>}
      </div>
      {onClear && <button onClick={onClear} className="btn btn-secondary" style={{marginTop:22}}><I.Search s={13}/> {query?"Clear search":"Reset filters"}</button>}
    </div>
  );

  // Full-panel success / error result shown after submitting a Moderate tab.
  const ModResult = ({type, title, body, primaryLabel, onPrimary, secondaryLabel, onSecondary}) => {
    const ok = type==="success";
    const c = ok ? green : red;
    return (
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"72px 24px",minHeight:"100%",background:bg}}>
        <div style={{width:86,height:86,borderRadius:43,background:`${c}14`,border:`1px solid ${c}40`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:24}}>
          <div style={{width:58,height:58,borderRadius:29,background:c,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}>
            {ok
              ? <I.Check s={30}/>
              : <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
          </div>
        </div>
        <div className="serif" style={{fontSize:27,fontWeight:400,color:navy,letterSpacing:-.4,marginBottom:12}}>{title}</div>
        <div style={{fontSize:14,color:tm,maxWidth:460,lineHeight:1.65,marginBottom:30}}>{body}</div>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center"}}>
          <button onClick={onPrimary} className="btn btn-primary">{primaryLabel}</button>
          {secondaryLabel && <button onClick={onSecondary} className="btn btn-secondary">{secondaryLabel}</button>}
        </div>
      </div>
    );
  };

  const Dashboard = () => {
    const kpis = [
      { l:"Candidates", v:candidates.length, sub:"assigned to you", c:navy },
      { l:"Evaluations To Do", v:candidates.filter(c=>c.evalStatus!=="Completed").length, sub:"across 5 assessor forms", c:teal },
      { l:"Awaiting Moderation", v:candidates.filter(c=>c.modStatus!=="Completed"&&c.evalStatus==="Completed").length, sub:"ready to consolidate", c:orange },
      { l:"Completed", v:candidates.filter(c=>c.modStatus==="Completed").length, sub:"signed off", c:green },
    ];

    const projOf = (c) => { const cp = campaigns.find(x=>x.candidateIds.includes(c.id)); return cp ? cp.project : ""; };
    let rows = [...candidates];
    if (dashQ) {
      const q = dashQ.toLowerCase();
      rows = rows.filter(c => c.id.includes(q) || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || projOf(c).toLowerCase().includes(q));
    }
    if (dashProjFilter !== "all") rows = rows.filter(c => projOf(c) === dashProjFilter);
    if (dashNameFilter !== "all") rows = rows.filter(c => c.name === dashNameFilter);
    if (colFilter.evalStatus !== "all") rows = rows.filter(c => c.evalStatus === colFilter.evalStatus);
    if (colFilter.modStatus !== "all") rows = rows.filter(c => c.modStatus === colFilter.modStatus);
    if (dashFilter === "todo") rows = rows.filter(c => c.evalStatus === "Not started");
    if (dashFilter === "inprog") rows = rows.filter(c => c.evalStatus === "In progress" || c.modStatus === "In progress");
    if (dashFilter === "done") rows = rows.filter(c => c.modStatus === "Completed");
    rows.sort((a,b)=>{
      const d = dashSort.dir === "asc" ? 1 : -1;
      const av = a[dashSort.k], bv = b[dashSort.k];
      return (av > bv ? 1 : av < bv ? -1 : 0) * d;
    });

    const projOpts = Array.from(new Set(candidates.map(projOf).filter(Boolean)));
    const nameOpts = candidates.map(c=>c.name);
    const statusOpts = ["Not started","In progress","Completed"];
    const toolbarActive = dashProjFilter!=="all" || dashNameFilter!=="all";

    const sortHead = (k, label, align) => (
      <th onClick={()=>setDashSort(p=>({k,dir:p.k===k&&p.dir==="asc"?"desc":"asc"}))} style={{padding:"14px 16px",textAlign:align||"left",fontSize:14,fontWeight:700,letterSpacing:0,textTransform:"none",color:tm,borderBottom:`1px solid ${bd}`,background:"#fff",cursor:"pointer",userSelect:"none",whiteSpace:"nowrap"}}>
        <span style={{display:"inline-flex",alignItems:"center",gap:4}}>{label} <I.Sort s={10}/></span>
      </th>
    );

    const searchHead = (label) => {
      const open = openFilter === "nameSearch";
      const active = !!dashQ;
      return (
      <th style={{padding:"14px 16px",textAlign:"left",fontSize:14,fontWeight:700,letterSpacing:0,textTransform:"none",color:tm,borderBottom:`1px solid ${bd}`,background:"#fff",whiteSpace:"nowrap",position:"relative"}}>
        <button onClick={(e)=>{e.stopPropagation();setOpenFilter(open?null:"nameSearch");}} style={{display:"inline-flex",alignItems:"center",gap:6,color:active?navy:tm,fontWeight:700,fontSize:14}}>
          {label}
          <span style={{display:"inline-flex",width:18,height:18,borderRadius:5,alignItems:"center",justifyContent:"center",background:active?navy:"transparent",color:active?"#fff":tm,border:active?"none":`1px solid ${bd}`}}><I.Search s={11}/></span>
        </button>
        {open && (
          <div style={{position:"absolute",top:"100%",left:16,zIndex:30,marginTop:4,width:230,background:card,border:`1px solid ${bd}`,borderRadius:8,boxShadow:"0 12px 34px rgba(0,15,71,.16)",padding:8}}>
            <div style={{display:"flex",alignItems:"center",gap:6,padding:"6px 9px",background:bg,border:`1px solid ${bd}`,borderRadius:6}}>
              <I.Search s={13} style={{color:tm}}/>
              <input autoFocus value={dashQ} onChange={e=>setDashQ(e.target.value)} onClick={e=>e.stopPropagation()} placeholder="Search candidate…" style={{border:"none",outline:"none",flex:1,fontSize:14,background:"transparent",color:tx,fontWeight:500}}/>
              {dashQ && <button onClick={(e)=>{e.stopPropagation();setDashQ("");}} style={{color:tm,fontSize:15,lineHeight:1,fontWeight:600}}>×</button>}
            </div>
          </div>
        )}
      </th>
      );
    };

    const filterHead = (col, label) => {
      const active = colFilter[col] !== "all";
      const open = openFilter === col;
      return (
      <th style={{padding:"14px 16px",textAlign:"left",fontSize:14,fontWeight:700,letterSpacing:0,textTransform:"none",color:tm,borderBottom:`1px solid ${bd}`,background:"#fff",whiteSpace:"nowrap",position:"relative"}}>
        <button onClick={(e)=>{e.stopPropagation();setOpenFilter(open?null:col);}} style={{display:"inline-flex",alignItems:"center",gap:6,color:active?navy:tm,fontWeight:700,fontSize:14}}>
          {label}
          <span style={{display:"inline-flex",width:18,height:18,borderRadius:5,alignItems:"center",justifyContent:"center",background:active?navy:"transparent",color:active?"#fff":tm,border:active?"none":`1px solid ${bd}`}}><I.Filter s={11}/></span>
        </button>
        {open && (
          <div style={{position:"absolute",top:"100%",left:16,zIndex:30,marginTop:4,minWidth:170,background:card,border:`1px solid ${bd}`,borderRadius:8,boxShadow:"0 12px 34px rgba(0,15,71,.16)",overflow:"hidden",padding:5}}>
            {["all",...statusOpts].map(o=>(
              <button key={o} onClick={(e)=>{e.stopPropagation();setColFilter(p=>({...p,[col]:o}));setOpenFilter(null);}} style={{display:"block",width:"100%",textAlign:"left",padding:"8px 10px",fontSize:14,fontWeight:colFilter[col]===o?700:500,color:colFilter[col]===o?navy:tx,background:colFilter[col]===o?navyBg:"transparent",borderRadius:6}}>{o==="all"?"All statuses":o}</button>
            ))}
          </div>
        )}
      </th>
      );
    };

    return (
      <div className="an1" data-screen-label="01 Assessor Dashboard" style={{padding:"36px 40px 80px",maxWidth:1400,margin:"0 auto"}}>
        <h1 className="h1" data-tour="eval-title" style={{marginBottom:20}}>Assessor Evaluation</h1>

        <div style={{display:"none",gridTemplateColumns:isNarrow?"1fr 1fr":"repeat(4,1fr)",gap:24,padding:"28px 0 0",borderTop:`1px solid ${bd}`,marginBottom:36}}>
          {kpis.map((k,i) => (
            <div key={i}>
              <div className="serif" style={{fontSize:34,fontWeight:400,color:k.c,lineHeight:1,marginBottom:10}}>{k.v}</div>
              <div style={{fontSize:14,fontWeight:700,color:tx,marginBottom:2}}>{k.l}</div>
              <div style={{fontSize:14,color:tm}}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* View tabs: By Participant / By Campaign */}
        <div data-tour="eval-tabs" style={{...eSep, paddingTop:0, marginBottom:24, borderTopColor:"transparent"}}>
          <div style={{display:"flex",alignItems:"center",gap:0,borderBottom:`1px solid ${bd}`}}>
            {[
              {k:"participant", l:"By Participant", n:candidates.length},
              {k:"campaign", l:"By Campaign", n:campaigns.length},
            ].map(t => {
              const active = dashTab === t.k;
              return (
                <button key={t.k} onClick={()=>setDashTab(t.k)} style={{padding:"12px 4px",marginRight:28,fontSize:14,fontWeight:active?700:500,color:active?navy:tm,borderBottom:`2px solid ${active?navy:"transparent"}`,marginBottom:-1,display:"inline-flex",alignItems:"center",gap:8,transition:"color .15s"}}>
                  {t.l}
                </button>
              );
            })}
            <div style={{flex:1}}/>
          </div>
        </div>

        {dashTab === "participant" && (
        <div data-tour="eval-table">
          {openFilter && <div onClick={()=>setOpenFilter(null)} style={{position:"fixed",inset:0,zIndex:20}}/>}
          <div style={{fontSize:14,color:tm,marginBottom:12}}>Total : <b style={{color:navy}}>{rows.length}</b></div>

          {/* Table */}
          <div style={{background:bg,border:`1px solid ${bd}`,borderRadius:br,overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:14,minWidth:0,tableLayout:"fixed"}}>
              <colgroup><col style={{width:70}}/><col style={{width:"22%"}}/><col style={{width:"24%"}}/><col style={{width:"18%"}}/><col style={{width:"18%"}}/><col style={{width:"14%"}}/></colgroup>
              <thead>
                <tr>
                  {sortHead("id","ID")}
                  {(()=>{ const open=openFilter==="campaign"; const active=dashProjFilter!=="all"; return (
                  <th style={{padding:"14px 16px",textAlign:"left",fontSize:14,fontWeight:700,letterSpacing:0,textTransform:"none",color:tm,borderBottom:`1px solid ${bd}`,background:"#fff",whiteSpace:"nowrap",position:"relative"}}>
                    <button onClick={(e)=>{e.stopPropagation();setOpenFilter(open?null:"campaign");}} style={{display:"inline-flex",alignItems:"center",gap:6,color:active?navy:tm,fontWeight:700,fontSize:14}}>
                      Campaign
                      <span style={{display:"inline-flex",width:18,height:18,borderRadius:5,alignItems:"center",justifyContent:"center",background:active?navy:"transparent",color:active?"#fff":tm,border:active?"none":`1px solid ${bd}`}}><I.Filter s={11}/></span>
                    </button>
                    {open && (
                      <div style={{position:"absolute",top:"100%",left:16,zIndex:30,marginTop:4,minWidth:200,maxHeight:260,overflowY:"auto",background:card,border:`1px solid ${bd}`,borderRadius:8,boxShadow:"0 12px 34px rgba(0,15,71,.16)",padding:5}}>
                        {["all",...projOpts].map(o=>(
                          <button key={o} onClick={(e)=>{e.stopPropagation();setDashProjFilter(o);setOpenFilter(null);}} style={{display:"block",width:"100%",textAlign:"left",padding:"8px 10px",fontSize:14,fontWeight:dashProjFilter===o?700:500,color:dashProjFilter===o?navy:tx,background:dashProjFilter===o?navyBg:"transparent",borderRadius:6}}>{o==="all"?"All campaigns":o}</button>
                        ))}
                      </div>
                    )}
                  </th>
                  ); })()}
                  {searchHead("Candidate")}
                  {filterHead("evalStatus","Evaluation")}
                  {filterHead("modStatus","Moderation")}
                  {sortHead("lastActivity","Activity")}
                </tr>
              </thead>
              <tbody>
                {rows.map((c,i) => {
                  const cCamp = campaigns.find(x=>x.candidateIds.includes(c.id));
                  return (
                  <tr key={c.id} className="rh" style={{cursor:"pointer",background:"#fff",borderBottom:i===rows.length-1?"none":`1px solid ${bd}`}} onClick={()=>{setEntryPath("participant"); setSubjectId(c.id); setRoute("candidate"); setCandidateTab("assessments");}}>
                    <td style={{padding:"16px"}}><span className="link" style={{fontWeight:600,fontVariantNumeric:"tabular-nums"}}>{c.id}</span></td>
                    <td style={{padding:"16px 12px",maxWidth:0}}>
                      {cCamp ? (
                        <div style={{minWidth:0,overflow:"hidden"}}>
                          <div style={{fontWeight:700,color:navy,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{cCamp.project}</div>
                          <div style={{fontSize:14,color:tm,marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{cCamp.subtitle}</div>
                        </div>
                      ) : <span style={{color:tf}}>—</span>}
                    </td>
                    <td style={{padding:"16px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{width:32,height:32,borderRadius:16,background:`${teal}1A`,color:teal,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,flexShrink:0}}>{c.name.split(" ").map(n=>n[0]).slice(0,2).join("")}</div>
                        <div style={{minWidth:0}}>
                          <div style={{fontWeight:600,color:tx}} className="elide">{c.name}</div>
                          <div style={{fontSize:14,color:tm}} className="elide">{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{padding:"16px"}}>
                      <div style={{display:"inline-flex",alignItems:"center",gap:10}}>
                        <StatusPill s={c.evalStatus}/>
                        <span className="tnum" style={{fontSize:14,color:tm,fontWeight:600}}>{c.evalDone}/{c.evalTotal}</span>
                      </div>
                    </td>
                    <td style={{padding:"16px"}}><StatusPill s={c.modStatus}/></td>
                    <td style={{padding:"16px",fontSize:14,color:tm,position:"relative",paddingRight:32}}>{c.lastActivity}<span className="row-arrow"><I.Chev s={14}/></span></td>
                  </tr>
                  );
                })}
                {rows.length === 0 && (
                  <tr><td colSpan={6} style={{padding:0}}><NoResults query={dashQ} label="candidates" onClear={()=>{setDashQ("");setDashFilter("all");}}/></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {dashTab === "campaign" && (() => {
          const myCampaigns = campaigns.filter(cp => cp.status === "Active" && cp.candidateIds.length > 0);
          const splitWindow = (w) => { const parts = (w||"").split("–").map(s=>s.trim()); const yr = (parts[1]||"").match(/\d{4}/); const start = parts[0] && !/\d{4}/.test(parts[0]) && yr ? `${parts[0]} ${yr[0]}` : parts[0]; return { start: start||"—", end: parts[1]||"—" }; };
          const cTh = {padding:"14px 16px",textAlign:"left",fontSize:14,fontWeight:700,letterSpacing:0,textTransform:"none",color:tm,borderBottom:`1px solid ${bd}`,background:"#fff",whiteSpace:"nowrap"};
          const cThR = {...cTh, textAlign:"right"};
          return (
        <div>
          <div style={{fontSize:14,color:tm,marginBottom:12}}>Total : <b style={{color:navy}}>{myCampaigns.length}</b></div>
          <div style={{background:bg,border:`1px solid ${bd}`,borderRadius:br,overflow:"hidden",overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:14,minWidth:0}}>
              <thead>
                <tr>
                  <th style={cTh}>Campaign</th>
                  <th style={cTh}>Client</th>
                  <th style={cTh}>Date Start &ndash; Date End</th>
                  <th style={cThR}>Candidates</th>
                  <th style={cThR}>Evaluation completed</th>
                  <th style={cThR}>Moderation waiting</th>
                  <th style={cTh}></th>
                </tr>
              </thead>
              <tbody>
                {myCampaigns.map((cp, ci) => {
                  const cohort = cp.candidateIds.map(id => candidates.find(c => c.id === id)).filter(Boolean);
                  const evalComplete = cohort.filter(c => c.evalStatus === "Completed").length;
                  const awaitingMod = cohort.filter(c => c.evalStatus === "Completed" && c.modStatus !== "Completed").length;
                  const win = splitWindow(cp.window);
                  return (
                  <tr key={cp.id} className="rh" style={{cursor:"pointer",background:"#fff",borderBottom:ci===myCampaigns.length-1?"none":`1px solid ${bd}`}} onClick={()=>{ setCampaignId(cp.id); setRoute("campaign"); }}>
                    <td style={{padding:"16px",minWidth:200}}>
                      <div style={{fontWeight:700,color:navy}} className="elide">{cp.project}</div>
                      <div style={{fontSize:14,color:tm,marginTop:1}} className="elide">{cp.subtitle}</div>
                    </td>
                    <td style={{padding:"16px"}}>{cp.client}</td>
                    <td style={{padding:"16px",whiteSpace:"nowrap"}} className="tnum">{win.start} &ndash; {win.end}</td>
                    <td style={{padding:"16px",textAlign:"right"}}><span className="tnum" style={{fontWeight:700,color:navy}}>{cohort.length}</span></td>
                    <td style={{padding:"16px",textAlign:"right"}}><span className="tnum" style={{fontWeight:700,color:navy}}>{evalComplete}</span><span className="tnum" style={{color:tm,fontWeight:600}}>/{cohort.length}</span></td>
                    <td style={{padding:"16px",textAlign:"right"}}><span className="tnum" style={{fontWeight:700,color:awaitingMod>0?warn:tm}}>{awaitingMod}</span></td>
                    <td style={{padding:"16px",position:"relative",paddingRight:32}}><span className="row-arrow"><I.Chev s={14}/></span></td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
          );
        })()}
      </div>
    );
  };

  // ─────────────────────────────────────────
  // SCREEN 1.5: CAMPAIGN DETAIL (entry via "By Campaign" tab)
  // ─────────────────────────────────────────
  const CampaignDetail = () => {
    const cp = campaigns.find(x => x.id === campaignId);
    if (!cp) return null;
    const cohort = cp.candidateIds.map(id => candidates.find(c => c.id === id)).filter(Boolean);
    const notStarted = cohort.filter(c => c.evalStatus === "Not started").length;
    const inProgress = cohort.filter(c => c.evalStatus === "In progress").length;
    const evalDone = cohort.filter(c => c.evalStatus === "Completed").length;
    const modDone = cohort.filter(c => c.modStatus === "Completed").length;
    const awaitingMod = cohort.filter(c => c.evalStatus === "Completed" && c.modStatus !== "Completed").length;

    return (
      <div className="an1" data-screen-label="01b Campaign detail" style={{padding:"32px 40px 80px",maxWidth:1400,margin:"0 auto"}}>
        <Breadcrumb items={[
          { label:"Dashboard", onClick:()=>{ setRoute("dashboard"); setDashTab("campaign"); } },
          { label:"Campaigns", onClick:()=>{ setRoute("dashboard"); setDashTab("campaign"); } },
          { label:cp.project }
        ]}/>

        <div style={{display:"flex",alignItems:"flex-end",gap:24,flexWrap:"wrap",marginBottom:28}}>
          <div style={{flex:1,minWidth:280}}>
            <p className="eyebrow" style={{marginBottom:10,color:navy}}>Campaign · {cp.id}</p>
            <h1 className="display" style={{fontSize:36,marginBottom:6}}>{cp.project}</h1>
            <p style={{fontSize:14,color:ts,lineHeight:1.55,maxWidth:640}}>{cp.subtitle} · {cp.client} · {cp.window}</p>
          </div>
        </div>

        {/* Editorial KPI strip */}
        <div style={{...eSep, display:"grid",gridTemplateColumns:isNarrow?"repeat(2,1fr)":"repeat(5,1fr)",gap:24,paddingTop:20,marginBottom:32}}>
          {[
            { l:"Candidates", v:cohort.length, sub:"assigned to you" },
            { l:"Not started", v:notStarted, sub:"evaluations", c:tm },
            { l:"In progress", v:inProgress, sub:"being assessed", c:teal },
            { l:"Awaiting moderation", v:awaitingMod, sub:"ready to consolidate", c:teal },
            { l:"Completed", v:modDone, sub:"signed off", c:green },
          ].map((k,i) => (
            <div key={i}>
              <div className="serif" style={{fontSize:38,fontWeight:400,color:k.c||navy,lineHeight:1,letterSpacing:-1.2,marginBottom:6}}>{k.v}</div>
              <div style={{fontSize:14,fontWeight:600,color:tx,marginBottom:2}}>{k.l}</div>
              <div style={{fontSize:14,color:tm}}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Cohort roster */}
        <div>
          {cdOpenFilter && <div onClick={()=>setCdOpenFilter(null)} style={{position:"fixed",inset:0,zIndex:20}}/>}
          {(() => {
            const statusOpts = ["Not started","In progress","Completed"];
            let roster = [...cohort];
            if (cdQ) { const q = cdQ.toLowerCase(); roster = roster.filter(c => c.name.toLowerCase().includes(q) || c.id.includes(q)); }
            if (cdColFilter.evalStatus !== "all") roster = roster.filter(c => c.evalStatus === cdColFilter.evalStatus);
            if (cdColFilter.modStatus !== "all") roster = roster.filter(c => c.modStatus === cdColFilter.modStatus);
            const actAge = (s) => { s=(s||"").toLowerCase(); if(s.includes("yesterday")) return 24; const m=s.match(/(\d+)\s*([hd])/); if(m) return parseInt(m[1])*(m[2]==="d"?24:1); return 1e6; };
            if (cdActSort) roster.sort((a,b)=>(actAge(a.lastActivity)-actAge(b.lastActivity))*(cdActSort==="asc"?1:-1));
            const cTh = {padding:"14px 16px",textAlign:"left",fontSize:14,fontWeight:700,letterSpacing:0,textTransform:"none",color:tm,borderBottom:`1px solid ${bd}`,background:"#fff",whiteSpace:"nowrap",position:"relative"};
            const searchHead = () => { const open=cdOpenFilter==="nameSearch", active=!!cdQ; return (
              <th style={cTh}>
                <button onClick={(e)=>{e.stopPropagation();setCdOpenFilter(open?null:"nameSearch");}} style={{display:"inline-flex",alignItems:"center",gap:6,color:active?navy:tm,fontWeight:700,fontSize:14}}>Candidate
                  <span style={{display:"inline-flex",width:18,height:18,borderRadius:5,alignItems:"center",justifyContent:"center",background:active?navy:"transparent",color:active?"#fff":tm,border:active?"none":`1px solid ${bd}`}}><I.Search s={11}/></span>
                </button>
                {open && (<div style={{position:"absolute",top:"100%",left:16,zIndex:30,marginTop:4,width:230,background:card,border:`1px solid ${bd}`,borderRadius:8,boxShadow:"0 12px 34px rgba(0,15,71,.16)",padding:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,padding:"6px 9px",background:bg,border:`1px solid ${bd}`,borderRadius:6}}>
                    <I.Search s={13} style={{color:tm}}/>
                    <input autoFocus value={cdQ} onChange={e=>setCdQ(e.target.value)} onClick={e=>e.stopPropagation()} placeholder="Search candidate…" style={{border:"none",outline:"none",flex:1,fontSize:14,background:"transparent",color:tx,fontWeight:500}}/>
                    {cdQ && <button onClick={(e)=>{e.stopPropagation();setCdQ("");}} style={{color:tm,fontSize:15,lineHeight:1,fontWeight:600}}>×</button>}
                  </div>
                </div>)}
              </th>
            ); };
            const filterHead = (col, label, align) => { const active=cdColFilter[col]!=="all", open=cdOpenFilter===col; return (
              <th style={{...cTh, textAlign:align||"left"}}>
                <button onClick={(e)=>{e.stopPropagation();setCdOpenFilter(open?null:col);}} style={{display:"inline-flex",alignItems:"center",gap:6,color:active?navy:tm,fontWeight:700,fontSize:14}}>{label}
                  <span style={{display:"inline-flex",width:18,height:18,borderRadius:5,alignItems:"center",justifyContent:"center",background:active?navy:"transparent",color:active?"#fff":tm,border:active?"none":`1px solid ${bd}`}}><I.Filter s={11}/></span>
                </button>
                {open && (<div style={{position:"absolute",top:"100%",left:16,zIndex:30,marginTop:4,minWidth:170,background:card,border:`1px solid ${bd}`,borderRadius:8,boxShadow:"0 12px 34px rgba(0,15,71,.16)",overflow:"hidden",padding:5}}>
                  {["all",...statusOpts].map(o=>(<button key={o} onClick={(e)=>{e.stopPropagation();setCdColFilter(p=>({...p,[col]:o}));setCdOpenFilter(null);}} style={{display:"block",width:"100%",textAlign:"left",padding:"8px 10px",fontSize:14,fontWeight:cdColFilter[col]===o?700:500,color:cdColFilter[col]===o?navy:tx,background:cdColFilter[col]===o?navyBg:"transparent",borderRadius:6}}>{o==="all"?"All statuses":o}</button>))}
                </div>)}
              </th>
            ); };
            return (
          <div style={{background:card,border:`1px solid ${bd}`,borderRadius:br,overflow:"hidden",overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:14,minWidth:760}}>
              <thead>
                <tr>
                  {searchHead()}
                  {filterHead("evalStatus","Evaluation")}
                  {filterHead("modStatus","Moderation")}
                  <th style={{...cTh,cursor:"pointer",userSelect:"none"}} onClick={()=>setCdActSort(p=>p==="asc"?"desc":"asc")}><span style={{display:"inline-flex",alignItems:"center",gap:4,color:cdActSort?navy:tm}}>Activity <I.Sort s={10}/></span></th>
                  <th style={cTh}></th>
                </tr>
              </thead>
              <tbody>
                {roster.map((c, i) => (
                  <tr key={c.id} className="rh" style={{cursor:"pointer",borderBottom:i===roster.length-1?"none":`1px solid ${bd}`}} onClick={()=>{ setEntryPath("campaign"); setSubjectId(c.id); setRoute("candidate"); setCandidateTab("assessments"); }}>
                    <td style={{padding:"16px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{width:32,height:32,borderRadius:16,background:`${teal}1A`,color:teal,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,flexShrink:0}}>{c.name.split(" ").map(n=>n[0]).slice(0,2).join("")}</div>
                        <div style={{minWidth:0}}>
                          <div style={{fontWeight:600,color:tx}} className="elide">{c.name}</div>
                          <div style={{fontSize:14,color:tm}} className="elide">{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{padding:"16px"}}>
                      <div style={{display:"inline-flex",alignItems:"center",gap:10}}>
                        <StatusPill s={c.evalStatus}/>
                        <span className="tnum" style={{fontSize:14,color:tm,fontWeight:600}}>{c.evalDone}/{c.evalTotal}</span>
                      </div>
                    </td>
                    <td style={{padding:"16px"}}><StatusPill s={c.modStatus}/></td>
                    <td style={{padding:"16px",fontSize:14,color:tm}}>{c.lastActivity}</td>
                    <td style={{padding:"16px",position:"relative",paddingRight:32}}><span className="row-arrow"><I.Chev s={14}/></span></td>
                  </tr>
                ))}
                {roster.length === 0 && (
                  <tr><td colSpan={5} style={{padding:48,textAlign:"center",color:tm,fontSize:14}}>{cohort.length===0?"No candidates assigned to this campaign yet.":"No candidates match your search or filters."}</td></tr>
                )}
              </tbody>
            </table>
          </div>
            );
          })()}
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────
  // SCREEN 2: CANDIDATE DETAIL
  // ─────────────────────────────────────────
  const CandidateDetail = () => {
    const c = candidates.find(x => x.id === subjectId);
    if (!c) return null;
    const evalPct = Math.round((c.evalDone/c.evalTotal)*100);
    const canModerate = c.evalStatus === "Completed";

    return (
      <div className="an1" data-screen-label="02 Candidate detail" style={{padding:"32px 40px 80px",maxWidth:1400,margin:"0 auto"}}>
        <Breadcrumb items={[
          { label:"Dashboard", onClick:()=>setRoute("dashboard") },
          { label:campaign.project },
          { label:c.name }
        ]}/>

        {/* Candidate header */}
        <div style={{display:"flex",alignItems:"flex-start",gap:24,marginBottom:28,flexWrap:"wrap"}}>
          <div style={{width:72,height:72,borderRadius:36,background:`${teal}1A`,color:teal,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:700,flexShrink:0}}>{c.name.split(" ").map(n=>n[0]).slice(0,2).join("")}</div>
          <div style={{flex:1,minWidth:280}}>
            <h1 className="display" style={{fontSize:36,marginBottom:6}}>{c.name}</h1>
            <div style={{fontSize:14,color:ts}}>{c.email}</div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <button onClick={()=>setRoute("evaluate")} className="btn btn-secondary"><I.Edit s={13}/> Evaluate</button>
            <button onClick={()=>setRoute("moderate")} className="btn btn-primary"><I.Flag s={13}/> Moderate scores</button>
          </div>
        </div>

        {/* Profile — shown on all tabs */}
        <div style={{border:`1px solid ${bd}`,borderRadius:br,background:card,marginBottom:28,overflow:"hidden",display:"grid",gridTemplateColumns:isNarrow?"1fr 1fr":"repeat(4,1fr)"}}>
          {[["Candidate ID", c.id],["Grade", c.profile.grade],["Entity", c.profile.entity],["Compliance", c.profile.compliance],["Language", c.profile.lang],["Current role", c.profile.currentRole],["Target level", c.profile.targetLevel],["Cognitive band", c.profile.raven]].map(([k,v],i)=>{
            const cols=isNarrow?2:4;
            return (
            <div key={i} style={{padding:"12px 18px",borderTop:i>=cols?`1px solid ${bd}`:"none",borderLeft:(i%cols)!==0?`1px solid ${bd}`:"none",minWidth:0}}>
              <div style={{fontSize:14,color:tm,fontWeight:600,marginBottom:5}}>{k}</div>
              <div style={{fontSize:14,color:tx,fontWeight:600}} className="elide">{v}</div>
            </div>);
          })}
        </div>

        {/* Progress strip */}
        <div style={{paddingTop:0, display:"grid",gridTemplateColumns:isNarrow?"1fr":"1fr auto auto",gap:isNarrow?24:40,alignItems:"start",marginBottom:28}}>
          <div>
            <p className="eyebrow" style={{marginBottom:8}}>Evaluation Progress</p>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{flex:1,height:6,background:bg2,borderRadius:3,overflow:"hidden"}}>
                <div style={{width:`${evalPct}%`,height:"100%",background:evalPct===100?green:teal,transition:"width .4s"}}/>
              </div>
              <span className="tnum" style={{fontSize:20,fontWeight:700,color:navy}}>{c.evalDone}<span style={{color:tm,fontSize:14,fontWeight:500}}>/{c.evalTotal}</span></span>
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <p className="eyebrow" style={{marginBottom:8}}>Evaluation</p>
            <StatusPill s={c.evalStatus}/>
          </div>
          <div style={{textAlign:"right"}}>
            <p className="eyebrow" style={{marginBottom:8}}>Moderation</p>
            <StatusPill s={c.modStatus}/>
          </div>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",borderBottom:`1px solid ${bd}`,marginBottom:24,gap:28,overflowX:"auto"}} className="no-sb">
          {[
            {k:"assessments", l:"Assessment and Reports"},
            {k:"recordings", l:"Recordings"},
          ].map(t => {
            const active = candidateTab === t.k;
            return (
              <button key={t.k} onClick={()=>setCandidateTab(t.k)} style={{padding:"10px 18px",fontSize:14,fontWeight:active?700:500,color:active?navy:tm,borderBottom:`2px solid ${active?navy:"transparent"}`,marginBottom:-1,display:"inline-flex",alignItems:"center",gap:6,whiteSpace:"nowrap"}}>
                {t.l}
                {t.count !== undefined && <span style={{fontSize:14,color:tm,fontWeight:500,padding:"1px 6px",background:bg2,borderRadius:8}}>{t.count}</span>}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {candidateTab === "assessments" && (
          <div className="an" style={{display:"flex",flexDirection:"column",gap:30}}>
            <div>
              <p className="eyebrow" style={{marginBottom:12}}>Assessments <span style={{color:tf,fontWeight:600}}>({assessments.length})</span></p>
              <AssessmentsList/>
            </div>
            <div>
              <p className="eyebrow" style={{marginBottom:12}}>Reports <span style={{color:tf,fontWeight:600}}>({reports.length})</span></p>
              <ReportsList/>
            </div>
          </div>
        )}
        {candidateTab === "recordings" && <RecordingsGrid/>}
      </div>
    );
  };

  const CandidateOverview = ({c}) => {
    const ovCard = {background:card,border:`1px solid ${bd}`,borderRadius:br,padding:"24px 26px"};
    return (
    <div className="an" style={{display:"grid",gridTemplateColumns:"1fr",gap:24,alignItems:"start"}}>
      <aside style={{...ovCard,paddingTop:20}}>
        <p className="eyebrow" style={{marginBottom:8}}>Profile</p>
        <dl style={{fontSize:14,margin:0}}>
          {[
            ["Candidate ID", c.id],
            ["Grade", c.profile.grade],
            ["Entity", c.profile.entity],
            ["Compliance", c.profile.compliance],
            ["Language", c.profile.lang],
            ["Current role", c.profile.currentRole],
            ["Target level", c.profile.targetLevel],
            ["Cognitive band", c.profile.raven],
          ].map(([k,v],i) => (
            <div key={i} style={{display:"flex",justifyContent:"space-between",gap:12,padding:"10px 0",borderBottom:i===7?"none":`1px solid ${bd}`}}>
              <dt style={{color:tm,fontSize:14}}>{k}</dt>
              <dd style={{color:tx,fontWeight:500,textAlign:"right"}}>{v}</dd>
            </div>
          ))}
        </dl>
      </aside>
    </div>
    );
  };

  const listTh = {padding:"13px 16px",textAlign:"left",fontSize:14,fontWeight:700,letterSpacing:0,textTransform:"none",color:tm,borderBottom:`1px solid ${bd}`,background:"#fff",whiteSpace:"nowrap"};
  const AssessmentsList = () => (
    <div className="an" style={{background:"#fff",border:`1px solid ${bd}`,borderRadius:br,overflow:"hidden",overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:14,minWidth:640}}>
        <thead><tr>
          <th style={listTh}>ID</th>
          <th style={listTh}>Assessment name</th>
          <th style={listTh}>Completed</th>
          <th style={listTh}></th>
        </tr></thead>
        <tbody>
          {assessments.map((a,i) => (
            <tr key={a.id} className="rh" style={{cursor:"pointer",borderTop:i===0?"none":`1px solid ${bd}`}} onClick={()=>setRoute("evaluate")}>
              <td style={{padding:"16px 18px"}}><span className="tnum" style={{fontSize:14,color:tm,fontWeight:600}}>{a.id}</span></td>
              <td style={{padding:"16px 18px"}}>
                <div style={{fontSize:14,fontWeight:600,color:tx,marginBottom:2}}>{a.name}</div>
                <div style={{fontSize:14,color:tm,letterSpacing:0,textTransform:"none",fontWeight:600}}>{a.type} Form</div>
              </td>
              <td style={{padding:"16px 18px"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,maxWidth:220}}>
                  <div style={{flex:1,height:4,background:bg2,borderRadius:2,overflow:"hidden"}}>
                    <div style={{width:`${a.progress*100}%`,height:"100%",background:a.progress===1?green:teal}}/>
                  </div>
                  <span className="tnum" style={{fontSize:14,color:tx,fontWeight:600}}>{Math.round(a.progress*100)}%</span>
                </div>
              </td>
              <td style={{padding:"16px 18px",position:"relative",paddingRight:32}}><span className="row-arrow"><I.Chev s={14}/></span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const ReportsList = () => {
    const shown = reports;
    return (
    <div className="an" style={{background:"#fff",border:`1px solid ${bd}`,borderRadius:br,overflow:"hidden",overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:14,minWidth:640}}>
        <thead><tr>
          <th style={listTh}>ID</th>
          <th style={listTh}>Assessment name</th>
          <th style={listTh}>Completed</th>
          <th style={listTh}></th>
        </tr></thead>
        <tbody>
          {shown.map((r,i) => {
            const avail = r.status === "Available";
            return (
            <tr key={r.id} className="rh" style={{cursor:avail?"pointer":"default",borderTop:i===0?"none":`1px solid ${bd}`}} onClick={()=>{ if(avail) setOpenReport(r); }}>
              <td style={{padding:"16px 18px"}}><span className="tnum" style={{fontSize:14,color:tm,fontWeight:600}}>{r.id}</span></td>
              <td style={{padding:"16px 18px"}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{fontSize:14,fontWeight:600,color:tx}}>{r.name}</div>
                  {r.type==="Main Report" && <span className="tag" style={{display:"inline-flex",alignItems:"center",justifyContent:"center",background:"rgba(11,75,255,.10)",color:teal}}>Main Report</span>}
                </div>
              </td>
              <td style={{padding:"16px 18px"}}><StatusPill s={r.status}/></td>
              <td style={{padding:"16px 18px",position:"relative",paddingRight:32}}>{avail && <span className="row-arrow"><I.Chev s={14}/></span>}</td>
            </tr>
          );})}
        </tbody>
      </table>
    </div>
  );};

  const RecordingsGrid = () => {
    const rTh = (l,w) => <th style={{padding:"13px 16px",textAlign:"left",fontSize:14,fontWeight:700,color:tm,borderBottom:`1px solid ${bd}`,background:"#fff",whiteSpace:"nowrap",width:w}}>{l}</th>;
    const rTd = {padding:"14px 16px",fontSize:14,color:tx,borderBottom:`1px solid ${bd}`,verticalAlign:"middle"};
    return (
    <div className="an" style={{background:card,border:`1px solid ${bd}`,borderRadius:br,overflow:"hidden"}}>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:900}}>
          <thead><tr>{rTh("Serial No",90)}{rTh("Recording Date")}{rTh("Assessment center date and time")}{rTh("Assessor")}{rTh("Participants")}{rTh("Link to view recordings")}{rTh("Transcriptions")}</tr></thead>
          <tbody>
            {recordings.length===0 && <tr><td colSpan={7} style={{...rTd,textAlign:"center",color:tm,padding:"48px 16px"}}>No data</td></tr>}
            {recordings.map((r,i)=>(
              <tr key={r.id} className="rh">
                <td style={rTd}><span style={{color:teal,fontWeight:600}}>{i+1}</span></td>
                <td style={rTd}>{r.date}</td>
                <td style={rTd}>{r.acDate}</td>
                <td style={rTd}><div style={{display:"flex",alignItems:"center",gap:8}}><Av name={r.assessor} color={red} s={24}/><span>{r.assessor}</span></div></td>
                <td style={rTd}><div style={{display:"flex",alignItems:"center",gap:8}}><Av name={r.participant} color={navy} s={24}/><span>{r.participant}</span></div></td>
                <td style={rTd}><div style={{display:"flex",alignItems:"center",gap:14}}><button onClick={()=>showToast(`Opening ${r.label}`)} className="link" style={{fontSize:14,fontWeight:600,display:"inline-flex",alignItems:"center",gap:5}}><I.Play s={12}/> View</button><button onClick={()=>showToast(`Downloading ${r.label}`)} className="link" style={{fontSize:14,fontWeight:600,display:"inline-flex",alignItems:"center",gap:5}}><I.Download s={13}/> Download</button></div></td>
                <td style={rTd}>{r.transcript ? <button onClick={()=>showToast("Opening transcript")} className="link" style={{fontSize:14,fontWeight:600,display:"inline-flex",alignItems:"center",gap:5}}><I.Doc s={13}/> View</button> : <span style={{color:tm,fontSize:14}}>—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    );
  };

  // ─────────────────────────────────────────
  // SCREEN 3: EVALUATE
  // ─────────────────────────────────────────
  // Restructured: Per-form workspace. Top = form picker strip. Left pane = candidate brief/stimulus.
  // Right pane = assessor response with competency-keyed evidence capture + I-Agree confirmations.
  // Progress ring + save-as-you-go.
  const [evalFormIdx, setEvalFormIdx] = useState(1);
  const [evalIndIdx, setEvalIndIdx] = useState(0);
  const [evalResponses, setEvalResponses] = useState({}); // {formId-indId: {score, evidence, agreed}}
  const [evalAgreements, setEvalAgreements] = useState({}); // {formId-key: bool}
  const [submittedForms, setSubmittedForms] = useState(() => new Set()); // form ids submitted
  const [evalLeftTab, setEvalLeftTab] = useState(() => { const b = window.LHRoute && LHRoute.getQuery("brief"); return b == null ? "overview" : (/^\d+$/.test(b) ? parseInt(b, 10) : b); });   // "overview" | participant form index (read-only)
  const [evalRightTab, setEvalRightTab] = useState(() => { const f = window.LHRoute && LHRoute.getQuery("form"); return (f && /^\d+$/.test(f)) ? Math.max(0, parseInt(f, 10) - 1) : 0; }); // form index
  const [viewScores, setViewScores] = useState(() => new Set()); // form ids showing scores table

  const evalForms = [
    { id:"CBI", name:"Competency-Based Interview", duration:"60 min", focus:["Strategic Thinker","Impactful Decision Maker","Talent Nurturer","Effective Collaborator"],
      brief:[
        { k:"welcome", title:"Welcome the participant", body:"Introduce yourself. Walk through the structure, aim and format of the interview. Remind them this is 60 minutes across 4 competency areas (≈10 min each). You will ask about real past events, not hypotheticals." },
        { k:"format", title:"Interview format", body:"Each competency is introduced with a title and definition so the participant understands what you are assessing. Ask the main question, then follow-ups. Focus on circumstances, behaviours and impact. Make extensive notes." },
        { k:"evidence", title:"Gathering evidence", body:"Give equal time to each competency. Re-phrase if needed. An optional second question is provided — move on if no example surfaces. Seek past behaviours, not theoretical intent." },
      ]
    },
    { id:"BEI", name:"Generali — BEI Assessor Form", duration:"90 min", focus:["Transformation Enabler","Innovation Explorer","Results Driver"],
      brief:[
        { k:"intro", title:"Behavioural Event Interview — structure", body:"The BEI uncovers specific, recent events that illustrate each competency. You will probe for circumstances, behaviours and impact. Aim for 2 events per competency." },
        { k:"questions", title:"Starter questions", body:"• Tell me about a time you had to drive change without formal authority.\n• Walk me through a recent initiative where you challenged the existing way of working.\n• Describe a goal you set that stretched the team beyond their comfort zone." },
      ]
    },
    { id:"CASE", name:"Business Case — Boss Meeting", duration:"45 min prep + 30 min meeting", focus:["Strategic Thinker","Results Driver","Customer Advocate"],
      brief:[
        { k:"scenario", title:"Scenario", body:"You are the newly appointed Regional Director for EMEA. Your predecessor left an ambitious Q3 plan that is now at risk due to shifting customer expectations and a delayed tech platform rollout." },
        { k:"task", title:"Task", body:"Read the attached context and prepare for a 30-minute meeting with your boss (the Regional CEO). Recommend a path forward. Expect challenge on assumptions, resourcing and customer impact." },
      ]
    },
    { id:"RP", name:"Role Play — Direct Report / Peer", duration:"30 min each", focus:["Talent Nurturer","Effective Collaborator"],
      brief:[
        { k:"dr", title:"Direct Report meeting", body:"Your direct report has been underperforming for two quarters despite being a strong individual contributor historically. They have also recently complained about lack of career progression. Run the 1:1." },
        { k:"peer", title:"Peer meeting", body:"A peer from a sister business unit is blocking a cross-functional initiative you lead. Their team has competing priorities. Negotiate a path forward that unblocks delivery without damaging the relationship." },
      ]
    },
    { id:"TIG", name:"Technical Interview", duration:"60 min", focus:["Domain expertise","Impactful Decision Maker"],
      brief:[
        { k:"warmup", title:"Technical warm-up", body:"Walk me through your P&L exposure in your current role. What are the three largest drivers and how do you flex them?" },
        { k:"deep", title:"Deep dive", body:"Talk me through how you would evaluate entering a new EMEA market — commercially, operationally and from a compliance angle." },
      ]
    },
  ];

  // ── URL ── On the Evaluate page each tab + the scores view is its own address:
  // ?form=<n> (right column form), ?brief=<n> (left column brief), ?view=scores
  // (the "View Assessment" scores table). Cleared automatically when you leave Evaluate.
  useEffect(() => {
    if (!window.LHRoute) return;
    if (route !== "evaluate") { window.LHRoute.setQueries({ form: null, brief: null, view: null }); return; }
    const fid = evalForms[evalRightTab] && evalForms[evalRightTab].id;
    window.LHRoute.setQueries({
      form: evalRightTab ? evalRightTab + 1 : null,
      brief: evalLeftTab === "overview" ? null : evalLeftTab,
      view: (fid && viewScores.has(fid)) ? "scores" : null
    });
  }, [route, evalRightTab, evalLeftTab, viewScores]);
  useEffect(() => {
    if (!window.LHRoute) return;
    return window.LHRoute.onPop(() => {
      const f = window.LHRoute.getQuery("form");
      const fIdx = (f && /^\d+$/.test(f)) ? Math.max(0, parseInt(f, 10) - 1) : 0;
      setEvalRightTab(fIdx);
      const b = window.LHRoute.getQuery("brief");
      setEvalLeftTab(b == null ? "overview" : (/^\d+$/.test(b) ? parseInt(b, 10) : b));
      const fid = evalForms[fIdx] && evalForms[fIdx].id;
      setViewScores(window.LHRoute.getQuery("view") === "scores" && fid ? new Set([fid]) : new Set());
    });
  }, []);

  // Horizontal tab strip with edge fades + chevron affordances when tabs overflow.
  const TabScroller = ({children, fade, gap=24}) => {
    const ref = React.useRef(null);
    const [ov, setOv] = React.useState({left:false, right:false});
    const update = React.useCallback(()=>{ const el=ref.current; if(!el) return; setOv({ left: el.scrollLeft>4, right: el.scrollLeft+el.clientWidth < el.scrollWidth-4 }); },[]);
    React.useEffect(()=>{ update(); const el=ref.current; if(!el) return; const id=requestAnimationFrame(update); el.addEventListener("scroll",update,{passive:true}); window.addEventListener("resize",update); return ()=>{cancelAnimationFrame(id); el.removeEventListener("scroll",update); window.removeEventListener("resize",update);}; },[update]);
    const nudge = (dx)=>{ const el=ref.current; if(el) el.scrollBy({left:dx,behavior:"smooth"}); };
    const arrow = {position:"absolute",top:6,zIndex:3,width:26,height:26,borderRadius:13,background:card,border:`1px solid ${bdStrong}`,color:navy,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 1px 5px rgba(0,15,71,.16)",cursor:"pointer"};
    return (
      <div style={{position:"relative"}}>
        {ov.left && <div style={{position:"absolute",left:0,top:0,bottom:1,width:44,background:`linear-gradient(90deg, ${fade} 35%, ${fade}00)`,pointerEvents:"none",zIndex:2}}/>}
        {ov.left && <button aria-label="Scroll tabs left" onClick={()=>nudge(-220)} style={{...arrow,left:-4}}><I.Chev s={13} r={180}/></button>}
        <div ref={ref} className="no-sb" style={{display:"flex",gap,borderBottom:`1px solid ${bd}`,overflowX:"auto",scrollBehavior:"smooth"}}>
          {children}
        </div>
        {ov.right && <div style={{position:"absolute",right:0,top:0,bottom:1,width:44,background:`linear-gradient(270deg, ${fade} 35%, ${fade}00)`,pointerEvents:"none",zIndex:2}}/>}
        {ov.right && <button aria-label="Scroll tabs right" onClick={()=>nudge(220)} style={{...arrow,right:-4}}><I.Chev s={13}/></button>}
      </div>
    );
  };

  const Evaluate = () => {
    const c = candidates.find(x => x.id === subjectId);
    if (!c) return null;
    const splitRef = useRef(null);
    const [evalSplit, setEvalSplit] = useState(50);
    const startSplitDrag = (e) => {
      e.preventDefault();
      const move = (ev) => {
        if (!splitRef.current) return;
        const rect = splitRef.current.getBoundingClientRect();
        const x = (ev.touches ? ev.touches[0] : ev).clientX;
        let pct = ((x - rect.left) / rect.width) * 100;
        setEvalSplit(Math.min(Math.max(pct, 28), 72));
      };
      const up = () => {
        document.removeEventListener("mousemove", move); document.removeEventListener("mouseup", up);
        document.removeEventListener("touchmove", move); document.removeEventListener("touchend", up);
        document.body.style.userSelect = ""; document.body.style.cursor = "";
      };
      document.addEventListener("mousemove", move); document.addEventListener("mouseup", up);
      document.addEventListener("touchmove", move, {passive:false}); document.addEventListener("touchend", up);
      document.body.style.userSelect = "none"; document.body.style.cursor = "col-resize";
    };

    // ── LEFT: participant's imported (read-only) questionnaires ──
    const participantForms = [
      { name:"Questionnaire on Professional Experience | DCC", completedAt:"02 Apr 2026",
        intro:"Dear participant,\n\nThe questionnaire on Professional Experience is a tool that allows you to share your professional experience up until now as well as aspirations for your future.\n\nThank you!",
        sections:[
          { title:"Section 1: Professional experiences", items:[
            { q:"Summarize your professional experience (starting from the most recent). Please include: Company, Role, Starting date and End date.", a:"Company: Tech Solutions Inc. Role: Senior Software Engineer Starting Date: January 2022 End Date: Present", words:4, chars:13 },
            { q:"Please mention the languages you speak and the level of proficiency (use beginner/intermediate/advanced; e.g.: English – intermediate)", a:["English – Advanced","Spanish – Intermediate","French – Beginner","German – Beginner"], words:4, chars:13 },
            { q:"What are your professional aspirations for the next 3–5 years?", a:"Move into a Head of Engineering role with regional P&L responsibility; broaden from delivery into commercial strategy.", words:18, chars:114 },
          ]},
        ]
      },
      { name:"Generali - Direct Report Meeting - Participant Brief | DCC", completedAt:"02 Apr 2026",
        intro:"This brief prepares you for the Direct Report Meeting role play. Please read the scenario and note your intended approach.",
        sections:[
          { title:"Section 1: Scenario preparation", items:[
            { q:"How would you open the conversation with your direct report?", a:"Acknowledge their historical strengths, then move to the recent performance dip with specific, observable examples.", words:15, chars:110 },
          ]},
        ]
      },
      { name:"Generali - Business Case & Boss Meeting | DCC", completedAt:"02 Apr 2026",
        intro:"Preparation notes for the Business Case & Boss Meeting exercise.",
        sections:[
          { title:"Section 1: Recommendation", items:[
            { q:"Summarise your recommended path forward for the EMEA Q3 plan.", a:"Protect Q3 revenue, accelerate the tech rollout to key markets first, and re-baseline Q4 targets with the CEO.", words:19, chars:112 },
          ]},
        ]
      },
    ];
    const pForm = typeof evalLeftTab === "number" ? participantForms[Math.min(evalLeftTab, participantForms.length-1)] : null;

    // ── RIGHT: assessor forms (Overview + each form) ──
    const rf = typeof evalRightTab === "number" ? evalForms[evalRightTab] : null;
    const rfCompetencies = rf ? competencies.filter(comp => rf.focus.includes(comp.name)) : [];
    const rItems = rf ? rf.focus.map((name, i) => ({
      comp: name,
      prompt: `I have conducted a thorough review of the ${name} evidence gathered during ${rf.name}. I have meticulously considered all pertinent behaviours observed, and I intend to incorporate this evidence into the forthcoming report.`,
    })) : [];
    const agreeKey = (i) => `${rf?.id}-agree-${i}`;
    const agreedCount = rItems.filter((_,i)=>evalAgreements[agreeKey(i)]).length;
    const rProgress = rItems.length ? agreedCount / rItems.length : 0;
    const submitted = rf ? submittedForms.has(rf.id) : false;
    const showingScores = rf ? viewScores.has(rf.id) : false;
    const safeIdx = rf ? Math.min(evalIndIdx, rItems.length-1) : 0;
    const curItem = rItems[safeIdx];

    const scoreRows = rfCompetencies.flatMap((comp,ci) => comp.indicators.map((ind,ii) => ({
      id: 52835 + ci*7 + ii,
      competency: `${comp.name.slice(0,4)} – ${ind.label}`,
      score: "4.0",
    })));

    const submitForm = () => {
      setSubmittedForms(prev => new Set(prev).add(rf.id));
      showToast("Responses recorded");
    };
    const doneCount = submittedForms.size;
    const totalCount = 10;

    const ProgressBar = ({pct}) => {
      const full = pct >= 1;
      return (
        <div style={{display:"flex",alignItems:"center",gap:10,minWidth:180}}>
          <div style={{flex:1,height:6,background:bg2,borderRadius:3,overflow:"hidden"}}>
            <div style={{width:`${Math.round(pct*100)}%`,height:"100%",background:full?green:teal,transition:"width .3s"}}/>
          </div>
          {full ? <I.CheckCircle s={16} style={{color:green}}/> : <span className="tnum" style={{fontSize:14,fontWeight:700,color:tm,minWidth:34,textAlign:"right"}}>{Math.round(pct*100)}%</span>}
        </div>
      );
    };

    return (
      <div className="an1" data-screen-label="03 Evaluate" style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
        {/* Header strip — evaluating + progress (immersive, full-width) */}
        <div style={{padding:"14px 32px",borderBottom:`1px solid ${bd}`,background:bg,flexShrink:0,display:"flex",alignItems:"center",gap:24,flexWrap:"wrap"}}>
          <div style={{flex:1,minWidth:200}}>
            <div style={{fontSize:22,fontWeight:400,fontFamily:serif,color:navy}}>{c.name} <span style={{color:tm,fontSize:15,marginLeft:6}}>· {c.email}</span></div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div>
              <span style={{fontSize:14,color:tm}}>Forms complete</span>
              <div style={{fontSize:14,fontWeight:700,color:tx,textAlign:"right"}} className="tnum">{doneCount} / {totalCount}</div>
            </div>
            <ProgressRing pct={doneCount/totalCount} size={44}/>
          </div>
          <button onClick={()=>setRoute("candidate")} className="btn" style={{padding:"7px 14px",fontSize:14,textAlign:"right",justifyContent:"flex-end",background:"#fff",border:`1px solid ${bd}`,color:tx}}><I.X s={15}/> Close</button>
        </div>

        {/* Split workspace — two independent columns, each with own tabs + scrollbar */}
        <div ref={splitRef} style={{flex:1,display:"flex",minHeight:0,overflow:"hidden",position:"relative"}}>
          {/* ══ LEFT: participant response (READ ONLY) ══ */}
          <div style={{width:`${evalSplit}%`,display:"flex",flexDirection:"column",minWidth:0,background:bg}}>
            <div style={{padding:"16px 28px 0",flexShrink:0}}>
              <div style={{fontSize:15,fontWeight:700,color:navy,marginBottom:12}}>Assessor Brief</div>
              <TabScroller fade={bg} gap={24}>
                <button onClick={()=>setEvalLeftTab("overview")} style={{padding:"6px 0 12px",fontSize:14,fontWeight:evalLeftTab==="overview"?700:500,color:evalLeftTab==="overview"?navy:tm,borderBottom:`2px solid ${evalLeftTab==="overview"?navy:"transparent"}`,marginBottom:-1,whiteSpace:"nowrap",flexShrink:0}}>Overview</button>
                {participantForms.map((pf,i) => {
                  const active = evalLeftTab === i;
                  return (
                    <button key={i} onClick={()=>setEvalLeftTab(i)} title={pf.name} style={{padding:"6px 0 12px",fontSize:14,fontWeight:active?700:500,color:active?navy:tm,borderBottom:`2px solid ${active?navy:"transparent"}`,marginBottom:-1,whiteSpace:"nowrap",maxWidth:230,overflow:"hidden",textOverflow:"ellipsis",flexShrink:0}}>{pf.name}</button>
                  );
                })}
              </TabScroller>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"22px 28px 48px"}}>
              {evalLeftTab === "overview" ? (
                <div>
                  <div style={{border:`1px solid ${teal}`,borderRadius:br,padding:"18px 20px",display:"flex",alignItems:"center",gap:16,marginBottom:40}}>
                    <div style={{width:64,height:64,borderRadius:br,background:teal,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><I.User s={34}/></div>
                    <div>
                      <div style={{fontSize:16,fontWeight:700,color:navy,marginBottom:3}}>{c.name}</div>
                      <div style={{fontSize:14,color:tm}}>{c.email}</div>
                    </div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 0",color:tf}}>
                    <svg width="120" height="90" viewBox="0 0 120 90" fill="none"><ellipse cx="60" cy="78" rx="42" ry="7" fill={bg2}/><path d="M30 34h60v34a4 4 0 0 1-4 4H34a4 4 0 0 1-4-4V34Z" fill={card} stroke={bd} strokeWidth="2"/><path d="M30 34 44 20h32l14 14M30 34h22l4 8h8l4-8h22" stroke={bd} strokeWidth="2" fill="none" strokeLinejoin="round"/></svg>
                    <div style={{fontSize:14,color:tm,marginTop:16}}>No Data</div>
                  </div>
                </div>
              ) : pForm ? (
              <React.Fragment>
              <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",gap:16,marginBottom:16}}>
                <h2 style={{fontSize:16,fontWeight:700,color:navy}}>{pForm.name.replace(/ \| DCC$/,"")}</h2>
                <div style={{fontSize:14,color:tm,whiteSpace:"nowrap"}}>Completed At: <strong style={{color:tx}}>{pForm.completedAt}</strong></div>
              </div>
              <div style={{border:`1px solid ${bd}`,borderRadius:br,borderLeft:`3px solid ${teal}`,padding:"16px 18px",marginBottom:22,background:card}}>
                <p style={{fontSize:14,color:ts,lineHeight:1.7,whiteSpace:"pre-line"}}>{pForm.intro}</p>
              </div>
              {pForm.sections.map((sec,si) => (
                <div key={si}>
                  <div style={{display:"flex",alignItems:"center",gap:8,margin:"22px 0 14px"}}>
                    <span style={{width:3,height:16,background:navy,borderRadius:2}}/>
                    <h3 style={{fontSize:14,fontWeight:700,color:navy}}>{sec.title}</h3>
                  </div>
                  {sec.items.map((it,ii) => (
                    <div key={ii} style={{border:`1px solid ${bd}`,borderRadius:br,borderLeft:`3px solid ${teal}`,padding:"16px 18px",marginBottom:14,background:card}}>
                      <p style={{fontSize:14,color:tx,lineHeight:1.6,marginBottom:12}}>{it.q}</p>
                      <div style={{borderTop:`1px solid ${bd}`,paddingTop:12}}>
                        <div style={{fontSize:14,color:tm,marginBottom:8}}>Response</div>
                        {Array.isArray(it.a) ? (
                          <ul style={{margin:"0 0 0 18px",padding:0}}>
                            {it.a.map((li,li2)=><li key={li2} style={{fontSize:14,fontWeight:700,color:tx,lineHeight:1.7}}>{li}</li>)}
                          </ul>
                        ) : (
                          <p style={{fontSize:14,fontWeight:700,color:tx,lineHeight:1.55}}>{it.a}</p>
                        )}
                        <div style={{fontSize:14,color:tm,marginTop:10}} className="tnum">Word: {it.words} Characters: {it.chars}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              </React.Fragment>
              ) : null}
            </div>
          </div>

          {/* Divider drag handle */}
          <div onMouseDown={startSplitDrag} onTouchStart={startSplitDrag} style={{position:"absolute",left:`${evalSplit}%`,top:0,bottom:0,width:5,transform:"translateX(-50%)",background:bdStrong,cursor:"col-resize",zIndex:5}}>
            <div style={{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",width:34,height:34,borderRadius:17,background:card,border:`1px solid ${bd}`,display:"flex",alignItems:"center",justifyContent:"center",color:tm,boxShadow:"0 1px 4px rgba(0,15,71,.12)"}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6 4 12l5 6M15 6l5 6-5 6"/></svg>
            </div>
          </div>

          {/* ══ RIGHT: your response (EDITABLE) ══ */}
          <div style={{width:`${100-evalSplit}%`,display:"flex",flexDirection:"column",minWidth:0,background:card}}>
            <div style={{padding:"16px 28px 0",flexShrink:0}}>
              <div style={{fontSize:15,fontWeight:700,color:navy,marginBottom:12}}>Your Response</div>
              <TabScroller fade={card} gap={22}>
                {evalForms.map((ff,i) => {
                  const active = evalRightTab === i;
                  const done = submittedForms.has(ff.id);
                  return (
                    <button key={ff.id} onClick={()=>{setEvalRightTab(i);setEvalIndIdx(0);}} title={ff.name} style={{padding:"6px 0 12px",fontSize:14,fontWeight:active?700:500,color:active?navy:tm,borderBottom:`2px solid ${active?navy:"transparent"}`,marginBottom:-1,whiteSpace:"nowrap",display:"inline-flex",alignItems:"center",gap:7,maxWidth:230,flexShrink:0}}>
                      <span style={{display:"inline-flex",color:done?green:warn,flexShrink:0}}>{done ? <I.CheckCircle s={14}/> : <I.Alert s={14}/>}</span>
                      <span style={{overflow:"hidden",textOverflow:"ellipsis"}}>{i+1}. {ff.name.replace(/^Generali — /,"")}</span>
                    </button>
                  );
                })}
              </TabScroller>
            </div>

            <div style={{flex:1,overflowY:"auto",padding:"22px 28px 48px"}}>
              {/* FORM TAB */}
              {rf && (
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:22}}>
                    <div style={{fontSize:15,fontWeight:700,color:navy,flex:1,minWidth:0}} className="elide">{typeof evalRightTab==="number"?evalRightTab+1:""}. {rf.name.replace(/^Generali — /,"")}</div>
                    <ProgressBar pct={submitted ? 1 : rProgress}/>
                  </div>

                  {/* Post-submit: thank you OR scores */}
                  {submitted && !showingScores && (
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",padding:"36px 0"}}>
                      <div style={{width:74,height:74,borderRadius:37,background:green,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:22}}><I.Check s={38} style={{color:"#fff",stroke:"#fff"}}/></div>
                      <h2 style={{fontSize:26,fontWeight:400,fontFamily:serif,color:navy,marginBottom:8}}>Thank you for your time.</h2>
                      <p style={{fontSize:14,color:tm,marginBottom:26}}>Your responses have now been recorded.</p>
                      <div style={{display:"flex",gap:12}}>
                        <button onClick={()=>setViewScores(prev=>new Set(prev).add(rf.id))} className="btn btn-primary">View Assessment</button>
                        <button onClick={()=>setRoute("candidate")} className="btn btn-secondary">Back</button>
                      </div>
                    </div>
                  )}

                  {submitted && showingScores && (
                    <div>
                      <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",background:"rgba(20,133,61,.08)",border:`1px solid rgba(20,133,61,.28)`,borderRadius:br,marginBottom:18}}>
                        <I.CheckCircle s={16} style={{color:green}}/>
                        <span style={{fontSize:14,color:tx}}>Your responses have now been recorded.</span>
                      </div>
                      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}>
                        <button onClick={()=>showToast("Downloading CSV…")} className="link" style={{fontSize:14,fontWeight:600,display:"inline-flex",alignItems:"center",gap:6}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14"/></svg> Download CSV</button>
                      </div>
                      <div style={{border:`1px solid ${bd}`,borderRadius:br,overflow:"hidden"}}>
                        <div style={{display:"grid",gridTemplateColumns:"70px 1fr 64px",gap:12,padding:"11px 16px",background:sbBg,borderBottom:`1px solid ${bd}`,fontSize:14,fontWeight:700,color:tm}}>
                          <div>ID</div><div>Competency</div><div style={{textAlign:"right"}}>Score</div>
                        </div>
                        {scoreRows.map((sr,i) => (
                          <div key={i} style={{display:"grid",gridTemplateColumns:"70px 1fr 64px",gap:12,padding:"11px 16px",borderBottom:i===scoreRows.length-1?"none":`1px solid ${bd}`,fontSize:14}}>
                            <div className="tnum" style={{color:tm}}>{sr.id}</div>
                            <div style={{color:tx}}>{sr.competency}</div>
                            <div className="tnum" style={{textAlign:"right",fontWeight:700,color:tx}}>{sr.score}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{display:"flex",justifyContent:"flex-end",gap:12,marginTop:20}}>
                        <button onClick={()=>showToast("Opening assessment…")} className="btn btn-primary">View Assessment</button>
                        <button onClick={()=>setRoute("candidate")} className="btn btn-secondary">Back</button>
                      </div>
                    </div>
                  )}

                  {/* In-progress: one confirmation card at a time */}
                  {!submitted && curItem && (
                    <div>
                      <div style={{border:`1px solid ${bd}`,borderRadius:br,borderLeft:`3px solid ${teal}`,padding:"18px 20px",marginBottom:24,background:card}}>
                        <p style={{fontSize:14,fontWeight:700,color:tx,lineHeight:1.65,marginBottom:16}}>{curItem.prompt}</p>
                        <label style={{display:"inline-flex",alignItems:"center",gap:9,cursor:"pointer"}}>
                          <span style={{width:18,height:18,borderRadius:9,border:`1.6px solid ${evalAgreements[agreeKey(safeIdx)]?teal:bdStrong}`,display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{evalAgreements[agreeKey(safeIdx)] && <span style={{width:9,height:9,borderRadius:5,background:teal}}/>}</span>
                          <input type="checkbox" checked={!!evalAgreements[agreeKey(safeIdx)]} onChange={e=>setEvalAgreements(p=>({...p,[agreeKey(safeIdx)]:e.target.checked}))} style={{display:"none"}}/>
                          <span style={{fontSize:14,color:tx}}>I Agree</span>
                        </label>
                      </div>
                      <div style={{display:"flex",justifyContent:"flex-end",gap:12,alignItems:"center"}}>
                        <span className="tnum" style={{fontSize:14,color:tm,marginRight:"auto",display:"none"}}>{safeIdx+1} / {rItems.length}</span>
                        {safeIdx > 0 && <button onClick={()=>setEvalIndIdx(safeIdx-1)} className="btn btn-secondary"><I.Chev s={13} r={180}/> Back</button>}
                        <button onClick={()=>showToast("Draft saved")} className="btn btn-secondary">Save</button>
                        <button onClick={submitForm} className="btn btn-primary">Next <I.Chev s={13}/></button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ══ FLOATING NOTES / TO-DO WIDGET ══ */}
        {notesOpen && (
          <div style={{position:"fixed",bottom:92,right:28,width:352,maxWidth:"calc(100vw - 40px)",maxHeight:"min(560px, calc(100vh - 130px))",background:card,border:`1px solid ${bd}`,borderRadius:12,boxShadow:"0 18px 50px rgba(0,15,71,.22)",zIndex:60,display:"flex",flexDirection:"column",overflow:"hidden"}}>
            {/* Header */}
            <div style={{display:"flex",alignItems:"center",gap:10,padding:"14px 16px",borderBottom:`1px solid ${bd}`,background:bg,flexShrink:0}}>
              <span style={{width:30,height:30,borderRadius:8,background:navy,color:"#fff",display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><I.Edit s={15}/></span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,fontWeight:700,color:navy}}>Assessor Notes</div>
              </div>
              <button onClick={()=>setNotesOpen(false)} aria-label="Close notes" style={{width:28,height:28,borderRadius:6,border:`1px solid ${bd}`,background:card,color:tm,display:"inline-flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><I.X s={14}/></button>
            </div>

            {/* Tabs */}
            <div style={{display:"flex",gap:20,padding:"0 16px",borderBottom:`1px solid ${bd}`,flexShrink:0}}>
              {[{k:"notes",l:"Notes",n:notes.length},{k:"todo",l:"To-do",n:todos.length}].map(tb => {
                const active = notesTab===tb.k;
                return (
                  <button key={tb.k} onClick={()=>setNotesTab(tb.k)} style={{padding:"11px 0",fontSize:14,fontWeight:active?700:500,color:active?navy:tm,borderBottom:`2px solid ${active?navy:"transparent"}`,marginBottom:-1,display:"inline-flex",alignItems:"center",gap:6,background:"none",border:"none",cursor:"pointer"}}>
                    {tb.l}
                    {tb.n>0 && <span className="tnum" style={{minWidth:18,height:18,padding:"0 5px",boxSizing:"border-box",borderRadius:9,background:active?navy:bg2,color:active?"#fff":tm,fontSize:14,fontWeight:700,display:"inline-flex",alignItems:"center",justifyContent:"center"}}>{tb.n}</span>}
                  </button>
                );
              })}
            </div>

            {/* Body */}
            <div style={{flex:1,overflowY:"auto",padding:"16px"}}>
              {notesTab === "notes" ? (
                <React.Fragment>
                  {/* Compose */}
                  <textarea value={noteDraft} onChange={e=>setNoteDraft(e.target.value)} placeholder="Jot down an observation, evidence, follow-up…" style={{width:"100%",boxSizing:"border-box",minHeight:78,resize:"vertical",border:`1px solid ${bd}`,borderRadius:8,padding:"10px 12px",fontSize:14,lineHeight:1.55,color:tx,fontFamily:f,outline:"none",background:card}} onFocus={e=>e.target.style.borderColor=teal} onBlur={e=>e.target.style.borderColor=bd}/>
                  <div style={{display:"flex",justifyContent:"flex-end",marginTop:8,marginBottom:notes.length?16:0}}>
                    <button onClick={addNote} disabled={!noteDraft.trim()} className="btn btn-primary" style={{padding:"7px 16px",fontSize:14,opacity:noteDraft.trim()?1:.5,cursor:noteDraft.trim()?"pointer":"default"}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg> Add note</button>
                  </div>

                  {notes.length===0 ? (
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",padding:"26px 0 8px",color:tm}}>
                      <span style={{width:40,height:40,borderRadius:10,background:bg2,color:tm,display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:12}}><I.Edit s={18}/></span>
                      <div style={{fontSize:14,lineHeight:1.5}}>No notes yet.<br/>Type above and press <b style={{color:navy}}>Add note</b>.</div>
                    </div>
                  ) : (
                    <div style={{display:"flex",flexDirection:"column",gap:10}}>
                      {notes.map(n => (
                        <div key={n.id} style={{border:`1px solid ${bd}`,borderRadius:8,borderLeft:`3px solid ${teal}`,padding:"11px 12px",background:card}}>
                          {editingNoteId===n.id ? (
                            <React.Fragment>
                              <textarea autoFocus value={editingNoteText} onChange={e=>setEditingNoteText(e.target.value)} style={{width:"100%",boxSizing:"border-box",minHeight:64,resize:"vertical",border:`1px solid ${teal}`,borderRadius:6,padding:"8px 10px",fontSize:14,lineHeight:1.55,color:tx,fontFamily:f,outline:"none",background:card}}/>
                              <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:8}}>
                                <button onClick={()=>{setEditingNoteId(null);setEditingNoteText("");}} className="btn btn-secondary" style={{padding:"5px 12px",fontSize:14}}>Cancel</button>
                                <button onClick={()=>saveNoteEdit(n.id)} className="btn btn-primary" style={{padding:"5px 12px",fontSize:14}}><I.Save s={12}/> Save</button>
                              </div>
                            </React.Fragment>
                          ) : (
                            <React.Fragment>
                              <p style={{fontSize:14,lineHeight:1.6,color:tx,whiteSpace:"pre-wrap",wordBreak:"break-word",marginBottom:9}}>{n.text}</p>
                              <div style={{display:"flex",alignItems:"center",gap:8}}>
                                <span className="tnum" style={{fontSize:14,color:tm,flex:1}}>{fmtTime(n.ts)}</span>
                                <button onClick={()=>{setEditingNoteId(n.id);setEditingNoteText(n.text);}} aria-label="Edit note" title="Edit" style={{width:26,height:26,borderRadius:6,border:`1px solid ${bd}`,background:card,color:tm,display:"inline-flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.color=navy} onMouseLeave={e=>e.currentTarget.style.color=tm}><I.Edit s={13}/></button>
                                <button onClick={()=>removeNote(n.id)} aria-label="Delete note" title="Delete" style={{width:26,height:26,borderRadius:6,border:`1px solid ${bd}`,background:card,color:tm,display:"inline-flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}} onMouseEnter={e=>{e.currentTarget.style.color=red;e.currentTarget.style.borderColor=`${red}55`;}} onMouseLeave={e=>{e.currentTarget.style.color=tm;e.currentTarget.style.borderColor=bd;}}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg></button>
                              </div>
                            </React.Fragment>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {/* Add row */}
                  <div style={{display:"flex",gap:8,marginBottom:todos.length?14:0}}>
                    <input value={newTodo} onChange={e=>setNewTodo(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")addTodo();}} placeholder="Add a task…" style={{flex:1,minWidth:0,boxSizing:"border-box",border:`1px solid ${bd}`,borderRadius:8,padding:"9px 11px",fontSize:14,color:tx,fontFamily:f,outline:"none",background:card}} onFocus={e=>e.target.style.borderColor=teal} onBlur={e=>e.target.style.borderColor=bd}/>
                    <button onClick={addTodo} aria-label="Add task" style={{flexShrink:0,width:38,borderRadius:8,border:"none",background:navy,color:"#fff",display:"inline-flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg></button>
                  </div>

                  {todos.length>0 && <div style={{fontSize:14,color:tm,marginBottom:8}} className="tnum">{todos.filter(t=>t.done).length} of {todos.length} done</div>}

                  {todos.length===0 ? (
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",padding:"22px 0 8px",color:tm}}>
                      <span style={{width:40,height:40,borderRadius:10,background:bg2,color:tm,display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:12}}><I.Check s={18}/></span>
                      <div style={{fontSize:14,lineHeight:1.5}}>No tasks yet.<br/>Add one above to build your list.</div>
                    </div>
                  ) : (
                    <div style={{display:"flex",flexDirection:"column",gap:6}}>
                      {todos.map(t => (
                        <div key={t.id} style={{display:"flex",alignItems:"flex-start",gap:9,padding:"9px 10px",border:`1px solid ${bd}`,borderRadius:8,background:t.done?bg:card}}>
                          <button onClick={()=>toggleTodo(t.id)} aria-label="Toggle task" style={{marginTop:1,flexShrink:0,width:18,height:18,borderRadius:5,border:`1.6px solid ${t.done?teal:bdStrong}`,background:t.done?teal:card,color:"#fff",display:"inline-flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>{t.done && <I.Check s={11} style={{color:"#fff",stroke:"#fff"}}/>}</button>
                          <span style={{flex:1,fontSize:14,lineHeight:1.5,color:t.done?tm:tx,textDecoration:t.done?"line-through":"none",wordBreak:"break-word"}}>{t.text}</span>
                          <button onClick={()=>removeTodo(t.id)} aria-label="Delete task" style={{flexShrink:0,width:22,height:22,borderRadius:5,border:"none",background:"transparent",color:tf,display:"inline-flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}} onMouseEnter={e=>{e.currentTarget.style.color=red;e.currentTarget.style.background=`${red}12`;}} onMouseLeave={e=>{e.currentTarget.style.color=tf;e.currentTarget.style.background="transparent";}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg></button>
                        </div>
                      ))}
                    </div>
                  )}
                </React.Fragment>
              )}
            </div>

          </div>
        )}

        {/* Pencil FAB */}
        <button onClick={()=>setNotesOpen(o=>!o)} aria-label="Assessor notes" title="Notes & to-do" style={{position:"fixed",bottom:28,right:28,width:54,height:54,borderRadius:27,border:"none",background:notesOpen?teal:navy,color:"#fff",display:"inline-flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:"0 8px 24px rgba(0,15,71,.28)",zIndex:60,transition:"background .18s, transform .18s"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.06)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
          {notesOpen ? <I.X s={20}/> : <I.Edit s={21}/>}
          {!notesOpen && (notes.length+todos.length)>0 && <span className="tnum" style={{position:"absolute",top:-3,right:-3,minWidth:20,height:20,padding:"0 5px",boxSizing:"border-box",borderRadius:10,background:gold,color:"#fff",fontSize:14,fontWeight:700,display:"inline-flex",alignItems:"center",justifyContent:"center",border:`2px solid ${bg}`}}>{notes.length+todos.length}</span>}
        </button>
      </div>
    );
  };

  const ProgressRing = ({pct, size=40}) => {
    const r = (size-4)/2;
    const c = 2*Math.PI*r;
    const o = c - pct*c;
    return (
      <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
        <circle cx={size/2} cy={size/2} r={r} stroke={bd} strokeWidth="3" fill="none"/>
        <circle cx={size/2} cy={size/2} r={r} stroke={teal} strokeWidth="3" fill="none" strokeDasharray={c} strokeDashoffset={o} strokeLinecap="round" style={{transition:"stroke-dashoffset .4s"}}/>
        <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="middle" style={{transform:`rotate(90deg)`,transformOrigin:`${size/2}px ${size/2}px`,fontSize:14,fontWeight:700,fill:navy,fontFamily:f}}>{Math.round(pct*100)}%</text>
      </svg>
    );
  };

  // ─────────────────────────────────────────
  // SCREEN 4: MODERATE
  // ─────────────────────────────────────────
  // Editorial layout — no "spreadsheet" look. One competency at a time, with editorial typography.
  // Pinned left rail: competency list + progress. Main: indicator-scoring-matrix with outlier highlights, editable Final + N/A toggle.
  // Right rail (fixed): 5 drawer buttons (Profile, Overall Scoring, Reports, Evaluations, Recordings).
  const [compIdx, setCompIdx] = useState(3); // Transformation Enabler default
  const [finalScores, setFinalScores] = useState({}); // indId -> number
  const [finalNA, setFinalNA] = useState({}); // indId -> bool
  const [drawer, setDrawer] = useState(() => { const d = window.LHRoute && LHRoute.getQuery("drawer"); return (d && ["profile", "scoring", "reports", "evals", "recs"].includes(d)) ? [d] : []; }); // open drawer stack (up to 2)
  const [panelH, setPanelH] = useState(typeof window!=="undefined"?Math.round(window.innerHeight*0.5):420);
  const panelRef = useRef(null);
  const [modSplit, setModSplit] = useState(70); // main-content % when the side drawer is open (70/30)
  const splitContainerRef = useRef(null);
  const topPaneRef = useRef(null);
  const botPaneRef = useRef(null);
  const panelDrag = (e) => {
    e.preventDefault();
    const startY = (e.touches?e.touches[0]:e).clientY;
    const startH = panelRef.current ? panelRef.current.offsetHeight : panelH;
    let latest = startH;
    document.body.style.userSelect = "none";
    const move = (ev) => {
      if (ev.cancelable) ev.preventDefault();
      const y = (ev.touches?ev.touches[0]:ev).clientY;
      latest = Math.min(Math.max(startH+(startY-y),220), window.innerHeight-160);
      if (panelRef.current) panelRef.current.style.height = latest+"px";
    };
    const up = () => {
      document.body.style.userSelect = "";
      setPanelH(latest);
      window.removeEventListener("mousemove",move); window.removeEventListener("mouseup",up); window.removeEventListener("touchmove",move); window.removeEventListener("touchend",up);
    };
    window.addEventListener("mousemove",move); window.addEventListener("mouseup",up); window.addEventListener("touchmove",move,{passive:false}); window.addEventListener("touchend",up);
  };
  const emptyComp4 = () => [{comp:"",fb:""},{comp:"",fb:""},{comp:"",fb:""},{comp:"",fb:""}];
  const [narratives, setNarratives] = useState({ candidate:"", target:"", behavioural:"", overall:"", missionCritical:emptyComp4(), important:emptyComp4(), yearsExp:"", minEdu:"", prefEdu:"" });
  const [moderationLocked, setModerationLocked] = useState(false);
  const [modResult, setModResult] = useState(null); // {type:"success"|"error", tab:"matrix"|"narratives"}
  const [narrErrors, setNarrErrors] = useState({}); // inline required-field errors on Narrative Summary
  const [scoreError, setScoreError] = useState(false); // inline error on Scoring submit
  const [scorePanelOpen, setScorePanelOpen] = useState(true); // Lead Assessor Form: left scoring summary panel
  // NEW — matrix moderation state
  const [modTab, setModTab] = useState(() => (window.LHRoute && LHRoute.getQuery("tab") === "lead-form") ? "narratives" : "matrix"); // matrix | narratives
  // ── URL ── On the Moderate page reflect the tab (Scoring vs Lead Assessor Form) and the
  // open right-rail drawer (profile/scoring/reports/evals/recs) so each is its own address.
  useEffect(() => {
    if (!window.LHRoute) return;
    if (route !== "moderate") { window.LHRoute.setQueries({ tab: null, drawer: null }); return; }
    window.LHRoute.setQueries({ tab: modTab === "narratives" ? "lead-form" : null, drawer: drawer[0] || null });
  }, [route, modTab, drawer]);
  useEffect(() => {
    if (!window.LHRoute) return;
    return window.LHRoute.onPop(() => {
      setModTab(window.LHRoute.getQuery("tab") === "lead-form" ? "narratives" : "matrix");
      const d = window.LHRoute.getQuery("drawer");
      setDrawer((d && ["profile", "scoring", "reports", "evals", "recs"].includes(d)) ? [d] : []);
    });
  }, []);
  const [expandedComps, setExpandedComps] = useState(() => new Set(["ST","IDM","IE","TE","CA","RD","TN","EC"])); // all expanded by default
  const [activeCell, setActiveCell] = useState(null); // { indId, formIdx } | null
  const [compOverride, setCompOverride] = useState({}); // compId -> number (manual competency-level final)
  const [numAssessors, setNumAssessors] = useState(2); // 1–4 assessors per form
  const [hiddenForms, setHiddenForms] = useState(() => new Set()); // form indices hidden via Filters
  const [filterMenu, setFilterMenu] = useState(false); // Filters popover
  const [previewOpen, setPreviewOpen] = useState(false); // floating assessor-preview panel
  const [plainNumbers, setPlainNumbers] = useState(true); // hide cell backgrounds behind numbers (default)
  const [dashSample, setDashSampleRaw] = useState(()=>{ try{return localStorage.getItem("ac-dash-sample")||"1";}catch(e){return "1";} });
  const setDashSample = (v)=>{ setDashSampleRaw(v); try{localStorage.setItem("ac-dash-sample",v);}catch(e){} };
  const [sampleMenuOpen, setSampleMenuOpen] = useState(false);
  const tipRef = useRef(null); // imperative header/score tooltip (no re-render → no blink)

  const toggleDrawer = (k) => setDrawer(prev => prev.includes(k) ? [] : [k]);
  const _oldToggleDrawer = (k) => setDrawer(prev => {
    if (prev.includes(k)) return prev.filter(x=>x!==k);
    if (prev.length >= 2) return [prev[1], k];
    return [...prev, k];
  });

  const Moderate = () => {
    const c = candidates.find(x => x.id === subjectId);
    if (!c) return null;

    const statsFor = (id) => {
      const raw = scoreData[id] || [null,null,null,null,null];
      const vals = raw.filter(v => typeof v === "number");
      if (!vals.length) return { vals:raw, avg:null, range:null, median:null };
      const avg = vals.reduce((a,b)=>a+b,0)/vals.length;
      const lo = Math.min(...vals), hi = Math.max(...vals);
      const sorted = [...vals].sort((a,b)=>a-b);
      const med = sorted.length%2===1 ? sorted[Math.floor(sorted.length/2)] : (sorted[sorted.length/2-1]+sorted[sorted.length/2])/2;
      return { vals:raw, avg, range:[lo,hi], median:med };
    };

    const getFinal = (id, fb) => finalScores[id] !== undefined ? finalScores[id] : fb;
    const setFinal = (id, v) => setFinalScores(p=>({...p,[id]:v}));
    const setNA = (id, v) => setFinalNA(p=>({...p,[id]:v}));

    const railW = 56;
    const drawerW = vw < 1200 ? 340 : 400;
    const barH = 48;
    const drawerOpen = drawer.length > 0;
    const bottomTotal = barH + (drawerOpen ? panelH : 0);
    const rightTotal = 0;

    // Draggable 50/50 split between scoring (top) and the open drawer (bottom).
    // Drive the flex-grow of the two panes directly during the drag so we don't
    // re-render the (heavy) matrix on every mousemove — that caused the flicker.
    const modSplitDrag = (e) => {
      e.preventDefault();
      const cont = splitContainerRef.current; if(!cont) return;
      const rect = cont.getBoundingClientRect();
      document.body.style.userSelect = "none"; document.body.style.cursor = "col-resize";
      let latest = modSplit;
      const move = (ev) => {
        const x = (ev.touches?ev.touches[0]:ev).clientX;
        let pct = ((x - rect.left) / rect.width) * 100;
        pct = Math.min(Math.max(pct, 45), 85);
        latest = pct;
        if (topPaneRef.current) topPaneRef.current.style.flexGrow = String(pct);
        if (botPaneRef.current) botPaneRef.current.style.flexGrow = String(100 - pct);
      };
      const up = () => {
        document.body.style.userSelect = ""; document.body.style.cursor = "";
        setModSplit(latest);
        window.removeEventListener("mousemove",move); window.removeEventListener("mouseup",up);
        window.removeEventListener("touchmove",move); window.removeEventListener("touchend",up);
      };
      window.addEventListener("mousemove",move); window.addEventListener("mouseup",up);
      window.addEventListener("touchmove",move,{passive:false}); window.addEventListener("touchend",up);
    };

    const toggleComp = (id) => setExpandedComps(prev => {
      const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n;
    });
    const expandAll = () => setExpandedComps(new Set(competencies.map(cc=>cc.id)));
    const collapseAll = () => setExpandedComps(new Set());
    // One control instead of two: the label names the action available right now, so
    // the toolbar keeps the room for filters rather than spending it on a dead option.
    const allExpanded = competencies.length > 0 && expandedComps.size >= competencies.length;
    const toggleAll = () => (allExpanded ? collapseAll() : expandAll());

    // Competency-level rollup across its indicators
    const compStats = (cc) => {
      const perInd = cc.indicators.map(ind => {
        if (finalNA[ind.id]) return null;
        const s = statsFor(ind.id);
        return getFinal(ind.id, s.avg !== null ? s.avg : null);
      }).filter(v => typeof v === "number");
      if (!perInd.length) return { avg:null, done:0, total:cc.indicators.length };
      const avg = perInd.reduce((a,b)=>a+b,0)/perInd.length;
      const done = cc.indicators.filter(ind => finalScores[ind.id] !== undefined || finalNA[ind.id]).length;
      return { avg, done, total:cc.indicators.length };
    };

    const getCompFinal = (cc) => {
      if (compOverride[cc.id] !== undefined) return compOverride[cc.id];
      return compStats(cc).avg;
    };

    // Overall pillars — Sova-style summary chips pinned at top of matrix
    const overallCompetencyAvg = (() => {
      const vals = competencies.map(cc => getCompFinal(cc)).filter(v => typeof v === "number");
      if (!vals.length) return null;
      return vals.reduce((a,b)=>a+b,0)/vals.length;
    })();
    const overallHogan = hoganTotal;
    const overallGlobal = overallCompetencyAvg !== null ? (overallCompetencyAvg*0.7 + overallHogan*0.3) : null;

    // Global completion across all indicators
    const totalInd = competencies.reduce((a,cc)=>a+cc.indicators.length,0);
    const doneInd = competencies.reduce((a,cc)=>a+compStats(cc).done,0);

    const scoreColor = (v) => {
      if (typeof v !== "number") return tm;
      if (v >= 4) return green;
      if (v >= 3) return orange;
      if (v >= 2) return orange;
      return red;
    };
    const scoreBg = (v) => {
      if (typeof v !== "number") return "transparent";
      if (v >= 4) return "#E4F4EA";
      if (v >= 3) return "#FFF3E5";
      if (v >= 2) return "#FFF3E5";
      return "#FCE8EA";
    };
    const bandLabel = (v) => {
      if (typeof v !== "number") return "Not Applicable";
      if (v >= 4) return `Strong · ${Number.isInteger(v)?v:v.toFixed(2)}`;
      return `Low Score · ${Number.isInteger(v)?v:v.toFixed(2)}`;
    };
    // Score-band SWATCH — colour only (no number). Numbers live in the Final column.
    const bandWord = (v) => typeof v!=="number" ? "Not applicable" : (v>=4 ? "Strong" : (v>=2.5 ? "Moderate" : "Low score"));
    const Swatch = ({v, outlier, onClick, active, title, small}) => {
      if (v === null || typeof v !== "number") return <NullMark t="Not Applicable"/>;
      const col = scoreColor(v), bgc = scoreBg(v);
      const style = {display:"inline-block",width:small?26:34,height:14,borderRadius:8,background:bgc,border:`1px solid ${outlier?orange:col}`,cursor:onClick?"pointer":"default",boxShadow:active?`0 0 0 2px ${navy}`:(outlier?`0 0 0 2px ${orange}33`:"none"),transition:"box-shadow .12s",verticalAlign:"middle"};
      const tip = title || bandWord(v);
      return onClick
        ? <button onClick={onClick} onMouseEnter={e=>showTip(e,tip)} onMouseLeave={hideTip} aria-label={tip} style={style}/>
        : <span onMouseEnter={e=>showTip(e,tip)} onMouseLeave={hideTip} aria-label={tip} style={style}/>;
    };
    const assessorRoster = ["William Bennett","Elizabeth Turner","James Carter","Charlotte Hughes"];
    const activeAssessors = assessorRoster.slice(0, numAssessors);
    const assessorColors = [teal, "#8F20DE", "#E9AE00", "#0F8A5F"]; // chart accents (teal/purple/gold/green)
    const initials = (nm) => nm.split(/\s+/).map(w=>w[0]).slice(0,2).join("").toUpperCase();
    const shownForms = assessorForms.map((af, fi) => ({af, fi})).filter(x => !hiddenForms.has(x.fi));
    const toggleForm = (fi) => setHiddenForms(prev => { const n = new Set(prev); if (n.has(fi)) n.delete(fi); else n.add(fi); return n; });
    // Null / no-score mark (replaces the em-dash)
    const NullMark = ({t}) => (
      <span onMouseEnter={e=>showTip(e,t||"Not Applicable")} onMouseLeave={hideTip} style={{display:"inline-flex",alignItems:"center",justifyContent:"center",color:tf,cursor:"default"}}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="8"/><line x1="6.7" y1="6.7" x2="17.3" y2="17.3"/></svg>
      </span>
    );
    const showTip = (e, text) => { const el = tipRef.current; if(!el) return; const r = e.currentTarget.getBoundingClientRect(); el.textContent = text; el.style.left = Math.min(r.left, window.innerWidth-300)+"px"; el.style.top = (r.bottom+6)+"px"; el.style.display = "block"; };
    const hideTip = () => { if(tipRef.current) tipRef.current.style.display = "none"; };

    // Short evidence lines mapped by assessor-form short code (for cell popover).
    const cellEvidence = {
      "CBI":"Past example from Q2 EMEA launch: anchored on forecast divergence; framed a staged option plan; gave limited attention to second-order stakeholder effects.",
      "CASE":"Three-phase plan: protect Q3, accelerate tech rollout, re-baseline Q4. Strong commercial logic; organisational ripple-effects under-explored.",
      "RP":"Role-play with direct report: listened well; structured coaching conversation; paused before the harder feedback — an avoidance pattern.",
      "TIG":"Technical depth satisfactory for grade. Sourced correct governance frame. Stronger on numbers than on narrative framing.",
      "TRW":"Submitted 4 minutes early. Executive summary crisp; assumptions flagged; 'what to stop' section thin.",
    };

    // Pre-compute form-column footer totals (per form, across all scored indicators)
    const formColumnAvgs = assessorForms.map((_af, fi) => {
      const vals = competencies.flatMap(cc => cc.indicators.map(ind => {
        const s = statsFor(ind.id); return s.vals[fi];
      })).filter(v => typeof v === "number");
      if (!vals.length) return null;
      return vals.reduce((a,b)=>a+b,0)/vals.length;
    });

    // Sticky column widths
    const firstColW = numAssessors === 1 ? 340 : 260;
    const subCellW = numAssessors === 1 ? 130 : 58;              // one assessor sub-column
    const cellW = subCellW * numAssessors; // one exercise group
    const rangeColW = 112;
    const avgColW = 118;
    const finalColW = 148;

    const breadcrumbItems = entryPath === "campaign" && campaignId
      ? [
          { label:"Dashboard", onClick:()=>{ setRoute("dashboard"); setDashTab("campaign"); } },
          { label:campaigns.find(x=>x.id===campaignId)?.project || "Campaign", onClick:()=>setRoute("campaign") },
          { label:c.name, onClick:()=>setRoute("candidate") },
          { label:"Moderate" }
        ]
      : [
          { label:"Dashboard", onClick:()=>setRoute("dashboard") },
          { label:c.name, onClick:()=>setRoute("candidate") },
          { label:"Moderate" }
        ];

    return (
      <div className="an1" data-screen-label="04 Moderate" style={{height:"100%",position:"relative",display:"flex",flexDirection:"column"}}>
        {/* Header bar */}
        <div style={{padding:"18px 32px 0",borderBottom:`1px solid ${bd}`,background:bg}}>
          <div style={{display:"flex",alignItems:"center",gap:20,flexWrap:"wrap",marginBottom:14}}>
            <div style={{flex:1,minWidth:200,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
              <div style={{width:34,height:34,borderRadius:17,background:`${teal}1A`,color:teal,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,flexShrink:0}}>{c.name.split(" ").map(n=>n[0]).slice(0,2).join("")}</div>
              <h1 className="h1" style={{fontSize:22,margin:0}}>{c.name}</h1>
              <span style={{fontSize:14,color:tm,alignSelf:"flex-end",paddingBottom:2}}>{c.email}</span>
            </div>
            <button onClick={()=>setRoute(entryPath==="campaign" ? "campaign" : "candidate")} className="btn" style={{padding:"7px 14px",fontSize:14,textAlign:"right",justifyContent:"flex-end",background:"#fff",border:`1px solid ${bd}`,color:tx}}><I.X s={15}/> Close</button>
          </div>

          {/* Tab switcher */}
          <div style={{display:"flex",alignItems:"center",gap:0}}>
            {[
              {k:"matrix", l:"Scoring"},
              {k:"narratives", l:"Lead Assessor Form"},
            ].map(t => {
              const active = modTab === t.k;
              return (
                <button key={t.k} onClick={()=>{setModTab(t.k);setModResult(null);setScoreError(false);setNarrErrors({});}} style={{padding:"10px 18px",marginRight:10,fontSize:14,fontWeight:active?700:500,color:active?navy:tm,borderBottom:`2px solid ${active?navy:"transparent"}`,marginBottom:-1}}>
                  {t.l}
                </button>
              );
            })}
          </div>
        </div>

        {/* Body: content column + right rail */}
        <div style={{flex:1,minHeight:0,display:"flex",flexDirection:"row"}}>
        <div style={{flex:1,minWidth:0,display:"flex",flexDirection:"column"}}>
        <div ref={splitContainerRef} style={{flex:1,minHeight:0,display:"flex",flexDirection:"row",overflow:"hidden"}}>
        <div className="no-sb" ref={topPaneRef} style={{flexGrow:drawerOpen?modSplit:1,flexBasis:0,flexShrink:1,minWidth:0,overflow:"auto",background:bg}}>
          {!modResult && modTab === "matrix" && (
            <div style={{padding:"24px 32px 32px"}}>
              {/* Floating preview switcher (demo aid) — number of assessors; collapses to an edge tab */}
              {!previewOpen ? (
                <button onClick={()=>setPreviewOpen(true)} title="Preview: assessors per exercise" style={{position:"fixed",right:railW+16,bottom:84,zIndex:60,background:navy,color:"#fff",border:"none",borderRadius:8,boxShadow:"0 6px 22px rgba(0,15,71,.26)",padding:"10px 14px",display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
                  <I.Gear s={15}/>
                  <span style={{fontSize:14,fontWeight:700,letterSpacing:.3}}>Preview · {numAssessors}</span>
                </button>
              ) : (
                <div style={{position:"fixed",right:railW+16,bottom:84,zIndex:60,background:navy,color:"#fff",borderRadius:10,boxShadow:"0 8px 30px rgba(0,15,71,.28)",padding:"12px 14px 14px 16px",width:154}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                    <span style={{display:"flex",alignItems:"center",gap:6,fontSize:14,fontWeight:700,letterSpacing:0,opacity:.85}}><I.Gear s={12}/> Preview</span>
                    <button onClick={()=>setPreviewOpen(false)} title="Hide" style={{marginLeft:"auto",color:"#fff",opacity:.7,padding:2,display:"inline-flex",cursor:"pointer"}}><I.X s={13}/></button>
                  </div>
                  <div style={{fontSize:14,opacity:.6,marginBottom:10,lineHeight:1.35}}>How the matrix looks with N assessors</div>
                  <div style={{display:"flex",flexDirection:"column",gap:6}}>
                    {[1,2,3,4].map(n => (
                      <button key={n} onClick={()=>setNumAssessors(n)} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:6,fontSize:14,fontWeight:n===numAssessors?700:500,textAlign:"left",cursor:"pointer",color:n===numAssessors?navy:"#fff",background:n===numAssessors?gold:"rgba(255,255,255,.08)",border:`1px solid ${n===numAssessors?gold:"rgba(255,255,255,.14)"}`,transition:"all .12s"}}>
                        <span style={{width:14,display:"inline-flex"}}>{n===numAssessors ? <I.Check s={13}/> : null}</span>
                        {`${n} assessor${n>1?"s":""}`}
                      </button>
                    ))}
                  </div>
                  <div style={{height:1,background:"rgba(255,255,255,.14)",margin:"12px 0 10px"}}/>
                  <div style={{fontSize:14,fontWeight:700,letterSpacing:0,opacity:.85,marginBottom:8}}>Number style</div>
                  <button onClick={()=>setPlainNumbers(v=>!v)} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"8px 10px",borderRadius:6,fontSize:14,fontWeight:plainNumbers?700:500,textAlign:"left",cursor:"pointer",color:plainNumbers?navy:"#fff",background:plainNumbers?gold:"rgba(255,255,255,.08)",border:`1px solid ${plainNumbers?gold:"rgba(255,255,255,.14)"}`,transition:"all .12s",lineHeight:1.3}}>
                    <span style={{width:14,display:"inline-flex",flexShrink:0,marginTop:1}}>{plainNumbers ? <I.Check s={13}/> : null}</span>
                    Numbers without background
                  </button>
                </div>
              )}

              {/* Matrix controls: assessor roster (left) + filters & expand/collapse (right) */}
              <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:14,flexWrap:"wrap"}}>
                <div style={{display:"flex",alignItems:"center",gap:18,flexWrap:"wrap",flex:1,minWidth:200}}>
                  {activeAssessors.map((nm, i) => (
                    <span key={i} style={{fontSize:14,color:ts}}><span style={{fontWeight:700,color:navy}}>Assessor {i+1}:</span> {nm}</span>
                  ))}
                </div>
                <div style={{position:"relative"}}>
                  <button onClick={()=>setFilterMenu(o=>!o)} className="btn btn-secondary" style={{fontSize:14,padding:"6px 12px",display:"inline-flex",alignItems:"center",gap:6,whiteSpace:"nowrap"}} title="Show or hide exercise columns">
                    <I.Filter s={13}/> <span>Filters{hiddenForms.size>0?` · ${shownForms.length}/${assessorForms.length}`:""}</span> <I.Chev s={11} r={filterMenu?270:90}/>
                  </button>
                  {filterMenu && (
                    <div style={{position:"absolute",top:"calc(100% + 6px)",right:0,zIndex:20,background:card,border:`1px solid ${bd}`,borderRadius:br,boxShadow:"0 8px 28px rgba(0,15,71,.14)",overflow:"hidden",width:280}}>
                      <div style={{fontSize:14,fontWeight:700,color:tm,padding:"10px 14px 6px",letterSpacing:0}}>Assessor Forms</div>
                      {assessorForms.map((af, fi) => {
                        const on = !hiddenForms.has(fi);
                        return (
                          <label key={af.short} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 14px",fontSize:14,color:tx,cursor:"pointer"}}>
                            <span onClick={()=>toggleForm(fi)} style={{width:15,height:15,borderRadius:4,border:`1.5px solid ${on?teal:bdStrong}`,background:on?teal:"transparent",display:"inline-flex",alignItems:"center",justifyContent:"center",color:"#fff",flexShrink:0}}>{on ? <I.Check s={11}/> : null}</span>
                            <span onClick={()=>toggleForm(fi)} className="elide" style={{flex:1}}>{af.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
                <button onClick={toggleAll} className="btn btn-ghost"
                  title={allExpanded ? "Collapse every competency" : "Expand every competency"}
                  style={{fontSize:14,color:tm,padding:"4px 8px",display:"inline-flex",alignItems:"center",gap:6,whiteSpace:"nowrap"}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
                    {allExpanded
                      ? <React.Fragment><path d="M7 20l5-5 5 5" /><path d="M7 4l5 5 5-5" /></React.Fragment>
                      : <React.Fragment><path d="M7 15l5 5 5-5" /><path d="M7 9l5-5 5 5" /></React.Fragment>}
                  </svg>
                  {allExpanded ? "Collapse all" : "Expand all"}
                </button>
              </div>

              {/* THE MATRIX */}
              <div style={{border:`1px solid ${bd}`,borderRadius:br,background:card,overflow:"auto",position:"relative",maxHeight:"calc(100vh - 250px)"}}>
                <table style={{borderCollapse:"separate",borderSpacing:0,fontSize:14,width:"100%",tableLayout:"fixed"}}>
                  <thead>
                    <tr>
                      <th rowSpan={numAssessors>1?2:1} style={{position:"sticky",left:0,top:0,zIndex:5,background:sbBg,padding:"12px 18px",textAlign:"left",verticalAlign:"top",borderRight:`1px solid ${bd}`,borderBottom:`1px solid ${bd}`,width:firstColW,minWidth:firstColW}}>
                        <div style={{fontSize:14,fontWeight:700,letterSpacing:0,color:navy}}>Competency / Indicator</div>
                        {numAssessors>1 && <div style={{fontSize:14,fontWeight:600,color:tm,marginTop:14}}>Assessors</div>}
                      </th>
                      {shownForms.map(({af, fi}) => (
                        <th key={af.short} colSpan={numAssessors} style={{position:"sticky",top:0,zIndex:3,background:sbBg,padding:"10px 8px 4px",textAlign:"left",borderLeft:`1px solid ${bd}`,width:cellW,minWidth:cellW}}>
                          <div className="ex-head" onMouseEnter={e=>showTip(e,`${af.name} · ${af.exercise}`)} onMouseLeave={hideTip} style={{display:"flex",alignItems:"center",gap:5,fontSize:14,fontWeight:700,color:navy,letterSpacing:0}}>
                            <span className="elide" style={{flex:1,minWidth:0}}>{af.name}</span>
                            <span style={{display:"inline-flex",alignItems:"center",gap:5,flexShrink:0}}>
                              <span style={{color:tm,display:"inline-flex"}}><I.Info s={12}/></span>
                              <span title={`Sort by ${af.name}`} onClick={()=>showToast(`Sorted by ${af.short}`)} style={{color:tm,display:"inline-flex",cursor:"pointer"}}><I.Sort s={12}/></span>
                            </span>
                          </div>
                        </th>
                      ))}
                      <th rowSpan={numAssessors>1?2:1} style={{position:"sticky",right:finalColW+avgColW,top:0,zIndex:5,background:sbBg,color:navy,padding:"12px 10px",textAlign:"center",fontSize:14,fontWeight:700,letterSpacing:0,textTransform:"none",borderLeft:`2px solid ${navy}`,borderBottom:`1px solid ${bd}`,width:rangeColW,minWidth:rangeColW}}>
                        Score<br/>Range
                      </th>
                      <th rowSpan={numAssessors>1?2:1} style={{position:"sticky",right:finalColW,top:0,zIndex:5,background:sbBg,color:navy,padding:"12px 10px",textAlign:"center",fontSize:14,fontWeight:700,letterSpacing:0,textTransform:"none",borderLeft:`1px solid ${bd}`,borderBottom:`1px solid ${bd}`,width:avgColW,minWidth:avgColW}}>
                        Average
                      </th>
                      <th rowSpan={numAssessors>1?2:1} style={{position:"sticky",right:0,top:0,zIndex:5,background:navy,color:"#fff",padding:"12px 10px",textAlign:"center",fontSize:14,fontWeight:700,letterSpacing:0,textTransform:"none",borderLeft:`2px solid ${navy}`,width:finalColW,minWidth:finalColW}}>
                        Final
                      </th>
                    </tr>
                    {numAssessors > 1 && (
                      <tr>
                        {shownForms.map(({af, fi}) => (
                          activeAssessors.map((nm, ai) => (
                            <th key={af.short+ai} title={nm} style={{position:"sticky",top:30,zIndex:3,background:sbBg,boxShadow:`0 -4px 0 ${sbBg}`,padding:"2px 6px 10px",textAlign:"center",borderBottom:`1px solid ${bd}`,borderLeft:ai===0?`1px solid ${bd}`:"none",width:subCellW,minWidth:subCellW}}>
                              <span title={nm} style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:24,height:24,borderRadius:"50%",background:assessorColors[ai%assessorColors.length],color:"#fff",fontSize:14,fontWeight:700,letterSpacing:.2}}>{initials(nm)}</span>
                            </th>
                          ))
                        ))}
                      </tr>
                    )}
                  </thead>
                  <tbody>
                    {competencies.map((cc, ccIdx) => {
                      const open = expandedComps.has(cc.id);
                      const cs = compStats(cc);
                      const cFinal = getCompFinal(cc);
                      const overridden = compOverride[cc.id] !== undefined;
                      const compHasError = cc.indicators.some(ind=>{ if(finalNA[ind.id]||finalScores[ind.id]===undefined) return false; const r=statsFor(ind.id).range; return r&&(finalScores[ind.id]<r[0]||finalScores[ind.id]>r[1]); });
                      return (
                        <React.Fragment key={cc.id}>
                          {/* PARENT (competency) row */}
                          <tr style={{background:compHasError?`${red}08`:(open?`${navy}06`:"#fff"),borderTop:ccIdx>0?`1px solid ${bd}`:"none"}}>
                            <td style={{position:"sticky",left:0,zIndex:2,background:compHasError?"#FDF2F2":(open?"#F4F6FB":"#fff"),padding:"8px 18px",borderRight:`1px solid ${bd}`,borderBottom:`1px solid ${bd}`,cursor:"pointer",width:firstColW,minWidth:firstColW}} onClick={()=>toggleComp(cc.id)}>
                              <div style={{display:"flex",alignItems:"center",gap:10}}>
                                <I.Chev s={12} r={open?90:0} style={{color:tm,flexShrink:0}}/>
                                <div style={{minWidth:0,flex:1}}>
                                  <div style={{fontSize:14,fontWeight:700,color:navy,letterSpacing:-.1,display:"flex",alignItems:"center",gap:6}}>{cc.name}{compHasError && <span title="One or more moderated final scores are out of range" style={{display:"inline-flex",color:red,flexShrink:0}}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>}</div>
                                  {compHasError && <div style={{fontSize:14,color:red,marginTop:2,fontWeight:700}} className="tnum">{open?"Score out of range":"Expand — score out of range"}</div>}
                                </div>
                              </div>
                            </td>
                            {/* Per-(form × assessor) competency AVG */}
                            {shownForms.map(({af, fi}) => {
                              const vals = cc.indicators.map(ind => statsFor(ind.id).vals[fi]).filter(v => typeof v === "number");
                              const avg = vals.length ? vals.reduce((a,b)=>a+b,0)/vals.length : null;
                              return activeAssessors.map((nm, ai) => (
                                <td key={af.short+ai} style={{padding:"10px 6px",textAlign:"center",borderBottom:`1px solid ${bd}`,borderLeft:ai===0?`1px solid ${bd}`:"none",background:"inherit"}}></td>
                              ));
                            })}
                            {/* Competency SCORE RANGE */}
                            <td style={{position:"sticky",right:finalColW+avgColW,zIndex:1,background:compHasError?"#FDF2F2":"#F4F6FB",padding:"8px 10px",textAlign:"center",borderLeft:`2px solid ${compHasError?red:navy}`,borderBottom:`1px solid ${bd}`,width:rangeColW,minWidth:rangeColW}}></td>
                            {/* Competency heading row: no scores */}
                            <td style={{position:"sticky",right:finalColW,zIndex:1,background:compHasError?"#FDF2F2":"#F4F6FB",padding:"8px 10px",textAlign:"center",borderLeft:`1px solid ${bd}`,borderBottom:`1px solid ${bd}`,width:avgColW,minWidth:avgColW}}></td>
                            <td style={{position:"sticky",right:0,zIndex:1,background:compHasError?"#FDF2F2":"#F4F6FB",padding:"8px 10px",textAlign:"center",borderLeft:`2px solid ${compHasError?red:navy}`,borderBottom:`1px solid ${bd}`,width:finalColW,minWidth:finalColW}}></td>
                          </tr>

                          {/* CHILD (indicator) rows */}
                          {open && cc.indicators.map((ind, iIdx) => {
                            const s = statsFor(ind.id);
                            const isNA = !!finalNA[ind.id];
                            const finalVal = getFinal(ind.id, s.avg !== null ? +(s.avg.toFixed(2)) : 0);
                            const iRange = s.range; // [lo,hi] of assessor scores
                            const iEdited = finalScores[ind.id] !== undefined;
                            const outOfRange = !isNA && iEdited && iRange && (finalVal < iRange[0] || finalVal > iRange[1]);
                            const fmtR = x => Number.isInteger(x) ? x : x.toFixed(1);
                            return (
                              <tr key={ind.id} style={{background:outOfRange?`${red}08`:card}}>
                                <td style={{position:"sticky",left:0,zIndex:2,background:card,padding:"10px 18px 10px 44px",borderRight:`1px solid ${bd}`,borderBottom:`1px solid ${bd}`,width:firstColW,minWidth:firstColW}}>
                                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                                    <span className="tnum" style={{fontSize:14,color:tm,fontWeight:700,minWidth:32}}>{ind.id}</span>
                                    <span style={{fontSize:14,color:tx}}>{ind.label}</span>
                                  </div>
                                </td>
                                {shownForms.map(({af, fi}) => {
                                  const v = s.vals[fi];
                                  const isOutlier = v !== null && s.median !== null && Math.abs(v - s.median) >= 0.6;
                                  return activeAssessors.map((nm, ai) => {
                                    const isActive = activeCell && activeCell.indId === ind.id && activeCell.formIdx === fi && activeCell.aIdx === ai;
                                    return (
                                      <td key={af.short+ai} style={{padding:"6px 6px",textAlign:"center",borderBottom:`1px solid ${bd}`,borderLeft:ai===0?`1px solid ${bd}`:"none",position:"relative"}}>
                                        {v === null ? (
                                          <NullMark t="Not Applicable"/>
                                        ) : (
                                          <button onClick={()=>setActiveCell(isActive?null:{indId:ind.id, formIdx:fi, aIdx:ai, compId:cc.id})} onMouseEnter={e=>{ if(v<4) showTip(e, v>=3?"Low score":"Very low score"); }} onMouseLeave={hideTip} style={{display:"inline-block",padding:"4px 8px",fontSize:14,fontWeight:700,fontVariantNumeric:"tabular-nums",color:v>=4?tx:red,background:isActive?navyBg:"transparent",border:isActive?`1px solid ${navy}`:"1px solid transparent",borderRadius:br,cursor:"pointer",minWidth:34,transition:"all .12s"}}>
                                            {Number.isInteger(v)?v:v.toFixed(2)}
                                          </button>
                                        )}
                                      </td>
                                    );
                                  });
                                })}
                                {/* Indicator SCORE RANGE */}
                                <td style={{position:"sticky",right:finalColW+avgColW,zIndex:1,background:outOfRange?"#FDF2F2":card,padding:"6px 10px",textAlign:"center",borderLeft:`2px solid ${outOfRange?red:navy}`,borderBottom:`1px solid ${bd}`,width:rangeColW,minWidth:rangeColW}}>
                                  {iRange ? <span className="tnum" style={{fontSize:14,color:outOfRange?red:tm,fontWeight:600,whiteSpace:"nowrap"}}>{fmtR(iRange[0])} – {fmtR(iRange[1])}</span> : <span style={{color:tf}}>—</span>}
                                </td>
                                {/* Indicator AVERAGE (computed) */}
                                <td style={{position:"sticky",right:finalColW,zIndex:1,background:outOfRange?"#FDF2F2":card,padding:"6px 10px",textAlign:"center",borderLeft:`1px solid ${bd}`,borderBottom:`1px solid ${bd}`,width:avgColW,minWidth:avgColW}}>
                                  {typeof s.avg==="number" ? <span className="tnum" style={{fontSize:14,fontWeight:700,color:s.avg>=4?tx:red}}>{s.avg.toFixed(2)}</span> : <span style={{color:tf}}>—</span>}
                                </td>
                                {/* Indicator FINAL (editable) */}
                                <td style={{position:"sticky",right:0,zIndex:1,background:outOfRange?"#FDF2F2":card,padding:"6px 10px",textAlign:"center",borderLeft:`2px solid ${outOfRange?red:navy}`,borderBottom:`1px solid ${bd}`,width:finalColW,minWidth:finalColW}}>
                                  <div style={{display:"inline-flex",alignItems:"center",gap:8}}>
                                    <input type="number" min="1" max="5" step="0.1" value={finalVal} readOnly={isNA} onChange={e=>setFinal(ind.id, parseFloat(e.target.value)||0)} title={outOfRange?`Outside the assessor range (${fmtR(iRange[0])}–${fmtR(iRange[1])})`:undefined} style={{width:50,padding:"3px 6px",border:`1px solid ${outOfRange?red:(isNA?bd:bdStrong)}`,borderRadius:ir,fontSize:14,fontWeight:700,color:outOfRange?red:navy,background:isNA?bg2:card,fontFamily:f,outline:"none",fontVariantNumeric:"tabular-nums",textAlign:"center",cursor:isNA?"default":"text",boxShadow:outOfRange?`0 0 0 3px ${red}1F`:"none"}}/>
                                    <button onClick={()=>setNA(ind.id,!isNA)} title={isNA?"Not applicable — score locked":"Editable — click to mark not applicable"} aria-pressed={isNA} style={{display:"inline-block",width:70,height:22,borderRadius:11,background:isNA?teal:bg2,border:`1px solid ${isNA?teal:bd}`,cursor:"pointer",transition:"all .15s",position:"relative"}}>
                                      <span style={{position:"absolute",top:0,bottom:0,display:"flex",alignItems:"center",left:isNA?11:"auto",right:isNA?"auto":11,fontSize:14,fontWeight:700,color:isNA?"#fff":tm}}>N/A</span>
                                      <span style={{position:"absolute",top:2,left:isNA?"auto":2,right:isNA?2:"auto",width:16,height:16,borderRadius:8,background:"#fff",boxShadow:"0 1px 2px rgba(0,0,0,.2)"}}/>
                                    </button>
                                  </div>
                                  {outOfRange && <div style={{fontSize:14,color:red,fontWeight:700,marginTop:5,display:"flex",alignItems:"center",justifyContent:"center",gap:4,lineHeight:1.3,whiteSpace:"nowrap"}}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>Outside {fmtR(iRange[0])}–{fmtR(iRange[1])}</div>}
                                </td>
                              </tr>
                            );
                          })}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {ReactDOM.createPortal(
                <div ref={tipRef} style={{display:"none",position:"fixed",zIndex:9999,background:navy,color:"#fff",fontSize:14,fontWeight:500,padding:"7px 11px",borderRadius:6,boxShadow:"0 8px 24px rgba(0,15,71,.34)",maxWidth:280,lineHeight:1.4,pointerEvents:"none"}}></div>,
                document.body
              )}

              {/* Evidence panel when a cell is selected */}
              {activeCell && (() => {
                const ind = competencies.flatMap(cc => cc.indicators).find(x => x.id === activeCell.indId);
                const compOfInd = competencies.find(cc => cc.id === activeCell.compId);
                const af = assessorForms[activeCell.formIdx];
                const s = statsFor(activeCell.indId);
                const v = s.vals[activeCell.formIdx];
                return (
                  <div className="an" style={{marginTop:20,border:`1px solid ${bd}`,borderRadius:br,background:card,overflow:"hidden"}}>
                    <div style={{display:"flex",alignItems:"center",gap:14,padding:"14px 20px",borderBottom:`1px solid ${bd}`,background:sbBg}}>
                      <div style={{display:"flex",alignItems:"baseline",gap:8}}>
                        <p className="eyebrow" style={{color:navy}}>Evidence</p>
                        <span style={{fontSize:14,color:tm}}>· {compOfInd?.name} / {ind?.label}</span>
                      </div>
                      <div style={{flex:1}}/>
                      <span className="tag" style={{background:`${navy}14`,color:navy}}>{assessorRoster[activeCell.aIdx] || `Assessor ${activeCell.aIdx+1}`} · {af.exercise}</span>
                      <div className="tnum" style={{padding:"4px 10px",fontSize:14,fontWeight:700,color:scoreColor(v),background:scoreBg(v),borderRadius:br}}>{typeof v === "number" ? (Number.isInteger(v)?v:v.toFixed(1)) : "—"}</div>
                      <button onClick={()=>setActiveCell(null)} className="btn btn-ghost" style={{padding:4}}><I.X s={14}/></button>
                    </div>
                    <div style={{padding:"16px 20px",display:"grid",gridTemplateColumns:isNarrow?"1fr":"1fr 180px",gap:20}}>
                      <div>
                        <div style={{fontSize:14,color:tm,fontWeight:700,letterSpacing:0,textTransform:"none",marginBottom:6}}>Assessor note</div>
                        <div style={{fontSize:14,color:ts,lineHeight:1.7}}>{cellEvidence[af.short]}</div>
                        <div style={{marginTop:14,display:"flex",gap:8,flexWrap:"wrap"}}>
                          <button onClick={()=>{ toggleDrawer("evals"); }} className="btn btn-secondary" style={{fontSize:14}}><I.Clipboard s={12}/> Full assessor form</button>
                          <button onClick={()=>{ toggleDrawer("recs"); }} className="btn btn-secondary" style={{fontSize:14}}><I.Video s={12}/> Recording</button>
                        </div>
                      </div>
                      <div style={{borderLeft:isNarrow?"none":`1px solid ${bd}`,paddingLeft:isNarrow?0:16,borderTop:isNarrow?`1px solid ${bd}`:"none",paddingTop:isNarrow?16:0}}>
                        <div style={{fontSize:14,color:tm,fontWeight:700,letterSpacing:0,textTransform:"none",marginBottom:8}}>All assessors</div>
                        <div style={{display:"flex",flexDirection:"column",gap:4}}>
                          {assessorForms.map((aff, fi2) => {
                            const vv = s.vals[fi2];
                            return (
                              <button key={aff.short} onClick={()=>setActiveCell({...activeCell, formIdx:fi2})} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 8px",fontSize:14,background:fi2===activeCell.formIdx?navyBg:"transparent",borderRadius:3,textAlign:"left",cursor:"pointer"}}>
                                <span style={{fontSize:14,color:tm,fontWeight:700,minWidth:36}}>{aff.short}</span>
                                <span style={{flex:1,color:tx,fontSize:14}} className="elide">{aff.exercise}</span>
                                <span className="tnum" style={{fontSize:14,fontWeight:600,color:typeof vv==="number"?scoreColor(vv):tm,minWidth:22,textAlign:"right"}}>{typeof vv==="number"?(Number.isInteger(vv)?vv:vv.toFixed(1)):"—"}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Actions below table */}
              {scoreError && (
                <div style={{display:"flex",alignItems:"flex-start",gap:10,padding:"12px 16px",marginTop:28,background:`${red}0D`,border:`1px solid ${red}55`,borderRadius:br}}>
                  <span style={{color:red,flexShrink:0,marginTop:1}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>
                  <div><div style={{fontSize:14,fontWeight:700,color:red,marginBottom:2}}>{scoreError==="range"?"Some final scores are out of range":"Nothing to submit yet"}</div><div style={{fontSize:14,color:tx,lineHeight:1.55}}>{scoreError==="range"?"One or more moderated final scores fall outside the assessors' score range (highlighted in red). Bring them back within range before submitting.":"You haven't moderated any indicator. Set at least one moderated final score, or mark it N/A, before submitting."}</div></div>
                </div>
              )}

            </div>
          )}
          {!modResult && modTab === "narratives" && (
            <div style={{display:"flex",alignItems:"stretch",height:"100%",minHeight:0}}>
              {/* Left: read-only scoring summary (collapsible) */}
              {scorePanelOpen ? (
                <div style={{width:"30%",minWidth:280,maxWidth:400,borderRight:`1px solid ${bd}`,background:card,display:"flex",flexDirection:"column",minHeight:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,padding:"14px 16px",borderBottom:`1px solid ${bd}`,background:sbBg,flexShrink:0}}>
                    <span style={{fontSize:14,fontWeight:700,color:navy,letterSpacing:0,flex:1}}>Moderated scores</span>
                    <button onClick={()=>setScorePanelOpen(false)} title="Hide scores" style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:26,height:26,borderRadius:6,border:`1px solid ${bd}`,background:card,color:tm,cursor:"pointer"}}><I.Chev s={13} r={180}/></button>
                  </div>
                  <div className="no-sb" style={{flex:1,overflow:"auto",minHeight:0}}>
                    {competencies.map((cc,ci)=>{
                      const cFinal = getCompFinal(cc);
                      return (
                        <div key={cc.id} style={{borderBottom:`1px solid ${bd}`}}>
                          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,padding:"11px 16px",background:navyBg}}>
                            <span style={{fontSize:14,fontWeight:700,color:navy}}>{cc.name}</span>
                          </div>
                          {cc.indicators.map(ind=>{
                            const s=statsFor(ind.id); const isNA=!!finalNA[ind.id];
                            const fv=getFinal(ind.id, s.avg!==null?+(s.avg.toFixed(2)):0);
                            return (
                              <div key={ind.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 16px 8px 20px"}}>
                                <span className="tnum" style={{fontSize:14,color:tm,fontWeight:700,minWidth:34}}>{ind.id}</span>
                                <span style={{flex:1,fontSize:14,color:tx}} className="elide">{ind.label}</span>
                                <span className="tnum" style={{fontSize:14,fontWeight:700,color:isNA?tm:(fv>=4?green:(fv>=3?orange:tx)),minWidth:34,textAlign:"right"}}>{isNA?"N/A":(Number.isInteger(fv)?fv:fv.toFixed(2))}</span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <button onClick={()=>setScorePanelOpen(true)} title="Show scores" style={{alignSelf:"flex-start",margin:"16px 0 0 12px",display:"inline-flex",alignItems:"center",gap:6,padding:"8px 12px",borderRight:`1px solid ${bd}`,border:`1px solid ${bd}`,borderRadius:8,background:card,color:navy,fontSize:14,fontWeight:700,cursor:"pointer",flexShrink:0}}><I.Chev s={13}/> Scores</button>
              )}
              {/* Right: the form */}
              <div className="no-sb" style={{flex:1,minWidth:0,overflow:"auto"}}>
                <div style={{padding:"32px 40px 40px",maxWidth:900,margin:"0 auto"}}>
              <div style={{display:"flex",flexDirection:"column",gap:28}}>
                <NarrativeField label="Candidate Profile" hint="Who is this person? 70-word snapshot for the report opener." max={70} value={narratives.candidate} error={narrErrors.candidate} onChange={v=>{setNarratives(p=>({...p,candidate:v})); if(narrErrors.candidate&&v.trim())setNarrErrors(e=>({...e,candidate:null}));}}/>
                <NarrativeField label="Target Profile — Line Manager Interview Summary" hint="What does the target role demand? 150-word synthesis of the LM interview." max={150} value={narratives.target} error={narrErrors.target} onChange={v=>{setNarratives(p=>({...p,target:v})); if(narrErrors.target&&v.trim())setNarrErrors(e=>({...e,target:null}));}}/>
                <NarrativeField label="Behavioural Summary" hint="Cross-competency synthesis: strengths, development edges, reference behaviour. 240 words." max={240} value={narratives.behavioural} error={narrErrors.behavioural} onChange={v=>{setNarratives(p=>({...p,behavioural:v})); if(narrErrors.behavioural&&v.trim())setNarrErrors(e=>({...e,behavioural:null}));}}/>
              </div>

              {/* MISSION CRITICAL */}
              <div style={{...eSep,marginTop:40}}>
                <h3 className="h2" style={{fontSize:22,marginBottom:16}}>Mission Critical</h3>
                <ScaleLegend/>
              </div>
              <div style={{fontSize:14,fontWeight:700,color:navy,marginBottom:20}}>Mission Critical Skills for Target Role</div>
              {narratives.missionCritical.map((v,i) => (
                <CompetencyBlock key={i} num={i+1} value={v} onChange={nv=>setNarratives(p=>{ const a=[...p.missionCritical]; a[i]=nv; return {...p,missionCritical:a}; })}/>
              ))}

              {/* IMPORTANT */}
              <div style={eSep}>
                <h3 className="h2" style={{fontSize:22,marginBottom:16}}>Important</h3>
                <ScaleLegend/>
              </div>
              <div style={{fontSize:14,fontWeight:700,color:navy,marginBottom:20}}>Important Skills for Target Role</div>
              {narratives.important.map((v,i) => (
                <CompetencyBlock key={i} num={i+1} value={v} onChange={nv=>setNarratives(p=>{ const a=[...p.important]; a[i]=nv; return {...p,important:a}; })}/>
              ))}

              {/* OVERALL SUMMARY */}
              <div style={{borderTop:`1px solid ${bd}`,paddingTop:28,marginTop:8}}>
                <NarrativeField label="Overall Summary" hint="Bring it together: overall recommendation and readiness for the target role. 300 words." max={300} value={narratives.overall} error={narrErrors.overall} onChange={v=>{setNarratives(p=>({...p,overall:v})); if(narrErrors.overall&&v.trim())setNarrErrors(e=>({...e,overall:null}));}}/>
              </div>

              {/* JOB DESCRIPTION FIELDS */}
              <div style={{marginTop:32,paddingTop:24,borderTop:`1px solid ${bd}`}}>
                <p style={{fontSize:14,fontWeight:700,color:navy,lineHeight:1.5,marginBottom:20,maxWidth:600}}>Please enter the information below. This can be found in the Job Description that has been shared with you on Kiteworks.</p>
                <div style={{display:"flex",flexDirection:"column",gap:20}}>
                  <NarrativeText label="Years of Experience" value={narratives.yearsExp} onChange={v=>setNarratives(p=>({...p,yearsExp:v}))}/>
                  <NarrativeText label="Minimum Educational Qualification" value={narratives.minEdu} onChange={v=>setNarratives(p=>({...p,minEdu:v}))}/>
                  <NarrativeText label="Preferred Educational Qualification" value={narratives.prefEdu} onChange={v=>setNarratives(p=>({...p,prefEdu:v}))}/>
                </div>
              </div>


                </div>
              </div>
            </div>
          )}
          {modResult && (
            <ModResult
              type={modResult.type}
              title={modResult.type==="success"
                ? (modResult.tab==="matrix" ? "Moderation submitted" : "Lead Assessor Form submitted")
                : (modResult.tab==="matrix" ? "Moderation incomplete" : "Lead Assessor Form incomplete")}
              body={modResult.type==="success"
                ? (modResult.tab==="matrix" ? "The moderated final scores have been recorded. The candidate report is being generated and will appear under Reports shortly." : "Your narrative summary has been saved and attached to the candidate report.")
                : (modResult.tab==="matrix" ? "You haven't moderated any indicator yet. Set at least one final score, or mark it N/A, before submitting the moderation." : "The report needs at least one narrative. Complete the Candidate, Target, Behavioural or Overall summary before submitting.")}
              primaryLabel={modResult.type==="success" ? "Back" : "Go back and fix"}
              onPrimary={modResult.type==="success" ? ()=>{setModResult(null);setRoute(entryPath==="campaign"?"campaign":"candidate");} : ()=>setModResult(null)}
              secondaryLabel={null}
              onSecondary={()=>setModResult(null)}
            />
          )}
        </div>
        {drawerOpen && drawer.map((d) => (
          <React.Fragment key={d}>
            <div onMouseDown={modSplitDrag} onTouchStart={modSplitDrag} style={{position:"relative",width:5,flexShrink:0,background:bdStrong,cursor:"col-resize",zIndex:13}}>
              <div style={{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",width:34,height:34,borderRadius:17,background:card,border:`1px solid ${bd}`,display:"flex",alignItems:"center",justifyContent:"center",color:tm,boxShadow:"0 1px 5px rgba(0,15,71,.14)"}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6 4 12l5 6M15 6l5 6-5 6"/></svg>
              </div>
            </div>
            <div className="slin" ref={botPaneRef} style={{flexGrow:100-modSplit,flexBasis:0,flexShrink:1,minWidth:0,background:card,borderLeft:`1px solid ${bd}`,display:"flex",flexDirection:"column"}}>
              <div style={{flex:1,minHeight:0,display:"flex",flexDirection:"column",paddingTop:8}}>
                <DrawerContent kind={d} onClose={()=>toggleDrawer(d)} candidate={c}/>
              </div>
            </div>
          </React.Fragment>
        ))}
        </div>

        {/* Fixed action bar */}
        {!modResult && (
          <div style={{flexShrink:0,background:card,borderTop:`1px solid ${bd}`,display:"flex",alignItems:"center",justifyContent:"flex-end",gap:10,padding:"12px 32px",zIndex:11}}>
            {modTab === "matrix" ? (
              <>
                <button onClick={()=>{setFinalScores({});setFinalNA({});setCompOverride({});setNarratives({candidate:"",target:"",behavioural:"",overall:"",missionCritical:emptyComp4(),important:emptyComp4(),yearsExp:"",minEdu:"",prefEdu:""});showToast("Moderation reset");}} className="btn btn-secondary">Reset</button>
                <button onClick={()=>showToast("Draft saved")} className="btn btn-secondary"><I.Save s={13}/> Save</button>
                <button onClick={()=>{const outOfRange=competencies.flatMap(cc=>cc.indicators).some(ind=>{if(finalNA[ind.id]||finalScores[ind.id]===undefined)return false; const r=statsFor(ind.id).range; return r&&(finalScores[ind.id]<r[0]||finalScores[ind.id]>r[1]);}); if(outOfRange){setScoreError("range");return;} setScoreError(null); setModerationLocked(true); setModResult({type:"success",tab:"matrix"});}} className="btn btn-primary"><I.Check s={13}/> Submit</button>
              </>
            ) : (
              <>
                <button onClick={()=>showToast("Draft saved")} className="btn btn-secondary"><I.Save s={13}/> Save</button>
                <button onClick={()=>{const req={candidate:narratives.candidate,target:narratives.target,behavioural:narratives.behavioural,overall:narratives.overall}; const errs={}; Object.keys(req).forEach(k=>{if(!req[k]||!req[k].trim())errs[k]="This field is required before you can submit.";}); if(Object.keys(errs).length){setNarrErrors(errs);return;} setNarrErrors({}); setModResult({type:"success",tab:"narratives"});}} className="btn btn-primary"><I.Check s={13}/> Submit</button>
              </>
            )}
          </div>
        )}
        </div>

        {/* Right rail — drawer launchers */}
        <div style={{width:railW,flexShrink:0,background:card,borderLeft:`1px solid ${bd}`,display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"14px 0",zIndex:12}}>
          {[
            { k:"profile", I:I.User, l:"Profile" },
            { k:"scoring", I:I.Chart, l:"Scoring" },
            { k:"reports", I:I.Report, l:"Reports" },
            { k:"evals", I:I.Clipboard, l:"Evals" },
            { k:"recs", I:I.Video, l:"Records" },
          ].map(b => {
            const open = drawer.includes(b.k);
            return (
              <button key={b.k} onClick={()=>toggleDrawer(b.k)} title={b.l} style={{display:"flex",alignItems:"center",justifyContent:"center",width:railW-12,height:railW-16,borderRadius:br,background:open?`${teal}18`:"transparent",color:open?teal:ts,cursor:"pointer",border:`1px solid ${open?teal:"transparent"}`,transition:"all .15s"}}>
                <b.I s={19}/>
              </button>
            );
          })}
        </div>

        </div>

      </div>
    );
  };

  const NarrativeField = ({label, hint, max, value, onChange, error}) => {
    const words = value.trim().split(/\s+/).filter(Boolean).length;
    return (
      <div>
        <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:8}}>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:tx}}>{label}</div>
            <div style={{fontSize:14,color:tm}}>{hint}</div>
          </div>
          <div style={{flex:1}}/>
          <span className="tnum" style={{fontSize:14,fontWeight:600,color:words>max?red:words>0?green:tm}}>{words} / {max} words</span>
        </div>
        <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder="Begin with the most important behavioural observation…" style={{width:"100%",minHeight:100,padding:"12px 14px",border:`1px solid ${error?red:bd}`,borderRadius:br,fontSize:14,color:tx,lineHeight:1.6,background:error?`${red}08`:card,outline:"none",resize:"vertical",fontFamily:f,boxShadow:error?`0 0 0 3px ${red}1A`:"none"}}/>
        {error && <div style={{display:"flex",alignItems:"center",gap:6,fontSize:14,color:red,marginTop:7}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>{error}</div>}
      </div>
    );
  };

  const scaleLegend = [
    ["1 — Significant Development Area:","Demonstrates negative behaviours that impact proficiency at this level (can include absence of positive behaviours)."],
    ["2 — Development Area:","Does not demonstrate any of the behaviours sufficiently or consistently at this level."],
    ["3 — Meets requirements:","Demonstrates 2–3 of the behaviours some of the time."],
    ["4 — Strength:","Demonstrates 3–4 of the behaviours most of the time."],
    ["5 — Significant Strength:","Demonstrates all of the behaviours most of the time."],
  ];

  const ScaleLegend = () => (
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      {scaleLegend.map(([k,v],i) => (
        <div key={i} style={{fontSize:14,color:ts,lineHeight:1.55}}>
          <span style={{fontWeight:700,color:navy}}>{k}</span> {v}
        </div>
      ))}
    </div>
  );

  const CompetencyBlock = ({num, value, onChange}) => {
    const words = (value.fb||"").trim().split(/\s+/).filter(Boolean).length;
    return (
      <div style={{marginBottom:28}}>
        <div style={{fontSize:14,fontWeight:700,color:navy,marginBottom:14}}>Behavioural Competency — {num}</div>
        <div style={{fontSize:14,color:tm,marginBottom:6}}>Select Competency</div>
        <div style={{position:"relative"}}>
          <select value={value.comp} onChange={e=>onChange({...value,comp:e.target.value})} style={{width:"100%",appearance:"none",WebkitAppearance:"none",padding:"10px 34px 10px 12px",border:`1px solid ${bd}`,borderRadius:ir,fontSize:14,color:value.comp?tx:tf,background:card,outline:"none",fontFamily:f,cursor:"pointer"}}>
            <option value="">Select</option>
            {competencies.map(cc => <option key={cc.id} value={cc.name} style={{color:tx}}>{cc.name}</option>)}
          </select>
          <span style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:tm}}><I.Chev s={12} r={90}/></span>
        </div>
        <div style={{display:"flex",alignItems:"baseline",gap:8,margin:"16px 0 6px"}}>
          <span style={{fontSize:14,color:tm}}>Feedback</span>
          <span style={{flex:1}}/>
          <span className="tnum" style={{fontSize:14,fontWeight:600,color:words>50?red:words>0?green:tf}}>{words} / 50 words</span>
        </div>
        <textarea value={value.fb} onChange={e=>onChange({...value,fb:e.target.value})} placeholder="Write here…" style={{width:"100%",minHeight:72,padding:"10px 12px",border:`1px solid ${bd}`,borderRadius:br,fontSize:14,color:tx,lineHeight:1.6,background:card,outline:"none",resize:"vertical",fontFamily:f}}/>
      </div>
    );
  };

  const NarrativeText = ({label, value, onChange}) => (
    <div>
      <div style={{fontSize:14,color:tm,marginBottom:6}}>{label}</div>
      <input value={value} onChange={e=>onChange(e.target.value)} placeholder="Write" style={{width:"100%",padding:"10px 12px",border:`1px solid ${bd}`,borderRadius:ir,fontSize:14,color:tx,background:card,outline:"none",fontFamily:f}}/>
    </div>
  );

  // ═══════ DRAWERS ═══════
  const DrawerContent = ({kind, onClose, candidate}) => {
    const titles = { profile:"Profile", scoring:"Overall Scoring", reports:"Reports", evals:"Assessor Evaluations", recs:"Recordings" };
    const [hiddenCols, setHiddenCols] = useState({});
    const [filterOpen, setFilterOpen] = useState(false);
    const scoringCols = [
      { k:"ac", title:"Assessment Center", type:"scores", rows:[
        {k:"Transformation Enabler VLC",v:"4.33"},{k:"Innovation Explorer VLC",v:"1"},{k:"Results Driver VLC",v:"3.58"},{k:"Talent Nurturer VLC",v:"3.92"},{k:"Impactful Decision Maker VLC",v:"3.42"},{k:"Strategic Thinker VLC",v:"3.58"},{k:"Customer Advocate VLC",v:"4.17"},{k:"Effective Collaborator VLC",v:"3.5"},{k:"AC Competency Score",v:"3.72",tot:true} ] },
      { k:"hogan", title:"Hogan", type:"scores", rows:[
        {k:"Strategic Thinker Online",v:"2"},{k:"Impactful Decision Maker Online",v:"3"},{k:"Innovation Explorer Online",v:"2"},{k:"Transformation Enabler Online",v:"1"},{k:"Customer Advocate Online",v:"1"},{k:"Results Driver Online",v:"2"},{k:"Talent Nurturer Online",v:"2"},{k:"Effective Collaborator Online",v:"2"},{k:"Hogan Score",v:"1.88",tot:true} ] },
      { k:"comp", title:"Competency", type:"scores", rows:[
        {k:"Strategic Thinker",v:"3.11"},{k:"Impactful Decision Maker",v:"3.29"},{k:"Effective Collaborator",v:"3.05"},{k:"Talent Nurturer",v:"3.34"},{k:"Results Driver",v:"3.11"},{k:"Customer Advocate",v:"3.22"},{k:"Transformation Enabler",v:"3.33"},{k:"Innovation Explorer",v:"2.88"} ] },
      { k:"cog", title:"Cognitive", type:"scores", rows:[
        {k:"HBRI Percentile",v:"44"},{k:"HBRI Score 5-Point",v:"3"} ] },
      { k:"behav", title:"Important for Target Role Behavioural Fit", type:"feedback",
        items:[
          {label:"Important Competency Name 1",name:"Strategic Thinker",score:"3",def:"Analyses the external environment and sets a clear, forward-looking direction that positions the organisation for long-term success.",feedback:"Ibrahim consistently demonstrated a strong ability to evaluate situations, recognise emerging trends, and develop long-term strategies that aligned ",link:"wit…",full:"Ibrahim consistently demonstrated a strong ability to evaluate situations, recognise emerging trends, and develop long-term strategies that aligned with organisational goals and anticipated future market shifts. He connected day-to-day decisions to the broader direction of the business and reframed short-term pressures as long-term opportunities."},
          {label:"Important Competency Name 2",name:"Results Driver",score:"3",def:"Sets ambitious goals and mobilises people and resources to deliver measurable, high-impact results.",feedback:"Important Competency Feedback 2 Ibrahim consistently met strategic objectives by defining clear goals, optimising resource ",link:"allocatio…",full:"Important Competency Feedback 2. Ibrahim consistently met strategic objectives by defining clear goals, optimising resource allocation, and holding the team accountable for measurable outcomes. He balanced competing priorities without losing sight of the results that mattered most."},
          {label:"Mission Critical Competency Name 3",name:"Customer Advocate",score:"3",def:"Champions the customer perspective and ensures their needs shape decisions and priorities.",feedback:"Ibrahim demonstrated capability by understanding customer needs, addressing concerns, and ensuring their interests were considered in ",link:"decisi…",full:"Ibrahim demonstrated capability by understanding customer needs, addressing concerns, and ensuring their interests were considered in decision-making across the business. He actively sought customer feedback and used it to shape service improvements."},
          {label:"Important Competency Name 4",name:"Innovation Explorer",score:"3",def:"Seeks new ideas, experiments with fresh approaches, and challenges the status quo to create value.",feedback:"Ibrahim demonstrated capability by generating new ideas, embracing creative solutions, and challenging existing processes to improve ",link:"outcom…",full:"Ibrahim demonstrated capability by generating new ideas, embracing creative solutions, and challenging existing processes to improve outcomes and drive continuous improvement. He encouraged the team to test and learn rather than default to established ways of working."},
        ], footer:{label:"Important for Target Role Behavioural Fit",score:"62"} },
      { k:"tech", title:"Important for Target Role Technical Fit", type:"feedback",
        items:[
          {label:"Technical Important Competency Name 1",name:"Information Technology Management",score:"4",def:"Ability to lead and align cross-functional support services strategies with the organisation's mission, vision, and long-term objectives, enabling transformation and institutional resilience.",desc:"Ability to lead and align cross-functional support services strategies with the organisation's mission, vision, and long-term objectives, enabling transformation and institutional resilience.",feedback:"Ibrahim shows strong competence in this area, streamlining systems, enhancing cybersecurity, and ensuring operational continuity. He demonstr…",full:"Ibrahim shows strong competence in this area, streamlining systems, enhancing cybersecurity, and ensuring operational continuity. He demonstrated a clear understanding of how technology investment supports the wider transformation agenda and institutional resilience."},
          {label:"Technical Important Competency Name 2",name:"Procurement Management",score:"4",def:"Ability to oversee and optimise procurement and general services operations, ensuring efficient service delivery, compliance, and value creation through vendor and resource management.",desc:"Ability to oversee and optimise procurement and general services operations, ensuring efficient service delivery, compliance, and value creation through vendor and resource management.",feedback:"Ibrahim shows high competence in procurement, addressing communication gaps, optimising resources, and fostering collaborative supplier rel…",full:"Ibrahim shows high competence in procurement, addressing communication gaps, optimising resources, and fostering collaborative supplier relationships. He balanced cost efficiency with compliance and long-term value creation."},
        ], footer:{label:"Important for Target Role Technical Fit",score:"67"} },
    ];
    return (
      <>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"18px 20px 14px",borderBottom:`1px solid ${bd}`,flexShrink:0}}>
          <p className="eyebrow" style={{flex:1,fontSize:14,letterSpacing:"normal",textTransform:"none",fontWeight:700,color:navy}}>{titles[kind]}</p>
          {kind === "scoring" && (
            <div style={{position:"relative"}}>
              <button onClick={()=>setFilterOpen(o=>!o)} className="btn btn-secondary" style={{color:filterOpen?navy:tx}}><I.Filter s={13}/> Filters</button>
              {filterOpen && (
                <>
                  <div onClick={()=>setFilterOpen(false)} style={{position:"fixed",inset:0,zIndex:70}}/>
                  <div style={{position:"absolute",right:0,top:"calc(100% + 6px)",zIndex:71,width:280,background:card,border:`1px solid ${bd}`,borderRadius:br,boxShadow:"0 12px 34px rgba(0,15,71,.18)",overflow:"hidden"}}>
                    <div style={{fontSize:14,fontWeight:700,color:tm,padding:"10px 14px 6px",letterSpacing:0}}>Filters</div>
                    {scoringCols.map(col => {
                      const on = !hiddenCols[col.k];
                      return (
                        <label key={col.k} onClick={()=>setHiddenCols(p=>({...p,[col.k]:on}))} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 14px",fontSize:14,color:tx,cursor:"pointer"}}>
                          <span style={{width:15,height:15,borderRadius:4,border:`1.5px solid ${on?teal:bdStrong}`,background:on?teal:"transparent",display:"inline-flex",alignItems:"center",justifyContent:"center",color:"#fff",flexShrink:0}}>{on ? <I.Check s={11}/> : null}</span>
                          <span style={{flex:1}}>{col.title}</span>
                        </label>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}
          <button onClick={onClose} className="btn btn-ghost" style={{padding:4}}><I.X s={14}/></button>
        </div>
        <div style={{flex:1,overflowY:"auto"}}>
          {kind === "profile" && <ProfileDrawer candidate={candidate}/>}
          {kind === "scoring" && <ScoringDrawer cols={scoringCols.filter(c=>!hiddenCols[c.k])}/>}
          {kind === "reports" && <ReportsDrawer/>}
          {kind === "evals" && <EvalsDrawer candidate={candidate}/>}
          {kind === "recs" && <RecsDrawer/>}
        </div>
      </>
    );
  };

  const ProfileDrawer = ({candidate}) => {
    const p = candidate.profile;
    return (
      <div style={{padding:"22px 26px"}}>
        {/* Header card */}
        <div style={{display:"flex",alignItems:"center",gap:18,flexWrap:"wrap",background:bg,border:`1px solid ${bd}`,borderRadius:br,padding:"18px 20px",marginBottom:18}}>
          <div style={{width:60,height:60,borderRadius:ir,background:teal,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><I.User s={26}/></div>
          <div style={{minWidth:180}}>
            <div style={{fontSize:16,fontWeight:700,color:navy,letterSpacing:-.2}}>{candidate.name}</div>
            <div style={{fontSize:14,color:tm,margin:"2px 0 8px"}}>{candidate.email}</div>
            <span className="tag" style={{background:card,border:`1px solid ${bd}`,color:tx}}>{p.lang}</span>
          </div>
          <div style={{flex:1}}/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3, minmax(0,1fr))",gap:0,background:card,border:`1px solid ${bd}`,borderRadius:br,flex:"1 1 240px",minWidth:0}}>
            {[["Grade",p.grade],["Entity",p.entity],["Compliance",p.compliance]].map(([k,v],i) => (
              <div key={k} style={{padding:"14px 12px",textAlign:"center",minWidth:0,borderRight:i<2?`1px solid ${bd}`:"none"}}>
                <div style={{fontSize:14,color:tm,fontWeight:600,marginBottom:6}}>{k}</div>
                <div className="tnum" style={{fontSize:16,fontWeight:800,color:navy,lineHeight:1}}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Role row */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(150px, 1fr))",gap:24,border:`1px solid ${bd}`,borderRadius:br,padding:"18px 22px",marginBottom:22}}>
          {[["Target role",p.targetRole],["Current role",p.currentRole],["Target level",p.targetLevel]].map(([k,v]) => (
            <div key={k}>
              <div style={{fontSize:14,color:tm,marginBottom:5}}>{k}</div>
              <div style={{fontSize:15,fontWeight:700,color:navy}}>{v}</div>
            </div>
          ))}
        </div>

        {/* Raven columns */}
        <div style={{display:"grid",gridTemplateColumns:"1fr",gap:28}}>
          {["Raven 1","Raven 2"].map(band => (
            <div key={band}>
              <h3 style={{fontSize:16,fontWeight:700,color:navy,marginBottom:12}}>{band}</h3>
              <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:14}}>
                {(ravenText[band]||[]).map((line,i) => (
                  <li key={i} style={{display:"flex",gap:12}}>
                    <div style={{width:5,height:5,borderRadius:3,background:teal,marginTop:8,flexShrink:0}}/>
                    <span style={{fontSize:14,color:ts,lineHeight:1.55}}>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ScoringDrawer = ({cols}) => {
    const [collapsed, setCollapsed] = useState({});
    const [expanded, setExpanded] = useState({});
    const [tipKey, setTipKey] = useState(null);
    const toggle = k => setCollapsed(p=>({...p,[k]:!p[k]}));
    const InfoDot = ({id, title, desc}) => (
      <span style={{position:"relative",display:"inline-flex"}} onMouseEnter={()=>setTipKey(id)} onMouseLeave={()=>setTipKey(t=>t===id?null:t)}>
        <span style={{display:"inline-flex",width:14,height:14,borderRadius:"50%",border:`1.3px solid ${tm}`,color:tm,alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,fontStyle:"normal",flexShrink:0,cursor:"help"}}>i</span>
        {tipKey===id && desc && (
          <span style={{position:"absolute",bottom:"calc(100% + 9px)",left:-10,zIndex:90,width:250,background:card,border:`1px solid ${bd}`,borderRadius:br,boxShadow:"0 12px 34px rgba(0,15,71,.20)",padding:"14px 16px",textAlign:"left"}}>
            <span style={{display:"block",fontSize:14,fontWeight:700,color:navy,marginBottom:6}}>{title}</span>
            <span style={{display:"block",fontSize:14,color:ts,lineHeight:1.55}}>{desc}</span>
            <span style={{position:"absolute",top:"100%",left:14,width:12,height:12,background:card,borderRight:`1px solid ${bd}`,borderBottom:`1px solid ${bd}`,transform:"translateY(-50%) rotate(45deg)"}}/>
          </span>
        )}
      </span>
    );
    return (
      <div style={{padding:"18px 20px"}}>
        {cols.length===0 && <div style={{fontSize:14,color:tm,textAlign:"center",padding:"40px 0"}}>No sections selected. Use Filters to show scores.</div>}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))",gap:16}}>
          {cols.map(col => {
            const open = !collapsed[col.k];
            return (
              <div key={col.k} style={{border:`1px solid ${bd}`,borderRadius:br,background:card,alignSelf:"start"}}>
                <button onClick={()=>toggle(col.k)} style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"12px 16px",background:bg,borderBottom:open?`1px solid ${bd}`:"none",borderRadius:open?`${br}px ${br}px 0 0`:br,cursor:"pointer"}}>
                  <I.Chev s={12} r={open?90:0} style={{color:tm,flexShrink:0}}/>
                  <span style={{fontSize:14,fontWeight:700,color:navy,textAlign:"left"}}>{col.title}</span>
                </button>
                {open && col.type==="scores" && (
                  <div>
                    {col.rows.map((r,i) => (
                      <div key={r.k} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 16px",borderTop:i===0?"none":`1px solid ${bd}`}}>
                        <span style={{flex:1,fontSize:14,color:tx,fontWeight:r.tot?700:400}}>{r.k}</span>
                        <span className="tnum" style={{fontSize:14,fontWeight:700,color:navy}}>{r.v}</span>
                      </div>
                    ))}
                  </div>
                )}
                {open && col.type==="feedback" && (
                  <div>
                    {col.items.map((it,i) => {
                      const ek = col.k+"-"+i;
                      const isOpen = expanded[ek];
                      return (
                        <div key={i} style={{padding:"14px 16px",borderTop:i===0?"none":`1px solid ${bd}`}}>
                          <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:6}}>
                            <span style={{flex:1,fontSize:14,color:tm}}>{it.label}</span>
                            <span className="tnum" style={{fontSize:14,fontWeight:700,color:navy}}>{it.score}</span>
                          </div>
                          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:it.desc?8:10}}>
                            <InfoDot id={ek} title={it.name} desc={it.def}/>
                            <span style={{fontSize:14,fontWeight:700,color:navy}}>{it.name}</span>
                          </div>
                          {it.desc && <p style={{fontSize:14,color:ts,lineHeight:1.55,margin:"0 0 10px"}}>{it.desc}</p>}
                          <div style={{fontSize:14,color:tm,marginBottom:4}}>Feedback</div>
                          <p style={{fontSize:14,fontWeight:700,color:tx,lineHeight:1.55,margin:0}}>
                            {isOpen ? it.full : it.feedback}
                            {" "}
                            <span onClick={()=>setExpanded(p=>({...p,[ek]:!isOpen}))} style={{color:teal,fontWeight:700,textDecoration:"underline",cursor:"pointer"}}>{isOpen?"Show less":(it.link||"Read more")}</span>
                          </p>
                        </div>
                      );
                    })}
                    {col.footer && (
                      <div style={{display:"flex",alignItems:"center",gap:8,padding:"12px 16px",borderTop:`1px solid ${bd}`,background:bg,borderRadius:`0 0 ${br}px ${br}px`}}>
                        <InfoDot id={col.k+"-foot"} title={col.footer.label} desc={"Aggregate fit score across all competencies in this section."}/>
                        <span style={{flex:1,fontSize:14,color:tx}}>{col.footer.label}</span>
                        <span className="tnum" style={{fontSize:14,fontWeight:700,color:navy}}>{col.footer.score}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const RPT_THUMB = [navy, teal, "#8F20DE", "#CB7E03", "#0B4BFF", "#2E7D5B"];
  const ReportsDrawer = () => {
    const [tab, setTab] = useState("main");
    const shown = tab==="main" ? (mainReport?[mainReport]:[]) : otherReports;
    return (
      <div style={{padding:"0 20px 16px"}}>
        <div style={{display:"flex",gap:22,marginBottom:6,borderBottom:`1px solid ${bd}`}}>
          {[{k:"main",l:"Main Report"},{k:"other",l:"Other Reports"}].map(t => (
            <button key={t.k} onClick={()=>setTab(t.k)} style={{padding:"14px 0",fontSize:14,fontWeight:tab===t.k?700:500,color:tab===t.k?navy:tm,borderBottom:`2px solid ${tab===t.k?navy:"transparent"}`,marginBottom:-1}}>{t.l}</button>
          ))}
        </div>
        <div style={{fontSize:14,color:tm,margin:"12px 0 8px"}}>{shown.length} Report{shown.length!==1?"s":""}</div>
        {shown.map((r,i) => {
          const avail = r.status === "Available";
          return (
          <div key={r.id} style={{display:"flex",alignItems:"flex-start",gap:16,padding:"18px 0",borderBottom:`1px solid ${bd}`}}>
            <div style={{width:56,height:72,background:RPT_THUMB[i%RPT_THUMB.length],borderRadius:br,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",flexShrink:0}}>
              <LighthouseLogo s={24} c="#fff"/>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:15,fontWeight:600,color:tx}}>{r.name}</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"flex-start",marginTop:12}}>
                <button onClick={()=>setOpenReport(r)} className="btn btn-secondary"><I.Eye s={14}/> View</button>
                <button onClick={()=>showToast(`Downloading ${r.name}`)} className="btn btn-secondary"><I.Download s={14}/> Download</button>
              </div>
            </div>
          </div>
        );})}
      </div>
    );
  };

  const EvalsDrawer = ({candidate}) => {
    const [selected, setSelected] = useState(0);
    const form = assessorForms[selected];
    const [assessor, setAssessor] = useState("Elena Accardi");
    const excerpts = {
      "CBI":`Participant was asked to describe a time they had to make a strategic call under ambiguity. They anchored on the Q2 EMEA launch where internal forecasts diverged materially. Walked through: (1) re-framed the decision as a 6-month option rather than a one-way door, (2) built a small pilot with three launch countries, (3) pre-committed to reversibility criteria. Impact: pilot outperformed forecast by 12%; decision to scale was ratified by ExCo.\n\nFollow-up: "What would you do differently?" — acknowledged they under-invested in stakeholder prep, leading to avoidable friction with the commercial VP.`,
      "CASE":`Candidate presented a three-phase plan: protect Q3 revenue, accelerate tech rollout to key markets first, re-baseline Q4. Strong on commercial logic; weaker on organisational implications. When pushed on headcount trade-offs, they deferred rather than committing. Artefacts were clear and well-sequenced.`,
      "RP":`In the Direct Report simulation, the candidate listened well for the first 8 minutes. However, they moved to solutioning before fully understanding the career concern. Recovered in the back half by inviting the report to own the next step. In the Peer meeting, they demonstrated good reframing and a clear willingness to offer resource in exchange for timeline flexibility.`,
      "TIG":`Technical depth is solid on P&L mechanics and capital allocation. Showed structured market-entry framework (TAM → win-rights → CAC unit economics). Less comfortable on regulatory nuances across EMEA — relied on heuristics rather than specifics.`,
      "TRW":`Report submitted 4 minutes early. Strong executive summary. Quantitative assumptions well-flagged. Recommendations lack a clear "what to stop" — a recurring theme with this candidate. Formatting is professional and scannable.`,
    };
    return (
      <div>
        <div style={{padding:"0 20px"}}>
          <TabScroller fade={card}>
            {assessorForms.map((af,i) => {
              const active = selected===i;
              return (
                <button key={af.short} onClick={()=>setSelected(i)} style={{padding:"12px 0",fontSize:14,fontWeight:active?700:500,color:active?navy:tm,borderBottom:`2px solid ${active?navy:"transparent"}`,marginBottom:-1,whiteSpace:"nowrap",background:"none"}}>{af.name}</button>
              );
            })}
          </TabScroller>
        </div>
        <div style={{padding:"16px 20px"}}>
          <p className="eyebrow" style={{marginBottom:6}}>{form.exercise}</p>
          <h3 style={{fontSize:14,fontWeight:700,color:navy,marginBottom:10}}>{form.name}</h3>
          <div style={{marginBottom:14}}>
            <label style={{fontSize:14,color:tm,fontWeight:600,letterSpacing:0,textTransform:"none",display:"block",marginBottom:6}}>Assessor</label>
            <select value={assessor} onChange={e=>setAssessor(e.target.value)} style={{width:"100%",padding:"8px 34px 8px 12px",border:`1px solid ${bd}`,borderRadius:br,fontSize:14,color:tx,background:`${card} url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>") no-repeat right 12px center`,appearance:"none",WebkitAppearance:"none",MozAppearance:"none",fontFamily:f,cursor:"pointer",outline:"none"}}>
              <option>Elena Accardi</option>
              <option>Marco Rossi</option>
              <option>Hiroshi Tanaka</option>
              <option>Ana Fernández</option>
            </select>
          </div>
          <p className="eyebrow" style={{marginBottom:8}}>Observation Notes</p>
          <div style={{padding:"14px 16px",background:sbBg,border:`1px solid ${bd}`,borderRadius:br,fontSize:14,color:ts,lineHeight:1.7,whiteSpace:"pre-line"}}>
            {excerpts[form.short]}
          </div>
          <p className="eyebrow" style={{marginTop:18,marginBottom:8}}>Competencies Touched</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {competencies.slice(0, selected===0?4:selected===1?3:2).map(cc => (
              <span key={cc.id} className="tag" style={{background:`${teal}12`,color:teal}}>{cc.id} · {cc.name}</span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const RecsDrawer = () => (
    <div style={{padding:"16px 20px"}}>
      {recordings.map(r => (
        <div key={r.id} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"14px 0",borderBottom:`1px solid ${bd}`}}>
          <div style={{width:88,height:58,borderRadius:br,background:`linear-gradient(135deg, #0c1220, #1a2a40)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,position:"relative"}}>
            <span style={{width:34,height:34,borderRadius:"50%",background:"rgba(255,255,255,.18)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}><I.Play s={16} style={{color:"#fff",marginLeft:2}}/></span>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:14,fontWeight:600,color:tx,marginBottom:2}}>{r.label}</div>
            <div style={{fontSize:14,color:tm}}>{r.date}</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"flex-start",marginTop:10}}>
              <button onClick={()=>showToast(`Playing ${r.label}`)} className="btn btn-secondary"><I.Eye s={14}/> View</button>
              <button onClick={()=>showToast(`Downloading ${r.label}`)} className="btn btn-secondary"><I.Download s={14}/> Download</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // ═══════ ASSESSMENT CENTER + AVAILABILITY DATA ═══════
  const clients = [
    { id:"qa-final", name:"QA FINAL 2024 GAME ON", slug:"qa-final-2024-game-on" },
    { id:"future-pipe", name:"Future Pipe", slug:"future-pipe" },
    { id:"generali", name:"Generali Group", slug:"generali-group" },
  ];
  const acCampaigns = {
    current: [
      { id:"1190000051", dt:"Sep 30, 2026 4:30 PM (GMT+04:00)", slot:"Slot A1", dur:"8h", name:"assessment center testing" },
      { id:"1190000048", dt:"Sep 30, 2026 5:00 PM (GMT+04:00)", slot:"Slot A2", dur:"5h", name:"assessment center testing" },
    ],
    upcoming: [
      { id:"1190000060", dt:"Oct 14, 2026 10:00 AM (GMT+04:00)", slot:"Slot B1", dur:"6h", name:"assessment center testing" },
      { id:"1190000064", dt:"Oct 28, 2026 2:00 PM (GMT+04:00)", slot:"Slot B2", dur:"4h", name:"assessment center testing" },
    ],
    past: [
      { id:"1190000042", dt:"Sep 19, 2025 4:30 PM (GMT+05:30)", slot:"Slot P1", dur:"8h", name:"assessment center testing" },
      { id:"1190000037", dt:"Sep 19, 2025 5:03 PM (GMT+05:30)", slot:"Slot P2", dur:"5h", name:"assessment center testing" },
      { id:"1190000003", dt:"Sep 22, 2025 8:09 PM (GMT+05:30)", slot:"Slot P3", dur:"8h", name:"assessment center testing" },
    ],
  };
  const acParticipants = [
    { id:"p1", name:"TI user", email:"ti@user.com", color:teal, campaign:"assessment center testing", slot:"Slot P2", att:true, attStatus:"On Time", schStatus:"Scheduled", dur:"8h",
      acts:[
        { prework:"0/6", activity:"Mango tool for assessor - part test 2", assessor:"only cl admin", dt:"Sep 19, 2025 5:00 PM (GMT+05:30)", schTime:"16:32", status:"Not Started" },
        { prework:"0/6", activity:"assessor form for all in one 1136", assessor:"only cl admin", dt:"Sep 19, 2025 5:00 PM (GMT+05:30)", schTime:"17:48", status:"On Time" },
      ] },
    { id:"p2", name:"RG user", email:"rg@user.com", color:red, campaign:"assessment center testing", slot:"Slot P2", att:false, attStatus:"No Status", schStatus:"Scheduled", dur:"8h",
      acts:[
        { prework:"0/6", activity:"assessor form for all in one 1136", assessor:"only cl admin", dt:"Sep 19, 2025 5:00 PM (GMT+05:30)", schTime:"15:33", status:"Not Started" },
      ] },
    { id:"p3", name:"KP user", email:"kp@user.com", color:orange, campaign:"assessment center testing", slot:"Slot P2", att:false, attStatus:"No Status", schStatus:"Scheduled", dur:"8h",
      acts:[
        { prework:"2/6", activity:"Mango tool for assessor - part test 2", assessor:"only cl admin", dt:"Sep 19, 2025 5:00 PM (GMT+05:30)", schTime:"16:43", status:"Not Started" },
      ] },
    { id:"p4", name:"LM user", email:"lm@user.com", color:purple, campaign:"assessment center testing", slot:"Slot P2", att:false, attStatus:"No Status", schStatus:"Scheduled", dur:"8h",
      acts:[
        { prework:"1/6", activity:"assessor form for all in one 1136", assessor:"only cl admin", dt:"Sep 19, 2025 5:00 PM (GMT+05:30)", schTime:"17:35", status:"Not Started" },
      ] },
    { id:"p5", name:"SA user", email:"sa@user.com", color:green, campaign:"assessment center testing", slot:"Slot P2", att:false, attStatus:"No Status", schStatus:"Scheduled", dur:"8h",
      acts:[
        { prework:"3/6", activity:"Mango tool for assessor - part test 2", assessor:"only cl admin", dt:"Sep 19, 2025 5:00 PM (GMT+05:30)", schTime:"16:32", status:"Not Started" },
      ] },
    { id:"p6", name:"DV user", email:"dv@user.com", color:teal, campaign:"assessment center testing", slot:"Slot P3", att:false, attStatus:"No Status", schStatus:"Scheduled", dur:"8h",
      acts:[
        { prework:"0/6", activity:"assessor form for all in one 1136", assessor:"only cl admin", dt:"Sep 23, 2025 3:00 PM (GMT+05:30)", schTime:"15:09", status:"Not Started" },
      ] },
  ];
  const acSubjects = [
    { id:"1150000004", name:"TI user", email:"ti@user.com", color:teal, prework:"6/6", activity:"1/3", att:true, attStatus:"On Time", schStatus:"Scheduled" },
    { id:"1150000002", name:"RG user", email:"rg@user.com", color:red, prework:"6/6", activity:"1/3", att:false, attStatus:"No Status", schStatus:"Scheduled" },
  ];
  const acActivities = [
    { id:"23778", subj:"TI user", email:"ti@user.com", color:teal, assessor:"only cl admin", activity:"Mango tool for assessor - part test 2", time:"16:32", status:"Not Started" },
    { id:"23766", subj:"RG user", email:"rg@user.com", color:red, assessor:"only cl admin", activity:"assessor form for all in one 1136", time:"15:33", status:"Not Started" },
    { id:"23764", subj:"RG user", email:"rg@user.com", color:red, assessor:"only cl admin", activity:"Mango tool for assessor - part test 2", time:"16:43", status:"Not Started" },
    { id:"23761", subj:"RG user", email:"rg@user.com", color:red, assessor:"only cl admin", activity:"assessor form for all in one 1136", time:"17:35", status:"Not Started" },
  ];
  const acResources = [
    { id:"r1", type:"drive", name:"Assessment Center Briefing Pack", url:"https://drive.google.com/drive/folders/1aBc…", host:"drive.google.com" },
    { id:"r2", type:"meeting", name:"Assessor Calibration Call", url:"https://meet.google.com/xyz-abcd-efg", host:"meet.google.com" },
    { id:"r3", type:"pdf", name:"Competency Framework Guide (PDF)", url:"https://docs.generali.com/framework.pdf", host:"docs.generali.com" },
    { id:"r4", type:"doc", name:"Assessor Scoring Rubric", url:"https://docs.google.com/spreadsheets/d/1Xy…", host:"docs.google.com" },
  ];
  const RES_TYPES = {
    drive:   { label:"Google Drive", color:teal,  icon:(s)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3h8l4 7-8 11L4 10z"/><path d="M4 10h16M9.5 3 5.5 10M14.5 3l4 7"/></svg> },
    meeting: { label:"Meeting link", color:red,   icon:(s)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="14" height="12" rx="2"/><path d="m22 8-6 4 6 4V8z"/></svg> },
    pdf:     { label:"PDF link",     color:navy,   icon:(s)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg> },
    doc:     { label:"Document link",color:teal,   icon:(s)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/></svg> },
  };
  const acRecordings = [
    { id:"rec1", label:"Group Exercise — TI user", date:"19th Sep 2025, 16:32", assessor:"only cl admin", participant:"TI user", transcript:true },
    { id:"rec2", label:"Role Play — RG user", date:"19th Sep 2025, 15:33", assessor:"Marco Rossi", participant:"RG user", transcript:false },
  ];

  // ═══════ SHARED AC HELPERS ═══════
  const Av = ({name, color, s=30}) => (
    <div style={{width:s,height:s,borderRadius:s/2,background:color||teal,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:Math.round(s*0.36),fontWeight:700,flexShrink:0,fontFamily:f}}>{(name||"").split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase()}</div>
  );
  const acPill = (text) => <StatusPill s={text}/>;
  const AttToggle = ({on:init}) => {
    const [on,setOn]=useState(init);
    return <button onClick={()=>setOn(!on)} aria-pressed={on} style={{width:38,height:22,borderRadius:11,background:on?teal:"rgba(0,15,71,.18)",position:"relative",transition:"background .18s",flexShrink:0}}><span style={{width:16,height:16,borderRadius:8,background:"#fff",position:"absolute",top:3,left:on?19:3,transition:"left .18s",boxShadow:"0 1px 2px rgba(0,0,0,.25)"}}/></button>;
  };
  const JoinRoom = () => <button onClick={()=>showToast("Opening meeting room…")} style={{display:"inline-flex",alignItems:"center",gap:5,color:teal,fontSize:14,fontWeight:600}}><I.Video s={14}/> Join Room</button>;
  const acTh = (label,align) => <th style={{padding:"13px 16px",textAlign:align||"left",fontSize:14,fontWeight:700,color:tm,borderBottom:`1px solid ${bd}`,background:"#fff",whiteSpace:"nowrap"}}>{label}</th>;
  const acTd = {padding:"14px 16px",fontSize:14,color:tx,borderBottom:`1px solid ${bd}`,verticalAlign:"middle"};
  const Pager = () => (
    <div style={{display:"flex",justifyContent:"center",padding:"18px 0 0"}}>
      <div style={{width:30,height:30,borderRadius:6,border:`1px solid ${teal}`,color:teal,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700}}>1</div>
    </div>
  );

  // ═══════ CLIENT SWITCHER (topbar + AC left nav) ═══════
  const ClientSwitcher = () => {
    const [open,setOpen]=useState(false);
    const [q,setQ]=useState("");
    const others = clients.filter(c=>c.name!==client && c.name.toLowerCase().includes(q.toLowerCase()));
    const Building = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M9 8h.01M9 12h.01M9 16h.01M15 8h.01M15 12h.01M15 16h.01"/></svg>;
    return (
      <div style={{position:"relative"}}>
        <button onClick={()=>setOpen(!open)} style={{display:"inline-flex",alignItems:"center",gap:9,height:38,background:card,border:`1px solid ${bdStrong}`,borderRadius:8,padding:"0 12px",fontFamily:f,fontSize:14,fontWeight:700,color:navy,cursor:"pointer",maxWidth:230}}>
          <span className="elide" style={{maxWidth:170}}>{client}</span>
          <span style={{color:teal,display:"flex",flexShrink:0}}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m17 2 4 4-4 4"/><path d="M21 6H8"/><path d="m7 22-4-4 4-4"/><path d="M3 18h13"/></svg></span>
        </button>
        {open && (<>
          <div onClick={()=>setOpen(false)} style={{position:"fixed",inset:0,zIndex:40}}/>
          <div style={{position:"absolute",top:"calc(100% + 6px)",left:0,width:380,maxWidth:"90vw",background:card,border:`1px solid ${bd}`,borderRadius:12,boxShadow:"0 12px 40px rgba(0,15,71,.18)",zIndex:50,padding:20}}>
            <div style={{fontFamily:serif,fontSize:20,color:navy,marginBottom:16}}>Switch Client</div>
            <div style={{position:"relative",marginBottom:18}}>
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search Client" style={{width:"100%",height:44,border:`1px solid ${bd}`,borderRadius:8,padding:"0 52px 0 14px",fontFamily:f,fontSize:14,color:tx,outline:"none"}}/>
              <span style={{position:"absolute",right:0,top:0,height:44,width:44,display:"flex",alignItems:"center",justifyContent:"center",borderLeft:`1px solid ${bd}`,color:tm}}><I.Search s={16}/></span>
            </div>
            <div className="eyebrow" style={{marginBottom:8}}>Others</div>
            <div style={{display:"flex",flexDirection:"column",gap:2,maxHeight:230,overflow:"auto"}}>
              {others.length===0 && <div style={{fontSize:14,color:tm,padding:"10px 0"}}>No other clients</div>}
              {others.map(c=>(
                <button key={c.id} onClick={()=>{setClient(c.name);setOpen(false);setAcCampaignId(null);if(route==="acCampaign")setRoute("ac");showToast(`Switched to ${c.name}`);}} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 8px",borderRadius:8,textAlign:"left",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background=bg2} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <span style={{width:36,height:36,borderRadius:8,background:navyBg,color:navy,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Building/></span>
                  <span style={{minWidth:0}}>
                    <div style={{fontSize:14,fontWeight:700,color:navy}} className="elide">{c.name}</div>
                    <div style={{fontSize:14,color:tm}} className="elide">{c.slug}</div>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>)}
      </div>
    );
  };

  // ═══════ SCREEN: ASSESSMENT CENTER ═══════
  const AssessmentCenter = () => {
    const [q,setQ]=useState("");
    const [expanded,setExpanded]=useState(null);
    const camps = (acCampaigns[acSub]||[]).filter(c=>!q || c.id.includes(q) || c.name.toLowerCase().includes(q.toLowerCase()) || c.slot.toLowerCase().includes(q.toLowerCase()));
    const parts = acParticipants.filter(p=>!q || p.name.toLowerCase().includes(q.toLowerCase()) || p.email.toLowerCase().includes(q.toLowerCase()) || p.campaign.toLowerCase().includes(q.toLowerCase()));
    const openCampaign = (id) => { setAcCampaignId(id); setAcDetailTab("subjects"); setRoute("acCampaign"); };
    return (
      <div className="an1" data-screen-label="Assessment Center" style={{padding:"28px 40px 80px",maxWidth:1400,margin:"0 auto"}}>
        <h1 className="h1" data-tour="ac-title" style={{marginBottom:20}}>Assessment Center</h1>
        <div data-tour="ac-tabs" style={{display:"flex",alignItems:"center",gap:0,borderBottom:`1px solid ${bd}`,marginBottom:22}}>
          {[["campaigns","Campaigns",acCampaigns[acSub]?.length||0],["participants","Participants",acParticipants.length]].map(([k,l,n])=>{
            const active=acTab===k;
            return (
              <button key={k} onClick={()=>setAcTab(k)} style={{padding:"12px 4px",marginRight:28,fontSize:14,fontWeight:active?700:500,color:active?navy:tm,borderBottom:`2px solid ${active?navy:"transparent"}`,marginBottom:-1,display:"inline-flex",alignItems:"center",gap:8,transition:"color .15s"}}>
                {l}
              </button>
            );
          })}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16,flexWrap:"wrap"}}>
          <div data-tour="ac-timeframe" style={{display:"flex",gap:4,padding:3,background:bg2,borderRadius:br}}>
            {["current","upcoming","past"].map(s=>(
              <button key={s} onClick={()=>setAcSub(s)} style={{padding:"6px 14px",fontFamily:f,fontSize:14,fontWeight:acSub===s?700:500,textTransform:"capitalize",color:acSub===s?navy:tm,background:acSub===s?card:"transparent",border:acSub===s?`1px solid ${bd}`:"1px solid transparent",borderRadius:6}}>{s}</button>
            ))}
          </div>
          <div style={{flex:1}}/>
          <div data-tour="ac-search" style={{display:"flex",alignItems:"center",gap:6,padding:"6px 10px",background:card,border:`1px solid ${bd}`,borderRadius:br,width:260}}>
            <I.Search s={14} style={{color:tm}}/>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search" style={{border:"none",outline:"none",flex:1,fontSize:14,background:"transparent",color:tx}}/>
          </div>
        </div>
        <div data-tour="ac-table-wrap">
        <div style={{fontSize:14,color:tm,marginBottom:12}}>Total : <b style={{color:navy}}>{acTab==="campaigns"?camps.length:parts.length}</b></div>

        {acTab==="campaigns" ? (
          <div style={{background:card,border:`1px solid ${bd}`,borderRadius:br,overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr>{acTh("ID")}{acTh("Date & Time")}{acTh("Slot Name")}{acTh("Campaign Name")}{acTh("Duration")}{acTh("")}</tr></thead>
              <tbody>
                {camps.map(c=>(
                  <tr key={c.id} className="rh" style={{cursor:"pointer"}} onClick={()=>openCampaign(c.id)}>
                    <td style={acTd}><span className="link" style={{fontWeight:600,fontVariantNumeric:"tabular-nums"}}>{c.id}</span></td>
                    <td style={acTd}>{c.dt.split(" (")[0]} <span style={{color:tm}}>(GMT{c.dt.split("(GMT")[1]}</span></td>
                    <td style={acTd}>{c.slot}</td>
                    <td style={acTd}>{c.name}</td>
                    <td style={acTd}>{c.dur}</td>
                    <td style={{...acTd,position:"relative",paddingRight:0}}><span className="row-arrow"><I.Chev s={14}/></span></td>
                  </tr>
                ))}
                {camps.length===0 && <tr><td colSpan={6} style={{padding:0}}><NoResults query={q} label="campaigns" onClear={()=>setQ("")}/></td></tr>}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{background:card,border:`1px solid ${bd}`,borderRadius:br,overflow:"hidden",overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",tableLayout:"fixed",minWidth:820}}>
              <colgroup><col style={{width:44}}/><col style={{width:"24%"}}/><col style={{width:120}}/><col style={{width:150}}/><col style={{width:90}}/><col style={{width:120}}/><col style={{width:120}}/><col style={{width:70}}/></colgroup>
              <thead><tr>{acTh("")}{acTh("Participants")}{acTh("Slot Name")}{acTh("Campaign Name")}{acTh("Attendance")}{acTh("Attendance status")}{acTh("Scheduling status")}{acTh("Duration")}</tr></thead>
              <tbody>
                {parts.map(p=>{
                  const isOpen = expanded===p.id;
                  return (<React.Fragment key={p.id}>
                    <tr className="rh" style={{cursor:"pointer"}} onClick={()=>setExpanded(isOpen?null:p.id)}>
                      <td style={{...acTd,width:36,color:tm}}><span style={{display:"inline-flex",transform:isOpen?"rotate(90deg)":"none",transition:"transform .15s"}}><I.Chev s={14}/></span></td>
                      <td style={acTd}><div style={{display:"flex",alignItems:"center",gap:10}}><Av name={p.name} color={p.color}/><div><div style={{fontWeight:600,color:navy}}>{p.name}</div><div style={{fontSize:14,color:tm}}>{p.email}</div></div></div></td>
                      <td style={acTd}>{p.slot}</td>
                      <td style={acTd}>{p.campaign}</td>
                      <td style={acTd} onClick={e=>e.stopPropagation()}><AttToggle on={p.att}/></td>
                      <td style={acTd}>{acPill(p.attStatus)}</td>
                      <td style={acTd}>{acPill(p.schStatus)}</td>
                      <td style={acTd}>{p.dur}</td>
                    </tr>
                    {isOpen && p.acts.map((a,i)=>{
                      const last=i===p.acts.length-1;
                      const etd={verticalAlign:"top",background:"#FBF8F3",borderBottom:`1px solid ${bd}`,padding:last?"12px 12px 16px":"12px 12px",boxSizing:"border-box"};
                      return (
                      <tr key={i} style={{boxShadow:`inset 3px 0 0 ${teal}`}}>
                        <td style={{background:"#FBF8F3",borderBottom:`1px solid ${bd}`}}/>
                        <td style={etd}><div className="eyebrow" style={{marginBottom:4}}>Activity</div><div style={{fontSize:14,color:tx}}>{a.activity}</div></td>
                        <td style={etd}><div className="eyebrow" style={{marginBottom:4}}>Assessor</div><div style={{display:"flex",alignItems:"center",gap:7}}><Av name={a.assessor} color={navy} s={22}/><span style={{fontSize:14,color:tx}}>{a.assessor}</span></div></td>
                        <td style={etd}><div className="eyebrow" style={{marginBottom:4}}>Schedule Time</div><div style={{fontSize:14,color:tx}}>{a.schTime}</div></td>
                        <td style={etd}><div className="eyebrow" style={{marginBottom:4}}>Pre-work</div><div style={{fontSize:14,color:tx}}>{a.prework}</div></td>
                        <td style={etd}><div className="eyebrow" style={{marginBottom:4}}>Status</div>{acPill(a.status)}</td>
                        <td style={etd} colSpan={2}><div className="eyebrow" style={{marginBottom:6}}>Meeting</div><JoinRoom/></td>
                      </tr>
                      );
                    })}
                  </React.Fragment>);
                })}
                {parts.length===0 && <tr><td colSpan={8} style={{padding:0}}><NoResults query={q} label="participants" onClear={()=>setQ("")}/></td></tr>}
              </tbody>
            </table>
          </div>
        )}
        </div>
      </div>
    );
  };

  // ═══════ SCREEN: ASSESSMENT CENTER — CAMPAIGN DETAIL ═══════
  const ACampaignDetail = () => {
    const metaItems = [
      {label:"Date & Time", val:"16th Sep 2025, 4:30 pm (GMT+05:30)"},
      {label:"Duration", val:"8h"},
      {label:"Status", val:"__status__"},
      {label:"Timezone", val:"Asia/Kolkata"},
      {label:"Assessment Center Group", val:"aaa"},
      {label:"Meeting Link", val:"__join__"},
      {label:"Seats Booked", val:"2"},
      {label:"Seats Remaining", val:"88"},
      {label:"Center Managers", val:"__cm__"},
      {label:"Assessors", val:"__as__"},
      {label:"Scheduling Lead Time", val:"—"},
      {label:"Cancellation Lead Time", val:"Not Allowed"},
      {label:"Late cancellation & scheduling", val:"Not Allowed"},
    ];
    const renderVal = (v) => {
      if(v==="__status__") return <span style={{display:"inline-flex",alignItems:"center",gap:10}}>{acPill(acStatus)}<button onClick={()=>setStatusModal(true)} className="link" style={{color:teal,fontWeight:600,fontSize:14}}>Change</button></span>;
      if(v==="__join__") return <JoinRoom/>;
      if(v==="__cm__") return <Av name="Marco Rossi" color={purple} s={24}/>;
      if(v==="__as__") return <Av name="only cl admin" color={red} s={24}/>;
      return <span style={{color:tx,fontWeight:600}}>{v}</span>;
    };
    return (
      <div className="an1" data-screen-label="Assessment Center — Campaign" style={{padding:"24px 40px 80px",maxWidth:1400,margin:"0 auto"}}>
        <Breadcrumb items={[{label:"Clients"},{label:client},{label:"all"},{label:"assessment center testing"}]}/>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:22}}>
          <button onClick={()=>setRoute("ac")} className="btn btn-ghost" style={{padding:8}}><I.Chev s={16} r={180}/></button>
          <h1 className="h1">16th Sep 2025, 4:30 pm</h1>
        </div>

        <div style={{border:`1px solid ${bd}`,borderRadius:br,background:card,marginBottom:28,overflow:"hidden",display:"grid",gridTemplateColumns:vw<760?"1fr 1fr":"repeat(4,1fr)"}}>
          {metaItems.map((m,i)=>{
            const cols=vw<760?2:4;
            return (
            <div key={i} style={{padding:"12px 18px",borderTop:i>=cols?`1px solid ${bd}`:"none",borderLeft:(i%cols)!==0?`1px solid ${bd}`:"none",minWidth:0}}>
              <div style={{fontSize:14,color:tm,fontWeight:600,marginBottom:5,letterSpacing:0}}>{m.label}</div>
              <div style={{fontSize:14,minWidth:0}}>{renderVal(m.val)}</div>
            </div>
            );
          })}
          {(()=>{ const cols=vw<760?2:4; const rem=(cols-(metaItems.length%cols))%cols;
            return Array.from({length:rem}).map((_,k)=>(<div key={"mf"+k} style={{borderTop:`1px solid ${bd}`,borderLeft:`1px solid ${bd}`}}/>)); })()}
        </div>

        <div style={{display:"flex",alignItems:"center",gap:0,borderBottom:`1px solid ${bd}`,marginBottom:18}}>
          {[["subjects","Subjects"],["resources","Resources"],["activities","Activities"],["recordings","Recordings"]].map(([k,l])=>{
            const active=acDetailTab===k;
            return (
              <button key={k} onClick={()=>setAcDetailTab(k)} style={{padding:"12px 4px",marginRight:28,fontSize:14,fontWeight:active?700:500,color:active?navy:tm,borderBottom:`2px solid ${active?navy:"transparent"}`,marginBottom:-1,whiteSpace:"nowrap",background:"none"}}>
                {l}
              </button>
            );
          })}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
          <span style={{fontSize:14,color:tm}}>Total : <b style={{color:navy}}>{{subjects:acSubjects.length,resources:acResources.length,activities:acActivities.length,recordings:acRecordings.length}[acDetailTab]}</b></span>
          <div style={{flex:1}}/>
          {(acDetailTab==="subjects"||acDetailTab==="activities") && (
            <div style={{position:"relative"}}>
              <span style={{position:"absolute",left:11,top:10,color:tm,pointerEvents:"none"}}><I.Search s={15}/></span>
              <input value={acDetailQ} onChange={e=>setAcDetailQ(e.target.value)} placeholder={acDetailTab==="subjects"?"Search subjects":"Search activities"} style={{width:220,height:36,border:`1px solid ${bd}`,borderRadius:8,padding:"0 12px 0 34px",fontFamily:f,fontSize:14,color:tx,background:card,outline:"none"}}/>
            </div>
          )}
        </div>

        {acDetailTab==="subjects" && (
          <div style={{background:card,border:`1px solid ${bd}`,borderRadius:br,overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr>{acTh("ID")}{acTh("Participants")}{acTh("Prework")}{acTh("Activity")}{acTh("Attendance")}{acTh("Attendance status")}{acTh("Scheduling status")}{acTh("")}</tr></thead>
              <tbody>{(()=>{const list=acSubjects.filter(s=>!acDetailQ||s.name.toLowerCase().includes(acDetailQ.toLowerCase())||s.id.toLowerCase().includes(acDetailQ.toLowerCase())||(s.activity||"").toLowerCase().includes(acDetailQ.toLowerCase())); return list.length===0 ? <tr><td colSpan={8} style={{padding:0}}><NoResults query={acDetailQ} label="subjects" onClear={()=>setAcDetailQ("")}/></td></tr> : list.map(s=>(
                <tr key={s.id} className="rh" onClick={()=>showToast("Viewing subject")} style={{cursor:"pointer"}}>
                  <td style={acTd}><span className="link" style={{fontWeight:600,fontVariantNumeric:"tabular-nums"}}>{s.id}</span></td>
                  <td style={acTd}><div style={{display:"flex",alignItems:"center",gap:10}}><Av name={s.name} color={s.color}/><div><div style={{fontWeight:600,color:navy}}>{s.name}</div><div style={{fontSize:14,color:tm}}>{s.email}</div></div></div></td>
                  <td style={acTd}>{s.prework}</td>
                  <td style={acTd}>{s.activity}</td>
                  <td style={acTd}><AttToggle on={s.att}/></td>
                  <td style={acTd}>{acPill(s.attStatus)}</td>
                  <td style={acTd}>{acPill(s.schStatus)}</td>
                  <td style={{...acTd,position:"relative",paddingRight:32}}><span className="row-arrow"><I.Chev s={14}/></span></td>
                </tr>
              ));})()}</tbody>
            </table>
          </div>
        )}
        {acDetailTab==="activities" && (
          <div style={{background:card,border:`1px solid ${bd}`,borderRadius:br,overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr>{acTh("ID")}{acTh("Subject")}{acTh("Assessor")}{acTh("Activity")}{acTh("Schedule Time")}{acTh("Meeting Link")}{acTh("Status")}{acTh("")}</tr></thead>
              <tbody>{(()=>{const list=acActivities.filter(a=>!acDetailQ||a.subj.toLowerCase().includes(acDetailQ.toLowerCase())||a.id.toLowerCase().includes(acDetailQ.toLowerCase())||(a.activity||"").toLowerCase().includes(acDetailQ.toLowerCase())); return list.length===0 ? <tr><td colSpan={8} style={{padding:0}}><NoResults query={acDetailQ} label="activities" onClear={()=>setAcDetailQ("")}/></td></tr> : list.map(a=>(
                <tr key={a.id} className="rh" onClick={()=>{setEntryPath("participant");setSubjectId(candidates[0].id);setCandidateTab("assessments");setRoute("candidate");}} style={{cursor:"pointer"}}>
                  <td style={acTd}><span className="link" style={{fontWeight:600,fontVariantNumeric:"tabular-nums"}}>{a.id}</span></td>
                  <td style={acTd}><div style={{display:"flex",alignItems:"center",gap:9}}><Av name={a.subj} color={a.color} s={26}/><div><div style={{fontWeight:600,color:navy,fontSize:14}}>{a.subj}</div><div style={{fontSize:14,color:tm}}>{a.email}</div></div></div></td>
                  <td style={acTd}><Av name={a.assessor} color={red} s={26}/></td>
                  <td style={acTd}>{a.activity}</td>
                  <td style={acTd}>{a.time}</td>
                  <td style={acTd}><JoinRoom/></td>
                  <td style={acTd}>{acPill(a.status)}</td>
                  <td style={{...acTd,position:"relative",paddingRight:32}}><span className="row-arrow"><I.Chev s={14}/></span></td>
                </tr>
              ));})()}</tbody>
            </table>
          </div>
        )}
        {acDetailTab==="resources" && (
          <div style={{background:card,border:`1px solid ${bd}`,borderRadius:br,overflow:"hidden"}}>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",minWidth:600}}>
                <thead><tr>{acTh("Name")}{acTh("Link")}{acTh("")}</tr></thead>
                <tbody>
                  {acResources.length===0 && <tr><td colSpan={3} style={{...acTd,textAlign:"center",color:tm,padding:"48px 16px"}}>No data</td></tr>}
                  {acResources.map(r=>{
                    const t=RES_TYPES[r.type]||RES_TYPES.doc;
                    return (
                    <tr key={r.id} className="rh" onClick={()=>{window.open(r.url,"_blank","noopener,noreferrer");showToast(`Opening ${r.name}`);}} style={{cursor:"pointer"}}>
                      <td style={acTd}><div style={{display:"flex",alignItems:"center",gap:12}}><div style={{width:34,height:34,borderRadius:8,background:`${t.color}14`,color:t.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{t.icon(16)}</div><div><div style={{fontWeight:600,color:navy}}>{r.name}</div><div style={{fontSize:14,color:tm}}>{t.label}</div></div></div></td>
                      <td style={acTd}><a href={r.url} target="_blank" rel="noopener noreferrer" className="link" style={{color:teal,fontSize:14}}>{r.url}</a></td>
                      <td style={{...acTd,position:"relative",paddingRight:32}}><span className="row-arrow"><I.Chev s={14}/></span></td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {acDetailTab==="recordings" && (
          <div style={{background:card,border:`1px solid ${bd}`,borderRadius:br,overflow:"hidden"}}>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",minWidth:900}}>
                <thead><tr>{acTh("Serial No")}{acTh("Recording Date")}{acTh("Assessor")}{acTh("Participants")}{acTh("Link to view recordings")}{acTh("Transcriptions")}</tr></thead>
                <tbody>
                  {acRecordings.length===0 && <tr><td colSpan={6} style={{...acTd,textAlign:"center",color:tm,padding:"48px 16px"}}>No data</td></tr>}
                  {acRecordings.map((r,i)=>(
                    <tr key={r.id} className="rh">
                      <td style={acTd}><span className="link" style={{fontWeight:600,fontVariantNumeric:"tabular-nums"}}>{i+1}</span></td>
                      <td style={acTd}>{r.date}</td>
                      <td style={acTd}><div style={{display:"flex",alignItems:"center",gap:8}}><Av name={r.assessor} color={red} s={24}/><span>{r.assessor}</span></div></td>
                      <td style={acTd}><div style={{display:"flex",alignItems:"center",gap:8}}><Av name={r.participant} color={navy} s={24}/><span>{r.participant}</span></div></td>
                      <td style={acTd}><div style={{display:"flex",alignItems:"center",gap:14}}><button onClick={()=>showToast(`Playing ${r.label}`)} className="link" style={{fontSize:14,fontWeight:600,display:"inline-flex",alignItems:"center",gap:5}}><I.Play s={12}/> View recording</button><button onClick={()=>showToast(`Downloading ${r.label}`)} className="link" style={{fontSize:14,fontWeight:600,display:"inline-flex",alignItems:"center",gap:5}}><I.Download s={13}/> Download</button></div></td>
                      <td style={acTd}>{r.transcript ? <button onClick={()=>showToast("Opening transcript")} className="link" style={{fontSize:14,fontWeight:600,display:"inline-flex",alignItems:"center",gap:5}}><I.Doc s={13}/> View</button> : <span style={{color:tm,fontSize:14}}>—</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {statusModal && (
          <div onClick={()=>setStatusModal(false)} style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,15,71,.5)",backdropFilter:"blur(3px)",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
            <div onClick={e=>e.stopPropagation()} style={{background:card,borderRadius:12,width:"100%",maxWidth:480,boxShadow:"0 30px 80px rgba(0,15,71,.4)",overflow:"hidden"}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:12,padding:"20px 22px 0"}}>
                <div style={{flex:1}}><div style={{fontSize:16,fontWeight:700,color:navy,fontFamily:serif}}>Change assessment center status</div></div>
                <button onClick={()=>setStatusModal(false)} style={{color:tm,fontSize:20,lineHeight:1}}>×</button>
              </div>
              <div style={{padding:"10px 22px 20px",fontSize:14,color:ts,lineHeight:1.5}}>Once you close the assessment center, participants will not be able to participate in any center activities.</div>
              <div style={{display:"flex",gap:28,padding:"0 22px 20px"}}>
                {["Open","Closed"].map(o=>(
                  <label key={o} style={{display:"flex",alignItems:"center",gap:9,cursor:"pointer"}}>
                    <span style={{width:18,height:18,borderRadius:9,border:`2px solid ${acStatus===o?teal:bdStrong}`,display:"flex",alignItems:"center",justifyContent:"center"}}>{acStatus===o&&<span style={{width:9,height:9,borderRadius:5,background:teal}}/>}</span>
                    <input type="radio" checked={acStatus===o} onChange={()=>setAcStatus(o)} style={{display:"none"}}/>
                    <span style={{fontSize:14,color:tx,fontWeight:600}}>{o}</span>
                  </label>
                ))}
              </div>
              <div style={{display:"flex",justifyContent:"flex-end",gap:10,padding:"14px 22px",borderTop:`1px solid ${bd}`,background:bg}}>
                <button onClick={()=>setStatusModal(false)} className="btn btn-secondary">Cancel</button>
                <button onClick={()=>{setStatusModal(false);showToast(`Status updated to ${acStatus}`);}} className="btn btn-primary"><I.Check s={13}/> Update</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ═══════ SCREEN: AVAILABILITY ═══════
  const fmtDate=(s)=>{ if(!s) return ""; const p=s.split("-"); return p.length===3 ? `${p[2]}/${p[1]}/${p[0]}` : s; };
  const dayLabelsAv = ["S","M","T","W","T","F","S"];
  const dayNamesAv = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const dayAbbrAv = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const [avails,setAvails]=useState([]);
  const [availMode,setAvailMode]=useState("list");  // list | edit
  const [availDraft,setAvailDraft]=useState(null);
  const [availOpen,setAvailOpen]=useState(null);
  const blankAvail=()=>({ id:null, tz:"(GMT+04:00) Asia/Dubai", start:"", end:"",
    active:[false,true,true,true,true,true,false],
    rows:dayNamesAv.map(()=>[{start:"9:00 AM",end:"5:00 PM"}]) });
  // compact summary of active days e.g. "Mon–Fri" or "Mon, Wed, Fri"
  const daySummary=(active)=>{
    const on=active.map((v,i)=>v?i:-1).filter(i=>i>=0);
    if(!on.length) return "No days selected";
    let contiguous=on.every((v,i)=>i===0||v===on[i-1]+1);
    return contiguous&&on.length>2 ? `${dayAbbrAv[on[0]]}–${dayAbbrAv[on[on.length-1]]}` : on.map(i=>dayAbbrAv[i]).join(", ");
  };

  const Availability = () => {
    const dayLabels=dayLabelsAv, dayNames=dayNamesAv;
    const times = ["8:00 AM","8:30 AM","9:00 AM","9:30 AM","10:00 AM","12:00 PM","1:00 PM","3:00 PM","4:00 PM","4:30 PM","5:00 PM","5:30 PM","6:00 PM"];
    const emptyList = avails.length===0;
    const d = availDraft || (emptyList ? blankAvail() : null);
    const setActive=(fn)=>setAvailDraft(p=>({...(p||blankAvail()),active:fn((p||blankAvail()).active)}));
    const norm=(rows)=>rows.map(r=>Array.isArray(r)?r:[r]);
    const setSlot=(i,si,k,v)=>setAvailDraft(p=>{const b=p||blankAvail();const rows=norm(b.rows);return {...b,rows:rows.map((r,j)=>j===i?r.map((s,k2)=>k2===si?{...s,[k]:v}:s):r)};});
    const addSlot=(i)=>setAvailDraft(p=>{const b=p||blankAvail();const rows=norm(b.rows);return {...b,rows:rows.map((r,j)=>j===i?[...r,{start:"9:00 AM",end:"5:00 PM"}]:r)};});
    const removeSlot=(i,si)=>setAvailDraft(p=>{const b=p||blankAvail();const rows=norm(b.rows);const nr=rows[i].filter((_,k2)=>k2!==si);const active=nr.length?b.active:b.active.map((v,j)=>j===i?false:v);return {...b,active,rows:rows.map((r,j)=>j===i?(nr.length?nr:[{start:"9:00 AM",end:"5:00 PM"}]):r)};});
    const setField=(k,v)=>setAvailDraft(p=>({...(p||blankAvail()),[k]:v}));
    const copyAll=(i)=>setAvailDraft(p=>{const b=p||blankAvail();const rows=norm(b.rows);return {...b,rows:rows.map(()=>rows[i].map(s=>({...s})))};});
    const startEdit=(rec)=>{ setAvailDraft(rec?JSON.parse(JSON.stringify(rec)):blankAvail()); setAvailMode("edit"); };
    const cancelEdit=()=>{ setAvailDraft(null); setAvailMode("list"); };
    const saveDraft=()=>{
      setAvails(p=>{
        if(d.id==null){ const nid=Math.max(0,...p.map(a=>a.id))+1; return [...p,{...d,id:nid}]; }
        return p.map(a=>a.id===d.id?d:a);
      });
      showToast(d.id==null?"Availability added":"Availability updated");
      setAvailDraft(null); setAvailMode("list");
    };
    const removeAvail=(id)=>{ setAvails(p=>p.filter(a=>a.id!==id)); setAvailOpen(o=>o===id?null:o); showToast("Availability deleted"); };
    const sel = (val,onCh) => (
      <div style={{position:"relative"}}>
        <select value={val} onChange={e=>onCh(e.target.value)} style={{appearance:"none",height:40,minWidth:130,border:`1px solid ${bd}`,borderRadius:8,padding:"0 34px 0 12px",fontFamily:f,fontSize:14,color:tx,background:card,cursor:"pointer"}}>{times.map(t=><option key={t}>{t}</option>)}</select>
        <span style={{position:"absolute",right:11,top:12,color:tm,pointerEvents:"none"}}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2" strokeLinecap="round"/></svg></span>
      </div>
    );
    const rnd=(fn)=>({width:30,height:30,borderRadius:15,border:`1px solid ${bdStrong}`,background:card,color:tm,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0});

    // ── EDIT / ADD FORM (also shown when no availability exists yet) ──
    if((availMode==="edit" || emptyList) && d){
      return (
      <div className="an1" data-screen-label="Availability" style={{padding:"28px 40px 80px",maxWidth:1400,margin:"0 auto"}}>
        <div data-tour="avail-header" style={{display:"flex",alignItems:"center",gap:12,marginBottom:22}}>
          {!emptyList && <button onClick={cancelEdit} className="btn btn-ghost" style={{padding:8}}><I.Chev s={16} r={180}/></button>}
          <h1 className="h1">Availability</h1>
        </div>
        <div data-tour="avail-form" style={{background:card,border:`1px solid ${bd}`,borderRadius:br,padding:"24px 28px"}}>
          <div style={{display:"flex",alignItems:"flex-start",marginBottom:22}}>
            <div>
              <div className="serif" style={{fontSize:24,fontWeight:400,color:navy}}>Add new schedule</div>
              <div style={{fontSize:14,color:tm,marginTop:4}}>Start time must be earlier than the end time</div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:isNarrow?"1fr":"1fr 1fr 1fr",gap:18,marginBottom:24,maxWidth:760}}>
            <div>
              <div className="eyebrow" style={{marginBottom:7}}>TimeZone</div>
              <div style={{position:"relative"}}>
                <select value={d.tz} onChange={e=>setField("tz",e.target.value)} style={{appearance:"none",width:"100%",height:42,border:`1px solid ${bd}`,borderRadius:8,padding:"0 34px 0 12px",fontFamily:f,fontSize:14,color:tx,background:card,cursor:"pointer"}}>
                  <option>(GMT+04:00) Asia/Dubai</option><option>(GMT+05:30) Asia/Kolkata</option><option>(GMT+00:00) UTC</option><option>(GMT+01:00) Europe/Rome</option>
                </select>
                <span style={{position:"absolute",right:12,top:15,color:tm,pointerEvents:"none"}}><I.Down s={11}/></span>
              </div>
            </div>
            <div>
              <div className="eyebrow" style={{marginBottom:7}}>Start Date</div>
              <input type="date" value={d.start} onChange={e=>setField("start",e.target.value)} style={{width:"100%",height:42,border:`1px solid ${bd}`,borderRadius:8,padding:"0 12px",fontFamily:f,fontSize:14,color:d.start?tx:tm,outline:"none",background:card}}/>
            </div>
            <div>
              <div className="eyebrow" style={{marginBottom:7}}>End Date</div>
              <input type="date" min={d.start||undefined} value={d.end} onChange={e=>setField("end",e.target.value)} style={{width:"100%",height:42,border:`1px solid ${bd}`,borderRadius:8,padding:"0 12px",fontFamily:f,fontSize:14,color:d.end?tx:tm,outline:"none",background:card}}/>
            </div>
          </div>

          <div data-tour="avail-days" style={{display:"flex",gap:10,marginBottom:24}}>
            {dayLabels.map((dl,i)=>(
              <button key={i} onClick={()=>setActive(p=>p.map((v,j)=>j===i?!v:v))} style={{width:34,height:34,borderRadius:17,border:`1px solid ${d.active[i]?teal:bdStrong}`,background:d.active[i]?teal:card,color:d.active[i]?"#fff":tm,fontSize:14,fontWeight:700}}>{dl}</button>
            ))}
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {dayNames.map((dn,i)=> d.active[i] && (norm(d.rows)[i]).map((slot,si)=>(
              <div key={i+"-"+si} style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
                <div style={{width:110,fontSize:14,fontWeight:600,color:tx}}>{si===0?dn:""}</div>
                {sel(slot.start,v=>setSlot(i,si,"start",v))}
                {sel(slot.end,v=>setSlot(i,si,"end",v))}
                <button onClick={()=>removeSlot(i,si)} title="Remove slot" style={rnd()}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M5 12h14"/></svg></button>
                <button onClick={()=>addSlot(i)} title="Add slot" style={rnd()}><svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg></button>
                {d.active.indexOf(true)===i && si===0 && <button onClick={()=>copyAll(i)} className="link" style={{color:teal,fontWeight:600,fontSize:14,display:"inline-flex",alignItems:"center",gap:5}}><I.Doc s={13}/> Copy to all</button>}
              </div>
            )))}
          </div>

          <div style={{display:"flex",justifyContent:"flex-end",gap:12,marginTop:28}}>
            {!emptyList && <button onClick={cancelEdit} className="btn btn-secondary" style={{padding:"9px 24px"}}>Cancel</button>}
            <button data-tour="avail-save" onClick={saveDraft} className="btn btn-primary" style={{padding:"9px 28px"}}>Save</button>
          </div>
        </div>
      </div>
      );
    }

    // ── LIST (saved availabilities) ──
    return (
      <div className="an1" data-screen-label="Availability" style={{padding:"28px 40px 80px",maxWidth:1400,margin:"0 auto"}}>
        <div data-tour="avail-header" style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
          <h1 className="h1">Availability</h1>
          <div style={{flex:1}}/>
          <button data-tour="avail-add" onClick={()=>startEdit(null)} className="btn btn-primary">+ Add new availability</button>
        </div>
        <div style={{fontSize:14,color:tm,marginBottom:18}}>Total : <b style={{color:navy}}>{avails.length}</b></div>

        {avails.length===0 && (
          <div style={{background:card,border:`1px dashed ${bdStrong}`,borderRadius:br,padding:"48px 24px",textAlign:"center"}}>
            <div style={{color:tm,marginBottom:6}}><I.Cal s={26}/></div>
            <div style={{fontSize:15,fontWeight:700,color:navy,marginBottom:4}}>No availability yet</div>
            <div style={{fontSize:14,color:tm,marginBottom:18}}>Add a schedule so campaigns know when you can assess.</div>
            <button onClick={()=>startEdit(null)} className="btn btn-primary">+ Add new availability</button>
          </div>
        )}

        <div data-tour="avail-list" style={{display:"flex",flexDirection:"column",gap:14}}>
          {avails.map(a=>{
            const open=availOpen===a.id;
            return (
            <div key={a.id} style={{background:card,border:`1px solid ${bd}`,borderRadius:br,overflow:"hidden"}}>
              <div style={{display:"flex",alignItems:"center",gap:14,padding:"18px 24px",borderBottom:open?`1px solid ${bd}`:"none"}}>
                <div style={{width:40,height:40,borderRadius:8,background:navyBg,color:navy,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><I.Cal s={18}/></div>
                <div style={{flex:1,minWidth:0,cursor:"pointer"}} onClick={()=>setAvailOpen(open?null:a.id)}>
                  <div style={{fontSize:16,fontWeight:700,color:navy}}>{fmtDate(a.start)||"—"} – {fmtDate(a.end)||"—"}</div>
                  <div style={{fontSize:14,color:tm,marginTop:2}}>{daySummary(a.active)} · {a.tz}</div>
                </div>
                <button onClick={()=>startEdit(a)} className="btn btn-secondary" style={{padding:"7px 14px"}}><I.Edit s={13}/> Edit</button>
                <button onClick={()=>removeAvail(a.id)} className="btn btn-ghost" title="Delete" style={{padding:8,color:red}}><I.X s={15}/></button>
                <button onClick={()=>setAvailOpen(open?null:a.id)} className="btn btn-ghost" style={{padding:8,color:tm}}><span style={{display:"inline-flex",transform:open?"rotate(180deg)":"none",transition:"transform .15s"}}><I.Down s={16}/></span></button>
              </div>
              {open && (
                <div style={{padding:"20px 24px"}}>
                  <div style={{display:"grid",gridTemplateColumns:isNarrow?"1fr":"repeat(3,1fr)",gap:18,marginBottom:20,maxWidth:600}}>
                    <div><div className="eyebrow" style={{marginBottom:5}}>TimeZone</div><div style={{fontSize:14,fontWeight:600,color:tx}}>{a.tz}</div></div>
                    <div><div className="eyebrow" style={{marginBottom:5}}>Start Date</div><div style={{fontSize:14,fontWeight:600,color:tx}}>{fmtDate(a.start)||"—"}</div></div>
                    <div><div className="eyebrow" style={{marginBottom:5}}>End Date</div><div style={{fontSize:14,fontWeight:600,color:tx}}>{fmtDate(a.end)||"—"}</div></div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:8,maxWidth:420}}>
                    {dayNamesAv.map((dn,i)=> a.active[i] && (
                      <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderTop:`1px solid ${bd}`}}>
                        <div style={{width:110,fontSize:14,fontWeight:600,color:tx}}>{dn}</div>
                        <div style={{fontSize:14,color:tm}}>{(Array.isArray(a.rows[i])?a.rows[i]:[a.rows[i]]).map(s=>`${s.start} – ${s.end}`).join(", ")}</div>
                      </div>
                    ))}
                    {a.active.every(v=>!v) && <div style={{fontSize:14,color:tm}}>No days selected.</div>}
                  </div>
                </div>
              )}
            </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ═══════ SCREEN: ASSESSOR DASHBOARD (overview of all three tabs) ═══════
  const HomeDashboard = () => {
    const toDo = candidates.filter(c=>c.evalStatus!=="Completed");
    const awaiting = candidates.filter(c=>c.modStatus!=="Completed"&&c.evalStatus==="Completed");
    const completed = candidates.filter(c=>c.modStatus==="Completed");
    const kpis = [
      { l:"Candidates", v:candidates.length, sub:"assigned to you", c:navy, ic:I.Users },
      { l:"Evaluations to do", v:toDo.length, sub:"across 5 assessor forms", c:teal, ic:I.Doc },
      { l:"Awaiting moderation", v:awaiting.length, sub:"ready to consolidate", c:orange, ic:I.Alert },
      { l:"Completed", v:completed.length, sub:"signed off", c:green, ic:I.CheckCircle },
    ];
    const activeCampaigns = campaigns.filter(cp=>cp.status==="Active"&&cp.candidateIds.length);
    const sessions = [
      ...acCampaigns.current.map(s=>({...s, when:s.dt.split(" (")[0]})),
      ...acCampaigns.upcoming.map(s=>({...s, when:s.dt.split(" (")[0]})),
    ];
    // sort evaluation queue: in-progress first, then not started, completed last; by forms done
    const rank = {"In progress":0,"Not started":1,"Completed":2};
    const queue = [...candidates].sort((a,b)=>(rank[a.evalStatus]-rank[b.evalStatus])||(b.evalDone-a.evalDone)).slice(0,5);
    const openCandidate = (id)=>{ setEntryPath("participant"); setSubjectId(id); setRoute("candidate"); setCandidateTab("assessments"); };

    const SectionHead = ({title, count, action, onAction, accent, icon:Ic}) => (
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"16px 20px",borderBottom:`1px solid ${bd}`}}>
        <div style={{fontFamily:f,fontSize:14,fontWeight:700,color:navy,letterSpacing:-.1,flex:1,minWidth:0,display:"inline-flex",alignItems:"center",gap:10}}>
          {Ic && <span style={{width:30,height:30,borderRadius:8,background:`${accent||navy}14`,color:accent||navy,display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Ic s={16}/></span>}
          <span style={{minWidth:0}} className="elide">{title}</span>

        </div>
        {action && <button onClick={onAction} className="link" style={{fontSize:14,fontWeight:600,display:"inline-flex",alignItems:"center",gap:4,background:"none",border:"none",cursor:"pointer",flexShrink:0,whiteSpace:"nowrap"}}>{action} <I.Chev s={12}/></button>}
      </div>
    );
    const GroupHead = ({label, sub}) => (
      <div style={{marginBottom:16}}>
        <div style={{fontSize:14,fontWeight:800,letterSpacing:.7,textTransform:"uppercase",color:navy}}>{label}</div>
        {sub && <div style={{fontSize:14,color:tm,marginTop:3}}>{sub}</div>}
      </div>
    );
    const cardBox = {background:card,border:`1px solid ${bd}`,borderRadius:br,overflow:"hidden"};
    const cardEq = {...cardBox,display:"flex",flexDirection:"column",height:"100%"};
    const s2Avatar = (bg,txt)=>(<div style={{width:32,height:32,borderRadius:16,background:bg,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,flexShrink:0,fontFamily:f}}>{txt}</div>);
    const SampleFab = () => (
      <div style={{position:"fixed",right:24,top:"50%",transform:"translateY(-50%)",zIndex:120,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:10}}>
        {sampleMenuOpen && (
          <div style={{background:card,border:`1px solid ${bd}`,borderRadius:12,boxShadow:"0 16px 44px rgba(0,15,71,.20)",padding:6,minWidth:220}}>
            <div style={{fontSize:14,fontWeight:800,letterSpacing:.6,textTransform:"uppercase",color:tm,padding:"8px 12px 6px"}}>Dashboard layout</div>
            {[{k:"1",l:"Sample 1 · Dense grid"},{k:"2",l:"Sample 2 · Equal cards, no scroll"},{k:"3",l:"Sample 3 · Compact (3 rows each)"}].map(o=>(
              <button key={o.k} onClick={()=>{setDashSample(o.k);setSampleMenuOpen(false);}} style={{display:"flex",alignItems:"center",gap:8,width:"100%",textAlign:"left",padding:"10px 12px",borderRadius:8,background:dashSample===o.k?navyBg:"transparent",cursor:"pointer",fontSize:14,fontWeight:dashSample===o.k?700:500,color:navy}}>
                <span style={{width:16,display:"inline-flex",justifyContent:"center",color:teal}}>{dashSample===o.k?<I.Check s={13}/>:null}</span>{o.l}
              </button>
            ))}
          </div>
        )}
        <button onClick={()=>setSampleMenuOpen(v=>!v)} title="Dashboard layouts" style={{width:52,height:52,borderRadius:26,background:navy,color:"#fff",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 10px 30px rgba(0,15,71,.30)"}}><I.Dash s={20}/></button>
      </div>
    );
    const Sample2 = () => (
      <div style={{display:"flex",flexDirection:"column",gap:20}}>
        <div style={{display:"grid",gridTemplateColumns:isNarrow?"1fr":"repeat(3,1fr)",gap:20,alignItems:"stretch"}}>
          {/* Evaluations */}
          <div style={cardEq}>
            <SectionHead title="Evaluations" count={toDo.length} action="View all" onAction={()=>{setRoute("dashboard");setDashTab("participant");}} accent={teal} icon={I.Doc}/>
            <div style={{flex:1}}>
              <table style={{width:"100%",borderCollapse:"collapse",tableLayout:"fixed"}}>
                <colgroup><col style={{width:"64%"}}/><col style={{width:"30%"}}/><col style={{width:"6%"}}/></colgroup><thead><tr>{acTh("Candidate")}{acTh("Evaluation")}{acTh("")}</tr></thead>
                <tbody>
                  {queue.map((c)=>(
                    <tr key={c.id} className="rh" onClick={()=>openCandidate(c.id)} style={{cursor:"pointer"}}>
                      <td style={acTd}><div style={{display:"flex",alignItems:"center",gap:10,minWidth:0}}>{s2Avatar(`${teal}`,c.name.split(" ").map(n=>n[0]).slice(0,2).join(""))}<div style={{minWidth:0}}><div style={{fontWeight:600,color:tx,fontSize:14}} className="elide">{c.name}</div></div></div></td>
                      <td style={acTd}><StatusPill s={c.evalStatus}/></td>
                      <td style={{...acTd,position:"relative",paddingRight:26,width:34}}><span className="row-arrow"><I.Chev s={14}/></span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Active campaigns */}
          <div style={cardEq}>
            <SectionHead title="Active campaigns" count={activeCampaigns.length} action="View all" onAction={()=>{setRoute("dashboard");setDashTab("campaign");}} accent={navy} icon={I.Chart}/>
            <div style={{flex:1}}>
              <table style={{width:"100%",borderCollapse:"collapse",tableLayout:"fixed"}}>
                <colgroup><col style={{width:"74%"}}/><col style={{width:"14%"}}/><col style={{width:"12%"}}/></colgroup><thead><tr>{acTh("Campaign")}{acTh("Cands","right")}{acTh("")}</tr></thead>
                <tbody>
                  {activeCampaigns.map((cp)=>{
                    const cohort = cp.candidateIds.map(id=>candidates.find(c=>c.id===id)).filter(Boolean);
                    return (
                      <tr key={cp.id} className="rh" onClick={()=>{setCampaignId(cp.id);setRoute("campaign");}} style={{cursor:"pointer"}}>
                        <td style={acTd}><div style={{minWidth:0}}><div style={{fontSize:14,fontWeight:700,color:navy}} className="elide">{cp.project}</div><div style={{fontSize:14,color:tm}} className="elide">{cp.client}</div></div></td>
                        <td style={{...acTd,textAlign:"right"}}><span className="tnum" style={{fontWeight:700,color:navy}}>{cohort.length}</span></td>
                        <td style={{...acTd,position:"relative",paddingRight:26,width:34}}><span className="row-arrow"><I.Chev s={14}/></span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          {/* Assessment center */}
          <div style={cardEq}>
            <SectionHead title="Assessment center" count={sessions.length} action="View all" onAction={()=>{setRoute("ac");setAcTab("campaigns");}} accent={purple} icon={I.Cal}/>
            <div style={{flex:1,padding:"14px 20px 0"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,paddingBottom:14,borderBottom:`1px solid ${bd}`}}>
                {[{v:acCampaigns.current.length,l:"Active",c:teal,ic:I.Dash},{v:acCampaigns.upcoming.length,l:"Upcoming",c:orange,ic:I.Cal},{v:acParticipants.length,l:"People",c:navy,ic:I.Users}].map((s,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10,minWidth:0}}><span style={{width:34,height:34,borderRadius:9,background:`${s.c}14`,color:s.c,display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><s.ic s={17}/></span><div style={{minWidth:0}}><div className="tnum serif" style={{fontSize:22,fontWeight:400,color:s.c,lineHeight:1}}>{s.v}</div><div style={{fontSize:14,color:tm,marginTop:3}}>{s.l}</div></div></div>
                ))}
              </div>
              {sessions.slice(0,3).map((s,i)=>(
                <div key={s.id} onClick={()=>{setRoute("ac");setAcTab("campaigns");}} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 0",borderTop:i===0?"none":`1px solid ${bd}`,cursor:"pointer"}}>
                  <div style={{width:32,height:32,borderRadius:8,background:purpleBg,color:purple,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><I.Cal s={15}/></div>
                  <div style={{flex:1,minWidth:0}}><div style={{fontSize:14,fontWeight:600,color:navy}} className="elide">{s.slot}</div><div style={{fontSize:14,color:tm}} className="elide">{s.when}</div></div>
                  <span style={{color:tm,display:"flex",flexShrink:0}}><I.Chev s={13}/></span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:isNarrow?"1fr":"2fr 1fr",gap:20,alignItems:"stretch"}}>
          {/* Participants */}
          <div style={cardEq}>
            <SectionHead title="Participants" count={acParticipants.length} action="View all" onAction={()=>{setRoute("ac");setAcTab("participants");}} accent={teal} icon={I.Users}/>
            <div style={{flex:1}}>
              <table style={{width:"100%",borderCollapse:"collapse",tableLayout:"fixed"}}>
                <colgroup><col style={{width:"24%"}}/><col style={{width:"40%"}}/><col style={{width:"14%"}}/><col style={{width:"16%"}}/><col style={{width:"6%"}}/></colgroup><thead><tr>{acTh("Participant")}{acTh("Campaign")}{acTh("Slot","right")}{acTh("Attendance","right")}{acTh("")}</tr></thead>
                <tbody>
                  {acParticipants.map((p)=>(
                    <tr key={p.id} className="rh" onClick={()=>{setRoute("ac");setAcTab("participants");}} style={{cursor:"pointer"}}>
                      <td style={acTd}><div style={{display:"flex",alignItems:"center",gap:10,minWidth:0}}>{s2Avatar(p.color,p.name.split(" ").map(n=>n[0]).slice(0,2).join("").toUpperCase())}<div style={{minWidth:0}}><div style={{fontWeight:600,color:tx,fontSize:14}} className="elide">{p.name}</div></div></div></td>
                      <td style={acTd}><span className="elide" style={{display:"block",color:tm,textTransform:"capitalize"}}>{p.campaign}</span></td>
                      <td style={{...acTd,textAlign:"right"}}>{p.slot}</td>
                      <td style={{...acTd,textAlign:"right"}}>{p.attStatus==="On Time" ? <span className="tag" style={{background:`${green}14`,color:green}}>{p.attStatus}</span> : <span className="tag" style={{background:navyBg,color:tm}}>{p.attStatus}</span>}</td>
                      <td style={{...acTd,position:"relative",paddingRight:26,width:34}}><span className="row-arrow"><I.Chev s={14}/></span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Availability */}
          <div style={cardEq}>
            <SectionHead title="Your availability" count={avails.length||null} action="Manage" onAction={()=>setRoute("avail")} accent={gold} icon={I.User}/>
            <div style={{flex:1}}>
              {avails.length===0 ? (
                <div style={{padding:"26px 20px",textAlign:"center"}}>
                  <div style={{color:tm,marginBottom:8}}><I.Cal s={24}/></div>
                  <div style={{fontSize:14,fontWeight:700,color:navy,marginBottom:3}}>No availability set</div>
                  <div style={{fontSize:14,color:tm,marginBottom:16,lineHeight:1.55}}>Add a schedule so campaigns know when you can assess.</div>
                  <button onClick={()=>setRoute("avail")} className="btn btn-primary" style={{padding:"8px 18px"}}>+ Add availability</button>
                </div>
              ) : (
                <div>
                  {avails.map((a,i)=>(
                    <div key={a.id} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 20px",borderTop:i===0?"none":`1px solid ${bd}`}}>
                      <div style={{width:32,height:32,borderRadius:8,background:navyBg,color:navy,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><I.Cal s={15}/></div>
                      <div style={{minWidth:0}}><div style={{fontSize:14,fontWeight:700,color:navy}} className="elide">{fmtDate(a.start)||"—"} – {fmtDate(a.end)||"—"}</div><div style={{fontSize:14,color:tm,marginTop:1}} className="elide">{daySummary(a.active)} · {a.tz}</div></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <div className="an1" data-screen-label="00 Assessor Dashboard" style={{padding:"36px 40px 80px",maxWidth:1400,margin:"0 auto"}}>
        <h1 className="display" data-tour="dash-welcome" style={{marginBottom:6}}>Good morning, Elena.</h1>

        {/* KPI strip */}
        <div data-tour="dash-stats" style={{display:"grid",gridTemplateColumns:isNarrow?"1fr 1fr":"repeat(4,1fr)",gap:24,padding:"24px 0 0",borderTop:`1px solid ${bd}`,marginBottom:24,borderStyle:"none"}}>
          {kpis.map((k,i)=>(
            <div key={i} style={{display:"flex",alignItems:"flex-start",gap:14}}>
              <span style={{width:46,height:46,borderRadius:12,background:`${k.c}14`,color:k.c,display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><k.ic s={21}/></span>
              <div style={{minWidth:0}}>
                <div className="serif" style={{fontSize:32,fontWeight:400,color:k.c,lineHeight:1,marginBottom:3}}>{k.v}</div>
                <div style={{fontSize:14,fontWeight:700,color:tx,marginBottom:3}}>{k.l}</div>
                <div style={{fontSize:14,color:tm}}>{k.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {(dashSample==="1"||dashSample==="3") && (
        <div style={{display:"grid",gridTemplateColumns:isNarrow?"1fr":"1fr 1fr",gap:20,alignItems:"stretch"}}>
            {/* Evaluation queue */}
            <div data-tour="dash-evals" style={cardBox}>
              <SectionHead title="Evaluations" count={toDo.length} action="View all" onAction={()=>{setRoute("dashboard");setDashTab("participant");}} accent={teal} icon={I.Doc}/>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",tableLayout:"fixed"}}>
                  <colgroup><col style={{width:"64%"}}/><col style={{width:"30%"}}/><col style={{width:"6%"}}/></colgroup><thead><tr>{acTh("Candidate")}{acTh("Evaluation")}{acTh("")}</tr></thead>
                  <tbody>
                    {(dashSample==="3"?queue.slice(0,3):queue).map((c,i)=>(
                      <tr key={c.id} className="rh" onClick={()=>openCandidate(c.id)} style={{cursor:"pointer"}}>
                        <td style={acTd}>
                          <div style={{display:"flex",alignItems:"center",gap:12,minWidth:0}}>
                            <div style={{width:34,height:34,borderRadius:17,background:`${teal}1A`,color:teal,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,flexShrink:0,fontFamily:f}}>{c.name.split(" ").map(n=>n[0]).slice(0,2).join("")}</div>
                            <div style={{minWidth:0}}>
                              <div style={{fontWeight:600,color:tx,fontSize:14}} className="elide">{c.name}</div>
                              <div style={{fontSize:14,color:tm}} className="elide">{c.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={acTd}>
                          <div style={{display:"flex",alignItems:"center",gap:10}}>
                            <StatusPill s={c.evalStatus}/>
                            <span className="tnum" style={{fontSize:14,color:tx,fontWeight:600}}>{c.evalDone}/{c.evalTotal}</span>
                          </div>
                        </td>
                        <td style={{...acTd,position:"relative",paddingRight:32}}><span className="row-arrow"><I.Chev s={14}/></span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Active campaigns */}
            <div data-tour="dash-campaigns" style={cardBox}>
              <SectionHead title="Active campaigns" count={activeCampaigns.length} action="View all" onAction={()=>{setRoute("dashboard");setDashTab("campaign");}} accent={navy} icon={I.Chart}/>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",tableLayout:"fixed"}}>
                  <colgroup><col style={{width:"50%"}}/><col style={{width:"16%"}}/><col style={{width:"26%"}}/><col style={{width:"8%"}}/></colgroup><thead><tr>{acTh("Campaign")}{acTh("Cand.","right")}{acTh("Eval done","right")}{acTh("")}</tr></thead>
                  <tbody>
                    {(dashSample==="3"?activeCampaigns.slice(0,3):activeCampaigns).map((cp,ci)=>{
                      const cohort = cp.candidateIds.map(id=>candidates.find(c=>c.id===id)).filter(Boolean);
                      const evalComplete = cohort.filter(c=>c.evalStatus==="Completed").length;
                      const awaitingMod = cohort.filter(c=>c.evalStatus==="Completed"&&c.modStatus!=="Completed").length;
                      return (
                        <tr key={cp.id} className="rh" onClick={()=>{setCampaignId(cp.id);setRoute("campaign");}} style={{cursor:"pointer"}}>
                          <td style={acTd}>
                            <div style={{minWidth:0}}>
                              <div style={{fontSize:14,fontWeight:700,color:navy,letterSpacing:-.2}} className="elide">{cp.project}</div>
                              <div style={{fontSize:14,color:tm,marginTop:2}} className="elide">{cp.client} · {cp.window}</div>
                            </div>
                          </td>
                          <td style={{...acTd,textAlign:"right"}}><span className="tnum" style={{fontWeight:700,color:navy}}>{cohort.length}</span></td>
                          <td style={{...acTd,textAlign:"right"}}><span className="tnum" style={{fontWeight:700,color:navy}}>{evalComplete}</span><span className="tnum" style={{color:tm,fontWeight:600}}>/{cohort.length}</span></td>
                          <td style={{...acTd,position:"relative",paddingRight:32}}><span className="row-arrow"><I.Chev s={14}/></span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Upcoming AC sessions */}
            <div data-tour="dash-ac" style={cardBox}>
              <SectionHead title="Assessment center" count={sessions.length} action="View all" onAction={()=>{setRoute("ac");setAcTab("campaigns");}} accent={purple} icon={I.Cal}/>
              <div style={{padding:"6px 20px 8px"}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,padding:"12px 0 14px",borderBottom:`1px solid ${bd}`}}>
                  {[
                    {v:acCampaigns.current.length, l:"Active", c:teal, ic:I.Dash},
                    {v:acCampaigns.upcoming.length, l:"Upcoming", c:orange, ic:I.Cal},
                    {v:acParticipants.length, l:"Participants", c:navy, ic:I.Users},
                  ].map((s,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:10,minWidth:0}}>
                      <span style={{width:34,height:34,borderRadius:9,background:`${s.c}14`,color:s.c,display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><s.ic s={17}/></span>
                      <div style={{minWidth:0}}>
                        <div className="tnum serif" style={{fontSize:22,fontWeight:400,color:s.c,lineHeight:1}}>{s.v}</div>
                        <div style={{fontSize:14,color:tm,marginTop:3}}>{s.l}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                {(dashSample==="3"?sessions.slice(0,3):sessions).map((s,i)=>(
                  <div key={s.id} onClick={()=>{setRoute("ac");setAcTab("campaigns");}} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 20px",borderTop:i===0?"none":`1px solid ${bd}`,cursor:"pointer",transition:"background .15s"}} onMouseEnter={e=>e.currentTarget.style.background=navyBg} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <div style={{width:34,height:34,borderRadius:8,background:purpleBg,color:purple,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><I.Cal s={16}/></div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:14,fontWeight:600,color:navy}} className="elide">{s.slot}</div>
                      <div style={{fontSize:14,color:tm,marginTop:1}}>{s.when} · {s.dur}</div>
                    </div>
                    <span style={{color:tm,display:"flex",flexShrink:0}}><I.Chev s={13}/></span>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div data-tour="dash-avail" style={{...cardBox,gridColumn:isNarrow?"auto":"1 / -1",order:2}}>
              <SectionHead title="Your availability" count={avails.length||null} action="Manage" onAction={()=>setRoute("avail")} accent={gold} icon={I.User}/>
              {avails.length===0 ? (
                <div style={{padding:"26px 20px",textAlign:"center"}}>
                  <div style={{color:tm,marginBottom:8}}><I.Cal s={24}/></div>
                  <div style={{fontSize:14,fontWeight:700,color:navy,marginBottom:3}}>No availability set</div>
                  <div style={{fontSize:14,color:tm,marginBottom:16,lineHeight:1.55}}>Add a schedule so campaigns know when you can assess.</div>
                  <button onClick={()=>setRoute("avail")} className="btn btn-primary" style={{padding:"8px 18px"}}>+ Add availability</button>
                </div>
              ) : (
                <div>
                  {avails.map((a,i)=>(
                    <div key={a.id} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 20px",borderTop:i===0?"none":`1px solid ${bd}`}}>
                      <div style={{width:34,height:34,borderRadius:8,background:navyBg,color:navy,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><I.Cal s={16}/></div>
                      <div style={{minWidth:0}}>
                        <div style={{fontSize:14,fontWeight:700,color:navy}} className="elide">{fmtDate(a.start)||"—"} – {fmtDate(a.end)||"—"}</div>
                        <div style={{fontSize:14,color:tm,marginTop:1}} className="elide">{daySummary(a.active)} · {a.tz}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AC participants */}
            <div data-tour="dash-participants" style={{...cardBox,order:1}}>
              <SectionHead title="Participants" count={acParticipants.length} action="View all" onAction={()=>{setRoute("ac");setAcTab("participants");}} accent={teal} icon={I.Users}/>
              <div>
                <table style={{width:"100%",borderCollapse:"collapse",tableLayout:"fixed"}}>
                  <colgroup><col style={{width:"52%"}}/><col style={{width:"18%"}}/><col style={{width:"24%"}}/><col style={{width:"6%"}}/></colgroup>
                  <thead><tr>{acTh("Participant")}{acTh("Slot")}{acTh("Scheduling status")}{acTh("")}</tr></thead>
                  <tbody>
                    {(dashSample==="3"?acParticipants.slice(0,3):acParticipants).map((p)=>(
                      <tr key={p.id} className="rh" onClick={()=>{setRoute("ac");setAcTab("participants");}} style={{cursor:"pointer"}}>
                        <td style={acTd}>
                          <div style={{display:"flex",alignItems:"center",gap:12,minWidth:0}}>
                            <div style={{width:34,height:34,borderRadius:17,background:p.color,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,flexShrink:0,fontFamily:f}}>{p.name.split(" ").map(n=>n[0]).slice(0,2).join("").toUpperCase()}</div>
                            <div style={{minWidth:0}}>
                              <div style={{fontWeight:600,color:tx,fontSize:14}} className="elide">{p.name}</div>
                              <div style={{fontSize:14,color:tm}} className="elide">{p.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{...acTd,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.slot}</td>
                        <td style={acTd}><span className="tag" style={{background:`${teal}14`,color:teal}}>{p.schStatus}</span></td>
                        <td style={{...acTd,position:"relative",paddingRight:26}}><span className="row-arrow"><I.Chev s={14}/></span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {dashSample==="2" && <Sample2/>}
      </div>
    );
  };

  // ═══════ RENDER ═══════
  const body = () => {
    if (route === "home") return <HomeDashboard/>;
    if (route === "dashboard") return <Dashboard/>;
    if (route === "campaign") return <CampaignDetail/>;
    if (route === "candidate") return <CandidateDetail/>;
    if (route === "evaluate") return <Evaluate/>;
    if (route === "moderate") return <Moderate/>;
    if (route === "ac") return <AssessmentCenter/>;
    if (route === "acCampaign") return <ACampaignDetail/>;
    if (route === "avail") return <Availability/>;
    return null;
  };

  const ReportReaderModal = ({report, onClose}) => {
    const [page, setPage] = useState(0);
    const [zoom, setZoom] = useState(1);
    if (!report) return null;
    const pages = report.pages || 4;
    const RPT_THUMB2 = [navy, teal, "#8F20DE", "#CB7E03", "#0B4BFF", "#2E7D5B"];
    const PageBody = ({i}) => i===0 ? (
      <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
        <div style={{width:64,height:64,borderRadius:br,background:RPT_THUMB2[0],display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",marginBottom:32}}><LighthouseLogo s={30} c="#fff"/></div>
        <div style={{fontSize:14,color:teal,fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",marginBottom:14}}>{report.type}</div>
        <h1 style={{fontSize:34,fontWeight:400,fontFamily:serif,color:navy,lineHeight:1.2,marginBottom:16}}>{report.name}</h1>
        <div style={{fontSize:14,color:tm}}>Prepared for {candidates.find(x=>x.id===subjectId)?.name || "Candidate"}</div>
        <div style={{marginTop:"auto",fontSize:14,color:tm}}>Marsh · Confidential</div>
      </div>
    ) : (
      <div>
        <p className="eyebrow" style={{marginBottom:10}}>Section {i}</p>
        <h2 style={{fontSize:22,fontWeight:400,fontFamily:serif,color:navy,marginBottom:18}}>{["Executive Summary","Competency Profile","Behavioural Evidence","Development Priorities","Appendix"][(i-1)%5]}</h2>
        {[1,2,3].map(p => <div key={p} style={{height:11,borderRadius:6,background:bg2,marginBottom:12,width:p===3?"70%":"100%"}}/>)}
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:16,marginTop:22}}>
          {[1,2].map(b => <div key={b} style={{border:`1px solid ${bd}`,borderRadius:br,padding:16,height:100}}><div style={{height:9,width:"50%",background:bg2,borderRadius:5,marginBottom:10}}/><div style={{height:9,width:"80%",background:bg2,borderRadius:5}}/></div>)}
        </div>
      </div>
    );
    return (
      <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,15,71,.55)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",padding:28}}>
        <div onClick={e=>e.stopPropagation()} style={{background:card,borderRadius:18,width:"100%",height:"100%",maxWidth:1400,display:"flex",flexDirection:"column",overflow:"hidden",boxShadow:"0 30px 80px rgba(0,15,71,.4)"}}>
          <div style={{display:"flex",alignItems:"center",gap:14,padding:"16px 22px",borderBottom:`1px solid ${bd}`,flexShrink:0}}>
            <div style={{width:38,height:38,borderRadius:10,background:navy,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><I.Report s={18}/></div>
            <div style={{flex:1,minWidth:0}}>
              <div className="elide" style={{fontSize:15,fontWeight:700,color:navy}}>{report.name}</div>
              <div style={{fontSize:14,color:tm}}>Page {page+1} of {pages}</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:2,border:`1px solid ${bd}`,borderRadius:9,padding:3,flexShrink:0}}>
              <button onClick={()=>setZoom(z=>Math.max(0.5,Math.round((z-.25)*100)/100))} disabled={zoom<=0.5} style={{width:28,height:28,borderRadius:7,border:"none",background:"transparent",color:zoom<=0.5?"rgba(0,15,71,.25)":navy,cursor:zoom<=0.5?"default":"pointer",fontSize:18,lineHeight:1}}>−</button>
              <span className="tnum" style={{fontSize:14,fontWeight:600,color:navy,minWidth:44,textAlign:"center"}}>{Math.round(zoom*100)}%</span>
              <button onClick={()=>setZoom(z=>Math.min(2,Math.round((z+.25)*100)/100))} disabled={zoom>=2} style={{width:28,height:28,borderRadius:7,border:"none",background:"transparent",color:zoom>=2?"rgba(0,15,71,.25)":navy,cursor:zoom>=2?"default":"pointer",fontSize:17,lineHeight:1}}>+</button>
            </div>
            <button onClick={()=>showToast("Downloading PDF…")} className="btn btn-secondary" style={{flexShrink:0}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14"/></svg> Download PDF</button>
            <button onClick={onClose} style={{width:34,height:34,borderRadius:9,border:`1px solid ${bd}`,background:card,color:tm,cursor:"pointer",fontSize:18,flexShrink:0}}>×</button>
          </div>
          <div style={{flex:1,display:"flex",minHeight:0}}>
            <div style={{width:96,flexShrink:0,borderRight:`1px solid ${bd}`,overflowY:"auto",padding:"12px 0",display:"flex",flexDirection:"column",gap:8,alignItems:"center",background:sbBg}}>
              {Array.from({length:pages}).map((_,i) => (
                <button key={i} onClick={()=>setPage(i)} style={{width:56,height:74,borderRadius:5,border:i===page?`2px solid ${teal}`:`1px solid ${bd}`,background:card,cursor:"pointer",padding:6,flexShrink:0,position:"relative",overflow:"hidden"}}>
                  <div style={{width:8,height:8,borderRadius:4,background:RPT_THUMB2[i%RPT_THUMB2.length],position:"absolute",top:4,left:4}}/>
                  <span style={{position:"absolute",bottom:2,right:4,fontSize:14,color:tm}}>{i+1}</span>
                </button>
              ))}
            </div>
            <div style={{flex:1,overflow:"auto",background:sbBg,display:"flex",justifyContent:"center",padding:28}}>
              <div style={{width:"100%",maxWidth:600,minHeight:780,zoom:zoom,background:card,borderRadius:4,boxShadow:"0 6px 30px rgba(0,15,71,.14)",padding:"56px 60px",flexShrink:0}}>
                <PageBody i={page}/>
              </div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,padding:"12px 22px",borderTop:`1px solid ${bd}`,flexShrink:0}}>
            <button onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0} className="btn btn-ghost" style={{padding:8}}><I.Chev s={15} r={180}/></button>
            <span className="tnum" style={{fontSize:14,color:tm}}>{page+1} / {pages}</span>
            <button onClick={()=>setPage(p=>Math.min(pages-1,p+1))} disabled={page===pages-1} className="btn btn-ghost" style={{padding:8}}><I.Chev s={15}/></button>
          </div>
        </div>
      </div>
    );
  };

  const immersive = route==="evaluate" || route==="moderate";
  return (
    <div style={{height:"100vh",display:"flex",flexDirection:"column",background:bg}}>
      <style>{css}</style>
      <div style={{flex:1,display:"flex",minHeight:0,position:"relative"}}>
        {!immersive && <Sidebar/>}
        {!immersive && <button onClick={()=>setSidebarOpen(!sidebarOpen)} title={sidebarOpen?"Collapse menu":"Expand menu"} style={{position:"absolute",top:30,left:(sidebarOpen?256:72)-14,zIndex:30,width:28,height:28,borderRadius:14,background:card,border:`1px solid ${bdStrong}`,color:navy,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:"0 2px 8px rgba(0,15,71,.12)",transition:"left .2s ease"}}><I.Chev s={15} r={sidebarOpen?180:0}/></button>}
        <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>
          {!immersive && <TopBar/>}
          <main className="no-sb" style={{flex:1,overflow:immersive?"hidden":"auto",background:bg}}>
            {body()}
          </main>
        </div>
      </div>
      {route==="home" && (
        <div style={{position:"fixed",right:24,bottom:24,zIndex:1200,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:10}}>
          {sampleMenuOpen && (
            <div style={{background:card,border:`1px solid ${bd}`,borderRadius:12,boxShadow:"0 16px 44px rgba(0,15,71,.20)",padding:6,minWidth:220}}>
              <div style={{fontSize:14,fontWeight:800,letterSpacing:.6,textTransform:"uppercase",color:tm,padding:"8px 12px 6px"}}>Dashboard layout</div>
              {[{k:"1",l:"Sample 1 · Dense grid"},{k:"2",l:"Sample 2 · Equal cards, no scroll"},{k:"3",l:"Sample 3 · Compact (3 rows each)"}].map(o=>(
                <button key={o.k} onClick={()=>{setDashSample(o.k);setSampleMenuOpen(false);}} style={{display:"flex",alignItems:"center",gap:8,width:"100%",textAlign:"left",padding:"10px 12px",borderRadius:8,background:dashSample===o.k?navyBg:"transparent",cursor:"pointer",fontSize:14,fontWeight:dashSample===o.k?700:500,color:navy}}>
                  <span style={{width:16,display:"inline-flex",justifyContent:"center",color:teal}}>{dashSample===o.k?<I.Check s={13}/>:null}</span>{o.l}
                </button>
              ))}
            </div>
          )}
          <button onClick={()=>setSampleMenuOpen(v=>!v)} title="Dashboard layouts" style={{width:52,height:52,borderRadius:26,background:navy,color:"#fff",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 10px 30px rgba(0,15,71,.30)"}}><I.Dash s={20}/></button>
        </div>
      )}
      {toast && (
        <div className="an" style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",background:navy,color:"#fff",padding:"12px 20px",borderRadius:br,fontSize:14,fontWeight:600,boxShadow:"0 8px 32px rgba(0,0,0,.2)",zIndex:1000,display:"flex",alignItems:"center",gap:10}}>
          <I.Check s={14} style={{color:"#4ADE80"}}/> {toast}
        </div>
      )}
      <ReportReaderModal report={openReport} onClose={()=>setOpenReport(null)}/>
    </div>
  );
}
window.AssessorEditorial = AssessorEditorial;
