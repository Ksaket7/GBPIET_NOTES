import { Upvote } from "../models/upvote.model.js";
import { recalculateUserReputation } from "../utils/updateUserReputation.js";
import { getModelByType } from "../utils/getModelByType.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const toggleUpvote = asyncHandler(async (req, res) => {
  const { type, id } = req.params;
  const userId = req.user._id;

  const Model = getModelByType(type);
  const content = await Model.findById(id);

  if (!content) {
    throw new ApiError(404, `${type} not found`);
  }

  let authorId;
  if (type === "note") authorId = content.originalStudent;
  if (type === "question") authorId = content.askedBy;
  if (type === "answer") authorId = content.answeredBy;

  const existingUpvote = await Upvote.findOneAndDelete(
    { [type]: id, upvotedBy: userId },
    { new: false }
  );

  if (existingUpvote) {
    await Model.findByIdAndUpdate(id, {
      $pull: { upvotes: existingUpvote._id },
    });

    await recalculateUserReputation(authorId);

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Upvote removed successfully"));
  }

  const newUpvote = await Upvote.create({
    [type]: id,
    upvotedBy: userId,
  });

  await Model.findByIdAndUpdate(id, {
    $addToSet: { upvotes: newUpvote._id },
  });

  await recalculateUserReputation(authorId);

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
