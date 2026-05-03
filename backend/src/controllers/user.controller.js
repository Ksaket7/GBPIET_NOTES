import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import axios from "axios";
import crypto from "crypto";
import {
  uploadOnSupabase,
  deleteFromSupabase,
} from "../utils/supabaseStorage.js";
import mongoose from "mongoose";
import { verifyRealEmail } from "../utils/emailValidator.js";
import { Note } from "../models/note.model.js";
import { Follow } from "../models/follow.model.js";
import { Question } from "../models/question.model.js";
import { Answer } from "../models/answer.model.js";
import { Post } from "../models/post.model.js";

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

const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

const sendAuthResponse = async (res, userId, message = "Login successful") => {
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    userId
  );
  const loggedInUser = await User.findById(userId).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, authCookieOptions)
    .cookie("refreshToken", refreshToken, authCookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        message
      )
    );
};

const createUniqueUsername = async (email) => {
  const baseUsername =
    email
      .split("@")[0]
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "")
      .slice(0, 24) || `user${Date.now()}`;

  let username = baseUsername;
  let suffix = 1;

  while (await User.exists({ username })) {
    username = `${baseUsername}${suffix}`;
    suffix += 1;
  }

  return username;
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => typeof field !== "string" || !field.trim())) {
    throw new ApiError(400, "Email and password are required");
  }

  let isReal = false;
  try {
    isReal = await verifyRealEmail(email);
  } catch (err) {
    console.error("Email verification failed:", err.message);
  }

  if (!isReal) {
    throw new ApiError(400, "Please enter a valid email");
  }

  const normalizedEmail = email.toLowerCase();
  const existedUser = await User.findOne({ email: normalizedEmail });
  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  const username = await createUniqueUsername(normalizedEmail);

  const user = await User.create({
    fullName: username,
    username,
    email: normalizedEmail,
    password,
    branch: "Unassigned",
    avatar: "",
    role: "student",
    profileCompleted: false,
  });

  return sendAuthResponse(res, user._id, "User registered successfully");
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  if (!(email || username)) {
    throw new ApiError(400, "Email or username is required");
  }

  const user = await User.findOne({ $or: [{ email }, { username }] }).select(
    "+password"
  );

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials");
  }

  return sendAuthResponse(res, user._id, "Login successful");
});

const googleAuth = asyncHandler(async (req, res) => {
  const { credential } = req.body;

  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new ApiError(500, "Google authentication is not configured");
  }

  if (!credential) {
    throw new ApiError(400, "Google credential is required");
  }

  const { data } = await axios.get("https://oauth2.googleapis.com/tokeninfo", {
    params: { id_token: credential },
  });

  if (data.aud !== process.env.GOOGLE_CLIENT_ID) {
    throw new ApiError(401, "Invalid Google credential");
  }

  if (data.email_verified !== "true" && data.email_verified !== true) {
    throw new ApiError(401, "Google email is not verified");
  }

  const email = data.email?.toLowerCase();
  if (!email) {
    throw new ApiError(400, "Google account email is required");
  }

  let user = await User.findOne({
    $or: [{ email }, { googleId: data.sub }],
  });

  if (user) {
    if (!user.googleId) user.googleId = data.sub;
    if (!user.avatar && data.picture) user.avatar = data.picture;
    await user.save({ validateBeforeSave: false });
  } else {
    const username = await createUniqueUsername(email);
    user = await User.create({
      googleId: data.sub,
      fullName: data.name || username,
      username,
      email,
      password: crypto.randomBytes(32).toString("hex"),
      branch: "Unassigned",
      avatar: data.picture || "",
      role: "student",
      profileCompleted: false,
    });
  }

  return sendAuthResponse(res, user._id, "Google login successful");
});

