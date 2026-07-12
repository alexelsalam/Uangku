import type { Request, Response } from "express";
import * as service from "../services/transaction.service.js";
import * as validator from "../validators/transaction.validator.js";
import type {
  TransactionPayload,
  TransactionFilter,
} from "../types/transaction.types.js";

const SERVER_ERROR = "Terjadi kesalahan server";

export async function getTransactions(req: Request, res: Response) {
  try {
    const { id, tipe, kategori, min, max, pembayaran, dari, sampai } =
      req.query as Record<string, string | undefined>;

    // Validasi
    const dateError = validator.validateDateRange(dari, sampai);
    if (dateError) return res.status(400).json({ error: dateError });

    if (tipe && !["Pemasukan", "Pengeluaran"].includes(tipe))
      return res.status(400).json({ error: "tipe tidak valid" });
    if (min && isNaN(Number(min)))
      return res.status(400).json({ error: "min harus angka" });
    if (max && isNaN(Number(max)))
      return res.status(400).json({ error: "max harus angka" });

    const filter: TransactionFilter = {
      id,
      tipe,
      kategori,
      min,
      max,
      pembayaran,
      dari,
      sampai,
    };
    const rows = await service.findTransactions(req.user as string, filter);
    return res.json(rows);
  } catch (error) {
    console.error("getTransactions:", error);
    return res.status(500).json({ error: SERVER_ERROR });
  }
}

export async function getTotals(req: Request, res: Response) {
  try {
    const { dari, sampai } = req.query as Record<string, string | undefined>;

    const dateError = validator.validateDateRange(dari, sampai);
    if (dateError) return res.status(400).json({ error: dateError });

    const range = validator.resolveRange(dari, sampai);
    const rangePrev = validator.getPrevRange(range);

    const result = await service.getTotals(
      req.user as string,
      range,
      rangePrev,
    );
    return res.json(result);
  } catch (error) {
    console.error("getTotals:", error);
    return res.status(500).json({ error: SERVER_ERROR });
  }
}

export async function createTransaction(req: Request, res: Response) {
  try {
    const validationError = validator.validateTransactionPayload(req.body);
    if (validationError)
      return res.status(400).json({ error: validationError });

    const id = await service.createTransaction(
      req.user as string,
      req.body as TransactionPayload,
    );
    return res
      .status(201)
      .json({ message: "Transaksi berhasil ditambahkan", id });
  } catch (error) {
    console.error("createTransaction:", error);
    return res.status(500).json({ error: SERVER_ERROR });
  }
}

export async function updateTransaction(req: Request, res: Response) {
  try {
    const idError = validator.validateId(req.params.id as string);
    if (idError) return res.status(400).json({ error: idError });

    const validationError = validator.validateTransactionPayload(req.body);
    if (validationError)
      return res.status(400).json({ error: validationError });

    const affected = await service.updateTransaction(
      Number(req.params.id),
      req.user as string,
      req.body as TransactionPayload,
    );

    if (affected === 0)
      return res
        .status(404)
        .json({ error: "Transaksi tidak ditemukan atau bukan milik kamu" });

    return res.json({ message: "Transaksi berhasil diperbarui" });
  } catch (error) {
    console.error("updateTransaction:", error);
    return res.status(500).json({ error: SERVER_ERROR });
  }
}

export async function deleteTransaction(req: Request, res: Response) {
  try {
    const idError = validator.validateId(req.params.id as string);
    if (idError) return res.status(400).json({ error: idError });

    const affected = await service.deleteTransaction(
      Number(req.params.id),
      req.user as string,
    );

    if (affected === 0)
      return res
        .status(404)
        .json({ error: "Transaksi tidak ditemukan atau bukan milik kamu" });

    return res.json({ message: "Transaksi berhasil dihapus" });
  } catch (error) {
    console.error("deleteTransaction:", error);
    return res.status(500).json({ error: SERVER_ERROR });
  }
}

export async function getBarChart(req: Request, res: Response) {
  try {
    const rows = await service.getBarChartData(req.user as string);
    return res.json(rows);
  } catch (error) {
    console.error("getBarChart:", error);
    return res.status(500).json({ error: SERVER_ERROR });
  }
}

export async function getPieChart(req: Request, res: Response) {
  try {
    const { tipe, dari, sampai } = req.query as Record<
      string,
      string | undefined
    >;

    if (!tipe || !["Pemasukan", "Pengeluaran"].includes(tipe))
      return res
        .status(400)
        .json({ error: "tipe harus Pemasukan atau Pengeluaran" });

    const dateError = validator.validateDateRange(dari, sampai);
    if (dateError) return res.status(400).json({ error: dateError });

    const range = validator.resolveRange(dari, sampai);
    const rows = await service.getPieChartData(req.user as string, tipe, range);
    return res.json(rows);
  } catch (error) {
    console.error("getPieChart:", error);
    return res.status(500).json({ error: SERVER_ERROR });
  }
}
