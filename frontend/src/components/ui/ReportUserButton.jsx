import { useEffect, useState } from "react";
import { Flag, RotateCcw } from "lucide-react";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const variantClasses = {
  menu: {
    base: "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold transition disabled:opacity-60",
    report: "text-amber-700 hover:bg-amber-50",
    undo: "text-indigo-700 hover:bg-indigo-50",
  },
  profile: {
    base: "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition disabled:opacity-60",
    report: "border border-amber-100 bg-amber-50 text-amber-700 hover:bg-amber-100",
    undo: "border border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-50",
  },
};

export default function ReportUserButton({
  className = "",
  initialReported = false,
  onChanged,
  stopPropagation = false,
  user,
  variant = "profile",
}) {
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();
  const [reported, setReported] = useState(Boolean(initialReported));
  const [loading, setLoading] = useState(false);

  const targetId = user?._id;
  const isSelf = targetId && currentUser?._id === targetId;
  const styles = variantClasses[variant] || variantClasses.profile;

  useEffect(() => {
    setReported(Boolean(initialReported));
  }, [initialReported, targetId]);

  useEffect(() => {
    let mounted = true;

    const loadStatus = async () => {
      if (!targetId || isSelf) return;

      try {
        const response = await API.get(`/users/${targetId}/report-status`);
        if (mounted) setReported(Boolean(response.data?.data?.reported));
      } catch {
        // The button still works through the toggle endpoint, so status fetch
        // failures should not block the menu/profile from rendering.
      }
    };

    loadStatus();

    return () => {
      mounted = false;
    };
  }, [targetId, isSelf]);

  if (!targetId || isSelf) return null;

  const handleToggleReport = async (event) => {
    if (stopPropagation) event.stopPropagation();

    try {
      setLoading(true);
      const response = await API.post(`/users/${targetId}/report`, {
        reason: "Inappropriate content",
      });
      const nextReported = Boolean(response.data?.data?.reported);
      setReported(nextReported);
      showToast(
        nextReported
          ? "User reported. Thank you for helping keep GBPIET Notes safe."
          : "Report removed successfully.",
        "success",
      );
      onChanged?.(response.data?.data);
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to update report.", "error");
    } finally {
      setLoading(false);
    }
  };

  const Icon = reported ? RotateCcw : Flag;

  return (
    <button
      type="button"
      disabled={loading}
      onClick={handleToggleReport}
      className={`${styles.base} ${reported ? styles.undo : styles.report} ${className}`}
    >
      <Icon size={15} />
      {reported ? "Undo report" : "Report user"}
    </button>
  );
}
