import express from "express";
import {
  toggleUpvote,
  getUpvoteCount,
  getUpvoters,
} from "../controllers/upvote.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/:type/:id/toggle").post(verifyJWT, toggleUpvote);

router.route("/:type/:id/count").get(getUpvoteCount);

router.route("/:type/:id/users").get(getUpvoters);

export default router;
