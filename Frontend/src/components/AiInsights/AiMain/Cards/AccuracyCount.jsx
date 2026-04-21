import React from "react";
import { useSelector } from "react-redux";
import { Balloon, Triangle } from "lucide-react";

const AIPredictions = () => {
  const overview = useSelector((state) => state.ai.overview);

  if (!overview) return null;

  const predictionsCount = overview?.prediction_count || 0;
  const accuracy = overview?.accuracy_count || "0%";

  return (
    <div className="bg-white  rounded-2xl shadow-md p-6 w-72 flex flex-col gap-3">
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
        <Balloon className="w-5 h-5 text-purple-600" />
      </div>

      {/* Count */}
      <h2 className="text-2xl font-bold text-gray-900">{predictionsCount}</h2>
      <p className="text-sm text-gray-500 font-medium">AI Predictions</p>

      {/* Accuracy */}
      <div className="flex items-center gap-1 text-sm font-semibold">
        <Triangle className="w-4 h-4 text-emerald-500" fill="currentColor" />
        <span className="text-emerald-500 font-medium">
          {accuracy} accuracy
        </span>
      </div>
    </div>
  );
};

export default AIPredictions;
