import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  BookOpen,
  Bot,
  HelpCircle,
  Home,
  LogIn,
  Menu,
  MessageSquareText,
  UserPlus,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";
import ProfileDropdown from "../user/PrfileDropdown";

const primaryLinks = [
  { name: "Home", path: "/", icon: Home },
  { name: "Notes", path: "/notes", icon: BookOpen },
  { name: "Q&A", path: "/questions", icon: HelpCircle },
  { name: "AI Chatbot", path: "/ai-chatbot", icon: Bot },
  { name: "Community", path: "/posts", icon: MessageSquareText },
];

const usersLink = { name: "Users", path: "/users", icon: UserPlus };
const leaderboardLink = { name: "Leaderboard", path: "/leaderboard", icon: BarChart3 };

function isActivePath(pathname, link) {
  if (link.path === "/") return pathname === "/";
  return pathname.startsWith(link.path);
}

function DesktopNavLink({ link, active }) {
  return (
    <Link
      to={link.path}
      className={`rounded-full px-3 py-2 text-sm font-medium transition ${
        active
          ? "bg-indigo-50 text-indigo-700"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
      }`}
    >
      {link.name}
    </Link>
  );
}

function MobileNavLink({ link, active, onClick }) {
  const Icon = link.icon;

  return (
    <Link
      to={link.path}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
        active
          ? "bg-indigo-50 text-indigo-700"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
      }`}
    >
      <Icon size={18} />
      {link.name}
    </Link>
  );
}

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setOpen(false);
  const allMobileLinks = [...primaryLinks, usersLink, leaderboardLink];

  return (
    <>
      <header className="sticky top-0 z-50 w-full max-w-[100vw] overflow-x-clip border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl min-w-0 items-center justify-between gap-2 overflow-hidden pl-3 pr-5 sm:gap-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="shrink-0 rounded-xl p-1.5 text-slate-700 transition hover:bg-slate-100 sm:p-2 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>

            <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
              <img
                src={logo}
                alt="GBPIET NOTES"
                className="h-9 w-9 shrink-0 rounded-xl object-cover sm:h-10 sm:w-10"
              />
              <span className="block max-w-[118px] truncate font-poppins text-sm font-semibold text-indigo-700 min-[390px]:max-w-[150px] sm:max-w-none sm:text-lg">
                GBPIET NOTES
              </span>
            </Link>
          </div>

          <nav className="hidden items-center gap-1 lg:flex">
            {primaryLinks.map((link) => (
              <DesktopNavLink
                key={link.path}
                link={link}
                active={isActivePath(location.pathname, link)}
              />
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to={leaderboardLink.path}
                  className={`hidden max-w-[150px] truncate rounded-full px-3 py-2 text-sm font-semibold transition sm:inline-flex md:max-w-none md:px-4 ${
                    isActivePath(location.pathname, leaderboardLink)
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                      : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                  }`}
                >
                  Leaderboard
                </Link>
                <ProfileDropdown user={user} logout={logout} />
              </>
            ) : (
              <>
                <Link to="/login" className="app-button-secondary hidden sm:inline-flex">
                  <LogIn size={16} />
                  Login
                </Link>
                <Link to="/signup" className="app-button hidden sm:inline-flex">
                  <UserPlus size={16} />
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/30 backdrop-blur-sm"
            onClick={closeMenu}
            aria-label="Close navigation overlay"
          />
          <aside className="relative flex h-full w-[min(82vw,320px)] animate-[slideInLeft_0.22s_ease-out] flex-col border-r border-slate-200 bg-white p-4 shadow-2xl">
            <div className="flex items-center justify-between gap-3">
              <Link to="/" onClick={closeMenu} className="flex min-w-0 items-center gap-3">
                <img
                  src={logo}
                  alt="GBPIET Notes"
                  className="h-9 w-9 rounded-xl object-cover"
                />
                <span className="truncate font-poppins font-semibold text-indigo-700">
                  GBPIET NOTES
                </span>
              </Link>
              <button
                type="button"
                onClick={closeMenu}
                className="rounded-xl p-2 text-slate-600 hover:bg-slate-100"
                aria-label="Close navigation"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="mt-8 space-y-2">
              {allMobileLinks.map((link) => (
                <MobileNavLink
                  key={link.path}
                  link={link}
                  active={isActivePath(location.pathname, link)}
                  onClick={closeMenu}
                />
              ))}
            </nav>

            {!isAuthenticated && (
              <div className="mt-auto space-y-2 pt-6">
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
          </aside>
        </div>
      )}
    </>
  );
}
