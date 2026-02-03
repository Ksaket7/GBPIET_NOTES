export default function Loader({ message = "Loading…" }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      {/* Spinner */}
      <div className="h-10 w-10 border-4 border-borderSoft border-t-primary rounded-full animate-spin"></div>

      {/* Message */}
      <p className="font-inter text-textSecondary mt-4 text-sm">
        {message}
      </p>
    </div>
  );
}
