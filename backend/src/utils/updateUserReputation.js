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
