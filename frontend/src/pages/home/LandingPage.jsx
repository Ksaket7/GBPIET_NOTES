import { createElement, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  Bookmark,
  BookOpen,
  FilePlus2,
  Heart,
  MessageSquare,
  Sparkles,
  ThumbsUp,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import API from "../../services/api";

const emptyLandingData = {
  stats: { notes: 0, students: 0, questions: 0 },
};

const featureCards = [
  [
    FilePlus2,
    "Upload & Earn",
    "Share your hard work. Every upload earns you credits that unlock premium study guides and AI features.",
    "bg-violet-100 text-violet-600",
  ],
  [
    UserPlus,
    "Follow Contributors",
    "Get notified when top students from your branch upload new materials. Build your academic network.",
    "bg-indigo-100 text-indigo-600",
  ],
  [
    Heart,
    "Like & Save",
    "Create personal collections of the best study material. Access your saved notes offline anywhere.",
    "bg-rose-100 text-rose-500",
  ],
  [
    MessageSquare,
    "Ask Questions",
    "Stuck on a problem? Post it to the community forum and get answers from students who've been there.",
    "bg-orange-100 text-orange-700",
  ],
];

const activityIcons = {
  upload: BookOpen,
  question: MessageSquare,
  post: Heart,
};

const formatNumber = (value = 0) => {
  const number = Number(value) || 0;
  if (number >= 1000) {
    const rounded = number / 1000;
    return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(1)}k`;
  }
  return new Intl.NumberFormat("en-IN").format(number);
};

const initialsFor = (user) => {
  const source = user?.username || user?.name || user?.fullName || "User";
  return source
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const roleLabel = (role) => {
  const labels = {
    cr: "CR",
    faculty: "Faculty",
    admin: "Admin",
    student: "Student",
  };

  return labels[role] || role || "Contributor";
};

function ActionButtons({ dark = false }) {
  return (
    <div className="flex flex-col justify-center gap-3 sm:flex-row">
      <Link
        to="/signup"
        className={`inline-flex w-full items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5 sm:w-auto ${
          dark
            ? "bg-white text-indigo-700 shadow-lg shadow-indigo-950/15 hover:bg-indigo-50"
            : "bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700"
        }`}
      >
        Get Started
      </Link>
      <Link
        to="/login"
        className={`inline-flex w-full items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5 sm:w-auto ${
          dark
            ? "bg-indigo-800/55 text-white hover:bg-indigo-900/60"
            : "bg-white text-indigo-700 shadow-sm hover:bg-indigo-50"
        }`}
      >
        Login
      </Link>
    </div>
  );
}

function Avatar({ user, size = "h-14 w-14" }) {
  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.name || user.username || "Contributor"}
        className={`${size} shrink-0 rounded-full object-cover shadow-sm`}
      />
    );
  }

  return (
    <div
      className={`${size} flex shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-600`}
    >
      {initialsFor(user)}
    </div>
  );
}

function EmptyState({ children }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm font-medium text-slate-500">
      {children}
    </div>
  );
}

export default function LandingPage() {
  const [statsData, setStatsData] = useState(emptyLandingData.stats);
  const [topContributors, setTopContributors] = useState([]);
  const [topNotes, setTopNotes] = useState([]);
  const [activityData, setActivityData] = useState({
    activeUsersOnline: 0,
    activity: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchLandingData = async () => {
      try {
        const [statsRes, contributorsRes, notesRes, activityRes] =
          await Promise.allSettled([
            API.get("/users/landing"),
            API.get("/users/top-contributors"),
            API.get("/notes/top"),
            API.get("/activity/recent"),
          ]);

        if (!active) return;

        if (statsRes.status === "fulfilled") {
          setStatsData(
            statsRes.value.data?.data?.stats || emptyLandingData.stats,
          );
        }

        if (contributorsRes.status === "fulfilled") {
          setTopContributors(contributorsRes.value.data?.data || []);
        }

        if (notesRes.status === "fulfilled") {
          setTopNotes(notesRes.value.data?.data || []);
        }

        if (activityRes.status === "fulfilled") {
          setActivityData({
            activeUsersOnline:
              activityRes.value.data?.data?.activeUsersOnline || 0,
            activity: activityRes.value.data?.data?.activity || [],
          });
        }
      } catch (error) {
        console.error("Failed to fetch landing data:", error);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchLandingData();

    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(
    () => [
      ["Contributed Notes", statsData?.notes, BookOpen],
      ["Active Students", statsData?.students, Users],
      ["Solved Questions", statsData?.questions, MessageSquare],
    ],
    [statsData],
  );

  const topContributor = topContributors[0];
  const sideContributors = topContributors.slice(1, 3);
  const notes = topNotes.slice(0, 3);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f6f7fb] text-slate-950">
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 py-14 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(79,70,229,0.24),transparent_34%),linear-gradient(180deg,#ececff_0%,#faf9fd_58%,#ffffff_100%)]" />
        <div className="relative mx-auto w-full max-w-5xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-4 py-2 text-xs font-semibold text-indigo-700 shadow-sm">
            <Sparkles size={14} />
            Elevating GBPIET's Academic Excellence
          </div>

          <h1 className="mx-auto mt-6 max-w-4xl break-words font-poppins text-3xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            All Your College Notes.
            <span className="block text-indigo-600">One Smart Community.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600">
            Upload notes, discover top study material, follow contributors, ask
            questions, and get AI help.
          </p>

          <div className="mt-8">
            <ActionButtons />
          </div>

          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
            {stats.map(([label, value, icon]) => {
              const Icon = icon;
              return (
                <div
                  key={label}
                  className="rounded-2xl border border-white bg-white/90 px-4 py-4 shadow-lg shadow-indigo-100/70 transition hover:-translate-y-0.5"
                >
                  <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                    <Icon size={16} />
                  </div>
                  <p className="text-lg font-bold text-slate-950">
                    {loading ? "..." : formatNumber(value)}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    {label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-poppins text-2xl font-semibold leading-none">
              Academic Titans
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Meet the top contributors fueling our community knowledge.
            </p>
          </div>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:translate-x-0.5 hover:text-indigo-800"
          >
            View Leaderboard
            <ArrowRight size={20} />
          </Link>
        </div>

        {loading ? (
          <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-48 animate-pulse rounded-2xl bg-white shadow-sm"
              />
            ))}
          </div>
        ) : topContributors.length ? (
          <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {topContributor && (
              <article className="relative flex min-h-48 min-w-0 flex-col rounded-2xl border-2 border-indigo-100 bg-white px-5 py-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:col-span-1 sm:items-center sm:justify-center lg:col-span-1 lg:px-9 xl:col-span-1">
                {/* Top Badge */}
                <div className="absolute right-3 top-3 max-w-[calc(100%-1.5rem)] rounded-full bg-indigo-600 px-2.5 py-1 text-[10px] font-semibold text-white sm:right-4 sm:top-4 sm:px-3 sm:text-xs">
                  TOP CONTRIBUTOR
                </div>

                <div className="flex w-full min-w-0 flex-col items-center gap-5 text-center lg:flex-row lg:items-center lg:gap-6 lg:text-left">
                  {/* Avatar */}
                  <Avatar
                    user={topContributor}
                    size="h-20 w-20 lg:h-24 lg:w-24"
                  />

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    {/* Name */}
                    <h3 className="truncate font-poppins text-xl font-semibold text-slate-800 lg:text-2xl">
                      {topContributor.name}
                    </h3>

                    {/* Branch + Year */}
                    <p className="mt-1 text-sm font-medium text-slate-500">
                      {topContributor.branch || "GBPIET"} |{" "}
                      {roleLabel(topContributor.year)}
                    </p>

                    {/* Stats */}
                    <div className="mt-5 flex flex-wrap justify-center gap-4 text-sm sm:gap-6 lg:justify-start xl:gap-8">
                      <div className="text-center">
                        <p className="text-lg font-bold text-indigo-600">
                          {formatNumber(topContributor.uploads)}
                        </p>
                        <p className="text-slate-500">Uploads</p>
                      </div>

                      <div className="text-center">
                        <p className="text-lg font-bold text-indigo-600">
                          {formatNumber(topContributor.likes)}
                        </p>
                        <p className="text-slate-500">Likes</p>
                      </div>

                      <div className="text-center">
                        <p className="text-lg font-bold text-indigo-600">
                          {formatNumber(topContributor.credits)}
                        </p>
                        <p className="text-slate-500">Credits</p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            )}

            {sideContributors.map((user) => (
              <article
                key={user.id || user.name}
                className="flex min-h-48 min-w-0 flex-col rounded-2xl bg-white px-5 py-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:px-7"
              >
                <Avatar user={user} size="mx-auto h-20 w-20" />
                <h3 className="mt-5 truncate font-poppins text-base font-semibold">
                  {user.name}
                </h3>
                <p className="mt-1 truncate text-sm font-medium text-slate-500">
                  {user.branch || "GBPIET"} | {roleLabel(user.year)}
                </p>
                <div className="mt-auto flex justify-evenly gap-3 border-t border-slate-100 pt-4 text-xs font-bold text-slate-700">
                  <span>{formatNumber(user.uploads)} Up</span>
                  <span>{formatNumber(user.likes)} Lk</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-7">
            <EmptyState>
              No contributors yet. The first active users will appear here.
            </EmptyState>
          </div>
        )}
      </section>

      <section className="bg-[#f1f3f7]">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-poppins text-3xl font-semibold">
              High-Performance Notes
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              The most saved and appreciated resources by your peers.
            </p>
          </div>

          {loading ? (
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-72 animate-pulse rounded-2xl bg-white shadow-sm"
                />
              ))}
            </div>
          ) : notes.length ? (
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {notes.map((note) => (
                <article
                  key={note.id}
                  className="flex min-h-[320px] flex-col rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold uppercase text-indigo-600">
                      {note.subjectCode || note.type || "Note"}
                    </span>
                    <Bookmark size={19} className="text-slate-600" />
                  </div>
                  <h3 className="line-clamp-2 font-poppins text-xl font-semibold leading-snug">
                    {note.title}
                  </h3>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                    Semester {note.semester || "-"} |{" "}
                    {note.description || "Study material"}
                  </p>
                  <div className="mt-auto border-t border-slate-100 pt-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar user={note.uploadedBy} size="h-9 w-9" />
                        <span className="truncate text-sm font-semibold text-slate-700">
                          {note.uploadedBy?.name || note.uploadedBy?.username || "Contributor"}
                        </span>
                      </div>
                      <span className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-slate-600">
                        <ThumbsUp size={15} />
                        {formatNumber(note.likes)}
                      </span>
                    </div>
                    <Link
                      to={`/notes/${note.id}`}
                      className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-slate-100 px-5 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-600 hover:text-white"
                    >
                      View Note
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-10">
              <EmptyState>No study material has been uploaded yet.</EmptyState>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="font-poppins text-2xl font-semibold">Smart Ecosystem</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featureCards.slice(0, 3).map(([icon, title, text, tone]) => (
            <article
              key={title}
              className="rounded-2xl bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <span className={`inline-flex rounded-xl p-3 ${tone}`}>
                {createElement(icon, { size: 22 })}
              </span>
              <h3 className="mt-7 font-poppins text-xl font-semibold">
                {title}
              </h3>
              <p className="mt-4 text-sm leading-6 text-slate-600">{text}</p>
            </article>
          ))}

          <article className="rounded-2xl bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <span
              className={`inline-flex rounded-xl p-3 ${featureCards[3][3]}`}
            >
              {createElement(featureCards[3][0], { size: 22 })}
            </span>
            <h3 className="mt-7 font-poppins text-xl font-semibold">
              {featureCards[3][1]}
            </h3>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              {featureCards[3][2]}
            </p>
          </article>

          <article className="rounded-2xl bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl md:col-span-2">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
              <div>
                <span className="inline-flex rounded-xl bg-indigo-600 p-3 text-white">
                  <Bot size={22} />
                </span>
                <h3 className="mt-7 font-poppins text-xl font-semibold">
                  AI Study Assistant
                </h3>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Our AI analyzes uploaded notes to generate summaries,
                  flashcards, and practice quizzes automatically.
                </p>
              </div>
              <div className="rounded-2xl border border-dashed border-indigo-200 bg-slate-50 p-5">
                <div className="flex items-center gap-2 text-sm font-bold text-indigo-600">
                  <Sparkles size={17} />
                  AI Insight
                </div>
                <p className="mt-4 text-sm italic leading-7 text-slate-600">
                  "Based on Chapter 4 of DBMS, the most important topics for
                  your sessional are Normalization and ER Diagrams."
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 border-t border-slate-200 px-4 py-14 sm:px-6 lg:grid-cols-[0.75fr_1.45fr] lg:px-8">
        <div>
          <h2 className="font-poppins text-2xl font-semibold">Live Activity</h2>
          <p className="mt-4 max-w-xs text-sm leading-6 text-slate-600">
            What's happening right now in the GBPIET community.
          </p>
          <div className="mt-7 inline-flex max-w-full items-center gap-3 rounded-xl bg-indigo-50 px-5 py-4 text-sm font-semibold text-indigo-700">
            <Zap size={17} />
            {loading
              ? "Loading activity..."
              : `${formatNumber(activityData.activeUsersOnline)} active users online`}
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            [1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-16 animate-pulse rounded-2xl bg-white shadow-sm"
              />
            ))
          ) : activityData.activity?.length ? (
            activityData.activity.slice(0, 3).map((item) => {
              const Icon = activityIcons[item.type] || MessageSquare;
              return (
                <article
                  key={`${item.type}-${item.id}`}
                  className="flex min-w-0 flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg sm:flex-row sm:items-center sm:gap-4"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                    {item.avatar ? (
                      <img
                        src={item.avatar}
                        alt={item.user}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      initialsFor({ username: item.username, name: item.user }) || <Icon size={18} />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="break-words text-sm font-semibold text-slate-700">
                      {item.user}{" "}
                      {item.type === "upload"
                        ? "uploaded"
                        : item.type === "question"
                          ? "asked about"
                          : "shared"}{" "}
                      <span className="text-indigo-600">{item.content}</span>
                    </p>
                  </div>
                  <span className="shrink-0 text-xs font-semibold text-slate-400 sm:text-right">
                    {item.time}
                  </span>
                </article>
              );
            })
          ) : (
            <EmptyState>
              No activity yet. New uploads and questions will appear here.
            </EmptyState>
          )}
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl bg-indigo-600 px-6 py-16 text-center text-white shadow-2xl shadow-indigo-200 sm:px-10">
          <h2 className="mx-auto max-w-xl font-poppins text-3xl font-semibold leading-tight sm:text-4xl">
            Join Your College's Study Community
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-indigo-100">
            Stop struggling with scattered notes. Start learning smarter with
            GBPIET Notes today.
          </p>
          <div className="mt-9">
            <ActionButtons dark />
          </div>
        </div>
      </section>

      <footer className="bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-poppins font-semibold text-indigo-600">
              GBPIET Notes
            </p>
            <p className="mt-3 text-sm text-slate-500">
              &copy; 2024 GBPIET Notes. Built for the community.
            </p>
          </div>
          <div className="flex flex-wrap gap-5 text-sm font-medium text-slate-500">
            <Link to="/login" className="hover:text-indigo-600">
              Terms of Service
            </Link>
            <Link to="/login" className="hover:text-indigo-600">
              Privacy Policy
            </Link>
            <Link to="/login" className="hover:text-indigo-600">
              Contact Us
            </Link>
            <Link to="/login" className="hover:text-indigo-600">
              Github
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
