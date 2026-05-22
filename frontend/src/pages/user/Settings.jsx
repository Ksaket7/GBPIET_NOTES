import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  AlertTriangle,
  Camera,
  Github,
  Instagram,
  KeyRound,
  Link as LinkIcon,
  Linkedin,
  Mail,
  Save,
  Settings as SettingsIcon,
  ShieldCheck,
  Trash2,
  UploadCloud,
  UserRound,
  UserRoundCog,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import ConfirmModal from "../../components/ui/ConfirmModal";
import SectionCard from "../../components/ui/SectionCard";
import UserAvatar from "../../components/ui/UserAvatar";
import API from "../../services/api";

const tabs = [
  { id: "general", label: "Overview", icon: UserRound },
  { id: "account", label: "Account", icon: ShieldCheck },
  { id: "profile", label: "Public Profile", icon: UserRoundCog },
];

const branches = ["CSE", "CSE (AIML)", "ECE", "ME", "CE", "EE", "BT"];
const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

function InfoTile({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
      <p className="text-xs font-semibold uppercase text-slate-400">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-slate-950">
        {value || "-"}
      </p>
    </div>
  );
}

export default function Settings() {
  const { user, setUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
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
  const [saving, setSaving] = useState(false);
  const [coverLoading, setCoverLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
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
      showToast("Settings updated successfully.", "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to update settings.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCoverUpload = async () => {
    if (!coverFile) return;

    try {
      setCoverLoading(true);
      const data = new FormData();
      data.append("coverImage", coverFile);
      const res = await API.patch("/users/cover-image", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser?.(res.data.data);
      setCoverFile(null);
      showToast("Cover image updated.", "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to update cover image.", "error");
    } finally {
      setCoverLoading(false);
    }
  };

  const handleCoverDelete = async () => {
    if (!user?.coverImage) return;

    try {
      setCoverLoading(true);
      const res = await API.delete("/users/cover-image");
      setUser?.(res.data.data);
      setCoverFile(null);
      showToast("Cover image deleted.", "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to delete cover image.", "error");
    } finally {
      setCoverLoading(false);
    }
  };

  const handlePassword = async () => {
    try {
      setPasswordLoading(true);
      await API.post("/users/change-password", {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });
      setForm((currentForm) => ({
        ...currentForm,
        oldPassword: "",
        newPassword: "",
      }));
      showToast("Password updated successfully.", "success");
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to update password.", "error");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeletingAccount(true);
      await API.delete("/users/account");
      setUser?.(null);
      showToast("Your account and owned content were deleted.", "success");
      navigate("/signup", { replace: true });
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to delete account.", "error");
    } finally {
      setDeletingAccount(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <main className="app-page">
      <div className="app-shell space-y-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="page-title">Settings</h1>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
            <section className="overflow-hidden rounded-[28px] border border-white/70 bg-white/85 shadow-xl shadow-slate-500/10 backdrop-blur">
              <div className="relative h-36 overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-500 to-sky-400">
                {user?.coverImage && (
                  <img
                    src={user.coverImage}
                    alt="Profile cover"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/5 to-slate-950/20" />
              </div>
              <div className="relative z-10 px-5 pb-5">
                <UserAvatar
                  user={user}
                  className="relative z-20 -mt-12 h-24 w-24 border-4 border-white text-2xl shadow-xl shadow-slate-500/20"
                />
                <h2 className="mt-4 truncate font-poppins text-xl font-semibold text-slate-950">
                  {user?.fullName || user?.username || "GBPIET user"}
                </h2>
                <p className="truncate text-sm text-slate-500">
                  @{user?.username || "student"}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                    {user?.branch || "Branch pending"}
                  </span>
                  <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                    {user?.year || "Year pending"}
                  </span>
                </div>
              </div>
            </section>

            <nav className="rounded-[28px] border border-white/70 bg-white/85 p-3 shadow-xl shadow-slate-500/10 backdrop-blur">
              <div className="flex flex-wrap gap-2 xl:flex-col">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setSearchParams(tab.id === "general" ? {} : { tab: tab.id })}
                      className={`inline-flex min-w-0 items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition xl:w-full ${
                        activeTab === tab.id
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                          : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
                      }`}
                    >
                      <Icon size={17} className="shrink-0" />
                      <span className="truncate">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>
          </aside>

          <section className="min-w-0 space-y-6">
            {activeTab === "general" && (
              <SectionCard
                title="Profile Overview"
                icon={SettingsIcon}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    ["Username", user?.username],
                    ["Full Name", user?.fullName],
                    ["Email", user?.email],
                    ["Branch", user?.branch],
                    ["Year", user?.year],
                    ["Role", user?.role],
                    ["Credits", user?.credits],
                    ["Profile Status", user?.profileCompleted === false ? "Incomplete" : "Completed"],
                  ].map(([label, value]) => (
                    <InfoTile key={label} label={label} value={value} />
                  ))}
                </div>
              </SectionCard>
            )}

            {activeTab === "account" && (
              <>
                <SectionCard
                  title="Account Details"
                  icon={UserRoundCog}
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block space-y-2">
                      <span className="text-sm font-semibold text-slate-700">Full name</span>
                      <input name="fullName" value={form.fullName} onChange={handleChange} className="app-input" placeholder="Full Name" />
                    </label>
                    <label className="block space-y-2">
                      <span className="text-sm font-semibold text-slate-700">Username</span>
                      <input name="username" value={form.username} onChange={handleChange} className="app-input" placeholder="Username" />
                    </label>
                    <label className="block space-y-2">
                      <span className="text-sm font-semibold text-slate-700">Email</span>
                      <input name="email" value={form.email} onChange={handleChange} className="app-input" placeholder="Email" />
                    </label>
                    <label className="block space-y-2">
                      <span className="text-sm font-semibold text-slate-700">Branch</span>
                      <select name="branch" value={form.branch} onChange={handleChange} className="app-input">
                        <option value="">Select Branch</option>
                        {branches.map((branch) => <option key={branch} value={branch}>{branch}</option>)}
                      </select>
                    </label>
                    <label className="block space-y-2">
                      <span className="text-sm font-semibold text-slate-700">Year</span>
                      <select name="year" value={form.year} onChange={handleChange} className="app-input">
                        <option value="">Select Year</option>
                        {years.map((year) => <option key={year} value={year}>{year}</option>)}
                      </select>
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Save size={16} />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </SectionCard>

                <SectionCard
                  title="Password"
                  icon={KeyRound}
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block space-y-2">
                      <span className="text-sm font-semibold text-slate-700">Old password</span>
                      <input type="password" name="oldPassword" value={form.oldPassword} onChange={handleChange} placeholder="Old Password" className="app-input" />
                    </label>
                    <label className="block space-y-2">
                      <span className="text-sm font-semibold text-slate-700">New password</span>
                      <input type="password" name="newPassword" value={form.newPassword} onChange={handleChange} placeholder="New Password" className="app-input" />
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={handlePassword}
                    disabled={passwordLoading || !form.oldPassword || !form.newPassword}
                    className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <KeyRound size={16} />
                    {passwordLoading ? "Updating..." : "Update Password"}
                  </button>
                </SectionCard>

                <SectionCard
                  title="Danger Zone"
                  icon={AlertTriangle}
                >
                  <div className="rounded-3xl border border-red-100 bg-red-50/80 p-4 sm:p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <h3 className="font-poppins text-lg font-semibold text-red-700">
                          Delete account
                        </h3>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-red-600/80">
                          Permanently delete your profile, notes, posts, questions, answers,
                          comments, likes, followers, following, avatar, cover image, and uploaded files.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition hover:-translate-y-0.5 hover:bg-red-700"
                      >
                        <Trash2 size={16} />
                        Delete Account
                      </button>
                    </div>
                  </div>
                </SectionCard>
              </>
            )}

            {activeTab === "profile" && (
              <SectionCard
                title="Public Profile"
                icon={UserRound}
              >
                <div className="grid gap-5">
                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Bio</span>
                    <textarea name="bio" value={form.bio} onChange={handleChange} rows={5} className="app-input min-h-32 resize-none" placeholder="Short bio about your academic interests, projects, or contribution style" />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Tech stack</span>
                    <input name="techStack" value={form.techStack} onChange={handleChange} className="app-input" placeholder="Tech stack, comma separated. Example: React, DSA, NodeJS, DBMS" />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-sm font-semibold text-slate-700">Interests</span>
                    <input name="interests" value={form.interests} onChange={handleChange} className="app-input" placeholder="Interests, comma separated. Example: Operating Systems, AI, Web Development" />
                  </label>

                  <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                          <Camera size={17} className="text-indigo-600" />
                          Cover image
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                          Optional banner shown behind your profile avatar.
                        </p>
                      </div>
                      <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-indigo-700">
                        <UploadCloud size={16} />
                        Choose image
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(event) => setCoverFile(event.target.files?.[0] || null)}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {(user?.coverImage || coverFile) && (
                      <div className="mt-4 overflow-hidden rounded-2xl border border-white bg-white shadow-sm">
                        {user?.coverImage ? (
                          <img
                            src={user.coverImage}
                            alt="Profile cover"
                            className="h-40 w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-40 items-center justify-center text-sm text-slate-500">
                            {coverFile?.name}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={handleCoverUpload}
                        disabled={!coverFile || coverLoading}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <UploadCloud size={16} />
                        {coverLoading ? "Working..." : "Upload Cover"}
                      </button>
                      {user?.coverImage && (
                        <button
                          type="button"
                          onClick={handleCoverDelete}
                          disabled={coverLoading}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                        >
                          <Trash2 size={16} />
                          Delete Cover
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="relative block space-y-2">
                      <span className="text-sm font-semibold text-slate-700">GitHub</span>
                      <div className="relative">
                        <Github className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                        <input name="github" value={form.github} onChange={handleChange} className="app-input pl-11" placeholder="GitHub profile link" />
                      </div>
                    </label>
                    <label className="relative block space-y-2">
                      <span className="text-sm font-semibold text-slate-700">LinkedIn</span>
                      <div className="relative">
                        <Linkedin className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                        <input name="linkedin" value={form.linkedin} onChange={handleChange} className="app-input pl-11" placeholder="LinkedIn profile link" />
                      </div>
                    </label>
                    <label className="relative block space-y-2">
                      <span className="text-sm font-semibold text-slate-700">Portfolio</span>
                      <div className="relative">
                        <LinkIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                        <input name="portfolio" value={form.portfolio} onChange={handleChange} className="app-input pl-11" placeholder="Portfolio / website link" />
                      </div>
                    </label>
                    <label className="relative block space-y-2">
                      <span className="text-sm font-semibold text-slate-700">Instagram</span>
                      <div className="relative">
                        <Instagram className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                        <input name="instagram" value={form.instagram} onChange={handleChange} className="app-input pl-11" placeholder="Instagram profile link" />
                      </div>
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    <Mail size={16} />
                    {saving ? "Saving..." : "Save Profile"}
                  </button>
                </div>
              </SectionCard>
            )}
          </section>
        </div>
      </div>

      <ConfirmModal
        open={showDeleteConfirm}
        title="Delete Account"
        message="This will permanently remove your account and all content owned by you. This action cannot be undone."
        confirmText="Delete Account"
        loading={deletingAccount}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteAccount}
      />
    </main>
  );
}
