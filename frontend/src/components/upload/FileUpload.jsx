import { UploadCloud } from "lucide-react";

const FileUpload = ({ file, setFile }) => {
  return (
    <label
      className="w-full flex items-center justify-center gap-2 px-4 py-3 
                 border border-borderSoft rounded-md cursor-pointer
                 hover:bg-gray-50 transition"
    >
      <UploadCloud size={18} />
      <span className="text-sm text-textSecondary">
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