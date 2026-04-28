import express from "express";
import {
  addPostComment,
  createPost,
  deletePost,
  getAllPosts,
  updatePost,
} from "../controllers/post.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { postUpload } from "../middlewares/postUpload.middleware.js";

const router = express.Router();

router.route("/").get(getAllPosts);

router.use(verifyJWT);

router.route("/").post(postUpload.single("image"), createPost);
router.route("/:postId/comment").post(addPostComment);
router
  .route("/:postId")
  .patch(postUpload.single("image"), updatePost)
  .delete(deletePost);

export default router;
