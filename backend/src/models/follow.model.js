import mongoose, { Schema } from "mongoose";

const followSchema = new Schema(
  {
    follower: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true, // person who follows
    },
    following: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true, // person being followed
    },
  },
  { timestamps: true }
);

// prevent duplicate follows
followSchema.index({ follower: 1, following: 1 }, { unique: true });

export const Follow = mongoose.model("Follow", followSchema);
