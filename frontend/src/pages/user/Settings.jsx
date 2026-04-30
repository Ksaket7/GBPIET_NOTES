import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";

export default function Settings() {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [form, setForm] = useState(() => ({
    fullName: user?.fullName || "",
    email: user?.email || "",
    branch: user?.branch || "",
    oldPassword: "",
    newPassword: "",
  }));

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSave = async () => {
    const res = await API.patch("/users/update-account", {
      fullName: form.fullName,
      email: form.email,
      branch: form.branch,
    });
    setUser?.(res.data.data);
    alert("Updated");
  };

  const handlePassword = async () => {
    await API.post("/users/change-password", {
      oldPassword: form.oldPassword,
      newPassword: form.newPassword,
    });
    alert("Password Updated");
  };

  return (
    <main className="app-page">
      <div className="app-shell grid gap-6 xl:grid-cols-[260px_1fr]">
        <aside className="glass-panel p-4">
          <h1 className="font-poppins text-2xl font-semibold text-slate-950">
            Settings
          </h1>
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1 xl:block xl:space-y-2 xl:overflow-visible xl:pb-0">
            {["general", "account", "profile"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 rounded-2xl px-4 py-3 text-left text-sm font-semibold capitalize xl:w-full ${
                  activeTab === tab
                    ? "bg-slate-950 text-white"
                    : "bg-white/60 text-slate-600 hover:bg-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </aside>

        <section className="space-y-6">
          {activeTab === "general" && (
            <div className="glass-panel p-6">
              <h2 className="font-poppins text-2xl font-semibold text-slate-950">
                General
              </h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {[
                  ["Username", user?.username],
                  ["Full Name", user?.fullName],
                  ["Email", user?.email],
                  ["Branch", user?.branch],
                  ["Role", user?.role],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-3xl bg-white/65 p-4">
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="mt-1 font-semibold text-slate-950">{value || "-"}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "account" && (
            <>
              <div className="glass-panel p-6">
                <h2 className="font-poppins text-2xl font-semibold text-slate-950">
                  Update Account
                </h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <input name="fullName" value={form.fullName} onChange={handleChange} className="app-input" placeholder="Full Name" />
                  <input name="email" value={form.email} onChange={handleChange} className="app-input" placeholder="Email" />
                  <select name="branch" value={form.branch} onChange={handleChange} className="app-input md:col-span-2">
                    <option value="">Select Branch</option>
                    <option>CSE</option>
                    <option>CSE(AIML)</option>
                    <option>ECE</option>
                    <option>ME</option>
                    <option>CE</option>
                    <option>BT</option>
                  </select>
                </div>
                <button type="button" onClick={handleSave} className="app-button mt-5">
                  Save Changes
                </button>
              </div>

              <div className="glass-panel p-6">
                <h3 className="font-poppins text-xl font-semibold text-slate-950">
                  Change Password
                </h3>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <input type="password" name="oldPassword" onChange={handleChange} placeholder="Old Password" className="app-input" />
                  <input type="password" name="newPassword" onChange={handleChange} placeholder="New Password" className="app-input" />
                </div>
                <button type="button" onClick={handlePassword} className="app-button mt-5">
                  Update Password
                </button>
              </div>
            </>
          )}

          {activeTab === "profile" && (
            <div className="glass-panel p-6">
              <h2 className="font-poppins text-2xl font-semibold text-slate-950">
                Profile
              </h2>
              <p className="mt-3 text-sm text-slate-500">
                Avatar upload and username changes can be added here.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
