import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";

export default function Settings() {
  const { user, setUser } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    branch: "",
    oldPassword: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(false);

  // Prefill data
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

  // ✅ UPDATE ACCOUNT
  const handleSave = async () => {
    try {
      setLoading(true);

      const res = await API.patch("/user/update-account", {
        fullName: form.fullName,
        email: form.email,
        branch: form.branch,
      });

      setUser(res.data.data); // update global user
      alert("Account updated successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ CHANGE PASSWORD
  const handlePassword = async () => {
    try {
      setLoading(true);

      await API.post("/user/change-password", {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });

      alert("Password updated successfully");

      // clear fields
      setForm((prev) => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
      }));
    } catch (err) {
      alert(err.response?.data?.message || "Password update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-5 py-10 pt-20">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      {/* ACCOUNT */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border mb-6">
        <h2 className="text-lg font-semibold mb-4">Account Info</h2>

        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full mb-3 p-3 border rounded-lg"
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full mb-3 p-3 border rounded-lg"
        />

        <select
          name="branch"
          value={form.branch}
          onChange={handleChange}
          className="w-full mb-4 p-3 border rounded-lg"
        >
          <option value="">Select Branch</option>
          <option>CSE</option>
          <option>CSE(AIML)</option>
          <option>ECE</option>
          <option>ME</option>
          <option>CE</option>
          <option>BT</option>
        </select>

        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-primary text-white px-5 py-2 rounded-lg"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* PASSWORD */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border mb-6">
        <h2 className="text-lg font-semibold mb-4">Change Password</h2>

        <input
          type="password"
          name="oldPassword"
          value={form.oldPassword}
          onChange={handleChange}
          placeholder="Old Password"
          className="w-full mb-3 p-3 border rounded-lg"
        />

        <input
          type="password"
          name="newPassword"
          value={form.newPassword}
          onChange={handleChange}
          placeholder="New Password"
          className="w-full mb-4 p-3 border rounded-lg"
        />

        <button
          onClick={handlePassword}
          disabled={loading}
          className="bg-primary text-white px-5 py-2 rounded-lg"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
}