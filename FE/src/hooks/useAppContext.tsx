import { createContext, useContext, type ReactNode } from "react";
import { useAppState, type AppState } from "./useAppState";

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const state = useAppState();
  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}
