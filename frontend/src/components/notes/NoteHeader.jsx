import { useState } from "react";
import { ArrowLeft, Bot } from "lucide-react";
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
  const { isAuthenticated, user } = useAuth();
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
    <section className="glass-panel p-6">
      <button
        type="button"
        onClick={() => navigate("/notes")}
        className="mb-5 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-700"
      >
        <ArrowLeft size={16} />
        Back to Notes
      </button>

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <span className="pill">{note.subjectCode} - {note.type}</span>
          <h1 className="mt-4 font-poppins text-3xl font-semibold text-slate-950">
            {note.title}
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            Uploaded by <strong className="text-slate-950">{note.uploadedBy?.fullName}</strong>
          </p>
        </div>
        {note.verified && (
          <span className="pill bg-emerald-50 text-emerald-700">Verified</span>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <UpvoteButton type="note" id={note._id} />
        <button
          type="button"
          onClick={() => setShowUpvoters(true)}
          className="app-button-secondary py-2"
        >
          View upvoters
        </button>
        <button
          type="button"
          onClick={() => {
            if (!isAuthenticated) {
              navigate("/login");
              return;
            }
            navigate(`/notes/${note._id}/ai`, {
              state: { noteType: note.type, noteTitle: note.title },
            });
          }}
          className="app-button py-2"
        >
          <Bot size={16} />
          Ask AI
        </button>
        {isOwner && (
          <LoadingButton
            loading={deleting}
            onClick={() => setShowConfirm(true)}
            className="app-button-secondary py-2 text-red-500"
          >
            Delete Note
          </LoadingButton>
        )}
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
