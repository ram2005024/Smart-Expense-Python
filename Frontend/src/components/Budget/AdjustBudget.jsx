import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, CircleX, Loader2, X } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { axiosInstance } from '../../utils/axios/axiosInstance'
import { fetchBudget, fetchBudgetWithLimit } from '../../store/thunks/budgetThunk'
import toast from 'react-hot-toast'

const AdjustBudget = ({ setIsActive, isActive, selectedBudget }) => {
    const [error, setError] = useState("")
    const [formData, setFormData] = useState({
        "new_budget_limit": Math.ceil(selectedBudget.total_spent) + 1,
        "reallocated_id": "",
        "reallocated_amount": 0,
    })

    const handleValueChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }
    const dispatch = useDispatch()
    const { budgets, activeBudgetType } = useSelector(state => state.budget)
    const [loading, setLoading] = useState(false)
    const remainingBalance = formData['new_budget_limit'] - selectedBudget['total_spent']
    const isOnTrack = remainingBalance > 0
    const handleSubmit = async () => {
        try {
            setLoading(true)
            const res = await axiosInstance.patch(`/budget/budgets/${selectedBudget.id}/update_budget_for_reallocation/`, formData)
            if (res.status == 200) {
                await dispatch(fetchBudget()).unwrap()
                await dispatch(fetchBudgetWithLimit(activeBudgetType)).unwrap()
                toast.success(res.data.message)
                setIsActive(false)
            }
        } catch (error) {
            console.log(error.message)
            setError(error.response?.data?.message || error.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }
    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setIsActive(false)}
                    className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-30'
                >
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        initial={{
                            opacity: 0,
                            y: 20,
                            scale: 0.95
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            transition: {
                                type: "spring",
                                damping: 40,
                                stiffness: 890
                            }
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.95,
                            y: 20
                        }}
                        className='w-full max-w-130 mx-2 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100'
                    >
                        {/* Header Section - Premium Gradient */}
                        <div className='relative bg-linear-to-br from-indigo-600 to-indigo-700 px-6 pt-6 pb-8'>
                            {/* Decorative Background */}
                            <div className='absolute inset-0 opacity-10'>
                                <div className='absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl'></div>
                            </div>

                            <div className='relative z-10 flex justify-between items-start'>
                                <div>
                                    <h2 className='text-2xl font-bold text-white'>
                                        Adjust Budget
                                    </h2>
                                    <p className='text-indigo-100 text-sm font-medium mt-1'>
                                        {selectedBudget.budget_name}
                                    </p>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsActive(false)}
                                    className='p-2 hover:bg-white/20 rounded-lg transition-colors duration-200'
                                >
                                    <X size={20} className='text-white' strokeWidth={3} />
                                </motion.button>
                            </div>

                            {/* Stats Cards */}
                            <div className='grid grid-cols-2 gap-3 mt-6'>
                                <div className='bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3'>
                                    <p className='text-indigo-100 text-xs font-semibold uppercase tracking-wide mb-2'>
                                        Current Budget
                                    </p>
                                    <p className='text-white font-bold text-lg'>
                                        Rs. {selectedBudget.budget_amount?.toLocaleString()}
                                    </p>
                                </div>
                                <div className='bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3'>
                                    <p className='text-indigo-100 text-xs font-semibold uppercase tracking-wide mb-2'>
                                        Amount Spent
                                    </p>
                                    <p className='text-yellow-300 font-bold text-lg'>
                                        Rs. {(selectedBudget.total_spent).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className='px-6 py-8'>
                            {/* New Budget Limit */}
                            <div className='mb-7'>
                                <label htmlFor="new_budget_limit" className='block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide'>
                                    New Budget Limit
                                </label>
                                <div className='relative'>
                                    <span className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg'>
                                        Rs.
                                    </span>
                                    <input
                                        id='new_budget_limit'
                                        type="number"
                                        min={Math.ceil(selectedBudget.total_spent) + 1}
                                        max={10000000}
                                        name='new_budget_limit'
                                        value={formData.new_budget_limit}
                                        onChange={(e) => handleValueChange(e.target.name, e.target.value)}
                                        className='w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none focus:shadow-lg focus:shadow-indigo-500/10 transition-all duration-300 text-gray-900 font-semibold bg-gray-50 focus:bg-white'
                                    />
                                </div>
                            </div>

                            {/* Reallocate Section */}
                            <div className='mb-7'>
                                <label className='block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide'>
                                    Reallocate Funds
                                    <span className='text-xs text-gray-500 font-normal normal-case ml-2'>(Optional)</span>
                                </label>
                                <div className='grid grid-cols-3 gap-3'>
                                    <select
                                        value={formData['reallocated_id']}
                                        name="reallocated_id"
                                        onChange={(e) => handleValueChange(e.target.name, e.target.value)}
                                        className='col-span-2 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none focus:shadow-lg focus:shadow-indigo-500/10 transition-all duration-300 text-gray-700 font-medium bg-gray-50 focus:bg-white appearance-none cursor-pointer'
                                    >
                                        <option value="">Select category</option>
                                        {
                                            budgets?.map((i) => (
                                                <option key={i.id} value={i.id}>{i.budget_name}</option>
                                            ))
                                        }
                                    </select>
                                    <div className='relative'>
                                        <span className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold'>
                                            Rs.
                                        </span>
                                        <input
                                            type="number"
                                            min={0}
                                            max={10000000}
                                            name='reallocated_amount'
                                            value={formData.reallocated_amount}
                                            onChange={(e) => handleValueChange(e.target.name, e.target.value)}
                                            placeholder='0'
                                            className='w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none focus:shadow-lg focus:shadow-indigo-500/10 transition-all duration-300 text-gray-900 font-semibold bg-gray-50 focus:bg-white'
                                        />
                                    </div>
                                </div>
                                <p className='text-xs text-gray-500 mt-2'>
                                    Transfer available funds to another budget category
                                </p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className='mb-6 px-4 py-3 bg-red-50 border-2 border-red-200 rounded-lg'
                                >
                                    <p className='text-red-700 font-semibold text-sm'>⚠ {error}</p>
                                </motion.div>
                            )}

                            {/* Balance Summary */}
                            <div className={`mb-8 px-5 py-4 rounded-xl border-2 ${isOnTrack ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                                <div className='flex justify-between items-center'>
                                    <div>
                                        <p className={`text-xs font-bold uppercase tracking-wide mb-1 ${isOnTrack ? 'text-green-700' : 'text-red-700'}`}>
                                            Remaining Balance
                                        </p>
                                        <p className={`text-2xl font-bold ${isOnTrack ? 'text-green-600' : 'text-red-600'}`}>
                                            Rs. {remainingBalance.toFixed(2)}
                                        </p>
                                    </div>
                                    <motion.div
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full`}
                                    >
                                        <span className={`text-xs font-bold ${isOnTrack ? 'text-green-700' : 'text-red-700'}`}>
                                            {isOnTrack ? 'On Track' : 'Over Spent'}
                                        </span>
                                        {isOnTrack ? (
                                            <CheckCircle size={18} className='text-white fill-green-600' />
                                        ) : (
                                            <CircleX size={18} className='text-white fill-red-600' />
                                        )}
                                    </motion.div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className='flex gap-3'>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setIsActive(false)}
                                    className='w-28  p-2 px-4 text-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-xs uppercase tracking-wide rounded-lg transition-colors duration-200 border border-gray-200'
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={loading}
                                    onClick={() => handleSubmit()}
                                    className='w-fit py-2 px-4 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2  text-center bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-xs uppercase tracking-wide rounded-lg transition-all duration-200 shadow-lg shadow-indigo-500/30'
                                >

                                    Save Changes
                                    {loading && <Loader2 className='animate-spin size-5 text-gray-100' />}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default AdjustBudget