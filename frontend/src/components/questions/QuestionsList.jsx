import QuestionCard from "./QuestionCard";
import MyNotesSkeleton from "../dashboard/MyNotesSkeleton";

export default function QuestionsList({ questions, loading }) {
  if (loading) {
    return <MyNotesSkeleton />;
  }

  if (questions.length === 0) {
    return (
      <p className="glass-panel p-6 text-sm text-slate-500">
        No questions found.
      </p>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-4">
      {questions.map((q) => (
        <QuestionCard key={q._id} question={q} />
      ))}
    </div>
  );
}
