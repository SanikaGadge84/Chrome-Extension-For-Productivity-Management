import express from "express";
import AuthUser from "../models/AuthUser.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email & password required" });

  const existingUser = await AuthUser.findOne({ email });
  if (existingUser)
    return res.status(400).json({ error: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);

  const user = await AuthUser.create({
    email,
    password: hashed,
  });

  res.json({ success: true, userId: user._id });
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email & password required" });

  const user = await AuthUser.findOne({ email });
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET, // ✅ ONLY THIS
    { expiresIn: "7d" },
  );

  res.json({ success: true, token, userId: user._id });
});

export default router;
