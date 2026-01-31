import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const response = await API.post("/users/login", form);

      // ✅ ApiResponse
      if (response.data?.success) {
        setSuccessMessage(response.data.message);

        // 🔑 UPDATE AUTH CONTEXT
        login(response.data.data.user);

        // 🔁 Redirect to home (dashboard)
        navigate("/");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-surface border border-borderSoft rounded-xl p-8">
        <h1 className="font-poppins text-3xl text-textPrimary text-center mb-6">
          Login
        </h1>
        {errorMessage && (
          <p className="text-sm text-red-600 text-center mb-4">
            {errorMessage}
          </p>
        )}
        {successMessage && (
          <div className="mb-4 text-sm text-green-600 text-center">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-inter">
          
          
          <div>
            <label className="block text-sm text-textSecondary mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-borderSoft rounded-md
                 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="block text-center text-sm text-textSecondary mb-1">
            OR
          </div>
          <div>
            <label className="block text-sm text-textSecondary mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              onChange={handleChange}
              className="w-full px-4 py-2 border border-borderSoft rounded-md
                 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm text-textSecondary mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              onChange={handleChange}
              className="w-full px-4 py-2 border border-borderSoft rounded-md
                 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-primary text-white py-2 rounded-md
               hover:bg-primaryDark transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-textSecondary text-center mt-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
