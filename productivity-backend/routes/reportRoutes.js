import express from "express";
import Usage from "../models/Usage.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/daily/:date", auth, async (req, res) => {
  const userId = req.user.userId;
  const { date } = req.params;

  const data = await Usage.find({ userId, date });

  res.json({
    date,
    totalTime: data.reduce((s, d) => s + d.timeSpent, 0),
    breakdown: data.map((d) => ({
      website: d.website,
      timeSpent: d.timeSpent,
    })),
  });
});

export default router;
