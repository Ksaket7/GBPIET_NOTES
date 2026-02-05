import { useEffect, useState } from "react";
import API from "../../services/api";
import NoteCard from "../notes/NoteCard";

export default function MyNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/notes?mine=true")
      .then((res) => setNotes(res.data.data.notes))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="font-inter text-textSecondary">Loading your notes…</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="font-poppins text-2xl text-textPrimary">
        My Notes
      </h2>

      {notes.length === 0 ? (
        <p className="font-inter text-textSecondary">
          You haven’t uploaded any notes yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notes.map((note) => (
            <NoteCard key={note._id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}
