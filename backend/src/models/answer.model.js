import mongoose, { Schema } from "mongoose";

const answerSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },

    answeredBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    question: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },

    upvotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Upvote",
      },
    ],

    comments: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        message: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const Answer = mongoose.model("Answer", answerSchema);
