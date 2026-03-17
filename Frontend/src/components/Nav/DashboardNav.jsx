import React, { useState } from 'react'
import useAuth from '../../hooks/useAuth'
import Greeting from '../../utils/Greeting'
import { Bell, ChevronDown, Link, Search, Settings, Sparkle, Sparkles, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const DashboardNav = () => {
    const [searchText, setSearchText] = useState("")
    const { user } = useAuth()
    const navigate = useNavigate()
    return (
        <nav className='w-full px-8 flex items-center justify-between border-b border-b-gray-100 shadow-sm'>
            <div className='flex gap-3'>
                {/* logo */}
                <div className='h-16 overflow-y-clip'>


                    <img src="/expense.png" alt="_logo" onClick={() => navigate("/")} className='size-16 object-fill cursor-pointer' />

                </div>
                <div className='px-3  rounded-full bg-zinc-400/10 flex gap-2 h-fit p-1.5 self-center text-sm font-medium max-md:hidden'>
                    <span>👋</span>
                    {<Greeting />}
                    <span>{user?.username}</span>
                </div>
            </div>

            {/* Mid Part */}
            <div className='max-md:hidden  relative'>
                <Search className='size-4 text-gray-400 absolute left-5 top-3' />
                {
                    searchText &&
                    (

                        <X onClick={() => setSearchText("")} className='text-gray-400 size-4 cursor-pointer absolute right-4 top-3' />
                    )
                }
                <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder='Search for expense,budgets' className='p-2 text-gray-600 text-sm w-sm pl-12 border border-gray-100 outline-none rounded-full' />
            </div>

            {/* End part */}
            <div className='flex gap-2.5'>
                <div className='flex gap-1.5 max-sm:h-fit max-sm:truncate max-sm:text-xs p-1 px-3 text-indigo-500 bg-gray-50 text-sm  rounded-2xl items-center font-bold cursor-pointer transition-all duration-200 hover:bg-gray-100'>
                    <Sparkles className='size-4' />
                    <span>AI Insights</span>
                </div>
                <div className='h-xl w-0.5 bg-gray-300/40'></div>
                <div className='p-2.5 bg-gray-50 rounded-lg relative flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-gray-100'>

                    <Bell className='size-5 text-gray-500' />
                    <div className='flex items-center justify-center bg-red-400 rounded-full size-4 z-10 absolute top-0 right-0 '>
                        <span className='text-white font-bold text-xs'>3</span>

                    </div>
                </div>
                <div className='p-2.5 bg-gray-50 rounded-lg  flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-gray-100'>

                    <Settings className='size-5 text-gray-500' />

                </div>
                <div className='h-xl w-0.5 bg-gray-300/40'></div>
                <div className='p-2 rounded-2xl bg-gray-50 flex gap-2 items-center cursor-pointer transition-all duration-200 hover:bg-gray-100'>
                    <div className='h-full w-8  bg-blue-500 text-sm text-white flex item-center justify-center rounded-lg'>
                        <span className='inline-flex items-center text-xl font-semibold'>{user?.username?.slice(0, 1).toUpperCase()}</span>
                    </div>
                    <div className='flex flex-col  '>
                        <span className='text-xs font-semibold text-gray-900'>{user?.username}</span>
                        <span className='text-[10px] text-gray-500'>Finance Manager</span>
                    </div>
                    <ChevronDown className='text-gray-400 size-4 self-end' />
                </div>
            </div>

        </nav>
    )
}

export default DashboardNav
