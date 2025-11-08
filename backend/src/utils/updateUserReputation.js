import { User } from "../models/user.model.js";

export const updateUserReputation = async (userId, addUpvotes = 1) => {
  const user = await User.findById(userId);
  if (!user) return;

  // Add upvotes
  user.upvotes += addUpvotes;

  // Calculate credits based on upvotes
  const newCredits = Math.floor(user.upvotes / 10); // 10 upvotes = 1 credit
  user.credits = newCredits;

  await user.save();
};

export const recalculateUserReputation = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return;

  const questionUpvotes = await Question.aggregate([
    { $match: { askedBy: user._id } },
    { $project: { upvoteCount: { $size: "$upvotes" } } },
  ]);

  const answerUpvotes = await Answer.aggregate([
    { $match: { answeredBy: user._id } },
    { $project: { upvoteCount: { $size: "$upvotes" } } },
  ]);

  const totalUpvotes =
    questionUpvotes.reduce((sum, q) => sum + q.upvoteCount, 0) +
    answerUpvotes.reduce((sum, a) => sum + a.upvoteCount, 0);

  user.upvotes = totalUpvotes;
  user.credits = Math.floor(totalUpvotes / 10);
  await user.save();
};
