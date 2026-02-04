export default function NoteContextBanner({ noteTitle, noteType }) {
  return (
    <div className="border border-borderSoft bg-background rounded-lg p-4">
      <p className="font-inter text-sm text-textPrimary">
        🤖 <span className="font-medium">AI Context:</span> Answers are generated
        using <span className="font-medium">this note only</span>.
      </p>

      <p className="mt-1 font-inter text-xs text-textSecondary">
        Note: <span className="font-medium">{noteTitle}</span> • Type:{" "}
        <span className="uppercase">{noteType}</span>
      </p>
    </div>
  );
}
