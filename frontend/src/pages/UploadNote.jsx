import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import LoadingButton from "../components/ui/LoadingButton";

export default function UploadNote() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Frontend guard
  if (!user) {
    navigate("/login");
    return null;
  }

  if (!["cr", "faculty"].includes(user.role)) {
    navigate("/dashboard");
    return null;
  }

  const [form, setForm] = useState({
    title: "",
    description: "",
    subjectName: "",
    subjectCode: "",
    originalStudentUsername: "",
    type: "notes",
    tags: "",
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (
      !form.title ||
      !form.subjectCode ||
      !form.originalStudentUsername
    ) {
      setErrorMessage("Please fill all required fields.");
      return;
    }

    if (!file) {
      setErrorMessage("Please upload a PDF file.");
      return;
    }

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      data.append(key, value)
    );
    data.append("file", file);

    try {
      setLoading(true);
      const res = await API.post("/notes/upload", data);
      navigate(`/notes/${res.data.data._id}`);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Failed to upload note"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-surface border border-borderSoft rounded-xl p-8">
        <h1 className="font-poppins text-3xl text-textPrimary text-center mb-6">
          Upload Note
        </h1>

        <p className="text-sm text-textSecondary text-center mb-6 font-inter">
          Only CRs and Faculty can upload notes.  
          Credits will be assigned to the original student.
        </p>

        {errorMessage && (
          <div className="mb-4 text-sm text-red-600 text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-inter">
          {/* Title */}
          <input
            type="text"
            name="title"
            placeholder="Title *"
            value={form.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-borderSoft rounded-md
                       focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* Description */}
          <textarea
            name="description"
            placeholder="Description (optional)"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-borderSoft rounded-md
                       focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* Subject */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="subjectCode"
              placeholder="Subject Code *"
              value={form.subjectCode}
              onChange={handleChange}
              className="px-4 py-2 border border-borderSoft rounded-md
                         focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <input
              type="text"
              name="subjectName"
              placeholder="Subject Name"
              value={form.subjectName}
              onChange={handleChange}
              className="px-4 py-2 border border-borderSoft rounded-md
                         focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Original Student */}
          <input
            type="text"
            name="originalStudentUsername"
            placeholder="Original Student Username *"
            value={form.originalStudentUsername}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-borderSoft rounded-md
                       focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* Type */}
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-borderSoft rounded-md
                       focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          >
            <option value="notes">Notes</option>
            <option value="pyqs">Previous Year Questions</option>
            <option value="tuts">Tutorials</option>
            <option value="assignments">Assignments</option>
          </select>

          {/* Tags */}
          <input
            type="text"
            name="tags"
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-borderSoft rounded-md
                       focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* File */}
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full text-sm"
          />

          {/* Submit */}
          <LoadingButton
            loading={loading}
            type="submit"
            className="w-full mt-2 bg-primary text-white py-2 rounded-md
                       hover:bg-primaryDark transition"
          >
            Upload Note
          </LoadingButton>
        </form>
      </div>
    </div>
  );
}
