import React from 'react'
  
const NAV_ITEMS = [
  { label:"Dashboard",     badge:null,
    icon:<svg style={{width:16,height:16}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg> },
  { label:"Projects",      badge:null,
    icon:<svg style={{width:16,height:16}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg> },
  { label:"Scans",         badge:null,
    icon:<svg style={{width:16,height:16}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg> },
  { label:"Schedule",      badge:null,
    icon:<svg style={{width:16,height:16}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg> },
  { label:"Notifications", badge:3,
    icon:<svg style={{width:16,height:16}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg> },
  { label:"Settings",      badge:null,
    icon:<svg style={{width:16,height:16}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg> },
  { label:"Support",       badge:null,
    icon:<svg style={{width:16,height:16}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
];


function Sidebar({ active, setActive, dark, setDark, onClose }) {

     const surface = dark ? "#111113" : "#ffffff";
  const border  = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";
  const textMain = dark ? "#F5F5F5" : "#111111";
  const muted   = "#71717A";


  return (
    
    <div style={{ width:220, height:"100%", display:"flex", flexDirection:"column",
      background:surface, borderRight:`1px solid ${border}`, transition:"background .2s, border-color .2s" }}>

      {/* ── Logo ── */}
      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"18px 16px 14px",
        borderBottom:`1px solid ${border}` }}>
        <div style={{ width:32, height:32, borderRadius:10, background:"#0CC8A8", flexShrink:0,
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
          </svg>
        </div>
        <span style={{ fontWeight:800, fontSize:13, color:textMain, letterSpacing:"-0.02em" }}>aps</span>
        {onClose && (
          <button onClick={onClose} style={{ marginLeft:"auto", color:muted, fontSize:18, lineHeight:1, background:"none", border:"none", cursor:"pointer" }}>✕</button>
        )}
      </div>

      {/* ── Nav Items ── */}
      <nav style={{ flex:1, padding:"10px", overflowY:"auto" }}>
        {NAV_ITEMS.map(({ label, icon, badge }) => {
          const isActive = active === label;
          return (
            <button key={label} onClick={() => { setActive(label); onClose?.(); }}
              style={{
                width:"100%", display:"flex", alignItems:"center", gap:10,
                padding:"8px 12px", borderRadius:10, marginBottom:2,
                background: isActive ? "rgba(12,200,168,0.1)" : "transparent",
                color: isActive ? "#0CC8A8" : muted,
                fontSize:13, fontWeight: isActive ? 700 : 500, textAlign:"left",
                border:"none", cursor:"pointer", transition:"all .15s",
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = dark?"rgba(255,255,255,.05)":"rgba(0,0,0,.04)"; e.currentTarget.style.color = textMain; }}}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = muted; }}}
            >
              <span style={{ flexShrink:0, display:"flex" }}>{icon}</span>
              {label}
              {badge && (
                <span style={{ marginLeft:"auto", width:18, height:18, borderRadius:"50%",
                  background:"#0CC8A8", color:"#000", fontSize:10, fontWeight:800,
                  display:"flex", alignItems:"center", justifyContent:"center" }}>{badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Theme Toggle ── */}
      <div style={{ padding:"6px 10px", borderTop:`1px solid ${border}` }}>
        <button onClick={() => setDark(!dark)}
          style={{ width:"100%", display:"flex", alignItems:"center", gap:10,
            padding:"8px 12px", borderRadius:10, color:muted, fontSize:13, fontWeight:500,
            background:"transparent", border:"none", cursor:"pointer", transition:"background .15s" }}
          onMouseEnter={e => e.currentTarget.style.background = dark?"rgba(255,255,255,.05)":"rgba(0,0,0,.04)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
          <span style={{ fontSize:15, width:16, textAlign:"center" }}>{dark?"☀":"☽"}</span>
          {dark ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {/* ── User ── */}
      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px",
        borderTop:`1px solid ${border}` }}>
        <div style={{ width:30, height:30, borderRadius:"50%", flexShrink:0,
          background:"linear-gradient(135deg,#0CC8A8,#0891b2)",
          display:"flex", alignItems:"center", justifyContent:"center",
          color:"#000", fontSize:11, fontWeight:800 }}>SY</div>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ fontSize:12, fontWeight:700, color:textMain, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>Sandeep@gmail.com</p>
          <p style={{ fontSize:10, color:muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>Security Lead</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar