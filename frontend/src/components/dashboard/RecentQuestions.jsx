import Reveal from "../common/Reveal";

export default function RecentQuestions() {
  const questions = [
    "What is deadlock in Operating Systems?",
    "Difference between stack and queue?",
    "Explain 2NF and 3NF in DBMS",
  ];

  return (
    <section>
      <Reveal>
        <h2 className="font-poppins text-xl font-semibold text-textPrimary mb-4">
          Recent Questions
        </h2>
      </Reveal>

      <div className="space-y-3">
        {questions.map((q, i) => (
          <Reveal key={q} delay={i * 0.1}>
            <div className="bg-surface border border-borderSoft rounded-lg p-4">
              <p className="font-inter text-textPrimary">{q}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
