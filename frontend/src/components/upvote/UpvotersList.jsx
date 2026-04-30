import { useEffect, useState } from "react";
import API from "../../services/api";

export default function UpvotersList({ type, id, onClose }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUpvoters = async () => {
      const res = await API.get(`/upvotes/${type}/${id}/users`);
      setUsers(res.data.data);
    };
    fetchUpvoters();
  }, [type, id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm space-y-4 rounded-3xl border border-white/70 bg-white/95 p-5 shadow-2xl backdrop-blur-xl">
        <h3 className="font-poppins text-lg font-semibold text-slate-950">Liked by</h3>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {users.length === 0 ? (
            <p className="text-sm text-slate-500">No likes yet.</p>
          ) : users.map((u) => (
            <div
              key={u._id}
              className="flex items-center gap-3 rounded-2xl bg-slate-50 p-2"
            >
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-indigo-100">
              {u?.avatar ? (
                <img
                  src={u.avatar}
                  alt={u.username}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm font-semibold text-indigo-700">
                  {u?.username?.[0]?.toUpperCase()}
                </span>
              )}
            </div>
              <span className="font-semibold text-slate-800">@{u.username}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="app-button-secondary w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
}
