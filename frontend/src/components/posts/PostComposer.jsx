import { useState } from "react";
import { FileText, Image, Send } from "lucide-react";
import API from "../../services/api";

export default function PostComposer({ onPostCreated }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!text.trim() && !image) return;

    const formData = new FormData();
    formData.append("text", text);
    if (image) formData.append("image", image);

    try {
      setLoading(true);
      const res = await API.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onPostCreated?.(res.data.data);
      setText("");
      setImage(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel responsive-panel">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
          <FileText size={18} />
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Post an update, thought, or image..."
            className="app-input min-h-28"
          />
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
            <button
              type="submit"
              disabled={loading || (!text.trim() && !image)}
              className="app-button py-2"
            >
              <Send size={16} />
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
