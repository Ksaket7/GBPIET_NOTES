import { useState } from "react";
import UpvoteButton from "../upvote/UpvoteButton";
import UpvotersList from "./UpvotersList";

export default function NoteHeader({ note }) {
  const [showUpvoters, setShowUpvoters] = useState(false);

  return (
    <div className="space-y-3 border-b border-borderSoft pb-6">
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
      <button
        onClick={() => setShowUpvoters(true)}
        className="text-sm font-inter text-primary "
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
    </div>
  );
}
