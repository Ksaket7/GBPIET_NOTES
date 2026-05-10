import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Crown,
  Heart,
  Trophy,
} from "lucide-react";
import API from "../../services/api";

const intensityClass = (count) => {
  if (!count) return "bg-slate-200";
  if (count <= 1) return "bg-blue-300";
  if (count <= 3) return "bg-blue-500";
  return "bg-blue-700";
};

const textIntensityClass = (count) => {
  if (!count) return "text-slate-600";
  if (count <= 1) return "text-blue-900";
  return "text-white";
};

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const formatNumber = (value = 0) => new Intl.NumberFormat("en-IN").format(value);

const buildMonthlyCells = (monthly) => {
  const days = monthly?.days || [];
  if (!days.length) return [];

  const firstDate = new Date(days[0].date);
  const leadingBlanks = firstDate.getDay();
  const trailingBlanks = (7 - ((leadingBlanks + days.length) % 7)) % 7;

  return [
    ...Array.from({ length: leadingBlanks }).map((_, index) => ({
      key: `leading-${index}`,
      blank: true,
    })),
    ...days.map((day) => ({
      ...day,
      key: day.date,
      blank: false,
    })),
    ...Array.from({ length: trailingBlanks }).map((_, index) => ({
      key: `trailing-${index}`,
      blank: true,
    })),
  ];
};

const buildYearMonthCells = (month, year) => {
  const monthIndex = monthNames.findIndex(
    (name) => name.toLowerCase() === month.label?.toLowerCase(),
  );
  const safeMonthIndex = Math.max(monthIndex, 0);
  const leadingBlanks = new Date(year, safeMonthIndex, 1).getDay();
  const days = month.days || [];
  const trailingBlanks = (7 - ((leadingBlanks + days.length) % 7)) % 7;

  return [
    ...Array.from({ length: leadingBlanks }).map((_, index) => ({
      key: `${month.label}-leading-${index}`,
      blank: true,
    })),
    ...days.map((day) => ({
      ...day,
      key: `${month.label}-${day.day}`,
      blank: false,
    })),
    ...Array.from({ length: trailingBlanks }).map((_, index) => ({
      key: `${month.label}-trailing-${index}`,
      blank: true,
    })),
  ];
};

