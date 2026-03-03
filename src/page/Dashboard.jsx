import React from 'react'

function Dashboard({dark, onScan, toast}) {

    const T = (dark) => ({
        bg:      dark ? "#0F0F11" : "#F2F2F5",
        surface: dark ? "#111113" : "#FFFFFF",
        border:  dark ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.08)",
        text:    dark ? "#F5F5F5" : "#111111",
        muted:   dark ? "#71717A" : "#71717A",
        input:   dark ? "rgba(255,255,255,.04)" : "#F8F9FB",
        console: dark ? "#080809" : "#0F0F0F",
        });


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
  <div className={`flex-1 flex flex-col overflow-y-auto transition-colors duration-200 ${dark ? "bg-zinc-950" : "bg-gray-50"}`}>
  
  {/* HEADER */}
  <div className={`px-6 py-4 border-b flex items-center justify-between ${dark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"}`}>
    <div>
      <h1 className="text-lg font-black tracking-tight text-gray-900 dark:text-white">
        Dashboard
      </h1>
      <p className="text-xs text-zinc-500 mt-1">
        Fenrir Security — Org Overview
      </p>
    </div>

    <div className="flex items-center gap-3">
      <span className={`text-xs px-3 py-1 rounded-full border ${dark ? "border-zinc-700 text-zinc-400" : "border-gray-200 text-gray-500"}`}>
        Workspace: <strong className="text-[#0CC8A8]">Fenrir-Prod</strong>
      </span>

      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0CC8A8] to-sky-600 flex items-center justify-center text-black text-xs font-extrabold">
        AK
      </div>
    </div>
  </div>

  {/* CONTENT */}
  <div className="px-6 py-5 flex-1">

    {/* STATS GRID */}
    <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-4 mb-5">
      {STATS.map(({ label, val, delta, up, color }) => (
        <div
          key={label}
          className={`rounded-2xl p-5 border transition ${dark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"}`}
        >
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 mb-2">
            {label}
          </p>

          <p className="text-3xl font-black tracking-tight" style={{ color }}>
            {val}
          </p>

          <p className={`text-xs mt-1 font-semibold ${up ? "text-red-400" : "text-emerald-400"}`}>
            {delta}
          </p>
        </div>
      ))}
    </div>

    {/* TABLE CARD */}
    <div className={`rounded-2xl border overflow-hidden ${dark ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"}`}>
      
      {/* TABLE TOOLBAR */}
      <div className={`px-4 py-3 border-b flex gap-3 items-center flex-wrap ${dark ? "border-zinc-800" : "border-gray-200"}`}>
        
        {/* SEARCH */}
        <div className={`flex items-center gap-2 flex-1 min-w-[150px] px-3 py-2 rounded-lg border ${dark ? "bg-zinc-800 border-zinc-700" : "bg-gray-50 border-gray-200"}`}>
          <span className="text-zinc-400">⌕</span>
          <input
            className="bg-transparent outline-none text-sm w-full text-gray-900 dark:text-white"
            placeholder="Search scans..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {["Filter", "Columns"].map((l) => (
          <button
            key={l}
            onClick={() => toast(`${l} panel coming soon`)}
            className={`px-4 py-2 rounded-lg border text-xs font-semibold transition hover:text-[#0CC8A8] ${
              dark
                ? "border-zinc-700 text-zinc-400"
                : "border-gray-200 text-gray-500"
            }`}
          >
            {l}
          </button>
        ))}

        <button
          onClick={() => toast("New scan initiated! 🚀")}
          className="ml-auto px-5 py-2 rounded-lg bg-[#0CC8A8] text-black text-xs font-black hover:bg-[#0ab899] transition"
        >
          + New Scan
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className={`${dark ? "border-zinc-800" : "border-gray-200"} border-b`}>
              {["Scan Name", "Type", "Status", "Progress", "Vuln Count", "Last Scan"].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filtered.map((s) => {
              const ss = STATUS[s.status];

              return (
                <tr
                  key={s.id}
                  onClick={() => onScan(s)}
                  className={`border-b cursor-pointer transition ${
                    dark
                      ? "border-zinc-800 hover:bg-white/5"
                      : "border-gray-200 hover:bg-black/5"
                  }`}
                >
                  <td className="px-4 py-3 font-semibold text-sm">
                    {s.name}
                  </td>

                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      dark ? "bg-white/10 text-zinc-400" : "bg-black/5 text-gray-500"
                    }`}>
                      {s.type}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className="text-xs font-extrabold px-3 py-1 rounded-md border"
                      style={{
                        background: ss.bg,
                        color: ss.text,
                        borderColor: ss.border,
                      }}
                    >
                      {s.status}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-16 h-1.5 rounded-full overflow-hidden ${dark ? "bg-white/10" : "bg-black/10"}`}>
                        <div
                          className="h-full bg-[#0CC8A8] rounded-full"
                          style={{ width: `${s.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-zinc-500">
                        {s.progress}%
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {s.critical > 0 && (
                        <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-red-500/10 text-red-400">
                          {s.critical}
                        </span>
                      )}
                      {s.high > 0 && (
                        <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-orange-500/10 text-orange-400">
                          {s.high}
                        </span>
                      )}
                      {s.medium > 0 && (
                        <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400">
                          {s.medium}
                        </span>
                      )}
                      {s.low > 0 && (
                        <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                          {s.low}
                        </span>
                      )}
                      {!s.critical && !s.high && !s.medium && !s.low && (
                        <span className="text-xs text-zinc-500">—</span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-xs text-zinc-500">
                    {s.lastScan}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className={`px-4 py-2 border-t flex justify-between text-xs ${dark ? "border-zinc-800 text-zinc-500" : "border-gray-200 text-gray-500"}`}>
        <span>{filtered.length} scans</span>
        <span>Page 1 of 1</span>
      </div>
    </div>
  </div>
</div>
  )
}

export default Dashboard