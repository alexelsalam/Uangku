// routes/transactions.js
import express from "express";
import db from "../db/database.js";
const router = express.Router();

// Ambil transaksi berdasarkan rentang tanggal
router.get("/date", (req, res) => {
  const { start, end } = req.query;
  console.log("Start:", start, "End:", end);
  if (!start || !end) {
    return res
      .status(400)
      .json({ error: "Parameter start dan end harus disertakan" });
  }

  const query = `
    SELECT * FROM transactions 
    WHERE tanggal BETWEEN ? AND ?
    ORDER BY tanggal ASC
  `;

  db.all(query, [start, end], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Ambil transaksi berdasarkan kategori
router.get("/transaksi/:user_id", (req, res) => {
  const { user_id } = req.params;
  const { id, tipe, kategori, min, max, pembayaran, dari, sampai } = req.query;
  let query = `SELECT * FROM transactions WHERE users_id = ?`;
  const params = [user_id];
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

  query += `ORDER BY tanggal ASC`;

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

router.get("/expenses/total", (req, res) => {
  const now = new Date();

  // ambil bulan dan tahun sekarang
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  // buat rentang tanggal 1 sampai akhir bulan
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const end = new Date(year, month, 0).toISOString().split("T")[0]; // akhir bulan

  console.log(start, end);
  const query = `
    SELECT SUM(jumlah) AS total
    FROM transactions
    WHERE tipe = 'Pengeluaran'
    AND tanggal BETWEEN ? AND ?
  `;

  db.get(query, [start, end], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    console.log(row);
    res.json({ month: `${month}-${year}`, total: row.total || 0 });
  });
});

// Tambah transaksi
router.post("/transaksi", (req, res) => {
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
  const { id } = req.params;

  const query = `DELETE FROM transactions WHERE id = ?`;

  db.run(query, id, function (err) {
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

export default router;
