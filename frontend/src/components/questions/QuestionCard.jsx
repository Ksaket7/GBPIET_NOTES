export default function QuestionCard({ question, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-surface border border-borderSoft rounded-xl p-5
                 hover:shadow-md transition space-y-3"
    >
      <h2 className="font-poppins text-xl text-textPrimary">
        {question.title || "Untitled Question"}
      </h2>

      <p className="font-inter text-textSecondary line-clamp-2">
        {question.description}
      </p>

      {/* Tags */}
      {question.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {question.tags.map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Meta */}
      <div className="flex justify-between text-sm text-textSecondary pt-2">
        <span>
          Asked by{" "}
          <strong className="text-textPrimary">
            {question.askedBy?.username}
          </strong>
        </span>
        <div className="flex gap-1">
          <span className="p-1 hover:bg-gray-100 rounded-md px-2" >{question.upvotes?.length || 0} 👍 </span>

          <span className="p-1 hover:bg-gray-100 rounded-md px-2" >{question.answers?.length || 0} answers</span>
        </div>
      </div>
    </div>
  );
}
