import { Download, ExternalLink, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  downloadNoteFile,
  getNoteFileUrl,
  openNoteFile,
} from "../../utils/noteFileActions";
import NoteThumbnail from "./NoteThumbnail";

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
    <section className="overflow-hidden rounded-[28px] border border-white/70 bg-white/85 shadow-xl shadow-slate-500/10 backdrop-blur">
      <div className="border-b border-slate-100 bg-gradient-to-br from-white via-indigo-50/70 to-sky-50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="rounded-2xl bg-indigo-600 p-3 text-white shadow-lg shadow-indigo-200">
            <FileText size={20} />
          </span>
          <div className="min-w-0">
            <h2 className="break-words font-poppins text-xl font-semibold text-slate-950">
              Note Preview
            </h2>
            <p className="text-xs font-medium text-slate-500">
              First page preview and file actions
            </p>
          </div>
        </div>
        <span className="rounded-full border border-indigo-100 bg-white px-3 py-1 text-xs font-bold uppercase text-indigo-700 shadow-sm">
          PDF
        </span>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <NoteThumbnail
          note={note}
          size="h-[340px] sm:h-[460px] xl:h-[560px]"
          className="rounded-2xl border border-slate-100 shadow-sm"
        />

        <div className="grid gap-3 text-sm text-slate-500 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
            <p className="text-xs font-semibold uppercase text-slate-400">Type</p>
            <p className="mt-1 font-semibold text-slate-950">
              {note.type?.toUpperCase() || "NOTE"}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
            <p className="text-xs font-semibold uppercase text-slate-400">Subject</p>
            <p className="mt-1 font-semibold text-slate-950">
              {note.subjectCode || "General"}
            </p>
          </div>
        </div>

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
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ExternalLink size={16} />
          {isAuthenticated ? "Open PDF" : "Login to Access"}
        </button>
        <button
          type="button"
          disabled={!hasFile}
          onClick={handleDownload}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Download size={16} />
          Download PDF
        </button>
      </div>
      </div>
    </section>
  );
}
