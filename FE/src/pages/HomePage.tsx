import { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
// import { CATEGORIES } from "@/data/seed";
// import { TransactionItem } from "@/components/ui/TransactionItem";
import { useAppStore } from "../store/store";
import { Transactions } from "../utils/interfaces";

// pengeluaran icons
import FnB from "../icons/icons_pengeluaran/FnB";
import Pulsa from "../icons/icons_pengeluaran/Pulsa";
import Internet from "../icons/icons_pengeluaran/Internet";
import Bensin from "../icons/icons_pengeluaran/Bensin";
import Liburan from "../icons/icons_pengeluaran/Liburan";
import Kesehatan from "../icons/icons_pengeluaran/Kesehatan";
import Tagihan from "../icons/icons_pengeluaran/Tagihan";
import Belanja from "../icons/icons_pengeluaran/Belanja";
import Hiburan from "../icons/icons_pengeluaran/Hiburan";
import Kecantikan from "../icons/icons_pengeluaran/Kecantikan";
import Transportasi from "../icons/icons_pengeluaran/Transportasi";
import Pakaian from "../icons/icons_pengeluaran/Pakaian";
import Service from "../icons/icons_pengeluaran/Service";
import Investasi from "../icons/icons_pengeluaran/Investasi";
import Asuransi from "../icons/icons_pengeluaran/Asuransi";
import Pajak from "../icons/icons_pengeluaran/Pajak";
import Darurat from "../icons/icons_pengeluaran/Darurat";
import Pendidikan from "../icons/icons_pengeluaran/Pendidikan";
import Lainnya from "../icons/icons_pengeluaran/Lainnya";
// pendapatan icons
import Cash from "../icons/icons_pendapatan/Cash";
import Freelance from "../icons/icons_pendapatan/Freelance";
import Pasif from "../icons/icons_pendapatan/Pasif";
import SideJob from "../icons/icons_pendapatan/SideJob";
// import groupByDate from "../utils/GrupByDate";
import { formatIDR } from "../utils/index";
import { TransactionItem } from "../components/ui/TransactionItems";
import { CATEGORIES, CATEGORY_META } from "../data/catergoryMeta";
import { groupByDate } from "../utils";
import Skeleton from "../components/ui/Skeleton";
import { useNavigate } from "react-router-dom";
import { MonthlySetting } from "../components/ui/MonthlySetting";
import { useShallow } from "zustand/shallow";

export function HomePage() {
  const navigate = useNavigate();
  const [newData, setNewData] = useState(false);
  const [overlay, setOverlay] = useState(false);
  console.log(newData);
  const {
    loading,
    totalPemasukan,
    totalPengeluaran,
    dataPieTransactionsOUT,
    getDataPieTransactionsOUT,
    allTransactions,
    getAllTransactions,
    getTotalPemasukan,
    getTotalPengeluaran,
    month,
    year,
  } = useAppStore(
    useShallow((state) => ({
      loading: state.loading,
      totalPemasukan: state.totalPemasukan,
      totalPengeluaran: state.totalPengeluaran,
      dataPieTransactionsOUT: state.dataPieTransactionsOUT,
      allTransactions: state.allTransactions,
      getAllTransactions: state.getAllTransactions,
      getDataPieTransactionsOUT: state.getDataPieTransactionsOUT,
      getTotalPemasukan: state.getTotalPemasukan,
      getTotalPengeluaran: state.getTotalPengeluaran,
      month: state.month,
      year: state.year,
    })),
  );
  //ambil tanggal sekarang buat kirim ke backend, biar bisa query data bulan ini
  const now = new Date();
  const pad = (n: any) => String(n).padStart(2, "0");
  const m = pad(now.getMonth() + 1);
  const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();

  const startStr = `${year}-${m}-01`;
  const endStr = `${year}-${m}-${lastDay}`;
  const query = `dari=${startStr}&sampai=${endStr}`;
  useEffect(() => {
    getTotalPemasukan();
    getTotalPengeluaran();
    getDataPieTransactionsOUT();
    getAllTransactions(null, query);
    console.log("render useEffect");
  }, [
    getTotalPemasukan,
    getTotalPengeluaran,
    getDataPieTransactionsOUT,
    getAllTransactions,
    query,
    newData,
  ]);

  const [activeFilter, setActiveFilter] = useState<string>("all");

  const totalIncome = totalPemasukan.total;
  const totalExpense = totalPengeluaran.total;

  const balance = totalIncome - totalExpense;
  const budgetPct = Math.min(
    Math.round((totalExpense / totalIncome) * 100),
    100,
  );

  // Donut data by category
  const categoryColor = useMemo(
    () => ({
      // pengeluaran
      fnb: { icon: FnB, color: "#205781" },
      pulsa: { icon: Pulsa, color: "#437057" },
      internet: { icon: Internet, color: "#67AE6E" },
      bensin: { icon: Bensin, color: "#8A0000" },
      liburan: { icon: Liburan, color: "#3B9797" },
      kesehatan: { icon: Kesehatan, color: "#3D74B6" },
      tagihan: { icon: Tagihan, color: "#CF0F47" },
      belanja: { icon: Belanja, color: "#0D4715" },
      hiburan: { icon: Hiburan, color: "#4A9782" },
      kecantikan: { icon: Kecantikan, color: "#DB6B97" },
      transportasi: { icon: Transportasi, color: "#547792" },
      pakaian: { icon: Pakaian, color: "#48A6A7" },
      service: { icon: Service, color: "#E9762B" },
      investasi: { icon: Investasi, color: "#00712D" },
      asuransi: { icon: Asuransi, color: "#123458" },
      pajak: { icon: Pajak, color: "#E9762B" },
      darurat: { icon: Darurat, color: "#B12C00" },
      pendidikan: { icon: Pendidikan, color: "#279EFF" },
      lainnya: { icon: Lainnya, color: "#748873" },
      // pendapatan
      gaji: { icon: Cash, color: "#67AE6E" },
      cash: { icon: Cash, color: "#67AE6E" },
      pasif: { icon: Pasif, color: "#B12C00" },
      side: { icon: SideJob, color: "#3D74B6" },
      sidejob: { icon: SideJob, color: "#3D74B6" },
      freelance: { icon: Freelance, color: "#E9762B" },
    }),
    [],
  );
  const donutData = useMemo(() => {
    const fallbackColors = [
      "#0088FE",
      "#00C49F",
      "#FFBB28",
      "#FF8042",
      "#A28DFF",
    ];

    return (dataPieTransactionsOUT || []).map((item, index) => {
      const key = String(
        item.kategori || "",
      ).toLowerCase() as keyof typeof categoryColor;
      const meta = categoryColor[key];

      return {
        name: item.kategori,
        value: item.jumlah,
        // use category color when available (keeps pie in sync with CustomSelectCategory),
        // otherwise fall back to a rotating color palette
        fill: meta?.color || fallbackColors[index % fallbackColors.length],
      };
    });
  }, [dataPieTransactionsOUT, categoryColor]);

  // Filtered & grouped transactions

  const filteredTxs = useMemo(() => {
    if (activeFilter === "all") return allTransactions;
    return allTransactions.filter((t) => t.kategori === activeFilter);
  }, [allTransactions, activeFilter]);

  const grouped = useMemo(() => groupByDate(filteredTxs), [filteredTxs]);
  const filterCategories = useMemo(() => {
    const ids = [
      ...new Set(allTransactions.map((t) => t.kategori.toLowerCase())),
    ];
    return ids
      .map((id) => CATEGORIES.find((c) => c.id === id)!)
      .filter(Boolean);
  }, [allTransactions]);
  const quickActions = [
    {
      emoji: "➕",
      label: "Tambah",
      onClick: () => navigate("/add"),
    },
    {
      emoji: "📊",
      label: "Laporan",
      onClick: () => navigate("/report"),
    },
    {
      emoji: "🎯",
      label: "Budget",
      onClick: () => alert("🎯 Fitur budget segera hadir"),
    },
    {
      emoji: "📤",
      label: "Export",
      onClick: () => alert("📤 Fitur Export ke CSV / PDF"),
    },
  ];

  return (
    <div className="flex-1 overflow-y-scroll h-screen  hide-scrollbar">
      {/* Header */}
      <div className="  flex justify-between items-center px-5 py-3">
        {/* <div className="flex items-center gap-2">
          <button
            className="w-8 h-8 bg-surface border border-border rounded-[9px] flex items-center justify-center text-sm text-ink-2"
            // onClick={() => showToast("◀ Bulan sebelumnya")}
          >
            ‹
          </button>
          <span className="text-base font-bold text-ink">Juni 2026</span>
          <button
            className="w-8 h-8 bg-surface border border-border rounded-[9px] flex items-center justify-center text-sm text-ink-2"
            // onClick={() => showToast("▶ Bulan berikutnya")}
          >
            ›
          </button>
        </div> */}
        <MonthlySetting newData={newData} setNewData={setNewData} />
        <div className="flex gap-2">
          <button
            // onClick={() => showToast("🔔 Tidak ada notifikasi")}
            className="w-9 h-9 bg-surface border border-border rounded-sm flex items-center justify-center text-base"
          >
            🔔
          </button>
          <button
            // onClick={() => showToast("🔍 Cari transaksi")}
            className="w-9 h-9 bg-surface border border-border rounded-sm flex items-center justify-center text-base"
          >
            🔍
          </button>
        </div>
      </div>

      {/* Hero Balance Card */}
      <div className="mx-5 mb-5 bg-ink rounded-xl p-6 relative overflow-hidden">
        <div
          className="absolute -top-8 -right-8 w-28 h-28 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(201,131,42,0.18) 0%, transparent 70%)",
          }}
        />
        <p className="text-[11px] text-[#7a6a5a] uppercase tracking-widest mb-1.5">
          Saldo Bersih
        </p>
        <p className="text-4xl font-bold text-bg tracking-tight mb-1 font-mono">
          {formatIDR(balance)}
        </p>
        <p className="text-xs text-ink-2 mb-4">
          Dari pemasukan Rp {formatIDR(totalIncome)} bulan ini
        </p>
        {/* Progress */}
        <div className="bg-[#2e2620] rounded-full h-1.5 mb-1.5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${budgetPct}%`,
              background: "linear-gradient(90deg, #c9832a, #e8a44e)",
            }}
          />
        </div>
        <p className="text-sm text-[#7a6a5a]">
          <b className="text-amber">{budgetPct || 0}%</b> anggaran bulanan
          terpakai
        </p>
        {/* Income / Expense row */}
        <div className="flex gap-2.5 mt-4">
          <div className="flex-1 bg-white/5 rounded-xl p-3">
            <p className="text-sm text-[#7a6a5a] mb-1">⬆ Pemasukan</p>
            <p className="text-base font-bold text-[#5db882] font-mono">
              {formatIDR(totalIncome)}
            </p>
          </div>
          <div className="flex-1 bg-white/5 rounded-xl p-3">
            <p className="text-sm text-[#7a6a5a] mb-1">⬇ Pengeluaran</p>
            <p className="text-base font-bold text-[#e87070] font-mono">
              {formatIDR(totalExpense)}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-5 mb-5">
        <p className="text-[11px] font-bold text-ink-2 uppercase tracking-wider mb-3">
          Aksi Cepat
        </p>
        <div className="grid grid-cols-4 gap-2.5">
          {quickActions.map((a) => (
            <button
              key={a.label}
              onClick={a.onClick}
              className="bg-surface border border-border rounded-md py-3.5 flex flex-col items-center gap-1.5 active:bg-amber-light active:border-amber transition-colors"
            >
              <span className="text-2xl">{a.emoji}</span>
              <span className="text-sm font-semibold text-ink-2">
                {a.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Donut Chart */}
      {donutData.length > 0 && (
        <div className="px-5 mb-5">
          <p className="text-[11px] font-bold text-ink-2 uppercase tracking-wider mb-3">
            Pengeluaran
          </p>
          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={28}
                      outerRadius={44}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {donutData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1">
                {donutData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2 mb-2">
                    <div
                      className="w-2.5 h-2.5 rounded-[3px] shrink-0"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-xs text-ink-2 flex-1">
                      {item.name}
                    </span>
                    <span className="text-xs font-bold text-ink font-mono">
                      {Math.round((item.value / totalExpense) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction List */}
      <div className=" flex justify-between items-center px-5 mb-3">
        <p className="text-[11px] font-bold text-ink-2 uppercase tracking-wider">
          Transaksi
        </p>
        <button className="text-xs font-semibold text-amber">Semua →</button>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 px-5 pb-4 overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setActiveFilter("all")}
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border-[1.5px] transition-colors
            ${
              activeFilter === "all"
                ? "bg-ink text-bg border-ink"
                : "bg-transparent text-ink-2 border-border"
            }`}
        >
          Semua
        </button>
        {filterCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveFilter(cat.id)}
            className={`shrink-0 flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold border-[1.5px] transition-colors whitespace-nowrap
              ${
                activeFilter === cat.id
                  ? "bg-ink text-bg border-ink"
                  : "bg-transparent text-ink-2 border-border"
              }`}
          >
            {cat.id}
          </button>
        ))}
      </div>

      {/* Grouped transactions */}

      {loading ? (
        Array.from({ length: 7 }).map((_, index) => (
          <Skeleton key={index} className="w-full h-16 mb-2 rounded-xl" />
        ))
      ) : Object.keys(grouped).length === 0 ? (
        <div className="py-8 text-center text-gray-400">
          Belum ada transaksi
        </div>
      ) : (
        Object.entries(grouped).map(([date, items]) => (
          <div key={date} className="mb-20">
            <p className="px-5 py-2 text-[11px] font-bold text-ink-3 uppercase tracking-wider bg-bg">
              {date}
            </p>
            <TransactionItem data={items} />
          </div>
        ))
      )}
    </div>
  );
}
