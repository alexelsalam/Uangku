// import { dummyData } from "../Data/dummyData";

export default function groupByDate(transactions) {
  const map = new Map();

  for (const tx of transactions) {
    if (!map.has(tx.tanggal)) {
      // Jika tanggal belum ada di map, buat array baru
      map.set(tx.tanggal, []);
    }
    // Tambahkan transaksi ke array yang sesuai dengan tanggalnya
    map.get(tx.tanggal).push(tx);
  }

  return Object.fromEntries(map); // kalau mau hasil akhir object biasa
}
