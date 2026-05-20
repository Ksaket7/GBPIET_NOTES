import { useState } from "react";
import { Send } from "lucide-react";
import API from "../../services/api";
import InputField from "./InputField";
import FileUpload from "./FileUpload";

const UploadForm = ({ onUploaded }) => {
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
        onUploaded?.();
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[24px] bg-white p-5 shadow-sm sm:p-6">
      <h1 className="font-poppins text-2xl font-semibold text-slate-950 max-sm:text-xl">
        Upload Notes
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Add clear details so students can discover the right material quickly.
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

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="app-input min-h-28"
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

        <FileUpload file={file} setFile={setFile} />

        <div className="flex justify-stretch sm:justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            <Send size={16} />
            {loading ? "Uploading..." : "Upload Notes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadForm;
