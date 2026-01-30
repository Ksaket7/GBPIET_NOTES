import Reveal from "../common/Reveal";

export default function NotesPreview() {
  return (
    <section className="max-w-7xl mx-auto px-5 py-20">
      <Reveal>
        <h2 className="font-poppins text-3xl font-semibold text-center mb-10">
        Sample Notes
      </h2>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["DSA", "Operating Systems", "DBMS"].map((subject) => (
          <div
            key={subject}
            className="bg-surface p-5 rounded-xl border border-borderSoft"
          >
            <Reveal>
              <h3 className="font-poppins text-lg font-semibold">
              {subject}
            </h3>
            <p className="font-inter text-sm text-textSecondary mt-2">
              Semester-wise curated notes.
            </p>
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}
