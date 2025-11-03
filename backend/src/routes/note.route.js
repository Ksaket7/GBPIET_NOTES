import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  uploadNote,
  getAllNotes,
  deleteNote,
} from "../controllers/note.controller.js";

const router = express.Router();

router.post("/upload", verifyJWT, uploadNote);
router.get("/", getAllNotes);
router.delete("/:noteId", verifyJWT, deleteNote);

export default router;
