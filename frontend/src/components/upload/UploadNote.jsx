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
      setErrorMessage(
        error.response?.data?.message || "Upload failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-surface border border-borderSoft rounded-xl p-8">

      <h1 className="font-poppins text-2xl text-textPrimary text-center mb-6">
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

      <form onSubmit={handleSubmit} className="space-y-4 font-inter">

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

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-borderSoft rounded-md
                     focus:outline-none focus:ring-2 focus:ring-primary"
        />

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

        <FileUpload file={file} setFile={setFile} />

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-primary text-white py-2 rounded-md
                     hover:bg-primaryDark transition"
        >
          {loading ? "Uploading..." : "Upload Notes"}
        </button>
      </form>
    </div>
  );
};

export default UploadForm;