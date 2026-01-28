import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-5 py-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Text Section */}
        <div>
          <h1 className="font-poppins text-4xl md:text-5xl font-semibold text-textPrimary leading-tight">
            Find Notes. Ask Questions. <br /> Learn Faster.
          </h1>

          <p className="font-inter mt-5 text-textSecondary text-lg">
            A dedicated academic platform for GBPIET students to access notes,
            share knowledge, and collaborate effortlessly.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 mt-8">
            <Link
              to="/notes"
              className="font-inter px-6 py-3 bg-primary text-white rounded-lg hover:bg-primaryDark transition"
            >
              Browse Notes
            </Link>

            <Link
              to="/signup"
              className="font-inter px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Illustration */}
        <div className="hidden md:flex justify-center">
          <img
            src="https://cdn3d.iconscout.com/3d/premium/thumb/student-studying-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--learning-exam-reading-education-pack-people-illustrations-9337655.png"
            alt="Student studying"
            className="w-4/5"
          />
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="max-w-7xl mx-auto px-5 pb-20">
        <h2 className="font-poppins text-3xl font-semibold text-textPrimary text-center mb-10">
          Why Choose GBPIET Notes?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature */}
          <div className="bg-surface p-6 rounded-xl shadow-sm border border-borderSoft hover:shadow-lg transition">
            <h3 className="font-poppins text-xl text-primary font-semibold">
              📘 Notes Library
            </h3>
            <p className="font-inter mt-3 text-textSecondary">
              Access high-quality notes for every semester and subject.
            </p>
          </div>

          <div className="bg-surface p-6 rounded-xl shadow-sm border border-borderSoft hover:shadow-lg transition">
            <h3 className="font-poppins text-xl text-primary font-semibold">
              ❓ Q&A Community
            </h3>
            <p className="font-inter mt-3 text-textSecondary">
              Ask doubts and get answers from fellow students.
            </p>
          </div>

          <div className="bg-surface p-6 rounded-xl shadow-sm border border-borderSoft hover:shadow-lg transition">
            <h3 className="font-poppins text-xl text-primary font-semibold">
              👤 Personal Dashboard
            </h3>
            <p className="font-inter mt-3 text-textSecondary">
              Manage your uploads, answers, and profile easily.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
