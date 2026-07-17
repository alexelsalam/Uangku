import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Plus, X, Check } from "lucide-react";
import { useAppStore } from "../store/store";
import { CATEGORIES } from "../data/catergoryMeta";
import { useApp } from "../hooks/useAppContext";
import { KANBAN_GROUPS } from "../data/catergoryMeta";
import { getDateRangeParams, pct } from "../utils";
import { GroupId } from "../types";
import { GroupCard } from "../components/ui/GroupCard";
import { EditSheet } from "../components/ui/EditSheet";
import { CatRow } from "../components/ui/CatRow";
import { useShallow } from "zustand/shallow";

// ─── Main Page ────────────────────────────────────────────────────────────────
export function BudgetPage() {
  const { budgets, setBudget, categoryGroups, setGroup, showToast } = useApp();
  const {
    total,
    dataPieTransactions,
    getDataPieTransactions,
    getTotal,
    month,
    year,
  } = useAppStore(
    useShallow((state) => ({
      total: state.total,
      dataPieTransactions: state.dataPieTransactions,
      getDataPieTransactions: state.getDataPieTransactions,
      getTotal: state.getTotal,
      month: state.month,
      year: state.year,
    })),
  );

  const { query } = getDateRangeParams(year, month);
  const pieQuery = `tipe=Pengeluaran&${query}`;
  useEffect(() => {
    getTotal();
    getDataPieTransactions(pieQuery);
  }, [getTotal, getDataPieTransactions]);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);

  const spendingMap = dataPieTransactions.reduce(
    (acc, { kategori, jumlah }) => {
      acc[kategori] = jumlah;
      return acc;
    },
    {},
  ); // { FnB: 20000 }

  const totalIncome = total.pemasukan;

  // Ungrouped = no groupId in seed AND user hasn't assigned a group
  const ungrouped = CATEGORIES.filter((c) => {
    if (c.type !== "Pengeluaran") return false;
    const assigned = categoryGroups[c.id];
    if (assigned !== undefined) return assigned === null;
    return !c.groupId;
  });

  const groupSummary = useMemo(
    () =>
      KANBAN_GROUPS.map((g) => {
        const cats = CATEGORIES.filter((c) => {
          const assigned = categoryGroups[c.id];
          if (assigned !== undefined)
            return assigned === g.id && c.type === "Pengeluaran";
          return c.groupId === g.id && c.type === "Pengeluaran";
        });
        const spent = cats.reduce((s, c) => s + (spendingMap[c.id] ?? 0), 0);
        const allowed = Math.round((totalIncome * g.rulePercent) / 100);
        return { ...g, spent, allowed, pct: pct(spent, allowed) };
      }),
    [spendingMap, totalIncome, categoryGroups],
  );

  function handleSaveBudget(amount: number) {
    if (!editingCatId) return;
    setBudget(editingCatId, amount);
    const cat = CATEGORIES.find((c) => c.id === editingCatId);
    // showToast(
    //   amount > 0
    //     ? `✅ Budget ${cat?.name} disimpan`
    //     : `🗑 Budget ${cat?.name} dihapus`,
    // );
    setEditingCatId(null);
  }

  function handleSaveGroup(groupId: GroupId | null) {
    if (!editingCatId) return;
    setGroup(editingCatId, groupId);
    const cat = CATEGORIES.find((c) => c.id === editingCatId);
    const label =
      KANBAN_GROUPS.find((g) => g.id === groupId)?.label ??
      "Tidak dikelompokkan";
    // showToast(`✅ ${cat?.name} dipindah ke ${label}`);
    setEditingCatId(null);
  }

  const editingCat = editingCatId
    ? CATEGORIES.find((c) => c.id === editingCatId)
    : null;

  return (
    <div className="flex-1  relative ">
      <div className="flex-1 overflow-y-auto h-screen hide-scrollbar">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-3">
          <h1 className="text-xl font-bold text-[var(--color-ink)]">
            Kategori
          </h1>
          <button
            onClick={() =>
              showToast("➕ Fitur Tambah kategori baru segera hadir")
            }
            className="flex items-center gap-1.5 bg-[var(--color-ink)] text-[var(--color-bg)] rounded-[10px] px-3 py-2 text-xs font-bold"
          >
            <Plus size={13} /> Baru
          </button>
        </div>

        {/* Hint */}
        <div className="mx-5 mb-3 bg-[var(--color-amber-light)] border border-[var(--color-amber-mid)] rounded-[12px] px-3.5 py-2.5 flex gap-2.5">
          <span className="text-base flex-shrink-0 mt-0.5">💡</span>
          <p className="text-[11px] text-[#7a4a10] leading-relaxed">
            Berdasarkan{" "}
            <span className="font-bold text-[var(--color-amber)]">
              aturan 50/30/20
            </span>{" "}
            — tap <b>⋯</b> tiap kategori untuk atur budget dan grup sesuka hati.
          </p>
        </div>

        {/* Health strip */}
        <div className="flex gap-2 px-5 mb-4">
          {groupSummary.map((g) => {
            const isOver = g.pct > 100;
            const color = isOver ? "#c0392b" : g.pct > 80 ? "#d97706" : g.color;
            return (
              <div
                key={g.id}
                className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[12px] p-2.5 text-center"
              >
                <p className="text-lg mb-0.5">{g.emoji}</p>
                <p
                  className="text-[11px] font-bold font-mono"
                  style={{ color }}
                >
                  {g.pct}%
                </p>
                <p className="text-[9px] text-[var(--color-ink-3)] mt-0.5">
                  {g.ruleLabel}
                </p>
              </div>
            );
          })}
        </div>

        {/* Groups */}
        {KANBAN_GROUPS.map((g) => (
          <GroupCard
            key={g.id}
            groupId={g.id}
            totalIncome={totalIncome}
            budgets={budgets}
            spendingMap={spendingMap}
            categoryGroups={categoryGroups}
            onEdit={setEditingCatId}
          />
        ))}

        {/* Ungrouped */}
        {ungrouped.length > 0 && (
          <>
            <p className="px-5 pt-2 pb-2 text-[11px] font-bold text-[var(--color-ink-3)] uppercase tracking-wider">
              Tidak Dikelompokkan
            </p>
            <div className="mx-5 mb-20 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[18px] overflow-hidden">
              {ungrouped.map((cat) => (
                <CatRow
                  key={cat.id}
                  catId={cat.id}
                  budget={budgets[cat.id]}
                  spent={spendingMap[cat.id] ?? 0}
                  groupColor="#a89888"
                  onEdit={() => setEditingCatId(cat.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>
      {/* Edit sheet */}
      {editingCatId && editingCat && (
        <EditSheet
          catId={editingCatId}
          currentBudget={budgets[editingCatId]}
          currentGroup={
            (categoryGroups[editingCatId] ??
              editingCat.groupId ??
              null) as GroupId | null
          }
          spent={spendingMap[editingCatId] ?? 0}
          onSaveBudget={handleSaveBudget}
          onSaveGroup={handleSaveGroup}
          onClose={() => setEditingCatId(null)}
        />
      )}
    </div>
  );
}
