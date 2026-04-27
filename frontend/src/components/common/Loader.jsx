export default function Loader({ message = "Loading..." }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-transparent px-4">
      <div className="rounded-[28px] border border-white/70 bg-white/55 p-8 text-center shadow-2xl shadow-slate-500/20 backdrop-blur-2xl">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/70 border-t-indigo-600" />
        <p className="mt-4 text-sm text-slate-500">{message}</p>
      </div>
    </div>
  );
}
