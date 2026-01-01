import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626"];

export default function ComparisonChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <p className="text-gray-500 text-center mt-10">
        No comparison data
      </p>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg border shadow flex justify-center">
      <BarChart width={360} height={260} data={data} barGap={8}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />

        {/* PRICE */}
        <Bar dataKey="price" name="Price ($)">
          {data.map((_, index) => (
            <Cell
              key={`price-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Bar>

        {/* RATING */}
        <Bar dataKey="rating" name="Rating">
          {data.map((_, index) => (
            <Cell
              key={`rating-${index}`}
              fill={COLORS[index % COLORS.length]}
              fillOpacity={0.5}
            />
          ))}
        </Bar>
      </BarChart>
    </div>
  );
}
