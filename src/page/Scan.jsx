import { useState, useEffect, useRef } from "react";
import { activeScanLogs, activeFindings } from "../data/mockData";
import { SeverityBadge, StatusChip } from "../component/Badges";
import Sidebar from "../component/Sidebar";
import { useTheme } from "../context/ThemeContext";

const STEPS = ["Spidering", "Mapping", "Testing", "Validating", "Reporting"];

export default function ScanDetailPage({ scan, onBack, addToast }) {
  const { dark } = useTheme();
  const [activeTab, setActiveTab] = useState("activity");
  const [progress, setProgress] = useState(scan?.progress || 63);
  const [visibleLogs, setVisibleLogs] = useState(activeScanLogs.slice(0, 6));
  const [stopped, setStopped] = useState(false);
  const logRef = useRef(null);

  // Simulate log streaming
  useEffect(() => {
    if (stopped) return;
    let idx = 6;
    const interval = setInterval(() => {
      if (idx < activeScanLogs.length) {
        setVisibleLogs((prev) => [...prev, activeScanLogs[idx]]);
        idx++;
      }
      setProgress((p) => Math.min(p + 0.5, 98));
    }, 1500);
    return () => clearInterval(interval);
  }, [stopped]);

  // Auto scroll logs
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [visibleLogs]);

  const activeStep = progress < 20 ? 0 : progress < 40 ? 1 : progress < 70 ? 2 : progress < 90 ? 3 : 4;

  const logColors = {
    info: dark ? "text-zinc-400" : "text-zinc-500",
    warn: dark ? "text-yellow-400" : "text-yellow-600",
    error: dark ? "text-red-400" : "text-red-600",
  };

  const circumference = 2 * Math.PI * 44;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`flex h-screen overflow-hidden ${dark ? "bg-[#0F0F0F]" : "bg-gray-50"}`}>
      <Sidebar activePage="scan-detail" onNavigate={() => onBack()} />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className={`sticky top-0 z-10 flex items-center gap-4 px-6 h-16 border-b backdrop-blur-md ${dark ? "bg-[#0F0F0F]/90 border-zinc-800" : "bg-white/90 border-zinc-200"}`}>
          <button
            onClick={onBack}
            className={`flex items-center gap-1.5 text-sm transition-colors ${dark ? "text-zinc-500 hover:text-zinc-200" : "text-zinc-400 hover:text-zinc-800"}`}
          >
            ← Back
          </button>
          <div className={`w-px h-4 ${dark ? "bg-zinc-700" : "bg-zinc-300"}`} />
          <div>
            <h1 className={`font-bold text-base ${dark ? "text-white" : "text-zinc-900"}`}>{scan?.name || "Payment Gateway Integration"}</h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => addToast("Report exported!", "success")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${dark ? "border-zinc-700 text-zinc-400 hover:bg-zinc-800" : "border-zinc-200 text-zinc-600 hover:bg-zinc-100"}`}
            >
              Export Report
            </button>
            <button
              onClick={() => { setStopped(true); addToast("Scan stopped", "warn"); }}
              disabled={stopped}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/80 hover:bg-red-500 text-white transition-all disabled:opacity-40"
            >
              {stopped ? "Stopped" : "Stop Scan"}
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Progress + Steps */}
          <div className={`rounded-xl border p-5 ${dark ? "bg-[#141414] border-zinc-800" : "bg-white border-zinc-200"}`}>
            <div className="flex items-center gap-8">
              {/* Circular progress */}
              <div className="relative flex-shrink-0 w-[110px] h-[110px]">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="44" fill="none" strokeWidth="7"
                    className={dark ? "stroke-zinc-800" : "stroke-zinc-200"} />
                  <circle cx="50" cy="50" r="44" fill="none" strokeWidth="7"
                    stroke="#0CC8A8" strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    style={{ transition: "stroke-dashoffset 0.8s ease" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-xl font-black ${dark ? "text-white" : "text-zinc-900"}`}>{Math.round(progress)}%</span>
                  <span className="text-xs text-teal-400 font-medium">Active</span>
                </div>
              </div>

              {/* Step tracker */}
              <div className="flex-1">
                <div className="flex items-center gap-0">
                  {STEPS.map((step, i) => {
                    const done = i < activeStep;
                    const active = i === activeStep;
                    return (
                      <div key={step} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                            done ? "bg-teal-500 border-teal-500 text-black"
                            : active ? "border-teal-500 text-teal-400 bg-teal-500/10"
                            : dark ? "border-zinc-700 text-zinc-600" : "border-zinc-300 text-zinc-400"
                          }`}>
                            {done ? "✓" : i + 1}
                          </div>
                          <span className={`text-xs mt-1.5 font-medium ${
                            done || active ? (dark ? "text-teal-400" : "text-teal-600") : "text-zinc-500"
                          }`}>{step}</span>
                        </div>
                        {i < STEPS.length - 1 && (
                          <div className={`flex-1 h-0.5 mb-4 mx-1 ${done ? "bg-teal-500" : dark ? "bg-zinc-800" : "bg-zinc-200"}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className={`mt-4 pt-4 border-t grid grid-cols-3 md:grid-cols-6 gap-4 ${dark ? "border-zinc-800" : "border-zinc-100"}`}>
              {[
                { label: "Scan Type", value: scan?.type || "DAST" },
                { label: "Target", value: "payments.fenrir-prod.io" },
                { label: "Started At", value: "09:30 AM" },
                { label: "Credentials", value: "2 sets" },
                { label: "Files", value: "14 uploaded" },
                { label: "Checklists", value: "OWASP Top 10" },
              ].map((m) => (
                <div key={m.label}>
                  <p className="text-xs text-zinc-500 mb-0.5">{m.label}</p>
                  <p className={`text-xs font-semibold ${dark ? "text-zinc-200" : "text-zinc-700"}`}>{m.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Panels */}
          <div className="grid md:grid-cols-2 gap-5">
            {/* Console */}
            <div className={`rounded-xl border overflow-hidden flex flex-col ${dark ? "bg-[#141414] border-zinc-800" : "bg-white border-zinc-200"}`}>
              <div className={`flex items-center gap-1 px-4 border-b ${dark ? "border-zinc-800" : "border-zinc-200"}`}>
                {["Activity Log", "Verification Loops"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab === "Activity Log" ? "activity" : "loops")}
                    className={`px-3 py-3 text-xs font-semibold border-b-2 transition-all -mb-px ${
                      (tab === "Activity Log" ? activeTab === "activity" : activeTab === "loops")
                        ? "border-teal-500 text-teal-400"
                        : dark ? "border-transparent text-zinc-500 hover:text-zinc-300" : "border-transparent text-zinc-400 hover:text-zinc-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
                <div className="ml-auto flex items-center gap-1.5 pr-1">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                  <span className="text-xs text-teal-400 font-medium">Live</span>
                </div>
              </div>

              <div
                ref={logRef}
                className={`flex-1 overflow-y-auto font-mono text-xs p-4 space-y-1.5 h-72 ${dark ? "bg-[#0D0D0D]" : "bg-zinc-950"}`}
              >
                {activeTab === "activity" ? (
                  visibleLogs.map((log, i) => (
                    <div key={i} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-zinc-600 flex-shrink-0">{log.time}</span>
                      <span className={logColors[log.type]}>
                        {log.message}{" "}
                        {log.highlight && (
                          <span className="text-teal-400">{log.highlight}</span>
                        )}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-zinc-600 text-center mt-8">No verification loops running</div>
                )}
              </div>
            </div>

            {/* Findings */}
            <div className={`rounded-xl border overflow-hidden flex flex-col ${dark ? "bg-[#141414] border-zinc-800" : "bg-white border-zinc-200"}`}>
              <div className={`px-4 py-3 border-b flex items-center justify-between ${dark ? "border-zinc-800" : "border-zinc-200"}`}>
                <span className={`text-xs font-bold uppercase tracking-wider ${dark ? "text-zinc-300" : "text-zinc-700"}`}>Finding Log</span>
                <span className="text-xs text-zinc-500">{activeFindings.length} findings</span>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2 h-72">
                {activeFindings.map((f) => {
                  const borderColors = {
                    Critical: "border-red-500/40",
                    High: "border-orange-500/40",
                    Medium: "border-yellow-500/40",
                    Low: "border-green-500/40",
                  };
                  return (
                    <div
                      key={f.id}
                      className={`rounded-lg border-l-2 p-3 transition-all cursor-pointer ${borderColors[f.severity]} ${dark ? "bg-zinc-900/50 hover:bg-zinc-900" : "bg-zinc-50 hover:bg-zinc-100"}`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <SeverityBadge severity={f.severity} />
                        <span className="text-xs text-zinc-500 ml-auto">{f.time}</span>
                      </div>
                      <p className={`text-xs font-semibold mb-1 ${dark ? "text-zinc-100" : "text-zinc-900"}`}>{f.title}</p>
                      <p className="text-xs text-teal-400 font-mono mb-1">{f.endpoint}</p>
                      <p className="text-xs text-zinc-500 leading-relaxed">{f.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Status bar */}
          <div className={`rounded-xl border px-5 py-3 flex flex-wrap items-center gap-6 ${dark ? "bg-[#141414] border-zinc-800" : "bg-white border-zinc-200"}`}>
            {[
              { label: "Sub-agents", value: "8 active" },
              { label: "Parallel Executions", value: "24" },
              { label: "Operations", value: "1,847" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <span className="text-xs text-zinc-500">{s.label}:</span>
                <span className={`text-xs font-semibold ${dark ? "text-zinc-200" : "text-zinc-700"}`}>{s.value}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-red-400 font-semibold">C: 2</span>
              <span className="text-xs text-orange-400 font-semibold">H: 5</span>
              <span className="text-xs text-yellow-400 font-semibold">M: 9</span>
              <span className="text-xs text-green-400 font-semibold">L: 3</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
