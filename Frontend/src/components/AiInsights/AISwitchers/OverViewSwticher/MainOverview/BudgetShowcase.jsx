import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBudget } from "../../../../../store/thunks/budgetThunk";
import { Loader2, MoveRight } from "lucide-react";
import BasicShowcaseError from "../../../../ErrorComponent/BasicShowcaseError";
import { Link } from "react-router-dom";
import { budgetCategoriesIcons } from "../../../../../assets/assets";

const BudgetShowcase = () => {
  // Basics
  const dispatch = useDispatch();
  const { budgets } = useSelector((state) => state.budget);
  const [budgetLoading, setBudgetLoading] = useState(false);
  const [budgetError, setBudgetError] = useState("");
  //   Functions-----------
  useEffect(() => {
    (async () => {
      setBudgetLoading(true);
      try {
        await dispatch(fetchBudget()).unwrap();
      } catch (error) {
        setBudgetError(
          error.message || "Something went wrong while fetching the budget",
        );
      } finally {
        setBudgetLoading(false);
      }
    })();
  }, []);
  if (budgetLoading) {
    return (
      <div className="size-full flex items-center justify-center">
        <Loader2 className="size-5 text-gray-500 animate-spin" />
      </div>
    );
  }
  if (!budgets || budgetError) {
    return <BasicShowcaseError />;
  }
  return (
    budgets &&
    budgets.length > 0 && (
      <div className="p-4 mt-3 bg-white shadow-xs rounded-lg flex flex-col gap-4">
        <div className="flex justify-between text-sm font-semibold">
          <span>Budget health</span>
          <div className="flex items-center gap-.5">
            <Link to="/dashboard/budget" className="text-indigo-600">
              View all
            </Link>
            <MoveRight className="size-4 text-blue-600" />
          </div>
        </div>
        {/* Budgets UI */}
        <div className="flex flex-col gap-2">
          {budgets.map((item, index) => {
            // For getting the budget icon
            const budgetIcon = budgetCategoriesIcons.filter(
              (i) => i.categoryName === item.budget_field,
            )[0]["icon"];
            // To find if the budget is over or not
            const isOver = Math.floor(item.usage_percentage) >= 100;
            // To get the usage percentage
            const usage_percentage = Math.round(item.usage_percentage, 2);
            //______
            const rowColor = budgetCategoriesIcons.filter(
              (i) => i.categoryName === item.budget_field,
            )[0]["rowColor"];
            const budgetAmount = Math.ceil(item.budget_amount);
            const total_spent = Math.ceil(item.total_spent);
            return (
              <div key={index} className="flex text-gray-800 flex-col gap-1 ">
                <div className="flex justify-between items-center">
                  <div className="flex gap-0.5 items-center">
                    {budgetIcon && (
                      <span className="text-xl">{budgetIcon}</span>
                    )}
                    <span className="text-sm font-semibold">
                      {item.budget_name}
                    </span>
                    {isOver && (
                      <span className="bg-orange-100 px-2 p-1 rounded-full text-xs font-semibold text-orange-600">
                        Over
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1 items-center ">
                    <span className="text-[10px] text-gray-400">
                      Rs.{total_spent}/Rs. {budgetAmount}
                    </span>
                    <span className="text-sm font-semibold text-red-500">
                      {usage_percentage}%
                    </span>
                  </div>
                </div>
                {/* For the row bar */}
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-x-hidden">
                  <div
                    style={{
                      width: `${usage_percentage}%`,
                    }}
                    className={`rounded-full h-full ${rowColor}`}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )
  );
};

export default BudgetShowcase;
