import { useEffect, useState } from "react";
import { ThumbsUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import LoadingButton from "../ui/LoadingButton";

export default function UpvoteButton({ type, id, label = "", onCountClick, onChanged }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await API.get(`/upvotes/${type}/${id}/count`);
        setCount(res.data.data.count);
      } catch {
        console.error("Failed to fetch upvote count");
      }
    };

    fetchCount();
  }, [type, id]);

  const handleToggle = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const toggleRes = await API.post(`/upvotes/${type}/${id}/toggle`);
      if (toggleRes.data?.success === false) {
        throw new Error(toggleRes.data.message);
      }
      const nextLiked = toggleRes.status === 201;
      const countRes = await API.get(`/upvotes/${type}/${id}/count`);
      const nextCount = countRes.data.data.count;
      setLiked(nextLiked);
      setCount(nextCount);
      onChanged?.({ count: nextCount, liked: nextLiked });
    } catch (err) {
      console.log(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (onCountClick) {
    return (
      <div className="inline-flex overflow-hidden rounded-full border border-white/70 bg-white/70 text-xs font-semibold text-slate-700">
        <LoadingButton
          loading={loading}
          onClick={handleToggle}
          className="gap-2 px-3 py-2 hover:bg-white"
        >
          <ThumbsUp
            size={14}
            className={liked ? "fill-current text-indigo-700" : ""}
          />
          {label || "Like"}
        </LoadingButton>
        
      </div>
    );
  }

  return (
    <LoadingButton
      loading={loading}
      onClick={handleToggle}
      className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-white"
    >
      <ThumbsUp
        size={14}
        className={liked ? "fill-current text-indigo-700" : ""}
      />{" "}
      {label ? `${label} ${count}` : count}
    </LoadingButton>
  );
}
