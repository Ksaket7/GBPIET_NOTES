import { useEffect, useState } from "react";
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

  const filters = {
    page: Number(searchParams.get("page")) || 1,
    limit: 10,
    query: searchParams.get("query") || "",
    subjectCode: searchParams.get("subjectCode") || "",
  };

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
  }, [searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-5 py-10 space-y-6 pt-20">
      <h1 className="text-3xl font-poppins text-textPrimary">
        Questions
      </h1>

      <QuestionsFilters
        filters={filters}
        setSearchParams={setSearchParams}
      />

      <QuestionsList loading={loading} questions={questions} />

      {pagination && (
        <QuestionsPagination
          pagination={pagination}
          onPageChange={(page) => {
            setSearchParams({
              ...filters,
              page,
            });
          }}
        />
      )}
    </div>
  );
}