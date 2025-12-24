import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
export default function Filter({
  filter,
  setShowAnimOut,
  filterHandle,
  setOverlay,
  setQuery,
}) {
  const location = useLocation();

  const [tipe, setTipe] = useState("");
  const [pembayaran, setPembayaran] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [minBalance, setMinBalance] = useState("");
  const [maxBalance, setMaxBalance] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const tipeOptions = ["Pemasukan", "Pengeluaran"];
  const pembayaranOptions = ["Cash", "E-Wallet"];
  const jumlahOptions = ["<= Rp10.000", "<= Rp100.000"];
  const tanggalOptions = ["Minggu Ini", "Bulan Ini"];

  // load saved filter on mount
  useEffect(() => {
    if (location.pathname !== "/filter") {
      sessionStorage.removeItem("uangku_filter");
      return; // Do not load filter if not on filter page
    }
    try {
      const saved = sessionStorage.getItem("uangku_filter");
      if (saved) {
        const s = JSON.parse(saved);
        if (s.tipe) setTipe(s.tipe);
        if (s.pembayaran) setPembayaran(s.pembayaran);
        if (s.jumlah) setJumlah(s.jumlah);
        if (s.minBalance) setMinBalance(s.minBalance);
        if (s.maxBalance) setMaxBalance(s.maxBalance);
        if (s.startDate) setStartDate(s.startDate);
        if (s.endDate) setEndDate(s.endDate);
        if (s.tanggal) setTanggal(s.tanggal);
      }
    } catch (err) {
      alert(`Error :${err} loading saved filter. Please try again.`);
    }
  }, [location.pathname]);

  const handleJumlah = (option) => {
    setJumlah(jumlah === option ? "" : option);
    if (option === "<= Rp10.000") {
      setMinBalance("1");
      setMaxBalance("10000");
    } else if (option === "<= Rp100.000") {
      setMinBalance("1");
      setMaxBalance("100000");
    } else {
      setMinBalance("");
      setMaxBalance("");
    }
  };

  const handleTanggal = (option) => {
    setTanggal(tanggal === option ? "" : option);
    if (option === "Minggu Ini") {
      // Set date range for this week
      const today = new Date();
      const firstDayOfWeek = new Date(
        today.setDate(today.getDate() - today.getDay())
      );
      const lastDayOfWeek = new Date(
        today.setDate(firstDayOfWeek.getDate() + 6)
      );
      setStartDate(firstDayOfWeek.toISOString().split("T")[0]);
      setEndDate(lastDayOfWeek.toISOString().split("T")[0]);
    } else if (option === "Bulan Ini") {
      // Set date range for this month
      const today = new Date();
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );
      const lastDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0
      );
      setStartDate(firstDayOfMonth.toISOString().split("T")[0]);
      setEndDate(lastDayOfMonth.toISOString().split("T")[0]);
    } else {
      setStartDate("");
      setEndDate("");
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitting) return; // Prevent multiple submissions
    setSubmitting(true);
    // Save the filter state to localStorage
    try {
      const saved = {
        tipe,
        pembayaran,
        jumlah,
        tanggal,
        minBalance,
        maxBalance,
        startDate,
        endDate,
      };
      sessionStorage.setItem("uangku_filter", JSON.stringify(saved));
    } catch (err) {
      alert(`Error :${err} saving filter. Please try again.`);
    }
    // Construct query parameters

    const params = [];

    if (tipe) {
      params.push(`tipe=${encodeURIComponent(tipe)}`);
    }
    if (pembayaran) {
      params.push(`pembayaran=${encodeURIComponent(pembayaran.toLowerCase())}`);
    }
    if (minBalance && maxBalance) {
      params.push(`min=${encodeURIComponent(minBalance)}`);
      params.push(`max=${encodeURIComponent(maxBalance)}`);
    }
    if (startDate && endDate) {
      params.push(`dari=${encodeURIComponent(startDate)}`);
      params.push(`sampai=${encodeURIComponent(endDate)}`);
    }

    const query = params.join("&");
    setQuery(query);
    filterHandle();
    setOverlay(false);
    setSubmitting(false); // Reset submitting state after submission
  };

  const handleReset = (e) => {
    e.preventDefault();
    // Reset all filter states
    setTipe("");
    setPembayaran("");
    setJumlah("");
    setTanggal("");
    setQuery("");
    setMinBalance("");
    setMaxBalance("");
    setStartDate("");
    setEndDate("");
    // remove persisted filter
    try {
      sessionStorage.removeItem("uangku_filter");
    } catch (err) {
      alert(`Error :${err} loading saved filter. Please try again.`);
    }
    filterHandle();
    setOverlay(false);
  };
  return (
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

      <form onSubmit={handleSubmit}>
        {/* filter tipe */}
        <div className="mt-5 mb-3 ml-2 space-y-1.5">
          <p className="pl-1">Tipe</p>
          <div className="flex gap-5 h-11">
            {tipeOptions.map((option) => (
              <label className="cursor-pointer">
                <input
                  type="checkbox"
                  checked={tipe === option}
                  onChange={() => setTipe(tipe === option ? "" : option)}
                  name="tipe"
                  value={option}
                  className="hidden peer"
                />
                <div
                  className="px-4 py-2 rounded-full text-sm
               bg-gray-800 text-gray-300
               peer-checked:border-2
               peer-checked:border-primary
              
               peer-checked:text-white"
                >
                  {option}
                </div>
              </label>
            ))}
          </div>
        </div>
        {/* filter pembayaran */}
        <div className="mt-5 ml-2 space-y-1.5">
          <p className="pl-1">Pembayaran</p>
          <div className="flex gap-5 h-11">
            {pembayaranOptions.map((option) => (
              <label className="cursor-pointer">
                <input
                  type="checkbox"
                  checked={pembayaran === option}
                  onChange={() =>
                    setPembayaran(pembayaran === option ? "" : option)
                  }
                  name="pembayaran"
                  value={option}
                  className="hidden peer"
                />
                <div
                  className="px-4 py-2 rounded-full text-sm
               bg-gray-800 text-gray-300
               peer-checked:border-2
               peer-checked:border-primary
              
               peer-checked:text-white"
                >
                  {option}
                </div>
              </label>
            ))}
          </div>
        </div>
        {/* fillter jumlah */}
        <div className="mt-5 ml-2 space-y-1.5">
          <p className="pl-1">Jumlah</p>
          <div className="flex gap-5 h-11">
            {jumlahOptions.map((option) => (
              <label className="cursor-pointer">
                <input
                  type="checkbox"
                  checked={jumlah === option}
                  onChange={() => handleJumlah(option)}
                  name="jumlah"
                  value={option}
                  className="hidden peer"
                />
                <div
                  className="px-4 py-2 rounded-full text-sm
               bg-gray-800 text-gray-300
               peer-checked:border-2
               peer-checked:border-primary
              
               peer-checked:text-white"
                >
                  {option}
                </div>
              </label>
            ))}
          </div>
          <div className="flex mt-4 gap-1 relative">
            <div className="relative">
              <label
                htmlFor="minBalance"
                className="absolute left-2 top-1/2 -translate-y-1/2"
              >
                Rp
              </label>
              <input
                type="number"
                id="minBalance"
                placeholder={minBalance ? minBalance : "min"}
                value={minBalance}
                onChange={(e) => setMinBalance(e.target.value)}
                name="minBalance"
                className="bg-[#B6B09F]/50 rounded-full text-center focus:outline-none focus:ring-2 focus:ring-[#328E6E] w-full h-full"
              />
              {minBalance && (
                <button
                  type="button"
                  aria-label="Reset min"
                  onClick={() => setMinBalance("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 font-extrabold"
                >
                  ×
                </button>
              )}
            </div>
            <p className="text-lg font-extrabold text-center">/</p>
            <div className="relative">
              <label
                htmlFor="maxBalance"
                className="absolute left-2 top-1/2 -translate-y-1/2"
              >
                Rp
              </label>
              <input
                type="number"
                id="maxBalance"
                placeholder={maxBalance ? maxBalance : "max"}
                value={maxBalance}
                onChange={(e) => setMaxBalance(e.target.value)}
                name="maxBalance"
                className="bg-[#B6B09F]/50 rounded-full text-center focus:outline-none focus:ring-2 focus:ring-[#328E6E] w-full h-full"
              />
              {maxBalance && (
                <button
                  type="button"
                  aria-label="Reset max"
                  onClick={() => setMaxBalance("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 font-extrabold"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
        {/* fillter tanggal */}
        <div className="mt-5 ml-2 space-y-1.5">
          <p className="pl-1">Tanggal</p>
          <div className="flex gap-5 h-11">
            {tanggalOptions.map((option) => (
              <label className="cursor-pointer">
                <input
                  type="checkbox"
                  checked={tanggal === option}
                  onChange={() => handleTanggal(option)}
                  name="tanggal"
                  value={option}
                  className="hidden peer"
                />
                <div
                  className="px-4 py-2 rounded-full text-sm
               bg-gray-800 text-gray-300
               peer-checked:border-2
               peer-checked:border-primary
              
               peer-checked:text-white"
                >
                  {option}
                </div>
              </label>
            ))}
          </div>
          <div className="flex mt-4 gap-1">
            <div className="relative">
              <input
                type="text"
                placeholder="dari"
                name="mulaiTanggal"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-[#B6B09F]/50 rounded-full pl-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#328E6E] w-full h-full "
              />
              {startDate && (
                <button
                  type="button"
                  aria-label="Reset max"
                  onClick={() => setStartDate("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 font-extrabold"
                >
                  ×
                </button>
              )}
            </div>

            <p className="text-lg font-extrabold text-center">/</p>
            <div className="relative">
              <input
                type="text"
                placeholder="sampai"
                name="sampaiTanggal"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-[#B6B09F]/50 rounded-full pl-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#328E6E] w-full h-full "
              />
              {endDate && (
                <button
                  type="button"
                  aria-label="Reset max"
                  onClick={() => setEndDate("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 font-extrabold"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
        {/* button terapkan filter */}
        <button
          type="submit"
          className="absolute bottom-0 right-0 left-0 bg-[#328E6E] text-white rounded-full px-5 py-2"
        >
          Terapkan Filter
        </button>
        {/* button reset filter */}
      </form>
      <button
        onClick={handleReset}
        className="absolute top-2 right-2 bg-[#CF0F47] text-white rounded-full w-[30px] h-[30px]"
      >
        X
      </button>
    </div>
  );
}
