import { useState, useEffect, useRef } from "react";

const SCANS = [
  { id:1, name:"api.fenrir-security.com", type:"DAST", status:"Completed", progress:100, critical:3, high:7, medium:12, low:5, lastScan:"2 hrs ago" },
  { id:2, name:"dashboard.internal", type:"SAST", status:"Completed", progress:100, critical:0, high:2, medium:8, low:14, lastScan:"5 hrs ago" },
  { id:3, name:"auth-service:8080", type:"DAST", status:"Failed", progress:47, critical:1, high:0, medium:3, low:0, lastScan:"1 day ago" },
  { id:4, name:"payments.fenrir.io", type:"DAST", status:"Scheduled", progress:0, critical:0, high:0, medium:0, low:0, lastScan:"—" },
  { id:5, name:"cdn-edge-nodes", type:"Network", status:"Completed", progress:100, critical:0, high:1, medium:4, low:9, lastScan:"3 days ago" },
  { id:6, name:"admin-portal.fenrir", type:"SAST", status:"Completed", progress:100, critical:2, high:5, medium:6, low:3, lastScan:"4 days ago" },
];

const LOG_ENTRIES = [
  { time:"14:32:01", msg:"Initializing spider on", hl:"https://api.fenrir-security.com", sfx:"", c:"#0CC8A8" },
  { time:"14:32:03", msg:"Discovered endpoint", hl:"/api/v1/auth/login", sfx:" [POST]", c:"#0CC8A8" },
  { time:"14:32:05", msg:"Discovered endpoint", hl:"/api/v1/users/{id}", sfx:" [GET, PUT, DELETE]", c:"#0CC8A8" },
  { time:"14:32:08", msg:"Testing injection vectors on", hl:"/api/v1/auth/login", sfx:"", c:"#0CC8A8" },
  { time:"14:32:11", msg:"⚠ Potential SQLi at param", hl:"username", sfx:" — confirming...", c:"#fb923c" },
  { time:"14:32:14", msg:"✓ Confirmed SQL Injection", hl:"CVE-2024-3891", sfx:" — CRITICAL", c:"#f87171" },
  { time:"14:32:17", msg:"Fuzzing headers:", hl:"Authorization, X-API-Key", sfx:"", c:"#0CC8A8" },
  { time:"14:32:20", msg:"Testing IDOR on", hl:"/api/v1/users/{id}", sfx:" — 240 permutations", c:"#0CC8A8" },
  { time:"14:32:25", msg:"⚠ IDOR on", hl:"/api/v1/users/1337", sfx:"", c:"#fb923c" },
  { time:"14:32:29", msg:"Mapping JS bundles for secrets...", hl:"", sfx:"", c:"#71717a" },
  { time:"14:32:33", msg:"✓ AWS key exposed in", hl:"main.bundle.js:4892", sfx:"", c:"#f87171" },
  { time:"14:32:38", msg:"Running validation loop...", hl:"", sfx:"", c:"#71717a" },
];

const FINDINGS = [
  { id:1, sev:"Critical", time:"14:32:14", title:"SQL Injection via Login Parameter", ep:"/api/v1/auth/login", desc:"Unsanitized username field enables stacked queries — full DB read/write." },
  { id:2, sev:"Critical", time:"14:32:33", title:"Exposed AWS Credentials in JS Bundle", ep:"main.bundle.js:4892", desc:"AWS_SECRET_ACCESS_KEY and AWS_ACCESS_KEY_ID embedded in frontend bundle." },
  { id:3, sev:"High",     time:"14:32:25", title:"Insecure Direct Object Reference", ep:"/api/v1/users/{id}", desc:"Authenticated users can read any user record by enumerating integer IDs." },
  { id:4, sev:"High",     time:"14:32:44", title:"Missing Rate Limiting on Auth", ep:"/api/v1/auth/login", desc:"No rate limiting allows brute-force credential stuffing at scale." },
  { id:5, sev:"Medium",   time:"14:32:51", title:"Verbose Error Messages Exposed", ep:"/api/v1/users/me", desc:"Stack traces and DB schema info returned in production 500 responses." },
];

const SEV = {
  Critical:{ bg:"rgba(239,68,68,.12)", text:"#f87171", border:"rgba(239,68,68,.28)", dot:"#ef4444" },
  High:    { bg:"rgba(249,115,22,.12)", text:"#fb923c", border:"rgba(249,115,22,.28)", dot:"#f97316" },
  Medium:  { bg:"rgba(245,158,11,.12)", text:"#fbbf24", border:"rgba(245,158,11,.28)", dot:"#f59e0b" },
  Low:     { bg:"rgba(16,185,129,.12)", text:"#34d399", border:"rgba(16,185,129,.28)", dot:"#10b981" },
};

