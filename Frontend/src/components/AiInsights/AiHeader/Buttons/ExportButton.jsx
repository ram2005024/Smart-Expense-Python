import React from "react";
import { Download } from "lucide-react";
import { convertToCSV } from "../../../../utils/convertToCSV";
import { useSelector } from "react-redux";

const ExportButton = () => {
  const { overview } = useSelector((state) => state.ai);
  const handleExport = (data) => {
    if (!data) return;

    // ✅ Common structure (VERY IMPORTANT)
    const baseRow = {
      section: "",
      type: "",
      name: "",
      amount: "",
      category: "",
      risk: "",
      message: "",
      extra_1: "",
      extra_2: "",
      extra_3: "",
    };

    // 1. Spikes
    const spikes = data.anomalies.spike.map((item) => ({
      ...baseRow,
      section: "SPIKE",
      type: item.type,
      name: item.expense_name,
      amount: item.expense_amount,
      category: item.expense_category,
      extra_1: `index: ${item.index}`,
    }));

    // 2. Warnings
    const warnings = data.warnings.map((item) => ({
      ...baseRow,
      section: "WARNING",
      type: item.type,
      name: item.name,
      amount: item.amount,
      category: item.category,
      risk: item.risk,
      message: item.message,
    }));

    // 3. Forecasts
    const forecasts = data.forecasts.map((item) => ({
      ...baseRow,
      section: "FORECAST",
      type: item.ftype,
      name: "Budget Prediction",
      amount: item.amount,
      risk: item.risk,
      message: item.fmessage,
      extra_1: `Predicted: ${item.prediction}`,
      extra_2: `Trend: ${item.trend}`,
      extra_3: `Days left: ${item.time_remaining}`,
    }));

    // 4. Tips
    const tips = data.tips.map((item) => ({
      ...baseRow,
      section: "TIP",
      type: item.tip_type,
      name: item.budget_name || "General",
      message: item.tip_message,
      risk: item.severity,
    }));

    // 5. Spend Trend
    const trends = data.spend_trend.map((item) => ({
      ...baseRow,
      section: "TREND",
      name: item.month,
      amount: item.actual_spend || item.spent_so_far,
      extra_1: `Predicted: ${item.predicted_spent || "N/A"}`,
    }));

    // 6. Summary (single row)
    const summary = [
      {
        ...baseRow,
        section: "SUMMARY",
        name: "Overall",
        amount: data.total_spent.current_spent,
        message: `Savings: ${data.total_saving.total_saving}`,
        extra_1: `Health Score: ${data.health_score.health_score}`,
        extra_2: `Budgets: ${data.budget_count_list.active_budgets}/${data.budget_count_list.total_budget}`,
        extra_3: `Trend: ${data.total_spent.trend} (${data.total_spent.trend_percentage}%)`,
      },
    ];

    // 🔥 Final clean dataset
    const finalData = [
      ...spikes,
      ...warnings,
      ...forecasts,
      ...tips,
      ...trends,
      ...summary,
    ];

    convertToCSV(finalData, "budget_report");
  };

  return (
    <button
      onClick={() => handleExport(overview)}
      className="flex cursor-pointer items-center gap-1.5 px-3 py-1.5 bg-white rounded-md hover:bg-gray-200 text-sm font-medium text-gray-700"
    >
      <Download className="w-4 h-4" />
      <span>Export</span>
    </button>
  );
};

export default ExportButton;
