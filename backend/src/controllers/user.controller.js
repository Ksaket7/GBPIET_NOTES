import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import {
  uploadOnSupabase,
  deleteFromSupabase,
} from "../utils/supabaseStorage.js";
import mongoose from "mongoose";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error generating tokens");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, username, email, password, role, branch } = req.body;
  if (
    [fullName, username, email, password, branch].some(
      (field) => !field?.trim()
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatarUrl = await uploadOnSupabase(
    avatarLocalPath,
    "uploads",
    "avatars"
  );
  if (!avatarUrl) {
    throw new ApiError(400, "Error uploading on supabase");
  }

  const user = await User.create({
    fullName,
    username: username.toLowerCase(),
    email,
    password,
    branch,
    avatar: avatarUrl,
    role: role || "student",
  });
  const createdUser = await User.findById(user.id).select(
    "-password -refreshToken"
  );

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User regsitered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  if (!(email || username)) {
    throw new ApiError(400, "Email or username is required");
  }

  const user = await User.findOne({ $or: [{ email }, { username }] }).select(
    "+password"
  );

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = { httpOnly: true, secure: true };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "Login successfull"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });
  const options = { httpOnly: true, secure: true };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email, branch } = req.body;
  if (!fullName || !email) throw new ApiError(400, "All fields required");

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { fullName, email, branch } },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) throw new ApiError(400, "Avatar file missing");

  // 1️⃣ Fetch user to get current avatar URL
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  // 2️⃣ If previous avatar exists, delete it from Supabase
  if (user.avatar) {
    try {
      // Example: https://your-project.supabase.co/storage/v1/object/public/uploads/avatars/1730558341234-myimage.jpg
      const publicUrl = user.avatar;
      const filePath = publicUrl.split("/storage/v1/object/public/uploads/")[1];
      // "avatars/1730558341234-myimage.jpg"

      if (filePath) {
        const deleted = await deleteFromSupabase(filePath, "uploads");
        if (deleted) {
          console.log("✅ Old avatar deleted:", filePath);
        } else {
          console.warn("⚠️ Failed to delete old avatar:", filePath);
        }
      }
    } catch (err) {
      console.error("Error while deleting old avatar:", err.message);
    }
  }

  // 3️⃣ Upload new avatar to Supabase
  const avatarUrl = await uploadOnSupabase(
    avatarLocalPath,
    "uploads",
    "avatars"
  );
  if (!avatarUrl) throw new ApiError(500, "Avatar upload failed");

  // 4️⃣ Update user record with new avatar URL
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { avatar: avatarUrl } },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Avatar updated successfully"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Both old and new password are required");
  }
  const user = await User.findById(req.user._id).select("+password");

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) throw new ApiError(400, "Invalid old password");

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getUserProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  if (!username?.trim()) {
    throw new ApiError(400, "Username is required");
  }

  const userProfile = await User.aggregate([
    {
      $match: {
        username: { $regex: `^${username}$`, $options: "i" },
      },
    },
    // {
    //   $lookup: {
    //     from: "follows", // from same collection
    //     localField: "following",
    //     foreignField: "_id",
    //     as: "followingList",
    //   },
    // },
    // {
    //   $lookup: {
    //     from: "follows",
    //     localField: "follower",
    //     foreignField: "_id",
    //     as: "followerList",
    //   },
    // },
    // {
    //   $addFields: {
    //     followersCount: { $size: "$followerList" },
    //     followingCount: { $size: "$followingList" },
    //     isFollowing: {
    //       $cond: {
    //         if: {
    //           $in: [
    //             new mongoose.Types.ObjectId(req.user?._id),
    //             "$followersList.follower",
    //           ],
    //         },
    //         then: true,
    //         else: false,
    //       },
    //     },
    //   },
    // },
    {
      $project: {
        fullName: 1,
        username: 1,
        email: 1,
        avatar: 1,
        branch: 1,
        role: 1,
        credits: 1,
        // followersCount: 1,
        // followingCount: 1,
        // isFollowing: 1,
      },
    },
  ]);

  if (!userProfile.length) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, userProfile[0], "User profile fetched successfully")
    );
});

const updateUserRole = asyncHandler(async (req, res) => {
  const { username, newRole } = req.body;

  if (!username || !newRole) {
    throw new ApiError(400, "userId and newRole are required");
  }

  if (req.user.role !== "admin") {
    throw new ApiError(403, "Only admin can change user roles");
  }

  const validRoles = ["student", "cr", "faculty", "admin"];
  if (!validRoles.includes(newRole)) {
    throw new ApiError(400, "Invalid role provided");
  }

  const updatedUser = await User.findOneAndUpdate(
    { username: username },
    { role: newRole },
    { new: true }
  ).select("-password -refreshToken");

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User role updated succesfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  changeCurrentPassword,
  getUserProfile,
  updateUserRole,
};
