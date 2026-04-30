import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BookOpen,
  HelpCircle,
  Home,
  LogIn,
  LogOut,
  Mail,
  Menu,
  Newspaper,
  Settings,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";
import ProfileDropdown from "../user/PrfileDropdown";

const links = [
  { name: "Home", path: "/", icon: Home },
  { name: "Notes", path: "/notes", icon: BookOpen },
  { name: "Posts", path: "/posts", icon: Newspaper },
  { name: "Q&A", path: "/questions", icon: HelpCircle },
  { name: "Users", path: "/users", icon: Users },
  { name: "Contact", path: "/contact", icon: Mail },
];

function NavLinkItem({ link, active, onClick }) {
  const Icon = link.icon;

  return (
    <Link
      to={link.path}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
        active
          ? "bg-white text-slate-950 shadow-sm"
          : "text-slate-600 hover:bg-white/60 hover:text-slate-950"
      }`}
    >
      <Icon size={17} />
      {link.name}
    </Link>
  );
}

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setOpen(false);

  const nav = (
    <>
      <div className="flex items-center gap-3 px-2">
        <img src={logo} alt="GBPIET Notes" className="h-10 w-10 rounded-2xl object-cover" />
        <div>
          <p className="font-poppins text-lg font-semibold text-slate-950">
            GBPIET
          </p>
          <p className="text-xs text-slate-500">Knowledge hub</p>
        </div>
      </div>

      <nav className="mt-8 space-y-2">
        {links.map((link) => (
          <NavLinkItem
            key={link.path}
            link={link}
            active={
              link.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(link.path)
            }
            onClick={closeMenu}
          />
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        {isAuthenticated ? (
          <>
            <Link
              to="/settings"
              onClick={closeMenu}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-white/60"
            >
              <Settings size={17} />
              Settings
            </Link>
            <div className="rounded-3xl bg-white/60 p-4">
              <div className="flex items-center gap-3">
                <ProfileDropdown user={user} logout={logout} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-950">
                    {user?.username}
                  </p>
                  <p className="truncate text-xs text-slate-500">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="mt-4 flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold text-red-500 hover:bg-red-50"
              >
                <LogOut size={16} />
                Log out
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <Link to="/login" onClick={closeMenu} className="app-button-secondary w-full">
              <LogIn size={16} />
              Login
            </Link>
            <Link to="/signup" onClick={closeMenu} className="app-button w-full">
              <UserPlus size={16} />
              Signup
            </Link>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      <aside className="fixed bottom-6 left-6 top-6 z-50 hidden w-60 flex-col rounded-[30px] border border-white/70 bg-white/45 p-5 shadow-2xl shadow-slate-500/20 backdrop-blur-2xl lg:flex">
        {nav}
      </aside>

      <header className="fixed left-3 right-3 top-3 z-50 rounded-[22px] border border-white/70 bg-white/55 px-3 py-3 shadow-xl shadow-slate-500/10 backdrop-blur-2xl sm:left-4 sm:right-4 sm:top-4 sm:px-4 lg:hidden">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="GBPIET Notes" className="h-9 w-9 rounded-2xl object-cover" />
            <span className="font-poppins font-semibold text-slate-950">
              GBPIET
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="rounded-2xl bg-white/80 p-2 text-slate-800"
            aria-label="Toggle navigation"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/20 p-3 pt-20 backdrop-blur-sm sm:p-4 lg:hidden"
          onClick={closeMenu}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="flex max-h-[calc(100vh-6rem)] min-h-[70vh] flex-col overflow-y-auto rounded-[24px] border border-white/70 bg-white/85 p-4 shadow-2xl backdrop-blur-2xl sm:rounded-[28px] sm:p-5"
          >
            {nav}
          </div>
        </div>
      )}
    </>
  );
}
