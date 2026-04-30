export default function NotesPagination({ pagination, onPageChange }) {
  const { currentPage, totalPages } = pagination;

  if (totalPages <= 1) return null;

  const pages = [];

  // Build page numbers (max 5 visible)
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
      {/* Prev */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white disabled:opacity-50"
      >
        Prev
      </button>

      {/* Page Numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition
            ${
              page === currentPage
                ? "bg-slate-950 text-white"
                : "bg-white/70 text-slate-600 hover:bg-white"
            }`}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
