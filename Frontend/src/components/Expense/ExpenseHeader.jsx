import dayjs from 'dayjs'
import { Calendar, CheckCircle2, CreditCard, Download, Filter, Plus } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFilterActive, setSelectedMonth } from '../../store/slices/expenseSlice'
import ExpenseFilterCard from './ExpenseHero/ExpenseTable/ExpenseHeader/ExpenseFilterCard'
import { convertToCSV } from '../../utils/convertToCSV'
import AddExpense from './AddExpense'

const ExpenseHeader = () => {
    const { selectedMonth, totalExpense, filter, filteredExpenses } = useSelector((state) => state.expense)
    const dispatch = useDispatch()
    const [isAddExpense, setIsAddExpense] = useState(false)

    return (
        <div className='w-full flex justify-between items-center '>
            {/* First card */}
            <div className='flex gap-2'>
                <div className='w-12 h-12 rounded-2xl bg-indigo-600 items-center justify-center flex '>
                    <CreditCard size={30} className='fill-red-500 stroke-1' />
                </div>
                <div className='flex flex-col '>
                    <h2 className='text-2xl font-bold'>Expenses</h2>
                    <span className='text-xs text-gray-400 font-medium'>{selectedMonth} • {totalExpense} transactions</span>
                </div>

            </div>
            {/* Second card */}
            <div className='flex gap-2.5 relative w-fit py-4 px-3'>
                <button onClick={() => {
                    dispatch(setFilterActive(true))

                }} className='border cursor-pointer relative transition-all duration-150 ease-in transform hover:scale-105 active:scale-100 bg-white border-gray-50 shadow rounded-lg px-3 py-1.5 text-xs text-gray-400 font-semibold inline-flex items-center gap-1'><Filter className='text-gray-400 size-4' />{" "} Filters
                    <CheckCircle2 className={`${filter ? "block absolute top-0 right-0  text-white fill-green-500 size-4" : "hidden"}`} />
                </button>
                <button onClick={() => convertToCSV(filteredExpenses, `expense_${new Date().getMilliseconds()}`)} className='border cursor-pointer transition-all duration-150 ease-in transform hover:scale-105 active:scale-100 bg-white border-gray-50 shadow rounded-lg px-3 py-1.5 text-xs text-gray-400 font-semibold inline-flex items-center gap-1'><Download className='text-gray-400 size-4' />{" "} Export CSV</button>
                <button
                    onClick={() => document.getElementById("monthSelector").showPicker()}
                    className='border cursor-pointer transition-all duration-150 ease-in transform hover:scale-105 active:scale-100 bg-white border-gray-50 shadow rounded-lg px-3 py-1.5 text-xs text-gray-400 font-semibold inline-flex items-center gap-1'
                >
                    <Calendar className="text-gray-400 size-4" />
                    <span>{selectedMonth}</span>
                </button>

                <input
                    type="month"
                    id="monthSelector"
                    value={dayjs(selectedMonth).format("YYYY-MM")}
                    onChange={(e) => dispatch(setSelectedMonth(dayjs(e.target.value).format("MMM YYYY")))}
                    className="absolute top-10 left-10 opacity-0 w-0 h-0"
                />
                <button onClick={() => setIsAddExpense(true)} className='w-fit px-4 py-1.5 rounded-lg cursor-pointer bg-indigo-500 text-white  font-semibold transition-all duration-200 ease-in transform hover:scale-105 active:scale-100 inline-flex gap-2 items-center '><Plus className='stroke-2 size-5 text-white ' /><span>Add Expense</span></button>
            </div>
            {/* Check for the conditions */}


            <ExpenseFilterCard />
            <AddExpense isAddExpense={isAddExpense} setIsAddExpense={setIsAddExpense} />
        </div>
    )
}

export default ExpenseHeader
