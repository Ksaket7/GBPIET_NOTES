import { useEffect, useRef, useState } from "react";

export default function AIChatBox({ messages, setMessages }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

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

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "This is a mock AI response. Backend will replace this.",
          createdAt: new Date().toISOString(),
        },
      ]);
      setLoading(false);
    }, 800);
  };

  return (
    <section className="glass-panel responsive-panel space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-poppins text-lg font-semibold text-slate-950">
          AI Conversation
        </h3>
        <button onClick={() => setMessages([])} className="text-sm font-semibold text-red-500">
          Clear chat
        </button>
      </div>

      <div className="h-[min(22rem,55vh)] space-y-3 overflow-y-auto rounded-2xl bg-white/45 p-3 sm:rounded-3xl sm:p-4">
        {messages.length === 0 && (
          <p className="text-sm text-slate-500">Ask something to get started.</p>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`max-w-[92%] break-words rounded-2xl p-3 text-sm sm:max-w-[80%] sm:rounded-3xl ${
              message.role === "user"
                ? "ml-auto bg-indigo-600 text-white"
                : "bg-white text-slate-700"
            }`}
          >
            <p>{message.content}</p>
            <p className="mt-1 text-xs opacity-70">
              {new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        ))}

        {loading && <p className="text-sm text-slate-500">AI is thinking...</p>}
        <div ref={bottomRef} />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask a question..."
          disabled={loading}
          className="app-input"
          onKeyDown={(event) => event.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} disabled={loading} className="app-button">
          Send
        </button>
      </div>
    </section>
  );
}
