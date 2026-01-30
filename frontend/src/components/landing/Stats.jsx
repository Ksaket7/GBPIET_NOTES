import Reveal from "../common/Reveal";

export default function Stats() {
  const stats = [
    { label: "Notes Available", value: "500+" },
    { label: "Questions Asked", value: "300+" },
    { label: "Active Students", value: "200+" },
    { label: "Branches Covered", value: "6" },
  ];

  return (
    <section className="bg-surface border-y border-borderSoft py-16">
      <div className="max-w-7xl mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((item, i) => (
          <Reveal key={item.label} delay={i * 0.1}>
            <div>
              <p className="font-poppins text-3xl text-primary font-semibold">
                {item.value}
              </p>
              <p className="font-inter text-textSecondary">
                {item.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
