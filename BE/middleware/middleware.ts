import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: string;
    }
  }
}
function middleware(req: Request, res: Response, next: NextFunction) {
  // Cek apakah ada header Authorization
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  // Cek apakah token valid (misalnya, token harus berupa "Bearer <token>")
  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET;

  // Check that JWT_SECRET exists
  if (!secret) {
    console.error("JWT_SECRET is not defined");
    res.status(500).json({ message: "Server configuration error" });
    return;
  }
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = decoded.username;
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }

  // Jika semua cek berhasil, lanjutkan ke middleware berikutnya
  next();
}

export default middleware;

// Catatan: Middleware ini hanya contoh sederhana.
// Dalam aplikasi nyata, Anda mungkin ingin menggunakan library seperti jsonwebtoken untuk memverifikasi token JWT.
// Pastikan untuk mengganti logika validasi token sesuai dengan kebutuhan aplikasi Anda.
