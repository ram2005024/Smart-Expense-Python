import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { capitalize } from "../../../../utils/capitalize";
import { ArrowRight, Dot } from "lucide-react";
import { useAxios } from "../../../../hooks/useAxios";
import toast from "react-hot-toast";
import { setFilteredExpenses } from "../../../../store/slices/expenseSlice";

const PendingApprovalCard = () => {
  const { expenses, filteredExpenses } = useSelector((state) => state.expense);
  const [approvalExpense, setApprovalExpenses] = useState([]);
  const categoryUI = [
    {
      categoryName: "GROCERY",
      icon: "🧺",
      bgColor: "rgba(34, 197, 94, 0.15)", // light green background
      textColor: "#22C55E", // matching green text
    },
    {
      categoryName: "FOOD",
      icon: "🍽️",
      bgColor: "rgba(239, 68, 68, 0.15)", // light red background
      textColor: "#EF4444", // red text
    },
    {
      categoryName: "PERSONAL",
      icon: "🧑🏻‍🦱",
      bgColor: "rgba(59, 130, 246, 0.15)", // light blue background
      textColor: "#3B82F6", // blue text
    },
    {
      categoryName: "TRIP",
      icon: "✈️",
      bgColor: "rgba(245, 158, 11, 0.15)", // light amber background
      textColor: "#F59E0B", // amber text
    },
    {
      categoryName: "CLOTHS",
      icon: "👕",
      bgColor: "rgba(139, 92, 246, 0.15)", // light purple background
      textColor: "#8B5CF6", // purple text
    },
    {
      categoryName: "OTHERS",
      icon: "📦",
      bgColor: "rgba(107, 114, 128, 0.15)", // light gray background
      textColor: "#6B7280", // gray text
    },
    {
      categoryName: "STUDY",
      icon: "📖",
      bgColor: "rgba(110, 114, 128, 0.15)", // light gray background
      textColor: "#6B7280", // gray text
    },
  ];
  useEffect(() => {
    (() => {
      setApprovalExpenses(
        expenses?.filter((item) => item.status === "PENDING"),
      );
    })();
  }, []);
  console.log(approvalExpense);
  // Dispatch-----_____
  const dispatch = useDispatch();
  // Axios api

  const api = useAxios();
  // --------------
  // ------Clear the approve expenses function------------
  const handleClick = async () => {
    if (approvalExpense?.length == 0) return;
    try {
      for (let exp of approvalExpense) {
        await api.patch(`expenses/${exp.id}/`, {
          status: "REIMBRUSHED",
        });
      }
      toast.success("Updated successfully");
      dispatch(
        setFilteredExpenses(
          filteredExpenses?.map((i) =>
            i.status === "PENDING" ? { ...i, status: "REIMBRUSHED" } : i,
          ),
        ),
      );
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setApprovalExpenses([]);
    }
  };
  // _---------------------_____________
  return (
    <div className="w-full px-2 py-3.5 border border-gray-100 rounded-lg shadow bg-white">
      <div className="flex flex-col gap-2 text-sm">
        <span className="text-gray-400 tracking-wider text-[12px] font-semibold pl-2">
          NEEDS APPROVAL
        </span>
        <div className="flex flex-col gap-1.5 w-11/12 mx-auto">
          {approvalExpense?.length > 0 ? (
            approvalExpense.map((items) => {
              const expenseIcon = categoryUI.find(
                (i) => i.categoryName == items.expense_category,
              ).icon;
              return (
                <div
                  key={items.id}
                  className="p-2.5 border border-gray-100 bg-slate-50 rounded-xl
                                   flex gap-1.5 justify-between items-center overflow-hidden"
                >
                  <div className="flex gap-1">
                    <span className="text-xl">{expenseIcon}</span>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-gray-800 font-semibold text-xs">
                        {capitalize(items.expense_name)}
                      </span>
                      <span className="text-[12px] font-medium text-gray-400">
                        Rs. {items.expense_amount}
                      </span>
                    </div>
                  </div>
                  <Dot className="text-red-400 size-7 animate-ping" />
                </div>
              );
            })
          ) : (
            <span>No expense to approve</span>
          )}
        </div>
        {approvalExpense?.length > 0 && (
          <button
            onClick={() => handleClick()}
            className=" rounded-xl inline-flex gap-2 cursor-pointer  items-center bg-gradient-to-r transition-all duration-200 ease-in active:scale-95  group from-indigo-600 to-indigo-500 justify-center w-11/12 mx-auto py-2 text-white font-semibold text-[14px]"
          >
            <span>Submit for approval</span>
            <ArrowRight className="size-4 text-gray-300 transition-all duration-200 ease-in group-hover:translate-x-2" />
          </button>
        )}
      </div>
    </div>
  );
};

export default PendingApprovalCard;
