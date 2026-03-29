import { create } from "zustand";
import apiData from "../api/apiData";

type StoreState = {
  totalPemasukan: { total: number; month: string };
  totalPengeluaran: { total: number; month: string };
  getTotalPemasukan: () => void | Promise<void>;
  getTotalPengeluaran: () => void | Promise<void>;
  allTransactions: any[];
  getAllTransactions: (
    params?: string | null,
    query?: string,
  ) => void | Promise<void>;
  dataBarTransactions: any[];
  getDataBarTransactions: () => void | Promise<void>;
  dataPieTransactionsIN: any[];
  getDataPieTransactionsIN: () => void | Promise<void>;
  dataPieTransactionsOUT: any[];
  getDataPieTransactionsOUT: () => void | Promise<void>;
  loading: boolean;
  error: string | null;
  shouldRefetch: boolean;
  triggerRefetch: () => void;
};
const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return getErrorMessage(err);
  if (typeof err === "string") return err;
  return "An unknown error occurred";
};

export const useAppStore = create<StoreState>((set) => ({
  totalPengeluaran: { total: 0, month: "" },
  totalPemasukan: { total: 0, month: "" },
  allTransactions: [],
  dataBarTransactions: [],
  dataPieTransactionsIN: [],
  dataPieTransactionsOUT: [],
  loading: false,
  shouldRefetch: false,
  error: null,
  triggerRefetch: () =>
    set((state) => ({
      shouldRefetch: !state.shouldRefetch,
    })),
  getTotalPengeluaran: async () => {
    set({ loading: true });
    try {
      const data = await apiData("pengeluaran/total");
      set({ totalPengeluaran: data, loading: false });
    } catch (err) {
      set({ error: getErrorMessage(err), loading: false });
    }
  },
  getTotalPemasukan: async () => {
    set({ loading: true });
    try {
      const data = await apiData("pemasukan/total");
      set({ totalPemasukan: data, loading: false });
    } catch (err) {
      set({ error: getErrorMessage(err), loading: false });
    }
  },
  getAllTransactions: async (params?: string | null, query?: string) => {
    set({ loading: true });
    try {
      const data = await apiData(params, query);
      set({ allTransactions: data, loading: false });
    } catch (err) {
      set({ error: getErrorMessage(err), loading: false });
    }
  },
  getDataBarTransactions: async () => {
    set({ loading: true });
    try {
      const data = await apiData("data/bar");
      set({ dataBarTransactions: data, loading: false });
    } catch (err) {
      set({ error: getErrorMessage(err), loading: false });
    }
  },
  getDataPieTransactionsOUT: async () => {
    set({ loading: true });
    try {
      const data = await apiData("data/pie/pengeluaran");
      set({ dataPieTransactionsOUT: data, loading: false });
    } catch (err) {
      set({ error: getErrorMessage(err), loading: false });
    }
  },
  getDataPieTransactionsIN: async () => {
    set({ loading: true });
    try {
      const data = await apiData("data/pie/pemasukan");
      set({ dataPieTransactionsIN: data, loading: false });
    } catch (err) {
      set({ error: getErrorMessage(err), loading: false });
    }
  },
}));
