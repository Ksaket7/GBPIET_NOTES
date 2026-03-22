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
    <div className="w-full max-w-4xl mx-auto bg-surface border border-borderSoft rounded-xl p-6 md:p-10">
      <h1 className="font-poppins text-2xl text-textPrimary text-center mb-8">
        Upload Notes
      </h1>

      {errorMessage && (
        <div className="mb-4 text-sm text-red-600 text-center">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 text-sm text-green-600 text-center">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 font-inter">
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
          className="w-full px-4 py-2 border border-borderSoft rounded-md
                   focus:outline-none focus:ring-2 focus:ring-primary"
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
            className="w-full px-4 py-2 border border-borderSoft rounded-md
                     focus:outline-none focus:ring-2 focus:ring-primary"
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
            className="px-8 py-2 bg-primary text-white rounded-md
               hover:bg-primaryDark transition disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload Notes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadForm;
