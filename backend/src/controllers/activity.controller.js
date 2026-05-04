import { Note } from "../models/note.model.js";
import { Post } from "../models/post.model.js";
import { Question } from "../models/question.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const timeAgo = (date) => {
  const timestamp = new Date(date).getTime();
  if (!timestamp) return "recently";

  const diffMinutes = Math.max(1, Math.floor((Date.now() - timestamp) / 60000));
  if (diffMinutes < 60) return `${diffMinutes} mins ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hrs ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} days ago`;
};

const getRecentActivity = asyncHandler(async (req, res) => {
  const [latestNotes, latestQuestions, latestPosts, activeUsersOnline] =
    await Promise.all([
      Note.find()
        .populate("uploadedBy", "fullName username avatar")
        .sort({ createdAt: -1 })
        .limit(4)
        .lean(),
      Question.find()
        .populate("askedBy", "fullName username avatar")
        .sort({ createdAt: -1 })
        .limit(4)
        .lean(),
      Post.find()
        .populate("postedBy", "fullName username avatar")
        .sort({ createdAt: -1 })
        .limit(4)
        .lean(),
      User.countDocuments({ profileCompleted: true }),
    ]);

  const activity = [
    ...latestNotes.map((note) => ({
      id: note._id,
      type: "upload",
      user: note.uploadedBy?.fullName || note.uploadedBy?.username || "Someone",
      avatar: note.uploadedBy?.avatar || "",
      content: note.title,
      time: timeAgo(note.createdAt),
      createdAt: note.createdAt,
    })),
    ...latestQuestions.map((question) => ({
      id: question._id,
      type: "question",
      user: question.askedBy?.fullName || question.askedBy?.username || "Someone",
      avatar: question.askedBy?.avatar || "",
      content: question.description,
      time: timeAgo(question.createdAt),
      createdAt: question.createdAt,
    })),
    ...latestPosts.map((post) => ({
      id: post._id,
      type: "post",
      user: post.postedBy?.fullName || post.postedBy?.username || "Someone",
      avatar: post.postedBy?.avatar || "",
      content: post.text || "a community update",
      time: timeAgo(post.createdAt),
      createdAt: post.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map(({ createdAt, ...item }) => item);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        activeUsersOnline,
        activity,
      },
      "Recent activity fetched successfully"
    )
  );
});

export { getRecentActivity };
