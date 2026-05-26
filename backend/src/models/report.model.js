import mongoose, { Schema } from "mongoose";

const reportSchema = new Schema(
  {
    reporter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    reportedUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    reason: {
      type: String,
      trim: true,
      default: "Inappropriate content",
      maxlength: 300,
    },
  },
  { timestamps: true }
);

reportSchema.index({ reporter: 1, reportedUser: 1 }, { unique: true });

export const Report = mongoose.model("Report", reportSchema);
