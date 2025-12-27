import { Nav } from "../components/Nav";
import BarChartWithMultiXAxis from "../components/BarChart.jsx";
import PieChartWithPaddingAngle from "../components/PieChart.jsx";

export function Data() {
  return (
    <div
      id="transaksi"
      className="relative bg-black text-white flex flex-col w-full h-screen md:w-sm md:mx-auto md:rounded-lg md:shadow-lg"
    >
      <div className="absolute inset-0 bg-black/80 overflow-auto backdrop-blur-sm">
        <h2 className="pt-2 pl-5 text-2xl font-normal">Data</h2>
        <div
          className="bg-black
         rounded-3xl h-auto w-[97%] mx-auto mt-4 px-2"
        >
          <BarChartWithMultiXAxis />
        </div>
        <div
          className="relative  bg-black
         rounded-3xl h-auto w-[97%] mx-auto mt-4 px-2"
        >
          <p className="p-2">pendapatan</p>
          <PieChartWithPaddingAngle />
        </div>
      </div>
      {/* bg */}
      <div className="bg-primary p-4 h-2/3 "></div>
      <div className="-mt-1">
        <img
          src="../src/assets/Vector.svg"
          alt="wave vektor"
          className="w-full"
        />
      </div>
      <Nav />
    </div>
  );
}
