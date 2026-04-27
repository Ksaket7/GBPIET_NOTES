import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../../services/api";
import QuestionsFilters from "../../components/questions/QuestionsFilters";
import QuestionsList from "../../components/questions/QuestionsList";
import QuestionsPagination from "../../components/questions/QuestionsPagination";

export default function QuestionsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [questions, setQuestions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);

  const filters = useMemo(() => ({
    page: Number(searchParams.get("page")) || 1,
    limit: 10,
    query: searchParams.get("query") || "",
    subjectCode: searchParams.get("subjectCode") || "",
  }), [searchParams]);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const res = await API.get("/questions", { params: filters });
        setQuestions(res.data.data.questions);
        setPagination(res.data.data.pagination);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [filters]);

  return (
    <main className="app-page">
      <div className="app-shell space-y-6">
        <header>
          <span className="pill">Discussion</span>
          <h1 className="page-title mt-3">Questions</h1>
          <p className="page-subtitle">
            Browse student doubts and answers in one focused workspace.
          </p>
        </header>

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
