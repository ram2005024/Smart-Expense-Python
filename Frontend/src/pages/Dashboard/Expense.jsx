import React from 'react'
import ExpenseHeader from '../../components/Expense/ExpenseHeader'
import TotalSpend from '../../components/Expense/ExpenseCards/TotalSpend'
import Reimbrushed from '../../components/Expense/ExpenseCards/ReimbrushedCard'
import Pending from '../../components/Expense/ExpenseCards/PendingCard'
import Declined from '../../components/Expense/ExpenseCards/DeclineCard'
import ExpenseAnalyse from '../../components/Expense/ExpenseHero/ExpenseAnalyse'
import ExpenseTable from '../../components/Expense/ExpenseHero/ExpenseTable/ExpenseTable'

const Expense = () => {


    return (
        <div className='w-full pt-10 max-sm:pt-5 px-7 flex flex-col gap-3'>

            {/* Header Part */}
            <ExpenseHeader />
            {/* Card parts */}
            <div className='flex max-sm:flex-col gap-3.5 w-full '>
                <TotalSpend />
                <Reimbrushed />
                <Pending />
                <Declined />
            </div>
            {/* Hero part */}
            <div className='w-full flex flex-col  sm:grid sm:grid-cols-12 gap-2.5 mt-10 max-sm:mt-4'>
                <div className='col-span-9 rounded-2xl shadow bg-white mb-4'>
                    <ExpenseTable />
                </div>
                <div className='col-span-3'>
                    <ExpenseAnalyse />
                </div>

            </div>

        </div>
    )
}

export default Expense
