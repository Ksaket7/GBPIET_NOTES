export default function QuestionsPagination({ pagination, onPageChange }) {
  const { currentPage, totalPages } = pagination;

  if (totalPages <= 1) return null;

  const pages = [];
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="mt-8 flex max-w-full flex-wrap items-center justify-center gap-2 overflow-hidden">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded-full bg-white/70 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white disabled:opacity-50 sm:px-4"
      >
        Prev
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`rounded-full px-3 py-2 text-sm font-semibold transition sm:px-4 ${
            page === currentPage
              ? "bg-slate-950 text-white"
              : "bg-white/70 text-slate-600 hover:bg-white"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded-full bg-white/70 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white disabled:opacity-50 sm:px-4"
      >
        Next
      </button>
    </div>
  );
}
