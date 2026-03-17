import { TrendingDown, TrendingUp } from "lucide-react"
import React from "react"

const OverBudget = ({ insight }) => {

    return (
        <div className="p-4 w-70 rounded-lg space-y-4 bg-white flex flex-col  border border-gray-100 shadow-sm">
            <div className="w-full flex  justify-between">
                <span className="text-sm font-semibold text-gray-400 tracking-wider">Over budget</span >
                <span className="text-xl">⚠️</span>
            </div>
            <div className="flex flex-col gap-1 text-xs">
                <h2 className={`text-2xl font-bold `}>
                    {insight?.overbudget > 0 ? `${insight?.overbudget} category` : `No over budget`}
                </h2>
                <div className="flex gap-1 items-center ">
                    <div className="flex items-center  p-1 gap-1 bg-gray-100 text-gray-500 rounded-sm">
                        {insight?.trend === "Up" ? (
                            <TrendingUp className="size-3 text-red-400" />
                        ) : (
                            <TrendingDown className="size-3 text-green-400 " />
                        )

                        }
                        <span className="text-[10px] font-semibold">{insight?.overbudget > 0 ? "Alert" : "Stable"}</span>
                    </div>
                    {/* Overbudget  */}
                    <span className={`text-xs font-semibold ${insight?.overbudget > 0 ? "text-red-400" : "text-green-400"}`}>
                        {insight?.overbudget > 0 ? "Needs attention" : "All good"}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default OverBudget
