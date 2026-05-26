import { useEffect, useRef, useState } from "react";
import { Edit3, MoreHorizontal, Trash2 } from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import ReportUserButton from "./ReportUserButton";

export default function CardActionMenu({
  canEdit = false,
  isOwner,
  onDelete,
  onEdit,
  ownerUser,
}) {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [working, setWorking] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const close = (event) => {
      if (!menuRef.current?.contains(event.target)) setOpen(false);
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleDelete = async () => {
    if (!onDelete) return;
    try {
      setWorking(true);
      await onDelete();
      setOpen(false);
      setConfirmOpen(false);
    } finally {
      setWorking(false);
    }
  };

  return (
    <>
      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setOpen((value) => !value);
          }}
          className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Card actions"
        >
          <MoreHorizontal size={18} />
        </button>

        {open && (
          <div
            onClick={(event) => event.stopPropagation()}
            className="absolute right-0 top-10 z-30 w-44 rounded-2xl border border-white/70 bg-white/95 p-2 shadow-xl shadow-slate-300/40 backdrop-blur"
          >
            {isOwner ? (
              <>
                {canEdit && onEdit && (
                  <button
                    type="button"
                    onClick={() => {
                      onEdit();
                      setOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    <Edit3 size={15} />
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    disabled={working}
                    onClick={() => {
                      setOpen(false);
                      setConfirmOpen(true);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                )}
              </>
            ) : (
              <ReportUserButton
                user={ownerUser}
                variant="menu"
                stopPropagation
                onChanged={() => setOpen(false)}
              />
            )}
          </div>
        )}
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Delete content"
        message="Are you sure you want to delete this content? This action cannot be undone."
        confirmText="Delete"
        loading={working}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
}
