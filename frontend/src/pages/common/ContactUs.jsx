import { createElement, useState } from "react";
import { Bug, LifeBuoy, Mail, MessageSquareText, Send, Sparkles } from "lucide-react";
import API from "../../services/api";
import { useToast } from "../../context/ToastContext";

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      const res = await API.post("/contact", form);
      showToast(res.data.message || "Message sent successfully.", "success");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error(error);
      showToast("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-page">
      <div className="app-shell space-y-6">
        <header>
          <h1 className="page-title">Contact Us</h1>
        </header>

        <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <section className="overflow-hidden rounded-[28px] border border-white/70 bg-white/85 shadow-xl shadow-slate-500/10 backdrop-blur">
            <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-sky-500 p-6 text-white sm:p-8">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                <Sparkles size={14} />
                We read every message
              </span>
              <h2 className="mt-5 break-words font-poppins text-3xl font-semibold sm:text-4xl">
                Help us keep the academic workspace useful.
              </h2>
              <p className="mt-4 text-sm leading-6 text-white/75">
                Bugs, broken links, missing material, confusing UI, or feature ideas all belong here.
              </p>
            </div>

            <div className="grid gap-3 p-5 sm:p-6">
              {[
                [Bug, "Report a bug", "Broken pages, upload issues, login errors, or unexpected behavior."],
                [LifeBuoy, "Ask for help", "Tell us where you got stuck and what you were trying to do."],
                [MessageSquareText, "Share feedback", "Suggest UI changes, missing features, or better workflows."],
              ].map(([icon, title, text]) => (
                <div key={title} className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
                    {createElement(icon, { size: 18 })}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-950">{title}</h3>
                    <p className="mt-1 text-sm leading-5 text-slate-500">{text}</p>
                  </div>
                </div>
              ))}
            </div>
        </section>

          <form onSubmit={handleSubmit} className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-xl shadow-slate-500/10 backdrop-blur sm:p-6">
            <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
              <span className="rounded-2xl bg-indigo-600 p-3 text-white shadow-lg shadow-indigo-200">
                <Mail size={20} />
              </span>
              <div>
                <h2 className="font-poppins text-2xl font-semibold text-slate-950">
                  Send a message
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Add enough detail so we can understand and fix it quickly.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700">Name</span>
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your Name" className="app-input" required />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700">Email</span>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Your Email" className="app-input" required />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-slate-700">Message</span>
                <textarea name="message" value={form.message} onChange={handleChange} placeholder="Describe your issue..." className="app-input min-h-40" required />
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              <Send size={16} />
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
