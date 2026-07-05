import { useState } from "react";
import { GroupId } from "../../types";
import { CATEGORIES, KANBAN_GROUPS } from "../../data/catergoryMeta";
import { formatIDR, pct } from "../../utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CatRow } from "./CatRow";

// ─── Group Card ───────────────────────────────────────────────────────────────
export function GroupCard({
  groupId,
  totalIncome,
  budgets,
  spendingMap,
  // txCountMap,
  categoryGroups,
  onEdit,
}: {
  groupId: String;
  totalIncome: number;
  budgets: Record<string, number>;
  spendingMap: Record<string, number>;
  // txCountMap: Record<string, number>;
  categoryGroups: Record<string, String | null>;
  onEdit: (catId: string) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const group = KANBAN_GROUPS.find((g) => g.id === groupId)!;

  // Cats = base seed OR user-reassigned
  const cats = CATEGORIES.filter((c) => {
    const assigned = categoryGroups[c.id];
    if (assigned !== undefined)
      return assigned === groupId && c.type === "Pengeluaran";
    return c.groupId === groupId && c.type === "Pengeluaran";
  });

  const groupTotal = cats.reduce((s, c) => s + (spendingMap[c.id] ?? 0), 0);
  const groupBudget = cats.reduce((s, c) => s + (budgets[c.id] ?? 0), 0);
  const maxAllowed = Math.round((totalIncome * group.rulePercent) / 100);
  const gPct = pct(groupTotal, maxAllowed);
  const isOver = gPct > 100;
  const barColor = isOver ? "#c0392b" : group.color;

  return (
    <div className="mx-5 mb-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[18px] overflow-hidden">
      <button
        onClick={() => setCollapsed((p) => !p)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
      >
        <span className="text-xl">{group.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-bold text-[var(--color-ink)]">
            {group.label}
          </p>
          <p className="text-[10px] text-[var(--color-ink-3)] mt-0.5">
            {group.description}
          </p>
        </div>
        <div className="text-right flex-shrink-0 mr-2">
          <p className="text-[15px] font-bold font-mono text-[var(--color-ink)]">
            {formatIDR(groupTotal, true)}
          </p>
          <p
            className="text-[10px] font-semibold mt-0.5"
            style={{
              color: isOver
                ? "#c0392b"
                : gPct > 70
                  ? "#d97706"
                  : "var(--color-ink-3)",
            }}
          >
            {gPct}% dari {group.ruleLabel}
            {isOver ? " ‼" : gPct > 80 ? " ⚠" : ""}
          </p>
        </div>
        <div className="text-[var(--color-ink-3)] flex-shrink-0">
          {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </div>
      </button>

      <div className="h-1 bg-[var(--color-border)] mx-4 rounded-full overflow-hidden mb-0.5">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${Math.min(gPct, 100)}%`,
            backgroundColor: barColor,
          }}
        />
      </div>

      <div className="flex justify-between px-4 py-1.5 border-b border-[var(--color-border)]">
        <span className="text-[10px] text-[var(--color-ink-3)]">
          Batas {formatIDR(maxAllowed, true)} · Budget{" "}
          {formatIDR(groupBudget, true)}
        </span>
        <span
          className="text-[10px] font-bold"
          style={{ color: isOver ? "#c0392b" : "var(--color-green)" }}
        >
          {isOver
            ? `Lebih ${formatIDR(groupTotal - maxAllowed, true)}`
            : `Sisa ${formatIDR(maxAllowed - groupTotal, true)}`}
        </span>
      </div>

      {!collapsed &&
        cats.map((cat) => (
          <CatRow
            key={cat.id}
            catId={cat.id}
            budget={budgets[cat.id]}
            spent={spendingMap[cat.id] ?? 0}
            // txCount={txCountMap[cat.id] ?? 0}
            groupColor={group.color}
            onEdit={() => onEdit(cat.id)}
          />
        ))}

      {!collapsed && cats.length === 0 && (
        <p className="px-4 py-3 text-[12px] text-[var(--color-ink-3)] italic">
          Belum ada kategori di grup ini
        </p>
      )}
    </div>
  );
}
