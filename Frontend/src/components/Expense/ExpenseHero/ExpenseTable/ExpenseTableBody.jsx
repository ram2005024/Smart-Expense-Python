import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { capitalize } from '../../../../utils/capitalize'
import { Dot, LeafyGreen } from 'lucide-react'
import dayjs from 'dayjs'
import Pagination from './Pagination'

const ExpenseTableBody = () => {
    const { filteredExpenses, expenses, totalSpend } = useSelector(state => state.expense)
    const [selectedRows, setSelectedRows] = useState([])
    // Handle selections
    const handleSelectAll = () => {
        if (selectedRows.length != filteredExpenses?.length) {
            setSelectedRows(filteredExpenses?.map(i => i.id))
            return
        }
        setSelectedRows([])
    }
    // Handle Row check
    const handleRowSelect = (id) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }
    const categoryUI = [
        {
            categoryName: "GROCERY",
            icon: "🧺",
            bgColor: "rgba(34, 197, 94, 0.15)",   // light green background
            textColor: "#22C55E"                   // matching green text
        },
        {
            categoryName: "FOOD",
            icon: "🍽️",
            bgColor: "rgba(239, 68, 68, 0.15)",    // light red background
            textColor: "#EF4444"                   // red text
        },
        {
            categoryName: "PERSONAL",
            icon: "🧑🏻‍🦱",
            bgColor: "rgba(59, 130, 246, 0.15)",   // light blue background
            textColor: "#3B82F6"                   // blue text
        },
        {
            categoryName: "TRIP",
            icon: "✈️",
            bgColor: "rgba(245, 158, 11, 0.15)",   // light amber background
            textColor: "#F59E0B"                   // amber text
        },
        {
            categoryName: "CLOTHS",
            icon: "👕",
            bgColor: "rgba(139, 92, 246, 0.15)",   // light purple background
            textColor: "#8B5CF6"                   // purple text
        },
        {
            categoryName: "OTHERS",
            icon: "📦",
            bgColor: "rgba(107, 114, 128, 0.15)",  // light gray background
            textColor: "#6B7280"                   // gray text
        },
        {
            categoryName: "STUDY",
            icon: "📖",
            bgColor: "rgba(110, 114, 128, 0.15)",  // light gray background
            textColor: "#6B7280"                   // gray text
        },
    ];
    const statusUI = [
        {
            statusName: "PAID",

            bgColor: "rgba(34, 197, 94, 0.15)",   // light green background
            textColor: "#22C55E"                   // green text
        },
        {
            statusName: "PENDING",

            bgColor: "rgba(245, 158, 11, 0.15)",   // light amber background
            textColor: "#F59E0B"                   // amber text
        },
        {
            statusName: "DECLINED",

            bgColor: "rgba(239, 68, 68, 0.15)",    // light red background
            textColor: "#EF4444"                   // red text
        },
        {
            statusName: "REIMBRUSHED",
            bgColor: "rgba(59, 130, 246, 0.15)",   // light blue background
            textColor: "#3B82F6"                   // blue text
        }
    ];
    return (
        <div className='relative w-full'>
            <table className='border border-collapse w-full border-none'>
                <thead className=' border border-b border-gray-200 px-3'>
                    <tr className=' text-center'>
                        <th className='p-2'>
                            <input type="checkbox" onChange={() => handleSelectAll()} checked={selectedRows.length === filteredExpenses?.length} />
                        </th>
                        <th className='p-2 hidden sm:table-cell'>
                            <span className='text-xs font-bold text-gray-500'>TRANSACTION</span>
                        </th>
                        <th className='p-2 hidden sm:table-cell' >
                            <span className='text-xs font-bold text-gray-500'>CATEGORY</span>
                        </th>
                        <th className='p-2 hidden sm:table-cell'>
                            <span className='text-xs font-bold text-gray-500'>DATE</span>
                        </th>
                        <th className='p-2'>
                            <span className='text-xs font-bold text-gray-500'>AMOUNT</span>
                        </th>
                        <th className='p-2 hidden sm:table-cell'>
                            <span className='text-xs font-bold text-gray-500'>STATUS</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        filteredExpenses?.map((items) => {
                            const expenseIcon = categoryUI.find((i) => i.categoryName == items.expense_category).icon
                            const status = statusUI.find((i) => i.statusName == items.status).statusName
                            const statusBgColor = statusUI.find((i) => i.statusName == items.status).bgColor
                            const statusTextColor = statusUI.find((i) => i.statusName == items.status).textColor
                            const categoryBgColor = categoryUI.find((i) => i.categoryName == items.expense_category).bgColor
                            const categoryTextColor = categoryUI.find((i) => i.categoryName == items.expense_category).textColor
                            return (
                                <tr className='p-2 border border-b border-gray-200 text-xs' key={items.id}>
                                    <td className='px-2'><input type="checkbox" onChange={() => handleRowSelect(items.id)} checked={selectedRows.includes(items.id)} /></td>
                                    <td className='px-4 py-2'>
                                        <div className='flex gap-1'>
                                            <div className='p-1 m-1 bg-slate-50  rounded-lg'>
                                                <span className='text-[20px]'>{expenseIcon}</span>
                                            </div>
                                            <div className='flex flex-col '>
                                                <span className='text-[16px] font-bold'>{capitalize(items.expense_name)}</span>
                                                <span className='text-sm text-gray-400 font-medium'>{items.expense_description}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='px-4 py-2 hidden sm:table-cell'>
                                        <div className='rounded-lg flex items-center gap-1.5' style={{ background: categoryBgColor, color: categoryTextColor }}>
                                            <Dot className='text-xl'
                                                style={{
                                                    color: categoryTextColor,
                                                }} />
                                            <span className='font-bold'>{items.expense_category}</span>

                                        </div>

                                    </td>
                                    <td className='px-4 py-2 hidden sm:table-cell'>
                                        <span>
                                            {dayjs(items.created_at).format("D MMM, YYYY")}
                                        </span>
                                    </td>
                                    <td className='px-4 py-2'>
                                        <span className='text-[13px] font-semibold'>
                                            Rs. {items.expense_amount}
                                        </span>
                                    </td>
                                    <td className='px-4 py-2 hidden sm:table-cell'>
                                        <div className='rounded-lg flex items-center gap-1.5 overflow-hidden' style={{ background: statusBgColor, color: statusTextColor }}>
                                            <Dot className={`text-xl ${status === 'PENDING' ? 'animate-ping duration-150' : ""}`}
                                                style={{
                                                    color: statusTextColor,

                                                }} />
                                            <span className='font-bold'>{items.status}</span>
                                        </div>

                                    </td>
                                </tr>
                            )
                        })
                    }

                </tbody>
            </table>
            <div className='flex justify-between px-4 m-2.5'>
                <div className='py-4 gap-2 flex text-xs text-gray-400 items-center'>
                    <span className='text-xs text-gray-400 '>
                        <strong className='text-xs font-semibold text-black'>{filteredExpenses?.length}</strong> of <strong className='text-xs font-semibold text-black'>{expenses?.length}</strong> transactions
                    </span>
                    <span >|{" "}</span>
                    <span>Subtotal: <strong >{totalSpend}</strong></span>
                </div>
                <div>
                    <Pagination />
                </div>
            </div>
        </div>
    )
}

export default ExpenseTableBody
