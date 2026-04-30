import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";
import LoadingButton from "../ui/LoadingButton";

export default function UploadQuestion({ onCreated }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    description: "",
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

    if (!form.description.trim() || !form.tags.trim()) {
      setErrorMessage("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/questions/ask", form);
      onCreated?.(res.data.data);
      navigate("/questions");
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Failed to post question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel responsive-panel">
      <h1 className="font-poppins text-2xl font-semibold text-slate-950">
        Ask a Question
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Ask clearly and add at least one tag so others can answer quickly.
      </p>

      {errorMessage && (
        <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <textarea
          name="description"
          placeholder="Write your question *"
          value={form.description}
          onChange={handleChange}
          rows={5}
          className="app-input min-h-36"
          required
        />

        <input
          type="text"
          name="tags"
          placeholder="Question tags, comma separated *"
          value={form.tags}
          onChange={handleChange}
          className="app-input"
          required
        />

        <div className="flex justify-stretch sm:justify-end">
          <LoadingButton loading={loading} type="submit" className="app-button w-full sm:w-auto">
            Post Question
          </LoadingButton>
        </div>
      </form>
    </div>
  );
}
