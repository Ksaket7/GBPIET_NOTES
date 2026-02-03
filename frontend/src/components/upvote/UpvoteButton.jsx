import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function UpvoteButton({ type, id }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // 🔹 fetch upvote count (public)
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await API.get(`/upvotes/${type}/${id}/count`);
        setCount(res.data.data.count);
      } catch (err) {
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

      // ✅ backend success flag
      if (toggleRes.data?.success === false) {
        throw new Error(toggleRes.data.message);
      }

      // 🔄 refresh count
      const countRes = await API.get(`/upvotes/${type}/${id}/count`);
      setCount(countRes.data.data.count);
    } catch (err) {
      console.log(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="flex items-center gap-1 text-sm font-inter
                 px-2 py-1 border border-borderSoft rounded
                 hover:bg-borderSoft transition disabled:opacity-50"
    >
      <span>👍</span>
      <span>{count}</span>
    </button>
  );
}
