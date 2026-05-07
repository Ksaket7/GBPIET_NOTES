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
  const { fullName, username, branch, year, role } = req.body;

  if (
    [fullName, username, branch, year, role].some(
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

  const allowedYears = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  if (!allowedYears.includes(year)) {
    throw new ApiError(400, "Invalid academic year");
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
        year,
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
        year: 1,
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
    .select("fullName username avatar role branch year")
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

const getUserSuggestions = asyncHandler(async (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 5, 1), 12);
  const currentUserId = req.user._id;

  const users = await User.find({
    _id: { $ne: currentUserId },
    profileCompleted: true,
  })
    .select("fullName username avatar branch year role credits upvotes")
    .sort({ credits: -1, upvotes: -1, fullName: 1 })
    .limit(limit)
    .lean();

  const follows = await Follow.find({
    follower: currentUserId,
    following: { $in: users.map((user) => user._id) },
  }).select("following");

  const followedIds = new Set(
    follows.map((follow) => follow.following.toString())
  );

  const suggestions = users.map((user) => ({
    ...user,
    isFollowing: followedIds.has(user._id.toString()),
  }));

  return res
    .status(200)
    .json(new ApiResponse(200, suggestions, "User suggestions fetched successfully"));
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

const getLandingData = asyncHandler(async (req, res) => {
  const [
    totalNotes,
    totalQuestions,
    totalUsers,
    topContributors,
    topNotes,
    latestNotes,
    latestQuestions,
    latestPosts,
  ] = await Promise.all([
    Note.countDocuments(),
    Question.countDocuments(),
    User.countDocuments({ profileCompleted: true }),
    User.aggregate([
      { $match: { profileCompleted: true } },
      {
        $lookup: {
          from: "notes",
          localField: "_id",
          foreignField: "originalStudent",
          as: "notesUploads",
        },
      },
      {
        $lookup: {
          from: "questions",
          localField: "_id",
          foreignField: "askedBy",
          as: "questionsAsked",
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "postedBy",
          as: "postsCreated",
        },
      },
      {
        $addFields: {
          uploadsCount: {
            $add: [
              { $size: "$notesUploads" },
              { $size: "$questionsAsked" },
              { $size: "$postsCreated" },
            ],
          },
          likesReceived: "$upvotes",
          points: "$credits",
        },
      },
      {
        $sort: {
          points: -1,
          likesReceived: -1,
          uploadsCount: -1,
          createdAt: 1,
        },
      },
      { $limit: 8 },
      {
        $project: {
          fullName: 1,
          username: 1,
          avatar: 1,
          role: 1,
          branch: 1,
          year: 1,
          uploadsCount: 1,
          likesReceived: 1,
          points: 1,
        },
      },
    ]),
    Note.aggregate([
      {
        $addFields: {
          likesCount: { $size: { $ifNull: ["$upvotes", []] } },
        },
      },
      { $sort: { likesCount: -1, createdAt: -1 } },
      { $limit: 6 },
      {
        $lookup: {
          from: "users",
          localField: "uploadedBy",
          foreignField: "_id",
          as: "uploadedBy",
        },
      },
      {
        $unwind: {
          path: "$uploadedBy",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          title: 1,
          subjectName: 1,
          subjectCode: 1,
          type: 1,
          createdAt: 1,
          likesCount: 1,
          uploadedBy: {
            username: "$uploadedBy.username",
            fullName: "$uploadedBy.fullName",
            avatar: "$uploadedBy.avatar",
          },
        },
      },
    ]),
    Note.find()
      .populate("uploadedBy", "username fullName avatar")
      .sort({ createdAt: -1 })
      .limit(3)
      .lean(),
    Question.find()
      .populate("askedBy", "username fullName avatar")
      .sort({ createdAt: -1 })
      .limit(3)
      .lean(),
    Post.find()
      .populate("postedBy", "username fullName avatar")
      .sort({ createdAt: -1 })
      .limit(3)
      .lean(),
  ]);

  const activity = [
    ...latestNotes.map((note) => ({
      _id: note._id,
      type: "note",
      title: note.title,
      actor: note.uploadedBy,
      message: `${note.uploadedBy?.username || "Someone"} uploaded ${note.title}`,
      createdAt: note.createdAt,
    })),
    ...latestQuestions.map((question) => ({
      _id: question._id,
      type: "question",
      title: question.description,
      actor: question.askedBy,
      message: `${question.askedBy?.username || "Someone"} asked a question`,
      createdAt: question.createdAt,
    })),
    ...latestPosts.map((post) => ({
      _id: post._id,
      type: "post",
      title: post.text,
      actor: post.postedBy,
      message: `${post.postedBy?.username || "Someone"} shared an update`,
      createdAt: post.createdAt,
    })),
  ]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        stats: {
          notes: totalNotes,
          students: totalUsers,
          questions: totalQuestions,
        },
        topContributors,
        topStudyMaterial: topNotes,
        activity,
      },
      "Landing data fetched successfully"
    )
  );
});

