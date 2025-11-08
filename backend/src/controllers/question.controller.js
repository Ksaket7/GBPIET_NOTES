import { Question } from "../models/question.model.js";
import { Answer } from "../models/answer.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";
import { Upvote } from "../models/upvote.model.js";
import { recalculateUserReputation } from "../utils/updateUserReputation.js";
// ask a question
const askQuestion = asyncHandler(async (req, res) => {
  const { title, description, tags } = req.body;

  if (!description?.trim()) {
    throw new ApiError(400, "Question description is required");
  }

  const question = await Question.create({
    title,
    description,
    tags,
    askedBy: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, question, "Question posted successfully"));
});

// get all questions
const getAllQuestions = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    tag,
    sortBy = "createdAt",
    sortType = "desc",
  } = req.query;

  const filter = {};

  if (query) {
    const regex = new RegExp(query, "i");
    filter.$or = [{ title: regex }, { description: regex }];
  }

  if (tag) {
    filter.tags = { $in: [tag] };
  }

  const totalQuestions = await Question.countDocuments(filter);

  const questions = await Question.find(filter)
    .populate("askedBy", "username fullName avatar")
    .sort({ [sortBy]: sortType === "desc" ? -1 : 1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        questions,
        pagination: {
          totalResult: totalQuestions,
          totalPages: Math.ceil(totalQuestions / limit),
          currentPage: Number(page),
          limit: Number(limit),
        },
      },
      "Questions fetched successfully"
    )
  );
});

// get question by id with answers
const getQuestionById = asyncHandler(async (req, res) => {
  const { questionId } = req.params;
  if (!isValidObjectId) {
    throw new ApiError(400, "Invalid question id");
  }

  const question = await Question.findById(questionId)
    .populate("askedBy", "username fullName avatar")
    .populate({
      path: "answers",
      populate: { path: "answeredBy", select: "username fullName avatar" },
    });

  if (!question) {
    throw new ApiError(404, "Question not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, question, "Question fetched successfully"));
});

// delete question
const deleteQuestion = asyncHandler(async (req, res) => {
  const { questionId } = req.params;
  const userId = req.user._id;

  // 1️⃣ Find the question
  const question = await Question.findById(questionId);
  if (!question) throw new ApiError(404, "Question not found");

  // 2️⃣ Authorization check
  if (question.askedBy.toString() !== userId.toString()) {
    throw new ApiError(403, "Not authorized to delete this question");
  }

  // 3️⃣ Delete all answers related to this question
  await Answer.deleteMany({ question: questionId });

  // 4️⃣ Delete all upvotes related to this question
  await Upvote.deleteMany({ question: questionId });

  // 5️⃣ Delete the question itself
  await Question.findByIdAndDelete(questionId);

  // 6️⃣ Recalculate the author's reputation safely
  await recalculateUserReputation(question.askedBy);

  // 7️⃣ Send response
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Question deleted successfully"));
});

export { askQuestion, getAllQuestions, getQuestionById, deleteQuestion };
