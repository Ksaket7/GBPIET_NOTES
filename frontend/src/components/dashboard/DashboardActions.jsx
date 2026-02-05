import { useNavigate } from "react-router-dom";

export default function DashboardActions() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap gap-4">
      <button
        onClick={() => navigate("/upload")}
        className="px-6 py-3 bg-primary text-white rounded
                   hover:bg-primaryDark transition font-inter"
      >
        Upload Note
      </button>

      <button
        onClick={() => navigate("/notes")}
        className="px-6 py-3 border border-primary text-primary rounded
                   hover:bg-primary hover:text-white transition font-inter"
      >
        Browse Notes
      </button>
    </div>
  );
}
