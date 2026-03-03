import { useState } from "react";
import { mockScans, orgStats } from "../data/mockData";
import { SeverityBadge, StatusChip, VulnCounts } from "../component/Badges";
import Sidebar from "../component/Sidebar";
import { useTheme } from "../context/ThemeContext";

export default function DashboardPage({ onScanClick, addToast }) {
  const { dark } = useTheme();
  const [activePage, setActivePage] = useState("scans");
  const [search, setSearch] = useState("");
  const [showNewScanModal, setShowNewScanModal] = useState(false);

  const filtered = mockScans.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.type.toLowerCase().includes(search.toLowerCase())
  );

  const handleNavigate = (page) => {
    if (page === "scans" || page === "dashboard") setActivePage(page);
    else addToast(`${page.charAt(0).toUpperCase() + page.slice(1)} coming soon`, "info");
  };

  const statColors = {
    critical: { bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400", badge: "bg-red-500" },
    high: { bg: "bg-orange-500/10", border: "border-orange-500/20", text: "text-orange-400", badge: "bg-orange-500" },
    medium: { bg: "bg-yellow-500/10", border: "border-yellow-500/20", text: "text-yellow-400", badge: "bg-yellow-500" },
    low: { bg: "bg-green-500/10", border: "border-green-500/20", text: "text-green-400", badge: "bg-green-500" },
  };

  return (
    <div className={`flex h-screen overflow-hidden ${dark ? "bg-[#0F0F0F]" : "bg-gray-50"}`}>
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className={`sticky top-0 z-10 flex items-center justify-between px-6 h-16 border-b backdrop-blur-md ${dark ? "bg-[#0F0F0F]/90 border-zinc-800" : "bg-white/90 border-zinc-200"}`}>
          <div>
            <h1 className={`font-bold text-lg ${dark ? "text-white" : "text-zinc-900"}`}>Security Dashboard</h1>
            <p className="text-xs text-zinc-500">Organization overview · Last updated just now</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => addToast("Report exported successfully", "success")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${dark ? "border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100" : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"}`}
            >
              Export Report
            </button>
            <button
              onClick={() => setShowNewScanModal(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-500 hover:bg-teal-400 text-black transition-all"
            >
              + New Scan
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Severity stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(orgStats).map(([key, val]) => {
              const c = statColors[key];
              return (
                <div key={key} className={`rounded-xl border p-4 ${c.bg} ${c.border} ${dark ? "" : "bg-white border-zinc-200"}`}>
                  <div className="flex items-start justify-between mb-3">
                    <span className={`text-xs font-semibold uppercase tracking-widest ${c.text}`}>{key}</span>
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${val.change > 0 ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>
                      {val.change > 0 ? "+" : ""}{val.change}
                    </span>
                  </div>
                  <div className={`text-4xl font-black ${dark ? "text-white" : "text-zinc-900"}`}>{val.count}</div>
                  <div className="mt-2 text-xs text-zinc-500">active findings</div>
                </div>
              );
            })}
          </div>

          {/* Table section */}
          <div className={`rounded-xl border overflow-hidden ${dark ? "bg-[#141414] border-zinc-800" : "bg-white border-zinc-200"}`}>
            {/* Toolbar */}
            <div className={`flex items-center gap-3 px-4 py-3 border-b ${dark ? "border-zinc-800" : "border-zinc-200"}`}>
              <div className="relative flex-1 max-w-sm">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">⌕</span>
                <input
                  className={`w-full pl-8 pr-3 py-2 rounded-lg text-sm border outline-none transition-all ${
                    dark
                      ? "bg-zinc-900 border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:border-teal-500"
                      : "bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-teal-500"
                  }`}
                  placeholder="Search scans..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button
                onClick={() => addToast("Filters panel coming soon", "info")}
                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${dark ? "border-zinc-700 text-zinc-400 hover:bg-zinc-800" : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"}`}
              >
                ⊟ Filter
              </button>
              <button
                onClick={() => addToast("Column settings coming soon", "info")}
                className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${dark ? "border-zinc-700 text-zinc-400 hover:bg-zinc-800" : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"}`}
              >
                ⊞ Columns
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={`text-left text-xs font-semibold uppercase tracking-wider ${dark ? "text-zinc-500 bg-zinc-900/50" : "text-zinc-400 bg-zinc-50"}`}>
                    <th className="px-4 py-3">Scan Name</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Progress</th>
                    <th className="px-4 py-3">Vulnerabilities</th>
                    <th className="px-4 py-3">Last Scan</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((scan, i) => (
                    <tr
                      key={scan.id}
                      onClick={() => onScanClick(scan)}
                      className={`border-t cursor-pointer transition-all group ${
                        dark
                          ? "border-zinc-800 hover:bg-zinc-800/50"
                          : "border-zinc-100 hover:bg-zinc-50"
                      }`}
                    >
                      <td className="px-4 py-3.5">
                        <div>
                          <p className={`font-semibold text-sm group-hover:text-teal-400 transition-colors ${dark ? "text-zinc-100" : "text-zinc-900"}`}>
                            {scan.name}
                          </p>
                          <p className="text-xs text-zinc-500 mt-0.5 font-mono">{scan.target}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs font-mono px-2 py-1 rounded ${dark ? "bg-zinc-800 text-zinc-400" : "bg-zinc-100 text-zinc-600"}`}>
                          {scan.type}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusChip status={scan.status} />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-20 h-1.5 rounded-full overflow-hidden ${dark ? "bg-zinc-800" : "bg-zinc-200"}`}>
                            <div
                              className={`h-full rounded-full transition-all ${
                                scan.status === "Failed" ? "bg-red-500" : "bg-teal-500"
                              }`}
                              style={{ width: `${scan.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-zinc-500">{scan.progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <VulnCounts vulns={scan.vulnerabilities} />
                      </td>
                      <td className="px-4 py-3.5 text-xs text-zinc-500">
                        {new Date(scan.lastScan).toLocaleString("en-IN", {
                          day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span className="text-xs text-zinc-600 group-hover:text-teal-400 transition-colors">→</span>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-zinc-500 text-sm">
                        No scans match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* New Scan Modal */}
      {showNewScanModal && (
        <NewScanModal
          dark={dark}
          onClose={() => setShowNewScanModal(false)}
          onSubmit={() => {
            setShowNewScanModal(false);
            addToast("Scan queued successfully!", "success");
          }}
        />
      )}
    </div>
  );
}

function NewScanModal({ dark, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [type, setType] = useState("DAST");

  const inputCls = `w-full px-3 py-2 rounded-lg text-sm border outline-none transition-all ${
    dark
      ? "bg-zinc-900 border-zinc-700 text-zinc-100 placeholder-zinc-500 focus:border-teal-500"
      : "bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-teal-500"
  }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className={`w-full max-w-md rounded-2xl border shadow-2xl p-6 ${dark ? "bg-[#161616] border-zinc-800" : "bg-white border-zinc-200"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className={`text-base font-bold ${dark ? "text-white" : "text-zinc-900"}`}>New Scan</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 text-lg">✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5">Scan Name</label>
            <input className={inputCls} placeholder="e.g. Production API v3" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5">Target URL</label>
            <input className={inputCls} placeholder="https://api.example.com" value={target} onChange={(e) => setTarget(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5">Scan Type</label>
            <select
              className={inputCls}
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option>DAST</option>
              <option>SAST</option>
              <option>API</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${dark ? "border-zinc-700 text-zinc-400 hover:bg-zinc-800" : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"}`}
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="flex-1 py-2 rounded-lg text-sm font-semibold bg-teal-500 hover:bg-teal-400 text-black transition-all"
          >
            Start Scan
          </button>
        </div>
      </div>
    </div>
  );
}
