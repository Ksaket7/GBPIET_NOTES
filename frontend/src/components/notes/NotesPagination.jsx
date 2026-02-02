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
    <div className="flex items-center justify-center gap-2 mt-8 font-inter">
      {/* Prev */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1 border border-borderSoft rounded
                   disabled:opacity-50 hover:bg-borderSoft transition"
      >
        Prev
      </button>

      {/* Page Numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 border rounded transition
            ${
              page === currentPage
                ? "bg-primary text-white border-primary"
                : "border-borderSoft hover:bg-borderSoft"
            }`}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1 border border-borderSoft rounded
                   disabled:opacity-50 hover:bg-borderSoft transition"
      >
        Next
      </button>
    </div>
  );
}
