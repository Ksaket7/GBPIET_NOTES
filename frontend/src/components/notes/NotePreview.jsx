import { Download, ExternalLink, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  downloadNoteFile,
  getNoteFileUrl,
  openNoteFile,
} from "../../utils/noteFileActions";

export default function NotePreview({ note }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const hasFile = Boolean(getNoteFileUrl(note));

  const requireLogin = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return true;
    }
    return false;
  };

  const handleOpen = () => {
    if (requireLogin()) return;
    openNoteFile(note);
  };

  const handleDownload = async () => {
    if (requireLogin()) return;
    await downloadNoteFile(note);
  };

  return (
    <section className="glass-panel responsive-panel">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="rounded-2xl bg-indigo-100 p-3 text-indigo-600">
            <FileText size={20} />
          </span>
          <h2 className="break-words font-poppins text-xl font-semibold text-slate-950">
            Note Preview
          </h2>
        </div>
        <span className="pill">PDF</span>
      </div>

      <div className="mt-5 grid gap-3 text-sm text-slate-500 md:grid-cols-2">
        <p className="rounded-2xl bg-white/65 p-3">
          <strong className="text-slate-950">Type:</strong> {note.type?.toUpperCase()}
        </p>
        <p className="rounded-2xl bg-white/65 p-3">
          <strong className="text-slate-950">Subject:</strong> {note.subjectCode}
        </p>
      </div>

      <p className="mt-5 break-words text-slate-600">
        {note.description || "No description provided."}
      </p>

      {!isAuthenticated && (
        <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
          Login required to view or download this note.
        </p>
      )}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          disabled={!hasFile}
          onClick={handleOpen}
          className="app-button inline-flex w-full items-center justify-center gap-2 sm:w-auto"
        >
          <ExternalLink size={16} />
          {isAuthenticated ? "Open PDF" : "Login to Access"}
        </button>
        <button
          type="button"
          disabled={!hasFile}
          onClick={handleDownload}
          className="app-button-secondary inline-flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <Download size={16} />
          Download PDF
        </button>
      </div>
    </section>
  );
}
