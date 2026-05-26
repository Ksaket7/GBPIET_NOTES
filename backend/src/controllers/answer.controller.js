import { Answer } from "../models/answer.model.js";
import { Question } from "../models/question.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Upvote } from "../models/upvote.model.js";
import { recalculateUserReputation } from "../utils/updateUserReputation.js";
import { uploadOnSupabase, deleteFromSupabase } from "../utils/supabaseStorage.js";

const getUploadedFiles = (req) => {
  if (Array.isArray(req.files)) return req.files;
  return req.file ? [req.file] : [];
};

const uploadAnswerImages = async (files) => {
  if (!files.length) return [];

  const uploadedImages = await Promise.all(
    files.map((file) =>
      uploadOnSupabase(file.buffer, file.originalname, "answers")
    )
  );

  if (uploadedImages.some((imageUrl) => !imageUrl)) {
    throw new ApiError(500, "Error uploading answer image");
  }

  return uploadedImages;
};

const getStoredImages = (item) => {
  const images = Array.isArray(item?.images) ? item.images.filter(Boolean) : [];
  if (images.length) return images;
  return item?.imageUrl ? [item.imageUrl] : [];
};

const deleteStoredImages = async (item) => {
  await Promise.all(getStoredImages(item).map((url) => deleteFromSupabase(url)));
};

// add answer
const addAnswer = asyncHandler(async (req, res) => {
  const { questionId } = req.params;
  const { content } = req.body;

  const question = await Question.findById(questionId);
  if (!question) throw new ApiError(404, "Question not found");

  const images = await uploadAnswerImages(getUploadedFiles(req));
  const imageUrl = images[0] || "";

  if (!content?.trim() && !imageUrl) {
    throw new ApiError(400, "Answer content or image is required");
  }

  const answer = await Answer.create({
    question: questionId,
    content: content || "",
    imageUrl,
    images,
    answeredBy: req.user._id,
  });
  await Question.findByIdAndUpdate(questionId, {
    $push: { answers: answer._id },
  });
  await answer.populate("answeredBy", "username fullName avatar");

  return res
    .status(201)
    .json(new ApiResponse(201, answer, "Answer added successfully"));
});

// get all answer for a question
const getAnswersByQuestion = asyncHandler(async (req, res) => {
  const { questionId } = req.params;

  const answers = await Answer.find({ question: questionId })
    .populate("answeredBy", "username fullName avatar")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, answers, "Answers fetched successfully"));
});

// add comment on an answer
const addAnswerComment = asyncHandler(async (req, res) => {
  const { answerId } = req.params;
  const { message } = req.body;

  if (!message?.trim()) throw new ApiError(400, "Comment cannot be empty");

  const answer = await Answer.findByIdAndUpdate(
    answerId,
    {
      $push: {
        comments: { user: req.user._id, message },
      },
    },
    { new: true }
  ).populate("comments.user", "username avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, answer, "Comment added successfully"));
});

const updateAnswer = asyncHandler(async (req, res) => {
  const { answerId } = req.params;
  const { content = "" } = req.body;
  const userId = req.user._id;

  const answer = await Answer.findById(answerId);
  if (!answer) throw new ApiError(404, "Answer not found");

  if (answer.answeredBy.toString() !== userId.toString()) {
    throw new ApiError(403, "Not authorized to edit this answer");
  }

  const hasExistingImages = getStoredImages(answer).length > 0;
  if (!content.trim() && !hasExistingImages) {
    throw new ApiError(400, "Answer content or image is required");
  }

  answer.content = content;
  await answer.save();
  await answer.populate("answeredBy", "username fullName avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, answer, "Answer updated successfully"));
});

// delete answer
const deleteAnswer = asyncHandler(async (req, res) => {
  const { answerId } = req.params;
  const userId = req.user._id;

  // 1️⃣ Find the answer
  const answer = await Answer.findById(answerId);
  if (!answer) throw new ApiError(404, "Answer not found");

  // 2️⃣ Authorization check
  if (answer.answeredBy.toString() !== userId.toString()) {
    throw new ApiError(403, "Not authorized to delete this answer");
  }

  // 3️⃣ Remove answer reference from its question
  await Question.findByIdAndUpdate(answer.question, {
    $pull: { answers: answerId },
  });

  // 4️⃣ Delete all upvotes related to this answer
  await Upvote.deleteMany({ answer: answerId });

  // 5️⃣ Delete the answer itself
  await deleteStoredImages(answer);
  await Answer.findByIdAndDelete(answerId);

  // 6️⃣ Recalculate the author's reputation
  await recalculateUserReputation(answer.answeredBy);

  // 7️⃣ Send success response
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Answer deleted successfully"));
});

export { addAnswer, getAnswersByQuestion, addAnswerComment, updateAnswer, deleteAnswer };
