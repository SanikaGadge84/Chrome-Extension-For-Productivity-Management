import mongoose from "mongoose";

const usageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthUser",
      required: true,
      index: true,
    },

    date: {
      type: String, // YYYY-MM-DD
      required: true,
      index: true,
    },
    website: {
      type: String,
      required: true,
      index: true,
    },
    timeSpent: {
      type: Number, // seconds
      default: 0,
    },
  },
  { timestamps: true },
);

/**
 * IMPORTANT:
 * Prevent duplicate rows for same site on same day
 */
usageSchema.index({ userId: 1, date: 1, website: 1 }, { unique: true });

export default mongoose.model("Usage", usageSchema);
