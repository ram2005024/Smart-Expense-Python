import { TrendingDown, TrendingUp } from "lucide-react"
import React from "react"

const TotalSpend = ({ insight }) => {

    return (
        <div className="p-4 w-70 rounded-lg space-y-4 bg-white flex flex-col  border border-gray-100 shadow-sm">
            <div className="w-full flex  justify-between">
                <span className="text-sm font-semibold text-gray-400 tracking-wider">Total spent</span >
                <span className="text-xl">💸</span>
            </div>
            <div className="flex flex-col gap-1 text-xs">
                <h2 className="text-2xl font-bold ">
                    Rs. {insight?.total_spent}
                </h2>
                <div className="flex gap-1 items-center ">
                    <div className="flex items-center  p-1 gap-1 bg-gray-100 text-gray-500 rounded-sm">
                        {insight?.trend === "Up" ? (
                            <TrendingUp className="size-3 text-red" />
                        ) : (
                            <TrendingDown className="size-3 text-green-400 " />
                        )

                        }
                        <span className="text-[10px] font-semibold">{insight?.trend == "Up" ? "Up" : "Down"}</span>
                    </div>
                    {/* Budget used */}
                    <span className="text-[10px] font-semibold text-gray-400">
                        {insight?.budget_usage_percentage} % of budget used
                    </span>
                </div>
            </div>
        </div>
    )
}

export default TotalSpend
