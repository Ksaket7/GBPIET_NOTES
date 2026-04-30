import { MessageSquareText, Send } from "lucide-react";
import { useEffect, useState } from "react";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import UpvoteButton from "../upvote/UpvoteButton";
import UpvotersList from "../upvote/UpvotersList";
import LoadingButton from "../ui/LoadingButton";

export default function QuestionCard({ question }) {
  const { user } = useAuth();
  const [answersOpen, setAnswersOpen] = useState(false);
  const [showUpvoters, setShowUpvoters] = useState(false);
  const [answers, setAnswers] = useState(question.answers || []);
  const [answersLoading, setAnswersLoading] = useState(false);
  const [answerText, setAnswerText] = useState("");
  const [answering, setAnswering] = useState(false);
  const owner = question.askedBy;
  const [upvoters, setUpvoters] = useState([]);
  const tags = question.tags?.length ? question.tags : ["Q&A"];

  useEffect(() => {
    setAnswers(question.answers || []);
  }, [question.answers]);

  const fetchUpvoters = async () => {
    try {
      const res = await API.get(`/upvotes/question/${question._id}/users`);
      setUpvoters(res.data?.data || []);
    } catch {
      setUpvoters([]);
    }
  };

  useEffect(() => {
    let mounted = true;

    API.get(`/upvotes/question/${question._id}/users`)
      .then((res) => {
        if (mounted) setUpvoters(res.data?.data || []);
      })
      .catch(() => {
        if (mounted) setUpvoters([]);
      });

    return () => {
      mounted = false;
    };
  }, [question._id]);

  const likedByText = (() => {
    if (upvoters.length === 0) return "Be the first to like this";
    const firstUsername = upvoters[0]?.username || "user";
    if (upvoters.length === 1) return `@${firstUsername}`;
    return `@${firstUsername} and ${upvoters.length - 1} others`;
  })();

  const fetchAnswers = async () => {
    try {
      setAnswersLoading(true);
      const res = await API.get(`/answers/${question._id}`);
      setAnswers(res.data?.data || []);
    } finally {
      setAnswersLoading(false);
    }
  };

  const handleToggleAnswers = () => {
    const nextOpen = !answersOpen;
    setAnswersOpen(nextOpen);
    if (nextOpen) fetchAnswers();
  };

  const handleAnswerSubmit = async (event) => {
    event.preventDefault();
    if (!answerText.trim()) return;

    try {
      setAnswering(true);
      const res = await API.post(`/answers/${question._id}`, {
        content: answerText,
      });
      const answer = {
        ...res.data.data,
        answeredBy: {
          _id: user?._id,
          username: user?.username,
          fullName: user?.fullName,
          avatar: user?.avatar,
        },
      };
      setAnswers((currentAnswers) => [answer, ...currentAnswers]);
      setAnswerText("");
    } finally {
      setAnswering(false);
    }
  };

  return (
    <article className="soft-card mx-auto w-full max-w-4xl p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-sky-100">
            {owner?.avatar ? (
              <img
                src={owner.avatar}
                alt={owner.fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="font-semibold text-sky-700">
                {(owner?.fullName || owner?.username || "?")
                  .charAt(0)
                  .toUpperCase()}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-950">
              {owner?.fullName || "Student"}
            </p>
            <p className="truncate text-xs text-slate-600">
              @{owner?.username || "student"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-2xl border border-indigo-200 bg-white/60 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:-translate-y-0.5 hover:border-indigo-400 hover:bg-indigo-50 hover:shadow-md hover:shadow-indigo-200/40"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <p className="rounded-2xl bg-white/65 p-4 text-sm font-medium leading-6 text-slate-900">
          {question.description}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between border-t border-white/70 pt-3">
        <div className="flex flex-wrap items-center justify-end">
          <UpvoteButton
            type="question"
            id={question._id}
            label="Like"
            onCountClick={() => setShowUpvoters(true)}
            onChanged={fetchUpvoters}
          />
          <button
            type="button"
            onClick={handleToggleAnswers}
            className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-white"
          >
            <MessageSquareText size={14} />
            {answersOpen ? "Hide answers" : `Answer (${answers.length})`}
          </button>
          
        </div>
        <button
            type="button"
            onClick={() => setShowUpvoters(true)}
            className="mt-4 w-full rounded-2xl bg-white/55 px-4 py-3 text-left text-sm font-semibold text-slate-800 hover:bg-white"
          >
            {likedByText}
          </button>
      </div>

      {answersOpen && (
        <div className="mt-5 space-y-3 border-t border-white/70 pt-4">
          {answersLoading ? (
            <p className="rounded-2xl bg-white/65 p-3 text-sm font-medium text-slate-800">
              Loading answers...
            </p>
          ) : answers.length === 0 ? (
            <p className="rounded-2xl bg-white/65 p-3 text-sm font-medium text-slate-800">
              No answers yet. Be the first to answer.
            </p>
          ) : (
            answers.map((answer) => (
              <div key={answer._id} className="rounded-2xl bg-white/70 p-3">
                <p className="break-words text-sm font-medium text-slate-800">
                  {answer.content}
                </p>
                <p className="mt-2 text-xs font-semibold text-slate-600">
                  Answered by @{answer.answeredBy?.username || "user"}
                </p>
              </div>
            ))
          )}

          <form
            onSubmit={handleAnswerSubmit}
            className="space-y-3 rounded-2xl bg-white/55 p-3"
          >
            <textarea
              value={answerText}
              onChange={(event) => setAnswerText(event.target.value)}
              placeholder="Write your answer..."
              className="app-input min-h-24"
            />
            <div className="flex justify-end">
              <LoadingButton
                type="submit"
                loading={answering}
                disabled={!answerText.trim()}
                className="app-button"
              >
                <Send size={16} />
                Post answer
              </LoadingButton>
            </div>
          </form>
        </div>
      )}

      {showUpvoters && (
        <UpvotersList
          type="question"
          id={question._id}
          onClose={() => setShowUpvoters(false)}
        />
      )}
    </article>
  );
}
