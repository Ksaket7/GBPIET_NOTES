export default function NotesFilters({ filters, setSearchParams }) {
  const updateParam = (key, value) => {
    setSearchParams((prev) => {
      const params = Object.fromEntries(prev);
      if (value) {
        params[key] = value;
      } else {
        delete params[key];
      }
      params.page = 1; // reset page on filter change
      return params;
    });
  };

  return (
    <div className="flex flex-wrap gap-4">
      <input
        type="text"
        placeholder="Search notes…"
        value={filters.query}
        onChange={(e) => updateParam("query", e.target.value)}
        className="border border-borderSoft px-3 py-2 rounded"
      />

      <input
        type="text"
        placeholder="Subject Code"
        value={filters.subjectCode}
        onChange={(e) => updateParam("subjectCode", e.target.value)}
        className="border border-borderSoft px-3 py-2 rounded"
      />

      <select
        value={filters.type}
        onChange={(e) => updateParam("type", e.target.value)}
        className="border border-borderSoft px-3 py-2 rounded"
      >
        <option value="">All Types</option>
        <option value="notes">Notes</option>
        <option value="pyqs">PYQs</option>
        <option value="tuts">Tutorials</option>
        <option value="assignments">Assignments</option>
      </select>
    </div>
  );
}
