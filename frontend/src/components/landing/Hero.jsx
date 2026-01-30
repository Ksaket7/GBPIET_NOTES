import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-5 py-24 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="font-poppins text-4xl md:text-5xl font-semibold text-textPrimary"
      >
        One Platform for <span className="text-primary">Notes</span>,{" "}
        <span className="text-primary">Doubts</span> & Learning
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="font-inter mt-6 text-lg text-textSecondary max-w-3xl mx-auto"
      >
        Access semester-wise notes, ask questions, and collaborate with peers.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex justify-center gap-4 mt-10"
      >
        <Link
          to="/signup"
          className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primaryDark transition"
        >
          Create Account
        </Link>

        <Link
          to="/notes"
          className="px-8 py-3 border border-borderSoft text-primary rounded-lg hover:bg-primary hover:text-white"
        >
          Browse Notes
        </Link>
      </motion.div>
    </section>
  );
}
