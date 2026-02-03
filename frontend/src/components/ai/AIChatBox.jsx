import { useState } from "react";

export default function AIChatBox({ noteId, messages, setMessages }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // 🔮 MOCK AI RESPONSE (backend later)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content:
            "🤖 This is a mock AI response. Backend will replace this.",
        },
      ]);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="border border-borderSoft rounded-lg p-4 space-y-4">
      <div className="h-80 overflow-y-auto space-y-3">
        {messages.length === 0 && (
          <p className="text-textSecondary font-inter text-sm">
            Ask something to get started.
          </p>
        )}

        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`p-3 rounded max-w-[80%] font-inter text-sm ${
              m.role === "user"
                ? "bg-primary text-white ml-auto"
                : "bg-borderSoft text-textPrimary"
            }`}
          >
            {m.content}
          </div>
        ))}

        {loading && (
          <p className="font-inter text-sm text-textSecondary">
            AI is thinking...
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 border border-borderSoft rounded px-3 py-2
                     font-inter focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <button
          onClick={handleSend}
          disabled={loading}
          className="px-4 py-2 bg-primary text-white rounded
                     hover:bg-primaryDark transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
