export default function NotesFilters({ filters, setSearchParams }) {
  const updateParam = (key, value) => {
    setSearchParams((prev) => {
      const params = Object.fromEntries(prev);
      if (value) {
        params[key] = value;
      } else {
        delete params[key];
      }
      params.page = 1;
      return params;
    });
  };

  return (
    <div className="glass-panel grid gap-3 p-3 sm:p-4 lg:grid-cols-[minmax(0,1fr)_170px_170px] xl:grid-cols-[minmax(0,1fr)_180px_180px]">
      <label className="block space-y-2">
        <span className="text-sm font-semibold text-slate-700">Search</span>
        <input
          type="text"
          placeholder="Search notes..."
          value={filters.query}
          onChange={(e) => updateParam("query", e.target.value)}
          className="app-input"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-semibold text-slate-700">Subject code</span>
        <input
          type="text"
          placeholder="Subject Code"
          value={filters.subjectCode}
          onChange={(e) => updateParam("subjectCode", e.target.value)}
          className="app-input"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-semibold text-slate-700">Type</span>
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
      </label>
    </div>
  );
}
