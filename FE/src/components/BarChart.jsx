import { useEffect } from "react";
// import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useAppStore } from "../store/store";
// import apiData from "../api/apiData";

const monthTickFormatter = (tick) => {
  const date = new Date(tick);

  return String(date.getMonth() + 1);
};

const renderQuarterTick = (tickProps) => {
  const { x, y, payload, width, visibleTicksCount } = tickProps;
  const { value, offset } = payload;
  const date = new Date(value);
  const month = date.getMonth();
  const quarterNo = Math.floor(month / 3) + 1;

  if (month % 3 === 1) {
    return (
      <text
        x={x + width / visibleTicksCount / 2 - offset}
        y={y + 2}
        textAnchor="middle"
        fill="#fff" // ganti warna teks di sini (mis. putih)
        style={{ fontWeight: 200 }}
      >{`Q${quarterNo}`}</text>
    );
  }

  const isLast = month === 11;

  if (month % 3 === 0 || isLast) {
    const pathX =
      Math.floor(isLast ? x - offset + width / visibleTicksCount : x - offset) +
      0.5;

    return <path d={`M${pathX},${y - 4}v${-35}`} stroke="#fff" />;
  }
  return null;
};

const formatNumberShort = (num) => {
  if (num == null || isNaN(num)) return num;
  const n = Number(num);
  if (Math.abs(n) >= 1_000_000) {
    return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}jt`;
  }
  if (Math.abs(n) >= 1_000) {
    return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}rb`;
  }
  return n.toString();
};

const BarChartWithMultiXAxis = () => {
  // const [data, setData] = useState([]);
  const { dataBarTransactions, getDataBarTransactions } = useAppStore();
  useEffect(() => {
    // (async () => {
    //   const result = await apiData("data/bar");
    //   setData(result);
    // })();
    getDataBarTransactions();
  }, [getDataBarTransactions]);
  return (
    <>
      {dataBarTransactions.length > 0 ? (
        <BarChart
          style={{
            width: "100%",
            maxWidth: "700px",
            maxHeight: "70vh",
            aspectRatio: 1.618,
          }}
          responsive
          data={dataBarTransactions} // gunakan data dari API atau dummyData jika tidak ada
          margin={{
            top: 25,
            right: 0,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={monthTickFormatter}
            tick={{ fill: "#fff" }} // ubah warna teks bulan jadi putih
            tickMargin={5}
            axisLine={{ stroke: "#fff" }} // optional: garis sumbu putih
            tickLine={{ stroke: "#fff" }}
          />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            interval={0}
            tick={renderQuarterTick}
            height={1}
            scale="band"
            xAxisId="quarter"
          />
          <YAxis
            width="auto"
            tickFormatter={formatNumberShort}
            tick={{ fill: "#fff" }} // ubah warna teks nominal jadi putih
            axisLine={{ stroke: "#fff" }}
            tickLine={{ stroke: "#fff" }}
          />
          <Tooltip
            formatter={(value) => `Rp${formatNumberShort(value)}`} // tampilkan prefix Rp
            contentStyle={{
              backgroundColor: "#000", // background hitam
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8,
              padding: "8px 10px",
            }}
            labelStyle={{ color: "#fff", fontSize: 12 }}
            itemStyle={{ color: "#fff", fontWeight: 600 }}
            cursor={{ fill: "rgba(255,255,255,0.04)" }} // hover vertical highlight
          />
          <Legend wrapperStyle={{ paddingTop: "1em" }} />
          <Bar dataKey="pemasukan" fill="#328E6E" radius={[8, 8, 0, 0]} />
          <Bar dataKey="pengeluaran" fill="#CF0F47" radius={[8, 8, 0, 0]} />
        </BarChart>
      ) : (
        <div className="text-center text-gray-400 py-8">
          Belum ada data transaksi
        </div>
      )}
    </>
  );
};

export default BarChartWithMultiXAxis;
