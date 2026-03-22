import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";
import { X } from "lucide-react";

export default function Settings() {
  const { user, setUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    branch: "",
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        fullName: user.fullName || "",
        email: user.email || "",
        branch: user.branch || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const res = await API.patch("/user/update-account", {
      fullName: form.fullName,
      email: form.email,
      branch: form.branch,
    });
    setUser(res.data.data);
    alert("Updated");
  };

  const handlePassword = async () => {
    await API.post("/user/change-password", {
      oldPassword: form.oldPassword,
      newPassword: form.newPassword,
    });
    alert("Password Updated");
  };

  return (
    <div className="md:flex min-h-screen pt-20 ">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="md:hidden px-5 ">
        <button
          onClick={() => setSidebarOpen(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg"
        >
          ⚙️
        </button>
      </div>
      {/* 🔥 SIDEBAR */}
      <div
        className={`
    fixed top-0 left-0 h-full w-64 bg-white z-50 p-5 transform transition-transform duration-300 pt-20
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
    md:static md:translate-x-0 md:h-auto md:block`}
      >
        <div className="flex justify-between items-center ">
          <h2 className="text-xl font-semibold mb-4">⚙️ Settings</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="items-center md:hidden"
          >
            <X />
          </button>
        </div>

        {["general", "account", "profile"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSidebarOpen(false); // close on mobile
            }}
            className={`w-full text-left px-4 py-2 rounded-lg capitalize ${
              activeTab === tab ? "bg-primary text-white" : "hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 px-4 md:px-8 py-6 max-w-5xl mx-auto">
        {/* GENERAL */}
        {activeTab === "general" && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">General</h2>

            <div className="bg-white p-6 rounded-xl border grid grid-cols-1 md:grid-cols-2 gap-4">
              <p>
                <strong>Username:</strong> {user?.username}
              </p>
              <p>
                <strong>Full Name:</strong> {user?.fullName}
              </p>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>Branch:</strong> {user?.branch}
              </p>
              <p>
                <strong>Role:</strong> {user?.role}
              </p>
            </div>
          </div>
        )}

        {/* ACCOUNT */}
        {activeTab === "account" && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Update Account</h2>

            <div className="bg-white p-6 rounded-xl border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="p-3 border rounded-lg"
                  placeholder="Full Name"
                />

                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="p-3 border rounded-lg"
                  placeholder="Email"
                />

                <select
                  name="branch"
                  value={form.branch}
                  onChange={handleChange}
                  className="p-3 border rounded-lg md:col-span-2"
                >
                  <option value="">Select Branch</option>
                  <option>CSE</option>
                  <option>CSE(AIML)</option>
                  <option>ECE</option>
                  <option>ME</option>
                  <option>CE</option>
                  <option>BT</option>
                </select>
              </div>

              <div className="mt-5">
                <button
                  onClick={handleSave}
                  className="bg-primary text-white px-5 py-2 rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </div>

            {/* PASSWORD */}
            <div className="mt-6 bg-white p-6 rounded-xl border">
              <h3 className="font-semibold mb-4">Change Password</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="password"
                  name="oldPassword"
                  onChange={handleChange}
                  placeholder="Old Password"
                  className="p-3 border rounded-lg"
                />

                <input
                  type="password"
                  name="newPassword"
                  onChange={handleChange}
                  placeholder="New Password"
                  className="p-3 border rounded-lg"
                />
              </div>

              <div className="mt-5">
                <button
                  onClick={handlePassword}
                  className="bg-primary text-white px-5 py-2 rounded-lg"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PROFILE */}
        {activeTab === "profile" && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Profile</h2>

            <div className="bg-white p-6 rounded-xl border space-y-4 max-w-md">
              <p>Avatar Upload (Coming soon)</p>
              <p>Username change (later)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
