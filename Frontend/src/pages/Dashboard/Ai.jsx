import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOverview } from "../../store/thunks/aiThunk";
import { AlertCircle, Loader2 } from "lucide-react";
import MainHeader from "../../components/AiInsights/AiHeader/MainHeader";
import Scoreboard from "../../components/AiInsights/AiMain/Scoreboard";
import TotalExpense from "../../components/AiInsights/AiMain/Cards/TotalExpense";
import Savings from "../../components/AiInsights/AiMain/Cards/Savings";
import ActiveBudgets from "../../components/AiInsights/AiMain/Cards/ActiveBudgets";
import AIPredictions from "../../components/AiInsights/AiMain/Cards/AccuracyCount";

const Ai = () => {
  const { ai_loading, isRefreshing, overview, selectedDate } = useSelector(
    (state) => state.ai,
  );
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      try {
        await dispatch(fetchOverview(selectedDate));
      } catch (error) {
        console.error(error);
      }
    })();
  }, [selectedDate]);
  if (ai_loading || isRefreshing) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="animate-spin size-6 text-gray-500" />
      </div>
    );
  }
  return overview ? (
    <div className="flex flex-col gap-2 w-full h-full sm:p-4">
      <MainHeader />

      <Scoreboard data={overview} />
      {/* For cards */}
      <div className="flex justify-between max-sm:flex-col items-center mt-6">
        <TotalExpense />
        <Savings />
        <ActiveBudgets />
        <AIPredictions />
      </div>
    </div>
  ) : (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mb-3" />
        <p className="text-lg font-semibold text-gray-700">No content found</p>
        <p className="text-sm text-gray-500 mt-1">
          Please try again — this may be due to lack of expense data.
        </p>
      </div>
    </div>
  );
};

export default Ai;
