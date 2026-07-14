import { CATEGORIES } from "../data/catergoryMeta";
import { Transaction } from "../types";

/** Escape value untuk CSV — wrap dengan quote kalau ada koma, newline, atau quote */
function escapeCsvValue(val: unknown): string {
  const str = val === null || val === undefined ? "" : String(val);
  return /[",\n\r]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

/** Convert array transaksi jadi string CSV */
function toCsvString(transactions: Transaction[]): string {
  const headers = ["Tanggal", "Waktu", "Tipe", "Kategori", "Jumlah", "Catatan"];

  const rows = transactions.map((tx) => {
    const catName =
      CATEGORIES.find((c) => c.id === tx.kategori)?.id ?? tx.kategori;
    return [
      tx.tanggal,
      tx.waktu,
      tx.tipe === "Pengeluaran" ? "Pengeluaran" : "Pemasukan",
      catName,
      tx.jumlah,
      tx.catatan,
    ]
      .map(escapeCsvValue)
      .join(",");
  });

  return [headers.join(","), ...rows].join("\r\n");
}

/** Trigger download CSV di browser tanpa dependency tambahan */
export function exportTransactionsToCsv(
  transactions: Transaction[],
  filename = "transaksi.csv",
): void {
  const csv = toCsvString(transactions);

  // BOM supaya Excel baca karakter Indonesia (é, dsb) dengan benar
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
