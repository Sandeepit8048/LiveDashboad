import React from 'react'

const SEV = {
  Critical: { wrap:"bg-red-500/10 text-red-400 border-red-500/25",     dot:"bg-red-500"     },
  High:     { wrap:"bg-orange-500/10 text-orange-400 border-orange-500/25", dot:"bg-orange-500" },
  Medium:   { wrap:"bg-amber-500/10 text-amber-400 border-amber-500/25",  dot:"bg-amber-500"  },
  Low:      { wrap:"bg-emerald-500/10 text-emerald-400 border-emerald-500/25", dot:"bg-emerald-500" },
};
function SeverityBadge({sev}) {
  const s = SEV[sev] || SEV.Low;
   return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:5,
      padding:"2px 8px", borderRadius:6, fontSize:11, fontWeight:800,
      background: sev==="Critical" ? "rgba(239,68,68,.12)" : sev==="High" ? "rgba(249,115,22,.12)" : sev==="Medium" ? "rgba(245,158,11,.12)" : "rgba(16,185,129,.12)",
      color: sev==="Critical" ? "#f87171" : sev==="High" ? "#fb923c" : sev==="Medium" ? "#fbbf24" : "#34d399",
      border: sev==="Critical" ? "1px solid rgba(239,68,68,.28)" : sev==="High" ? "1px solid rgba(249,115,22,.28)" : sev==="Medium" ? "1px solid rgba(245,158,11,.28)" : "1px solid rgba(16,185,129,.28)",
    }}>
      <span style={{ width:6, height:6, borderRadius:"50%",
        background: sev==="Critical" ? "#ef4444" : sev==="High" ? "#f97316" : sev==="Medium" ? "#f59e0b" : "#10b981" }} />
      {sev}
    </span>
  );
}

export default SeverityBadge