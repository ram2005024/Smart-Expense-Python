import { ChevronLeft, ChevronRightIcon } from 'lucide-react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentPage } from '../../../../store/slices/expenseSlice'

const Pagination = () => {
    const { totalPages, currentPage } = useSelector(state => state.expense)
    const pages = []
    const dispatch = useDispatch()
    const getPageNo = () => {
        if (currentPage > 3) pages.push(1)
        if (currentPage > 4) pages.push("...");
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
            if (i > 0 && i <= totalPages) pages.push(i);
        }
        if (currentPage < totalPages - 3) pages.push("...")
        if (currentPage < totalPages - 2) pages.push(totalPages)

        return pages
    }
    return (
        <div className='flex gap-1 pt-3'>
            {/* Previous button */}
            <button onClick={() => dispatch(setCurrentPage(currentPage - 1))} disabled={currentPage === 1} className={`p-1 inline-flex px-4 rounded-md cursor-pointer bg-slate-50 transition-all ease-in duration-200  font-semibold text-sm ${currentPage !== 1 ? 'hover:bg-slate-100' : 'hover:cursor-not-allowed'} `}>
                <ChevronLeft className='text-gray-400 size-4' />
            </button>
            {getPageNo().map((i, index) => {
                return (
                    i === "..." ? <span key={index}>{i}</span> : <button onClick={() => dispatch(setCurrentPage(i))} disabled={i === "..."} key={index} className={`p-1 px-4 rounded-md cursor-pointer transition-all ease-in duration-200  font-semibold text-sm ${currentPage === i ? 'bg-indigo-500 hover:bg-indigo-600 text-white' : 'bg-slate-50 hover:bg-slate-100 border border-gray-100 text-gray-400'} `}>
                        {i}
                    </button>
                )
            })}
            {/* Previous button */}
            <button onClick={() => dispatch(setCurrentPage(currentPage + 1))} disabled={currentPage === totalPages} className={`p-1 inline-flex px-4 rounded-md cursor-pointer bg-slate-50 transition-all ease-in duration-200  font-semibold text-sm ${currentPage !== totalPages ? 'hover:bg-slate-100' : 'hover:cursor-not-allowed'} `}>
                <ChevronRightIcon className='text-gray-400 size-4' />
            </button>
        </div>
    )
}

export default Pagination
