import { useNavigate } from "react-router-dom";

export default function BackToNote({ noteId }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/notes/${noteId}`)}
      className="font-inter text-sm text-primary hover:underline"
    >
      ← Back to Note
    </button>
  );
}
