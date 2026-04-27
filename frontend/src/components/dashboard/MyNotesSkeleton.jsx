// components/dashboard/MyNotesSkeleton.jsx
export default function MyNotesSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-7 w-40 rounded-full bg-white/70" />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="soft-card space-y-3 p-4"
          >
            <div className="h-5 w-3/4 rounded-full bg-white/70" />
            <div className="h-4 w-1/2 rounded-full bg-white/70" />
            <div className="h-4 w-full rounded-full bg-white/70" />
            <div className="flex justify-between items-center mt-4">
              <div className="h-4 w-20 rounded-full bg-white/70" />
              <div className="h-8 w-24 rounded-full bg-white/70" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
