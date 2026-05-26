import { AlertTriangle } from "lucide-react";

export default function UploadPolicyWarning({ className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 ${className}`}
    >
      <div className="flex gap-3">
        <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-600" />
        <p className="leading-6">
          Upload only appropriate academic or community content. If your profile
          receives 2 valid reports, your account may be banned and the same
          email cannot be used again.
        </p>
      </div>
    </div>
  );
}
