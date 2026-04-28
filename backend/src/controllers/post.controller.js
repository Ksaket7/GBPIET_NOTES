import { isValidObjectId } from "mongoose";
import { Post } from "../models/post.model.js";
import { Upvote } from "../models/upvote.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnSupabase, deleteFromSupabase } from "../utils/supabaseStorage.js";
import { recalculateUserReputation } from "../utils/updateUserReputation.js";

const createPost = asyncHandler(async (req, res) => {
  const { text = "" } = req.body;
  let imageUrl = "";

  if (req.file) {
    imageUrl = await uploadOnSupabase(
      req.file.buffer,
      req.file.originalname,
      "posts"
    );

    if (!imageUrl) {
      throw new ApiError(500, "Error uploading post image");
    }
  }

  if (!text.trim() && !imageUrl) {
    throw new ApiError(400, "Post must contain text, image, or both");
  }

  const post = await Post.create({
    text,
    imageUrl,
    postedBy: req.user._id,
  });

  const populatedPost = await Post.findById(post._id).populate(
    "postedBy",
    "fullName username avatar role"
  );

  return res
    .status(201)
    .json(new ApiResponse(201, populatedPost, "Post created successfully"));
});

const getAllPosts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const totalPosts = await Post.countDocuments();
  const posts = await Post.find()
    .populate("postedBy", "fullName username avatar role")
    .populate("comments.user", "username avatar")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        posts,
        pagination: {
          totalResult: totalPosts,
          totalPages: Math.ceil(totalPosts / limit),
          currentPage: Number(page),
          limit: Number(limit),
        },
      },
      "Posts fetched successfully"
    )
  );
});

const addPostComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { message } = req.body;

  if (!isValidObjectId(postId)) {
    throw new ApiError(400, "Invalid post ID");
  }

  if (!message?.trim()) {
    throw new ApiError(400, "Comment message is required");
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  post.comments.push({
    user: req.user._id,
    message,
  });

  await post.save();
  await post.populate("comments.user", "username avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, post.comments, "Comment added successfully"));
});

const updatePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { text = "" } = req.body;

  if (!isValidObjectId(postId)) {
    throw new ApiError(400, "Invalid post ID");
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.postedBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to edit this post");
  }

  let imageUrl = post.imageUrl;

  if (req.file) {
    imageUrl = await uploadOnSupabase(
      req.file.buffer,
      req.file.originalname,
      "posts"
    );

    if (!imageUrl) {
      throw new ApiError(500, "Error uploading post image");
    }

    if (post.imageUrl) {
      await deleteFromSupabase(post.imageUrl);
    }
  }

  if (!text.trim() && !imageUrl) {
    throw new ApiError(400, "Post must contain text, image, or both");
  }

  post.text = text;
  post.imageUrl = imageUrl;
  await post.save();

  await post.populate("postedBy", "fullName username avatar role");
  await post.populate("comments.user", "username avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post updated successfully"));
});

const deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!isValidObjectId(postId)) {
    throw new ApiError(400, "Invalid post ID");
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.postedBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this post");
  }

  if (post.imageUrl) {
    await deleteFromSupabase(post.imageUrl);
  }

  await Upvote.deleteMany({ post: postId });
  await Post.findByIdAndDelete(postId);

  await recalculateUserReputation(post.postedBy);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Post deleted successfully"));
});

export { createPost, getAllPosts, addPostComment, updatePost, deletePost };
