import QuestionCard from "./QuestionCard";
import MyNotesSkeleton from "../dashboard/MyNotesSkeleton";

export default function QuestionsList({ questions, loading }) {
  if (loading) {
    return <MyNotesSkeleton />;
  }

  if (questions.length === 0) {
    return (
      <p className="text-textSecondary">
        No questions found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {questions.map((q) => (
        <QuestionCard key={q._id} question={q} />
      ))}
    </div>
  );
}