import { create } from "zustand";
import apiData from "../api/apiData";
import { TotalResult } from "../types";

type StoreState = {
  month: number;
  year: number;
  total: TotalResult;
  allTransactions: any[];
  getAllTransactions: (
    params?: string | null,
    query?: string,
  ) => void | Promise<void>;
  dataBarTransactions: any[];
  getDataBarTransactions: () => void | Promise<void>;

  dataPieTransactions: any[];
  getDataPieTransactions: (query?: string) => void | Promise<void>;
  getTotal: (query?: string) => void | Promise<void>;
  loading: boolean;
  error: string | null;
  shouldRefetch: boolean;
  triggerRefetch: () => void;
  setMonth: (month: number) => void;
  setYear: (year: number) => void;
};
const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "An unknown error occurred";
};

export const useAppStore = create<StoreState>((set) => {
  const now = new Date();
  return {
    month: now.getMonth(),
    year: now.getFullYear(),
    total: {
      dari: "",
      sampai: "",
      pemasukan: 0,
      pengeluaran: 0,
      saldo: 0,
      total_transaksi: 0,
    },
    allTransactions: [],
    dataBarTransactions: [],
    dataPieTransactions: [],
    loading: false,
    shouldRefetch: false,
    error: null,
    triggerRefetch: () =>
      set((state) => ({
        shouldRefetch: !state.shouldRefetch,
      })),

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
    getDataPieTransactions: async (query?: string) => {
      set({ loading: true });
      try {
        const data = await apiData("data/pie", query);
        set({ dataPieTransactions: data, loading: false });
      } catch (err) {
        set({ error: getErrorMessage(err), loading: false });
      }
    },

    setMonth: (month: number) => set({ month }),
    setYear: (year: number) => set({ year }),
    getTotal: async (query?: string) => {
      set({ loading: true });
      try {
        const data = await apiData("total", query);
        set({ total: data, loading: false });
      } catch (err) {
        set({ error: getErrorMessage(err), loading: false });
      }
    },
  };
});
