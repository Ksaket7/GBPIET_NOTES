import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const response = await API.post("/users/login", form);
      if (response.data?.success) {
        setSuccessMessage(response.data.message);
        login(response.data.data.user);
        navigate("/");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-page md:pl-8">
      <div className="mx-auto grid max-w-5xl gap-6 rounded-[32px] border border-white/70 bg-white/45 p-4 shadow-2xl shadow-slate-500/20 backdrop-blur-2xl md:grid-cols-[1fr_420px] md:p-7">
        <section className="hidden rounded-[28px] bg-gradient-to-br from-indigo-600 to-sky-500 p-8 text-white md:flex md:flex-col md:justify-end">
          <p className="text-sm font-semibold text-white/75">GBPIET Notes</p>
          <h1 className="mt-3 font-poppins text-4xl font-semibold">
            Welcome back to your knowledge hub
          </h1>
        </section>

        <section className="glass-panel p-6 md:p-8">
          <h1 className="font-poppins text-3xl font-semibold text-slate-950">
            Login
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Continue to your dashboard.
          </p>

          {errorMessage && (
            <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {successMessage}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input type="email" name="email" placeholder="Email" onChange={handleChange} className="app-input" />
            <div className="text-center text-xs font-semibold text-slate-400">OR</div>
            <input type="text" name="username" placeholder="Username" onChange={handleChange} className="app-input" />
            <input type="password" name="password" placeholder="Password" required onChange={handleChange} className="app-input" />
            <button type="submit" disabled={loading} className="app-button w-full">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Do not have an account?{" "}
            <Link to="/signup" className="font-semibold text-indigo-700">
              Sign up
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
