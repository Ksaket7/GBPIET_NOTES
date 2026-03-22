import mongoose, { isValidObjectId } from "mongoose";
import { Note } from "../models/note.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  uploadOnSupabase,
  deleteFromSupabase,
} from "../utils/supabaseStorage.js";
import { Upvote } from "../models/upvote.model.js";
import { recalculateUserReputation } from "../utils/updateUserReputation.js";

const getAllNotes = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    subjectCode,
    type,
    sortBy = "createdAt",
    sortType = "desc",
    mine = false,
  } = req.query;
  const filter = {};

  if (mine === "true") {
    filter.originalStudent = req.user._id;
  }

  if (query) {
    const regex = new RegExp(query, "i");
    filter.$or = [{ title: regex }, { description: regex }, { subject: regex }];
  }
  if (subjectCode) filter.subjectCode = subjectCode;
  if (type) filter.type = type;
  const totalNotes = await Note.countDocuments(filter);
  const notes = await Note.find(filter)
    .populate("uploadedBy", "fullName username role avatar")
    .populate("originalStudent", "fullName username role avatar")
    .sort({ [sortBy]: sortType === "desc" ? -1 : 1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        notes,
        pagination: {
          totalResult: totalNotes,
          totalPages: Math.ceil(totalNotes / limit),
          currentPage: Number(page),
          limit: Number(limit),
        },
      },
      "Notes fetched successfully"
    )
  );
});

const uploadNote = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    subjectName,
    subjectCode,
    type,
    tags,
    originalStudentUsername,
  } = req.body;

  if (!title || !subjectCode) {
    throw new ApiError(400, "Title and subject code are required");
  }

  if (!req.file) {
    throw new ApiError(400, "File is required");
  }

  // ✅ handle optional original student safely
  let originalStudentId = null;

  if (originalStudentUsername) {
    const studentUser = await User.findOne({
      username: originalStudentUsername,
    });

    if (!studentUser) {
      throw new ApiError(404, "No user found with that username");
    }

    if (!isValidObjectId(studentUser._id)) {
      throw new ApiError(400, "Invalid original student ID");
    }

    originalStudentId = studentUser._id;
  }

  // ✅ NEW: use buffer instead of path
  const fileBuffer = req.file.buffer;
  const fileName = req.file.originalname;

  const fileUrl = await uploadOnSupabase(fileBuffer, fileName, "notes");

  if (!fileUrl) {
    throw new ApiError(500, "Error uploading file to Supabase");
  }

  const note = await Note.create({
    title,
    description,
    subjectName,
    subjectCode,
    type: type || "notes",
    tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
    fileUrl,
    uploadedBy: req.user._id,
    originalStudent: originalStudentId,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, note, "Note uploaded successfully"));
});

const getNoteById = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  if (!isValidObjectId(noteId)) {
    throw new ApiError(400, "Invalid Note id");
  }

  const note = await Note.findById(noteId)
    .populate("uploadedBy", "fullName username avatar")
    .populate("originalStudent", "fullName username email")
    .populate("comments.user", "username avatar");

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, note, "Note fecthed successfully"));
});

const addComment = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  const { message } = req.body;

  if (!message) {
    throw new ApiError(400, "Comment message is required");
  }

  if (!isValidObjectId(noteId)) {
    throw new ApiError(400, "Invalid note ID");
  }

  const note = await Note.findById(noteId);
  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  note.comments.push({
    user: req.user._id,
    message,
    createdAt: new Date(),
  });

  await note.save();

  return res
    .status(200)
    .json(new ApiResponse(200, note.comments, "Comment added successfully"));
});

const deleteNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;

  if (!isValidObjectId(noteId)) {
    throw new ApiError(400, "Invalid Note ID");
  }

  const note = await Note.findById(noteId);
  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  if (note.uploadedBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this note");
  }

  // ✅ Extract relative file path correctly
  let filePath = null;

  if (note.fileUrl) {
    const parts = note.fileUrl.split("/uploads/");
    filePath = parts[1];
  }

  if (filePath) {
    // Remove leading slash if present
    filePath = filePath.startsWith("/") ? filePath.slice(1) : filePath;

    // Delete file from Supabase
    await deleteFromSupabase(filePath);
  }
  // delete all upvotes linked to this note
  const upvotes = await Upvote.find({ note: noteId }).select("_id");

  const upvoteIds = upvotes.map((u) => u._id);

  // remove upvote references from note
  await Note.findByIdAndUpdate(noteId, {
    $pull: { upvotes: { $in: upvoteIds } },
  });

  // delete upvote documents
  await Upvote.deleteMany({ note: noteId });

  // delete note
  // delete note
  await Note.findByIdAndDelete(noteId);

  // try reputation recalculation, but DO NOT fail deletion
  try {
    if (note.originalStudent) {
      // console.log("i can reach here",note.originalStudent);
      await recalculateUserReputation(note.originalStudent);
    }
  } catch (err) {
    console.error(
      "Reputation recalculation failed after note deletion:",
      err.message
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Note deleted successfully"));
});

const getNoteBySubjectCode = asyncHandler(async (req, res) => {
  const { subjectCode } = req.params;

  if (!subjectCode) {
    throw new ApiError(400, "Subject Code is required");
  }

  const notes = await Note.find({ subjectCode })
    .populate("uploadedBy", "fullName username role avatar")
    .populate("originalStudent", "fullName username avatar")
    .sort({ createdAt: -1 });

  if (!notes || notes.length === 0) {
    throw new ApiError(404, "No notes found for this subject code");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, notes, "Notes fetched successfully"));
});

export {
  getAllNotes,
  uploadNote,
  getNoteById,
  addComment,
  deleteNote,
  getNoteBySubjectCode,
};