const STATUS = {
  Completed:{ bg:"rgba(16,185,129,.1)", text:"#34d399", border:"rgba(16,185,129,.25)" },
  Failed:   { bg:"rgba(239,68,68,.1)", text:"#f87171", border:"rgba(239,68,68,.25)" },
  Scheduled:{ bg:"rgba(113,113,122,.1)", text:"#a1a1aa", border:"rgba(113,113,122,.25)" },
};

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300..800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; }
  body { font-family: 'DM Sans', system-ui, sans-serif; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 99px; }
  input, button { font-family: inherit; }
  button { cursor: pointer; border: none; background: none; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes spin { to { transform: rotate(360deg); } }
  .fade-up { animation: fadeUp .3s ease forwards; }
  .blink { animation: blink 1s step-end infinite; }
  .spin { animation: spin .7s linear infinite; }
`;

const T = (dark) => ({
  bg:      dark ? "#0F0F11" : "#F2F2F5",
  surface: dark ? "#111113" : "#FFFFFF",
  border:  dark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.08)",
  text:    dark ? "#F5F5F5" : "#111111",
  muted:   dark ? "#71717A" : "#71717A",
  input:   dark ? "rgba(255,255,255,.04)" : "#F8F9FB",
  console: dark ? "#080809" : "#0F0F0F",
});

function Badge({ sev }) {
  const s = SEV[sev];
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"2px 8px",
      borderRadius:6, background:s.bg, color:s.text, border:`1px solid ${s.border}`,
      fontSize:11, fontWeight:800, lineHeight:1.6 }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:s.dot }} />{sev}
    </span>
  );
}

function Toast({ msg, hide }) {
  useEffect(() => { const t = setTimeout(hide, 3000); return () => clearTimeout(t); }, [hide]);
  return (
    <div className="fade-up" style={{ position:"fixed", bottom:24, right:24, zIndex:9999,
      padding:"11px 18px", borderRadius:14, background:"#0CC8A8", color:"#000",
      fontWeight:800, fontSize:13, boxShadow:"0 8px 32px rgba(12,200,168,.35)" }}>
      ✓ {msg}
    </div>
  );
}

const NAV_ITEMS = [
  { icon:"⊞", label:"Dashboard" }, { icon:"▤", label:"Projects" },
  { icon:"⟳", label:"Scans" }, { icon:"◷", label:"Schedule" },
  { icon:"🔔", label:"Notifications", badge:3 },
  { icon:"⚙", label:"Settings" }, { icon:"?", label:"Support" },
];

function Sidebar({ active, setActive, dark, setDark, onClose }) {
  const t = T(dark);
  const btn = (isActive) => ({
    width:"100%", display:"flex", alignItems:"center", gap:10,
    padding:"8px 12px", borderRadius:10, marginBottom:2,
    background: isActive ? "rgba(12,200,168,.1)" : "transparent",
    color: isActive ? "#0CC8A8" : t.muted,
    fontSize:13, fontWeight: isActive ? 700 : 500, textAlign:"left", transition:"all .15s"
  });
  return (
    <div style={{ width:220, height:"100%", display:"flex", flexDirection:"column",
      background:t.surface, borderRight:`1px solid ${t.border}`, transition:"background .2s" }}>
      <div style={{ padding:"18px 18px 14px", borderBottom:`1px solid ${t.border}`,
        display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:32, height:32, borderRadius:10, background:"#0CC8A8", flexShrink:0,
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
          </svg>
        </div>
        <span style={{ fontWeight:800, fontSize:13, color:t.text, letterSpacing:"-0.02em" }}>Fenrir Security</span>
        {onClose && <button onClick={onClose} style={{ marginLeft:"auto", color:t.muted, fontSize:18 }}>✕</button>}
      </div>

      <nav style={{ flex:1, padding:"10px 10px", overflowY:"auto" }}>
        {NAV_ITEMS.map(({ icon, label, badge }) => (
          <button key={label} style={btn(active===label)}
            onClick={() => { setActive(label); onClose?.(); }}
            onMouseEnter={e => { if(active!==label){ e.currentTarget.style.background=dark?"rgba(255,255,255,.05)":"rgba(0,0,0,.04)"; e.currentTarget.style.color=t.text; }}}
            onMouseLeave={e => { if(active!==label){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=t.muted; }}}>
            <span style={{ fontSize:15, width:18, textAlign:"center" }}>{icon}</span>
            {label}
            {badge && <span style={{ marginLeft:"auto", width:18, height:18, borderRadius:"50%", background:"#0CC8A8", color:"#000", fontSize:10, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center" }}>{badge}</span>}
          </button>
        ))}
      </nav>

      <div style={{ padding:"6px 10px", borderTop:`1px solid ${t.border}` }}>
        <button style={{ ...btn(false), color:t.muted }}
          onClick={() => setDark(!dark)}
          onMouseEnter={e => { e.currentTarget.style.background=dark?"rgba(255,255,255,.05)":"rgba(0,0,0,.04)"; }}
          onMouseLeave={e => { e.currentTarget.style.background="transparent"; }}>
          <span style={{ fontSize:15, width:18, textAlign:"center" }}>{dark?"☀":"☽"}</span>
          {dark?"Light Mode":"Dark Mode"}
        </button>
      </div>

      <div style={{ padding:"12px 16px", borderTop:`1px solid ${t.border}`,
        display:"flex", alignItems:"center", gap:10 }}>
        <div style={{ width:30, height:30, borderRadius:"50%", background:"linear-gradient(135deg,#0CC8A8,#0891b2)",
          display:"flex", alignItems:"center", justifyContent:"center", color:"#000", fontSize:11, fontWeight:800, flexShrink:0 }}>AK</div>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ fontSize:12, fontWeight:700, color:t.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>Arjun Kumar</p>
          <p style={{ fontSize:10, color:t.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>arjun@fenrir.io</p>
        </div>
      </div>
    </div>
  );
}

// ── LOGIN ──────────────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [f, setF] = useState({ first:"", last:"", email:"", password:"", terms:false });
  const [loading, setLoading] = useState(false);
  const inp = (extra={}) => ({
    width:"100%", padding:"10px 14px", borderRadius:12,
    border:"1px solid rgba(0,0,0,.1)", background:"#F9FAFB",
    color:"#111", fontSize:13, outline:"none", fontFamily:"inherit",
    transition:"border-color .2s, box-shadow .2s", ...extra
  });
  const focus = e => { e.target.style.borderColor="#0CC8A8"; e.target.style.boxShadow="0 0 0 3px rgba(12,200,168,.15)"; };
  const blur  = e => { e.target.style.borderColor="rgba(0,0,0,.1)"; e.target.style.boxShadow="none"; };

  return (
    <div style={{ minHeight:"100vh", display:"flex" }}>
      {/* LEFT PANEL */}
      <div style={{ width:"55%", background:"#09090C", padding:48, display:"flex",
        flexDirection:"column", justifyContent:"space-between", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0,
          background:"radial-gradient(ellipse 70% 55% at 10% 85%,rgba(12,200,168,.18) 0%,transparent 55%), radial-gradient(ellipse 55% 45% at 88% 12%,rgba(12,200,168,.1) 0%,transparent 55%)" }}/>
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:52 }}>
            <div style={{ width:40, height:40, borderRadius:12, background:"#0CC8A8", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
              </svg>
            </div>
            <span style={{ fontWeight:800, fontSize:16, color:"#fff", letterSpacing:"-0.03em" }}>Fenrir Security</span>
          </div>
          <h1 style={{ fontSize:40, fontWeight:900, color:"#fff", lineHeight:1.2, letterSpacing:"-0.04em", marginBottom:16 }}>
            Attack surface,<br/><span style={{ color:"#0CC8A8" }}>fully mapped.</span>
          </h1>
          <p style={{ color:"#52525b", fontSize:15, marginBottom:44, maxWidth:320, lineHeight:1.65 }}>
            Autonomous scanning that finds what others miss. Security without the noise.
          </p>
          {[
            { icon:"⚡", t:"AI-Powered Scanning", d:"Parallel sub-agents test every vector simultaneously" },
            { icon:"🔍", t:"Live Console", d:"Watch vulnerabilities surface in real time" },
            { icon:"📊", t:"Risk Prioritization", d:"CVSS-calibrated severity — fix what matters first" },
          ].map(({ icon, t, d }) => (
            <div key={t} style={{ display:"flex", alignItems:"flex-start", gap:14, padding:"14px 16px", borderRadius:16,
              background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.05)", marginBottom:10 }}>
              <span style={{ fontSize:22 }}>{icon}</span>
              <div>
                <p style={{ color:"#fff", fontSize:13, fontWeight:700 }}>{t}</p>
                <p style={{ color:"#52525b", fontSize:12, marginTop:2 }}>{d}</p>
              </div>
            </div>
          ))}
        </div>
        <p style={{ position:"relative", zIndex:1, color:"#3f3f46", fontSize:11 }}>© 2025 Fenrir Security Private Limited</p>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", background:"#fff", padding:32 }}>
        <div style={{ width:"100%", maxWidth:340 }}>
          <h2 style={{ fontSize:26, fontWeight:900, color:"#111", letterSpacing:"-0.04em", marginBottom:6 }}>Create your account</h2>
          <p style={{ color:"#71717a", fontSize:13, marginBottom:26 }}>14-day free trial. No credit card required.</p>

          <form onSubmit={e => { e.preventDefault(); setLoading(true); setTimeout(() => { setLoading(false); onLogin(); }, 900); }}>
            <div style={{ display:"flex", gap:12, marginBottom:14 }}>
              {[["First","first","Arjun"],["Last","last","Kumar"]].map(([label,key,ph]) => (
                <div key={key} style={{ flex:1 }}>
                  <label style={{ fontSize:10, fontWeight:800, color:"#71717a", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.08em" }}>{label}</label>
                  <input style={inp()} placeholder={ph} value={f[key]} onChange={e=>setF({...f,[key]:e.target.value})} onFocus={focus} onBlur={blur}/>
                </div>
              ))}
            </div>
            {[["Work Email","email","email","arjun@company.com"],["Password","password","password","Min. 8 characters"]].map(([label,key,type,ph]) => (
              <div key={key} style={{ marginBottom:14 }}>
                <label style={{ fontSize:10, fontWeight:800, color:"#71717a", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.08em" }}>{label}</label>
                <input type={type} style={inp()} placeholder={ph} value={f[key]} onChange={e=>setF({...f,[key]:e.target.value})} onFocus={focus} onBlur={blur}/>
              </div>
            ))}
            <label style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:18, cursor:"pointer" }}>
              <input type="checkbox" style={{ marginTop:2, accentColor:"#0CC8A8" }} checked={f.terms} onChange={e=>setF({...f,terms:e.target.checked})}/>
              <span style={{ fontSize:12, color:"#71717a", lineHeight:1.5 }}>
                I agree to the <a href="#" style={{ color:"#0CC8A8" }}>Terms of Service</a> and <a href="#" style={{ color:"#0CC8A8" }}>Privacy Policy</a>
              </span>
            </label>
            <button type="submit" style={{ width:"100%", padding:"11px", borderRadius:12, background:"#0CC8A8",
              color:"#000", fontWeight:900, fontSize:14, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}
              onMouseEnter={e=>e.currentTarget.style.background="#0ab899"} onMouseLeave={e=>e.currentTarget.style.background="#0CC8A8"}>
              {loading
                ? <span className="spin" style={{ width:16, height:16, borderRadius:"50%", border:"2.5px solid rgba(0,0,0,.2)", borderTopColor:"#000", display:"inline-block" }}/>
                : "Create account →"}
            </button>
          </form>

          <div style={{ display:"flex", alignItems:"center", gap:12, margin:"18px 0" }}>
            <div style={{ flex:1, height:1, background:"rgba(0,0,0,.07)" }}/><span style={{ fontSize:11, color:"#a1a1aa", fontWeight:600 }}>or continue with</span><div style={{ flex:1, height:1, background:"rgba(0,0,0,.07)" }}/>
          </div>
          <div style={{ display:"flex", gap:10, marginBottom:18 }}>
            {["Apple","Google","Meta"].map(p => (
              <button key={p} onClick={onLogin} style={{ flex:1, padding:"9px 0", borderRadius:12, border:"1px solid rgba(0,0,0,.08)", background:"#fff", color:"#374151", fontSize:12, fontWeight:700 }}
                onMouseEnter={e=>e.currentTarget.style.background="#f9fafb"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}>{p}</button>
            ))}
          </div>
          <p style={{ textAlign:"center", fontSize:12, color:"#a1a1aa" }}>
            Already have an account? <button onClick={onLogin} style={{ color:"#0CC8A8", fontWeight:700, fontSize:12 }}>Sign in</button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── DASHBOARD ──────────────────────────────────────────────────────────────────
function Dashboard({ dark, onScan, toast }) {
  const [search, setSearch] = useState("");
  const t = T(dark);
  const filtered = SCANS.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.type.toLowerCase().includes(search.toLowerCase()));
  const STATS = [
    { label:"Critical", val:6, delta:"+2 this week", up:true, color:"#f87171" },
    { label:"High",     val:15, delta:"-3 this week", up:false, color:"#fb923c" },
    { label:"Medium",   val:33, delta:"+5 this week", up:true, color:"#fbbf24" },
    { label:"Low",      val:31, delta:"-1 this week", up:false, color:"#34d399" },
  ];

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", background:t.bg, overflowY:"auto", transition:"background .2s" }}>
      <div style={{ padding:"16px 24px", borderBottom:`1px solid ${t.border}`, background:t.surface, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <h1 style={{ fontSize:18, fontWeight:900, color:t.text, letterSpacing:"-0.03em" }}>Dashboard</h1>
          <p style={{ fontSize:12, color:t.muted, marginTop:1 }}>Fenrir Security — Org Overview</p>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:11, padding:"4px 12px", borderRadius:20, border:`1px solid ${t.border}`, color:t.muted }}>Workspace: <strong style={{ color:"#0CC8A8" }}>Fenrir-Prod</strong></span>
          <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg,#0CC8A8,#0891b2)", display:"flex", alignItems:"center", justifyContent:"center", color:"#000", fontSize:11, fontWeight:800 }}>AK</div>
        </div>
      </div>

      <div style={{ padding:"20px 24px", flex:1 }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:14, marginBottom:20 }}>
          {STATS.map(({ label, val, delta, up, color }) => (
            <div key={label} className="fade-up" style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:18, padding:"18px 20px" }}>
              <p style={{ fontSize:10, fontWeight:800, color:t.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8 }}>{label}</p>
              <p style={{ fontSize:34, fontWeight:900, color, letterSpacing:"-0.04em" }}>{val}</p>
              <p style={{ fontSize:11, color:up?"#f87171":"#34d399", marginTop:4, fontWeight:600 }}>{delta}</p>
            </div>
          ))}
        </div>

        <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:18, overflow:"hidden" }}>
          <div style={{ padding:"12px 16px", borderBottom:`1px solid ${t.border}`, display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, flex:1, minWidth:150, padding:"8px 12px", borderRadius:10, border:`1px solid ${t.border}`, background:t.input }}>
              <span style={{ color:t.muted }}>⌕</span>
              <input style={{ background:"transparent", border:"none", outline:"none", fontSize:13, color:t.text, width:"100%", fontFamily:"inherit" }}
                placeholder="Search scans..." value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
            {["Filter","Columns"].map(l => (
              <button key={l} onClick={()=>toast(`${l} panel coming soon`)}
                style={{ padding:"8px 14px", borderRadius:10, border:`1px solid ${t.border}`, color:t.muted, fontSize:12, fontWeight:600 }}
                onMouseEnter={e=>e.currentTarget.style.color="#0CC8A8"} onMouseLeave={e=>e.currentTarget.style.color=t.muted}>{l}</button>
            ))}
            <button onClick={()=>toast("New scan initiated! 🚀")}
              style={{ padding:"8px 18px", borderRadius:10, background:"#0CC8A8", color:"#000", fontSize:12, fontWeight:900, marginLeft:"auto" }}
              onMouseEnter={e=>e.currentTarget.style.background="#0ab899"} onMouseLeave={e=>e.currentTarget.style.background="#0CC8A8"}>+ New Scan</button>
          </div>

          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr>
                  {["Scan Name","Type","Status","Progress","Vuln Count","Last Scan"].map(h=>(
                    <th key={h} style={{ textAlign:"left", padding:"9px 16px", borderBottom:`1px solid ${t.border}`, color:t.muted, fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:"0.06em", whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => {
                  const ss = STATUS[s.status];
                  return (
                    <tr key={s.id} onClick={()=>onScan(s)}
                      style={{ borderBottom:`1px solid ${t.border}`, cursor:"pointer", transition:"background .1s" }}
                      onMouseEnter={e=>e.currentTarget.style.background=dark?"rgba(255,255,255,.025)":"rgba(0,0,0,.018)"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <td style={{ padding:"12px 16px" }}><span style={{ fontWeight:700, color:t.text, fontSize:12 }}>{s.name}</span></td>
                      <td style={{ padding:"12px 16px" }}><span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:6, background:dark?"rgba(255,255,255,.06)":"rgba(0,0,0,.05)", color:t.muted }}>{s.type}</span></td>
                      <td style={{ padding:"12px 16px" }}><span style={{ fontSize:11, fontWeight:800, padding:"3px 9px", borderRadius:7, background:ss.bg, color:ss.text, border:`1px solid ${ss.border}` }}>{s.status}</span></td>
                      <td style={{ padding:"12px 16px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <div style={{ width:64, height:5, borderRadius:99, background:dark?"rgba(255,255,255,.08)":"rgba(0,0,0,.07)", overflow:"hidden" }}>
                            <div style={{ width:`${s.progress}%`, height:"100%", background:"#0CC8A8", borderRadius:99 }}/>
                          </div>
                          <span style={{ fontSize:11, color:t.muted }}>{s.progress}%</span>
                        </div>
                      </td>
                      <td style={{ padding:"12px 16px" }}>
                        <div style={{ display:"flex", gap:4 }}>
                          {s.critical>0 && <span style={{ fontSize:11,fontWeight:800,padding:"2px 6px",borderRadius:5,background:"rgba(239,68,68,.1)",color:"#f87171" }}>{s.critical}</span>}
                          {s.high>0    && <span style={{ fontSize:11,fontWeight:800,padding:"2px 6px",borderRadius:5,background:"rgba(249,115,22,.1)",color:"#fb923c" }}>{s.high}</span>}
                          {s.medium>0  && <span style={{ fontSize:11,fontWeight:800,padding:"2px 6px",borderRadius:5,background:"rgba(245,158,11,.1)",color:"#fbbf24" }}>{s.medium}</span>}
                          {s.low>0     && <span style={{ fontSize:11,fontWeight:800,padding:"2px 6px",borderRadius:5,background:"rgba(16,185,129,.1)",color:"#34d399" }}>{s.low}</span>}
                          {!s.critical&&!s.high&&!s.medium&&!s.low && <span style={{ color:t.muted,fontSize:12 }}>—</span>}
                        </div>
                      </td>
                      <td style={{ padding:"12px 16px", color:t.muted, fontSize:12 }}>{s.lastScan}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ padding:"10px 16px", borderTop:`1px solid ${t.border}`, display:"flex", justifyContent:"space-between" }}>
            <span style={{ fontSize:11, color:t.muted }}>{filtered.length} scans</span>
            <span style={{ fontSize:11, color:t.muted }}>Page 1 of 1</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SCAN DETAIL ────────────────────────────────────────────────────────────────
function Detail({ scan, dark, onBack, toast }) {
  const [tab, setTab] = useState("Activity Log");
  const [logs, setLogs] = useState(LOG_ENTRIES.slice(0, 4));
  const [prog, setProg] = useState(0);
  const [step, setStep] = useState(0);
  const ref = useRef(null);
  const t = T(dark);
  const STEPS = ["Spidering","Mapping","Testing","Validating","Reporting"];
  const R = 52, C = 2*Math.PI*R;

  useEffect(() => {
    let i=4; const iv=setInterval(()=>{ if(i<LOG_ENTRIES.length){ setLogs(p=>[...p,LOG_ENTRIES[i]]); i++; } },1200);
    return ()=>clearInterval(iv);
  }, []);
  useEffect(()=>{ if(ref.current) ref.current.scrollTop=ref.current.scrollHeight; },[logs]);
  useEffect(()=>{ const iv=setInterval(()=>setProg(p=>{ if(p>=38){clearInterval(iv);return 38;} return p+1; }),45); return()=>clearInterval(iv); },[]);
  useEffect(()=>{ const iv=setInterval(()=>setStep(s=>s<STEPS.length-1?s+1:s),6000); return()=>clearInterval(iv); },[]);

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", background:t.bg, overflowY:"auto", transition:"background .2s" }}>
      <div style={{ padding:"14px 24px", borderBottom:`1px solid ${t.border}`, background:t.surface, display:"flex", alignItems:"center", gap:14, flexWrap:"wrap" }}>
        <button onClick={onBack} style={{ padding:"7px 12px", borderRadius:10, border:`1px solid ${t.border}`, color:t.muted, fontSize:15 }}
          onMouseEnter={e=>e.currentTarget.style.color="#0CC8A8"} onMouseLeave={e=>e.currentTarget.style.color=t.muted}>←</button>
        <div style={{ flex:1 }}>
          <h1 style={{ fontSize:15, fontWeight:900, color:t.text, letterSpacing:"-0.02em" }}>{scan?.name||"api.fenrir-security.com"}</h1>
          <p style={{ fontSize:11, color:t.muted }}>Active Scan · DAST</p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={()=>toast("Report exported 📄")} style={{ padding:"7px 14px", borderRadius:10, border:`1px solid ${t.border}`, color:t.muted, fontSize:12, fontWeight:700 }}
            onMouseEnter={e=>e.currentTarget.style.color="#0CC8A8"} onMouseLeave={e=>e.currentTarget.style.color=t.muted}>Export Report</button>
          <button onClick={()=>toast("Scan stopped ⛔")} style={{ padding:"7px 14px", borderRadius:10, border:"1px solid rgba(239,68,68,.25)", background:"rgba(239,68,68,.1)", color:"#f87171", fontSize:12, fontWeight:800 }}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(239,68,68,.18)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(239,68,68,.1)"}>Stop Scan</button>
        </div>
      </div>

      <div style={{ padding:"18px 24px", flex:1 }}>
        {/* Progress card */}
        <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:18, padding:20, marginBottom:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:24, flexWrap:"wrap" }}>
            <div style={{ position:"relative", width:110, height:110, flexShrink:0 }}>
              <svg width="110" height="110" viewBox="0 0 128 128" style={{ transform:"rotate(-90deg)" }}>
                <circle cx="64" cy="64" r={R} fill="none" stroke={dark?"rgba(255,255,255,.06)":"rgba(0,0,0,.06)"} strokeWidth="7"/>
                <circle cx="64" cy="64" r={R} fill="none" stroke="#0CC8A8" strokeWidth="7"
                  strokeDasharray={C} strokeDashoffset={C*(1-prog/100)} strokeLinecap="round"
                  style={{ transition:"stroke-dashoffset .4s ease" }}/>
              </svg>
              <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontSize:24, fontWeight:900, color:t.text, letterSpacing:"-0.04em" }}>{prog}%</span>
                <span style={{ fontSize:10, color:"#0CC8A8", fontWeight:800 }}>In Progress</span>
              </div>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", flexWrap:"wrap" }}>
                {STEPS.map((s,i)=>(
                  <div key={s} style={{ display:"flex", alignItems:"center" }}>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
                      <div style={{ width:28, height:28, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:11, fontWeight:800, transition:"all .5s",
                        background:i<step?"#0CC8A8":i===step?"rgba(12,200,168,.15)":dark?"rgba(255,255,255,.06)":"rgba(0,0,0,.06)",
                        color:i<step?"#000":i===step?"#0CC8A8":t.muted,
                        boxShadow:i===step?"0 0 0 2px #0CC8A8":"none" }}>{i<step?"✓":i+1}</div>
                      <span style={{ fontSize:10, marginTop:5, fontWeight:700, color:i===step?"#0CC8A8":t.muted }}>{s}</span>
                    </div>
                    {i<STEPS.length-1 && <div style={{ width:32, height:2, margin:"0 4px", marginBottom:14, background:i<step?"#0CC8A8":t.border, transition:"background .5s" }}/>}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display:"flex", gap:16, flexWrap:"wrap", marginTop:16, paddingTop:16, borderTop:`1px solid ${t.border}` }}>
            {[["Scan Type","DAST"],["Targets",scan?.name||"api.fenrir-security.com"],["Started At","14:32:00 UTC"],["Credentials","None"],["Files","0 attached"],["Checklists","OWASP Top 10"]].map(([k,v])=>(
              <div key={k} style={{ flex:"1 0 80px" }}>
                <p style={{ fontSize:9, fontWeight:800, color:t.muted, textTransform:"uppercase", letterSpacing:"0.08em" }}>{k}</p>
                <p style={{ fontSize:12, fontWeight:700, color:t.text, marginTop:3 }}>{v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Panels */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
          {/* Console */}
          <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:18, display:"flex", flexDirection:"column", overflow:"hidden", minHeight:340 }}>
            <div style={{ display:"flex", alignItems:"center", borderBottom:`1px solid ${t.border}` }}>
              {["Activity Log","Verification Loops"].map(s=>(
                <button key={s} onClick={()=>setTab(s)} style={{ padding:"11px 16px", fontSize:12, fontWeight:700, background:"transparent",
                  color:tab===s?"#0CC8A8":t.muted, borderBottom:`2px solid ${tab===s?"#0CC8A8":"transparent"}`, transition:"all .15s" }}>{s}</button>
              ))}
              <div style={{ marginLeft:"auto", paddingRight:14, display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ width:7, height:7, borderRadius:"50%", background:"#0CC8A8", display:"inline-block",
                  animation:"blink 1.2s ease-in-out infinite", "@keyframes blink":{"0%,100%":{opacity:1},"50%":{opacity:.4}} }}/>
                <span style={{ fontSize:10, fontWeight:900, color:"#0CC8A8", letterSpacing:"0.08em" }}>LIVE</span>
              </div>
            </div>
            <div ref={ref} style={{ flex:1, overflowY:"auto", padding:14, background:t.console,
              fontFamily:"'JetBrains Mono','Fira Code',monospace", fontSize:11, lineHeight:1.75, maxHeight:300 }}>
              {logs.map((l,i)=>(
                <div key={i} style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                  <span style={{ color:"#3f3f46", flexShrink:0 }}>{l.time}</span>
                  <span style={{ color:"#a1a1aa" }}>
                    {l.msg}{" "}
                    {l.hl && <span style={{ color:l.c }}>{l.hl}</span>}
                    {l.sfx && <span style={{ color:"#71717a" }}>{l.sfx}</span>}
                  </span>
                </div>
              ))}
              <div style={{ display:"flex", gap:10 }}>
                <span style={{ color:"#3f3f46" }}>{new Date().toTimeString().slice(0,8)}</span>
                <span className="blink" style={{ color:"#0CC8A8" }}>█</span>
              </div>
            </div>
          </div>

          {/* Findings */}
          <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:18, display:"flex", flexDirection:"column", overflow:"hidden", minHeight:340 }}>
            <div style={{ padding:"12px 16px", borderBottom:`1px solid ${t.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <p style={{ fontSize:12, fontWeight:900, color:t.text }}>Finding Log</p>
              <span style={{ fontSize:10, fontWeight:800, padding:"3px 10px", borderRadius:99, background:"rgba(239,68,68,.1)", color:"#f87171" }}>{FINDINGS.length} findings</span>
            </div>
            <div style={{ flex:1, overflowY:"auto", padding:12, maxHeight:300 }}>
              {FINDINGS.map(f=>{
                const s=SEV[f.sev];
                return (
                  <div key={f.id} style={{ padding:12, borderRadius:12, border:`1px solid ${s.border}`, background:s.bg, marginBottom:8 }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
                      <Badge sev={f.sev}/><span style={{ fontSize:10, color:t.muted }}>{f.time}</span>
                    </div>
                    <p style={{ fontSize:12, fontWeight:700, color:t.text }}>{f.title}</p>
                    <p style={{ fontSize:11, color:"#0CC8A8", fontFamily:"monospace", marginTop:3 }}>{f.ep}</p>
                    <p style={{ fontSize:11, color:t.muted, marginTop:5, lineHeight:1.55 }}>{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div style={{ background:t.surface, border:`1px solid ${t.border}`, borderRadius:14, padding:"12px 20px",
          display:"flex", alignItems:"center", gap:20, flexWrap:"wrap" }}>
          {[["Sub-agents","4 active"],["Parallel Executions","12"],["Operations","847"]].map(([l,v])=>(
            <div key={l} style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:10, fontWeight:800, color:t.muted, textTransform:"uppercase", letterSpacing:"0.06em" }}>{l}</span>
              <span style={{ fontSize:12, fontWeight:800, color:t.text }}>{v}</span>
            </div>
          ))}
          <div style={{ marginLeft:"auto", display:"flex", gap:14 }}>
            {[["#f87171","C: 2"],["#fb923c","H: 2"],["#fbbf24","M: 1"],["#34d399","L: 0"]].map(([c,l])=>(
              <span key={l} style={{ fontSize:12, fontWeight:900, color:c }}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ROOT ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("login");
  const [dark, setDark] = useState(true);
  const [nav, setNav] = useState("Scans");
  const [scan, setScan] = useState(null);
  const [toast, setToast] = useState(null);
  const [sideOpen, setSideOpen] = useState(false);
  const t = T(dark);

  if (screen === "login") return (
    <>
      <style>{GLOBAL_CSS}</style>
      <Login onLogin={()=>setScreen("dashboard")}/>
      {toast && <Toast msg={toast} hide={()=>setToast(null)}/>}
    </>
  );

  return (
    <>
      {/* <style>{GLOBAL_CSS}
        .dsk-sb{display:flex;flex-shrink:0;width:220px}
        .mob-bar{display:none;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid ${t.border};background:${t.surface}}
        @media(max-width:768px){.dsk-sb{display:none!important}.mob-bar{display:flex!important}}
        .panels{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        @media(max-width:900px){.panels{grid-template-columns:1fr}}
      </style> */}
      <div style={{ display:"flex", height:"100vh", overflow:"hidden", fontFamily:"'DM Sans',system-ui,sans-serif" }}>
        {sideOpen && (
          <div style={{ position:"fixed", inset:0, zIndex:50, display:"flex" }}>
            <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.6)" }} onClick={()=>setSideOpen(false)}/>
            <div style={{ position:"relative", zIndex:51 }}>
              <Sidebar active={nav} setActive={setNav} dark={dark} setDark={setDark} onClose={()=>setSideOpen(false)}/>
            </div>
          </div>
        )}
        <div className="dsk-sb"><Sidebar active={nav} setActive={setNav} dark={dark} setDark={setDark}/></div>
        <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
          <div className="mob-bar">
            <button onClick={()=>setSideOpen(true)} style={{ color:t.muted, fontSize:20 }}>☰</button>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:26, height:26, borderRadius:8, background:"#0CC8A8", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
                </svg>
              </div>
              <span style={{ fontWeight:800, fontSize:13, color:t.text }}>Fenrir Security</span>
            </div>
          </div>
          {screen==="dashboard" && <Dashboard dark={dark} onScan={s=>{setScan(s);setScreen("detail");}} toast={setToast}/>}
          {screen==="detail"    && <Detail scan={scan} dark={dark} onBack={()=>setScreen("dashboard")} toast={setToast}/>}
        </div>
      </div>
      {toast && <Toast msg={toast} hide={()=>setToast(null)}/>}
    </>
  );
}