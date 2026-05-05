import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const branches = ["CSE", "CSE (AIML)", "ECE", "ME", "CE", "EE", "BT"];
const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const roles = ["student", "cr", "faculty", "admin"];

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
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <section className="w-full max-w-2xl rounded-[30px] border border-white/70 bg-white/70 p-5 shadow-2xl shadow-slate-500/20 backdrop-blur-2xl sm:p-8">
        <span className="pill">Final step</span>
        <h1 className="mt-4 font-poppins text-3xl font-semibold text-slate-950">
          Complete your profile
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Add your academic details so GBPIET Notes can personalize your workspace.
        </p>

        {errorMessage && (
          <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {errorMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            name="fullName"
            placeholder="Full name"
            value={form.fullName}
            onChange={handleChange}
            required
            className="app-input"
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className="app-input"
          />
          <select
            name="branch"
            value={form.branch}
            onChange={handleChange}
            required
            className="app-input"
          >
            <option value="" disabled>
              Select branch
            </option>
            {branches.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
            className="app-input"
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role.toUpperCase()}
              </option>
            ))}
          </select>
          <select
            name="year"
            value={form.year}
            onChange={handleChange}
            required
            className="app-input"
          >
            <option value="" disabled>
              Select academic year
            </option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={loading}
            className="app-button w-full sm:col-span-2"
          >
            {loading ? "Saving..." : "Complete profile"}
          </button>
        </form>
      </section>
    </main>
  );
}
