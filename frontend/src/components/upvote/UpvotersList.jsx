import { useEffect, useState } from "react";
import API from "../../services/api";
import FormModal from "../ui/FormModal";

const initialsFor = (user) => {
  const source = user?.fullName || user?.username || "U";

  return source
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

function Avatar({ user, className = "h-10 w-10" }) {
  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.fullName || user.username || "User"}
        className={`${className} shrink-0 rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`${className} flex shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700`}
    >
      {initialsFor(user)}
    </div>
  );
}

function SkeletonCard({ compact = false }) {
  return (
    <div className={`rounded-2xl border border-slate-100 bg-white ${compact ? "p-3" : "p-4"}`}>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-full bg-slate-100" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-28 animate-pulse rounded bg-slate-100" />
          <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

export default function UpvotersList({ type, id, onClose }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchUpvoters = async () => {
      try {
        const res = await API.get(`/upvotes/${type}/${id}/users`);

        if (mounted) {
          setUsers(res.data?.data || []);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchUpvoters();

    return () => {
      mounted = false;
    };
  }, [type, id]);

  return (
    <FormModal title="Liked by" onClose={onClose}>
      <div className="rounded-[24px] bg-white p-5 sm:p-6">
        <h2 className="font-poppins text-xl font-semibold text-slate-950">
          Liked by
        </h2>

        <div className="mt-4 max-h-[60vh] space-y-3 overflow-y-auto pr-1">
          {loading ? (
            [1, 2, 3].map((item) => (
              <SkeletonCard key={item} compact />
            ))
          ) : users.length ? (
            users.map((u) => (
              <div
                key={u._id}
                className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3"
              >
                <Avatar user={u} />

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-950">
                    {u.fullName || u.username || "Student"}
                  </p>

                  <p className="truncate text-xs text-slate-500">
                    @{u.username || "user"}
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
