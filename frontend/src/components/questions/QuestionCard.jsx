import { MessageCircleQuestion } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UpvoteButton from "../upvote/UpvoteButton";

export default function QuestionCard({ question }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/questions/${question._id}`)}
      className="soft-card cursor-pointer p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-2xl bg-sky-100 p-3 text-sky-600">
          <MessageCircleQuestion size={20} />
        </span>
        <span className="pill">{question.tags?.[0] || "Q&A"}</span>
      </div>

      <div className="mt-5 space-y-2">
        <h3 className="font-poppins text-lg font-semibold text-slate-950">
          {question.title}
        </h3>
        <p className="line-clamp-2 text-sm text-slate-500">
          {question.description}
        </p>
        <p className="text-xs text-slate-400">
          Asked by {question.askedBy?.fullName || "student"}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <UpvoteButton type="question" id={question._id} />
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            navigate(`/questions/${question._id}`);
          }}
          className="rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
        >
          Answers
        </button>
      </div>
    </div>
  );
}