const getTopContributors = asyncHandler(async (req, res) => {
  const contributors = await User.aggregate([
    { $match: { profileCompleted: true } },
    {
      $lookup: {
        from: "notes",
        localField: "_id",
        foreignField: "originalStudent",
        as: "notesUploads",
      },
    },
    {
      $addFields: {
        uploads: { $size: "$notesUploads" },
        likes: "$upvotes",
        creditsValue: "$credits",
      },
    },
    {
      $sort: {
        creditsValue: -1,
        likes: -1,
        uploads: -1,
        createdAt: 1,
      },
    },
    { $limit: 8 },
    {
      $project: {
        _id: 0,
        id: "$_id",
        name: "$fullName",
        username: 1,
        branch: 1,
        year: {
          $cond: [{ $ifNull: ["$year", false] }, "$year", "$role"],
        },
        avatar: 1,
        uploads: 1,
        likes: 1,
        credits: "$creditsValue",
      },
    },
  ]);

  const data = contributors.map((contributor, index) => ({
    ...contributor,
    isTop: index === 0,
  }));

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Top contributors fetched successfully"));
});

const getUserOwnedActivityItems = async (userId, startDate, endDate) => {
  const range = { createdAt: { $gte: startDate, $lte: endDate } };
  const [notes, questions, answers, posts] = await Promise.all([
    Note.find({ originalStudent: userId, ...range }).select("createdAt").lean(),
    Question.find({ askedBy: userId, ...range }).select("createdAt").lean(),
    Answer.find({ answeredBy: userId, ...range }).select("createdAt").lean(),
    Post.find({ postedBy: userId, ...range }).select("createdAt").lean(),
  ]);

  return [...notes, ...questions, ...answers, ...posts];
};

