// import { useApp } from "@/hooks/useAppContext";
// import { CATEGORIES } from "@/data/seed";
import { useEffect } from "react";
import { useAppStore } from "../store/store";
import { formatIDR, formatDate } from "../utils/index";
import { useNavigate, useParams } from "react-router-dom";
import { CATEGORIES } from "../data/catergoryMeta";
import apiData from "../api/apiData";
import { useApp } from "../hooks/useAppContext";

export function DetailPage() {
  const showToast = useApp().showToast;
  const { id } = useParams();
  const navigate = useNavigate();
  const { allTransactions, getAllTransactions } = useAppStore();

  useEffect(() => {
    getAllTransactions();
  }, [getAllTransactions]);
  const tx = allTransactions.find((t) => t.id === id);
  if (!tx)
    return (
      <div className="flex-1 flex items-center justify-center text-ink-3">
        Transaksi tidak ditemukan
      </div>
    );
  const cat = CATEGORIES.find((c) => c.id === tx!.kategori);
  const isExpense = tx!.tipe === "Pengeluaran";

  const handleDelete = async (id: string) => {
    try {
      const res = await apiData(id, null, "DELETE");
      if (!res) {
        throw new Error("gagal dihapus/id salah");
      }
      showToast("🗑 Transaksi dihapus");
    } catch (err) {
      showToast(err instanceof Error ? err.message : String(err));
    } finally {
      // alert("Data berhasil dihapus");
      navigate("/home");
    }
  };
  const Icon = cat?.icon;
  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3">
        <button
          onClick={() => navigate("/home")}
          className="w-9 h-9 bg-surface border border-border rounded-sm flex items-center justify-center text-base text-ink-2"
        >
          ‹
        </button>
        <h1 className="flex-1 text-[17px] font-bold text-ink">
          Detail Transaksi
        </h1>
        <button
          // onClick={() => showToast("⋯ Opsi lainnya")}
          className="text-xl text-ink-2"
        >
          ⋯
        </button>
      </div>

      {/* Hero */}
      <div className="mx-5 mb-5 bg-ink rounded-xl p-7 text-center relative overflow-hidden">
        <div
          className="absolute -top-6 -right-6 w-20 h-20 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(201,131,42,0.12) 0%, transparent 70%)",
          }}
        />
        <span
          className={`inline-block px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4
            ${
              isExpense
                ? "bg-red-900/20 text-[#e87070]"
                : "bg-green-900/20 text-[#5db882]"
            }`}
        >
          {isExpense ? "Pengeluaran" : "Pemasukan"}
        </span>
        <div className="w-14 h-14 rounded-md flex items-center justify-center text-xl shrink-0 mx-auto mb-3">
          {Icon ? (
            <Icon
              size={40}
              style={{ color: isExpense ? "#e87070" : "#5db882" }}
              strokeWidth={1.75}
            />
          ) : (
            "📦"
          )}
        </div>
        <p className="text-xl font-bold text-bg mb-2">
          {tx!.catatan || cat?.id}
        </p>
        <p
          className="text-4xl font-bold tracking-tight font-mono mb-1"
          style={{ color: isExpense ? "#e87070" : "#5db882" }}
        >
          {isExpense ? "−" : "+"} {formatIDR(tx!.jumlah)}
        </p>
        <p className="text-xs text-[#7a6a5a]">
          {formatDate(tx!.tanggal)} · {tx!.waktu} WIB
        </p>
      </div>

      {/* Fields */}
      <div className="px-5">
        {[
          { label: "Kategori", value: `${cat?.id}` },
          { label: "Tanggal", value: formatDate(tx!.tanggal) },
          { label: "Waktu", value: `${tx!.waktu} WIB` },
          { label: "Catatan", value: tx!.catatan || "—" },
          { label: "ID Transaksi", value: tx!.id },
        ].map((f) => (
          <div
            key={f.label}
            className="flex justify-between items-start py-3.5 border-b border-border"
          >
            <span className="text-xs text-ink-3 font-semibold">{f.label}</span>
            <span
              className={`text-sm font-bold text-ink text-right max-w-[60%]
                ${f.label === "ID Transaksi" ? "font-mono text-xs text-ink-3" : ""}`}
            >
              {f.value}
            </span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2.5 mx-5 mt-5 mb-20">
        <button
          // onClick={() => showToast("✏ Edit transaksi")}
          className="flex-1 py-3.5 text-sm font-bold rounded-xl bg-amber-light text-amber border-[1.5px] border-amber-mind"
        >
          ✏ Edit
        </button>
        <button
          onClick={() => handleDelete(tx!.id)}
          className="flex-1 py-3.5 text-sm font-bold rounded-xl bg-red-light text-red border-[1.5px] border-red-mind"
        >
          🗑 Hapus
        </button>
      </div>
    </div>
  );
}
