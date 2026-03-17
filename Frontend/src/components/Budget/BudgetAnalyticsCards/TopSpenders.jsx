import React, { useEffect, useState } from 'react'
import { axiosInstance } from '../../../utils/axios/axiosInstance'
import { Loader } from 'lucide-react'
import { capitalizeFirstLetter } from '../../../utils/capitalize';
import { getColorCode } from '../../../utils/getProgressColor';

const TopSpenders = () => {
    const categoryIcon = [
        { categoryName: "GROCERY", icon: "🧺" },
        { categoryName: "FOOD", icon: "🍽️" },
        { categoryName: "PERSONAL", icon: "🧑🏻‍🦱" },
        { categoryName: "TRIP", icon: "✈️" },
        { categoryName: "CLOTHS", icon: "👕" },
        { categoryName: "OTHERS", icon: "📦" },
        { categoryName: "STUDY", icon: "📖" },
    ];

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    useEffect(() => {
        (
            async () => {
                try {
                    setLoading(true)
                    const res = await axiosInstance.get("budget/budgets/get_top_spend")
                    setData(res.data)
                } catch (error) {
                    console.log(error)
                }
                finally {
                    setLoading(false)
                }
            }
        )()

    }, [])
    if (loading && !data) {
        return (
            <div className="w-full p-2 flex items-center justify-center">
                <Loader className="size-5 text-gray-400 animate-spin" />
            </div>
        )
    }
    if (!loading && !data) {
        return (
            <p className='text-sm text-gray-400 font-semibold'>No data to show</p>
        )
    }
    return (
        <div className='mt-3 flex flex-col gap-2 px-4 p-2 w-full border bg-white rounded-lg border-gray-200 shadow-md text-sm'>
            <h2 className='text-gray-400 font-semibold tracking-wider '>Top Spenders</h2>
            <div className='flex flex-col gap-2  p-2'>

                {
                    data.length > 0 && data.sort((a, b) => b.budget_spent - a.budget_spent).filter(i => i.valid_until > new Date().toLocaleDateString("en-CA")).map((item, idx) => {
                        const icon = categoryIcon.find((i) => i.categoryName == item.budget_category)["icon"]
                        return (
                            <div id={idx} className='w-full flex gap-2 items-center'>

                                <span className='text-xl '>{icon}</span>
                                <div className='flex flex-col w-full text-xs '>
                                    <div className='flex w-full justify-between text-gray-400'>
                                        <span className='text-gray-600 text-xs font-semibold'>{capitalizeFirstLetter(item.budget_name)}</span>
                                        <span className='font-semibold'>{item.budget_spent.toFixed(2)}/{item.budget_amount.toFixed(0)}</span>

                                    </div>
                                    <div className='w-full h-1.5 relative rounded-full bg-gray-200'>
                                        <div style={
                                            {
                                                width: `${item.usage_percentage}%`,
                                                overflowX: "hidden",
                                                backgroundColor: getColorCode(item.usage_percentage, 0.6)
                                            }

                                        }
                                            className='rounded-full h-full'></div>
                                    </div>
                                </div>

                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default TopSpenders
