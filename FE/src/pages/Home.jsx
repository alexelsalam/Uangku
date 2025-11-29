import { useEffect, useState } from "react";
import Headers from "../components/Headers";
import { Nav } from "../components/Nav";
import TransactionsList from "../components/TransactionsList";
// import apiData from "../Data/apiData.js";
import groupByDate from "../utils/GrupByDate.js";

export default function Home() {
  const [data, setData] = useState(null);
  const [newData, setNewData] = useState(false);
  const [overlay, setOverlay] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetch("/transaksi", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        const result = await data.json();
        if (!data.ok) {
          throw new Error(`Error: ${result.message}`);
        }

        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })();
  }, [newData]);

  const tx = groupByDate(data || []); // Gunakan data dari API atau dummyData jika tidak ada
  const items = Object.values(tx)[0] || []; // Ambil nilai dari object yang sudah dikelompokkan

  return (
    <div
      id="home"
      className="relative flex flex-col w-full text-white bg-black min-h-screen"
    >
      {overlay && (
        <div className="absolute inset-0 bg-black/80 overflow-auto backdrop-blur-sm z-10" />
      )}
      {/* Header */}
      <Headers setOverlay={setOverlay} setNewData={setNewData} data={items} />
      {/* Transactions */}
      <div className="flex-1 px-4">
        <h2 className="mb-2 text-lg">Transaksi</h2>
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
      <Nav />
    </div>
  );
}
