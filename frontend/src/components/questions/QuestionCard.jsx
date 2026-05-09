import { Image, MessageSquareText, MoreHorizontal, Send, ThumbsUp, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import LoadingButton from "../ui/LoadingButton";
import UpvotersList from "../upvote/UpvotersList";
import { timeAgo } from "../../utils/timeAgo";

const initialsFor = (user) => {
  const source = user?.fullName || user?.username || "U";
  return source
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

function Avatar({ user, className = "h-11 w-11" }) {
  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.fullName || user.username || "User"}
        className={`${className} shrink-0 rounded-full object-cover`}
      />
    );
  }

  return (
    <div className={`${className} flex shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700`}>
      {initialsFor(user)}
    </div>
  );
}

function QnaLikeAction({ type, id }) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showUpvoters, setShowUpvoters] = useState(false);

  const loadLikers = useCallback(async (mounted = true) => {
    try {
      const res = await API.get(`/upvotes/${type}/${id}/users`);
      const users = res.data?.data || [];
      if (!mounted) return;
      setCount(users.length);
      setLiked(users.some((likedUser) => likedUser._id === user?._id));
    } catch {
      if (!mounted) return;
      setCount(0);
      setLiked(false);
    }
  }, [id, type, user?._id]);

  useEffect(() => {
    let mounted = true;
    loadLikers(mounted);
    return () => {
      mounted = false;
    };
  }, [loadLikers]);

  const handleToggle = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post(`/upvotes/${type}/${id}/toggle`);
      setLiked(res.status === 201);
      await loadLikers(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="inline-flex items-center gap-2">
        <button
          type="button"
          onClick={handleToggle}
          disabled={loading}
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition disabled:opacity-60 ${
            liked
              ? "border-indigo-200 bg-indigo-50 text-indigo-700"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          <ThumbsUp size={14} className={liked ? "fill-current text-indigo-700" : ""} />
          Like
        </button>
        <button
          type="button"
          onClick={() => setShowUpvoters(true)}
          className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-indigo-700"
        >
          {count} {count === 1 ? "like" : "likes"}
        </button>
      </div>

      {showUpvoters && (
        <UpvotersList
          type={type}
          id={id}
          onClose={() => setShowUpvoters(false)}
        />
      )}
    </>
  );
}

function TagPill({ tag }) {
  const cleanTag = String(tag || "").replace(/^#/, "");

  return (
    <span className="rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-[11px] font-semibold text-indigo-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50">
      #{cleanTag}
    </span>
  );
}

function AnswerCard({ answer }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
      <div className="flex items-center gap-3">
        <Avatar user={answer.answeredBy} className="h-9 w-9" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-950">
            {answer.answeredBy?.fullName || answer.answeredBy?.username || "Student"}
          </p>
          <p className="text-xs text-slate-500">
            @{answer.answeredBy?.username || "user"} - {timeAgo(answer.createdAt)}
          </p>
        </div>
      </div>

      {answer.content && (
        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
          {answer.content}
        </p>
      )}

      {answer.imageUrl && (
        <img
          src={answer.imageUrl}
          alt="Answer attachment"
          className="mt-3 max-h-[420px] w-full rounded-2xl object-cover"
        />
      )}

      <div className="mt-4">
        <QnaLikeAction type="answer" id={answer._id} />
      </div>
    </div>
  );
}

export default function QuestionCard({ question }) {
  const [answersOpen, setAnswersOpen] = useState(false);
  const [answers, setAnswers] = useState(question.answers || []);
  const [answersLoading, setAnswersLoading] = useState(false);
  const [answerText, setAnswerText] = useState("");
  const [answerImage, setAnswerImage] = useState(null);
  const [answering, setAnswering] = useState(false);
  const owner = question.askedBy;
  const tags = question.tags?.length ? question.tags : ["qna"];

  useEffect(() => {
    setAnswers(question.answers || []);
  }, [question.answers]);

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
    if (!answerText.trim() && !answerImage) return;

    const formData = new FormData();
    formData.append("content", answerText);
    if (answerImage) formData.append("image", answerImage);

    try {
      setAnswering(true);
      const res = await API.post(`/answers/${question._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAnswers((currentAnswers) => [res.data.data, ...currentAnswers]);
      setAnswerText("");
      setAnswerImage(null);
    } finally {
      setAnswering(false);
    }
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar user={owner} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-950">
              {owner?.fullName || owner?.username || "Student"}
            </p>
            <p className="truncate text-xs text-slate-500">
              @{owner?.username || "student"} - {timeAgo(question.createdAt)}
            </p>
          </div>
        </div>
        <button
          type="button"
          className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Question options"
        >
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-2 sm:float-right sm:ml-4">
        {tags.map((tag) => (
          <TagPill key={tag} tag={tag} />
        ))}
      </div>

      <div className="mt-5 space-y-3">
        <h2 className="font-poppins text-lg font-semibold leading-7 text-slate-950">
          {question.title || "Untitled question"}
        </h2>
        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
          {question.description}
        </p>
      </div>

      {question.imageUrl && (
        <img
          src={question.imageUrl}
          alt="Question attachment"
          className="mt-4 max-h-[520px] w-full rounded-2xl object-cover"
        />
      )}

      <div className="clear-both mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
        <QnaLikeAction type="question" id={question._id} />
        <button
          type="button"
          onClick={handleToggleAnswers}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <MessageSquareText size={14} />
          {answersOpen ? "Hide answers" : `Answer (${answers.length})`}
        </button>
      </div>

      {answersOpen && (
        <div className="mt-5 space-y-4 border-t border-slate-100 pt-4">
          {answersLoading ? (
            <p className="rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-600">
              Loading answers...
            </p>
          ) : answers.length === 0 ? (
            <p className="rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-600">
              No answers yet. Be the first to answer.
            </p>
          ) : (
            answers.map((answer) => <AnswerCard key={answer._id} answer={answer} />)
          )}

          <form
            onSubmit={handleAnswerSubmit}
            className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
          >
            <textarea
              value={answerText}
              onChange={(event) => setAnswerText(event.target.value)}
              placeholder="Write your answer..."
              className="app-input min-h-24"
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="app-button-secondary max-w-full cursor-pointer py-2">
                <Image size={16} />
                <span className="truncate">{answerImage ? answerImage.name : "Add image"}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => setAnswerImage(event.target.files?.[0] || null)}
                />
              </label>
              {answerImage && (
                <button
                  type="button"
                  onClick={() => setAnswerImage(null)}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-white hover:text-slate-800"
                >
                  <X size={14} />
                  Remove image
                </button>
              )}
              <LoadingButton
                type="submit"
                loading={answering}
                disabled={!answerText.trim() && !answerImage}
                className="inline-flex min-w-0 items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={16} />
                Post answer
              </LoadingButton>
            </div>
          </form>
        </div>
      )}
    </article>
  );
}
