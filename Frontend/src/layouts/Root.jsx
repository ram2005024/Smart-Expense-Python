import React from 'react'
import { Outlet } from 'react-router-dom'

const Root = () => {
    return (
        <div className='min-w-screen'>
            <Outlet />
        </div>
    )
}

export default Root
