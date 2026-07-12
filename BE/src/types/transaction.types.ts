export type TipeTransaksi = "Pemasukan" | "Pengeluaran";

export interface TransactionPayload {
  tipe: TipeTransaksi;
  kategori: string;
  jumlah: number;
  pembayaran: string;
  waktu: string;
  tanggal: string;
  catatan?: string;
}

export interface TransactionFilter {
  id?: string;
  tipe?: string;
  kategori?: string;
  min?: string;
  max?: string;
  pembayaran?: string;
  dari?: string;
  sampai?: string;
}

export interface DateRange {
  dari: string;
  sampai: string;
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