const getLeaderboardDashboard = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 25);
  const selectedYear = Number(req.query.year) || new Date().getFullYear();
  const userId = req.user._id;
  const now = new Date();

  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);

  const weeklyDays = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(endOfToday);
    date.setDate(endOfToday.getDate() - (6 - index));
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    return {
      label: start.toLocaleDateString("en-US", { weekday: "short" }),
      date: start,
      start,
      end,
      count: 0,
      isToday: start.toDateString() === now.toDateString(),
    };
  });

  const weekStart = weeklyDays[0].start;
  const weeklyItems = await getUserOwnedActivityItems(userId, weekStart, endOfToday);
  weeklyItems.forEach((item) => {
    const activityDate = new Date(item.createdAt);
    const day = weeklyDays.find(({ start, end }) => activityDate >= start && activityDate <= end);
    if (day) day.count += 1;
  });

  const previousWeeks = await Promise.all(
    Array.from({ length: 4 }).map(async (_, index) => {
      const end = new Date(weekStart);
      end.setDate(weekStart.getDate() - 1 - index * 7);
      end.setHours(23, 59, 59, 999);
      const start = new Date(end);
      start.setDate(end.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      const items = await getUserOwnedActivityItems(userId, start, end);

      return {
        label: `Week ${index + 1}`,
        count: items.length,
      };
    })
  );

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  const monthItems = await getUserOwnedActivityItems(userId, monthStart, monthEnd);
  const monthlyDays = Array.from({ length: monthEnd.getDate() }).map((_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth(), index + 1);
    const count = monthItems.filter(
      (item) => new Date(item.createdAt).toDateString() === date.toDateString()
    ).length;

    return {
      date: date.toISOString(),
      day: index + 1,
      count,
    };
  });

  const yearStart = new Date(selectedYear, 0, 1);
  const yearEnd = new Date(selectedYear, 11, 31, 23, 59, 59, 999);
  const yearItems = await getUserOwnedActivityItems(userId, yearStart, yearEnd);
  const yearlyMonths = Array.from({ length: 12 }).map((_, monthIndex) => {
    const monthDate = new Date(selectedYear, monthIndex, 1);
    const daysInMonth = new Date(selectedYear, monthIndex + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }).map((__, index) => {
      const date = new Date(selectedYear, monthIndex, index + 1);
      const count = yearItems.filter(
        (item) => new Date(item.createdAt).toDateString() === date.toDateString()
      ).length;
      return { day: index + 1, count };
    });

    return {
      label: monthDate.toLocaleDateString("en-US", { month: "long" }),
      days,
    };
  });

  const leaderboardPipeline = [
    { $match: { profileCompleted: true } },
    {
      $lookup: {
        from: "notes",
        localField: "_id",
        foreignField: "originalStudent",
        as: "ownedNotes",
      },
    },
    {
      $lookup: {
        from: "questions",
        localField: "_id",
        foreignField: "askedBy",
        as: "ownedQuestions",
      },
    },
    {
      $lookup: {
        from: "answers",
        localField: "_id",
        foreignField: "answeredBy",
        as: "ownedAnswers",
      },
    },
    {
      $lookup: {
        from: "posts",
        localField: "_id",
        foreignField: "postedBy",
        as: "ownedPosts",
      },
    },
    {
      $addFields: {
        contributionsCount: {
          $add: [
            { $size: "$ownedNotes" },
            { $size: "$ownedQuestions" },
            { $size: "$ownedAnswers" },
            { $size: "$ownedPosts" },
          ],
        },
        likesEarned: "$upvotes",
      },
    },
    {
      $addFields: {
        score: {
          $add: [
            { $multiply: ["$contributionsCount", 10] },
            { $multiply: ["$likesEarned", 5] },
            "$credits",
          ],
        },
      },
    },
    { $sort: { score: -1, contributionsCount: -1, likesEarned: -1, createdAt: 1 } },
    {
      $project: {
        fullName: 1,
        username: 1,
        avatar: 1,
        branch: 1,
        year: 1,
        role: 1,
        score: 1,
        contributionsCount: 1,
        likesEarned: 1,
      },
    },
  ];

  const [leaderboard, totalUsers] = await Promise.all([
    User.aggregate([...leaderboardPipeline, { $skip: (page - 1) * limit }, { $limit: limit }]),
    User.countDocuments({ profileCompleted: true }),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        activity: {
          weekly: {
            days: weeklyDays.map(({ label, date, count, isToday }) => ({
              label,
              date: date.toISOString(),
              count,
              isToday,
            })),
            maxCount: Math.max(...weeklyDays.map((day) => day.count), 1),
          },
          previousWeeks,
          monthly: {
            label: now.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
            days: monthlyDays,
          },
          yearly: {
            year: selectedYear,
            availableYears: [new Date().getFullYear(), new Date().getFullYear() - 1],
            months: yearlyMonths,
          },
        },
        leaderboard: leaderboard.map((user, index) => ({
          ...user,
          rank: (page - 1) * limit + index + 1,
        })),
        pagination: {
          currentPage: page,
          totalPages: Math.max(Math.ceil(totalUsers / limit), 1),
          limit,
          totalUsers,
        },
      },
      "Leaderboard dashboard fetched successfully"
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
  getUserSuggestions,
  getUserActivity,
  getLandingData,
  getTopContributors,
  getLeaderboardDashboard,
};
