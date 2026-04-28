import { useEffect, useState } from "react";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { timeAgo } from "../../utils/timeAgo";
import { MessageCircle } from "lucide-react";

export default function NoteComments({ noteId }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

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
    <section className="glass-panel space-y-6 p-6">
      <h2 className="font-poppins text-2xl font-semibold text-slate-950">Comments</h2>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.length === 0 && (
          <p className="text-sm text-slate-500">No comments yet.</p>
        )}

        {comments.map((c, idx) => (
          <div
            key={idx}
            className="flex gap-3 rounded-3xl bg-white/65 p-4"
          >
            {/* Avatar */}
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-indigo-100">
              {c.user?.avatar ? (
                <img
                  src={c.user.avatar}
                  alt={c.user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm font-semibold text-indigo-700">
                  {c.user?.username?.[0]?.toUpperCase()}
                </span>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-slate-950">
                  @{c.user?.username || "unknown"}
                </p>

                <span className="text-xs text-slate-400">
                  {timeAgo(c.createdAt)}
                </span>
              </div>

              <p className="text-slate-600">{c.message}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setFormOpen((value) => !value)}
        className="app-button-secondary"
      >
        <MessageCircle size={16} />
        {formOpen ? "Hide comment form" : "Add comment"}
      </button>

      {formOpen && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              isAuthenticated ? "Write a comment..." : "Login to add a comment"
            }
            disabled={!isAuthenticated || loading}
            rows={3}
            className="app-input min-h-28 disabled:opacity-60"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!isAuthenticated || loading}
              className="app-button disabled:opacity-50"
            >
              Post Comment
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
