import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MessageSquareText, Plus, TrendingUp, UsersRound } from "lucide-react";
import API from "../../services/api";
import QuestionsFilters from "../../components/questions/QuestionsFilters";
import QuestionsList from "../../components/questions/QuestionsList";
import QuestionsPagination from "../../components/questions/QuestionsPagination";
import UploadQuestionForm from "../../components/upload/UploadQuestion";
import { useAuth } from "../../context/AuthContext";
import FormModal from "../../components/ui/FormModal";

export default function QuestionsPage() {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [questions, setQuestions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  const filters = useMemo(() => ({
    page: Number(searchParams.get("page")) || 1,
    limit: 10,
    query: searchParams.get("query") || "",
    subjectCode: searchParams.get("subjectCode") || "",
  }), [searchParams]);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/questions", { params: filters });
      setQuestions(res.data.data.questions);
      setPagination(res.data.data.pagination);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const trendingTags = useMemo(() => {
    const counts = new Map();
    questions.forEach((question) => {
      (question.tags || []).forEach((tag) => {
        const cleanTag = String(tag).replace(/^#/, "");
        counts.set(cleanTag, (counts.get(cleanTag) || 0) + 1);
      });
    });

    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag]) => tag);
  }, [questions]);

  const answeredCount = questions.filter((question) => (question.answers || []).length > 0).length;
  const resolvedPercent = questions.length
    ? Math.round((answeredCount / questions.length) * 100)
    : 0;

  return (
    <main className="app-page">
      <div className="mx-auto w-full max-w-6xl">
        <section className="rounded-[28px] border border-white/70 bg-white/45 p-4 shadow-2xl shadow-slate-500/15 backdrop-blur-2xl sm:p-6 md:p-8">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wide text-indigo-700">
                Discussion
              </span>
              <h1 className="mt-2 font-poppins text-4xl font-semibold tracking-tight text-slate-950 max-sm:text-2xl">
                Questions
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Browse student doubts and answers in one focused workspace.
              </p>
            </div>
            {isAuthenticated && (
              <button
                type="button"
                onClick={() => setShowQuestionForm(true)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-300 transition hover:bg-indigo-700"
              >
                <Plus size={16} />
                Ask question
              </button>
            )}
          </header>

          {isAuthenticated && showQuestionForm && (
            <FormModal title="Ask question" onClose={() => setShowQuestionForm(false)}>
              <UploadQuestionForm
                onCreated={() => {
                  setShowQuestionForm(false);
                  fetchQuestions();
                }}
              />
            </FormModal>
          )}

          <div className="mt-6 space-y-5">
            <QuestionsFilters filters={filters} setSearchParams={setSearchParams} />
            <QuestionsList loading={loading} questions={questions} />
          </div>

          {pagination && (
            <QuestionsPagination
              pagination={pagination}
              onPageChange={(page) => setSearchParams({ ...filters, page })}
            />
          )}
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/70 bg-white/75 p-5 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
              <TrendingUp size={17} className="text-indigo-600" />
              Trending Topics
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {(trendingTags.length ? trendingTags : ["DBMS", "OS", "Java", "Python"]).map((tag) => (
                <span key={tag} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/70 bg-white/75 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                  <UsersRound size={17} className="text-indigo-600" />
                  Community Health
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  {questions.length} active discussions right now
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-indigo-700">{resolvedPercent}%</p>
                <p className="text-xs text-slate-500">Answered</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {isAuthenticated && (
        <button
          type="button"
          onClick={() => setShowQuestionForm(true)}
          className="fixed bottom-5 right-5 z-30 inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-xl shadow-indigo-300 transition hover:bg-indigo-700 sm:hidden"
          aria-label="Ask question"
        >
          <MessageSquareText size={20} />
        </button>
      )}
    </main>
  );
}
