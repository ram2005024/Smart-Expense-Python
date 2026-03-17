import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useAuth from '../../../hooks/useAuth'
import { useAxios } from '../../../hooks/useAxios'
import dayjs from 'dayjs'
import { TrendingDown, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { setTotalExpenseDetail } from '../../../store/slices/expenseSlice'
const TotalSpend = () => {
    const [loading, setLoading] = useState(false)
    const { selectedMonth } = useSelector((state) => state.expense)
    const [insights, setInsights] = useState({})
    const { backendURL } = useAuth()
    const dispatch = useDispatch()
    const api = useAxios()
    const [error, setError] = useState("")
    useEffect(() => {
        (async () => {
            try {
                setLoading(true)
                const res = await api.get(backendURL + `/ai/expense/total_spent?year=${dayjs(selectedMonth).year()}&month=${dayjs(selectedMonth).month() + 1}`)
                setInsights(res.data)
                dispatch(setTotalExpenseDetail(res.data))
            } catch (error) {
                // console.log(error)
                setError(error.response?.data?.message || error.message)
            } finally {
                setLoading(false)
            }

        })()
    }, [selectedMonth])
    if (error) {
        return toast.error(error)
    }
    return (
        <div className='py-2 px-4 bg-white border border-gray-50 shadow rounded-xl flex flex-col gap-4 w-xs overflow-hidden'>
            {

                <>

                    <div className='flex justify-between items-center gap-12'>
                        <span className='text-sm text-gray-400 font-semibold font-serif'>Total Spent</span>
                        {insights && insights.trend === 'up' ? (<TrendingUp className='size-12 text-red-400 stroke-1' />) : (<TrendingDown className='size-12 text-green-500 stroke-1' />)}
                    </div>
                    <div className='flex flex-col  justify-between flex-1'>
                        <span className='text-2xl font-bold tracking-wide'>
                            Rs {insights && insights.total_spent}
                        </span>
                        <div className='flex gap-1.5 items-center'>
                            <div className='flex border border-gray-100 rounded-md p-1.5 bg-slate-100 shadow items-center gap-1.5'>
                                {insights && insights.trend === 'up' ? (<TrendingUp className='size-3 text-red-400 stroke-2' />) : (<TrendingDown className='size-3 text-green-500 stroke-2' />)}
                                <span className='text-xs font-semibold text-gray-400'>{insights && insights.trend?.toUpperCase()}</span>
                            </div>
                            <span className='text-xs font-semibold text-gray-400'>
                                {insights && insights.change > 0 ? "+" : ""}{insights && insights.change}% vs last month
                            </span>
                        </div>
                    </div>
                </>

            }

        </div>
    )
}

export default React.memo(TotalSpend)
