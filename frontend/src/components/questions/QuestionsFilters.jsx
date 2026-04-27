export default function QuestionsFilters({ filters, setSearchParams }) {
  const updateParam = (key, value) => {
    setSearchParams((prev) => {
      const params = Object.fromEntries(prev);

      if (value) params[key] = value;
      else delete params[key];

      params.page = 1;
      return params;
    });
  };

  return (
    <div className="glass-panel grid gap-3 p-4 md:grid-cols-[1fr_180px]">
      <input
        type="text"
        placeholder="Search questions…"
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
    </div>
  );
}
