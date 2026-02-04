import { useState } from "react";
import UpvoteButton from "../upvote/UpvoteButton";
import UpvotersList from "./UpvotersList";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function NoteHeader({ note }) {
  const [showUpvoters, setShowUpvoters] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-3 border-b border-borderSoft p-6 bg-slate-50">
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
          className="mt-3 px-4 py-2 bg-primary text-white rounded
             hover:bg-primaryDark transition font-inter"
        >
          🤖 Ask AI about this note
        </button>
      </div>
    </div>
  );
}
