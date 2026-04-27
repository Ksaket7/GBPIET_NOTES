import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../../services/api";
import NotesFilters from "../../components/notes/NotesFilters";
import NotesList from "../../components/notes/NotesList";
import NotesPagination from "../../components/notes/NotesPagination";

export default function NotesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [notes, setNotes] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);

  const filters = useMemo(() => ({
    page: Number(searchParams.get("page")) || 1,
    limit: 10,
    query: searchParams.get("query") || "",
    subjectCode: searchParams.get("subjectCode") || "",
    type: searchParams.get("type") || "",
  }), [searchParams]);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const res = await API.get("/notes", { params: filters });
        setNotes(res.data.data.notes);
        setPagination(res.data.data.pagination);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [filters]);

  return (
    <main className="app-page">
      <div className="app-shell space-y-6">
        <header>
          <span className="pill">Library</span>
          <h1 className="page-title mt-3">Notes</h1>
          <p className="page-subtitle">
            Search shared notes, assignments, PYQs, and tutorial material.
          </p>
        </header>

        <NotesFilters filters={filters} setSearchParams={setSearchParams} />
        <NotesList loading={loading} notes={notes} />

        {pagination && (
          <NotesPagination
            pagination={pagination}
            onPageChange={(page) => setSearchParams({ ...filters, page })}
          />
        )}
      </div>
    </main>
  );
}
