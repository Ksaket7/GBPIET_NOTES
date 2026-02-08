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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />

      {/* Modal */}
      <div className="relative bg-surface w-full max-w-md rounded-xl p-6 shadow-lg border border-borderSoft">
        <h3 className="font-poppins text-xl text-textPrimary">{title}</h3>

        <p className="mt-3 font-inter text-textSecondary">{message}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 font-inter border border-borderSoft rounded
                       hover:bg-borderSoft transition"
          >
            {cancelText}
          </button>

          <LoadingButton
            loading={loading}
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Delete
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}