const getYearContributionCount = (yearly) =>
  (yearly?.months || []).reduce(
    (total, month) =>
      total + (month.days || []).reduce((sum, day) => sum + (day.count || 0), 0),
    0,
  );

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
    <section className={`min-w-0 rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>
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
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const response = await API.get("/users/leaderboard-dashboard", {
          params: { page, limit: 10, year: selectedYear },
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
  }, [page, selectedYear]);

  const weekly = dashboard?.activity?.weekly;
  const weeklyMax = weekly?.maxCount || 1;
  const previousMax = useMemo(
    () => Math.max(...(dashboard?.activity?.previousWeeks || []).map((week) => week.count), 1),
    [dashboard?.activity?.previousWeeks],
  );
  const totalPages = dashboard?.pagination?.totalPages || 1;
  const monthlyCells = useMemo(
    () => buildMonthlyCells(dashboard?.activity?.monthly),
    [dashboard?.activity?.monthly],
  );
  const yearlyOverview = dashboard?.activity?.yearly;
  const yearlyContributionCount = useMemo(
    () => getYearContributionCount(yearlyOverview),
    [yearlyOverview],
  );

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

        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <Card className="p-4 sm:p-6">
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

          <Card className="p-4 sm:p-6">
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
              <div className="mt-5 pb-1">
                <div className="w-full">
                  <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                    {weekDays.map((day) => (
                      <div key={day} className="text-center text-[10px] font-bold uppercase text-slate-400">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 grid grid-cols-7 gap-1.5 sm:gap-2">
                    {monthlyCells.map((day) =>
                      day.blank ? (
                        <div key={day.key} className="aspect-square rounded-lg bg-transparent" />
                      ) : (
                        <div
                          key={day.key}
                          title={`${new Date(day.date).toLocaleDateString()} - ${day.count} activities`}
                          className={`relative flex aspect-square items-center justify-center rounded-xl border border-white shadow-sm ${intensityClass(day.count)}`}
                        >
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-full bg-white/45 text-[10px] font-bold shadow-sm sm:h-6 sm:w-6 sm:text-[11px] ${textIntensityClass(day.count)}`}
                          >
                            {day.day}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        <Card className="p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays size={18} className="text-indigo-600" />
              <h2 className="text-lg font-semibold">Yearly Overview</h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={selectedYear}
                onChange={(event) => setSelectedYear(Number(event.target.value))}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
              >
                {(yearlyOverview?.availableYears || [new Date().getFullYear(), new Date().getFullYear() - 1]).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Less</span>
                {[0, 1, 2, 4].map((count) => (
                  <span key={count} className={`h-3 w-3 rounded-sm ${intensityClass(count)}`} />
                ))}
                <span>More</span>
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm font-medium text-slate-600">
            {loading
              ? "Loading yearly contributions..."
              : `${formatNumber(yearlyContributionCount)} contributions in ${yearlyOverview?.year || selectedYear}`}
          </p>
          {loading ? (
            <Skeleton className="mt-6 h-28" />
          ) : (
            <div className="mt-6 overflow-x-auto pb-2">
              <div className="flex min-w-max gap-5 lg:grid lg:min-w-0 lg:grid-cols-12 lg:gap-1 xl:gap-2">
                {yearlyOverview?.months?.map((month) => (
                  <div key={month.label} className="shrink-0 lg:min-w-0">
                    <p className="mb-3 max-w-[80px] truncate text-[10px] font-bold uppercase text-slate-500">
                      {month.label}
                    </p>
                    <div className="grid grid-flow-col grid-rows-7 gap-0.5 lg:gap-px xl:gap-0.5">
                      {buildYearMonthCells(month, yearlyOverview.year).map((day) =>
                      day.blank ? (
                        <span
                          key={day.key}
                          className="h-6 w-6 rounded-md bg-transparent lg:h-3.5 lg:w-3.5 xl:h-4 xl:w-4"
                        />
                      ) : (
                        <span
                          key={day.key}
                          title={`${month.label} ${day.day}: ${day.count} activities`}
                          className={`h-6 w-6 rounded-md border border-white shadow-sm lg:h-3.5 lg:w-3.5 xl:h-4 xl:w-4 ${intensityClass(day.count)}`}
                        />
                      ),
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        <Card className="overflow-hidden">
          <div className="p-4 sm:p-6">
            <div className="flex items-center gap-2">
              <Trophy size={18} className="text-indigo-600" />
              <h2 className="text-lg font-semibold">Top Contributors Leaderboard</h2>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Ranked by original content contribution activity
            </p>
          </div>

          <div className="space-y-3 px-4 pb-4 md:hidden">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-24" />
              ))
            ) : dashboard?.leaderboard?.length ? (
              dashboard.leaderboard.map((user) => (
                <article
                  key={user._id}
                  className={`rounded-2xl border border-slate-100 p-4 ${
                    user.rank <= 3 ? "bg-indigo-50/50" : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        user.rank === 1
                          ? "bg-amber-500 text-white"
                          : user.rank === 2
                            ? "bg-slate-300 text-slate-700"
                            : user.rank === 3
                              ? "bg-orange-100 text-orange-700"
                              : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {user.rank <= 3 ? <Crown size={15} /> : user.rank}
                    </span>
                    <Avatar user={user} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-indigo-700">
                        {user.fullName}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        @{user.username}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-500">
                    <p className="rounded-xl bg-white/70 p-3">
                      <span className="block font-semibold text-slate-950">Branch / Year</span>
                      {user.branch || "GBPIET"} / {user.year || "Year pending"}
                    </p>
                    <p className="rounded-xl bg-white/70 p-3">
                      <span className="block font-semibold text-slate-950">Score</span>
                      {formatNumber(user.score)}
                    </p>
                    <p className="rounded-xl bg-white/70 p-3">
                      <span className="block font-semibold text-slate-950">Contributions</span>
                      {formatNumber(user.contributionsCount)}
                    </p>
                    <p className="rounded-xl bg-white/70 p-3">
                      <span className="block font-semibold text-slate-950">Likes</span>
                      {formatNumber(user.likesEarned)}
                    </p>
                  </div>
                </article>
              ))
            ) : (
              <p className="rounded-2xl bg-slate-50 px-4 py-8 text-center text-slate-500">
                No contributors yet.
              </p>
            )}
          </div>

          <div className="hidden md:block">
            <table className="w-full text-left text-sm">
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

          <div className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
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
