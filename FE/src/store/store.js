import { create } from "zustand";

export const useAppStore = create((set) => ({
  data: [],
  shouldRefetch: false,

  setData: (data) => set({ data }),

  triggerRefetch: () =>
    set((state) => ({
      shouldRefetch: !state.shouldRefetch,
    })),
}));
