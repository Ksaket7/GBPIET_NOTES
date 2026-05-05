import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, Settings, UserCircle } from "lucide-react";

const ProfileDropdown = ({ user, logout }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!ref.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-950 text-sm font-semibold text-white shadow-lg shadow-slate-500/20"
      >
        {user?.avatar ? (
          <img src={user.avatar} alt={user?.username || "User"} className="h-full w-full object-cover" />
        ) : (
          user?.username?.charAt(0).toUpperCase()
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-[80] w-56 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-2xl shadow-slate-500/20 backdrop-blur-xl">
          <div className="border-b border-slate-100 px-3 py-3">
            <p className="truncate text-sm font-semibold text-slate-950">
              {user?.username}
            </p>
            <p className="truncate text-xs text-slate-500">{user?.email}</p>
          </div>

          <div className="mt-2 space-y-1">
            <Link
              to="/settings?tab=profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
            >
              <UserCircle size={16} />
              Profile
            </Link>
            <Link
              to="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
            >
              <Settings size={16} />
              Settings
            </Link>
            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-sm text-red-500 hover:bg-red-50"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
