import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import LoadingButton from "../components/ui/LoadingButton";

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
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-surface border border-borderSoft rounded-xl p-8">
        <h1 className="font-poppins text-3xl text-textPrimary text-center mb-6">
          Ask a Question
        </h1>

        <p className="text-sm text-textSecondary text-center mb-6 font-inter">
          Ask a clear question to get better answers from your peers.
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
            placeholder="Question title *"
            value={form.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-borderSoft rounded-md
                       focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* Description */}
          <textarea
            name="description"
            placeholder="Describe your question in detail *"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-borderSoft rounded-md
                       focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* Subject */}

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

          {/* Submit */}
          <LoadingButton
            loading={loading}
            type="submit"
            className="w-full mt-2 bg-primary text-white py-2 rounded-md
                       hover:bg-primaryDark transition"
          >
            Post Question
          </LoadingButton>
        </form>
      </div>
    </div>
  );
}
