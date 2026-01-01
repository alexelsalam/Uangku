import apiData from "../Data/apiData.js";
import Alarm from "../icons/Alarm.jsx";
import { useEffect, useState } from "react";

export default function WarningSpend() {
  const [isOpen, setIsOpen] = useState(false);
  const [totalPemasukan, setTotalPemasukan] = useState(0);
  const [totalPengeluaran, setTotalPengeluaran] = useState(0);
  const [date, setDate] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const resPemasukan = await apiData("pemasukan/total");
        const resPengeluaran = await apiData("pengeluaran/total");

        setTotalPemasukan(resPemasukan.total || 0);
        setDate(resPemasukan.month || "");
        setTotalPengeluaran(resPengeluaran.total || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })();
  });

  const alarmHandle = () => {
    setIsOpen(!isOpen);
  };

  const income = totalPemasukan;
  const expense = totalPengeluaran;

  const progress = income === 0 ? 0 : Math.min((expense / income) * 100, 100);

  const safeProgress = Math.max(0, Math.min(progress, 100)); //bounds the progress value between 0 and 100

  const STEPS = 5;

  const stepSize = 100 / STEPS;
  const fullSteps = Math.floor(safeProgress / stepSize);
  const remainder = progress % stepSize;
  const partialFill = remainder / stepSize;

  function getProgressColor(progress) {
    if (progress >= 90) return "bg-red-500";
    if (progress >= 70) return "bg-yellow-500";
    return "bg-green-500";
  }

  function getProgressBg(progress) {
    if (progress >= 90) return "bg-red-200";
    if (progress >= 70) return "bg-yellow-200";
    return "bg-green-200";
  }
  function getProgressBgAlarm(progress) {
    if (progress >= 90) return "text-[#B12C00] animate-pulse";
    if (progress >= 70) return "text-yellow-200 animate-pulse";
    return "text-white";
  }
  const fillColor = getProgressColor(safeProgress);
  const bgColor = getProgressBg(safeProgress);
  const alarmColor = getProgressBgAlarm(safeProgress);

  return isOpen ? (
    <div className="relative">
      <div className="w-64 h-20 bg-white rounded-md shadow-lg absolute  -top-4 right-3 flex items-center justify-center text-black">
        <div className="text-[0.5rem] text-black absolute top-2 left-2">
          <p>Batas Pengeluaran</p>
          <p>Bulan {date}</p>
        </div>
        <div className="flex text-xs text-black absolute bottom-5 right-2">
          <p>Rp{totalPengeluaran.toLocaleString("id-ID")} /</p>
          <p className="text-[0.5rem] text-">
            Rp{totalPemasukan.toLocaleString("id-ID")}
          </p>
        </div>

        <div className="flex  w-[75%] h-3  absolute bottom-2 right-2">
          {[...Array(STEPS)].map((_, i) => {
            // full
            if (i < fullSteps) {
              return (
                <div
                  key={i}
                  className={`h-[0.3rem] w-full rounded-full ${fillColor}`}
                />
              );
            }
            // partial
            if (i === fullSteps && partialFill > 0) {
              return (
                <div
                  key={i}
                  className={`h-[0.3rem] w-full rounded-full ${bgColor} overflow-hidden`}
                >
                  <div
                    className={`h-full ${fillColor} transition-all duration-300`}
                    style={{ width: `${partialFill * 100}%` }}
                  />
                </div>
              );
            }
            // empty
            return (
              <div
                key={i}
                className={`h-[0.3rem] w-full rounded-full ${bgColor}`}
              />
            );
          })}
        </div>
      </div>
      <button
        onClick={alarmHandle}
        className="absolute right-5 -top-4 text-black text-xl "
      >
        x
      </button>
    </div>
  ) : (
    <button
      onClick={alarmHandle}
      className="flex items-center justify-center w-6 h-6 mr-2 cursor-pointer"
    >
      <Alarm className={`${alarmColor}`} />
    </button>
  );
}
