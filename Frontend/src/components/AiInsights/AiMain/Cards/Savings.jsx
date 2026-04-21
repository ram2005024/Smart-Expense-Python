import React from "react";
import { useSelector } from "react-redux";
import { Wallet, Triangle } from "lucide-react";

const Savings = () => {
  const overview = useSelector((state) => state.ai.overview);

  if (!overview) return null;

  const { total_saving } = overview;
  const { total_saving: amount, signal } = total_saving;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-72 flex flex-col gap-3">
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
        <Wallet className="w-5 h-5 text-emerald-600" />
      </div>

      {/* Amount */}
      <h2 className="text-2xl font-bold text-gray-900">
        ${amount.toLocaleString()}
      </h2>
      <p className="text-sm text-gray-500 font-medium">Savings Identified</p>

      {/* Signal */}
      <div className="flex items-center gap-1 text-sm font-semibold">
        <Triangle
          className={`w-4 h-4 ${
            signal === "green" ? "text-emerald-500" : "text-red-500"
          }`}
          fill={signal === "green" ? "currentColor" : "none"}
        />
        <span
          className={`${
            signal === "green" ? "text-emerald-500" : "text-red-500"
          } font-medium`}
        >
          Found this month
        </span>
      </div>
    </div>
  );
};

export default Savings;
