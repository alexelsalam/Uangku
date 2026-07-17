import type {
  TransactionPayload,
  DateRange,
} from "../types/transaction.types.js";

export function isValidDate(d: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(d) && !isNaN(Date.parse(d));
}

export function resolveRange(dari?: string, sampai?: string): DateRange {
  if (dari && sampai) return { dari, sampai };
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  return {
    dari: `${year}-${String(month).padStart(2, "0")}-01`,
    sampai: new Date(year, month, 0).toISOString().slice(0, 10),
  };
}

export function validateTransactionPayload(
  body: Partial<TransactionPayload>,
): string | null {
  const { tipe, kategori, jumlah, pembayaran, waktu, tanggal } = body;

  if (!tipe || !["Pemasukan", "Pengeluaran"].includes(tipe))
    return "tipe harus Pemasukan atau Pengeluaran";
  if (!kategori || typeof kategori !== "string" || !kategori.trim())
    return "kategori tidak valid";
  if (
    !jumlah ||
    typeof jumlah !== "number" ||
    jumlah <= 0 ||
    !Number.isFinite(jumlah)
  )
    return "jumlah harus angka positif";
  if (!pembayaran || typeof pembayaran !== "string" || !pembayaran.trim())
    return "pembayaran tidak valid";
  if (!waktu || typeof waktu !== "string") return "waktu tidak valid";
  if (!tanggal || !isValidDate(tanggal))
    return "tanggal tidak valid (format: YYYY-MM-DD)";

  return null;
}

export function validateDateRange(
  dari?: string,
  sampai?: string,
): string | null {
  if (dari && !isValidDate(dari)) return "Format dari tidak valid (YYYY-MM-DD)";
  if (sampai && !isValidDate(sampai))
    return "Format sampai tidak valid (YYYY-MM-DD)";
  return null;
}

export function validateId(id: string): string | null {
  if (!id || isNaN(Number(id))) return "ID tidak valid";
  return null;
}
