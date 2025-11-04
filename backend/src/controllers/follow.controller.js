import { Follow } from "../models/follow.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";

const toggleFollow = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user._id;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  if (userId === currentUserId.toString()) {
    throw new ApiError(400, "You cannot follow yourself");
  }

  const existingFollow = await Follow.findOne({
    follower: currentUserId,
    following: userId,
  });

  if (existingFollow) {
    // unfollow
    await Follow.findByIdAndDelete(existingFollow._id);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "User unfollowed successfully"));
  }

  // follow
  await Follow.create({
    follower: currentUserId,
    following: userId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User followed successfully"));
});

const getUserFollowers = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const followers = await Follow.find({ following: userId }).populate(
    "follower",
    "username fullName avatar"
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      followers.map((f) => f.follower),
      "Followers fetched successfully"
    )
  );
});

const getUserFollowing = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) throw new ApiError(400, "Invalid user ID");

  const following = await Follow.find({ follower: userId }).populate(
    "following",
    "username fullName avatar"
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      following.map((f) => f.following),
      "Following fetched successfully"
    )
  );
});

export { toggleFollow, getUserFollowers, getUserFollowing };
