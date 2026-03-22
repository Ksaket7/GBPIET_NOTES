import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";
import LoadingButton from "../ui/LoadingButton";

export default function UploadQuestion() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Auth guard
  if (!user) {
    navigate("/login");
    return null;
  }

  const [form, setForm] = useState({
    title: "",
    description: "",
    subjectCode: "",
    subjectName: "",
    tags: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!form.title || !form.description) {
      setErrorMessage("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/questions/ask", form);
      navigate(`/questions/${res.data.data._id}`);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Failed to post question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-surface border border-borderSoft rounded-xl p-6 md:p-10">
      <h1 className="font-poppins text-2xl md:text-3xl text-textPrimary mb-4">
        Ask a Question
      </h1>

      <p className="text-sm text-textSecondary mb-6 font-inter">
        Ask a clear question to get better answers from your peers.
      </p>

      {errorMessage && (
        <div className="mb-4 text-sm text-red-600">{errorMessage}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 font-inter">
        {/* Title */}
        <input
          type="text"
          name="title"
          placeholder="Question title *"
          value={form.title}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-borderSoft rounded-md
                   focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Describe your question in detail *"
          value={form.description}
          onChange={handleChange}
          rows={5}
          className="w-full px-4 py-3 border border-borderSoft rounded-md
                   focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {/* Grid for optional fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="subjectCode"
            placeholder="Subject Code"
            value={form.subjectCode}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-borderSoft rounded-md
                     focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <input
            type="text"
            name="subjectName"
            placeholder="Subject Name"
            value={form.subjectName}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-borderSoft rounded-md
                     focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Tags full width */}
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-borderSoft rounded-md
                   focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {/* Button (NOT full width) */}
        <div className="flex justify-center md:justify-end">
          <LoadingButton
            loading={loading}
            type="submit"
            className="px-8 py-3 bg-primary text-white rounded-md
                     hover:bg-primaryDark transition"
          >
            Post Question
          </LoadingButton>
        </div>
      </form>
    </div>
  );
}
