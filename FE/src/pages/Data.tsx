import BarChartWithMultiXAxis from "../components/BarChart";
import PieChartWithPaddingAngle from "../components/PieChart";
import { useEffect } from "react";
import { useAppStore } from "../store/store.js";

export function Data() {
  const { dataPieTransactionsOUT, getDataPieTransactionsOUT } = useAppStore();
  const { dataPieTransactionsIN, getDataPieTransactionsIN } = useAppStore();

  useEffect(() => {
    getDataPieTransactionsOUT();
    getDataPieTransactionsIN();
  }, [getDataPieTransactionsOUT, getDataPieTransactionsIN]);

  return (
    <div
      id="transaksi"
      className="relative bg-black text-white flex flex-col w-full h-screen md:w-sm md:mx-auto md:rounded-lg md:shadow-l"
    >
      <div className="absolute inset-0 bg-black/80 overflow-auto backdrop-blur-sm hide-scrollbar pb-24">
        <h2 className="pt-2 pl-5 text-2xl font-normal ">Data</h2>
        <BarChartWithMultiXAxis />

        <PieChartWithPaddingAngle
          dataPie={dataPieTransactionsIN}
          text={"Pendapatan"}
        />
        <PieChartWithPaddingAngle
          dataPie={dataPieTransactionsOUT}
          text={"Pengeluaran"}
        />
      </div>
      {/* bg */}
      <div className="bg-primary p-4 h-2/3 "></div>
      <div className="-mt-1">
        <img src="/vector.svg" alt="wave-vektor" className="w-full" />
      </div>
    </div>
  );
}
