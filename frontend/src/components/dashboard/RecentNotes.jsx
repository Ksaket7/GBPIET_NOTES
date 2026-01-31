import Reveal from "../common/Reveal";

export default function RecentNotes() {
  const notes = [
    { title: "Operating Systems – Unit 2", subject: "OS" },
    { title: "DBMS Normalization", subject: "DBMS" },
    { title: "Data Structures – Trees", subject: "DSA" },
  ];

  return (
    <section>
      <Reveal>
        <h2 className="font-poppins text-xl font-semibold text-textPrimary mb-4">
          Recent Notes
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {notes.map((note, i) => (
          <Reveal key={note.title} delay={i * 0.1}>
            <div className="bg-surface border border-borderSoft rounded-lg p-4">
              <p className="font-inter text-textPrimary font-medium">
                {note.title}
              </p>
              <p className="font-inter text-sm text-textSecondary mt-1">
                {note.subject}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
