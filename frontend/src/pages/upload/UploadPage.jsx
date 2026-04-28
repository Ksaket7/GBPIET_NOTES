import { useState } from "react";
import { FileQuestion, MessageSquarePlus, Sparkles, UploadCloud } from "lucide-react";
import UploadNoteForm from "../../components/upload/UploadNote";
import UploadQuestionForm from "../../components/upload/UploadQuestion";
import PostComposer from "../../components/posts/PostComposer";
import { useAuth } from "../../context/AuthContext";

const UploadPage = () => {
  const { user } = useAuth();
  const role = user?.role;
  const canUploadNotes = role === "cr" || role === "faculty" || role === "admin";
  const [activeForm, setActiveForm] = useState("post");

  return (
    <main className="app-page">
      <div className="app-shell space-y-6">
        <header className="grid gap-5 rounded-[28px] bg-gradient-to-br from-slate-950 to-indigo-700 p-6 text-white lg:grid-cols-[1fr_280px]">
          <div>
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
              Create
            </span>
            <h1 className="mt-4 font-poppins text-4xl font-semibold">
              Upload workspace
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-white/75">
              Share an update, publish academic material, or ask a clear question from one focused place.
            </p>
          </div>
          <div className="rounded-3xl bg-white/10 p-4">
            <Sparkles size={22} />
            <p className="mt-3 text-sm font-semibold">Tip</p>
            <p className="mt-1 text-xs text-white/70">
              Good descriptions make notes and posts easier to discover in the latest feed.
            </p>
          </div>
        </header>

        <div className="grid gap-3 md:grid-cols-3">
          <button
            type="button"
            onClick={() => setActiveForm("post")}
            className={`rounded-3xl p-5 text-left transition ${
              activeForm === "post"
                ? "bg-indigo-600 text-white shadow-xl shadow-indigo-500/25"
                : "bg-white/65 text-slate-900 hover:bg-white"
            }`}
          >
            <MessageSquarePlus size={22} />
            <span className="mt-4 block font-poppins text-xl">Create Post</span>
            <span className="mt-1 block text-sm opacity-75">
              Text, image, or both
            </span>
          </button>

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

        {activeForm === "post" && <PostComposer />}
        {canUploadNotes && activeForm === "notes" && <UploadNoteForm />}
        {activeForm === "questions" && <UploadQuestionForm />}
      </div>
    </main>
  );
};

export default UploadPage;
