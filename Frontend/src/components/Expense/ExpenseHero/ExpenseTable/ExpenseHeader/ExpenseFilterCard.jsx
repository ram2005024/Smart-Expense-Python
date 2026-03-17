import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentPage, setFilter, setFilterActive } from '../../../../../store/slices/expenseSlice'

const ExpenseFilterCard = ({ setFilterShow }) => {
    const { filterActive, filter } = useSelector(state => state.expense)
    const dispatch = useDispatch()

    const [filterData, setFilterData] = useState({
        start_date: filter?.start_date ? filter?.["start_date"] : "",
        end_date: filter?.end_date ? filter?.["end_date"] : "",
        min_amt: filter?.min_amt ? filter?.["min_amt"] : 0,
        max_amt: filter?.max_amt ? filter?.["max_amt"] : 0,
        statuses: filter?.statuses ? filter?.["statuses"] : [],
        categories: filter?.categories ? filter?.["categories"] : [],
    })

    // Handle the input change
    const handleChange = (key, value) => {
        setFilterData(prev => ({ ...prev, [key]: value }))
    }

    // Handle the status toggle
    const toggleStatuses = (value) => {
        setFilterData(prev => ({
            ...prev,
            statuses: prev.statuses.includes(value)
                ? prev.statuses.filter(i => i !== value)
                : [...prev.statuses, value]
        }))
    }

    // Handle the category toggle
    const toggleCategory = (value) => {
        setFilterData(prev => ({
            ...prev,
            categories: prev.categories.includes(value)
                ? prev.categories.filter(i => i !== value)
                : [...prev.categories, value]
        }))
    }

    // Handle Apply filter
    const handleApply = async () => {
        const params = {
            ...filterData,
            statuses: filterData.statuses,
            categories: filterData.categories,
        }
        if (!params.start_date) delete params.start_date
        if (!params.end_date) delete params.end_date
        if (!params.min_amt) delete params.min_amt
        if (!params.max_amt) delete params.max_amt

        dispatch(setFilter(params))
        dispatch(setCurrentPage(1))
        dispatch(setFilterActive(false))
    }

    const handleReset = () => {
        setFilterData({
            start_date: "",
            end_date: "",
            min_amt: 0,
            max_amt: 0,
            statuses: [],
            categories: [],
        })
        dispatch(setFilter(null))
        dispatch(setCurrentPage(1))
        dispatch(setFilterActive(false))
        setFilterShow(false)
    }

    const statuses = [
        { label: "Pending", value: "PENDING" },
        { label: "Paid", value: "PAID" },
        { label: "Reimburshed", value: "REIMBRUSHED" },
        { label: "Declined", value: "DECLINED" },
    ]

    const categories = [
        { label: "Food", value: "FOOD" },
        { label: "Personal", value: "PERSONAL" },
        { label: "Trip", value: "TRIP" },
        { label: "Cloths", value: "CLOTHS" },
        { label: "Others", value: "OTHERS" },
        { label: "Grocery", value: "GROCERY" },
    ]

    return (
        <AnimatePresence>
            {filterActive && (
                <motion.div
                    onClick={() => dispatch(setFilterActive(false))}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='fixed inset-0 bg-black/30 backdrop-blur-xs z-40'
                >
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ damping: 25, stiffness: 260, type: "spring" }}
                        className='w-sm h-full z-50 right-0 top-0 bg-white absolute px-2 py-5 flex flex-col gap-2'
                    >
                        <h2 className='text-xl font-semibold pl-3 relative mb-4'>
                            Expense Filter
                            <X
                                onClick={() => dispatch(setFilterActive(false))}
                                className='cursor-pointer absolute right-3 text-gray-400 hover:text-red-600 top-0.5 transition-all duration-200 ease-in transform hover:scale-105'
                            />
                        </h2>

                        <div className='w-11/12 mx-auto'>
                            {/* Date Range */}
                            <div className='flex flex-col gap-2 mb-5'>
                                <h2 className='font-semibold text-gray-800'>Date Range</h2>
                                <div className='flex justify-between w-full gap-2'>
                                    <input
                                        type="date"
                                        name='start_date'
                                        value={filterData["start_date"]}
                                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                                        className='p-2 border outline-0 border-gray-100 shadow rounded-lg'
                                    />
                                    <input
                                        type="date"
                                        name='end_date'
                                        value={filterData["end_date"]}
                                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                                        className='p-2 border outline-0 border-gray-100 shadow rounded-lg'
                                    />
                                </div>
                            </div>

                            {/* Status */}
                            <div className='flex flex-col gap-2 mb-4'>
                                <h2 className='text-gray-800 font-semibold'>Status</h2>
                                {statuses.map((i) => (
                                    <div className='flex gap-2 pl-2'>
                                        <input
                                            onChange={() => toggleStatuses(i.value)}
                                            type="checkbox"
                                            checked={filterData["statuses"].includes(i.value)}
                                        />
                                        <span className='text-[15px] text-gray-500'>{i.label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Category */}
                            <div className='flex flex-col gap-2.5'>
                                <span className='text-gray-800 font-semibold'>Category</span>
                                <div className='gap-2 space-x-1 grid grid-cols-3'>
                                    {categories.map((item, idx) => (
                                        <div
                                            onClick={() => toggleCategory(item.value)}
                                            key={idx}
                                            className={`w-full py-2 border border-gray-100 font-light text-sm transition-all duration-150 ease-in cursor-pointer flex items-center justify-center rounded-lg ${filterData.categories.includes(item.value)
                                                ? 'bg-green-500 text-white font-semibold'
                                                : ''
                                                }`}
                                        >
                                            <span>{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Amount Range */}
                            <div className='flex flex-col gap-2.5 mt-5'>
                                <span className='text-gray-800 font-semibold'>Amount range</span>
                                <div className='w-full mx-auto flex justify-between'>
                                    <input
                                        name='min_amt'
                                        value={filterData["min_amt"]}
                                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                                        type="number"
                                        min={0}
                                        placeholder='Min. value'
                                        className='p-2 w-36 text-sm border outline-0 border-gray-100 shadow rounded-lg'
                                    />
                                    <input
                                        name='max_amt'
                                        value={filterData["max_amt"]}
                                        onChange={(e) => handleChange(e.target.name, e.target.value)}
                                        type="number"
                                        max={100000}
                                        placeholder='Max. value'
                                        className='p-2 w-36 text-sm border outline-0 border-gray-100 shadow rounded-lg'
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className='flex gap-3 pl-6 mt-4'>
                            <button
                                onClick={() => {
                                    handleReset()
                                    dispatch(setFilter({}))
                                    dispatch(setFilterActive(false))
                                }}
                                className='px-4 py-2 bg-red-400 cursor-pointer text-sm text-white font-semibold rounded-md active:scale-95 transform transition-all duration-150 ease-in'
                            >
                                Reset
                            </button>
                            <button
                                onClick={() => handleApply()}
                                className='px-4 py-2 bg-green-500 cursor-pointer text-sm text-white font-semibold rounded-md active:scale-95 transform transition-all duration-150 ease-in'
                            >
                                Apply
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default ExpenseFilterCard