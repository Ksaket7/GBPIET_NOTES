import { useEffect, useState } from "react";
import { Image, MessageCircle, Send } from "lucide-react";
import API from "../../services/api";
import UpvoteButton from "../../components/upvote/UpvoteButton";
import { timeAgo } from "../../utils/timeAgo";

function ExpandableText({ text }) {
  const [expanded, setExpanded] = useState(false);
  const shouldClamp = text && text.length > 180;

  if (!text) return null;

  return (
    <div className="mt-4">
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
    <div className="mt-4 border-t border-white/70 pt-3">
      <div className="space-y-2">
        {comments.slice(0, 3).map((comment, index) => (
          <div key={comment._id || index} className="rounded-2xl bg-white/65 p-3">
            <p className="text-xs font-semibold text-slate-950">
              @{comment.user?.username || "user"}
            </p>
            <p className="text-sm text-slate-600">{comment.message}</p>
          </div>
        ))}
      </div>
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
          className="rounded-full bg-slate-950 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
        >
          {loading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}

function PostCard({ post }) {
  const owner = post.postedBy;

  return (
    <article className="soft-card mx-auto w-full max-w-3xl overflow-hidden p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-indigo-100">
          {owner?.avatar ? (
            <img
              src={owner.avatar}
              alt={owner.fullName}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="font-semibold text-indigo-700">
              {(owner?.fullName || owner?.username || "?").charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-950">
            {owner?.fullName || "GBPIET user"}
          </p>
          <p className="truncate text-xs text-slate-500">
            @{owner?.username || "user"} - {timeAgo(post.createdAt)}
          </p>
        </div>
      </div>

      {post.imageUrl ? (
        <img
          src={post.imageUrl}
          alt=""
          className="mt-4 max-h-[520px] w-full rounded-3xl object-cover"
        />
      ) : (
        <div className="mt-4 flex min-h-40 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-100 via-white to-sky-100 text-indigo-700">
          <Image size={28} />
        </div>
      )}

      <ExpandableText text={post.text} />

      <div className="mt-4 flex items-center gap-3 border-t border-white/70 pt-3">
        <UpvoteButton type="post" id={post._id} />
        <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-2 text-xs font-semibold text-slate-700">
          <MessageCircle size={14} />
          {post.comments?.length || 0}
        </span>
      </div>

      <PostCommentBox post={post} />
    </article>
  );
}

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await API.get("/posts?limit=20");
        setPosts(res.data?.data?.posts || []);
        setPagination(res.data?.data?.pagination || null);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  return (
    <main className="app-page">
      <div className="app-shell space-y-6">
        <header>
          <span className="pill">Posts</span>
          <h1 className="page-title mt-3">All posts</h1>
          <p className="page-subtitle">
            Updates shared by students, CRs, admins, and faculty.
          </p>
        </header>

        {loading ? (
          <div className="glass-panel p-6 text-sm text-slate-500">
            Loading posts...
          </div>
        ) : posts.length === 0 ? (
          <div className="glass-panel p-6 text-sm text-slate-500">
            No posts yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
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
      </div>
    </main>
  );
}
