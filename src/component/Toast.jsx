import { useEffect, useState } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  };

  return { toasts, addToast };
}

export function ToastContainer({ toasts }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} />
      ))}
    </div>
  );
}

function Toast({ toast }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const colors = {
    info: "border-teal-500/40 bg-zinc-900/95 text-teal-300",
    success: "border-emerald-500/40 bg-zinc-900/95 text-emerald-300",
    error: "border-red-500/40 bg-zinc-900/95 text-red-300",
    warn: "border-yellow-500/40 bg-zinc-900/95 text-yellow-300",
  };

  const icons = { info: "ℹ", success: "✓", error: "✕", warn: "⚠" };

  return (
    <div
      className={`
        flex items-center gap-2.5 px-4 py-3 rounded-lg border text-sm font-medium shadow-xl backdrop-blur-sm
        transition-all duration-300 pointer-events-auto
        ${colors[toast.type] || colors.info}
        ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}
      `}
    >
      <span>{icons[toast.type] || icons.info}</span>
      <span>{toast.message}</span>
    </div>
  );
}
