import React from 'react'
import { useSelector } from 'react-redux'
import { budgetCategoriesIcons } from '../../assets/assets'
import { getColorCode } from '../../utils/getProgressColor'
import { ChartLine, Plus } from 'lucide-react'
const GridViewBudget = () => {
    const { budgetsWithLimit } = useSelector(state => state.budget)
    console.log("Hell yeah", budgetsWithLimit)
    return (
        <div className='w-9/12 h-fit  grid grid-cols-3 gap-2 max-sm:grid-cols-1 '>
            {
                budgetsWithLimit?.length > 0 ? (
                    budgetsWithLimit.map((i, idx) => {
                        const matchedIcon = budgetCategoriesIcons.find((item) => item.categoryName === i.budget_field)

                        return (
                            <div key={idx} className='border relative rounded-xl border-gray-200 shadow-sm bg-white p-3.5 flex flex-col gap-2'>
                                {/* To display expired banner */}
                                {
                                    i.is_active ? (
                                        ""
                                    ) : (
                                        <img src="/Expired.png" alt="expired_png" className='size-12 absolute top-2 right-3' />
                                    )
                                }
                                {/* First sec */}
                                <div className='flex gap-1'>
                                    <div className='border border-indigo-700/30 px-1.5 py-0.5 rounded-lg bg-gray-100 text-2xl'>
                                        <span>{matchedIcon["icon"]}</span>
                                    </div>
                                    <div className='flex flex-col gap-.5'>
                                        <span className='text-sm font-semibold'>
                                            {i.budget_name}
                                        </span>
                                        <span className='text-xs font-semibold text-gray-400'>
                                            {i.transactions} transactions
                                        </span>
                                    </div>
                                </div>
                                {/* Second Section */}
                                <div className='flex justify-between items-center'>
                                    <div className='flex gap-2 items-center'>
                                        <div
                                            className="relative flex items-center justify-center rounded-full size-24"
                                            style={{
                                                background: `conic-gradient(${getColorCode(i.usage_percentage)} ${i.usage_percentage * 3.6}deg, #e6e6e6 0deg)`
                                            }}
                                        >
                                            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                                                <span style={{ color: getColorCode(i.usage_percentage, 1) }} className={`text-xs font-bold `}

                                                >{i.usage_percentage}%</span>
                                            </div>
                                        </div>
                                        <div className=' flex flex-col  text-xs text-gray-400 font-semibold  gap-2'>
                                            <span>Spent</span>
                                            <span>Budget</span>
                                            <span>Remaining</span>

                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <span className='text-[18px] font-semibold'>Rs. {i.total_spent.toFixed(2)}</span>
                                        <span className='text-[14px] text-gray-600 font-semibold'>Rs. {i.budget_amount.toFixed(2)}</span>
                                        <span className='text-[14px] text-gray-600 font-semibold'>Rs. {i.remaining.toFixed(2)}</span>

                                    </div>
                                </div>
                                {/* Third section */}
                                <div className='flex flex-col mt-3 gap-2'>
                                    <div className='w-full h-2  overflow-x-hidden rounded-full bg-gray-300'
                                    >
                                        <div

                                            className={`rounded-full h-full `}
                                            style={{
                                                width: `${i.usage_percentage}%`,
                                                backgroundColor: getColorCode(i.usage_percentage, 0.9)
                                            }}></div>
                                    </div>
                                    <div className='flex justify-between w-full items-center'>
                                        <div style={{
                                            borderColor: getColorCode(i.usage_percentage),
                                            backgroundColor: getColorCode(i.usage_percentage, 0.2),
                                            opacity: 0.6
                                        }}
                                            className={`px-2 rounded-xl p-.5 border `}>
                                            <span
                                                style={{
                                                    color: getColorCode(i.usage_percentage, 1)
                                                }}
                                                className={`text-xs font-semibold`}>{i.budget_status}</span>
                                        </div>
                                        <div>
                                            <ChartLine style={{
                                                color: getColorCode(i.usage_percentage, 1)
                                            }}
                                                className='size-10 stroke-1' />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div>No budget found</div>
                )
            }
            <div className='border border-dashed border-gray-400 shadow-md rounded-sm bg-white flex items-center justify-center transition-all duration-250 ease-in hover:bg-slate-50 cursor-pointer active:scale-95'>
                <div className='flex flex-col gap-2 items-center text-xs text-gray-500'>
                    <div className='w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center'>
                        <Plus className='size-5' />
                    </div>
                    <span className='font-semibold text-sm '> Add Budget Category</span>
                </div>
            </div>
        </div>
    )
}

export default GridViewBudget
