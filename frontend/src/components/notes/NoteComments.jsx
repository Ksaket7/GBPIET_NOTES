import { useEffect, useState } from "react";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function NoteComments({ noteId }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      const res = await API.get(`/notes/${noteId}`);
      setComments(res.data.data.comments || []);
    };
    fetchNote();
  }, [noteId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!message.trim()) return;

    try {
      setLoading(true);
      const res = await API.post(`/notes/${noteId}/comment`, {
        message,
      });
      setComments(res.data.data);
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="font-poppins text-2xl text-textPrimary">Comments</h2>

      <div className="space-y-3">
        {comments.length === 0 && (
          <p className="font-inter text-textSecondary">No comments yet.</p>
        )}

        {comments.map((c, idx) => (
          <div
            key={idx}
            className="border border-borderSoft rounded-lg hover:bg-slate-50 p-4 space-y-1"
          >
            <p className="font-inter text-sm font-medium text-textPrimary">
              @{c.user?.username || "unknown"}
            </p>

            <p className="font-inter text-textSecondary ">{c.message}</p>

            <p className="text-xs text-textSecondary">
              {new Date(c.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Add a comment..."
          className="w-full border border-borderSoft rounded p-3 font-inter"
        />

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-primary text-white rounded
                     hover:bg-primaryDark transition"
        >
          Post Comment
        </button>
      </form>
    </div>
  );
}
