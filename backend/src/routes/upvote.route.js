import express from "express";
import {
  toggleUpvote,
  getUpvoteCount,
  getUpvoters,
} from "../controllers/upvote.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:type/:id", verifyJWT, toggleUpvote);
router.get("/:type/:id/count", getUpvoteCount);
router.get("/:type/:id/users", getUpvoters);

export default router;
