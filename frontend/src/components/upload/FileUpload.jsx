import { UploadCloud } from "lucide-react";

const FileUpload = ({ file, setFile }) => {
  return (
    <label
      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/40 px-4 py-6 text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-50"
    >
      <UploadCloud size={18} />
      <span className="min-w-0 truncate text-sm font-medium">
        {file ? file.name : "Click to upload file"}
      </span>

      <input
        type="file"
        className="hidden"
        onChange={(e) => setFile(e.target.files[0])}
      />
    </label>
  );
};

export default FileUpload;
