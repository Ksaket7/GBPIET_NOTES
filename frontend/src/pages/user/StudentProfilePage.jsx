import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Award,
  BookOpen,
  Calendar,
  Download,
  ExternalLink,
  FileText,
  Github,
  Globe,
  Heart,
  Instagram,
  Linkedin,
  MessageCircle,
  MessageSquare,
  Send,
  Sparkles,
  ThumbsUp,
  UserCheck,
  Users,
} from "lucide-react";
import API from "../../services/api";
import FormModal from "../../components/ui/FormModal";
import UpvoteButton from "../../components/upvote/UpvoteButton";
import {
  downloadNoteFile,
  getNoteId,
  openNoteFile,
} from "../../utils/noteFileActions";

const tabs = ["notes", "qna", "posts"];

const profileLinkMeta = [
  { key: "github", label: "GitHub", icon: Github },
  { key: "linkedin", label: "LinkedIn", icon: Linkedin },
  { key: "portfolio", label: "Portfolio", icon: Globe },
  { key: "instagram", label: "Instagram", icon: Instagram },
];

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
      className={`${size} ${textSize} flex shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-indigo-100 font-semibold text-indigo-700 shadow-lg shadow-slate-300/40`}
    >
      {user?.avatar ? (
        <img src={user.avatar} alt={user?.username || "User"} className="h-full w-full object-cover" />
      ) : (
        initial
      )}
    </div>
  );
}

function StatCard({ icon, label, onClick, value }) {
  const IconComponent = icon;
  const Component = onClick ? "button" : "div";

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        onClick ? "cursor-pointer focus:outline-none focus:ring-4 focus:ring-indigo-100" : ""
      }`}
    >
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
        <IconComponent size={19} />
      </div>
      <p className="mt-3 font-poppins text-2xl font-semibold text-indigo-700">
        {value}
      </p>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
    </Component>
  );
}

function Tag({ children }) {
  return (
    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
      #{children}
    </span>
  );
}

function NoteCard({ note }) {
  const navigate = useNavigate();
  const noteId = getNoteId(note);

  const handleCardClick = () => {
    if (noteId) navigate(`/notes/${noteId}`);
  };

  const handleOpen = (event) => {
    event.stopPropagation();
    openNoteFile(note);
  };

  const handleDownload = async (event) => {
    event.stopPropagation();
    await downloadNoteFile(note);
  };

  return (
    <article
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleCardClick();
        }
      }}
      className="group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex min-h-28 items-center justify-center bg-indigo-50 px-4 py-6">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
          <FileText size={34} />
          <span className="absolute -right-3 -top-3 rounded-full bg-white px-2 py-1 text-[10px] font-bold text-indigo-600 shadow-sm">
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <UpvoteButton type="note" id={noteId} stopPropagation />
          <div className="flex flex-1 flex-wrap gap-2 sm:justify-end">
            <button
              type="button"
              onClick={handleOpen}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-indigo-100 bg-white px-3 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 sm:flex-none"
            >
              <ExternalLink size={15} />
              Open
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 sm:flex-none"
            >
              <Download size={15} />
              Download
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function QuestionCard({ question }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
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
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
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
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
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
          className="mt-4 max-h-80 w-full rounded-xl object-cover"
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
    <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
      {children}
    </div>
  );
}

function ProfileLinks({ links = {} }) {
  const visibleLinks = profileLinkMeta
    .map((item) => ({ ...item, url: links[item.key] }))
    .filter((item) => item.url);

  if (!visibleLinks.length) return null;

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-poppins text-xl font-semibold text-slate-950">
        Profile Links
      </h2>
      <div className="mt-4 space-y-2">
        {visibleLinks.map((link) => {
          const Icon = link.icon;
          const href = /^https?:\/\//i.test(link.url)
            ? link.url
            : `https://${link.url}`;

          return (
            <a
              key={link.key}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-indigo-100 hover:bg-indigo-50 hover:text-indigo-700"
            >
              <span className="flex min-w-0 items-center gap-2">
                <Icon size={16} className="shrink-0" />
                <span className="truncate">{link.label}</span>
              </span>
              <ExternalLink size={14} className="shrink-0" />
            </a>
          );
        })}
      </div>
    </article>
  );
}

