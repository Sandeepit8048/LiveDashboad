import React from 'react'

function StatusChip({status}) {
     const styles = {
    Completed: { bg:"rgba(16,185,129,.1)", color:"#34d399", border:"1px solid rgba(16,185,129,.25)" },
    Failed:    { bg:"rgba(239,68,68,.1)",  color:"#f87171", border:"1px solid rgba(239,68,68,.25)"  },
    Scheduled: { bg:"rgba(113,113,122,.1)", color:"#a1a1aa", border:"1px solid rgba(113,113,122,.25)" },
  };
  const s = styles[status];
 return (
    <span style={{ fontSize:11, fontWeight:800, padding:"3px 9px", borderRadius:7,
      background:s.bg, color:s.color, border:s.border }}>{status}</span>
  );
}

export default StatusChip