import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function SignupPage() {
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    branch: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", form);
      // later: redirect to login page
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-surface border border-borderSoft rounded-xl p-8">
        <h1 className="font-poppins text-3xl text-textPrimary text-center mb-6">
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4 font-inter">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            required
            onChange={handleChange}
            className="w-full px-4 py-2 border border-borderSoft rounded-md
                       focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            required
            onChange={handleChange}
            className="w-full px-4 py-2 border border-borderSoft rounded-md
                       focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
            className="w-full px-4 py-2 border border-borderSoft rounded-md
                       focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* Password Field with Toggle */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              onChange={handleChange}
              className="w-full px-4 py-2 pr-12 border border-borderSoft rounded-md
                         focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2
                         text-sm text-primary hover:text-primaryDark"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <input
            type="text"
            name="branch"
            placeholder="Branch (e.g. CSE, ECE)"
            required
            onChange={handleChange}
            className="w-full px-4 py-2 border border-borderSoft rounded-md
                       focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            name="role"
            placeholder="Role (e.g.admin, cr, faculty,student)"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-borderSoft rounded-md
                       focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <button
            type="submit"
            className="w-full mt-2 bg-primary text-white py-2 rounded-md
                       hover:bg-primaryDark transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-textSecondary text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
