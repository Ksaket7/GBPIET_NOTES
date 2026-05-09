import { useState } from "react";
import { Image, Send, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";
import LoadingButton from "../ui/LoadingButton";

export default function UploadQuestion({ onCreated }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: "",
    subjectCode: "",
  });
  const [image, setImage] = useState(null);
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

    if (!form.title.trim() || !form.description.trim() || !form.tags.trim()) {
      setErrorMessage("Title, description, and tags are required.");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (image) formData.append("image", image);

    try {
      setLoading(true);
      const res = await API.post("/questions/ask", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onCreated?.(res.data.data);
      setForm({ title: "", description: "", tags: "", subjectCode: "" });
      setImage(null);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Failed to post question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[24px] bg-white p-5 shadow-sm sm:p-6">
      <h1 className="font-poppins text-2xl font-semibold text-slate-950">
        Ask a Question
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        Describe your problem clearly so others can help.
      </p>

      {errorMessage && (
        <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Question Title"
          value={form.title}
          onChange={handleChange}
          className="app-input"
          required
        />

        <textarea
          name="description"
          placeholder="Question Description"
          value={form.description}
          onChange={handleChange}
          rows={5}
          className="app-input min-h-32"
          required
        />

        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_150px]">
          <input
            type="text"
            name="tags"
            placeholder="Tags (e.g. #react #dbms)"
            value={form.tags}
            onChange={handleChange}
            className="app-input"
            required
          />
          <input
            type="text"
            name="subjectCode"
            placeholder="Subject Code"
            value={form.subjectCode}
            onChange={handleChange}
            className="app-input"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="app-button-secondary max-w-full cursor-pointer py-2">
            <Image size={16} />
            <span className="truncate">{image ? image.name : "Add image"}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => setImage(event.target.files?.[0] || null)}
            />
          </label>
          {image && (
            <button
              type="button"
              onClick={() => setImage(null)}
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            >
              <X size={14} />
              Remove image
            </button>
          )}
          <LoadingButton
            loading={loading}
            type="submit"
            className="inline-flex min-w-0 items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send size={16} />
            Post Question
          </LoadingButton>
        </div>
      </form>
    </div>
  );
}
