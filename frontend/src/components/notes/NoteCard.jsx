import { Download, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  downloadNoteFile,
  getNoteFileUrl,
  getNoteId,
  openNoteFile,
} from "../../utils/noteFileActions";
import UpvoteButton from "../upvote/UpvoteButton";
import NoteThumbnail from "./NoteThumbnail";
import UserAvatar from "../ui/UserAvatar";
import UserProfileLink from "../ui/UserProfileLink";
import CardActionMenu from "../ui/CardActionMenu";
import API from "../../services/api";
import { useToast } from "../../context/ToastContext";

export default function NoteCard({ note, onDeleted }) {
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const owner = note.originalStudent || note.uploadedBy;
  const actionOwner = note.uploadedBy || owner;
  const isOwner = actionOwner?._id === user?._id;
  const noteId = getNoteId(note);
  const hasFile = Boolean(getNoteFileUrl(note));

  const requireLogin = () => {
    if (isAuthenticated) return false;
    navigate("/login");
    return true;
  };

  const handleCardClick = () => {
    if (noteId) navigate(`/notes/${noteId}`);
  };

  const handleOpen = (event) => {
    event.stopPropagation();
    if (requireLogin()) return;
    openNoteFile(note);
  };

  const handleDownload = async (event) => {
    event.stopPropagation();
    if (requireLogin()) return;
    await downloadNoteFile(note);
  };

  const handleDelete = async () => {
    await API.delete(`/notes/${noteId}`);
    showToast("Note deleted successfully.", "success");
    onDeleted?.(noteId);
  };

  return (
    <div
      onClick={handleCardClick}
      className="soft-card cursor-pointer p-5"
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleCardClick();
        }
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <UserAvatar user={owner} className="h-11 w-11" rounded="rounded-2xl" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-950">
              <UserProfileLink user={owner} className="truncate">
              {owner?.fullName || "Original student"}
              </UserProfileLink>
            </p>
            <p className="truncate text-xs text-slate-500">
              <UserProfileLink user={owner} showHandle className="text-slate-500 hover:text-indigo-700" /> - Original student
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {note.verified && (
            <span className="pill bg-emerald-50 text-emerald-700">Verified</span>
          )}
          {isAuthenticated && (
            <CardActionMenu
              isOwner={isOwner}
              ownerUser={actionOwner}
              onDelete={isOwner ? handleDelete : undefined}
            />
          )}
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <NoteThumbnail note={note} />
        <h3 className="break-words font-poppins text-lg font-semibold text-slate-950">
          {note.title}
        </h3>
        <p className="text-sm text-slate-500">
          {note.subjectCode || "Subject"} - {note.type || "Material"}
        </p>
        <p className="text-xs text-slate-400">
          Uploaded by{" "}
          <UserProfileLink
            user={note.uploadedBy}
            className="font-semibold text-slate-500"
          >
            {note.uploadedBy?.fullName || "GBPIET"}
          </UserProfileLink>
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <UpvoteButton type="note" id={noteId} stopPropagation />
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={!hasFile}
            onClick={handleOpen}
            className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-white px-4 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ExternalLink size={14} />
            {isAuthenticated ? "Open" : "Login"}
          </button>
          <button
            type="button"
            disabled={!hasFile}
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={14} />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
