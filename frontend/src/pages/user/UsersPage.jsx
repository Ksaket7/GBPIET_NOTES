import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { GraduationCap, MapPin, UserRoundCheck } from "lucide-react";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function DirectoryUserCard({ directoryUser, onToggleFollow }) {
  const displayName = directoryUser.fullName || directoryUser.username || "GBPIET user";
  const branch = directoryUser.branch || "GBPIET";
  const year = directoryUser.year || directoryUser.role || "Student";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
      <Link
        to={`/profile/${directoryUser.username}`}
            className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 ring-4 ring-indigo-50 transition hover:scale-105"
      >
        {directoryUser.avatar ? (
          <img
            src={directoryUser.avatar}
                alt={displayName}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-lg font-semibold text-indigo-700">
                {displayName.charAt(0).toUpperCase()}
          </span>
        )}
      </Link>

          <div className="min-w-0">
        <Link
          to={`/profile/${directoryUser.username}`}
              className="block truncate font-poppins text-base font-semibold text-slate-950 transition hover:text-indigo-700"
        >
              {displayName}
        </Link>
        <p className="truncate text-sm text-slate-500">
              @{directoryUser.username || "student"}
        </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                <MapPin size={13} />
                {branch}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                <GraduationCap size={13} />
                {year}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold capitalize text-slate-500">
                <UserRoundCheck size={13} />
                {directoryUser.role || "student"}
              </span>
            </div>
          </div>
      </div>

      <button
        type="button"
        disabled={directoryUser.isSelf}
        onClick={() => onToggleFollow(directoryUser)}
          className={`inline-flex w-full shrink-0 items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${
          directoryUser.isFollowing
              ? "border border-indigo-100 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
              : "bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:-translate-y-0.5 hover:bg-indigo-700"
        }`}
      >
        {directoryUser.isSelf
          ? "You"
          : directoryUser.isFollowing
              ? "Following"
            : "Follow"}
      </button>
      </div>
    </article>
  );
}

export default function UsersPage() {
  const { user } = useAuth();
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
    const users =
      selectedType === "faculty"
        ? facultyUsers
        : selectedType === "students"
          ? studentUsers
          : [...facultyUsers, ...studentUsers];

    return users.filter(
      (directoryUser) =>
        !directoryUser.isSelf &&
        directoryUser._id !== user?._id &&
        directoryUser.username !== user?.username
    );
  }, [facultyUsers, selectedType, studentUsers, user?._id, user?.username]);

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
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                    : "border border-slate-200 bg-white/80 text-slate-600 hover:border-indigo-100 hover:bg-indigo-50 hover:text-indigo-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        <section className="mx-auto w-full max-w-3xl">
          {loading ? (
            <div className="rounded-2xl border border-white/70 bg-white/80 p-6 text-sm text-slate-500 shadow-sm">
            Loading users...
          </div>
          ) : visibleUsers.length === 0 ? (
            <div className="rounded-2xl border border-white/70 bg-white/80 p-6 text-sm text-slate-500 shadow-sm">
            No users found.
          </div>
          ) : (
            <div className="flex flex-col gap-4">
            {visibleUsers.map((directoryUser) => (
              <DirectoryUserCard
                key={directoryUser._id}
                directoryUser={directoryUser}
                onToggleFollow={handleToggleFollow}
              />
            ))}
          </div>
          )}
        </section>
      </div>
    </main>
  );
}
