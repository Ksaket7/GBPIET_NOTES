import { useState } from "react";
import API from "../../services/api";

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await API.post("/contact", form);
      alert(res.data.message);
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <main className="app-page">
      <div className="app-shell grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-[28px] bg-gradient-to-br from-indigo-600 to-sky-500 p-7 text-white">
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
            Contact
          </span>
          <h1 className="mt-5 font-poppins text-4xl font-semibold">
            Tell us what needs attention
          </h1>
          <p className="mt-4 text-sm text-white/75">
            Bugs, broken links, missing material, or feedback for the academic workspace.
          </p>
        </section>

        <form onSubmit={handleSubmit} className="glass-panel space-y-4 p-6">
          <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your Name" className="app-input" />
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Your Email" className="app-input" />
          <textarea name="message" value={form.message} onChange={handleChange} placeholder="Describe your issue..." className="app-input min-h-36" />
          <button type="submit" className="app-button">Send Message</button>
        </form>
      </div>
    </main>
  );
}
