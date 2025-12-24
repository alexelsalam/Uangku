// routes/transactions.js
import express from "express";
import db from "../db/database.js";
const router = express.Router();

// Ambil transaksi berdasarkan rentang tanggal
router.get("/date", (req, res) => {
  const username = req.user; // Menggunakan user_id dari middleware
  const { start, end } = req.query;
  console.log("Start:", start, "End:", end);
  if (!start || !end) {
    return res
      .status(400)
      .json({ error: "Parameter start dan end harus disertakan" });
  }

  const query = `
    SELECT * FROM transactions 
    WHERE users_id = ? AND tanggal BETWEEN ? AND ?
    ORDER BY tanggal ASC
  `;

  db.all(query, [username, start, end], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Ambil transaksi berdasarkan kategori
router.get("/", (req, res) => {
  const username = req.user;
  const { id, tipe, kategori, min, max, pembayaran, dari, sampai } = req.query;
  let query = `SELECT * FROM transactions WHERE users_id = ?`;
  const params = [username]; // Menggunakan user_id dari middleware
  if (id) {
    query += ` AND id = ?`;
    params.push(id);
  }
  if (tipe) {
    query += ` AND tipe = ?`;
    params.push(tipe);
  }
  if (kategori) {
    query += ` AND kategori = ?`;
    params.push(kategori);
  }
  if (min && max) {
    query += ` AND jumlah BETWEEN ? AND ?`;
    params.push(min, max);
  }
  if (pembayaran) {
    query += ` AND  pembayaran = ?`;
    params.push(pembayaran);
  }
  if (dari && sampai) {
    query += `AND tanggal BETWEEN ? AND ?`;
    params.push(dari, sampai);
  }

  query += `ORDER BY tanggal DESC`; // Urutkan berdasarkan tanggal terbaru

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});
//jumlah pengeluaran bulan ini
router.get("/pengeluaran/total", (req, res) => {
  const { mm, yy } = req.query;
  // jika mm dan yy tidak ada, gunakan bulan dan tahun sekarang
  const year = yy || new Date().getFullYear();
  const month = mm ? parseInt(mm, 10) : new Date().getMonth() + 1;
  // validasi bulan
  if (month < 1 || month > 12) {
    return res.status(400).json({ error: "Bulan tidak valid" });
  }

  // validasi tahun
  if (year < 2000 || year > new Date().getFullYear()) {
    return res.status(400).json({ error: "Tahun tidak valid" });
  }

  // buat rentang tanggal 1 sampai akhir bulan
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const end = new Date(year, month, 0).toISOString().split("T")[0]; // akhir bulan

  console.log(start, end);
  const query = `
    SELECT SUM(jumlah) AS total
    FROM transactions
    WHERE users_id = ? AND tipe = 'Pengeluaran'
    AND tanggal BETWEEN ? AND ?
  `;

  db.get(query, [req.user, start, end], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    console.log(row);
    res.json({ month: `${month}-${year}`, total: row.total || 0 });
  });
});

// jumlah pemasukan bulan ini
router.get("/pemasukan/total", (req, res) => {
  const { mm, yy } = req.query;
  // jika mm dan yy tidak ada, gunakan bulan dan tahun sekarang
  const year = yy || new Date().getFullYear();
  const month = mm ? parseInt(mm, 10) : new Date().getMonth() + 1;
  // validasi bulan
  if (month < 1 || month > 12) {
    return res.status(400).json({ error: "Bulan tidak valid" });
  }

  // validasi tahun
  if (year < 2000 || year > new Date().getFullYear()) {
    return res.status(400).json({ error: "Tahun tidak valid" });
  }

  // buat rentang tanggal 1 sampai akhir bulan
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const end = new Date(year, month, 0).toISOString().split("T")[0]; // akhir bulan

  console.log(start, end);
  const query = `
    SELECT SUM(jumlah) AS total
    FROM transactions
    WHERE users_id = ? AND tipe = 'Pemasukan'
    AND tanggal BETWEEN ? AND ?
  `;

  db.get(query, [req.user, start, end], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    console.log(row);
    res.json({ month: `${month}-${year}`, total: row.total || 0 });
  });
});
// Tambah transaksi
router.post("/", (req, res) => {
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
  const query = `INSERT INTO transactions (users_id,tipe, kategori, jumlah, admin, pembayaran, waktu, tanggal, catatan) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?)`;
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

  db.run(query, values, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// DELETE (delete transaction by id)
router.delete("/:id", (req, res) => {
  const username = req.user; // Menggunakan user_id dari middleware
  const { id } = req.params;

  const query = `DELETE FROM transactions WHERE users_id = ? AND id = ?`;

  db.run(query, [username, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ message: "Transaksi tidak ada" });
    res.json({ message: "transaksi berhasil dihapus" });
  });
});

// EDIT (update transaction by id)
router.put("/:id", (req, res) => {
  const { tipe, kategori, jumlah, admin, pembayaran, waktu, tanggal, catatan } =
    req.body;
  const { id } = req.params;

  const query = `UPDATE transactions SET tipe = ?, kategori = ?, jumlah = ?, admin = ?, pembayaran = ?, waktu = ?, tanggal = ?, catatan = ? WHERE id = ?`;

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
  ];

  db.run(query, values, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ message: "Transaksi tidak ada" });
    res.json({ message: "Transaksi berhasil diperbarui" });
  });
});

// Ambil data untuk grafik bar
router.get("/data/bar", (req, res) => {
  const query = `
    SELECT
      strftime('%Y-%m', tanggal) AS date,
      SUM(CASE WHEN tipe = 'Pengeluaran' THEN jumlah ELSE 0 END) AS Pengeluaran,
      SUM(CASE WHEN tipe = 'Pemasukan' THEN jumlah ELSE 0 END) AS "Pemasukan"
    FROM transactions
    WHERE users_id = ?
    GROUP BY date
    ORDER BY date
  `;

  db.all(query, [req.user], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Ambil data untuk grafik pie
router.get("/data/pie", (req, res) => {
  const query = `
    SELECT 
  kategori,
  SUM(jumlah) AS jumlah
FROM transactions
WHERE users_id = ?
  AND tipe = 'Pengeluaran'
GROUP BY kategori;
`;

  db.all(query, [req.user], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});
export default router;
