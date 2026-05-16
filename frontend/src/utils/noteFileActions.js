export const getNoteId = (note) => note?._id || note?.id;

export const getNoteFileUrl = (note) => note?.fileUrl || note?.url || "";

const safeFileName = (title = "note") =>
  `${title}`
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80) || "note";

export const openNoteFile = (note) => {
  const fileUrl = getNoteFileUrl(note);
  if (!fileUrl) return false;

  window.open(fileUrl, "_blank", "noopener,noreferrer");
  return true;
};

export const downloadNoteFile = async (note) => {
  const fileUrl = getNoteFileUrl(note);
  if (!fileUrl) return false;

  const filename = `${safeFileName(note?.title)}.pdf`;

  try {
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error("Unable to fetch note file");

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
  } catch {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = filename;
    link.target = "_blank";
    link.rel = "noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return true;
};
