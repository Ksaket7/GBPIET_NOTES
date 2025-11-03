import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyRole } from "../middlewares/role.middleware.js";
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

router.route("/").get(getAllNotes);
router.route("/subject/:subjectCode").get(getNoteBySubjectCode);
router.route("/:noteId").get(getNoteById);

router.use(verifyJWT);

router
  .route("/upload")
  .post(verifyRole("cr", "faculty"), upload.single("file"), uploadNote);

router.route("/:noteId/comment").post(addComment);

router.route("/:noteId").delete(deleteNote);

export default router;
