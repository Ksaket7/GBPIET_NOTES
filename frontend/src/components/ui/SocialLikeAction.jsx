import { ThumbsUp } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";
import LikedUsersModal from "./LikedUsersModal";

export default function SocialLikeAction({ type, id, className = "inline-flex items-center" }) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLikedUsers, setShowLikedUsers] = useState(false);

  const loadLikers = useCallback(async (mounted = true) => {
    try {
      const res = await API.get(`/upvotes/${type}/${id}/users`);
      const users = res.data?.data || [];
      if (!mounted) return;
      setCount(users.length);
      setLiked(users.some((likedUser) => likedUser._id === user?._id));
    } catch {
      if (!mounted) return;
      setCount(0);
      setLiked(false);
    }
  }, [id, type, user?._id]);

  useEffect(() => {
    let mounted = true;
    loadLikers(mounted);
    return () => {
      mounted = false;
    };
  }, [loadLikers]);

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post(`/upvotes/${type}/${id}/toggle`);
      setLiked(res.status === 201);
      await loadLikers(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={className}>
        <button
          type="button"
          onClick={handleToggleLike}
          disabled={loading}
          className={`inline-flex items-center gap-2 rounded-l-full border border-r-0 border-white/70 bg-white/70 px-3 py-2 text-xs font-semibold transition hover:bg-white disabled:opacity-60 ${
            liked ? "text-indigo-700" : "text-slate-700"
          }`}
          aria-label={liked ? "Unlike" : "Like"}
        >
          <ThumbsUp size={14} className={liked ? "fill-current text-indigo-700" : ""} />
          Like
        </button>
        <button
          type="button"
          onClick={() => setShowLikedUsers(true)}
          className="rounded-r-full border border-white/70 bg-white/70 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-white hover:text-indigo-700"
        >
          {count}
        </button>
      </div>

      {showLikedUsers && (
        <LikedUsersModal
          type={type}
          id={id}
          onClose={() => setShowLikedUsers(false)}
        />
      )}
    </>
  );
}
