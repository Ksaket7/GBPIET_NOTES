import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Crown,
  Heart,
  Trophy,
} from "lucide-react";
import API from "../../services/api";

const intensityClass = (count) => {
  if (!count) return "bg-slate-100";
  if (count <= 1) return "bg-blue-100";
  if (count <= 3) return "bg-blue-300";
  return "bg-blue-600";
};

const formatNumber = (value = 0) => new Intl.NumberFormat("en-IN").format(value);

const initialsFor = (user) => {
  const source = user?.username || user?.fullName || "User";
  return source
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

function Avatar({ user }) {
  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.username || user.fullName}
        className="h-10 w-10 rounded-xl object-cover"
      />
    );
  }

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-xs font-bold text-indigo-700">
      {initialsFor(user)}
    </div>
  );
}

function Card({ children, className = "" }) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>
      {children}
    </section>
  );
}

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-xl bg-slate-100 ${className}`} />;
}

export default function LeaderboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const response = await API.get("/users/leaderboard-dashboard", {
          params: { page, limit: 10 },
        });
        if (active) setDashboard(response.data.data);
      } catch (error) {
        console.error("Failed to fetch leaderboard dashboard:", error);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchDashboard();
    return () => {
      active = false;
    };
  }, [page]);

  const weekly = dashboard?.activity?.weekly;
  const weeklyMax = weekly?.maxCount || 1;
  const previousMax = useMemo(
    () => Math.max(...(dashboard?.activity?.previousWeeks || []).map((week) => week.count), 1),
    [dashboard?.activity?.previousWeeks],
  );
  const totalPages = dashboard?.pagination?.totalPages || 1;

  return (
    <main className="app-page">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <header>
          <p className="pill">Leaderboard</p>
          <h1 className="mt-3 font-poppins text-3xl font-semibold text-slate-950">
            Activity Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Track your contribution journey and see where you stand in the GBPIET community.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.6fr]">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Your Activity</h2>
              <span className="text-xs font-semibold text-slate-500">Last 7 Days</span>
            </div>
            {loading ? (
              <Skeleton className="mt-6 h-44" />
            ) : (
              <>
                <div className="mt-8 flex h-40 items-end justify-between gap-2">
                  {weekly?.days?.map((day) => (
                    <div key={day.date} className="group flex flex-1 flex-col items-center gap-2">
                      <div className="relative flex h-28 w-full max-w-8 items-end rounded-full bg-slate-100">
                        <div
                          className={`w-full rounded-full transition ${
                            day.isToday ? "bg-indigo-600" : "bg-indigo-200"
                          }`}
                          style={{ height: `${Math.max((day.count / weeklyMax) * 100, day.count ? 12 : 4)}%` }}
                        />
                        <span className="pointer-events-none absolute -top-9 left-1/2 hidden -translate-x-1/2 rounded-lg bg-slate-950 px-2 py-1 text-xs text-white group-hover:block">
                          {day.count} activities
                        </span>
                      </div>
                      <span className={`text-[10px] font-semibold ${day.isToday ? "text-indigo-600" : "text-slate-500"}`}>
                        {day.label.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <p className="mb-3 text-sm font-semibold text-slate-700">Previous Weeks</p>
                  <div className="grid grid-cols-4 gap-2">
                    {dashboard?.activity?.previousWeeks?.map((week) => (
                      <div key={week.label} className="rounded-lg bg-slate-50 p-2">
                        <div className="h-12 rounded bg-indigo-50">
                          <div
                            className="h-full rounded bg-indigo-300"
                            style={{ width: `${Math.max((week.count / previousMax) * 100, week.count ? 12 : 4)}%` }}
                            title={`${week.count} activities`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Monthly Activity</h2>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{dashboard?.activity?.monthly?.label || "This month"}</span>
                <span>Less</span>
                {[0, 1, 2, 4].map((count) => (
                  <span key={count} className={`h-3 w-3 rounded-sm ${intensityClass(count)}`} />
                ))}
                <span>More</span>
              </div>
            </div>
            {loading ? (
              <Skeleton className="mt-6 h-44" />
            ) : (
              <div className="mt-6 grid grid-cols-7 gap-2 overflow-x-auto pb-1">
                {dashboard?.activity?.monthly?.days?.map((day) => (
                  <div
                    key={day.date}
                    title={`${new Date(day.date).toLocaleDateString()} - ${day.count} activities`}
                    className={`h-5 w-5 rounded ${intensityClass(day.count)}`}
                  />
                ))}
              </div>
            )}
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <CalendarDays size={18} className="text-indigo-600" />
            <h2 className="text-lg font-semibold">Yearly Overview</h2>
          </div>
          {loading ? (
            <Skeleton className="mt-6 h-28" />
          ) : (
            <div className="mt-6 flex gap-8 overflow-x-auto pb-2">
              {dashboard?.activity?.yearly?.months?.map((month) => (
                <div key={month.label} className="shrink-0">
                  <p className="mb-3 text-[10px] font-bold uppercase text-slate-500">{month.label}</p>
                  <div className="grid grid-cols-7 gap-1">
                    {month.days.map((day) => (
                      <span
                        key={`${month.label}-${day.day}`}
                        title={`${month.label} ${day.day}: ${day.count} activities`}
                        className={`h-3 w-3 rounded-sm ${intensityClass(day.count)}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-2">
              <Trophy size={18} className="text-indigo-600" />
              <h2 className="text-lg font-semibold">Top Contributors Leaderboard</h2>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Ranked by original content contribution activity
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full text-left text-sm">
              <thead className="border-y border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4"># Rank</th>
                  <th className="px-6 py-4">Contributor</th>
                  <th className="px-6 py-4">Branch / Year</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4">Contributions</th>
                  <th className="px-6 py-4">Likes</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <tr key={index} className="border-b border-slate-100">
                      <td colSpan="6" className="px-6 py-4">
                        <Skeleton className="h-10" />
                      </td>
                    </tr>
                  ))
                ) : dashboard?.leaderboard?.length ? (
                  dashboard.leaderboard.map((user) => (
                    <tr
                      key={user._id}
                      className={`border-b border-slate-100 transition hover:bg-indigo-50/40 ${
                        user.rank <= 3 ? "bg-indigo-50/35" : "bg-white"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                            user.rank === 1
                              ? "bg-amber-500 text-white"
                              : user.rank === 2
                                ? "bg-slate-300 text-slate-700"
                                : user.rank === 3
                                  ? "bg-orange-100 text-orange-700"
                                  : "text-slate-600"
                          }`}
                        >
                          {user.rank <= 3 ? <Crown size={15} /> : user.rank}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar user={user} />
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-indigo-700">{user.fullName}</p>
                            <p className="truncate text-xs text-slate-500">@{user.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {user.branch || "GBPIET"} / {user.year || "Year pending"}
                      </td>
                      <td className="px-6 py-4 font-semibold text-indigo-700">{formatNumber(user.score)}</td>
                      <td className="px-6 py-4 text-slate-600">{formatNumber(user.contributionsCount)}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-2 font-semibold text-rose-500">
                          <Heart size={15} fill="currentColor" />
                          {formatNumber(user.likesEarned)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                      No contributors yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Showing page {dashboard?.pagination?.currentPage || page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((value) => Math.max(value - 1, 1))}
                disabled={page === 1 || loading}
                className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }).slice(0, 5).map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    className={`h-9 w-9 rounded-lg text-sm font-semibold ${
                      page === pageNumber
                        ? "bg-indigo-600 text-white"
                        : "border border-slate-200 bg-white text-slate-600"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => setPage((value) => Math.min(value + 1, totalPages))}
                disabled={page === totalPages || loading}
                className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
