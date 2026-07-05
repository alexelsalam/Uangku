import { useCallback, useState } from "react";
import { CATEGORIES } from "../data/catergoryMeta";
import { GroupId } from "../types";

export interface AppState {
  // Budget
  budgets: Record<string, number>;
  setBudget: (categoryId: string, amount: number) => void;
  getBudget: (categoryId: string) => number | undefined;
  // Group assignment
  categoryGroups: Record<string, GroupId | null>;
  setGroup: (categoryId: string, groupId: GroupId | null) => void;
}
function buildDefaultBudgets(): Record<string, number> {
  return Object.fromEntries(
    CATEGORIES.filter((c) => c.budget !== undefined).map((c) => [
      c.id,
      c.budget!,
    ]),
  );
}
function buildDefaultGroups(): Record<string, GroupId | null> {
  return Object.fromEntries(
    CATEGORIES.filter((c) => c.groupId !== undefined).map(
      (c) => [c.id, c.groupId ?? null] as const,
    ),
  ) as Record<string, GroupId | null>;
}
export function useAppState(): AppState {
  const [categoryGroups, setCategoryGroups] =
    useState<Record<string, GroupId | null>>(buildDefaultGroups);
  const [budgets, setBudgets] =
    useState<Record<string, number>>(buildDefaultBudgets);
  const setBudget = useCallback((categoryId: string, amount: number) => {
    setBudgets((prev) => {
      if (amount <= 0) {
        const next = { ...prev };
        delete next[categoryId];
        return next;
      }
      return { ...prev, [categoryId]: amount };
    });
  }, []);

  const getBudget = useCallback(
    (categoryId: string) => budgets[categoryId],
    [budgets],
  );
  const setGroup = useCallback(
    (categoryId: string, groupId: GroupId | null) => {
      setCategoryGroups((prev) => ({ ...prev, [categoryId]: groupId }));
    },
    [],
  );
  return {
    categoryGroups,
    setGroup,
    budgets,
    setBudget,
    getBudget,
  };
}
