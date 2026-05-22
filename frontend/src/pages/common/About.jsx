import { createElement } from "react";
import {
  BookOpen,
  Bot,
  CheckCircle2,
  Cloud,
  GraduationCap,
  Layers3,
  Shield,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

const featureCards = [
  {
    icon: BookOpen,
    title: "Organized Study Material",
    text: "Students can upload, browse, open, download, like, and discuss notes in one focused academic space.",
  },
  {
    icon: Users,
    title: "Community Learning",
    text: "Posts, followers, comments, likes, and profile pages help students discover active contributors.",
  },
  {
    icon: GraduationCap,
    title: "Question & Answer Hub",
    text: "Students can ask doubts with tags and images, then view answers directly inside the question cards.",
  },
  {
    icon: Bot,
    title: "AI Study Assistant",
    text: "The chatbot supports note analysis, explanations, references, summaries, and study-focused conversations.",
  },
  {
    icon: Shield,
    title: "Role Aware Access",
    text: "Upload flows and protected pages respect authenticated users and permission-based workflows.",
  },
  {
    icon: Cloud,
    title: "Cloud File Storage",
    text: "Notes, covers, avatars, post images, and Q&A attachments are stored and served from cloud storage.",
  },
];

const stats = [
  ["Notes", "Shared academic resources"],
  ["Q&A", "Focused doubt solving"],
  ["Posts", "Community updates"],
  ["AI", "Study support"],
];

const roadmap = [
  "Improve profile editing and public identity controls",
  "Enhance advanced AI chatbot retrieval with stronger references",
  "Polish settings, notifications, moderation, and analytics",
  "Keep tightening responsive UI consistency across every page",
];

function FeatureCard({ icon, title, text }) {
  return (
    <article className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-xl shadow-slate-500/10 backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-500/15 sm:p-6">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 shadow-sm">
        {createElement(icon, { size: 22 })}
      </span>
      <h2 className="mt-5 font-poppins text-lg font-semibold text-slate-950">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
    </article>
  );
}

export default function About() {
  return (
    <main className="app-page">
      <div className="app-shell space-y-6">
        <header>
          <h1 className="page-title">About Us</h1>
        </header>

        <section className="overflow-hidden rounded-[32px] border border-white/70 bg-white/85 shadow-xl shadow-slate-500/10 backdrop-blur">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="p-6 sm:p-8 lg:p-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-700">
                <Sparkles size={14} />
                GBPIET Notes
              </span>
              <h2 className="mt-5 max-w-3xl font-poppins text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
                A smarter academic community for notes, doubts, and student collaboration.
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-500 sm:text-base">
                GBPIET Notes brings study material, community posts, Q&A, profiles,
                leaderboards, and AI help into one clean workspace built around the
                way college students actually learn together.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  "Built for GBPIET students",
                  "Responsive across mobile and desktop",
                  "Contributor-focused learning culture",
                  "Clean SaaS-style academic dashboard",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm font-semibold text-slate-700"
                  >
                    <CheckCircle2 size={17} className="shrink-0 text-indigo-600" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <aside className="border-t border-slate-100 bg-gradient-to-br from-indigo-600 to-violet-600 p-6 text-white sm:p-8 lg:border-l lg:border-t-0">
              <div className="rounded-[28px] border border-white/15 bg-white/10 p-5 backdrop-blur">
                <Target size={28} />
                <h2 className="mt-5 font-poppins text-2xl font-semibold">
                  Our Mission
                </h2>
                <p className="mt-3 text-sm leading-7 text-white/80">
                  Make useful study material easier to find, reward original
                  contributors, and help students solve doubts faster with community
                  knowledge and AI assistance.
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {stats.map(([value, label]) => (
                  <div
                    key={value}
                    className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur"
                  >
                    <p className="font-poppins text-xl font-semibold">{value}</p>
                    <p className="mt-1 text-xs leading-5 text-white/70">{label}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featureCards.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-xl shadow-slate-500/10 backdrop-blur sm:p-6">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
              <Layers3 size={22} />
            </span>
            <h2 className="mt-5 font-poppins text-2xl font-semibold text-slate-950">
              What Makes It Different
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              The platform connects real academic content with real student identity:
              notes, questions, answers, posts, likes, followers, credits, profile
              pages, and leaderboard activity all work together instead of living in
              scattered groups and drives.
            </p>
          </article>

          <article className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-xl shadow-slate-500/10 backdrop-blur sm:p-6">
            <h2 className="font-poppins text-2xl font-semibold text-slate-950">
              What We Are Improving Next
            </h2>
            <div className="mt-5 space-y-3">
              {roadmap.map((item) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-sm font-medium leading-6 text-slate-600"
                >
                  <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-600" />
                  {item}
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
