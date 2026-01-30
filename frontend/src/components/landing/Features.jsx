import Reveal from "../common/Reveal";

export default function Features() {
  const features = [
    {
      title: "Notes Library",
      desc: "Well-organized notes by branch, semester, and subject.",
      icon: "📘",
    },
    {
      title: "Q&A Community",
      desc: "Ask doubts and get answers from fellow students.",
      icon: "❓",
    },
    {
      title: "Upload Resources",
      desc: "Contribute notes and study material for others.",
      icon: "⬆️",
    },
    {
      title: "Smart Help",
      desc: "AI-powered assistance (coming soon).",
      icon: "🤖",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-5 py-20">
      {/* Section Heading */}
      <Reveal>
        <h2 className="font-poppins text-3xl font-semibold text-center mb-14 text-textPrimary">
          Features
        </h2>
      </Reveal>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((f, index) => (
          <Reveal key={f.title} delay={index * 0.1}>
            <div
              className="bg-surface p-6 rounded-xl border border-borderSoft
                         hover:shadow-md transition"
            >
              <h3 className="font-poppins text-xl font-semibold text-textPrimary">
                {f.icon} {f.title}
              </h3>

              <p className="font-inter mt-3 text-textSecondary">
                {f.desc}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
