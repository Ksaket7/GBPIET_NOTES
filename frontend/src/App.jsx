import { Routes, Route } from "react-router-dom";
import Layout from "./components/common/Layout";
import AuthLayout from "./components/common/AuthLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Home from "./pages/home/Home";
import LoginPage from "./pages/common/LoginPage";
import SignupPage from "./pages/common/SignupPage";
import CompleteProfilePage from "./pages/common/CompleteProfilePage";
import NotesPage from "./pages/notes/NotesPage";
import PostsPage from "./pages/posts/PostsPage";
import NoteDetailPage from "./pages/notes/NoteDetailPage";
import AIChatbotPage from "./pages/ai/AIChatbotPage";
import Loader from "./components/common/Loader";
import { useAuth } from "./context/AuthContext";
import QuestionsPage from "./pages/qna/QuestionsPage";
import ContactUs from "./pages/common/ContactUs";
import Settings from "./pages/user/Settings";
import UsersPage from "./pages/user/UsersPage";
import LeaderboardPage from "./pages/user/LeaderboardPage";
import StudentProfilePage from "./pages/user/StudentProfilePage";
import About from "./pages/common/About";
import ScrollToTop from "./components/common/ScrollToTop";

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <Loader message="Checking your session…" />;
  }
  return (
    <>
      <ScrollToTop/>
      <Routes>
        {/* Routes WITHOUT header & footer (optional) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/complete-profile"
            element={
              <ProtectedRoute>
                <CompleteProfilePage />
              </ProtectedRoute>
            }
          />
        </Route>
        {/* Routes WITH header & footer */}
        {/* Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />

          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <NotesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts"
            element={
              <ProtectedRoute>
                <PostsPage />
              </ProtectedRoute>
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
            path="/ai-chatbot"
            element={
              <ProtectedRoute>
                <AIChatbotPage />
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
            path="/contact"
            element={
              <ProtectedRoute>
                <ContactUs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:username"
            element={
              <ProtectedRoute>
                <StudentProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <LeaderboardPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
