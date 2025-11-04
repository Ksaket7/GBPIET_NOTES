import { Upvote } from "../models/upvote.model.js";
import { Note } from "../models/note.model.js";
import { updateUserReputation } from "../utils/updateUserReputation.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getModelByType = (type) => {
  switch (type) {
    case "note":
      return Note;
    case "question":
      return Question;
    case "answer":
      return Answer;

    default:
      throw new ApiError(400, "Invalid content type for upvote");
  }
};

const toggleUpvote = asyncHandler(async (req, res) => {
  const { type, id } = req.params;
  const userId = req.user?._id;

  const Model = getModelByType(type);
  const content = await Model.findById(id);

  if (!content) {
    throw new ApiError(404, `${type} not found`);
  }
  const authorId =
    content.orinialStudent || content.askedBy || content.answeredBy;
  const existingUpvote = await Upvote.findOne({
    [type]: id,
    upvotedBy: userId,
  });

  if (existingUpvote) {
    await Upvote.findByIdAndDelete(existingUpvote._id);
    await Model.findByIdAndUpdate(id, { $pull: { upvotes: existingUpvote } });

    if (authorId) {
      await updateUserReputation(authorId, -1);
    }
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Upvote removed successfully"));
  }

  const newUpvote = await Upvote.create({
    [type]: id,
    upvotedBy: userId,
  });

  await Model.findByIdAndUpdate(id, { $push: { upvotes: newUpvote._id } });
  if (authorId) {
    await updateUserReputation(authorId, 1);
  }

  return res
    .status(201)
    .json(new ApiResponse(201, newUpvote, "Upvoted successfully"));
});

const getUpvoteCount = asyncHandler(async (req, res) => {
  const { type, id } = req.params;

  const count = await Upvote.countDocuments({ [type]: id });

  return res
    .status(200)
    .json(new ApiResponse(200, { count }, "Upvote count fetched successfully"));
});

const getUpvoters = asyncHandler(async (req, res) => {
  const { type, id } = req.params;

  const upvotes = await Upvote.find({ [type]: id })
    .populate("upvotedBy", "username email avatar")
    .sort({ createdAt: -1 });

  const upvoters = upvotes.map((u) => u.upvotedBy);
  return res
    .status(200)
    .json(new ApiResponse(200, upvoters, "Upvoters fetched successfully"));
});

export { toggleUpvote, getUpvoteCount, getUpvoters };
