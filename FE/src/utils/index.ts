import { clsx, type ClassValue } from "clsx";
import { Transactions } from "./interfaces";
// import type { Transaction } from '@/types'

// ─── cn helper ───────────────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// ─── Currency ────────────────────────────────────────────────────────────────
export function formatIDR(amount: number, compact = false): string {
  if (compact) {
    if (amount >= 1_000_000)
      return `${(amount / 1_000_000).toFixed(1).replace(".0", "")}Jt`;
    if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K`;
    return amount.toString();
  }
  return new Intl.NumberFormat("id-ID").format(amount);
}

// ─── Dates ───────────────────────────────────────────────────────────────────
const DAY_NAMES = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];
const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

export function formatDate(isoDate: string): string {
  const d = new Date(isoDate);
  return `${DAY_NAMES[d.getDay()]}, ${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatMonthYear(isoDate: string): string {
  const d = new Date(isoDate);
  return `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

export function monthShort(monthIndex: number): string {
  return MONTH_SHORT[monthIndex] ?? "";
}

export function isToday(isoDate: string): boolean {
  return isoDate === new Date().toISOString().slice(0, 10);
}

export function isYesterday(isoDate: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return isoDate === yesterday.toISOString().slice(0, 10);
}

export function friendlyDate(isoDate: string): string {
  if (isToday(isoDate)) return "Hari ini";
  if (isYesterday(isoDate)) return "Kemarin";
  const d = new Date(isoDate);
  return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;
}

/** Group transactions by date label */
export function groupByDate(
  txs: Transactions[],
): Record<string, Transactions[]> {
  return txs.reduce<Record<string, Transactions[]>>((acc, tx) => {
    const label = friendlyDate(tx.tanggal);
    if (!acc[label]) acc[label] = [];
    acc[label].push(tx);
    return acc;
  }, {});
}

// ─── Numbers ─────────────────────────────────────────────────────────────────
export function pct(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}
// ─── Date Range Params ─────────────────────────────────────────────────────
export function getDateRangeParams(year: number | string, month: number) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const y = Number(year);
  const lastDay = new Date(y, month + 1, 0).getDate();

  const startStr = `${y}-${pad(month + 1)}-01`;
  const endStr = `${y}-${pad(month + 1)}-${lastDay}`;

  return { startStr, endStr, query: `dari=${startStr}&sampai=${endStr}` };
}
// CHECK TOKEN EXPIRED OR NO?

export function isTokenExpired(token: any) {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    return payload.exp < currentTime;
  } catch (e) {
    return true; // token rusak
  }
}
