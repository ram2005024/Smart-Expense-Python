import React from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const Main = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    return (
        <div className='w-full min-h-screen flex flex-col'>
            {/* Header section for nav */}
            <header>
                <nav class="h-17.5 relative w-full px-6 md:px-16 overflow-y-clip lg:px-24 xl:px-32 flex items-center border-b border-b-gray-200 bg-gray-50  justify-between z-20  text-gray-700 shadow-[0px_4px_25px_0px_#0000000D] transition-all">
                    <Link to="/" class="text-indigo-600">
                        <img src="/expense.png" alt="_logo" className='size-56' />
                    </Link>

                    <ul class="md:flex hidden items-center gap-10">
                        <li><a class="hover:text-gray-500/80 transition" href="#">Home</a></li>
                        <li><a class="hover:text-gray-500/80 transition" href="#">Services</a></li>
                        <li><a class="hover:text-gray-500/80 transition" href="#">Portfolio</a></li>
                        <li><a class="hover:text-gray-500/80 transition" href="#">Pricing</a></li>
                    </ul>

                    {user ? (

                        <button onClick={() => {
                            logout();
                            navigate("/")
                        }} type="button" class="bg-red-500 max-md:hidden text-white border border-gray-300  text-sm hover:bg-red-700 cursor-pointer active:scale-95 transition-all p-2 px-4 rounded-md">
                            Logout
                        </button>
                    ) : (
                        <button onClick={() => navigate("/login")} type="button" class="bg-emerald-500 max-md:hidden text-white border border-gray-300  text-sm hover:bg-emerald-600 active:scale-95 transition-all  p-2 px-4 rounded-md">
                            Login
                        </button>
                    )}

                    <button aria-label="menu-btn" type="button" class="menu-btn inline-block md:hidden active:scale-90 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="#000">
                            <path d="M 3 7 A 1.0001 1.0001 0 1 0 3 9 L 27 9 A 1.0001 1.0001 0 1 0 27 7 L 3 7 z M 3 14 A 1.0001 1.0001 0 1 0 3 16 L 27 16 A 1.0001 1.0001 0 1 0 27 14 L 3 14 z M 3 21 A 1.0001 1.0001 0 1 0 3 23 L 27 23 A 1.0001 1.0001 0 1 0 27 21 L 3 21 z"></path>
                        </svg>
                    </button>

                    <div class="mobile-menu absolute top-[70px] left-0 w-full bg-white p-6 hidden md:hidden">
                        <ul class="flex flex-col space-y-4 text-lg">
                            <li><a href="#" class="text-sm">Home</a></li>
                            <li><a href="#" class="text-sm">Services</a></li>
                            <li><a href="#" class="text-sm">Portfolio</a></li>
                            <li><a href="#" class="text-sm">Pricing</a></li>
                        </ul>

                        <button type="button" class="bg-white text-gray-600 border border-gray-300 mt-6 text-sm hover:bg-gray-50 active:scale-95 transition-all w-40 h-11 rounded-full">
                            Get started
                        </button>
                    </div>
                </nav>
            </header>
            {/* Main content */}
            <main className='flex-1 flex flex-col '>
                <Outlet />
            </main>
            {/* FOOTER SECTION */}
            <footer className="flex flex-col items-center justify-around w-full h-fit py-6 text-sm   text-gray-800/70 border-t border-gray-100">
                <a>
                    <img src="/expense.png" alt="logo" className='size-24' />
                </a>
                <p className="mt-4 text-center">Copyright © 2026 <a href="https://prebuiltui.com">Smart Expense</a>. All rights reservered.</p>
                <div className="flex items-center gap-4 mt-6">
                    <a href="#" className="font-medium text-gray-800 hover:text-black transition-all">
                        Brand Guidelines
                    </a>
                    <div className="h-4 w-px bg-black/20"></div>
                    <a href="#" className="font-medium text-gray-800 hover:text-black transition-all">
                        Trademark Policy
                    </a>
                </div>
            </footer>
        </div>
    )
}

export default Main
