import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Award,
  BookOpen,
  Calendar,
  Download,
  FileText,
  Heart,
  MessageCircle,
  MessageSquare,
  Send,
  Sparkles,
  ThumbsUp,
  UserCheck,
  Users,
} from "lucide-react";
import API from "../../services/api";

const tabs = ["notes", "qna", "posts"];

const formatDate = (value) => {
  if (!value) return "Recently";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};

const shortText = (text = "", length = 140) =>
  text.length > length ? `${text.slice(0, length).trim()}...` : text;

const countItems = (value) => (Array.isArray(value) ? value.length : Number(value) || 0);

function Avatar({ user, size = "h-24 w-24", textSize = "text-3xl" }) {
  const initial = (user?.fullName || user?.username || "U").charAt(0).toUpperCase();

  return (
    <div
      className={`${size} ${textSize} flex shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-indigo-500 to-purple-600 font-semibold text-white shadow-xl shadow-indigo-200`}
    >
      {user?.avatar ? (
        <img src={user.avatar} alt={user?.username || "User"} className="h-full w-full object-cover" />
      ) : (
        initial
      )}
    </div>
  );
}

function StatCard({ icon, label, value }) {
  const IconComponent = icon;

  return (
    <div className="rounded-[24px] border border-white/80 bg-white/80 p-4 text-center shadow-lg shadow-slate-400/10 transition hover:-translate-y-1 hover:shadow-xl">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
        <IconComponent size={19} />
      </div>
      <p className="mt-3 font-poppins text-2xl font-semibold text-indigo-700">
        {value}
      </p>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
    </div>
  );
}

function Tag({ children }) {
  return (
    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
      #{children}
    </span>
  );
}

function NoteCard({ note }) {
  return (
    <article className="group overflow-hidden rounded-[24px] border border-white/80 bg-white/85 shadow-lg shadow-slate-400/10 transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex min-h-28 items-center justify-center bg-purple-50 px-4 py-6">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-purple-500 shadow-sm">
          <FileText size={34} />
          <span className="absolute -right-3 -top-3 rounded-full bg-white px-2 py-1 text-[10px] font-bold text-purple-600 shadow-sm">
            PDF
          </span>
        </div>
      </div>
      <div className="space-y-4 p-4">
        <div>
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
              {note.subjectCode || note.type || "Notes"}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              PDF
            </span>
          </div>
          <h3 className="line-clamp-2 text-lg font-semibold text-slate-950">
            {note.title}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {note.subjectName || note.description || "Academic material"}
          </p>
          <p className="mt-2 flex items-center gap-2 text-xs font-medium text-slate-400">
            <Calendar size={13} />
            Uploaded on {formatDate(note.createdAt)}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-1 text-xs font-semibold text-slate-500">
            <ThumbsUp size={14} />
            {countItems(note.upvotes)}
          </span>
          <a
            href={note.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5"
          >
            <Download size={15} />
            Download
          </a>
        </div>
      </div>
    </article>
  );
}

function QuestionCard({ question }) {
  return (
    <article className="rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-lg shadow-slate-400/10 transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex flex-wrap gap-2">
        {(question.tags || []).slice(0, 4).map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-950">
        {question.title || "Question"}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {shortText(question.description)}
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
        <span className="flex items-center gap-1">
          <ThumbsUp size={14} />
          {countItems(question.upvotes)} upvotes
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle size={14} />
          {countItems(question.answers)} answers
        </span>
        <span>{formatDate(question.createdAt)}</span>
      </div>
    </article>
  );
}

function AnswerCard({ answer }) {
  return (
    <article className="rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-lg shadow-slate-400/10 transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          Answered
        </span>
        {answer.accepted && (
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            Accepted Answer
          </span>
        )}
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-950">
        {answer.question?.title || answer.question?.description || "Question"}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        {shortText(answer.content || "Image answer contribution")}
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
        <span className="flex items-center gap-1">
          <ThumbsUp size={14} />
          {countItems(answer.upvotes)} upvotes
        </span>
        <span>{formatDate(answer.createdAt)}</span>
      </div>
    </article>
  );
}

function PostCard({ post }) {
  const author = post.postedBy || {};

  return (
    <article className="rounded-[24px] border border-white/80 bg-white/85 p-5 shadow-lg shadow-slate-400/10 transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center gap-3">
        <Avatar user={author} size="h-11 w-11" textSize="text-base" />
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-slate-950">
            {author.fullName || author.username || "Student"}
          </h3>
          <p className="text-xs text-slate-500">
            @{author.username || "student"} - {formatDate(post.createdAt)}
          </p>
        </div>
      </div>
      {post.text && (
        <p className="mt-4 text-sm leading-6 text-slate-700">{post.text}</p>
      )}
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Post"
          className="mt-4 max-h-80 w-full rounded-3xl object-cover"
        />
      )}
      <div className="mt-5 flex items-center gap-5 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
        <span className="flex items-center gap-1">
          <Heart size={14} />
          {countItems(post.upvotes)}
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle size={14} />
          {countItems(post.comments)}
        </span>
      </div>
    </article>
  );
}

