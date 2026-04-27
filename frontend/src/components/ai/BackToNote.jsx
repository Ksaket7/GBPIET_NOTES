import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BackToNote({ noteId }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/notes/${noteId}`)}
      className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-700"
    >
      <ArrowLeft size={16} />
      Back to Note
    </button>
  );
}
