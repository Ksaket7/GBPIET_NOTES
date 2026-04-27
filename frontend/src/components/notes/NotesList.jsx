import NoteCard from "./NoteCard";
import MyNotesSkeleton from "../dashboard/MyNotesSkeleton";

export default function NotesList({ notes, loading }) {
  if (loading) {
    return <MyNotesSkeleton/>;
  }

  if (notes.length === 0) {
    return (
      <p className="glass-panel p-6 text-sm text-slate-500">
        No notes found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {notes.map((note) => (
        <NoteCard key={note._id} note={note} />
      ))}
    </div>
  );
}
