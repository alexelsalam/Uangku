// routes/transactions.js
import express from "express";
import pool from "../lib/db.js";
const router = express.Router();
// Ambil transaksi berdasarkan kategori
router.get("/", async (req, res) => {
  try {
    const userId = req.user; // dari middleware auth
    const { id, tipe, kategori, min, max, pembayaran, dari, sampai } =
      req.query;

    let query = `
      SELECT *
      FROM transactions
      WHERE users_id = $1
    `;

    const params = [userId];
    let idx = 2; // untuk $2, $3, dst

    if (id) {
      query += ` AND id = $${idx++}`;
      params.push(id);
    }

    if (tipe) {
      query += ` AND tipe = $${idx++}`;
      params.push(tipe);
    }

    if (kategori) {
      query += ` AND kategori = $${idx++}`;
      params.push(kategori);
    }

    if (min && max) {
      query += ` AND jumlah BETWEEN $${idx} AND $${idx + 1}`;
      params.push(min, max);
      idx += 2;
    }

    if (pembayaran) {
      query += ` AND pembayaran = $${idx++}`;
      params.push(pembayaran);
    }

    if (dari && sampai) {
      query += ` AND tanggal BETWEEN $${idx} AND $${idx + 1}`;
      params.push(dari, sampai);
      idx += 2;
    }

    query += ` ORDER BY tanggal DESC`;

    const result = await pool.query(query, params);

    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

//jumlah pengeluaran bulan ini
router.get("/pengeluaran/total", async (req, res) => {
  try {
    const now = new Date();

    // ambil bulan dan tahun sekarang
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    // buat rentang tanggal 1 sampai akhir bulan
    const start = `${year}-${String(month).padStart(2, "0")}-01`;
    const end = new Date(year, month, 0).toISOString().split("T")[0]; // akhir bulan

    const query = `
      SELECT COALESCE(SUM(jumlah), 0) AS total
      FROM transactions
      WHERE users_id = $1 AND tipe = 'Pengeluaran'
      AND tanggal BETWEEN $2 AND $3
    `;

    const result = await pool.query(query, [req.user, start, end]);
    const total = result.rows[0]?.total ?? 0;

    res.json({ month: `${month}-${year}`, total });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// jumlah pemasukan bulan ini
router.get("/pemasukan/total", async (req, res) => {
  try {
    const now = new Date();

    // ambil bulan dan tahun sekarang
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    // buat rentang tanggal 1 sampai akhir bulan
    const start = `${year}-${String(month).padStart(2, "0")}-01`;
    const end = new Date(year, month, 0).toISOString().split("T")[0]; // akhir bulan

    const query = `
      SELECT COALESCE(SUM(jumlah), 0) AS total
      FROM transactions
      WHERE users_id = $1 AND tipe = 'Pemasukan'
      AND tanggal BETWEEN $2 AND $3
    `;

    const result = await pool.query(query, [req.user, start, end]);
    const total = result.rows[0]?.total ?? 0;

    res.json({ month: `${month}-${year}`, total });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
// Tambah transaksi
router.post("/", async (req, res) => {
  try {
    const {
      users_id,
      tipe,
      kategori,
      jumlah,
      admin,
      pembayaran,
      waktu,
      tanggal,
      catatan,
    } = req.body;
    const query = `INSERT INTO transactions (users_id,tipe, kategori, jumlah, admin, pembayaran, waktu, tanggal, catatan) VALUES ($1,$2,$3, $4, $5, $6, $7, $8, $9)`;
    const values = [
      users_id,
      tipe,
      kategori,
      jumlah,
      admin,
      pembayaran,
      waktu,
      tanggal,
      catatan,
    ];
    const result = await pool.query(query, values);

    res.status(201).json({
      message: "Transaksi berhasil ditambahkan",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// DELETE (delete transaction by id)
router.delete("/:id", async (req, res) => {
  try {
    const username = req.user; // Menggunakan user_id dari middleware
    const { id } = req.params;
    if (!username || !id) {
      return res.status(400).json({ message: "Username atau ID tidak valid" });
    }
    const query = `DELETE FROM transactions WHERE users_id = $1 AND id = $2`;

    const result = await pool.query(query, [username, id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    }
    res.status(200).json({ message: "Transaksi berhasil dihapus" });
  } catch (error) {
    return res.status(500).json({ error: err.message });
  }
});

// EDIT (update transaction by id)
router.put("/:id", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Validasi input
    const {
      tipe,
      kategori,
      jumlah,
      admin,
      pembayaran,
      waktu,
      tanggal,
      catatan,
    } = req.body;
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "ID transaksi tidak valid" });
    }

    const query = `UPDATE transactions SET tipe = $1, kategori = $2, jumlah = $3, admin = $4, pembayaran = $5, waktu = $6, tanggal = $7, catatan = $8 WHERE id = $9 AND users_id = $10`;

    const values = [
      tipe,
      kategori,
      jumlah,
      admin,
      pembayaran,
      waktu,
      tanggal,
      catatan,
      id,
      req.user, // pastikan hanya pemilik yang bisa mengubah
    ];
    const result = await pool.query(query, values);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    }

    // Jika berhasil, kirim respons sukses
    res.status(200).json({ message: "Transaksi berhasil diperbarui" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Ambil data untuk grafik bar
router.get("/data/bar", async (req, res) => {
  try {
    const query = `
  SELECT
  to_char(tanggal::date, 'YYYY-MM') AS date,
  COALESCE(
    SUM(CASE WHEN tipe = 'Pengeluaran' THEN jumlah ELSE 0 END)::integer,
    0
  ) AS Pengeluaran,
  COALESCE(
    SUM(CASE WHEN tipe = 'Pemasukan' THEN jumlah ELSE 0 END)::integer,
    0
  ) AS Pemasukan
FROM transactions
WHERE users_id = $1
  AND EXTRACT(YEAR FROM tanggal::date) = EXTRACT(YEAR FROM CURRENT_DATE)
GROUP BY to_char(tanggal::date, 'YYYY-MM')
ORDER BY to_char(tanggal::date, 'YYYY-MM');

  `;

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await pool.query(query, [req.user]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No data found for this user" });
    }
    res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Ambil data untuk grafik pie
router.get("/data/pie", async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const query = `
      SELECT
        kategori,
        COALESCE(SUM(jumlah), 0)::integer AS jumlah
      FROM transactions
      WHERE users_id = $1
        AND tipe = 'Pengeluaran'
        AND to_char(tanggal::date, 'YYYY-MM') = to_char(CURRENT_DATE, 'YYYY-MM')
      GROUP BY kategori
      ORDER BY jumlah DESC;
    `;

    const result = await pool.query(query, [req.user]);
    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
export default router;
