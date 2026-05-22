export default function Loader({ message = "Loading..." }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-sky-50 via-indigo-50 to-violet-50 px-4">
      <div className="absolute -left-24 top-16 h-56 w-56 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="absolute -right-20 bottom-12 h-64 w-64 rounded-full bg-indigo-300/40 blur-3xl" />

      <div className="relative w-full max-w-sm rounded-[32px] border border-white/80 bg-white/75 p-8 text-center shadow-2xl shadow-indigo-200/50 backdrop-blur-2xl">
        <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 rounded-[28px] bg-indigo-600/10" />
          <div className="absolute h-24 w-24 animate-spin rounded-[28px] border-2 border-transparent border-t-indigo-600 border-r-sky-400" />
          <div className="absolute h-16 w-16 animate-pulse rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-500 shadow-xl shadow-indigo-300/50" />
          <div className="relative grid h-11 w-11 place-items-center rounded-xl bg-white text-indigo-700 shadow-lg">
            <span className="font-poppins text-lg font-semibold">G</span>
          </div>
        </div>

        <h1 className="mt-6 font-poppins text-xl font-semibold text-slate-950">
          GBPIET Notes
        </h1>
        <p className="mt-2 text-sm font-medium text-slate-500">{message}</p>

        <div className="mt-6 flex items-center justify-center gap-2">
          {[0, 1, 2].map((item) => (
            <span
              key={item}
              className="h-2.5 w-2.5 animate-bounce rounded-full bg-indigo-600"
              style={{ animationDelay: `${item * 120}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
