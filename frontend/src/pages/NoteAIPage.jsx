import { useParams } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import SuggestedPrompts from "../components/ai/SuggestedPrompts";
import AIChatBox from "../components/ai/AIChatBox";

export default function NoteAIPage() {
  const { noteId } = useParams();
  const { isAuthenticated } = useAuth();

  const [messages, setMessages] = useState([]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="max-w-4xl mx-auto px-5 py-8 space-y-6">
      <h1 className="font-poppins text-3xl text-textPrimary">
        🤖 AI Help
      </h1>

      <p className="font-inter text-textSecondary">
        Ask questions about this note. AI answers are based only on
        this document.
      </p>

      <SuggestedPrompts setMessages={setMessages} />

      <AIChatBox
        noteId={noteId}
        messages={messages}
        setMessages={setMessages}
      />
    </div>
  );
}
