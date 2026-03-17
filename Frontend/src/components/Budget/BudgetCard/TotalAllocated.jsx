import React from "react"

const TotalAllocated = ({ insight }) => {
    console.log(insight)
    return (
        <div className="p-4 w-70 rounded-lg space-y-4 bg-white flex flex-col  border border-gray-100 shadow-sm">
            <div className="w-full flex  justify-between">
                <span className="text-sm font-semibold text-gray-400 tracking-wider">Total allocated</span >
                <span className="text-sm">📋</span>
            </div>
            <div className="flex flex-col gap-1 text-xs">
                <h2 className="text-2xl font-bold ">
                    Rs. {insight?.budget_total}
                </h2>
                <span className="text-gray-400">
                    {insight?.budget_category_total} categories
                </span>
            </div>
        </div>
    )
}

export default TotalAllocated
