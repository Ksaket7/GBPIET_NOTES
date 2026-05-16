import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";

export default function Settings() {
  const { user, setUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = ["general", "account", "profile"].includes(searchParams.get("tab"))
    ? searchParams.get("tab")
    : "general";
  const [form, setForm] = useState(() => ({
    fullName: user?.fullName || "",
    username: user?.username || "",
    email: user?.email || "",
    branch: user?.branch || "",
    year: user?.year || "",
    bio: user?.bio || "",
    techStack: (user?.techStack || []).join(", "),
    interests: (user?.interests || []).join(", "),
    github: user?.profileLinks?.github || "",
    linkedin: user?.profileLinks?.linkedin || "",
    portfolio: user?.profileLinks?.portfolio || "",
    instagram: user?.profileLinks?.instagram || "",
    oldPassword: "",
    newPassword: "",
  }));
  const [coverFile, setCoverFile] = useState(null);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSave = async () => {
    const res = await API.patch("/users/update-account", {
      fullName: form.fullName,
      username: form.username,
      email: form.email,
      branch: form.branch,
      year: form.year,
      bio: form.bio,
      techStack: form.techStack,
      interests: form.interests,
      profileLinks: {
        github: form.github,
        linkedin: form.linkedin,
        portfolio: form.portfolio,
        instagram: form.instagram,
      },
    });
    setUser?.(res.data.data);
    alert("Updated");
  };

  const handleCoverUpload = async () => {
    if (!coverFile) return;

    const data = new FormData();
    data.append("coverImage", coverFile);
    const res = await API.patch("/users/cover-image", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setUser?.(res.data.data);
    setCoverFile(null);
    alert("Cover image updated");
  };

  const handleCoverDelete = async () => {
    if (!user?.coverImage) return;

    const res = await API.delete("/users/cover-image");
    setUser?.(res.data.data);
    setCoverFile(null);
    alert("Cover image deleted");
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
          <div className="mt-5 flex flex-wrap gap-2 xl:block xl:space-y-2 xl:pb-0">
            {["general", "account", "profile"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSearchParams(tab === "general" ? {} : { tab })}
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
                  ["Year", user?.year],
                  ["Role", user?.role],
                  ["Credits", user?.credits],
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
                  <input name="username" value={form.username} onChange={handleChange} className="app-input" placeholder="Username" />
                  <input name="email" value={form.email} onChange={handleChange} className="app-input" placeholder="Email" />
                  <select name="branch" value={form.branch} onChange={handleChange} className="app-input">
                    <option value="">Select Branch</option>
                    <option>CSE</option>
                    <option>CSE(AIML)</option>
                    <option>ECE</option>
                    <option>ME</option>
                    <option>CE</option>
                    <option>BT</option>
                  </select>
                  <select name="year" value={form.year} onChange={handleChange} className="app-input">
                    <option value="">Select Year</option>
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>4th Year</option>
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
                Add optional details that appear on your public student profile.
              </p>
              <div className="mt-5 grid gap-4">
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows={5}
                  className="app-input resize-none"
                  placeholder="Short bio about your academic interests, projects, or contribution style"
                />
                <input
                  name="techStack"
                  value={form.techStack}
                  onChange={handleChange}
                  className="app-input"
                  placeholder="Tech stack, comma separated. Example: React, DSA, NodeJS, DBMS"
                />
                <input
                  name="interests"
                  value={form.interests}
                  onChange={handleChange}
                  className="app-input"
                  placeholder="Interests, comma separated. Example: Operating Systems, AI, Web Development"
                />
                <div className="rounded-2xl border border-white/70 bg-white/60 p-4">
                  <label className="text-sm font-semibold text-slate-700">
                    Cover image
                  </label>
                  <p className="mt-1 text-xs text-slate-500">
                    Optional image shown at the top of your profile card.
                  </p>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event) => setCoverFile(event.target.files?.[0] || null)}
                    className="mt-3 app-input"
                  />
                  {user?.coverImage && (
                    <img
                      src={user.coverImage}
                      alt="Profile cover"
                      className="mt-3 h-32 w-full rounded-2xl object-cover"
                    />
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleCoverUpload}
                      disabled={!coverFile}
                      className="app-button-secondary"
                    >
                      Upload Cover
                    </button>
                    {user?.coverImage && (
                      <button
                        type="button"
                        onClick={handleCoverDelete}
                        className="rounded-2xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                      >
                        Delete Cover
                      </button>
                    )}
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    name="github"
                    value={form.github}
                    onChange={handleChange}
                    className="app-input"
                    placeholder="GitHub profile link"
                  />
                  <input
                    name="linkedin"
                    value={form.linkedin}
                    onChange={handleChange}
                    className="app-input"
                    placeholder="LinkedIn profile link"
                  />
                  <input
                    name="portfolio"
                    value={form.portfolio}
                    onChange={handleChange}
                    className="app-input"
                    placeholder="Portfolio / website link"
                  />
                  <input
                    name="instagram"
                    value={form.instagram}
                    onChange={handleChange}
                    className="app-input"
                    placeholder="Instagram profile link"
                  />
                </div>
              </div>
              <button type="button" onClick={handleSave} className="app-button mt-5">
                Save Profile
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
