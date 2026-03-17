import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setIsNewBudgetAdd } from '../../store/slices/budgetSlice'
import { X } from 'lucide-react'
import { axiosInstance } from '../../utils/axios/axiosInstance'

const AddNewBudget = () => {
    const { isNewBudgetAdd } = useSelector(state => state.budget)
    const [categories, setCategories] = useState([])
    const [budgetType, setBudgetType] = useState([])
    const dispatch = useDispatch()
    useEffect(() => {
        (async () => {
            try {
                const res = await axiosInstance.get("budget/budgets/get_budget_categories_and_type/")
                if (res.status == 200) {
                    setCategories(res.data.categories)
                    setBudgetType(res.data.type)
                }
            } catch (error) {
                console.log(error)
            }
        })()
    }, [])
    return (
        <AnimatePresence>
            {isNewBudgetAdd && (
                <motion.div
                    initial={{
                        opacity: 0
                    }}
                    animate={{
                        opacity: 1
                    }}
                    exit={{
                        opacity: 0
                    }}
                    onClick={() => dispatch(setIsNewBudgetAdd(false))} className='fixed z-30 inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center'>
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        initial={{
                            opacity: 0,
                            scale: 0.95,
                            y: 10
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            transition: {
                                stiffness: 850,
                                damping: 40,
                                type: "spring"
                            }
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.95,
                            y: 10
                        }}
                        className='relative rounded-lg  w-full mx-2 sm:w-sm   bg-white text-sm '>
                        {/* X icon */}
                        <motion.div
                            onClick={() => dispatch(setIsNewBudgetAdd(false))}
                            whileHover={{
                                scale: 1.2,
                                rotate: 90
                            }}
                            whileTap={{
                                scale: 0.97,
                            }}
                            className='absolute cursor-pointer top-2 right-3 p-1 hover:bg-white/20 rounded-t-sm rounded-b-md
                    '>
                            <X className='text-red-400 size-5 stoke-1' />
                        </motion.div>
                        <div className='rounded-t-lg p-2  bg-linear-to-br  from-indigo-500 
                        to-indigo-600 text-white font-semibold flex flex-col '>
                            <h2 className='text-xl'>Add new Budget</h2>
                            <span className='text-[10px] text-gray-400 '>Add new budget category</span>
                        </div>
                        {/* Hero div */}
                        <form className='flex flex-col gap-3.5 text-sm font-md px-4 p-2'>
                            {/* Budget Name */}
                            <div className='flex flex-col gap-1 text-gray-600 font-semibold'>
                                <label htmlFor="budget_name">
                                    Budget name
                                </label>
                                <input name='budget_name' type="text" placeholder='eg. Grocery items'
                                    className='text-xs px-4 font-medium p-2 w-full border border-gray-200 rounded-lg
                            transition-all duration-200 ease-in outline-0 focus:border-indigo-300 text-gray-400'
                                    id='budget_name' required={true} />
                            </div>
                            {/* Budget Category */}
                            <div className='flex flex-col gap-1 text-gray-600 font-semibold'>
                                <label htmlFor="budget_category">
                                    Budget Category
                                </label>
                                <select className='text-xs px-4 font-medium p-2 w-full border border-gray-200 rounded-lg
                            transition-all duration-200 ease-in outline-0 focus:border-indigo-300 text-gray-400'
                                    id='budget_category' required={true} name="budget_category_value" >
                                    <option value="">Select category</option>
                                    {categories.length > 0 && categories.map((i, idx) => {
                                        return (
                                            <option key={idx} value={i.code}>{i.label}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            {/* Budget Amount */}
                            <div className='flex flex-col gap-1 text-gray-600 font-semibold'>
                                <label htmlFor="budget_amt">
                                    Budget amount
                                </label>
                                <input name='budget_amount' type="number"
                                    min={0}
                                    max={1000000}
                                    placeholder='eg. Rs. 500'
                                    className='text-xs px-4 font-medium p-2 w-full border border-gray-200 rounded-lg
                            transition-all duration-200 ease-in outline-0 focus:border-indigo-300 text-gray-400'
                                    id='budget_amt' required={true} />
                            </div>
                            {/* Budget type */}
                            <div className='flex flex-col gap-1 text-gray-600 font-semibold'>
                                <label htmlFor="budget_type">
                                    Budget Type
                                </label>
                                <select className='text-xs px-4 font-medium p-2 w-full border border-gray-200 rounded-lg
                            transition-all duration-200 ease-in outline-0 focus:border-indigo-300 text-gray-400'
                                    id='budget_type' required={true} name="budget_type_value" >
                                    <option value="">Select category</option>
                                    {budgetType.length > 0 && budgetType.map((i, idx) => {
                                        return (
                                            <option key={idx} value={i.code}>{i.label}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}


        </AnimatePresence>
    )
}

export default AddNewBudget
