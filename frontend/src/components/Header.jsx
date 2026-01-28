import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="w-full bg-background shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-5">
        {/* Logo */}
        <Link
          to="/"
          className="font-poppins text-2xl font-semibold text-primary"
        >
          GBPIET Notes
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link
            to="/notes"
            className="font-inter text-textPrimary hover:text-primaryDark"
          >
            Notes
          </Link>
          <Link
            to="/questions"
            className="font-inter text-textPrimary hover:text-primaryDark"
          >
            Q&A
          </Link>
          <Link
            to="/upload"
            className="font-inter text-textPrimary hover:text-primaryDark"
          >
            Upload
          </Link>
        </nav>

        {/* Login / Signup */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="font-inter px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="font-inter px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark transition"
          >
            Signup
          </Link>
        </div>
      </div>
    </header>
  );
}
