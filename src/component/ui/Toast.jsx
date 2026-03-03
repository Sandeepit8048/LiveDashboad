import React from 'react'

function Toast({ msg, hide}) {
    useEffect(() => { const t = setTimeout(hide, 3000); return () => clearTimeout(t); }, [hide]);
  return (
      <div style={{
      position:"fixed", bottom:24, right:24, zIndex:9999,
      padding:"11px 18px", borderRadius:14, background:"#0CC8A8", color:"#000",
      fontWeight:800, fontSize:13, boxShadow:"0 8px 32px rgba(12,200,168,.4)",
      animation:"fadeUp .3s ease forwards"
    }}>✓ {msg}</div>
  )
}

export default Toast