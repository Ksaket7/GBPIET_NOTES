import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../services/api";
import NotesFilters from "../components/notes/NotesFilters";
import NotesList from "../components/notes/NotesList";
import NotesPagination from "../components/notes/NotesPagination";

export default function NotesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [notes, setNotes] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔑 derive filters from URL
  const filters = {
    page: Number(searchParams.get("page")) || 1,
    limit: 10,
    query: searchParams.get("query") || "",
    subjectCode: searchParams.get("subjectCode") || "",
    type: searchParams.get("type") || "",
  };

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
  }, [searchParams]); // 👈 URL is the trigger

  return (
    <div className="max-w-7xl mx-auto px-5 py-10 space-y-6">
      <h1 className="font-poppins text-3xl text-textPrimary">Notes</h1>

      <NotesFilters filters={filters} setSearchParams={setSearchParams} />

      <NotesList loading={loading} notes={notes} />

      {pagination && (
        <NotesPagination
          pagination={pagination}
          onPageChange={(page) => {
            setSearchParams({
              ...filters,
              page,
            });
          }}
        />
      )}
    </div>
  );
}