function ConnectionListModal({ loading, onClose, onToggleFollow, title, users }) {
  return (
    <FormModal title={title} onClose={onClose}>
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
            Profile network
          </p>
          <h2 className="mt-1 font-poppins text-2xl font-semibold text-slate-950">
            {title}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Students connected with this profile.
          </p>
        </div>

        <div className="mt-5 max-h-[60vh] space-y-3 overflow-y-auto pr-1">
          {loading ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
              Loading users...
            </div>
          ) : users.length ? (
            users.map((connectionUser) => (
              <div
                key={connectionUser._id}
                className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 transition hover:border-indigo-100 hover:bg-indigo-50/50 sm:flex-row sm:items-center"
              >
                <Link
                  to={`/profile/${connectionUser.username}`}
                  onClick={onClose}
                  className="flex min-w-0 flex-1 items-center gap-3"
                >
                  <Avatar user={connectionUser} size="h-12 w-12" textSize="text-base" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-950">
                      {connectionUser.fullName || connectionUser.username}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      @{connectionUser.username}
                    </p>
                    <p className="truncate text-xs font-medium text-slate-400">
                      {connectionUser.branch || "GBPIET"} /{" "}
                      {connectionUser.year || connectionUser.role || "Student"}
                    </p>
                  </div>
                </Link>
                <button
                  type="button"
                  disabled={connectionUser.isSelf}
                  onClick={() => onToggleFollow(connectionUser)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 sm:shrink-0 ${
                    connectionUser.isFollowing
                      ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {connectionUser.isSelf
                    ? "You"
                    : connectionUser.isFollowing
                      ? "Following"
                      : "Follow"}
                </button>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
              No users found yet.
            </div>
          )}
        </div>
      </section>
    </FormModal>
  );
}

export default function StudentProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("notes");
  const [loading, setLoading] = useState(true);
  const [connectionModal, setConnectionModal] = useState(null);

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

  const openConnectionList = async (type) => {
    if (!user?._id) return;

    const title = type === "followers" ? "Followers" : "Following";
    setConnectionModal({ title, users: [], loading: true });

    try {
      const response = await API.get(`/follows/${user._id}/${type}`);
      setConnectionModal({
        title,
        users: response.data?.data || [],
        loading: false,
      });
    } catch {
      setConnectionModal({
        title,
        users: [],
        loading: false,
      });
    }
  };

  const handleToggleConnectionFollow = async (connectionUser) => {
    if (!connectionUser?._id || connectionUser.isSelf) return;

    const nextFollowing = !connectionUser.isFollowing;
    setConnectionModal((current) => ({
      ...current,
      users: current.users.map((item) =>
        item._id === connectionUser._id
          ? { ...item, isFollowing: nextFollowing }
          : item,
      ),
    }));

    try {
      await API.post(`/follows/toggle/${connectionUser._id}`);
    } catch {
      setConnectionModal((current) => ({
        ...current,
        users: current.users.map((item) =>
          item._id === connectionUser._id
            ? { ...item, isFollowing: !nextFollowing }
            : item,
        ),
      }));
    }
  };

  const statItems = [
    {
      label: "Followers",
      value: stats.followers || 0,
      icon: Users,
      onClick: () => openConnectionList("followers"),
    },
    {
      label: "Following",
      value: stats.following || 0,
      icon: UserCheck,
      onClick: () => openConnectionList("following"),
    },
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
      {connectionModal && (
        <ConnectionListModal
          title={connectionModal.title}
          users={connectionModal.users}
          loading={connectionModal.loading}
          onToggleFollow={handleToggleConnectionFollow}
          onClose={() => setConnectionModal(null)}
        />
      )}

      <div className="mx-auto w-full max-w-7xl space-y-6">
        <section className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="space-y-5">
            <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              {user.coverImage ? (
                <img
                  src={user.coverImage}
                  alt={`${user.username} cover`}
                  className="h-24 w-full object-cover"
                />
              ) : (
                <div className="h-24 bg-gradient-to-r from-indigo-600 to-blue-500" />
              )}
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
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {user.year || user.role || "Student"}
                  </span>
                </div>
                <div className="mt-5">
                  {user.isSelf ? (
                    <button
                      type="button"
                      onClick={() => navigate("/settings?tab=profile")}
                      className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleToggleFollow}
                      className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                    >
                      {user.isFollowing ? "Following" : "Follow"}
                    </button>
                  )}
                </div>
              </div>
            </article>

            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="font-poppins text-xl font-semibold text-slate-950">
                Bio
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {user.bio ||
                  "This student has not added a bio yet. Their contributions still tell the story."}
              </p>

              <h3 className="mt-6 font-poppins text-lg font-semibold text-slate-950">
                Tech Stack
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {(user.techStack?.length ? user.techStack : ["React", "DSA", "DBMS"]).map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>

              {user.interests?.length > 0 && (
                <>
                  <h3 className="mt-6 font-poppins text-lg font-semibold text-slate-950">
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

            <ProfileLinks links={user.profileLinks} />
          </div>

          <div className="space-y-6">
            <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-7">
              {statItems.map((item) => (
                <StatCard key={item.label} {...item} />
              ))}
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5">
              <div className="sticky top-16 z-10 -mx-3 mb-5 flex gap-2 overflow-x-auto border-b border-slate-100 bg-white px-3 py-2 sm:-mx-5 sm:px-5">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-2xl px-5 py-3 text-sm font-semibold capitalize transition ${
                      activeTab === tab
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
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

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
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
