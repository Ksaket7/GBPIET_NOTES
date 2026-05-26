import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, X } from "lucide-react";
import API from "../../services/api";
import NotesFilters from "../../components/notes/NotesFilters";
import NotesList from "../../components/notes/NotesList";
import NotesPagination from "../../components/notes/NotesPagination";
import UploadNoteForm from "../../components/upload/UploadNote";
import { useAuth } from "../../context/AuthContext";

const canUploadNotes = (role) => ["faculty", "admin"].includes(role);

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
            <h1 className="page-title">Notes</h1>
          </div>
          {allowNoteUpload && (
            <button
              type="button"
              onClick={() => setShowUploadForm((value) => !value)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 md:w-auto"
            >
              {showUploadForm ? <X size={16} /> : <Plus size={16} />}
              {showUploadForm ? "Close form" : "Upload note"}
            </button>
          )}
        </header>

        {allowNoteUpload && showUploadForm && (
          <div className="overflow-hidden rounded-[26px] border border-indigo-100 bg-white/85 p-2 shadow-xl shadow-indigo-100/60">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-3 py-3 sm:px-4">
              <div>
                <p className="text-sm font-semibold text-slate-950">
                  Upload study material
                </p>
                <p className="text-xs text-slate-500">
                  Share notes, assignments, PYQs, and tutorials with the community.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadForm(false)}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 hover:text-slate-950"
                aria-label="Close upload note form"
              >
                <X size={17} />
              </button>
            </div>
            <UploadNoteForm
              onUploaded={() => {
                setShowUploadForm(false);
                fetchNotes();
              }}
            />
          </div>
        )}

        <NotesFilters filters={filters} setSearchParams={setSearchParams} />
        <NotesList
          loading={loading}
          notes={notes}
          onDeleted={(noteId) =>
            setNotes((currentNotes) =>
              currentNotes.filter((note) => note._id !== noteId)
            )
          }
        />

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
