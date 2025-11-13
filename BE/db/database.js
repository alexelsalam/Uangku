import sqlite3 from 'sqlite3';

sqlite3.verbose();

const db = new sqlite3.Database('./catatan_uang.db');
// Buat tabel jika belum ada
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipe TEXT NOT NULL CHECK(tipe IN ('Pemasukan', 'Pengeluaran')),
      kategori TEXT NOT NULL,
      jumlah INTEGER NOT NULL,
      admin TEXT NOT NULL,
      pembayaran TEXT NOT NULL,
      waktu TEXT NOT NULL,
      tanggal TEXT NOT NULL,
      catatan TEXT
    )
  `);
});

export default db;
