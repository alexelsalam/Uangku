import { useEffect, useState } from "react";
import TransactionsList from "../components/TransactionsList";
import groupByDate from "../utils/GrupByDate";
import Filter from "../components/Filter.jsx";
import apiData from "../api/apiData.js";
import { useLocation } from "react-router-dom";

export function Transaksi() {
  const [data, setData] = useState(null);
  const [newData, setNewData] = useState(false);
  const [query, setQuery] = useState("");
  const [overlay, setOverlay] = useState(null);

  const location = useLocation();

  useEffect(() => {
    // Clear session storage when navigating to the Transaksi page
    if (location.pathname === "/transaksi") {
      sessionStorage.removeItem("uangku_filter");
    }
  }, [location.pathname]);

  useEffect(() => {
    (async () => {
      const result = await apiData(null, query);
      setData(result);
    })();
  }, [newData, query]);

  const tx = groupByDate(data || []);
  const [filter, setFilter] = useState(false);
  const [showAnimOut, setShowAnimOut] = useState(false);

  const filterHandle = () => {
    // Function to handle filter logic
    if (filter) setShowAnimOut(true);
    setFilter(!filter);
  };

  return (
    <div
      id="transaksi"
      className="relative bg-black text-white flex flex-col w-full h-screen md:w-sm md:mx-auto md:rounded-lg md:shadow-lg"
    >
      {/* overlay saat nampilin tab lain*/}
      {overlay && (
        <div className="absolute inset-0 bg-black/80 overflow-auto backdrop-blur-sm z-[11]" />
      )}
      <div className="relative backdrop-blur-sm flex justify-between bg-[#B6B09F]/10 z-[10] w-full h-14 rounded-b-lg">
        <div>
          <h2 className="pt-2 pl-3 text-xl font-normal">Transaksi</h2>
        </div>
        <button
          onClick={() => (filterHandle(), setOverlay(true))}
          className={`absolute right-4 top-2  font-normal px-5 rounded-full border-solid border-white border-2 items-center ${
            overlay ? "" : ""
          }`}
        >
          <p>Filter</p>
        </button>
      </div>
      {/* membuat overlay bisa di scroll */}
      <div className="absolute inset-0 bg-black/80 overflow-auto hide-scrollbar backdrop-blur-sm">
        <div className="px-4 pt-15 space-y-1 ">
          {/* fallback ketika kosong */}
          {Object.keys(tx).length === 0 ? (
            <div className="py-8 text-center text-gray-400">
              Belum ada transaksi
            </div>
          ) : (
            Object.entries(tx).map(([date, items]) => (
              <div key={date} className="mb-4">
                <h2 className="mb-2">{date}</h2>
                <TransactionsList
                  data={items}
                  setNewData={setNewData}
                  setOverlay={setOverlay}
                  overlay={overlay}
                />
              </div>
            ))
          )}
        </div>
      </div>
      {/* bg */}
      <div className="bg-primary p-4 h-1/2 "></div>
      <div className="-mt-1">
        <img src="/vector.svg" alt="wave-vektor" className="w-full" />
      </div>
      {/* filter comp*/}
      {(filter || showAnimOut) && (
        <Filter
          filter={filter}
          setShowAnimOut={setShowAnimOut}
          filterHandle={filterHandle}
          setOverlay={setOverlay}
          setQuery={setQuery}
          setNewData={setNewData}
        />
      )}
    </div>
  );
}
