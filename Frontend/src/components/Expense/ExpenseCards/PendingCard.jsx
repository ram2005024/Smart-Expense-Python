import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import useAuth from '../../../hooks/useAuth'
import { useAxios } from '../../../hooks/useAxios'
import dayjs from 'dayjs'
import { TrendingDown, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'
const Pending = () => {
    const [loading, setLoading] = useState(false)
    const { selectedMonth, filteredExpenses } = useSelector((state) => state.expense)
    const [insights, setInsights] = useState({})
    const { backendURL } = useAuth()

    const api = useAxios()
    const [error, setError] = useState("")
    useEffect(() => {
        (async () => {
            try {
                setLoading(true)
                const res = await api.get(backendURL + `/ai/expense/pending?year=${dayjs(selectedMonth).year()}&month=${dayjs(selectedMonth).month() + 1}`)
                setInsights(res.data)

            } catch (error) {
                // console.log(error)
                setError(error.response?.data?.message || error.message)
            } finally {
                setLoading(false)
            }

        })()
    }, [selectedMonth, filteredExpenses])
    if (error) {
        return toast.error(error)
    }
    return (
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-2xl flex flex-col gap-3 w-[320px] hover:shadow-md transition-all duration-300">
            {
                <>
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-gray-500 tracking-wide">
                            Pending Expenses
                        </span>

                        {insights?.trend === "up" ? (
                            <TrendingUp className="size-6 text-red-500 stroke-1" />
                        ) : (
                            <TrendingDown className="size-6 text-green-500 stroke-1" />
                        )}
                    </div>

                    {/* Amount */}
                    <span className='text-2xl font-bold tracking-wide'>
                        Rs {insights?.pending_total || 0}
                    </span>

                    {/* Trend + Count */}
                    <div className="flex items-center justify-between">
                        <div
                            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${insights?.trend === "up"
                                ? "bg-red-100 text-red-600"
                                : "bg-green-100 text-green-600"
                                }`}
                        >
                            {insights?.trend === "up" ? (
                                <TrendingUp className="size-3 stroke-2" />
                            ) : (
                                <TrendingDown className="size-3 stroke-2" />
                            )}
                            {insights?.trend?.toUpperCase()}
                        </div>

                        <span className="text-[11px] text-gray-500 font-medium">
                            {insights?.pending_expenses_number} awaiting
                        </span>
                    </div>

                    {/* Compact Stats */}
                    <div className="flex justify-between gap-2 text-[10px] text-gray-600 mt-1">
                        <div className="flex flex-col">
                            <span className="text-gray-400">Avg</span>
                            <span className="font-semibold text-gray-800">
                                {insights?.average_approval_days || 0}
                            </span>
                        </div>

                        <div className="flex flex-col text-center">
                            <span className="text-gray-400">Oldest pending from</span>
                            <span className="font-semibold text-gray-800">
                                {insights?.oldest_pending_from || 0}d
                            </span>
                        </div>

                        <div className="flex flex-col text-center">
                            <span className="text-gray-400">Approval Rate</span>
                            <span className="font-semibold text-gray-800">
                                {insights?.oldest_pending_from || 0} %
                            </span>
                        </div>
                    </div>
                </>
            }
        </div>
    );


}

export default React.memo(Pending)
