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
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-surface rounded-lg p-6 w-full max-w-sm space-y-4">
        <h3 className="font-poppins text-lg">Upvoted by</h3>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {users.map((u) => (
            <div
              key={u._id}
              className="flex items-center gap-2 font-inter"
            >
              <div className="w-10 h-10 rounded-full bg-borderSoft overflow-hidden flex items-center justify-center">
              {u?.avatar ? (
                <img
                  src={u.avatar}
                  alt={u.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-inter text-sm text-textSecondary">
                  {u?.username?.[0]?.toUpperCase()}
                </span>
              )}
            </div>
              <span className="font-medium">@{u.username}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 border border-borderSoft rounded hover:bg-borderSoft"
        >
          Close
        </button>
      </div>
    </div>
  );
}
