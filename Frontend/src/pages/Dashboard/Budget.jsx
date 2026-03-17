import React, { useEffect, useState } from 'react'
import BudgetHeader from '../../components/Budget/BudgetHeader'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBudget, fetchBudgetWithLimit } from '../../store/thunks/budgetThunk'
import BudgetCard from '../../components/Budget/BudgetCard'
import GridViewBudget from '../../components/Budget/GridViewBudget'
import TableView from '../../components/Budget/TableView'
import toast from 'react-hot-toast'
import BudgetHealth from '../../components/Budget/BudgetAnalyticsCards/BudgetHealth'
import BudgetSpentExpenseGraph from '../../components/Budget/BudgetAnalyticsCards/BudgetSpentExpenseGraph'
import TopSpenders from '../../components/Budget/BudgetAnalyticsCards/TopSpenders'
import RecentActivity from '../../components/Budget/BudgetAnalyticsCards/RecentActivity'
import AdjustBudget from '../../components/Budget/AdjustBudget'

const Budget = () => {
    const dispatch = useDispatch()
    const { activeView, activeBudgetType, budgets } = useSelector(state => state.budget)
    const [isAdjust, setIsAdjust] = useState(false)
    // Get all the active budgets
    useEffect(() => {
        (
            async () => {
                try {
                    await dispatch(fetchBudget()).unwrap()
                    await dispatch(fetchBudgetWithLimit(activeBudgetType)).unwrap()
                } catch (error) {
                    toast.error(error)
                }
            }
        )()


    }, [activeBudgetType, dispatch])
    const isBudgetExceed = budgets?.find((i) => i.total_spent > i.budget_amount) || null

    return (
        <div className='w-full p-4 sm:px-8'>
            {/* Budget header */}
            <BudgetHeader />
            {/* Budget card */}
            <BudgetCard />

            {/* Hero section */}
            <div className='flex sm:mt-8 mt-3 w-full gap-2.5 max-md:flex-col'>

                {
                    activeView === "GRID" ? (
                        <GridViewBudget />
                    ) :
                        (
                            <TableView />
                        )
                }
                <div className='flex-1 flex flex-col gap-4'>
                    <BudgetHealth />
                    <BudgetSpentExpenseGraph />
                    <TopSpenders />
                    <RecentActivity />
                </div>
            </div>
            {
                isBudgetExceed && (
                    <div className='w-10/12 mt-4 mx-auto p-2 rounded-lg bg-red-100 flex justify-between items-center'>
                        <div className='text-sm font-semibold text-gray-400'>
                            ⚠️ <span className='text-red-400 text-[16px]'>{isBudgetExceed.budget_name
                            }</span><span> has exceeded its budget by Rs. {(isBudgetExceed.total_spent - isBudgetExceed.budget_amount).toFixed(2)}.Please reallocate this budget or manage the budget amount
                            </span></div>
                        {/* Button */}
                        <button onClick={() => setIsAdjust(true)} className='text-xs w-28 text-red-900 font-semibold rounded-lg p-2 flex items-center
                            justify-center cursor-pointer bg-red-300/50 transition-all 
                            duration-200 ease-in hover:bg-red-300/70 active:scale-95'>
                            Adjust Budget
                        </button>
                    </div>

                )
            }
            {isBudgetExceed && <AdjustBudget isActive={isAdjust} setIsActive={setIsAdjust} selectedBudget={isBudgetExceed} />}
        </div>
    )
}

export default Budget
