import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MessageCircle,
  MoreHorizontal,
  Send,
  ThumbsUp,
  UserPlus,
} from "lucide-react";
import API from "../../services/api";
import { timeAgo } from "../../utils/timeAgo";
import PostComposer from "../../components/posts/PostComposer";
import { useAuth } from "../../context/AuthContext";
import FormModal from "../../components/ui/FormModal";

const initialsFor = (user) => {
  const source = user?.username || user?.fullName || "User";
  return source
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

function Avatar({ user, className = "h-11 w-11" }) {
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
    <div className={`${className} flex shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700`}>
      {initialsFor(user)}
    </div>
  );
}

function SkeletonCard({ compact = false }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 animate-pulse rounded-full bg-slate-100" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-32 animate-pulse rounded bg-slate-100" />
          <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
        </div>
      </div>
      {!compact && (
        <>
          <div className="mt-5 h-4 w-full animate-pulse rounded bg-slate-100" />
          <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-slate-100" />
        </>
      )}
    </div>
  );
}

function ExpandableText({ text }) {
  const [expanded, setExpanded] = useState(false);
  const shouldClamp = text && text.length > 220;

  if (!text?.trim()) return null;

  return (
    <div className="mt-4">
      <p className={`whitespace-pre-wrap text-sm leading-6 text-slate-700 ${expanded ? "" : "line-clamp-4"}`}>
        {text}
      </p>
      {shouldClamp && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-2 text-xs font-semibold text-indigo-700"
        >
          {expanded ? "See less" : "See more"}
        </button>
      )}
    </div>
  );
}

