import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Menu, X, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../assets/logo.png";

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
          <img src={logo} className="h-10 object-contain" />
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
              <Link className="px-4 py-2 text-primary border border-primary rounded-lg" to={"/login"}>
                Login
              </Link>
              <Link className="px-4 py-2 bg-primary text-white rounded-lg" to={"signup"}>
                Signup
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center">
                <User size={18} />
              </div>

              {/* Logout Icon */}
              <button
                onClick={logout}
                className="p-2 rounded-lg hover:bg-red-100 text-red-500"
              >
                <LogOut size={18} />
              </button>
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
            className="md:hidden bg-white/95 backdrop-blur-xl shadow-lg px-5 py-5 space-y-4"
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

            {!isAuthenticated ? (
              <div className="flex flex-col gap-2 pt-3">
                <Link className="border p-2 rounded-lg text-center">Login</Link>
                <Link className="bg-primary text-white p-2 rounded-lg text-center">
                  Signup
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-2">
                  <User />
                  <span>{user?.username}</span>
                </div>

                <button onClick={logout}>
                  <LogOut />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
