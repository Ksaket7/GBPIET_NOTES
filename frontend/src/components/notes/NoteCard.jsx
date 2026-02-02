import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function NoteCard({ note }) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const canDelete =
    isAuthenticated && note.uploadedBy?._id === user?._id;

  const handleOpen = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    window.open(note.fileUrl, "_blank");
  };

  return (
    <div className="bg-surface border border-borderSoft rounded-lg p-5 space-y-2">
      <div className="flex justify-between items-start">
        <h3 className="font-poppins text-lg text-textPrimary font-semibold">
          {note.title}
        </h3>

        {note.verified && (
          <span className="text-xs px-2 py-1 bg-primary text-white rounded">
            Verified
          </span>
        )}
      </div>

      <p className="font-inter text-sm text-textSecondary">
        {note.subjectCode} • {note.type}
      </p>

      <p className="font-inter text-sm text-textSecondary">
        Uploaded by {note.uploadedBy?.fullName}
      </p>

      <div className="flex gap-3 mt-3">
        <button
          onClick={handleOpen}
          className="px-4 py-2 text-sm bg-primary text-white rounded hover:bg-primaryDark"
        >
          {isAuthenticated ? "Open / Download" : "Login to view"}
        </button>

        {canDelete && (
          <button className="px-4 py-2 text-sm border border-red-500 text-red-500 rounded">
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
