import React from 'react'
import Header from '../components/Nav/DashboardNav'
import { Outlet } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'

const DashboardLayout = () => {
    return (
        <div className='w-full h-screen flex flex-col'>
            <Header />
            {/* Main Content */}
            <main className='flex-1'>
                <Outlet />
            </main>
        </div>
    )
}

export default DashboardLayout
