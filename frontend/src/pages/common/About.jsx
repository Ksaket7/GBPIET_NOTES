import {
  BookOpen,
  Users,
  Shield,
  Cloud,
  Bot,
} from "lucide-react";

export default function About() {
  return (
    <div className="max-w-6xl mx-auto px-5 py-12 pt-20">

      {/* HERO */}
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold mb-4 text-primary">
          GBPIET Notes
        </h1>
        <p className="text-textSecondary max-w-2xl mx-auto">
          A modern student-driven platform to share, discover, and manage
          academic resources efficiently and collaboratively.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 text-center mb-14">
        <div className="p-4 rounded-xl hover:bg-primary/10 transition">
          <h3 className="text-3xl font-bold text-primary">100+</h3>
          <p className="text-textSecondary text-sm">Notes</p>
        </div>
        <div className="p-4 rounded-xl hover:bg-primary/10 transition">
          <h3 className="text-3xl font-bold text-primary">50+</h3>
          <p className="text-textSecondary text-sm">Users</p>
        </div>
        <div className="p-4 rounded-xl hover:bg-primary/10 transition">
          <h3 className="text-3xl font-bold text-primary">200+</h3>
          <p className="text-textSecondary text-sm">Downloads</p>
        </div>
      </div>

      {/* FEATURES */}
      <div className="grid md:grid-cols-3 gap-6 mb-14">

        <div className="p-6 bg-background rounded-2xl border border-borderSoft shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300 cursor-pointer">
          <BookOpen className="mb-3 text-primary" />
          <h3 className="font-semibold mb-2">Smart notes sharing</h3>
          <p className="text-sm text-textSecondary">
            Upload, organize, and access notes easily with structured metadata.
          </p>
        </div>

        <div className="p-6 bg-background rounded-2xl border border-borderSoft shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300 cursor-pointer">
          <Users className="mb-3 text-primary" />
          <h3 className="font-semibold mb-2">Collaborative learning</h3>
          <p className="text-sm text-textSecondary">
            Help peers and benefit from community-driven contributions.
          </p>
        </div>

        <div className="p-6 bg-background rounded-2xl border border-borderSoft shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300 cursor-pointer">
          <Shield className="mb-3 text-primary" />
          <h3 className="font-semibold mb-2">Secure access</h3>
          <p className="text-sm text-textSecondary">
            JWT-based authentication ensures safe and protected access.
          </p>
        </div>
      </div>

      {/* TECH STACK */}
      <div className="grid md:grid-cols-2 gap-8 mb-14">

        <div className="bg-background p-6 rounded-2xl border border-borderSoft shadow-sm hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-3 text-primary">
            Frontend
          </h2>
          <p className="text-textSecondary">
            Built with React and Tailwind CSS, the interface is fast,
            responsive, and user-friendly. It uses component-based architecture
            and React Router for smooth navigation.
          </p>
        </div>

        <div className="bg-background p-6 rounded-2xl border border-borderSoft shadow-sm hover:shadow-md transition">
          <h2 className="text-xl font-semibold mb-3 text-primary">
            Backend
          </h2>
          <p className="text-textSecondary">
            Developed using Node.js, Express, and MongoDB. It handles secure
            authentication, note management, and API operations with proper
            middleware and validation.
          </p>
        </div>
      </div>

      {/* EXTRA FEATURES */}
      <div className="grid md:grid-cols-2 gap-8 mb-14">

        <div className="flex gap-4 items-start p-4 rounded-xl hover:bg-primary/10 transition">
          <Cloud className="text-primary mt-1" />
          <div>
            <h3 className="font-semibold">Cloud storage</h3>
            <p className="text-textSecondary text-sm">
              Notes and avatars are stored using Supabase for fast and reliable access.
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-start p-4 rounded-xl hover:bg-primary/10 transition">
          <Bot className="text-primary mt-1" />
          <div>
            <h3 className="font-semibold">AI chatbot</h3>
            <p className="text-textSecondary text-sm">
              Get instant help, explanations, and platform guidance through an integrated AI assistant.
            </p>
          </div>
        </div>
      </div>

      {/* VISION */}
      <div className="bg-primary/10 p-8 rounded-2xl border border-borderSoft hover:shadow-md transition">
        <h2 className="text-2xl font-semibold mb-3 text-primary">
          Our vision
        </h2>
        <p className="text-textSecondary">
          We aim to build a centralized academic ecosystem where students can
          easily access high-quality study material, collaborate, and grow together.
        </p>
      </div>
    </div>
  );
}