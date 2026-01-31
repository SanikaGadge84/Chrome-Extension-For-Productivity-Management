import express from "express";
import User from "../models/AuthUser.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Get logged-in user
router.get("/me", auth, async (req, res) => {
  let user = await User.findById(req.userId);

  if (!user) {
    user = await User.create({
      _id: req.userId,
      email: req.userEmail || "unknown",
      blockedSites: [],
    });
  }

  res.json({
    blockedSites: user.blockedSites || [],
  });
});

// Block site
router.post("/block", auth, async (req, res) => {
  const { site } = req.body;

  if (!site) return res.status(400).json({ error: "Site required" });

  await User.findByIdAndUpdate(req.userId, {
    $addToSet: { blockedSites: site },
  });

  res.json({ success: true });
});

// Unblock site
router.post("/unblock", auth, async (req, res) => {
  const { site } = req.body;

  await User.findByIdAndUpdate(req.userId, {
    $pull: { blockedSites: site },
  });

  res.json({ success: true });
});

export default router;
