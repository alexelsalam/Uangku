import { useEffect, useMemo } from "react";
import { Pie, PieChart } from "recharts";
import { useAppStore } from "../store/store";

export default function PieChartWithPaddingAngle({
  isAnimationActive = true,
  borderColor = null,
}) {
  const { dataPieTransactions, getDataPieTransactions } = useAppStore();
  useEffect(() => {
    getDataPieTransactions();
  }, [getDataPieTransactions]);

  const data = useMemo(() => {
    const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF"];

    return (dataPieTransactions || []).map((item, index) => ({
      name: item.kategori,
      value: item.jumlah,
      fill: colors[index % colors.length],
    }));
  }, [dataPieTransactions]);

  return (
    <>
      {data.length > 0 ? (
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
            {data.map((item, index) => (
              <div key={index} className="m-2">
                <div
                  className="h-1 w-3 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <div>
                  <p>{item.name}</p>
                  <p>Rp{item.value.toLocaleString("id-ID")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-400 py-8">
          Belum ada data transaksi
        </div>
      )}
    </>
  );
}
