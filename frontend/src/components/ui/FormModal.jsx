import { useEffect } from "react";
import { X } from "lucide-react";

export default function FormModal({ title, onClose, children }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-slate-950/45 p-3 pt-4 backdrop-blur-lg sm:items-center sm:p-5"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="relative my-0 max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-y-auto rounded-[24px] shadow-2xl shadow-slate-950/25 sm:my-auto sm:rounded-[28px]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-slate-800 shadow-lg shadow-slate-500/20 transition hover:bg-white"
          aria-label="Close form"
        >
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}
