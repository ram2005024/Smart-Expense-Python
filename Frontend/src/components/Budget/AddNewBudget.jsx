import { AnimatePresence, motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setIsNewBudgetAdd } from '../../store/slices/budgetSlice'
import { Loader2, X } from 'lucide-react'
import { axiosInstance } from '../../utils/axios/axiosInstance'
import { fetchBudget, fetchBudgetWithLimit } from '../../store/thunks/budgetThunk'

const AddNewBudget = () => {
    const { isNewBudgetAdd, activeBudgetType } = useSelector(state => state.budget)
    const [categories, setCategories] = useState([])
    const [budgetType, setBudgetType] = useState([])
    const [loading, setLoading] = useState(false)

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
    const [formData, setFormData] = useState({
        budget_name: "",
        budget_field: "",
        budget_amount: 0,
        budget_limit: "",
        is_active: true
    })

    // Handle input change
    const handleInputChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }
    // Handle formSubmit
    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const res = await axiosInstance.post("/budget/budgets/", formData)
            if (res.status == 201) {
                setFormData({
                    budget_name: "",
                    budget_field: "",
                    budget_amount: 0,
                    budget_limit: "",
                    is_active: true
                })
            }
            await dispatch(fetchBudget()).unwrap()
            await dispatch(fetchBudgetWithLimit(activeBudgetType)).unwrap()
            dispatch(setIsNewBudgetAdd(false))
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    }
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
                        <form onSubmit={handleSubmit} className='flex flex-col gap-3.5 text-sm font-md px-4 p-2'>
                            {/* Budget Name */}
                            <div className='flex flex-col gap-1 text-gray-600 font-semibold'>
                                <label>
                                    Budget name
                                </label>
                                <input onChange={(e) => handleInputChange(e.target.name, e.target.value)} name='budget_name' type="text" placeholder='eg. Grocery items'
                                    className='text-xs px-4 font-medium p-2 w-full border border-gray-200 rounded-lg
                            transition-all duration-200 ease-in outline-0 focus:border-indigo-300 text-gray-400'
                                    required={true} />
                            </div>
                            {/* Budget Category */}
                            <div className='flex flex-col gap-1 text-gray-600 font-semibold'>
                                <label>
                                    Budget Category
                                </label>
                                <select onChange={(e) => handleInputChange(e.target.name, e.target.value)} className='text-xs px-4 font-medium p-2 w-full border border-gray-200 rounded-lg
                            transition-all duration-200 ease-in outline-0 focus:border-indigo-300 text-gray-400'
                                    required={true} name="budget_field" >
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
                                <label>
                                    Budget amount
                                </label>
                                <input name='budget_amount' type="number"
                                    min={0}
                                    max={1000000}
                                    onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                                    placeholder='eg. Rs. 500'
                                    className='text-xs px-4 font-medium p-2 w-full border border-gray-200 rounded-lg
                            transition-all duration-200 ease-in outline-0 focus:border-indigo-300 text-gray-400'
                                    required={true} />
                            </div>
                            {/* Budget type */}
                            <div className='flex flex-col gap-1 text-gray-600 font-semibold'>
                                <label>
                                    Budget Type
                                </label>
                                <select onChange={(e) => handleInputChange(e.target.name, e.target.value)} className='text-xs px-4 font-medium p-2 w-full border border-gray-200 rounded-lg
                            transition-all duration-200 ease-in outline-0 focus:border-indigo-300 text-gray-400'
                                    required={true} name="budget_limit" >
                                    <option value="">Select category</option>
                                    {budgetType.length > 0 && budgetType.map((i, idx) => {
                                        return (
                                            <option key={idx} value={i.code}>{i.label}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            {/* Active budget */}
                            <div className='flex flex-col gap-1 text-gray-600 font-semibold'>
                                <label htmlFor="active budget">
                                    Active Budget
                                </label>
                                <div className='flex justify-between p-2 bg-gray-50 rounded-lg border
                               border-gray-200'>
                                    <span className='text-xs'>Enable this budget</span>
                                    <div onClick={() => handleInputChange("is_active", !formData.is_active)} className={`${formData.is_active ? "bg-indigo-500" : "bg-gray-400"} cursor-pointer w-9 h-5 flex items-center justify-center rounded-full
                                    p-.5`}>
                                        <div className={`w-4 h-4 rounded-full bg-white   transform transition-all duration-200
                                        ease-in
                                            ${formData.is_active ? " translate-x-2" : "-translate-x-2"}`}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <div className='border p-2 border-gray-100 rounded-lg bg-indigo-300/70 text-xs text-blue-500'>
                                <span>Budget validity will be calculated automatically based on the selected budget type</span>
                            </div>

                            {/* Buttons */}
                            <div className='mt-3 flex justify-between'>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => dispatch(setIsNewBudgetAdd(false))}
                                    className='w-28  p-2 px-4 text-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-xs uppercase tracking-wide rounded-lg transition-colors duration-200 border border-gray-200'
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    type='submit'
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={loading}

                                    className='w-fit py-2 px-4 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2  text-center bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-xs uppercase tracking-wide rounded-lg transition-all duration-200 shadow-lg shadow-indigo-500/30'
                                >

                                    Save Changes
                                    {loading && <Loader2 className='animate-spin size-5 text-gray-100' />}
                                </motion.button>
                            </div>

                        </form>
                    </motion.div>
                </motion.div>
            )}


        </AnimatePresence>
    )
}

export default AddNewBudget
