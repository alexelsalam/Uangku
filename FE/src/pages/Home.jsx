import { useEffect, useState } from "react";
import Headers from "../components/Headers";
import TransactionsList from "../components/TransactionsList";
// import apiData from "../api/apiData.js";
import groupByDate from "../utils/GrupByDate.js";
import { useAppStore } from "../store/store.js";

export default function Home() {
  // const [data, setData] = useState(null);
  const [newData, setNewData] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const { allTransactions, getAllTransactions } = useAppStore();

  useEffect(() => {
    getAllTransactions();
  }, [newData, getAllTransactions]);

  const tx = groupByDate(allTransactions || []); // Gunakan data dari API atau dummyData jika tidak ada
  const items = Object.values(tx)[0] || []; // Ambil nilai dari object yang sudah dikelompokkan

  return (
    <div
      id="home"
      className="relative flex flex-col w-full text-white bg-black h-screen md:w-sm md:mx-auto md:rounded-lg md:shadow-lg"
    >
      {overlay && (
        <div className="absolute inset-0 bg-black/80 overflow-auto backdrop-blur-sm z-10" />
      )}
      {/* Header */}
      <Headers setOverlay={setOverlay} setNewData={setNewData} data={items} />
      {/* Transactions */}
      <h2 className="mb-2 text-lg">Transaksi</h2>
      <div className="px-4 overflow-auto hide-scrollbar">
        {items.length > 0 ? (
          <TransactionsList
            data={items}
            setNewData={setNewData}
            setOverlay={setOverlay}
            overlay={overlay}
          />
        ) : (
          <div className="py-8 text-center text-gray-400">
            Belum ada transaksi
          </div>
        )}
      </div>

      {/* Bottom Navbar */}
    </div>
  );
}
