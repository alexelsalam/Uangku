import { Pie, PieChart } from "recharts";
import Skeleton from "./Skeleton";
import { useAppStore } from "../store/store";
// pengeluaran icons
import FnB from "../icons/icons_pengeluaran/FnB.jsx";
import Pulsa from "../icons/icons_pengeluaran/Pulsa.jsx";
import Internet from "../icons/icons_pengeluaran/Internet.jsx";
import Bensin from "../icons/icons_pengeluaran/Bensin.jsx";
import Liburan from "../icons/icons_pengeluaran/Liburan.jsx";
import Kesehatan from "../icons/icons_pengeluaran/Kesehatan.jsx";
import Tagihan from "../icons/icons_pengeluaran/Tagihan.jsx";
import Belanja from "../icons/icons_pengeluaran/Belanja.jsx";
import Hiburan from "../icons/icons_pengeluaran/Hiburan.jsx";
import Kecantikan from "../icons/icons_pengeluaran/Kecantikan.jsx";
import Transportasi from "../icons/icons_pengeluaran/Transportasi.jsx";
import Pakaian from "../icons/icons_pengeluaran/Pakaian.jsx";
import Service from "../icons/icons_pengeluaran/Service.jsx";
import Investasi from "../icons/icons_pengeluaran/Investasi.jsx";
import Asuransi from "../icons/icons_pengeluaran/Asuransi.jsx";
import Pajak from "../icons/icons_pengeluaran/Pajak.jsx";
import Darurat from "../icons/icons_pengeluaran/Darurat.jsx";
import Pendidikan from "../icons/icons_pengeluaran/Pendidikan.jsx";
import Lainnya from "../icons/icons_pengeluaran/Lainnya.jsx";
// pendapatan icons
import Cash from "../icons/icons_pendapatan/Cash.jsx";
import Freelance from "../icons/icons_pendapatan/Freelance.jsx";
import Pasif from "../icons/icons_pendapatan/Pasif.jsx";
import SideJob from "../icons/icons_pendapatan/SideJob.jsx";
import { useMemo } from "react";

export default function PieChartWithPaddingAngle({
  isAnimationActive = true,
  borderColor = null,
  text,
  dataPie = [],
}) {
  const loading = useAppStore((state) => state.loading);
  const categoryColor = useMemo(
    () => ({
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
    }),
    [],
  );
  const data = useMemo(() => {
    const fallbackColors = [
      "#0088FE",
      "#00C49F",
      "#FFBB28",
      "#FF8042",
      "#A28DFF",
    ];

    return (dataPie || []).map((item, index) => {
      const key = String(item.kategori || "").toLowerCase();
      const meta = categoryColor[key];

      return {
        name: item.kategori,
        value: item.jumlah,
        // use category color when available (keeps pie in sync with CustomSelectCategory),
        // otherwise fall back to a rotating color palette
        fill: meta?.color || fallbackColors[index % fallbackColors.length],
      };
    });
  }, [dataPie, categoryColor]);
  return (
    <>
      {loading ? (
        <Skeleton className="w-full h-64 mb-2 rounded-xl" />
      ) : (
        <div
          className="
         rounded-3xl h-auto w-[97%] mx-auto mt-4 px-2"
        >
          <p className="p-2">{text}</p>
          {data.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              Belum ada data transaksi
            </div>
          ) : (
            <div>
              <div className="flex justify-center">
                <PieChart
                  style={{
                    width: "100%",
                    maxWidth: "100px",
                    maxHeight: "80vh",
                    aspectRatio: 1,
                  }}
                  responsive
                >
                  <Pie
                    data={data}
                    innerRadius="80%"
                    outerRadius="100%"
                    // Corner radius is the rounded edge of each pie slice
                    cornerRadius="50%"
                    fill="#8884d8"
                    // padding angle is the gap between each pie slice
                    paddingAngle={5}
                    dataKey="value"
                    isAnimationActive={isAnimationActive}
                    stroke={borderColor || "none"}
                    strokeWidth={borderColor ? 1 : 0}
                  />
                </PieChart>
              </div>
              <div className="flex-wrap flex  gap-2 items-center justify-start mt-2">
                {data.map((item, index) => {
                  const key = String(item.name || "").toLowerCase();
                  const meta = categoryColor[key];

                  return (
                    <div key={index} className="m-2">
                      <div
                        className="h-1 w-3 rounded-full"
                        style={{ backgroundColor: meta?.color || item.fill }}
                      />
                      <div>
                        <p>{item.name}</p>
                        <p>Rp{item.value.toLocaleString("id-ID")}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
