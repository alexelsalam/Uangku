import { useEffect, useMemo, useState } from "react";
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from "recharts";
// import { CATEGORIES, MONTHLY_DATA } from "@/data/seed";
import { formatIDR } from "../utils/index";
import { useAppStore } from "../store/store";
import { CATEGORIES, FALLBACK_META } from "../data/catergoryMeta";
import { Icon } from "lucide-react";
import { Period } from "../utils/interfaces";

export function ReportPage() {
  const {
    totalPemasukan,
    totalPengeluaran,
    allTransactions,
    dataBarTransactions,
    dataPieTransactionsOUT,
    getDataPieTransactionsOUT,
    getDataBarTransactions,
    getAllTransactions,
    getTotalPemasukan,
    getTotalPengeluaran,
  } = useAppStore();

  // const { transactions, showToast } = useApp();
  const [period, setPeriod] = useState<Period>("Bulanan");
  //membuat tanggal awal dan akhir bulan ini untuk query ke backend
  const now = new Date();
  const pad = (n: any) => String(n).padStart(2, "0");
  const y = now.getFullYear();
  const m = pad(now.getMonth() + 1);
  const lastDay = new Date(y, now.getMonth() + 1, 0).getDate();

  const startStr = `${y}-${m}-01`;
  const endStr = `${y}-${m}-${lastDay}`;
  const query = `dari=${startStr}&sampai=${endStr}`;
  useEffect(() => {
    getAllTransactions(null, query);
    getTotalPemasukan();
    getTotalPengeluaran();
    getDataBarTransactions();
    getDataPieTransactionsOUT();
  }, [
    getAllTransactions,
    getTotalPemasukan,
    getTotalPengeluaran,
    getDataBarTransactions,
    getDataPieTransactionsOUT,
  ]);

  const totalIncome = totalPemasukan.total;
  const totalExpense = totalPengeluaran.total;
  const {
    formattedTotalIncome,
    formattedTotalExpense,
    formatBalance,
    txCount,
  } = useMemo(() => {
    return {
      formattedTotalIncome: formatIDR(totalIncome),
      formattedTotalExpense: formatIDR(totalExpense),
      formatBalance: formatIDR(totalIncome - totalExpense),
      txCount: allTransactions.length,
    };
  }, [totalIncome, totalExpense, allTransactions]);
  // Category breakdown
  const catBreakdown = useMemo(() => {
    return dataPieTransactionsOUT
      .map(({ kategori, jumlah }) => ({
        catId: kategori,
        total: jumlah,
        cat: CATEGORIES.find((c) => c.id === kategori),
      }))
      .filter((x) => x.cat)
      .sort((a, b) => b.total - a.total);
  }, [dataPieTransactionsOUT]);
  // Kalau data dari props/state

  //ubah data 2026-06-01 jadi Juni, dst
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const data = useMemo(
    () =>
      dataBarTransactions.map((item) => ({
        ...item,
        date: monthNames[parseInt(item.date.split("-")[1], 10) - 1],
      })),
    [dataBarTransactions],
  );
  const statCards = [
    {
      label: "Pemasukan",
      value: formattedTotalIncome,
      color: "var(--color-green)",
      changeColor: "var(--color-green)",
    },
    {
      label: "Pengeluaran",
      value: formattedTotalExpense,
      color: "var(--color-red)",
      changeColor: "var(--color-red)",
    },
    {
      label: "Saldo",
      value: formatBalance,
      color: "var(--color-ink)",
      changeColor: "var(--color-green)",
    },
    {
      label: "Transaksi",
      value: `${txCount}`,
      color: "var(--color-ink)",
      changeColor: "var(--color-ink-3)",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar h-screen">
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-3">
        <h1 className="text-xl font-bold text-[var(--color-ink)]">Laporan</h1>
        <button
          // onClick={() => showToast("📅 Pilih rentang tanggal")}
          className="flex items-center gap-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[10px] px-3 py-1.5 text-xs font-semibold text-[var(--color-ink-2)]"
        >
          Jun 2026 ▾
        </button>
      </div>

      {/* Period pills */}
      <div className="flex gap-2 px-5 pb-3 overflow-x-auto hide-scrollbar">
        {(["Bulanan", "Mingguan", "3 Bulan", "Tahunan"] as Period[]).map(
          (p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border-[1.5px] transition-colors
              ${
                period === p
                  ? "bg-[var(--color-ink)] text-[var(--color-bg)] border-[var(--color-ink)]"
                  : "bg-transparent text-[var(--color-ink-2)] border-[var(--color-border)]"
              }`}
            >
              {p}
            </button>
          ),
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-2.5 px-5 mb-4">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[14px] p-3.5"
          >
            <p className="text-[10px] text-[var(--color-ink-3)] uppercase tracking-wide mb-1.5">
              {s.label}
            </p>
            <p
              className="text-xl font-bold font-mono"
              style={{ color: s.color }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="mx-5 mb-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[18px] p-4">
        <p className="text-sm font-bold text-[var(--color-ink)] mb-0.5">
          Arus Kas tahunan ini
        </p>
        <p className="text-[11px] text-[var(--color-ink-3)] mb-4">
          Pemasukan vs Pengeluaran
        </p>
        <ResponsiveContainer width="100%" height={110}>
          <BarChart data={data} barGap={3} barCategoryGap="20%">
            <XAxis
              dataKey="date"
              tick={{
                fontSize: 10,
                fill: "var(--color-ink-3)",
                fontFamily: "Space Grotesk",
              }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 10,
                border: "1px solid var(--color-border)",
                fontSize: 12,
                fontFamily: "Space Grotesk",
              }}
              formatter={(value: number) => [`Rp ${formatIDR(value)}`, ""]}
            />
            <Bar
              dataKey="pemasukan"
              fill="var(--color-green)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="pengeluaran"
              fill="var(--color-amber)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2">
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-ink-2)] font-semibold">
            <div className="w-2.5 h-2.5 rounded-[3px] bg-[var(--color-green)]" />
            Pemasukan
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-ink-2)] font-semibold">
            <div className="w-2.5 h-2.5 rounded-[3px] bg-[var(--color-amber)]" />
            Pengeluaran
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="flex justify-between items-center px-5 mb-3">
        <p className="text-[11px] font-bold text-[var(--color-ink-2)] uppercase tracking-wider">
          Per Kategori
        </p>
        <button
          // onClick={() => showToast("📂 Detail kategori")}
          className="text-xs font-semibold text-[var(--color-amber)]"
        >
          Detail
        </button>
      </div>
      <div className="px-5 pb-5">
        {catBreakdown.map(({ catId, total, cat }) => {
          const pct = Math.round((total / totalExpense) * 100);
          const Icon = cat?.icon || FALLBACK_META.icon;
          return (
            <div key={catId} className="mb-3.5">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm font-semibold text-[var(--color-ink)]">
                  {Icon ? (
                    <Icon size={20} color={cat?.color} strokeWidth={1.75} />
                  ) : (
                    "📦"
                  )}{" "}
                  {cat!.id}
                </span>
                <span className="text-sm font-bold font-mono text-[var(--color-amber)]">
                  {formatIDR(total, true)}
                </span>
              </div>
              <div className="bg-[var(--color-border)] rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, backgroundColor: cat!.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
