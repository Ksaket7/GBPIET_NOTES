import { useState } from "react";
import API from "../../services/api";
import InputField from "./InputField";
import FileUpload from "./FileUpload";

const UploadForm = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    subjectName: "",
    subjectCode: "",
    type: "notes",
    tags: "",
    originalStudentUsername: "",
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!file) {
      setErrorMessage("File is required");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        data.append(key, value);
      });

      data.append("file", file);

      const res = await API.post("/notes/upload", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data?.success) {
        setSuccessMessage("Note uploaded successfully");

        // reset
        setForm({
          title: "",
          description: "",
          subjectName: "",
          subjectCode: "",
          type: "notes",
          tags: "",
          originalStudentUsername: "",
        });
        setFile(null);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 md:p-8">
      <h1 className="font-poppins text-2xl font-semibold text-slate-950">
        Upload Notes
      </h1>

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

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {/* GRID START */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <InputField
            name="subjectName"
            placeholder="Subject Name"
            value={form.subjectName}
            onChange={handleChange}
          />

          <InputField
            name="subjectCode"
            placeholder="Subject Code"
            value={form.subjectCode}
            onChange={handleChange}
            required
          />

          <InputField
            name="originalStudentUsername"
            placeholder="Original Student Username"
            value={form.originalStudentUsername}
            onChange={handleChange}
          />
        </div>
        {/* GRID END */}

        {/* Full width textarea */}
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="app-input min-h-28"
        />

        {/* Tags + Type row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            name="tags"
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={handleChange}
          />

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="app-input"
          >
            <option value="notes">Notes</option>
            <option value="pyqs">PYQs</option>
            <option value="tuts">Tutorials</option>
            <option value="assignments">Assignments</option>
          </select>
        </div>

        {/* File Upload full width */}
        <FileUpload file={file} setFile={setFile} />

        <div className="flex justify-center md:justify-end">
          <button
            type="submit"
            disabled={loading}
            className="app-button"
          >
            {loading ? "Uploading..." : "Upload Notes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadForm;
