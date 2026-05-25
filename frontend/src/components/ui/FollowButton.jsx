export default function FollowButton({
  isFollowing,
  isSelf,
  loading,
  onClick,
  className = "",
}) {
  return (
    <button
      type="button"
      disabled={isSelf || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
        isSelf
          ? "border border-slate-200 bg-slate-50 text-slate-500"
          : isFollowing
            ? "border border-indigo-200 bg-white text-indigo-700 shadow-sm hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50"
            : "border border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:-translate-y-0.5 hover:bg-indigo-700"
      } ${className}`}
    >
      {loading ? "..." : isSelf ? "You" : isFollowing ? "Following" : "Follow"}
    </button>
  );
}
