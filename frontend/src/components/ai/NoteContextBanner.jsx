import { Bot } from "lucide-react";

export default function NoteContextBanner({ noteTitle, noteType }) {
  return (
    <div className="glass-panel flex items-start gap-3 p-4">
      <span className="rounded-2xl bg-indigo-100 p-3 text-indigo-600">
        <Bot size={20} />
      </span>
      <div>
        <p className="text-sm font-semibold text-slate-950">
          AI answers use this note as context.
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Note: <span className="font-semibold">{noteTitle}</span> - Type:{" "}
          <span className="uppercase">{noteType}</span>
        </p>
      </div>
    </div>
  );
}
