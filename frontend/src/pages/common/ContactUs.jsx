import { useState } from "react";
import API from "../../services/api";

export default function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/contact", form);

      alert(res.data.message);

      // optional reset
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-5 py-10 pt-20">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>

      <p className="text-gray-600 mb-6">
        Found a bug? Something not working? Let us know 👇
      </p>

      {/* ✅ attach onSubmit here */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your Name"
          className="w-full p-3 border rounded-lg"
        />

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Your Email"
          className="w-full p-3 border rounded-lg"
        />

        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Describe your issue..."
          className="w-full p-3 border rounded-lg h-32"
        />

        {/* ✅ button type submit */}
        <button
          type="submit"
          className="bg-primary text-white px-6 py-3 rounded-lg hover:opacity-90"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}