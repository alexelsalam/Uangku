export type Tipe = "Pemasukan" | "Pengeluaran";
export type Period = "Bulanan" | "Mingguan" | "3 Bulan" | "Tahunan";
export interface Transactions {
  id: number;
  kategori: string;
  catatan: string;
  jumlah: number;
  pembayaran: string;
  tipe: Tipe;
  admin: string;
  waktu: string;
  tanggal: string;
}
export interface Payload {
  users_id: string;
  tipe: Tipe;
  kategori: string;
  jumlah: number;
  admin: string;
  pembayaran: string;
  waktu: string;
  tanggal: string;
  catatan?: string;
}
