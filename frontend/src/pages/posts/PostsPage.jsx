import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  Send,
  UserPlus,
} from "lucide-react";
import API from "../../services/api";
import { timeAgo } from "../../utils/timeAgo";
import PostComposer from "../../components/posts/PostComposer";
import { useAuth } from "../../context/AuthContext";
import AttachmentCarousel from "../../components/ui/AttachmentCarousel";
import ExpandableText from "../../components/ui/ExpandableText";
import SkeletonCard from "../../components/ui/SkeletonCard";
import SocialLikeAction from "../../components/ui/SocialLikeAction";
import UserAvatar from "../../components/ui/UserAvatar";
import UserProfileLink from "../../components/ui/UserProfileLink";
import FollowButton from "../../components/ui/FollowButton";
import CardActionMenu from "../../components/ui/CardActionMenu";
import { useToast } from "../../context/ToastContext";

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
                <UserProfileLink user={comment.user} showHandle>
                  @{comment.user?.username || "user"}
                </UserProfileLink>
              </p>
              <p className="mt-1 text-sm leading-5 text-slate-600">{comment.message}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-3 flex items-end gap-2">
        <label className="block flex-1 space-y-2">
          <span className="text-xs font-semibold text-slate-700">Comment</span>
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Write a comment..."
            className="app-input py-2 text-xs"
          />
        </label>
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

function PostCard({ post, onPostDeleted, onPostUpdated }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [showComments, setShowComments] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(post.text || "");
  const [saving, setSaving] = useState(false);
  const owner = post.postedBy;
  const isOwner = owner?._id === user?._id;

  const handleDelete = async () => {
    await API.delete(`/posts/${post._id}`);
    showToast("Post deleted successfully.", "success");
    onPostDeleted?.(post._id);
  };

  const handleSave = async () => {
    if (!editText.trim() && !(post.images?.length || post.imageUrl)) return;
    try {
      setSaving(true);
      const formData = new FormData();
      formData.append("text", editText);
      const res = await API.patch(`/posts/${post._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onPostUpdated?.(res.data.data);
      setEditing(false);
      showToast("Post updated successfully.", "success");
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <UserAvatar user={owner} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-950">
              <UserProfileLink user={owner}>
                {owner?.fullName || owner?.username || "GBPIET user"}
              </UserProfileLink>
            </p>
            <p className="truncate text-sm text-slate-500">
              <UserProfileLink
                user={owner}
                showHandle
                className="text-slate-500 hover:text-indigo-700"
              />{" "}
              - {timeAgo(post.createdAt)}
            </p>
          </div>
        </div>
        <CardActionMenu
          isOwner={isOwner}
          canEdit
          ownerUser={owner}
          onEdit={() => setEditing(true)}
          onDelete={isOwner ? handleDelete : undefined}
        />
      </div>

      {editing ? (
        <div className="mt-4 space-y-3">
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-700">Post content</span>
            <textarea
              value={editText}
              onChange={(event) => setEditText(event.target.value)}
              placeholder="Edit your post..."
              className="app-input min-h-28"
            />
          </label>
          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setEditText(post.text || "");
                setEditing(false);
              }}
              className="app-button-secondary py-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      ) : (
        <>
          <ExpandableText text={post.text} />
          <AttachmentCarousel item={post} label="Community post image" />
        </>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
        <SocialLikeAction type="post" id={post._id} />
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
      <UserAvatar user={user} className="h-10 w-10" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-950">
          <UserProfileLink user={user}>
            {user.fullName || user.username}
          </UserProfileLink>
        </p>
        <p className="truncate text-xs text-slate-500">
          {user.branch || "GBPIET"} / {user.year || user.role || "Student"}
        </p>
      </div>
      <FollowButton
        isFollowing={user.isFollowing}
        loading={loading}
        onClick={handleFollow}
        className="rounded-full px-3 py-1.5 text-xs"
      />
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
                <UserAvatar user={user} className="h-10 w-10" />
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
                  <PostCard
                    key={post._id}
                    post={post}
                    onPostDeleted={(postId) =>
                      setPosts((currentPosts) =>
                        currentPosts.filter((currentPost) => currentPost._id !== postId)
                      )
                    }
                    onPostUpdated={(updatedPost) =>
                      setPosts((currentPosts) =>
                        currentPosts.map((currentPost) =>
                          currentPost._id === updatedPost._id ? updatedPost : currentPost
                        )
                      )
                    }
                  />
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
