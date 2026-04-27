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
    <div className="glass-panel grid gap-3 p-4 md:grid-cols-[1fr_180px_180px]">
      <input
        type="text"
        placeholder="Search notes…"
        value={filters.query}
        onChange={(e) => updateParam("query", e.target.value)}
        className="app-input"
      />

      <input
        type="text"
        placeholder="Subject Code"
        value={filters.subjectCode}
        onChange={(e) => updateParam("subjectCode", e.target.value)}
        className="app-input"
      />

      <select
        value={filters.type}
        onChange={(e) => updateParam("type", e.target.value)}
        className="app-input"
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
