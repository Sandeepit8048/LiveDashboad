import React from 'react'

function Scan() {
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
  )
}

export default Scan