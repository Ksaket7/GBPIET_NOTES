import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";
import LoadingButton from "../ui/LoadingButton";

export default function UploadQuestion() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    subjectCode: "",
    subjectName: "",
    tags: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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
    <div className="glass-panel p-6 md:p-8">
      <h1 className="font-poppins text-2xl font-semibold text-slate-950">
        Ask a Question
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Ask clearly so others can answer quickly.
      </p>

      {errorMessage && (
        <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <input
          type="text"
          name="title"
          placeholder="Question title *"
          value={form.title}
          onChange={handleChange}
          className="app-input"
        />

        <textarea
          name="description"
          placeholder="Describe your question in detail *"
          value={form.description}
          onChange={handleChange}
          rows={5}
          className="app-input min-h-36"
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            type="text"
            name="subjectCode"
            placeholder="Subject Code"
            value={form.subjectCode}
            onChange={handleChange}
            className="app-input"
          />

          <input
            type="text"
            name="subjectName"
            placeholder="Subject Name"
            value={form.subjectName}
            onChange={handleChange}
            className="app-input"
          />
        </div>

        <input
          type="text"
          name="tags"
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={handleChange}
          className="app-input"
        />

        <div className="flex justify-end">
          <LoadingButton loading={loading} type="submit" className="app-button">
            Post Question
          </LoadingButton>
        </div>
      </form>
    </div>
  );
}
