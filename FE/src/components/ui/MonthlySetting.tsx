import { useMemo, useState } from "react";
import { MonthRange } from "../../types";
import { useAppStore } from "../../store/store";

export function MonthlySetting({
  newData,
  setNewData,
}: {
  newData: boolean;
  setNewData: (value: boolean) => void;
}) {
  // UI — toggle antara arrow dan dropdown
  const [showDropdown, setShowDropdown] = useState(false);
  const month = useAppStore((state) => state.month);
  const year = useAppStore((state) => state.year);
  const setMonth = useAppStore((state) => state.setMonth);
  const setYear = useAppStore((state) => state.setYear);
  const now = new Date();

  const MONTH_NAMES = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  // utils
  const getMonthRange = (year: number, month: number): MonthRange => {
    const from = new Date(year, month, 1);
    const to = new Date(year, month + 1, 0); // day 0 = last day of prev month
    return {
      from: from.toISOString().slice(0, 10),
      to: to.toISOString().slice(0, 10),
    };
  };
  const range = useMemo(() => getMonthRange(year, month), [year, month]);
  // range → { from: "2026-07-01", to: "2026-07-31" }

  const prev = () => {
    if (month === 0) {
      if (year <= now.getFullYear()) return; // block ke tahun sebelumnya
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const next = () => {
    const now = new Date();
    // optional: block future month
    if (year === now.getFullYear() && month === now.getMonth()) return;
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else setMonth(month + 1);
  };

  // untuk dropdown — generate list 12 bulan tahun ini
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    label: `${MONTH_NAMES[i]} ${now.getFullYear()}`,
    year: now.getFullYear(),
    month: i,
    disabled: i > now.getMonth(),
  }));
  return (
    <div className="flex items-center gap-2">
      <button
        className="w-8 h-8 bg-surface border border-border rounded-[9px] flex items-center justify-center text-sm text-ink-2"
        onClick={() => {
          prev();
          setNewData(!newData);
        }}
      >
        ‹
      </button>
      <button
        className="text-base font-bold text-ink"
        onClick={() => setShowDropdown((p) => !p)}
      >
        {MONTH_NAMES[month]} {year}
      </button>
      <button
        className="w-8 h-8 bg-surface border border-border rounded-[9px] flex items-center justify-center text-sm text-ink-2"
        onClick={() => {
          next();
          setNewData(!newData);
        }}
      >
        ›
      </button>

      {showDropdown && (
        <div className="absolute top-10 left-7 h-1/4 overflow-y-auto hide-scrollbar mt-2 bg-surface border border-border rounded-[9px] shadow-lg z-10">
          {/* posisikan absolute */}
          {monthOptions.map((opt) => (
            <button
              key={opt.month}
              disabled={opt.disabled}
              onClick={() => {
                if (opt.disabled) return;
                setYear(opt.year);
                setMonth(opt.month);
                setShowDropdown(false);
                setNewData(!newData);
              }}
              className={`block px-4 py-2 text-sm text-ink hover:bg-ink/10${
                opt.disabled ? "opacity-30 cursor-not-allowed" : ""
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
