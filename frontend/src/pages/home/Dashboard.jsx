import { createElement, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileQuestion,
  GraduationCap,
  Library,
  MessageSquareText,
  Plus,
  Search,
  Sparkles,
  UploadCloud,
  UsersRound,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";

const weekBars = [1.1, 2.6, 2.1, 4, 2.2, 2.5, 1.9];
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const isFacultyWorkspace = (role) =>
  role === "faculty" || role === "cr" || role === "admin";

function Metric({ icon, label, value, accent = "bg-indigo-600" }) {
  return (
    <div className="soft-card p-4">
      <div className="flex items-center gap-3">
        <span className={`rounded-2xl p-2 text-white ${accent}`}>
          {createElement(icon, { size: 17 })}
        </span>
        <div>
          <p className="text-xs text-slate-500">{label}</p>
          <p className="font-semibold text-slate-950">{value}</p>
        </div>
      </div>
    </div>
  );
}

function ActivityChart() {
  return (
    <section className="glass-panel p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-poppins text-xl font-semibold text-slate-950">
          My activity
        </h2>
        <button className="text-xs font-semibold text-slate-500">See all</button>
      </div>
      <div className="flex h-36 items-end gap-4">
        {weekBars.map((bar, index) => (
          <div key={weekDays[index]} className="flex flex-1 flex-col items-center gap-2">
            <div
              className={`w-full max-w-8 rounded-full ${
                index === 3
                  ? "bg-gradient-to-t from-indigo-600 to-violet-400"
                  : "bg-white/80"
              }`}
              style={{ height: `${bar * 28}px` }}
            />
            <span className="text-xs text-slate-400">{weekDays[index]}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ActionCard({ icon, title, detail, onClick, active }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-3xl p-4 text-left transition ${
        active
          ? "bg-indigo-600 text-white shadow-xl shadow-indigo-500/25"
          : "bg-white/65 text-slate-900 hover:bg-white"
      }`}
    >
      <span className="flex items-center gap-3">
        <span className={`rounded-2xl p-2 ${active ? "bg-white/15" : "bg-slate-100 text-indigo-600"}`}>
          {createElement(icon, { size: 18 })}
        </span>
        <span>
          <span className="block text-sm font-semibold">{title}</span>
          <span className={`mt-1 block text-xs ${active ? "text-white/75" : "text-slate-500"}`}>
            {detail}
          </span>
        </span>
      </span>
      <ChevronRight size={17} />
    </button>
  );
}

function ListPanel({ title, items, emptyText, onOpen, meta }) {
  return (
    <section className="glass-panel p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-poppins text-lg font-semibold text-slate-950">
          {title}
        </h2>
        <button className="rounded-full bg-white/70 p-2 text-slate-700">
          <Plus size={17} />
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-slate-500">{emptyText}</p>
      ) : (
        <div className="space-y-3">
          {items.slice(0, 5).map((item) => (
            <button
              key={item._id}
              type="button"
              onClick={() => onOpen(item)}
              className="flex w-full items-center justify-between rounded-2xl bg-white/65 p-3 text-left hover:bg-white"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-slate-950">
                  {item.title || item.description}
                </span>
                <span className="mt-1 block truncate text-xs text-slate-500">
                  {meta(item)}
                </span>
              </span>
              <ChevronRight size={16} className="shrink-0 text-slate-400" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function StudentDashboard({ notes, questions, loading }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <main className="app-page">
      <div className="app-shell">
        <div className="grid gap-6 xl:grid-cols-[1fr_330px]">
          <div className="space-y-6">
            <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-slate-500">Welcome back</p>
                <h1 className="page-title">{user?.fullName || user?.username}</h1>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Metric icon={BookOpen} label="Notes" value={loading ? "..." : notes.length} />
                <Metric icon={FileQuestion} label="Doubts" value={loading ? "..." : questions.length} accent="bg-sky-500" />
                <Metric icon={Sparkles} label="Credits" value={user?.credits || 0} accent="bg-amber-500" />
              </div>
            </header>

            <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
              <ActivityChart />
              <section className="space-y-3">
                <ActionCard icon={Search} title="Browse notes" detail="Find subject material" active onClick={() => navigate("/notes")} />
                <ActionCard icon={MessageSquareText} title="Ask question" detail="Post a doubt" onClick={() => navigate("/upload")} />
              </section>
            </div>

            <section className="glass-panel p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-poppins text-xl font-semibold text-slate-950">
                  Popular courses
                </h2>
                <span className="pill">All subjects</span>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {notes.slice(0, 3).map((note) => (
                  <button
                    key={note._id}
                    onClick={() => navigate(`/notes/${note._id}`)}
                    className="soft-card min-h-32 p-4 text-left"
                  >
                    <span className="pill">{note.subjectCode || "Notes"}</span>
                    <p className="mt-7 line-clamp-2 text-sm font-semibold text-slate-950">
                      {note.title}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">{note.type}</p>
                  </button>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl bg-gradient-to-br from-indigo-600 to-sky-500 p-5 text-white shadow-xl shadow-indigo-500/25">
              <p className="text-sm font-semibold">Study focus</p>
              <h2 className="mt-3 font-poppins text-2xl">Build your week</h2>
              <button onClick={() => navigate("/notes")} className="mt-5 rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold">
                Start learning
              </button>
            </section>
            <ListPanel
              title="My courses"
              items={notes}
              emptyText="No notes available yet."
              onOpen={(note) => navigate(`/notes/${note._id}`)}
              meta={(note) => `${note.subjectCode || "Subject"} - ${note.type || "Material"}`}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}

function FacultyDashboard({ notes, questions, loading }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const pendingQuestions = questions.filter((q) => (q.answers || []).length === 0).length;

  return (
    <main className="app-page">
      <div className="app-shell">
        <div className="grid gap-6 xl:grid-cols-[1fr_350px]">
          <div className="space-y-6">
            <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-slate-500">Faculty workspace</p>
                <h1 className="page-title">{user?.fullName || user?.username}</h1>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Metric icon={UploadCloud} label="Uploads" value={loading ? "..." : notes.length} />
                <Metric icon={FileQuestion} label="Queue" value={loading ? "..." : questions.length} accent="bg-sky-500" />
                <Metric icon={CheckCircle2} label="Pending" value={loading ? "..." : pendingQuestions} accent="bg-rose-500" />
                <Metric icon={UsersRound} label="Score" value={user?.reputation || user?.credits || 0} accent="bg-amber-500" />
              </div>
            </header>

            <div className="grid gap-6 lg:grid-cols-[1fr_270px]">
              <ActivityChart />
              <section className="space-y-3">
                <ActionCard icon={UploadCloud} title="Upload material" detail="Share class resources" active onClick={() => navigate("/upload")} />
                <ActionCard icon={MessageSquareText} title="Answer doubts" detail="Open question queue" onClick={() => navigate("/questions")} />
              </section>
            </div>

            <ListPanel
              title="Student questions"
              items={questions}
              emptyText="No student questions yet."
              onOpen={(question) => navigate(`/questions/${question._id}`)}
              meta={(question) => `Asked by ${question.askedBy?.fullName || "student"}`}
            />
          </div>

          <aside className="space-y-6">
            <section className="rounded-3xl bg-gradient-to-br from-slate-950 to-indigo-700 p-5 text-white shadow-xl shadow-slate-500/25">
              <Clock3 size={20} />
              <h2 className="mt-4 font-poppins text-2xl">Today’s academic work</h2>
              <p className="mt-2 text-sm text-white/70">Review new doubts and keep material fresh.</p>
            </section>
            <ListPanel
              title="Recent materials"
              items={notes}
              emptyText="No materials uploaded yet."
              onOpen={(note) => navigate(`/notes/${note._id}`)}
              meta={(note) => `${note.subjectCode || "Subject"} - ${note.uploadedBy?.fullName || "faculty"}`}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadDashboardData = async () => {
      try {
        const [notesRes, questionsRes] = await Promise.all([
          API.get("/notes?limit=6&sortBy=createdAt&sortType=desc"),
          API.get("/questions?limit=6&sortBy=createdAt&sortType=desc"),
        ]);

        if (!mounted) return;
        setNotes(notesRes.data?.data?.notes || []);
        setQuestions(questionsRes.data?.data?.questions || []);
      } catch {
        if (!mounted) return;
        setNotes([]);
        setQuestions([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadDashboardData();

    return () => {
      mounted = false;
    };
  }, []);

  const facultyView = useMemo(() => isFacultyWorkspace(user?.role), [user?.role]);

  if (facultyView) {
    return <FacultyDashboard notes={notes} questions={questions} loading={loading} />;
  }

  return <StudentDashboard notes={notes} questions={questions} loading={loading} />;
}
