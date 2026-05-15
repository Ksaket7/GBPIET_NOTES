import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  BarChart3,
  HelpCircle,
  LogOut,
  Settings,
  UserCircle,
  Users,
} from "lucide-react";

const menuLinks = [
  {
    label: "Profile",
    path: null,
    icon: UserCircle,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
  {
    label: "Leaderboard",
    path: "/leaderboard",
    icon: BarChart3,
  },
  {
    label: "People",
    path: "/users",
    icon: Users,
  },
  {
    label: "Contact",
    path: "/contact",
    icon: HelpCircle,
  },
];

const ProfileDropdown = ({ user, logout }) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef();
  const menuRef = useRef();
  const avatarInitial =
    (user?.fullName || user?.username || "U").trim().charAt(0).toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !buttonRef.current?.contains(event.target) &&
        !menuRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative mr-1 shrink-0 sm:mr-0">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-950 text-xs font-semibold text-white shadow-lg shadow-slate-500/20 min-[380px]:h-9 min-[380px]:w-9 sm:h-10 sm:w-10 sm:text-sm"
      >
        {user?.avatar ? (
          <img src={user.avatar} alt={user?.username || "User"} className="h-full w-full object-cover" />
        ) : (
          user?.username?.charAt(0).toUpperCase()
        )}
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed right-2 top-[4.5rem] z-[9999] w-[min(16rem,calc(100vw-1rem))] rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-2xl shadow-slate-500/20 backdrop-blur-xl sm:right-6"
          >
            <div className="flex items-center gap-3 border-b border-slate-100 px-3 py-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-950 text-base font-semibold text-white shadow-lg shadow-slate-500/20">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user?.username || "User"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  avatarInitial
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-950">
                  {user?.fullName || user?.username || "GBPIET user"}
                </p>
                <p className="truncate text-xs text-slate-500">
                  @{user?.username || "student"}
                </p>
                <p className="truncate text-xs text-slate-400">{user?.email}</p>
              </div>
            </div>

            <div className="mt-2 space-y-1">
              {menuLinks.map((link) => {
                const Icon = link.icon;

                return (
                <Link
                  key={link.label}
                  to={link.path || `/profile/${user?.username || ""}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    <Icon size={16} />
                    {link.label}
                  </Link>
                );
              })}
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="mt-2 flex w-full items-center gap-2 rounded-2xl border-t border-slate-100 px-3 py-2 pt-3 text-sm font-medium text-red-500 transition hover:bg-red-50"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
          ,
          document.body,
        )}
    </div>
  );
};

export default ProfileDropdown;
