import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAxios } from '../../hooks/useAxios'
import toast from 'react-hot-toast'
import TotalAllocated from './BudgetCard/TotalAllocated'
import TotalSpend from './BudgetCard/TotalSpend'
import Remaining from './BudgetCard/Remaining'
import OverBudget from './BudgetCard/OverBudget'
const BudgetCard = () => {
    const { activeBudgetType, budgets } = useSelector(state => state.budget)
    const api = useAxios()
    const [budgetInsight, setBudgetInsight] = useState(null)
    const [loading, setLoading] = useState(false)
    // Load the data
    useEffect(() => {
        (async () => {
            setLoading(true)
            try {
                const response = await api.get(`/budget/budgets/budget_insight?limit=${activeBudgetType}`)
                setBudgetInsight(response.data)
            } catch (error) {
                toast.error(error.message || "Something went wrong")
            } finally {
                setLoading(false)
            }
        })()
    }, [activeBudgetType, budgets])
    if (!budgetInsight && loading) {
        return (
            <div className='mt-4 text-xl'>Please wait...</div>
        )
    }
    return (
        <div className='sm:mt-8 mt-3 flex max-sm:flex-col sm:justify-between'>
            <TotalAllocated insight={budgetInsight} />
            <TotalSpend insight={budgetInsight} />
            <Remaining insight={budgetInsight} />
            <OverBudget insight={budgetInsight} />
        </div>
    )
}

export default BudgetCard
