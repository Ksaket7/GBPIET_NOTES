import { useLocation, useParams, Navigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import BackToNote from "../../components/ai/BackToNote";
import NoteContextBanner from "../../components/ai/NoteContextBanner";
import SuggestedPrompts from "../../components/ai/SuggestedPrompts";
import AIChatBox from "../../components/ai/AIChatBox";

export default function NoteAIPage() {
  const { noteId } = useParams();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const noteType = location.state?.noteType || "notes";
  const noteTitle = location.state?.noteTitle || "This note";
  const [messages, setMessages] = useState([]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <main className="app-page">
      <div className="app-shell space-y-6">
        <BackToNote noteId={noteId} />
        <header>
          <span className="pill">AI Help</span>
          <h1 className="page-title mt-3">Ask this note</h1>
          <p className="page-subtitle">
            Use focused prompts and a clean chat surface for quick explanations.
          </p>
        </header>
        <NoteContextBanner noteTitle={noteTitle} noteType={noteType} />
        <SuggestedPrompts noteType={noteType} setMessages={setMessages} />
        <AIChatBox noteId={noteId} messages={messages} setMessages={setMessages} />
      </div>
    </main>
  );
}
