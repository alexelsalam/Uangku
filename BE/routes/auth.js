import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db/database.js";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

// ➤ REGISTER USER
router.post("/userRegister", (req, res) => {
  const { username, password } = req.body;
  const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
  const values = [username, password];
  db.run(query, values, function (err) {
    if (err)
      return res
        .status(400)
        .json({ error: "username already used or", message: err.message });
    res.json({ message: "User registered" });
  });
});

// ➤ LOGIN USER
router.post("/userLogin", (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
  const values = [username, password];
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }
  db.get(query, values, async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    // Check if password matches
    // const valid = await bcrypt.compare(password, user.password);
    const valid = user.password === password; // For simplicity, using plain text comparison
    if (!valid) return res.status(400).json({ error: "Password salah" });
    // Generate JWT token
    const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token });
  });
});
export default router;
