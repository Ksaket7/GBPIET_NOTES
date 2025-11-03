import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  toggleFollow,
  getFollowerCount,
  getFollowersAndFollowing,
} from "../controllers/follow.controller.js";

const router = express.Router();

router.use(verifyJWT);

router.route("/toggle/:userId").post(toggleFollow);

router.route("/:userId/details").get(getFollowersAndFollowing);

router.route("/:userId/count").get(getFollowerCount);

export default router;
