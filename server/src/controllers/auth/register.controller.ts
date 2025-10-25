import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { KeyService } from "../services/key.service";
import { logger } from "../utils/logger";

const router = express.Router();

// register
router.post("/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already exists" });

    const passwordHash = await bcrypt.hash(password, 10);

    // generate a personal key pair (demonstration; in prod user would store their private key)
    const { publicKey, privateKey } = KeyService.generateRsaKeyPair();

    const user = await User.create({ email, passwordHash, role: role || "user", publicKey });
    // DO NOT store private key in DB in prod. This is for demo only.
    logger.info(`Generated keypair for user ${email}`);

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" });

    res.json({ token, user: { id: user._id, email: user.email }, privateKey }); // privateKey returned so dev can use it
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const u = await User.findOne({ email });
  if (!u) return res.status(401).json({ error: "Invalid" });
  const ok = await bcrypt.compare(password, u.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid" });
  const token = jwt.sign({ id: u._id, role: u.role, wallet: u.walletAddress }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" });
  res.json({ token, user: { id: u._id, email: u.email, role: u.role, publicKey: u.publicKey } });
});

export default router;
