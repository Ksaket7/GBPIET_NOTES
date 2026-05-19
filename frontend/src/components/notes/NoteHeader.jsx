import { useState } from "react";
import { ArrowLeft, BookOpen, CalendarDays, ShieldCheck, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";
import ConfirmModal from "../ui/ConfirmModal";
import LoadingButton from "../ui/LoadingButton";
import UpvoteButton from "../upvote/UpvoteButton";
import UpvotersList from "../upvote/UpvotersList";

export default function NoteHeader({ note }) {
  const [showUpvoters, setShowUpvoters] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const isOwner = user?._id === note.uploadedBy?._id;

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await API.delete(`/notes/${note._id}`);
      navigate("/notes");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete note");
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-4 sm:p-6">
      <button
        type="button"
        onClick={() => navigate("/notes")}
        className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-white hover:text-indigo-700"
      >
        <ArrowLeft size={16} />
        Back to Notes
      </button>

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-bold uppercase text-white shadow-sm">
              <BookOpen size={14} />
              {note.subjectCode || "Subject"}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold capitalize text-slate-600 shadow-sm">
              {note.type || "Material"}
            </span>
          </div>
          <h1 className="mt-4 break-words font-poppins text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
            {note.title}
          </h1>
        </div>
        {note.verified && (
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            <ShieldCheck size={14} />
            Verified
          </span>
        )}
      </div>
      </div>

      <div className="space-y-5 p-4 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-400">
              <UserRound size={14} />
              Uploaded by
            </p>
            <p className="mt-1 truncate text-sm font-semibold text-slate-950">
              {note.uploadedBy?.fullName || note.uploadedBy?.username || "GBPIET"}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-400">
              <CalendarDays size={14} />
              Shared on
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-950">
              {note.createdAt
                ? new Intl.DateTimeFormat("en", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }).format(new Date(note.createdAt))
                : "Recently"}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-4">
          <p className="text-xs font-semibold uppercase text-slate-400">
            Description
          </p>
          <p className="mt-2 break-words text-sm leading-6 text-slate-600">
            {note.description || "No description provided for this note."}
          </p>
        </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <UpvoteButton type="note" id={note._id} />
        <button
          type="button"
          onClick={() => setShowUpvoters(true)}
          className="app-button-secondary w-full py-2 sm:w-auto"
        >
          View upvoters
        </button>
        {isOwner && (
          <LoadingButton
            loading={deleting}
            onClick={() => setShowConfirm(true)}
            className="app-button-secondary w-full py-2 text-red-500 sm:w-auto"
          >
            Delete Note
          </LoadingButton>
        )}
      </div>
      </div>

      {showUpvoters && (
        <UpvotersList
          type="note"
          id={note._id}
          onClose={() => setShowUpvoters(false)}
        />
      )}

      <ConfirmModal
        open={showConfirm}
        title="Delete Note"
        message="Are you sure you want to delete this note? This action cannot be undone."
        confirmText="Delete"
        onCancel={() => setShowConfirm(false)}
        loading={deleting}
        onConfirm={handleDelete}
      />
    </section>
  );
}
