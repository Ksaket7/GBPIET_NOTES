import { UploadCloud } from "lucide-react";

const FileUpload = ({ file, setFile }) => {
  return (
    <label
      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-3xl border border-dashed border-indigo-200 bg-white/60 px-4 py-6 transition hover:bg-white"
    >
      <UploadCloud size={18} />
      <span className="text-sm text-slate-500">
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
