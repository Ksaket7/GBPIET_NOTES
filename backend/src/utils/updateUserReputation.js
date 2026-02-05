import { User } from "../models/user.model.js";
import { Note } from "../models/note.model.js";
import { Question } from "../models/question.model.js"
import { Answer } from "../models/answer.model.js";
// export const updateUserReputation = async (userId, addUpvotes = 1) => {
//   const user = await User.findById(userId);
//   if (!user) return;

//   // Add upvotes
//   user.upvotes += addUpvotes;

//   // Calculate credits based on upvotes
//   const newCredits = Math.floor(user.upvotes / 10); // 10 upvotes = 1 credit
//   user.credits = newCredits;

//   await user.save();
// };

export const recalculateUserReputation = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return;

  const [notes, questions, answers] = await Promise.all([
    Note.aggregate([
      { $match: { uploadedBy: user._id } },
      { $project: { c: { $size: "$upvotes" } } },
    ]),
    Question.aggregate([
      { $match: { askedBy: user._id } },
      { $project: { c: { $size: "$upvotes" } } },
    ]),
    Answer.aggregate([
      { $match: { answeredBy: user._id } },
      { $project: { c: { $size: "$upvotes" } } },
    ]),
  ]);

  const totalUpvotes =
    [...notes, ...questions, ...answers].reduce((s, x) => s + x.c, 0);

  user.upvotes = totalUpvotes;
  user.credits = Math.floor(totalUpvotes / 10);

  await user.save();
};

