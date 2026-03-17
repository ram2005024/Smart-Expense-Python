import React from 'react'
import { getColorCode } from '../../../../utils/getProgressColor'
import { capitalize } from '../../../../utils/capitalize'

const ProgressBar = ({ data }) => {

    return (
        <div className='flex flex-col gap-0.5 '>
            <div className='flex w-full justify-between'>
                <span className='font-medium text-[12px] text-gray-600'>{data && capitalize(data.budget_category.toLowerCase())}</span>
                <div className='text-[12px] font-semibold'>
                    <span style={{
                        color: getColorCode(data.percent)
                    }}>Rs. {data.spent}</span>
                    <span className='text-gray-400'>/{data.total}</span>
                </div>
            </div>
            {/* Bar */}
            <div className='w-full bg-gray-200 rounded-full h-2 overflow-hidden'>
                <div
                    style={{
                        backgroundColor: `${getColorCode(data.percent)}`,
                        width: `${data.percent}%`
                    }}
                    className='rounded-full h-full transition-all duration-150 ease-in'
                ></div>
            </div>
        </div>
    )
}

export default ProgressBar
