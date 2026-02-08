import Loader from "../common/Loader";
import NoteCard from "./NoteCard";
import MyNotesSkeleton from "../dashboard/MyNotesSkeleton";

export default function NotesList({ notes, loading }) {
  if (loading) {
    return <MyNotesSkeleton/>;
  }

  if (notes.length === 0) {
    return (
      <p className="font-inter text-textSecondary">
        No notes found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {notes.map((note) => (
        <NoteCard key={note._id} note={note} />
      ))}
    </div>
  );
}
