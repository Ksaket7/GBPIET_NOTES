import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import NoteHeader from "../components/notes/NoteHeader";
import NotePreview from "../components/notes/NotePreview";
import NoteComments from "../components/notes/NoteComments";
import Loader from "../components/common/Loader";
import { useAnimationControls } from "framer-motion";

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
      <div className="min-h-screen flex items-center justify-center text-red-500 font-inter">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-5 py-10 space-y-8">
      <NoteHeader note={note} />
      <NotePreview note={note} />
      <NoteComments noteId={note._id} />
    </div>
  );
}
