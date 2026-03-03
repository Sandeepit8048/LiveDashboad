import { useState } from 'react'
import {  Routes, Route} from 'react-dom'
import './App.css'
import Home from './component/Home'
import Maindashboard from './component/Maindashboard'
import Slider from './component/Slider'
import Search from './component/Search'
import Login from './component/Login'
import Dashboard from './page/Dashboard'
function App() {

    const T = (dark) => ({
        bg:      dark ? "#0F0F11" : "#F2F2F5",
        surface: dark ? "#111113" : "#FFFFFF",
        border:  dark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.08)",
        text:    dark ? "#F5F5F5" : "#111111",
        muted:   dark ? "#71717A" : "#71717A",
        input:   dark ? "rgba(255,255,255,.04)" : "#F8F9FB",
        console: dark ? "#080809" : "#0F0F0F",
        });
 
   const [screen, setScreen] = useState("login");
    const [dark, setDark] = useState(true);
    const [nav, setNav] = useState("Scans");
    const [scan, setScan] = useState(null);
    const [toast, setToast] = useState(null);
    const [sideOpen, setSideOpen] = useState(false);
    const t = T(dark);

      if (screen === "login") return (
    <>
     
      <Login onLogin={()=>setScreen("dashboard")}/>
      {toast && <Toast msg={toast} hide={()=>setToast(null)}/>}
    </>
  );


    
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard />} />
      </Routes>

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
  )
}

export default App
