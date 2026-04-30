import { createElement } from "react";
import { Link } from "react-router-dom";
import { BookOpen, HelpCircle, Sparkles, UploadCloud } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="app-page">
      <div className="app-shell space-y-6">
        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[24px] bg-gradient-to-br from-slate-950 to-indigo-700 p-5 text-white sm:rounded-[28px] sm:p-8">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
              GBPIET Notes
            </span>
            <h1 className="mt-6 max-w-2xl break-words font-poppins text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              A calm academic dashboard for notes and doubts
            </h1>
            <p className="mt-5 max-w-xl text-sm text-white/75">
              Browse resources, ask questions, upload study material, and continue learning from one soft workspace.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup" className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950">
                Get started
              </Link>
              <Link to="/notes" className="rounded-2xl bg-white/15 px-5 py-3 text-sm font-semibold text-white">
                Browse notes
              </Link>
            </div>
          </div>

          <div className="glass-panel p-4 sm:p-6">
            <h2 className="font-poppins text-2xl font-semibold text-slate-950">
              What you can do
            </h2>
            <div className="mt-5 space-y-3">
              {[
                [BookOpen, "Find notes", "Search notes, PYQs, assignments, and tutorials."],
                [HelpCircle, "Solve doubts", "Ask and answer questions with the community."],
                [UploadCloud, "Share material", "Faculty and CR users can upload resources."],
                [Sparkles, "Use AI help", "Open note AI for quick explanations."],
              ].map(([icon, title, text]) => (
                <div key={title} className="flex gap-3 rounded-2xl bg-white/65 p-3 sm:rounded-3xl sm:p-4">
                  <span className="rounded-2xl bg-indigo-100 p-3 text-indigo-600">
                    {createElement(icon, { size: 20 })}
                  </span>
                  <div>
                    <p className="font-semibold text-slate-950">{title}</p>
                    <p className="mt-1 text-sm text-slate-500">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
