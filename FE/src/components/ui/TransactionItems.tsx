import { Transactions } from "../../utils/interfaces";
import { formatIDR } from "../../utils/index";
import {
  CATEGORIES,
  CATEGORY_META,
  FALLBACK_META,
} from "../../data/catergoryMeta";
import { useNavigate } from "react-router-dom";

export function TransactionItem({ data }: { data: Transactions[] }) {
  const navigate = useNavigate();
  return (
    <div>
      {/* Item */}
      {data?.map((item: Transactions, index: number) => {
        const cat = CATEGORIES.find((c) => c.id === item.kategori);

        const Icon = cat?.icon || FALLBACK_META.icon;
        return (
          <button
            key={index}
            onClick={() => navigate(`/transaksi/${item.id}`)}
            className="w-full flex items-center gap-3 px-5 py-3 border-b border-border active:bg-amber-light transition-colors text-left"
          >
            {/* Icon */}
            <div
              className="w-11 h-11 rounded-md flex items-center justify-center text-xl shrink-0"
              style={{ backgroundColor: cat?.bg ?? "#f5f0e8" }}
            >
              {Icon ? (
                <Icon size={20} color={cat?.color} strokeWidth={1.75} />
              ) : (
                "📦"
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink truncate">
                {item.catatan || item.kategori}
              </p>
              <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-border text-ink-2 mt-0.5">
                {item.kategori}
              </span>
            </div>

            {/* Amount */}
            <div className="text-right shrink-0">
              <p
                className="text-[15px] font-bold font-mono"
                style={{
                  color:
                    item.tipe === "Pemasukan"
                      ? "var(--color-green)"
                      : "var(--color-red)",
                }}
              >
                {item.tipe === "Pemasukan" ? "+" : "−"} {formatIDR(item.jumlah)}
              </p>
              <p className="text-[10px] text-ink-3 mt-0.5">{item.waktu}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
