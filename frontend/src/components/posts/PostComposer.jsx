import { useState } from "react";
import { FileText, Image, Send, X } from "lucide-react";
import API from "../../services/api";
import UploadPolicyWarning from "../ui/UploadPolicyWarning";

export default function PostComposer({ onPostCreated, onClose }) {
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!text.trim() && images.length === 0) return;

    const formData = new FormData();
    formData.append("text", text);
    images.forEach((image) => formData.append("images", image));

    try {
      setLoading(true);
      const res = await API.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onPostCreated?.(res.data.data);
      setText("");
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event) => {
    const selectedImages = Array.from(event.target.files || []);
    setImages(selectedImages.slice(0, 6));
    event.target.value = "";
  };

  const removeImage = (imageName) => {
    setImages((currentImages) =>
      currentImages.filter((image) => image.name !== imageName),
    );
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-poppins text-lg font-semibold text-slate-950">
            Share a post
          </h2>
          <p className="text-sm text-slate-500">
            Post an update, thought, or image for the community.
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-700"
            aria-label="Close upload form"
          >
            <X size={17} />
          </button>
        )}
      </div>

      <UploadPolicyWarning className="mb-4" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
          <FileText size={18} />
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-700">Post content</span>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Post an update, thought, or image..."
              className="app-input min-h-28"
            />
          </label>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-700">Images</p>
              <label className="app-button-secondary max-w-full cursor-pointer py-2">
                <Image size={16} />
                <span className="truncate">
                  {images.length ? `${images.length} image${images.length === 1 ? "" : "s"} selected` : "Add images"}
                </span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
              </label>
            </div>
            <button
              type="submit"
              disabled={loading || (!text.trim() && images.length === 0)}
              className="inline-flex min-w-0 items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:px-5"
            >
              <Send size={16} />
              {loading ? "Posting..." : "Post"}
            </button>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {images.map((image) => (
                <div
                  key={`${image.name}-${image.size}`}
                  className="flex min-w-0 items-center justify-between gap-2 rounded-2xl border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700"
                >
                  <span className="truncate">{image.name}</span>
                  <button
                    type="button"
                    onClick={() => removeImage(image.name)}
                    className="shrink-0 rounded-full p-1 transition hover:bg-white"
                    aria-label={`Remove ${image.name}`}
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
