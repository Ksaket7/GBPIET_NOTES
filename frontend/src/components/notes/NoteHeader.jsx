import { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  FileText,
  ShieldCheck,
  Tag,
  Trash2,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";
import ConfirmModal from "../ui/ConfirmModal";
import LoadingButton from "../ui/LoadingButton";
import UpvoteButton from "../upvote/UpvoteButton";
import UpvotersList from "../upvote/UpvotersList";
import { useToast } from "../../context/ToastContext";
import UserProfileLink from "../ui/UserProfileLink";

export default function NoteHeader({ note }) {
  const [showUpvoters, setShowUpvoters] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const isOwner = user?._id === note.uploadedBy?._id;
  const uploadedDate = note.createdAt
    ? new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(note.createdAt))
    : "Recently";
  const tags = Array.isArray(note.tags) ? note.tags.filter(Boolean) : [];

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await API.delete(`/notes/${note._id}`);
      navigate("/notes");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete note", "error");
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <section className="overflow-hidden rounded-[28px] border border-white/70 bg-white/80 shadow-xl shadow-slate-500/10 backdrop-blur">
      <div className="border-b border-slate-100 bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-5 sm:p-7">
      <button
        type="button"
        onClick={() => navigate("/notes")}
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:text-indigo-700"
      >
        <ArrowLeft size={16} />
        Back to Notes
      </button>

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-bold uppercase text-white shadow-sm shadow-indigo-200">
              <BookOpen size={14} />
              {note.subjectCode || "Subject"}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-100 bg-white px-3 py-1.5 text-xs font-semibold capitalize text-slate-600 shadow-sm">
              <FileText size={13} />
              {note.type || "Material"}
            </span>
            {note.verified && (
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                <ShieldCheck size={14} />
                Verified
              </span>
            )}
          </div>
          <h1 className="mt-4 break-words font-poppins text-3xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-4xl">
            {note.title}
          </h1>
          <p className="mt-3 max-w-3xl break-words text-sm leading-6 text-slate-600 sm:text-base">
            {note.description || "No description provided for this note."}
          </p>
        </div>
      </div>
      </div>

      <div className="space-y-5 p-5 sm:p-7">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-400">
              <UserRound size={14} />
              Uploaded by
            </p>
            <p className="mt-1 truncate text-sm font-semibold text-slate-950">
              <UserProfileLink user={note.uploadedBy}>
                {note.uploadedBy?.fullName || note.uploadedBy?.username || "GBPIET"}
              </UserProfileLink>
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-400">
              <CalendarDays size={14} />
              Shared on
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-950">
              {uploadedDate}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-400">
              <BookOpen size={14} />
              Subject
            </p>
            <p className="mt-1 truncate text-sm font-semibold text-slate-950">
              {note.subjectName || note.subjectCode || "General"}
            </p>
          </div>
        </div>

        {tags.length > 0 && (
          <div className="rounded-2xl border border-slate-100 bg-white p-4">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase text-slate-400">
              <Tag size={14} />
              Tags
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700"
                >
                  #{String(tag).replace(/^#/, "")}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:flex-wrap sm:items-center">
          <UpvoteButton type="note" id={note._id} label="Like" />
          <button
            type="button"
            onClick={() => setShowUpvoters(true)}
            className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-indigo-700 sm:w-auto"
          >
            View upvoters
          </button>
          {isOwner && (
            <LoadingButton
              loading={deleting}
              onClick={() => setShowConfirm(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 sm:w-auto"
            >
              <Trash2 size={15} />
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
