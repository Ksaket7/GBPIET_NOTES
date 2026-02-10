import { Routes, Route } from "react-router-dom";
import Layout from "./components/common/Layout";
import AuthLayout from "./components/common/AuthLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotesPage from "./pages/NotesPage";
import NoteDetailPage from "./pages/NoteDetailPage";
import NoteAIPage from "./pages/NoteAIPage";
import Loader from "./components/common/Loader";
import { useAuth } from "./context/AuthContext";
import UploadNote from "./pages/UploadNote";
import UploadQuestion from "./pages/UploadQuestion";
import QuestionDetail from "./pages/QuestionDetail";
import QuestionsPage from "./pages/QuestionsPage";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <Loader message="Checking your session…" />;
  }
  return (
    <Routes>
      {/* Routes WITHOUT header & footer (optional) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>
      {/* Routes WITH header & footer */}
      {/* Layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />

        <Route
          path="/notes"
          element={
            // <ProtectedRoute>
            <NotesPage />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/notes/:noteId"
          element={
            <ProtectedRoute>
              <NoteDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes/:noteId/ai"
          element={
            <ProtectedRoute>
              <NoteAIPage />
            </ProtectedRoute>
          }
        />

        {/* Protected */}
        <Route
          path="/notes/upload"
          element={
            <ProtectedRoute>
              <UploadNote />
            </ProtectedRoute>
          }
        />
        <Route
          path="/questions/upload"
          element={
            <ProtectedRoute>
              <UploadQuestion />
            </ProtectedRoute>
          }
        />
        <Route
          path="/questions"
          element={
            <ProtectedRoute>
            <QuestionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/questions/:questionId"
          element={
            <ProtectedRoute>
              <QuestionDetail />
            </ProtectedRoute>
          }
        />
        {/*
        <Route
          path="/questions"
          element={
            <ProtectedRoute>
              <QuestionsPage />
            </ProtectedRoute>
          }
        /> */}
      </Route>
    </Routes>
  );
}

export default App;
