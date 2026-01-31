import { Link } from "react-router-dom";
import Reveal from "../common/Reveal";

export default function QuickActions() {
  const actions = [
    { label: "Browse Notes", to: "/notes" },
    { label: "Ask a Question", to: "/questions" },
    { label: "Upload Notes", to: "/upload" },
  ];

  return (
    <Reveal>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions.map((a) => (
          <Link
            key={a.label}
            to={a.to}
            className="bg-surface border border-borderSoft rounded-xl p-5
                       text-center font-inter text-textPrimary
                       hover:border-primary hover:text-primary transition"
          >
            {a.label}
          </Link>
        ))}
      </div>
    </Reveal>
  );
}
