import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    text: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
        message: { type: String, trim: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

postSchema.pre("validate", function (next) {
  if (!this.text && !this.imageUrl) {
    next(new Error("Post must contain text, image, or both"));
    return;
  }

  next();
});

export const Post = mongoose.model("Post", postSchema);
