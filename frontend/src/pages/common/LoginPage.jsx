import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Sparkles } from "lucide-react";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import GoogleAuthButton from "../../components/common/GoogleAuthButton";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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
        const user = response.data.data.user;
        login(user);
        navigate(user.profileCompleted === false ? "/complete-profile" : "/");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCredential = async (credential) => {
    setErrorMessage("");
    setSuccessMessage("");
    setGoogleLoading(true);

    try {
      const response = await API.post("/users/google", { credential });
      if (response.data?.success) {
        const user = response.data.data.user;
        login(user);
        navigate(user.profileCompleted === false ? "/complete-profile" : "/");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Google login failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-2xl shadow-slate-500/25 md:min-h-[620px] md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <section className="flex items-center justify-center bg-white px-5 py-10 sm:px-8 md:px-12">
          <div className="w-full max-w-sm">
          <h1 className="text-center font-poppins text-3xl font-semibold text-slate-950">
            Login
          </h1>
          <p className="mt-3 text-center text-sm text-slate-500">
            Continue to your academic workspace.
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
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              required
              onChange={handleChange}
              className="app-input rounded-full bg-slate-50 px-5 shadow-inner shadow-slate-200/70"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={form.password}
              onChange={handleChange}
              className="app-input rounded-full bg-slate-50 px-5 shadow-inner shadow-slate-200/70"
            />
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:-translate-y-0.5 hover:from-violet-700 hover:to-indigo-600 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs font-semibold text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            OR
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <GoogleAuthButton
            disabled={loading || googleLoading}
            onCredential={handleGoogleCredential}
            label="Login with Google"
            googleText="signin_with"
            onMissingConfig={() =>
              setErrorMessage("Google login needs VITE_GOOGLE_CLIENT_ID in frontend env.")
            }
          />

          <p className="mt-6 text-center text-sm text-slate-500">
            Do not have an account?{" "}
            <Link to="/signup" className="font-semibold text-indigo-700">
              Sign up
            </Link>
          </p>
          </div>
        </section>

        <section className="relative hidden overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 p-8 text-white md:flex md:items-center md:justify-center">
          <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-white" />
          <div className="absolute -bottom-14 -left-14 h-32 w-32 rounded-full bg-white/20" />
          <div className="absolute left-8 top-20 h-3 w-3 rounded-full bg-white/50" />
          <div className="absolute right-20 bottom-24 h-4 w-4 rounded-full bg-yellow-300/80" />
          <div className="relative z-10 max-w-md text-center">
            <div className="mx-auto flex h-48 w-64 items-end justify-center">
              <div className="relative">
                <div className="absolute -left-14 bottom-8 h-16 w-52 -rotate-6 rounded-xl bg-cyan-200 shadow-2xl" />
                <div className="absolute -left-10 bottom-14 h-16 w-52 -rotate-3 rounded-xl bg-orange-300 shadow-2xl" />
                <div className="absolute -left-6 bottom-20 h-16 w-52 rounded-xl bg-yellow-200 shadow-2xl" />
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                  <BookOpen size={54} className="text-white" />
                  <Sparkles size={24} className="absolute -right-2 -top-2 text-yellow-200" />
                </div>
              </div>
            </div>
            <h2 className="mt-8 font-poppins text-4xl font-semibold">
              Learn together
            </h2>
            <p className="mt-4 text-sm leading-6 text-white/80">
              Notes, questions, posts, and academic help in one focused student space.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
