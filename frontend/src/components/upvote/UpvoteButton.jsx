import { useEffect, useState } from "react";
import { ThumbsUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import LoadingButton from "../ui/LoadingButton";

export default function UpvoteButton({ type, id }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
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
      const countRes = await API.get(`/upvotes/${type}/${id}/count`);
      setCount(countRes.data.data.count);
    } catch (err) {
      console.log(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoadingButton
      loading={loading}
      onClick={handleToggle}
      className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-white"
    >
      <ThumbsUp size={14} /> {count}
    </LoadingButton>
  );
}
