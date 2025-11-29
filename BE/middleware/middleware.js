import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
function middleware(req, res, next) {
  // Cek apakah ada header Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  // Cek apakah token valid (misalnya, token harus berupa "Bearer <token>")
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
