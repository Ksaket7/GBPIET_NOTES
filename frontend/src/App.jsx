import { Routes, Route } from "react-router-dom";
import Layout from "./components/common/Layout";
import AuthLayout from "./components/common/AuthLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Home from "./pages/home/Home";
import LoginPage from "./pages/common/LoginPage";
import SignupPage from "./pages/common/SignupPage";
import NotesPage from "./pages/notes/NotesPage";
import NoteDetailPage from "./pages/notes/NoteDetailPage";
import NoteAIPage from "./pages/notes/NoteAIPage";
import Loader from "./components/common/Loader";
import { useAuth } from "./context/AuthContext";
import UploadNote from "./pages/upload/UploadNote";
import UploadQuestion from "./components/upload/UploadQuestion";
import QuestionDetail from "./pages/qna/QuestionDetail";
import QuestionsPage from "./pages/qna/QuestionsPage";
import UploadPage from "./pages/upload/UploadPage";
import ContactUs from "./pages/common/ContactUs";

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
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadPage />
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
        
        <Route
          path="/contact"
          element={
            <ProtectedRoute>
              <ContactUs />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
