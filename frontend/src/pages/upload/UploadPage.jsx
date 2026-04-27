import { useState } from "react";
import { FileQuestion, UploadCloud } from "lucide-react";
import UploadNoteForm from "../../components/upload/UploadNote";
import UploadQuestionForm from "../../components/upload/UploadQuestion";
import { useAuth } from "../../context/AuthContext";

const UploadPage = () => {
  const { user } = useAuth();
  const role = user?.role;
  const canUploadNotes = role === "cr" || role === "faculty" || role === "admin";
  const [activeForm, setActiveForm] = useState(canUploadNotes ? "notes" : "questions");

  return (
    <main className="app-page">
      <div className="app-shell space-y-6">
        <header>
          <span className="pill">Create</span>
          <h1 className="page-title mt-3">Upload workspace</h1>
          <p className="page-subtitle">
            Add academic material or ask a focused question from the same soft panel.
          </p>
        </header>

        <div className="grid gap-3 md:grid-cols-2">
          {canUploadNotes && (
            <button
              type="button"
              onClick={() => setActiveForm("notes")}
              className={`rounded-3xl p-5 text-left transition ${
                activeForm === "notes"
                  ? "bg-indigo-600 text-white shadow-xl shadow-indigo-500/25"
                  : "bg-white/65 text-slate-900 hover:bg-white"
              }`}
            >
              <UploadCloud size={22} />
              <span className="mt-4 block font-poppins text-xl">Upload Note</span>
              <span className="mt-1 block text-sm opacity-75">Notes, PYQs, tutorials, assignments</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveForm("questions")}
            className={`rounded-3xl p-5 text-left transition ${
              activeForm === "questions"
                ? "bg-indigo-600 text-white shadow-xl shadow-indigo-500/25"
                : "bg-white/65 text-slate-900 hover:bg-white"
            }`}
          >
            <FileQuestion size={22} />
            <span className="mt-4 block font-poppins text-xl">Ask Question</span>
            <span className="mt-1 block text-sm opacity-75">Post a doubt for peers and faculty</span>
          </button>
        </div>

        {canUploadNotes && activeForm === "notes" && <UploadNoteForm />}
        {activeForm === "questions" && <UploadQuestionForm />}
      </div>
    </main>
  );
};

export default UploadPage;
