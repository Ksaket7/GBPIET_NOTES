import { useAuth } from "../../context/AuthContext";

export default function DashboardStats() {
  const { user } = useAuth();

  const stats = [
    { label: "Notes Uploaded", value: user?.notesCount || 0 },
    { label: "Upvotes Earned", value: user?.upvotes || 0 },
    { label: "Credits", value: user?.credits || 0 },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-surface border border-borderSoft rounded-xl p-6"
        >
          <p className="font-inter text-sm text-textSecondary">
            {s.label}
          </p>
          <p className="font-poppins text-3xl text-primary mt-2">
            {s.value}
          </p>
        </div>
      ))}
    </div>
  );
}
