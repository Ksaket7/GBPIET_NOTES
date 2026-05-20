import express from "express";
import {
  addAnswer,
  getAnswersByQuestion,
  addAnswerComment,
  deleteAnswer,
} from "../controllers/answer.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { postUpload } from "../middlewares/postUpload.middleware.js";

const router = express.Router();

router.route("/:questionId").get(getAnswersByQuestion);

router.route("/:questionId").post(verifyJWT, postUpload.array("images", 6), addAnswer);

router.route("/:answerId/comment").post(verifyJWT, addAnswerComment);

router.route("/:answerId").delete(verifyJWT, deleteAnswer);

export default router;
