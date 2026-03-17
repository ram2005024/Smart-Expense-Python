import React from 'react'
import MonthlySpendGraph from './MonthlySpendGraph'

const BudgetSpentExpenseGraph = () => {
    return (
        <div className='mt-3 flex flex-col gap-2 px-4 p-2 w-full border bg-white rounded-lg border-gray-200 shadow-md text-sm'>
            <h2 className='font-semibold tracking-wider text-gray-400'>
                Monthly Spend
            </h2>
            <MonthlySpendGraph />
        </div>
    )
}

export default BudgetSpentExpenseGraph
