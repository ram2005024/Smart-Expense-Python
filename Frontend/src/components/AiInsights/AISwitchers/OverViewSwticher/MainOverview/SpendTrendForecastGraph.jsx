import { Bar } from "react-chartjs-2";
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function SpendTrendChart({ data = [] }) {
  const spendTrend = data.length > 0 ? data : [];

  const labels = spendTrend.map((d) => {
    const [y, m] = d.month.split("-");
    const label = new Date(y, m - 1).toLocaleString("default", {
      month: "short",
    });
    return d.actual_spend ? label : `${label}*`;
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: "Actual",
        data: spendTrend.map((d) => d.actual_spend),
        backgroundColor: "#3B82F6",
        borderRadius: 6,
      },
      {
        label: "Projected",
        data: spendTrend.map((d) => d.predicted_spent),
        backgroundColor: "#F59E0B",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (item) => {
            if (!item.raw) return "";
            return `Rs. ${item.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        grid: { color: "#f1f5f9" },
      },
    },
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-800">
          Spend Trend & Forecast
        </h2>
      </div>

      <div className="w-full h-[260px]">
        <Bar data={chartData} options={options} />
      </div>

      {/* FOOTNOTE */}
      <p className="text-xs text-gray-400 mt-2">* Predicted values</p>
    </div>
  );
}
