import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import API from "../../services/api";

function DirectoryUserCard({ directoryUser, onToggleFollow }) {
  return (
    <div className="soft-card flex flex-col items-start gap-4 p-4 sm:flex-row sm:items-center">
      <Link
        to={`/profile/${directoryUser.username}`}
        className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-indigo-100 transition hover:scale-105"
      >
        {directoryUser.avatar ? (
          <img
            src={directoryUser.avatar}
            alt={directoryUser.fullName}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-lg font-semibold text-indigo-700">
            {(directoryUser.fullName || directoryUser.username || "?")
              .charAt(0)
              .toUpperCase()}
          </span>
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          to={`/profile/${directoryUser.username}`}
          className="block truncate font-semibold text-slate-950 transition hover:text-indigo-700"
        >
          {directoryUser.fullName || directoryUser.username}
        </Link>
        <p className="truncate text-sm text-slate-500">
          @{directoryUser.username} - {directoryUser.branch || "GBPIET"} / {directoryUser.year || directoryUser.role || "Student"}
        </p>
        <span className="pill mt-2 capitalize">{directoryUser.role}</span>
      </div>

      <button
        type="button"
        disabled={directoryUser.isSelf}
        onClick={() => onToggleFollow(directoryUser)}
        className={`w-full rounded-full px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto ${
          directoryUser.isFollowing
            ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
            : "bg-slate-950 text-white hover:bg-indigo-700"
        }`}
      >
        {directoryUser.isSelf
          ? "You"
          : directoryUser.isFollowing
            ? "Unfollow"
            : "Follow"}
      </button>
    </div>
  );
}

export default function UsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedType = searchParams.get("type") || "all";
  const [facultyUsers, setFacultyUsers] = useState([]);
  const [studentUsers, setStudentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadUsers = async () => {
      try {
        const [facultyRes, studentsRes] = await Promise.all([
          API.get("/users/faculty"),
          API.get("/users/students"),
        ]);

        if (!mounted) return;
        setFacultyUsers(facultyRes.data?.data || []);
        setStudentUsers(studentsRes.data?.data || []);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadUsers();

    return () => {
      mounted = false;
    };
  }, []);

  const updateFollowState = (targetUserId, isFollowing) => {
    const updateUsers = (users) =>
      users.map((directoryUser) =>
        directoryUser._id === targetUserId
          ? { ...directoryUser, isFollowing }
          : directoryUser
      );

    setFacultyUsers(updateUsers);
    setStudentUsers(updateUsers);
  };

  const handleToggleFollow = async (directoryUser) => {
    if (directoryUser.isSelf) return;

    const nextFollowing = !directoryUser.isFollowing;
    updateFollowState(directoryUser._id, nextFollowing);

    try {
      await API.post(`/follows/toggle/${directoryUser._id}`);
    } catch {
      updateFollowState(directoryUser._id, directoryUser.isFollowing);
    }
  };

  const visibleUsers = useMemo(() => {
    if (selectedType === "faculty") return facultyUsers;
    if (selectedType === "students") return studentUsers;
    return [...facultyUsers, ...studentUsers];
  }, [facultyUsers, selectedType, studentUsers]);

  const tabs = [
    { label: "All", value: "all" },
    { label: "Faculty", value: "faculty" },
    { label: "Students", value: "students" },
  ];

  return (
    <main className="app-page">
      <div className="app-shell space-y-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="pill">Directory</span>
            <h1 className="page-title mt-3">Users</h1>
            <p className="page-subtitle">
              Browse faculty, students, CR users, and admins. Follow people to keep track of them.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setSearchParams({ type: tab.value })}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedType === tab.value
                    ? "bg-slate-950 text-white"
                    : "bg-white/70 text-slate-600 hover:bg-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        {loading ? (
          <div className="glass-panel p-6 text-sm text-slate-500">
            Loading users...
          </div>
        ) : visibleUsers.length === 0 ? (
          <div className="glass-panel p-6 text-sm text-slate-500">
            No users found.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {visibleUsers.map((directoryUser) => (
              <DirectoryUserCard
                key={directoryUser._id}
                directoryUser={directoryUser}
                onToggleFollow={handleToggleFollow}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
