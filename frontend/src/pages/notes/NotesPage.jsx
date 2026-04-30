import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, X } from "lucide-react";
import API from "../../services/api";
import NotesFilters from "../../components/notes/NotesFilters";
import NotesList from "../../components/notes/NotesList";
import NotesPagination from "../../components/notes/NotesPagination";
import UploadNoteForm from "../../components/upload/UploadNote";
import { useAuth } from "../../context/AuthContext";
import FormModal from "../../components/ui/FormModal";

const canUploadNotes = (role) => ["cr", "faculty", "admin"].includes(role);

export default function NotesPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [notes, setNotes] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const allowNoteUpload = canUploadNotes(user?.role);

  const filters = useMemo(() => ({
    page: Number(searchParams.get("page")) || 1,
    limit: 10,
    query: searchParams.get("query") || "",
    subjectCode: searchParams.get("subjectCode") || "",
    type: searchParams.get("type") || "",
  }), [searchParams]);

  const fetchNotes = useCallback(async () => {
      setLoading(true);
      try {
        const res = await API.get("/notes", { params: filters });
        setNotes(res.data.data.notes);
        setPagination(res.data.data.pagination);
      } finally {
        setLoading(false);
      }
  }, [filters]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return (
    <main className="app-page">
      <div className="app-shell space-y-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="pill">Library</span>
            <h1 className="page-title mt-3">Notes</h1>
            <p className="page-subtitle">
              Search shared notes, assignments, PYQs, and tutorial material.
            </p>
          </div>
          {allowNoteUpload && (
            <button
              type="button"
              onClick={() => setShowUploadForm((value) => !value)}
              className="app-button w-full md:w-auto"
            >
              {showUploadForm ? <X size={16} /> : <Plus size={16} />}
              {showUploadForm ? "Close form" : "Upload note"}
            </button>
          )}
        </header>

        {allowNoteUpload && showUploadForm && (
          <FormModal title="Upload note" onClose={() => setShowUploadForm(false)}>
            <UploadNoteForm
              onUploaded={() => {
                setShowUploadForm(false);
                fetchNotes();
              }}
            />
          </FormModal>
        )}

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
