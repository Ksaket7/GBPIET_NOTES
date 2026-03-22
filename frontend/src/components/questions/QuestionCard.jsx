import { useNavigate } from "react-router-dom";
import UpvoteButton from "../upvote/UpvoteButton";

export default function QuestionCard({ question }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/questions/${question._id}`)}
      className="cursor-pointer bg-surface border border-borderSoft rounded-lg p-5 space-y-3 hover:shadow-md transition"
    >
      {/* Title */}
      <h3 className="font-poppins text-lg font-semibold text-textPrimary">
        {question.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-textSecondary line-clamp-2">
        {question.description}
      </p>

      {/* Meta */}
      <p className="text-xs text-textSecondary">
        {question.subjectCode} • {question.tags?.join(", ")}
      </p>

      <p className="text-xs text-textSecondary">
        Asked by {question.askedBy?.fullName}
      </p>

      {/* Actions */}
      <div className="flex items-center justify-between mt-3">
        <UpvoteButton type="question" id={question._id} />

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/questions/${question._id}`);
          }}
          className="px-4 py-1.5 text-sm bg-primary text-white rounded hover:bg-primaryDark"
        >
          View Answers
        </button>
      </div>
    </div>
  );
}