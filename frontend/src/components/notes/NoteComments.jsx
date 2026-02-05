import { useEffect, useState } from "react";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { timeAgo } from "../../utils/timeAgo";

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

      {/* Comments list */}
      <div className="space-y-4">
        {comments.length === 0 && (
          <p className="font-inter text-textSecondary">No comments yet.</p>
        )}

        {comments.map((c, idx) => (
          <div
            key={idx}
            className="flex gap-3 border border-borderSoft rounded-lg p-4"
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-borderSoft overflow-hidden flex items-center justify-center">
              {c.user?.avatar ? (
                <img
                  src={c.user.avatar}
                  alt={c.user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-inter text-sm text-textSecondary">
                  {c.user?.username?.[0]?.toUpperCase()}
                </span>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-inter font-medium text-textPrimary">
                  @{c.user?.username || "unknown"}
                </p>

                <span className="text-xs text-textSecondary">
                  {timeAgo(c.createdAt)}
                </span>
              </div>

              <p className="font-inter text-textSecondary">{c.message}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={
            isAuthenticated ? "Write a comment..." : "Login to add a comment"
          }
          disabled={!isAuthenticated || loading}
          rows={3}
          className="w-full border border-borderSoft rounded-lg p-3
               font-inter focus:outline-none focus:ring-2
               focus:ring-primary disabled:opacity-60"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isAuthenticated || loading}
            className="px-4 py-2 bg-primary text-white rounded
                 hover:bg-primaryDark transition
                 disabled:opacity-50"
          >
            Post Comment
          </button>
        </div>
      </form>
    </div>
  );
}
