import React from "react";
import { useSelector } from "react-redux";
import { Target } from "lucide-react";

const ActiveBudgets = () => {
  const overview = useSelector((state) => state.ai.overview);

  if (!overview) return null;

  const { active_budgets, total_budget } = overview.budget_count_list;

  return (
    <div className="bg-white  rounded-2xl shadow-md p-6 w-72 flex flex-col gap-3">
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
        <Target className="w-5 h-5 text-indigo-600" />
      </div>

      {/* Count */}
      <h2 className="text-2xl font-bold text-gray-900">{active_budgets}</h2>
      <p className="text-sm text-gray-500 font-medium">Active Budgets</p>

      {/* Status */}
      <div className="flex items-center gap-1 text-sm font-semibold">
        <span className="text-emerald-500">
          ▲ {active_budgets} of {total_budget} on track
        </span>
      </div>
    </div>
  );
};

export default ActiveBudgets;
