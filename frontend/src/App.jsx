import { Routes, Route } from "react-router-dom";
import Layout from "./components/common/Layout";
import AuthLayout from "./components/common/AuthLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotesPage from "./pages/NotesPage";
import NoteDetailPage from "./pages/NoteDetailPage";

function App() {
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
        <Route path="/notes/:noteId" element={<NoteDetailPage />} />

        {/* Protected */}
        {/*<Route
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
        /> */}
      </Route>
    </Routes>
  );
}

export default App;
