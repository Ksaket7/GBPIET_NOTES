import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import Loader from "../components/common/Loader";
import LoadingButton from "../components/ui/LoadingButton";
import UpvoteButton from "../components/upvote/UpvoteButton";
import ConfirmModal from "../components/ui/ConfirmModal";

export default function QuestionDetail() {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    API.get(`/questions/${questionId}`)
      .then((res) => setQuestion(res.data.data))
      .catch(() => setError("Failed to load question"))
      .finally(() => setLoading(false));
  }, [questionId]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await API.delete(`/questions/${questionId}`);
      navigate("/questions");
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  if (loading) return <Loader message="Loading question…" />;

  if (!question) {
    return <p className="text-center text-textSecondary">Question not found</p>;
  }

  const isOwner = user && question.askedBy?._id === user._id;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Question Card */}
      <div className="bg-surface border border-borderSoft rounded-xl p-6 space-y-4">
        <h1 className="font-poppins text-3xl text-textPrimary">
          {question.title || "Untitled Question"}
        </h1>

        <p className="font-inter text-textSecondary">{question.description}</p>

        {/* Tags */}
        {question.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {question.tags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Meta */}
        <div className="flex justify-between items-center text-sm text-textSecondary">
          <span>
            Asked by{" "}
            <strong className="text-textPrimary">
              {question.askedBy?.username}
            </strong>
          </span>

          <UpvoteButton type="question" id={question._id} />
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <LoadingButton
            onClick={() => navigate(`/questions/${questionId}/answer`)}
            className="px-4 py-2 bg-primary text-white rounded"
          >
            Answer this question
          </LoadingButton>

          {isOwner && (
            <LoadingButton
              onClick={() => setShowConfirm(true)}
              className="px-4 py-2 border border-red-500 text-red-500 rounded
             hover:bg-red-500 hover:text-white transition"
            >
              Delete
            </LoadingButton>
          )}
        </div>
      </div>

      {/* Answers Section */}
      <div className="space-y-4">
        <h2 className="font-poppins text-2xl text-textPrimary">
          Answers ({question.answers?.length || 0})
        </h2>

        {question.answers?.length === 0 ? (
          <p className="text-textSecondary font-inter">
            No answers yet. Be the first to answer!
          </p>
        ) : (
          question.answers.map((answer) => (
            <div
              key={answer._id}
              className="bg-surface border border-borderSoft rounded-xl p-4 space-y-2"
            >
              <p className="font-inter text-textPrimary">{answer.content}</p>

              <div className="flex justify-between text-sm text-textSecondary">
                <span>
                  Answered by{" "}
                  <strong className="text-textPrimary">
                    {answer.answeredBy?.username}
                  </strong>
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
