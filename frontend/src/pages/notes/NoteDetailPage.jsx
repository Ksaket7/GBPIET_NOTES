import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";
import NoteHeader from "../../components/notes/NoteHeader";
import NotePreview from "../../components/notes/NotePreview";
import NoteComments from "../../components/notes/NoteComments";
import Loader from "../../components/common/Loader";

export default function NoteDetailPage() {
  const { noteId } = useParams();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await API.get(`/notes/${noteId}`);
        setNote(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load note");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [noteId]);

  if (loading) {
    return <Loader message="Loading notes" />;
  }

  if (error) {
    return (
      <div className="app-page flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <main className="app-page">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="min-w-0 space-y-6">
            <NoteHeader note={note} />
            <NoteComments noteId={note._id} />
          </div>

          <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <NotePreview note={note} />
          </aside>
        </div>
      </div>
    </main>
  );
}
