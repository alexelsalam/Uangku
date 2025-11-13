// import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
// import apiData from "../Data/apiData";
export default function DetailTransaksi({
  item,
  handleDetail,
  isDetail,
  setShowAnimOut,
  setNewData,
}) {
  const deleteHandle = async (id) => {
    // Handle delete logic here
    try {
      const res = await fetch(`/transactions/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Server error ${res.status}: ${text}`);
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Gagal menghapus data");
    } finally {
      // alert("Data berhasil dihapus");
      setNewData((prev) => !prev); // Refresh data after deletion
      handleDetail(); // Close detail view after deletion
    }
  };

  return createPortal(
    <div>
      {/* {items.map((item) => { */}
      <div
        key={item.id}
        className={`${isDetail ? "animate-fadeInUp" : "animate-fadeInDown"} 
                    fixed z-[9999] h-auto left-0 right-0 bottom-0 bg-black p-4 rounded-t-3xl `}
        onAnimationEnd={() => {
          if (!isDetail) setShowAnimOut(false);
        }}
      >
        {/* button close */}
        <div className="flex justify-center p-2">
          <button
            className="w-1/4 h-2 rounded-full bg-[#D9D9D9]/50"
            onClick={() => handleDetail()} // Close detail view
            type="button"
          ></button>
        </div>

        <div className="flex flex-col items-center gap-2 mb-4 mt-2">
          {/* Lingkaran besar */}
          <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-emerald-900/70">
            {/* Lingkaran kecil di dalam */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500">
              {/* Icon (bisa pakai lucide-react atau emoji sementara) */}
              <span className="text-white text-2xl">💰</span>
            </div>
          </div>

          {/* Teks di bawah icon */}
          <p className="text-sm text-gray-200">{item.pembayaran}</p>
        </div>
        <div className="relative w-full h-28 rounded-2xl border-2 border-dotted border-gray-500 p-4 flex flex-col items-center justify-center gap-2 mx-auto">
          {/* Tombol kategori */}
          <p className="absolute -top-3 bg-emerald-600 text-white text-sm px-4 py-1 rounded-full">
            {item.kategori}
          </p>

          {/* Nominal */}
          <p className="text-white text-xl font-light text-center">
            Rp{item.jumlah.toLocaleString("id-ID")}
          </p>
        </div>
        <ul className="mt-10 text-white">
          <li className="flex justify-between">
            <p className="text-sm">Admin: </p>
            <p className="text-sm">{item.admin}</p>
          </li>
          <li className="flex justify-between">
            <p className="text-sm">Waktu: </p>
            <p className="text-sm">{item.waktu}</p>
          </li>
          <li className="flex justify-between">
            <p className="text-sm">Tanggal: </p>
            <p className="text-sm">{item.tanggal}</p>
          </li>
          <li className="flex justify-between">
            <p className="text-sm">Catatan: </p>
            <p className="text-sm">{item.catatan}</p>
          </li>
        </ul>

        <button
          type="button"
          onClick={() => deleteHandle(item.id)}
          className="w-full mt-4 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          hapus
        </button>
      </div>
      ;{/* })} */}
    </div>,
    document.body
  );
}
