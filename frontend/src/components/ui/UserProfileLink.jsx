import { Link } from "react-router-dom";

const getDisplayName = (user, fallback) =>
  fallback || user?.fullName || user?.name || user?.username || "GBPIET user";

export default function UserProfileLink({
  user,
  children,
  className = "",
  showHandle = false,
  stopPropagation = true,
}) {
  const username = user?.username;
  const displayName = children || getDisplayName(user);
  const content = showHandle && username ? `@${username}` : displayName;

  if (!username) {
    return <span className={className}>{content}</span>;
  }

  return (
    <Link
      to={`/profile/${username}`}
      onClick={(event) => {
        if (stopPropagation) event.stopPropagation();
      }}
      className={`transition hover:text-indigo-700 hover:underline ${className}`}
      title={`Open ${username}'s profile`}
    >
      {content}
    </Link>
  );
}
