import React from 'react'
import SideBar from '../components/Dashboard/SideBar'
import { Outlet } from 'react-router-dom'
const Dashboard = () => {
    return (
        <div className='w-full h-full grid grid-cols-12 '>
            {/* SideBar Section */}
            <SideBar />

            <div className='col-span-10 h-full overflow-y-scroll bg-slate-100'>
                <Outlet />
            </div>
        </div>
    )
}

export default Dashboard
