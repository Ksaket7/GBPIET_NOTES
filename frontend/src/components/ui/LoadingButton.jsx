export default function LoadingButton({
  children,
  loading = false,
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <button
      disabled={loading || disabled}
      className={`
        relative flex items-center justify-center
        ${loading || disabled ? "opacity-70 cursor-not-allowed" : ""}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <span className="absolute h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      )}

      <span className={loading ? "opacity-0" : "opacity-100"}>
        {children}
      </span>
    </button>
  );
}
