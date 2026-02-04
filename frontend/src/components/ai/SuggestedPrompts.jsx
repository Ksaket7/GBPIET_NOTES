const PROMPTS_BY_TYPE = {
  notes: [
    "Summarize this note",
    "Explain this topic in simple terms",
    "What are the important points?",
    "Give quick revision notes",
  ],

  pyqs: [
    "Explain how to approach these questions",
    "Which questions are most important?",
    "Give model answers or hints",
    "Identify repeated topics",
  ],

  assignments: [
    "Explain the problem statement",
    "Give hints to solve this assignment",
    "What concepts are required?",
    "Explain step-by-step solution approach",
  ],

  tuts: [
    "Explain each step clearly",
    "Why is this method used?",
    "Give similar practice problems",
    "Explain common mistakes",
  ],
};

export default function SuggestedPrompts({ noteType, setMessages }) {
  const prompts = PROMPTS_BY_TYPE[noteType] || PROMPTS_BY_TYPE.notes;

  const handlePrompt = (text) => {
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: text,
        createdAt: new Date().toISOString(),
      },
      {
        role: "ai",
        content: "🤖 AI response will appear here once backend is connected.",
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  return (
    <div className="space-y-2">
      <p className="font-inter text-sm text-textSecondary">
        Suggested questions
      </p>

      <div className="flex flex-wrap gap-2">
        {prompts.map((p) => (
          <button
            key={p}
            onClick={() => handlePrompt(p)}
            className="px-3 py-1 border border-borderSoft rounded
                       font-inter text-sm hover:bg-borderSoft transition"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
