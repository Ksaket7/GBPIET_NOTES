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
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2 className="font-poppins text-2xl font-semibold text-slate-950">
            Comments
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Discuss improvements, doubts, or corrections for this note.
          </p>
        </div>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          {comments.length} comments
        </span>
      </div>

      {/* Comments list */}
      <div className="mt-5 space-y-4">
        {comments.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
            No comments yet.
          </p>
        )}

        {comments.map((c, idx) => (
          <div
            key={idx}
            className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 transition hover:bg-white hover:shadow-sm sm:p-4"
          >
            {/* Avatar */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-indigo-100">
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
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="break-words font-semibold text-slate-950">
                  @{c.user?.username || "unknown"}
                </p>

                <span className="text-xs text-slate-400">
                  {timeAgo(c.createdAt)}
                </span>
              </div>

              <p className="break-words text-slate-600">{c.message}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setFormOpen((value) => !value)}
        className="app-button-secondary mt-5"
      >
        <MessageCircle size={16} />
        {formOpen ? "Hide comment form" : "Add comment"}
      </button>

      {formOpen && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3 rounded-2xl border border-indigo-100 bg-indigo-50/40 p-3 sm:p-4">
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
              {loading ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
