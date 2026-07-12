import pool from "../lib/db.js";
import type {
  TransactionPayload,
  TransactionFilter,
  DateRange,
  TotalResult,
} from "../types/transaction.types.js";

export async function findTransactions(
  userId: string,
  filter: TransactionFilter,
) {
  const conditions: string[] = ["users_id = $1"];
  const params: unknown[] = [userId];
  let idx = 2;

  const { id, tipe, kategori, min, max, pembayaran, dari, sampai } = filter;

  if (id) {
    conditions.push(`id = $${idx++}`);
    params.push(Number(id));
  }
  if (tipe) {
    conditions.push(`tipe = $${idx++}`);
    params.push(tipe);
  }
  if (kategori) {
    conditions.push(`kategori = $${idx++}`);
    params.push(kategori.trim());
  }
  if (pembayaran) {
    conditions.push(`pembayaran = $${idx++}`);
    params.push(pembayaran.trim());
  }

  if (min && max) {
    conditions.push(`jumlah BETWEEN $${idx} AND $${idx + 1}`);
    params.push(Number(min), Number(max));
    idx += 2;
  }

  if (dari && sampai) {
    conditions.push(`tanggal BETWEEN $${idx} AND $${idx + 1}`);
    params.push(dari, sampai);
  }

  const query = `
    SELECT * FROM transactions
    WHERE ${conditions.join(" AND ")}
    ORDER BY tanggal DESC, waktu DESC
  `;

  const result = await pool.query(query, params);
  return result.rows;
}

function calcChange(curr: number, prev: number): number {
  if (prev === 0) return curr === 0 ? 0 : 100;
  return Math.round(((curr - prev) / prev) * 1000) / 10; // 1 decimal
}

export async function getTotals(
  userId: string,
  range: DateRange,
  rangePrev: DateRange,
) {
  const query = `
    SELECT
      COALESCE(SUM(CASE WHEN tipe = 'Pemasukan'   THEN jumlah ELSE 0 END), 0)::integer AS pemasukan,
      COALESCE(SUM(CASE WHEN tipe = 'Pengeluaran' THEN jumlah ELSE 0 END), 0)::integer AS pengeluaran,
      COUNT(*)::integer AS total_transaksi
    FROM transactions
    WHERE users_id = $1
      AND tanggal BETWEEN $2 AND $3
  `;

  const [curr, prev] = await Promise.all([
    pool.query(query, [userId, range.dari, range.sampai]),
    pool.query(query, [userId, rangePrev.dari, rangePrev.sampai]),
  ]);

  const c = curr.rows[0];
  const p = prev.rows[0];

  const pemasukan = Number(c.pemasukan);
  const pengeluaran = Number(c.pengeluaran);
  const saldo = pemasukan - pengeluaran;
  const totalTrx = Number(c.total_transaksi);

  const pPemasukan = Number(p.pemasukan);
  const pPengeluaran = Number(p.pengeluaran);
  const pSaldo = pPemasukan - pPengeluaran;
  const pTotalTrx = Number(p.total_transaksi);

  return {
    dari: range.dari,
    sampai: range.sampai,
    pemasukan,
    pengeluaran,
    saldo,
    total_transaksi: totalTrx,
    perubahan: {
      pemasukan: calcChange(pemasukan, pPemasukan),
      pengeluaran: calcChange(pengeluaran, pPengeluaran),
      saldo: calcChange(saldo, pSaldo),
      total_transaksi: calcChange(totalTrx, pTotalTrx),
    },
  };
}

export async function createTransaction(
  userId: string,
  data: TransactionPayload,
) {
  const query = `
    INSERT INTO transactions
      (users_id, tipe, kategori, jumlah, pembayaran, waktu, tanggal, catatan)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id
  `;
  const values = [
    userId,
    data.tipe,
    data.kategori.trim(),
    data.jumlah,
    data.pembayaran.trim(),
    data.waktu,
    data.tanggal,
    data.catatan?.trim() ?? null,
  ];

  const result = await pool.query(query, values);
  return result.rows[0].id as number;
}

export async function updateTransaction(
  id: number,
  userId: string,
  data: TransactionPayload,
) {
  const query = `
    UPDATE transactions
    SET tipe = $1, kategori = $2, jumlah = $3,
        pembayaran = $4, waktu = $5, tanggal = $6, catatan = $7
    WHERE id = $8 AND users_id = $9
    RETURNING id
  `;
  const values = [
    data.tipe,
    data.kategori.trim(),
    data.jumlah,
    data.pembayaran.trim(),
    data.waktu,
    data.tanggal,
    data.catatan?.trim() ?? null,
    id,
    userId,
  ];

  const result = await pool.query(query, values);
  return result.rowCount ?? 0;
}

export async function deleteTransaction(id: number, userId: string) {
  const query = `
    DELETE FROM transactions
    WHERE id = $1 AND users_id = $2
    RETURNING id
  `;
  const result = await pool.query(query, [id, userId]);
  return result.rowCount ?? 0;
}

export async function getBarChartData(userId: string) {
  const query = `
    SELECT
      to_char(tanggal::date, 'YYYY-MM') AS bulan,
      COALESCE(SUM(CASE WHEN tipe = 'Pengeluaran' THEN jumlah ELSE 0 END), 0)::integer AS pengeluaran,
      COALESCE(SUM(CASE WHEN tipe = 'Pemasukan'   THEN jumlah ELSE 0 END), 0)::integer AS pemasukan
    FROM transactions
    WHERE users_id = $1
      AND EXTRACT(YEAR FROM tanggal::date) = EXTRACT(YEAR FROM CURRENT_DATE)
    GROUP BY to_char(tanggal::date, 'YYYY-MM')
    ORDER BY bulan ASC
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
}

export async function getPieChartData(
  userId: string,
  tipe: string,
  range: DateRange,
) {
  const query = `
    SELECT
      kategori,
      COALESCE(SUM(jumlah), 0)::integer AS jumlah
    FROM transactions
    WHERE users_id = $1
      AND tipe = $2
      AND tanggal BETWEEN $3 AND $4
    GROUP BY kategori
    ORDER BY jumlah DESC
  `;
  const result = await pool.query(query, [
    userId,
    tipe,
    range.dari,
    range.sampai,
  ]);
  return result.rows;
}
