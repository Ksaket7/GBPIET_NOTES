import { useEffect, useState } from "react";
import API from "../../services/api";
import FormModal from "./FormModal";
import SkeletonCard from "./SkeletonCard";
import UserAvatar from "./UserAvatar";

export default function LikedUsersModal({ type, id, title = "Liked by", onClose }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadUsers = async () => {
      try {
        const res = await API.get(`/upvotes/${type}/${id}/users`);
        if (mounted) setUsers(res.data?.data || []);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadUsers();

    return () => {
      mounted = false;
    };
  }, [id, type]);

  return (
    <FormModal title={title} onClose={onClose}>
      <div className="rounded-[24px] bg-white p-5 sm:p-6">
        <h2 className="font-poppins text-xl font-semibold text-slate-950">
          {title}
        </h2>
        <div className="mt-4 max-h-[60vh] space-y-3 overflow-y-auto pr-1">
          {loading ? (
            [1, 2, 3].map((item) => <SkeletonCard key={item} compact />)
          ) : users.length ? (
            users.map((likedUser) => (
              <div
                key={likedUser._id}
                className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3"
              >
                <UserAvatar user={likedUser} className="h-10 w-10" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-950">
                    {likedUser.fullName || likedUser.username || "GBPIET user"}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    @{likedUser.username || likedUser.email || "user"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
              No likes yet.
            </p>
          )}
        </div>
      </div>
    </FormModal>
  );
}
