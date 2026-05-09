import express from "express";
import {
  askQuestion,
  getAllQuestions,
  getQuestionById,
  deleteQuestion,
} from "../controllers/question.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { postUpload } from "../middlewares/postUpload.middleware.js";

const router = express.Router();

router.route("/").get(getAllQuestions);

router.route("/ask").post(verifyJWT, postUpload.single("image"), askQuestion);

router.route("/:questionId").get(getQuestionById);

router.route("/:questionId").delete(verifyJWT, deleteQuestion);

export default router;