function EmptyState({ children }) {
  return (
    <div className="rounded-[24px] border border-dashed border-indigo-100 bg-white/70 p-8 text-center text-sm text-slate-500">
      {children}
    </div>
  );
}

export default function StudentProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("notes");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/users/profile/${username}`);
        if (mounted) setProfile(response.data?.data);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [username]);

  const user = profile?.user;
  const stats = profile?.stats || {};
  const contributions = profile?.contributions || {};

  const statItems = [
    { label: "Followers", value: stats.followers || 0, icon: Users },
    { label: "Following", value: stats.following || 0, icon: UserCheck },
    { label: "Upvotes", value: stats.upvotes || 0, icon: ThumbsUp },
    { label: "Credits", value: stats.credits || 0, icon: Award },
    { label: "Notes", value: stats.notes || 0, icon: BookOpen },
    { label: "Questions", value: stats.questions || 0, icon: MessageSquare },
    { label: "Posts", value: stats.posts || 0, icon: Send },
  ];

  const handleToggleFollow = async () => {
    if (!user || user.isSelf) return;

    const nextFollowing = !user.isFollowing;
    setProfile((current) => ({
      ...current,
      user: { ...current.user, isFollowing: nextFollowing },
      stats: {
        ...current.stats,
        followers: Math.max(
          (current.stats?.followers || 0) + (nextFollowing ? 1 : -1),
          0,
        ),
      },
    }));

    try {
      await API.post(`/follows/toggle/${user._id}`);
    } catch {
      setProfile((current) => ({
        ...current,
        user: { ...current.user, isFollowing: !nextFollowing },
        stats: {
          ...current.stats,
          followers: Math.max(
            (current.stats?.followers || 0) + (nextFollowing ? -1 : 1),
            0,
          ),
        },
      }));
    }
  };

  if (loading) {
    return (
      <main className="app-page">
        <div className="app-shell p-8 text-sm text-slate-500">
          Loading profile...
        </div>
      </main>
    );
  }

  if (!profile || !user) {
    return (
      <main className="app-page">
        <div className="app-shell p-8 text-sm text-slate-500">
          Profile not found.
        </div>
      </main>
    );
  }

  return (
    <main className="app-page">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <section className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="space-y-5">
            <article className="overflow-hidden rounded-[28px] border border-white/80 bg-white/80 shadow-2xl shadow-indigo-200/30 backdrop-blur-xl">
              <div className="h-24 bg-gradient-to-r from-purple-700 to-indigo-500" />
              <div className="-mt-14 px-5 pb-6">
                <div className="relative inline-flex">
                  <Avatar user={user} />
                  <span className="absolute bottom-3 right-2 h-4 w-4 rounded-full border-2 border-white bg-emerald-400" />
                </div>
                <h1 className="mt-4 font-poppins text-2xl font-semibold text-slate-950">
                  {user.fullName || user.username}
                </h1>
                <p className="text-sm font-medium text-slate-500">@{user.username}</p>
                <p className="mt-1 truncate text-xs text-indigo-600">{user.email}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                    {user.branch || "GBPIET"}
                  </span>
                  <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                    {user.year || user.role || "Student"}
                  </span>
                </div>
                <div className="mt-5">
                  {user.isSelf ? (
                    <button
                      type="button"
                      onClick={() => navigate("/settings?tab=profile")}
                      className="w-full rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleToggleFollow}
                      className="w-full rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5"
                    >
                      {user.isFollowing ? "Following" : "Follow"}
                    </button>
                  )}
                </div>
              </div>
            </article>

            <article className="rounded-[28px] border border-white/80 bg-white/80 p-5 shadow-xl shadow-slate-400/10 backdrop-blur-xl">
              <h2 className="font-poppins text-xl font-semibold text-purple-700">
                Bio
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {user.bio ||
                  "This student has not added a bio yet. Their contributions still tell the story."}
              </p>

              <h3 className="mt-6 font-poppins text-lg font-semibold text-purple-700">
                Tech Stack
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {(user.techStack?.length ? user.techStack : ["React", "DSA", "DBMS"]).map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>

              {user.interests?.length > 0 && (
                <>
                  <h3 className="mt-6 font-poppins text-lg font-semibold text-purple-700">
                    Interests
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {user.interests.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                </>
              )}
            </article>
          </div>

          <div className="space-y-6">
            <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-7">
              {statItems.map((item) => (
                <StatCard key={item.label} {...item} />
              ))}
            </section>

            <section className="rounded-[28px] border border-white/80 bg-white/60 p-3 shadow-xl shadow-slate-400/10 backdrop-blur-xl sm:p-5">
              <div className="sticky top-16 z-10 -mx-3 mb-5 flex gap-2 overflow-x-auto border-b border-slate-100 bg-white/80 px-3 py-2 backdrop-blur-xl sm:-mx-5 sm:px-5">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-2xl px-5 py-3 text-sm font-semibold capitalize transition ${
                      activeTab === tab
                        ? "bg-white text-purple-700 shadow-lg shadow-slate-200"
                        : "text-slate-500 hover:bg-white/70 hover:text-slate-900"
                    }`}
                  >
                    {tab === "qna" ? "Q&A" : tab}
                  </button>
                ))}
              </div>

              {activeTab === "notes" && (
                <div className="grid gap-5 md:grid-cols-2">
                  {contributions.notes?.length ? (
                    contributions.notes.map((note) => (
                      <NoteCard key={note._id} note={note} />
                    ))
                  ) : (
                    <EmptyState>No notes uploaded yet.</EmptyState>
                  )}
                </div>
              )}

              {activeTab === "qna" && (
                <div className="space-y-6">
                  <section>
                    <h2 className="mb-4 font-poppins text-xl font-semibold text-slate-950">
                      Questions Asked
                    </h2>
                    <div className="grid gap-4">
                      {contributions.questions?.length ? (
                        contributions.questions.map((question) => (
                          <QuestionCard key={question._id} question={question} />
                        ))
                      ) : (
                        <EmptyState>No questions asked yet.</EmptyState>
                      )}
                    </div>
                  </section>

                  <section>
                    <h2 className="mb-4 font-poppins text-xl font-semibold text-slate-950">
                      Answers Contributed
                    </h2>
                    <div className="grid gap-4">
                      {contributions.answers?.length ? (
                        contributions.answers.map((answer) => (
                          <AnswerCard key={answer._id} answer={answer} />
                        ))
                      ) : (
                        <EmptyState>No answers contributed yet.</EmptyState>
                      )}
                    </div>
                  </section>
                </div>
              )}

              {activeTab === "posts" && (
                <div className="grid gap-5">
                  {contributions.posts?.length ? (
                    contributions.posts.map((post) => (
                      <PostCard key={post._id} post={post} />
                    ))
                  ) : (
                    <EmptyState>No posts shared yet.</EmptyState>
                  )}
                </div>
              )}
            </section>
          </div>
        </section>

        <section className="rounded-[28px] border border-white/80 bg-white/75 p-5 shadow-xl shadow-slate-400/10 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="font-poppins text-xl font-semibold text-slate-950">
                Recent Activity
              </h2>
              <p className="text-sm text-slate-500">
                Contributions from notes, Q&A, and community posts appear above.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
