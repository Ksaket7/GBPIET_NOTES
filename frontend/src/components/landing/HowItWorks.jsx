import Reveal from "../common/Reveal";
export default function HowItWorks() {
  const steps = [
    "Create a free account",
    "Browse or upload notes",
    "Ask questions & help others",
    "Learn faster together",
  ];

  return (
    <section className="bg-surface border-y border-borderSoft py-20">
      <Reveal>
        <h2 className="font-poppins text-3xl font-semibold text-center mb-14">
        How It Works
      </h2>
      </Reveal>

      <div className="max-w-4xl mx-auto px-5 grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
        {steps.map((step, i) => (
          <div key={i}>
            <Reveal>
               <div className="mx-auto mb-4 w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white">
              {i + 1}
            </div>
            <p className="font-inter text-textSecondary">
              {step}
            </p>
           </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}
