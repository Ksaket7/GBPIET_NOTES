import { createElement } from "react";
import { BookOpen, Bot, Cloud, Shield, Users } from "lucide-react";

const features = [
  { icon: BookOpen, title: "Smart notes sharing", text: "Upload and discover academic resources with structured metadata." },
  { icon: Users, title: "Collaborative learning", text: "Students and faculty work together through notes and Q&A." },
  { icon: Shield, title: "Secure access", text: "Role-aware flows keep important actions in the right hands." },
  { icon: Cloud, title: "Cloud storage", text: "Study material stays available through hosted file storage." },
  { icon: Bot, title: "AI support", text: "Open a note and ask for explanations when you need help." },
];

export default function About() {
  return (
    <main className="app-page">
      <div className="app-shell space-y-8">
        <section className="rounded-[24px] bg-gradient-to-br from-slate-950 to-indigo-700 p-5 text-white sm:rounded-[28px] sm:p-8">
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
            About
          </span>
          <h1 className="mt-5 break-words font-poppins text-3xl font-semibold sm:text-4xl">
            GBPIET Notes
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-white/75">
            A student-driven academic workspace for notes, doubts, resources, and faculty guidance.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {[
            ["100+", "Notes"],
            ["50+", "Users"],
            ["200+", "Downloads"],
          ].map(([value, label]) => (
            <div key={label} className="soft-card p-5 text-center">
              <p className="font-poppins text-3xl font-semibold text-indigo-700">{value}</p>
              <p className="mt-1 text-sm text-slate-500">{label}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {features.map(({ icon, title, text }) => (
            <div key={title} className="soft-card p-4 sm:p-6">
              {createElement(icon, { className: "text-indigo-600" })}
              <h3 className="mt-4 font-semibold text-slate-950">{title}</h3>
              <p className="mt-2 text-sm text-slate-500">{text}</p>
            </div>
          ))}
        </section>

        <section className="glass-panel responsive-panel">
          <h2 className="font-poppins text-2xl font-semibold text-slate-950">
            Our vision
          </h2>
          <p className="mt-3 text-slate-500">
            To build a centralized academic ecosystem where students can access high-quality study material, collaborate, and grow together.
          </p>
        </section>
      </div>
    </main>
  );
}
