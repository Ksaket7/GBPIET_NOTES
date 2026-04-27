import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="app-page">
      <div className="app-shell rounded-[32px] bg-gradient-to-br from-slate-950 to-indigo-700 p-8 text-white">
        <h1 className="max-w-3xl font-poppins text-5xl font-semibold">
          One platform for notes, doubts, and learning
        </h1>
        <p className="mt-5 max-w-2xl text-sm text-white/75">
          Access semester-wise notes, ask questions, and collaborate with peers.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/signup" className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950">
            Create Account
          </Link>
          <Link to="/notes" className="rounded-2xl bg-white/15 px-5 py-3 text-sm font-semibold text-white">
            Browse Notes
          </Link>
        </div>
      </div>
    </section>
  );
}
