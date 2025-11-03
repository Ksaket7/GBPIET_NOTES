import { Follow } from "../models/follow.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";

const toggleFollow = asyncHandler(async (req, res) => {
  const { userId } = req.params; // person you want to follow/unfollow
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

const getFollowersAndFollowing = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const followers = await Follow.find({ following: userId }).populate(
    "follower",
    "username fullName avatar"
  );

  const following = await Follow.find({ follower: userId }).populate(
    "following",
    "username fullName avatar"
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        followers: followers.map((f) => f.follower),
        following: following.map((f) => f.following),
      },
      "Followers and following fetched successfully"
    )
  );
});

const getFollowerCount = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const followersCount = await Follow.countDocuments({ following: userId });
  const followingCount = await Follow.countDocuments({ follower: userId });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { followersCount, followingCount },
        "Follower and following count fetched successfully"
      )
    );
});

export { toggleFollow, getFollowerCount, getFollowersAndFollowing };
