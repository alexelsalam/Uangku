import { useApp } from "../../hooks/useAppContext";
import { Transaction } from "../../types";
import { exportTransactionsToCsv } from "../../utils/exportCsv";

export function handleExport(
  transactions: Transaction[],
  showToast?: (message: string) => void,
) {
  // filter dulu sesuai range yang aktif, misal bulan berjalan
  if (transactions.length === 0) {
    showToast?.("Tidak ada data transaksi untuk diexport");
    return;
  }
  exportTransactionsToCsv(transactions, `transaksi_juli_2026.csv`);
}
