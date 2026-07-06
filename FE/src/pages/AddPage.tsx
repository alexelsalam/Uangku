import { useState } from "react";
import { formatIDR } from "../utils/index";
import { CATEGORIES, FALLBACK_META } from "../data/catergoryMeta";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Payload } from "../utils/interfaces";
import apiData from "../api/apiData";
import { jwtDecode } from "jwt-decode";
import { CustomJwtPayload, TransactionType } from "../types";

const EXPENSE_CATS = CATEGORIES.filter((c) => c.type === "Pengeluaran");
const INCOME_CATS = CATEGORIES.filter((c) => c.type === "Pemasukan");

export function AddPage() {
  const navigate = useNavigate();
  const [txType, setTxType] = useState<TransactionType>("Pengeluaran");
  const [numRaw, setNumRaw] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [categoryId, setCategoryId] = useState("FnB");
  const [showNumpad, setShowNumpad] = useState(false);
  const displayAmount = numRaw ? formatIDR(parseInt(numRaw)) : "0";
  const cats = txType === "Pengeluaran" ? EXPENSE_CATS : INCOME_CATS;
  const token = localStorage.getItem("token");
  let username = "";

  if (token) {
    try {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      username = decoded.username || "";
    } catch (error) {
      console.error("Invalid token", error);
    }
  }
  function handleNum(key: string) {
    if (key === "del") {
      setNumRaw((p) => p.slice(0, -1));
    } else if (key === "000") {
      if (numRaw) setNumRaw((p) => (p.length < 11 ? p + "000" : p));
    } else {
      setNumRaw((p) => (p.length < 11 ? p + key : p));
    }
  }

  const handleSave = async () => {
    const amount = parseInt(numRaw || "0");
    if (!amount) {
      alert("⚠ Masukkan jumlah transaksi");
      return;
    } //{ showToast('⚠ Masukkan jumlah transaksi'); return }
    // addTransaction({
    //   type: txType,
    //   amount,
    //   categoryId,
    //   note: note || (CATEGORIES.find(c => c.id === categoryId)?.name ?? ''),
    //   date,
    //   time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    // })
    // showToast('✅ Transaksi berhasil disimpan')
    try {
      const payload: Payload = {
        tipe: txType,
        kategori: categoryId,
        jumlah: amount,
        catatan: note,
        pembayaran: "Cash",
        admin: "admin",
        waktu: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        tanggal: date,
        users_id: username,
      };
      console.log("Payload to be sent:", payload);
      await apiData(null, null, "POST", payload);
    } catch (error) {
      console.error("Error saving transaction:", error);
      alert("⚠ Terjadi kesalahan saat menyimpan transaksi");
    } finally {
      setNumRaw("");
      setNote("");
      setDate(new Date().toISOString().slice(0, 10));
      setCategoryId(txType === "Pengeluaran" ? "FnB" : "salary");
      setTxType("Pengeluaran");
      setShowNumpad(false);
      // setTimeout(() => navigate("home"), 600);
    }
  };
  return (
    <div className="flex flex-col flex-1 overflow-hidden h-screen ">
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-3">
          <h1 className="text-xl font-bold text-[var(--color-ink)]">
            Transaksi Baru
          </h1>
          <button
            onClick={() => navigate("/home")}
            className="w-9 h-9 bg-[var(--color-border)] rounded-[10px] flex items-center justify-center text-base text-[var(--color-ink-2)]"
          >
            ✕
          </button>
        </div>

        {/* Type toggle */}
        <div className="flex mx-5 mb-5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[14px] p-1">
          <button
            onClick={() => {
              setTxType("Pengeluaran");
              setCategoryId("FnB");
            }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-[10px] transition-all
              ${
                txType === "Pengeluaran"
                  ? "bg-[var(--color-red-light)] text-[var(--color-red)]"
                  : "text-[var(--color-ink-3)]"
              }`}
          >
            ⬇ Pengeluaran
          </button>
          <button
            onClick={() => {
              setTxType("Pemasukan");
              setCategoryId("salary");
            }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-[10px] transition-all
              ${
                txType === "Pemasukan"
                  ? "bg-[var(--color-green-light)] text-[var(--color-green)]"
                  : "text-[var(--color-ink-3)]"
              }`}
          >
            ⬆ Pemasukan
          </button>
        </div>

        {/* Amount display */}
        <div
          onClick={() => setShowNumpad(true)}
          className="mx-5 mb-5 bg-[var(--color-ink)] rounded-[18px] p-6 text-center relative overflow-hidden"
        >
          <div
            className="absolute -top-8 -right-8 w-24 h-24 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(201,131,42,0.15) 0%, transparent 70%)",
            }}
          />
          <p className="text-[11px] text-[#7a6a5a] uppercase tracking-widest mb-2">
            Jumlah
          </p>
          <p className="text-4xl font-bold text-[#f7f2ea] tracking-tight font-mono">
            Rp {displayAmount}
            <span className="inline-block w-0.5 h-9 bg-[var(--color-amber)] rounded-sm ml-1 align-middle animate-pulse" />
          </p>
        </div>

        {/* Note */}
        <div className="px-5 mb-4">
          <p className="text-[11px] font-bold text-[var(--color-ink-3)] uppercase tracking-wider mb-2">
            Catatan
          </p>
          <input
            className="w-full bg-[var(--color-surface)] border-[1.5px] border-[var(--color-border)] rounded-xl px-3.5 py-3 text-sm font-[family-name:var(--font-sans)] text-[var(--color-ink)] outline-none focus:border-[var(--color-amber)]"
            placeholder="mis. Makan siang sama teman..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {/* Date */}
        <div className="px-5 mb-4">
          <p className="text-[11px] font-bold text-[var(--color-ink-3)] uppercase tracking-wider mb-2">
            Tanggal
          </p>
          <input
            type="date"
            className="w-full bg-[var(--color-surface)] border-[1.5px] border-[var(--color-border)] rounded-xl px-3.5 py-3 text-sm font-[family-name:var(--font-sans)] text-[var(--color-ink)] outline-none focus:border-[var(--color-amber)]"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Category */}
        {/* Category */}
        <div className="px-5">
          <p className="text-[11px] font-bold text-[var(--color-ink-3)] uppercase tracking-wider mb-2">
            Kategori
          </p>
          <div className="grid grid-cols-4 gap-3 mb-20">
            {cats.map((cat) => {
              const Icon = cat?.icon || FALLBACK_META.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategoryId(cat.id)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-[12px] border-[1.5px] transition-all
            ${
              categoryId === cat.id
                ? "bg-[var(--color-amber-light)] border-[var(--color-amber)]"
                : "bg-[var(--color-surface)] border-[var(--color-border)]"
            }`}
                >
                  <span>
                    <Icon size={20} color={cat?.color} strokeWidth={1.75} />
                  </span>
                  <span
                    className={`text-[10px] font-semibold text-center capitalize ${
                      categoryId === cat.id
                        ? "text-[var(--color-amber)]"
                        : "text-[var(--color-ink-2)]"
                    }`}
                  >
                    {cat.id}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Numpad — pinned to bottom */}
      {showNumpad && (
        <div className="flex-shrink-0 px-5 pb-2 mb-20">
          <button
            onClick={() => setShowNumpad(false)}
            className="w-full flex justify-center py-1 mb-1 text-[var(--color-ink-3)]"
          >
            <ChevronDown size={18} />
          </button>
          <div className="grid grid-cols-3 gap-1">
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
                className={`bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl py-4 text-center text-lg font-semibold text-[var(--color-ink)] font-mono active:bg-[var(--color-amber-light)] active:border-[var(--color-amber)] transition-colors
                      `}
              >
                {k === "del" ? "⌫" : k}
              </button>
            ))}
          </div>
          <button
            onClick={handleSave}
            className="w-full bg-[var(--color-ink)] text-[var(--color-bg)] rounded-[14px] py-4 text-base font-bold active:bg-[var(--color-amber)] transition-colors"
          >
            Simpan Transaksi
          </button>
        </div>
      )}
    </div>
  );
}
