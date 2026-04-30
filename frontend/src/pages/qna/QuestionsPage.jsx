import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus, X } from "lucide-react";
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

  return (
    <main className="app-page">
      <div className="app-shell space-y-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="pill">Discussion</span>
            <h1 className="page-title mt-3">Questions</h1>
            <p className="page-subtitle">
              Browse student doubts and answers in one focused workspace.
            </p>
          </div>
          {isAuthenticated && (
            <button
              type="button"
              onClick={() => setShowQuestionForm((value) => !value)}
              className="app-button w-full md:w-auto"
            >
              {showQuestionForm ? <X size={16} /> : <Plus size={16} />}
              {showQuestionForm ? "Close form" : "Ask question"}
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

        <QuestionsFilters filters={filters} setSearchParams={setSearchParams} />
        <QuestionsList loading={loading} questions={questions} />

        {pagination && (
          <QuestionsPagination
            pagination={pagination}
            onPageChange={(page) => setSearchParams({ ...filters, page })}
          />
        )}
      </div>
    </main>
  );
}
