import { create } from "zustand";
import apiData from "../api/apiData.js";

export const useAppStore = create((set) => ({
  totalPengeluaran: [],
  totalPemasukan: [],
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
      set({ error: err.message, loading: false });
    }
  },
  getTotalPemasukan: async () => {
    set({ loading: true });
    try {
      const data = await apiData("pemasukan/total");
      set({ totalPemasukan: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
  getAllTransactions: async (params, query) => {
    set({ loading: true });
    try {
      const data = await apiData(params, query);
      set({ allTransactions: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
  getDataBarTransactions: async () => {
    set({ loading: true });
    try {
      const data = await apiData("data/bar");
      set({ dataBarTransactions: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
  getDataPieTransactionsOUT: async () => {
    set({ loading: true });
    try {
      const data = await apiData("data/pie/pengeluaran");
      set({ dataPieTransactionsOUT: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
  getDataPieTransactionsIN: async () => {
    set({ loading: true });
    try {
      const data = await apiData("data/pie/pemasukan");
      set({ dataPieTransactionsIN: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
}));
