import { useEffect, useState } from "react";
import TransactionsList from "../components/TransactionsList";
import groupByDate from "../utils/GrupByDate";
// import apiData from "../Data/apiData";

export function Transaksi() {
  const [data, setData] = useState(null);
  const [newData, setNewData] = useState(false);
  const [overlay, setOverlay] = useState(null);
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

  const tx = groupByDate(data || []);
  // const [items] = Object.values(tx);
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
      className="relative bg-black text-white flex flex-col w-full h-screen "
    >
      {/* overlay saat nampilin tab lain*/}
      {overlay && (
        <div className="absolute inset-0 bg-black/80 overflow-auto backdrop-blur-sm z-[11]" />
      )}
      <div className="backdrop-blur-sm flex justify-between fixed bg-[#B6B09F]/10 z-[10] w-full h-14 rounded-b-lg">
        <div>
          <h2 className="pt-2 pl-3 text-xl font-normal">Transaksi</h2>
        </div>
        <button
          onClick={() => (filterHandle(), setOverlay(true))}
          className={`absolute right-4 top-2 font-normal px-5 rounded-full border-solid border-white border-2 items-center ${
            overlay ? "" : ""
          }`}
        >
          <p>Filter</p>
        </button>
      </div>
      {/* membuat overlay bisa di scroll */}
      <div className="absolute inset-0 bg-black/80 overflow-auto backdrop-blur-sm">
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
        <img
          src="../src/assets/Vector.svg"
          alt="wave vektor"
          className="w-full"
        />
      </div>
      {/* filter comp*/}
      {(filter || showAnimOut) && (
        <div
          className={`${
            filter ? "animate-fadeInUp" : "animate-fadeInDown"
          }  absolute z-[12] h-[37rem] left-0 right-0 bottom-0 bg-black p-4 rounded-t-3xl`}
          onAnimationEnd={() => {
            if (!filter) setShowAnimOut(false);
          }}
        >
          {/* button close */}
          <div className="flex justify-center">
            <button
              className="w-1/4 h-2 rounded-full bg-[#D9D9D9]/50"
              onClick={() => (filterHandle(), setOverlay(false))} // Close detail view and overlay
            ></button>
          </div>

          {/* filter kategori */}
          <div className="mt-5 ml-2 space-y-1.5">
            <p className="pl-1">Kategori</p>
            <div className="flex gap-4">
              <button className="bg-[#222] rounded-full px-5">Pemasukan</button>
              <button className="bg-[#222] rounded-full px-5">
                Pengluaran
              </button>
            </div>
          </div>
          {/* filter pembayaran */}
          <div className="mt-5 ml-2 space-y-1.5">
            <p className="pl-1">Pembayaran</p>
            <div className="flex">
              <button className="bg-[#222] rounded-full px-5">Cash</button>
            </div>
          </div>
          {/* fillter jumlah */}
          <div className="mt-5 ml-2 space-y-1.5">
            <p className="pl-1">Jumlah</p>
            <div className="flex">
              <button className="bg-[#222] rounded-full px-5">
                {"<Rp10.000"}
              </button>
            </div>
            <div className="flex mt-4 gap-1">
              <input
                type="text"
                placeholder="min"
                name="min_balance"
                className="bg-[#B6B09F]/50 rounded-full pl-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#328E6E] w-1/2 "
              />
              <p className="text-lg font-extrabold text-center">/</p>
              <input
                type="text"
                placeholder="max"
                name="max_balance"
                className="bg-[#B6B09F]/50 rounded-full pl-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#328E6E] w-1/2 "
              />
            </div>
          </div>
          {/* fillter tanggal */}
          <div className="mt-5 ml-2 space-y-1.5">
            <p className="pl-1">Tanggal</p>
            <div className="flex">
              <button className="bg-[#222] rounded-full px-5">7 Hari</button>
            </div>
            <div className="flex mt-4 gap-1">
              <input
                type="text"
                placeholder="dari"
                name="Mulai Tanggal"
                className="bg-[#B6B09F]/50 rounded-full pl-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#328E6E] w-1/2 "
              />
              <p className="text-lg font-extrabold text-center">/</p>
              <input
                type="text"
                placeholder="sampai"
                name="Sampai Tanggal"
                className="bg-[#B6B09F]/50 rounded-full pl-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#328E6E] w-1/2 "
              />
            </div>
          </div>
          {/* button terapkan filter */}
          <button className="absolute bottom-0 right-0 left-0 bg-[#328E6E] text-white rounded-full px-5 py-2">
            Terapkan Filter
          </button>
          {/* button reset filter */}
          <button className="absolute top-2 right-2 bg-[#CF0F47] text-white rounded-full w-[30px] h-[30px]">
            X
          </button>
        </div>
      )}
    </div>
  );
}
