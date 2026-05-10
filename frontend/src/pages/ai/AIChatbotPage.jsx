import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bot,
  Clock3,
  FileText,
  Image,
  Link as LinkIcon,
  Loader2,
  MessageSquareText,
  Paperclip,
  Plus,
  Send,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const starterPrompts = [
  "Summarize this note in exam-friendly points.",
  "Explain this diagram step by step.",
  "Make important questions from this material.",
  "Give me references to study this topic.",
];

const initialAssistantMessage = {
  role: "assistant",
  content:
    "Hi, I am your GBPIET AI study assistant. Upload a PDF, image, handwritten note, or ask a question directly.",
};

const makeSessionId = () =>
  window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;

const makeInitialMessages = () => [{ ...initialAssistantMessage }];

const createChatSession = () => ({
  id: makeSessionId(),
  title: "New study chat",
  messages: makeInitialMessages(),
  updatedAt: Date.now(),
});

const buildSessionTitle = (messages) => {
  const firstUserMessage = messages.find((message) => message.role === "user");
  if (!firstUserMessage?.content) return "New study chat";

  return firstUserMessage.content
    .replace(/\n\nAttached:.*/s, "")
    .trim()
    .slice(0, 54);
};

const formatSessionTime = (timestamp) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));

function ChatBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[78%] ${
          isUser
            ? "bg-indigo-600 text-white"
            : "border border-slate-200 bg-white text-slate-700"
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        {!isUser && message.sources?.length > 0 && (
          <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
            <p className="text-xs font-semibold uppercase text-slate-400">
              References
            </p>
            {message.sources.map((source) => (
              <a
                key={source.url}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-2 rounded-xl bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
              >
                <LinkIcon size={14} className="mt-0.5 shrink-0" />
                <span className="min-w-0 break-words">{source.title || source.url}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function HistoryPanel({ activeSessionId, onDeleteSession, onSelectSession, sessions }) {
  if (sessions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white/80 p-4 text-sm text-slate-500">
        Your saved chats will appear here.
      </div>
    );
  }

  return (
    <div className="max-h-[360px] space-y-2 overflow-y-auto pr-1">
      {sessions.map((session) => {
        const isActive = session.id === activeSessionId;

        return (
          <div
            key={session.id}
            className={`group flex items-start gap-3 rounded-2xl border p-3 text-left transition ${
              isActive
                ? "border-indigo-200 bg-indigo-50 shadow-sm"
                : "border-slate-200 bg-white hover:border-indigo-100 hover:bg-slate-50"
            }`}
          >
            <button
              type="button"
              onClick={() => onSelectSession(session.id)}
              className="min-w-0 flex-1 text-left"
            >
              <p className="truncate text-sm font-semibold text-slate-900">
                {session.title || "New study chat"}
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                <Clock3 size={12} />
                {formatSessionTime(session.updatedAt)}
              </p>
            </button>
            <button
              type="button"
              onClick={() => onDeleteSession(session.id)}
              className="rounded-xl p-2 text-slate-400 opacity-100 transition hover:bg-red-50 hover:text-red-600 sm:opacity-0 sm:group-hover:opacity-100"
              aria-label="Delete chat"
            >
              <Trash2 size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function FileChip({ file, onRemove }) {
  const isPdf = file.type === "application/pdf";

  return (
    <div className="flex min-w-0 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600">
      {isPdf ? (
        <FileText size={15} className="shrink-0 text-indigo-600" />
      ) : (
        <Image size={15} className="shrink-0 text-indigo-600" />
      )}
      <span className="truncate">{file.name}</span>
      <button
        type="button"
        onClick={onRemove}
        className="shrink-0 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        aria-label={`Remove ${file.name}`}
      >
        <X size={13} />
      </button>
    </div>
  );
}

export default function AIChatbotPage() {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState("");
  const [messages, setMessages] = useState(makeInitialMessages);
  const [input, setInput] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  const storageKey = useMemo(
    () =>
      `gbpiet-ai-chat-history:${
        user?._id || user?.id || user?.username || "current-user"
      }`,
    [user?._id, user?.id, user?.username],
  );

  useEffect(() => {
    try {
      const storedSessions = JSON.parse(localStorage.getItem(storageKey) || "[]")
        .filter((session) => session?.id && Array.isArray(session.messages))
        .map((session) => ({
          ...session,
          title: session.title || buildSessionTitle(session.messages),
          updatedAt: session.updatedAt || Date.now(),
        }));

      if (storedSessions.length > 0) {
        setSessions(storedSessions);
        setActiveSessionId(storedSessions[0].id);
        setMessages(storedSessions[0].messages);
        return;
      }
    } catch {
      localStorage.removeItem(storageKey);
    }

    const starterSession = createChatSession();
    setSessions([starterSession]);
    setActiveSessionId(starterSession.id);
    setMessages(starterSession.messages);
  }, [storageKey]);

  useEffect(() => {
    if (sessions.length === 0) return;
    localStorage.setItem(storageKey, JSON.stringify(sessions.slice(0, 20)));
  }, [sessions, storageKey]);

  const historyForApi = useMemo(
    () =>
      messages
        .filter((message) => !message.pending)
        .slice(-8)
        .map((message) => ({
          role: message.role,
          content: message.content,
        })),
    [messages],
  );

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles((currentFiles) => [...currentFiles, ...selectedFiles].slice(0, 4));
    event.target.value = "";
  };

  const commitMessages = (updater) => {
    setMessages((currentMessages) => {
      const nextMessages =
        typeof updater === "function" ? updater(currentMessages) : updater;
      const savedMessages = nextMessages.filter((message) => !message.pending);

      if (activeSessionId) {
        setSessions((currentSessions) =>
          currentSessions.map((session) =>
            session.id === activeSessionId
              ? {
                  ...session,
                  title: buildSessionTitle(savedMessages),
                  messages: savedMessages,
                  updatedAt: Date.now(),
                }
              : session,
          ),
        );
      }

      return nextMessages;
    });
  };

  const handleNewChat = () => {
    const nextSession = createChatSession();
    setSessions((currentSessions) => [nextSession, ...currentSessions].slice(0, 20));
    setActiveSessionId(nextSession.id);
    setMessages(nextSession.messages);
    setInput("");
    setFiles([]);
    setErrorMessage("");
  };

  const handleSelectSession = (sessionId) => {
    const selectedSession = sessions.find((session) => session.id === sessionId);
    if (!selectedSession) return;

    setActiveSessionId(sessionId);
    setMessages(selectedSession.messages);
    setInput("");
    setFiles([]);
    setErrorMessage("");
    setShowHistory(false);
  };

  const handleDeleteSession = (sessionId) => {
    setSessions((currentSessions) => {
      const remainingSessions = currentSessions.filter(
        (session) => session.id !== sessionId,
      );

      if (sessionId === activeSessionId) {
        const nextSession = remainingSessions[0] || createChatSession();
        setActiveSessionId(nextSession.id);
        setMessages(nextSession.messages);
        setInput("");
        setFiles([]);
        setErrorMessage("");
        return remainingSessions.length > 0 ? remainingSessions : [nextSession];
      }

      return remainingSessions;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!input.trim() && files.length === 0) return;

    const userText = input.trim() || "Please analyze the attached file.";
    const attachedSummary = files.length
      ? `\n\nAttached: ${files.map((file) => file.name).join(", ")}`
      : "";

    commitMessages((currentMessages) => [
      ...currentMessages,
      { role: "user", content: `${userText}${attachedSummary}` },
      { role: "assistant", content: "Thinking...", pending: true },
    ]);
    setErrorMessage("");
    setInput("");

    const formData = new FormData();
    formData.append("message", userText);
    formData.append("history", JSON.stringify(historyForApi));
    files.forEach((file) => formData.append("files", file));

    try {
      setLoading(true);
      const response = await API.post("/ai-chat/message", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const data = response.data?.data;
      commitMessages((currentMessages) => [
        ...currentMessages.filter((message) => !message.pending),
        {
          role: "assistant",
          content: data?.answer || "I could not generate a response.",
          sources: data?.sources || [],
        },
      ]);
      setFiles([]);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        (error.response?.status === 404
          ? "AI chatbot route was not found. Restart the backend server so the new /api/v1/ai-chat route is loaded."
          : error.request
            ? "Backend is not reachable. Make sure the backend server is running."
            : "AI chatbot failed. Check backend env configuration.");
      setErrorMessage(message);
      commitMessages((currentMessages) => [
        ...currentMessages.filter((item) => !item.pending),
        { role: "assistant", content: message },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const activeSessionTitle =
    sessions.find((session) => session.id === activeSessionId)?.title ||
    "New study chat";

  return (
    <main className="app-page">
      <div className="fixed left-3 right-3 top-20 z-40 max-w-[calc(100vw-1.5rem)] lg:left-6 lg:right-auto lg:w-[310px]">
        <div className="grid grid-cols-2 gap-3 rounded-3xl border border-white/80 bg-white/90 p-2 shadow-2xl shadow-slate-500/15 backdrop-blur-xl">
          <button
            type="button"
            onClick={handleNewChat}
            className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-3 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
          >
            <Plus size={17} />
            New chat
          </button>
          <button
            type="button"
            onClick={() => setShowHistory((current) => !current)}
            className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-semibold transition ${
              showHistory
                ? "bg-indigo-50 text-indigo-700"
                : "bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Clock3 size={17} />
            History
          </button>
        </div>

        {showHistory && (
          <section className="mt-3 max-h-[min(62vh,460px)] overflow-hidden rounded-3xl border border-slate-200 bg-white/95 p-3 shadow-2xl shadow-slate-500/15 backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between px-1">
              <div>
                <h2 className="text-sm font-semibold text-slate-950">
                  Saved chats
                </h2>
                <p className="text-xs text-slate-500">
                  Stored on this browser
                </p>
              </div>
              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                {sessions.length}
              </span>
            </div>
            <HistoryPanel
              activeSessionId={activeSessionId}
              onDeleteSession={handleDeleteSession}
              onSelectSession={handleSelectSession}
              sessions={sessions}
            />
          </section>
        )}
      </div>

      <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[310px_minmax(0,1fr)]">
        <aside className="space-y-4 pt-24 lg:pt-28">
          <section className="rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-500 p-5 text-white shadow-xl shadow-indigo-200">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
              <Bot size={22} />
            </div>
            <h1 className="mt-4 font-poppins text-2xl font-semibold">
              AI Chatbot
            </h1>
            <p className="mt-2 text-sm leading-6 text-indigo-50">
              Analyze notes, PDFs, images, diagrams, and doubts in one focused study chat.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-950">
              What it can handle
            </h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              {[
                "PDF notes and typed material",
                "Handwritten note images",
                "Image analysis and diagrams",
                "Question answering with references",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                    <Sparkles size={15} />
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>
        </aside>

        <section className="flex min-h-[calc(100vh-9rem)] min-w-0 flex-col overflow-hidden rounded-[28px] border border-white/70 bg-white/55 shadow-2xl shadow-slate-500/15 backdrop-blur-2xl">
          <header className="border-b border-slate-200/70 px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-indigo-700">
                  Study assistant
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Logged in as {user?.fullName || user?.username || "GBPIET user"}
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-white/80 px-3 py-2 text-xs font-semibold text-slate-500">
                <MessageSquareText size={15} className="text-indigo-600" />
                <span className="max-w-[180px] truncate">
                  {activeSessionTitle}
                </span>
              </div>
            </div>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
            {messages.map((message, index) => (
              <ChatBubble key={`${message.role}-${index}`} message={message} />
            ))}
          </div>

          <div className="border-t border-slate-200/70 bg-white/80 p-4 sm:p-5">
            {errorMessage && (
              <p className="mb-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {errorMessage}
              </p>
            )}

            {files.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {files.map((file, index) => (
                  <FileChip
                    key={`${file.name}-${index}`}
                    file={file}
                    onRemove={() =>
                      setFiles((currentFiles) =>
                        currentFiles.filter((_, fileIndex) => fileIndex !== index),
                      )
                    }
                  />
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-700"
                  aria-label="Attach files"
                >
                  <Paperclip size={18} />
                </button>
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask a doubt, request summary, or upload notes..."
                  rows={1}
                  className="max-h-32 min-h-11 flex-1 resize-none border-0 bg-transparent px-2 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={loading || (!input.trim() && files.length === 0)}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:opacity-50"
                  aria-label="Send message"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="application/pdf,image/*,text/plain"
                className="hidden"
                onChange={handleFileChange}
              />

              <div className="flex flex-wrap gap-2">
                {starterPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => setInput(prompt)}
                    className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
