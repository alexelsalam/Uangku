import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// #region Sample data
const data = [
  {
    date: "2000-01",
    out: 80000,
    in: 1000000,
  },
  {
    date: "2000-02",
    out: 300000,
    in: 139800,
  },
  {
    date: "2000-03",
    out: 2000000,
    in: 2500000,
  },
  {
    date: "2000-04",
    out: 2700080,
    in: 3900008,
  },
  {
    date: "2000-05",
    out: 1000890,
    in: 4800000,
  },
  {
    date: "2000-06",
    out: 2000390,
    in: 3800000,
  },
  {
    date: "2000-07",
    out: 3000490,
    in: 4300000,
  },
  {
    date: "2000-08",
    out: 4000000,
    in: 2400000,
  },
  {
    date: "2000-09",
    out: 3000000,
    in: 1300098,
  },
  {
    date: "2000-10",
    out: 2000000,
    in: 9800000,
  },
  {
    date: "2000-11",
    out: 2000780,
    in: 3900008,
  },
  {
    date: "2000-12",
    out: 1000890,
    in: 4800000,
  },
];

// #endregion
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
  return (
    <BarChart
      style={{
        width: "100%",
        maxWidth: "700px",
        maxHeight: "70vh",
        aspectRatio: 1.618,
      }}
      responsive
      data={data}
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
      <Bar dataKey="in" fill="#328E6E" radius={[8, 8, 0, 0]} />
      <Bar dataKey="out" fill="#CF0F47" radius={[8, 8, 0, 0]} />
    </BarChart>
  );
};

export default BarChartWithMultiXAxis;
