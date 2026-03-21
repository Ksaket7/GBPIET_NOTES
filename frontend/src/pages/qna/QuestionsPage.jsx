import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";
import Loader from "../../components/common/Loader";
import LoadingButton from "../../components/ui/LoadingButton";
import QuestionCard from "../../components/questions/QuestionCard";

export default function QuestionsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/questions")
      .then((res) => setQuestions(res.data.data.questions))
      .catch(() => setQuestions([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader message="Loading questions…" />;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 pt-20">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="font-poppins text-3xl text-textPrimary">
          Questions
        </h1>

        {user && (
          <LoadingButton
            onClick={() => navigate("/questions/upload")}
            className="px-4 py-2 bg-primary text-white rounded"
          >
            Ask Question
          </LoadingButton>
        )}
      </div>

      {/* Questions */}
      {questions.length === 0 ? (
        <p className="font-inter text-textSecondary">
          No questions asked yet.
        </p>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <QuestionCard
              key={q._id}
              question={q}
              onClick={() => navigate(`/questions/${q._id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
