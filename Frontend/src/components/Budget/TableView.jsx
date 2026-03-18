import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { budgetCategoriesIcons } from '../../assets/assets'
import { getColorCode } from '../../utils/getProgressColor'
import { ChartLine, Plus } from 'lucide-react'
import { setIsNewBudgetAdd } from '../../store/slices/budgetSlice'

const TableView = () => {
    const dispatch = useDispatch()
    const { budgetsWithLimit } = useSelector(state => state.budget)

    return (
        <div className='w-9/12'>
            <div className='bg-white border rounded-xl shadow-sm overflow-hidden'>

                {/* Table */}
                <table className='w-full text-sm'>
                    <thead className='bg-slate-100 text-gray-600'>
                        <tr className='text-left'>
                            <th className='p-3'>Category</th>
                            <th className='p-3'>Transactions</th>
                            <th className='p-3'>Spent</th>
                            <th className='p-3'>Budget</th>
                            <th className='p-3'>Remaining</th>
                            <th className='p-3'>Usage</th>
                            <th className='p-3'>Status</th>
                            <th className='p-3 text-center'>Analytics</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            budgetsWithLimit?.length > 0 ? (
                                budgetsWithLimit.map((i, idx) => {
                                    const matchedIcon = budgetCategoriesIcons.find(
                                        (item) => item.categoryName === i.budget_field
                                    )

                                    return (
                                        <tr key={idx} className='border-t hover:bg-slate-50 transition-all'>

                                            {/* Category */}
                                            <td className='p-3 flex items-center gap-2'>
                                                <div className='bg-gray-100 border px-2 py-1 rounded-lg text-xl'>
                                                    {matchedIcon?.icon}
                                                </div>
                                                <div className='flex flex-col'>
                                                    <span className='font-semibold'>
                                                        {i.budget_name}
                                                    </span>
                                                    {!i.is_active && (
                                                        <span className='text-xs text-red-400'>
                                                            Expired
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Transactions */}
                                            <td className='p-3 font-medium text-gray-500'>
                                                {i.transactions}
                                            </td>

                                            {/* Spent */}
                                            <td className='p-3 font-semibold'>
                                                Rs. {i.total_spent.toFixed(2)}
                                            </td>

                                            {/* Budget */}
                                            <td className='p-3 text-gray-600 font-semibold'>
                                                Rs. {i.budget_amount.toFixed(2)}
                                            </td>

                                            {/* Remaining */}
                                            <td className='p-3 text-gray-600 font-semibold'>
                                                Rs. {i.remaining.toFixed(2)}
                                            </td>

                                            {/* Usage Progress */}
                                            <td className='p-3 w-40'>
                                                <div className='flex flex-col gap-1'>
                                                    <div className='w-full h-2 bg-gray-200 rounded-full overflow-hidden'>
                                                        <div
                                                            className='h-full rounded-full'
                                                            style={{
                                                                width: `${i.usage_percentage}%`,
                                                                backgroundColor: getColorCode(i.usage_percentage)
                                                            }}
                                                        />
                                                    </div>
                                                    <span
                                                        className='text-xs font-semibold'
                                                        style={{
                                                            color: getColorCode(i.usage_percentage)
                                                        }}
                                                    >
                                                        {i.usage_percentage}%
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className='p-3'>
                                                <div
                                                    className='flex items-center gap-2 px-3 py-1.5 rounded-full w-fit text-xs font-semibold border backdrop-blur-sm'
                                                    style={{
                                                        borderColor: getColorCode(i.usage_percentage),
                                                        background: `linear-gradient(135deg, ${getColorCode(i.usage_percentage, 0.15)}, ${getColorCode(i.usage_percentage, 0.05)})`,
                                                        color: getColorCode(i.usage_percentage, 1),
                                                        boxShadow: `0 2px 8px ${getColorCode(i.usage_percentage, 0.25)}`
                                                    }}
                                                >
                                                    {/* Status Dot */}
                                                    <span
                                                        className='w-2 h-2 rounded-full'
                                                        style={{
                                                            backgroundColor: getColorCode(i.usage_percentage),
                                                            boxShadow: `0 0 6px ${getColorCode(i.usage_percentage)}`
                                                        }}
                                                    />

                                                    {/* Status Text */}
                                                    <span className='tracking-wide'>
                                                        {i.budget_status}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Chart Icon */}
                                            <td className='p-3 text-center'>
                                                <ChartLine
                                                    className='size-6 mx-auto'
                                                    style={{
                                                        color: getColorCode(i.usage_percentage)
                                                    }}
                                                />
                                            </td>

                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td colSpan="8" className='text-center p-6 text-gray-400'>
                                        No budget found
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>

            {/* Add New Budget */}
            <div
                onClick={() => dispatch(setIsNewBudgetAdd(true))}
                className='mt-4 border border-dashed border-gray-400 rounded-xl p-6 flex items-center justify-center cursor-pointer hover:bg-slate-50 active:scale-95 transition-all'
            >
                <div className='flex items-center gap-2 text-gray-500'>
                    <Plus className='size-5' />
                    <span className='font-semibold'>Add Budget Category</span>
                </div>
            </div>
        </div>
    )
}

export default TableView