import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFilteredExpenses } from '../../../../store/slices/expenseSlice'
import { Search } from 'lucide-react'

const ExpenseHeader = () => {
    const { expenses, filteredExpenses } = useSelector((state) => state.expense)
    const [activeSection, setActive] = useState("All")
    const [searchText, setSearchText] = useState("")
    const dispatch = useDispatch()
    const statuses = [
        {
            section: "All",
            status: "ALL",
            noOfExepense: expenses?.length
        },
        {
            section: "Paid",
            status: "REIMBRUSHED",
            noOfExepense: expenses?.filter((item) => item.status == "REIMBRUSHED").length
        },
        {
            section: "Pending",
            status: "PENDING",
            noOfExepense: expenses?.filter((item) => item.status == "PENDING").length
        },
        {
            section: "Declined",
            status: "DECLINED",
            noOfExepense: expenses?.filter((item) => item.status == "DECLINED").length
        },
    ]
    useEffect(() => {
        const handleSearch = () => {
            const filtered = expenses?.filter((item) => item.expense_category.toLowerCase().includes(searchText.toLowerCase()) || item.expense_description.toLowerCase().includes(searchText.toLowerCase()) || item.expense_name.toLowerCase().includes(searchText.toLowerCase()))
            dispatch(setFilteredExpenses(filtered))
            console.log("Hello:".expense)
        }
        handleSearch()
    }, [searchText])
    console.log("Filtered: ", filteredExpenses)
    return (
        <div className='w-full p-3 border border-b border-gray-100 flex justify-between'>
            <div className='flex gap-1.5 p-1 rounded-lg bg-slate-50'>
                {
                    statuses.map((item, index) => (
                        <button onClick={() => {
                            setActive(item.section)
                            dispatch(setFilteredExpenses(item.status !== "ALL" ? expenses.filter((i) => i.status == item.status) : expenses))
                        }}
                            className={`text-xs  md:px-4 py-1 font-bold transition-colors duration-150 cursor-pointer ease-in  ${item.section == activeSection ? 'bg-white rounded-lg shadow-sm  text-gray-700' : 'text-gray-400'} inline-flex items-center gap-1.5`} key={index}>
                            <span className='text-[12px] ' >{item.section}</span>
                            <div className='bg-indigo-50 rounded-lg p-1 text-[10px] font-bold text-gray-400 max-md:hidden'>
                                <span>{item.noOfExepense}</span>
                            </div>
                        </button>
                    ))
                }
            </div>
            {/* Search section */}
            <div className='w-sm max-md:w-fit relative rounded-lg p-2'>
                <Search className='stroke-2 text-gray-400 absolute top-4.5 left-4 size-4' />
                <input value={searchText} onChange={(e) => setSearchText(e.target.value)} type="text" className='w-full p-2 bg-slate-50 pl-8 text-sm text-gray-400 font-semibold rounded-lg outline-none transition-all duration-200 focus:ring focus:ring-slate-200' placeholder='Search for expenses...' />
            </div>

        </div>
    )
}

export default ExpenseHeader
