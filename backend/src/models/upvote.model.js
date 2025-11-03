import mongoose, { Schema } from "mongoose";

const upvoteSchema = new Schema(
  {
    note: {
      type: Schema.Types.ObjectId,
      ref: "Note",
    },
    question: {
      type: Schema.Types.ObjectId,
      ref: "Question",
    },
    answer: {
      type: Schema.Types.ObjectId,
      ref: "Answer",
    },
    upvotedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Upvote = mongoose.model("Upvote", upvoteSchema);
