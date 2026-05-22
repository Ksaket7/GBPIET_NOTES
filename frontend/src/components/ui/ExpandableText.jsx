import { useState } from "react";

export default function ExpandableText({
  text,
  limit = 220,
  clampClass = "line-clamp-4",
  className = "mt-4",
  textClassName = "whitespace-pre-wrap text-sm leading-6 text-slate-700",
}) {
  const [expanded, setExpanded] = useState(false);
  const shouldClamp = text && text.length > limit;

  if (!text?.trim()) return null;

  return (
    <div className={className}>
      <p className={`${textClassName} ${expanded ? "" : clampClass}`}>
        {text}
      </p>
      {shouldClamp && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-2 text-xs font-semibold text-indigo-700"
        >
          {expanded ? "See less" : "See more"}
        </button>
      )}
    </div>
  );
}
