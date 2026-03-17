import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { axiosInstance } from '../../../utils/axios/axiosInstance'
import { Loader } from 'lucide-react'
import { getColorCode } from '../../../utils/getProgressColor'

const BudgetHealth = () => {
    const { activeBudgetType } = useSelector((state) => state.budget)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const [budgetHealth, setBudgetHealth] = useState(null)
    useEffect(() => {
        (
            async () => {
                setLoading(true)
                try {
                    const res = await axiosInstance.get(`/budget/budgets/get_budget_health?limit=${activeBudgetType}`)
                    setBudgetHealth(res.data)
                } catch (error) {
                    setError(error.message)
                } finally {
                    setLoading(false)
                }
            }
        )();
    }, [activeBudgetType])
    if (!budgetHealth && loading && !error) {
        return (
            <div className='w-full h-full items-center justify-center flex'>
                <Loader className='size-6 text-blue-500 animate-spin' />
            </div>
        )
    }
    if (!budgetHealth && !loading && error) {
        return (
            <div className='text-xs text-red-400'>
                Oops! Error : {error}
            </div>
        )
    }
    return (
        <div className='w-full rounded-lg bg-white border border-gray-200 shadow-md px-4 p-2 flex flex-col gap-2'>
            <h2 className='text-sm text-gray-400 tracking-wider font-semibold'>
                Budget Health
            </h2>
            <div className='w-full flex justify-between items-center'>
                <div className='flex gap-1.5 items-center'>
                    <div
                        className='relative rounded-full size-20 '
                        style={
                            {
                                background: `conic-gradient(${getColorCode(budgetHealth?.usage_percentage)} ${budgetHealth?.usage_percentage * 3.6}deg,#e6e6e6 0deg)`
                            }
                        }>
                        <div style={{ color: getColorCode(budgetHealth?.usage_percentage) }} className=' text-xs font-semibold rounded-full absolute inset-2 bg-white flex flex-col gap-.5 items-center justify-center'>
                            <span className='text-sm text-gray-600'>{budgetHealth?.usage_percentage}%</span>
                            <span className='text-gray-400'>Used</span>
                        </div>
                    </div>
                    <div className='flex flex-col gap-1'>
                        <span className='text-xs font-semibold text-gray-400'>On Track</span>
                        <span className='text-xs font-semibold text-gray-400'>Near Limit</span>
                        <span className='text-xs font-semibold text-gray-400'>Over Budget</span>
                    </div>

                </div>
                <div className='flex flex-col gap-1'>
                    <span className='text-xs font-semibold text-green-400'>{budgetHealth?.on_track}</span>
                    <span className='text-xs font-semibold text-indigo-600'>{budgetHealth?.near_limit}</span>
                    <span className='text-xs font-semibold text-red-500'>{budgetHealth?.over_budget}</span>
                </div>
            </div>

            {
                budgetHealth?.over_budget > 0 ? (
                    <div className='w-full  px-2 p-1 bg-red-400/20 rounded-lg text-xs text-red-600 my-4 font-medium '>
                        ⚠️ {budgetHealth?.over_budget} category has been exceeded!{" "}Review needed

                    </div>
                ) : (
                    <div className='w-full px-2 p-1 bg-green-400/20 rounded-lg text-xs text-green-600 my-4 font-medium'>
                        ✅ Budget is healthy — spending is within limits
                    </div>

                )
            }
        </div>
    )
}

export default BudgetHealth