function PostCommentBox({ post }) {
  const [comments, setComments] = useState(post.comments || []);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div className="mt-4 border-t border-slate-100 pt-4">
      {comments.length > 0 && (
        <div className="space-y-2">
          {comments.map((comment, index) => (
            <div key={comment._id || index} className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold text-slate-900">
                @{comment.user?.username || "user"}
              </p>
              <p className="mt-1 text-sm leading-5 text-slate-600">{comment.message}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Write a comment..."
          className="app-input py-2 text-xs"
        />
        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white transition hover:bg-indigo-700 disabled:opacity-50"
          aria-label="Send comment"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}

function LikedUsersModal({ postId, onClose }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadUsers = async () => {
      try {
        const res = await API.get(`/upvotes/post/${postId}/users`);
        if (mounted) setUsers(res.data?.data || []);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadUsers();

    return () => {
      mounted = false;
    };
  }, [postId]);

  return (
    <FormModal title="Liked by" onClose={onClose}>
      <div className="rounded-[24px] bg-white p-5 sm:p-6">
        <h2 className="font-poppins text-xl font-semibold text-slate-950">
          Liked by
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
                <Avatar user={likedUser} className="h-10 w-10" />
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

function PostLikeAction({ post }) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLikedUsers, setShowLikedUsers] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadLikers = async () => {
      try {
        const res = await API.get(`/upvotes/post/${post._id}/users`);
        const users = res.data?.data || [];
        if (!mounted) return;
        setLikeCount(users.length);
        setLiked(users.some((likedUser) => likedUser._id === user?._id));
      } catch {
        if (!mounted) return;
        setLikeCount(0);
        setLiked(false);
      }
    };

    loadLikers();

    return () => {
      mounted = false;
    };
  }, [post._id, user?._id]);

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const toggleRes = await API.post(`/upvotes/post/${post._id}/toggle`);
      const nextLiked = toggleRes.status === 201;
      const usersRes = await API.get(`/upvotes/post/${post._id}/users`);
      const users = usersRes.data?.data || [];
      setLiked(nextLiked);
      setLikeCount(users.length);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleToggleLike}
          disabled={loading}
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition disabled:opacity-60 ${
            liked
              ? "border-indigo-200 bg-indigo-50 text-indigo-700"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          <ThumbsUp
            size={14}
            className={liked ? "fill-current text-indigo-700" : ""}
          />
          
        </button>
        <button
          type="button"
          onClick={() => setShowLikedUsers(true)}
          className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-indigo-700"
        >
          {likeCount} {likeCount === 1 ? "like" : "likes"}
        </button>
      </div>

      {showLikedUsers && (
        <LikedUsersModal
          postId={post._id}
          onClose={() => setShowLikedUsers(false)}
        />
      )}
    </>
  );
}

function PostCard({ post }) {
  const [showComments, setShowComments] = useState(false);
  const owner = post.postedBy;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar user={owner} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-950">
              {owner?.fullName || owner?.username || "GBPIET user"}
            </p>
            <p className="truncate text-sm text-slate-500">
              @{owner?.username || "user"} · {timeAgo(post.createdAt)}
            </p>
          </div>
        </div>
        <button
          type="button"
          className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Post menu"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>

      <ExpandableText text={post.text} />

      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Community post"
          className="mt-4 max-h-[520px] w-full rounded-2xl object-cover"
        />
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
        <PostLikeAction post={post} />
        <button
          type="button"
          onClick={() => setShowComments((value) => !value)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <MessageCircle size={14} />
          Comment {post.comments?.length || 0}
        </button>
      </div>

      {showComments && <PostCommentBox post={post} />}
    </article>
  );
}

function SuggestionCard({ user, onToggle }) {
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    try {
      setLoading(true);
      await API.post(`/follows/toggle/${user._id}`);
      onToggle(user._id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-slate-50">
      <Avatar user={user} className="h-10 w-10" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-950">
          {user.fullName || user.username}
        </p>
        <p className="truncate text-xs text-slate-500">
          {user.branch || "GBPIET"} / {user.year || user.role || "Student"}
        </p>
      </div>
      <button
        type="button"
        onClick={handleFollow}
        disabled={loading}
        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition disabled:opacity-60 ${
          user.isFollowing
            ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
            : "bg-indigo-600 text-white hover:bg-indigo-700"
        }`}
      >
        {loading ? "..." : user.isFollowing ? "Following" : "Follow"}
      </button>
    </div>
  );
}

function SuggestionsPanel({ suggestions, loading, onToggle }) {
  return (
    <aside className="hidden space-y-4 lg:sticky lg:top-24 lg:block">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-poppins text-lg font-semibold text-slate-950">Students</h2>
            <p className="mt-1 text-sm text-slate-500">Connect with contributors</p>
          </div>
          <Link
            to="/users"
            className="text-xs font-semibold text-indigo-700 transition hover:text-indigo-900"
          >
            See All
          </Link>
        </div>

        <div className="mt-4 space-y-2">
          {loading ? (
            [1, 2, 3].map((item) => <SkeletonCard key={item} compact />)
          ) : suggestions.length ? (
            suggestions.map((user) => (
              <SuggestionCard key={user._id} user={user} onToggle={onToggle} />
            ))
          ) : (
            <p className="rounded-2xl bg-slate-50 px-4 py-5 text-center text-sm text-slate-500">
              No suggestions available right now.
            </p>
          )}
        </div>
      </section>
    </aside>
  );
}

export default function PostsPage() {
  const { isAuthenticated, user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [postsLoading, setPostsLoading] = useState(true);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await API.get("/posts?limit=20");
        setPosts(res.data?.data?.posts || []);
        setPagination(res.data?.data?.pagination || null);
      } finally {
        setPostsLoading(false);
      }
    };

    loadPosts();
  }, []);

  useEffect(() => {
    const loadSuggestions = async () => {
      if (!isAuthenticated) {
        setSuggestionsLoading(false);
        return;
      }

      try {
        const res = await API.get("/users/suggestions?limit=8");
        const users = res.data?.data || [];
        setSuggestions(users.filter((suggestedUser) => suggestedUser._id !== user?._id));
      } finally {
        setSuggestionsLoading(false);
      }
    };

    loadSuggestions();
  }, [isAuthenticated, user?._id]);

  const handleFollowToggle = (userId) => {
    setSuggestions((currentSuggestions) =>
      currentSuggestions.map((suggestedUser) =>
        suggestedUser._id === userId
          ? { ...suggestedUser, isFollowing: !suggestedUser.isFollowing }
          : suggestedUser,
      ),
    );
  };

  return (
    <main className="app-page">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="page-title">Community</h1>
            <p className="page-subtitle">
              See what students are sharing and discussing.
            </p>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,0.7fr)_minmax(280px,0.3fr)]">
          <section className="min-w-0 space-y-5">
            {isAuthenticated && !showPostForm && (
              <button
                type="button"
                onClick={() => setShowPostForm(true)}
                className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:shadow-md"
              >
                <Avatar user={user} className="h-10 w-10" />
                <span className="flex-1 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                  Share a post...
                </span>
              </button>
            )}

            {isAuthenticated && showPostForm && (
              <PostComposer
                onClose={() => setShowPostForm(false)}
                onPostCreated={(post) => {
                  setPosts((currentPosts) => [post, ...currentPosts]);
                  setShowPostForm(false);
                }}
              />
            )}

            {postsLoading ? (
              <div className="space-y-5">
                {[1, 2, 3].map((item) => (
                  <SkeletonCard key={item} />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                <UserPlus className="mx-auto text-indigo-600" size={34} />
                <h2 className="mt-4 font-poppins text-xl font-semibold text-slate-950">
                  No posts yet
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Be the first to share something with the GBPIET community.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            )}

            {pagination && pagination.totalResult > posts.length && (
              <div className="text-center text-xs text-slate-500">
                Showing latest {posts.length} of {pagination.totalResult} posts.
              </div>
            )}
          </section>

          <SuggestionsPanel
            suggestions={suggestions}
            loading={suggestionsLoading}
            onToggle={handleFollowToggle}
          />
        </div>
      </div>
    </main>
  );
}
