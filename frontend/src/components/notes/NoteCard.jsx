import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import UpvoteButton from "../upvote/UpvoteButton";

export default function NoteCard({ note }) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();


  const handleOpen = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    window.open(note.fileUrl, "_blank");
  };

  return (
    <div onClick={() => navigate(`/notes/${note._id}`)} className= "cursor-pointer bg-surface border border-borderSoft rounded-lg p-5 space-y-3">
      {/* Header */}
      <div className="flex justify-between items-start">
        <h3 className="font-poppins text-lg font-semibold text-textPrimary">
          {note.title}
        </h3>

        {note.verified && (
          <span className="text-xs px-2 py-1 bg-primary text-white rounded">
            Verified
          </span>
        )}
      </div>

      {/* Meta */}
      <p className="font-inter text-sm text-textSecondary">
        {note.subjectCode} • {note.type}
      </p>

      <p className="font-inter text-sm text-textSecondary">
        Uploaded by {note.uploadedBy?.fullName}
      </p>

      {/* Actions */}
      <div className="flex items-center  justify-between mt-3">
        <div className=" flex items-center gap-3">
          {/* ✅ Upvote */}
          <UpvoteButton type="note" id={note._id} />

          {/* Open */}
          <button
            onClick={handleOpen}
            className="px-4 py-1.5 text-sm bg-primary text-white rounded
                       hover:bg-primaryDark transition"
          >
            {isAuthenticated ? "Open / Download" : "Login to view"}
          </button>
        </div>

      </div>
    </div>
  );
}
