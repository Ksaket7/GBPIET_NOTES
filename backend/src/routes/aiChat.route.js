import express from "express";
import { sendAiMessage } from "../controllers/aiChat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { aiUpload } from "../middlewares/aiUpload.middleware.js";

const router = express.Router();

router.route("/health").get((req, res) =>
  res.status(200).json({
    success: true,
    message: "AI chat route is active",
    data: {
      configured: Boolean(process.env.GEMINI_API_KEY),
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      googleSearch: process.env.GEMINI_ENABLE_GOOGLE_SEARCH !== "false",
    },
  })
);

router
  .route("/message")
  .post(verifyJWT, aiUpload.array("files", 4), sendAiMessage);

export default router;
