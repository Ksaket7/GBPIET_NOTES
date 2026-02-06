import { useState } from "react";
import UpvoteButton from "../upvote/UpvoteButton";
import UpvotersList from "./UpvotersList";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";
import ConfirmModal from "../ui/ConfirmModal";

export default function NoteHeader({ note }) {
  const [showUpvoters, setShowUpvoters] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
    <div className="space-y-3 border-b border-borderSoft p-6 bg-slate-50">
      <button
        onClick={() => navigate("/notes")}
        className="flex items-center gap-2 text-sm font-inter
             text-textSecondary hover:text-primary transition"
      >
        ← Back to Notes
      </button>
      <div className="flex items-start justify-between">
        <h1 className="font-poppins text-3xl text-textPrimary">{note.title}</h1>

        {note.verified && (
          <span className="px-3 py-1 text-sm bg-primary text-white rounded">
            Verified
          </span>
        )}
      </div>

      <p className="font-inter text-textSecondary">
        {note.subjectCode} • {note.type}
      </p>

      <p className="font-inter text-sm text-textSecondary">
        Uploaded by{" "}
        <span className="font-medium text-textPrimary">
          {note.uploadedBy?.fullName}
        </span>
      </p>

      <UpvoteButton type="note" id={note._id} />

      <div className="flex justify-between items-center">
        <button
          onClick={() => setShowUpvoters(true)}
          className="text-sm font-inter text-primary hover:underline"
        >
          View upvoters
        </button>

        {showUpvoters && (
          <UpvotersList
            type="note"
            id={note._id}
            onClose={() => setShowUpvoters(false)}
          />
        )}

        <button
          onClick={() => {
            if (!isAuthenticated) {
              navigate("/login");
              return;
            }
            navigate(`/notes/${note._id}/ai`, {
              state: { noteType: note.type, noteTitle: note.title },
            });
          }}
          className="px-4 py-2 bg-primary text-white rounded
                     hover:bg-primaryDark transition font-inter"
        >
          🤖 Ask AI
        </button>
      </div>

      {isOwner && (
        <button
          onClick={() => setShowConfirm(true)}
          className="px-4 py-2 border border-red-500 text-red-500 rounded
               hover:bg-red-500 hover:text-white transition font-inter"
        >
          Delete Note
        </button>
      )}
      <ConfirmModal
        open={showConfirm}
        title="Delete Note"
        message="Are you sure you want to delete this note? This action cannot be undone."
        confirmText="Delete"
        onCancel={() => (setShowConfirm(false), navigate("/notes"))}
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
