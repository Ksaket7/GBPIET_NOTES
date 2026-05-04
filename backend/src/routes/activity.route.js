import express from "express";
import { getRecentActivity } from "../controllers/activity.controller.js";

const router = express.Router();

router.route("/recent").get(getRecentActivity);

export default router;
