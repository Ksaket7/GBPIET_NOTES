import Reveal from "../common/Reveal";
export default function QnaPreview() {
  return (
    <section className="bg-surface border-y border-borderSoft py-20">
      <Reveal>
         <h2 className="font-poppins text-3xl font-semibold text-center mb-10">
        Recent Questions
      </h2>
      </Reveal>

      <div className="max-w-3xl mx-auto px-5 space-y-4">
        {[
          "What is deadlock in OS?",
          "Difference between stack and queue?",
          "Explain normalization in DBMS",
        ].map((q) => (
          <div
            key={q}
            className="bg-background p-4 rounded-lg border border-borderSoft"
          >
            <Reveal>
              <p className="font-inter text-textPrimary">{q}</p>
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}
