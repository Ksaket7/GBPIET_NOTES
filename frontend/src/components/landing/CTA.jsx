import { Link } from "react-router-dom";
import Reveal from "../common/Reveal";

export default function CTA() {
  return (
    <section className="bg-primary text-white py-16 text-center">
      <Reveal>
        <h2 className="font-poppins text-3xl font-semibold">
          Ready to Learn Smarter?
        </h2>
      </Reveal>

      <Reveal>
        <p className="font-inter mt-4 text-white/90">
        Join GBPIET Notes and start collaborating today.
      </p>

      <Link
        to="/signup"
        className="inline-block mt-8 bg-white text-primary px-8 py-3 rounded-lg hover:bg-white/90 transition"
      >
        Sign Up Now
      </Link>
      </Reveal>
    </section>
  );
}
