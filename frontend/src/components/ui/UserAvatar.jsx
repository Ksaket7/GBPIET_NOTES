const getUserInitials = (user, fallback = "U") => {
  const source = user?.fullName || user?.name || user?.username || fallback;

  return source
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export default function UserAvatar({
  user,
  className = "h-11 w-11",
  fallback = "U",
  rounded = "rounded-full",
}) {
  const label = user?.fullName || user?.name || user?.username || "User";

  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={label}
        className={`${className} shrink-0 ${rounded} object-cover`}
      />
    );
  }

  return (
    <div
      className={`${className} flex shrink-0 items-center justify-center ${rounded} bg-indigo-100 text-sm font-bold text-indigo-700`}
    >
      {getUserInitials(user, fallback)}
    </div>
  );
}
