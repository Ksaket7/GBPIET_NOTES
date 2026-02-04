import { useParams, useLocation } from "react-router-dom";
import BackToNote from "../components/ai/BackToNote";
import NoteContextBanner from "../components/ai/NoteContextBanner";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import SuggestedPrompts from "../components/ai/SuggestedPrompts";
import AIChatBox from "../components/ai/AIChatBox";

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
    <div className="max-w-4xl mx-auto px-5 py-8 space-y-6">
      {/* Back */}
      <BackToNote noteId={noteId} />

      {/* Header */}
      <h1 className="font-poppins text-3xl text-textPrimary">🤖 AI Help</h1>

      {/* Context Banner */}
      <NoteContextBanner noteTitle={noteTitle} noteType={noteType} />

      {/* Suggested prompts */}
      <SuggestedPrompts noteType={noteType} setMessages={setMessages} />

      {/* Chat */}
      <AIChatBox
        noteId={noteId}
        messages={messages}
        setMessages={setMessages}
      />
    </div>
  );
}
