export default function SuggestedPrompts({ setMessages }) {
  const prompts = [
    "Summarize this note",
    "Explain this in simple terms",
    "What are the important points?",
    "Give revision notes",
  ];

  const handlePrompt = (text) => {
    setMessages((prev) => [
      ...prev,
      { role: "user", content: text },
      {
        role: "ai",
        content:
          "🤖 AI response will appear here once backend is connected.",
      },
    ]);
  };

  return (
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
  );
}
