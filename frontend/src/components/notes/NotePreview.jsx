import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function NotePreview({ note }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAccess = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    window.open(note.fileUrl, "_blank");
  };

  return (
    <div className="bg-surface border border-borderSoft rounded-xl p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-poppins text-xl text-textPrimary">
          📄 Note Preview
        </h2>

        <span className="text-xs px-2 py-1 rounded bg-borderSoft font-inter">
          PDF
        </span>
      </div>

      {/* Meta info */}
      <div className="space-y-1 text-sm font-inter text-textSecondary">
        <p>
          <span className="font-medium text-textPrimary">Type:</span>{" "}
          {note.type.toUpperCase()}
        </p>
        <p>
          <span className="font-medium text-textPrimary">Subject Code:</span>{" "}
          {note.subjectCode}
        </p>
      </div>

      {/* Description */}
      <p className="font-inter text-textSecondary">
        {note.description || "No description provided."}
      </p>

      {/* Access notice */}
      {!isAuthenticated && (
        <p className="text-sm font-inter text-red-500">
          Login required to view or download this note.
        </p>
      )}

      {/* Action */}
      <button
        onClick={handleAccess}
        className="mt-2 px-5 py-2 bg-primary text-white rounded
                   hover:bg-primaryDark transition font-inter"
      >
        {isAuthenticated ? "Open / Download" : "Login to Access"}
      </button>
    </div>
  );
}
