import express from "express";
import Usage from "../models/Usage.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/track", auth, async (req, res) => {
  const { website, seconds } = req.body;
  const userId = req.user.id; // ✅ FIXED

  if (!website || !seconds) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  const today = new Date().toISOString().split("T")[0];

  await Usage.findOneAndUpdate(
    { userId, date: today, website },
    { $inc: { timeSpent: seconds } },
    { upsert: true, new: true },
  );

  res.json({ success: true });
});

export default router;
