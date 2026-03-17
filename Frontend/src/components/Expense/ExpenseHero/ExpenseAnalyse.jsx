import React from 'react'
import ChartAnalyse from './ExpenseAnalyse/ChartAnalyse'
import CategorySpentAnalysis from './ExpenseAnalyse/CategorySpentAnalysis'
import PendingApprovalCard from './ExpenseAnalyse/PendingApprovalCard'

const ExpenseAnalyse = () => {
    return (
        <div className='flex flex-col gap-4'>
            <ChartAnalyse />
            <CategorySpentAnalysis />
            <PendingApprovalCard />
        </div>
    )
}

export default ExpenseAnalyse
