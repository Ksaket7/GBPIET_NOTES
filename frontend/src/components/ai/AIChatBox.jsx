import { useState, useEffect, useRef } from "react";

export default function AIChatBox({ noteId, messages, setMessages }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // 🔽 Auto-scroll on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      role: "user",
      content: input,
      createdAt: new Date().toISOString(),
    };

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
          createdAt: new Date().toISOString(),
        },
      ]);
      setLoading(false);
    }, 800);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="border border-borderSoft rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="font-poppins text-lg text-textPrimary">
          AI Conversation
        </h3>

        <button
          onClick={clearChat}
          className="text-sm font-inter text-red-500 hover:underline"
        >
          Clear chat
        </button>
      </div>

      {/* Messages */}
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
            <p>{m.content}</p>

            <p className="mt-1 text-xs opacity-70">
              {new Date(m.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        ))}

        {loading && (
          <p className="font-inter text-sm text-textSecondary">
            AI is thinking...
          </p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          disabled={loading}
          className="flex-1 border border-borderSoft rounded px-3 py-2
                     font-inter focus:outline-none focus:ring-2 focus:ring-primary"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <button
          onClick={handleSend}
          disabled={loading}
          className="px-4 py-2 bg-primary text-white rounded
                     hover:bg-primaryDark transition disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
