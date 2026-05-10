import LoadingButton from "./LoadingButton";
export default function ConfirmModal({
  open,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex max-w-[100vw] items-center justify-center overflow-x-hidden p-3">
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-sm" onClick={onCancel} />

      {/* Modal */}
      <div className="relative w-full max-w-[min(28rem,calc(100vw-1.5rem))] rounded-[28px] border border-white/70 bg-white/90 p-4 shadow-2xl shadow-slate-500/20 backdrop-blur-2xl sm:p-6">
        <h3 className="font-poppins text-xl font-semibold text-slate-950">{title}</h3>

        <p className="mt-3 text-sm text-slate-500">{message}</p>

        <div className="mt-6 flex flex-col justify-end gap-3 sm:flex-row">
          <button
            onClick={onCancel}
            disabled={loading}
            className="app-button-secondary py-2"
          >
            {cancelText}
          </button>

          <LoadingButton
            loading={loading}
            onClick={onConfirm}
            className="app-button bg-red-500 py-2 hover:bg-red-600"
          >
            {confirmText}
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}
