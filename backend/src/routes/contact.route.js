import express from "express";
import { sendContactMessage } from "../controllers/contact.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.use(verifyJWT);

router.route("/").post(sendContactMessage);

export default router;
