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
    <div className="grid gap-3 rounded-2xl bg-white p-3 shadow-sm sm:p-4 lg:grid-cols-[minmax(0,1fr)_180px]">
      <input
        type="text"
        placeholder="Search questions..."
        value={filters.query}
        onChange={(event) => updateParam("query", event.target.value)}
        className="app-input border-slate-100 bg-slate-50"
      />

      <input
        type="text"
        placeholder="Subject Code"
        value={filters.subjectCode}
        onChange={(event) => updateParam("subjectCode", event.target.value)}
        className="app-input border-slate-100 bg-slate-50"
      />
    </div>
  );
}
