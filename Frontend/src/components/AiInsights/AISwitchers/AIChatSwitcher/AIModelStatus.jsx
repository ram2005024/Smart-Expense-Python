import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";
const AiModelStatus = () => {
  // Demo data (replace with real values later)
  const { overview } = useSelector((state) => state.ai);
  const anomalyCount =
    (overview.anomalies?.spike?.length ?? 0) +
    (overview.anomalies?.temporal?.length ?? 0) +
    (overview.anomalies?.recurring?.length ?? 0) +
    (overview.anomalies?.duplication?.length ?? 0);
  const data = [
    {
      field: "Accuracy",
      value: overview?.accuracy_count || "0%",
    },
    {
      field: "Data points",
      value: overview?.data_points,
    },
    {
      field: "Last trained",
      value: moment(overview?.updated_on).fromNow(),
    },
    {
      field: "Anomalies found",
      value: anomalyCount || 0,
    },
    {
      field: "Confidence",
      value:
        parseFloat(overview?.accuracy_count.replace("%", "")) > 70
          ? "High"
          : overview?.accuracy_count >= 50
            ? "Medium"
            : "Low",
    },
  ];
  return (
    <div className="bg-linear-to-br from-slate-900 to-indigo-950 text-gray-400 text-sm  rounded-lg shadow-lg p-6 w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">AI MODEL STATUS</h2>
      <ul className="space-y-2 text-sm">
        {data.map((i, index) => {
          return (
            <li
              key={index}
              className="flex border-b border-b-gray-700 py-2 justify-between"
            >
              <span className="text-gray-400">{i.field}</span>
              <span className="text-white font-semibold"> {i.value}</span>
            </li>
          );
        })}
      </ul>
      <i className="text-[10px] mt-3 text-gray-400">
        Datapoints are based on budgets and expenses, scaled by a 1.5 threshold.
      </i>
    </div>
  );
};

export default AiModelStatus;
