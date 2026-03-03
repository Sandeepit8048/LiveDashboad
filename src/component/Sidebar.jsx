import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const NAV = [
  { icon: "⊞", label: "Dashboard", id: "dashboard" },
  { icon: "◫", label: "Projects", id: "projects" },
  { icon: "⬡", label: "Scans", id: "scans" },
  { icon: "◷", label: "Schedule", id: "schedule" },
  { icon: "◉", label: "Notifications", id: "notifications" },
  { icon: "⚙", label: "Settings", id: "settings" },
  { icon: "?", label: "Support", id: "support" },
];

export default function Sidebar({ activePage, onNavigate }) {
  const { dark, toggle } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 w-9 h-9 flex items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300"
        onClick={() => setCollapsed((c) => !c)}
      >
        ☰
      </button>

      <aside
        className={`
          fixed md:relative inset-y-0 left-0 z-40 flex flex-col
          ${collapsed ? "-translate-x-full md:translate-x-0 md:w-16" : "translate-x-0 w-60"}
          transition-all duration-300
          ${dark ? "bg-[#111111] border-zinc-800" : "bg-white border-zinc-200"}
          border-r h-screen
        `}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-4 h-16 border-b ${dark ? "border-zinc-800" : "border-zinc-200"}`}>
          <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-black font-black text-sm flex-shrink-0">
            F
          </div>
          {!collapsed && (
            <span className={`font-bold text-base tracking-tight ${dark ? "text-white" : "text-zinc-900"}`}>
              Fenrir Security
            </span>
          )}
          <button
            className={`ml-auto hidden md:flex items-center justify-center w-6 h-6 rounded ${dark ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-400 hover:text-zinc-700"}`}
            onClick={() => setCollapsed((c) => !c)}
          >
            {collapsed ? "»" : "«"}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-0.5">
          {NAV.map((item) => {
            const active = activePage === item.id || (activePage === "scan-detail" && item.id === "scans");
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${active
                    ? dark
                      ? "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                      : "bg-teal-50 text-teal-600 border border-teal-200"
                    : dark
                    ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                    : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
                  }
                `}
              >
                <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom: theme toggle + user */}
        <div className={`border-t px-3 py-4 space-y-3 ${dark ? "border-zinc-800" : "border-zinc-200"}`}>
          {/* Theme toggle */}
          <button
            onClick={toggle}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
              dark ? "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
            }`}
          >
            <span className="text-base w-5 text-center">{dark ? "☀" : "☽"}</span>
            {!collapsed && <span>{dark ? "Light Mode" : "Dark Mode"}</span>}
          </button>

          {/* User */}
          <div className={`flex items-center gap-3 px-3 py-2 rounded-lg ${dark ? "hover:bg-zinc-800" : "hover:bg-zinc-100"} cursor-pointer`}>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-xs font-bold text-black flex-shrink-0">
              AK
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className={`text-xs font-semibold truncate ${dark ? "text-zinc-100" : "text-zinc-800"}`}>Arjun Kumar</p>
                <p className="text-xs text-zinc-500 truncate">admin@fenrir.io</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
