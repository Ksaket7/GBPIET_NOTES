import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function SignupPage() {
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    branch: "",
    role: "student",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const branches = ["CSE", "CSE (AIML)", "ECE", "ME", "CE", "EE", "BT"];
  const roles = ["student", "cr", "faculty", "admin"];

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const response = await API.post("/users/register", form);
      if (response.data?.success) {
        setSuccessMessage(response.data.message);
        setTimeout(() => navigate("/login"), 1000);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-page md:pl-8">
      <div className="mx-auto grid max-w-6xl gap-6 rounded-[32px] border border-white/70 bg-white/45 p-4 shadow-2xl shadow-slate-500/20 backdrop-blur-2xl md:grid-cols-[1fr_520px] md:p-7">
        <section className="hidden rounded-[28px] bg-gradient-to-br from-slate-950 to-indigo-700 p-8 text-white md:flex md:flex-col md:justify-end">
          <p className="text-sm font-semibold text-white/75">Join GBPIET Notes</p>
          <h1 className="mt-3 font-poppins text-4xl font-semibold">
            Build a cleaner academic workspace together
          </h1>
        </section>

        <section className="glass-panel p-6 md:p-8">
          <h1 className="font-poppins text-3xl font-semibold text-slate-950">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Choose your role and branch to personalize the dashboard.
          </p>

          {errorMessage && (
            <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
            <input type="text" name="fullName" placeholder="Full Name" required onChange={handleChange} className="app-input" />
            <input type="text" name="username" placeholder="Username" required onChange={handleChange} className="app-input" />
            <input type="email" name="email" placeholder="Email" required onChange={handleChange} className="app-input md:col-span-2" />
            <input type="password" name="password" placeholder="Password" required onChange={handleChange} className="app-input md:col-span-2" />

            <select name="branch" value={form.branch} onChange={handleChange} className="app-input">
              <option value="" disabled>Select Branch</option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>

            <select name="role" value={form.role} onChange={handleChange} className="app-input">
              {roles.map((role) => (
                <option key={role} value={role}>{role.toUpperCase()}</option>
              ))}
            </select>

            <button type="submit" disabled={loading} className="app-button md:col-span-2">
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-indigo-700">
              Login
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
