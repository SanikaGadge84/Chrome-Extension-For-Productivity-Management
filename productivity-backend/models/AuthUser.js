import mongoose from "mongoose";

const authUserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },

  blockedSites: {
    type: [String],
    default: [],
  },
});

export default mongoose.model("AuthUser", authUserSchema);
