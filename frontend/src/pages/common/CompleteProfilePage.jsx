import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  GraduationCap,
  Sparkles,
  UserRound,
} from "lucide-react";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import UserAvatar from "../../components/ui/UserAvatar";

const branches = ["CSE", "CSE (AIML)", "ECE", "ME", "CE", "EE", "BT"];
const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const roles = ["student", "cr", "faculty", "admin"];

const steps = [
  "Academic identity",
  "Community role",
  "Start contributing",
];

export default function CompleteProfilePage() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    username: user?.username || "",
    branch: user?.branch === "Unassigned" ? "" : user?.branch || "",
    year: user?.year || "",
    role: user?.role || "student",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await API.patch("/users/complete-profile", form);
      setUser(response.data.data);
      navigate("/");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden px-3 py-6 sm:px-5 sm:py-8 lg:px-8">
      <section className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[30px] border border-white/70 bg-white/55 shadow-2xl shadow-slate-500/20 backdrop-blur-2xl lg:min-h-[650px] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <aside className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-sky-500 p-5 text-white sm:p-8">
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/15" />
          <div className="absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-white/10" />
          <div className="absolute left-10 top-28 h-3 w-3 rounded-full bg-white/50" />

          <div className="relative z-10 flex h-full flex-col">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-indigo-950/10 backdrop-blur">
              <Sparkles size={14} />
              Final step
            </div>

            <div className="mt-10 max-w-md">
              <h1 className="font-poppins text-3xl font-semibold leading-tight sm:text-4xl">
                Complete your profile
              </h1>
              <p className="mt-4 text-sm leading-6 text-white/80">
                Add your academic details so your notes, questions, posts, and leaderboard activity appear correctly across GBPIET Notes.
              </p>
            </div>

            <div className="mt-8 rounded-[26px] border border-white/20 bg-white/15 p-5 shadow-2xl shadow-indigo-950/10 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <UserAvatar
                  user={{
                    ...user,
                    fullName: form.fullName || user?.fullName,
                    username: form.username || user?.username,
                  }}
                  className="h-20 w-20 border-4 border-white/70 text-2xl shadow-xl shadow-indigo-950/20"
                />
                <div className="min-w-0">
                  <h2 className="truncate font-poppins text-2xl font-semibold">
                    {form.fullName || "Your name"}
                  </h2>
                  <p className="truncate text-sm text-white/75">
                    @{form.username || "username"}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/15 p-3">
                  <p className="text-xs font-semibold uppercase text-white/60">Branch</p>
                  <p className="mt-1 truncate text-sm font-semibold">
                    {form.branch || "Select branch"}
                  </p>
                </div>
                <div className="rounded-2xl bg-white/15 p-3">
                  <p className="text-xs font-semibold uppercase text-white/60">Year</p>
                  <p className="mt-1 truncate text-sm font-semibold">
                    {form.year || "Select year"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-auto hidden pt-8 lg:block">
              <div className="grid gap-3">
                {steps.map((step, index) => (
                  <div
                    key={step}
                    className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white/85"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-indigo-700">
                      {index + 1}
                    </span>
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <section className="bg-white/80 p-4 sm:p-7 lg:p-9">
          <div className="mx-auto flex h-full w-full max-w-2xl flex-col justify-center">
            <div className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-xl shadow-slate-500/10 sm:p-7">
              <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
                    Profile setup
                  </p>
                  <h2 className="mt-2 font-poppins text-2xl font-semibold text-slate-950 sm:text-3xl">
                    Academic details
                  </h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-lg shadow-indigo-200/40">
                  <BadgeCheck size={24} />
                </div>
              </div>

              {errorMessage && (
                <p className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {errorMessage}
                </p>
              )}

              <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <UserRound size={16} className="text-indigo-500" />
                    Full name
                  </span>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    className="app-input bg-slate-50/80"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <UserRound size={16} className="text-indigo-500" />
                    Username
                  </span>
                  <input
                    type="text"
                    name="username"
                    placeholder="Choose a username"
                    value={form.username}
                    onChange={handleChange}
                    required
                    className="app-input bg-slate-50/80"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <BookOpen size={16} className="text-indigo-500" />
                    Branch
                  </span>
                  <select
                    name="branch"
                    value={form.branch}
                    onChange={handleChange}
                    required
                    className="app-input bg-slate-50/80"
                  >
                    <option value="" disabled>Select branch</option>
                    {branches.map((branch) => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                </label>

                <label className="block space-y-2">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <GraduationCap size={16} className="text-indigo-500" />
                    Academic year
                  </span>
                  <select
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    required
                    className="app-input bg-slate-50/80"
                  >
                    <option value="" disabled>Select academic year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </label>

                <label className="block space-y-2 sm:col-span-2">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <BadgeCheck size={16} className="text-indigo-500" />
                    Community role
                  </span>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    required
                    className="app-input bg-slate-50/80"
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>{role.toUpperCase()}</option>
                    ))}
                  </select>
                </label>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:from-indigo-700 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Saving profile..." : "Complete profile"}
                    {!loading && <ArrowRight size={18} />}
                  </button>
                </div>
              </form>
            </div>

            <p className="mx-auto mt-5 max-w-lg text-center text-xs leading-5 text-slate-500">
              You can add bio, tech stack, interests, cover image, and profile links later from Settings.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}
