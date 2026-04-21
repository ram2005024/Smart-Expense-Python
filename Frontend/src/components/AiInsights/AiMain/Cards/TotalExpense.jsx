import React from "react";
import { useSelector } from "react-redux";
import { CreditCard, ArrowUpRight, ArrowDownRight } from "lucide-react";

const TotalExpense = () => {
  const overview = useSelector((state) => state.ai.overview);

  if (!overview) return null;

  const { current_spent, trend, trend_percentage } = overview.total_spent;
  const isUp = trend === "Up";

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-72 flex flex-col gap-3">
      {/* Icon */}
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-indigo-600" />
        </div>
      </div>

      {/* Amount */}
      <h2 className="text-2xl font-bold text-gray-900">
        ${current_spent.toLocaleString()}
      </h2>
      <p className="text-sm text-gray-500 font-medium">Total Expenses</p>

      {/* Trend */}
      <div className="flex items-center gap-1 text-sm font-semibold">
        {isUp ? (
          <ArrowUpRight className="w-4 h-4 text-red-500" />
        ) : (
          <ArrowDownRight className="w-4 h-4 text-green-500" />
        )}
        <span
          className={`${isUp ? "text-red-500" : "text-green-500"} font-medium`}
        >
          {isUp ? "+" : "-"}
          {trend_percentage}% this month
        </span>
      </div>
    </div>
  );
};

export default TotalExpense;
