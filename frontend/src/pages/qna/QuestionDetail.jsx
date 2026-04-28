import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";
import Loader from "../../components/common/Loader";
import LoadingButton from "../../components/ui/LoadingButton";
import UpvoteButton from "../../components/upvote/UpvoteButton";
import ConfirmModal from "../../components/ui/ConfirmModal";

export default function QuestionDetail() {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [answering, setAnswering] = useState(false);
  const [answerText, setAnswerText] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    API.get(`/questions/${questionId}`)
      .then((res) => setQuestion(res.data.data))
      .catch(() => setQuestion(null))
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

  const handleAnswer = async (event) => {
    event.preventDefault();

    if (!answerText.trim()) return;

    try {
      setAnswering(true);
      const res = await API.post(`/answers/${questionId}`, {
        content: answerText,
      });
      setQuestion((current) => ({
        ...current,
        answers: [
          {
            ...res.data.data,
            answeredBy: {
              _id: user?._id,
              username: user?.username,
              fullName: user?.fullName,
            },
          },
          ...(current.answers || []),
        ],
      }));
      setAnswerText("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add answer");
    } finally {
      setAnswering(false);
    }
  };

  if (loading) return <Loader message="Loading question..." />;

  if (!question) {
    return (
      <main className="app-page">
        <div className="app-shell text-center text-slate-500">Question not found</div>
      </main>
    );
  }

  const isOwner = user && question.askedBy?._id === user._id;

  return (
    <main className="app-page">
      <div className="app-shell space-y-6">
        <section className="glass-panel p-6">
          <span className="pill">Question</span>
          <h1 className="mt-4 font-poppins text-3xl font-semibold text-slate-950">
            {question.title || "Untitled Question"}
          </h1>
          <p className="mt-4 text-slate-600">{question.description}</p>

          {question.tags?.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {question.tags.map((tag) => (
                <span key={tag} className="pill">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-4 border-t border-white/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-slate-500">
              Asked by <strong className="text-slate-950">{question.askedBy?.username}</strong>
            </span>
            <UpvoteButton type="question" id={question._id} />
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <a href="#answer-form" className="app-button">
              Answer this question
            </a>
            {isOwner && (
              <LoadingButton onClick={() => setShowConfirm(true)} className="app-button-secondary text-red-500">
                Delete
              </LoadingButton>
            )}
          </div>
        </section>

        <section className="glass-panel p-6">
          <h2 className="font-poppins text-2xl font-semibold text-slate-950">
            Answers ({question.answers?.length || 0})
          </h2>
          <form id="answer-form" onSubmit={handleAnswer} className="mt-5 space-y-3">
            <textarea
              value={answerText}
              onChange={(event) => setAnswerText(event.target.value)}
              placeholder="Write your answer..."
              className="app-input min-h-32"
            />
            <div className="flex justify-end">
              <LoadingButton
                loading={answering}
                type="submit"
                disabled={!answerText.trim()}
                className="app-button"
              >
                Post Answer
              </LoadingButton>
            </div>
          </form>
          <div className="mt-5 space-y-3">
            {question.answers?.length === 0 ? (
              <p className="text-sm text-slate-500">No answers yet. Be the first to answer.</p>
            ) : (
              question.answers.map((answer) => (
                <div key={answer._id} className="rounded-3xl bg-white/65 p-4">
                  <p className="text-slate-700">{answer.content}</p>
                  <p className="mt-3 text-xs text-slate-500">
                    Answered by <strong>{answer.answeredBy?.username}</strong>
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        <ConfirmModal
          open={showConfirm}
          title="Delete Question"
          message="Are you sure you want to delete this question? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      </div>
    </main>
  );
}
