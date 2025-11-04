import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  toggleFollow,
  getUserFollowers,
  getUserFollowing,
} from "../controllers/follow.controller.js";

const router = express.Router();

router.use(verifyJWT);

router.route("/toggle/:userId").post(toggleFollow);

router.route("/:userId/followers").get(getUserFollowers);

router.route("/:userId/following").get(getUserFollowing);

export default router;
