/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";

const ToastContext = createContext(null);

const typeStyles = {
  success: {
    icon: CheckCircle2,
    className: "border-emerald-100 bg-emerald-50 text-emerald-700",
  },
  error: {
    icon: XCircle,
    className: "border-red-100 bg-red-50 text-red-600",
  },
  info: {
    icon: Info,
    className: "border-indigo-100 bg-indigo-50 text-indigo-700",
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, type = "info") => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((currentToasts) => [
      ...currentToasts,
      { id, message, type: typeStyles[type] ? type : "info" },
    ]);
    window.setTimeout(() => removeToast(id), 3500);
  }, [removeToast]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-20 z-[10000] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3">
        {toasts.map((toast) => {
          const style = typeStyles[toast.type] || typeStyles.info;
          const Icon = style.icon;

          return (
            <div
              key={toast.id}
              className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-2xl shadow-slate-500/15 backdrop-blur ${style.className}`}
            >
              <Icon size={18} className="mt-0.5 shrink-0" />
              <p className="min-w-0 flex-1 break-words leading-5">{toast.message}</p>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="rounded-full p-1 opacity-70 transition hover:bg-white/70 hover:opacity-100"
                aria-label="Dismiss alert"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
};
