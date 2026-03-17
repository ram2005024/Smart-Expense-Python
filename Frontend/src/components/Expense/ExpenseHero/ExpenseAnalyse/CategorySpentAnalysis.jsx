import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAxios } from '../../../../hooks/useAxios'
import toast from 'react-hot-toast'
import ProgressBar from './ProgressBar'

const CategorySpentAnalysis = () => {
    const api = useAxios()
    const { selectedMonth } = useSelector(state => state.expense)
    const [data, setData] = useState(null)
    useEffect(() => {
        (
            async () => {
                try {
                    const res = await api.get(`expense/get_category_budget_usage?date=${selectedMonth}`)
                    setData(res.data)
                } catch (error) {
                    toast.error(error.message)
                }
            }
        )();
    }, [selectedMonth])
    if (!data) return null
    return (
        <div className='flex flex-col gap-2 w-full border border-gray-50 shadow rounded-xl p-4 bg-white'>
            <h2 className='text-gray-400 text-xs font-semibold tracking-wider'>Monthly Budget</h2>
            {/* PROGRESS CONTAINER */}
            {
                data.map((i, index) => {
                    return (
                        <div key={index} className='w-full'>
                            <ProgressBar data={i} />
                        </div>
                    )
                })
            }
        </div>
    )
}

export default CategorySpentAnalysis
