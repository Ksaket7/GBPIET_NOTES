import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function NotePreview({ note }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleOpen = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    window.open(note.fileUrl, "_blank");
  };

  return (
    <div className="bg-surface border border-borderSoft rounded-lg p-6 space-y-4">
      <h2 className="font-poppins text-xl text-textPrimary">
        Note Preview
      </h2>

      <p className="font-inter text-textSecondary">
        {note.description || "No description provided."}
      </p>

      <button
        onClick={handleOpen}
        className="px-5 py-2 bg-primary text-white rounded
                   hover:bg-primaryDark transition font-inter"
      >
        {isAuthenticated ? "Open / Download" : "Login to access"}
      </button>
    </div>
  );
}
