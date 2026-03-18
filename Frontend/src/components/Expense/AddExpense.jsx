import { AnimatePresence, motion } from 'framer-motion'
import { Check, Edit, Loader2, NotebookPen, Trash2, Upload, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBudget } from '../../store/thunks/budgetThunk'
import toast from 'react-hot-toast'
import { addExpense } from '../../store/thunks/expenseThunk'

const AddExpense = ({ isAddExpense, setIsAddExpense }) => {
    const [formData, setFormData] = useState({
        expense_name: "",
        expense_description: "",
        budget_id: "",
        expense_amount: "",
        status: "PENDING",
        expense_image: null
    })
    const [previewURL, setPreviewURL] = useState(null)
    const [loading, setLoading] = useState(false)

    const { budgetLoading, budgets, error: budgetError } = useSelector(state => state.budget)

    const dispatch = useDispatch()
    const [activeStatus, setActiveStatus] = useState("Pending")
    // On input change 
    const handleChange = (key, value) => {
        setFormData((prev) => (
            {
                ...prev,
                [key]: value
            }
        ))
    }

    // Clear the input field on state change
    useEffect(() => {
        setFormData(
            {
                expense_name: "",
                expense_description: "",
                budget_id: "",
                expense_amount: "",
                status: "PENDING",
                expense_image: null
            }
        )
    }, [isAddExpense])
    // Use effect on file upload or remove
    useEffect(() => {
        if (!formData.expense_image) return
        // IF file exist change that file into the object url to display as the images
        const imageURL = URL.createObjectURL(formData.expense_image)
        setPreviewURL(imageURL)
        return () => URL.revokeObjectURL(imageURL)
    }, [formData.expense_image])
    // Status
    const status = [
        {
            name: "Pending",
            value: "PENDING",
            style: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
        },
        {
            name: "Paid",
            value: "PAID",
            style: "bg-green-100 text-green-700 hover:bg-green-200"
        },
        {
            name: "Reimbursed",
            value: "REIMBRUSHED",
            style: "bg-blue-100 text-blue-700 hover:bg-blue-200"
        },
        {
            name: "Declined",
            value: "DECLINED",
            style: "bg-red-100 text-red-700 hover:bg-red-200"
        },
    ];
    // Get the budget categories on the component load
    useEffect(() => {
        (async () => {
            dispatch(fetchBudget())
        })();
    }, [])
    //    Handle the form submit
    const handleFormSubmit = async () => {

        try {
            const data = new FormData()
            setLoading(true)
            data.append("expense_name", formData.expense_name)
            data.append("expense_description", formData.expense_description)
            data.append("budget_id", formData.budget_id)
            data.append("expense_amount", formData.expense_amount)
            data.append("status", formData.status)

            if (formData.expense_image) {
                data.append("expense_image", formData.expense_image)
            }
            await dispatch(addExpense(data)).unwrap()
            setIsAddExpense(false)
            toast.success("Added successfully")
        } catch (error) {
            toast.error(error);
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <AnimatePresence>
            {
                isAddExpense && (
                    <motion.div
                        onClick={() => setIsAddExpense(false)}
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1
                        }}
                        exit={{
                            opacity: 0
                        }}
                        className='fixed z-40  inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center'>
                        <motion.div
                            onClick={(e) => e.stopPropagation()}
                            initial={{
                                opacity: 0,
                                scale: 0.95,
                                y: 20
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                transition: {
                                    type: "spring",
                                    damping: 40,
                                    stiffness: 950
                                },
                                y: 0
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.95,
                                y: 10
                            }}
                            className='w-md h-3/4 z-50 bg-white  shadow-xs flex flex-col rounded-lg'>
                            <div className='w-full'>
                                <div className='w-full sticky top-0  z-40  rounded-t-lg py-4 px-2 bg-indigo-600 text-white font-semibold'>
                                    <div className='flex w-full justify-between'>
                                        <div className='flex gap-1.5 items-center'>
                                            {/* Icon */}
                                            <div className='bg-slate-100/20 rounded-lg p-2'>
                                                <NotebookPen className='bg-transparent size-8  stroke-1' />
                                            </div>
                                            {/* Add Expense div */}
                                            <div className='flex flex-col '>
                                                <h2 className='text-xl'>Add Expense</h2>
                                                <span className='text-xs font-semibold  text-gray-300'>Add a new transaction</span>
                                            </div>
                                        </div>
                                        {/* Cross Icon */}
                                        <div onClick={() => setIsAddExpense(false)} className='w-12 h-12 flex items-center justify-center transtion-all duration-150 ease-in cursor-pointer hover:bg-gray-100/20 rounded-md group'>
                                            <X className='size-5 transition-all group-hover:text-red-400' />

                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Form div--------------> */}
                            <div className='flex-1 '>
                                <div className='w-full h-full overflow-y-scroll  space-y-3.5 '>

                                    <div className='flex flex-col gap-2 w-11/12 mx-auto '>
                                        <label htmlFor="expense_name" className='text-sm font-semibold'>
                                            Expense Name <span className='transform rotate-45 text-red-600'>{" "}*</span>
                                        </label>
                                        <input
                                            value={formData.expense_name}
                                            name='expense_name'
                                            required={true}
                                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                                            type="text" placeholder='Enter expense name'
                                            className='
                                        w-full p-2 rounded-lg bg-slate-50 text-sm text-gray-400 trasition-all duration-150 
                                        ease-in outline-0 border border-gray-200 focus:border-indigo-400 focus:border-2
                                        '
                                        />

                                    </div>
                                    {/* Description */}
                                    <div className='flex flex-col gap-2 w-11/12 mx-auto '>
                                        <label htmlFor="expense_description" className='text-sm font-semibold'>
                                            Description
                                        </label>
                                        <input
                                            value={formData.expense_description}
                                            name='expense_description'
                                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                                            id='expense_description' type="text" placeholder='Enter expense description'
                                            className='
                                        w-full p-2 rounded-lg bg-slate-50 text-sm text-gray-400 trasition-all duration-150 
                                    ease-in outline-0 border border-gray-200 focus:border-indigo-400 focus:border-2
                                    '
                                        />
                                    </div>
                                    <div className='flex flex-col gap-2 w-11/12 mx-auto '>
                                        <label htmlFor="budget_category" className='text-sm font-semibold'>
                                            Budget category <span className='transform rotate-45 text-red-600'>{" "}*</span>
                                        </label>
                                        {
                                            budgetLoading ? (
                                                <p className='text-sm flex gap-2'>Please wait budget is loading <Loader2 className='animate-spin size-5' /></p>
                                            ) : (
                                                budgetError ? (
                                                    <span>Error occured: {budgetError}</span>
                                                ) : (
                                                    <select
                                                        className='
                                        w-full p-2 rounded-lg bg-slate-50 text-sm text-gray-400 
                                        ease-in outline-0 border border-gray-200 
                                        '
                                                        name='budget_id' onChange={(e) => handleChange(e.target.name, e.target.value)} id="budget_category">
                                                        <option value="">Select category</option>
                                                        {
                                                            budgets.map((i) => (
                                                                <option key={i.id} value={i.id}>{i.budget_name}</option>
                                                            ))
                                                        }
                                                    </select>
                                                )

                                            )
                                        }



                                    </div>
                                    {/* Amount */}
                                    <div className='flex flex-col gap-2 w-11/12 mx-auto '>
                                        <label htmlFor="expense_amt" className='text-sm font-semibold'>
                                            Expense amount <span className='transform rotate-45 text-red-600'>{" "}*</span>
                                        </label>
                                        <input
                                            value={formData.expense_amount}
                                            min={0}
                                            max={100000}
                                            name='expense_amount'
                                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                                            id='expense_amt' type="number" placeholder='Enter expense amount'
                                            className='
                                        w-full p-2 rounded-lg bg-slate-50 text-sm text-gray-400 trasition-all duration-150 
                                        ease-in outline-0 border border-gray-200 focus:border-indigo-400 focus:border-2
                                        '
                                        />
                                    </div>
                                    {/* Status */}
                                    <div className='flex flex-col gap-2 w-11/12 mx-auto '>
                                        <h2 className='text-sm font-semibold'>
                                            Status
                                        </h2>
                                        <div className='w-full flex justify-between'>
                                            {
                                                status.map((i, idx) => {
                                                    const isActive = i.name === activeStatus

                                                    return (
                                                        <div key={idx}
                                                            onClick={() => { handleChange("status", i.value); setActiveStatus(i.name) }}
                                                            className={`
                                                        rounded-lg text-sm font-semibold p-2 px-5 cursor-pointer
                                                        transtion-all duration-200 ease-in
                                                        ${isActive ? 'bg-amber-400 text-white' : `${i.style}`}`}
                                                        >
                                                            <span>
                                                                {i.name}
                                                            </span>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                    {/* Image section */}
                                    <div className='w-full flex flex-col gap-2 px-3.5 mb-4'>
                                        <h2 className='text-sm font-semibold'>Receipt Image</h2>
                                        {
                                            previewURL ? (
                                                <div
                                                    className='w-full h-fit relative group'
                                                >
                                                    {/* On image hover */}
                                                    <div className={`absolute inset-0 z-10 rounded-lg
                                                        transition-all duration-200 ease-in
                                                        bg-black/30 backdrop-blur-xs opacity-0 group-hover:opacity-100 flex items-center justify-center`}>
                                                        <div className='flex gap-2'>
                                                            <label htmlFor='_change_file_receipt' className='
                                                                flex px-4 p-2 rounded-lg text-white  items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-indigo-600
                                                                to-indigo-500 transition-all duration-250 ease-in active:scale-95  
                                                                '>
                                                                <Edit className='size-5 text-white' />
                                                                <span className='font-semibold text-sm'>Change</span>
                                                                <input name='expense_image' id='_change_file_receipt' type="file" hidden onChange={(e) => handleChange(e.target.name, e.target.files[0])} accept='image/png, image/jpg, image/jpeg' />
                                                            </label>
                                                            <button onClick={() => { setPreviewURL(null); handleChange("expense_image", null) }} className='
                                                                flex px-4 p-2 rounded-lg text-white  items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-red-600
                                                                to-red-500 transition-all duration-150 ease-in active:scale-95  
                                                                '>
                                                                <Trash2 className='size-5 text-white' />
                                                                <span className='font-semibold text-sm'>Delete</span>
                                                            </button>
                                                        </div>


                                                    </div>
                                                    <img src={previewURL} alt="_selected_image" className='
                                                w-full h-full transition-all duration-150 ease-in transform hover:scale-105 
                                                cursor-pointer' />
                                                </div>
                                            ) : (
                                                <label htmlFor='_image_receipt' className='w-full h-20 border border-gray-400 border-dashed flex items-center
                                                justify-center cursor-pointer rounded-lg'>

                                                    <Upload className='size-6 text-gray-400' />
                                                    <input name='expense_image' id='_image_receipt' type="file" hidden onChange={(e) => handleChange(e.target.name, e.target.files[0])} accept='image/png, image/jpg, image/jpeg' />


                                                </label>
                                            )
                                        }

                                    </div>
                                </div>

                            </div>
                            {/* Bottom Section */}
                            <div className='w-md h-fit bg-slate-50 flex justify-end border-t px-4 border-t-gray-100'>
                                <div className=' flex gap-2 text-sm font-semibold'>
                                    <button disabled={loading} onClick={() => setIsAddExpense(false)} className='
                                    transition-all hover:bg-slate-300
                                    p-2 my-2 px-4 rounded-lg text-gray-500 bg-slate-200 cursor-pointer'>Cancel</button>

                                    {
                                        !loading ? (
                                            <button onClick={handleFormSubmit} type='submit' disabled={(!formData.expense_amount || !formData.expense_name || !formData.budget_id) || loading} className='group my-2 px-4 p-2 rounded-lg disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-gray-500 bg-green-500 text-white inline-flex items-center  '>
                                                <Check className='size-5  group-disabled:text-gray-500 text-white' />
                                                <span>Save</span>
                                            </button>
                                        ) : (
                                            <button disabled={loading} className='group my-2 px-4 p-2 rounded-lg disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-gray-500 bg-green-500 text-white inline-flex items-center  '>
                                                <Loader2 className='size-5  animate-spin' />
                                                <span>Saving</span>
                                            </button>
                                        )
                                    }

                                </div>

                            </div>
                            {/* ------------___________________------------------- */}
                        </motion.div>


                    </motion.div>
                )

            }



        </AnimatePresence>

    )
}

export default AddExpense
