import { createElement, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Edit3,
  FileQuestion,
  HelpCircle,
  MessageCircle,
  MessageSquareText,
  MoreHorizontal,
  NotebookTabs,
  Plus,
  Search,
  Sparkles,
  Trash2,
  UploadCloud,
  UsersRound,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";
import UpvoteButton from "../../components/upvote/UpvoteButton";
import { timeAgo } from "../../utils/timeAgo";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const isFacultyWorkspace = (role) => role === "faculty";

function Metric({ icon, label, value, accent = "bg-indigo-600" }) {
  return (
    <div className="soft-card p-3 sm:p-4">
      <div className="flex items-center gap-3">
        <span className={`rounded-2xl p-2 text-white ${accent}`}>
          {createElement(icon, { size: 17 })}
        </span>
        <div className="min-w-0">
          <p className="text-xs text-slate-500">{label}</p>
          <p className="truncate font-semibold text-slate-950">{value}</p>
        </div>
      </div>
    </div>
  );
}

function ActivityChart({ activity, onSeeAll }) {
  const days = activity?.days?.length
    ? activity.days
    : weekDays.map((label) => ({ label, count: 0 }));
  const maxCount = activity?.maxCount || 1;

  return (
    <section className="glass-panel responsive-panel">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-poppins text-xl font-semibold text-slate-950">
          My activity
        </h2>
        <button
          type="button"
          onClick={onSeeAll}
          className="text-xs font-semibold text-slate-500 hover:text-indigo-700"
        >
          See all
        </button>
      </div>
      <div className="flex h-36 items-end gap-2 sm:gap-4">
        {days.map((day, index) => (
          <div key={`${day.label}-${index}`} className="flex flex-1 flex-col items-center gap-2">
            <div
              className={`w-full max-w-8 rounded-full ${
                day.count > 0
                  ? "bg-gradient-to-t from-indigo-600 to-violet-400"
                  : "bg-white/80"
              }`}
              style={{ height: `${Math.max(10, (day.count / maxCount) * 112)}px` }}
              title={`${day.count} activities`}
            />
            <span className="text-xs text-slate-400">{day.label}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-500">
        {activity?.total || 0} activities in the last 7 days
      </p>
    </section>
  );
}

function ActionCard({ icon, title, detail, onClick, active }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-3 rounded-2xl p-3 text-left transition sm:rounded-3xl sm:p-4 ${
        active
          ? "bg-indigo-600 text-white shadow-xl shadow-indigo-500/25"
          : "bg-white/65 text-slate-900 hover:bg-white"
      }`}
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className={`rounded-2xl p-2 ${active ? "bg-white/15" : "bg-slate-100 text-indigo-600"}`}>
          {createElement(icon, { size: 18 })}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold">{title}</span>
          <span className={`mt-1 block text-xs ${active ? "text-white/75" : "text-slate-500"}`}>
            {detail}
          </span>
        </span>
      </span>
      <ChevronRight size={17} className="shrink-0" />
    </button>
  );
}

function ListPanel({ title, items, emptyText, onOpen, meta, onAction }) {
  return (
    <section className="glass-panel responsive-panel">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-poppins text-lg font-semibold text-slate-950">
          {title}
        </h2>
        <button
          type="button"
          onClick={onAction}
          className="rounded-full bg-white/70 p-2 text-slate-700 hover:bg-white"
        >
          <Plus size={17} />
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-slate-500">{emptyText}</p>
      ) : (
        <div className="space-y-3">
          {items.slice(0, 5).map((item) => (
            <button
              key={item._id}
              type="button"
              onClick={() => onOpen(item)}
              className="flex w-full items-center justify-between rounded-2xl bg-white/65 p-3 text-left hover:bg-white"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-slate-950">
                  {item.title || item.description}
                </span>
                <span className="mt-1 block truncate text-xs text-slate-500">
                  {meta(item)}
                </span>
              </span>
              <ChevronRight size={16} className="shrink-0 text-slate-400" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function ExpandableText({ text, className = "" }) {
  const [expanded, setExpanded] = useState(false);
  const shouldClamp = text && text.length > 180;

  if (!text) return null;

  return (
    <div className={className}>
      <p className={`text-sm text-slate-600 ${expanded ? "" : "line-clamp-3"}`}>
        {text}
      </p>
      {shouldClamp && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-1 text-xs font-semibold text-indigo-700"
        >
          {expanded ? "See less" : "See more"}
        </button>
      )}
    </div>
  );
}

function FeedPreview({ item }) {
  if (item.feedType === "note") {
    return (
      <div className="mt-4 overflow-hidden rounded-2xl border border-white/70 bg-gradient-to-br from-indigo-100 via-white to-sky-100 p-4 sm:rounded-3xl sm:p-5">
        <div className="flex items-center gap-3">
          <span className="rounded-2xl bg-indigo-600 p-3 text-white">
            <NotebookTabs size={22} />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase text-indigo-700">
              {item.subjectCode || "Notes"}
            </p>
            <h3 className="line-clamp-2 break-words font-poppins text-lg font-semibold text-slate-950 sm:text-xl">
              {item.title || "Untitled note"}
            </h3>
          </div>
        </div>
        <ExpandableText
          text={item.description || "No description provided for this note."}
          className="mt-4"
        />
      </div>
    );
  }

  if (item.feedType === "question") {
    return (
      <div className="mt-4 rounded-2xl border border-white/70 bg-gradient-to-br from-amber-50 via-white to-rose-50 p-4 sm:rounded-3xl sm:p-5">
        <div className="flex items-center gap-3">
          <span className="rounded-2xl bg-amber-500 p-3 text-white">
            <HelpCircle size={22} />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase text-amber-700">
              Question
            </p>
            <h3 className="line-clamp-2 break-words font-poppins text-lg font-semibold text-slate-950 sm:text-xl">
              {item.title || "Untitled question"}
            </h3>
          </div>
        </div>
        <ExpandableText text={item.description} className="mt-4" />
      </div>
    );
  }

  return (
    <>
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt=""
          className="mt-4 max-h-[360px] w-full rounded-2xl object-cover sm:max-h-[520px] sm:rounded-3xl"
        />
      )}
      <ExpandableText text={item.text} className="mt-4" />
    </>
  );
}

function LatestFeed({ items, currentUser, onSeeAll, onOpen, onPostUpdated, onPostDeleted }) {
  return (
    <section className="glass-panel responsive-panel">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-poppins text-xl font-semibold text-slate-950">
          Latest updates
        </h2>
        <span className="pill">Latest posts</span>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-slate-500">No latest updates yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {items.slice(0, 10).map((item) => (
            <FeedCard
              key={`${item.feedType}-${item._id}`}
              item={item}
              currentUser={currentUser}
              onOpen={onOpen}
              onPostUpdated={onPostUpdated}
              onPostDeleted={onPostDeleted}
            />
          ))}
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={onSeeAll}
              className="app-button-secondary"
            >
              See all posts
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function FeedCard({ item, currentUser, onOpen, onPostUpdated, onPostDeleted }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(item.text || "");
  const [saving, setSaving] = useState(false);
  const owner = item.postedBy || item.uploadedBy || item.askedBy;
  const isOwner = item.feedType === "post" && owner?._id === currentUser?._id;

  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;
    await API.delete(`/posts/${item._id}`);
    onPostDeleted(item._id);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("text", editText);
      const res = await API.patch(`/posts/${item._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onPostUpdated(res.data.data);
      setEditing(false);
      setMenuOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className="soft-card mx-auto flex w-full max-w-3xl flex-col overflow-visible p-3 sm:p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-indigo-100">
            {owner?.avatar ? (
              <img src={owner.avatar} alt={owner.fullName} className="h-full w-full object-cover" />
            ) : (
              <span className="font-semibold text-indigo-700">
                {(owner?.fullName || owner?.username || "?").charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-950">
              {owner?.fullName || "GBPIET"}
            </p>
            <p className="truncate text-xs text-slate-500">
              @{owner?.username || "unknown"} - {timeAgo(item.createdAt)}
            </p>
          </div>
        </div>

        <div className="relative flex flex-wrap items-center justify-end gap-2">
          <span className="pill capitalize">{item.feedType}</span>
          {isOwner && (
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className="rounded-full bg-white/80 p-2 text-slate-600 hover:bg-white"
              aria-label="Post options"
            >
              <MoreHorizontal size={18} />
            </button>
          )}
          {menuOpen && (
            <div className="absolute right-0 top-10 z-20 w-36 rounded-2xl border border-white/70 bg-white/95 p-2 shadow-xl">
              <button
                type="button"
                onClick={() => {
                  setEditing(true);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                <Edit3 size={14} />
                Edit
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-500 hover:bg-red-50"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {editing ? (
        <div className="mt-4 space-y-3">
          <textarea
            value={editText}
            onChange={(event) => setEditText(event.target.value)}
            className="app-input min-h-28"
          />
          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="app-button-secondary py-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || (!editText.trim() && !item.imageUrl)}
              className="app-button py-2"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      ) : (
        <FeedPreview item={item} />
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-white/70 pt-3">
        {item.feedType === "post" ? (
          <>
            <UpvoteButton type="post" id={item._id} />
            <PostCommentBox post={item} />
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onOpen(item)}
              className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-white"
            >
              <MessageCircle size={14} />
              {item.feedType === "question" ? "Answers" : "Comments"}
            </button>
            <button
              type="button"
              onClick={() => onOpen(item)}
              className="rounded-full bg-slate-950 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
            >
              Open
            </button>
          </>
        )}
      </div>
    </article>
  );
}

function PostCommentBox({ post }) {
  const [comments, setComments] = useState(post.comments || []);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!message.trim()) return;

    try {
      setLoading(true);
      const res = await API.post(`/posts/${post._id}/comment`, { message });
      setComments(res.data?.data || []);
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-white"
      >
        <MessageCircle size={14} />
        {comments.length}
      </button>

      {open && (
        <div className="absolute left-0 top-11 z-20 w-[min(320px,82vw)] rounded-3xl border border-white/70 bg-white/95 p-3 shadow-2xl sm:w-80">
          <div className="max-h-44 space-y-2 overflow-y-auto">
            {comments.length === 0 ? (
              <p className="text-xs text-slate-500">No comments yet.</p>
            ) : (
              comments.map((comment, index) => (
                <div key={comment._id || index} className="rounded-2xl bg-slate-50 p-2">
                  <p className="text-xs font-semibold text-slate-950">
                    @{comment.user?.username || "user"}
                  </p>
                  <p className="text-xs text-slate-600">{comment.message}</p>
                </div>
              ))
            )}
          </div>
          <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Write a comment..."
              className="app-input py-2 text-xs"
            />
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="rounded-full bg-slate-950 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
            >
              {loading ? "..." : "Send"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function StudentDashboard({
  notes,
  questions,
  latestItems,
  activity,
  loading,
  onPostUpdated,
  onPostDeleted,
}) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <main className="app-page">
      <div className="app-shell">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px] 2xl:grid-cols-[minmax(0,1fr)_330px]">
          <div className="min-w-0 space-y-5 sm:space-y-6 xl:col-start-1 xl:row-start-1">
            <header className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0">
                <p className="text-sm text-slate-500">Welcome back</p>
                <h1 className="page-title">{user?.fullName || user?.username}</h1>
              </div>
              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 xl:max-w-lg">
                <Metric icon={BookOpen} label="Notes" value={loading ? "..." : notes.length} />
                <Metric icon={FileQuestion} label="Doubts" value={loading ? "..." : questions.length} accent="bg-sky-500" />
                <Metric icon={Sparkles} label="Credits" value={user?.credits || 0} accent="bg-amber-500" />
              </div>
            </header>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_240px] 2xl:grid-cols-[minmax(0,1fr)_260px]">
              <ActivityChart activity={activity} onSeeAll={() => navigate("/leaderboard")} />
              <section className="space-y-3">
                <ActionCard icon={Search} title="Browse notes" detail="Find subject material" active onClick={() => navigate("/notes")} />
                <ActionCard icon={MessageSquareText} title="Ask question" detail="Post a doubt" onClick={() => navigate("/questions")} />
                <ActionCard icon={UsersRound} title="Browse people" detail="Follow contributors" onClick={() => navigate("/users")} />
              </section>
            </div>
          </div>

          <aside className="min-w-0 space-y-5 xl:col-start-2 xl:row-span-2 xl:row-start-1 xl:space-y-6">
            <section className="rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-500 p-5 text-white shadow-xl shadow-indigo-500/25 sm:rounded-3xl">
              <p className="text-sm font-semibold">Study focus</p>
              <h2 className="mt-3 font-poppins text-2xl">Build your week</h2>
              <button onClick={() => navigate("/notes")} className="mt-5 rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold">
                Start learning
              </button>
            </section>
            <ListPanel
              title="My courses"
              items={notes}
              emptyText="No notes available yet."
              onOpen={(note) => navigate(`/notes/${note._id}`)}
              meta={(note) => `${note.subjectCode || "Subject"} - ${note.type || "Material"}`}
              onAction={() => navigate("/notes")}
            />
          </aside>

          <div className="min-w-0 xl:col-start-1 xl:row-start-2">
            <LatestFeed
              items={latestItems}
              currentUser={user}
              onSeeAll={() => navigate("/posts")}
              onOpen={(item) =>
                navigate(
                  item.feedType === "question"
                    ? "/questions"
                    : `/notes/${item._id}`
                )
              }
              onPostUpdated={(post) =>
                onPostUpdated(post)
              }
              onPostDeleted={(postId) =>
                onPostDeleted(postId)
              }
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function FacultyDashboard({
  notes,
  questions,
  latestItems,
  activity,
  loading,
  onPostUpdated,
  onPostDeleted,
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const pendingQuestions = questions.filter((q) => (q.answers || []).length === 0).length;

  return (
    <main className="app-page">
      <div className="app-shell">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_310px] 2xl:grid-cols-[minmax(0,1fr)_350px]">
          <div className="min-w-0 space-y-5 sm:space-y-6 xl:col-start-1 xl:row-start-1">
            <header className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0">
                <p className="text-sm text-slate-500">Faculty workspace</p>
                <h1 className="page-title">{user?.fullName || user?.username}</h1>
              </div>
              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:max-w-2xl">
                <Metric icon={UploadCloud} label="Uploads" value={loading ? "..." : notes.length} />
                <Metric icon={FileQuestion} label="Queue" value={loading ? "..." : questions.length} accent="bg-sky-500" />
                <Metric icon={CheckCircle2} label="Pending" value={loading ? "..." : pendingQuestions} accent="bg-rose-500" />
                <Metric icon={UsersRound} label="Score" value={user?.reputation || user?.credits || 0} accent="bg-amber-500" />
              </div>
            </header>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_240px] 2xl:grid-cols-[minmax(0,1fr)_270px]">
              <ActivityChart activity={activity} onSeeAll={() => navigate("/questions")} />
              <section className="space-y-3">
                <ActionCard icon={UploadCloud} title="Upload material" detail="Share class resources" active onClick={() => navigate("/notes")} />
                <ActionCard icon={MessageSquareText} title="Answer doubts" detail="Open question queue" onClick={() => navigate("/questions")} />
              </section>
            </div>

            <ListPanel
              title="Student questions"
              items={questions}
              emptyText="No student questions yet."
              onOpen={() => navigate("/questions")}
              meta={(question) => `Asked by ${question.askedBy?.fullName || "student"}`}
              onAction={() => navigate("/questions")}
            />
          </div>

          <aside className="min-w-0 space-y-5 xl:col-start-2 xl:row-span-2 xl:row-start-1 xl:space-y-6">
            <section className="rounded-2xl bg-gradient-to-br from-slate-950 to-indigo-700 p-5 text-white shadow-xl shadow-slate-500/25 sm:rounded-3xl">
              <Clock3 size={20} />
              <h2 className="mt-4 font-poppins text-2xl">Today’s academic work</h2>
              <p className="mt-2 text-sm text-white/70">Review new doubts and keep material fresh.</p>
            </section>
            <ListPanel
              title="Recent materials"
              items={notes}
              emptyText="No materials uploaded yet."
              onOpen={(note) => navigate(`/notes/${note._id}`)}
              meta={(note) => `${note.subjectCode || "Subject"} - ${note.uploadedBy?.fullName || "faculty"}`}
              onAction={() => navigate("/notes")}
            />
          </aside>

          <div className="min-w-0 xl:col-start-1 xl:row-start-2">
            <LatestFeed
              items={latestItems}
              currentUser={user}
              onSeeAll={() => navigate("/posts")}
              onOpen={(item) =>
                navigate(
                  item.feedType === "question"
                    ? "/questions"
                    : `/notes/${item._id}`
                )
              }
              onPostUpdated={(post) =>
                onPostUpdated(post)
              }
              onPostDeleted={(postId) =>
                onPostDeleted(postId)
              }
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [posts, setPosts] = useState([]);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadDashboardData = async () => {
      try {
        const [notesRes, questionsRes, postsRes, activityRes] = await Promise.all([
          API.get("/notes?limit=6&sortBy=createdAt&sortType=desc"),
          API.get("/questions?limit=6&sortBy=createdAt&sortType=desc"),
          API.get("/posts?limit=6"),
          API.get("/users/activity"),
        ]);

        if (!mounted) return;
        setNotes(notesRes.data?.data?.notes || []);
        setQuestions(questionsRes.data?.data?.questions || []);
        setPosts(postsRes.data?.data?.posts || []);
        setActivity(activityRes.data?.data || null);
      } catch {
        if (!mounted) return;
        setNotes([]);
        setQuestions([]);
        setPosts([]);
        setActivity(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadDashboardData();

    return () => {
      mounted = false;
    };
  }, []);

  const facultyView = useMemo(() => isFacultyWorkspace(user?.role), [user?.role]);
  const latestItems = useMemo(
    () =>
      posts
        .map((post) => ({ ...post, feedType: "post" }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [posts]
  );

  const handlePostUpdated = (updatedPost) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  };

  const handlePostDeleted = (postId) => {
    setPosts((currentPosts) => currentPosts.filter((post) => post._id !== postId));
  };

  if (facultyView) {
    return (
      <FacultyDashboard
        notes={notes}
        questions={questions}
        latestItems={latestItems}
        activity={activity}
        loading={loading}
        onPostUpdated={handlePostUpdated}
        onPostDeleted={handlePostDeleted}
      />
    );
  }

  return (
    <StudentDashboard
      notes={notes}
      questions={questions}
      latestItems={latestItems}
      activity={activity}
      loading={loading}
      onPostUpdated={handlePostUpdated}
      onPostDeleted={handlePostDeleted}
    />
  );
}
