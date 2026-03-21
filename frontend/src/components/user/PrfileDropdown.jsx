import { useState, useRef, useEffect } from "react";
import { User, LogOut, Settings, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const ProfileDropdown = ({ user, logout }) => {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef();

  // Detect screen size
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // Click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!ref.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {open && (
        <div
          className="fixed inset-0 backdrop-blur-md bg-black/20 z-40 h-screen w-screen"
          onClick={() => setOpen(false)}
        />
      )}
      {/* Avatar */}
      <div
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center cursor-pointer"
      >
        {user?.username?.charAt(0).toUpperCase()}
      </div>

      {/* DESKTOP DROPDOWN */}
      {!isMobile && open && (
        <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border p-2 z-[60]">
          <div className="px-3 py-2 border-b">
            <p className="font-semibold text-sm">{user?.username}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>

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
      )}
    </div>
  );
};

export default ProfileDropdown;
