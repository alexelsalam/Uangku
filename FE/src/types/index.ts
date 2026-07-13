export type GroupId = "needs" | "wants" | "investment";
export interface CustomJwtPayload {
  username: string;
  exp: number;
  // Add other fields your token contains
}
export type TransactionType = "Pemasukan" | "Pengeluaran";

export interface MonthRange {
  from: string; // "2026-07-01"
  to: string; // "2026-07-31"
}
export interface TotalResult {
  dari: string;
  sampai: string;
  pemasukan: number;
  pengeluaran: number;
  saldo: number;
  total_transaksi: number;
  perubahan: {
    pemasukan: number;
    pengeluaran: number;
    saldo: number;
    total_transaksi: number;
  };
}
