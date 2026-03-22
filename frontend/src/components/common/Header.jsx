import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Menu, X, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/logo.png";
import ProfileDropdown from "../user/PrfileDropdown";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { name: "Notes", path: "/notes" },
    { name: "Q&A", path: "/questions" },
    { name: "Upload", path: "/upload" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 backdrop-blur-md bg-black/20 z-40"
          onClick={() => setOpen(false)}
        />
      )}
      <motion.nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/70 backdrop-blur-xl shadow-lg border-b"
            : "bg-white/50 backdrop-blur-md"
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-5 py-3 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center ">
            <img src={logo} className="h-10 object-contain text-primary hover:text-primary" />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-sm transition ${
                  location.pathname === link.path
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-gray-700 hover:text-primary hover:bg-primary/5"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link
                  className="px-4 py-2 text-primary border border-primary rounded-lg"
                  to={"/login"}
                >
                  Login
                </Link>
                <Link
                  className="px-4 py-2 bg-primary text-white rounded-lg"
                  to={"signup"}
                >
                  Signup
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <ProfileDropdown user={user} logout={logout} />
              </div>
            )}
          </div>

          {/* Mobile Button */}
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="md:hidden bg-white/95 backdrop-blur-xl shadow-lg px-5 py-5 space-y-4 "
            >
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className="block text-lg"
                >
                  {link.name}
                </Link>
              ))}

              {isAuthenticated ? (
                <div className="pt-4 border-t space-y-3">
                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold">{user?.username}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 mt-3">
                    <Link
                      to="/profile"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
                    >
                      👤 My Profile
                    </Link>

                    <Link
                      to="/my-uploads"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
                    >
                      📄 My Uploads
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
                    >
                      ⚙️ Settings
                    </Link>
                  </div>
                  <div className="border-t pt-2">
                    <button
                      onClick={logout}
                      className="flex items-center gap-2 w-full px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-4 border-t flex flex-col gap-2">
                  <Link
                    to="/login"
                    className="text-center px-4 py-2 border rounded-lg"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="text-center px-4 py-2 bg-primary text-white rounded-lg"
                  >
                    Signup
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
