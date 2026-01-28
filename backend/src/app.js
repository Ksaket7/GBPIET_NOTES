import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware.js";
const app = express();

// middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes import
import userRoutes from "./routes/user.route.js";
import noteRoutes from "./routes/note.route.js";
import upvoteRoutes from "./routes/upvote.route.js";
import followRoutes from "./routes/follow.route.js";
import questionRoutes from "./routes/question.route.js";
import answerRoutes from "./routes/answer.route.js";

// routes declaration
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/notes", noteRoutes);
app.use("/api/v1/upvotes", upvoteRoutes);
app.use("/api/v1/follows", followRoutes);
app.use("/api/v1/questions", questionRoutes);
app.use("/api/v1/answers", answerRoutes);
app.use(errorHandler);
export { app };
