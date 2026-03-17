import { BadgeDollarSignIcon, Home, NotebookText, Sparkles } from 'lucide-react'
import React from 'react'
import { Navigate, NavLink } from 'react-router-dom'

const SideBar = () => {
    const links = [
        {
            link_name: "Dashboard",
            link_icon: Home,
            link_redirect: "/dashboard"
        },
        {
            link_name: "Expense",
            link_icon: NotebookText,
            link_redirect: "/dashboard/expense"
        },
        {
            link_name: "Budget",
            link_icon: BadgeDollarSignIcon,
            link_redirect: "/dashboard/budget"
        },
        {
            link_name: "AI Insights",
            link_icon: Sparkles,
            link_redirect: "/dashboard/ai_insights"
        },

    ]
    return (
        <div className='col-span-2 h-full '>
            <div className='w-full h-full   flex flex-col gap-2 border-r border-r-gray-200'>

                {
                    links.map((items, index) => (

                        <NavLink to={items.link_redirect} key={index} end={items.link_redirect === "/dashboard"}
                            className={({ isActive }) => isActive ? `bg-gray-100 relative rounded-xs transition-all duration-300  ` : `transition-all hover:bg-gray-100`}
                        >
                            {({ isActive }) => (
                                <div className='flex gap-2 pl-3 items-center p-2 text-gray-700 mt-2'>

                                    <items.link_icon size={18} />
                                    <span className='max-sm:hidden'>{items.link_name}</span>
                                    {isActive && (
                                        <span className='h-full w-1.5 bg-green-400 rounded-md absolute top-0 right-0 '></span>
                                    )}
                                </div>

                            )}

                        </NavLink>


                    ))
                }
            </div>
        </div>
    )
}

export default SideBar
