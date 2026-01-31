import Reveal from "../common/Reveal";

export default function WelcomeBanner() {
  return (
    <Reveal>
      <div className="bg-surface border border-borderSoft rounded-xl p-6">
        <h1 className="font-poppins text-2xl font-semibold text-textPrimary">
          Welcome back 👋
        </h1>

        <p className="font-inter mt-2 text-textSecondary">
          Continue learning, explore notes, or help others by answering questions.
        </p>
      </div>
    </Reveal>
  );
}
