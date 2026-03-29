import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import DetailTransaksi from "./DetailTransaksi";
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
import { Transactions } from "../utils/interfaces";

export default function TransactionsList({
  data,
  setOverlay,
  overlay,
  setNewData,
}: {
  data: Transactions[] | undefined;
  setOverlay: (value: boolean) => void;
  overlay: boolean;
  setNewData: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [showAnimOut, setShowAnimOut] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // category metadata (icon component + color) — keep in sync with CustomSelectCategory options
  const categoryMeta = {
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
  };
  const handleDetail = (id: number) => {
    setSelectedId((prev) => (prev === id ? null : id));
    setOverlay(!overlay);
  };

  return (
    <div className="space-y-1">
      {/* Item */}
      {data?.map((item: Transactions) => {
        const isOpen = selectedId == item.id;

        const key = String(
          item.kategori || "",
        ).toLowerCase() as keyof typeof categoryMeta;
        const meta = categoryMeta[key];
        const IconComp = meta?.icon;

        return (
          <div key={item.id}>
            <div
              onClick={() => handleDetail(item.id)}
              className="flex items-center p-3 bg-[#B6B09F]/15 rounded-xl cursor-pointer hover:bg-[#B6B09F]/20 transition-colors duration-200"
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full`}
                style={{
                  backgroundColor: meta?.color
                    ? meta.color
                    : item.tipe === "Pemasukan"
                      ? "#10B981"
                      : "#F43F5E",
                }}
              >
                {IconComp ? (
                  <IconComp className="w-5 h-5 text-white" />
                ) : item.tipe === "Pemasukan" ? (
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
                  className={`text-sm font-[400] ${
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
          </div>
        );
      })}
    </div>
  );
}
