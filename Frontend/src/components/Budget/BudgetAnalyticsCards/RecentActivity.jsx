import React from 'react'
import { useSelector } from 'react-redux'
import { capitalizeFirstLetter } from '../../../utils/capitalize';
import { useNavigate } from 'react-router-dom';

const RecentActivity = () => {
    const { expenses } = useSelector(state => state.expense)
    const navigate = useNavigate()
    const categoryIcon = [
        { categoryName: "GROCERY", icon: "🧺" },
        { categoryName: "FOOD", icon: "🍽️" },
        { categoryName: "PERSONAL", icon: "🧑🏻‍🦱" },
        { categoryName: "TRIP", icon: "✈️" },
        { categoryName: "CLOTHS", icon: "👕" },
        { categoryName: "OTHERS", icon: "📦" },
        { categoryName: "STUDY", icon: "📖" },
    ];

    return (
        <div className='mt-3 flex flex-col gap-2 px-4 p-2 w-full border bg-white rounded-lg border-gray-200 shadow-md text-sm'>
            <h2 className='text-sm font-semibold text-gray-400 tracking-wider'>Recent activity</h2>
            <div className='px-2 flex flex-col gap-2'>
                {expenses?.slice(0, 6)?.map((item, idx) => {
                    const icon = categoryIcon.find((i) => i.categoryName == item.expense_category)["icon"]
                    return (
                        <div key={idx} className='flex justify-between items-center p-1'>
                            <div className='flex gap-1 items-center'>
                                <span className='text-xl'>{icon}</span>
                                <div className='flex flex-col gap-.5'>
                                    <span className='text-sm font-semibold'>
                                        {item.expense_name}
                                    </span>
                                    <div className='flex gap-.5 text-xs font-semibold text-gray-400'>
                                        <span>{new Date(item.created_at).toLocaleString("en-GB", { day: "2-digit", month: "short" })}</span>
                                        <span>•</span>
                                        <span>{capitalizeFirstLetter(item.expense_category)}</span>
                                    </div>
                                </div>
                            </div>
                            <span className={`text-sm font-semibold ${item.status == "DECLINED" ? "text-red-500" : "text-gray-700"}`}>
                                Rs. {item.expense_amount}
                            </span>

                        </div>
                    )
                })}
            </div>
            <button onClick={() => navigate("/dashboard/expense")} className='w-full mx-3 text-center p-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg transition-all active:scale-95 cursor-pointer'>See more</button>
        </div>
    )
}

export default RecentActivity
