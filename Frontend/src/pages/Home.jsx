import React from 'react'
import { Link } from 'react-router-dom'
import { heroIcons } from '../assets/assets'
const Home = () => {
    return (
        <section id="section" class=" h-full w-full">
            <main
                class="flex flex-col md:flex-row items-center max-md:text-center justify-between  pb-16 px-6 h-full sm:px-10 md:px-24 max-w-7xl mx-auto w-full">
                <div class="flex flex-col items-center md:items-start ">
                    <button
                        class="mt-16 mb-6 flex items-center space-x-2 border border-indigo-600 text-indigo-600 text-xs rounded-full px-4 pr-1.5 py-1.5 hover:bg-indigo-50 transition"
                        type="button">
                        <span>
                            Track your expense wisely.
                        </span>
                        <span class="flex items-center justify-center size-6 p-1 rounded-full bg-indigo-600">
                            <svg width="14" height="11" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 6.5h14M9.5 1 15 6.5 9.5 12" stroke="#fff" stroke-width="1.5"
                                    stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </span>
                    </button>
                    <h1 class="text-gray-900 font-semibold text-3xl sm:text-4xl md:text-5xl max-w-xl overflow-y-hidden">
                        Preferred choice of clevers in
                        <span class="text-indigo-600">
                            {" "} tracking expense
                        </span>
                    </h1>
                    <p class="mt-4 text-gray-600 max-w-md text-sm sm:text-base leading-relaxed">
                        AI‑Driven Expense Insights for Seamless Customer Journeys
                    </p>
                    <div class="flex flex-col md:flex-row items-center mt-8 gap-3">

                        <Link to="/dashboard" className="text-indigo-600 bg-indigo-100 px-5 py-2 rounded-full text-sm font-medium hover:bg-indigo-200 transition"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
                <div aria-label="Photos of leaders" class="mt-12 grid grid-cols-2 gap-6 pb-6">
                    <img alt="" class="size-32 rounded-lg hover:scale-105 transition duration-300  shadow-lg object-fill  "
                        src={heroIcons.hero1}
                    />
                    <img alt="" class="size-32 rounded-lg hover:scale-105 transition duration-300  shadow-lg object-fill "
                        src={heroIcons.hero2}
                    />
                    <img alt="" class="size-32 rounded-lg hover:scale-105 transition duration-300  shadow-lg object-fill "
                        src={heroIcons.hero3}
                    />
                    <img alt="" class="size-32 rounded-lg hover:scale-105 transition duration-300  shadow-lg object-fill "
                        src={heroIcons.hero4}
                    />
                </div>
            </main>
        </section>
    )
}

export default Home
