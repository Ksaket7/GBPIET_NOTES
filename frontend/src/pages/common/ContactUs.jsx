export default function ContactUs() {
  return (
    <div className="max-w-4xl mx-auto px-5 py-10 pt-16">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>

      <p className="text-gray-600 mb-6">
        Found a bug? Something not working? Let us know 👇
      </p>

      <form className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full p-3 border rounded-lg"
        />

        <input
          type="email"
          placeholder="Your Email"
          className="w-full p-3 border rounded-lg"
        />

        <textarea
          placeholder="Describe your issue..."
          className="w-full p-3 border rounded-lg h-32"
        />

        <button className="bg-primary text-white px-6 py-3 rounded-lg">
          Send Message
        </button>
      </form>
    </div>
  );
}