const completeProfile = asyncHandler(async (req, res) => {
  const { fullName, username, branch, role } = req.body;

  if (
    [fullName, username, branch, role].some(
      (field) => typeof field !== "string" || !field.trim()
    )
  ) {
    throw new ApiError(400, "All profile fields are required");
  }

  const normalizedUsername = username.toLowerCase().trim();
  const usernameTaken = await User.exists({
    username: normalizedUsername,
    _id: { $ne: req.user._id },
  });

  if (usernameTaken) {
    throw new ApiError(409, "Username already exists");
  }

  const allowedRoles = ["student", "cr", "faculty", "admin"];
  if (!allowedRoles.includes(role)) {
    throw new ApiError(400, "Invalid user type");
  }

  const adminExists = await User.exists({
    role: "admin",
    _id: { $ne: req.user._id },
  });
  const finalRole = role === "admin" && adminExists ? "student" : role;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        fullName: fullName.trim(),
        username: normalizedUsername,
        branch: branch.trim(),
        role: finalRole,
        profileCompleted: true,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile completed successfully"));
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });

  return res
    .status(200)
    .clearCookie("accessToken", authCookieOptions)
    .clearCookie("refreshToken", authCookieOptions)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 🔹 Count notes uploaded by user
  const notesCount = await Note.countDocuments({
    originalStudent: user._id,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        ...user.toObject(),
        notesCount, // ✅ attached dynamically
      },
      "User fetched successfully"
    )
  );
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
    {
      $lookup: {
        from: "follows", // from same collection
        localField: "following",
        foreignField: "_id",
        as: "followingList",
      },
    },
    {
      $lookup: {
        from: "follows",
        localField: "follower",
        foreignField: "_id",
        as: "followerList",
      },
    },
    {
      $addFields: {
        followersCount: { $size: "$followerList" },
        followingCount: { $size: "$followingList" },
        isFollowing: {
          $cond: {
            if: {
              $in: [
                new mongoose.Types.ObjectId(req.user?._id),
                "$followersList.follower",
              ],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        email: 1,
        avatar: 1,
        branch: 1,
        role: 1,
        credits: 1,
        followersCount: 1,
        followingCount: 1,
        isFollowing: 1,
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

const getUsersByRoles = async (roles, currentUserId) => {
  const users = await User.find({ role: { $in: roles } })
    .select("fullName username avatar role branch")
    .sort({ fullName: 1 })
    .lean();

  const userIds = users.map((user) => user._id);

  const follows = await Follow.find({
    follower: currentUserId,
    following: { $in: userIds },
  }).select("following");

  const followedIds = new Set(
    follows.map((follow) => follow.following.toString())
  );

  return users.map((user) => ({
    ...user,
    isFollowing: followedIds.has(user._id.toString()),
    isSelf: user._id.toString() === currentUserId.toString(),
  }));
};

const getFacultyUsers = asyncHandler(async (req, res) => {
  const users = await getUsersByRoles(["faculty"], req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Faculty users fetched successfully"));
});

const getStudentUsers = asyncHandler(async (req, res) => {
  const users = await getUsersByRoles(["student", "cr", "admin"], req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Student users fetched successfully"));
});

const getUserActivity = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const days = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    return {
      label: start.toLocaleDateString("en-US", { weekday: "short" }),
      start,
      end,
      count: 0,
    };
  });

  const startDate = days[0].start;

  const [notes, questions, answers, posts] = await Promise.all([
    Note.find({ originalStudent: userId, createdAt: { $gte: startDate } })
      .select("createdAt")
      .lean(),
    Question.find({ askedBy: userId, createdAt: { $gte: startDate } })
      .select("createdAt")
      .lean(),
    Answer.find({ answeredBy: userId, createdAt: { $gte: startDate } })
      .select("createdAt")
      .lean(),
    Post.find({ postedBy: userId, createdAt: { $gte: startDate } })
      .select("createdAt")
      .lean(),
  ]);

  [...notes, ...questions, ...answers, ...posts].forEach((item) => {
    const activityDate = new Date(item.createdAt);
    const day = days.find(
      ({ start, end }) => activityDate >= start && activityDate <= end
    );
    if (day) day.count += 1;
  });

  const maxCount = Math.max(...days.map((day) => day.count), 1);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        days: days.map(({ label, count }) => ({ label, count })),
        maxCount,
        total: days.reduce((sum, day) => sum + day.count, 0),
      },
      "User activity fetched successfully"
    )
  );
});

export {
  registerUser,
  loginUser,
  googleAuth,
  completeProfile,
  logoutUser,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  changeCurrentPassword,
  getUserProfile,
  updateUserRole,
  getFacultyUsers,
  getStudentUsers,
  getUserActivity,
};
