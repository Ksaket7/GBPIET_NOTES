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
    <div className="flex flex-wrap gap-4">
      <input
        type="text"
        placeholder="Search questions…"
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
    </div>
  );
}