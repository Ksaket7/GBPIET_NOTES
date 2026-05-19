import { FileText } from "lucide-react";
import { getNoteFileUrl } from "../../utils/noteFileActions";

const previewSrcFor = (fileUrl) => {
  if (!fileUrl) return "";
  return `${fileUrl}#page=1&toolbar=0&navpanes=0&scrollbar=0&view=FitH`;
};

export default function NoteThumbnail({
  note,
  className = "",
  compact = false,
  size = "",
}) {
  const fileUrl = getNoteFileUrl(note);
  const previewImageUrl = note?.previewImageUrl || note?.thumbnailUrl || "";
  const label = note?.subjectCode || note?.type || "PDF";
  const heightClass = size || (compact ? "h-28 sm:h-32" : "h-40 sm:h-48");

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-sky-50 shadow-inner ${heightClass} ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(79,70,229,0.16),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.88),rgba(239,246,255,0.64))]" />

      <div className="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase text-indigo-700 shadow-sm">
        {label}
      </div>

      <div className="absolute bottom-3 right-3 z-10 rounded-full bg-slate-950/85 px-3 py-1 text-[11px] font-semibold text-white shadow-sm">
        Preview
      </div>

      {previewImageUrl ? (
        <img
          src={previewImageUrl}
          alt={`${note?.title || "Note"} preview`}
          className="relative z-[1] h-full w-full object-cover"
          loading="lazy"
        />
      ) : fileUrl ? (
        <iframe
          src={previewSrcFor(fileUrl)}
          title={`${note?.title || "Note"} preview`}
          loading="lazy"
          className="pointer-events-none relative z-[1] h-[140%] w-full origin-top scale-[1.02] border-0 bg-white"
        />
      ) : (
        <div className="relative z-[1] flex h-full items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm">
            <FileText size={34} />
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-16 bg-gradient-to-t from-white via-white/70 to-transparent" />
    </div>
  );
}
