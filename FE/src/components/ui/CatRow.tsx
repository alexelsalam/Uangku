import {
  CATEGORIES,
  CATEGORY_META,
  FALLBACK_META,
} from "../../data/catergoryMeta";
import { formatIDR, pct } from "../../utils";

// ─── Category Row ─────────────────────────────────────────────────────────────
export function CatRow({
  catId,
  budget,
  spent,

  groupColor,
  onEdit,
}: {
  catId: string;
  budget: number | undefined;
  spent: number;

  groupColor: string;
  onEdit: () => void;
}) {
  const cat = CATEGORIES.find((c) => c.id === catId);
  const Icon = cat?.icon || FALLBACK_META.icon;
  const barPct = budget ? pct(spent, budget) : 0;
  const isWarn = barPct >= 80;
  const isOver = barPct >= 100;
  const barClr = isOver ? "#c0392b" : isWarn ? "#d97706" : groupColor;

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--color-border)] last:border-b-0">
      <div
        className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: cat?.bg || FALLBACK_META.bg }}
      >
        <Icon
          size={17}
          color={cat?.color || FALLBACK_META.color}
          strokeWidth={1.75}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-[var(--color-ink)]">
          {cat?.id ?? catId}
        </p>
        {budget ? (
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 bg-[var(--color-border)] rounded-full h-1 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${barPct}%`, backgroundColor: barClr }}
              />
            </div>
            <span
              className="text-[9px] font-bold min-w-[26px] text-right"
              style={{ color: barClr }}
            >
              {barPct}%
            </span>
          </div>
        ) : (
          <p className="text-[10px] mt-0.5">
            <span className="text-[var(--color-ink-3)]">Belum ada budget</span>
            <span className="text-[var(--color-amber)]">Set budget</span>
          </p>
        )}
      </div>

      <div className="text-right flex-shrink-0">
        <p
          className="text-[13px] font-bold font-mono"
          style={{ color: isWarn ? barClr : "var(--color-ink)" }}
        >
          {formatIDR(spent, true)}
        </p>
        {budget && (
          <p className="text-[10px] text-[var(--color-ink-3)] mt-0.5">
            dari {formatIDR(budget, true)}
            {isWarn && !isOver ? " ⚠" : ""}
            {isOver ? " ‼" : ""}
          </p>
        )}
      </div>

      <button
        onClick={onEdit}
        className="text-[var(--color-ink-3)] pl-1 flex-shrink-0 text-base"
      >
        ⋯
      </button>
    </div>
  );
}
