import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import pool from "../lib/db.js";
import bcrypt from "bcryptjs";
dotenv.config();
const router = express.Router();

// ➤ REGISTER USER
router.post("/authRegister", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = "INSERT INTO users (username, password_hash) VALUES ($1, $2)";
    await pool.query(query, [username, hashedPassword]);
    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ LOGIN USER
router.post("/authLogin", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }
    const query = "SELECT * FROM users WHERE username = $1";

    const result = await pool.query(query, [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const user = result.rows[0];
    //  Bandingkan password input dengan hash di database
    // bcrypt.compare(password_polos, hash_dari_db)
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: "Username atau password salah" });
    }

    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
export default router;
