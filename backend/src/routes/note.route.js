import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  uploadNote,
  getAllNotes,
  deleteNote,
  getNoteBySubjectCode,
  addComment,
  getNoteById,
} from "../controllers/note.controller.js";

const router = express.Router();

router.get("/", getAllNotes);
router.get("/subject/:subjectCode", getNoteBySubjectCode);
router.get("/:noteId", getNoteById);
router.post("/upload", verifyJWT, upload.single("file"), uploadNote);
router.post("/:noteId/comment", verifyJWT, addComment);
router.delete("/:noteId", verifyJWT, deleteNote);

export default router;
