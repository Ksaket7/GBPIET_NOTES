import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, LogOut, Settings } from "lucide-react";

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
        className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-lg shadow-slate-500/20"
      >
        {user?.username?.charAt(0).toUpperCase()}
      </button>

      {open && (
        <div className="absolute left-0 top-12 z-[60] w-56 rounded-3xl border border-white/70 bg-white/90 p-2 shadow-2xl shadow-slate-500/20 backdrop-blur-xl md:left-auto md:right-0">
          <div className="border-b border-slate-100 px-3 py-3">
            <p className="truncate text-sm font-semibold text-slate-950">
              {user?.username}
            </p>
            <p className="truncate text-xs text-slate-500">{user?.email}</p>
          </div>

          <div className="mt-2 space-y-1">
            <Link
              to="/notes"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
            >
              <FileText size={16} />
              My uploads
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
