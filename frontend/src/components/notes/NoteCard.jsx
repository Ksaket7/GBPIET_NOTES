import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UpvoteButton from "../upvote/UpvoteButton";

export default function NoteCard({ note }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleOpen = (event) => {
    event.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    window.open(note.fileUrl, "_blank");
  };

  return (
    <div
      onClick={() => navigate(`/notes/${note._id}`)}
      className="soft-card cursor-pointer p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-2xl bg-indigo-100 p-3 text-indigo-600">
          <FileText size={20} />
        </span>
        {note.verified && (
          <span className="pill bg-emerald-50 text-emerald-700">Verified</span>
        )}
      </div>

      <div className="mt-5 space-y-2">
        <h3 className="font-poppins text-lg font-semibold text-slate-950">
          {note.title}
        </h3>
        <p className="text-sm text-slate-500">
          {note.subjectCode || "Subject"} - {note.type || "Material"}
        </p>
        <p className="text-sm text-slate-500">
          Uploaded by {note.uploadedBy?.fullName || "GBPIET"}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <UpvoteButton type="note" id={note._id} />
        <button
          type="button"
          onClick={handleOpen}
          className="rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
        >
          {isAuthenticated ? "Open" : "Login"}
        </button>
      </div>
    </div>
  );
}
