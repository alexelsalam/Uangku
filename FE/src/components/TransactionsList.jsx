import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import DetailTransaksi from "./DetailTransaksi";
export default function TransactionsList({
  data,
  setOverlay,
  overlay,
  setNewData,
}) {
  const [showAnimOut, setShowAnimOut] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleDetail = (id) => {
    setSelectedId((prev) => (prev === id ? null : id));
    setOverlay(!overlay);
  };

  return (
    <div className="space-y-1">
      {/* Item */}
      {data?.map((item) => {
        const isOpen = selectedId == item.id;
        return (
          <>
            <div
              key={item.id}
              onClick={() => handleDetail(item.id)}
              className="flex items-center p-3 bg-[#B6B09F]/15 rounded-xl cursor-pointer hover:bg-[#B6B09F]/20 transition-colors duration-200"
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  item.tipe === "Pemasukan" ? "bg-emerald-600" : "bg-rose-600"
                }`}
              >
                {item.tipe === "Pemasukan" ? (
                  <Plus size={18} />
                ) : (
                  <Minus size={18} />
                )}
              </div>
              <div className="flex-1 ml-3">
                <p className="text-sm">{item.kategori}</p>
                <p className="text-xs ">{item.catatan}</p>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font- ${
                    item.tipe === "Pemasukan"
                      ? "text-emerald-400"
                      : "text-rose-400"
                  }`}
                >
                  {item.jumlah}
                </p>
                <p className="text-xs ">{item.pembayaran}</p>
              </div>
            </div>
            {/* <TesDetailTransaksi /> */}
            {(isOpen || showAnimOut) && (
              <DetailTransaksi
                item={item}
                handleDetail={handleDetail}
                isDetail={isOpen}
                setShowAnimOut={setShowAnimOut}
                setNewData={setNewData}
              />
            )}
          </>
        );
      })}
    </div>
  );
}
