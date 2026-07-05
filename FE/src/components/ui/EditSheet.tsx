import { useState } from "react";
import {
  CATEGORIES,
  CATEGORY_META,
  FALLBACK_META,
} from "../../data/catergoryMeta";
import { GroupId } from "../../types";
import { formatIDR, pct } from "../../utils";
import { Check, X } from "lucide-react";

// ─── Edit Sheet (Budget + Group dalam satu modal) ─────────────────────────────
interface EditSheetProps {
  catId: string;
  currentBudget: number | undefined;
  currentGroup: GroupId | null | undefined;
  spent: number;
  onSaveBudget: (amount: number) => void;
  onSaveGroup: (groupId: GroupId | null) => void;
  onClose: () => void;
}

export function EditSheet({
  catId,
  currentBudget,
  currentGroup,
  spent,
  onSaveBudget,
  onSaveGroup,
  onClose,
}: EditSheetProps) {
  const cat = CATEGORIES.find((c) => c.id === catId);
  const meta = CATEGORY_META[catId] ?? FALLBACK_META;
  const Icon = meta.icon;

  const [tab, setTab] = useState<"budget" | "group">("budget");
  const [raw, setRaw] = useState(currentBudget ? String(currentBudget) : "");
  const [group, setGroup] = useState<GroupId | null>(currentGroup ?? null);

  const amount = parseInt(raw || "0");
  const isValid = amount > 0;
  const spentPct = isValid ? pct(spent, amount) : 0;
  const isOver = spentPct > 100;
  const barColor = isOver ? "#c0392b" : spentPct > 80 ? "#d97706" : meta.color;

  function handleNum(key: string) {
    if (key === "del") {
      setRaw((p) => p.slice(0, -1));
      return;
    }
    if (key === "000") {
      if (raw && raw.length < 11) setRaw((p) => p + "000");
      return;
    }
    if (raw.length < 11) setRaw((p) => p + key);
  }

  const GROUP_OPTIONS: {
    id: GroupId | null;
    emoji: string;
    label: string;
    desc: string;
  }[] = [
    {
      id: "needs",
      emoji: "🏠",
      label: "Kebutuhan",
      desc: "Maks 50% penghasilan",
    },
    {
      id: "wants",
      emoji: "✨",
      label: "Keinginan",
      desc: "Maks 30% penghasilan",
    },
    {
      id: "investment",
      emoji: "📈",
      label: "Investasi & Tabungan",
      desc: "Min 20% penghasilan",
    },
    {
      id: null,
      emoji: "📦",
      label: "Tidak dikelompokkan",
      desc: "Di luar 50/30/20",
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 z-40" onClick={onClose} />

      {/* Sheet */}
      <div className="absolute bottom-0 left-0 right-0 z-50 bg-[var(--color-bg)] rounded-t-[24px] shadow-2xl  ">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-[var(--color-border)] rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3">
          <div
            className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: meta.bg }}
          >
            <Icon size={20} color={meta.color} strokeWidth={1.75} />
          </div>
          <div className="flex-1">
            <p className="text-[15px] font-bold text-[var(--color-ink)]">
              {cat?.id}
            </p>
            <p className="text-[11px] text-[var(--color-ink-3)]">
              Terpakai {formatIDR(spent)} bulan ini
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-[var(--color-border)] rounded-[9px] flex items-center justify-center"
          >
            <X size={15} color="var(--color-ink-2)" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex mx-5 mb-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[12px] p-1">
          {(["budget", "group"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 text-xs font-bold rounded-[9px] transition-all
                ${
                  tab === t
                    ? "bg-[var(--color-ink)] text-[var(--color-bg)]"
                    : "text-[var(--color-ink-3)]"
                }`}
            >
              {t === "budget" ? "🎯 Budget" : "🗂 Grup"}
            </button>
          ))}
        </div>

        {/* ── TAB: BUDGET ── */}
        {tab === "budget" && (
          <div className="px-5 pb-2 overflow-y-auto flex-1">
            {/* Amount display */}
            <div className="mb-3 bg-[var(--color-ink)] rounded-[16px] px-5 py-4 text-center">
              <p className="text-[10px] text-[#7a6a5a] uppercase tracking-widest mb-1">
                Budget per bulan
              </p>
              <p className="text-3xl font-bold text-[#f7f2ea] tracking-tight font-mono">
                {isValid ? `Rp ${formatIDR(amount)}` : "Rp —"}
              </p>
            </div>

            {/* Preview bar */}
            {isValid && (
              <div className="mb-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[12px] px-4 py-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] font-semibold text-[var(--color-ink-2)]">
                    Preview bulan ini
                  </span>
                  <span
                    className="text-[11px] font-bold font-mono"
                    style={{ color: barColor }}
                  >
                    {spentPct}%
                  </span>
                </div>
                <div className="bg-[var(--color-border)] rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(spentPct, 100)}%`,
                      backgroundColor: barColor,
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-[10px] text-[var(--color-ink-3)]">
                    Terpakai {formatIDR(spent, true)}
                  </span>
                  <span
                    className="text-[10px] font-semibold"
                    style={{ color: isOver ? "#c0392b" : "var(--color-green)" }}
                  >
                    {isOver
                      ? `Lebih ${formatIDR(spent - amount, true)}`
                      : `Sisa ${formatIDR(amount - spent, true)}`}
                  </span>
                </div>
              </div>
            )}

            {/* Numpad */}
            <div className="grid grid-cols-3 gap-1 mb-2">
              {[
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "000",
                "0",
                "del",
              ].map((k) => (
                <button
                  key={k}
                  onClick={() => handleNum(k)}
                  className={`bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl py-3.5 text-center text-lg font-semibold text-[var(--color-ink)] font-mono active:bg-[var(--color-amber-light)] active:border-[var(--color-amber)] transition-colors `}
                >
                  {k === "del" ? "⌫" : k}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {currentBudget && (
                <button
                  onClick={() => onSaveBudget(0)}
                  className="px-4 py-3.5 text-sm font-bold rounded-[12px] bg-[var(--color-red-light)] text-[var(--color-red)] border-[1.5px] border-[#f5c6c2] flex-shrink-0"
                >
                  Hapus
                </button>
              )}
              <button
                onClick={() => isValid && onSaveBudget(amount)}
                disabled={!isValid}
                className={`flex-1 py-3.5 text-sm font-bold rounded-[12px] flex items-center justify-center gap-2 transition-colors
                  ${
                    isValid
                      ? "bg-[var(--color-ink)] text-[var(--color-bg)] active:bg-[var(--color-amber)]"
                      : "bg-[var(--color-border)] text-[var(--color-ink-3)] cursor-not-allowed"
                  }`}
              >
                <Check size={16} /> Simpan Budget
              </button>
            </div>
          </div>
        )}

        {/* ── TAB: GROUP ── */}
        {tab === "group" && (
          <div className="px-5 pb-2 overflow-y-auto flex-1">
            <div className="flex flex-col gap-2 mb-4">
              {GROUP_OPTIONS.map((opt) => {
                const isSelected = group === opt.id;
                return (
                  <button
                    key={String(opt.id)}
                    onClick={() => setGroup(opt.id)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-[14px] border-[1.5px] text-left transition-all
                      ${
                        isSelected
                          ? "bg-[var(--color-amber-light)] border-[var(--color-amber)]"
                          : "bg-[var(--color-surface)] border-[var(--color-border)]"
                      }`}
                  >
                    <span className="text-2xl">{opt.emoji}</span>
                    <div className="flex-1">
                      <p
                        className={`text-sm font-bold ${isSelected ? "text-[var(--color-amber)]" : "text-[var(--color-ink)]"}`}
                      >
                        {opt.label}
                      </p>
                      <p className="text-[11px] text-[var(--color-ink-3)] mt-0.5">
                        {opt.desc}
                      </p>
                    </div>
                    {isSelected && (
                      <Check size={16} color="var(--color-amber)" />
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => onSaveGroup(group)}
              className="w-full py-3.5 text-sm font-bold rounded-[12px] bg-[var(--color-ink)] text-[var(--color-bg)] flex items-center justify-center gap-2 active:bg-[var(--color-amber)] transition-colors"
            >
              <Check size={16} /> Simpan Grup
            </button>
            <div className="h-4" />
          </div>
        )}
      </div>
    </>
  );
}
