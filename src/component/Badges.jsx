export function SeverityBadge({ severity, count }) {
  const styles = {
    Critical: "bg-red-500/20 text-red-400 border-red-500/40",
    High: "bg-orange-500/20 text-orange-400 border-orange-500/40",
    Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
    Low: "bg-green-500/20 text-green-400 border-green-500/40",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${styles[severity] || "bg-gray-500/20 text-gray-400 border-gray-500/40"}`}
    >
      {count !== undefined && <span>{count}</span>}
      {severity}
    </span>
  );
}

export function StatusChip({ status }) {
  const styles = {
    Completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    Scheduled: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
    Failed: "bg-red-500/15 text-red-400 border-red-500/30",
    "In Progress": "bg-teal-500/15 text-teal-400 border-teal-500/30",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || "bg-zinc-500/20 text-zinc-400"}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === "Completed"
            ? "bg-emerald-400"
            : status === "Failed"
            ? "bg-red-400"
            : status === "In Progress"
            ? "bg-teal-400 animate-pulse"
            : "bg-zinc-400"
        }`}
      />
      {status}
    </span>
  );
}

export function VulnCounts({ vulns }) {
  return (
    <div className="flex items-center gap-1.5">
      {vulns.critical > 0 && (
        <span className="min-w-[22px] text-center px-1.5 py-0.5 rounded text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/40">
          {vulns.critical}
        </span>
      )}
      {vulns.high > 0 && (
        <span className="min-w-[22px] text-center px-1.5 py-0.5 rounded text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/40">
          {vulns.high}
        </span>
      )}
      {vulns.medium > 0 && (
        <span className="min-w-[22px] text-center px-1.5 py-0.5 rounded text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/40">
          {vulns.medium}
        </span>
      )}
      {vulns.low > 0 && (
        <span className="min-w-[22px] text-center px-1.5 py-0.5 rounded text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/40">
          {vulns.low}
        </span>
      )}
      {vulns.critical === 0 && vulns.high === 0 && vulns.medium === 0 && vulns.low === 0 && (
        <span className="text-xs text-zinc-500">—</span>
      )}
    </div>
  );
}
